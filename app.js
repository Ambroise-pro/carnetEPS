const pages=['Tableau de bord','Années scolaires','Classes','Élèves','Groupes','Cycles','Séances','Appel','Inaptitudes','Évaluations','Appréciations','Observations','Sauvegardes'];
const keys=['home','years','classes','students','groups','cycles','sessions','attendance','restrictions','grades','comments','observations','backup'];
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
const db=await new Promise((ok,no)=>{const r=indexedDB.open('eps-manager',1);r.onupgradeneeded=()=>{for(const k of keys.slice(1,-1))r.result.createObjectStore(k,{keyPath:'id'})};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
const data={},view=document.querySelector('#view'),status=document.querySelector('[role=status]');
const el=(tag,value,parent)=>{const n=document.createElement(tag);n.textContent=value;parent.append(n);return n};
const label=r=>r?.name||[r?.first,r?.last].filter(Boolean).join(' ');
const ref=(k,id)=>label(data[k]?.find(r=>r.id===id));
const select=(parent,items)=>{const s=el('select','',parent);for(const [id,name] of items)s.add(new Option(name,id));return s};
async function load(){await Promise.all(keys.slice(1,-1).map(k=>new Promise((ok,no)=>{const r=db.transaction(k).objectStore(k).getAll();r.onsuccess=()=>{data[k]=r.result;ok()};r.onerror=()=>no(r.error)})))}
function transaction(stores,fn){return new Promise((ok,no)=>{const t=db.transaction(stores,'readwrite');t.oncomplete=ok;t.onabort=()=>no(t.error);try{fn(t)}catch(e){t.abort();no(e)}})}
async function save(k,row){await transaction(k,t=>t.objectStore(k).put(row));await load();render();status.textContent='Enregistré sur cet appareil.'}
function link(parent,k,text,cls){const a=el('a',text,parent);a.href='#'+k;if(cls)a.className=cls;return a}
keys.forEach((k,i)=>link(document.querySelector('nav'),k,pages[i]));
document.querySelector('time').textContent=new Intl.DateTimeFormat('fr',{dateStyle:'long'}).format(new Date());
let sessionId='';
function render(){let k=location.hash.slice(1);if(!keys.includes(k))k='home';view.replaceChildren();status.textContent='';document.querySelector('h1').textContent=pages[keys.indexOf(k)];for(const a of document.querySelectorAll('nav a'))a.setAttribute('aria-current',a.hash==='#'+k?'page':'false');
if(k==='home'){const cards=el('div','',view);cards.className='cards';for(const key of ['classes','students','sessions']){const a=link(cards,key,pages[keys.indexOf(key)],'card');el('b',data[key].length,a)}el('h2','Prochaines séances',view);const upcoming=data.sessions.filter(s=>s.date>=new Date().toLocaleDateString('sv-SE')).sort((a,b)=>a.date.localeCompare(b.date));for(const s of upcoming)el('article',s.date+' · '+s.name+' · '+ref('classes',s.classId),view);if(!upcoming.length)el('article','Aucune séance programmée.',view);link(view,data.years.length?'sessions':'years',data.years.length?'Planifier une séance →':'Créer la première année scolaire →');return}
if(k==='attendance'){if(!data.sessions.length){link(view,'sessions','Créer une séance pour faire l’appel →');return}const s=select(el('label','Séance',view),data.sessions.map(r=>[r.id,r.date+' · '+ref('classes',r.classId)+' · '+r.name]));if(data.sessions.some(r=>r.id===sessionId))s.value=sessionId;sessionId=s.value;s.onchange=()=>{sessionId=s.value;render()};const classe=data.sessions.find(r=>r.id===sessionId).classId;for(const pupil of data.students.filter(r=>r.classId===classe)){const id=sessionId+'/'+pupil.id;const a=select(el('label',label(pupil),el('article','',view)),['Non renseigné','Présent','Absent','En retard','Excusé'].map(x=>[x,x]));a.value=data.attendance.find(r=>r.id===id)?.status||'Non renseigné';a.onchange=()=>save(k,{id,sessionId,student:pupil.id,status:a.value})}return}
if(k==='backup'){el('p','La sauvegarde JSON contient les données en clair. Conservez-la dans un emplacement protégé.',view);el('button','Exporter la sauvegarde',view).onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({version:1,data})],{type:'application/json'}));a.download='eps-manager.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};const input=el('input','',el('label','Restaurer un fichier JSON',view));input.type='file';input.accept='.json';input.onchange=async()=>{try{const b=JSON.parse(await input.files[0].text());if(b.version!==1||!Object.keys(data).every(key=>Array.isArray(b.data[key])&&b.data[key].every(r=>r&&typeof r.id==='string'&&Object.values(r).every(v=>typeof v==='string'))))throw Error();if(!confirm('Remplacer toutes les données locales par cette sauvegarde ?'))return;await transaction(Object.keys(data),t=>{for(const key of Object.keys(data)){const st=t.objectStore(key);st.clear();b.data[key].forEach(r=>st.add(r))}});await load();status.textContent='Sauvegarde restaurée.'}catch{status.textContent='Restauration impossible. Vérifiez le fichier.'}};return}
if(k==='students' && data.classes.length)importPanel();
const form=el('form','',view);for(const [key,title,type] of fields[k]){const l=el('label',title,form);let input;if(data[type]){input=select(l,data[type].map(r=>[r.id,label(r)]));if(!data[type].length)link(l,type,'Ajouter →')}else{input=el('input','',l);input.type=type||'text';if(type==='number'){input.min=0;input.max=20;input.step='any'}}input.required=true;input.name=key}el('button','Ajouter',form);form.onsubmit=e=>{e.preventDefault();const row=Object.fromEntries(new FormData(form));if(row.end<row.start){status.textContent='La fin doit suivre le début.';return}save(k,{...row,id:crypto.randomUUID()})};el('h2',pages[keys.indexOf(k)]+' · '+data[k].length,view);for(const row of data[k]){const card=el('article',fields[k].map(([key,,type])=>data[type]?ref(type,row[key]):row[key]).join(' · '),view);if(k==='students'&&row.photo?.startsWith('data:image/jpeg;base64,')){const img=el('img','',card);img.src=row.photo;img.alt='';img.height=72;card.prepend(img)}}}
window.onunhandledrejection=()=>{status.textContent='Opération interrompue. Vérifiez le stockage disponible.'};await load();render();window.onhashchange=render;if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');

function importPanel(){
 const panel=el('details','',view);el('summary','Importer un trombinoscope PRONOTE',panel);
 const target=select(el('label','Classe de destination',panel),data.classes.map(c=>[c.id,label(c)]));
 const picker=el('input','',el('label','Fichier PDF',panel));picker.type='file';picker.accept='application/pdf';
 const preview=el('div','',panel);
 picker.onchange=async()=>{
  preview.replaceChildren();const file=picker.files[0];if(!file)return;picker.disabled=true;
  try{
   const {extract}=await import('./trombi.js');const pupils=await extract(file);
   el('h2',pupils.length+' fiches à vérifier',preview);
   const form=el('form','',preview);const rows=pupils.map(p=>{
    const card=el('article','',form),img=el('img','',card);img.src=p.photo;img.height=90;img.alt='';
    const include=el('input','',el('label','Inclure',card));include.type='checkbox';include.checked=true;
    const last=el('input','',el('label','Nom',card)),first=el('input','',el('label','Prénom',card));last.value=p.last;first.value=p.first;
    return {include,last,first,photo:p.photo};
   });
   if(!rows.length)return;
   el('button','Valider l’import',form);
   form.onsubmit=async e=>{
    e.preventDefault();const classId=target.value;
    const selected=rows.filter(r=>r.include.checked).map(r=>({first:r.first.value.trim(),last:r.last.value.trim(),photo:r.photo,classId,id:crypto.randomUUID()}));
    if(selected.some(r=>!r.first||!r.last)){status.textContent='Complétez le prénom et le nom de chaque fiche incluse.';return}
    const identity=r=>JSON.stringify([r.classId,r.first.trim().toLowerCase(),r.last.trim().toLowerCase()]);
    const known=new Set(data.students.map(identity));const fresh=selected.filter(r=>{const key=identity(r);if(known.has(key))return false;known.add(key);return true});
    await transaction('students',t=>fresh.forEach(r=>t.objectStore('students').add(r)));await load();render();status.textContent=fresh.length+' fiches ajoutées, '+(selected.length-fresh.length)+' doublons ignorés.';
   };
  }catch{el('p','Lecture impossible. Vérifiez le format du PDF.',preview)}finally{picker.disabled=false}
 };
}
