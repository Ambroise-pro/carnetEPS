// Liaison Poules tournantes ↔ EPS Manager (application associée, kit SDK 1.0).
// Hors d'EPS Manager, ce fichier ne fait rien : l'application fonctionne exactement comme avant.
// Données envoyées (choix de l'enseignant, 19/11/2026) — et seulement celles-ci :
//   1. classement par élève → résultat dans la séance et la fiche élève : « Poule 1 · 2e / 8 · 13 pts · +7 · 5 matchs » ;
//   2. résumé de la poule → résumé dans la séance de la classe (classement complet).
// Aucune note sur 20 n'est envoyée.
(function () {
  const sdk = window.EPSManager;
  if (!sdk || !sdk.available()) return;

  const LINK = 'poules-eps-link';      // poule en cours : identifiant, classe, date, numéro, nom affiché → élève
  const COUNT = 'poules-eps-count';    // nombre de poules déjà lancées par classe et par date (numérotation)
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? d; } catch { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const date = () => sdk.focusSession()?.date || sdk.today();

  // Noms affichés : le prénom, avec l'initiale du nom si deux élèves de la classe ont le même prénom.
  function displayNames(students) {
    const n = {};
    for (const s of students) n[norm(s.first)] = (n[norm(s.first)] || 0) + 1;
    return new Map(students.map(s => [s.id, (n[norm(s.first)] > 1 && s.last ? `${s.first} ${s.last[0].toUpperCase()}.` : s.first || s.last).trim()]));
  }
  const absent = s => /absent/i.test(s.attendance || '');

  // ---------- Choix des joueurs dans la classe ----------
  const container = document.getElementById('player-names-container');
  const countSelect = document.getElementById('player-count');
  const panel = document.createElement('div');
  panel.id = 'eps-panel';
  panel.className = 'mb-6 p-4 rounded-xl border border-indigo-200 bg-indigo-50';
  const wrap = container.parentNode;          // bloc « 4. Noms des joueurs »
  wrap.parentNode.insertBefore(panel, wrap);
  let classId = sdk.focus()?.classId || (sdk.classes()[0] && sdk.classes()[0].id) || '';
  const checked = new Set();

  function render() {
    const classes = sdk.classes();
    const cls = classes.find(c => c.id === classId) || classes[0];
    if (!cls) { panel.innerHTML = '<p class="text-sm text-slate-600">Aucune classe dans EPS Manager.</p>'; return; }
    classId = cls.id;
    const names = displayNames(cls.students);
    panel.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
        <label class="text-lg font-semibold text-indigo-800">Joueurs de la poule (EPS Manager)
          <select id="eps-class" class="ml-2 p-2 border border-slate-300 rounded-lg text-base font-normal text-slate-800">
            ${classes.map(c => `<option value="${esc(c.id)}"${c.id === cls.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}
          </select>
        </label>
        <span id="eps-count" class="text-sm font-medium ${checked.size >= 6 && checked.size <= 9 ? 'text-green-700' : 'text-slate-600'}">${checked.size} coché(s) · de 6 à 9 joueurs</span>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        ${cls.students.map(s => `
          <label class="flex items-center gap-2 p-2 rounded-lg bg-white border ${absent(s) ? 'border-red-200 text-slate-400' : 'border-slate-200'} cursor-pointer">
            <input type="checkbox" data-eps-student="${esc(s.id)}" class="w-5 h-5"${checked.has(s.id) ? ' checked' : ''}>
            <span>${esc(names.get(s.id))}${absent(s) ? ' · absent' : ''}${s.inapt ? ' · inapte' : ''}</span>
          </label>`).join('')}
      </div>
      <p class="text-xs text-slate-500 mt-3">Les absents à l'appel ne sont pas proposés d'office. Les résultats de la poule seront envoyés dans la séance d'EPS Manager.</p>`;
    panel.querySelector('#eps-class').onchange = e => { classId = e.target.value; checked.clear(); render(); fill(); };
    panel.querySelectorAll('[data-eps-student]').forEach(box => box.onchange = () => {
      box.checked ? checked.add(box.dataset.epsStudent) : checked.delete(box.dataset.epsStudent);
      if (checked.size > 9) { checked.delete(box.dataset.epsStudent); box.checked = false; }
      render(); fill();
    });
  }
  // Recopie les élèves cochés dans les champs de l'application (nombre de joueurs + noms).
  function fill() {
    const cls = sdk.classById(classId);
    if (!cls) return;
    const names = displayNames(cls.students);
    const list = cls.students.filter(s => checked.has(s.id)).map(s => names.get(s.id));
    if (list.length >= 6 && list.length <= 9) { countSelect.value = String(list.length); countSelect.dispatchEvent(new Event('change')); }
    container.querySelectorAll('input').forEach((input, i) => { input.value = list[i] || ''; });
  }
  render();

  // ---------- Lien poule ↔ classe au lancement ----------
  document.getElementById('start-button').addEventListener('click', () => {
    if (!allPlayers.length) return;                               // lancement refusé par l'application (champ vide…)
    const cls = sdk.classById(classId);
    if (!cls) return;
    const names = displayNames(cls.students), map = {};
    for (const s of cls.students) if (checked.has(s.id)) map[names.get(s.id)] = s.id;
    if (!allPlayers.every(p => map[p.name])) { write(LINK, null); return; } // noms modifiés à la main : pas d'envoi
    const d = date(), counts = read(COUNT, {}), k = classId + '@' + d;
    counts[k] = (counts[k] || 0) + 1;
    write(COUNT, counts);
    write(LINK, {id: Date.now().toString(36), classId, date: d, pool: counts[k], names: map});
    sync();
  });

  // ---------- Envoi du classement et du résumé ----------
  function sync() {
    const link = read(LINK, null);
    if (!link || !lastScoreboard.length || !lastScoreboard.every(p => link.names[p.name])) return;
    if (!lastScoreboard.some(p => p.totalMatchesPlayed > 0)) return; // rien à envoyer avant le premier match
    const label = 'Poules tournantes · Poule ' + link.pool, n = lastScoreboard.length;
    lastScoreboard.forEach((p, i) => {
      const ga = p.goalAverage > 0 ? '+' + p.goalAverage : String(p.goalAverage);
      sdk.result({key: `poules:${link.id}:${link.names[p.name]}`, studentId: link.names[p.name], label,
        value: `${i === 0 ? '1er' : i + 1 + 'e'} / ${n} · ${p.totalPoints} pts · ${ga} · ${p.totalMatchesPlayed} match${p.totalMatchesPlayed > 1 ? 's' : ''}`, unit: '', date: link.date});
    });
    sdk.summary({key: `poules:${link.id}`, classId: link.classId, date: link.date,
      text: label + ' : ' + lastScoreboard.map((p, i) => `${i + 1}. ${p.name} ${p.totalPoints} pts`).join(' · ')});
  }
  // Le classement est recalculé à chaque score saisi, corrigé ou annulé : on renvoie alors (mêmes clés, pas de doublon).
  const original = window.renderScoreboard;
  window.renderScoreboard = function () { original.apply(this, arguments); sync(); };
  sdk.onChange(() => { if (document.getElementById('screen-setup')?.classList.contains('active')) render(); });
})();
