// Application associée Conquête (modules/conquete-laser) : ouverture depuis EPS Manager, classes transmises,
// résultats repris dans la séance sans doublon. Le serveur de jeu en ligne n'est pas contacté (requêtes externes bloquées).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {open, go, readStores, settle} from '../helpers.mjs';

test('Conquête : ouverte depuis EPS Manager, reçoit les classes et renvoie un résultat sans doublon', async () => {
  const {page, errors, close} = await open();
  try {
    await page.context().route(u => !u.href.startsWith('http://127.0.0.1'), r => r.abort());
    await go(page, 'module=conquete-laser');
    await page.waitForTimeout(2500);
    const frame = page.frames().find(f => f.url().includes('modules/conquete-laser/'));
    assert.ok(frame, 'application chargée dans EPS Manager');
    assert.ok((await frame.locator('body').innerText()).trim().length > 0, 'interface affichée');
    const ctx = await frame.evaluate(() => ({ok: window.EPSManager.available(), classes: window.EPSManager.classes().map(c => c.name + ':' + c.students.length)}));
    assert.equal(ctx.ok, true);
    assert.deepEqual(ctx.classes.sort(), ['3e Test:3', '6e Test:7']);
    const send = label => frame.evaluate(l => window.EPSManager.result({key: 'lrc:TEST:perf:st1', studentId: 'st1', label: 'Conquête · performance', value: l, unit: '', date: '2026-11-19'}), label);
    assert.equal(await send('4 passages'), true);
    await go(page, 'home'); await settle(page, 1500);              // fermeture : EPS Manager reprend les envois
    let rows = (await readStores(page)).results.filter(r => r.student === 'st1' && /Conquête/.test(r.label));
    assert.equal(rows.length, 1);
    assert.equal(rows[0].value, '4 passages');
    assert.equal(rows[0].sessionId, 's3', 'rangé dans la séance du jour de la classe');
    await go(page, 'module=conquete-laser'); await page.waitForTimeout(2000);
    const frame2 = page.frames().find(f => f.url().includes('modules/conquete-laser/'));
    await frame2.evaluate(() => window.EPSManager.result({key: 'lrc:TEST:perf:st1', studentId: 'st1', label: 'Conquête · performance', value: '5 passages', unit: '', date: '2026-11-19'}));
    await go(page, 'home'); await settle(page, 1500);
    rows = (await readStores(page)).results.filter(r => r.student === 'st1' && /Conquête/.test(r.label));
    assert.deepEqual(rows.map(r => r.value), ['5 passages'], 'même clé : mise à jour, pas de doublon');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
