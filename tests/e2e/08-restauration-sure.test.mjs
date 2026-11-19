// Phase 0, lot 0.2 : sauvegarde vérifiable (inventaire + somme de contrôle), copie avant restauration,
// retour automatique en cas d'échec, reprise d'une restauration interrompue, annulation de la dernière restauration.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {writeFile, mkdtemp, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {open, go, settle, readStores, readExtra, sortById, IGNORED_KEYS, exportFile, restoreFile, ROOT} from '../helpers.mjs';

const tmp = async (name, obj) => { const f = path.join(await mkdtemp(path.join(tmpdir(), 'eps-test-')), name); await writeFile(f, typeof obj === 'string' ? obj : JSON.stringify(obj)); return f; };
const status = page => page.textContent('[role=status]');
const cleanLS = x => { for (const k of IGNORED_KEYS) delete x.localStorage[k]; return x; };
// Sauvegarde « ancienne » (sans inventaire) dont on retire un élève : acceptée, et différente des données actuelles.
const withoutOneStudent = json => { const b = structuredClone(json); delete b.manifest; b.data.students = b.data.students.filter(s => s.id !== 'st5'); b.data.attendance = b.data.attendance.filter(a => a.student !== 'st5'); return b; };

test('liste de secours des bases : toutes les bases des applications', async () => {
  const src = await readFile(path.join(ROOT, 'app.js'), 'utf8');
  const known = JSON.parse(src.match(/const KNOWN_DBS=(\[[^\]]*\])/)[1].replace(/'/g, '"'));
  for (const n of ['mon-tableau-blanc-documents', 'scan-document-eps-v1', 'eps-hub-photos', 'chrono-eps', 'df-scan-ccf-backups', 'eps-hub-pf']) assert.ok(known.includes(n), n);
});

test('le fichier contient un inventaire exact et une somme de contrôle SHA-256', async () => {
  const {page, close} = await open();
  try {
    const db = await readStores(page);
    const {json} = await exportFile(page);
    assert.match(json.manifest.sha256, /^[0-9a-f]{64}$/);
    for (const [k, l] of Object.entries(db)) assert.equal(json.manifest.counts[k], l.length, k);
    assert.ok(json.manifest.indexedDB.some(d => d.name === 'chrono-eps' && d.stores.runs === 1));
    assert.ok(!json.manifest.indexedDB.some(d => d.name === 'eps-manager-restore-point'), 'le point de restauration n’est pas dans la sauvegarde');
  } finally { await close(); }
});

test('fichier modifié après export : refusé (somme de contrôle), rien n’est changé ; ancien fichier sans inventaire : accepté', async () => {
  const {page, errors, close} = await open();
  try {
    const before = sortById(await readStores(page));
    const {json} = await exportFile(page);
    const tampered = structuredClone(json); tampered.data.grades[0].grade = '20';
    await restoreFile(page, await tmp('modifie.json', tampered));
    assert.match(await status(page), /somme de contrôle/);
    assert.deepEqual(sortById(await readStores(page)), before);
    await restoreFile(page, await tmp('ancien.json', withoutOneStudent(json)));
    assert.match(await status(page), /Sauvegarde restaurée/);
    assert.equal((await readStores(page)).students.length, before.students.length - 1);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('échec pendant la restauration : retour automatique et complet aux données d’avant', async () => {
  const {page, errors, close} = await open();
  try {
    const before = sortById(await readStores(page)), extraBefore = cleanLS(await readExtra(page));
    const {json} = await exportFile(page);
    const bad = withoutOneStudent(json);
    bad.extra.localStorage['cle-de-la-sauvegarde-ratee'] = 'x';
    // Base d'application dont le chemin de clé est invalide : sa recréation échoue en cours de restauration.
    bad.extra.indexedDB.push({name: 'base-piege', version: 1, stores: [{name: 's', keyPath: 'chemin invalide !', autoIncrement: false, indexes: [], records: []}]});
    await restoreFile(page, await tmp('echec.json', bad));
    await page.waitForTimeout(800);
    assert.match(await status(page), /vos données d’avant ont été remises/);
    assert.deepEqual(sortById(await readStores(page)), before, 'base principale revenue à l’identique');
    const extraAfter = cleanLS(await readExtra(page));
    assert.deepEqual(extraAfter, extraBefore, 'localStorage et bases des applications revenus à l’identique');
    assert.equal(await page.evaluate(() => localStorage.getItem('eps-restore-journal')), null);
    assert.ok(!(await page.evaluate(async () => (await indexedDB.databases()).map(d => d.name))).includes('base-piege'));
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('annuler la dernière restauration depuis la page Sauvegardes', async () => {
  const {page, close} = await open();
  try {
    const before = sortById(await readStores(page));
    const {json} = await exportFile(page);
    await restoreFile(page, await tmp('ancien.json', withoutOneStudent(json)));
    assert.equal((await readStores(page)).students.length, before.students.length - 1);
    await go(page, 'backup'); await page.waitForTimeout(300);
    const panel = page.locator('.panel', {hasText: 'Annuler la dernière restauration'});
    assert.match(await panel.innerText(), /pas une sauvegarde externe/);
    await panel.locator('button', {hasText: 'Revenir à cet état'}).click();
    await page.waitForTimeout(1500);
    assert.deepEqual(sortById(await readStores(page)).students, before.students);
  } finally { await close(); }
});

test('restauration interrompue (fermeture, batterie…) : proposée au redémarrage, retour aux données d’avant', async () => {
  const {page, close} = await open();
  try {
    const before = sortById(await readStores(page));
    const {json} = await exportFile(page);
    await restoreFile(page, await tmp('ancien.json', withoutOneStudent(json)));
    // Simule une coupure : le journal de restauration est resté et les données sont incomplètes.
    await page.evaluate(() => localStorage.setItem('eps-restore-journal', JSON.stringify({startedAt: new Date().toISOString(), label: 'test'})));
    await page.reload(); await page.waitForTimeout(2200);
    const d = page.locator('dialog[open]');
    assert.match(await d.innerText(), /Restauration interrompue/);
    await d.locator('button', {hasText: 'Revenir aux données d’avant'}).click();
    await page.waitForTimeout(1500);
    assert.deepEqual(sortById(await readStores(page)).students, before.students);
    assert.equal(await page.evaluate(() => localStorage.getItem('eps-restore-journal')), null);
  } finally { await close(); }
});

test('charger les données d’exemple garde une copie des données actuelles', async () => {
  const {page, close} = await open();
  try {
    const before = sortById(await readStores(page));
    await go(page, 'backup');
    await page.click('text=Charger les données d’exemple'); await settle(page, 2500);
    assert.ok((await readStores(page)).students.some(s => s.id.startsWith('ex-')));
    await go(page, 'backup'); await page.waitForTimeout(300);
    const panel = page.locator('.panel', {hasText: 'Annuler la dernière restauration'});
    assert.match(await panel.innerText(), /données d’exemple/);
    await panel.locator('button', {hasText: 'Revenir à cet état'}).click();
    await page.waitForTimeout(1500);
    assert.deepEqual(sortById(await readStores(page)).students, before.students);
  } finally { await close(); }
});
