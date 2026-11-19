// Outils communs aux tests de bout en bout : serveur statique, navigateur, données fictives.
// Aucune dépendance à installer : Node 20+ et Playwright (paquet « playwright » déjà présent sur la machine de test).
import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {readFile as readText} from 'node:fs/promises';
import {fixture, TODAY} from './fixtures/donnees-fictives.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');

const MIME = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.wasm': 'application/wasm'};

// Sert le dépôt tel quel, comme un hébergement statique (GitHub Pages, Vercel…).
export function startServer() {
  return new Promise(ok => {
    const server = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        if (p.endsWith('/')) p += 'index.html';
        const file = path.join(ROOT, p);
        if (!file.startsWith(ROOT) || !(await stat(file)).isFile()) throw 0;
        res.writeHead(200, {'Content-Type': MIME[path.extname(file)] || 'application/octet-stream'});
        res.end(await readFile(file));
      } catch { res.writeHead(404); res.end('404'); }
    });
    server.listen(0, '127.0.0.1', () => ok({server, url: `http://127.0.0.1:${server.address().port}/`}));
  });
}

// Ouvre un navigateur, une page à la date fixe du jeu de données et collecte les erreurs JavaScript.
// `seed: true` charge les données fictives avant de rendre la main.
export async function open({seed = true, serviceWorkers = 'block', viewport = {width: 1180, height: 820}} = {}) {
  const {server, url} = await startServer();
  const browser = await chromium.launch();
  const context = await browser.newContext({viewport, serviceWorkers, acceptDownloads: true});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => d.accept());
  const close = async () => { await browser.close(); server.close(); };
  try {
    await page.clock.setFixedTime(new Date(TODAY + 'T10:00:00'));
    await page.goto(url);
    await page.waitForSelector('.version', {state: 'attached'});
    if (seed) await seedData(page);
  } catch (e) { await close(); throw e; } // ne jamais laisser un navigateur ouvert : la suite resterait bloquée
  return {page, context, browser, url, errors, close};
}

// Écrit les données fictives dans IndexedDB et localStorage, puis recharge l'application.
// Les données sont écrites depuis une page vide de la même origine : l'application n'est pas ouverte
// et ne peut donc pas réécrire ses réglages pendant le chargement.
export async function seedData(page, data = fixture()) {
  const appUrl = new URL('./', page.url()).href;
  await page.goto(appUrl + '__page-vide-de-test__');
  await page.evaluate(async fx => {
    const req = r => new Promise((ok, no) => { r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
    const db = await req(indexedDB.open('eps-manager'));
    await new Promise((ok, no) => {
      const t = db.transaction(db.objectStoreNames, 'readwrite');
      for (const s of db.objectStoreNames) { t.objectStore(s).clear(); for (const r of fx.stores[s] || []) t.objectStore(s).put(r); }
      t.oncomplete = ok; t.onerror = t.onabort = () => no(t.error);
    });
    db.close();
    localStorage.clear();
    for (const [k, v] of Object.entries(fx.localStorage)) localStorage.setItem(k, v);
    for (const d of fx.otherDatabases) {
      await new Promise(ok => { const r = indexedDB.deleteDatabase(d.name); r.onsuccess = r.onerror = r.onblocked = ok; });
      const x = await new Promise((ok, no) => {
        const r = indexedDB.open(d.name, 1);
        r.onupgradeneeded = () => { for (const s of d.stores) r.result.createObjectStore(s.name, s.keyPath ? {keyPath: s.keyPath} : {}); };
        r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error);
      });
      for (const s of d.stores) await new Promise((ok, no) => {
        const t = x.transaction(s.name, 'readwrite');
        for (const [key, value] of s.records) {
          let v = value;
          if (value && value.__blobText != null) { const {__blobText, ...rest} = value; v = {...rest, blob: new Blob([__blobText], {type: 'text/plain'})}; }
          s.keyPath ? t.objectStore(s.name).put(v) : t.objectStore(s.name).put(v, key);
        }
        t.oncomplete = ok; t.onerror = () => no(t.error);
      });
      x.close();
    }
  }, data);
  await page.goto(appUrl);
  await page.waitForSelector('.version', {state: 'attached'});
  await settle(page);
}

// Laisse l'application finir son démarrage (synchronisation des applications, rappels) et ferme les fenêtres ouvertes.
export async function settle(page, ms = 1800) {
  await page.waitForTimeout(ms);
  await closeDialogs(page);
}
export async function closeDialogs(page) {
  for (const d of await page.locator('dialog[open]').all()) await d.evaluate(x => x.close()).catch(() => {});
}

// Lit le contenu brut de la base de l'application : {magasin: [enregistrements]}.
export function readStores(page) {
  return page.evaluate(async () => {
    const req = r => new Promise((ok, no) => { r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
    const db = await req(indexedDB.open('eps-manager'));
    const out = {};
    for (const s of db.objectStoreNames) out[s] = await req(db.transaction(s).objectStore(s).getAll());
    db.close();
    return out;
  });
}

export async function go(page, hash) {
  await page.evaluate(h => { location.hash = h; }, hash);
  await page.waitForTimeout(300);
  await closeDialogs(page);
}

// ---------- Sauvegarde : outils partagés ----------
// Contenu des autres bases IndexedDB et du localStorage, Blob compris (lu en texte).
export const readExtra = page => page.evaluate(async () => {
  const req = r => new Promise((ok, no) => { r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
  const out = {localStorage: {}, dbs: {}};
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); out.localStorage[k] = localStorage.getItem(k); }
  for (const name of ['mon-tableau-blanc-documents', 'chrono-eps']) {
    const db = await req(indexedDB.open(name)); out.dbs[name] = {};
    for (const s of db.objectStoreNames) {
      const st = db.transaction(s).objectStore(s);
      const [keys, vals] = await Promise.all([req(st.getAllKeys()), req(st.getAll())]);
      out.dbs[name][s] = await Promise.all(vals.map(async (v, i) => [keys[i], v && v.blob instanceof Blob ? {...v, blob: 'Blob:' + await v.blob.text()} : v]));
    }
    db.close();
  }
  return out;
});
export const sortById = o => Object.fromEntries(Object.entries(o).map(([k, l]) => [k, [...l].sort((a, b) => a.id.localeCompare(b.id))]));
export const IGNORED_KEYS = ['eps-last-backup', 'eps-backup-snooze']; // horodatages mis à jour par l'export lui-même

export async function exportFile(page) {
  await go(page, 'backup');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('button', {hasText: 'Télécharger le fichier'}).first().click()]);
  const file = await dl.path();
  return {file, json: JSON.parse(await readText(file, 'utf8'))};
}
export async function restoreFile(page, file) {
  await go(page, 'backup');
  await page.setInputFiles('input[type=file][accept*=json]', file);
  await page.waitForTimeout(1500);
}
export async function wipeEverything(page) {
  await page.evaluate(async () => {
    const req = r => new Promise((ok, no) => { r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
    const db = await req(indexedDB.open('eps-manager'));
    await new Promise(ok => { const t = db.transaction(db.objectStoreNames, 'readwrite'); for (const s of db.objectStoreNames) t.objectStore(s).clear(); t.oncomplete = ok; });
    db.close();
    for (const n of ['mon-tableau-blanc-documents', 'chrono-eps']) await new Promise(ok => { const r = indexedDB.deleteDatabase(n); r.onsuccess = r.onerror = r.onblocked = ok; });
    localStorage.clear();
  });
  await page.reload(); await settle(page, 800);
}

