// Application associée Poules tournantes (branche main du dépôt, intégration EPS Manager propre à l'application) :
// poule créée depuis une classe d'EPS Manager, résultats saisis à la main ; à la fin de la poule, classement, points et
// goal-average de chaque élève et résumé de la poule arrivent dans la séance, sans note ni doublon.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {open, go, readStores, settle} from '../helpers.mjs';

const frameOf = page => page.frames().find(f => f.url().includes('modules/poules-tournantes/'));

async function playAllMatches(page, f) {
  for (let i = 0; i < 60; i++) {
    const next = f.locator('button[data-action="next-match"]');
    if (await next.count() && await next.first().isVisible()) { await next.first().click(); await page.waitForTimeout(150); continue; }
    const score = f.locator('button[data-action="score"]');
    if (!(await score.count())) return;
    await score.first().click(); await page.waitForTimeout(350);
    await f.fill('#modal-score-a', String(15 + (i % 10))); await f.fill('#modal-score-b', '20');
    await f.locator('#modal-confirm-button').click(); await page.waitForTimeout(250);
  }
  throw Error('matchs non terminés');
}

test('Poules tournantes : poule créée depuis la classe, résultats envoyés à la fin de la poule, sans note ni doublon', async () => {
  const {page, errors, close} = await open();
  try {
    await go(page, 'module=poules-tournantes'); await page.waitForTimeout(2000);
    const f = frameOf(page);
    assert.ok(f, 'application chargée');
    await f.locator('#role-teacher-button').click(); await page.waitForTimeout(300);
    // Ouverte depuis la page Applications (sans séance) : aucune classe présélectionnée, on choisit la classe.
    await f.locator('#teacher-pool-eps-class-select').selectOption('c1'); await page.waitForTimeout(200);
    assert.equal(await f.locator('#teacher-pool-eps-roster input[type=checkbox]').count(), 7);
    assert.equal(await f.evaluate(() => window.__xss), undefined, 'nom piégé non exécuté');
    await f.fill('#teacher-pool-name', 'Poule 1');
    for (const id of ['st1', 'st2', 'st3', 'st4', 'st5', 'st6']) await f.locator(`#teacher-pool-eps-roster input[value="${id}"]`).check();
    await f.locator('#teacher-add-pool-button').click(); await page.waitForTimeout(300);
    assert.equal(await f.locator('#teacher-pools-count').innerText(), '1');
    await f.locator('[data-teacher-action="manual-results"]').first().click(); await page.waitForTimeout(400);
    await playAllMatches(page, f);
    await go(page, 'home'); await settle(page, 1500);
    let db = await readStores(page);
    const mine = () => db.results.filter(r => r.student && /^Poules tournantes · /.test(r.label));
    assert.equal(mine().length, 18, '3 résultats (classement, points, goal-average) × 6 élèves');
    assert.deepEqual([...new Set(mine().map(r => r.student))].sort(), ['st1', 'st2', 'st3', 'st4', 'st5', 'st6']);
    assert.ok(mine().every(r => r.sessionId === 's3'), 'rangés dans la séance du jour de la classe');
    assert.ok(mine().filter(r => /Classement/.test(r.label)).every(r => /^\de\/6$/.test(r.value)));
    assert.equal(db.grades.length, 5, 'aucune note ajoutée');
    assert.ok(db.results.some(r => !r.student && /Classement/.test(r.value || '')), 'résumé de la poule dans la séance');
    // Nouvelle synchronisation (réouverture) : aucun doublon
    await go(page, 'module=poules-tournantes'); await page.waitForTimeout(1500);
    await go(page, 'home'); await settle(page, 1500);
    db = await readStores(page);
    assert.equal(mine().length, 18, 'pas de doublon');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('Poules tournantes hors d’EPS Manager : pas de choix de classe, saisie libre des noms', async () => {
  const {page, errors, close} = await open({seed: false});
  try {
    await page.goto(new URL('modules/poules-tournantes/index.html', page.url()).href); await page.waitForTimeout(600);
    await page.locator('#role-teacher-button').click(); await page.waitForTimeout(300);
    assert.ok(await page.locator('#teacher-pool-eps-class-picker').isHidden());
    assert.equal(await page.locator('#teacher-pool-names-container input').count(), 6);
    assert.equal(await page.evaluate(() => typeof Html5Qrcode + typeof qrcode), 'functionfunction', 'bibliothèques QR locales chargées');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
