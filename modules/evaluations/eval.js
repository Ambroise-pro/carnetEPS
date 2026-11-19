'use strict';
/* Évaluations — module d'EPS Manager.
   Grilles par degrés (1 à 4) : chaque ligne croise les quatre degrés ; chaque case porte des critères
   et un nombre de points (minimum et maximum, modulable par pas de 0,5 par défaut).
   Une grille affectée à une classe donne une évaluation : on touche un élève, puis les cases, et la note
   sur 20 se calcule. Les classes viennent d'EPS Manager (eps-adapter.js), les notes y retournent. */

const KEY = 'eps-evaluations-v1';
const DEGREES = [1, 2, 3, 4];
const STEPS = [['0.5', '0,5 point'], ['0.25', '0,25 point'], ['1', '1 point']];
const STATUS = {'': 'Présent', absent: 'Absent', exempt: 'Dispensé'};

const uid = () => crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2);
const round = n => Math.round(n * 100) / 100;
const fmt = n => n == null || !isFinite(n) ? '—' : String(round(n)).replace('.', ',');
const num = v => { const n = Number(String(v).replace(',', '.')); return isFinite(n) ? n : 0; };
const today = () => new Date().toLocaleDateString('sv-SE');
const dayLabel = d => d ? new Intl.DateTimeFormat('fr', {weekday: 'short', day: 'numeric', month: 'short'}).format(new Date(d + 'T12:00')) : '';
const clone = o => JSON.parse(JSON.stringify(o));
const app = document.getElementById('app');

/* ---------- Données ---------- */
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (d && d.version === 1) return {classes: [], grids: [], evals: [], ui: {}, ...d};
  } catch {}
  return {version: 1, classes: [], grids: [], evals: [], ui: {}};
}
let db = load();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); return true; }
  catch { toast('Enregistrement impossible : le stockage de l’appareil est plein.'); return false; }
}
// EPS Manager peut mettre à jour les classes pendant que le module est ouvert (autre onglet ou nouvelle ouverture).
window.addEventListener('storage', e => { if (e.key === KEY || e.key === CTX_KEY) { db = load(); applyCtx(); if (ensureCycleEvals()) save(); render(); } });

const classOf = id => db.classes.find(c => c.id === id);
const studentName = s => s.last.toLocaleUpperCase('fr') + ' ' + s.first;
const studentsOf = id => (classOf(id)?.students || []).slice().sort((a, b) => (a.last + a.first).localeCompare(b.last + b.first, 'fr'));

/* ---------- Calculs ---------- */
const cellMax = c => num(c.max);
const cellMin = c => Math.min(num(c.min), cellMax(c));
const rowMax = r => Math.max(0, ...r.cells.map(cellMax));
const gridMax = g => round(g.rows.reduce((s, r) => s + rowMax(r), 0));
function cellSteps(c, step) {
  const out = [], s = num(step) || 0.5;
  for (let v = cellMin(c); v <= cellMax(c) + 1e-9; v = round(v + s)) out.push(round(v));
  if (!out.length || out.at(-1) !== cellMax(c)) out.push(cellMax(c));
  return [...new Set(out)];
}
// Note d'un élève : null si absent / dispensé ; complète quand chaque ligne a une case choisie.
function scoreOf(ev, mark, student) {
  if (ev.grid.type === 'perf') return perfScore(ev, mark, student);
  const g = ev.grid, max = gridMax(g);
  if (!mark || mark.status) return {sum: 0, max, done: 0, rows: g.rows.length, complete: false, note: null, status: mark?.status || ''};
  let sum = 0, done = 0;
  for (const r of g.rows) { const m = mark.rows?.[r.id]; if (m) { sum += num(m.pts); done++; } }
  const complete = done === g.rows.length && g.rows.length > 0;
  return {sum: round(sum), max, done, rows: g.rows.length, complete, note: max ? round(sum / max * 20) : null, status: ''};
}

/* ---------- Interface ---------- */
function h(tag, attrs = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) n[k] = v;
    else if (k === 'class') n.className = v;
    else if (k === 'style') n.style.cssText = v;
    else if (k in n && !['list', 'form'].includes(k)) n[k] = v;
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c != null && c !== false) n.append(c instanceof Node ? c : String(c));
  return n;
}
let toastTimer;
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3000); }
function dialog(title, body, actions) {
  const d = h('dialog', {class: 'sheet'}, h('h2', {}, title), body, h('div', {class: 'actions'}, actions(() => d.close())));
  d.onclose = () => d.remove(); document.body.append(d); d.showModal(); return d;
}

let screen = {name: 'home'};
function go(next) { screen = next; render(); window.scrollTo(0, 0); }

function render() {
  app.replaceChildren();
  if (screen.name === 'grid') return screen.draft.type === 'perf' ? renderPerfEditor() : renderGridEditor();
  if (screen.name === 'eval') return renderEval();
  renderHome();
}

/* ---------- Accueil : grilles et évaluations ---------- */
function renderHome() {
  const tab = db.ui.tab || (db.ui.focusClassId ? 'evals' : 'grids');
  app.append(h('header', {class: 'top'},
    h('div', {}, h('h1', {}, 'Évaluations'), h('p', {class: 'muted'}, 'Grilles par degrés, note sur 20.')),
    h('nav', {class: 'segmented', 'aria-label': 'Rubriques'},
      ...[['grids', 'Mes grilles'], ['evals', 'Évaluer']].map(([k, l]) => h('button', {type: 'button', 'aria-pressed': String(tab === k), onclick: () => { db.ui.tab = k; save(); render(); }}, l)))));
  if (tab === 'grids') renderGrids(); else renderEvals();
}

function newGrid() {
  const row = () => ({id: uid(), label: '', cells: [{text: '', min: 0, max: 0.5}, {text: '', min: 1, max: 1}, {text: '', min: 1.5, max: 2}, {text: '', min: 2.5, max: 3}]});
  return {id: uid(), name: '', activity: '', step: '0.5', rows: [row(), row()], createdAt: Date.now()};
}
function sampleGrid() {
  const r = (label, cells) => ({id: uid(), label, cells: cells.map(([text, min, max]) => ({text, min, max}))});
  return {id: uid(), name: 'Badminton · match', activity: 'Badminton', step: '0.5', createdAt: Date.now(), rows: [
    r('Rupture de l’échange', [['Renvoie au centre, sans intention', 0, 1], ['Cherche à déplacer l’adversaire, sans constance', 1.5, 2.5], ['Varie longueur et largeur pour le déplacer', 3, 4], ['Crée et exploite la rupture (smash, amorti)', 4.5, 6]]),
    r('Déplacements et replacement', [['Reste au centre, subit', 0, 1], ['Se déplace tard, replacement partiel', 1.5, 2], ['Se replace au centre entre les frappes', 2.5, 3], ['Anticipe, appuis dynamiques', 3.5, 4]]),
    r('Gain des matchs', [['Moins de 25 % des matchs gagnés', 0, 1], ['25 à 50 %', 1.5, 2], ['50 à 75 %', 2.5, 3], ['Plus de 75 %', 3.5, 4]]),
    r('Arbitrage et conseil', [['N’arbitre pas', 0, 1], ['Compte les points', 1.5, 2], ['Arbitre et annonce le score', 2.5, 3], ['Conseille le joueur avec pertinence', 3.5, 6]]),
  ]};
}

function renderGrids() {
  const bar = h('div', {class: 'toolbar'},
    h('button', {type: 'button', class: 'primary', onclick: () => go({name: 'grid', draft: newGrid(), isNew: true})}, '+ Nouvelle grille'),
    h('button', {type: 'button', onclick: () => go({name: 'grid', draft: sampleGrid(), isNew: true})}, 'Partir d’un exemple'),
    h('button', {type: 'button', onclick: () => go({name: 'grid', draft: newPerf(), isNew: true})}, '+ Barème de performance'),
    h('button', {type: 'button', onclick: () => go({name: 'grid', draft: samplePerf(), isNew: true})}, 'Exemple de barème'),
    h('button', {type: 'button', onclick: () => picker.click()}, 'Importer une grille Excel'),
    h('button', {type: 'button', onclick: () => exportGrids([{...sampleGrid(), name: 'Nom de la grille (à remplacer)'}], 'Modele_grille_evaluation.xlsx')}, 'Télécharger le modèle Excel'));
  const picker = h('input', {type: 'file', accept: '.xlsx,.xls,.ods,.csv', hidden: true, onchange: e => { importGrids(e.target.files[0]); e.target.value = ''; }});
  bar.append(picker);
  app.append(bar);
  if (!db.grids.length) { app.append(h('p', {class: 'empty'}, 'Aucune grille. Créez votre première grille : des lignes, quatre degrés, des critères et des points dans chaque case.')); return; }
  const list = h('div', {class: 'cards'});
  for (const g of db.grids.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))) {
    const used = db.evals.filter(e => e.gridId === g.id).length;
    list.append(h('article', {class: 'card'},
      h('h3', {}, g.name || 'Grille sans nom'),
      h('p', {class: 'muted'}, (g.type === 'perf' ? [g.activity, 'barème de performance', PERF_UNITS[g.unit], 'filles et garçons'] : [g.activity, g.rows.length + ' ligne' + (g.rows.length > 1 ? 's' : ''), 'barème sur ' + fmt(gridMax(g)) + ' pts']).concat(used ? used + ' évaluation' + (used > 1 ? 's' : '') : '').filter(Boolean).join(' · ')),
      (() => { const cys = (db.cycles || []).filter(cy => gridForCycle(cy) === g); return cys.length ? h('p', {class: 'small linked'}, 'Liée aux cycles : ' + [...new Set(cys.map(c => c.name))].join(', ') + ' (' + [...new Set(cys.map(c => classOf(c.classId)?.name).filter(Boolean))].join(', ') + ')') : null; })(),
      h('div', {class: 'actions'},
        h('button', {type: 'button', class: 'primary', onclick: () => assignDialog(g)}, 'Évaluer une classe'),
        h('button', {type: 'button', onclick: () => go({name: 'grid', draft: clone(g)})}, 'Modifier'),
        g.type === 'perf' ? null : h('button', {type: 'button', onclick: () => exportGrids([g], fileName(g.name) + '.xlsx')}, 'Exporter en Excel'),
        h('button', {type: 'button', onclick: () => { const c = {...clone(g), id: uid(), name: (g.name || 'Grille') + ' (copie)', createdAt: Date.now(), updatedAt: Date.now()}; db.grids.push(c); save(); render(); toast('Grille dupliquée.'); }}, 'Dupliquer'),
        h('button', {type: 'button', class: 'danger', onclick: () => { if (!confirm(`Supprimer la grille « ${g.name || 'sans nom'} » ? Les évaluations déjà faites restent disponibles.`)) return; db.grids = db.grids.filter(x => x !== g); save(); render(); }}, 'Supprimer'))));
  }
  app.append(list);
}

function assignDialog(grid) {
  if (!db.classes.length) { toast('Aucune classe : ouvrez l’application depuis EPS Manager pour recevoir vos classes.'); return; }
  const grids = h('select', {}, ...db.grids.map(g => h('option', {value: g.id, selected: g === grid}, g.name || 'Grille sans nom')));
  const cls = h('select', {}, ...db.classes.map(c => h('option', {value: c.id, selected: c.id === db.ui.focusClassId}, c.name)));
  const title = h('input', {value: grid?.name || db.grids[0]?.name || '', required: true});
  const date = h('input', {type: 'date', value: db.ui.focusDate || today(), required: true});
  grids.onchange = () => { title.value = db.grids.find(g => g.id === grids.value)?.name || ''; };
  dialog('Nouvelle évaluation', h('div', {class: 'form'},
    h('label', {}, 'Grille', grids), h('label', {}, 'Classe', cls), h('label', {}, 'Titre', title), h('label', {}, 'Date', date)),
  close => [h('button', {type: 'button', onclick: close}, 'Annuler'), h('button', {type: 'button', class: 'primary', onclick: () => {
    const g = db.grids.find(x => x.id === grids.value); if (!g || (g.type !== 'perf' && !g.rows.length)) return toast('Choisissez une grille avec au moins une ligne.');
    const ev = {id: uid(), gridId: g.id, grid: clone(g), classId: cls.value, title: title.value.trim() || g.name || 'Évaluation', date: date.value || today(), createdAt: Date.now(), marks: {}};
    db.evals.push(ev); db.ui.tab = 'evals'; save(); close(); go({name: 'eval', id: ev.id});
  }}, 'Commencer')]);
}

function renderEvals() {
  const filter = db.ui.focusClassId && classOf(db.ui.focusClassId) ? db.ui.focusClassId : (db.ui.evalClass || '');
  const sel = h('select', {'aria-label': 'Classe', onchange: e => { db.ui.evalClass = e.target.value; db.ui.focusClassId = ''; save(); render(); }},
    h('option', {value: ''}, 'Toutes les classes'), ...db.classes.map(c => h('option', {value: c.id, selected: c.id === filter}, c.name)));
  app.append(h('div', {class: 'toolbar'}, sel, h('button', {type: 'button', class: 'primary', onclick: () => db.grids.length ? assignDialog(null) : toast('Créez d’abord une grille.')}, '+ Nouvelle évaluation')));
  const evs = db.evals.filter(e => !filter || e.classId === filter).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  if (!evs.length) { app.append(h('p', {class: 'empty'}, db.grids.length ? 'Aucune évaluation pour le moment. Choisissez une grille et une classe.' : 'Créez d’abord une grille dans « Mes grilles ».')); return; }
  const list = h('div', {class: 'cards'});
  for (const ev of evs) {
    const st = studentsOf(ev.classId), scores = st.map(s => scoreOf(ev, ev.marks[s.id], s)), done = scores.filter(s => s.complete);
    const avg = done.length ? done.reduce((a, s) => a + s.note, 0) / done.length : null;
    list.append(h('article', {class: 'card clickable', onclick: () => go({name: 'eval', id: ev.id})},
      h('h3', {}, ev.title),
      ev.cycleId ? h('p', {class: 'small linked'}, 'Évaluation finale du cycle ' + (ev.cycleName || '') + ' · dernière séance') : null,
      h('p', {class: 'muted'}, [classOf(ev.classId)?.name || 'Classe supprimée', dayLabel(ev.date), done.length + ' / ' + st.length + ' élèves notés', avg != null ? 'moyenne ' + fmt(avg) + ' / 20' : ''].filter(Boolean).join(' · ')),
      h('div', {class: 'progress'}, h('i', {style: `width:${st.length ? done.length / st.length * 100 : 0}%`}))));
  }
  app.append(list);
}

/* ---------- Excel : modèle, export et import de grilles ----------
   Une feuille par grille : en haut le nom, l'activité et la modulation ; puis une ligne d'en-tête
   « Ligne | Degré 1 · critères | Degré 1 · points min | Degré 1 · points max | … » et une ligne par ligne de la grille.
   Bibliothèque : SheetJS (vendor/xlsx.mini.min.js, Apache-2.0), chargée à la demande. */
let xlsxReady = null;
function loadXLSX() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  return xlsxReady ??= new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'vendor/xlsx.mini.min.js'; s.onload = () => ok(window.XLSX); s.onerror = () => { xlsxReady = null; no(Error('xlsx')); }; document.head.append(s); });
}
const HEAD = ['Ligne', ...DEGREES.flatMap(d => [`Degré ${d} · critères`, `Degré ${d} · points min`, `Degré ${d} · points max`])];
const HELP = [
  ['Mode d’emploi de la grille d’évaluation (application Évaluations d’EPS Manager)'], [],
  ['1. Feuille « Grille » : indiquez le nom de la grille, l’activité et la modulation des points (0,25 · 0,5 · 1).'],
  ['2. Une ligne du tableau = une ligne de la grille (ex. « Déplacements »). Ajoutez autant de lignes que nécessaire.'],
  ['3. Pour chaque degré (1 = le plus faible, 4 = le meilleur) : les critères, puis les points minimum et maximum de la case.'],
  ['   En évaluant, la case donne le maximum et peut descendre jusqu’au minimum par pas de la modulation.'],
  ['   Même valeur en minimum et maximum = case à valeur fixe.'],
  ['4. Le barème est la somme des maxima de chaque ligne ; la note est ramenée sur 20.'],
  ['5. Plusieurs grilles dans un même fichier : dupliquez la feuille « Grille » (une feuille par grille).'],
  ['6. Dans EPS Manager : Évaluations › Mes grilles › Importer une grille Excel.'],
];
function gridSheet(XLSX, g) {
  const rows = [['Nom de la grille', g.name || ''], ['Activité', g.activity || ''], ['Modulation des points', num(g.step) || 0.5], [], HEAD,
    ...g.rows.map(r => [r.label || '', ...r.cells.flatMap(c => [c.text || '', num(c.min), num(c.max)])])];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{wch: 26}, ...DEGREES.flatMap(() => [{wch: 34}, {wch: 9}, {wch: 9}])];
  return ws;
}
async function exportGrids(grids, file) {
  try {
    const XLSX = await loadXLSX(), wb = XLSX.utils.book_new();
    grids.forEach((g, i) => XLSX.utils.book_append_sheet(wb, gridSheet(XLSX, g), grids.length > 1 ? ('Grille ' + (i + 1) + ' ' + (g.name || '')).replace(/[\\/?*[\]:]/g, ' ').slice(0, 31).trim() : 'Grille'));
    const help = XLSX.utils.aoa_to_sheet(HELP); help['!cols'] = [{wch: 110}];
    XLSX.utils.book_append_sheet(wb, help, 'Mode d’emploi');
    XLSX.writeFile(wb, file);
  } catch { toast('Export Excel impossible.'); }
}
const fold = v => String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
// Lit une feuille ; renvoie une grille ou null si la feuille n'en contient pas.
function sheetToGrid(XLSX, ws) {
  const rows = XLSX.utils.sheet_to_json(ws, {header: 1, defval: '', raw: true});
  const hi = rows.findIndex(r => fold(r[0]).startsWith('ligne'));
  if (hi < 0) return null;
  const g = {id: uid(), name: '', activity: '', step: '0.5', rows: [], createdAt: Date.now()};
  for (const r of rows.slice(0, hi)) {
    const k = fold(r[0]), v = r[1];
    if (k.startsWith('nom')) g.name = String(v).trim();
    else if (k.startsWith('activit')) g.activity = String(v).trim();
    else if (k.includes('modulation') || k === 'pas') { const s = num(v); g.step = s >= 0.75 ? '1' : s > 0 && s <= 0.3 ? '0.25' : '0.5'; }
  }
  // Colonnes repérées par leur en-tête (« degré 2 · points max »…), sinon par leur position.
  const head = rows[hi].map(fold);
  const col = (d, kind, fallback) => { const i = head.findIndex(t => (t.includes('degre ' + d) || t.includes('d' + d)) && (kind === 'crit' ? t.includes('crit') : t.includes(kind))); return i >= 0 ? i : fallback; };
  const cols = DEGREES.map(d => ({text: col(d, 'crit', 1 + (d - 1) * 3), min: col(d, 'min', 2 + (d - 1) * 3), max: col(d, 'max', 3 + (d - 1) * 3)}));
  for (const r of rows.slice(hi + 1)) {
    const label = String(r[0] ?? '').trim();
    const cells = cols.map(c => ({text: String(r[c.text] ?? '').trim(), min: num(r[c.min]), max: num(r[c.max])}));
    if (!label && cells.every(c => !c.text && !c.max)) continue;
    cells.forEach(c => { if (c.min > c.max) c.max = c.min; });
    g.rows.push({id: uid(), label, cells});
  }
  return g.rows.length ? g : null;
}
async function importGrids(file) {
  if (!file) return;
  try {
    const XLSX = await loadXLSX();
    const wb = XLSX.read(await file.arrayBuffer(), {type: 'array'});
    const grids = wb.SheetNames.filter(n => !fold(n).startsWith('mode')).map(n => sheetToGrid(XLSX, wb.Sheets[n])).filter(Boolean);
    if (!grids.length) return toast('Aucune grille trouvée : utilisez le modèle Excel (ligne d’en-tête « Ligne | Degré 1 · critères | … »).');
    grids.forEach(g => { if (!g.name) g.name = file.name.replace(/\.\w+$/, ''); });
    if (grids.length === 1) { go({name: 'grid', draft: grids[0], isNew: true}); toast('Grille importée : vérifiez-la puis enregistrez-la.'); return; }
    grids.forEach(g => { g.updatedAt = Date.now(); db.grids.push(g); });
    save(); render(); toast(grids.length + ' grilles importées.');
  } catch { toast('Fichier illisible : choisissez un fichier Excel (.xlsx) ou le modèle fourni.'); }
}
const fileName = s => (s || 'grille').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w-]+/g, '_').replace(/^_+|_+$/g, '');

/* ---------- Éditeur de grille ---------- */
function renderGridEditor() {
  const g = screen.draft;
  const total = h('strong', {});
  const refresh = () => { total.textContent = 'Barème : ' + fmt(gridMax(g)) + ' points' + (gridMax(g) && gridMax(g) !== 20 ? ' (ramené sur 20 pour la note)' : ''); };
  app.append(h('header', {class: 'top'},
    h('div', {}, h('button', {type: 'button', class: 'link', onclick: () => { if (confirm('Quitter sans enregistrer les modifications ?')) go({name: 'home'}); }}, '← Mes grilles'), h('h1', {}, screen.isNew ? 'Nouvelle grille' : 'Modifier la grille')),
    h('div', {class: 'actions'}, h('button', {type: 'button', class: 'primary', onclick: saveGrid}, 'Enregistrer la grille'))));
  app.append(h('section', {class: 'panel form row3'},
    h('label', {}, 'Nom de la grille', h('input', {value: g.name, placeholder: 'ex. Badminton · match', oninput: e => { g.name = e.target.value; }})),
    h('label', {}, 'Activité (lie la grille aux cycles du même nom)', h('input', {value: g.activity, placeholder: 'ex. Badminton', oninput: e => { g.activity = e.target.value; }})),
    h('label', {}, 'Modulation des points', h('select', {onchange: e => { g.step = e.target.value; }}, ...STEPS.map(([v, l]) => h('option', {value: v, selected: String(g.step) === v}, 'par ' + l))))));
  app.append(h('p', {class: 'muted help'}, 'Dans chaque case : les critères, puis les points de « min » à « max ». En évaluant, toucher la case donne le maximum ; on peut ensuite descendre jusqu’au minimum, par pas de ' + (STEPS.find(s => s[0] === String(g.step))?.[1] || '0,5 point') + '. Le degré 1 est le plus faible, le degré 4 le meilleur.'));
  const table = h('div', {class: 'grid-edit'});
  table.append(h('div', {class: 'ge-head'}, h('span', {}, 'Ligne'), ...DEGREES.map(d => h('span', {class: 'deg d' + d}, 'Degré ' + d))));
  g.rows.forEach((r, i) => {
    const rowEl = h('div', {class: 'ge-row'});
    rowEl.append(h('div', {class: 'ge-label'},
      h('textarea', {rows: 2, placeholder: 'Intitulé de la ligne (ex. Déplacements)', value: r.label, oninput: e => { r.label = e.target.value; }, 'aria-label': 'Intitulé de la ligne ' + (i + 1)}),
      h('span', {class: 'muted small'}, 'max ' + fmt(rowMax(r)) + ' pts'),
      h('div', {class: 'mini'},
        h('button', {type: 'button', title: 'Monter', 'aria-label': 'Monter la ligne', disabled: i === 0, onclick: () => { g.rows.splice(i - 1, 0, g.rows.splice(i, 1)[0]); render(); }}, '↑'),
        h('button', {type: 'button', title: 'Descendre', 'aria-label': 'Descendre la ligne', disabled: i === g.rows.length - 1, onclick: () => { g.rows.splice(i + 1, 0, g.rows.splice(i, 1)[0]); render(); }}, '↓'),
        h('button', {type: 'button', class: 'danger', title: 'Supprimer', 'aria-label': 'Supprimer la ligne', onclick: () => { if (g.rows.length > 1 && !confirm('Supprimer cette ligne ?')) return; g.rows.splice(i, 1); render(); }}, '✕'))));
    r.cells.forEach((c, d) => {
      const pts = (k, lbl) => h('label', {class: 'pts'}, lbl, h('input', {type: 'number', inputMode: 'decimal', min: 0, step: g.step || 0.5, value: c[k], onchange: e => { c[k] = num(e.target.value); if (k === 'max' && num(c.min) > c.max) c.min = c.max; render(); }}));
      rowEl.append(h('div', {class: 'ge-cell d' + (d + 1)},
        h('textarea', {rows: 3, placeholder: 'Critères du degré ' + (d + 1), value: c.text, oninput: e => { c.text = e.target.value; }, 'aria-label': `Critères, ligne ${i + 1}, degré ${d + 1}`}),
        h('div', {class: 'pts-row'}, pts('min', 'de'), pts('max', 'à'), h('span', {}, 'pts'))));
    });
    table.append(rowEl);
  });
  app.append(table);
  app.append(h('div', {class: 'toolbar'}, h('button', {type: 'button', onclick: () => { const last = g.rows.at(-1); g.rows.push({id: uid(), label: '', cells: last ? last.cells.map(c => ({text: '', min: c.min, max: c.max})) : newGrid().rows[0].cells}); render(); }}, '+ Ajouter une ligne'), total));
  refresh();
  function saveGrid() {
    if (!g.name.trim()) return toast('Donnez un nom à la grille.');
    if (!g.rows.length) return toast('Ajoutez au moins une ligne.');
    if (!gridMax(g)) return toast('Attribuez des points aux cases.');
    g.updatedAt = Date.now();
    const i = db.grids.findIndex(x => x.id === g.id);
    if (i < 0) db.grids.push(g); else db.grids[i] = g;
    const n = ensureCycleEvals();
    if (save()) { toast('Grille enregistrée.' + (n ? ' Évaluation finale créée pour ' + n + ' cycle' + (n > 1 ? 's' : '') + ' lié' + (n > 1 ? 's' : '') + '.' : '')); go({name: 'home'}); }
  }
}

/* ---------- Évaluation d'une classe ---------- */
function renderEval() {
  const ev = db.evals.find(e => e.id === screen.id);
  if (!ev) return go({name: 'home'});
  const students = studentsOf(ev.classId);
  if (!screen.student || !students.some(s => s.id === screen.student)) screen.student = students.find(s => !scoreOf(ev, ev.marks[s.id], s).complete && !ev.marks[s.id]?.status)?.id || students[0]?.id;
  const perf = ev.grid.type === 'perf';
  app.append(h('header', {class: 'top'},
    h('div', {}, h('button', {type: 'button', class: 'link', onclick: () => go({name: 'home'})}, '← Évaluations'),
      h('h1', {}, ev.title), h('p', {class: 'muted'}, [classOf(ev.classId)?.name, dayLabel(ev.date), perf ? 'barème de performance → /20' : 'barème ' + fmt(gridMax(ev.grid)) + ' pts → /20', ev.cycleId ? 'évaluation finale du cycle ' + (ev.cycleName || '') : ''].filter(Boolean).join(' · '))),
    h('div', {class: 'actions'},
      perf ? h('button', {type: 'button', onclick: () => perfCSV(ev, students)}, 'Exporter en CSV') : h('button', {type: 'button', 'aria-pressed': String(!!screen.summary), onclick: () => { screen.summary = !screen.summary; render(); }}, screen.summary ? 'Retour à la saisie' : 'Bilan de la classe'),
      h('button', {type: 'button', class: 'danger', onclick: () => { if (!confirm('Supprimer cette évaluation et toutes ses notes ?')) return; db.evals = db.evals.filter(e => e !== ev); save(); go({name: 'home'}); }}, 'Supprimer'))));
  if (!students.length) { app.append(h('p', {class: 'empty'}, 'Cette classe n’a pas d’élèves. Ouvrez l’application depuis EPS Manager pour mettre à jour la liste.')); return; }
  if (perf) return renderPerfEval(ev, students);
  if (screen.summary) return renderSummary(ev, students);

  const layout = h('div', {class: 'eval-layout'});
  const list = h('nav', {class: 'students', 'aria-label': 'Élèves'});
  for (const s of students) {
    const sc = scoreOf(ev, ev.marks[s.id], s);
    list.append(h('button', {type: 'button', class: 'student' + (s.id === screen.student ? ' on' : '') + (sc.complete ? ' done' : ''), onclick: () => { screen.student = s.id; render(); }},
      h('span', {class: 'name'}, studentName(s), ' ', ...liveTags(ev, s)),
      h('span', {class: 'score'}, sc.status ? STATUS[sc.status] : sc.complete ? fmt(sc.note) : sc.done ? sc.done + '/' + sc.rows : '')));
  }
  layout.append(list, studentPanel(ev, students));
  app.append(layout);
}

function markOf(ev, sid) { return ev.marks[sid] ??= {rows: {}, status: '', comment: ''}; }
function studentPanel(ev, students) {
  const i = students.findIndex(s => s.id === screen.student), s = students[i];
  const mark = ev.marks[s.id] || {rows: {}, status: '', comment: ''}, g = ev.grid;
  const panel = h('section', {class: 'student-panel'});
  panel.append(h('div', {class: 'sp-head'}, h('h2', {}, studentName(s)),
    h('div', {class: 'segmented small', role: 'group', 'aria-label': 'Situation'}, ...Object.entries(STATUS).map(([k, l]) => h('button', {type: 'button', 'aria-pressed': String((mark.status || '') === k), onclick: () => { markOf(ev, s.id).status = k; touch(ev, s.id); }}, l)))));
  panel.append(...liveNotices(ev, s, mark, k => { markOf(ev, s.id).status = k; touch(ev, s.id); }));
  if (mark.status) panel.append(h('p', {class: 'notice'}, STATUS[mark.status] + ' : pas de note pour cette évaluation. Les points déjà saisis sont conservés.'));
  const grid = h('div', {class: 'eval-grid' + (mark.status ? ' disabled' : '')});
  grid.append(h('div', {class: 'eg-head'}, h('span', {}, ''), ...DEGREES.map(d => h('span', {class: 'deg d' + d}, 'Degré ' + d))));
  for (const r of g.rows) {
    const m = mark.rows?.[r.id];
    const row = h('div', {class: 'eg-row'}, h('div', {class: 'eg-label'}, h('strong', {}, r.label || 'Ligne'), h('span', {class: 'muted small'}, m ? fmt(m.pts) + ' / ' + fmt(rowMax(r)) + ' pts' : '— / ' + fmt(rowMax(r)) + ' pts')));
    r.cells.forEach((c, d) => {
      const on = m?.deg === d + 1;
      const cell = h('div', {class: 'eg-cell d' + (d + 1) + (on ? ' on' : '')});
      cell.append(h('button', {type: 'button', class: 'eg-pick', disabled: !!mark.status, 'aria-pressed': String(on), 'aria-label': `${r.label || 'Ligne'}, degré ${d + 1}, ${fmt(cellMin(c))} à ${fmt(cellMax(c))} points`,
        onclick: () => { const mk = markOf(ev, s.id); if (on) delete mk.rows[r.id]; else mk.rows[r.id] = {deg: d + 1, pts: cellMax(c)}; touch(ev, s.id); }},
        h('span', {class: 'eg-text'}, c.text || 'Degré ' + (d + 1)),
        h('span', {class: 'eg-pts'}, cellMin(c) === cellMax(c) ? fmt(cellMax(c)) + ' pt' + (cellMax(c) > 1 ? 's' : '') : fmt(cellMin(c)) + ' à ' + fmt(cellMax(c)) + ' pts')));
      // Modulation dans la case choisie
      if (on) {
        const opts = cellSteps(c, g.step);
        if (opts.length > 1) cell.append(h('div', {class: 'chips', role: 'group', 'aria-label': 'Points dans la case'}, ...opts.map(v => h('button', {type: 'button', 'aria-pressed': String(m.pts === v), onclick: () => { markOf(ev, s.id).rows[r.id].pts = v; touch(ev, s.id); }}, fmt(v)))));
      }
      row.append(cell);
    });
    row.append(rowSlider(ev, s, r, m, !!mark.status));
    grid.append(row);
  }
  panel.append(grid);
  panel.append(h('label', {class: 'comment'}, 'Commentaire (facultatif)', h('textarea', {rows: 2, value: mark.comment || '', onchange: e => { markOf(ev, s.id).comment = e.target.value; ev.marks[s.id].updatedAt = Date.now(); save(); }})));
  const sc = scoreOf(ev, mark);
  panel.append(h('footer', {class: 'total-bar'},
    h('button', {type: 'button', disabled: i <= 0, onclick: () => { screen.student = students[i - 1].id; render(); }}, '← Précédent'),
    h('div', {class: 'total', id: 'liveTotal'}, sc.status ? h('strong', {}, STATUS[sc.status]) : [h('strong', {class: 'note'}, fmt(sc.max ? sc.sum / sc.max * 20 : null) + ' / 20'), h('span', {class: 'muted'}, fmt(sc.sum) + ' / ' + fmt(sc.max) + ' pts' + (sc.complete ? '' : ' · ' + sc.done + ' ligne' + (sc.done > 1 ? 's' : '') + ' sur ' + sc.rows))]),
    h('button', {type: 'button', class: 'primary', disabled: i >= students.length - 1, onclick: () => { screen.student = students[i + 1].id; render(); }}, 'Suivant →')));
  return panel;
}
// Curseur d'une ligne : parcourt toutes les valeurs possibles du degré 1 au degré 4 (pas de la grille).
// Glisser choisit le degré et les points ; la note se met à jour en direct, la grille au relâchement.
function rowSlider(ev, s, r, m, disabled) {
  const g = ev.grid, opts = r.cells.flatMap((c, d) => cellSteps(c, g.step).map(pts => ({deg: d + 1, pts})));
  const idx = m ? Math.max(0, opts.findIndex(o => o.deg === m.deg && o.pts === m.pts)) : -1;
  const pos = i => opts.length > 1 ? i / (opts.length - 1) * 100 : 0;
  // Fond du curseur coloré par degré
  const stops = [];
  DEGREES.forEach(d => { const i = opts.map((o, k) => o.deg === d ? k : -1).filter(k => k >= 0); if (!i.length) return;
    const a = i[0] ? (pos(i[0] - 1) + pos(i[0])) / 2 : 0, b = i.at(-1) < opts.length - 1 ? (pos(i.at(-1)) + pos(i.at(-1) + 1)) / 2 : 100;
    stops.push(`var(--d${d}) ${a}%`, `var(--d${d}) ${b}%`); });
  const text = o => o ? 'Degré ' + o.deg + ', ' + fmt(o.pts) + ' point' + (o.pts > 1 ? 's' : '') : 'non évalué';
  const input = h('input', {type: 'range', min: 0, max: Math.max(0, opts.length - 1), step: 1, value: Math.max(0, idx), disabled,
    class: idx < 0 ? 'unset' : '', style: `--track:linear-gradient(90deg,${stops.join(',')})`,
    'aria-label': (r.label || 'Ligne') + ' : degré et points', 'aria-valuetext': text(opts[idx])});
  // Bulle des points, au-dessus du curseur
  const bubble = h('span', {class: 'sl-bubble', 'aria-hidden': 'true', hidden: idx < 0});
  const marks = h('div', {class: 'sl-marks', 'aria-hidden': 'true'}, ...DEGREES.map(d => { const i = opts.findIndex(o => o.deg === d); return i < 0 ? null : h('span', {style: `left:${pos(i)}%`, 'data-deg': d}, 'D' + d); }));
  const show = i => {
    const o = opts[i]; if (!o) return;
    bubble.hidden = false; bubble.textContent = fmt(o.pts);
    bubble.style.left = `calc(16px + (100% - 32px) * ${pos(i) / 100})`;
    for (const sp of marks.children) sp.classList.toggle('on', Number(sp.dataset.deg) === o.deg);
    // Surbrillance de la case du degré pendant le glissement
    const row = input.closest('.eg-row');
    row?.querySelectorAll('.eg-cell').forEach((c, k) => c.classList.toggle('on', k === o.deg - 1));
    const lbl = row?.querySelector('.eg-label .small'); if (lbl) lbl.textContent = fmt(o.pts) + ' / ' + fmt(rowMax(r)) + ' pts';
  };
  const apply = () => {
    const o = opts[Number(input.value)]; if (!o) return;
    markOf(ev, s.id).rows[r.id] = {deg: o.deg, pts: o.pts}; ev.marks[s.id].updatedAt = Date.now(); save();
    input.classList.remove('unset'); input.setAttribute('aria-valuetext', text(o)); show(Number(input.value));
    const sc = scoreOf(ev, ev.marks[s.id]), t = document.getElementById('liveTotal');
    if (t && !sc.status) { t.querySelector('.note').textContent = fmt(sc.max ? sc.sum / sc.max * 20 : null) + ' / 20'; t.querySelector('.muted').textContent = fmt(sc.sum) + ' / ' + fmt(sc.max) + ' pts' + (sc.complete ? '' : ' · ' + sc.done + ' ligne' + (sc.done > 1 ? 's' : '') + ' sur ' + sc.rows); }
  };
  input.oninput = apply;
  input.onchange = () => { apply(); render(); };
  // Un simple toucher sur un curseur encore vide choisit la valeur touchée
  input.onpointerup = () => { if (input.classList.contains('unset')) { apply(); render(); } };
  const wrap = h('div', {class: 'eg-slider'}, h('div', {class: 'sl-track'}, bubble, input, marks));
  if (idx >= 0) requestAnimationFrame(() => show(idx));
  return wrap;
}
function touch(ev, sid) { ev.marks[sid].updatedAt = Date.now(); save(); render(); }

function renderSummary(ev, students) {
  const rows = students.map(s => ({s, sc: scoreOf(ev, ev.marks[s.id], s), mark: ev.marks[s.id]}));
  const notes = rows.filter(r => r.sc.complete).map(r => r.sc.note);
  const avg = notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : null;
  app.append(h('div', {class: 'kpis'},
    h('div', {class: 'kpi'}, h('span', {}, 'Élèves notés'), h('b', {}, notes.length + ' / ' + students.length)),
    h('div', {class: 'kpi'}, h('span', {}, 'Moyenne'), h('b', {}, fmt(avg))),
    h('div', {class: 'kpi'}, h('span', {}, 'Note la plus basse'), h('b', {}, notes.length ? fmt(Math.min(...notes)) : '—')),
    h('div', {class: 'kpi'}, h('span', {}, 'Note la plus haute'), h('b', {}, notes.length ? fmt(Math.max(...notes)) : '—'))));
  const g = ev.grid;
  const table = h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Élève'), ...g.rows.map(r => h('th', {class: 'num'}, (r.label || 'Ligne') + ' /' + fmt(rowMax(r)))), h('th', {class: 'num'}, 'Total /' + fmt(gridMax(g))), h('th', {class: 'num'}, 'Note /20'))));
  const body = h('tbody');
  for (const {s, sc, mark} of rows) body.append(h('tr', {onclick: () => { screen.summary = false; screen.student = s.id; render(); }},
    h('th', {}, studentName(s)), ...g.rows.map(r => h('td', {class: 'num'}, mark?.rows?.[r.id] ? fmt(mark.rows[r.id].pts) + ' (D' + mark.rows[r.id].deg + ')' : '')),
    h('td', {class: 'num'}, sc.status || !sc.done ? '' : fmt(sc.sum)), h('td', {class: 'num strong'}, sc.status ? STATUS[sc.status] : sc.complete ? fmt(sc.note) : '…')));
  table.append(body);
  app.append(h('div', {class: 'table-box'}, table));
  app.append(h('div', {class: 'toolbar'}, h('button', {type: 'button', onclick: () => {
    const head = ['Nom', 'Prénom', ...g.rows.map(r => r.label || 'Ligne'), 'Total', 'Note /20', 'Commentaire'];
    const lines = rows.map(({s, sc, mark}) => [s.last, s.first, ...g.rows.map(r => mark?.rows?.[r.id] ? fmt(mark.rows[r.id].pts) : ''), sc.status ? '' : fmt(sc.sum), sc.status ? STATUS[sc.status] : sc.complete ? fmt(sc.note) : '', mark?.comment || '']);
    const csv = [head, ...lines].map(l => l.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(';')).join('\n');
    const a = h('a', {href: URL.createObjectURL(new Blob(['﻿' + csv], {type: 'text/csv'})), download: (ev.title + '-' + (classOf(ev.classId)?.name || '')).replace(/[^\w-]+/g, '_') + '.csv'});
    document.body.append(a); a.click(); a.remove();
  }}, 'Exporter en CSV')));
}

/* ---------- Contexte d'EPS Manager : classes, cycles, infos en direct ----------
   Écrit par eps-adapter.js dans une clé à part (jamais dans les données de l'application). */
const CTX_KEY = 'eps-evaluations-context';
function readCtx() { try { return JSON.parse(localStorage.getItem(CTX_KEY) || 'null'); } catch { return null; } }
function applyCtx() {
  const c = readCtx(); if (!c) return;
  db.classes = c.classes || db.classes; db.cycles = c.cycles || [];
  // Nouvelle ouverture depuis EPS Manager : classe et date de la séance mises en avant (une seule fois).
  if (c.openedAt && c.openedAt !== db.ui.openedAt) {
    db.ui.openedAt = c.openedAt; db.ui.focusClassId = c.focusClassId || ''; db.ui.focusDate = c.focusDate || '';
    if (c.focusClassId) { db.ui.tab = 'evals'; screen = {name: 'home'}; }
    db.ui.pendingOpen = c.focusClassId && c.focusDate ? c.focusClassId + '|' + c.focusDate : '';
  }
}
const normTxt = v => String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
// Grille liée à un cycle : son activité correspond au nom du cycle (« Badminton » ↔ « Badminton · match »).
const gridForCycle = cy => { const n = normTxt(cy.name); return db.grids.find(g => g.activity && (n.includes(normTxt(g.activity)) || normTxt(g.activity).includes(n))); };
// Évaluation finale créée pour chaque cycle en cours ou à venir dont l'activité a une grille, à la date de sa dernière séance.
function ensureCycleEvals() {
  const t = today(); let n = 0;
  for (const cy of db.cycles || []) {
    if (cy.end < t || !cy.sessions?.length || !classOf(cy.classId) || db.evals.some(e => e.cycleId === cy.id)) continue;
    const g = gridForCycle(cy); if (!g) continue;
    const last = cy.sessions.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).at(-1);
    db.evals.push({id: uid(), gridId: g.id, grid: clone(g), classId: cy.classId, title: g.name || cy.name, date: last.date, cycleId: cy.id, cycleName: cy.name, auto: true, createdAt: Date.now(), marks: {}});
    n++;
  }
  return n;
}
// À l'ouverture depuis une séance : l'évaluation de cette classe à cette date s'ouvre directement.
function openPending() {
  const p = db.ui.pendingOpen; if (!p) return; db.ui.pendingOpen = '';
  const [cid, date] = p.split('|'), ev = db.evals.find(e => e.classId === cid && e.date === date);
  if (ev) screen = {name: 'eval', id: ev.id};
}
function liveTags(ev, s) {
  const out = [], isToday = ev.date === today();
  if (s.inapt) out.push(h('span', {class: 'tag warn', title: s.inapt}, 'Inapt.'));
  if (isToday && s.attendance && s.attendance !== 'Présent') out.push(h('span', {class: 'tag ' + (s.attendance === 'Absent' ? 'bad' : 'warn')}, s.attendance === 'Absent' ? 'Absent' : s.attendance));
  return out;
}
function liveNotices(ev, s, mark, setStatus) {
  const out = [], isToday = ev.date === today();
  if (s.inapt) out.push(h('p', {class: 'notice'}, 'Inaptitude en cours : ' + s.inapt, !mark.status ? h('button', {type: 'button', class: 'small', onclick: () => setStatus('exempt')}, 'Dispensé') : null));
  if (isToday && s.attendance === 'Absent') out.push(h('p', {class: 'notice bad'}, 'Absent à l’appel du jour.', !mark.status ? h('button', {type: 'button', class: 'small', onclick: () => setStatus('absent')}, 'Marquer absent') : null));
  else if (isToday && ['Certificat médical', 'Mot des parents'].includes(s.attendance)) out.push(h('p', {class: 'notice'}, s.attendance + ' à l’appel du jour.', !mark.status ? h('button', {type: 'button', class: 'small', onclick: () => setStatus('exempt')}, 'Dispensé') : null));
  return out;
}

/* ---------- Barème de performance : temps, distance ou points → note ----------
   Un barème filles et un barème garçons ; entre deux paliers, la note est interpolée puis arrondie au pas choisi. */
const PERF_UNITS = {time: 'Temps (min:s)', dist: 'Distance (m)', num: 'Nombre ou points'};
function parsePerf(v, unit) {
  const s = String(v ?? '').trim().replace(',', '.');
  if (!s) return null;
  if (unit === 'time') {
    const m = s.match(/^(\d+)\s*(?:[:'’]|min|m)\s*(\d{1,2}(?:\.\d+)?)?\s*(?:''|"|s)?$/i);
    if (m) return Number(m[1]) * 60 + Number(m[2] || 0);
    const n = Number(s.replace(/s$/i, '')); return isFinite(n) ? n : null;
  }
  const n = Number(s); return isFinite(n) ? n : null;
}
function fmtPerf(x, unit) {
  if (x == null) return '';
  if (unit === 'time') { const m = Math.floor(x / 60), s = x - m * 60; return m + ':' + (s < 10 ? '0' : '') + String(Math.round(s * 10) / 10).replace('.', ','); }
  return String(Math.round(x * 100) / 100).replace('.', ',');
}
function perfNote(g, sex, perf) {
  const rows = (g.table?.[sex] || []).map(r => ({p: parsePerf(r.p, g.unit), n: num(r.n)})).filter(r => r.p != null).sort((a, b) => a.p - b.p);
  if (perf == null || !rows.length) return null;
  let n;
  if (perf <= rows[0].p) n = rows[0].n; else if (perf >= rows.at(-1).p) n = rows.at(-1).n;
  else { const i = rows.findIndex(r => r.p >= perf), a = rows[i - 1], b = rows[i]; n = a.n + (b.n - a.n) * (perf - a.p) / (b.p - a.p); }
  const st = num(g.step) || 0.5; return Math.max(0, Math.round(n / st) * st);
}
const perfSex = (mark, s) => mark?.sex || (s?.sex === 'F' ? 'F' : s?.sex === 'G' ? 'G' : '');
function perfScore(ev, mark, s) {
  const g = ev.grid, max = num(g.max) || 20;
  if (!mark || mark.status) return {complete: false, note: null, status: mark?.status || '', done: 0, rows: 1, sum: 0, max};
  const perf = parsePerf(mark.perf, g.unit), sex = perfSex(mark, s), n = perf != null && sex ? perfNote(g, sex, perf) : null;
  return {complete: n != null, note: n != null ? round(n / max * 20) : null, raw: n, perf, sex, status: '', done: perf != null ? 1 : 0, rows: 1, sum: n || 0, max, needSex: perf != null && !sex};
}
function samplePerf() {
  const t = rows => rows.map(([p, n]) => ({p, n}));
  return {id: uid(), type: 'perf', name: 'Demi-fond · 1000 m', activity: 'Demi-fond', unit: 'time', max: 20, step: '0.5', createdAt: Date.now(),
    table: {F: t([['4:00', 20], ['4:30', 16], ['5:00', 12], ['5:30', 8], ['6:15', 4]]), G: t([['3:30', 20], ['4:00', 16], ['4:30', 12], ['5:00', 8], ['5:45', 4]])}};
}
function newPerf() { return {id: uid(), type: 'perf', name: '', activity: '', unit: 'time', max: 20, step: '0.5', createdAt: Date.now(), table: {F: [{p: '', n: 20}, {p: '', n: 10}], G: [{p: '', n: 20}, {p: '', n: 10}]}}; }
const better = g => g.unit === 'time' ? 'Plus le temps est court, meilleure est la note.' : 'Plus la valeur est grande, meilleure est la note.';
function renderPerfEditor() {
  const g = screen.draft;
  app.append(h('header', {class: 'top'},
    h('div', {}, h('button', {type: 'button', class: 'link', onclick: () => { if (confirm('Quitter sans enregistrer les modifications ?')) go({name: 'home'}); }}, '← Mes grilles'), h('h1', {}, screen.isNew ? 'Nouveau barème de performance' : 'Modifier le barème')),
    h('div', {class: 'actions'}, h('button', {type: 'button', class: 'primary', onclick: savePerf}, 'Enregistrer le barème'))));
  app.append(h('section', {class: 'panel form row3'},
    h('label', {}, 'Nom', h('input', {value: g.name, placeholder: 'ex. Demi-fond · 1000 m', oninput: e => { g.name = e.target.value; }})),
    h('label', {}, 'Activité (lie le barème aux cycles du même nom)', h('input', {value: g.activity, placeholder: 'ex. Demi-fond', oninput: e => { g.activity = e.target.value; }})),
    h('label', {}, 'Performance', h('select', {onchange: e => { g.unit = e.target.value; render(); }}, ...Object.entries(PERF_UNITS).map(([v, l]) => h('option', {value: v, selected: g.unit === v}, l)))),
    h('label', {}, 'Note sur', h('input', {type: 'number', min: 1, step: 1, value: g.max, onchange: e => { g.max = num(e.target.value) || 20; }})),
    h('label', {}, 'Arrondi de la note', h('select', {onchange: e => { g.step = e.target.value; }}, ...STEPS.map(([v, l]) => h('option', {value: v, selected: String(g.step) === v}, 'au ' + l + ' près'))))));
  app.append(h('p', {class: 'muted help'}, 'Indiquez des paliers (performance → note). ' + better(g) + ' Entre deux paliers, la note est calculée proportionnellement ; au-delà du meilleur palier, la note maximale, en deçà du dernier, la note la plus basse.' + (g.unit === 'time' ? ' Temps au format 3:25 (minutes:secondes).' : '')));
  const tables = h('div', {class: 'perf-tables'});
  for (const [sex, title] of [['F', 'Filles'], ['G', 'Garçons']]) {
    const rows = g.table[sex] ||= [];
    const box = h('section', {class: 'panel'}, h('h2', {}, title));
    const tb = h('table', {class: 'perf-edit'}, h('thead', {}, h('tr', {}, h('th', {}, PERF_UNITS[g.unit]), h('th', {}, 'Note /' + fmt(num(g.max) || 20)), h('th', {}, ''))));
    const body = h('tbody');
    rows.forEach((r, i) => body.append(h('tr', {},
      h('td', {}, h('input', {value: r.p, inputMode: g.unit === 'time' ? 'text' : 'decimal', placeholder: g.unit === 'time' ? '3:25' : '4,5', 'aria-label': title + ' : performance ' + (i + 1), oninput: e => { r.p = e.target.value; }})),
      h('td', {}, h('input', {type: 'number', step: 0.5, min: 0, value: r.n, 'aria-label': title + ' : note ' + (i + 1), oninput: e => { r.n = num(e.target.value); }})),
      h('td', {}, h('button', {type: 'button', class: 'danger', 'aria-label': 'Supprimer le palier', onclick: () => { rows.splice(i, 1); render(); }}, '✕')))));
    tb.append(body);
    box.append(tb, h('div', {class: 'actions'}, h('button', {type: 'button', onclick: () => { rows.push({p: '', n: 0}); render(); }}, '+ Ajouter un palier'),
      sex === 'G' ? h('button', {type: 'button', onclick: () => { g.table.G = clone(g.table.F); render(); }}, 'Copier le barème filles') : null));
    tables.append(box);
  }
  app.append(tables);
  function savePerf() {
    if (!g.name.trim()) return toast('Donnez un nom au barème.');
    const ok = ['F', 'G'].some(x => (g.table[x] || []).filter(r => parsePerf(r.p, g.unit) != null).length >= 2);
    if (!ok) return toast('Indiquez au moins deux paliers valides.');
    g.updatedAt = Date.now();
    const i = db.grids.findIndex(x => x.id === g.id); if (i < 0) db.grids.push(g); else db.grids[i] = g;
    const n = ensureCycleEvals();
    if (save()) { toast('Barème enregistré.' + (n ? ' Évaluation finale créée pour ' + n + ' cycle' + (n > 1 ? 's' : '') + ' lié' + (n > 1 ? 's' : '') + '.' : '')); go({name: 'home'}); }
  }
}
// Saisie d'un barème de performance : toute la classe dans un tableau.
function renderPerfEval(ev, students) {
  const g = ev.grid;
  app.append(h('p', {class: 'muted'}, better(g) + ' Saisissez la performance' + (g.unit === 'time' ? ' (ex. 3:25)' : '') + ' : la note se calcule avec le barème filles ou garçons.'));
  const tb = h('table', {class: 'perf-eval'}, h('thead', {}, h('tr', {}, h('th', {}, 'Élève'), h('th', {}, 'Sexe'), h('th', {}, PERF_UNITS[g.unit]), h('th', {}, 'Situation'), h('th', {class: 'num'}, 'Note /20'))));
  const body = h('tbody');
  for (const s of students) {
    const mark = ev.marks[s.id] || {}, sc = perfScore(ev, mark, s);
    const noteCell = h('td', {class: 'num strong'}, sc.status ? STATUS[sc.status] : sc.complete ? fmt(sc.note) : sc.needSex ? 'Sexe ?' : '');
    const refresh = () => { const r = perfScore(ev, ev.marks[s.id], s); noteCell.textContent = r.status ? STATUS[r.status] : r.complete ? fmt(r.note) : r.needSex ? 'Sexe ?' : ''; updateAvg(); };
    const sexSel = h('select', {'aria-label': 'Sexe de ' + studentName(s), onchange: e => { markOf(ev, s.id).sex = e.target.value; ev.marks[s.id].updatedAt = Date.now(); save(); refresh(); }},
      h('option', {value: ''}, '—'), h('option', {value: 'F', selected: perfSex(mark, s) === 'F'}, 'F'), h('option', {value: 'G', selected: perfSex(mark, s) === 'G'}, 'G'));
    const perfIn = h('input', {value: mark.perf || '', inputMode: g.unit === 'time' ? 'text' : 'decimal', placeholder: g.unit === 'time' ? 'min:s' : '', 'aria-label': 'Performance de ' + studentName(s), disabled: !!mark.status,
      oninput: e => { markOf(ev, s.id).perf = e.target.value; ev.marks[s.id].updatedAt = Date.now(); save(); refresh(); }});
    const st = h('select', {'aria-label': 'Situation de ' + studentName(s), onchange: e => { markOf(ev, s.id).status = e.target.value; ev.marks[s.id].updatedAt = Date.now(); save(); render(); }},
      ...Object.entries(STATUS).map(([k, l]) => h('option', {value: k, selected: (mark.status || '') === k}, l)));
    body.append(h('tr', {}, h('th', {}, studentName(s), ' ', ...liveTags(ev, s)), h('td', {}, sexSel), h('td', {}, perfIn), h('td', {}, st), noteCell));
  }
  tb.append(body);
  const avgBox = h('p', {class: 'muted'});
  const updateAvg = () => { const n = students.map(s => perfScore(ev, ev.marks[s.id], s)).filter(r => r.complete).map(r => r.note); avgBox.textContent = n.length + ' / ' + students.length + ' élèves notés' + (n.length ? ' · moyenne ' + fmt(n.reduce((a, b) => a + b, 0) / n.length) + ' / 20' : ''); };
  app.append(h('div', {class: 'table-box'}, tb), avgBox); updateAvg();
}
function perfCSV(ev, students) {
  const g = ev.grid, lines = students.map(s => { const m = ev.marks[s.id] || {}, r = perfScore(ev, m, s); return [s.last, s.first, perfSex(m, s), m.status ? STATUS[m.status] : fmtPerf(r.perf, g.unit), r.complete ? fmt(r.note) : '']; });
  const csv = [['Nom', 'Prénom', 'Sexe', PERF_UNITS[g.unit], 'Note /20'], ...lines].map(l => l.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(';')).join('\n');
  const a = h('a', {href: URL.createObjectURL(new Blob(['\ufeff' + csv], {type: 'text/csv'})), download: (ev.title + '-' + (classOf(ev.classId)?.name || '')).replace(/[^\w-]+/g, '_') + '.csv'});
  document.body.append(a); a.click(); a.remove();
}

applyCtx();
if (ensureCycleEvals()) toast('Évaluation finale créée pour les cycles liés à vos grilles.');
save();
openPending();
render();
