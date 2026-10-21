/* v4：开卷首页（全景鸟瞰 + 景点落点 + 视差） */
(function(){
const X=window.XZ,$=(q,e=document)=>e.querySelector(q);
const P={gs:[.148,.31],wm:[.50,.29],hlw:[.385,.45],xmt:[.505,.47],hbs:[.47,.62],bwg:[.50,.82],yls:[.69,.63],ylh:[.19,.67]};
const hero=$('#top'),pins=$('#pins'),pano=$('#pano'),wrap=$('#panoWrap');
pins.innerHTML=ORDER.filter(id=>P[id]).map((id,i)=>{const s=X.get(id),[x,y]=P[id];return `<button class="pin${x>.75?' lft':''}" style="left:${x*100}%;top:${y*100}%;--d:${1900+i*90}ms" data-id="${id}" aria-label="打开${s.n}"><i></i><span><small>${String(i+1).padStart(2,'0')}</small>${s.n}</span></button>`}).join('');
pins.addEventListener('click',e=>{const b=e.target.closest('.pin');if(b)X.openDetail(b.dataset.id)});
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const open=()=>{hero.classList.add('open');if(innerWidth<720)wrap.scrollLeft=(wrap.scrollWidth-wrap.clientWidth)*.42};
if(rm){hero.classList.add('open','now');open()}else setTimeout(open,350);
let mx=0,my=0,tx=0,ty=0,raf=0;
hero.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;if(!raf)raf=requestAnimationFrame(tick)});
function tick(){tx+=(mx-tx)*.08;ty+=(my-ty)*.08;pano.style.setProperty('--px',(-tx*18).toFixed(2)+'px');pano.style.setProperty('--py',(-ty*10).toFixed(2)+'px');hero.style.setProperty('--cx',(tx*36).toFixed(2)+'px');
 raf=Math.abs(mx-tx)+Math.abs(my-ty)>.001?requestAnimationFrame(tick):0}
addEventListener('scroll',()=>{const y=Math.min(scrollY,innerHeight);hero.style.setProperty('--sy',y.toFixed(0))},{passive:true});
})();
