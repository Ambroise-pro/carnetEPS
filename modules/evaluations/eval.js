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
window.addEventListener('storage', e => { if (e.key === KEY) { db = load(); render(); } });

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
function scoreOf(ev, mark) {
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
  if (screen.name === 'grid') return renderGridEditor();
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
    h('button', {type: 'button', onclick: () => go({name: 'grid', draft: sampleGrid(), isNew: true})}, 'Partir d’un exemple'));
  app.append(bar);
  if (!db.grids.length) { app.append(h('p', {class: 'empty'}, 'Aucune grille. Créez votre première grille : des lignes, quatre degrés, des critères et des points dans chaque case.')); return; }
  const list = h('div', {class: 'cards'});
  for (const g of db.grids.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))) {
    const used = db.evals.filter(e => e.gridId === g.id).length;
    list.append(h('article', {class: 'card'},
      h('h3', {}, g.name || 'Grille sans nom'),
      h('p', {class: 'muted'}, [g.activity, g.rows.length + ' ligne' + (g.rows.length > 1 ? 's' : ''), 'barème sur ' + fmt(gridMax(g)) + ' pts', used ? used + ' évaluation' + (used > 1 ? 's' : '') : ''].filter(Boolean).join(' · ')),
      h('div', {class: 'actions'},
        h('button', {type: 'button', class: 'primary', onclick: () => assignDialog(g)}, 'Évaluer une classe'),
        h('button', {type: 'button', onclick: () => go({name: 'grid', draft: clone(g)})}, 'Modifier'),
        h('button', {type: 'button', onclick: () => { const c = {...clone(g), id: uid(), name: (g.name || 'Grille') + ' (copie)', createdAt: Date.now(), updatedAt: Date.now()}; db.grids.push(c); save(); render(); toast('Grille dupliquée.'); }}, 'Dupliquer'),
        h('button', {type: 'button', class: 'danger', onclick: () => { if (!confirm(`Supprimer la grille « ${g.name || 'sans nom'} » ? Les évaluations déjà faites restent disponibles.`)) return; db.grids = db.grids.filter(x => x !== g); save(); render(); }}, 'Supprimer'))));
  }
  app.append(list);
}

function assignDialog(grid) {
  if (!db.classes.length) { toast('Aucune classe : ouvrez le module depuis EPS Manager pour recevoir vos classes.'); return; }
  const grids = h('select', {}, ...db.grids.map(g => h('option', {value: g.id, selected: g === grid}, g.name || 'Grille sans nom')));
  const cls = h('select', {}, ...db.classes.map(c => h('option', {value: c.id, selected: c.id === db.ui.focusClassId}, c.name)));
  const title = h('input', {value: grid?.name || db.grids[0]?.name || '', required: true});
  const date = h('input', {type: 'date', value: db.ui.focusDate || today(), required: true});
  grids.onchange = () => { title.value = db.grids.find(g => g.id === grids.value)?.name || ''; };
  dialog('Nouvelle évaluation', h('div', {class: 'form'},
    h('label', {}, 'Grille', grids), h('label', {}, 'Classe', cls), h('label', {}, 'Titre', title), h('label', {}, 'Date', date)),
  close => [h('button', {type: 'button', onclick: close}, 'Annuler'), h('button', {type: 'button', class: 'primary', onclick: () => {
    const g = db.grids.find(x => x.id === grids.value); if (!g || !g.rows.length) return toast('Choisissez une grille avec au moins une ligne.');
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
    const st = studentsOf(ev.classId), scores = st.map(s => scoreOf(ev, ev.marks[s.id])), done = scores.filter(s => s.complete);
    const avg = done.length ? done.reduce((a, s) => a + s.note, 0) / done.length : null;
    list.append(h('article', {class: 'card clickable', onclick: () => go({name: 'eval', id: ev.id})},
      h('h3', {}, ev.title),
      h('p', {class: 'muted'}, [classOf(ev.classId)?.name || 'Classe supprimée', dayLabel(ev.date), done.length + ' / ' + st.length + ' élèves notés', avg != null ? 'moyenne ' + fmt(avg) + ' / 20' : ''].filter(Boolean).join(' · ')),
      h('div', {class: 'progress'}, h('i', {style: `width:${st.length ? done.length / st.length * 100 : 0}%`}))));
  }
  app.append(list);
}

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
    h('label', {}, 'Activité', h('input', {value: g.activity, placeholder: 'ex. Badminton', oninput: e => { g.activity = e.target.value; }})),
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
    if (save()) { toast('Grille enregistrée.'); go({name: 'home'}); }
  }
}

/* ---------- Évaluation d'une classe ---------- */
function renderEval() {
  const ev = db.evals.find(e => e.id === screen.id);
  if (!ev) return go({name: 'home'});
  const students = studentsOf(ev.classId);
  if (!screen.student || !students.some(s => s.id === screen.student)) screen.student = students.find(s => !scoreOf(ev, ev.marks[s.id]).complete && !ev.marks[s.id]?.status)?.id || students[0]?.id;
  app.append(h('header', {class: 'top'},
    h('div', {}, h('button', {type: 'button', class: 'link', onclick: () => go({name: 'home'})}, '← Évaluations'),
      h('h1', {}, ev.title), h('p', {class: 'muted'}, [classOf(ev.classId)?.name, dayLabel(ev.date), 'barème ' + fmt(gridMax(ev.grid)) + ' pts → /20'].filter(Boolean).join(' · '))),
    h('div', {class: 'actions'},
      h('button', {type: 'button', 'aria-pressed': String(!!screen.summary), onclick: () => { screen.summary = !screen.summary; render(); }}, screen.summary ? 'Retour à la saisie' : 'Bilan de la classe'),
      h('button', {type: 'button', class: 'danger', onclick: () => { if (!confirm('Supprimer cette évaluation et toutes ses notes ?')) return; db.evals = db.evals.filter(e => e !== ev); save(); go({name: 'home'}); }}, 'Supprimer'))));
  if (!students.length) { app.append(h('p', {class: 'empty'}, 'Cette classe n’a pas d’élèves. Ouvrez le module depuis EPS Manager pour mettre à jour la liste.')); return; }
  if (screen.summary) return renderSummary(ev, students);

  const layout = h('div', {class: 'eval-layout'});
  const list = h('nav', {class: 'students', 'aria-label': 'Élèves'});
  for (const s of students) {
    const sc = scoreOf(ev, ev.marks[s.id]);
    list.append(h('button', {type: 'button', class: 'student' + (s.id === screen.student ? ' on' : '') + (sc.complete ? ' done' : ''), onclick: () => { screen.student = s.id; render(); }},
      h('span', {class: 'name'}, studentName(s)),
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
    grid.append(row);
  }
  panel.append(grid);
  panel.append(h('label', {class: 'comment'}, 'Commentaire (facultatif)', h('textarea', {rows: 2, value: mark.comment || '', onchange: e => { markOf(ev, s.id).comment = e.target.value; ev.marks[s.id].updatedAt = Date.now(); save(); }})));
  const sc = scoreOf(ev, mark);
  panel.append(h('footer', {class: 'total-bar'},
    h('button', {type: 'button', disabled: i <= 0, onclick: () => { screen.student = students[i - 1].id; render(); }}, '← Précédent'),
    h('div', {class: 'total'}, sc.status ? h('strong', {}, STATUS[sc.status]) : [h('strong', {class: 'note'}, fmt(sc.max ? sc.sum / sc.max * 20 : null) + ' / 20'), h('span', {class: 'muted'}, fmt(sc.sum) + ' / ' + fmt(sc.max) + ' pts' + (sc.complete ? '' : ' · ' + sc.done + ' ligne' + (sc.done > 1 ? 's' : '') + ' sur ' + sc.rows))]),
    h('button', {type: 'button', class: 'primary', disabled: i >= students.length - 1, onclick: () => { screen.student = students[i + 1].id; render(); }}, 'Suivant →')));
  return panel;
}
function touch(ev, sid) { ev.marks[sid].updatedAt = Date.now(); save(); render(); }

function renderSummary(ev, students) {
  const rows = students.map(s => ({s, sc: scoreOf(ev, ev.marks[s.id]), mark: ev.marks[s.id]}));
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

render();
