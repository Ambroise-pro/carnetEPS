// Cas 9 et 10 : démarrage, navigation, recherche, versions et fonctionnement hors ligne.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {open, go, settle, ROOT} from '../helpers.mjs';

const appVersion = async () => Number((await readFile(path.join(ROOT, 'app.js'), 'utf8')).match(/APP_VERSION=(\d+)/)[1]);
const swSource = () => readFile(path.join(ROOT, 'sw.js'), 'utf8');

test('APP_VERSION (app.js) et VERSION (sw.js) sont identiques', async () => {
  const sw = await swSource();
  assert.equal(Number(sw.match(/VERSION=(\d+)/)[1]), await appVersion());
});

test('tous les fichiers préchargés par le service worker existent', async () => {
  const {page, url, close} = await open({seed: false});
  try {
    const shell = JSON.parse((await swSource()).match(/const shell=(\[[^\]]*\])/)[1].replace(/'/g, '"'));
    for (const f of shell) assert.equal((await page.request.get(new URL(f, url).href)).status(), 200, f);
  } finally { await close(); }
});

test('chaque page s’affiche sans erreur et la version est visible', async () => {
  const {page, errors, close} = await open();
  try {
    assert.match(await page.textContent('.version'), new RegExp('Version ' + await appVersion()));
    const pages = await page.evaluate(() => [...document.querySelectorAll('nav a[href^="#"]')].map(a => a.getAttribute('href').slice(1)));
    assert.ok(pages.length >= 15, 'menu incomplet : ' + pages.join(','));
    for (const p of [...pages, 'student=st1', 'session=s2']) {
      await go(page, p);
      assert.ok((await page.locator('#view').innerText()).trim().length > 0, 'page vide : ' + p);
    }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('la recherche retrouve un élève par son nom', async () => {
  const {page, close} = await open();
  try {
    await page.fill('.search input, input[type=search]', 'Fictif');
    await page.waitForTimeout(300);
    assert.match(await page.locator('#view').innerText(), /Alice/);
  } finally { await close(); }
});

test('hors ligne : l’application se relance depuis le cache', async () => {
  const {page, context, close} = await open({serviceWorkers: 'allow'});
  try {
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload(); await settle(page, 800); // la page est désormais contrôlée par le service worker
    await context.setOffline(true);
    await page.reload();
    await page.waitForSelector('.version', {state: 'attached', timeout: 5000});
    assert.match(await page.locator('#view').innerText(), /\S/);
    await context.setOffline(false);
  } finally { await close(); }
});

test('tablette portrait et téléphone : aucune page ne déborde en largeur', async () => {
  for (const viewport of [{width: 820, height: 1180}, {width: 390, height: 844}]) {
    const {page, close} = await open({viewport});
    try {
      for (const p of ['home', 'calendar', 'attendance', 'students', 'student=st1', 'absences', 'averages', 'comments', 'settings', 'backup']) {
        await go(page, p);
        const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        assert.ok(over <= 1, `${p} déborde de ${over}px en ${viewport.width}px`);
      }
    } finally { await close(); }
  }
});
