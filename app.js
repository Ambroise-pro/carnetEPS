// ---------- Structure de l'application ----------
const pages={home:'Tableau de bord',calendar:'Calendrier',sessions:'Séances',attendance:'Appel',classes:'Classes',students:'Élèves',groups:'Groupes',cycles:'Cycles',restrictions:'Inaptitudes',grades:'Évaluations',comments:'Appréciations',observations:'Observations',planning:'Paramètres du calendrier',years:'Années scolaires',backup:'Sauvegardes'};
const navLabels={planning:'Emploi du temps'};
const navGroups=[
 ['Quotidien',['home','calendar','sessions','attendance']],
 ['Mes élèves',['classes','students','groups','cycles','restrictions']],
 ['Suivi',['grades','comments','observations']],
 ['Réglages',['planning','years','backup']]
];
const icons={
 home:'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
 calendar:'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2',
 sessions:'M5 4h14v16H5zM9 9h6M9 13h6M9 17h3',
 attendance:'M4 12l5 5L20 6',
 planning:'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M16 4v4M10 10v4M18 16v4',
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
 timetable:'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
 holidays:'M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5L19 5M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
 edit:'M4 20h4L19 9l-4-4L4 16z',
 trash:'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
 close:'M6 6l12 12M18 6L6 18',
 prev:'M15 6l-6 6 6 6',
 next:'M9 6l6 6-6 6'
};
const stores=['years','classes','students','groups','cycles','sessions','attendance','restrictions','grades','comments','observations','holidays','timetable'];
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
 cycles:[['classId','Classe','classes'],['name','Activité / cycle'],['goal','Objectif']],
 sessions:[['classId','Classe','classes'],['date','Date','date'],['time','Heure de début','time'],['duration','Durée','duration','110'],['name','Contenu de séance']],
 restrictions:[['student','Élève','students'],['start','Début','date'],['end','Fin','date'],['name','Adaptation de pratique']],
 grades:[['student','Élève','students'],['name','Épreuve'],['grade','Note sur 20','number']],
 comments:[['student','Élève','students'],['name','Appréciation']],
 observations:[['student','Élève','students'],['name','Observation']],
 timetable:[['year','Année','years'],['classId','Classe','classes'],['weekday','Jour','weekday','1'],['time','Heure de début','time','08:00'],['duration','Durée','duration','110'],['freq','Fréquence','freq','all'],['name','Intitulé','text','EPS']],
 holidays:[['year','Année','years'],['name','Vacances'],['start','Premier jour','date'],['end','Dernier jour','date']]
};
const addTitles={timetable:'Ajouter un cours',holidays:'Ajouter une période de vacances',sessions:'Ajouter une séance ponctuelle'};
const listTitles={timetable:'Cours',holidays:'Périodes'};
const nouns={years:['année','années'],classes:['classe','classes'],students:['élève','élèves'],groups:['groupe','groupes'],cycles:['cycle','cycles'],sessions:['séance','séances'],restrictions:['inaptitude','inaptitudes'],grades:['note','notes'],comments:['appréciation','appréciations'],observations:['observation','observations'],timetable:['cours de l’emploi du temps','cours de l’emploi du temps'],holidays:['période de vacances','périodes de vacances'],attendance:['présence','présences']};
const deps={years:[['classes','year'],['holidays','year'],['timetable','year']],classes:[['students','classId'],['groups','classId'],['cycles','classId'],['sessions','classId'],['timetable','classId']],students:[['restrictions','student'],['grades','student'],['comments','student'],['observations','student'],['attendance','student']],sessions:[['attendance','sessionId']]};
const statuses=['Non renseigné','Présent','Absent','En retard','Excusé'];
const statusKey={'Non renseigné':'?','Présent':'P','Absent':'A','En retard':'R','Excusé':'E'};
const statusColor={'Présent':'var(--primary)','Absent':'var(--danger)','En retard':'var(--late)','Excusé':'var(--excused)'};

// ---------- Données locales (IndexedDB) ----------
const db=await new Promise((ok,no)=>{const r=indexedDB.open('eps-manager',2);r.onupgradeneeded=()=>{for(const k of stores)if(!r.result.objectStoreNames.contains(k))r.result.createObjectStore(k,{keyPath:'id'})};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
const data={};
async function load(){await Promise.all(stores.map(k=>new Promise((ok,no)=>{const r=db.transaction(k).objectStore(k).getAll();r.onsuccess=()=>{data[k]=r.result;ok()};r.onerror=()=>no(r.error)})))}
function transaction(names,fn){return new Promise((ok,no)=>{const t=db.transaction(names,'readwrite');t.oncomplete=ok;t.onabort=()=>no(t.error);try{fn(t)}catch(e){t.abort();no(e)}})}

// ---------- Utilitaires ----------
const view=document.querySelector('#view'),toast=document.querySelector('[role=status]'),search=document.querySelector('.search input');
const svgNS='http://www.w3.org/2000/svg';
function el(tag,text,parent,cls){const n=document.createElement(tag);if(text!=null&&text!=='')n.textContent=text;if(cls)n.className=cls;parent?.append(n);return n}
function icon(name,parent){const s=document.createElementNS(svgNS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');const p=document.createElementNS(svgNS,'path');p.setAttribute('d',icons[name]);s.append(p);parent.append(s);return s}
function iconButton(name,text,parent,cls){const b=el('button','',parent,'icon-btn'+(cls?' '+cls:''));b.type='button';icon(name,b);b.setAttribute('aria-label',text);b.title=text;return b}
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
const toMin=t=>{const [h,m]=(t||'').split(':').map(Number);return h*60+(m||0)};
const fromMin=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
const hh=t=>t?t.replace(':','h'):'';
const endOf=s=>s.time?fromMin(toMin(s.time)+Number(s.duration||0)):'';
const timeRange=s=>s.time?hh(s.time)+(s.duration?' – '+hh(endOf(s)):''):'';
const sortKey=r=>(r.date||r.start||'')+(r.time||'');
const byDate=(a,b)=>sortKey(a).localeCompare(sortKey(b));
const isStarted=s=>s.date<today()||(s.date===today()&&(!s.time||toMin(s.time)<=nowMin()));
const isNow=s=>s.date===today()&&s.time&&toMin(s.time)<=nowMin()&&nowMin()<toMin(s.time)+Number(s.duration||0);
function tint(id){let h=0;for(const c of id||'')h=(h*31+c.charCodeAt(0))>>>0;return h%5}
function avatar(student,parent){
 if(student?.photo?.startsWith('data:image/jpeg;base64,')){const img=el('img','',parent,'avatar');img.src=student.photo;img.alt='';return img}
 return el('span',((student?.first||'?')[0]+((student?.last||'')[0]||'')).toUpperCase(),parent,'avatar t'+tint(student?.id));
}
let toastTimer;
function notify(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3600)}
function panel(parent,title,more){const p=el('section','',parent,'panel');const h=el('div','',p,'panel-head');el('h2',title,h);if(more)link(h,more[0],more[1],'link');return p}
function lastBackup(){try{return localStorage.getItem('eps-last-backup')}catch{return null}}
function needYear(){el('p','Créez d’abord une année scolaire.',view,'empty');link(view,'years','Créer une année scolaire →','btn primary').style.alignSelf='start'}

// ---------- Calendrier scolaire : vacances, semaines A/B, emploi du temps ----------
const holidayOf=s=>data.holidays.find(h=>h.start<=s&&h.end>=s);
const yearOf=s=>data.years.find(y=>y.start<=s&&y.end>=s);
function isSchoolWeek(monday,year){for(let i=0;i<6;i++){const d=addDays(monday,i);if(d>=year.start&&d<=year.end&&!holidayOf(d))return true}return false}
// L'alternance A/B avance d'un cran à chaque semaine de cours : les semaines de vacances ne comptent pas.
function weekType(s,memo){
 const monday=mondayOf(s);if(memo?.has(monday))return memo.get(monday);
 const y=yearOf(s)||yearOf(addDays(monday,4));let type=null;
 if(y){const first=y.firstWeek==='B'?'B':'A';let n=0;for(let m=mondayOf(y.start);m<monday;m=addDays(m,7))if(isSchoolWeek(m,y))n++;type=n%2===0?first:(first==='A'?'B':'A')}
 memo?.set(monday,type);return type;
}
const hasCall=id=>data.attendance.some(a=>a.sessionId===id&&a.status!=='Non renseigné');
// Crée, met à jour ou retire les séances futures issues de l'emploi du temps.
// Ne touche jamais aux séances passées, modifiées à la main ou dont l'appel est commencé.
async function syncSlots(){
 const t=today(),memo=new Map(),want=new Map();
 for(const slot of data.timetable){
  const y=find('years',slot.year);if(!y)continue;
  const skip=new Set((slot.skip||'').split(',').filter(Boolean));
  let d=t>y.start?t:y.start;
  while(weekdayOf(d)!==Number(slot.weekday)&&d<=y.end)d=addDays(d,1);
  for(;d<=y.end;d=addDays(d,7)){
   if(skip.has(d)||holidayOf(d))continue;
   if(slot.freq!=='all'&&weekType(d,memo)!==slot.freq)continue;
   want.set(slot.id+'@'+d,{id:slot.id+'@'+d,slot:slot.id,classId:slot.classId,date:d,time:slot.time,duration:slot.duration,name:slot.name||'EPS'});
  }
 }
 const removed=data.sessions.filter(s=>s.slot&&s.date>=t&&!want.has(s.id)&&!s.custom&&!hasCall(s.id)).map(s=>s.id);
 const put=[...want.values()].filter(row=>{const old=find('sessions',row.id);return !old?.custom&&!hasCall(row.id)&&JSON.stringify(old)!==JSON.stringify(row)});
 const added=put.filter(r=>!find('sessions',r.id)).length;
 if(removed.length||put.length){
  const gone=new Set(removed);
  await transaction(['sessions','attendance'],tx=>{removed.forEach(id=>tx.objectStore('sessions').delete(id));data.attendance.filter(a=>gone.has(a.sessionId)).forEach(a=>tx.objectStore('attendance').delete(a.id));put.forEach(r=>tx.objectStore('sessions').put(r))});
  await load();
 }
 return {added,removed:removed.length,total:data.sessions.filter(s=>s.slot&&s.date>=t).length};
}

// ---------- Indicateurs ----------
const activeRestrictions=()=>data.restrictions.filter(r=>r.start<=today()&&r.end>=today());
const restrictedIds=()=>new Set(activeRestrictions().map(r=>r.student));
const pupilsOf=classId=>data.students.filter(s=>s.classId===classId).sort((a,b)=>(a.last+a.first).localeCompare(b.last+b.first,'fr'));
function missingAttendance(session){const filled=new Set(data.attendance.filter(a=>a.sessionId===session.id&&a.status!=='Non renseigné').map(a=>a.student));return pupilsOf(session.classId).filter(p=>!filled.has(p.id)).length}
const pendingCalls=()=>data.sessions.filter(s=>isStarted(s)&&missingAttendance(s)>0).sort((a,b)=>byDate(b,a));
function repeatedAbsences(){
 const out=[];
 for(const c of data.classes){
  const last=data.sessions.filter(s=>s.classId===c.id&&isStarted(s)).sort((a,b)=>byDate(b,a)).slice(0,4);
  if(last.length<3)continue;
  for(const p of pupilsOf(c.id)){const n=last.filter(s=>data.attendance.find(a=>a.id===s.id+'/'+p.id)?.status==='Absent').length;if(n>=3)out.push({p,n,of:last.length})}
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

// ---------- Rendu ----------
let sessionId='',classFilter='',period='upcoming',calWeek='',editing={};
const collectionsOf=k=>k==='planning'?['timetable','holidays']:[k];
function render(){
 let k=location.hash.slice(1);if(!(k in pages))k='home';current=k;
 if(editing.k&&!collectionsOf(k).includes(editing.k))editing={};
 buildNav();
 view.replaceChildren();
 const q=search.value.trim();
 if(q){document.querySelector('h1').textContent='Recherche';return renderSearch(q)}
 document.querySelector('h1').textContent=pages[k];
 document.title=pages[k]+' · EPS Manager';
 ({home:renderHome,calendar:renderCalendar,planning:renderPlanning,attendance:renderAttendance,backup:renderBackup}[k]||renderList)(k);
}

function sessionRow(parent,s){
 const r=link(parent,'attendance','','row'+(s.date===today()?' highlight':''));r.onclick=()=>{sessionId=s.id};
 const tm=el('span','',r,'time');el('span',s.date===today()?'Auj.':fmtDate(s.date),tm);if(s.time)el('small',hh(s.time),tm);
 const b=el('div','',r,'body');el('span',ref('classes',s.classId)+' · '+s.name,b,'title');
 el('span',[timeRange(s),plural(pupilsOf(s.classId).length,'élève')].filter(Boolean).join(' · '),b,'meta');
 if(isNow(s))el('span','En cours',r,'tag now');else if(s.date===today())el('span',missingAttendance(s)?'Faire l’appel':'Appel fait',r,'tag');
}

function renderHome(){
 if(!data.years.length){
  const p=panel(view,'Bienvenue');
  el('p','Commencez par créer une année scolaire, puis vos classes et vos élèves. Renseignez ensuite votre emploi du temps et les vacances : toutes les séances de l’année seront créées automatiquement. Tout reste enregistré sur cette tablette.',p,'muted');
  link(p,'years','Créer la première année scolaire →','btn primary').style.alignSelf='start';
  return;
 }
 const t=today(),monday=mondayOf(t),saturday=addDays(monday,5);
 const week=data.sessions.filter(s=>s.date>=monday&&s.date<=saturday);
 const calls=pendingCalls(),backup=lastBackup();
 const days=backup?Math.floor((Date.now()-new Date(backup))/864e5):null;
 const wt=weekType(t),hol=holidayOf(t);

 const kpis=el('div','',view,'kpis');
 const kpi=(href,title,value,sub,alert)=>{const a=link(kpis,href,'','kpi'+(alert?' alert':''));el('span',title,a);el('b',value,a);el('small',sub,a)};
 kpi('calendar',hol?hol.name:'Séances cette semaine',hol?'Vacances':week.length,hol?'Jusqu’au '+fmtDate(hol.end):(wt?'Semaine '+wt+' · ':'')+week.filter(s=>s.date===t).length+' aujourd’hui');
 kpi('attendance','Appels à compléter',calls.length,calls[0]?ref('classes',calls[0].classId)+' · '+fmtDate(calls[0].date):'Tout est à jour',calls.length>0);
 kpi('students','Élèves suivis',data.students.length,plural(data.classes.length,'classe'));
 kpi('backup','Dernière sauvegarde',days==null?'Jamais':days===0?'Aujourd’hui':'Il y a '+days+' j',days==null||days>7?'Pensez à exporter':'Données protégées',days==null||days>7);

 const grid=el('div','',view,'grid');
 const p1=panel(grid,'Prochaines séances',['calendar','Calendrier →']);
 const upcoming=data.sessions.filter(s=>s.date>t||(s.date===t&&(!s.time||toMin(endOf(s))>nowMin()))).sort(byDate).slice(0,5);
 for(const s of upcoming)sessionRow(p1,s);
 if(!upcoming.length){el('p','Aucune séance programmée.',p1,'empty');link(p1,data.timetable.length?'sessions':'planning',data.timetable.length?'Ajouter une séance →':'Renseigner mon emploi du temps →','link')}

 const p2=panel(grid,'À surveiller');
 let n=0;
 for(const r of activeRestrictions()){const s=find('students',r.student);if(!s)continue;n++;alertRow(p2,s,'Inaptitude jusqu’au '+fmtDate(r.end)+' · '+r.name,'restrictions')}
 for(const {p,n:a,of} of repeatedAbsences()){n++;alertRow(p2,p,a+' absences sur les '+of+' dernières séances','attendance')}
 for(const s of calls.filter(s=>s.date<t).slice(0,3)){n++;const r=el('div','',p2,'row');el('span','!',r,'avatar t2');const b=el('div','',r,'body');el('span','Appel incomplet · '+ref('classes',s.classId),b,'title');el('span',fmtDate(s.date)+(s.time?' '+hh(s.time):'')+' · '+plural(missingAttendance(s),'élève')+' sans statut',b,'meta');const a=link(r,'attendance','Compléter','btn small');a.onclick=()=>{sessionId=s.id}}
 if(!n)el('p','Rien à signaler pour le moment.',p2,'empty');

 if(data.classes.length){
  el('h2','Mes classes',view,'section-title');
  const cards=el('div','',view,'list');
  for(const c of data.classes){
   const a=link(cards,'students','','class-card');a.onclick=()=>{classFilter=c.id};
   const top=el('div','',a,'top');el('strong',c.name,top);el('span',plural(pupilsOf(c.id).length,'élève'),top,'muted');
   const cycle=data.cycles.filter(x=>x.classId===c.id).at(-1);el('span',cycle?cycle.name:'Aucun cycle en cours',a).style.fontWeight='600';
   const all=data.sessions.filter(s=>s.classId===c.id),done=all.filter(isStarted).length;
   const bar=el('div','',a,'progress');el('i','',bar).style.width=(all.length?Math.round(done/all.length*100):0)+'%';
   el('span',all.length?'Séance '+done+' sur '+all.length:'Aucune séance planifiée',a,'muted');
  }
 }
}
function alertRow(parent,student,text,href){const r=el('div','',parent,'row');avatar(student,r);const b=el('div','',r,'body');el('span',label(student)+' · '+ref('classes',student.classId),b,'title');el('span',text,b,'meta');link(r,href,'Voir','btn small')}

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
 el('button','Aujourd’hui',navb,'small').onclick=()=>{calWeek=mondayOf(today());render()};
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
  for(const s of sessions.filter(s=>s.date===d&&!s.time))el('button',ref('classes',s.classId)+' · '+s.name,h,'chip c'+tint(s.classId)).onclick=()=>openSession(s);
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
   const ev=el('button','',col,'event c'+tint(s.classId)+(isStarted(s)&&!missingAttendance(s)?' done':''));
   ev.style.top=(st-startH*60)*PX+'px';ev.style.height=Math.max(30,(en-st)*PX-3)+'px';
   ev.style.left='calc('+(lane/lanes.length*100)+'% + 3px)';ev.style.width='calc('+(100/lanes.length)+'% - 6px)';
   el('span',timeRange(s),ev,'ev-time');el('strong',ref('classes',s.classId),ev);el('span',s.name,ev,'ev-name');
   ev.setAttribute('aria-label',ref('classes',s.classId)+', '+s.name+', '+fmtDate(s.date,{weekday:'long',day:'numeric',month:'long'})+' '+timeRange(s));
   ev.onclick=()=>openSession(s);
  }
  if(d===today()&&nowMin()>=startH*60&&nowMin()<=endH*60)el('span','',col,'now-line').style.top=(nowMin()-startH*60)*PX+'px';
 });
}

function openSession(s){
 const d=el('dialog','',document.body,'sheet');
 const head=el('div','',d,'panel-head');el('h2',ref('classes',s.classId)+' · '+s.name,head);
 iconButton('close','Fermer',head).onclick=()=>d.close();
 el('p',fmtDate(s.date,{weekday:'long',day:'numeric',month:'long'})+(s.time?' · '+timeRange(s):''),d,'muted');
 const slot=s.slot&&find('timetable',s.slot);
 el('p',slot?'Cours régulier · '+enumLabel('freq',slot.freq).toLowerCase()+(s.custom?' · modifié pour cette date':''):'Séance ponctuelle',d,'muted');
 const n=missingAttendance(s),total=pupilsOf(s.classId).length;
 if(total)el('p',n?plural(total-n,'élève renseigné','élèves renseignés')+' sur '+total:'Appel complet',d);
 const acts=el('div','',d,'actions');
 link(acts,'attendance','Faire l’appel','btn primary').onclick=()=>{sessionId=s.id;d.close()};
 const e=el('button','Modifier',acts);e.type='button';e.onclick=()=>{d.close();editing={k:'sessions',id:s.id};if(location.hash==='#sessions')render();else location.hash='#sessions'};
 const r=el('button','Supprimer',acts,'danger');r.type='button';r.onclick=async()=>{if(await remove('sessions',s.id))d.close()};
 d.onclose=()=>d.remove();d.showModal();
}

// ---------- Paramètres du calendrier ----------
function renderPlanning(){
 if(!data.years.length)return needYear();
 el('p','Saisissez vos cours une seule fois : les séances sont créées automatiquement jusqu’à la fin de l’année, à partir d’aujourd’hui, en sautant les vacances. Les séances passées, modifiées à la main ou dont l’appel est commencé ne sont jamais changées.',view,'muted');
 const p=panel(view,'Semaines A / B');
 el('p','Choisissez le type de la première semaine de cours. L’alternance saute ensuite les semaines de vacances.',p,'muted');
 const f=el('div','',p,'filters');
 for(const y of data.years){
  const s=select(el('label','Première semaine · '+y.name,f),[['A','Semaine A'],['B','Semaine B']]);s.value=y.firstWeek==='B'?'B':'A';
  s.onchange=async()=>{await transaction('years',t=>t.objectStore('years').put({...y,firstWeek:s.value}));await load();const r=await syncSlots();render();notify('Alternance mise à jour · '+plural(r.total,'séance future planifiée','séances futures planifiées')+'.')};
 }
 const wt=weekType(today());if(wt)el('p','Cette semaine est une semaine '+wt+'.',p).style.fontWeight='600';
 el('h2','Emploi du temps',view,'section-title big');
 renderCollection('timetable',view);
 el('h2','Vacances',view,'section-title big');
 renderCollection('holidays',view);
}

// ---------- Appel ----------
function defaultSession(){
 const t=today(),n=nowMin(),todays=data.sessions.filter(s=>s.date===t).sort(byDate);
 return todays.find(isNow)||todays.find(s=>s.time&&toMin(s.time)>n)||todays.at(-1)||data.sessions.filter(isStarted).sort((a,b)=>byDate(b,a))[0]||data.sessions.slice().sort(byDate)[0];
}
function renderAttendance(){
 if(!data.sessions.length){el('p','Aucune séance pour le moment.',view,'empty');link(view,'planning','Renseigner mon emploi du temps →','btn primary').style.alignSelf='start';return}
 if(!find('sessions',sessionId))sessionId=defaultSession().id;
 const limit=addDays(today(),7);
 const options=data.sessions.filter(s=>s.date<=limit||s.id===sessionId).sort((a,b)=>byDate(b,a)).slice(0,150);
 const session=find('sessions',sessionId),pupils=pupilsOf(session.classId),restricted=restrictedIds();
 const head=el('div','',view,'panel attendance-head');
 const s=select(el('label','Séance',head),options.map(r=>[r.id,fmtDate(r.date)+(r.time?' '+hh(r.time):'')+' · '+ref('classes',r.classId)+' · '+r.name]));
 s.value=sessionId;s.onchange=()=>{sessionId=s.value;render()};
 if(!pupils.length){el('p','Aucun élève dans cette classe.',view,'empty');link(view,'students','Ajouter des élèves →','link');return}
 const info=el('div','',head,'panel-head');const counter=el('strong','',info);el('span','Touchez un élève pour changer son statut',info,'muted');
 const bar=el('div','',head,'progress');const fill=el('i','',bar);
 const legend=el('div','',head,'legend');
 const statusOf=p=>data.attendance.find(a=>a.id===sessionId+'/'+p.id)?.status||'Non renseigné';
 function refresh(){
  const all=pupils.map(statusOf),done=all.filter(x=>x!=='Non renseigné').length;
  counter.textContent=done+' / '+pupils.length+' renseignés';fill.style.width=Math.round(done/pupils.length*100)+'%';
  legend.replaceChildren();for(const st of statuses.slice(1)){const sp=el('span','',legend);const d=el('span',statusKey[st],sp,'dot');d.style.background=statusColor[st];if(st==='En retard')d.style.color='var(--ink)';sp.append(st+' · '+all.filter(x=>x===st).length)}
 }
 const grid=el('div','',view,'pupils');
 for(const p of pupils){
  const b=el('button','',grid,'pupil');
  avatar(p,b);el('span',p.first,b);el('span',p.last,b,'last');const stEl=el('span','',b,'st');
  const paint=()=>{const st=statusOf(p);b.dataset.s=st;stEl.textContent=statusKey[st];b.setAttribute('aria-label',label(p)+' : '+st)};
  if(restricted.has(p.id))el('span','!',b,'inapt').title='Inaptitude en cours';
  paint();
  b.onclick=async()=>{
   const id=sessionId+'/'+p.id,row={id,sessionId,student:p.id,status:statuses[(statuses.indexOf(statusOf(p))+1)%statuses.length]};
   try{await transaction('attendance',t=>t.objectStore('attendance').put(row));const i=data.attendance.findIndex(a=>a.id===id);if(i<0)data.attendance.push(row);else data.attendance[i]=row;paint();refresh();buildNav()}catch{notify('Enregistrement impossible.')}
  };
 }
 refresh();
 const actions=el('div','',view,'actions');
 el('button','Tous les autres présents',actions,'primary').onclick=async()=>{
  const rows=pupils.filter(p=>statusOf(p)==='Non renseigné').map(p=>({id:sessionId+'/'+p.id,sessionId,student:p.id,status:'Présent'}));
  if(!rows.length)return notify('Tous les élèves ont déjà un statut.');
  await transaction('attendance',t=>rows.forEach(r=>t.objectStore('attendance').put(r)));await load();render();notify(plural(rows.length,'élève marqué présent','élèves marqués présents')+'.');
 };
}

// ---------- Sauvegardes ----------
function renderBackup(){
 const p=panel(view,'Exporter');
 el('p','La sauvegarde JSON contient les données en clair (noms, notes, inaptitudes). Conservez-la dans un emplacement protégé.',p,'notice');
 const b=lastBackup();el('p',b?'Dernière sauvegarde : '+new Intl.DateTimeFormat('fr',{dateStyle:'long',timeStyle:'short'}).format(new Date(b)):'Aucune sauvegarde exportée depuis cet appareil.',p,'muted');
 const btn=el('button','Exporter la sauvegarde',p,'primary');btn.style.alignSelf='start';
 btn.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({version:2,data})],{type:'application/json'}));a.download='eps-manager-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);try{localStorage.setItem('eps-last-backup',new Date().toISOString())}catch{}render();notify('Sauvegarde exportée.')};
 const r=panel(view,'Restaurer');
 el('p','La restauration remplace toutes les données de cet appareil.',r,'muted');
 const input=el('input','',el('label','Fichier de sauvegarde (.json)',r));input.type='file';input.accept='.json,application/json';
 input.onchange=async()=>{try{
  const b=JSON.parse(await input.files[0].text());
  if(![1,2].includes(b.version)||!b.data||typeof b.data!=='object')throw Error();
  for(const key of ['holidays','timetable'])b.data[key]??=[];
  if(!stores.every(key=>Array.isArray(b.data[key])&&b.data[key].every(r=>r&&typeof r.id==='string'&&Object.values(r).every(v=>typeof v==='string'))))throw Error();
  if(!confirm('Remplacer toutes les données locales par cette sauvegarde ?'))return;
  await transaction(stores,t=>{for(const key of stores){const st=t.objectStore(key);st.clear();b.data[key].forEach(r=>st.add(r))}});await load();render();notify('Sauvegarde restaurée.');
 }catch{notify('Restauration impossible. Vérifiez le fichier.')}};
}

// ---------- Listes génériques : ajout, modification, suppression ----------
function renderList(k){
 if(k==='students'&&data.classes.length)importPanel();
 if(k==='sessions'){const n=el('p','',view,'muted');n.append('Les séances régulières viennent de votre ');link(n,'planning','emploi du temps');n.append('. Ajoutez ici une séance ponctuelle (rattrapage, sortie, évaluation…).')}
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
   if(k==='holidays'&&key==='name'){input.setAttribute('list','holiday-names');const dl=el('datalist','',l);dl.id='holiday-names';for(const v of ['Toussaint','Noël','Hiver','Printemps','Pont de l’Ascension','Été'])dl.append(new Option(v))}
  }
  input.name=key;input.required=!(k==='sessions'&&key==='time');
  if(old&&old[key]!=null)input.value=old[key];
 }
 const btns=el('div','',form,'form-actions');
 el('button',old?'Enregistrer':'Ajouter',btns,'primary');
 if(old){const c=el('button','Annuler',btns);c.type='button';c.onclick=()=>{editing={};render()}}
 form.onsubmit=async e=>{
  e.preventDefault();const row=Object.fromEntries(new FormData(form));
  if(row.end&&row.end<row.start){notify('La fin doit suivre le début.');return}
  const rec={...old,...row,id:old?.id||crypto.randomUUID()};
  if(k==='sessions'&&old?.slot)rec.custom='1';
  editing={};
  await transaction(k,t=>t.objectStore(k).put(rec));await load();
  let msg=old?'Modifications enregistrées.':'Ajouté.';
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
 const h=el('h2',(listTitles[k]||pages[k])+' · '+rows.length,head,'section-title');h.style.order=-1;
 if(k==='students')rows.sort((a,b)=>(a.last+a.first).localeCompare(b.last+b.first,'fr'));
 else if(k==='timetable')rows.sort((a,b)=>(a.weekday+a.time).localeCompare(b.weekday+b.time));
 else if(k==='holidays'||(k==='sessions'&&period==='upcoming'))rows.sort(byDate);
 else if(rows[0]?.date||rows[0]?.start)rows.sort((a,b)=>byDate(b,a));
 if(!rows.length){el('p',k==='timetable'?'Aucun cours. Ajoutez votre premier créneau ci-dessus.':'Rien pour le moment. Utilisez le formulaire ci-dessus pour commencer.',parent,'empty');return}
 const list=el('div','',parent,'list');
 const shown=k==='sessions'?rows.slice(0,200):rows;
 for(const row of shown)renderItem(k,row,list);
 if(shown.length<rows.length)el('p',(rows.length-shown.length)+' séances supplémentaires : filtrez par classe ou par période.',parent,'muted');
}

function renderItem(k,row,list){
 const item=el('article','',list,'item'+(editing.k===k&&editing.id===row.id?' selected':''));
 const student=k==='students'?row:row.student?find('students',row.student):null;
 if(student)avatar(student,item);else icon(k,el('span','',item,'avatar'+(row.classId?' t'+tint(row.classId):'')));
 const b=el('div','',item,'body');
 const t=today();
 const days=r=>Math.round((new Date(r.end)-new Date(r.start))/864e5)+1;
 const parts={
  years:[row.name,fmtDate(row.start)+' → '+fmtDate(row.end)+' · 1re semaine '+(row.firstWeek==='B'?'B':'A')],
  classes:[row.name,ref('years',row.year)+' · '+plural(pupilsOf(row.id).length,'élève')],
  students:[label(row),ref('classes',row.classId)],
  groups:[row.name,ref('classes',row.classId)],
  cycles:[row.name,ref('classes',row.classId)+(row.goal?' · '+row.goal:'')],
  sessions:[ref('classes',row.classId)+' · '+row.name,[fmtDate(row.date),timeRange(row)].filter(Boolean).join(' · ')],
  restrictions:[label(student),fmtDate(row.start)+' → '+fmtDate(row.end)+' · '+row.name],
  grades:[label(student),row.name+' · '+ref('classes',student?.classId)],
  comments:[label(student),row.name],
  observations:[label(student),row.name],
  timetable:[enumLabel('weekday',row.weekday)+' · '+timeRange(row),ref('classes',row.classId)+' · '+row.name+' · '+enumLabel('duration',row.duration)],
  holidays:[row.name,fmtDate(row.start,{day:'numeric',month:'short'})+' → '+fmtDate(row.end,{day:'numeric',month:'short',year:'numeric'})+' · '+plural(days(row),'jour')]
 }[k];
 el('span',parts[0]||'Élément supprimé',b,'title');el('span',parts[1],b,'meta');
 if(k==='grades'){const g=el('span',String(row.grade).replace('.',','),item,'grade');el('small',' /20',g)}
 if(k==='timetable')el('span',row.freq==='all'?'Chaque semaine':enumLabel('freq',row.freq),b,'tag'+(row.freq==='all'?'':' now'));
 if((k==='holidays'||k==='restrictions')&&row.start<=t&&row.end>=t)el('span','En cours',b,'tag warn');
 if(k==='sessions'&&isNow(row))el('span','En cours',b,'tag now');
 if(k==='students'&&restrictedIds().has(row.id))el('span','Inaptitude',b,'tag warn');
 const acts=el('div','',item,'item-actions');
 if(k==='sessions'&&isStarted(row))link(acts,'attendance','Appel','btn small').onclick=()=>{sessionId=row.id};
 iconButton('edit','Modifier',acts).onclick=()=>{editing={k,id:row.id};render();const f=view.querySelector('.panel.editing');f?.scrollIntoView({behavior:'smooth',block:'start'});f?.querySelector('input,select')?.focus({preventScroll:true})};
 iconButton('trash','Supprimer',acts,'danger').onclick=()=>remove(k,row.id);
}

// Suppression avec cascade : retire aussi tout ce qui dépend de l'élément, après confirmation.
async function remove(k,id){
 const acc={};
 (function collect(key,rid){acc[key]??=new Set();if(acc[key].has(rid))return;acc[key].add(rid);for(const [dk,f] of deps[key]||[])for(const r of data[dk])if(r[f]===rid)collect(dk,r.id)})(k,id);
 const row=find(k,id);
 const name=k==='sessions'?ref('classes',row.classId)+' · '+row.name+' ('+fmtDate(row.date)+')':k==='timetable'?enumLabel('weekday',row.weekday)+' '+hh(row.time)+' · '+ref('classes',row.classId):label(row)||nouns[k][0];
 const also=Object.entries(acc).filter(([key,s])=>key!==k&&key!=='attendance'&&s.size).map(([key,s])=>plural(s.size,...nouns[key]));
 let msg='Supprimer « '+name+' » ?';
 if(also.length)msg+='\n\nCela supprimera aussi : '+also.join(', ')+(acc.attendance?.size?' et les présences associées':'')+'.';
 else if(acc.attendance?.size)msg+='\n\nLes présences associées seront aussi supprimées.';
 if(k==='timetable')msg+='\n\nLes séances futures de ce cours seront retirées (sauf celles modifiées à la main ou avec un appel).';
 if(!confirm(msg))return false;
 const slot=k==='sessions'&&row.slot&&find('timetable',row.slot);
 await transaction(Object.keys(acc).concat(slot?['timetable']:[]),t=>{
  for(const [key,s] of Object.entries(acc))for(const rid of s)t.objectStore(key).delete(rid);
  // Une séance régulière supprimée est mémorisée pour ne pas être recréée.
  if(slot){const date=row.id.split('@')[1]||row.date;t.objectStore('timetable').put({...slot,skip:[slot.skip,date].filter(Boolean).join(',')})}
 });
 if(editing.id&&acc[editing.k]?.has(editing.id))editing={};
 await load();
 if(['timetable','years','classes','holidays'].includes(k))await syncSlots();
 render();notify('Supprimé.');
 return true;
}

// ---------- Recherche ----------
function renderSearch(q){
 const norm=s=>(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
 const n=norm(q),hits=[],t=today();
 for(const s of data.students)if(norm(label(s)+' '+s.last+' '+s.first).includes(n))hits.push(['students',s,label(s),ref('classes',s.classId)]);
 for(const c of data.classes)if(norm(c.name).includes(n))hits.push(['classes',c,c.name,plural(pupilsOf(c.id).length,'élève')]);
 for(const c of data.cycles)if(norm(c.name).includes(n))hits.push(['cycles',c,c.name,ref('classes',c.classId)]);
 hits.push(...data.sessions.filter(s=>s.date>=t&&norm(s.name+' '+ref('classes',s.classId)).includes(n)).sort(byDate).slice(0,15).map(s=>['sessions',s,ref('classes',s.classId)+' · '+s.name,fmtDate(s.date)+(s.time?' '+hh(s.time):'')]));
 el('p',plural(hits.length,'résultat')+' pour « '+q+' »',view,'muted');
 const list=el('div','',view,'list');
 for(const [k,row,title,meta] of hits.slice(0,60)){
  const a=link(list,k==='sessions'?'attendance':k,'','item');
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
await load();render();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
