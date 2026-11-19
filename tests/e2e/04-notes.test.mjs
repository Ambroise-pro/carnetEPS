// Cas 5 : notes, moyennes (coefficients, note non numérique ≠ zéro), appréciations, observations et photos.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {open, go} from '../helpers.mjs';

test('moyenne pondérée et note « Abs » ignorée (pas un zéro)', async () => {
  const {page, errors, close} = await open();
  try {
    // st1 : Badminton (12+14)/2 = 13, coef 1 ; Demi-fond 9, coef 2 → (13 + 18) / 3 = 10,33
    await go(page, 'student=st1');
    assert.match(await page.locator('.kpis').innerText(), /Moyenne \(année\)\s*10,33/);
    // st2 : Badminton 16 ; Demi-fond « Abs » ne compte pas → 16
    await go(page, 'student=st2');
    assert.match(await page.locator('.kpis').innerText(), /Moyenne \(année\)\s*16\b/);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('fiche élève : photo, appréciation, observation, inaptitude, besoins particuliers', async () => {
  const {page, close} = await open();
  try {
    await go(page, 'student=st1');
    const view = await page.locator('#view').innerText();
    assert.match(view, /Appréciation fictive/);
    assert.match(view, /Observation fictive/);
    assert.ok(await page.locator('#view img[src^="data:image/jpeg"]').count() >= 1, 'photo affichée');
    await go(page, 'student=st3');
    assert.match(await page.locator('#view').innerText(), /PAI fictif/);
  } finally { await close(); }
});

test('brouillons d’appréciations : un brouillon par élève, sans appel réseau', async () => {
  const {page, errors, close} = await open();
  const external = [];
  page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1')) external.push(r.url()); });
  try {
    await go(page, 'comments');
    await page.click('text=Préparer les brouillons');
    await page.waitForTimeout(400);
    assert.equal(await page.locator('article.draft').count(), 7, 'élèves de 6e Test');
    const txt = await page.locator('article.draft textarea').first().inputValue();
    assert.ok(txt.length > 20);
    assert.deepEqual(external, [], 'aucune requête externe sans clé Gemini');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
