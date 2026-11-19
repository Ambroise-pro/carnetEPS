// Numéro de version affiché dans l'application : l'incrémenter à chaque nouvelle livraison
// (et le reporter dans sw.js pour renouveler le cache hors ligne).
const APP_VERSION=31;

// ---------- Structure de l'application ----------
const pages={home:'Tableau de bord',calendar:'Calendrier',sessions:'Séances',attendance:'Appel',classes:'Classes',students:'Élèves',groups:'Groupes',cycles:'Cycles',restrictions:'Inaptitudes',grades:'Évaluations',comments:'Appréciations',observations:'Observations',planning:'Paramètres du calendrier',absences:'Absences',settings:'Paramètres',student:'Fiche élève',session:'Séance',boards:'Tableaux',board:'Tableau',module:'Application',apps:'Applications',averages:'Moyennes',years:'Années scolaires',backup:'Sauvegardes'};
const navLabels={planning:'Emploi du temps'};
const navGroups=[
 ['Quotidien',['home','calendar','sessions','attendance','boards','apps']],
 ['Mes élèves',['classes','students','groups','cycles','restrictions']],
 ['Suivi',['absences','grades','averages','comments','observations']],
 ['Réglages',['settings','planning','years','backup']]
];
const icons={
 home:'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
 calendar:'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2',
 sessions:'M5 4h14v16H5zM9 9h6M9 13h6M9 17h3',
 attendance:'M4 12l5 5L20 6',
 planning:'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M16 4v4M10 10v4M18 16v4',
 years:'M12 3v18M5 7h14M5 17h14',
 classes:'M4 5h16v14H4zM4 10h16M10 10v9',
 students:'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-4 3-6 7-6s7 2 7 6M17 11a3 3 0 1 0 0-6M22 21c0-3-2-5-5-5.5',
 groups:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
 cycles:'M21 12a9 9 0 1 1-3-6.7M21 4v5h-5',
 restrictions:'M12 3l9 16H3zM12 10v4M12 17v.5',
 grades:'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z',
 comments:'M4 5h16v11H8l-4 4z',
 observations:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
 backup:'M12 4v11M7 10l5 5 5-5M5 20h14',
 modules:'M9 3h6v4a2 2 0 1 0 4 0h2v6h-2a2 2 0 1 0 0 4h2v4H3V3h2a2 2 0 1 0 4 0z',
 averages:'M4 20V10M10 20V4M16 20v-7M22 20H2',
 lock:'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4',
 apps:'M9 3h6v4a2 2 0 1 0 4 0h2v6h-2a2 2 0 1 0 0 4h2v4H3V3h2a2 2 0 1 0 4 0z',
 boards:'M3 4h18v12H3zM8 20h8M12 16v4M7 9h.01M12 11h.01M16 8h.01',
 absences:'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4M9.5 13.5l5 5M14.5 13.5l-5 5',
 settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
 student:'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',
 timetable:'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
 holidays:'M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5L19 5M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
 edit:'M4 20h4L19 9l-4-4L4 16z',
 trash:'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
 close:'M6 6l12 12M18 6L6 18',
 prev:'M15 6l-6 6 6 6',
 next:'M9 6l6 6-6 6'
};
const stores=['years','classes','students','groups','cycles','sessions','attendance','restrictions','grades','comments','observations','holidays','timetable','settings','results','boards'];
const enums={
 duration:[['30','30 min'],['45','45 min'],['55','55 min'],['60','1 h'],['90','1 h 30'],['110','1 h 50'],['120','2 h'],['165','2 h 45'],['180','3 h'],['240','4 h']],
 weekday:[['1','Lundi'],['2','Mardi'],['3','Mercredi'],['4','Jeudi'],['5','Vendredi'],['6','Samedi']],
 freq:[['all','Toutes les semaines'],['A','Semaine A'],['B','Semaine B']],
 sex:[['','Non précisé'],['F','Fille'],['G','Garçon']]
};
// [clé, libellé, type (store, enum, date, time, number ou texte), valeur par défaut]
const fields={
 years:[['name','Année scolaire'],['start','Début','date'],['end','Fin','date']],
 classes:[['year','Année','years'],['name','Nom de la classe']],
 students:[['classId','Classe','classes'],['first','Prénom'],['last','Nom'],['sex','Sexe','sex'],['birth','Date de naissance','date'],['needs','Besoins particuliers (PAI, PAP…)']],
 groups:[['classId','Classe','classes'],['name','Nom du groupe']],
 cycles:[['classId','Classe','classes'],['name','Activité / cycle'],['start','Début','date'],['end','Fin','date']],
 sessions:[['classId','Classe','classes'],['date','Date','date'],['time','Heure de début','time'],['duration','Durée','duration','110'],['name','Contenu de séance']],
 restrictions:[['student','Élève','students'],['start','Début','date'],['end','Fin','date'],['name','Adaptation de pratique']],
 grades:[['student','Élève','students'],['name','Épreuve'],['grade','Note sur 20','number']],
 comments:[['student','Élève','students'],['name','Appréciation']],
 observations:[['student','Élève','students'],['name','Observation']],
 timetable:[['year','Année','years'],['classId','Classe','classes'],['weekday','Jour','weekday','1'],['time','Heure de début','time','08:00'],['duration','Durée','duration','110'],['freq','Fréquence','freq','all'],['name','Intitulé','text','EPS']],
 holidays:[['year','Année','years'],['name','Vacances'],['start','Premier jour','date'],['end','Dernier jour','date']]
};
const addTitles={timetable:'Ajouter un cours',holidays:'Ajouter une période de vacances',sessions:'Ajouter une séance ponctuelle',cycles:'Créer un cycle'};
const listTitles={timetable:'Cours',holidays:'Périodes'};
const nouns={boards:['tableau','tableaux'],results:['résultat d’application','résultats d’application'],years:['année','années'],classes:['classe','classes'],students:['élève','élèves'],groups:['groupe','groupes'],cycles:['cycle','cycles'],sessions:['séance','séances'],restrictions:['inaptitude','inaptitudes'],grades:['note','notes'],comments:['appréciation','appréciations'],observations:['observation','observations'],timetable:['cours de l’emploi du temps','cours de l’emploi du temps'],holidays:['période de vacances','périodes de vacances'],attendance:['mention d’appel','mentions d’appel']};
const deps={years:[['classes','year'],['holidays','year'],['timetable','year']],classes:[['students','classId'],['groups','classId'],['cycles','classId'],['sessions','classId'],['timetable','classId'],['boards','classId']],students:[['restrictions','student'],['grades','student'],['comments','student'],['observations','student'],['attendance','student'],['results','student']],sessions:[['attendance','sessionId'],['results','sessionId']]};
// Appel : tout le monde est présent par défaut, seules les exceptions sont enregistrées.
// Chaque mention a une couleur et un symbole, pour être repérée d'un coup d'œil dans les résumés.
const statusInfo={
 'Présent':{k:'P',bg:'#1b4d3e',fg:'#fff',icon:'M5 12.5l4.5 4.5L19 7.5'},
 'Absent':{k:'A',bg:'#b3261e',fg:'#fff',icon:'M6.5 6.5l11 11M17.5 6.5l-11 11'},
 'Retard':{k:'R',bg:'#f2c14e',fg:'#10261f',icon:'M12 7.5V12l3 2M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z'},
 'Oubli de tenue':{k:'T',bg:'#e8833a',fg:'#10261f',icon:'M9 3.5L3.5 6.5l2 4 2.5-1v10.5h8V9.5l2.5 1 2-4L15 3.5c-.5 1.6-1.6 2.5-3 2.5s-2.5-.9-3-2.5z'},
 'Oubli de chaussures':{k:'C',bg:'#7b4bc4',fg:'#fff',icon:'M3 17.5V8.5h4.5l1.5 3 4.5 1.5 6 1.5a1.5 1.5 0 0 1 1.5 1.5v1.5zM3 20.5h18M9 11.5l1-2M11.5 12.5l1-2'},
 'Inaptitude':{k:'I',bg:'#2f5bea',fg:'#fff',icon:'M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z'},
 'Mot des parents':{k:'MP',bg:'#0f7b74',fg:'#fff',icon:'M3.5 6.5h17v11h-17zM3.5 7l8.5 6 8.5-6'}
};
const statuses=Object.keys(statusInfo);
// L'appel a deux volets : la présence (un seul choix) et les mentions complémentaires (plusieurs possibles).
const PRESENCE=['Présent','Absent','Retard'],EXTRAS=statuses.filter(x=>!PRESENCE.includes(x));
// Enregistrement : {status: présence, extras: 'Oubli de tenue,Mot des parents'} ; les anciens appels (une seule mention) restent lisibles.
function attOf(sid,pid){
 const a=data.attendance.find(x=>x.id===sid+'/'+pid);if(!a)return {presence:'Présent',extras:[]};
 const norm=x=>x==='Certificat médical'?'Inaptitude':x;
 const ex=(a.extras||'').split(',').map(norm).filter(x=>EXTRAS.includes(x));
 const st=norm(a.status);
 return PRESENCE.includes(st)?{presence:st,extras:ex}:{presence:'Présent',extras:[...new Set([st,...ex])].filter(x=>EXTRAS.includes(x))};
}
const marksOf=a=>[...(a.presence!=='Présent'?[a.presence]:[]),...a.extras];
// Contenu pédagogique d'une séance (champs texte enregistrés sur la séance).
const contentFields=[['objective','Objectifs','Ce que les élèves doivent apprendre ou améliorer'],['material','Matériel et organisation','Terrains, groupes, matériel à prévoir'],['warmup','Échauffement',''],['main','Situations d’apprentissage','Exercices, consignes, critères de réussite, variantes'],['end','Retour au calme / bilan',''],['notes','Notes après la séance','Ce qui a marché, à reprendre la prochaine fois']];
const hasContent=s=>contentFields.some(([k])=>s?.[k]?.trim());
const cancelReasons=['Jour férié','Sortie scolaire','Voyage scolaire','Grève','Absence de l’enseignant','Formation','Conseil de classe / réunion','Examens / brevet blanc','Installation indisponible','Météo'];

// ---------- Données locales (IndexedDB) ----------
const db=await new Promise((ok,no)=>{const r=indexedDB.open('eps-manager',5);r.onupgradeneeded=()=>{for(const k of stores)if(!r.result.objectStoreNames.contains(k))r.result.createObjectStore(k,{keyPath:'id'})};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
const data={};
async function load(){await Promise.all(stores.map(k=>new Promise((ok,no)=>{const r=db.transaction(k).objectStore(k).getAll();r.onsuccess=()=>{data[k]=r.result;ok()};r.onerror=()=>no(r.error)})))}
function transaction(names,fn){return new Promise((ok,no)=>{const t=db.transaction(names,'readwrite');t.oncomplete=ok;t.onabort=()=>no(t.error);try{fn(t)}catch(e){t.abort();no(e)}})}
// Ancien format d'appel (chaque élève renseigné) → nouveau format (présent par défaut, exceptions seulement).
async function migrateAttendance(){
 const legacy=data.attendance.filter(a=>['Non renseigné','En retard','Excusé'].includes(a.status)||(a.status==='Présent'&&!a.extras));
 if(!legacy.length)return;
 const called=new Set(data.attendance.filter(a=>a.status!=='Non renseigné').map(a=>a.sessionId));
 await transaction(['attendance','sessions'],t=>{
  for(const a of legacy){if(a.status==='Présent'||a.status==='Non renseigné')t.objectStore('attendance').delete(a.id);else t.objectStore('attendance').put({...a,status:a.status==='En retard'?'Retard':'Mot des parents'})}
  for(const s of data.sessions)if(called.has(s.id)&&!s.called)t.objectStore('sessions').put({...s,called:'1'});
 });
 await load();
}

// ---------- Utilitaires ----------
const view=document.querySelector('#view'),toast=document.querySelector('[role=status]'),search=document.querySelector('.search input');
const svgNS='http://www.w3.org/2000/svg';
function el(tag,text,parent,cls){const n=document.createElement(tag);if(text!=null&&text!=='')n.textContent=text;if(cls)n.className=cls;parent?.append(n);return n}
function icon(name,parent){const s=document.createElementNS(svgNS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');const p=document.createElementNS(svgNS,'path');p.setAttribute('d',icons[name]);s.append(p);parent.append(s);return s}
function iconButton(name,text,parent,cls){const b=el('button','',parent,'icon-btn'+(cls?' '+cls:''));b.type='button';icon(name,b);b.setAttribute('aria-label',text);b.title=text;return b}
function button(text,parent,cls){const b=el('button',text,parent,cls);b.type='button';return b}
function link(parent,href,text,cls){const a=el('a',text,parent,cls);a.href='#'+href;return a}
const label=r=>r?.name||[r?.first,r?.last].filter(Boolean).join(' ');
const find=(k,id)=>data[k]?.find(r=>r.id===id);
const ref=(k,id)=>label(find(k,id));
function select(parent,items,placeholder){const s=el('select','',parent);if(placeholder)s.add(new Option(placeholder,''));for(const [id,name] of items)s.add(new Option(name,id));return s}
const enumLabel=(e,v)=>enums[e].find(o=>o[0]===v)?.[1]||v||'';
const plural=(n,w,p)=>n+' '+(n>1?p||w+'s':w);
const iso=d=>d.toLocaleDateString('sv-SE');
const today=()=>iso(new Date());
const nowMin=()=>{const d=new Date();return d.getHours()*60+d.getMinutes()};
const addDays=(s,n)=>{const d=new Date(s+'T12:00');d.setDate(d.getDate()+n);return iso(d)};
const weekdayOf=s=>new Date(s+'T12:00').getDay();
const mondayOf=s=>addDays(s,-((weekdayOf(s)+6)%7));
const fmtDate=(d,opt={weekday:'short',day:'numeric',month:'short'})=>{if(!d)return '';const x=new Date(d+'T12:00');return isNaN(x)?d:new Intl.DateTimeFormat('fr',opt).format(x)};
const longDate=d=>fmtDate(d,{weekday:'long',day:'numeric',month:'long'});
const toMin=t=>{const [h,m]=(t||'').split(':').map(Number);return h*60+(m||0)};
const fromMin=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
const hh=t=>t?t.replace(':','h'):'';
const endOf=s=>s.time?fromMin(toMin(s.time)+Number(s.duration||0)):'';
const timeRange=s=>s.time?hh(s.time)+(s.duration?' – '+hh(endOf(s)):''):'';
const sortKey=r=>(r.date||r.start||'')+(r.time||'');
const byDate=(a,b)=>sortKey(a).localeCompare(sortKey(b));
const isStarted=s=>s.date<today()||(s.date===today()&&(!s.time||toMin(s.time)<=nowMin()));
const isOver=s=>s.date<today()||(s.date===today()&&s.time&&toMin(endOf(s))<=nowMin());
const isNow=s=>s.date===today()&&s.time&&toMin(s.time)<=nowMin()&&nowMin()<toMin(s.time)+Number(s.duration||0);
const active=s=>!s.cancelled;
function tint(id){let h=0;for(const c of id||'')h=(h*31+c.charCodeAt(0))>>>0;return h%5}
function avatar(student,parent,cls){
 if(student?.photo?.startsWith('data:image/jpeg;base64,')){const img=el('img','',parent,'avatar'+(cls?' '+cls:''));img.src=student.photo;img.alt='';return img}
 return el('span',((student?.first||'?')[0]+((student?.last||'')[0]||'')).toUpperCase(),parent,'avatar t'+tint(student?.id)+(cls?' '+cls:''));
}
let toastTimer;
function notify(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3600)}
function panel(parent,title,more){const p=el('section','',parent,'panel');const h=el('div','',p,'panel-head');el('h2',title,h);if(more)link(h,more[0],more[1],'link');return p}
function sheet(title){const d=el('dialog','',document.body,'sheet');const head=el('div','',d,'panel-head');el('h2',title,head);iconButton('close','Fermer',head).onclick=()=>d.close();d.onclose=()=>d.remove();return d}
function lastBackup(){try{return localStorage.getItem('eps-last-backup')}catch{return null}}
function needYear(){el('p','Créez d’abord une année scolaire.',view,'empty');link(view,'years','Créer une année scolaire →','btn primary').style.alignSelf='start'}

// ---------- Cycles et séances ----------
const pupilsOf=classId=>data.students.filter(s=>s.classId===classId).sort((a,b)=>(a.last+a.first).localeCompare(b.last+b.first,'fr'));
const cycleOf=s=>data.cycles.find(c=>c.classId===s.classId&&c.start&&c.start<=s.date&&c.end>=s.date);
const sessionsBetween=(classId,start,end)=>data.sessions.filter(s=>s.classId===classId&&active(s)&&s.date>=start&&s.date<=end).sort(byDate);
const cycleSessions=c=>c.start&&c.end?sessionsBetween(c.classId,c.start,c.end):[];
function cycleRank(s){const c=cycleOf(s);if(!c||!active(s))return null;const list=cycleSessions(c);return {c,n:list.findIndex(x=>x.id===s.id)+1,total:list.length}}
const cycleText=s=>{const r=cycleRank(s);return r?r.c.name+' · séance '+r.n+'/'+r.total:''};
const sessionTitle=s=>ref('classes',s.classId)+' · '+(cycleOf(s)?.name||s.name);
const sessionContent=s=>s.name&&s.name!=='EPS'&&s.name!==cycleOf(s)?.name?s.name:'';
const currentCycle=classId=>{const t=today();const cs=data.cycles.filter(c=>c.classId===classId&&c.start&&c.end).sort((a,b)=>a.start.localeCompare(b.start));return cs.find(c=>c.start<=t&&c.end>=t)||cs.find(c=>c.start>t)||null};
const recordsOf=id=>data.attendance.filter(a=>a.sessionId===id);
const isCalled=s=>s.called==='1'||recordsOf(s.id).length>0;
const protectedSession=s=>s&&(s.custom||s.cancelled||isCalled(s));

// ---------- Calendrier scolaire : vacances, semaines A/B, emploi du temps ----------
const holidayOf=s=>data.holidays.find(h=>h.start<=s&&h.end>=s);
const yearOf=s=>data.years.find(y=>y.start<=s&&y.end>=s);
function isSchoolWeek(monday,year){for(let i=0;i<6;i++){const d=addDays(monday,i);if(d>=year.start&&d<=year.end&&!holidayOf(d))return true}return false}
// L'alternance A/B avance d'un cran à chaque semaine de cours : les semaines entières de vacances ne comptent pas.
function weekType(s,memo){
 const monday=mondayOf(s);if(memo?.has(monday))return memo.get(monday);
 const y=yearOf(s)||yearOf(addDays(monday,4));let type=null;
 if(y){const first=y.firstWeek==='B'?'B':'A';let n=0;for(let m=mondayOf(y.start);m<monday;m=addDays(m,7))if(isSchoolWeek(m,y))n++;type=n%2===0?first:(first==='A'?'B':'A')}
 memo?.set(monday,type);return type;
}
// Crée, met à jour ou retire les séances issues de l'emploi du temps à partir de `from` (aujourd'hui par défaut).
// Ne touche jamais aux séances modifiées à la main, annulées ou dont l'appel est fait.
async function syncSlots(from=today()){
 const memo=new Map(),want=new Map();
 for(const slot of data.timetable){
  const y=find('years',slot.year);if(!y)continue;
  const skip=new Set((slot.skip||'').split(',').filter(Boolean));
  let d=from>y.start?from:y.start;
  while(weekdayOf(d)!==Number(slot.weekday)&&d<=y.end)d=addDays(d,1);
  for(;d<=y.end;d=addDays(d,7)){
   if(skip.has(d)||holidayOf(d))continue;
   if(slot.freq!=='all'&&weekType(d,memo)!==slot.freq)continue;
   want.set(slot.id+'@'+d,{id:slot.id+'@'+d,slot:slot.id,classId:slot.classId,date:d,time:slot.time,duration:slot.duration,name:slot.name||'EPS'});
  }
 }
 const removed=data.sessions.filter(s=>s.slot&&s.date>=from&&!want.has(s.id)&&!protectedSession(s)&&!hasContent(s)).map(s=>s.id);
 // Une séance qui a déjà du contenu garde son contenu : seuls l'horaire et la classe suivent l'emploi du temps.
 const put=[...want.values()].map(row=>{const old=find('sessions',row.id);return protectedSession(old)?null:old?{...old,...row}:row}).filter(row=>row&&JSON.stringify(find('sessions',row.id))!==JSON.stringify(row));
 const added=put.filter(r=>!find('sessions',r.id)).length;
 if(removed.length||put.length){
  await transaction('sessions',tx=>{removed.forEach(id=>tx.objectStore('sessions').delete(id));put.forEach(r=>tx.objectStore('sessions').put(r))});
  await load();
 }
 return {added,removed:removed.length};
}

// ---------- Indicateurs ----------
const activeRestrictions=()=>data.restrictions.filter(r=>r.start<=today()&&r.end>=today());
const restrictionOf=id=>activeRestrictions().find(r=>r.student===id);
const pendingCalls=()=>data.sessions.filter(s=>active(s)&&isStarted(s)&&!isCalled(s)&&pupilsOf(s.classId).length).sort((a,b)=>byDate(b,a));
// Alertes « À surveiller » : règles paramétrables dans Réglages › Paramètres.
const alertRules=[
 {key:'abs',label:'absences',one:'absence',statuses:['Absent']},
 {key:'late',label:'retards',one:'retard',statuses:['Retard']},
 {key:'kit',label:'oublis de tenue ou de chaussures',one:'oubli de tenue ou de chaussures',statuses:['Oubli de tenue','Oubli de chaussures']},
 {key:'med',label:'inaptitudes à l’appel',one:'inaptitude à l’appel',statuses:['Inaptitude']}
];
const defaultSettings={id:'app',absOn:'1',absMin:'3',absWindow:'4',lateOn:'0',lateMin:'3',lateWindow:'8',kitOn:'1',kitMin:'3',kitWindow:'8',medOn:'0',medMin:'2',medWindow:'cycle'};
const settings=()=>({...defaultSettings,...data.settings.find(r=>r.id==='app')});
const calledSessions=classId=>data.sessions.filter(s=>s.classId===classId&&active(s)&&isStarted(s)&&isCalled(s));
const marksIn=(s,p)=>marksOf(attOf(s.id,p.id));
// Statut principal (présence, sinon première mention) : affichage compact et applications.
const statusIn=(s,p)=>marksIn(s,p)[0]||'Présent';
// Séances prises en compte par une fenêtre : N dernières, cycle en cours ou année scolaire.
function windowSessions(classId,win){
 const list=calledSessions(classId).sort((a,b)=>byDate(b,a)),t=today();
 if(win==='cycle'){const c=currentCycle(classId);return c&&c.start<=t?{list:list.filter(s=>s.date>=c.start&&s.date<=c.end),text:'depuis le début du cycle '+c.name}:{list:[],text:''}}
 if(win==='year'){const y=yearOf(t);return {list:y?list.filter(s=>s.date>=y.start):list,text:'depuis le début de l’année'}}
 const n=Number(win)||4,l=list.slice(0,n);return {list:l,text:'sur les '+l.length+' dernières séances'};
}
function watchList(){
 const out=[],cfg=settings();
 for(const c of data.classes){
  const wins={};
  for(const r of alertRules)if(cfg[r.key+'On']==='1')wins[r.key]=windowSessions(c.id,cfg[r.key+'Window']);
  for(const p of pupilsOf(c.id))for(const r of alertRules){
   const w=wins[r.key];if(!w)continue;
   const n=w.list.filter(s=>marksIn(s,p).some(m=>r.statuses.includes(m))).length;
   if(n>=Number(cfg[r.key+'Min']))out.push({p,text:plural(n,r.one,r.label)+' '+w.text});
  }
 }
 return out;
}

// ---------- Navigation ----------
const nav=document.querySelector('nav');
let current='home';
function buildNav(){
 nav.replaceChildren();
 const badges={restrictions:activeRestrictions().length,attendance:pendingCalls().length};
 for(const [title,keys] of navGroups){
  const g=el('div','',nav,'nav-group');el('span',title,g);
  for(const k of keys){const a=link(g,k,'');icon(k,a);el('span',navLabels[k]||pages[k],a,'label');if(badges[k])el('span',badges[k],a,'badge').setAttribute('aria-label',badges[k]+' à traiter');a.setAttribute('aria-current',k===current?'page':'false')}
 }
 if(lockOn()){const b=el('button','',nav,'nav-lock');b.type='button';icon('lock',b);el('span','Verrouiller',b,'label');b.onclick=lockNow}
}
document.querySelector('time').textContent=new Intl.DateTimeFormat('fr',{dateStyle:'full'}).format(new Date());
document.querySelector('.version').textContent='Version '+APP_VERSION;

// ---------- Rendu ----------
let sessionId='',classFilter='',period='upcoming',calWeek='',editing={};
const collectionsOf=k=>k==='planning'?['timetable','holidays']:[k];
function render(){
 let [k,param]=location.hash.slice(1).split('=');if(!(k in pages))k='home';current=k==='student'?'students':k==='session'?'calendar':k==='board'?'boards':k==='module'?'apps':k;
 if(k!=='module')leaveModule();
 if(editing.k&&!collectionsOf(k).includes(editing.k))editing={};
 buildNav();
 openBoards=[];
 view.replaceChildren();
 const q=search.value.trim();
 if(q){document.querySelector('h1').textContent='Recherche';return renderSearch(q)}
 document.querySelector('h1').textContent=pages[k];
 document.title=pages[k]+' · EPS Manager';
 if(k!=='module')backupBanner();
 ({home:renderHome,calendar:renderCalendar,planning:renderPlanning,attendance:renderAttendance,backup:renderBackup,absences:renderAbsences,settings:renderSettings,student:()=>renderStudent(decodeURIComponent(param||'')),session:()=>renderSession(decodeURIComponent(param||'')),boards:renderBoards,board:()=>renderBoard(decodeURIComponent(param||'')),module:()=>renderModule(decodeURIComponent(param||'')),apps:renderApps,averages:renderAverages}[k]||renderList)(k);
}

// ---------- Tableau de bord ----------
function todayCard(parent,s){
 const pupils=pupilsOf(s.classId).length;
 const card=el('div','',parent,'today-card'+(s.cancelled?' cancelled':isNow(s)?' now':''));
 const main=link(card,'session='+s.id,'','tc-main');
 const tm=el('div','',main,'tc-time');el('b',s.time?hh(s.time):'—',tm);if(s.time)el('span',hh(endOf(s)),tm);
 const body=el('div','',main,'body');
 el('span',sessionTitle(s),body,'title');
 el('span',[cycleText(s),sessionContent(s),plural(pupils,'élève')].filter(Boolean).join(' · '),body,'meta');
 if(hasContent(s))el('span','Contenu préparé',body,'tag');
 const sm=data.results.find(r=>r.sessionId===s.id&&!r.student);if(sm)el('span',sm.module+' · '+sm.value,body,'meta');
 if(s.cancelled)el('span','Annulée · '+s.cancelled,card,'tag warn');
 else if(isNow(s))el('span',isCalled(s)?'En cours · appel fait':'En cours',card,'tag now');
 else if(isOver(s))el('span',isCalled(s)?'Appel fait':'Appel à faire',card,'tag'+(isCalled(s)?'':' warn'));
 else el('span','À venir',card,'tag');
 if(!s.cancelled)link(card,'attendance','Appel','btn small'+(isCalled(s)?'':' primary')).onclick=()=>{sessionId=s.id};
}
function sessionRow(parent,s){
 const r=link(parent,'attendance','','row');r.onclick=()=>{sessionId=s.id};
 const tm=el('span','',r,'time');el('span',fmtDate(s.date),tm);if(s.time)el('small',hh(s.time),tm);
 const b=el('div','',r,'body');el('span',sessionTitle(s),b,'title');
 el('span',[timeRange(s),cycleText(s)].filter(Boolean).join(' · '),b,'meta');
 if(s.cancelled)el('span','Annulée',r,'tag warn');
}
function renderHome(){
 if(!data.years.length){
  const p=panel(view,'Bienvenue');
  el('p','Commencez par créer une année scolaire, vos classes et vos élèves, puis votre emploi du temps et les vacances : toutes les séances de l’année seront créées automatiquement. Tout reste enregistré sur cette tablette.',p,'muted');
  const a=el('div','',p,'actions');
  link(a,'years','Créer ma première année scolaire','btn primary');
  button('Essayer avec des données d’exemple',a).onclick=loadSample;
  return;
 }
 const t=today(),monday=mondayOf(t),saturday=addDays(monday,5);
 const week=data.sessions.filter(s=>active(s)&&s.date>=monday&&s.date<=saturday);
 const calls=pendingCalls(),backup=lastBackup();
 const days=backup?Math.floor((Date.now()-new Date(backup))/864e5):null;
 const wt=weekType(t),hol=holidayOf(t);

 // Séances du jour, issues du calendrier
 const todays=data.sessions.filter(s=>s.date===t).sort(byDate);
 const p0=panel(view,hol?'Aujourd’hui · '+hol.name:'Aujourd’hui'+(wt?' · semaine '+wt:''),['calendar','Calendrier →']);
 p0.classList.add('today-panel');
 if(todays.length){const g=el('div','',p0,'today-grid');for(const s of todays)todayCard(g,s)}
 else el('p',hol?'Bonnes vacances !':'Aucune séance aujourd’hui.',p0,'empty');

 const kpis=el('div','',view,'kpis');
 const kpi=(href,title,value,sub,alert)=>{const a=link(kpis,href,'','kpi'+(alert?' alert':''));el('span',title,a);el('b',value,a);el('small',sub,a)};
 kpi('calendar','Séances cette semaine',week.length,week.filter(s=>s.date>t).length+' à venir');
 kpi('attendance','Appels à faire',calls.length,calls[0]?ref('classes',calls[0].classId)+' · '+fmtDate(calls[0].date):'Tout est à jour',calls.length>0);
 kpi('students','Élèves suivis',data.students.length,plural(data.classes.length,'classe'));
 kpi('backup','Dernière sauvegarde',days==null?'Jamais':days===0?'Aujourd’hui':'Il y a '+days+' j',days==null||days>7?'Pensez à exporter':'Données protégées',days==null||days>7);

 const grid=el('div','',view,'grid');
 const p1=panel(grid,'Prochaines séances');
 const upcoming=data.sessions.filter(s=>active(s)&&s.date>t).sort(byDate).slice(0,5);
 for(const s of upcoming)sessionRow(p1,s);
 if(!upcoming.length){el('p','Aucune séance programmée.',p1,'empty');link(p1,'planning','Renseigner mon emploi du temps →','link')}

 const p2=panel(grid,'À surveiller');
 let n=0;
 for(const r of activeRestrictions()){const s=find('students',r.student);if(!s)continue;n++;alertRow(p2,s,'Inaptitude jusqu’au '+fmtDate(r.end)+' · '+r.name,'restrictions')}
 for(const {p,text} of watchList()){n++;alertRow(p2,p,text,'students')}
 for(const s of calls.filter(s=>s.date<t).slice(0,3)){n++;const r=el('div','',p2,'row');el('span','!',r,'avatar t2');const b=el('div','',r,'body');el('span','Appel à faire · '+ref('classes',s.classId),b,'title');el('span',fmtDate(s.date)+(s.time?' '+hh(s.time):''),b,'meta');link(r,'attendance','Ouvrir','btn small').onclick=()=>{sessionId=s.id}}
 if(!n)el('p','Rien à signaler pour le moment.',p2,'empty');

 if(data.classes.length){
  el('h2','Mes classes',view,'section-title');
  const cards=el('div','',view,'list');
  for(const c of data.classes){
   const a=link(cards,'cycles','','class-card');a.onclick=()=>{classFilter=c.id};
   const top=el('div','',a,'top');el('strong',c.name,top);el('span',plural(pupilsOf(c.id).length,'élève'),top,'muted');
   const cy=currentCycle(c.id);
   el('span',cy?cy.name+(cy.start>t?' · commence le '+fmtDate(cy.start):''):'Aucun cycle en cours',a).style.fontWeight='600';
   const list=cy?cycleSessions(cy):[],done=list.filter(isStarted).length;
   const bar=el('div','',a,'progress');el('i','',bar).style.width=(list.length?Math.round(done/list.length*100):0)+'%';
   el('span',cy?(list.length?'Séance '+done+' sur '+list.length:'Aucune séance dans ce cycle'):'Créez un cycle avec ses dates',a,'muted');
  }
 }
}
function alertRow(parent,student,text,href){const r=el('div','',parent,'row');avatar(student,r);const b=el('div','',r,'body');el('span',label(student)+' · '+ref('classes',student.classId),b,'title');el('span',text,b,'meta');link(r,'student='+student.id,'Voir la fiche','btn small')}

// ---------- Calendrier (vue semaine) ----------
function renderCalendar(){
 if(!data.years.length)return needYear();
 if(!calWeek)calWeek=mondayOf(today());
 const satUsed=data.timetable.some(s=>s.weekday==='6')||data.sessions.some(s=>s.date>=calWeek&&s.date<=addDays(calWeek,5)&&weekdayOf(s.date)===6);
 const nDays=satUsed?6:5,days=[...Array(nDays)].map((_,i)=>addDays(calWeek,i));
 const sessions=data.sessions.filter(s=>s.date>=days[0]&&s.date<=days.at(-1));
 const wt=weekType(calWeek),hols=days.map(holidayOf);

 const bar=el('div','',view,'cal-bar');
 const navb=el('div','',bar,'cal-nav');
 iconButton('prev','Semaine précédente',navb).onclick=()=>{calWeek=addDays(calWeek,-7);render()};
 button('Aujourd’hui',navb,'small').onclick=()=>{calWeek=mondayOf(today());render()};
 iconButton('next','Semaine suivante',navb).onclick=()=>{calWeek=addDays(calWeek,7);render()};
 const ttl=el('div','',bar,'cal-title');
 el('strong','Semaine du '+fmtDate(days[0],{day:'numeric',month:'long'})+' au '+fmtDate(days.at(-1),{day:'numeric',month:'long',year:'numeric'}),ttl);
 if(hols.every(Boolean))el('span',hols[0].name,ttl,'tag warn');else if(wt)el('span','Semaine '+wt,ttl,'tag now');
 const acts=el('div','',bar,'actions');
 link(acts,'planning','Emploi du temps et vacances','btn small');
 link(acts,'sessions','+ Séance ponctuelle','btn small primary').onclick=()=>{editing={}};

 if(!data.timetable.length&&!data.sessions.some(x=>x.source==='pronote')){const n=el('p','',view,'notice');n.append('Votre emploi du temps est vide. ');link(n,'planning','Renseignez vos cours et vos vacances').style.fontWeight='700';n.append(' : toutes les séances de l’année seront créées automatiquement.')}

 const timed=sessions.filter(s=>s.time);
 const startH=Math.min(8,...timed.map(s=>Math.floor(toMin(s.time)/60)));
 const endH=Math.max(18,...timed.map(s=>Math.ceil(toMin(endOf(s))/60)));
 const PX=1.1,height=(endH-startH)*60*PX;
 const scroll=el('div','',view,'cal-scroll');
 const cal=el('div','',scroll,'cal');cal.style.setProperty('--days',nDays);cal.style.setProperty('--hour',60*PX+'px');
 el('div','',cal,'cal-corner');
 for(const d of days){
  const h=el('div','',cal,'cal-head'+(d===today()?' today':''));
  el('span',fmtDate(d,{weekday:'short'}),h,'dname');el('b',fmtDate(d,{day:'numeric'}),h);
  for(const s of sessions.filter(s=>s.date===d&&!s.time))button(sessionTitle(s),h,'chip c'+tint(s.classId)+(s.cancelled?' cancelled':'')).onclick=()=>openSession(s);
 }
 const hours=el('div','',cal,'cal-hours');hours.style.height=height+'px';
 for(let hr=startH;hr<=endH;hr++)el('span',hr+'h',hours).style.top=(hr-startH)*60*PX+'px';
 days.forEach((d,i)=>{
  const col=el('div','',cal,'cal-col'+(hols[i]?' holiday':'')+(d===today()?' today':''));col.style.height=height+'px';
  if(hols[i])el('span',hols[i].name,col,'hol-label');
  const list=timed.filter(s=>s.date===d).sort((a,b)=>toMin(a.time)-toMin(b.time));
  const lanes=[];
  const placed=list.map(s=>{const st=toMin(s.time),en=st+Number(s.duration||55);let lane=lanes.findIndex(e=>e<=st);if(lane<0){lane=lanes.length;lanes.push(en)}else lanes[lane]=en;return {s,st,en,lane}});
  for(const {s,st,en,lane} of placed){
   const ev=button('',col,'event c'+tint(s.classId)+(s.cancelled?' cancelled':isStarted(s)&&isCalled(s)?' done':''));
   ev.style.top=(st-startH*60)*PX+'px';ev.style.height=Math.max(30,(en-st)*PX-3)+'px';
   ev.style.left='calc('+(lane/lanes.length*100)+'% + 3px)';ev.style.width='calc('+(100/lanes.length)+'% - 6px)';
   el('span',timeRange(s),ev,'ev-time');el('strong',ref('classes',s.classId),ev);
   el('span',s.cancelled?'Annulée · '+s.cancelled:cycleText(s)||s.name,ev,'ev-name');
   ev.setAttribute('aria-label',sessionTitle(s)+', '+longDate(s.date)+' '+timeRange(s)+(s.cancelled?', annulée : '+s.cancelled:''));
   ev.onclick=()=>openSession(s);
  }
  if(d===today()&&nowMin()>=startH*60&&nowMin()<=endH*60)el('span','',col,'now-line').style.top=(nowMin()-startH*60)*PX+'px';
 });
}

// Fenêtre d'une séance : appel, modification, suppression avec motif.
function openSession(s){
 const d=sheet(sessionTitle(s));
 el('p',longDate(s.date)+(s.time?' · '+timeRange(s):''),d,'muted');
 const extra=[cycleText(s),sessionContent(s)].filter(Boolean).join(' · ');if(extra)el('p',extra,d);
 const slot=s.slot&&find('timetable',s.slot);
 el('p',slot?'Cours régulier · '+enumLabel('freq',slot.freq).toLowerCase()+(s.custom?' · modifié pour cette date':''):'Séance ponctuelle',d,'muted');
 const acts=el('div','',d,'actions');
 if(s.cancelled){
  el('p','Séance supprimée · '+s.cancelled,d,'notice');
  button('Rétablir la séance',acts,'primary').onclick=async()=>{const {cancelled,...rest}=s;await transaction('sessions',t=>t.objectStore('sessions').put(rest));await load();d.close();render();notify('Séance rétablie.')};
  button('Effacer définitivement',acts,'danger').onclick=async()=>{if(await remove('sessions',s.id))d.close()};
 }else{
  if(isCalled(s)){const n=recordsOf(s.id).length;el('p',n?'Appel fait · '+plural(n,'mention'):'Appel fait · tous présents',d)}
  link(acts,'session='+s.id,'Ouvrir la séance','btn primary').onclick=()=>d.close();
  link(acts,'attendance','Faire l’appel','btn').onclick=()=>{sessionId=s.id;d.close()};
  button('Modifier',acts).onclick=()=>{d.close();editing={k:'sessions',id:s.id};if(location.hash==='#sessions')render();else location.hash='#sessions'};
  button('Supprimer…',acts,'danger').onclick=()=>{d.close();cancelSession(s)};
 }
 d.showModal();
}
function cancelSession(s){
 const d=sheet('Supprimer la séance');
 el('p',sessionTitle(s)+' · '+longDate(s.date)+(s.time?' · '+timeRange(s):''),d,'muted');
 el('p','Pour quelle raison ? La séance restera visible, barrée, dans le calendrier et ne comptera plus dans le cycle.',d);
 let reason='';
 const grid=el('div','',d,'choice-grid'),other=el('input','',el('label','Autre motif',d));other.placeholder='Précisez…';
 const ok=button('Supprimer la séance',el('div','',d,'actions'),'primary');ok.disabled=true;
 for(const r of cancelReasons){const b=button(r,grid,'choice');b.onclick=()=>{reason=r;other.value='';for(const x of grid.children)x.setAttribute('aria-pressed',x===b);ok.disabled=false}}
 other.oninput=()=>{reason=other.value.trim();for(const x of grid.children)x.setAttribute('aria-pressed','false');ok.disabled=!reason};
 ok.onclick=async()=>{await transaction('sessions',t=>t.objectStore('sessions').put({...s,cancelled:reason}));await load();d.close();render();notify('Séance supprimée · '+reason+'.')};
 const err=button('Effacer complètement (erreur de saisie)',d,'text-btn');err.onclick=async()=>{if(await remove('sessions',s.id))d.close()};
 d.showModal();
}

// ---------- Paramètres du calendrier ----------
function renderPlanning(){
 icalPanel();
 if(!data.years.length)return;
 el('p','Saisissez vos cours une seule fois : les séances sont créées automatiquement jusqu’à la fin de l’année, à partir d’aujourd’hui, en sautant les vacances. Les séances passées, modifiées, supprimées avec un motif ou dont l’appel est fait ne sont jamais changées.',view,'muted');
 const p=panel(view,'Semaines A / B');
 el('p','Choisissez le type de la première semaine de cours. Les semaines entières de vacances ne comptent pas dans l’alternance ; un jour férié isolé ne la décale pas.',p,'muted');
 const f=el('div','',p,'filters');
 for(const y of data.years){
  const s=select(el('label','Première semaine · '+y.name,f),[['A','Semaine A'],['B','Semaine B']]);s.value=y.firstWeek==='B'?'B':'A';
  s.onchange=async()=>{await transaction('years',t=>t.objectStore('years').put({...y,firstWeek:s.value}));await load();await syncSlots();render();notify('Alternance mise à jour.')};
 }
 const wt=weekType(today());if(wt)el('p','Cette semaine est une semaine '+wt+'.',p).style.fontWeight='600';
 el('h2','Emploi du temps',view,'section-title big');
 const fromPronote=data.sessions.filter(x=>x.source==='pronote'&&x.date>=today()&&active(x)).length;
 if(fromPronote){const n=el('p','',view,'hint');n.append('Vos cours viennent de Pronote : '+plural(fromPronote,'séance à venir','séances à venir')+'. ');link(n,'calendar','Voir le calendrier →');n.append(' Les cours ci-dessous servent seulement pour les classes non reliées à Pronote.')}
 renderCollection('timetable',view);
 el('h2','Vacances et jours fériés',view,'section-title big');
 renderCollection('holidays',view);
}

// ---------- Appel ----------
function defaultSession(){
 const t=today(),n=nowMin(),todays=data.sessions.filter(s=>s.date===t&&active(s)).sort(byDate);
 return todays.find(isNow)||todays.find(s=>s.time&&toMin(s.time)>n)||todays.at(-1)||data.sessions.filter(s=>active(s)&&isStarted(s)).sort((a,b)=>byDate(b,a))[0]||data.sessions.slice().sort(byDate)[0];
}
// Séance du jour pour l'appel d'une classe : celle qui est prévue (en cours ou la plus proche), sinon une séance créée maintenant.
async function sessionForCall(classId){
 const t=today(),n=nowMin(),list=data.sessions.filter(s=>s.classId===classId&&s.date===t&&active(s)).sort(byDate);
 const near=list.find(isNow)||list.slice().sort((a,b)=>Math.abs((a.time?toMin(a.time):n)-n)-Math.abs((b.time?toMin(b.time):n)-n))[0];
 if(near)return near;
 const slot=data.timetable.find(x=>x.classId===classId&&Number(x.weekday)===weekdayOf(t));
 const s={id:crypto.randomUUID(),classId,date:t,time:fromMin(Math.floor(n/5)*5),duration:slot?.duration||'55',name:slot?.name||'EPS'};
 await transaction('sessions',tx=>tx.objectStore('sessions').put(s));await load();
 notify('Séance créée pour la '+ref('classes',classId)+' à '+hh(s.time)+'.');
 return s;
}
function quickCall(parent){
 if(!data.classes.length)return;
 const box=el('section','',parent,'panel quick-call');
 el('h2','Faire l’appel d’une classe',box);
 el('p','Choisissez la classe : la séance du jour est ouverte, ou créée automatiquement si elle n’est pas prévue.',box,'muted');
 const row=el('div','',box,'actions');
 for(const c of data.classes){const b=button(c.name,row,c.id===find('sessions',sessionId)?.classId?'primary':'');b.onclick=async()=>{b.disabled=true;sessionId=(await sessionForCall(c.id)).id;render()}}
}
function renderAttendance(){
 if(!data.sessions.length){quickCall(view);if(!data.classes.length){el('p','Créez d’abord une classe et ses élèves.',view,'empty');link(view,'classes','Créer une classe →','btn primary').style.alignSelf='start'}return}
 if(!find('sessions',sessionId))sessionId=defaultSession().id;
 const limit=addDays(today(),7);
 const options=data.sessions.filter(s=>(active(s)&&s.date<=limit)||s.id===sessionId).sort((a,b)=>byDate(b,a)).slice(0,150);
 const session=find('sessions',sessionId),pupils=pupilsOf(session.classId);
 quickCall(view);
 const head=el('div','',view,'panel attendance-head');
 const s=select(el('label','Séance',head),options.map(r=>[r.id,fmtDate(r.date)+(r.time?' '+hh(r.time):'')+' · '+sessionTitle(r)]));
 s.value=sessionId;s.onchange=()=>{sessionId=s.value;render()};
 const info=[longDate(session.date),timeRange(session),cycleText(session),sessionContent(session)].filter(Boolean).join(' · ');
 el('p',info,head,'muted');
 link(head,'session='+session.id,'Contenu de la séance'+(hasContent(session)?' (préparé)':'')+' →','link');
 if(session.cancelled){el('p','Cette séance a été supprimée · '+session.cancelled,view,'notice');button('Gérer la séance',view).onclick=()=>openSession(session);return}
 if(!pupils.length){el('p','Aucun élève dans cette classe.',view,'empty');link(view,'students','Ajouter des élèves →','link');return}
 const attP=p=>attOf(sessionId,p.id);
 const counts={};for(const p of pupils){const a=attP(p);counts[a.presence]=(counts[a.presence]||0)+1;for(const x of a.extras)counts[x]=(counts[x]||0)+1}
 const legend=el('div','',head,'legend');
 for(const st of statuses)if(counts[st]){const sp=el('span','',legend);statusDot(st,sp);sp.append(st+' · '+counts[st])}
 el('p','Tous les élèves sont présents par défaut. Touchez un élève : d’un côté présent, absent ou en retard ; de l’autre les mentions (oubli de tenue, mot des parents, inaptitude…), cumulables.',head,'muted');

 const grid=el('div','',view,'pupils');
 for(const p of pupils){
  const a=attP(p),m=marksOf(a),main=m[0]||'Présent',info=statusInfo[main];
  const b=button('',grid,'pupil'+(m.length?' flagged':''));
  b.style.setProperty('--c',info.bg);b.style.setProperty('--fg',info.fg);
  avatar(p,b);el('span',p.first,b);el('span',p.last,b,'last');
  const sd=statusDot(a.presence,b,'st');if(a.presence==='Présent'){sd.style.background='#e5ebe3';sd.style.color='var(--primary)'}
  if(a.extras.length){const ex=el('span','',b,'st-extras');for(const x of a.extras)statusDot(x,ex)}
  if(m.length)el('span',m.join(' · '),b,'st-label');
  if(restrictionOf(p.id))el('span','!',b,'inapt').title='Inaptitude en cours';
  b.setAttribute('aria-label',label(p)+' : '+(m.join(', ')||'Présent'));
  b.onclick=()=>pupilSheet(p,session);
 }
 const actions=el('div','',view,'actions');
 if(isCalled(session))el('p','✓ Appel enregistré'+(recordsOf(session.id).length?'':' · tous présents'),actions,'saved');
 else button('Valider l’appel · '+plural(counts['Présent']||0,'présent'),actions,'primary').onclick=async()=>{await transaction('sessions',t=>t.objectStore('sessions').put({...session,called:'1'}));await load();render();notify('Appel enregistré.')};
}
function pupilSheet(p,session){
 const d=sheet(label(p)),id=session.id+'/'+p.id;
 const r=restrictionOf(p.id);if(r)el('p','Inaptitude jusqu’au '+fmtDate(r.end)+' · '+r.name,d,'notice');
 link(d,'student='+p.id,'Ouvrir la fiche de l’élève →','link').onclick=()=>d.close();
 let a=attOf(session.id,p.id);
 const save=async()=>{await transaction(['attendance','sessions'],t=>{if(a.presence==='Présent'&&!a.extras.length)t.objectStore('attendance').delete(id);else t.objectStore('attendance').put({id,sessionId:session.id,student:p.id,status:a.presence,extras:a.extras.join(',')});t.objectStore('sessions').put({...session,called:'1'})});await load();draw()};
 const cols=el('div','',d,'call-cols');
 const draw=()=>{cols.replaceChildren();
  const c1=el('section','',cols,'call-col');el('h3','Présence',c1);const g1=el('div','',c1,'status-grid');
  for(const st of PRESENCE){const b=button('',g1,'status-btn');b.setAttribute('aria-pressed',a.presence===st);statusDot(st,b);b.append(st);b.onclick=()=>{a={...a,presence:st};save()}}
  const c2=el('section','',cols,'call-col');el('h3','Mentions (plusieurs possibles)',c2);const g2=el('div','',c2,'status-grid');
  for(const st of EXTRAS){const on=a.extras.includes(st);const b=button('',g2,'status-btn');b.setAttribute('aria-pressed',on);statusDot(st,b);b.append(st);b.onclick=()=>{a={...a,extras:on?a.extras.filter(x=>x!==st):EXTRAS.filter(x=>x===st||a.extras.includes(x))};save()}}
 };
 draw();
 const ac=el('div','',d,'actions');button('Terminé',ac,'primary').onclick=()=>d.close();
 d.addEventListener('close',()=>render());
 d.showModal();
}

// ---------- Sauvegardes ----------
function renderBackup(){
 const p=panel(view,'Exporter');
 el('p','La sauvegarde contient toutes les données en clair : celles d’EPS Manager (élèves, photos, notes, inaptitudes…) et celles des applications associées (Demi-fond, Co-évaluation, Évaluations, documents des tableaux). Conservez-la dans un emplacement protégé.',p,'notice');
 const b=lastBackup();el('p',b?'Dernière sauvegarde : '+new Intl.DateTimeFormat('fr',{dateStyle:'long',timeStyle:'short'}).format(new Date(b)):'Aucune sauvegarde exportée depuis cet appareil.',p,'muted');
 backupButtons(el('div','',p,'actions'),()=>render());
 const fq=select(el('label','Rappel de sauvegarde',el('div','',p,'filters')),[['3','Tous les 3 jours'],['7','Chaque semaine'],['14','Toutes les 2 semaines'],['30','Chaque mois'],['0','Jamais']]);fq.value=String(backupEvery());
 fq.onchange=async()=>{await transaction('settings',t=>t.objectStore('settings').put({...settings(),backupEvery:fq.value}));await load();notify('Rappel enregistré.')};
 const r=panel(view,'Restaurer');
 el('p','La restauration remplace toutes les données de cet appareil, celles des applications comprises.',r,'muted');
 const input=el('input','',el('label','Fichier de sauvegarde (.json)',r));input.type='file';input.accept='.json,application/json';
 input.onchange=async()=>{const file=input.files[0];input.value='';if(!file)return;
  let b;try{b=JSON.parse(await file.text());await checkBackup(b)}catch(e){notify('Restauration impossible : '+(e instanceof SyntaxError?'fichier illisible ou incomplet':e.message||'vérifiez le fichier')+'. Vos données n’ont pas été modifiées.');return}
  const apps=appsInBackup(b.extra),n=k=>(b.data[k]||[]).length;
  if(!confirm('Remplacer toutes les données de cet appareil par cette sauvegarde'+(b.createdAt?' du '+new Date(b.createdAt).toLocaleDateString('fr'):'')+' ?\n\nElle contient : '+[plural(n('classes'),'classe'),plural(n('students'),'élève'),plural(n('sessions'),'séance'),plural(n('grades'),'note')].join(', ')+'.'+(apps.length?'\nAvec les données de : '+apps.join(', ')+'.':'\nSans données d’applications (ancienne version).')+(b.manifest?'\nFichier vérifié (somme de contrôle correcte).':'')+'\n\nUne copie de vos données actuelles est gardée sur l’appareil pour pouvoir annuler.'))return;
  if(await safeRestore(b,'avant la restauration de la sauvegarde'+(b.createdAt?' du '+new Date(b.createdAt).toLocaleDateString('fr'):'')))notify('Sauvegarde restaurée'+(apps.length?' avec '+apps.join(', '):'')+'.');
 };
 restorePointPanel();
 const s=panel(view,'Données d’exemple');
 el('p','Deux classes (5e B et 4e A) avec élèves, emploi du temps, vacances, cycles, appels passés, notes et observations, pour découvrir l’application. Remplace les données actuelles.',s,'muted');
 const sb=button('Charger les données d’exemple',s);sb.style.alignSelf='start';sb.onclick=loadSample;
}

// ---------- Données d'exemple ----------
async function loadSample(){
 const hasData=stores.some(k=>data[k].length);
 if(hasData&&!confirm('Remplacer toutes les données de cet appareil par les données d’exemple ?\n\nUne copie de vos données actuelles est gardée sur l’appareil (Sauvegardes › Annuler la dernière restauration).'))return;
 if(hasData)try{await saveRestorePoint('avant le chargement des données d’exemple')}catch{if(!confirm('Impossible de garder une copie des données actuelles. Continuer quand même ?'))return}
 let seed=42;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};
 const y={id:'ex-year',name:'2026-2027',start:'2026-09-01',end:'2027-07-03',firstWeek:'A'};
 const holidays=[['Toussaint','2026-10-17','2026-11-01'],['11 Novembre','2026-11-11','2026-11-11'],['Noël','2026-12-19','2027-01-03'],['Hiver','2027-02-13','2027-02-28'],['Lundi de Pâques','2027-03-29','2027-03-29'],['Printemps','2027-04-10','2027-04-25'],['Pont de l’Ascension','2027-05-06','2027-05-09'],['Lundi de Pentecôte','2027-05-17','2027-05-17']].map(([name,start,end],i)=>({id:'ex-hol'+i,year:y.id,name,start,end}));
 const classes=[{id:'ex-5B',year:y.id,name:'5e B'},{id:'ex-4A',year:y.id,name:'4e A'}];
 const firsts=['Léa','Hugo','Inès','Nathan','Chloé','Adam','Jade','Louis','Emma','Rayan','Lina','Gabriel','Mila','Noé','Zoé','Arthur','Manon','Sacha','Louise','Ethan','Alice','Yanis','Rose','Timéo','Camille','Mohamed','Anna','Jules','Sarah','Lucas','Lou','Malo','Nina','Tom','Ambre','Enzo','Clara','Nolan','Eva','Mathis','Agathe','Liam','Juliette','Maël','Lyna','Paul','Romane','Ilyes'];
 const lasts=['Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau','Simon','Laurent','Lefebvre','Michel','Garcia','David','Bertrand','Roux','Vincent','Fournier','Morel','Girard','André','Mercier','Dupont','Lambert','Bonnet','François','Martinez','Legrand','Garnier','Faure','Rousseau','Blanc','Guerin','Muller','Henry','Roussel','Nicolas','Perrin','Morin','Mathieu','Clement','Gauthier','Dumont','Lopez','Fontaine','Chevalier'];
 const girls=['Léa','Inès','Chloé','Jade','Emma','Lina','Mila','Zoé','Manon','Louise','Alice','Rose','Camille','Anna','Sarah','Lou','Nina','Ambre','Clara','Eva','Agathe','Juliette','Lyna','Romane'];
 const students=[];classes.forEach((c,ci)=>{for(let i=0;i<24;i++){const n=ci*24+i;students.push({id:'ex-st'+n,classId:c.id,first:firsts[n],last:lasts[(n*7)%lasts.length],sex:girls.includes(firsts[n])?'F':'G'})}});
 const groups=['Groupe 1','Groupe 2','Groupe 3','Groupe 4'].flatMap((g,i)=>classes.map(c=>({id:'ex-gr'+i+c.id,classId:c.id,name:g})));
 const timetable=[
  {id:'ex-tt1',year:y.id,classId:'ex-5B',weekday:'2',time:'10:05',duration:'110',freq:'all',name:'EPS'},
  {id:'ex-tt2',year:y.id,classId:'ex-5B',weekday:'4',time:'15:00',duration:'55',freq:'A',name:'EPS'},
  {id:'ex-tt3',year:y.id,classId:'ex-4A',weekday:'1',time:'08:00',duration:'110',freq:'all',name:'EPS'},
  {id:'ex-tt4',year:y.id,classId:'ex-4A',weekday:'5',time:'13:30',duration:'55',freq:'B',name:'EPS'}
 ];
 const cycles=[['ex-5B','Demi-fond','2026-09-01','2026-10-16'],['ex-5B','Badminton','2026-11-02','2026-12-18'],['ex-5B','Acrosport','2027-01-04','2027-02-12'],['ex-5B','Basket-ball','2027-03-01','2027-04-09'],['ex-5B','Course d’orientation','2027-04-26','2027-06-12'],
  ['ex-4A','Handball','2026-09-01','2026-10-16'],['ex-4A','Natation','2026-11-02','2026-12-18'],['ex-4A','Danse','2027-01-04','2027-02-12'],['ex-4A','Volley-ball','2027-03-01','2027-04-09'],['ex-4A','Athlétisme','2027-04-26','2027-06-12']].map(([classId,name,start,end],i)=>({id:'ex-cy'+i,classId,name,start,end}));
 const t=today();
 const restrictions=[{id:'ex-r1',student:'ex-st1',start:addDays(t,-3),end:addDays(t,10),name:'Entorse cheville : pas de course ni de saut. Arbitrage, observation.'},{id:'ex-r2',student:'ex-st30',start:addDays(t,-40),end:addDays(t,-20),name:'Fracture du poignet : pas d’appui sur le bras gauche.'}];
 const grades=[];students.forEach((s,i)=>{grades.push({id:'ex-g'+i,student:s.id,name:s.classId==='ex-5B'?'Demi-fond · 3×500 m':'Handball · match',grade:String(Math.round((8+rnd()*11)*2)/2),date:'2026-10-13'})});
 students.forEach((s,i)=>{grades.push({id:'ex-g2-'+i,student:s.id,name:s.classId==='ex-5B'?'Badminton · tournoi':'Natation · 50 m',grade:String(Math.round((7+rnd()*12)*2)/2),date:'2026-11-12'})});
 const observations=[['ex-st0','Très bonne gestion de l’effort, conseille ses camarades.'],['ex-st3','Manque d’engagement en fin de séance, à encourager.'],['ex-st5','Progrès nets sur le service long au badminton.'],['ex-st26','Excellente coordination en natation, peut viser le niveau 3.'],['ex-st31','Refuse de passer dans l’eau, à voir avec la famille.']].map(([student,name],i)=>({id:'ex-ob'+i,student,name,date:addDays(t,-3-i*6)}));
 const comments=[['ex-st0','Élève moteur et respectueux. Très bon trimestre.'],['ex-st7','Des efforts, mais des oublis de tenue trop fréquents.'],['ex-st24','Investie et volontaire, de beaux progrès.']].map(([student,name],i)=>({id:'ex-co'+i,student,name,date:'2026-12-10'}));
 await transaction(stores,tx=>{
  for(const k of stores)tx.objectStore(k).clear();
  const put=(k,rows)=>rows.forEach(r=>tx.objectStore(k).put(r));
  put('years',[y]);put('holidays',holidays);put('classes',classes);put('students',students);put('groups',groups);put('timetable',timetable);put('cycles',cycles);put('restrictions',restrictions);put('grades',grades);put('observations',observations);put('comments',comments);
 });
 await load();
 await syncSlots(y.start);
 // Appels passés : la plupart des élèves présents, quelques exceptions.
 const past=data.sessions.filter(isOver),rec=[],upd=[];
 const weights=[['Absent',.05],['Retard',.03],['Oubli de tenue',.03],['Oubli de chaussures',.015],['Inaptitude',.01],['Mot des parents',.015]];
 for(const s of past){
  upd.push({...s,called:'1'});
  for(const p of pupilsOf(s.classId)){let x=rnd();for(const [st,w] of weights){if(x<w){rec.push({id:s.id+'/'+p.id,sessionId:s.id,student:p.id,status:st});break}x-=w}}
 }
 // Une séance passée et une séance future supprimées avec un motif.
 const ex1=past.find(s=>s.classId==='ex-4A'&&s.date>='2026-10-01'),ex2=data.sessions.filter(s=>s.classId==='ex-5B'&&s.date>t).sort(byDate)[3];
 await transaction(['sessions','attendance'],tx=>{
  for(const s of upd)tx.objectStore('sessions').put(ex1&&s.id===ex1.id?{...s,called:undefined,cancelled:'Sortie scolaire'}:s);
  for(const r of rec)if(!ex1||r.sessionId!==ex1.id)tx.objectStore('attendance').put(r);
  if(ex2)tx.objectStore('sessions').put({...ex2,cancelled:'Conseil de classe / réunion'});
 });
 // Une séance ponctuelle aujourd'hui (si jour de classe sans cours) pour voir le tableau de bord en action.
 if(weekdayOf(t)>=1&&weekdayOf(t)<=5&&!holidayOf(t)&&yearOf(t)&&!data.sessions.some(s=>s.date===t))
  await transaction('sessions',tx=>tx.objectStore('sessions').put({id:'ex-today',classId:'ex-4A',date:t,time:'14:00',duration:'110',name:'Séance de rattrapage'}));
 await load();
 // Retire les champs vides éventuels (les sauvegardes n'acceptent que du texte).
 const dirty=data.sessions.filter(s=>Object.values(s).some(v=>typeof v!=='string'));
 if(dirty.length){await transaction('sessions',tx=>dirty.forEach(s=>tx.objectStore('sessions').put(Object.fromEntries(Object.entries(s).filter(([,v])=>typeof v==='string')))));await load()}
 sessionId='';classFilter='';editing={};
 await sampleContent();
 await sampleBoard();
 location.hash='#home';render();notify('Données d’exemple chargées : 2 classes, 48 élèves.');
}

// ---------- Listes génériques : ajout, modification, suppression ----------
function renderList(k){
 if(k==='comments')appreciationPanel();
 if(k==='students'&&data.classes.length)importPanel();
 if(k==='sessions'){const n=el('p','',view,'muted');n.append('Les séances régulières viennent de votre ');link(n,'planning','emploi du temps');n.append('. Ajoutez ici une séance ponctuelle (rattrapage, sortie, évaluation…).')}
 if(k==='cycles')el('p','Indiquez le début et la fin du cycle : le nombre de séances est calculé à partir du calendrier (emploi du temps, vacances et séances supprimées).',view,'muted');
 renderCollection(k,view);
}

function renderCollection(k,parent){
 const old=editing.k===k?find(k,editing.id):null;
 const p=panel(parent,old?'Modifier':addTitles[k]||'Ajouter');if(old)p.classList.add('editing');
 const form=el('form','',p,'add');
 for(const [key,title,type,def] of fields[k]){
  const l=el('label',title,form);let input;
  if(stores.includes(type)){
   const opts=type==='students'&&classFilter&&!old?data.students.filter(r=>r.classId===classFilter):data[type];
   input=select(l,opts.map(r=>[r.id,type==='students'?label(r)+' · '+ref('classes',r.classId):label(r)]));
   if(type==='classes'&&classFilter)input.value=classFilter;
   if(type==='years'){const y=yearOf(today());if(y)input.value=y.id}
   if(!data[type].length)link(l,type,'Ajouter d’abord : '+pages[type].toLowerCase()+' →','inline-link');
  }else if(enums[type]){input=select(l,enums[type]);if(def)input.value=def}
  else{
   input=el('input','',l);input.type=type||'text';
   if(type==='number'){input.min=0;input.max=20;input.step='any';input.inputMode='decimal'}
   if(type==='date'&&key!=='end'&&key!=='birth')input.value=today();
   if(def)input.value=def;
   if(k==='holidays'&&key==='name'){input.setAttribute('list','holiday-names');const dl=el('datalist','',l);dl.id='holiday-names';for(const v of ['Toussaint','Noël','Hiver','Printemps','Pont de l’Ascension','Été','Jour férié'])dl.append(new Option(v))}
  }
  input.name=key;input.required=!(k==='sessions'&&key==='time')&&!['sex','birth','needs'].includes(key);
  if(old&&old[key]!=null)input.value=old[key];
 }
 const btns=el('div','',form,'form-actions');
 el('button',old?'Enregistrer':'Ajouter',btns,'primary');
 if(old)button('Annuler',btns).onclick=()=>{editing={};render()};
 if(k==='cycles'){
  const hint=el('p','',p,'hint');
  const update=()=>{const v=Object.fromEntries(new FormData(form));if(!v.classId||!v.start||!v.end||v.end<v.start){hint.textContent='Choisissez la classe, le début et la fin du cycle.';return}
   const list=sessionsBetween(v.classId,v.start,v.end);
   hint.textContent=list.length?'Ce cycle compte '+plural(list.length,'séance')+' ('+fmtDate(list[0].date)+' → '+fmtDate(list.at(-1).date)+').':data.timetable.some(s=>s.classId===v.classId)?'Aucune séance sur cette période.':'Aucune séance : renseignez d’abord l’emploi du temps de cette classe.'};
  form.addEventListener('input',update);form.addEventListener('change',update);update();
 }
 form.onsubmit=async e=>{
  e.preventDefault();const row=Object.fromEntries(new FormData(form));
  if(row.end&&row.end<row.start){notify('La fin doit suivre le début.');return}
  const rec={...old,...row,id:old?.id||crypto.randomUUID()};
  if(k==='cycles')delete rec.goal;
  if(['grades','comments','observations'].includes(k)&&!rec.date)rec.date=today();
  if(k==='sessions'&&old?.slot)rec.custom='1';
  editing={};
  await transaction(k,t=>t.objectStore(k).put(rec));await load();
  let msg=old?'Modifications enregistrées.':'Ajouté.';
  if(k==='cycles')msg+=' '+plural(cycleSessions(rec).length,'séance')+' dans ce cycle.';
  if(['timetable','holidays','years'].includes(k)){const r=await syncSlots();if(r.added||r.removed)msg+=' Séances : '+r.added+' ajoutée(s), '+r.removed+' retirée(s).'}
  render();notify(msg);
 };

 const byClass=fields[k].some(f=>f[2]==='classes'),byStudent=fields[k].some(f=>f[2]==='students');
 let rows=data[k].slice();
 const head=el('div','',parent,'panel-head');
 const f=el('div','',head,'filters');
 if((byClass||byStudent)&&data.classes.length){
  const s=select(el('label','Classe',f),data.classes.map(c=>[c.id,c.name]),'Toutes les classes');
  if(!data.classes.some(c=>c.id===classFilter))classFilter='';s.value=classFilter;s.onchange=()=>{classFilter=s.value;render()};
  if(classFilter)rows=rows.filter(r=>byClass?r.classId===classFilter:find('students',r.student)?.classId===classFilter);
 }
 if(k==='sessions'){
  const s=select(el('label','Période',f),[['upcoming','À venir'],['past','Passées'],['all','Toutes']]);s.value=period;s.onchange=()=>{period=s.value;render()};
  const t=today();if(period==='upcoming')rows=rows.filter(r=>r.date>=t);if(period==='past')rows=rows.filter(r=>r.date<t);
 }
 el('h2',(listTitles[k]||pages[k])+' · '+rows.length,head,'section-title').style.order=-1;
 if(k==='students')rows.sort((a,b)=>(a.last+a.first).localeCompare(b.last+b.first,'fr'));
 else if(k==='timetable')rows.sort((a,b)=>(a.weekday+a.time).localeCompare(b.weekday+b.time));
 else if(k==='holidays'||k==='cycles'||(k==='sessions'&&period==='upcoming'))rows.sort(byDate);
 else if(rows[0]?.date||rows[0]?.start)rows.sort((a,b)=>byDate(b,a));
 if(!rows.length){el('p',k==='timetable'?'Aucun cours. Ajoutez votre premier créneau ci-dessus.':'Rien pour le moment. Utilisez le formulaire ci-dessus pour commencer.',parent,'empty');return}
 const list=el('div','',parent,'list');
 const shown=k==='sessions'?rows.slice(0,200):rows;
 for(const row of shown)renderItem(k,row,list);
 if(shown.length<rows.length)el('p',(rows.length-shown.length)+' séances supplémentaires : filtrez par classe ou par période.',parent,'muted');
}

function renderItem(k,row,list){
 const item=el('article','',list,'item'+(editing.k===k&&editing.id===row.id?' selected':'')+(row.cancelled?' cancelled':''));
 const student=k==='students'?row:row.student?find('students',row.student):null;
 if(student)avatar(student,item);else icon(k,el('span','',item,'avatar'+(row.classId?' t'+tint(row.classId):'')));
 const b=el('div','',item,'body');
 const t=today();
 const days=r=>Math.round((new Date(r.end)-new Date(r.start))/864e5)+1;
 const cyc=k==='cycles'?cycleSessions(row):[];
 const parts={
  years:[row.name,fmtDate(row.start)+' → '+fmtDate(row.end)+' · 1re semaine '+(row.firstWeek==='B'?'B':'A')],
  classes:[row.name,ref('years',row.year)+' · '+plural(pupilsOf(row.id).length,'élève')],
  students:[label(row),[ref('classes',row.classId),row.sex==='F'?'Fille':row.sex==='G'?'Garçon':'',row.birth?ageOf(row.birth)+' ans':''].filter(Boolean).join(' · ')],
  groups:[row.name,ref('classes',row.classId)],
  cycles:[ref('classes',row.classId)+' · '+row.name,row.start?fmtDate(row.start,{day:'numeric',month:'short'})+' → '+fmtDate(row.end,{day:'numeric',month:'short'})+' · '+plural(cyc.length,'séance')+(cyc.length?' ('+cyc.filter(isStarted).length+' faites)':''):'Dates à définir : modifiez le cycle'],
  sessions:[sessionTitle(row),[fmtDate(row.date),timeRange(row),cycleText(row)].filter(Boolean).join(' · ')],
  restrictions:[label(student),fmtDate(row.start)+' → '+fmtDate(row.end)+' · '+row.name],
  grades:[label(student),[row.date&&fmtDate(row.date),row.name,ref('classes',student?.classId)].filter(Boolean).join(' · ')],
  comments:[label(student),[row.date&&fmtDate(row.date),row.name].filter(Boolean).join(' · ')],
  observations:[label(student),[row.date&&fmtDate(row.date),row.name].filter(Boolean).join(' · ')],
  timetable:[enumLabel('weekday',row.weekday)+' · '+timeRange(row),ref('classes',row.classId)+' · '+row.name+' · '+enumLabel('duration',row.duration)],
  holidays:[row.name,(row.start===row.end?fmtDate(row.start,{weekday:'long',day:'numeric',month:'long',year:'numeric'}):fmtDate(row.start,{day:'numeric',month:'short'})+' → '+fmtDate(row.end,{day:'numeric',month:'short',year:'numeric'})+' · '+plural(days(row),'jour'))]
 }[k];
 if(student)link(b,'student='+student.id,parts[0]||'Élément supprimé','title');else if(k==='sessions')link(b,'session='+row.id,parts[0],'title');else el('span',parts[0]||'Élément supprimé',b,'title');el('span',parts[1],b,'meta');
 if(k==='grades'){const g=el('span',String(row.grade).replace('.',','),item,'grade');el('small',' /20',g)}
 if(k==='timetable')el('span',row.freq==='all'?'Chaque semaine':enumLabel('freq',row.freq),b,'tag'+(row.freq==='all'?'':' now'));
 if((k==='holidays'||k==='restrictions'||k==='cycles')&&row.start<=t&&row.end>=t)el('span','En cours',b,'tag '+(k==='cycles'?'now':'warn'));
 if(k==='sessions'&&row.cancelled)el('span','Supprimée · '+row.cancelled,b,'tag warn');
 else if(k==='sessions'&&isNow(row))el('span','En cours',b,'tag now');
 if(k==='students'&&restrictionOf(row.id))el('span','Inaptitude',b,'tag warn');
 const acts=el('div','',item,'item-actions');
 if(k==='sessions'){
  if(!row.cancelled&&isStarted(row))link(acts,'attendance','Appel','btn small').onclick=()=>{sessionId=row.id};
  if(!row.cancelled)iconButton('edit','Modifier',acts).onclick=()=>startEdit(k,row);
  iconButton('trash','Supprimer',acts,'danger').onclick=()=>row.cancelled?openSession(row):cancelSession(row);
  return;
 }
 iconButton('edit','Modifier',acts).onclick=()=>startEdit(k,row);
 iconButton('trash','Supprimer',acts,'danger').onclick=()=>remove(k,row.id);
}
function startEdit(k,row){editing={k,id:row.id};render();const f=view.querySelector('.panel.editing');f?.scrollIntoView({behavior:'smooth',block:'start'});f?.querySelector('input,select')?.focus({preventScroll:true})}

// Suppression avec cascade : retire aussi tout ce qui dépend de l'élément, après confirmation.
async function remove(k,id){
 const acc={};
 (function collect(key,rid){acc[key]??=new Set();if(acc[key].has(rid))return;acc[key].add(rid);for(const [dk,f] of deps[key]||[])for(const r of data[dk])if(r[f]===rid)collect(dk,r.id)})(k,id);
 const row=find(k,id);
 const name=k==='sessions'?sessionTitle(row)+' ('+fmtDate(row.date)+')':k==='timetable'?enumLabel('weekday',row.weekday)+' '+hh(row.time)+' · '+ref('classes',row.classId):label(row)||nouns[k][0];
 const also=Object.entries(acc).filter(([key,s])=>key!==k&&key!=='attendance'&&s.size).map(([key,s])=>plural(s.size,...nouns[key]));
 let msg='Supprimer définitivement « '+name+' » ?';
 if(also.length)msg+='\n\nCela supprimera aussi : '+also.join(', ')+(acc.attendance?.size?' et les appels associés':'')+'.';
 else if(acc.attendance?.size)msg+='\n\nLes appels associés seront aussi supprimés.';
 if(k==='timetable')msg+='\n\nLes séances futures de ce cours seront retirées (sauf celles modifiées, supprimées avec un motif ou avec un appel).';
 if(!confirm(msg))return false;
 const slot=k==='sessions'&&row.slot&&find('timetable',row.slot);
 await transaction(Object.keys(acc).concat(slot?['timetable']:[]),t=>{
  for(const [key,s] of Object.entries(acc))for(const rid of s)t.objectStore(key).delete(rid);
  // Une séance régulière effacée est mémorisée pour ne pas être recréée.
  if(slot){const date=row.id.split('@')[1]||row.date;t.objectStore('timetable').put({...slot,skip:[slot.skip,date].filter(Boolean).join(',')})}
 });
 if(editing.id&&acc[editing.k]?.has(editing.id))editing={};
 await load();
 if(['timetable','years','classes','holidays'].includes(k))await syncSlots();
 render();notify('Supprimé.');
 return true;
}

// ---------- Paramètres de l'application ----------
function renderSettings(){
 lockSettings();
 periodsSettings();
 aiSettings();
 traitsSettings();
 const cfg=settings();
 const p=panel(view,'Alertes « À surveiller »');
 el('p','Choisissez quand un élève apparaît dans le bloc « À surveiller » du tableau de bord.',p,'muted');
 const windows=[['4','4 dernières séances'],['6','6 dernières séances'],['8','8 dernières séances'],['10','10 dernières séances'],['12','12 dernières séances'],['cycle','le cycle en cours'],['year','l’année scolaire']];
 const save=async(changes)=>{await transaction('settings',t=>t.objectStore('settings').put({...settings(),...changes}));await load();render();notify('Paramètres enregistrés.')};
 for(const r of alertRules){
  const row=el('div','',p,'rule'+(cfg[r.key+'On']==='1'?'':' off'));
  const on=el('label','',row,'check');const cb=el('input','',on);cb.type='checkbox';cb.checked=cfg[r.key+'On']==='1';on.append('Signaler les '+r.label);
  cb.onchange=()=>save({[r.key+'On']:cb.checked?'1':'0'});
  const f=el('div','',row,'rule-fields');
  const min=select(el('label','À partir de',f),[...Array(10)].map((_,i)=>[String(i+1),plural(i+1,r.one,r.label)]));min.value=cfg[r.key+'Min'];min.disabled=!cb.checked;
  min.onchange=()=>save({[r.key+'Min']:min.value});
  const win=select(el('label','Sur',f),windows);win.value=cfg[r.key+'Window'];win.disabled=!cb.checked;
  win.onchange=()=>save({[r.key+'Window']:win.value});
 }
 const n=watchList();
 el('p',n.length?'Avec ces réglages : '+plural(n.length,'alerte')+' en ce moment.':'Avec ces réglages : aucune alerte en ce moment.',p,'hint');
 const b=el('div','',p,'actions');button('Rétablir les réglages par défaut',b).onclick=()=>save(defaultSettings);
}

// ---------- Suivi des absences ----------
let absClass='',absPeriod='year',absView='summary';
function periodSessions(classId,period){
 const t=today();let list=calledSessions(classId);
 if(period==='year'){const y=yearOf(t);if(y)list=list.filter(s=>s.date>=y.start&&s.date<=y.end)}
 else if(period==='cycle'){const c=currentCycle(classId);list=c&&c.start<=t?list.filter(s=>s.date>=c.start&&s.date<=c.end):[]}
 else{const c=find('cycles',period);list=c?list.filter(s=>s.date>=c.start&&s.date<=c.end):[]}
 return list.sort(byDate);
}
function studentStats(p,list){
 const out={sessions:list.length};for(const st of statuses)out[st]=0;
 for(const s of list){const a=attOf(s.id,p.id);out[a.presence]++;for(const x of a.extras)out[x]++}
 out.rate=list.length?Math.round((list.length-out['Absent'])/list.length*100):null;
 return out;
}
const mentionCols=statuses.filter(s=>s!=='Présent');
function statusIcon(st,parent){const v=document.createElementNS(svgNS,'svg');v.setAttribute('viewBox','0 0 24 24');v.setAttribute('aria-hidden','true');const p=document.createElementNS(svgNS,'path');p.setAttribute('d',statusInfo[st].icon);v.append(p);parent.append(v);return v}
function statusDot(st,parent,cls){const d=el('span','',parent,'dot'+(cls?' '+cls:''));statusIcon(st,d);d.style.background=statusInfo[st].bg;d.style.color=statusInfo[st].fg;d.title=st;return d}
function renderAbsences(){
 if(!data.classes.length){el('p','Aucune classe pour le moment.',view,'empty');return}
 if(absClass&&!find('classes',absClass))absClass='';
 const f=el('div','',view,'filters panel');
 const cs=select(el('label','Classe',f),data.classes.map(c=>[c.id,c.name]),'Toutes les classes');cs.value=absClass;
 cs.onchange=()=>{absClass=cs.value;if(!['year','cycle'].includes(absPeriod))absPeriod='cycle';render()};
 const opts=[['year','Depuis le début de l’année'],['cycle','Cycle en cours']];
 if(absClass)for(const c of data.cycles.filter(c=>c.classId===absClass&&c.start).sort(byDate))opts.push([c.id,'Cycle · '+c.name+' ('+fmtDate(c.start,{day:'numeric',month:'short'})+' → '+fmtDate(c.end,{day:'numeric',month:'short'})+')']);
 const ps=select(el('label','Période',f),opts);if(!opts.some(o=>o[0]===absPeriod))absPeriod='year';ps.value=absPeriod;ps.onchange=()=>{absPeriod=ps.value;render()};
 const seg=el('div','',f,'segmented');seg.setAttribute('role','group');seg.setAttribute('aria-label','Affichage');
 for(const [v,t] of [['summary','Synthèse'],['grid','Détail par séance']]){const b=button(t,seg);b.setAttribute('aria-pressed',absView===v);b.onclick=()=>{absView=v;render()}}

 const classes=absClass?[find('classes',absClass)]:data.classes;
 const rows=[];let total={sessions:0};for(const st of statuses)total[st]=0;
 for(const c of classes){const list=periodSessions(c.id,absPeriod);for(const p of pupilsOf(c.id)){const st=studentStats(p,list);rows.push({p,c,st,list});for(const k of statuses)total[k]+=st[k];total.sessions+=st.sessions}}
 const kpis=el('div','',view,'kpis');
 const kpi=(t,v,sub)=>{const a=el('div','',kpis,'kpi');el('span',t,a);el('b',v,a);el('small',sub,a)};
 kpi('Absences',total['Absent'],'sur '+plural(total.sessions,'présence attendue','présences attendues'));
 kpi('Taux de présence',total.sessions?Math.round((total.sessions-total['Absent'])/total.sessions*100)+' %':'—',absPeriod==='year'?'Année scolaire':'Période choisie');
 kpi('Retards',total['Retard'],'');
 kpi('Oublis de tenue / chaussures',total['Oubli de tenue']+total['Oubli de chaussures'],'');
 if(!total.sessions){el('p','Aucun appel enregistré sur cette période.',view,'empty');return}

 if(absView==='grid'){
  if(!absClass){el('p','Choisissez une classe pour voir le détail séance par séance.',view,'empty');return}
  const list=rows[0]?.list||[];
  const box=el('div','',view,'table-box');const tb=el('table','',box,'matrix');
  const hr=el('tr','',el('thead','',tb));el('th','Élève',hr,'sticky');
  for(const s of list){const th=el('th','',hr);el('span',fmtDate(s.date,{day:'numeric',month:'numeric'}),th);th.title=longDate(s.date)+' · '+(cycleOf(s)?.name||s.name)}
  el('th','Abs.',hr);
  const body=el('tbody','',tb);
  for(const {p,st} of rows){
   const tr=el('tr','',body);const th=el('th','',tr,'sticky');link(th,'student='+p.id,label(p));
   for(const s of list){const td=el('td','',tr);const m=marksIn(s,p);if(m.length)m.forEach(x=>statusDot(x,td));else td.textContent='·'}
   el('td',st['Absent']||'',tr,'num');
  }
  const lg=el('div','',view,'legend');for(const st of mentionCols){const sp=el('span','',lg);statusDot(st,sp);sp.append(st)}
  return;
 }
 rows.sort((a,b)=>b.st['Absent']-a.st['Absent']||(a.p.last+a.p.first).localeCompare(b.p.last+b.p.first,'fr'));
 const tools=el('div','',view,'actions');
 button('Exporter en CSV',tools,'small').onclick=()=>{
  const head=['Nom','Prénom','Classe','Séances',...mentionCols,'Présence %'];
  const csv=[head,...rows.map(({p,c,st})=>[p.last,p.first,c.name,st.sessions,...mentionCols.map(k=>st[k]),st.rate??''])].map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv'}));a.download='absences-'+today()+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
 };
 const box=el('div','',view,'table-box');const tb=el('table','',box,'stats');
 const hr=el('tr','',el('thead','',tb));el('th','Élève',hr);if(!absClass)el('th','Classe',hr);el('th','Séances',hr,'num');
 for(const st of mentionCols){const th=el('th','',hr,'num');statusDot(st,th);th.setAttribute('aria-label',st)}
 el('th','Présence',hr,'num');
 const body=el('tbody','',tb);
 for(const {p,c,st} of rows){
  const tr=el('tr','',body,st['Absent']?'has-abs':'');
  const th=el('th','',tr);const a=link(th,'student='+p.id,'','who');avatar(p,a,'sm');a.append(label(p));
  if(!absClass)el('td',c.name,tr);el('td',st.sessions,tr,'num');
  for(const k of mentionCols)el('td',st[k]||'',tr,'num'+(st[k]?' strong':''));
  el('td',st.rate==null?'—':st.rate+' %',tr,'num');
 }
}

// ---------- Fiche élève ----------
function renderStudent(id){
 const p=find('students',id);
 if(!p){el('p','Élève introuvable.',view,'empty');link(view,'students','← Retour aux élèves','link');return}
 document.querySelector('h1').textContent=label(p);document.title=label(p)+' · EPS Manager';
 const c=find('classes',p.classId),t=today(),y=yearOf(t);
 const yearList=periodSessions(p.classId,'year'),st=studentStats(p,yearList);
 const grades=data.grades.filter(g=>g.student===id).sort(byDate);
 const avg=grades.length?(grades.reduce((n,g)=>n+Number(g.grade),0)/grades.length):null;

 const head=el('section','',view,'panel profile-head');
 avatar(p,head,'xl');
 const info=el('div','',head,'body');
 el('h2',label(p),info);
 el('span',[c?c.name:'Sans classe',y?.name,p.sex==='F'?'Fille':p.sex==='G'?'Garçon':'',p.birth?'née'.slice(0,p.sex==='F'?3:2)+' le '+fmtDate(p.birth,{day:'numeric',month:'long',year:'numeric'})+' ('+ageOf(p.birth)+' ans)':''].filter(Boolean).join(' · '),info,'muted');
 if(p.needs)el('span','Besoins particuliers : '+p.needs,info,'tag needs');
 const r=restrictionOf(id);if(r)el('span','Inaptitude jusqu’au '+fmtDate(r.end)+' · '+r.name,info,'tag warn');
 const ha=el('div','',head,'actions');
 button('Modifier',ha).onclick=()=>{editing={k:'students',id};location.hash='#students'};
 link(ha,'students','← Tous les élèves','btn small');

 const kpis=el('div','',view,'kpis');
 const kpi=(t,v,sub,alert)=>{const a=el('div','',kpis,'kpi'+(alert?' alert':''));el('span',t,a);el('b',v,a);el('small',sub,a)};
 kpi('Présence (année)',st.rate==null?'—':st.rate+' %',plural(st.sessions,'séance')+' avec appel');
 kpi('Absences',st['Absent'],'depuis le début de l’année',st['Absent']>=3);
 kpi('Retards',st['Retard'],'');
 kpi('Oublis',st['Oubli de tenue']+st['Oubli de chaussures'],st['Oubli de tenue']+' tenue · '+st['Oubli de chaussures']+' chaussures',st['Oubli de tenue']+st['Oubli de chaussures']>=3);
 kpi('Moyenne (année)',avgFmt(studentAverage(id,null)),periodsOf(y).map(p=>p.name.replace(/^Trimestre /,'T').replace(/^Semestre /,'S')+' '+avgFmt(studentAverage(id,p))).join(' · ')||plural(grades.length,'note'));

 // Assiduité par cycle
 const pa=panel(view,'Assiduité');
 const cycles=data.cycles.filter(x=>x.classId===p.classId&&x.start&&x.start<=t).sort(byDate);
 if(!yearList.length)el('p','Aucun appel enregistré cette année.',pa,'empty');
 else{
  const box=el('div','',pa,'table-box flat');const tb=el('table','',box,'stats');
  const hr=el('tr','',el('thead','',tb));el('th','Période',hr);el('th','Séances',hr,'num');for(const k of mentionCols){const th=el('th','',hr,'num');statusDot(k,th)}
  const body=el('tbody','',tb);
  const line=(name,list,cls)=>{const s2=studentStats(p,list);const tr=el('tr','',body,cls||'');el('th',name,tr);el('td',s2.sessions,tr,'num');for(const k of mentionCols)el('td',s2[k]||'',tr,'num'+(s2[k]?' strong':''))};
  for(const cy of cycles)line(cy.name+' · '+fmtDate(cy.start,{day:'numeric',month:'short'})+' → '+fmtDate(cy.end,{day:'numeric',month:'short'}),periodSessions(p.classId,cy.id));
  line('Année scolaire',yearList,'total');
  // Frise de toutes les séances
  el('h3','Toutes les séances',pa);
  const strip=el('div','',pa,'strip');
  for(const s of yearList){const x=statusIn(s,p);const sq=el('span','',strip,'sq'+(x==='Présent'?' ok':''));statusIcon(x,sq);if(x!=='Présent'){sq.style.background=statusInfo[x].bg;sq.style.color=statusInfo[x].fg}sq.title=longDate(s.date)+' · '+(cycleOf(s)?.name||s.name)+' · '+(marksIn(s,p).join(', ')||x)}
  const ments=yearList.filter(s=>marksIn(s,p).length).sort((a,b)=>byDate(b,a));
  el('h3','Mentions · '+ments.length,pa);
  if(!ments.length)el('p','Aucune absence, aucun retard ni oubli cette année.',pa,'muted');
  const ml=el('div','',pa,'mentions');
  for(const s of ments){const m=marksIn(s,p);const row=link(ml,'attendance','','row');row.onclick=()=>{sessionId=s.id};const ds=el('span','',row,'dots');m.forEach(x=>statusDot(x,ds));const b=el('div','',row,'body');el('span',m.join(' · '),b,'title');el('span',longDate(s.date)+(s.time?' · '+hh(s.time):'')+(cycleOf(s)?' · '+cycleOf(s).name:''),b,'meta')}
 }

 const grid=el('div','',view,'grid');
 historyPanel(grid,'restrictions','Inaptitudes',id,x=>[fmtDate(x.start)+' → '+fmtDate(x.end),x.name,x.start<=t&&x.end>=t?'En cours':'']);
 historyPanel(grid,'grades','Évaluations',id,x=>[x.name,(x.date?fmtDate(x.date):''),'',String(x.grade).replace('.',',')+' /20']);
 historyPanel(grid,'observations','Observations',id,x=>[x.name,x.date?fmtDate(x.date):'']);
 historyPanel(grid,'comments','Appréciations',id,x=>[x.name,x.date?fmtDate(x.date):'']);
 studentResults(id);
}
function historyPanel(parent,k,title,studentId,fmt){
 const rows=data[k].filter(x=>x.student===studentId).sort((a,b)=>byDate(b,a));
 const p=panel(parent,title+' · '+rows.length);
 button('+ Ajouter',p.querySelector('.panel-head'),'small').onclick=()=>quickAdd(k,studentId);
 if(!rows.length)el('p','Rien pour le moment.',p,'muted');
 for(const x of rows){
  const [main,meta,tag,big]=fmt(x);
  const r=el('div','',p,'row hist');const b=el('div','',r,'body');el('span',main,b,'title');if(meta)el('span',meta,b,'meta');
  if(tag)el('span',tag,r,'tag warn');if(big)el('span',big,r,'grade');
  iconButton('trash','Supprimer',r,'danger').onclick=()=>remove(k,x.id);
 }
}
function quickAdd(k,studentId){
 const titles={restrictions:'Nouvelle inaptitude',grades:'Nouvelle note',observations:'Nouvelle observation',comments:'Nouvelle appréciation'};
 const d=sheet(titles[k]);el('p',ref('students',studentId),d,'muted');
 const form=el('form','',d,'add');
 for(const [key,title,type] of fields[k].filter(f=>f[2]!=='students')){
  const l=el('label',title,form);
  const input=key==='name'&&(k==='observations'||k==='comments'||k==='restrictions')?el('textarea','',l):el('input','',l);
  if(input.tagName==='INPUT'){input.type=type||'text';if(type==='number'){input.min=0;input.max=20;input.step='any';input.inputMode='decimal'}if(type==='date'&&key==='start')input.value=today()}
  else input.rows=3;
  input.name=key;input.required=true;
 }
 el('button','Enregistrer',el('div','',form,'form-actions'),'primary');
 form.onsubmit=async e=>{e.preventDefault();const row=Object.fromEntries(new FormData(form));if(row.end&&row.end<row.start){notify('La fin doit suivre le début.');return}
  const rec={...row,student:studentId,id:crypto.randomUUID()};if(k!=='restrictions')rec.date=today();
  await transaction(k,t=>t.objectStore(k).put(rec));await load();d.close();render();notify('Enregistré.')};
 d.showModal();form.querySelector('input,textarea')?.focus();
}

// ---------- Fiche séance : contenu et résultats ----------
const saveTimers={};
function saveField(id,key,value,status){
 clearTimeout(saveTimers[key]);status.textContent='Enregistrement…';
 saveTimers[key]=setTimeout(async()=>{
  const cur=find('sessions',id);if(!cur)return;const next={...cur,[key]:value};
  try{await transaction('sessions',t=>t.objectStore('sessions').put(next));Object.assign(cur,next);status.textContent='✓ Enregistré automatiquement'}catch{status.textContent='Enregistrement impossible'}
 },500);
}
function renderSession(id){
 const s=find('sessions',id);
 if(!s){el('p','Séance introuvable.',view,'empty');link(view,'calendar','← Retour au calendrier','link');return}
 document.querySelector('h1').textContent=sessionTitle(s);document.title=sessionTitle(s)+' · EPS Manager';
 const siblings=data.sessions.filter(x=>x.classId===s.classId).sort(byDate),i=siblings.findIndex(x=>x.id===s.id);

 const head=el('section','',view,'panel session-head');
 const top=el('div','',head,'panel-head');
 const info=el('div','',top,'body');
 el('strong',longDate(s.date)+(s.time?' · '+timeRange(s):''),info);
 el('span',[ref('classes',s.classId),cycleText(s),s.slot?'Cours régulier':'Séance ponctuelle'].filter(Boolean).join(' · '),info,'muted');
 const nv=el('div','',top,'cal-nav');
 const prev=iconButton('prev','Séance précédente de la classe',nv);prev.disabled=i<=0;prev.onclick=()=>{location.hash='#session='+siblings[i-1].id};
 const next=iconButton('next','Séance suivante de la classe',nv);next.disabled=i>=siblings.length-1;next.onclick=()=>{location.hash='#session='+siblings[i+1].id};
 if(s.cancelled)el('p','Séance supprimée · '+s.cancelled,head,'notice');
 else{
  const recs=recordsOf(s.id),total=pupilsOf(s.classId).length;
  if(isCalled(s)){const sum=el('div','',head,'legend');const pres=el('span','',sum);statusDot('Présent',pres);pres.append('Présents · '+(total-recs.filter(r=>r.status==='Absent').length));
   for(const st of mentionCols){const n=recs.filter(r=>r.status===st).length;if(n){const sp=el('span','',sum);statusDot(st,sp);sp.append(st+' · '+n)}}}
  else el('p',isStarted(s)?'Appel pas encore fait.':'Séance à venir.',head,'muted');
 }
 const acts=el('div','',head,'actions');
 if(!s.cancelled)link(acts,'attendance',isCalled(s)?'Voir l’appel':'Faire l’appel','btn primary').onclick=()=>{sessionId=s.id};
 link(acts,'boards','Tableaux de la classe','btn').onclick=()=>{classFilter=s.classId};
 moduleIcon(acts,s);
 button('Date, heure, classe…',acts).onclick=()=>{editing={k:'sessions',id:s.id};location.hash='#sessions'};
 if(s.cancelled)button('Rétablir / effacer…',acts,'danger').onclick=()=>openSession(s);else button('Supprimer…',acts,'danger').onclick=()=>cancelSession(s);

 // Contenu pédagogique, enregistré automatiquement
 const p=panel(view,'Contenu de la séance');
 const status=el('span',hasContent(s)?'✓ Enregistré automatiquement':'Saisissez le contenu : il est enregistré automatiquement.',p.querySelector('.panel-head'),'autosave');
 const sources=data.sessions.filter(x=>x.id!==s.id&&hasContent(x)).sort((a,b)=>(a.classId===s.classId?0:1)-(b.classId===s.classId?0:1)||byDate(b,a)).slice(0,40);
 if(sources.length){
  const cp=el('div','',p,'filters');
  const sel=select(el('label','Reprendre le contenu d’une autre séance',cp),sources.map(x=>[x.id,fmtDate(x.date)+' · '+sessionTitle(x)]));
  button('Reprendre',cp).onclick=async()=>{
   if(hasContent(s)&&!confirm('Remplacer le contenu actuel de cette séance ?'))return;
   const src=find('sessions',sel.value),next={...find('sessions',s.id)};for(const [k] of contentFields){if(src[k])next[k]=src[k];else delete next[k]}
   await transaction('sessions',t=>t.objectStore('sessions').put(next));await load();render();notify('Contenu repris. Vous pouvez l’adapter.');
  };
 }
 const grid=el('div','',p,'content-grid');
 for(const [key,title,ph] of contentFields){
  const l=el('label',title,grid,key==='main'?'wide':'');const ta=el('textarea','',l);ta.value=s[key]||'';ta.rows=key==='main'?7:3;if(ph)ta.placeholder=ph;
  ta.oninput=()=>saveField(s.id,key,ta.value,status);
 }

 resultsPanel(s);
}
function resultsPanel(s){
 const p=panel(view,'Résultats des applications');
 const all=data.results.filter(r=>r.sessionId===s.id),rows=all.filter(r=>r.student);
 const sums=all.filter(r=>!r.student);
 if(sums.length){const box=el('div','',p,'module-summary');for(const x of sums){const r=el('div','',box,'row');icon('modules',el('span','',r,'avatar'));const b=el('div','',r,'body');el('span',x.module,b,'title');el('span',x.value,b,'meta')}}
 if(!rows.length&&!sums.length)el('p','Les résultats des applications associées (chronomètre, tests physiques, évaluations…) apparaîtront ici, séance par séance et élève par élève.',p,'muted');
 const mods=[...new Set(rows.map(r=>r.module))];
 for(const m of mods){
  const list=rows.filter(r=>r.module===m).sort((a,b)=>ref('students',a.student).localeCompare(ref('students',b.student),'fr'));
  const h=el('div','',p,'panel-head');el('h3',m+' · '+plural(list.length,'résultat'),h);
  button('Retirer',h,'small danger').onclick=async()=>{if(!confirm('Retirer les '+list.length+' résultats « '+m+' » de cette séance ?'))return;await transaction('results',t=>list.forEach(r=>t.objectStore('results').delete(r.id)));await load();render();notify('Résultats retirés.')};
  const box=el('div','',p,'table-box flat');const tb=el('table','',box,'stats');
  const hr=el('tr','',el('thead','',tb));el('th','Élève',hr);el('th','Épreuve',hr);el('th','Résultat',hr,'num');
  const body=el('tbody','',tb);
  for(const r of list){const tr=el('tr','',body);const th=el('th','',tr);const st=find('students',r.student);link(th,'student='+r.student,label(st)||'Élève supprimé');el('td',r.label,tr);el('td',[r.value,r.unit].filter(Boolean).join(' '),tr,'num strong')}
 }
 const imp=el('details','',p,'import-results');el('summary','Importer des résultats depuis un fichier (JSON)',imp);
 const f=el('input','',el('label','Fichier exporté par une application',imp));f.type='file';f.accept='.json,application/json';
 f.onchange=()=>importResults(s,f.files[0]);
 el('p','Format attendu :',imp,'muted');
 el('pre','{\n  "module": "Chrono demi-fond",\n  "resultats": [\n    { "nom": "Martin", "prenom": "Léa", "epreuve": "3×500 m", "valeur": "2:05", "unite": "min" },\n    { "eleve": "<identifiant de l’élève>", "epreuve": "VMA", "valeur": "13", "unite": "km/h" }\n  ]\n}',imp,'code');
}
// Ajoute des résultats de module à une séance (utilisable par les futurs modules intégrés).
async function addResults(session,module,items){
 const norm=x=>(x||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
 const pupils=pupilsOf(session.classId),rows=[],missing=[];
 for(const r of items){
  let p=pupils.find(x=>x.id===(r.eleve||r.student));
  if(!p){const a=norm((r.prenom||r.first||'')+' '+(r.nom||r.last||'')),b=norm((r.nom||r.last||'')+' '+(r.prenom||r.first||''));const e=norm(r.eleve);p=pupils.find(x=>[a,b,e].includes(norm(x.first+' '+x.last))||[a,b,e].includes(norm(x.last+' '+x.first)))}
  if(!p){missing.push([r.prenom,r.nom,r.eleve].filter(Boolean).join(' ')||'?');continue}
  rows.push({id:crypto.randomUUID(),sessionId:session.id,module:String(module),student:p.id,label:String(r.epreuve??r.label??''),value:String(r.valeur??r.value??''),unit:String(r.unite??r.unit??''),date:session.date});
 }
 if(rows.length){await transaction('results',t=>rows.forEach(r=>t.objectStore('results').put(r)));await load()}
 return {added:rows.length,missing};
}
async function importResults(s,file){
 if(!file)return;
 try{
  const j=JSON.parse(await file.text());const items=j.resultats||j.results;
  if(!Array.isArray(items))throw Error();
  const r=await addResults(s,j.module||'Application',items);render();
  notify(plural(r.added,'résultat importé','résultats importés')+(r.missing.length?' · non reconnus : '+r.missing.slice(0,3).join(', ')+(r.missing.length>3?'…':''):'')+'.');
 }catch{notify('Import impossible : vérifiez le format du fichier.')}
}
function studentResults(id){
 const rows=data.results.filter(r=>r.student===id).sort((a,b)=>byDate(b,a));
 const p=panel(view,'Résultats des applications · '+rows.length);
 if(!rows.length){el('p','Aucun résultat d’application pour le moment.',p,'muted');return}
 const box=el('div','',p,'table-box flat');const tb=el('table','',box,'stats');
 const hr=el('tr','',el('thead','',tb));el('th','Date',hr);el('th','Application',hr);el('th','Épreuve',hr);el('th','Résultat',hr,'num');
 const body=el('tbody','',tb);
 for(const r of rows){const tr=el('tr','',body);const th=el('th','',tr);link(th,'session='+r.sessionId,fmtDate(r.date));el('td',r.module,tr);el('td',r.label,tr);el('td',[r.value,r.unit].filter(Boolean).join(' '),tr,'num strong')}
}
// Contenu et résultats d'exemple (appelé par loadSample).
async function sampleContent(){
 const df=data.sessions.filter(s=>s.classId==='ex-5B'&&active(s)&&s.date>='2026-09-01'&&s.date<='2026-10-16').sort(byDate);
 const nextB=data.sessions.filter(s=>s.classId==='ex-5B'&&active(s)&&s.date>today()).sort(byDate)[0];
 const contents=[
  {objective:'Courir à allure régulière pendant 6 minutes.',material:'Piste de 200 m, plots tous les 25 m, chronomètre, fiches de suivi.',warmup:'Footing 5 min, gammes athlétiques, 2 accélérations progressives.',main:'Situation 1 : 2 × 6 min à allure cible (VMA × 70 %), un bip toutes les 30 s.\nCritère de réussite : arriver au plot au bip, à ±1 plot.\n\nSituation 2 : course en binôme, l’observateur note les écarts.',end:'Étirements, bilan collectif : qui a tenu son allure ?',notes:'Bonne séance, beaucoup partent trop vite. Reprendre le travail d’allure.'},
  {objective:'Connaître sa VMA et ses allures de course.',material:'Piste, bande-son du test, plots.',warmup:'Footing 6 min, mobilité articulaire.',main:'Test de VMA (palier de 1 min).\nRelevé des paliers atteints par binôme.',end:'Retour au calme en marchant, calcul des allures cibles.',notes:''},
  {objective:'Évaluation : 3 × 500 m à allure choisie.',material:'Piste, chronomètres, fiches d’évaluation.',warmup:'Échauffement autonome guidé (10 min).',main:'3 × 500 m, récupération 3 min.\nNote : régularité (écart entre les 3 temps) + respect du projet.',end:'Bilan individuel du cycle.',notes:'Évaluation réussie dans l’ensemble.'}
 ];
 const up=[];df.slice(-3).forEach((s,i)=>up.push({...s,...contents[i]}));
 if(nextB)up.push({...nextB,objective:'Varier la longueur des frappes pour mettre l’adversaire en difficulté.',material:'7 terrains, volants plastiques, plots cibles au fond du terrain.',warmup:'Jonglages, échanges en coopération (dégagés), déplacements.',main:'Situation 1 : « fond de court » – marquer 2 points si le volant tombe dans la zone arrière.\nSituation 2 : montante-descendante, matchs de 4 min.',end:'Retour sur les stratégies qui ont marché.'});
 if(up.length)await transaction('sessions',t=>up.forEach(r=>t.objectStore('sessions').put(r)));
 await load();
 const evalS=df.at(-1),vmaS=df.at(-2);
 if(evalS){let seed=7;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};
  await addResults(evalS,'Chrono demi-fond',pupilsOf('ex-5B').map(p=>{const sec=110+Math.round(rnd()*50);return {eleve:p.id,epreuve:'3×500 m · moyenne',valeur:Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'),unite:'min'}}));
  if(vmaS)await addResults(vmaS,'Test VMA',pupilsOf('ex-5B').map(p=>({eleve:p.id,epreuve:'VMA',valeur:String(Math.round((10+rnd()*5)*2)/2).replace('.',','),unite:'km/h'})));
 }
}

// ---------- Tableaux de classe (moteur MonTableauBlanc, board/board.js) ----------
let openBoards=[];const boardPick=new Set();
const parseJSON=(v,d)=>{try{return JSON.parse(v||'')??d}catch{return d}};
// Le moteur attend « NOM Prénom » et un portrait JPEG en base64 : ce sont les élèves et photos PRONOTE de l'application.
const boardStudents=classId=>pupilsOf(classId).map(p=>({id:p.id,name:p.last.toLocaleUpperCase('fr')+' '+p.first,portrait:p.photo||''}));
const boardBackgrounds=()=>typeof BOARD_BACKGROUNDS==='object'?BOARD_BACKGROUNDS:{blank:'Tableau blanc'};
function newBoardRecord(classId,name,board={}){const now=new Date().toISOString();return {id:crypto.randomUUID(),classId,name,board:JSON.stringify(board),archives:'[]',created:now,updated:now}}
function putBoard(rec){
 const i=data.boards.findIndex(b=>b.id===rec.id);if(i<0)data.boards.push(rec);else data.boards[i]=rec;
 return transaction('boards',t=>t.objectStore('boards').put(rec)).catch(()=>notify('Enregistrement du tableau impossible sur cet appareil.'));
}
window.EPSBoardHost={
 notify:m=>notify(m),
 render:()=>render(),
 // Appelé par le moteur à chaque modification : enregistre les tableaux ouverts dans la base de l'application.
 save:()=>{for(const o of openBoards){o.rec={...o.rec,name:o.group.name,board:JSON.stringify(o.group.board||{}),archives:JSON.stringify(o.group.boardArchives||[]),updated:new Date().toISOString()};putBoard(o.rec)}return true}
};
function boardSheet(classId,rec){
 const c=find('classes',classId),d=sheet(rec?'Renommer le tableau':'Nouveau tableau · '+c.name);
 const form=el('form','',d,'add');
 const name=el('input','',el('label','Nom du tableau',form));name.required=true;name.maxLength=80;
 name.value=rec?rec.name:(currentCycle(classId)?.name||'Tableau')+' · '+fmtDate(today(),{day:'numeric',month:'short'});
 let bg,abs;
 if(!rec){
  bg=select(el('label','Fond',form),Object.entries(boardBackgrounds()).filter(([k])=>k!=='tennis'));
  const s=data.sessions.find(x=>x.classId===classId&&x.date===today()&&active(x)&&isCalled(x));
  const absents=s?recordsOf(s.id).filter(r=>r.status==='Absent').map(r=>r.student):[];
  if(s){const l=el('label','',form,'check');abs=el('input','',l);abs.type='checkbox';abs.checked=true;l.append(' Reprendre l’appel du jour ('+plural(absents.length,'absent')+')');abs.dataset.ids=absents.join(',')}
 }
 el('button',rec?'Enregistrer':'Créer le tableau',el('div','',form,'form-actions'),'primary');
 form.onsubmit=async e=>{e.preventDefault();const n=name.value.trim();if(!n)return;
  if(rec){const b=parseJSON(rec.board,{});await putBoard({...rec,name:n,updated:new Date().toISOString()});d.close();render();notify('Tableau renommé.');return}
  const board={background:bg.value};if(abs?.checked)board.absentIds=abs.dataset.ids.split(',').filter(Boolean);
  const r=newBoardRecord(classId,n,board);await putBoard(r);d.close();location.hash='#board='+r.id};
 d.showModal();name.focus();name.select();
}
function boardPreview(rec,parent){
 const b=parseJSON(rec.board,{}),box=el('div','',parent,'board-mini'),pos=Object.values(b.positions||{});
 for(const p of pos.slice(0,40)){const i=el('i','',box);i.style.left=p.x+'%';i.style.top=p.y+'%'}
 if(!pos.length)el('span',boardBackgrounds()[b.background||'blank']||'Tableau blanc',box);
}
function renderBoards(){
 if(!data.classes.length){el('p','Créez d’abord une classe et ses élèves.',view,'empty');link(view,'classes','Créer une classe →','btn primary').style.alignSelf='start';return}
 if(classFilter&&!find('classes',classFilter))classFilter='';
 if(!classFilter){
  el('p','Choisissez une classe. Chaque tableau garde ses élèves, son fond (terrains, échelle de 1 à 20, montée-descente…), les positions, les notes et les dessins.',view,'muted');
  const grid=el('div','',view,'list');
  for(const c of data.classes){const n=data.boards.filter(b=>b.classId===c.id).length;const a=link(grid,'boards','','class-card');a.onclick=()=>{classFilter=c.id;queueMicrotask(render)};
   const top=el('div','',a,'top');el('strong',c.name,top);el('span',plural(pupilsOf(c.id).length,'élève'),top,'muted');el('span',n?plural(n,'tableau','tableaux'):'Aucun tableau',a).style.fontWeight='600'}
  return;
 }
 const c=find('classes',classFilter);
 for(const id of [...boardPick])if(find('boards',id)?.classId!==c.id)boardPick.delete(id);
 const bar=el('div','',view,'cal-bar');
 const f=el('div','',bar,'filters');const cs=select(el('label','Classe',f),data.classes.map(x=>[x.id,x.name]));cs.value=c.id;cs.onchange=()=>{classFilter=cs.value;boardPick.clear();render()};
 const acts=el('div','',bar,'actions');
 if(boardPick.size>=2)button('Ouvrir ensemble · '+boardPick.size,acts,'primary').onclick=()=>{location.hash='#board='+[...boardPick].join(',')};
 const imp=el('input','',acts);imp.type='file';imp.accept='.json,application/json';imp.hidden=true;
 button('Importer un fichier',acts).onclick=()=>imp.click();
 imp.onchange=async()=>{try{const j=JSON.parse(await imp.files[0].text());if(j.format!=='mon-tableau-blanc'||typeof j.board!=='object')throw Error();
  const r=newBoardRecord(c.id,String(j.name||'Tableau importé').slice(0,80),j.board);await putBoard(r);render();notify('Tableau importé.')}catch{notify('Fichier de tableau non reconnu.')}};
 button('+ Nouveau tableau',acts,'primary').onclick=()=>boardSheet(c.id);
 const boards=data.boards.filter(b=>b.classId===c.id).sort((a,b)=>(b.updated||'').localeCompare(a.updated||''));
 if(!boards.length){el('p','Aucun tableau pour la '+c.name+'. Créez-en un pour placer vos élèves sur un terrain, faire des groupes ou une montée-descente.',view,'empty');return}
 const grid=el('div','',view,'list');
 for(const b of boards){
  const card=el('article','',grid,'board-card');
  const top=el('div','',card,'top');link(top,'board='+b.id,b.name,'name');
  boardPreview(b,link(card,'board='+b.id,'',''));
  const lb=parseJSON(b.board,{}),placed=Object.keys(lb.positions||{}).length,notes=(lb.marks||[]).filter(m=>m.type==='note').length;
  el('span',[boardBackgrounds()[lb.background||'blank'],placed?plural(placed,'élève placé','élèves placés'):'',notes?plural(notes,'note'):'','modifié le '+fmtDate((b.updated||'').slice(0,10),{day:'numeric',month:'short'})].filter(Boolean).join(' · '),card,'muted');
  const row=el('div','',card,'item-actions');
  const pick=el('label','',row,'check');const cb=el('input','',pick);cb.type='checkbox';cb.checked=boardPick.has(b.id);pick.append('Ouvrir ensemble');
  cb.onchange=()=>{if(cb.checked&&boardPick.size>=4){cb.checked=false;notify('4 tableaux au maximum sur la même page.');return}cb.checked?boardPick.add(b.id):boardPick.delete(b.id);render()};
  iconButton('edit','Renommer',row).onclick=()=>boardSheet(c.id,b);
  button('Dupliquer',row,'small').onclick=async()=>{const r={...newBoardRecord(c.id,b.name+' (copie)'),board:b.board};await putBoard(r);render();notify('Tableau dupliqué.')};
  iconButton('trash','Supprimer',row,'danger').onclick=()=>remove('boards',b.id);
 }
}
function renderBoard(param){
 const recs=param.split(',').map(id=>find('boards',id)).filter(Boolean).slice(0,4);
 if(!recs.length){el('p','Tableau introuvable.',view,'empty');link(view,'boards','← Tableaux','link');return}
 if(typeof renderClassBoard!=='function'){el('p','Le tableau n’a pas pu se charger. Rechargez la page.',view,'notice');return}
 const classId=recs[0].classId,c=find('classes',classId);classFilter=classId;
 document.querySelector('h1').textContent=recs.length===1?recs[0].name:'Tableaux · '+(c?.name||'');document.title=document.querySelector('h1').textContent+' · EPS Manager';
 const bar=el('div','',view,'cal-bar');link(bar,'boards','← Tableaux de la '+(c?.name||'classe'),'btn small');
 const others=data.boards.filter(b=>b.classId===classId&&!recs.includes(b));
 if(others.length&&recs.length<4){const f=el('div','',bar,'filters');const s=select(el('label','Ouvrir aussi',f),others.map(b=>[b.id,b.name]),'Choisir un tableau…');s.onchange=()=>{if(s.value)location.hash='#board='+[...recs.map(r=>r.id),s.value].join(',')}}
 const host=el('div','',view,'board-host open-boards'),students=boardStudents(classId);
 for(const rec of recs){
  const group={id:rec.id,name:rec.name,board:parseJSON(rec.board,{}),boardArchives:parseJSON(rec.archives,[])};
  openBoards.push({rec,group});
  const container=el('div','',host);
  renderClassBoard(group,students,classId,container,recs.length>1,
   (name,layout)=>{putBoard(newBoardRecord(classId,name,layout));return true},
   ()=>{const rest=recs.filter(x=>x.id!==rec.id).map(x=>x.id);location.hash=rest.length?'#board='+rest.join(','):'#boards'});
 }
}
// Deux tableaux d'exemple pour la 5e B (appelé par loadSample).
async function sampleBoard(){
 const pupils=pupilsOf('ex-5B'),positions={};
 pupils.forEach((p,i)=>{positions[p.id]={x:12+(i%4)*25,y:8+Math.floor(i/4)*15}});
 await putBoard({...newBoardRecord('ex-5B','Badminton · montée-descente',{background:'badminton',ladderCourts:6,positions,marks:[{id:'n1',type:'note',text:'Penser à faire tourner les arbitres.',x:80,y:90}]}),id:'ex-board1'});
 await putBoard({...newBoardRecord('ex-5B','Échauffement · groupes',{background:'blank',groups:4}),id:'ex-board2'});
}

// ---------- Modules : applications ajoutées dans le dossier modules/ ----------
// Un module est un dossier modules/<nom>/ contenant l'application telle quelle, plus :
//  - eps-module.json : {"name", "entry" (page d'accueil), "adapter" (facultatif), "description"}
//  - un adaptateur (module JavaScript) qui peut exporter :
//      beforeOpen(ctx) : appelé avant l'ouverture, pour recopier les classes dans le module ;
//      collect(ctx)    : renvoie {grades, results, summaries, studentUpdates} (voir importModuleData).
// La liste des dossiers vient de modules/modules.json et des dossiers ajoutés dans Réglages › Paramètres.
// L'application principale ne contient rien de spécifique à un module.
let modules=[],modulesReady=null,openModule=null,moduleTimer=null,moduleFocus=null;
const moduleSync={};
const moduleNameOk=n=>/^[a-z0-9][a-z0-9_-]{0,63}$/i.test(n);
function extraModules(){return (settings().modules||'').split(',').map(s=>s.trim()).filter(moduleNameOk)}
async function discoverModules(){
 let listed=[];
 try{const r=await fetch('modules/modules.json',{cache:'no-cache'});if(r.ok){const j=await r.json();if(Array.isArray(j))listed=j.map(String)}}catch{}
 const names=[...new Set([...listed,...extraModules()])].filter(moduleNameOk),found=[];
 for(const id of names){
  try{const r=await fetch('modules/'+id+'/eps-module.json',{cache:'no-cache'});if(!r.ok)throw Error();const m=await r.json();
   found.push({id,base:'modules/'+id+'/',name:String(m.name||id),description:String(m.description||''),entry:String(m.entry||'index.html'),adapter:m.adapter?String(m.adapter):'',version:String(m.version||''),classChoice:!!m.classChoice,fromSettings:!listed.includes(id)});
  }catch{found.push({id,base:'modules/'+id+'/',name:id,missing:true,fromSettings:!listed.includes(id)})}
 }
 modules=found;return found;
}
function moduleContext(m){
 return {module:{id:m.id,name:m.name},base:new URL(m.base,location.href).href,today:today(),focus:moduleFocus?{...moduleFocus}:null,
  // En direct : inaptitude en cours et statut à l'appel du jour (vide si l'appel n'est pas fait)
  classes:data.classes.map(c=>{const call=data.sessions.filter(x=>x.classId===c.id&&x.date===today()&&active(x)&&isCalled(x)).sort(byDate);const sc=call.find(isNow)||call.at(-1);
   return {id:c.id,name:c.name,students:pupilsOf(c.id).map(p=>({id:p.id,first:p.first,last:p.last,sex:p.sex||'',photo:p.photo||'',inapt:restrictionOf(p.id)?.name||'',attendance:sc?statusIn(sc,p):'',marks:sc?marksIn(sc,p):[]}))}}),
  cycles:data.cycles.filter(c=>c.start&&c.end).map(c=>({id:c.id,classId:c.classId,name:c.name,start:c.start,end:c.end,sessions:cycleSessions(c).map(x=>({id:x.id,date:x.date,time:x.time||''}))})),
  sessions:data.sessions.filter(active).map(s=>({id:s.id,classId:s.classId,date:s.date,time:s.time||'',duration:s.duration||'',title:sessionTitle(s)}))};
}
const adapters={};
async function adapterOf(m){
 if(!m.adapter||m.missing)return null;
 adapters[m.id]??=import(new URL(m.base+m.adapter,location.href).href).catch(()=>null);
 return adapters[m.id];
}
// Format commun renvoyé par collect() (les « key » rendent la synchronisation répétable sans doublons) :
//  grades:     [{key, studentId, name, grade, date}]                 → Évaluations
//  results:    [{key, classId, date, studentId, label, value, unit}] → Résultats de la séance de ce jour
//  summaries:  [{key, classId, date, text}]                          → Résumé dans la séance de ce jour
//  studentUpdates: [{studentId, sex}]                                → complète le sexe s'il manque
async function importModuleData(m,p){
 const pre=m.id+':',rows={grades:[],results:[],students:[],sessions:[]};let skipped=0;
 // Résultats rattachés à la séance de la classe ce jour-là ; sans séance prévue, une séance ponctuelle est créée.
 const sessionFor=(classId,date)=>{
  if(!find('classes',classId)||!/^\d{4}-\d{2}-\d{2}$/.test(date||''))return null;
  const l=data.sessions.filter(s=>s.classId===classId&&s.date===date).sort(byDate);
  let s=l.find(x=>active(x)&&usedModules(x).includes(m.id))||l.find(active)||l[0]||rows.sessions.find(x=>x.classId===classId&&x.date===date);
  if(!s){s={id:pre+classId+':'+date,classId,date,name:m.name,duration:'55'};rows.sessions.push(s)}
  return s};
 for(const g of p?.grades||[]){if(!find('students',g.studentId)||g.grade==null){skipped++;continue}
  rows.grades.push({id:pre+g.key,student:g.studentId,name:String(g.name||m.name),grade:String(g.grade),date:String(g.date||today()),module:m.name})}
 for(const r of p?.results||[]){const s=sessionFor(r.classId,r.date);if(!s||(r.studentId&&!find('students',r.studentId))){skipped++;continue}
  rows.results.push({id:pre+r.key,sessionId:s.id,module:m.name,student:String(r.studentId||''),label:String(r.label||''),value:String(r.value??''),unit:String(r.unit||''),date:String(r.date)})}
 for(const x of p?.summaries||[]){const s=sessionFor(x.classId,x.date);if(!s){skipped++;continue}
  rows.results.push({id:pre+x.key,sessionId:s.id,module:m.name,student:'',label:'Résumé',value:String(x.text||''),unit:'',date:String(x.date)})}
 for(const u of p?.studentUpdates||[]){const st=find('students',u.studentId);if(st&&!st.sex&&['F','G'].includes(u.sex))rows.students.push({...st,sex:u.sex})}
 const changed=Object.fromEntries(Object.entries(rows).map(([k,list])=>[k,list.filter(r=>JSON.stringify(find(k,r.id))!==JSON.stringify(r))]));
 changed.sessions=rows.sessions.filter(r=>!find('sessions',r.id));
 const n=Object.values(changed).reduce((a,l)=>a+l.length,0);
 if(n){await transaction(Object.keys(changed),t=>{for(const [k,list] of Object.entries(changed))list.forEach(r=>t.objectStore(k).put(r))});await load()}
 return {grades:rows.grades.length,results:rows.results.filter(r=>r.student).length,summaries:rows.results.filter(r=>!r.student).length,changed:n,skipped};
}
async function syncModule(m,{quiet=false}={}){
 if(!m.adapter||m.missing)return null;
 const a=await adapterOf(m);
 if(!a)return moduleError(m,'fichier '+m.adapter+' introuvable ou invalide',quiet);
 if(typeof a.collect!=='function')return moduleError(m,'la liaison n’exporte pas collect()',quiet);
 let p;try{p=await a.collect(moduleContext(m))}catch(e){return moduleError(m,'erreur dans collect() : '+String(e?.message||e).slice(0,80),quiet)}
 if(!p||typeof p!=='object'||['grades','results','summaries','studentUpdates'].some(k=>p[k]!=null&&!Array.isArray(p[k])))return moduleError(m,'réponse de collect() au mauvais format',quiet);
 try{
  const r=await importModuleData(m,p);
  moduleSync[m.id]={at:new Date(),...r};errorShown.delete(m.id);
  if(!quiet)notify(m.name+' · '+(r.changed?plural(r.grades,'note')+', '+plural(r.results,'résultat')+', '+plural(r.summaries,'résumé')+' à jour':'rien de nouveau')+'.');
  return r;
 }catch{return moduleError(m,'import impossible',quiet)}
}
async function syncAllModules(){await modulesReady;let changed=0;for(const m of modules){const r=await syncModule(m,{quiet:true});changed+=r?.changed||0}return changed}
function leaveModule(){
 clearInterval(moduleTimer);moduleTimer=null;document.body.classList.remove('module-mode');moduleFocus=null;
 if(openModule){const m=openModule;openModule=null;syncModule(m).then(r=>{if(r?.changed)render()})}
}
async function renderModule(id){
 await modulesReady;
 const m=modules.find(x=>x.id===id);
 if(!m){el('p','Application introuvable. Vérifiez le dossier modules/'+id+'/ et sa déclaration dans la page Applications.',view,'empty');return}
 document.querySelector('h1').textContent=m.name;document.title=m.name+' · EPS Manager';
 if(m.missing){el('p','Le dossier modules/'+m.id+'/ ou son fichier eps-module.json est introuvable.',view,'notice');return}
 document.body.classList.add('module-mode');
 const bar=el('div','',view,'module-bar');
 link(bar,sessionReturn||'apps','← EPS Manager','btn small');
 el('strong',m.name,bar);
 // Module qui travaille classe par classe : choix de la classe (celle de la séance si on vient d'une fiche séance).
 let pick=null;
 if(m.classChoice&&data.classes.length){pick=select(el('label','',bar,'module-class'),data.classes.map(c=>[c.id,c.name]),'Choisir une classe…');pick.setAttribute('aria-label','Classe');pick.value=moduleFocus?.classId||''}
 const status=el('span','Préparation des classes…',bar,'muted');
 const sync=button('Synchroniser',bar,'small primary');
 const frame=el('iframe','',view,'module-frame');frame.title=m.name;frame.setAttribute('allow','camera; microphone; fullscreen; clipboard-write');
 const refresh=()=>{const s=moduleSync[m.id];status.classList.toggle('error',!!s?.error);if(s?.error){status.textContent='Liaison en erreur : '+s.error;return}status.textContent=s?'Synchronisé à '+s.at.toLocaleTimeString('fr',{hour:'2-digit',minute:'2-digit'})+' · '+plural(s.grades,'note')+' · '+plural(s.results,'résultat'):'Les notes et résultats reviennent dans EPS Manager automatiquement.'};
 sync.onclick=async()=>{sync.disabled=true;await syncModule(m);refresh();sync.disabled=false};
 try{const a=await adapterOf(m);if(a?.beforeOpen)await a.beforeOpen(moduleContext(m))}catch{notify('Les classes n’ont pas pu être recopiées dans '+m.name+'.')}
 if(!frame.isConnected)return;
 frame.addEventListener('load',()=>{try{['pointerdown','keydown','touchstart'].forEach(ev=>frame.contentWindow.addEventListener(ev,noteActivity,{capture:true,passive:true}))}catch{}});
 frame.src=m.base+m.entry;openModule=m;refresh();
 if(pick)pick.onchange=async()=>{moduleFocus=pick.value?{classId:pick.value}:null;status.textContent='Préparation de la classe…';
  try{const a=await adapterOf(m);if(a?.beforeOpen)await a.beforeOpen(moduleContext(m))}catch{}
  frame.src=m.base+m.entry+'?t='+Date.now();refresh()};
 // Toutes les 20 s : contexte en direct (inaptitudes, appel du jour) puis reprise des résultats
 moduleTimer=setInterval(async()=>{if(!frame.isConnected)return;try{const a=await adapterOf(m);await a?.refresh?.(moduleContext(m))}catch{}await syncModule(m,{quiet:true});refresh()},20000);
}
let sessionReturn='';
const usedModules=s=>(s?.modules||'').split(',').filter(Boolean);
// Ouvre un module pour une séance : le module est mémorisé sur la séance, qui reçoit ensuite tout ce qu'il renvoie.
async function useModule(s,m){
 const cur=find('sessions',s.id);
 if(cur&&!usedModules(cur).includes(m.id)){await transaction('sessions',t=>t.objectStore('sessions').put({...cur,modules:[...usedModules(cur),m.id].join(',')}));await load()}
 sessionReturn='session='+s.id;moduleFocus={classId:s.classId,sessionId:s.id};
 location.hash='#module='+m.id;
}
// Icône puzzle de la fiche séance : choisir le module à utiliser dans cette séance.
function moduleIcon(parent,s){
 const usable=modules.filter(m=>!m.missing);if(!usable.length||s.cancelled)return;
 const used=usedModules(s).filter(id=>usable.some(m=>m.id===id));
 const b=iconButton('modules',used.length?'Applications utilisées : '+usable.filter(m=>used.includes(m.id)).map(m=>m.name).join(', '):'Utiliser une application',parent,'module-icon'+(used.length?' on':''));
 if(used.length)el('span',used.length,b,'badge');
 b.onclick=()=>{
  const d=sheet('Applications');
  el('p','Tout ce que renvoie l’application est importé dans cette séance.',d,'muted');
  const list=el('div','',d,'module-list');
  for(const m of usable){
   const on=used.includes(m.id),n=data.results.filter(r=>r.sessionId===s.id&&r.module===m.name&&r.student).length;
   const it=button('',list,'module-item'+(on?' on':''));
   icon('modules',el('span','',it,'avatar'));
   const t=el('span','',it,'body');el('span',m.name,t,'title');el('span',on?(n?plural(n,'résultat')+' dans cette séance':'Utilisé dans cette séance'):(m.description||''),t,'meta');
   it.onclick=()=>{d.close();useModule(s,m)};
  }
  d.showModal();
 };
}
// Page « Applications » : toutes les applications associées (dossier modules/), à ouvrir, synchroniser, ajouter ou retirer.
// État du cache hors ligne des applications (liste offline.json, état tenu par le service worker dans « eps-files »).
async function offlineStatus(p){
 p.hidden=true;
 try{
  if(!('caches' in window)||!navigator.serviceWorker?.controller)return;
  const c=await caches.open('eps-files'),base=new URL('./',location.href).href;
  const list=await (await c.match(base+'offline.json'))?.json(),state=await (await c.match(base+'offline-state.json'))?.json()||{};
  if(!list)return;
  const ready=list.files.filter(([f,h])=>state[f]===h).length;
  p.textContent=ready===list.files.length?'✓ Toutes les applications sont disponibles hors connexion sur cet appareil.':'Préparation du hors connexion : '+ready+' / '+list.files.length+' fichiers ('+mb(list.bytes)+' au total). Restez connecté quelques minutes.';
  p.hidden=false;
 }catch{}
}
async function renderApps(){
 await modulesReady;
 el('p','Les applications associées reçoivent vos classes et vos élèves, et renvoient leurs notes, leurs résultats et le résumé de chaque séance. Depuis une séance, l’icône puzzle les ouvre pour cette séance.',view,'muted');
 if(!modules.length)el('p','Aucune application associée.',view,'empty');
 offlineStatus(el('p','',view,'small muted offline-status'));
 const grid=el('div','',view,'list');
 for(const m of modules){
  const card=el('article','',grid,'app-card'+(m.missing?' missing':''));
  const top=el('div','',card,'top');icon('apps',el('span','',top,'avatar'));
  const t=el('div','',top,'body');el('strong',m.name,t);el('span',m.missing?'Dossier modules/'+m.id+'/ introuvable':(m.description||''),t,'muted');
  const sy=moduleSync[m.id];
  const ver=[m.version&&'Version '+m.version,moduleUpdates[m.id]&&'mise à jour (avant : '+moduleUpdates[m.id].from+')'].filter(Boolean).join(' · ');if(ver)el('span',ver,card,'small muted');
  if(sy?.error)el('span','Liaison en erreur : '+sy.error,card,'small error');
  else if(!m.missing&&m.adapter)el('span',sy?'Synchronisée à '+sy.at.toLocaleTimeString('fr',{hour:'2-digit',minute:'2-digit'})+' · '+plural(sy.grades,'note')+' · '+plural(sy.results,'résultat'):'Notes et résultats repris automatiquement',card,'small muted');
  const acts=el('div','',card,'item-actions');
  if(!m.missing){link(acts,'module='+m.id,'Ouvrir','btn primary small');if(m.adapter)button('Synchroniser',acts,'small').onclick=async()=>{await syncModule(m);render()}}
  if(m.fromSettings)iconButton('trash','Retirer de la liste',acts,'danger').onclick=async()=>{await transaction('settings',tx=>tx.objectStore('settings').put({...settings(),modules:extraModules().filter(x=>x!==m.id).join(',')}));await load();modulesReady=discoverModules();await modulesReady;render()};
 }
 const add=panel(view,'Associer une application');
 el('p','Copiez l’application dans un dossier de modules/ (avec son fichier eps-module.json), puis indiquez le nom du dossier.',add,'muted');
 const f=el('form','',add,'filters');
 const inp=el('input','',el('label','Nom du dossier',f));inp.placeholder='ex. demi-fond';inp.required=true;
 el('button','Associer',f,'primary');
 f.onsubmit=async e=>{e.preventDefault();const n=inp.value.trim();if(!moduleNameOk(n))return notify('Nom de dossier invalide (lettres, chiffres, - et _).');
  await transaction('settings',tx=>tx.objectStore('settings').put({...settings(),modules:[...new Set([...extraModules(),n])].join(',')}));await load();modulesReady=discoverModules();await modulesReady;render();
  notify(modules.find(x=>x.id===n)?.missing?'Dossier modules/'+n+'/ introuvable ou sans eps-module.json.':'Application associée.')};
}

// ---------- Import de l'emploi du temps Pronote (iCal) ----------
// Étapes : 1. créer les classes ; 2. charger le calendrier (lien iCal Pronote ou fichier .ics) ;
// 3. associer chaque classe/groupe Pronote à une classe. Chaque cours devient une séance datée (à partir d'aujourd'hui).
let ical={step:1,events:null,source:''};
const icalNorm=v=>String(v??'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/(eme|e|de|nde|ere|er)\b/g,'').replace(/[^a-z0-9]/g,'');
function icalMap(){try{return JSON.parse(settings().icalMap||'{}')||{}}catch{return {}}}
// Lecture d'un fichier iCalendar : lignes repliées, paramètres, dates locales ou UTC, texte échappé.
function parseICS(text){
 const lines=String(text).replace(/\r\n?/g,'\n').replace(/\n[ \t]/g,'').split('\n'),events=[];let ev=null;
 const unesc=v=>v.replace(/\\n/gi,'\n').replace(/\\([,;\\])/g,'$1');
 const when=(v,params)=>{const m=v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?/);if(!m)return null;
  const d=m[7]?new Date(Date.UTC(+m[1],m[2]-1,+m[3],+(m[4]||0),+(m[5]||0))):new Date(+m[1],m[2]-1,+m[3],+(m[4]||0),+(m[5]||0));
  return {date:iso(d),min:m[4]?d.getHours()*60+d.getMinutes():null,allDay:!m[4]||/VALUE=DATE(?!-)/.test(params)}};
 for(const line of lines){
  if(line==='BEGIN:VEVENT'){ev={};continue}
  if(line==='END:VEVENT'){if(ev?.start)events.push(ev);ev=null;continue}
  if(!ev)continue;
  const i=line.indexOf(':');if(i<0)continue;
  const [name,...ps]=line.slice(0,i).split(';'),params=ps.join(';'),val=line.slice(i+1);
  if(name==='DTSTART')ev.start=when(val,params);else if(name==='DTEND')ev.end=when(val,params);
  else if(name==='SUMMARY')ev.summary=unesc(val);else if(name==='DESCRIPTION')ev.description=unesc(val);
  else if(name==='LOCATION')ev.location=unesc(val);else if(name==='UID')ev.uid=val;else if(name==='STATUS')ev.status=val;else if(name==='CATEGORIES')ev.categories=unesc(val);
 }
 // Uniquement les cours (Pronote exporte aussi conseils de classe, jours fériés, vacances).
 const ent=v=>String(v||'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
 return events.filter(e=>!e.start.allDay&&e.start.min!=null&&(!e.categories||/^cours/i.test(e.categories))).map(e=>{
  const desc=ent(e.description),cat=ent(e.categories);
  const field=re=>{const m=desc.match(re);return m?m[1].trim():''};
  // Titre sans préfixe (« Cours annulé : », « Reporté : »…)
  const title=ent(e.summary).replace(/^[^:\-]{3,30}\s:\s+/,'');
  const parts=title.split(/\s+-\s+/).map(x=>x.trim()).filter(Boolean);
  // Classe ou groupe : Groupe Pronote, sinon Classe, sinon les classes des « Parties de classe », sinon le titre
  const groupe=field(/^Groupes?\s*:\s*(.+)$/im),classe=field(/^Classes?\s*:\s*(.+)$/im),partsCl=field(/^Parties? de classe\s*:\s*(.+)$/im);
  // Parties de classe : seulement pour un petit regroupement (l'AS liste les classes de tous ses inscrits)
  const partList=[...new Set([...partsCl.matchAll(/<([^>]+)>/g)].map(m=>m[1]))],fromParts=partList.length&&partList.length<=3?partList.join(' + '):'';
  const rawSubject=field(/^Mati[eè]re\s*:\s*(.+)$/im)||parts[0]||'';
  const subject=/phys.*sport|^e\.?\s?p\.?\s?s\.?$/i.test(rawSubject)?'EPS':/^as\.?\s*sport/i.test(rawSubject)?'AS sport':rawSubject;
  const group=subject==='AS sport'?'AS sport':groupe||classe||fromParts||parts.slice(1).find(x=>/^(?=.*\d)[A-Z0-9]{2,5}$/i.test(x)||/^T[A-Z]$/.test(x))||(subject==='EPS'?'EPS (sans classe)':subject)||'Sans nom';
  const status=/annul/i.test(cat+' '+e.summary)||/CANCELLED/i.test(e.status||'')?'Annulé dans Pronote':/report/i.test(cat)?'Reporté dans Pronote':'';
  const dur=e.end&&e.end.date===e.start.date&&e.end.min!=null?Math.max(5,e.end.min-e.start.min):55;
  return {uid:e.uid||'',date:e.start.date,time:fromMin(e.start.min),duration:String(dur),group,subject,location:ent(e.location)||field(/^Salles?\s*:\s*(.+)$/im),cancelled:status,kind:cat.replace(/^cours\s*-\s*/i,'')};
 });
}
// Lecture du lien iCal : directe si Pronote l'autorise, sinon par le relais api/ical (application publiée sur Vercel).
async function icalFetch(url){
 const u=url.trim().replace(/^webcal:/i,'https:');
 const get=async target=>{const r=await fetch(target,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const t=await r.text();if(!/BEGIN:VCALENDAR/.test(t))throw Error('format');return t};
 try{return await get(u)}catch{return await get('api/ical?url='+encodeURIComponent(u))}
}
function icalSlots(list){
 const days=['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'],seen=new Map();
 for(const e of list){const k=weekdayOf(e.date)+'|'+e.time;seen.set(k,(seen.get(k)||0)+1)}
 return [...seen.entries()].sort().slice(0,4).map(([k])=>{const [d,t]=k.split('|');return days[d]+' '+hh(t)}).join(', ');
}
// Crée, met à jour ou retire les séances Pronote (identifiées par l'UID du cours). Ne touche pas aux séances protégées.
async function icalImport(events,map){
 const t=today(),put=[],ids=new Set(),classes=new Set(Object.values(map).filter(Boolean));
 for(const e of events){
  const classId=map[e.group];if(!classId||!find('classes',classId)||e.date<t)continue;
  const id='pronote:'+(e.uid||e.group)+':'+e.date+':'+e.time;ids.add(id);
  const old=find('sessions',id);
  const row={...old,id,classId,date:e.date,time:e.time,duration:e.duration,name:old?.name||e.subject||'EPS',source:'pronote',...(e.location?{location:e.location}:{})};
  if(e.cancelled&&(!old?.cancelled||/dans Pronote$/.test(old.cancelled)))row.cancelled=e.cancelled;
  if(!e.cancelled&&/dans Pronote$/.test(old?.cancelled||''))delete row.cancelled;
  if(old&&(old.custom||isCalled(old)))continue;
  if(JSON.stringify(old)!==JSON.stringify(row))put.push(row);
 }
 const removed=data.sessions.filter(s=>s.source==='pronote'&&s.date>=t&&!ids.has(s.id)&&!protectedSession(s)&&!hasContent(s)).map(s=>s.id);
 // Les cours saisis à la main pour ces classes sont remplacés par Pronote (évite les doublons).
 const slots=data.timetable.filter(x=>classes.has(x.classId)).map(x=>x.id);
 await transaction(['sessions','timetable'],tx=>{put.forEach(r=>tx.objectStore('sessions').put(r));removed.forEach(id=>tx.objectStore('sessions').delete(id));slots.forEach(id=>tx.objectStore('timetable').delete(id))});
 await load();if(slots.length)await syncSlots();
 return {added:put.filter(r=>!data.sessions.some(s=>s.id===r.id&&s!==r)).length,updated:put.length,removed:removed.length,slots:slots.length,count:ids.size};
}
async function saveIcalSettings(changes){await transaction('settings',t=>t.objectStore('settings').put({...settings(),...changes}));await load()}
async function ensureYear(){
 const t=today();let y=yearOf(t);if(y)return y;
 const d=new Date(),start=d.getMonth()>=7?d.getFullYear():d.getFullYear()-1;
 y={id:crypto.randomUUID(),name:start+'-'+(start+1),start:start+'-09-01',end:(start+1)+'-07-04',firstWeek:'A'};
 await transaction('years',tx=>tx.objectStore('years').put(y));await load();notify('Année scolaire '+y.name+' créée.');return y;
}
function icalPanel(){
 const p=panel(view,'Importer mon emploi du temps Pronote');
 const url=settings().icalUrl||'';
 if((url||settings().icalMap)&&ical.step===1&&!ical.events&&!ical.started){
  const r=el('div','',p,'actions');
  const n=data.sessions.filter(x=>x.source==='pronote'&&x.date>=today()&&active(x)).length;
  el('span',plural(n,'séance Pronote à venir','séances Pronote à venir')+(url?' · lien enregistré':''),r,'muted');
  if(url)button('Mettre à jour depuis Pronote',r,'primary').onclick=async()=>{try{const evs=parseICS(await icalFetch(url));const map=icalMap(),unknown=[...new Set(evs.map(e=>e.group))].filter(g=>!(g in map));
   if(unknown.length){ical={step:3,events:evs,source:'lien'};render();return notify('Nouvelles classes Pronote à associer.')}
   const res=await icalImport(evs,map);render();notify(plural(res.count,'cours importé','cours importés')+' depuis Pronote'+(res.removed?' · '+res.removed+' retiré(s)':'')+'.')}catch{notify('Lien Pronote illisible depuis l’application : importez le fichier .ics (étape 2).');ical.step=2;render()}};
  button('Importer à nouveau',r).onclick=()=>{ical={step:1,events:null,source:'',started:true};render()};
  return;
 }
 const steps=el('ol','',p,'stepper');
 ['Créer les classes','Importer le calendrier','Associer les classes'].forEach((t,i)=>{const li=el('li','',steps,ical.step===i+1?'on':ical.step>i+1?'done':'');el('span',String(i+1),li,'num');el('span',t,li)});
 if(ical.step===1){
  el('p','Créez toutes vos classes (une par ligne). Les élèves pourront être ajoutés plus tard (import du trombinoscope PRONOTE).',p,'muted');
  if(data.classes.length){const c=el('div','',p,'legend');for(const x of data.classes)el('span',x.name+' · '+plural(pupilsOf(x.id).length,'élève'),c)}
  const ta=el('textarea','',el('label','Nouvelles classes',p));ta.rows=4;ta.placeholder='6e A\n5e B\n4e C\n3e D';
  const a=el('div','',p,'actions');
  button('Créer ces classes',a).onclick=async()=>{const y=await ensureYear();const names=ta.value.split(/[\n;,]+/).map(s=>s.trim()).filter(Boolean),known=new Set(data.classes.map(c=>icalNorm(c.name)));
   const rows=names.filter(n=>!known.has(icalNorm(n))).map(n=>({id:crypto.randomUUID(),year:y.id,name:n}));if(!rows.length)return notify('Aucune nouvelle classe.');
   await transaction('classes',tx=>rows.forEach(r=>tx.objectStore('classes').put(r)));await load();render();notify(plural(rows.length,'classe créée','classes créées')+'.')};
  const next=button('Étape suivante →',a,'primary');next.disabled=!data.classes.length;next.onclick=()=>{ical.step=2;render()};
 }
 if(ical.step===2){
  el('p','Dans Pronote : Emploi du temps › icône « Exporter / iCal » › copiez le lien. Collez-le ci-dessous.',p,'muted');
  const f=el('div','',p,'filters');
  const inp=el('input','',el('label','Lien iCal Pronote',f));inp.type='url';inp.placeholder='https://…index-education.net/pronote/ical/…';inp.value=url;
  const load1=button('Charger le lien',f,'primary');
  const alt=el('p','',p,'muted');alt.append('Si le lien ne peut pas être lu (Pronote peut refuser la lecture directe depuis une application), ouvrez-le dans Safari ou Chrome : un fichier .ics se télécharge. Choisissez-le ici :');
  const file=el('input','',el('label','Fichier .ics',p));file.type='file';file.accept='.ics,text/calendar';
  const done=(text,src)=>{const evs=parseICS(text);if(!evs.length)return notify('Aucun cours trouvé dans ce calendrier.');ical={step:3,events:evs,source:src};render()};
  load1.onclick=async()=>{const u=inp.value.trim();if(!u)return notify('Collez le lien iCal de Pronote.');load1.disabled=true;
   try{const t=await icalFetch(u);await saveIcalSettings({icalUrl:u});done(t,'lien')}catch{notify('Lecture du lien impossible depuis l’application. Utilisez le fichier .ics ci-dessous.');await saveIcalSettings({icalUrl:u})}finally{load1.disabled=false}};
  file.onchange=async()=>{try{done(await file.files[0].text(),'fichier')}catch{notify('Fichier illisible.')}};
  button('← Étape précédente',el('div','',p,'actions')).onclick=()=>{ical.step=1;render()};
 }
 if(ical.step===3&&ical.events){
  const t=today(),future=ical.events.filter(e=>e.date>=t),groups=[...new Set(ical.events.map(e=>e.group))].sort((a,b)=>a.localeCompare(b,'fr',{numeric:true}));
  el('p',plural(ical.events.length,'cours trouvé','cours trouvés')+' ('+plural(future.length,'à venir','à venir')+'). Associez chaque classe ou groupe Pronote à une de vos classes ; « Ignorer » pour les cours à ne pas importer.',p,'muted');
  const map={...icalMap()},sels={};
  const box=el('div','',p,'table-box flat');const tb=el('table','',box,'stats');
  const hr=el('tr','',el('thead','',tb));el('th','Dans Pronote',hr);el('th','Cours',hr,'num');el('th','Créneaux',hr);el('th','Classe EPS Manager',hr);
  const body=el('tbody','',tb);
  for(const g of groups){
   const list=ical.events.filter(e=>e.group===g),tr=el('tr','',body);
   const th=el('th','',tr);el('span',g,th);const subj=[...new Set(list.map(e=>e.subject).filter(Boolean))].slice(0,2).join(', ');if(subj)el('small',' · '+subj,th,'muted');
   el('td',list.filter(e=>e.date>=t).length,tr,'num');el('td',icalSlots(list),tr);
   const s=select(el('td','',tr),[['','Ignorer'],...data.classes.map(c=>[c.id,c.name]),['new:'+g,'+ Créer « '+g+' »']]);
   const auto=data.classes.find(c=>icalNorm(c.name)===icalNorm(g));
   s.value=g in map?(map[g]&&find('classes',map[g])?map[g]:''):(auto?auto.id:'');sels[g]=s;
  }
  const manual=data.timetable.length;
  if(manual)el('p','Les cours saisis à la main dans l’emploi du temps pour les classes associées seront remplacés par ceux de Pronote.',p,'notice');
  const a=el('div','',p,'actions');
  button('← Étape précédente',a).onclick=()=>{ical.step=2;render()};
  button('Importer les séances',a,'primary').onclick=async()=>{
   const y=await ensureYear(),create=[];
   for(const g of groups){const v=sels[g].value;if(v.startsWith('new:')){const c={id:crypto.randomUUID(),year:y.id,name:g};create.push(c);map[g]=c.id}else map[g]=v}
   if(create.length){await transaction('classes',tx=>create.forEach(c=>tx.objectStore('classes').put(c)));await load()}
   if(!Object.values(map).some(Boolean))return notify('Associez au moins une classe.');
   const res=await icalImport(ical.events,map);await saveIcalSettings({icalMap:JSON.stringify(map)});
   ical={step:1,events:null,source:''};render();
   notify(plural(res.count,'séance importée','séances importées')+' depuis Pronote'+(res.slots?' · '+plural(res.slots,'cours saisi à la main remplacé','cours saisis à la main remplacés'):'')+'.');
  };
 }
}

// ---------- Code de verrouillage ----------
// Code à 4 chiffres demandé à l'ouverture, après une inactivité réglable et quand on quitte l'application.
// Seule une empreinte (SHA-256 salée) est enregistrée ; une clé de secours, montrée une fois, permet de débloquer.
// C'est un verrou d'interface : les données restent sur l'appareil, non chiffrées.
let locked=false,lastActivity=Date.now(),hiddenAt=0,lockFails=0,lockWaitUntil=0;
const lockOn=()=>!!settings().lockHash;
async function sha(text){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
const randomHex=n=>[...crypto.getRandomValues(new Uint8Array(n))].map(x=>x.toString(16).padStart(2,'0')).join('');
function recoveryKey(){const abc='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',r=crypto.getRandomValues(new Uint8Array(12));return [...r].map(x=>abc[x%abc.length]).join('').replace(/(.{4})(?=.)/g,'$1-')}
async function checkCode(code){const s=settings();return !!s.lockHash&&await sha(s.lockSalt+':'+code)===s.lockHash}
async function saveLock(code,delay){const salt=randomHex(16),key=recoveryKey();
 const hash=await sha(salt+':'+code),rec=await sha(salt+':'+key.replace(/-/g,''));
 await transaction('settings',t=>t.objectStore('settings').put({...settings(),lockSalt:salt,lockHash:hash,lockDelay:delay,recoveryHash:rec}));await load();return key}
async function clearLock(){await transaction('settings',t=>t.objectStore('settings').put({...settings(),lockSalt:'',lockHash:'',recoveryHash:''}));await load()}
function noteActivity(){lastActivity=Date.now()}
['pointerdown','keydown','wheel','touchstart'].forEach(ev=>addEventListener(ev,noteActivity,{capture:true,passive:true}));
setInterval(()=>{const d=settings().lockDelay;if(lockOn()&&!locked&&/^\d+$/.test(d||'')&&Number(d)>0&&Date.now()-lastActivity>Number(d)*60000)lockNow()},15000);
document.addEventListener('visibilitychange',()=>{
 if(!lockOn()||locked)return;const d=settings().lockDelay||'5';
 if(document.hidden){hiddenAt=Date.now();if(d==='0')lockNow()}
 else if(hiddenAt&&d!=='never'&&Date.now()-hiddenAt>Number(d)*60000)lockNow();
});
// Écran de verrouillage : clavier numérique, 4 chiffres, temporisation après 5 erreurs, clé de secours.
function lockNow(){
 if(!lockOn()||locked)return;locked=true;document.body.classList.add('locked');document.activeElement?.blur?.();
 document.querySelectorAll('dialog[open]').forEach(d=>d.close());
 const o=el('div','',document.body,'lock-screen');o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Application verrouillée');
 const box=el('div','',o,'lock-box');
 el('span','E',box,'logo');el('h2','EPS Manager est verrouillé',box);
 const msg=el('p','Saisissez votre code',box,'muted');
 const dots=el('div','',box,'lock-dots');for(let i=0;i<4;i++)el('i','',dots);
 let code='';
 const paint=()=>[...dots.children].forEach((d,i)=>d.classList.toggle('on',i<code.length));
 const tryCode=async()=>{
  if(Date.now()<lockWaitUntil){msg.textContent='Trop d’essais : patientez '+Math.ceil((lockWaitUntil-Date.now())/1000)+' s.';code='';paint();return}
  if(await checkCode(code)){unlock();return}
  lockFails++;code='';paint();dots.classList.remove('shake');void dots.offsetWidth;dots.classList.add('shake');
  if(lockFails>=5){lockWaitUntil=Date.now()+30000;lockFails=0;msg.textContent='Trop d’essais : patientez 30 s.'}else msg.textContent='Code incorrect';
 };
 const press=k=>{if(k==='del'){code=code.slice(0,-1);paint();return}if(code.length<4){code+=k;paint();if(code.length===4)setTimeout(tryCode,120)}};
 const pad=el('div','',box,'lock-pad');
 for(const k of ['1','2','3','4','5','6','7','8','9','?','0','del']){
  const b=button(k==='del'?'⌫':k==='?'?'Code oublié':k,pad,k==='?'?'lock-forgot':'');
  if(k==='del')b.setAttribute('aria-label','Effacer');
  b.onclick=k==='?'?forgot:()=>press(k);
 }
 o.onkeydown=e=>{if(/^\d$/.test(e.key))press(e.key);else if(e.key==='Backspace')press('del')};
 o.tabIndex=-1;setTimeout(()=>o.focus(),50);
 function forgot(){
  box.querySelector('.lock-pad').hidden=true;dots.hidden=true;
  msg.textContent='Saisissez la clé de secours notée à la création du code (ex. ABCD-EFGH-JKLM).';
  const f=el('form','',box,'lock-recover');const inp=el('input','',f);inp.autocomplete='off';inp.placeholder='XXXX-XXXX-XXXX';inp.setAttribute('aria-label','Clé de secours');
  el('button','Débloquer',f,'primary');const back=button('Retour',f);
  back.onclick=()=>{f.remove();box.querySelector('.lock-pad').hidden=false;dots.hidden=false;msg.textContent='Saisissez votre code'};
  f.onsubmit=async e=>{e.preventDefault();const s=settings(),v=inp.value.toUpperCase().replace(/[^A-Z0-9]/g,'');
   if(s.recoveryHash&&await sha(s.lockSalt+':'+v)===s.recoveryHash){await clearLock();unlock();render();notify('Code supprimé grâce à la clé de secours. Définissez un nouveau code dans Paramètres.')}
   else{msg.textContent='Clé de secours incorrecte.';inp.select()}};
  inp.focus();
 }
 function unlock(){locked=false;lockFails=0;lastActivity=Date.now();o.remove();document.body.classList.remove('locked');setTimeout(weeklyBackupPrompt,400)}
}
function lockSettings(){
 const s=settings(),p=panel(view,'Code de verrouillage');
 el('p','Un code à 4 chiffres protège l’accès aux données des élèves (photos, inaptitudes, notes) : il est demandé à l’ouverture, après une période d’inactivité et quand on revient dans l’application.',p,'muted');
 const delays=[['0','Dès que je quitte l’application'],['2','Après 2 min d’inactivité'],['5','Après 5 min d’inactivité'],['10','Après 10 min d’inactivité'],['30','Après 30 min d’inactivité'],['never','Seulement à l’ouverture (et à la demande)']];
 const a=el('div','',p,'actions');
 if(!s.lockHash){button('Définir un code',a,'primary').onclick=()=>codeSheet(false);return}
 const f=el('div','',p,'filters');
 const sel=select(el('label','Verrouillage automatique',f),delays);sel.value=s.lockDelay||'5';
 sel.onchange=async()=>{await transaction('settings',t=>t.objectStore('settings').put({...settings(),lockDelay:sel.value}));await load();notify('Réglage enregistré.')};
 button('Verrouiller maintenant',a,'primary').onclick=lockNow;
 button('Changer le code',a).onclick=()=>codeSheet(true);
 button('Supprimer le code',a,'danger').onclick=()=>{
  const d=sheet('Supprimer le code');const inp=el('input','',el('label','Code actuel',d));inp.type='password';inp.inputMode='numeric';inp.maxLength=4;
  const ok=button('Supprimer',el('div','',d,'actions'),'danger');ok.onclick=async()=>{if(!await checkCode(inp.value))return notify('Code incorrect.');await clearLock();d.close();render();notify('Code supprimé.')};
  d.showModal();inp.focus();
 };
 function codeSheet(change){
  const d=sheet(change?'Changer le code':'Définir un code');
  const field=lbl=>{const i=el('input','',el('label',lbl,d));i.type='password';i.inputMode='numeric';i.maxLength=4;i.pattern='\\d{4}';i.autocomplete='off';return i};
  const cur=change?field('Code actuel'):null,c1=field('Nouveau code (4 chiffres)'),c2=field('Confirmer le code');
  const dl=select(el('label','Verrouillage automatique',d),delays);dl.value=s.lockDelay||'5';
  const ok=button('Enregistrer',el('div','',d,'actions'),'primary');
  ok.onclick=async()=>{
   if(cur&&!await checkCode(cur.value))return notify('Code actuel incorrect.');
   if(!/^\d{4}$/.test(c1.value))return notify('Le code doit comporter 4 chiffres.');
   if(c1.value!==c2.value)return notify('Les deux codes ne correspondent pas.');
   const key=await saveLock(c1.value,dl.value);d.close();
   const k=sheet('Clé de secours');
   el('p','Notez cette clé et gardez-la hors de la tablette. Elle permet de débloquer l’application si vous oubliez le code. Elle ne sera plus affichée.',k);
   el('p',key,k,'recovery-key');
   // Garder la clé hors de la tablette : e-mail (application de messagerie configurée), partage ou copie.
   const subject='EPS Manager · clé de secours',body='Clé de secours d’EPS Manager : '+key+'\n\nElle permet de débloquer l’application si vous oubliez votre code (écran de verrouillage › « Code oublié »).\nGardez ce message à l’abri : toute personne qui a cette clé peut débloquer l’application.\n\nCréée le '+new Date().toLocaleDateString('fr');
   const mail=el('input','',el('label','Votre adresse e-mail (facultatif)',k));mail.type='email';mail.autocomplete='email';mail.value=settings().recoveryEmail||'';mail.placeholder='prenom.nom@exemple.fr';
   const send=el('div','',k,'actions');
   const mailLink=el('a','M’envoyer par e-mail',send,'btn primary');
   const setHref=()=>{mailLink.href='mailto:'+encodeURIComponent(mail.value.trim())+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)};
   setHref();mail.oninput=setHref;
   mailLink.onclick=async()=>{const to=mail.value.trim();notify('Votre messagerie s’ouvre avec la clé : envoyez le message.');
    if(to&&to!==settings().recoveryEmail){await transaction('settings',t=>t.objectStore('settings').put({...settings(),recoveryEmail:to}));await load()}};
   if(navigator.share)button('Partager…',send).onclick=()=>navigator.share({title:subject,text:body}).catch(()=>{});
   button('Copier',send).onclick=()=>navigator.clipboard?.writeText(key).then(()=>notify('Clé copiée.'),()=>notify('Copie impossible : notez la clé.'));
   const cb=el('label','',k,'check');const c=el('input','',cb);c.type='checkbox';cb.append(' J’ai noté la clé de secours');
   const done=button('Terminer',el('div','',k,'actions'),'primary');done.disabled=true;c.onchange=()=>{done.disabled=!c.checked};
   done.onclick=()=>{k.close();render();notify('Code de verrouillage activé.')};
   k.oncancel=e=>e.preventDefault();k.showModal();
  };
  d.showModal();(cur||c1).focus();
 }
}

// ---------- Sauvegarde complète : EPS Manager + données des applications ----------
// Les applications associées sont servies depuis la même adresse : leurs données (localStorage, bases IndexedDB)
// sont dans le même espace que celles d'EPS Manager. La sauvegarde les reprend toutes, sans réglage par application.
// Bases des applications, pour les navigateurs qui ne savent pas lister leurs bases (indexedDB.databases()).
const KNOWN_DBS=['mon-tableau-blanc-documents','scan-document-eps-v1','eps-hub-photos','chrono-eps','df-scan-ccf-backups','eps-hub-pf'];
async function blobsOut(v){
 if(v instanceof Blob)return {__epsBlob:await new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=()=>no(r.error);r.readAsDataURL(v)}),type:v.type,name:v.name||''};
 if(Array.isArray(v))return Promise.all(v.map(blobsOut));
 if(v&&typeof v==='object'&&v.constructor===Object){const o={};for(const [k,x] of Object.entries(v))o[k]=await blobsOut(x);return o}
 return v;
}
async function blobsIn(v){
 if(v&&typeof v==='object'&&typeof v.__epsBlob==='string'){const b=await (await fetch(v.__epsBlob)).blob();return v.name?new File([b],v.name,{type:v.type||b.type}):b}
 if(Array.isArray(v))return Promise.all(v.map(blobsIn));
 if(v&&typeof v==='object'&&v.constructor===Object){const o={};for(const [k,x] of Object.entries(v))o[k]=await blobsIn(x);return o}
 return v;
}
const reqP=r=>new Promise((ok,no)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
async function dumpDB(name){
 const db=await new Promise((ok,no)=>{const r=indexedDB.open(name);r.onupgradeneeded=()=>{r.transaction.abort()};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}).catch(()=>null);
 if(!db)return null;
 try{
  const out={name,version:db.version,stores:[]};
  for(const s of db.objectStoreNames){
   const st=db.transaction(s).objectStore(s);
   const meta={name:s,keyPath:st.keyPath,autoIncrement:st.autoIncrement,indexes:[...st.indexNames].map(n=>{const i=st.index(n);return {name:n,keyPath:i.keyPath,unique:i.unique,multiEntry:i.multiEntry}}),records:[]};
   const [keys,vals]=await Promise.all([reqP(st.getAllKeys()),reqP(st.getAll())]);
   for(let i=0;i<keys.length;i++)meta.records.push([keys[i],await blobsOut(vals[i])]);
   out.stores.push(meta);
  }
  return out;
 }finally{db.close()}
}
async function restoreDB(dump){
 await new Promise(ok=>{const r=indexedDB.deleteDatabase(dump.name);r.onsuccess=r.onerror=r.onblocked=()=>ok()});
 const db=await new Promise((ok,no)=>{const r=indexedDB.open(dump.name,dump.version||1);
  r.onupgradeneeded=()=>{try{for(const s of dump.stores){const st=r.result.createObjectStore(s.name,{keyPath:s.keyPath??undefined,autoIncrement:!!s.autoIncrement});for(const i of s.indexes||[])st.createIndex(i.name,i.keyPath,{unique:!!i.unique,multiEntry:!!i.multiEntry})}}catch(e){r.transaction.abort()}};
  r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
 try{
  for(const s of dump.stores){
   const recs=await Promise.all(s.records.map(async([k,v])=>[k,await blobsIn(v)]));
   await new Promise((ok,no)=>{const t=db.transaction(s.name,'readwrite'),st=t.objectStore(s.name);for(const [k,v] of recs){if(s.keyPath==null)st.put(v,k);else st.put(v)}t.oncomplete=ok;t.onerror=t.onabort=()=>no(t.error)});
  }
 }finally{db.close()}
}
async function collectExtra(){
 const ls={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k!=null&&k!==JOURNAL)ls[k]=localStorage.getItem(k)}
 let names=KNOWN_DBS;
 try{if(indexedDB.databases)names=[...new Set([...(await indexedDB.databases()).map(d=>d.name).filter(Boolean),...KNOWN_DBS])]}catch{}
 const dbs=[];for(const n of names.filter(n=>n!=='eps-manager'&&n!==RP_DB)){try{const d=await dumpDB(n);if(d&&d.stores.length)dbs.push(d)}catch{}}
 return {localStorage:ls,indexedDB:dbs};
}
async function restoreExtra(x){
 for(const [k,v] of Object.entries(x?.localStorage||{}))if(typeof v==='string'&&k!==JOURNAL)try{localStorage.setItem(k,v)}catch{}
 for(const d of x?.indexedDB||[])if(d&&typeof d.name==='string'&&d.name!=='eps-manager'&&d.name!==RP_DB&&Array.isArray(d.stores))await restoreDB(d);
}
// ---------- Restauration sûre : vérification, copie préalable, retour arrière, reprise ----------
// Le point de restauration est une copie LOCALE (même appareil) : ce n'est pas une sauvegarde externe.
const RP_DB='eps-manager-restore-point',JOURNAL='eps-restore-journal';
async function sha256(text){if(!crypto?.subtle)return '';const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(h)].map(b=>b.toString(16).padStart(2,'0')).join('')}
// Inventaire ajouté au fichier (champ additionnel : les anciennes versions l'ignorent).
async function manifestOf(d,extra){return {counts:Object.fromEntries(stores.map(k=>[k,(d[k]||[]).length])),localStorage:Object.keys(extra?.localStorage||{}).length,indexedDB:(extra?.indexedDB||[]).map(x=>({name:x.name,stores:Object.fromEntries(x.stores.map(s=>[s.name,s.records.length]))})),sha256:await sha256(JSON.stringify({data:d,extra}))}}
async function backupObject(){const extra=await collectExtra();return {version:3,createdAt:new Date().toISOString(),appVersion:APP_VERSION,data,extra,manifest:await manifestOf(data,extra)}}
// Vérifie tout le fichier AVANT de toucher aux données ; lève une erreur au message lisible.
async function checkBackup(b){
 if(!b||typeof b!=='object'||!b.data||typeof b.data!=='object')throw Error('ce n’est pas une sauvegarde EPS Manager');
 if(typeof b.version==='number'&&b.version>3)throw Error('sauvegarde faite par une version plus récente d’EPS Manager : mettez l’application à jour');
 if(![1,2,3].includes(b.version))throw Error('format de sauvegarde inconnu');
 if(b.manifest){
  const h=await sha256(JSON.stringify({data:b.data,extra:b.extra}));
  if(h&&b.manifest.sha256&&h!==b.manifest.sha256)throw Error('le fichier a été modifié ou abîmé (somme de contrôle différente)');
  for(const [k,n] of Object.entries(b.manifest.counts||{}))if((b.data[k]||[]).length!==n)throw Error('nombre d’enregistrements incohérent ('+k+')');
 }
 for(const key of ['holidays','timetable','settings','results','boards'])b.data[key]??=[];
 for(const key of stores){if(!Array.isArray(b.data[key])||!b.data[key].every(r=>r&&typeof r.id==='string'&&Object.values(r).every(v=>typeof v==='string')))throw Error('enregistrement invalide ('+key+')');if(new Set(b.data[key].map(r=>r.id)).size!==b.data[key].length)throw Error('identifiants en double ('+key+')')}
 const x=b.extra;
 if(x!=null&&(typeof x!=='object'||(x.localStorage!=null&&typeof x.localStorage!=='object')||(x.indexedDB!=null&&!Array.isArray(x.indexedDB))||(x.indexedDB||[]).some(d=>!d||typeof d.name!=='string'||!Array.isArray(d.stores)||d.stores.some(s=>!s||typeof s.name!=='string'||!Array.isArray(s.records)))))throw Error('données des applications illisibles');
}
const rpDB=()=>new Promise((ok,no)=>{const r=indexedDB.open(RP_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('points',{keyPath:'id'});r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
async function restorePoint(){const db=await rpDB();try{return await reqP(db.transaction('points').objectStore('points').get('last'))}finally{db.close()}}
// Copie l'état actuel complet (EPS Manager + applications) et renvoie cette copie, indépendante des données vivantes.
async function saveRestorePoint(label){
 const json=JSON.stringify(await backupObject()),db=await rpDB();
 try{await new Promise((ok,no)=>{const t=db.transaction('points','readwrite');t.objectStore('points').put({id:'last',label,createdAt:new Date().toISOString(),json});t.oncomplete=ok;t.onerror=t.onabort=()=>no(t.error)})}finally{db.close()}
 return JSON.parse(json);
}
// Écrit une sauvegarde vérifiée. `exact` : retour à un état antérieur (retire aussi ce qui n'existait pas dans la copie).
async function applyBackup(b,exact=false,also=[]){
 await transaction(stores,t=>{for(const key of stores){const st=t.objectStore(key);st.clear();(b.data[key]||[]).forEach(r=>st.add(r))}});
 if(exact){
  const keep=b.extra?.localStorage||{};for(const k of Object.keys(localStorage))if(!(k in keep)&&k!==JOURNAL)localStorage.removeItem(k);
  let names=[...also];try{if(indexedDB.databases)names.push(...(await indexedDB.databases()).map(d=>d.name).filter(Boolean))}catch{}
  const kept=new Set((b.extra?.indexedDB||[]).map(d=>d.name));
  for(const n of new Set(names))if(n!=='eps-manager'&&n!==RP_DB&&!kept.has(n))await new Promise(ok=>{const r=indexedDB.deleteDatabase(n);r.onsuccess=r.onerror=r.onblocked=()=>ok()});
 }
 if(b.extra)await restoreExtra(b.extra);
}
const setJournal=v=>{try{v?localStorage.setItem(JOURNAL,JSON.stringify(v)):localStorage.removeItem(JOURNAL)}catch{}};
async function afterRestore(){await load();await migrateAttendance();modulesReady=discoverModules();render()}
// Restauration en trois temps : copie de l'état actuel, écriture, et en cas d'échec retour automatique à la copie.
async function safeRestore(b,label){
 let snap=null;
 try{snap=await saveRestorePoint(label)}catch{if(!confirm('Impossible de garder une copie des données actuelles (stockage plein ?).\n\nRestaurer quand même, sans possibilité d’annuler ?'))return false}
 setJournal({startedAt:new Date().toISOString(),label});
 try{await applyBackup(b)}catch{
  if(snap)try{await applyBackup(snap,true,(b.extra?.indexedDB||[]).map(d=>d.name));setJournal(null);await afterRestore();notify('Restauration impossible : vos données d’avant ont été remises.');return false}catch{}
  await afterRestore();notify('Restauration interrompue. Rechargez l’application pour revenir aux données d’avant.');return false;
 }
 setJournal(null);await afterRestore();return true;
}
// Au démarrage : une restauration a été coupée (fermeture, panne de batterie…) → proposer de revenir à la copie.
async function interruptedRestore(){
 let j=null;try{j=JSON.parse(localStorage.getItem(JOURNAL)||'null')}catch{}
 if(!j)return false;
 const rp=await restorePoint().catch(()=>null);
 const d=sheet('Restauration interrompue');
 el('p','Une restauration commencée le '+new Date(j.startedAt).toLocaleString('fr')+' ne s’est pas terminée : les données peuvent être incomplètes.',d);
 if(rp)el('p','Une copie des données d’avant a été gardée sur l’appareil ('+rp.label+').',d,'muted');
 const a=el('div','',d,'actions');
 if(rp)button('Revenir aux données d’avant',a,'primary').onclick=async e=>{e.currentTarget.disabled=true;try{await applyBackup(JSON.parse(rp.json),true);setJournal(null);d.close();await afterRestore();notify('Les données d’avant la restauration ont été remises.')}catch{notify('Retour impossible. Restaurez votre dernière sauvegarde.')}};
 button('Garder les données actuelles',a).onclick=()=>{setJournal(null);d.close()};
 d.showModal();return true;
}
function restorePointPanel(){
 const p=panel(view,'Annuler la dernière restauration');p.hidden=true;
 restorePoint().then(rp=>{if(!rp)return;p.hidden=false;
  el('p','Copie faite automatiquement '+rp.label+', le '+new Date(rp.createdAt).toLocaleString('fr',{dateStyle:'long',timeStyle:'short'})+'.',p);
  el('p','Cette copie reste sur cet appareil : ce n’est pas une sauvegarde externe. Elle disparaît si les données du navigateur sont effacées.',p,'muted');
  button('Revenir à cet état',p).onclick=async()=>{if(!confirm('Remplacer les données actuelles par la copie faite '+rp.label+' ?\n\nLes données actuelles seront gardées à leur tour pour pouvoir annuler.'))return;
   let b;try{b=JSON.parse(rp.json);await checkBackup(b)}catch{return notify('Copie illisible.')}
   if(await safeRestore(b,'avant l’annulation de la restauration'))notify('Données remises dans l’état d’avant.')};
 }).catch(()=>{});
}
const appsInBackup=x=>{const l=Object.keys(x?.localStorage||{}),names=[];
 if(l.some(k=>/^(eps-hub|df-scan|cc_|chronoCarnet)/.test(k)))names.push('Demi-fond');if(l.includes('df-coeval-v1'))names.push('Co-évaluation Bac');
 if(l.includes('eps-evaluations-v1'))names.push('Évaluations');if(l.some(k=>k.startsWith('lrc-')))names.push('Conquête');if(l.some(k=>['tournamentData_v7','teacherPoolsData_v1','appRole_v1'].includes(k)))names.push('Poules tournantes');if(l.some(k=>k.startsWith('eps-manager:')))names.push('applications du kit');
 if((x?.indexedDB||[]).some(d=>d.name==='mon-tableau-blanc-documents'))names.push('documents des tableaux');return names};
const mb=n=>(n/1048576).toFixed(n<1048576?2:1).replace('.',',')+' Mo';

// ---------- Périodes, coefficients et moyennes ----------
// Périodes de notation par année (trimestres ou semestres, dates modifiables) ; coefficient par évaluation
// (par intitulé, 0 = non comptée) ; moyennes pondérées par période, par élève et par classe.
const parseSetting=(k,d)=>{try{return JSON.parse(settings()[k]||'')??d}catch{return d}};
function presetPeriods(y,kind){
 const y1=y.start.slice(0,4),y2=y.end.slice(0,4);
 return kind==='sem'?[{name:'Semestre 1',start:y.start,end:y2+'-01-31'},{name:'Semestre 2',start:y2+'-02-01',end:y.end}]
  :[{name:'Trimestre 1',start:y.start,end:y1+'-11-30'},{name:'Trimestre 2',start:y1+'-12-01',end:y2+'-03-15'},{name:'Trimestre 3',start:y2+'-03-16',end:y.end}];
}
function periodsOf(y){if(!y)return [];const all=parseSetting('periods',{});return Array.isArray(all[y.id])&&all[y.id].length?all[y.id]:presetPeriods(y,'tri')}
const coefOf=name=>{const c=parseSetting('coefs',{})[name];return c==null||!isFinite(Number(c))?1:Number(c)};
const avgFmt=v=>v==null?'—':(Math.round(v*100)/100).toFixed(2).replace(/\.?0+$/,'').replace('.',',');
const inPeriod=(g,p)=>!p||(g.date&&g.date>=p.start&&g.date<=p.end);
// Moyenne pondérée d'un élève sur une période (une évaluation notée plusieurs fois compte pour sa moyenne).
function studentAverage(studentId,period){
 const by={};for(const g of data.grades)if(g.student===studentId&&inPeriod(g,period)&&isFinite(Number(g.grade)))(by[g.name]??=[]).push(Number(g.grade));
 let s=0,w=0;for(const [name,list] of Object.entries(by)){const c=coefOf(name);if(c>0){s+=list.reduce((a,b)=>a+b,0)/list.length*c;w+=c}}
 return w?s/w:null;
}
function periodsSettings(){
 const y=yearOf(today())||data.years[0];if(!y)return;
 const list=periodsOf(y).map(p=>({...p}));
 const p=panel(view,'Périodes de notation · '+y.name);
 el('p','Les moyennes sont calculées par période d’après la date de chaque note.',p,'muted');
 const a=el('div','',p,'actions');
 const save=async rows=>{const all=parseSetting('periods',{});all[y.id]=rows;await transaction('settings',t=>t.objectStore('settings').put({...settings(),periods:JSON.stringify(all)}));await load();render();notify('Périodes enregistrées.')};
 button('Trimestres',a).onclick=()=>save(presetPeriods(y,'tri'));
 button('Semestres',a).onclick=()=>save(presetPeriods(y,'sem'));
 const grid=el('div','',p,'period-grid');
 list.forEach((r,i)=>{
  const row=el('div','',grid,'period-row');
  const n=el('input','',el('label','Nom',row));n.value=r.name;n.oninput=()=>{r.name=n.value};
  const s=el('input','',el('label','Début',row));s.type='date';s.value=r.start;s.onchange=()=>{r.start=s.value};
  const e=el('input','',el('label','Fin',row));e.type='date';e.value=r.end;e.onchange=()=>{r.end=e.value};
 });
 const b=el('div','',p,'actions');
 button('Enregistrer les dates',b,'primary').onclick=()=>{if(list.some(r=>!r.name.trim()||!r.start||!r.end||r.end<r.start))return notify('Vérifiez les noms et les dates.');save(list)};
}
let avgPeriod='';
function renderAverages(){
 if(!data.classes.length){el('p','Aucune classe pour le moment.',view,'empty');return}
 if(!find('classes',classFilter))classFilter=data.classes[0].id;
 const y=yearOf(today())||data.years[0],periods=periodsOf(y),t=today();
 if(!avgPeriod||(avgPeriod!=='year'&&!periods.some(p=>p.name===avgPeriod)))avgPeriod=(periods.find(p=>p.start<=t&&p.end>=t)||periods[0])?.name||'year';
 const period=periods.find(p=>p.name===avgPeriod)||null;
 const f=el('div','',view,'filters panel');
 const cs=select(el('label','Classe',f),data.classes.map(c=>[c.id,c.name]));cs.value=classFilter;cs.onchange=()=>{classFilter=cs.value;render()};
 const ps=select(el('label','Période',f),[...periods.map(p=>[p.name,p.name+' ('+fmtDate(p.start,{day:'numeric',month:'short'})+' → '+fmtDate(p.end,{day:'numeric',month:'short'})+')']),['year','Année entière']]);ps.value=avgPeriod;ps.onchange=()=>{avgPeriod=ps.value;render()};
 const pupils=pupilsOf(classFilter),ids=new Set(pupils.map(p=>p.id));
 const grades=data.grades.filter(g=>ids.has(g.student)&&inPeriod(g,period)&&isFinite(Number(g.grade)));
 const names=[...new Set(grades.slice().sort(byDate).map(g=>g.name))];
 if(!names.length){el('p','Aucune note pour cette classe sur cette période.',view,'empty');return}
 const cell=(sid,n)=>{const l=grades.filter(g=>g.student===sid&&g.name===n).map(g=>Number(g.grade));return l.length?l.reduce((a,b)=>a+b,0)/l.length:null};
 const rows=pupils.map(p=>({p,avg:studentAverage(p.id,period)}));
 const avgs=rows.map(r=>r.avg).filter(v=>v!=null),classAvg=avgs.length?avgs.reduce((a,b)=>a+b,0)/avgs.length:null;
 const kp=el('div','',view,'kpis');
 const kpi=(ti,v,sub)=>{const a=el('div','',kp,'kpi');el('span',ti,a);el('b',v,a);el('small',sub,a)};
 kpi('Moyenne de la classe',avgFmt(classAvg),avgPeriod==='year'?'Année entière':avgPeriod);
 kpi('Évaluations',names.length,names.filter(n=>coefOf(n)>0).length+' comptées');
 kpi('Moyenne la plus basse',avgs.length?avgFmt(Math.min(...avgs)):'—','');
 kpi('Moyenne la plus haute',avgs.length?avgFmt(Math.max(...avgs)):'—','');
 el('p','Coefficients : modifiez-les dans l’en-tête (0 = évaluation non comptée). Ils s’appliquent à l’évaluation dans toutes les classes.',view,'muted');
 const box=el('div','',view,'table-box');const tb=el('table','',box,'stats averages');
 const hr=el('tr','',el('thead','',tb));el('th','Élève',hr,'sticky');
 for(const n of names){
  const th=el('th','',hr,'num');el('span',n,th,'ev-name');
  const d=grades.find(g=>g.name===n)?.date;if(d)el('small',fmtDate(d,{day:'numeric',month:'short'}),th);
  const ci=el('input','',el('label','coef.',th,'coef'));ci.type='number';ci.min=0;ci.step=0.5;ci.inputMode='decimal';ci.value=coefOf(n);ci.setAttribute('aria-label','Coefficient de '+n);
  ci.onchange=async()=>{const all=parseSetting('coefs',{});all[n]=Math.max(0,Number(ci.value)||0);await transaction('settings',tx=>tx.objectStore('settings').put({...settings(),coefs:JSON.stringify(all)}));await load();render()};
 }
 el('th','Moyenne',hr,'num');
 const body=el('tbody','',tb);
 for(const {p,avg} of rows){
  const tr=el('tr','',body);const th=el('th','',tr,'sticky');link(th,'student='+p.id,label(p));
  for(const n of names){const v=cell(p.id,n);el('td',v==null?'':avgFmt(v),tr,'num'+(coefOf(n)>0?'':' off'))}
  el('td',avgFmt(avg),tr,'num strong'+(avg!=null&&avg<10?' low':''));
 }
 const ft=el('tr','',body,'total');el('th','Moyenne de la classe',ft,'sticky');
 for(const n of names){const v=pupils.map(p=>cell(p.id,n)).filter(x=>x!=null);el('td',v.length?avgFmt(v.reduce((a,b)=>a+b,0)/v.length):'',ft,'num')}
 el('td',avgFmt(classAvg),ft,'num strong');
 const tools=el('div','',view,'actions');
 button('Exporter en CSV',tools,'small').onclick=()=>{
  const head=['Nom','Prénom',...names.map(n=>n+' (coef. '+coefOf(n)+')'),'Moyenne'];
  const lines=rows.map(({p,avg})=>[p.last,p.first,...names.map(n=>{const v=cell(p.id,n);return v==null?'':avgFmt(v)}),avgFmt(avg)]);
  const csv=[head,...lines].map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv'}));a.download='moyennes-'+(find('classes',classFilter)?.name||'')+'-'+(avgPeriod==='year'?'annee':avgPeriod)+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
 };
}

// ---------- Appréciations du bulletin : brouillons à relire ----------
// Pour chaque élève d'une classe et d'une période : moyenne (et évolution), assiduité, oublis, retards,
// inaptitude et observations → un brouillon de phrase, que le professeur relit, corrige et enregistre.
let draftState=null;
function periodFacts(st,period,periods){
 const prev=period?periods[periods.findIndex(p=>p.name===period.name)-1]:null;
 const avg=studentAverage(st.id,period),prevAvg=prev?studentAverage(st.id,prev):null;
 const calls=calledSessions(st.classId).filter(s=>!period||(s.date>=period.start&&s.date<=period.end));
 const count=list=>calls.filter(s=>marksIn(s,st).some(m=>list.includes(m))).length;
 const grades=data.grades.filter(g=>g.student===st.id&&inPeriod(g,period)&&isFinite(Number(g.grade)));
 const byAct={};for(const g of grades)(byAct[g.name]??=[]).push(Number(g.grade));
 const acts=Object.entries(byAct).map(([n,l])=>({n,v:l.reduce((a,b)=>a+b,0)/l.length})).sort((a,b)=>b.v-a.v);
 // Activités pratiquées : cycles de la classe sur la période et activités notées
 const cyc=data.cycles.filter(c=>c.classId===st.classId&&c.start&&(!period||(c.start<=period.end&&c.end>=period.start))).map(c=>c.name);
 const practiced=[...new Set([...cyc,...acts.map(x=>x.n.split(' · ')[0])])];
 const inapt=data.restrictions.filter(r=>r.student===st.id&&(!period||(r.start<=period.end&&r.end>=period.start)));
 const obs=data.observations.filter(o=>o.student===st.id&&(!period||!o.date||(o.date>=period.start&&o.date<=period.end)));
 return {avg,prevAvg,abs:count(['Absent']),late:count(['Retard']),kit:count(['Oubli de tenue','Oubli de chaussures']),med:count(['Inaptitude']),sessions:calls.length,acts,practiced,inapt,obs};
}
// Adjectifs à cocher pour orienter l'appréciation : [identifiant, masculin, féminin, phrase (masc), phrase (fém)]
const DEFAULT_TRAITS={
 pos:[['investi','investi','investie'],['serieux','sérieux','sérieuse'],['motive','motivé','motivée'],['autonome','autonome','autonome'],['perseverant','persévérant','persévérante'],['respectueux','respectueux','respectueuse'],['moteur','moteur','motrice'],['ecoute','à l’écoute','à l’écoute'],['camarade','bon camarade','bonne camarade'],['dynamique','dynamique','dynamique'],['progres','en progrès','en progrès'],['arbitre','bon arbitre','bonne arbitre']],
 neg:[['bavard','bavard','bavarde','doit être moins bavard','doit être moins bavarde'],['disperse','dispersé','dispersée','doit rester plus concentré','doit rester plus concentrée'],['passif','passif','passive','doit s’engager davantage','doit s’engager davantage'],['retrait','en retrait','en retrait','doit oser davantage','doit oser davantage'],['irregulier','irrégulier','irrégulière','doit être plus régulier','doit être plus régulière'],['efforts','manque d’efforts','manque d’efforts','doit fournir plus d’efforts','doit fournir plus d’efforts'],['agite','agité','agitée','doit canaliser son énergie','doit canaliser son énergie'],['decourage','se décourage','se décourage','ne doit pas se décourager','ne doit pas se décourager'],['comportement','comportement à revoir','comportement à revoir','doit améliorer son comportement','doit améliorer son comportement'],['tenue','oublis de tenue','oublis de tenue','doit penser à sa tenue','doit penser à sa tenue']]
};
// Liste personnalisable (Paramètres ou bouton « Gérer les adjectifs ») : enregistrée en JSON dans settings.traits
function traits(){const t=parseSetting('traits',null);return t&&Array.isArray(t.pos)&&Array.isArray(t.neg)?t:DEFAULT_TRAITS}
const traitWord=(t,fem)=>fem?(t[2]||t[1]):t[1];
async function saveTraits(t){await transaction('settings',x=>x.objectStore('settings').put({...settings(),traits:t?JSON.stringify(t):''}));await load()}
function traitsEditor(box,onChange=()=>{}){
 box.replaceChildren();
 const t=structuredClone(traits());
 const commit=async()=>{await saveTraits(t);onChange();traitsEditor(box,onChange)};
 for(const [kind,title] of [['pos','Qualités (+)'],['neg','Points à améliorer (−)']]){
  el('h3',title,box);
  const g=el('div','',box,'trait-group '+kind);
  if(!t[kind].length)el('span','Aucun adjectif.',g,'small muted');
  for(const tr of t[kind]){const c=el('span','',g,'trait-edit');el('span',tr[1]+(tr[2]&&tr[2]!==tr[1]?' / '+tr[2]:''),c);
   const x=button('×',c,'small');x.title='Supprimer « '+tr[1]+' »';x.setAttribute('aria-label',x.title);
   x.onclick=()=>{t[kind]=t[kind].filter(o=>o[0]!==tr[0]);commit()}}
  const f=el('form','',box,'filters trait-add');
  const m=el('input','',el('label','Au masculin',f));m.required=true;m.placeholder=kind==='pos'?'ex. créatif':'ex. impulsif';
  const w=el('input','',el('label','Au féminin',f));w.placeholder=kind==='pos'?'ex. créative':'ex. impulsive';
  let pm,pf;if(kind==='neg'){pm=el('input','',el('label','Conseil (il)',f));pm.placeholder='ex. doit se maîtriser';pf=el('input','',el('label','Conseil (elle)',f));pf.placeholder='identique si vide'}
  button('Ajouter',f,'primary').type='submit';
  f.onsubmit=e=>{e.preventDefault();const mv=m.value.trim();if(!mv)return;const fv=w.value.trim()||mv;
   if(t.pos.concat(t.neg).some(o=>o[1].toLowerCase()===mv.toLowerCase()))return notify('« '+mv+' » existe déjà.');
   const row=[kind+'-'+Date.now().toString(36),mv,fv];if(kind==='neg'&&pm.value.trim())row.push(pm.value.trim(),pf.value.trim()||pm.value.trim());
   t[kind].push(row);commit()};
 }
 const a=el('div','',box,'actions');
 button('Rétablir la liste par défaut',a).onclick=async()=>{if(confirm('Remplacer votre liste par les adjectifs proposés par défaut ?')){await saveTraits(null);onChange();traitsEditor(box,onChange)}};
}
function traitsSettings(){const p=panel(view,'Appréciations : adjectifs à cocher');el('p','Ajoutez vos propres adjectifs ou supprimez ceux dont vous ne vous servez pas. Le féminin sert à accorder selon le sexe de l’élève ; le conseil (facultatif) est utilisé dans le brouillon sans IA.',p,'muted');traitsEditor(el('div','',p,'traits-editor'))}
const joinFr=l=>l.length<2?(l[0]||''):l.slice(0,-1).join(', ')+' et '+l.at(-1);
function draftAppreciation(st,f,periodName,variant=0,tags=[]){
 const fem=st.sex==='F',e=fem?'e':'',P=st.first,word=/semestre/i.test(periodName)?'semestre':/trimestre/i.test(periodName)?'trimestre':'année',W=word==='année'?'Année':word.charAt(0).toUpperCase()+word.slice(1);
 const pick=list=>list[([...st.id].reduce((a,c)=>a+c.charCodeAt(0),0)+variant)%list.length];
 const pos=traits().pos.filter(t=>tags.includes(t[0])),neg=traits().neg.filter(t=>tags.includes(t[0]));
 const a=f.avg,out=[];
 if(a==null)out.push(`Pas assez d’évaluations ce ${word} pour apprécier le travail de ${P}.`);
 else if(a>=16)out.push(pick([`Excellent${word==='année'?'e':''} ${word} : ${P} montre un très bon niveau et un réel investissement.`,`${W} excellent${word==='année'?'e':''}. ${P} s’engage pleinement et réussit très bien.`]));
 else if(a>=14)out.push(pick([`Très bon${word==='année'?'ne':''} ${word}. ${P} travaille avec sérieux et obtient de très bons résultats.`,`${P} réalise un${word==='année'?'e':''} très bon${word==='année'?'ne':''} ${word}, avec un engagement régulier.`]));
 else if(a>=12)out.push(pick([`Bon${word==='année'?'ne':''} ${word}. ${P} participe avec régularité et progresse.`,`${W} satisfaisant${word==='année'?'e':''} : ${P} s’investit et obtient de bons résultats.`]));
 else if(a>=10)out.push(pick([`${W} correct${word==='année'?'e':''} dans l’ensemble ; ${P} peut encore gagner en engagement.`,`Résultats moyens ce ${word} : ${P} doit s’impliquer davantage pour progresser.`]));
 else if(a>=8)out.push(`${W} fragile : les résultats de ${P} restent irréguliers.`);
 else out.push(`${W} difficile : ${P} doit s’investir beaucoup plus pour progresser.`);
 if(f.practiced.length){const best=a!=null&&f.acts.length>=2&&f.acts[0].v>=a+2?f.acts[0].n.split(' · ')[0]:'';
  out.push(best?`En ${f.practiced.map(x=>x.toLocaleLowerCase('fr')).join(', ')}, ${fem?'elle':'il'} réussit particulièrement en ${best.toLocaleLowerCase('fr')}.`:pick([`Activités du ${word==='année'?'cours de l’année':word} : ${joinFr(f.practiced.map(x=>x.toLocaleLowerCase('fr')))}.`,`${fem?'Elle':'Il'} a pratiqué ${joinFr(f.practiced.map(x=>x.toLocaleLowerCase('fr')))}.`]))}
 if(pos.length)out.push(pick([`${fem?'Elle':'Il'} se montre ${joinFr(pos.map(t=>traitWord(t,fem)))}.`,`${P} est ${joinFr(pos.map(t=>traitWord(t,fem)))}.`]));
 if(a!=null&&f.prevAvg!=null){if(a-f.prevAvg>=1.5)out.push('Les progrès sont nets par rapport à la période précédente.');else if(f.prevAvg-a>=1.5)out.push('Les résultats sont en baisse par rapport à la période précédente.')}
 if(f.inapt.length)out.push(`${fem?'Elle':'Il'} a su rester impliqué${e} malgré une inaptitude.`);
 const adv=neg.filter(t=>t[3]),bare=neg.filter(t=>!t[3]);if(adv.length)out.push(`${fem?'Elle':'Il'} ${joinFr(adv.map(t=>fem?(t[4]||t[3]):t[3]))}.`);if(bare.length)out.push(`Points à travailler : ${joinFr(bare.map(t=>traitWord(t,fem)))}.`);
 if(f.abs>=3)out.push(`Les absences (${f.abs}) freinent ses progrès.`);
 if(f.kit>=2&&!tags.includes('tenue'))out.push(`Attention aux oublis de tenue (${f.kit}).`);
 if(f.late>=3)out.push('La ponctualité doit s’améliorer.');
 if(a!=null)out.push(a>=14&&!neg.length?'Continuez ainsi !':a>=10?'Il faut poursuivre les efforts.':'Un engagement plus constant est attendu.');
 return out.join(' ');
}

// ---------- Génération par IA (Gemini) ----------
// Le prénom n'est jamais envoyé : l'IA écrit [PRÉNOM], remplacé sur la tablette. Les besoins particuliers ne sont jamais envoyés ;
// les observations seulement si l'option est cochée. La clé d'API reste sur l'appareil.
const aiReady=()=>!!settings().aiKey;
function aiPrompt(st,f,periodName,tags){
 const fem=st.sex==='F',pos=traits().pos.filter(t=>tags.includes(t[0])).map(t=>traitWord(t,fem)),neg=traits().neg.filter(t=>tags.includes(t[0])).map(t=>traitWord(t,fem));
 const lines=[
  'Tu es professeur d’EPS au collège ou au lycée. Rédige l’appréciation du bulletin d’un élève pour la période « '+periodName+' ».',
  'Contraintes : 2 à 3 phrases, 300 caractères au maximum, en français, ton bienveillant, précis et professionnel ; accorde tout au '+(fem?'féminin (une élève)':st.sex==='G'?'masculin (un élève)':'masculin ou au féminin de façon neutre')+'.',
  'Écris [PRÉNOM] à la place du prénom (une fois au plus). N’invente aucun fait. Ne cite pas de note chiffrée. Réponds uniquement par le texte de l’appréciation.',
  'Données :',
  '- Moyenne de la période : '+(f.avg==null?'pas assez de notes':avgFmt(f.avg)+'/20')+(f.prevAvg!=null?' (période précédente : '+avgFmt(f.prevAvg)+'/20)':''),
  '- Activités pratiquées : '+(f.practiced.join(', ')||'non renseignées')+(f.acts.length?' ; résultats : '+f.acts.map(x=>x.n+' '+avgFmt(x.v)+'/20').join(', '):''),
  '- Assiduité : '+f.abs+' absence(s), '+f.late+' retard(s), '+f.kit+' oubli(s) de tenue sur '+f.sessions+' séances',
  f.inapt.length?'- A eu une inaptitude sur la période':'',
  pos.length?'- Qualités à souligner : '+pos.join(', '):'',
  neg.length?'- Points à améliorer : '+neg.join(', '):'',
  settings().aiObs==='1'&&f.obs.length?'- Observations du professeur : '+f.obs.map(o=>o.name).join(' / ').replace(new RegExp([st.first,st.last].filter(Boolean).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gi'),'[PRÉNOM]').slice(0,600):''
 ];
 return lines.filter(Boolean).join('\n');
}
async function aiGenerate(st,f,periodName,tags){
 const s=settings(),model=(s.aiModel||'gemini-2.5-flash').trim();
 const body={contents:[{role:'user',parts:[{text:aiPrompt(st,f,periodName,tags)}]}],generationConfig:{temperature:0.8,maxOutputTokens:1024,...(/flash/i.test(model)?{thinkingConfig:{thinkingBudget:0}}:{})}};
 const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':s.aiKey},body:JSON.stringify(body)});
 if(!r.ok){const m=r.status===400||r.status===403?'clé d’API ou modèle refusé':r.status===429?'quota dépassé, réessayez plus tard':'erreur '+r.status;throw Error(m)}
 const j=await r.json(),text=(j.candidates?.[0]?.content?.parts||[]).map(p=>p.text||'').join('').trim();
 if(!text)throw Error('réponse vide');
 return text.replace(/^["«\s]+|["»\s]+$/g,'').replace(/\[PR[ÉE]NOM\]/gi,st.first);
}
function aiSettings(){
 const s=settings(),p=panel(view,'Appréciations : génération par IA (Gemini)');
 el('p','Avec une clé d’API Gemini (Google AI Studio), les brouillons d’appréciations peuvent être rédigés par l’IA. Envoyés à Google : sexe, période, moyennes et activités, assiduité, adjectifs cochés (et vos observations si vous le cochez). Jamais envoyés : nom, prénom, besoins particuliers. La clé reste sur cet appareil (et dans vos sauvegardes).',p,'muted');
 const f=el('div','',p,'filters');
 const key=el('input','',el('label','Clé d’API Gemini',f));key.type='password';key.autocomplete='off';key.value=s.aiKey||'';key.placeholder='AIza…';
 const model=el('input','',el('label','Modèle',f));model.value=s.aiModel||'gemini-2.5-flash';
 const ob=el('label','',p,'check');const c=el('input','',ob);c.type='checkbox';c.checked=s.aiObs==='1';ob.append(' Inclure mes observations (peuvent contenir des informations personnelles)');
 const a=el('div','',p,'actions');
 const save=async()=>{await transaction('settings',t=>t.objectStore('settings').put({...settings(),aiKey:key.value.trim(),aiModel:model.value.trim()||'gemini-2.5-flash',aiObs:c.checked?'1':'0'}));await load()};
 button('Enregistrer',a,'primary').onclick=async()=>{await save();notify(key.value.trim()?'Réglages Gemini enregistrés.':'Génération par IA désactivée.')};
 button('Tester',a).onclick=async()=>{await save();if(!aiReady())return notify('Saisissez d’abord une clé.');
  try{const t=await aiGenerate({id:'test',first:'Alex',sex:'G'},{avg:14,prevAvg:12,acts:[{n:'Badminton',v:14}],practiced:['Badminton'],abs:0,late:0,kit:1,sessions:10,inapt:[],obs:[]},'Trimestre 1',['investi']);notify('Gemini répond : « '+t.slice(0,90)+'… »')}catch(e){notify('Gemini : '+e.message+'.')}};
}
function appreciationPanel(){
 if(!data.classes.length)return;
 const y=yearOf(today())||data.years[0],periods=periodsOf(y),t=today();
 const p=panel(view,'Préparer les appréciations du bulletin');
 el('p','Un brouillon est proposé pour chaque élève à partir de ses notes, de ses activités, de son assiduité et des adjectifs que vous cochez. Relisez, corrigez, puis enregistrez.',p,'muted');
 const f=el('div','',p,'filters');
 const cs=select(el('label','Classe',f),data.classes.map(c=>[c.id,c.name]));cs.value=draftState?.classId||(find('classes',classFilter)?classFilter:data.classes[0].id);
 const ps=select(el('label','Période',f),[...periods.map(x=>[x.name,x.name]),['year','Année entière']]);
 ps.value=draftState?.period||(periods.find(x=>x.start<=t&&x.end>=t)||periods[0])?.name||'year';
 button('Préparer les brouillons',f,'primary').onclick=()=>{draftState={classId:cs.value,period:ps.value,texts:{},tags:{}};render()};
 if(!aiReady()){const n=el('p','',p,'small muted');n.append('Rédaction par IA : ');link(n,'settings','configurer Gemini dans Paramètres');n.append('.')}
 if(!draftState)return;
 draftState.tags??={};
 button('Gérer les adjectifs',f).onclick=()=>{const d=sheet('Adjectifs à cocher');el('p','Supprimez ou ajoutez des adjectifs ; les cases cochées sont conservées.',d,'muted');traitsEditor(el('div','',d,'traits-editor'));d.addEventListener('close',()=>render());d.showModal()};
 const period=periods.find(x=>x.name===draftState.period)||null,pname=period?.name||'Année';
 const pupils=pupilsOf(draftState.classId),cards={};
 const list=el('div','',p,'drafts');
 for(const st of pupils){
  const id='bulletin:'+draftState.period+':'+st.id,saved=find('comments',id),fx=periodFacts(st,period,periods),fem=st.sex==='F';
  const tags=draftState.tags[st.id]??=(saved?.tags||'').split(',').filter(Boolean);
  const text=draftState.texts[st.id]??saved?.name??draftAppreciation(st,fx,pname,0,tags);draftState.texts[st.id]=text;
  const card=el('article','',list,'draft');
  const h=el('div','',card,'top');avatar(st,h,'sm');link(h,'student='+st.id,label(st),'title');el('span',fem?'Fille':st.sex==='G'?'Garçon':'Sexe ?',h,'tag');if(saved)el('span','Enregistrée',h,'tag now');
  el('p',['Moyenne '+avgFmt(fx.avg)+(fx.prevAvg!=null?' (avant '+avgFmt(fx.prevAvg)+')':''),plural(fx.abs,'absence'),plural(fx.kit,'oubli'),plural(fx.late,'retard'),fx.inapt.length?'inaptitude':''].filter(Boolean).join(' · '),card,'muted small');
  el('p','Activités : '+(fx.practiced.length?fx.practiced.map(n=>{const a=fx.acts.find(x=>x.n.split(' · ')[0]===n);return n+(a?' ('+avgFmt(a.v)+')':'')}).join(', '):'aucune sur la période'),card,'small acts');
  // Adjectifs à cocher (accordés selon le sexe)
  const chips=el('div','',card,'traits');
  for(const [kind,listT] of [['pos',traits().pos],['neg',traits().neg]]){
   const g=el('div','',chips,'trait-group '+kind);el('span',kind==='pos'?'+':'−',g,'trait-sign');
   for(const tr of listT){const b=button(traitWord(tr,fem),g,'trait');b.setAttribute('aria-pressed',tags.includes(tr[0]));
    b.onclick=()=>{const i=tags.indexOf(tr[0]);if(i<0)tags.push(tr[0]);else tags.splice(i,1);b.setAttribute('aria-pressed',tags.includes(tr[0]));ta.value=draftAppreciation(st,fx,pname,variant,tags);ta.oninput()}}
  }
  if(fx.obs.length){const d=el('details','',card);el('summary',plural(fx.obs.length,'observation'),d);for(const o of fx.obs)el('p',(o.date?fmtDate(o.date)+' · ':'')+o.name,d,'small')}
  const ta=el('textarea','',card);ta.rows=3;ta.value=text;
  const cnt=el('span',text.length+' caractères',card,'small muted');
  ta.oninput=()=>{draftState.texts[st.id]=ta.value;cnt.textContent=ta.value.length+' caractères'};
  const r=el('div','',card,'actions');
  let variant=0;button('Autre formulation',r,'small').onclick=()=>{ta.value=draftAppreciation(st,fx,pname,++variant,tags);ta.oninput()};
  const gen=async()=>{ai.disabled=true;ai.textContent='Rédaction…';try{ta.value=await aiGenerate(st,fx,pname,tags);ta.oninput();return true}catch(e){notify('IA : '+e.message+'.');return false}finally{ai.disabled=false;ai.textContent='Générer avec l’IA'}};
  const ai=button('Générer avec l’IA',r,'small primary');ai.hidden=!aiReady();ai.onclick=gen;
  cards[st.id]=gen;
 }
 const a=el('div','',p,'actions');
 if(aiReady())button('Générer toute la classe avec l’IA',a).onclick=async e=>{const b=e.currentTarget;b.disabled=true;let n=0;
  for(const st of pupils){b.textContent='IA : '+(n+1)+' / '+pupils.length+'…';if(!await cards[st.id]())break;n++}
  b.disabled=false;b.textContent='Générer toute la classe avec l’IA';notify(plural(n,'appréciation rédigée','appréciations rédigées')+' par l’IA : relisez-les avant d’enregistrer.')};
 button('Enregistrer toutes les appréciations',a,'primary').onclick=async()=>{
  const rows=pupils.map(st=>({id:'bulletin:'+draftState.period+':'+st.id,student:st.id,name:(draftState.texts[st.id]||'').trim(),date:today(),period:pname,tags:(draftState.tags[st.id]||[]).join(',')})).filter(r=>r.name);
  await transaction('comments',tx=>rows.forEach(r=>tx.objectStore('comments').put(r)));await load();
  notify(plural(rows.length,'appréciation enregistrée','appréciations enregistrées')+'.');render();
 };
 button('Exporter en CSV',a).onclick=()=>{
  const csv=[['Nom','Prénom','Appréciation'],...pupils.map(st=>[st.last,st.first,draftState.texts[st.id]||''])].map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\n');
  const l=document.createElement('a');l.href=URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv'}));l.download='appreciations-'+(find('classes',draftState.classId)?.name||'')+'-'+pname+'.csv';l.click();setTimeout(()=>URL.revokeObjectURL(l.href),1000);
 };
 button('Fermer',a).onclick=()=>{draftState=null;render()};
}

// ---------- Sauvegarde hebdomadaire ----------
// Proposition à l'ouverture quand la dernière sauvegarde date de plus que la fréquence choisie ;
// bandeau rouge quand elle date de plus du double. Le partage de l'iPad permet d'envoyer le fichier
// vers Google Drive, Fichiers ou iCloud.
const backupEvery=()=>{const v=settings().backupEvery;return v==null||v===''?7:Number(v)};
const backupAge=()=>{const b=lastBackup();return b?Math.floor((Date.now()-new Date(b))/864e5):null};
const hasData=()=>data.students.length>0||data.sessions.length>0;
async function exportBackup(mode='download'){
 const b=await backupObject(),extra=b.extra,json=JSON.stringify(b);
 const name='eps-manager-'+today()+'.json',apps=appsInBackup(extra);
 if(mode==='share'){
  const file=new File([json],name,{type:'application/json'});
  if(!navigator.canShare?.({files:[file]}))throw Error('share');
  await navigator.share({files:[file],title:'Sauvegarde EPS Manager'});
 }else{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([json],{type:'application/json'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
 try{localStorage.setItem('eps-last-backup',new Date().toISOString())}catch{}
 notify('Sauvegarde '+(mode==='share'?'partagée':'exportée')+' ('+mb(json.length)+')'+(apps.length?' avec '+apps.join(', '):'')+'.');
}
const canShareFiles=()=>{try{return !!navigator.canShare?.({files:[new File(['x'],'x.json',{type:'application/json'})]})}catch{return false}};
function backupButtons(parent,after){
 const go=async mode=>{try{await exportBackup(mode);after?.()}catch(e){if(e?.name!=='AbortError')notify(mode==='share'?'Partage impossible sur cet appareil : utilisez « Télécharger ».':'Sauvegarde impossible.')}};
 button('Télécharger le fichier',parent,'primary').onclick=()=>go('download');
 if(canShareFiles())button('Enregistrer dans Drive, Fichiers…',parent).onclick=()=>go('share');
}
function backupBanner(){
 const age=backupAge(),every=backupEvery();
 if(!every||!hasData()||(age!=null&&age<every*2))return;
 const b=el('div','',view,'backup-banner');
 el('strong',age==null?'Aucune sauvegarde n’a encore été faite.':'Dernière sauvegarde il y a '+age+' jours.',b);
 el('span','Si la tablette est perdue ou réinitialisée, les données seraient perdues.',b);
 backupButtons(el('div','',b,'actions'),()=>render());
}
function weeklyBackupPrompt(){
 const age=backupAge(),every=backupEvery();
 if(!every||!hasData()||(age!=null&&age<every))return;
 try{if(localStorage.getItem('eps-backup-snooze')===today())return}catch{}
 const d=sheet('Sauvegarde de la semaine');
 el('p',age==null?'Vous n’avez encore jamais sauvegardé vos données.':'Votre dernière sauvegarde date de '+age+' jours.',d);
 el('p','La sauvegarde comprend EPS Manager et les données de vos applications. Gardez-la hors de la tablette (Google Drive, Fichiers, iCloud…).',d,'muted');
 const a=el('div','',d,'actions');backupButtons(a,()=>{d.close();render()});
 button('Plus tard',a).onclick=()=>d.close();
 d.addEventListener('close',()=>{try{localStorage.setItem('eps-backup-snooze',today())}catch{}});
 d.showModal();
}

// ---------- Versions et état des liaisons des applications ----------
const moduleUpdates={},errorShown=new Set();
async function checkModuleVersions(){
 let seen={};try{seen=JSON.parse(settings().moduleVersions||'{}')||{}}catch{}
 let changed=false;
 for(const m of modules){if(!m.version||m.missing)continue;
  if(seen[m.id]&&seen[m.id]!==m.version){moduleUpdates[m.id]={from:seen[m.id],to:m.version};notify(m.name+' a été mise à jour ('+seen[m.id]+' → '+m.version+').')}
  if(seen[m.id]!==m.version){seen[m.id]=m.version;changed=true}}
 if(changed){await transaction('settings',t=>t.objectStore('settings').put({...settings(),moduleVersions:JSON.stringify(seen)}));await load()}
}
function moduleError(m,msg,quiet){
 moduleSync[m.id]={at:new Date(),error:msg,grades:0,results:0,summaries:0};
 if(!quiet||!errorShown.has(m.id)){errorShown.add(m.id);notify(m.name+' : la liaison avec EPS Manager ne fonctionne plus ('+msg+').')}
 return null;
}

// ---------- Recherche ----------
function renderSearch(q){
 const norm=s=>(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
 const n=norm(q),hits=[],t=today();
 for(const s of data.students)if(norm(label(s)+' '+s.last+' '+s.first).includes(n))hits.push(['students',s,label(s),ref('classes',s.classId)]);
 for(const c of data.classes)if(norm(c.name).includes(n))hits.push(['classes',c,c.name,plural(pupilsOf(c.id).length,'élève')]);
 for(const c of data.cycles)if(norm(c.name).includes(n))hits.push(['cycles',c,c.name,ref('classes',c.classId)]);
 hits.push(...data.sessions.filter(s=>active(s)&&s.date>=t&&norm(sessionTitle(s)+' '+s.name).includes(n)).sort(byDate).slice(0,15).map(s=>['sessions',s,sessionTitle(s),fmtDate(s.date)+(s.time?' '+hh(s.time):'')]));
 el('p',plural(hits.length,'résultat')+' pour « '+q+' »',view,'muted');
 const list=el('div','',view,'list');
 for(const [k,row,title,meta] of hits.slice(0,60)){
  const a=link(list,k==='sessions'?'session='+row.id:k==='students'?'student='+row.id:k,'','item');
  a.onclick=()=>{search.value='';if(k==='sessions')sessionId=row.id;else if(row.classId||k==='classes')classFilter=k==='classes'?row.id:row.classId;if(location.hash===a.hash)queueMicrotask(render)};
  if(k==='students')avatar(row,a);else icon(k,el('span','',a,'avatar'));
  const b=el('div','',a,'body');el('span',title,b,'title');el('span',pages[k]+' · '+meta,b,'meta');
 }
}

// ---------- Import des élèves : trombinoscope PRONOTE (PDF) ou liste PRONOTE (CSV) ----------
// Les deux se complètent : un élève déjà présent dans la classe (même nom et prénom) est mis à jour, pas dupliqué.
const plainNorm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const nameKey=(classId,first,last)=>classId+'|'+plainNorm(first)+'|'+plainNorm(last);
const studentByName=(classId,first,last)=>data.students.find(s=>nameKey(s.classId,s.first,s.last)===nameKey(classId,first,last));
let importMode='csv';
function importPanel(){
 const box=el('details','',view,'import');el('summary','Importer des élèves (PRONOTE)',box);
 const seg=el('div','',box,'segmented');seg.setAttribute('role','group');seg.setAttribute('aria-label','Type d’import');
 for(const [v,t] of [['csv','Liste PRONOTE (CSV)'],['pdf','Trombinoscope PRONOTE (PDF)']]){const b=button(t,seg);b.setAttribute('aria-pressed',importMode===v);b.onclick=()=>{importMode=v;render();view.querySelector('details.import').open=true}}
 const f=el('div','',box,'fields');
 const target=select(el('label','Classe de destination',f),data.classes.map(c=>[c.id,label(c)]));if(classFilter)target.value=classFilter;
 const preview=el('div','',box);
 if(importMode==='csv'){
  el('p','Dans PRONOTE : liste des élèves de la classe › Exporter au format CSV. Sont repris : nom, prénom, sexe, date de naissance et besoins particuliers (PAI, PAP…).',box,'muted').style.order=-1;
  const picker=el('input','',el('label','Fichier CSV',f));picker.type='file';picker.accept='.csv,text/csv,text/plain';
  picker.onchange=async()=>{preview.replaceChildren();const file=picker.files[0];if(!file)return;
   try{csvPreview(preview,parseStudentCSV(await readText(file)),()=>target.value)}catch(e){el('p',e.message||'Lecture impossible. Vérifiez le fichier CSV.',preview,'notice')}};
  return;
 }
 const picker=el('input','',el('label','Fichier PDF',f));picker.type='file';picker.accept='application/pdf';
 picker.onchange=async()=>{
  preview.replaceChildren();const file=picker.files[0];if(!file)return;picker.disabled=true;
  try{
   const {extract}=await import('./trombi.js');const pupils=await extract(file);
   el('h3',plural(pupils.length,'fiche')+' à vérifier',preview);
   const form=el('form','',preview),grid=el('div','',form,'import-grid');
   const rows=pupils.map(p=>{
    const card=el('article','',grid,'import-card'),img=el('img','',card);img.src=p.photo;img.alt='';
    const inc=el('label','Inclure',card,'check');const include=el('input','',inc);include.type='checkbox';include.checked=true;inc.prepend(include);
    const last=el('input','',el('label','Nom',card)),first=el('input','',el('label','Prénom',card));last.value=p.last;first.value=p.first;
    return {include,last,first,photo:p.photo};
   });
   if(!rows.length)return;
   el('button','Valider l’import',form,'primary');
   form.onsubmit=async e=>{
    e.preventDefault();const classId=target.value;
    const selected=rows.filter(r=>r.include.checked).map(r=>({first:r.first.value.trim(),last:r.last.value.trim(),photo:r.photo}));
    if(selected.some(r=>!r.first||!r.last)){notify('Complétez le prénom et le nom de chaque fiche incluse.');return}
    let added=0,updated=0;const put=[];
    for(const r of selected){const ex=studentByName(classId,r.first,r.last)||put.find(x=>nameKey(x.classId,x.first,x.last)===nameKey(classId,r.first,r.last));
     if(ex){if(!ex.photo){put.push({...ex,photo:r.photo});updated++}}else{put.push({...r,classId,id:crypto.randomUUID()});added++}}
    await transaction('students',t=>put.forEach(r=>t.objectStore('students').put(r)));await load();render();
    notify(plural(added,'élève ajouté','élèves ajoutés')+(updated?', '+plural(updated,'photo ajoutée','photos ajoutées')+' à des élèves existants':'')+'.');
   };
  }catch{el('p','Lecture impossible. Vérifiez le format du PDF.',preview,'notice')}finally{picker.disabled=false}
 };
}
// Texte d'un fichier : UTF-8, sinon Windows-1252 (exports PRONOTE plus anciens).
async function readText(file){const buf=await file.arrayBuffer();try{return new TextDecoder('utf-8',{fatal:true}).decode(buf)}catch{return new TextDecoder('windows-1252').decode(buf)}}
function parseCSVRows(text){
 text=text.replace(/^﻿/,'');const first=text.split(/\r?\n/,1)[0];
 const sep=[';','\t',','].sort((a,b)=>first.split(b).length-first.split(a).length)[0],rows=[];let row=[],cell='',q=false;
 for(let i=0;i<text.length;i++){const ch=text[i];
  if(q){if(ch==='"'&&text[i+1]==='"'){cell+='"';i++}else if(ch==='"')q=false;else cell+=ch}
  else if(ch==='"')q=true;else if(ch===sep){row.push(cell);cell=''}
  else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell=''}
  else cell+=ch}
 row.push(cell);if(row.some(x=>x.trim()))rows.push(row);return rows;
}
// « NOM COMPOSÉ Prénom » : le nom est la suite de mots en majuscules (si tout est en majuscules, le dernier mot est le prénom).
function splitPronoteName(full){
 const w=String(full||'').trim().split(/\s+/).filter(Boolean);if(w.length<2)return {last:w[0]||'',first:''};
 const upper=x=>/\p{L}/u.test(x)&&x===x.toLocaleUpperCase('fr');let i=0;while(i<w.length&&upper(w[i]))i++;
 if(i===w.length)i=w.length-1;if(i===0)i=1;
 const cap=s=>s.toLocaleLowerCase('fr').replace(/(^|[\s-])(\p{L})/gu,(m,a,b)=>a+b.toLocaleUpperCase('fr'));
 const first=w.slice(i).join(' ');return {last:w.slice(0,i).join(' '),first:upper(first)?cap(first):first};
}
function parseStudentCSV(text){
 const rows=parseCSVRows(text);if(rows.length<2)throw Error('Fichier vide ou illisible.');
 const head=rows[0].map(x=>plainNorm(x)),col=(...re)=>head.findIndex(hd=>re.some(r=>r.test(hd)));
 const cName=col(/^eleves?$/,/^nomprenom$/,/^nometprenom$/),cLast=col(/^nom$/),cFirst=col(/^prenoms?$/);
 const cSex=col(/^sexe$/,/^genre$/),cBirth=col(/^nee?le$/,/^neele$/,/naissance/),cNeeds=col(/pai|pap|besoin|amenagement/);
 if(cName<0&&(cLast<0||cFirst<0))throw Error('Colonne « Élèves » (ou « Nom » et « Prénom ») introuvable : utilisez l’export CSV de la liste des élèves de PRONOTE.');
 // Besoins particuliers : colonne nommée PAI/PAP, sinon la colonne sans titre qui contient des informations (8e colonne de l'export PRONOTE)
 let needs=cNeeds;if(needs<0){const blank=head.map((hd,i)=>!hd&&i>0?i:-1).filter(i=>i>=0);needs=blank.find(i=>rows.slice(1).some(r=>(r[i]||'').trim()))??(blank.includes(7)?7:-1)}
 const date=v=>{const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);return m?m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0'):''};
 const sex=v=>/^f/i.test(String(v||'').trim())?'F':/^(m|g|h)/i.test(String(v||'').trim())?'G':'';
 return rows.slice(1).map(r=>{const n=cName>=0?splitPronoteName(r[cName]):{last:(r[cLast]||'').trim(),first:(r[cFirst]||'').trim()};
  return {last:n.last,first:n.first,sex:cSex>=0?sex(r[cSex]):'',birth:cBirth>=0?date(r[cBirth]):'',needs:needs>=0?(r[needs]||'').trim():''}}).filter(s=>s.last&&s.first);
}
function csvPreview(box,list,classOf){
 if(!list.length){el('p','Aucun élève reconnu dans ce fichier.',box,'notice');return}
 const status=s=>{const ex=studentByName(classOf(),s.first,s.last);if(!ex)return 'Nouveau';return ['sex','birth','needs'].some(k=>s[k]&&ex[k]!==s[k])?'Mise à jour':'Déjà à jour'};
 el('h3',plural(list.length,'élève trouvé','élèves trouvés')+' · vérifiez puis importez',box);
 const tb=el('table','',el('div','',box,'table-box flat'),'stats');
 const hr=el('tr','',el('thead','',tb));for(const t of ['','Nom','Prénom','Sexe','Naissance','Besoins particuliers','Statut'])el('th',t,hr);
 const body=el('tbody','',tb),checks=[];
 const paint=()=>{body.replaceChildren();checks.length=0;
  for(const s of list){const tr=el('tr','',body),c=el('input','',el('td','',tr));c.type='checkbox';c.checked=status(s)!=='Déjà à jour';checks.push(c);
   el('td',s.last,tr);el('td',s.first,tr);el('td',s.sex==='F'?'Fille':s.sex==='G'?'Garçon':'—',tr);el('td',s.birth?fmtDate(s.birth,{day:'numeric',month:'numeric',year:'numeric'}):'',tr);
   const n=el('td','',tr);if(s.needs)el('span',s.needs,n,'tag warn');el('td',status(s),tr,'muted')}};
 paint();
 const a=el('div','',box,'actions');
 button('Importer les élèves cochés',a,'primary').onclick=async()=>{
  const classId=classOf();if(!classId)return notify('Choisissez la classe de destination.');
  let added=0,updated=0;const put=[];
  list.forEach((s,i)=>{if(!checks[i]?.checked)return;const ex=studentByName(classId,s.first,s.last);
   if(ex){const next={...ex};for(const k of ['sex','birth','needs'])if(s[k])next[k]=s[k];put.push(next);updated++}
   else{put.push({id:crypto.randomUUID(),classId,first:s.first,last:s.last,...(s.sex?{sex:s.sex}:{}),...(s.birth?{birth:s.birth}:{}),...(s.needs?{needs:s.needs}:{})});added++}});
  if(!put.length)return notify('Aucun élève coché.');
  await transaction('students',t=>put.forEach(r=>t.objectStore('students').put(r)));await load();render();
  notify(plural(added,'élève ajouté','élèves ajoutés')+(updated?', '+plural(updated,'élève mis à jour','élèves mis à jour'):'')+'.');
 };
}
const ageOf=b=>{if(!b)return null;const d=new Date(b+'T12:00'),n=new Date();let a=n.getFullYear()-d.getFullYear();if(n.getMonth()<d.getMonth()||(n.getMonth()===d.getMonth()&&n.getDate()<d.getDate()))a--;return a};


// ---------- Démarrage ----------
window.onunhandledrejection=()=>notify('Opération interrompue. Vérifiez le stockage disponible.');
search.oninput=()=>render();
window.onhashchange=()=>{search.value='';render();window.scrollTo(0,0)};
await load();await migrateAttendance();
if(lockOn())lockNow();
modulesReady=discoverModules();
render();
// Au démarrage : modules dans le menu, puis reprise de leurs notes et résultats.
modulesReady.then(async()=>{buildNav();await checkModuleVersions();return syncAllModules()}).then(n=>{if(n&&!location.hash.startsWith('#module'))render()});
setTimeout(async()=>{if(!locked&&!await interruptedRestore())weeklyBackupPrompt()},1500);
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').then(()=>navigator.serviceWorker.ready).then(r=>r.active?.postMessage('sync-files')).catch(()=>{});
