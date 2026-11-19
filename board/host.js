'use strict';
// Fonctions attendues par board.js (MonTableauBlanc), fournies ici par EPS Manager.
// app.js renseigne window.EPSBoardHost pour enregistrer les tableaux dans la base de l'application.
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
const uid = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const today = () => new Date().toLocaleDateString('sv-SE');
function notify(message) { window.EPSBoardHost?.notify(message); }
function save() { return window.EPSBoardHost ? window.EPSBoardHost.save() : false; }
function render() { window.EPSBoardHost?.render(); }
function download(name, data, type) {
  const url = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], {type}));
  const link = document.createElement('a');
  link.href = url; link.download = name;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
function validRosterPortrait(value) {
  return typeof value === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value);
}
window.RosterPortraits = {
  photo(portrait) {
    const el = document.createElement(validRosterPortrait(portrait) ? 'img' : 'span');
    el.className = 'pf-roster-photo';
    if (el.tagName === 'IMG') { el.src = portrait; el.alt = ''; }
    else { el.setAttribute('aria-hidden', 'true'); el.textContent = '—'; }
    return el;
  },
};
