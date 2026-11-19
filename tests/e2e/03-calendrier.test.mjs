// Cas 1 et 2 : vacances, alternance A/B, création des séances depuis l'emploi du temps et préservation des séances personnalisées.
// Utilise le jeu « Charger les données d’exemple » de l'application (emploi du temps avec cours en semaine A et en semaine B).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {open, go, readStores, settle} from '../helpers.mjs';

const addDays = (d, n) => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const mondayOf = d => { const x = new Date(d + 'T12:00:00Z'); return addDays(d, -((x.getUTCDay() + 6) % 7)); };

test('séances générées : jamais en vacances, alternance A/B respectée, séances personnalisées préservées', async () => {
  const {page, errors, close} = await open({seed: false});
  try {
    await go(page, 'backup');
    await page.click('text=Charger les données d’exemple');
    await settle(page, 2500);
    let db = await readStores(page);
    const year = db.years[0], holidays = db.holidays;
    const inHoliday = d => holidays.some(h => h.start <= d && h.end >= d);
    const slotSessions = db.sessions.filter(s => s.slot);
    assert.ok(slotSessions.length > 100, 'séances créées depuis l’emploi du temps');
    assert.deepEqual(slotSessions.filter(s => inHoliday(s.date)).map(s => s.date), [], 'aucune séance pendant les vacances');
    // Alternance : numéroter les semaines de cours (hors semaines entières de vacances)
    const schoolWeek = m => [0, 1, 2, 3, 4, 5].some(i => { const d = addDays(m, i); return d >= year.start && d <= year.end && !inHoliday(d); });
    const index = new Map(); let n = 0;
    for (let m = mondayOf(year.start); m <= year.end; m = addDays(m, 7)) { index.set(m, n); if (schoolWeek(m)) n++; }
    const typeOf = d => (index.get(mondayOf(d)) % 2 === 0 ? year.firstWeek || 'A' : (year.firstWeek === 'B' ? 'A' : 'B'));
    for (const slot of db.timetable.filter(t => t.freq !== 'all')) {
      const dates = slotSessions.filter(s => s.slot === slot.id).map(s => s.date);
      assert.ok(dates.length > 5, 'cours ' + slot.freq + ' présent');
      assert.deepEqual(dates.filter(d => typeOf(d) !== slot.freq), [], 'cours de semaine ' + slot.freq + ' uniquement en semaine ' + slot.freq);
    }
    // Séances personnalisées : une ponctuelle et une séance de l'emploi du temps avec du contenu
    const future = slotSessions.filter(s => s.date > '2026-11-19' && s.slot === db.timetable.find(t => t.freq === 'A').id)[0];
    await page.evaluate(async f => {
      const req = r => new Promise((ok, no) => { r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
      const db = await req(indexedDB.open('eps-manager'));
      await new Promise(ok => { const t = db.transaction('sessions', 'readwrite'); t.objectStore('sessions').put({id: 'perso', classId: 'ex-5B', date: '2026-12-02', time: '13:00', duration: '55', name: 'Rattrapage'}); t.objectStore('sessions').put({...f, main: 'Contenu préparé'}); t.oncomplete = ok; });
      db.close();
    }, future);
    await page.reload(); await settle(page, 800);
    // Changer l'alternance (semaine B en premier) : les cours A et B s'inversent
    await go(page, 'planning');
    await page.locator('select').filter({has: page.locator('option[value=B]')}).first().selectOption('B');
    await page.waitForTimeout(1200);
    db = await readStores(page);
    assert.ok(db.sessions.find(s => s.id === 'perso'), 'séance ponctuelle conservée');
    assert.equal(db.sessions.find(s => s.id === future.id)?.main, 'Contenu préparé', 'séance avec contenu conservée');
    const yB = db.years[0];
    assert.equal(yB.firstWeek, 'B');
    const typeB = d => (index.get(mondayOf(d)) % 2 === 0 ? 'B' : 'A');
    const slotA = db.timetable.find(t => t.freq === 'A');
    const fresh = db.sessions.filter(s => s.slot === slotA.id && s.date >= '2026-11-19' && !s.main && !s.called && !s.cancelled).map(s => s.date);
    assert.deepEqual(fresh.filter(d => typeB(d) !== 'A'), [], 'après inversion, le cours A suit les nouvelles semaines A');
    assert.ok(db.sessions.filter(s => s.called === '1' && s.date < '2026-11-19').length > 10, 'séances passées appelées conservées');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
