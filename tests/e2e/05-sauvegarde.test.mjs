// Cas 8 : sauvegarde puis restauration complète (magasins, identifiants, photos, données et fichiers des applications) ;
// sauvegardes corrompues ou de version future refusées sans toucher aux données.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {writeFile, mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {open, readStores, readExtra, sortById, IGNORED_KEYS as ignore, exportFile, restoreFile, wipeEverything} from '../helpers.mjs';
import {PHOTO} from '../fixtures/donnees-fictives.mjs';

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
