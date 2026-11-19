// EPS Manager — liaison avec le module Co-évaluation Bac (Musculation CA5).
// Chargé par l'application principale. Aucun fichier de Coeval n'est modifié : la liaison lit et écrit
// ses données (localStorage « df-coeval-v1 ») avec son propre noyau (coeval-core.js, window.CoEvalCore).
//
// beforeOpen(ctx) : les épreuves liées à une classe d'EPS Manager reçoivent les nouveaux élèves ;
//                   si une classe est choisie, son épreuve est ouverte (créée avec la liste des élèves au besoin).
// collect(ctx)    : notes validées → Évaluations ; notes et avancement → séance du jour de l'évaluation.

const KEY = 'df-coeval-v1';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };
const norm = v => String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'-]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
const day = t => new Date(t).toLocaleDateString('sv-SE');
const num = v => String(Math.round(v * 100) / 100).replace('.', ',');
const pronote = s => s.last.toLocaleUpperCase('fr') + ' ' + s.first;

function loadCore(base) {
  if (window.CoEvalCore) return Promise.resolve(window.CoEvalCore);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = base + 'coeval-core.js';
    script.onload = () => resolve(window.CoEvalCore);
    script.onerror = () => reject(new Error('coeval-core.js introuvable'));
    document.head.append(script);
  });
}
// Élève d'EPS Manager correspondant à un candidat (« NOM Prénom » ou « Prénom NOM », noms corrigés compris).
function studentOf(classes, cand, classId) {
  const names = [cand.name, ...(cand.aliases || [])].map(norm);
  const pools = classId ? [classes.find(c => c.id === classId)].filter(Boolean) : [];
  pools.push(...classes.filter(c => norm(c.name) === norm(cand.classroom)), ...classes);
  for (const c of pools) {
    const s = c.students.find(s => names.includes(norm(s.last + ' ' + s.first)) || names.includes(norm(s.first + ' ' + s.last)));
    if (s) return {c, s};
  }
  return null;
}

export async function beforeOpen(ctx) {
  const C = await loadCore(ctx.base);
  const raw = read();
  // Données d'une ancienne version : Coeval les migre lui-même (avec sa copie de sécurité) avant tout ajout.
  if (raw && (raw.version || 1) < C.DATA_VERSION) return;
  const db = raw && Array.isArray(raw.epreuves) ? raw : {version: C.DATA_VERSION, me: '', epreuves: [], activeId: null};
  let changed = !raw;
  const fill = (ep, c) => { const before = ep.candidates.length; C.addCandidates(ep, c.students.map(pronote), c.students.map(() => c.name)); if (ep.candidates.length !== before) changed = true; };
  for (const ep of db.epreuves) {
    const c = ctx.classes.find(x => x.id === ep.epsClassId);
    if (c && !ep.archived) fill(ep, c);
  }
  const focus = ctx.focus?.classId && ctx.classes.find(c => c.id === ctx.focus.classId);
  if (focus) {
    let ep = db.epreuves.find(e => e.epsClassId === focus.id && !e.archived);
    if (!ep) {
      ep = {id: C.uid(), title: 'Musculation CA5 · ' + focus.name, role: 'prof', createdAt: Date.now(), candidates: [], mine: {}, others: {}, final: {}, history: [], backupAt: 0, backupHash: '', epsClassId: focus.id};
      db.epreuves.unshift(ep);
      fill(ep, focus);
    }
    if (db.activeId !== ep.id) { db.activeId = ep.id; changed = true; }
  }
  if (changed) localStorage.setItem(KEY, JSON.stringify(db));
}

export async function collect(ctx) {
  const out = {grades: [], results: [], summaries: []};
  const db = read();
  if (!db?.epreuves?.length) return out;
  const C = await loadCore(ctx.base);
  if ((db.version || 1) < C.DATA_VERSION) return out;
  for (const ep of db.epreuves) {
    if (ep.title?.includes('EXEMPLE') || ep.demo) continue;
    const perDay = {};
    for (const cand of ep.candidates || []) {
      const m = studentOf(ctx.classes, cand, ep.epsClassId);
      if (!m) continue;
      const {c, s} = m;
      let r;
      try { r = C.retainedFor(ep, cand, db.me || ''); } catch { continue; }
      const mine = ep.mine?.[cand.id];
      const validated = r.validated && r.total != null;
      if (validated) out.grades.push({key: `note:${ep.id}:${s.id}`, studentId: s.id, name: ep.title, grade: Math.round(r.total * 100) / 100, date: day(r.validated.at)});
      // Rattachement à la séance du jour de l'évaluation AFL1 (ou de la validation)
      const at = mine?.updatedAt || r.validated?.at;
      if (!at) continue;
      const d = day(at), sc = r.h?.scores || {};
      (perDay[d] ??= {classId: c.id, evaluated: 0, done: 0, validated: 0});
      perDay[d].evaluated++; if (mine?.done) perDay[d].done++; if (validated) perDay[d].validated++;
      const note = validated ? r.total : sc.total;
      if (note != null) out.results.push({key: `note:${ep.id}:${s.id}`, classId: c.id, studentId: s.id, date: d, label: ep.title + (validated ? ' · note validée' : ' · note provisoire'), value: num(note), unit: '/20'});
      else if (sc.afl1 != null) out.results.push({key: `note:${ep.id}:${s.id}`, classId: c.id, studentId: s.id, date: d, label: ep.title + ' · AFL1', value: num(sc.afl1), unit: '/12'});
    }
    for (const [d, x] of Object.entries(perDay)) {
      out.summaries.push({key: `summary:${ep.id}:${d}`, classId: x.classId, date: d,
        text: [ep.title, `${x.evaluated} élève${x.evaluated > 1 ? 's' : ''} évalué${x.evaluated > 1 ? 's' : ''}`, x.done && `${x.done} AFL1 terminée${x.done > 1 ? 's' : ''}`, x.validated && `${x.validated} note${x.validated > 1 ? 's' : ''} validée${x.validated > 1 ? 's' : ''}`].filter(Boolean).join(' · ')});
    }
  }
  return out;
}
