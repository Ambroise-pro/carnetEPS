'use strict';
/* Page élève : auto-évaluation ou co-évaluation à partir du QR code affiché par le professeur.
   La grille et la liste de la classe arrivent dans l'adresse (après #) ; la réponse repart dans un QR code
   que le professeur scanne. Aucune donnée n'est envoyée à un serveur ni conservée sur le téléphone. */
const app = document.getElementById('app');
const fmt = n => String(Math.round(n * 100) / 100).replace('.', ',');
function h(tag, attrs = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) { if (v == null || v === false) continue; if (k.startsWith('on')) n[k] = v; else if (k === 'class') n.className = v; else if (k in n) n[k] = v; else n.setAttribute(k, v); }
  for (const c of children.flat()) if (c != null && c !== false) n.append(c instanceof Node ? c : String(c));
  return n;
}
let data = null, state = {step: 'who', me: '', mode: 'self', target: '', picks: {}};

async function start() {
  try { data = await EPSShare.unpack(location.hash.slice(1)); if (!data?.g?.r) throw Error(); }
  catch { app.append(h('div', {class: 'panel'}, h('h1', {}, 'QR code illisible'), h('p', {class: 'muted'}, 'Scannez à nouveau le QR code affiché par votre professeur.'))); return; }
  render();
}
const nameOf = id => data.s.find(s => s[0] === id)?.[1] || '';
function render() {
  app.replaceChildren();
  app.append(h('header', {class: 'top'}, h('div', {}, h('h1', {}, data.t), h('p', {class: 'muted'}, data.c))));
  if (state.step === 'who') {
    const sel = h('select', {}, h('option', {value: ''}, 'Choisis ton nom…'), ...data.s.map(([id, n]) => h('option', {value: id, selected: id === state.me}, n)));
    const mode = h('div', {class: 'segmented', role: 'group', 'aria-label': 'Type d’évaluation'},
      ...[['self', 'Je m’évalue'], ['peer', 'J’évalue un camarade']].map(([k, l]) => h('button', {type: 'button', 'aria-pressed': String(state.mode === k), onclick: () => { state.mode = k; state.me = sel.value; render(); }}, l)));
    const target = state.mode === 'peer' ? h('select', {}, h('option', {value: ''}, 'Choisis le camarade évalué…'), ...data.s.map(([id, n]) => h('option', {value: id, selected: id === state.target}, n))) : null;
    app.append(h('section', {class: 'panel form'}, h('label', {}, 'Qui es-tu ?', sel), mode, target ? h('label', {}, 'Camarade évalué', target) : null,
      h('button', {type: 'button', class: 'primary', onclick: () => {
        state.me = sel.value; state.target = target ? target.value : state.me;
        if (!state.me) return alert('Choisis ton nom.');
        if (state.mode === 'peer' && (!state.target || state.target === state.me)) return alert('Choisis un camarade (pas toi).');
        state.step = 'grid'; render(); scrollTo(0, 0);
      }}, 'Commencer')));
    return;
  }
  if (state.step === 'grid') {
    app.append(h('p', {class: 'notice'}, state.mode === 'self' ? 'Auto-évaluation de ' + nameOf(state.me) : nameOf(state.me) + ' évalue ' + nameOf(state.target)));
    app.append(h('p', {class: 'muted'}, 'Pour chaque ligne, touche la case qui correspond le mieux. Degré 1 : le plus faible, degré 4 : le meilleur.'));
    data.g.r.forEach((r, i) => {
      const box = h('section', {class: 'panel eleve-row'}, h('h2', {}, r.l || 'Ligne ' + (i + 1)));
      r.c.forEach(([text], d) => box.append(h('button', {type: 'button', class: 'eleve-cell d' + (d + 1) + (state.picks[i] === d + 1 ? ' on' : ''), 'aria-pressed': String(state.picks[i] === d + 1), onclick: () => { state.picks[i] = d + 1; render(); }},
        h('strong', {}, 'Degré ' + (d + 1)), text ? h('span', {}, text) : null)));
      app.append(box);
    });
    const done = data.g.r.every((_, i) => state.picks[i]);
    app.append(h('div', {class: 'toolbar'}, h('button', {type: 'button', onclick: () => { state.step = 'who'; render(); }}, '← Retour'),
      h('button', {type: 'button', class: 'primary', disabled: !done, onclick: () => { state.step = 'done'; render(); scrollTo(0, 0); }}, done ? 'Terminer' : 'Réponds à toutes les lignes')));
    return;
  }
  // Réponse : QR code à montrer au professeur
  const answer = {v: 1, e: data.e, by: state.me, for: state.target, m: state.mode, r: data.g.r.map((_, i) => state.picks[i]), at: Date.now()};
  const box = h('section', {class: 'panel center'}, h('h2', {}, 'Montre ce QR code à ton professeur'), h('div', {class: 'qr'}, 'Préparation…'));
  app.append(box);
  const max = data.g.r.reduce((s, r) => s + Math.max(...r.c.map(c => Number(c[2]) || 0)), 0), sum = data.g.r.reduce((s, r, i) => s + (Number(r.c[state.picks[i] - 1]?.[2]) || 0), 0);
  if (max) box.append(h('p', {class: 'muted'}, 'Note estimée : ' + fmt(sum / max * 20) + ' / 20'));
  EPSShare.pack(answer).then(async code => {
    const text = EPSShare.PREFIX + code, svg = await EPSShare.qrSvg(text, '');
    const q = box.querySelector('.qr'); q.innerHTML = svg || ''; if (!svg) q.textContent = 'QR code impossible : donne ce code au professeur.';
    box.append(h('details', {}, h('summary', {}, 'Afficher le code (si le QR ne passe pas)'), h('textarea', {rows: 3, readOnly: true, value: text})));
  });
  app.append(h('div', {class: 'toolbar'}, h('button', {type: 'button', onclick: () => { state = {step: 'who', me: '', mode: 'self', target: '', picks: {}}; render(); }}, 'Nouvelle évaluation')));
}
start();
