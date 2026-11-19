// Cas 8 : sauvegarde puis restauration complète (magasins, identifiants, photos, données et fichiers des applications) ;
// sauvegardes corrompues ou de version future refusées sans toucher aux données.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {writeFile, mkdtemp, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {open, go, readStores, settle} from '../helpers.mjs';
import {PHOTO} from '../fixtures/donnees-fictives.mjs';

// Contenu des autres bases IndexedDB et du localStorage, Blob compris (lu en texte).
const readExtra = page => page.evaluate(async () => {
  const req = r => new Promise((ok, no) => { r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
  const out = {localStorage: {}, dbs: {}};
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); out.localStorage[k] = localStorage.getItem(k); }
  for (const name of ['mon-tableau-blanc-documents', 'chrono-eps']) {
    const db = await req(indexedDB.open(name)); out.dbs[name] = {};
    for (const s of db.objectStoreNames) {
      const st = db.transaction(s).objectStore(s);
      const [keys, vals] = await Promise.all([req(st.getAllKeys()), req(st.getAll())]);
      out.dbs[name][s] = await Promise.all(vals.map(async (v, i) => [keys[i], v && v.blob instanceof Blob ? {...v, blob: 'Blob:' + await v.blob.text()} : v]));
    }
    db.close();
  }
  return out;
});
const sortById = o => Object.fromEntries(Object.entries(o).map(([k, l]) => [k, [...l].sort((a, b) => a.id.localeCompare(b.id))]));
const ignore = ['eps-last-backup', 'eps-backup-snooze']; // horodatages mis à jour par l'export lui-même

async function exportFile(page) {
  await go(page, 'backup');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('button', {hasText: 'Télécharger le fichier'}).first().click()]);
  const file = await dl.path();
  return {file, json: JSON.parse(await readFile(file, 'utf8'))};
}
async function restoreFile(page, file) {
  await go(page, 'backup');
  await page.setInputFiles('input[type=file][accept*=json]', file);
  await page.waitForTimeout(1500);
}
async function wipeEverything(page) {
  await page.evaluate(async () => {
    const req = r => new Promise((ok, no) => { r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
    const db = await req(indexedDB.open('eps-manager'));
    await new Promise(ok => { const t = db.transaction(db.objectStoreNames, 'readwrite'); for (const s of db.objectStoreNames) t.objectStore(s).clear(); t.oncomplete = ok; });
    db.close();
    for (const n of ['mon-tableau-blanc-documents', 'chrono-eps']) await new Promise(ok => { const r = indexedDB.deleteDatabase(n); r.onsuccess = r.onerror = r.onblocked = ok; });
    localStorage.clear();
  });
  await page.reload(); await settle(page, 800);
}

test('sauvegarde → effacement total → restauration : tout est retrouvé à l’identique', async () => {
  const {page, errors, close} = await open();
  try {
    const before = sortById(await readStores(page));
    const extraBefore = await readExtra(page);
    const {file, json} = await exportFile(page);
    assert.equal(json.version, 3);
    assert.ok(json.createdAt && json.appVersion);
    assert.deepEqual(Object.keys(json.data).sort(), Object.keys(before).sort(), 'tous les magasins sont dans le fichier');

    await wipeEverything(page);
    assert.equal((await readStores(page)).students.length, 0, 'appareil vidé');

    await restoreFile(page, file);
    const after = sortById(await readStores(page));
    for (const s of Object.keys(before)) {
      assert.equal(after[s].length, before[s].length, 'nombre d’enregistrements : ' + s);
      assert.deepEqual(after[s].map(r => r.id), before[s].map(r => r.id), 'identifiants : ' + s);
    }
    assert.deepEqual(after.students, before.students, 'élèves identiques (photos comprises)');
    assert.equal(after.students.find(s => s.id === 'st1').photo, PHOTO);
    assert.deepEqual(after.attendance, before.attendance, 'appels identiques');
    assert.deepEqual(after.grades, before.grades, 'notes identiques');

    const extraAfter = await readExtra(page);
    for (const k of ignore) { delete extraBefore.localStorage[k]; delete extraAfter.localStorage[k]; }
    assert.deepEqual(extraAfter.localStorage, extraBefore.localStorage, 'données des applications (localStorage)');
    assert.deepEqual(extraAfter.dbs, extraBefore.dbs, 'bases des applications, fichiers compris');
    assert.match(extraAfter.dbs['mon-tableau-blanc-documents'].docs[0][1].blob, /contenu fictif du document/);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('une sauvegarde corrompue ou d’une version future est refusée sans rien modifier', async () => {
  const {page, close} = await open();
  try {
    const before = sortById(await readStores(page));
    const {json} = await exportFile(page);
    const dir = await mkdtemp(path.join(tmpdir(), 'eps-test-'));
    const cases = {
      'tronquee.json': JSON.stringify(json).slice(0, 500),
      'version-future.json': JSON.stringify({...json, version: 4}),
      'valeur-non-texte.json': JSON.stringify({...json, data: {...json.data, students: [{...json.data.students[0], first: 12}]}}),
      'sans-identifiant.json': JSON.stringify({...json, data: {...json.data, grades: [{grade: '12'}]}})
    };
    for (const [name, content] of Object.entries(cases)) {
      const f = path.join(dir, name); await writeFile(f, content);
      await restoreFile(page, f);
      assert.match(await page.textContent('[role=status]'), /Restauration impossible/, name);
      assert.deepEqual(sortById(await readStores(page)), before, 'données inchangées après ' + name);
    }
  } finally { await close(); }
});
