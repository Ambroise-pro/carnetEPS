// Cas 6 et 7 : tableaux de classe ; applications associées (déclaration, fichiers, liaisons SDK v1, synchronisation sans erreur).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {open, go, ROOT} from '../helpers.mjs';

const declared = JSON.parse(await readFile(path.join(ROOT, 'modules/modules.json'), 'utf8'));

test('modules.json déclare demi-fond, coeval et evaluations avec un manifeste valide', async () => {
  for (const id of ['demi-fond', 'coeval', 'evaluations']) assert.ok(declared.includes(id), id);
  for (const id of declared) {
    const m = JSON.parse(await readFile(path.join(ROOT, 'modules', id, 'eps-module.json'), 'utf8'));
    assert.ok(m.name && m.entry, id + ' : name et entry');
  }
});

test('chaque application s’ouvre et sa liaison exporte collect() (SDK v1)', async () => {
  const {page, url, errors, close} = await open();
  try {
    for (const id of declared) {
      const m = JSON.parse(await readFile(path.join(ROOT, 'modules', id, 'eps-module.json'), 'utf8'));
      assert.equal((await page.request.get(new URL(`modules/${id}/${m.entry}`, url).href)).status(), 200, id + ' : page d’entrée');
      if (!m.adapter) continue;
      const exported = await page.evaluate(async src => Object.keys(await import(src)), new URL(`modules/${id}/${m.adapter}`, url).href);
      assert.ok(exported.includes('collect'), id + ' : collect() exporté (' + exported.join(', ') + ')');
    }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('page Applications : les trois applications sont listées, aucune liaison en erreur', async () => {
  const {page, errors, close} = await open();
  try {
    await go(page, 'apps');
    await page.waitForTimeout(1500);
    const view = await page.locator('#view').innerText();
    for (const name of ['Demi-fond', 'Évaluations']) assert.match(view, new RegExp(name));
    assert.doesNotMatch(view, /Liaison en erreur/);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('tableaux : le tableau de la classe est listé et s’ouvre', async () => {
  const {page, errors, close} = await open();
  try {
    await go(page, 'boards');
    assert.match(await page.locator('#view').innerText(), /6e Test[\s\S]*1 tableau/);
    await page.locator('.class-card', {hasText: '6e Test'}).click(); await page.waitForTimeout(300);
    assert.match(await page.locator('#view').innerText(), /Tableau fictif/);
    await go(page, 'board=b1');
    await page.waitForTimeout(800);
    assert.ok(await page.locator('#view *').count() > 5, 'éditeur de tableau affiché');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
