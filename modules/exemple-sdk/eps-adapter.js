// EPS Manager — liaison standard pour les applications qui utilisent eps-sdk.js.
// À copier tel quel dans le dossier de l'application, avec "adapter": "eps-adapter.js" dans eps-module.json.
// beforeOpen : dépose le contexte (classes, élèves, classe ou séance choisie) pour l'application.
// collect    : reprend les notes, résultats et résumés envoyés par l'application avec le SDK.
const contextKey = ctx => 'eps-manager:context:' + ctx.module.id;
const outboxKey = ctx => 'eps-manager:outbox:' + ctx.module.id;

export async function beforeOpen(ctx) {
  // Photos gardées si elles sont légères, pour ne pas saturer le stockage du navigateur.
  const classes = ctx.classes.map(c => ({...c, students: c.students.map(s => ({...s, photo: s.photo && s.photo.length <= 40000 ? s.photo : ''}))}));
  const data = {version: 1, module: ctx.module, today: ctx.today, focus: ctx.focus, classes, sessions: ctx.sessions, updatedAt: Date.now()};
  try { localStorage.setItem(contextKey(ctx), JSON.stringify(data)); }
  catch { localStorage.setItem(contextKey(ctx), JSON.stringify({...data, classes: classes.map(c => ({...c, students: c.students.map(s => ({...s, photo: ''}))}))})); }
}

export async function collect(ctx) {
  let o = {};
  try { o = JSON.parse(localStorage.getItem(outboxKey(ctx)) || 'null') || {}; } catch {}
  return {grades: Object.values(o.grades || {}), results: Object.values(o.results || {}), summaries: Object.values(o.summaries || {}), studentUpdates: []};
}
