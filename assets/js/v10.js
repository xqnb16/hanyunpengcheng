/* v10：印章景点签 + 悬停展开、四处分界、动效、二维码 */
(function(){
const X=window.XZ,$=(q,e=document)=>e.querySelector(q),$$=(q,e=document)=>[...e.querySelectorAll(q)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
const NUM='〇壹贰叁肆伍陆柒捌玖';
const hero=$('#top');

/* ---------- 1 景点签：印章 + 云纹，悬停展开 ---------- */
const oldPins=$('#pins');
if(oldPins){
 const list=$$('.pin',oldPins).map(b=>({id:b.dataset.id,l:b.style.left,t:b.style.top,d:b.style.getPropertyValue('--d'),lft:b.classList.contains('lft'),n:+(($('small',b)||{}).textContent||0)}));
 const pins=oldPins.cloneNode(false);oldPins.replaceWith(pins);
 pins.innerHTML=list.map(p=>{const s=X.get(p.id);if(!s)return'';const num=String(p.n).split('').map(c=>NUM[+c]).join('').replace(/^〇/,'');
  return `<button class="pin2${p.lft?' lft':''}" style="left:${p.l};top:${p.t};--d:${p.d}" data-id="${p.id}" aria-label="${s.n}，${s.line}。打开详情">
  <i class="dot" aria-hidden="true"></i>
  <span class="tag" aria-hidden="true"><b class="seal">${num||'壹'}</b><em>${s.n}</em></span>
  <span class="pv" aria-hidden="true"><img src="${X.art(s.cover)}" alt="" loading="lazy"><span class="pvt"><strong>${s.n}</strong><small>${s.line}</small>${X.stPill(p.id)||''}<span class="go">${FINE?'点击查看详情 →':'再点一下查看详情 →'}</span></span></span></button>`}).join('');
 let touch=false;pins.addEventListener('pointerdown',e=>{touch=e.pointerType!=='mouse'},{passive:true});
 pins.addEventListener('click',e=>{const b=e.target.closest('.pin2');if(!b)return;
  if(touch&&!b.classList.contains('ex')){e.preventDefault();$$('.pin2.ex',pins).forEach(x=>x.classList.remove('ex'));b.classList.add('ex');hop(b);return}
  X.openDetail(b.dataset.id)});
 document.addEventListener('click',e=>{if(!e.target.closest('.pin2'))$$('.pin2.ex',pins).forEach(x=>x.classList.remove('ex'))});
 /* 朱雀飞向悬停的景点 */
 const zq=document.createElement('img');zq.className='zq-hop';zq.src='assets/img/ip/zq_joy.webp';zq.alt='';zq.setAttribute('aria-hidden','true');hero.appendChild(zq);
 function clampPv(b){const pv=$('.pv',b);if(!pv)return;pv.style.translate='';const r=pv.getBoundingClientRect(),W=innerWidth,H=innerHeight;let dx=0;if(r.right>W-8)dx=W-8-r.right;if(r.left+dx<8)dx=8-r.left;pv.style.translate=dx?dx+'px 0':''}
let zt;function hop(b){clampPv(b);if(RM)return;clearTimeout(zt);const d=$('.dot',b).getBoundingClientRect(),h=hero.getBoundingClientRect();
  const left=b.classList.contains('lft');zq.style.left=(d.left-h.left+(left?14:-58))+'px';zq.style.top=(d.top-h.top-64)+'px';zq.classList.toggle('flip',left);zq.classList.add('on')}
 function unhop(){clearTimeout(zt);zt=setTimeout(()=>zq.classList.remove('on'),1400)}
 pins.addEventListener('pointerover',e=>{const b=e.target.closest('.pin2');if(b&&e.pointerType==='mouse')hop(b)});
 pins.addEventListener('pointerout',e=>{const b=e.target.closest('.pin2');if(b&&!b.contains(e.relatedTarget))unhop()});
 pins.addEventListener('focusin',e=>{const b=e.target.closest('.pin2');b&&hop(b)});pins.addEventListener('focusout',unhop);
 /* 首屏标题与景点签避让 */
 const vl=document.createElement('p');vl.className='vl10 serif';vl.textContent='一座彭城，半部汉史';vl.setAttribute('aria-hidden','true');$('.tdesc')?.prepend(vl);
 const hit=(a,b)=>!(a.right<b.left||a.left>b.right||a.bottom<b.top||a.top>b.bottom);
 function fit(){if(innerWidth<721){hero.classList.remove('tight');return}hero.classList.remove('tight');
  const T=()=>$$('.kai-title .tv h1,.kai-title .tside,.kai-title .tdesc').map(e=>{const r=e.getBoundingClientRect();return {left:r.left-10,right:r.right+10,top:r.top-6,bottom:r.bottom+6}});
  const P=()=>$$('.pin2',pins).map(p=>[$('.dot',p).getBoundingClientRect(),$('.tag',p).getBoundingClientRect()]);
  const bad=()=>{const t=T();return P().some(([d,g])=>t.some(r=>hit(r,d)||hit(r,g)))};
  if(bad())hero.classList.add('tight')}
 setTimeout(fit,60);let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(fit,200)});
}

/* ---------- 2 首屏活起来：云气、白鹤、湖面 ---------- */
const pano=$('#pano');
if(pano){
 pano.insertAdjacentHTML('beforeend',`<svg class="mist10 m1" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path d="M-50 70 C 60 40, 140 90, 250 62 S 430 40, 540 70 S 760 96, 860 60 S 1000 46, 1060 70" fill="none" stroke="#FBF6EC" stroke-width="30" stroke-linecap="round" opacity=".7"/></svg>
 <svg class="mist10 m2" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path d="M-50 60 C 90 86, 200 40, 320 64 S 560 90, 680 58 S 900 40, 1060 66" fill="none" stroke="#FFFFFF" stroke-width="18" stroke-linecap="round" opacity=".55"/></svg>
 <svg class="crane10" viewBox="0 0 120 40" aria-hidden="true"><g fill="none" stroke="#4A4038" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path class="w" d="M8 20 Q 18 8 28 18 Q 38 8 48 20"/><path class="w b" d="M70 28 Q 78 18 86 26 Q 94 18 102 28"/></g></svg>
 <span class="rip10" style="left:17%;top:80%"></span><span class="rip10" style="left:27%;top:88%;animation-delay:1.6s"></span><span class="rip10" style="left:9%;top:72%;animation-delay:3.1s"></span>`);
}

/* ---------- 3 分界：宣纸毛边 / 墨色山峦 / 云气纹 / 故黄河水波 ---------- */
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
function paper(){let d='M0 40 L0 22';for(let x=0;x<=1440;x+=9){d+=` L${x} ${(18+rnd()*9).toFixed(1)}`}d+=' L1440 40 Z';
 let f='';for(let i=0;i<40;i++){const x=rnd()*1440,y=20+rnd()*12;f+=`<path d="M${x.toFixed(0)} ${y.toFixed(1)} q${(4+rnd()*8).toFixed(1)} ${(-2+rnd()*4).toFixed(1)} ${(10+rnd()*12).toFixed(1)} ${(rnd()*3).toFixed(1)}"/>`}
 return `<svg viewBox="0 0 1440 40" preserveAspectRatio="none"><path d="${d}" fill="#F4EDE0"/><path d="${d.replace(/ L1440 40 Z$/,'').replace(/^M0 40 L/,'M')}" fill="none" stroke="#CDBFA3" stroke-width="1.2" vector-effect="non-scaling-stroke"/><g fill="none" stroke="#D9CCB4" stroke-width=".8" opacity=".8">${f}</g></svg>`}
function hills(n,base,amp,ph){const w=1600/n;let d=`M-80 ${base}`;for(let k=0;k<n;k++){const h=amp*(.55+.45*Math.abs(Math.sin(k*1.7+ph)));const x0=-80+k*w;d+=` C ${(x0+w*.25).toFixed(0)} ${(base-h).toFixed(0)}, ${(x0+w*.75).toFixed(0)} ${(base-h).toFixed(0)}, ${(x0+w).toFixed(0)} ${base}`}return d+` L1520 140 L-80 140 Z`}
function ridge(base,amp,ph,sharp){let d=`M-80 140 L-80 ${base}`;const pts=[];for(let x=-80;x<=1520;x+=14){const t=x/1440*Math.PI*2;let h=Math.sin(t*2.2+ph)*.45+Math.sin(t*4.7+ph*1.7)*.3+Math.sin(t*9.3+ph*.6)*.16+Math.sin(t*17+ph)*.06;h=(h+1)/2;h=Math.pow(h,sharp);const y=base-amp*h;pts.push([x,y]);d+=` L${x} ${y.toFixed(1)}`}return [d+' L1520 140 Z',pts]}
function mountains(){const [d1]=ridge(120,96,0.8,1.25),[d2,p2]=ridge(140,84,2.6,1.6);let top=p2.filter(([x])=>x>860&&x<1120).reduce((a,b)=>b[1]<a[1]?b:a);
 return `<svg class="ly" data-k="-30" viewBox="0 0 1440 140" preserveAspectRatio="none"><defs><linearGradient id="mg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A4A3E" stop-opacity=".35"/><stop offset="1" stop-color="#2E201A" stop-opacity=".9"/></linearGradient></defs><path d="${d1}" fill="url(#mg1)"/></svg>
 <svg class="ly" data-k="18" viewBox="0 0 1440 140" preserveAspectRatio="none"><path d="${d2}" fill="#2E201A"/>
 <g transform="translate(${top[0]} ${(top[1]+2).toFixed(1)})" fill="#2E201A"><path d="M-17 -8 Q0 -20 17 -8 L12 -8 L12 2 L-12 2 L-12 -8 Z"/><path d="M-1 -24 L1 -24 L1 -17 L-1 -17Z"/></g></svg>`}
function clouds(){let d='M0 80 L0 46';const n=16,w=1440/n;for(let k=0;k<n;k++){const x=k*w,r=(k%3?18:28)+((k*7)%3)*4;d+=` Q ${(x+w*.1).toFixed(0)} ${46-r}, ${(x+w*.5).toFixed(0)} ${46-r*.9} T ${(x+w).toFixed(0)} 46`}d+=' L1440 80 Z';
 let g='';for(let k=0;k<7;k++){const x=90+k*205+((k*37)%40),y=38+((k*13)%10);g+=`<path d="M${x} ${y} c 10 -14 30 -14 34 0 c 3 10 -10 14 -14 6 c -3 -6 4 -10 8 -6" />`}
 return `<svg class="ly" data-k="14" viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="${d}" fill="#F4EDE0"/></svg><svg class="ly" data-k="-14" viewBox="0 0 1440 80" preserveAspectRatio="none"><g fill="none" stroke="#C9A15E" stroke-width="2" stroke-linecap="round" opacity=".85">${g}</g></svg>`}
function water(){const wv=(y,a,l)=>{let d=`M-40 ${y}`;for(let x=-40;x<1480;x+=l)d+=` q ${l/4} ${-a} ${l/2} 0 t ${l/2} 0`;return d};
 return `<svg class="ly" data-k="-16" viewBox="0 0 1440 64" preserveAspectRatio="none"><path class="flow" d="${wv(16,7,140)}" fill="none" stroke="#7FA89A" stroke-width="2.4" stroke-linecap="round"/><path class="flow b" d="${wv(28,5,100)}" fill="none" stroke="#B3CBC2" stroke-width="1.8" stroke-linecap="round"/></svg>
 <svg class="ly" data-k="10" viewBox="0 0 1440 64" preserveAspectRatio="none"><path d="${wv(44,8,160)} L1480 64 L-40 64 Z" fill="#F3EBDC"/></svg>`}
[['sites','paper',paper],['sanjue','mtn',mountains],['fy','cloud',clouds],['go','water',water]].forEach(([id,c,fn])=>{const s=document.getElementById(id);if(!s)return;s.insertAdjacentHTML('afterbegin',`<div class="dv10 dv-${c}" aria-hidden="true">${fn()}</div>`)});
const DV=$$('.dv10');let dq=0;
function dvMove(){dq=0;const vh=innerHeight;DV.forEach(d=>{const r=d.getBoundingClientRect();if(r.bottom<-50||r.top>vh+50)return;const t=(r.top/vh-.5);$$('.ly',d).forEach(l=>l.style.transform=`translate3d(${(t*+l.dataset.k).toFixed(1)}px,0,0)`)})}
if(!RM){addEventListener('scroll',()=>{if(!dq)dq=requestAnimationFrame(dvMove)},{passive:true});dvMove()}

/* ---------- 4 标题盖印 + 毛笔显现；卡片依次展开 ---------- */
$$('.sh5 .eye').forEach(e=>{const m=e.textContent.match(/^\s*(\d+)\s*·\s*(.*)$/);if(m)e.innerHTML=`<b class="stamp10">${m[1]}</b><span>${m[2]}</span>`});
$$('.sh5').forEach(h=>h.classList.add('rv-h'));
const groups=['#sgrid .chap','.cgrid','.lfl','.sjg','.fyg','.go-grid'];
groups.forEach(g=>$$(g).forEach(box=>[...box.children].forEach((c,i)=>{c.classList.add('rv10');c.style.setProperty('--rd',(i%6)*90+'ms')})));
$$('.metro-wrap,.lfh,.life7 .lfs').forEach(c=>c.classList.add('rv10'));
if(RM||!('IntersectionObserver' in window)){$$('.rv10,.rv-h').forEach(e=>e.classList.add('in'))}
else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
 $$('.rv10,.rv-h').forEach(e=>io.observe(e))}

/* ---------- 5 二维码：首屏角落 + 页脚 ---------- */
const URL='xqnb16.github.io/hanyunpengcheng';
if(hero){hero.insertAdjacentHTML('beforeend',`<aside class="qr10" aria-label="手机扫码访问"><button type="button" class="qx" aria-label="收起二维码">×</button><img src="assets/img/qr.png" alt="网站二维码：${URL}" width="112" height="112"><p><b>手机扫码</b>带着长卷去徐州</p></aside><button type="button" class="qr10-mini" aria-label="显示网站二维码" hidden>扫码</button>`);
 const q=$('.qr10',hero),mini=$('.qr10-mini',hero);const set=v=>{q.hidden=!v;mini.hidden=v;try{sessionStorage.setItem('qr10',v?'1':'0')}catch(e){}};
 $('.qx',q).onclick=()=>set(false);mini.onclick=()=>set(true);try{if(sessionStorage.getItem('qr10')==='0')set(false)}catch(e){}}
const ft=$('.foot');if(ft)ft.insertAdjacentHTML('afterbegin',`<div class="fqr10"><img src="assets/img/qr.png" alt="网站二维码" width="84" height="84" loading="lazy"><p><b>手机扫码访问</b><span>${URL}</span></p></div>`);
})();
