// Numéro de version affiché dans l'application : l'incrémenter à chaque nouvelle livraison
// (et le reporter dans sw.js pour renouveler le cache hors ligne).
const APP_VERSION=5;

// ---------- Structure de l'application ----------
const pages={home:'Tableau de bord',calendar:'Calendrier',sessions:'Séances',attendance:'Appel',classes:'Classes',students:'Élèves',groups:'Groupes',cycles:'Cycles',restrictions:'Inaptitudes',grades:'Évaluations',comments:'Appréciations',observations:'Observations',planning:'Paramètres du calendrier',absences:'Absences',settings:'Paramètres',student:'Fiche élève',session:'Séance',boards:'Tableaux',board:'Tableau',years:'Années scolaires',backup:'Sauvegardes'};
const navLabels={planning:'Emploi du temps'};
const navGroups=[
 ['Quotidien',['home','calendar','sessions','attendance','boards']],
 ['Mes élèves',['classes','students','groups','cycles','restrictions']],
 ['Suivi',['absences','grades','comments','observations']],
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
 freq:[['all','Toutes les semaines'],['A','Semaine A'],['B','Semaine B']]
};
// [clé, libellé, type (store, enum, date, time, number ou texte), valeur par défaut]
const fields={
 years:[['name','Année scolaire'],['start','Début','date'],['end','Fin','date']],
 classes:[['year','Année','years'],['name','Nom de la classe']],
 students:[['classId','Classe','classes'],['first','Prénom'],['last','Nom']],
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
const nouns={boards:['tableau','tableaux'],results:['résultat de module','résultats de module'],years:['année','années'],classes:['classe','classes'],students:['élève','élèves'],groups:['groupe','groupes'],cycles:['cycle','cycles'],sessions:['séance','séances'],restrictions:['inaptitude','inaptitudes'],grades:['note','notes'],comments:['appréciation','appréciations'],observations:['observation','observations'],timetable:['cours de l’emploi du temps','cours de l’emploi du temps'],holidays:['période de vacances','périodes de vacances'],attendance:['mention d’appel','mentions d’appel']};
const deps={years:[['classes','year'],['holidays','year'],['timetable','year']],classes:[['students','classId'],['groups','classId'],['cycles','classId'],['sessions','classId'],['timetable','classId'],['boards','classId']],students:[['restrictions','student'],['grades','student'],['comments','student'],['observations','student'],['attendance','student'],['results','student']],sessions:[['attendance','sessionId'],['results','sessionId']]};
// Appel : tout le monde est présent par défaut, seules les exceptions sont enregistrées.
// Chaque mention a une couleur et un symbole, pour être repérée d'un coup d'œil dans les résumés.
const statusInfo={
 'Présent':{k:'P',bg:'#1b4d3e',fg:'#fff',icon:'M5 12.5l4.5 4.5L19 7.5'},
 'Absent':{k:'A',bg:'#b3261e',fg:'#fff',icon:'M6.5 6.5l11 11M17.5 6.5l-11 11'},
 'Retard':{k:'R',bg:'#f2c14e',fg:'#10261f',icon:'M12 7.5V12l3 2M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z'},
 'Oubli de tenue':{k:'T',bg:'#e8833a',fg:'#10261f',icon:'M9 3.5L3.5 6.5l2 4 2.5-1v10.5h8V9.5l2.5 1 2-4L15 3.5c-.5 1.6-1.6 2.5-3 2.5s-2.5-.9-3-2.5z'},
 'Oubli de chaussures':{k:'C',bg:'#7b4bc4',fg:'#fff',icon:'M3 17.5V8.5h4.5l1.5 3 4.5 1.5 6 1.5a1.5 1.5 0 0 1 1.5 1.5v1.5zM3 20.5h18M9 11.5l1-2M11.5 12.5l1-2'},
 'Certificat médical':{k:'CM',bg:'#2f5bea',fg:'#fff',icon:'M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z'},
 'Mot des parents':{k:'MP',bg:'#0f7b74',fg:'#fff',icon:'M3.5 6.5h17v11h-17zM3.5 7l8.5 6 8.5-6'}
};
const statuses=Object.keys(statusInfo);
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
 const legacy=data.attendance.filter(a=>['Présent','Non renseigné','En retard','Excusé'].includes(a.status));
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
 {key:'med',label:'certificats médicaux',one:'certificat médical',statuses:['Certificat médical']}
];
const defaultSettings={id:'app',absOn:'1',absMin:'3',absWindow:'4',lateOn:'0',lateMin:'3',lateWindow:'8',kitOn:'1',kitMin:'3',kitWindow:'8',medOn:'0',medMin:'2',medWindow:'cycle'};
const settings=()=>({...defaultSettings,...data.settings.find(r=>r.id==='app')});
const calledSessions=classId=>data.sessions.filter(s=>s.classId===classId&&active(s)&&isStarted(s)&&isCalled(s));
const statusIn=(s,p)=>data.attendance.find(a=>a.id===s.id+'/'+p.id)?.status||'Présent';
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
   const n=w.list.filter(s=>r.statuses.includes(statusIn(s,p))).length;
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
}
document.querySelector('time').textContent=new Intl.DateTimeFormat('fr',{dateStyle:'full'}).format(new Date());
document.querySelector('.version').textContent='Version '+APP_VERSION;

// ---------- Rendu ----------
let sessionId='',classFilter='',period='upcoming',calWeek='',editing={};
const collectionsOf=k=>k==='planning'?['timetable','holidays']:[k];
function render(){
 let [k,param]=location.hash.slice(1).split('=');if(!(k in pages))k='home';current=k==='student'?'students':k==='session'?'calendar':k==='board'?'boards':k;
 if(editing.k&&!collectionsOf(k).includes(editing.k))editing={};
 buildNav();
 openBoards=[];
 view.replaceChildren();
 const q=search.value.trim();
 if(q){document.querySelector('h1').textContent='Recherche';return renderSearch(q)}
 document.querySelector('h1').textContent=pages[k];
 document.title=pages[k]+' · EPS Manager';
 ({home:renderHome,calendar:renderCalendar,planning:renderPlanning,attendance:renderAttendance,backup:renderBackup,absences:renderAbsences,settings:renderSettings,student:()=>renderStudent(decodeURIComponent(param||'')),session:()=>renderSession(decodeURIComponent(param||'')),boards:renderBoards,board:()=>renderBoard(decodeURIComponent(param||''))}[k]||renderList)(k);
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

 if(!data.timetable.length){const n=el('p','',view,'notice');n.append('Votre emploi du temps est vide. ');link(n,'planning','Renseignez vos cours et vos vacances').style.fontWeight='700';n.append(' : toutes les séances de l’année seront créées automatiquement.')}

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
 if(!data.years.length)return needYear();
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
 renderCollection('timetable',view);
 el('h2','Vacances et jours fériés',view,'section-title big');
 renderCollection('holidays',view);
}

// ---------- Appel ----------
function defaultSession(){
 const t=today(),n=nowMin(),todays=data.sessions.filter(s=>s.date===t&&active(s)).sort(byDate);
 return todays.find(isNow)||todays.find(s=>s.time&&toMin(s.time)>n)||todays.at(-1)||data.sessions.filter(s=>active(s)&&isStarted(s)).sort((a,b)=>byDate(b,a))[0]||data.sessions.slice().sort(byDate)[0];
}
function renderAttendance(){
 if(!data.sessions.length){el('p','Aucune séance pour le moment.',view,'empty');link(view,'planning','Renseigner mon emploi du temps →','btn primary').style.alignSelf='start';return}
 if(!find('sessions',sessionId))sessionId=defaultSession().id;
 const limit=addDays(today(),7);
 const options=data.sessions.filter(s=>(active(s)&&s.date<=limit)||s.id===sessionId).sort((a,b)=>byDate(b,a)).slice(0,150);
 const session=find('sessions',sessionId),pupils=pupilsOf(session.classId);
 const head=el('div','',view,'panel attendance-head');
 const s=select(el('label','Séance',head),options.map(r=>[r.id,fmtDate(r.date)+(r.time?' '+hh(r.time):'')+' · '+sessionTitle(r)]));
 s.value=sessionId;s.onchange=()=>{sessionId=s.value;render()};
 const info=[longDate(session.date),timeRange(session),cycleText(session),sessionContent(session)].filter(Boolean).join(' · ');
 el('p',info,head,'muted');
 link(head,'session='+session.id,'Contenu de la séance'+(hasContent(session)?' (préparé)':'')+' →','link');
 if(session.cancelled){el('p','Cette séance a été supprimée · '+session.cancelled,view,'notice');button('Gérer la séance',view).onclick=()=>openSession(session);return}
 if(!pupils.length){el('p','Aucun élève dans cette classe.',view,'empty');link(view,'students','Ajouter des élèves →','link');return}
 const statusOf=p=>data.attendance.find(a=>a.id===sessionId+'/'+p.id)?.status||'Présent';
 const counts={};for(const p of pupils){const st=statusOf(p);counts[st]=(counts[st]||0)+1}
 const legend=el('div','',head,'legend');
 for(const st of statuses)if(counts[st]){const sp=el('span','',legend);statusDot(st,sp);sp.append(st+' · '+counts[st])}
 el('p','Tous les élèves sont présents par défaut. Touchez un élève pour indiquer une absence, un retard, un oubli ou une dispense.',head,'muted');

 const grid=el('div','',view,'pupils');
 for(const p of pupils){
  const st=statusOf(p),info=statusInfo[st];
  const b=button('',grid,'pupil'+(st==='Présent'?'':' flagged'));
  b.style.setProperty('--c',info.bg);b.style.setProperty('--fg',info.fg);
  avatar(p,b);el('span',p.first,b);el('span',p.last,b,'last');
  const sd=statusDot(st,b,'st');if(st==='Présent'){sd.style.background='#e5ebe3';sd.style.color='var(--primary)'}
  if(st!=='Présent')el('span',st,b,'st-label');
  if(restrictionOf(p.id))el('span','!',b,'inapt').title='Inaptitude en cours';
  b.setAttribute('aria-label',label(p)+' : '+st);
  b.onclick=()=>pupilSheet(p,session,st);
 }
 const actions=el('div','',view,'actions');
 if(isCalled(session))el('p','✓ Appel enregistré'+(recordsOf(session.id).length?'':' · tous présents'),actions,'saved');
 else button('Valider l’appel · '+plural(counts['Présent']||0,'présent'),actions,'primary').onclick=async()=>{await transaction('sessions',t=>t.objectStore('sessions').put({...session,called:'1'}));await load();render();notify('Appel enregistré.')};
}
function pupilSheet(p,session,current){
 const d=sheet(label(p));
 const r=restrictionOf(p.id);if(r)el('p','Inaptitude jusqu’au '+fmtDate(r.end)+' · '+r.name,d,'notice');
 link(d,'student='+p.id,'Ouvrir la fiche de l’élève →','link').onclick=()=>d.close();
 const grid=el('div','',d,'status-grid');
 for(const st of statuses){
  const b=button('',grid,'status-btn');b.setAttribute('aria-pressed',st===current);
  statusDot(st,b);b.append(st);
  b.onclick=async()=>{
   const id=session.id+'/'+p.id;
   await transaction(['attendance','sessions'],t=>{if(st==='Présent')t.objectStore('attendance').delete(id);else t.objectStore('attendance').put({id,sessionId:session.id,student:p.id,status:st});t.objectStore('sessions').put({...session,called:'1'})});
   await load();d.close();render();
  };
 }
 d.showModal();
}

// ---------- Sauvegardes ----------
function renderBackup(){
 const p=panel(view,'Exporter');
 el('p','La sauvegarde JSON contient les données en clair (noms, notes, inaptitudes). Conservez-la dans un emplacement protégé.',p,'notice');
 const b=lastBackup();el('p',b?'Dernière sauvegarde : '+new Intl.DateTimeFormat('fr',{dateStyle:'long',timeStyle:'short'}).format(new Date(b)):'Aucune sauvegarde exportée depuis cet appareil.',p,'muted');
 const btn=button('Exporter la sauvegarde',p,'primary');btn.style.alignSelf='start';
 btn.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({version:2,data})],{type:'application/json'}));a.download='eps-manager-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);try{localStorage.setItem('eps-last-backup',new Date().toISOString())}catch{}render();notify('Sauvegarde exportée.')};
 const r=panel(view,'Restaurer');
 el('p','La restauration remplace toutes les données de cet appareil.',r,'muted');
 const input=el('input','',el('label','Fichier de sauvegarde (.json)',r));input.type='file';input.accept='.json,application/json';
 input.onchange=async()=>{try{
  const b=JSON.parse(await input.files[0].text());
  if(![1,2].includes(b.version)||!b.data||typeof b.data!=='object')throw Error();
  for(const key of ['holidays','timetable','settings','results','boards'])b.data[key]??=[];
  if(!stores.every(key=>Array.isArray(b.data[key])&&b.data[key].every(r=>r&&typeof r.id==='string'&&Object.values(r).every(v=>typeof v==='string'))))throw Error();
  if(!confirm('Remplacer toutes les données locales par cette sauvegarde ?'))return;
  await transaction(stores,t=>{for(const key of stores){const st=t.objectStore(key);st.clear();b.data[key].forEach(r=>st.add(r))}});await load();await migrateAttendance();render();notify('Sauvegarde restaurée.');
 }catch{notify('Restauration impossible. Vérifiez le fichier.')}};
 const s=panel(view,'Données d’exemple');
 el('p','Deux classes (5e B et 4e A) avec élèves, emploi du temps, vacances, cycles, appels passés, notes et observations, pour découvrir l’application. Remplace les données actuelles.',s,'muted');
 const sb=button('Charger les données d’exemple',s);sb.style.alignSelf='start';sb.onclick=loadSample;
}

// ---------- Données d'exemple ----------
async function loadSample(){
 const hasData=stores.some(k=>data[k].length);
 if(hasData&&!confirm('Remplacer toutes les données de cet appareil par les données d’exemple ?\n\nPensez à exporter une sauvegarde avant si besoin.'))return;
 let seed=42;const rnd=()=>{seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296};
 const y={id:'ex-year',name:'2026-2027',start:'2026-09-01',end:'2027-07-03',firstWeek:'A'};
 const holidays=[['Toussaint','2026-10-17','2026-11-01'],['11 Novembre','2026-11-11','2026-11-11'],['Noël','2026-12-19','2027-01-03'],['Hiver','2027-02-13','2027-02-28'],['Lundi de Pâques','2027-03-29','2027-03-29'],['Printemps','2027-04-10','2027-04-25'],['Pont de l’Ascension','2027-05-06','2027-05-09'],['Lundi de Pentecôte','2027-05-17','2027-05-17']].map(([name,start,end],i)=>({id:'ex-hol'+i,year:y.id,name,start,end}));
 const classes=[{id:'ex-5B',year:y.id,name:'5e B'},{id:'ex-4A',year:y.id,name:'4e A'}];
 const firsts=['Léa','Hugo','Inès','Nathan','Chloé','Adam','Jade','Louis','Emma','Rayan','Lina','Gabriel','Mila','Noé','Zoé','Arthur','Manon','Sacha','Louise','Ethan','Alice','Yanis','Rose','Timéo','Camille','Mohamed','Anna','Jules','Sarah','Lucas','Lou','Malo','Nina','Tom','Ambre','Enzo','Clara','Nolan','Eva','Mathis','Agathe','Liam','Juliette','Maël','Lyna','Paul','Romane','Ilyes'];
 const lasts=['Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau','Simon','Laurent','Lefebvre','Michel','Garcia','David','Bertrand','Roux','Vincent','Fournier','Morel','Girard','André','Mercier','Dupont','Lambert','Bonnet','François','Martinez','Legrand','Garnier','Faure','Rousseau','Blanc','Guerin','Muller','Henry','Roussel','Nicolas','Perrin','Morin','Mathieu','Clement','Gauthier','Dumont','Lopez','Fontaine','Chevalier'];
 const students=[];classes.forEach((c,ci)=>{for(let i=0;i<24;i++){const n=ci*24+i;students.push({id:'ex-st'+n,classId:c.id,first:firsts[n],last:lasts[(n*7)%lasts.length]})}});
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
 const weights=[['Absent',.05],['Retard',.03],['Oubli de tenue',.03],['Oubli de chaussures',.015],['Certificat médical',.01],['Mot des parents',.015]];
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
   if(type==='date'&&key!=='end')input.value=today();
   if(def)input.value=def;
   if(k==='holidays'&&key==='name'){input.setAttribute('list','holiday-names');const dl=el('datalist','',l);dl.id='holiday-names';for(const v of ['Toussaint','Noël','Hiver','Printemps','Pont de l’Ascension','Été','Jour férié'])dl.append(new Option(v))}
  }
  input.name=key;input.required=!(k==='sessions'&&key==='time');
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
  students:[label(row),ref('classes',row.classId)],
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
 for(const s of list)out[statusIn(s,p)]++;
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
   for(const s of list){const td=el('td','',tr);const x=statusIn(s,p);if(x!=='Présent')statusDot(x,td);else td.textContent='·'}
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
 el('span',(c?c.name:'Sans classe')+(y?' · '+y.name:''),info,'muted');
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
 kpi('Moyenne',avg==null?'—':avg.toFixed(1).replace('.',','),plural(grades.length,'note'));

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
  for(const s of yearList){const x=statusIn(s,p);const sq=el('span','',strip,'sq'+(x==='Présent'?' ok':''));statusIcon(x,sq);if(x!=='Présent'){sq.style.background=statusInfo[x].bg;sq.style.color=statusInfo[x].fg}sq.title=longDate(s.date)+' · '+(cycleOf(s)?.name||s.name)+' · '+x}
  const ments=yearList.filter(s=>statusIn(s,p)!=='Présent').sort((a,b)=>byDate(b,a));
  el('h3','Mentions · '+ments.length,pa);
  if(!ments.length)el('p','Aucune absence, aucun retard ni oubli cette année.',pa,'muted');
  const ml=el('div','',pa,'mentions');
  for(const s of ments){const x=statusIn(s,p);const row=link(ml,'attendance','','row');row.onclick=()=>{sessionId=s.id};statusDot(x,row);const b=el('div','',row,'body');el('span',x,b,'title');el('span',longDate(s.date)+(s.time?' · '+hh(s.time):'')+(cycleOf(s)?' · '+cycleOf(s).name:''),b,'meta')}
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
 const p=panel(view,'Résultats des modules');
 const rows=data.results.filter(r=>r.sessionId===s.id);
 if(!rows.length)el('p','Les résultats des modules connectés à l’application (chronomètre, tests physiques, évaluations…) apparaîtront ici, séance par séance et élève par élève.',p,'muted');
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
 const f=el('input','',el('label','Fichier exporté par un module',imp));f.type='file';f.accept='.json,application/json';
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
  const r=await addResults(s,j.module||'Module',items);render();
  notify(plural(r.added,'résultat importé','résultats importés')+(r.missing.length?' · non reconnus : '+r.missing.slice(0,3).join(', ')+(r.missing.length>3?'…':''):'')+'.');
 }catch{notify('Import impossible : vérifiez le format du fichier.')}
}
function studentResults(id){
 const rows=data.results.filter(r=>r.student===id).sort((a,b)=>byDate(b,a));
 const p=panel(view,'Résultats des modules · '+rows.length);
 if(!rows.length){el('p','Aucun résultat de module pour le moment.',p,'muted');return}
 const box=el('div','',p,'table-box flat');const tb=el('table','',box,'stats');
 const hr=el('tr','',el('thead','',tb));el('th','Date',hr);el('th','Module',hr);el('th','Épreuve',hr);el('th','Résultat',hr,'num');
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
 if(typeof renderClassBoard!=='function'){el('p','Le module tableau n’a pas pu se charger. Rechargez la page.',view,'notice');return}
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

// ---------- Import PRONOTE ----------
function importPanel(){
 const box=el('details','',view,'import');el('summary','Importer un trombinoscope PRONOTE (PDF)',box);
 const f=el('div','',box,'fields');
 const target=select(el('label','Classe de destination',f),data.classes.map(c=>[c.id,label(c)]));if(classFilter)target.value=classFilter;
 const picker=el('input','',el('label','Fichier PDF',f));picker.type='file';picker.accept='application/pdf';
 const preview=el('div','',box);
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
    const selected=rows.filter(r=>r.include.checked).map(r=>({first:r.first.value.trim(),last:r.last.value.trim(),photo:r.photo,classId,id:crypto.randomUUID()}));
    if(selected.some(r=>!r.first||!r.last)){notify('Complétez le prénom et le nom de chaque fiche incluse.');return}
    const identity=r=>JSON.stringify([r.classId,r.first.trim().toLowerCase(),r.last.trim().toLowerCase()]);
    const known=new Set(data.students.map(identity));const fresh=selected.filter(r=>{const key=identity(r);if(known.has(key))return false;known.add(key);return true});
    await transaction('students',t=>fresh.forEach(r=>t.objectStore('students').add(r)));await load();render();
    const dup=selected.length-fresh.length;notify(plural(fresh.length,'fiche ajoutée','fiches ajoutées')+', '+plural(dup,'doublon ignoré','doublons ignorés')+'.');
   };
  }catch{el('p','Lecture impossible. Vérifiez le format du PDF.',preview,'notice')}finally{picker.disabled=false}
 };
}

// ---------- Démarrage ----------
window.onunhandledrejection=()=>notify('Opération interrompue. Vérifiez le stockage disponible.');
search.oninput=()=>render();
window.onhashchange=()=>{search.value='';render();window.scrollTo(0,0)};
await load();await migrateAttendance();render();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
