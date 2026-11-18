import {getDocument,GlobalWorkerOptions,OPS,Util} from './vendor/pdfjs/pdf.mjs';
GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.mjs',import.meta.url).href;

export async function extract(file){
 const task=getDocument({data:await file.arrayBuffer(),isEvalSupported:false,useSystemFonts:true});
 const pdf=await task.promise, pupils=[];
 try{
  for(let n=1;n<=pdf.numPages;n++){
   const page=await pdf.getPage(n), viewport=page.getViewport({scale:2});
   const canvas=document.createElement('canvas');
   canvas.width=viewport.width; canvas.height=viewport.height;
   await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
   const ops=await page.getOperatorList(), stack=[], boxes=[];
   let matrix=viewport.transform;
   ops.fnArray.forEach((op,i)=>{
    if(op===OPS.save)stack.push(matrix);
    if(op===OPS.restore)matrix=stack.pop();
    if(op===OPS.transform)matrix=Util.transform(matrix,ops.argsArray[i]);
    if(op===OPS.paintImageXObject){
     const [x,y]=Util.applyTransform([0,0],matrix),[right,top]=Util.applyTransform([1,1],matrix);
     if(right>x && y>top)boxes.push({x,top,bottom:y,width:right-x});
    }
   });
   const words=(await page.getTextContent()).items.filter(w=>w.str?.trim()).map(w=>({s:w.str.trim(),x:viewport.convertToViewportPoint(...w.transform.slice(4))[0],y:viewport.convertToViewportPoint(...w.transform.slice(4))[1]}));
   for(const b of boxes){
    const next=boxes.filter(o=>Math.abs(o.top-b.top)<4 && o.x>b.x+4).sort((a,c)=>a.x-c.x)[0];
    const parts=words.filter(w=>w.x>=b.x-4 && w.x<(next?.x??b.x+b.width*1.65)-4 && w.y>=b.bottom-2 && w.y<b.bottom+85);
    if(!parts.length)continue;
    const names=parts.map(w=>w.s).join(' ').replace(/\s+/g,' ').trim().split(' ');
    let split=names.findIndex(s=>s!==s.toLocaleUpperCase('fr'));
    if(split<1)split=Math.max(1,names.length-1);
    const photo=document.createElement('canvas');photo.width=b.width;photo.height=b.bottom-b.top;
    photo.getContext('2d').drawImage(canvas,b.x,b.top,b.width,b.bottom-b.top,0,0,photo.width,photo.height);
    pupils.push({last:names.slice(0,split).join(' '),first:names.slice(split).join(' '),photo:photo.toDataURL('image/jpeg',.85)});
   }
  }
 }finally{await pdf.destroy()}
 return pupils;
}
