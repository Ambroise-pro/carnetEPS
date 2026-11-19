#!/usr/bin/env node
// Génère offline.json : fichiers des applications associées (modules/) et des bibliothèques (vendor/)
// que le service worker met en cache d'avance, avec une empreinte par fichier (seuls les fichiers modifiés
// sont retéléchargés). À relancer après toute modification de modules/ ou vendor/ :
//   node tools/offline-list.mjs           (écrit offline.json)
//   node tools/offline-list.mjs --check   (vérifie qu'il est à jour ; code de sortie 1 sinon)
import {readdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['modules', 'vendor'];
// Inutiles hors ligne : documentation, licences, configuration d'hébergement, service workers propres aux applications.
const SKIP = [/\.md$/i, /(^|\/)LICENSE[^/]*$/i, /(^|\/)vercel\.json$/, /^modules\/[^/]+\/sw\.js$/, /(^|\/)\.[^/]+$/];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(path.join(ROOT, dir), {withFileTypes: true})) {
    const rel = dir + '/' + e.name;
    if (e.isDirectory()) out.push(...await walk(rel));
    else if (!SKIP.some(r => r.test(rel))) out.push(rel);
  }
  return out;
}

export async function build() {
  const files = (await Promise.all(DIRS.map(walk))).flat().sort();
  const list = [];
  let bytes = 0;
  for (const f of files) {
    const buf = await readFile(path.join(ROOT, f));
    bytes += buf.length;
    list.push([f, createHash('sha256').update(buf).digest('hex').slice(0, 16)]);
  }
  return {format: 1, bytes, files: list};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = path.join(ROOT, 'offline.json');
  const json = JSON.stringify(await build(), null, 0).replace(/\],\[/g, '],\n[') + '\n';
  if (process.argv.includes('--check')) {
    const current = await readFile(target, 'utf8').catch(() => '');
    if (current !== json) { console.error('offline.json n’est pas à jour : lancez « node tools/offline-list.mjs ».'); process.exit(1); }
    console.log('offline.json à jour.');
  } else {
    await writeFile(target, json);
    const o = JSON.parse(json);
    console.log(`offline.json : ${o.files.length} fichiers, ${(o.bytes / 1048576).toFixed(1)} Mo.`);
  }
}
