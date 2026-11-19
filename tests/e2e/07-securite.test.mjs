// Sécurité : un nom contenant du HTML s'affiche comme du texte et ne s'exécute jamais.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {open, go, closeDialogs} from '../helpers.mjs';
import {XSS_NAME} from '../fixtures/donnees-fictives.mjs';

test('injection HTML dans un prénom : affichée en texte, jamais exécutée', async () => {
  const {page, errors, close} = await open();
  try {
    for (const p of ['students', 'student=st7', 'attendance', 'absences', 'grades', 'averages']) {
      await go(page, p);
      if (p === 'attendance') { await page.locator('button', {hasText: '6e Test'}).first().click(); await page.waitForTimeout(400); await closeDialogs(page); }
      assert.equal(await page.evaluate(() => window.__xss), undefined, 'script exécuté sur ' + p);
      assert.equal(await page.locator('#view img[src="x"]').count(), 0, 'balise injectée sur ' + p);
    }
    await go(page, 'student=st7');
    assert.ok((await page.locator('#view').innerText()).includes(XSS_NAME), 'nom affiché tel quel');
    await go(page, 'comments');
    await page.click('text=Préparer les brouillons'); await page.waitForTimeout(300);
    assert.equal(await page.evaluate(() => window.__xss), undefined);
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
