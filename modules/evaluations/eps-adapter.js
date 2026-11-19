// EPS Manager — liaison avec l'application Évaluations (grilles par degrés et barèmes de performance).
// beforeOpen / refresh : déposent le contexte (classes avec inaptitudes et appel du jour, cycles, classe et date
//   de la séance d'origine) dans une clé à part : l'adaptateur n'écrit jamais dans les données de l'application.
// collect : notes sur 20 des élèves entièrement évalués → Évaluations ;
//   note (et degrés ou performance) de chaque élève et résumé → séance de la classe à la date de l'évaluation.

const KEY = 'eps-evaluations-v1', CTX_KEY = 'eps-evaluations-context';
const read = () => { try { const d = JSON.parse(localStorage.getItem(KEY) || 'null'); return d && d.version === 1 ? d : null; } catch { return null; } };
const n = v => { const x = Number(String(v).replace(',', '.')); return isFinite(x) ? x : 0; };
const round = v => Math.round(v * 100) / 100;
const fmt = v => String(round(v)).replace('.', ',');
const rowMax = r => Math.max(0, ...r.cells.map(c => n(c.max)));

function context(ctx, opened) {
  const s = ctx.sessions.find(x => x.id === ctx.focus?.sessionId);
  const body = {classes: ctx.classes.map(c => ({id: c.id, name: c.name, students: c.students.map(s => ({id: s.id, first: s.first, last: s.last, sex: s.sex || '', inapt: s.inapt || '', attendance: s.attendance || ''}))})),
    cycles: ctx.cycles || [], focusClassId: ctx.focus?.classId || '', focusDate: s?.date || ''};
  let old = null; try { old = JSON.parse(localStorage.getItem(CTX_KEY) || 'null'); } catch {}
  if (!opened && old) { const {openedAt, ...rest} = old; if (JSON.stringify(rest) === JSON.stringify(body)) return; body.openedAt = openedAt; }
  if (opened) body.openedAt = Date.now();
  localStorage.setItem(CTX_KEY, JSON.stringify(body));
}
export async function beforeOpen(ctx) { context(ctx, true); }
export async function refresh(ctx) { context(ctx, false); }

// Barème de performance (même calcul que l'application)
function parsePerf(v, unit) {
  const s = String(v ?? '').trim().replace(',', '.'); if (!s) return null;
  if (unit === 'time') { const m = s.match(/^(\d+)\s*(?:[:'’]|min|m)\s*(\d{1,2}(?:\.\d+)?)?\s*(?:''|"|s)?$/i); if (m) return Number(m[1]) * 60 + Number(m[2] || 0); const x = Number(s.replace(/s$/i, '')); return isFinite(x) ? x : null; }
  const x = Number(s); return isFinite(x) ? x : null;
}
function perfNote(g, sex, perf) {
  const rows = (g.table?.[sex] || []).map(r => ({p: parsePerf(r.p, g.unit), n: n(r.n)})).filter(r => r.p != null).sort((a, b) => a.p - b.p);
  if (perf == null || !rows.length) return null;
  let v; if (perf <= rows[0].p) v = rows[0].n; else if (perf >= rows.at(-1).p) v = rows.at(-1).n;
  else { const i = rows.findIndex(r => r.p >= perf), a = rows[i - 1], b = rows[i]; v = a.n + (b.n - a.n) * (perf - a.p) / (b.p - a.p); }
  const st = n(g.step) || 0.5; return Math.max(0, Math.round(v / st) * st);
}

export async function collect(ctx) {
  const out = {grades: [], results: [], summaries: []};
  const db = read();
  if (!db) return out;
  for (const ev of db.evals || []) {
    const c = ctx.classes.find(x => x.id === ev.classId), g = ev.grid;
    if (!c || !g) continue;
    const perf = g.type === 'perf', max = perf ? (n(g.max) || 20) : (g.rows || []).reduce((s, r) => s + rowMax(r), 0);
    if (!max || (!perf && !g.rows?.length)) continue;
    let graded = 0, absent = 0, total = 0;
    for (const s of c.students) {
      const mark = ev.marks?.[s.id];
      if (!mark) continue;
      if (mark.status) { absent++; out.results.push({key: `note:${ev.id}:${s.id}`, classId: c.id, studentId: s.id, date: ev.date, label: ev.title, value: mark.status === 'absent' ? 'Absent' : 'Dispensé', unit: ''}); continue; }
      let note, label;
      if (perf) {
        const sex = mark.sex || (s.sex === 'F' ? 'F' : s.sex === 'G' ? 'G' : ''), p = parsePerf(mark.perf, g.unit), raw = p != null && sex ? perfNote(g, sex, p) : null;
        if (raw == null) continue;
        note = round(raw / max * 20); label = ev.title + ' · ' + String(mark.perf).trim();
      } else {
        const picked = g.rows.map(r => mark.rows?.[r.id]).filter(Boolean);
        if (picked.length !== g.rows.length) continue;
        note = round(picked.reduce((a, m) => a + n(m.pts), 0) / max * 20); label = ev.title + ' · ' + picked.map(m => 'D' + m.deg).join(' ');
      }
      graded++; total += note;
      out.grades.push({key: `note:${ev.id}:${s.id}`, studentId: s.id, name: ev.title, grade: note, date: ev.date});
      out.results.push({key: `note:${ev.id}:${s.id}`, classId: c.id, studentId: s.id, date: ev.date, label, value: fmt(note), unit: '/20'});
    }
    if (graded || absent) out.summaries.push({key: `summary:${ev.id}`, classId: c.id, date: ev.date,
      text: [ev.title, `${graded} / ${c.students.length} élèves notés`, graded && `moyenne ${fmt(total / graded)} / 20`, absent && `${absent} absent${absent > 1 ? 's' : ''} ou dispensé${absent > 1 ? 's' : ''}`].filter(Boolean).join(' · ')});
  }
  return out;
}
