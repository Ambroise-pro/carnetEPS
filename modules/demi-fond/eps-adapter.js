// EPS Manager — liaison avec le module Demi-fond.
// Chargé par l'application principale (import dynamique). Ce fichier est le seul endroit qui connaît
// le format des données de Demi-fond : l'application principale ne contient rien de spécifique à ce module.
//
// beforeOpen(ctx) : recopie les classes, élèves, sexes et photos d'EPS Manager dans l'accueil Demi-fond
//                   (puis, via lui, dans Scan CCF, PhotoFinish et ScanDocument).
// collect(ctx)    : renvoie les notes, les temps et un résumé par séance, au format commun des modules.

const HUB_KEY = 'eps-hub-v1';
const SCAN_KEY = 'df-scan-ccf-v2';
const EXPORT_KEY = 'df-eps-export-v1';
const TYPE_LABELS = {ccf: 'CCF 2 × 800 m', exam500: 'Examen 3 × 500 m', training: 'Séance libre'};
const METHOD_LABELS = {chrono: 'Chrono Carnet', paper: 'fiches papier', video: 'vidéo PhotoFinish'};

const readJSON = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } };
const norm = v => String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
const dayOf = ex => ex.lessonDate || new Date(ex.createdAt || Date.now()).toLocaleDateString('sv-SE');
const time = ms => { const t = Math.round(ms / 100) / 10, m = Math.floor(t / 60), s = (t - m * 60).toFixed(1).padStart(4, '0'); return `${m}:${s}`; };
const hubSex = s => s === 'F' ? 'F' : s === 'G' ? 'M' : '';
const appSex = s => s === 'F' ? 'F' : s === 'M' ? 'G' : '';

function loadHub(base) {
  if (window.EPSHub) return Promise.resolve(window.EPSHub);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = base + 'hub/hub-data.js';
    script.onload = () => resolve(window.EPSHub);
    script.onerror = () => reject(new Error('hub/hub-data.js introuvable'));
    document.head.append(script);
  });
}

export async function beforeOpen(ctx) {
  const H = await loadHub(ctx.base);
  const hub = H.load();
  const photos = {};
  for (const c of ctx.classes) {
    if (!c.students.length) continue;
    // La classe garde l'identifiant d'EPS Manager : les séances, groupes Scan CCF et classes PhotoFinish s'y rattachent.
    let hc = hub.classes.find(x => x.id === c.id) || hub.classes.find(x => norm(x.name) === norm(c.name));
    if (!hc) { hc = {id: c.id, name: c.name, students: [], createdAt: Date.now()}; hub.classes.push(hc); }
    const old = hc.students || [];
    hc.name = c.name;
    hc.students = c.students.map(s => {
      const prev = old.find(o => o.id === s.id) || old.find(o => norm(o.last + ' ' + o.first) === norm(s.last + ' ' + s.first));
      if (H.validPhoto(s.photo)) photos[s.id] = s.photo;
      return {id: s.id, last: s.last.toLocaleUpperCase('fr'), first: s.first, sex: hubSex(s.sex) || prev?.sex || '', cls: prev?.cls || ''};
    }).sort((a, b) => (a.last + a.first).localeCompare(b.last + b.first, 'fr'));
    hc.updatedAt = Date.now();
  }
  H.save(hub);
  if (Object.keys(photos).length) await H.photosPut(photos);
  await H.syncAll(hub);
}

export async function collect(ctx) {
  const out = {grades: [], results: [], summaries: [], studentUpdates: []};
  const hub = readJSON(HUB_KEY, {classes: [], sessions: []});
  const scan = readJSON(SCAN_KEY, {groups: []});
  const exported = readJSON(EXPORT_KEY, {grades: []});
  const classOf = (id, name) => ctx.classes.find(c => c.id === id) || ctx.classes.find(c => norm(c.name) === norm(name));
  const studentOf = (c, last, first) => c?.students.find(s => norm(s.last + ' ' + s.first) === norm(last + ' ' + first) || norm(s.first + ' ' + s.last) === norm(last + ' ' + first));

  // Sexe renseigné dans Demi-fond mais pas encore dans EPS Manager
  for (const hc of hub.classes || []) {
    const c = classOf(hc.id, hc.name);
    for (const hs of hc.students || []) {
      const s = studentOf(c, hs.last, hs.first);
      if (s && !s.sex && appSex(hs.sex)) out.studentUpdates.push({studentId: s.id, sex: appSex(hs.sex)});
    }
  }

  // Notes calculées par Scan CCF (publiées par scan/eps-export.js)
  const notes = {};
  for (const g of exported.grades || []) {
    const c = classOf(g.groupId, g.groupName), s = studentOf(c, g.last, g.first);
    if (!s) continue;
    const name = TYPE_LABELS[g.type] || g.label || 'Demi-fond';
    out.grades.push({key: `note:${g.exerciseId}:${s.id}`, classId: c.id, studentId: s.id, name, grade: g.note, date: g.date});
    out.results.push({key: `note:${g.exerciseId}:${s.id}`, classId: c.id, studentId: s.id, date: g.date, label: name + ' · note', value: String(g.note).replace('.', ','), unit: '/20'});
    (notes[g.exerciseId] ??= new Set()).add(s.id);
  }

  // Temps relevés (Chrono Carnet, fiches, vidéo) dans Scan CCF
  const timed = {};
  for (const g of scan.groups || []) {
    const c = classOf(g.id, g.name);
    if (!c) continue;
    for (const ex of g.sessions || []) {
      const date = dayOf(ex), label = TYPE_LABELS[ex.type] || ex.label || 'Course';
      for (const st of ex.students || []) {
        const s = studentOf(c, st.last, st.first);
        if (!s) continue;
        for (const [n, race] of Object.entries(st.races || {})) {
          const ms = Number(race?.totalMs ?? race?.total500Ms);
          if (!(ms > 0)) continue;
          out.results.push({key: `time:${ex.id}:${s.id}:${n}`, classId: c.id, studentId: s.id, date, label: `${label} · course ${n}`, value: time(ms), unit: ''});
          (timed[ex.id] ??= new Set()).add(s.id);
        }
      }
      const runners = timed[ex.id]?.size || 0, graded = notes[ex.id]?.size || 0;
      if (runners || graded) out.summaries.push({key: `exercise:${ex.id}`, classId: c.id, date,
        text: [ex.label || label, runners && `${runners} élève${runners > 1 ? 's' : ''} chronométré${runners > 1 ? 's' : ''}`, graded && `${graded} note${graded > 1 ? 's' : ''}`].filter(Boolean).join(' · ')});
    }
  }

  // Séances lancées depuis l'accueil Demi-fond (même sans temps encore relevés)
  for (const hs of hub.sessions || []) {
    const hc = (hub.classes || []).find(x => x.id === hs.classId), c = classOf(hs.classId, hc?.name);
    if (!c || (hs.scanExerciseId && out.summaries.some(x => x.key === `exercise:${hs.scanExerciseId}`))) continue;
    const plan = hs.plan?.distances?.length ? ' ' + hs.plan.distances.join('-') + ' m' : '';
    out.summaries.push({key: `session:${hs.id}`, classId: c.id, date: hs.date,
      text: [(TYPE_LABELS[hs.type] || 'Demi-fond') + plan, METHOD_LABELS[hs.method], hs.video && 'arrivée filmée', hs.closed ? 'séance terminée' : 'séance préparée'].filter(Boolean).join(' · ')});
  }
  return out;
}
