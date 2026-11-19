/* EPS Manager — publie les notes calculées par Scan CCF (mêmes barèmes, mêmes réglages)
   pour que l'application principale puisse les reprendre. Ne modifie aucune donnée de Scan CCF. */
(function () {
  "use strict";
  var SCAN_KEY = "df-scan-ccf-v2", OUT = "df-eps-export-v1", last = "";
  function read(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function noteOf(type, st) {
    try {
      if (type === "ccf" && typeof window.score === "function") { var s = window.score(st); return s && isFinite(s.total) ? s.total : null; }
      if (type === "exam500" && typeof window.DFScore500 === "function") { var r = window.DFScore500(st); return r && isFinite(r.total20) ? r.total20 : null; }
    } catch (e) {}
    return null;
  }
  function day(ex) { return ex.lessonDate || new Date(ex.createdAt || Date.now()).toLocaleDateString("sv-SE"); }
  function run() {
    var db = read(SCAN_KEY); if (!db) return;
    var grades = [];
    (db.groups || []).forEach(function (g) {
      (g.sessions || []).forEach(function (ex) {
        if (ex.type !== "ccf" && ex.type !== "exam500") return;
        (ex.students || []).forEach(function (st) {
          var n = noteOf(ex.type, st); if (n == null) return;
          grades.push({ groupId: g.id, groupName: g.name, exerciseId: ex.id, date: day(ex), type: ex.type, label: ex.label || "",
            studentId: st.id, last: st.last, first: st.first, note: Math.round(n * 100) / 100 });
        });
      });
    });
    var json = JSON.stringify(grades); if (json === last) return; last = json;
    try { localStorage.setItem(OUT, JSON.stringify({ updatedAt: Date.now(), grades: grades })); } catch (e) {}
  }
  window.addEventListener("load", function () { setTimeout(run, 800); });
  document.addEventListener("visibilitychange", run);
  setInterval(run, 4000);
})();
