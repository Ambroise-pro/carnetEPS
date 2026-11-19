/* Évaluations — partage par QR code (auto-évaluation et co-évaluation).
   Utilisé par la page du professeur (eval.js) et la page élève (eleve.html).
   Les données voyagent dans le QR code lui-même (compressées) : rien n'est envoyé à un serveur. */
'use strict';
const EPSShare = (() => {
  const PREFIX = 'EPSEVAL1:';
  const b64url = bytes => { let s = ''; for (const b of bytes) s += String.fromCharCode(b); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const fromB64url = str => { const s = atob(str.replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(s, c => c.charCodeAt(0)); };
  async function pack(obj) {
    const json = JSON.stringify(obj);
    if (window.CompressionStream) {
      const buf = await new Response(new Blob([json]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer();
      return 'z' + b64url(new Uint8Array(buf));
    }
    return 'j' + b64url(new TextEncoder().encode(json));
  }
  async function unpack(str) {
    const s = String(str || '').trim().replace(/^.*#/, '').replace(PREFIX, ''), bytes = fromB64url(s.slice(1));
    if (s[0] === 'z') return JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text());
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  let libs = null;
  function loadLibs(base) {
    return libs ??= Promise.all(['vendor/qrcode.js', 'vendor/jsQR.js'].map(src => new Promise((ok, no) => {
      if ((src.includes('qrcode') && window.qrcode) || (src.includes('jsQR') && window.jsQR)) return ok();
      const s = document.createElement('script'); s.src = (base || '') + src; s.onload = ok; s.onerror = no; document.head.append(s);
    })));
  }
  // QR code en SVG (correction d'erreurs L pour loger plus de données) ; null si trop long.
  async function qrSvg(text, base) {
    await loadLibs(base);
    try { const q = window.qrcode(0, 'L'); q.addData(text, 'Byte'); q.make(); return q.createSvgTag({cellSize: 4, margin: 2, scalable: true}); }
    catch { return null; }
  }
  // Lecture d'un QR code à la caméra ; onCode(texte) est appelé à chaque code lu (même code ignoré 3 s).
  async function scanner(container, onCode, base) {
    await loadLibs(base);
    const video = document.createElement('video'); video.setAttribute('playsinline', ''); video.muted = true;
    const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d', {willReadFrequently: true});
    container.append(video);
    const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}, audio: false});
    video.srcObject = stream; await video.play();
    let last = '', lastAt = 0, stop = false;
    const tick = () => {
      if (stop) return;
      if (video.readyState >= 2) {
        canvas.width = video.videoWidth; canvas.height = video.videoHeight; ctx.drawImage(video, 0, 0);
        const r = window.jsQR(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height, {inversionAttempts: 'dontInvert'});
        if (r?.data && (r.data !== last || Date.now() - lastAt > 3000)) { last = r.data; lastAt = Date.now(); onCode(r.data); }
      }
      requestAnimationFrame(tick);
    };
    tick();
    return () => { stop = true; stream.getTracks().forEach(t => t.stop()); video.remove(); };
  }
  return {PREFIX, pack, unpack, qrSvg, scanner, loadLibs};
})();
