// ---------- Structure de l'application ----------
const pages={home:'Tableau de bord',years:'Années scolaires',classes:'Classes',students:'Élèves',groups:'Groupes',cycles:'Cycles',sessions:'Séances',attendance:'Appel',restrictions:'Inaptitudes',grades:'Évaluations',comments:'Appréciations',observations:'Observations',backup:'Sauvegardes'};
const navGroups=[
 ['Quotidien',['home','sessions','attendance']],
 ['Mes élèves',['classes','students','groups','cycles','restrictions','years']],
 ['Suivi',['grades','comments','observations','backup']]
];
const icons={
 home:'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
 sessions:'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4',
 attendance:'M4 12l5 5L20 6',
 years:'M12 3v18M5 7h14M5 17h14',
 classes:'M4 5h16v14H4zM4 10h16M10 10v9',
 students:'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-4 3-6 7-6s7 2 7 6M17 11a3 3 0 1 0 0-6M22 21c0-3-2-5-5-5.5',
 groups:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
 cycles:'M21 12a9 9 0 1 1-3-6.7M21 4v5h-5',
 restrictions:'M12 3l9 16H3zM12 10v4M12 17v.5',
 grades:'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z',
 comments:'M4 5h16v11H8l-4 4z',
 observations:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
 backup:'M12 4v11M7 10l5 5 5-5M5 20h14'
};
const stores=['years','classes','students','groups','cycles','sessions','attendance','restrictions','grades','comments','observations'];
const fields={
 years:[['name','Année scolaire'],['start','Début','date'],['end','Fin','date']],
 classes:[['year','Année','years'],['name','Nom de la classe']],
 students:[['classId','Classe','classes'],['first','Prénom'],['last','Nom']],
 groups:[['classId','Classe','classes'],['name','Nom du groupe']],
 cycles:[['classId','Classe','classes'],['name','Activité / cycle'],['goal','Objectif']],
 sessions:[['classId','Classe','classes'],['date','Date','date'],['name','Contenu de séance']],
 restrictions:[['student','Élève','students'],['start','Début','date'],['end','Fin','date'],['name','Adaptation de pratique']],
 grades:[['student','Élève','students'],['name','Épreuve'],['grade','Note sur 20','number']],
 comments:[['student','Élève','students'],['name','Appréciation']],
 observations:[['student','Élève','students'],['name','Observation']]
};
const statuses=['Non renseigné','Présent','Absent','En retard','Excusé'];
const statusKey={'Non renseigné':'?','Présent':'P','Absent':'A','En retard':'R','Excusé':'E'};
const statusColor={'Présent':'var(--primary)','Absent':'var(--danger)','En retard':'var(--late)','Excusé':'var(--excused)'};

// ---------- Données locales (IndexedDB) ----------
const db=await new Promise((ok,no)=>{const r=indexedDB.open('eps-manager',1);r.onupgradeneeded=()=>{for(const k of stores)r.result.createObjectStore(k,{keyPath:'id'})};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
const data={};
async function load(){await Promise.all(stores.map(k=>new Promise((ok,no)=>{const r=db.transaction(k).objectStore(k).getAll();r.onsuccess=()=>{data[k]=r.result;ok()};r.onerror=()=>no(r.error)})))}
function transaction(names,fn){return new Promise((ok,no)=>{const t=db.transaction(names,'readwrite');t.oncomplete=ok;t.onabort=()=>no(t.error);try{fn(t)}catch(e){t.abort();no(e)}})}
async function save(k,row){await transaction(k,t=>t.objectStore(k).put(row));await load();render();notify('Enregistré sur cet appareil.')}

// ---------- Utilitaires d'affichage ----------
const view=document.querySelector('#view'),toast=document.querySelector('[role=status]'),search=document.querySelector('.search input');
const svgNS='http://www.w3.org/2000/svg';
function el(tag,text,parent,cls){const n=document.createElement(tag);if(text!=null&&text!=='')n.textContent=text;if(cls)n.className=cls;parent?.append(n);return n}
function icon(name,parent){const s=document.createElementNS(svgNS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');const p=document.createElementNS(svgNS,'path');p.setAttribute('d',icons[name]);s.append(p);parent.append(s);return s}
function link(parent,href,text,cls){const a=el('a',text,parent,cls);a.href='#'+href;return a}
const label=r=>r?.name||[r?.first,r?.last].filter(Boolean).join(' ');
const find=(k,id)=>data[k]?.find(r=>r.id===id);
const ref=(k,id)=>label(find(k,id));
function select(parent,items,placeholder){const s=el('select','',parent);if(placeholder)s.add(new Option(placeholder,''));for(const [id,name] of items)s.add(new Option(name,id));return s}
const today=()=>new Date().toLocaleDateString('sv-SE');
const fmtDate=d=>{if(!d)return '';const x=new Date(d+'T12:00');return isNaN(x)?d:new Intl.DateTimeFormat('fr',{weekday:'short',day:'numeric',month:'short'}).format(x)};
const plural=(n,w)=>n+' '+w+(n>1?'s':'');
function tint(id){let h=0;for(const c of id||'')h=(h*31+c.charCodeAt(0))>>>0;return h%5}
function avatar(student,parent){
 if(student?.photo?.startsWith('data:image/jpeg;base64,')){const img=el('img','',parent,'avatar');img.src=student.photo;img.alt='';return img}
 return el('span',((student?.first||'?')[0]+(student?.last||'')[0]||'').toUpperCase(),parent,'avatar t'+tint(student?.id));
}
let toastTimer;
function notify(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3200)}
function panel(parent,title,more){const p=el('section','',parent,'panel');const h=el('div','',p,'panel-head');el('h2',title,h);if(more)link(h,more[0],more[1],'link');return p}
function lastBackup(){try{return localStorage.getItem('eps-last-backup')}catch{return null}}

// ---------- Indicateurs ----------
const activeRestrictions=()=>data.restrictions.filter(r=>r.start<=today()&&r.end>=today());
const restrictedIds=()=>new Set(activeRestrictions().map(r=>r.student));
const pupilsOf=classId=>data.students.filter(s=>s.classId===classId).sort((a,b)=>(a.last+a.first).localeCompare(b.last+b.first,'fr'));
function missingAttendance(session){const filled=new Set(data.attendance.filter(a=>a.sessionId===session.id&&a.status!=='Non renseigné').map(a=>a.student));return pupilsOf(session.classId).filter(p=>!filled.has(p.id)).length}
const pendingCalls=()=>data.sessions.filter(s=>s.date<=today()&&missingAttendance(s)>0);
function repeatedAbsences(){
 const out=[];
 for(const c of data.classes){
  const last=data.sessions.filter(s=>s.classId===c.id&&s.date<=today()).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
  if(last.length<3)continue;
  for(const p of pupilsOf(c.id)){const n=last.filter(s=>data.attendance.find(a=>a.id===s.id+'/'+p.id)?.status==='Absent').length;if(n>=3)out.push({p,n,of:last.length})}
 }
 return out;
}

// ---------- Navigation ----------
const nav=document.querySelector('nav');
function buildNav(){
 nav.replaceChildren();
 const badges={restrictions:activeRestrictions().length,attendance:pendingCalls().length};
 for(const [title,keys] of navGroups){
  const g=el('div','',nav,'nav-group');el('span',title,g);
  for(const k of keys){const a=link(g,k,'');icon(k,a);el('span',pages[k],a,'label');if(badges[k])el('span',badges[k],a,'badge').setAttribute('aria-label',badges[k]+' à traiter')}
 }
}
document.querySelector('time').textContent=new Intl.DateTimeFormat('fr',{dateStyle:'full'}).format(new Date());

// ---------- Rendu ----------
let sessionId='',classFilter='';
function render(){
 let k=location.hash.slice(1);if(!(k in pages))k='home';
 buildNav();
 for(const a of nav.querySelectorAll('a'))a.setAttribute('aria-current',a.hash==='#'+k?'page':'false');
 view.replaceChildren();
 const q=search.value.trim();
 if(q){document.querySelector('h1').textContent='Recherche';return renderSearch(q)}
 document.querySelector('h1').textContent=pages[k];
 document.title=pages[k]+' · EPS Manager';
 ({home:renderHome,attendance:renderAttendance,backup:renderBackup}[k]||renderList)(k);
}

function renderHome(){
 if(!data.years.length){
  const p=panel(view,'Bienvenue');
  el('p','Commencez par créer une année scolaire, puis vos classes et vos élèves. Tout reste enregistré sur cette tablette.',p,'muted');
  link(p,'years','Créer la première année scolaire →','btn primary').style.alignSelf='start';
  return;
 }
 const t=today(),d=new Date(),monday=new Date(d);monday.setDate(d.getDate()-((d.getDay()+6)%7));
 const sunday=new Date(monday);sunday.setDate(monday.getDate()+6);
 const [ws,we]=[monday,sunday].map(x=>x.toLocaleDateString('sv-SE'));
 const week=data.sessions.filter(s=>s.date>=ws&&s.date<=we);
 const calls=pendingCalls(),backup=lastBackup();
 const days=backup?Math.floor((Date.now()-new Date(backup))/864e5):null;

 const kpis=el('div','',view,'kpis');
 const kpi=(href,title,value,sub,alert)=>{const a=link(kpis,href,'','kpi'+(alert?' alert':''));el('span',title,a);el('b',value,a);el('small',sub,a)};
 kpi('sessions','Séances cette semaine',week.length,week.filter(s=>s.date===t).length+' aujourd’hui');
 kpi('attendance','Appels à compléter',calls.length,calls[0]?ref('classes',calls[0].classId)+' · '+fmtDate(calls[0].date):'Tout est à jour',calls.length>0);
 kpi('students','Élèves suivis',data.students.length,plural(data.classes.length,'classe'));
 kpi('backup','Dernière sauvegarde',days==null?'Jamais':days===0?'Aujourd’hui':'Il y a '+days+' j',days==null||days>7?'Pensez à exporter':'Données protégées',days==null||days>7);

 const grid=el('div','',view,'grid');
 const p1=panel(grid,'Prochaines séances',['sessions','Planning →']);
 const upcoming=data.sessions.filter(s=>s.date>=t).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);
 for(const s of upcoming){
  const r=el('a','',p1,'row'+(s.date===t?' highlight':''));r.href='#attendance';r.style.textDecoration='none';r.style.color='inherit';
  r.onclick=()=>{sessionId=s.id};
  el('span',s.date===t?'Auj.':fmtDate(s.date),r,'time');
  const b=el('div','',r,'body');el('span',ref('classes',s.classId)+' · '+s.name,b,'title');
  const cycle=data.cycles.filter(c=>c.classId===s.classId).at(-1);el('span',plural(pupilsOf(s.classId).length,'élève')+(cycle?' · '+cycle.name:''),b,'meta');
  if(s.date===t)el('span',missingAttendance(s)?'Faire l’appel':'Appel fait',r,'tag now');
 }
 if(!upcoming.length){el('p','Aucune séance programmée.',p1,'empty');link(p1,'sessions','Planifier une séance →','link')}

 const p2=panel(grid,'À surveiller');
 let n=0;
 for(const r of activeRestrictions()){const s=find('students',r.student);if(!s)continue;n++;alertRow(p2,s,'Inaptitude jusqu’au '+fmtDate(r.end)+' · '+r.name,'restrictions')}
 for(const {p,n:a,of} of repeatedAbsences()){n++;alertRow(p2,p,a+' absences sur les '+of+' dernières séances','attendance')}
 for(const s of calls.filter(s=>s.date<t).slice(0,3)){n++;const r=el('div','',p2,'row');el('span','!',r,'avatar t2');const b=el('div','',r,'body');el('span','Appel incomplet · '+ref('classes',s.classId),b,'title');el('span',fmtDate(s.date)+' · '+plural(missingAttendance(s),'élève')+' sans statut',b,'meta');const a=link(r,'attendance','Compléter','btn small');a.onclick=()=>{sessionId=s.id}}
 if(!n)el('p','Rien à signaler pour le moment.',p2,'empty');

 if(data.classes.length){
  el('h2','Mes classes',view,'section-title');
  const cards=el('div','',view,'list');
  for(const c of data.classes){
   const a=link(cards,'students','','class-card');a.onclick=()=>{classFilter=c.id};
   const top=el('div','',a,'top');el('strong',c.name,top);el('span',plural(pupilsOf(c.id).length,'élève'),top,'muted');
   const cycle=data.cycles.filter(x=>x.classId===c.id).at(-1);el('span',cycle?cycle.name:'Aucun cycle en cours',a).style.fontWeight='600';
   const all=data.sessions.filter(s=>s.classId===c.id),done=all.filter(s=>s.date<=t).length;
   const bar=el('div','',a,'progress');el('i','',bar).style.width=(all.length?Math.round(done/all.length*100):0)+'%';
   el('span',all.length?'Séance '+done+' sur '+all.length:'Aucune séance planifiée',a,'muted');
  }
 }
}
function alertRow(parent,student,text,href){const r=el('div','',parent,'row');avatar(student,r);const b=el('div','',r,'body');el('span',label(student)+' · '+ref('classes',student.classId),b,'title');el('span',text,b,'meta');link(r,href,'Voir','btn small')}

function renderAttendance(){
 if(!data.sessions.length){el('p','Aucune séance pour le moment.',view,'empty');link(view,'sessions','Créer une séance pour faire l’appel →','btn primary').style.alignSelf='start';return}
 const sorted=data.sessions.slice().sort((a,b)=>b.date.localeCompare(a.date));
 if(!sorted.some(r=>r.id===sessionId))sessionId=(sorted.find(s=>s.date===today())||sorted.find(s=>s.date<=today())||sorted.at(-1)).id;
 const session=find('sessions',sessionId),pupils=pupilsOf(session.classId),restricted=restrictedIds();
 const head=el('div','',view,'panel attendance-head');
 const s=select(el('label','Séance',head),sorted.map(r=>[r.id,fmtDate(r.date)+' · '+ref('classes',r.classId)+' · '+r.name]));
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
  const paint=()=>{const st=statusOf(p);b.dataset.s=st;stEl.textContent=statusKey[st];b.setAttribute('aria-label',label(p)+' : '+st)};
  avatar(p,b);el('span',p.first,b);el('span',p.last,b,'last');const stEl=el('span','',b,'st');
  if(restricted.has(p.id)){const i=el('span','!',b,'inapt');i.title='Inaptitude en cours'}
  paint();
  b.onclick=async()=>{
   const id=sessionId+'/'+p.id,row={id,sessionId,student:p.id,status:statuses[(statuses.indexOf(statusOf(p))+1)%statuses.length]};
   try{await transaction('attendance',t=>t.objectStore('attendance').put(row));const i=data.attendance.findIndex(a=>a.id===id);if(i<0)data.attendance.push(row);else data.attendance[i]=row;paint();refresh();buildNav();markNav()}catch{notify('Enregistrement impossible.')}
  };
 }
 refresh();
 const actions=el('div','',view,'actions');
 el('button','Tous les autres présents',actions,'primary').onclick=async()=>{
  const rows=pupils.filter(p=>statusOf(p)==='Non renseigné').map(p=>({id:sessionId+'/'+p.id,sessionId,student:p.id,status:'Présent'}));
  if(!rows.length)return notify('Tous les élèves ont déjà un statut.');
  await transaction('attendance',t=>rows.forEach(r=>t.objectStore('attendance').put(r)));await load();render();notify(plural(rows.length,'élève')+' marqué'+(rows.length>1?'s':'')+' présent'+(rows.length>1?'s':'')+'.');
 };
}
function markNav(){for(const a of nav.querySelectorAll('a'))a.setAttribute('aria-current',a.hash===location.hash||(!location.hash&&a.hash==='#home')?'page':'false')}

function renderBackup(){
 const p=panel(view,'Exporter');
 el('p','La sauvegarde JSON contient les données en clair (noms, notes, inaptitudes). Conservez-la dans un emplacement protégé.',p,'notice');
 const b=lastBackup();el('p',b?'Dernière sauvegarde : '+new Intl.DateTimeFormat('fr',{dateStyle:'long',timeStyle:'short'}).format(new Date(b)):'Aucune sauvegarde exportée depuis cet appareil.',p,'muted');
 const btn=el('button','Exporter la sauvegarde',p,'primary');btn.style.alignSelf='start';
 btn.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({version:1,data})],{type:'application/json'}));a.download='eps-manager-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);try{localStorage.setItem('eps-last-backup',new Date().toISOString())}catch{}render();notify('Sauvegarde exportée.')};
 const r=panel(view,'Restaurer');
 el('p','La restauration remplace toutes les données de cet appareil.',r,'muted');
 const input=el('input','',el('label','Fichier de sauvegarde (.json)',r));input.type='file';input.accept='.json,application/json';
 input.onchange=async()=>{try{const b=JSON.parse(await input.files[0].text());if(b.version!==1||!Object.keys(data).every(key=>Array.isArray(b.data[key])&&b.data[key].every(r=>r&&typeof r.id==='string'&&Object.values(r).every(v=>typeof v==='string'))))throw Error();if(!confirm('Remplacer toutes les données locales par cette sauvegarde ?'))return;await transaction(Object.keys(data),t=>{for(const key of Object.keys(data)){const st=t.objectStore(key);st.clear();b.data[key].forEach(r=>st.add(r))}});await load();render();notify('Sauvegarde restaurée.')}catch{notify('Restauration impossible. Vérifiez le fichier.')}};
}

function renderList(k){
 if(k==='students'&&data.classes.length)importPanel();
 const p=panel(view,'Ajouter');
 const form=el('form','',p,'add');
 for(const [key,title,type] of fields[k]){
  const l=el('label',title,form);let input;
  if(data[type]){
   const options=type==='students'&&classFilter?data.students.filter(r=>r.classId===classFilter):data[type];
   input=select(l,options.map(r=>[r.id,type==='students'?label(r)+' · '+ref('classes',r.classId):label(r)]));
   if(type==='classes'&&classFilter)input.value=classFilter;
   if(!data[type].length)link(l,type,'Ajouter d’abord '+pages[type].toLowerCase()+' →','inline-link');
  }else{input=el('input','',l);input.type=type||'text';if(type==='number'){input.min=0;input.max=20;input.step='any';input.inputMode='decimal'}if(type==='date'&&key!=='end')input.value=today()}
  input.required=true;input.name=key;
 }
 el('button','Ajouter',form,'primary');
 form.onsubmit=e=>{e.preventDefault();const row=Object.fromEntries(new FormData(form));if(row.end&&row.end<row.start){notify('La fin doit suivre le début.');return}save(k,{...row,id:crypto.randomUUID()})};

 const byClass=fields[k].some(f=>f[2]==='classes'&&k!=='classes'),byStudent=fields[k].some(f=>f[2]==='students');
 let rows=data[k].slice();
 const head=el('div','',view,'panel-head');
 if((byClass||byStudent)&&data.classes.length){
  const f=el('div','',head,'filters');const s=select(el('label','Filtrer par classe',f),data.classes.map(c=>[c.id,c.name]),'Toutes les classes');
  if(!data.classes.some(c=>c.id===classFilter))classFilter='';s.value=classFilter;s.onchange=()=>{classFilter=s.value;render()};
  if(classFilter)rows=rows.filter(r=>byClass?r.classId===classFilter:find('students',r.student)?.classId===classFilter);
 }
 el('h2',pages[k]+' · '+rows.length,head,'section-title').style.order=-1;
 if(k==='students')rows.sort((a,b)=>(a.last+a.first).localeCompare(b.last+b.first,'fr'));
 else if(rows[0]?.date||rows[0]?.start)rows.sort((a,b)=>(b.date||b.start).localeCompare(a.date||a.start));
 if(!rows.length){el('p','Rien pour le moment. Utilisez le formulaire ci-dessus pour commencer.',view,'empty');return}
 const list=el('div','',view,'list');
 for(const row of rows)renderItem(k,row,list);
}

function renderItem(k,row,list){
 const item=el('article','',list,'item');
 const student=k==='students'?row:row.student?find('students',row.student):null;
 if(student)avatar(student,item);else{const i=el('span','',item,'avatar');icon(k,i)}
 const b=el('div','',item,'body');
 const t=today();
 const parts={
  years:[row.name,fmtDate(row.start)+' → '+fmtDate(row.end)],
  classes:[row.name,ref('years',row.year)+' · '+plural(pupilsOf(row.id).length,'élève')],
  students:[label(row),ref('classes',row.classId)],
  groups:[row.name,ref('classes',row.classId)],
  cycles:[row.name,ref('classes',row.classId)+(row.goal?' · '+row.goal:'')],
  sessions:[ref('classes',row.classId)+' · '+row.name,fmtDate(row.date)],
  restrictions:[label(student),fmtDate(row.start)+' → '+fmtDate(row.end)+' · '+row.name],
  grades:[label(student),row.name+' · '+ref('classes',student?.classId)],
  comments:[label(student),row.name],
  observations:[label(student),row.name]
 }[k];
 el('span',parts[0]||'Élève supprimé',b,'title');el('span',parts[1],b,'meta');
 if(k==='grades'){const g=el('span',String(row.grade).replace('.',','),item,'grade');el('small',' /20',g)}
 if(k==='restrictions'&&row.start<=t&&row.end>=t)el('span','En cours',item,'tag warn');
 if(k==='sessions'&&row.date===t)el('span','Aujourd’hui',item,'tag now');
 if(k==='sessions'&&row.date<=t){const a=link(item,'attendance','Appel','btn small');a.onclick=()=>{sessionId=row.id}}
 if(k==='students'&&restrictedIds().has(row.id))el('span','Inaptitude',item,'tag warn');
}

function renderSearch(q){
 const norm=s=>(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
 const n=norm(q),hits=[];
 for(const s of data.students)if(norm(label(s)+' '+s.last+' '+s.first).includes(n))hits.push(['students',s,label(s),ref('classes',s.classId)]);
 for(const c of data.classes)if(norm(c.name).includes(n))hits.push(['classes',c,c.name,plural(pupilsOf(c.id).length,'élève')]);
 for(const s of data.sessions)if(norm(s.name+' '+ref('classes',s.classId)).includes(n))hits.push(['sessions',s,ref('classes',s.classId)+' · '+s.name,fmtDate(s.date)]);
 for(const c of data.cycles)if(norm(c.name).includes(n))hits.push(['cycles',c,c.name,ref('classes',c.classId)]);
 el('p',plural(hits.length,'résultat')+' pour « '+q+' »',view,'muted');
 const list=el('div','',view,'list');
 for(const [k,row,title,meta] of hits.slice(0,60)){
  const a=link(list,k,'','item');a.style.textDecoration='none';a.style.color='inherit';
  a.onclick=()=>{search.value='';if(row.classId||k==='classes')classFilter=k==='classes'?row.id:row.classId;if(location.hash==='#'+k)queueMicrotask(render)};
  if(k==='students')avatar(row,a);else{const i=el('span','',a,'avatar');icon(k,i)}
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
    await transaction('students',t=>fresh.forEach(r=>t.objectStore('students').add(r)));await load();render();notify(plural(fresh.length,'fiche')+' ajoutée'+(fresh.length>1?'s':'')+', '+plural(selected.length-fresh.length,'doublon')+' ignoré'+(selected.length-fresh.length>1?'s':'')+'.');
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
