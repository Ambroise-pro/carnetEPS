const cache='eps-shell-4';
self.oninstall=e=>e.waitUntil(caches.open(cache).then(c=>c.addAll(['./','index.html','app.js','style.css','manifest.webmanifest','icon.png','icon512.png','trombi.js','vendor/pdfjs/pdf.mjs','vendor/pdfjs/pdf.worker.mjs'])));
self.onactivate=e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==cache).map(k=>caches.delete(k)))));
self.onfetch=e=>{if(e.request.method==='GET'&&new URL(e.request.url).origin===location.origin)e.respondWith(caches.open(cache).then(async c=>(await c.match(e.request))||fetch(e.request)))};
