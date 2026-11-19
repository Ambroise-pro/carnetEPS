// Application associée Poules tournantes : joueurs cochés dans la classe, classement par élève et résumé de poule
// envoyés dans la séance (et rien d'autre), sans doublon ; application inchangée hors d'EPS Manager.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {open, go, readStores, settle, startServer} from '../helpers.mjs';

const frameOf = page => page.frames().find(f => f.url().includes('modules/poules-tournantes/'));

test('Poules tournantes : joueurs cochés, classement et résumé repris dans la séance, sans note ni doublon', async () => {
  const {page, errors, close} = await open();
  try {
    await go(page, 'module=poules-tournantes'); await page.waitForTimeout(2000);
    let f = frameOf(page);
    assert.ok(f, 'application chargée');
    assert.equal(await f.locator('#eps-panel [data-eps-student]').count(), 7, 'élèves de la classe de la séance (6e Test)');
    assert.equal(await f.evaluate(() => window.__xss), undefined, 'nom piégé non exécuté');
    for (const id of ['st1', 'st2', 'st3', 'st4', 'st5', 'st6']) await f.locator(`[data-eps-student="${id}"]`).check();
    assert.match(await f.locator('#eps-count').innerText(), /6 coché/);
    const names = await f.locator('#player-names-container input').evaluateAll(l => l.map(i => i.value));
    assert.deepEqual([...names].sort(), ['Alice', 'Bruno', 'Chloé', 'David', 'Emma', 'Félix'], 'prénoms recopiés (ordre alphabétique des noms de famille)');
    await f.locator('#start-button').click(); await page.waitForTimeout(300);
    // Premier match : 25 – 20
    await f.locator('button[data-action="score"]').first().click(); await page.waitForTimeout(400);
    await f.fill('#modal-score-a', '25'); await f.fill('#modal-score-b', '20');
    await f.locator('#modal-confirm-button').click(); await page.waitForTimeout(300);
    await go(page, 'home'); await settle(page, 1500);
    let db = await readStores(page);
    let rows = db.results.filter(r => /Poules tournantes · Poule 1/.test(r.label));
    assert.equal(rows.length, 6, 'un résultat par joueur');
    assert.ok(rows.every(r => r.sessionId === 's3'), 'rangés dans la séance du jour de la classe');
    assert.ok(rows.every(r => /^(1er|\de) \/ 6 · \d+ pts · [+-]?\d+ · \d+ match/.test(r.value)), rows.map(r => r.value).join(' | '));
    assert.equal(db.grades.length, 5, 'aucune note ajoutée');
    const summary = db.results.find(r => !r.student && /Poule 1/.test(r.value || ''));
    assert.ok(summary && /1\. .+ \d+ pts/.test(summary.value), 'résumé de la poule dans la séance');
    // Deuxième match, puis nouvelle synchronisation : mise à jour sans doublon
    await go(page, 'module=poules-tournantes'); await page.waitForTimeout(2000);
    f = frameOf(page);
    await f.locator('#resume-continue-button').click().catch(() => {});
    await page.waitForTimeout(300);
    const scoreBtn = f.locator('button[data-action="score"]').first();
    if (await scoreBtn.count()) {
      await scoreBtn.click(); await page.waitForTimeout(400);
      await f.fill('#modal-score-a', '18'); await f.fill('#modal-score-b', '25');
      await f.locator('#modal-confirm-button').click(); await page.waitForTimeout(300);
    }
    await go(page, 'home'); await settle(page, 1500);
    db = await readStores(page);
    rows = db.results.filter(r => /Poules tournantes · Poule 1/.test(r.label));
    assert.equal(rows.length, 6, 'toujours un seul résultat par joueur');
    assert.ok(rows.some(r => / 2 matchs$/.test(r.value)), 'résultats mis à jour après le 2e match : ' + rows.map(r => r.value).join(' | '));
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('Poules tournantes hors d’EPS Manager : saisie libre, aucun panneau EPS', async () => {
  const {page, errors, close} = await open({seed: false});
  try {
    await page.goto(new URL('modules/poules-tournantes/index.html', page.url()).href); await page.waitForTimeout(600);
    assert.equal(await page.locator('#eps-panel').count(), 0);
    assert.equal(await page.locator('#player-names-container input').count(), 6);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
