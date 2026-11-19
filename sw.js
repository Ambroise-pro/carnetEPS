// Reporter ici le numéro APP_VERSION de app.js à chaque livraison.
const VERSION=22,cache='eps-v'+VERSION;
const shell=['./','index.html','app.js','style.css','manifest.webmanifest','icon.png','icon512.png','trombi.js','vendor/pdfjs/pdf.mjs','vendor/pdfjs/pdf.worker.mjs','board/board.js','board/board.css','board/host.js','board/host.css'];
self.oninstall=e=>{self.skipWaiting();e.waitUntil(caches.open(cache).then(c=>c.addAll(shell)))};
self.onactivate=e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==cache).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
// Réseau d'abord (pour toujours avoir la dernière version), cache si hors ligne.
self.onfetch=e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(fetch(e.request,{cache:'no-cache'}).then(res=>{if(res.ok){const copy=res.clone();caches.open(cache).then(c=>c.put(e.request,copy))}return res}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
};
