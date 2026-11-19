// Cas 10 et lot 0.3 : applications associées disponibles hors connexion après une première visite en ligne ;
// mise à jour de version sans écran blanc, sans perte de données et sans retélécharger les applications.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {open, go, settle, readStores, ROOT} from '../helpers.mjs';
import {build} from '../../tools/offline-list.mjs';

// Attend que le service worker ait mis en cache tous les fichiers de offline.json.
async function offlineReady(page, timeout = 90000) {
  const end = Date.now() + timeout;
  for (;;) {
    const r = await page.evaluate(async () => {
      const c = await caches.open('eps-files'), base = new URL('./', location.href).href;
      const list = await (await c.match(base + 'offline.json'))?.json(), state = await (await c.match(base + 'offline-state.json'))?.json() || {};
      return list ? {total: list.files.length, ready: list.files.filter(([f, h]) => state[f] === h).length} : {total: -1, ready: 0};
    });
    if (r.total > 0 && r.ready === r.total) return r;
    if (Date.now() > end) throw Error('cache hors ligne incomplet : ' + JSON.stringify(r));
    await page.waitForTimeout(1000);
  }
}
async function controlled(page) {
  await page.evaluate(() => navigator.serviceWorker.ready);
  if (!(await page.evaluate(() => !!navigator.serviceWorker.controller))) { await page.reload(); await settle(page, 800); }
}

test('offline.json est à jour (node tools/offline-list.mjs)', async () => {
  const file = JSON.parse(await readFile(path.join(ROOT, 'offline.json'), 'utf8'));
  assert.deepEqual(file, await build(), 'relancez « node tools/offline-list.mjs » après avoir modifié modules/ ou vendor/');
  const sw = await readFile(path.join(ROOT, 'sw.js'), 'utf8');
  assert.match(sw, /FILES='eps-files'/);
});

test('après une première visite en ligne, les applications s’ouvrent sans connexion', async () => {
  const {page, context, errors, close} = await open({serviceWorkers: 'allow'});
  try {
    await controlled(page);
    const r = await offlineReady(page);
    assert.ok(r.total > 100);
    await go(page, 'apps'); await page.waitForTimeout(800);
    assert.match(await page.locator('.offline-status').innerText(), /disponibles hors connexion/);
    await context.setOffline(true);
    await page.reload(); await page.waitForSelector('.version', {state: 'attached'}); await settle(page, 1500);
    for (const [id, text] of [['evaluations', /\S/], ['coeval', /\S/], ['conquete-laser', /LASER RUN|Laser Run/i], ['demi-fond', /\S/]]) {
      await go(page, 'module=' + id); await page.waitForTimeout(2500);
      const frame = page.frames().find(f => f.url().includes('modules/' + id + '/'));
      assert.ok(frame, id + ' : cadre chargé');
      assert.match(await frame.locator('body').innerText(), text, id + ' : interface affichée hors connexion');
    }
    await context.setOffline(false);
    assert.deepEqual(errors.filter(e => !/fetch|network|Failed to load|NetworkError|firebase/i.test(e)), []);
  } finally { await close(); }
});

test('mise à jour de version : pas d’écran blanc, données gardées, applications non retéléchargées', async () => {
  const {page, context, errors, close, overrides} = await open({serviceWorkers: 'allow'});
  try {
    await controlled(page);
    await offlineReady(page);
    const before = await readStores(page);
    // Nouvelle version publiée : sw.js et app.js changent.
    overrides['/sw.js'] = s => s.replace(/VERSION=\d+/, 'VERSION=9999');
    overrides['/app.js'] = s => s.replace(/APP_VERSION=\d+/, 'APP_VERSION=9999');
    const fetched = [];
    page.on('request', r => { if (/\/(modules|vendor)\//.test(r.url())) fetched.push(r.url()); });
    context.on('request', r => { if (/\/(modules|vendor)\//.test(r.url())) fetched.push(r.url()); });
    await page.reload(); await page.waitForSelector('.version', {state: 'attached'});
    assert.match(await page.textContent('.version'), /9999/, 'nouvelle version affichée dès le rechargement');
    for (let i = 0; i < 30; i++) { // le nouveau service worker s'installe puis s'active et supprime l'ancien cache
      const k = await page.evaluate(() => caches.keys());
      if (k.includes('eps-v9999') && !k.some(x => /^eps-v\d+$/.test(x) && x !== 'eps-v9999')) break;
      await page.waitForTimeout(1000);
    }
    await settle(page, 2500);
    const keys = await page.evaluate(() => caches.keys());
    assert.ok(keys.includes('eps-files'), 'cache des applications conservé');
    assert.ok(!keys.some(k => /^eps-v\d+$/.test(k) && k !== 'eps-v9999'), 'ancien cache de version supprimé : ' + keys.join(', '));
    // Seuls sont relus : les liaisons et manifestes (lus à chaque démarrage) et pdf.js (socle de l'application, recopié avec la nouvelle version).
    assert.deepEqual(fetched.filter(u => !/eps-adapter\.js|offline\.json|modules\.json|eps-module\.json|vendor\/pdfjs\//.test(u)), [], 'aucun fichier d’application retéléchargé');
    assert.deepEqual(await readStores(page), before, 'données inchangées');
    await context.setOffline(true);
    await page.reload(); await page.waitForSelector('.version', {state: 'attached'});
    assert.match(await page.textContent('.version'), /9999/);
    assert.ok((await page.locator('#view').innerText()).trim().length > 0, 'pas d’écran blanc hors connexion');
    await context.setOffline(false);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
