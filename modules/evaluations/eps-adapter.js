// EPS Manager — liaison avec le module Évaluations (grilles par degrés).
// beforeOpen(ctx) : recopie les classes et élèves ; la classe choisie (ou celle de la séance) est mise en avant,
//                   avec la date de la séance proposée pour une nouvelle évaluation.
// collect(ctx)    : notes sur 20 des élèves entièrement évalués → Évaluations ;
//                   note de chaque élève et résumé → séance de la classe à la date de l'évaluation.

const KEY = 'eps-evaluations-v1';
const read = () => { try { const d = JSON.parse(localStorage.getItem(KEY) || 'null'); return d && d.version === 1 ? d : null; } catch { return null; } };
const n = v => { const x = Number(String(v).replace(',', '.')); return isFinite(x) ? x : 0; };
const round = v => Math.round(v * 100) / 100;
const fmt = v => String(round(v)).replace('.', ',');
const rowMax = r => Math.max(0, ...r.cells.map(c => n(c.max)));

export async function beforeOpen(ctx) {
  const db = read() || {version: 1, classes: [], grids: [], evals: [], ui: {}};
  db.classes = ctx.classes.map(c => ({id: c.id, name: c.name, students: c.students.map(s => ({id: s.id, first: s.first, last: s.last, sex: s.sex || ''}))}));
  db.ui = db.ui || {};
  db.ui.focusClassId = ctx.focus?.classId || '';
  db.ui.focusDate = ctx.sessions.find(s => s.id === ctx.focus?.sessionId)?.date || '';
  if (ctx.focus?.classId) db.ui.tab = 'evals';
  localStorage.setItem(KEY, JSON.stringify(db));
}

export async function collect(ctx) {
  const out = {grades: [], results: [], summaries: []};
  const db = read();
  if (!db) return out;
  for (const ev of db.evals || []) {
    const c = ctx.classes.find(x => x.id === ev.classId);
    if (!c || !ev.grid?.rows?.length) continue;
    const max = ev.grid.rows.reduce((s, r) => s + rowMax(r), 0);
    if (!max) continue;
    let graded = 0, absent = 0, total = 0;
    for (const s of c.students) {
      const mark = ev.marks?.[s.id];
      if (!mark) continue;
      if (mark.status) { absent++; out.results.push({key: `note:${ev.id}:${s.id}`, classId: c.id, studentId: s.id, date: ev.date, label: ev.title, value: mark.status === 'absent' ? 'Absent' : 'Dispensé', unit: ''}); continue; }
      const picked = ev.grid.rows.map(r => mark.rows?.[r.id]).filter(Boolean);
      if (picked.length !== ev.grid.rows.length) continue;
      const sum = picked.reduce((a, m) => a + n(m.pts), 0), note = round(sum / max * 20);
      graded++; total += note;
      out.grades.push({key: `note:${ev.id}:${s.id}`, studentId: s.id, name: ev.title, grade: note, date: ev.date});
      out.results.push({key: `note:${ev.id}:${s.id}`, classId: c.id, studentId: s.id, date: ev.date, label: ev.title + ' · ' + picked.map(m => 'D' + m.deg).join(' '), value: fmt(note), unit: '/20'});
    }
    if (graded || absent) out.summaries.push({key: `summary:${ev.id}`, classId: c.id, date: ev.date,
      text: [ev.title, `${graded} / ${c.students.length} élèves notés`, graded && `moyenne ${fmt(total / graded)} / 20`, absent && `${absent} absent${absent > 1 ? 's' : ''} ou dispensé${absent > 1 ? 's' : ''}`].filter(Boolean).join(' · ')});
  }
  return out;
}
