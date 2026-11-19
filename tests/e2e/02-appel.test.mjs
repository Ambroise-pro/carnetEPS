// Cas 3 et 4 : appel (présence par défaut, mentions, anciens formats, correction) ; inaptitude ≠ absence.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {open, go, readStores, closeDialogs} from '../helpers.mjs';

test('anciens formats d’appel : migration et lecture', async () => {
  const {page, errors, close} = await open();
  try {
    const att = Object.fromEntries((await readStores(page)).attendance.map(a => [a.id, a]));
    assert.equal(att['s2/st2'].status, 'Retard', '« En retard » migré en « Retard »');
    assert.equal(att['s2/st5'], undefined, '« Présent » explicite supprimé (présent par défaut)');
    assert.equal(att['s1/st2'].status, 'Certificat médical', 'ancien libellé conservé tel quel en base');
    // Fiche élève : l'ancien « Certificat médical » est affiché « Inaptitude »
    await go(page, 'student=st2');
    const mentions = await page.locator('.mentions').innerText();
    assert.match(mentions, /Inaptitude/);
    assert.doesNotMatch(mentions, /Certificat médical/);
    assert.match(mentions, /Retard/);
    // Présence + mentions cumulées
    await go(page, 'student=st3');
    assert.match(await page.locator('.mentions').innerText(), /Retard · Oubli de tenue · Mot des parents/);
    // Ancien format « une seule mention » : l'élève reste présent
    await go(page, 'student=st8');
    assert.match(await page.locator('.mentions').innerText(), /Oubli de tenue/);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('faire l’appel : présent par défaut, présence + mentions, correction', async () => {
  const {page, errors, close} = await open();
  try {
    await go(page, 'attendance');
    await page.locator('.quick-call button, button', {hasText: '6e Test'}).first().click();
    await page.waitForTimeout(500); await closeDialogs(page);
    const card = () => page.locator('button.pupil', {hasText: 'David'});
    assert.match(await card().getAttribute('aria-label'), /: Présent$/);
    await card().click();
    const d = page.locator('dialog[open]');
    await d.locator('button.status-btn', {hasText: 'Absent'}).click(); await page.waitForTimeout(200);
    await d.locator('button.status-btn', {hasText: 'Oubli de tenue'}).click(); await page.waitForTimeout(200);
    await d.locator('button.status-btn', {hasText: 'Mot des parents'}).click(); await page.waitForTimeout(200);
    await d.locator('button', {hasText: 'Terminé'}).click(); await page.waitForTimeout(300);
    assert.match(await card().getAttribute('aria-label'), /Absent, Oubli de tenue, Mot des parents/);
    let rec = (await readStores(page)).attendance.find(a => a.id === 's3/st4');
    assert.deepEqual({status: rec.status, extras: rec.extras}, {status: 'Absent', extras: 'Oubli de tenue,Mot des parents'});
    assert.ok(Object.values(rec).every(v => typeof v === 'string'), 'valeurs en chaînes (compatibles sauvegarde)');
    // Correction : retour à « Présent » sans mention → plus d'enregistrement
    await card().click();
    await d.locator('button.status-btn', {hasText: 'Présent'}).click(); await page.waitForTimeout(200);
    await d.locator('button.status-btn', {hasText: 'Oubli de tenue'}).click(); await page.waitForTimeout(200);
    await d.locator('button.status-btn', {hasText: 'Mot des parents'}).click(); await page.waitForTimeout(200);
    await d.locator('button', {hasText: 'Terminé'}).click(); await page.waitForTimeout(300);
    rec = (await readStores(page)).attendance.find(a => a.id === 's3/st4');
    assert.equal(rec, undefined);
    assert.equal((await readStores(page)).sessions.find(s => s.id === 's3').called, '1', 'séance marquée comme appelée');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('une inaptitude n’est pas comptée comme une absence', async () => {
  const {page, close} = await open();
  try {
    await go(page, 'student=st6');
    const kpis = await page.locator('.kpis').innerText();
    assert.match(kpis, /Absences\s*0/);
    assert.match(await page.locator('#view').innerText(), /Entorse fictive/);
    await go(page, 'absences');
    const row = await page.locator('tr', {hasText: 'Inapte'}).first().innerText();
    assert.doesNotMatch(row, /\b[1-9]\d*\s*abs/i);
  } finally { await close(); }
});
