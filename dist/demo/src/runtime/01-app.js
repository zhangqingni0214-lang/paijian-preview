(function(root){
function latest(attempts,id){return attempts.filter(a=>a.qid===id).slice(-1)[0]}
function due(attempts,id){const a=latest(attempts,id);return !!a&&(!a.correct||a.revealed||a.independent===false)}
function pick(pool,attempts=[],count=8,random=Math.random){const ranked=pool.map(q=>{const hist=attempts.filter(a=>a.qid===q.id),last=hist.at(-1);return {q,n:hist.length,t:last?.time||last?.date||'',r:random()}}).sort((a,b)=>a.n-b.n||a.t.localeCompare(b.t)||a.r-b.r);const fresh=ranked.filter(x=>!attempts.some(a=>a.qid===x.q.id&&!a.revealed&&a.independent!==false));const review=ranked.filter(x=>due(attempts,x.q.id));let selected=[],ids=new Set();const take=(list,n)=>{for(const x of list){if(n<=0)break;if(!ids.has(x.q.id)){selected.push(x.q);ids.add(x.q.id);n--}}};take(fresh,Math.max(0,count-2));take(review,Math.min(2,count-selected.length));take(ranked,count-selected.length);return selected}
function exam(pool,history,count=2){const used=history.flatMap(h=>h.results||[]);return pool.map(q=>({q,n:used.filter(r=>r.qid===q.id).length,r:Math.random()})).sort((a,b)=>a.n-b.n||a.r-b.r).slice(0,count).map(x=>x.q)}


function percent(seen,total){return total?Math.round(new Set((seen||[]).filter(i=>Number.isInteger(i)&&i>=0&&i<total)).size/total*100):0}
function section(l,page){return (l.sections||[]).find(s=>page>=s.start&&page<=s.end)}
function sectionPool(l,page){const sec=section(l,page);const pool=l.questions.filter(q=>sec&&(q.sectionIds||[]).includes(sec.id));return {pool:pool.length?pool:l.questions,fallback:!pool.length,section:sec}}
function shuffle(items,random=Math.random){const out=items.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function stats(lessons,state){return {read:lessons.filter(l=>percent(state.readSeen?.[l.id],l.course_pages.length)===100).length,practiced:Object.values(state.courseStatus||{}).filter(x=>x.practiced).length,needsReview:Object.values(state.courseStatus||{}).filter(x=>x.needsReview).length}}
function recommendation(lessons,state){const id=state.lastCourse||state.resume?.id;return lessons.find(l=>l.id===id)||lessons.find(l=>percent(state.readSeen?.[l.id],l.course_pages.length)<100)||lessons[0]}

const api={pick,due,latest,exam,percent,section,sectionPool,shuffle,stats,recommendation};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Learning109=api;
})(typeof globalThis!=='undefined'?globalThis:this);

