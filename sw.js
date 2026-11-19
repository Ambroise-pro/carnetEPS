// Reporter ici le numéro APP_VERSION de app.js à chaque livraison.
const VERSION=32,cache='eps-v'+VERSION,FILES='eps-files';
const shell=['./','index.html','app.js','style.css','manifest.webmanifest','icon.png','icon512.png','trombi.js','vendor/pdfjs/pdf.mjs','vendor/pdfjs/pdf.worker.mjs','board/board.js','board/board.css','board/host.js','board/host.css'];
// Shell : mis en cache à l'installation (obligatoire). Applications associées et bibliothèques (offline.json) :
// cache durable « eps-files », gardé d'une version à l'autre ; seuls les fichiers nouveaux ou modifiés sont téléchargés,
// en arrière-plan, sans jamais retarder l'ouverture de l'application.
self.oninstall=e=>{self.skipWaiting();e.waitUntil(caches.open(cache).then(c=>c.addAll(shell)))};
self.onactivate=e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==cache&&k!==FILES).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));syncFiles()};
self.onmessage=e=>{if(e.data==='sync-files')e.waitUntil(syncFiles())};
const isFile=url=>{const p=url.slice(self.registration.scope.length);return p.startsWith('modules/')||p.startsWith('vendor/')||p==='offline.json'};
let syncing=null;
function syncFiles(){return syncing??=(async()=>{try{
 const base=self.registration.scope,res=await fetch(base+'offline.json',{cache:'no-cache'});if(!res.ok)return;
 const c=await caches.open(FILES),list=(await res.clone().json()).files,want=new Map(list);
 await c.put(base+'offline.json',res);
 const meta=await c.match(base+'offline-state.json'),state=meta?await meta.json():{};
 const save=()=>c.put(base+'offline-state.json',new Response(JSON.stringify(state),{headers:{'Content-Type':'application/json'}}));
 for(const req of await c.keys()){const rel=req.url.slice(base.length);if(rel!=='offline.json'&&rel!=='offline-state.json'&&!want.has(rel)){await c.delete(req);delete state[rel]}}
 const todo=list.filter(([f,h])=>state[f]!==h);let i=0,n=0;
 const worker=async()=>{while(i<todo.length){const [f,h]=todo[i++];try{const r=await fetch(base+f,{cache:'no-cache'});if(r.ok){await c.put(base+f,r);state[f]=h;if(++n%20===0)await save()}}catch{}}};
 await Promise.all([worker(),worker(),worker(),worker()]);await save();
}catch{}finally{syncing=null}})()}
// Réseau d'abord (pour toujours avoir la dernière version), cache si hors ligne.
self.onfetch=e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(fetch(e.request,{cache:'no-cache'}).then(res=>{if(res.ok){const copy=res.clone();caches.open(isFile(e.request.url)?FILES:cache).then(c=>c.put(e.request,copy))}return res}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||(e.request.mode==='navigate'&&!isFile(e.request.url)?caches.match('index.html'):Response.error()))));
};
