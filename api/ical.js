// Relais pour le lien iCal de Pronote (fonction serverless Vercel : /api/ical?url=…).
// Pronote n'autorise pas la lecture de ses calendriers depuis une page web (pas d'en-tête CORS) :
// ce relais les récupère côté serveur et les renvoie à EPS Manager. Il n'accepte que des liens iCal Pronote,
// ne conserve rien et ne journalise pas l'adresse (qui contient la clé personnelle du calendrier).
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  let target;
  try { target = new URL(String(req.query.url || '')); } catch { return res.status(400).send('Lien invalide.'); }
  const pronoteHost = /(^|\.)index-education\.net$/i.test(target.hostname) || /(^|\.)pronote\./i.test(target.hostname) || /pronote/i.test(target.hostname);
  if (target.protocol !== 'https:' || !pronoteHost || !/\/ical\//i.test(target.pathname)) return res.status(400).send('Seuls les liens iCal Pronote (https) sont acceptés.');
  try {
    const r = await fetch(target, {redirect: 'follow', headers: {'User-Agent': 'EPS-Manager-iCal'}});
    if (!r.ok) return res.status(502).send('Pronote a répondu ' + r.status + '.');
    const text = await r.text();
    if (text.length > 5_000_000 || !/BEGIN:VCALENDAR/.test(text)) return res.status(502).send('Réponse inattendue de Pronote.');
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    return res.status(200).send(text);
  } catch { return res.status(502).send('Pronote est injoignable.'); }
}
