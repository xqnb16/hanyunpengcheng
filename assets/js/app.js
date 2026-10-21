/* 汉韵彭城 v3 · 核心：长卷、交通、集章、详情 */
(()=>{
const $=(q,el=document)=>el.querySelector(q),$$=(q,el=document)=>[...el.querySelectorAll(q)];
const S=window.SITES,R=window.ROUTES,O=window.ORDER,A=window.ALL||O;
const get=id=>S.find(s=>s.id===id);
const art=k=>`assets/img/art/${k}.webp`, ip=k=>`assets/img/ip/${k}.webp`;
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ---------- 事件 & 印章 ---------- */
const bus={};const on=(e,f)=>(bus[e]=bus[e]||[]).push(f);const emit=(e,d)=>(bus[e]||[]).forEach(f=>f(d));
let stamps=[];try{stamps=JSON.parse(localStorage.getItem('xz3_stamps')||'[]').filter(get)}catch(e){}
function stamp(id){if(stamps.includes(id))return false;stamps.push(id);try{localStorage.setItem('xz3_stamps',JSON.stringify(stamps))}catch(e){}
 refresh();emit('stamp',id);return true}
function refresh(){markStops();emit('refresh')}
/* ---------- 坐标（WGS→GCJ，用于高德） ---------- */
function gcj(lat,lng){const a=6378245,ee=.00669342162296594323,PI=Math.PI;
 const tl=(x,y)=>{let r=-100+2*x+3*y+.2*y*y+.1*x*y+.2*Math.sqrt(Math.abs(x));r+=(20*Math.sin(6*x*PI)+20*Math.sin(2*x*PI))*2/3;r+=(20*Math.sin(y*PI)+40*Math.sin(y/3*PI))*2/3;r+=(160*Math.sin(y/12*PI)+320*Math.sin(y*PI/30))*2/3;return r};
 const tg=(x,y)=>{let r=300+x+2*y+.1*x*x+.1*x*y+.1*Math.sqrt(Math.abs(x));r+=(20*Math.sin(6*x*PI)+20*Math.sin(2*x*PI))*2/3;r+=(20*Math.sin(x*PI)+40*Math.sin(x/3*PI))*2/3;r+=(150*Math.sin(x/12*PI)+300*Math.sin(x/30*PI))*2/3;return r};
 let dLat=tl(lng-105,lat-35),dLng=tg(lng-105,lat-35);const rad=lat/180*PI;let m=Math.sin(rad);m=1-ee*m*m;const sq=Math.sqrt(m);
 dLat=dLat*180/((a*(1-ee))/(m*sq)*PI);dLng=dLng*180/(a/sq*Math.cos(rad)*PI);return [lat+dLat,lng+dLng]}
const amapTo=id=>{const s=get(id);if(!s){const h=HUBS.find(x=>x[0]===id);return `https://uri.amap.com/search?keyword=${encodeURIComponent(h[1])}&city=320300&callnative=1`}
 const [la,ln]=gcj(s.lat,s.lng);return `https://uri.amap.com/navigation?to=${ln.toFixed(5)},${la.toFixed(5)},${encodeURIComponent(s.n)}&mode=bus&coordinate=gaode&callnative=1`};
/* ---------- 交通网络 ---------- */
const NAME=id=>get(id)?get(id).n:(HUBS.find(h=>h[0]===id)||[])[1]||STNS[id]||id;
const adj={};EDGES.forEach(e=>{(adj[e[0]]=adj[e[0]]||[]).push({to:e[1],e,fw:1});(adj[e[1]]=adj[e[1]]||[]).push({to:e[0],e,fw:0})});
function path(a,b){if(a===b)return {legs:[],min:0};const d={},pv={},done=new Set();d[a]=0;
 while(true){let u=null;for(const k in d)if(!done.has(k)&&(u===null||d[k]<d[u]))u=k;if(u===null||u===b)break;done.add(u);
  (adj[u]||[]).forEach(x=>{const prevMode=pv[u]?pv[u].e[2]:null;const c=d[u]+x.e[3]+(prevMode&&prevMode!==x.e[2]?4:1);if(d[x.to]===undefined||c<d[x.to]){d[x.to]=c;pv[x.to]={from:u,e:x.e,fw:x.fw}}})}
 if(d[b]===undefined)return null;const legs=[];let c=b;while(c!==a){const p=pv[c];legs.unshift({from:p.from,to:c,mode:p.e[2],min:p.e[3],txt:p.fw?p.e[4]:p.e[5]});c=p.from}
 return {legs,min:legs.reduce((s,l)=>s+l.min,0)}}
const MC={'地铁':['#2E6DB4','铁'],'公交':['#3F8F5F','公'],'步行':['#C9954A','步'],'打车':['#6A5F52','车']};
const modes=p=>[...new Set(p.legs.map(l=>l.mode))].join('+');
/* ---------- 导航高亮 ---------- */
const nav=$('#nav');addEventListener('scroll',()=>nav.classList.toggle('solid',scrollY>40),{passive:true});nav.classList.toggle('solid',scrollY>40);
const secIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const id=e.target.id;$$('.links a,.tabbar a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+id));emit('section',id)}}),{rootMargin:'-45% 0px -50% 0px'});
['top','scroll','sites','sanjue','fy','go','about'].forEach(id=>{const el=document.getElementById(id);el&&secIO.observe(el)});

/* =========================================================
   长卷
   ========================================================= */
const sec=$('#scroll'),track=$('#track'),scX=(()=>{const w=document.createElement('div');w.className='sc-x';w.id='scX';track.before(w);w.appendChild(track);return w})(),flyer=$('#flyer'),card=$('#scCard'),bar=$('#scBar');
let L={},route=-1,curI=-2;
$('#scRoutes').innerHTML=`<button class="chip" aria-pressed="true" data-r="-1">全部九景</button>`+R.map((r,i)=>`<button class="chip" aria-pressed="false" data-r="${i}">${r.n}</button>`).join('');
$$('#scRoutes .chip').forEach(b=>b.onclick=()=>{route=+b.dataset.r;$$('#scRoutes .chip').forEach(x=>x.setAttribute('aria-pressed',x===b));applyRoute();const r=R[route];if(r)goStop(O.indexOf(r.ids[0]));emit('route',route)});
function layout(){
 const vw=innerWidth,vh=innerHeight,mob=vw<720;
 const th=Math.max(260,vh-(mob?440:400));
 const S2=mob?vw*.86:Math.max(330,Math.min(500,vw*.36));
 const intro=mob?vw*.9:Math.min(vw*.62,620),outro=mob?vw:Math.max(vw*.55,520);
 const W=intro+O.length*S2+outro;
 L={vw,vh,th,S:S2,intro,W,cx:O.map((_,i)=>intro+S2*(i+.5)),mob,K:mob?1:1.7};
 track.style.width=W+'px';sec.style.height=(mob?vh:Math.round((W-vw)/L.K+vh))+'px';sec.classList.toggle('mobx',mob);if(!mob)scX.scrollLeft=0;
 const vg=Math.min(S2*(mob?1:1.02),th*1.38);
 track.innerHTML=`<svg class="sc-bg" width="${W}" height="${th}" viewBox="0 0 ${W} ${th}" aria-hidden="true">${bgSVG()}</svg>
 <div class="intro-panel" style="width:${intro}px"><div class="row"><div class="big">彭城<em>七里</em></div><div class="meta"><b>一幅从北到南的长卷</b>从城西北的龟山汉墓出发，跨过故黄河，沿着彭城七里一路向南，中途向东拐去狮子山，最后到云龙山水。<br><br>${mob?'向左滑动，展开长卷 →':'向下滚动 →'}</div></div></div>
 ${O.map((id,i)=>{const s=get(id);return `<div class="stop" data-id="${id}" data-i="${i}" style="left:${L.cx[i]-S2/2}px;width:${S2}px;--vw:${vg}px" role="button" tabindex="0" aria-label="${s.n}"><div class="vg" style="background-image:url(${art(s.cover)})"></div><div class="vlabel">${s.n}</div></div>`}).join('')}
 <div class="outro-panel" style="left:${intro+O.length*S2}px;width:${outro}px"><img src="${ip('zq_love')}" alt=""><h3>长卷到此，出发吧</h3><p style="color:var(--ink2);max-width:20em">九个地方都认识了。挑几个拼成一天的行程，朱雀帮你算好怎么走。</p><a class="btn red" href="#go">去规划行程</a></div>`;
 $$('.stop',track).forEach(el=>{const go=()=>{const i=+el.dataset.i;if(i===curI)openDetail(el.dataset.id);else goStop(i)};el.onclick=go;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}}});
 bar.innerHTML=`<div class="rail"></div><div class="fill" id="scFill"></div>`+O.map((id,i)=>`<button data-i="${i}" style="left:${(i+.5)/O.length*100}%" aria-label="跳到${get(id).n}"><span>${get(id).g}</span><em aria-hidden="true">${get(id).n}</em></button>`).join('');
 $$('button',bar).forEach(b=>b.onclick=()=>goStop(+b.dataset.i));
 applyRoute();markStops();curI=-2;update();
}
function bgSVG(){const {th,S,cx,W,intro}=L;let s='';const x=i=>cx[i];
 // 祥云
 const cloud=(x0,y0,k)=>`<path transform="translate(${x0},${y0}) scale(${k})" d="M0 20c0-11 9-20 20-20s20 9 20 20c0-8 6-14 14-14s14 6 14 14c0 5-4 9-9 9h-50c-5 0-9-4-9-9z M20 20a8 8 0 1 1 8 -8" fill="none" stroke="#C9954A" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>`;
 for(let i=0;i<O.length+1;i+=1){s+=cloud(intro+S*i+S*.15,th*.02+(i%2)*th*.06,.9+(i%3)*.2)}
 // 龟山
 s+=`<path d="M${x(0)-S*.5} ${th} q${S*.25} -${th*.32} ${S*.5} -${th*.2} q${S*.2} -${th*.12} ${S*.5} ${th*.2}z" fill="#C9B998" opacity=".5"/>`;
 // 故黄河（竖向穿过）
 const rx=(x(0)+x(1))/2;s+=`<path id="hh" d="M${rx-30} -20 C ${rx+60} ${th*.25}, ${rx-70} ${th*.5}, ${rx+10} ${th*.75} S ${rx+40} ${th+10}, ${rx-10} ${th+30}" fill="none" stroke="#B9CEC6" stroke-width="54" stroke-linecap="round" opacity=".85"/>
 <path d="M${rx-30} -20 C ${rx+60} ${th*.25}, ${rx-70} ${th*.5}, ${rx+10} ${th*.75} S ${rx+40} ${th+10}, ${rx-10} ${th+30}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="8 14" opacity=".8"/>
 <text x="${rx+38}" y="${th*.36}" font-family="var(--serif)" font-size="18" font-weight="900" fill="#5E8C78" letter-spacing="6" style="writing-mode:vertical-rl">故黄河</text>`;
 // 古城
 const g0=x(1)-S*.5,g1=x(4)+S*.5;s+=`<rect x="${g0}" y="${th*.04}" width="${g1-g0}" height="${th*.9}" rx="28" fill="rgba(201,149,74,.06)" stroke="#9C8A6A" stroke-width="2" stroke-dasharray="1 8" stroke-linecap="round"/><text x="${g0+18}" y="${th*.94-14}" font-size="13" font-weight="800" fill="#8A7A5C">徐州古城（示意）</text>`;
 // 云龙山（九节）
 let m=`M${x(5)-S*.45} ${th}`;const w=(x(6)+S*.5-(x(5)-S*.45))/9;for(let k=0;k<9;k++)m+=` q${w/2} -${th*(.16+((k*37)%5)*.025)} ${w} 0`;s+=`<path d="${m}z" fill="#A9B596" opacity=".45"/><text x="${x(6)+S*.2}" y="${th-th*.2}" font-family="var(--serif)" font-size="14" font-weight="800" fill="#5E7A55">云龙山 · 山分九节</text>`;
 // 云龙湖
 s+=`<ellipse cx="${x(7)}" cy="${th*.82}" rx="${S*.55}" ry="${th*.14}" fill="#BFD3CC" opacity=".55"/>`;
 // 七里轴 + 段间交通
 const ay=th-6;s+=`<path d="M${x(1)} ${ay} H${x(6)}" stroke="#B23A2E" stroke-width="2.5" stroke-dasharray="3 7" stroke-linecap="round"/><text x="${x(1)+200}" y="${ay-12}" font-family="var(--serif)" font-size="13" font-weight="900" fill="#B23A2E">彭城七里 · 文脉轴 ┈ 北起故黄河，南至云龙山</text>`;
 for(let i=0;i<O.length-1;i++){const p=path(O[i],O[i+1]);if(!p)continue;const mx=(x(i)+x(i+1))/2;s+=`<text x="${mx}" y="${th*.94-12}" text-anchor="middle" font-size="12" font-weight="800" fill="#6A5F52" stroke="#F6EFE2" stroke-width="5" paint-order="stroke">${modes(p)} 约${p.min}分</text>`}
 s+=`<g id="rpath"></g>`;return s}
function applyRoute(){const r=R[route];
 $$('.stop',track).forEach(el=>{const id=el.dataset.id,k=r?r.ids.indexOf(id):-1;el.classList.toggle('dim',!!r&&k<0);$('.rnum',el)?.remove();if(k>=0)$('.vlabel',el)?.insertAdjacentHTML('afterbegin',`<span class="rnum">${k+1}</span>`)});
 $$('button',bar).forEach(b=>b.classList.toggle('dim',!!r&&!r.ids.includes(O[+b.dataset.i])));
 const g=$('#rpath',track);if(!g)return;if(!r){g.innerHTML='';return}
 const y=L.th*.22;let d='';r.ids.forEach((id,k)=>{const X=L.cx[O.indexOf(id)];if(!k)d=`M${X} ${y}`;else{const P=L.cx[O.indexOf(r.ids[k-1])];d+=` Q${(P+X)/2} ${y-L.th*.16} ${X} ${y}`}});
 g.innerHTML=`<path d="${d}" fill="none" stroke="#B23A2E" stroke-width="3" stroke-dasharray="10 8" stroke-linecap="round"/>`;curI=-2;update()}
function markStops(){$$('.stop',track).forEach(el=>{$('.got',el)?.remove();if(stamps.includes(el.dataset.id))el.insertAdjacentHTML('beforeend','<span class="got">已盖章</span>')})}
function txOf(){if(L.mob)return Math.max(0,Math.min(L.W-L.vw,scX.scrollLeft));const top=sec.getBoundingClientRect().top;return Math.max(0,Math.min(L.W-L.vw,-top*L.K))}
function goStop(i){i=Math.max(0,Math.min(O.length-1,i));const tx=Math.max(0,Math.min(L.W-L.vw,L.cx[i]-L.vw/2));if(L.mob){scX.scrollTo({left:tx,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});return}scrollTo({top:sec.offsetTop+Math.ceil(tx/L.K),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
function update(){const tx=txOf();track.style.transform=L.mob?'none':`translate3d(${-tx}px,0,0)`;
 const c=tx+L.vw/2;let i=Math.round((c-L.intro)/L.S-.5);const inRange=c>L.intro-L.S*.2&&c<L.intro+O.length*L.S+L.S*.2;i=Math.max(0,Math.min(O.length-1,i));
 $('#scFill').style.width=Math.min(100,Math.max(0,(c-L.intro)/(O.length*L.S)*100))+'%';
 const ni=inRange?i:-1;if(ni!==curI){curI=ni;renderCard()}}
function renderCard(){$$('.stop',track).forEach(el=>el.classList.toggle('cur',+el.dataset.i===curI));$$('button',bar).forEach(b=>b.classList.toggle('on',+b.dataset.i===curI));
 if(curI<0){card.classList.add('off');emit('stop',null);return}card.classList.remove('off');
 const id=O[curI],s=get(id),r=R[route];let k=`第 ${curI+1} / ${O.length} 站 · ${s.tag}`,nxt=O[curI+1],prv=O[curI-1];
 if(r&&r.ids.includes(id)){const j=r.ids.indexOf(id);k=`${r.n} · 第 ${j+1} / ${r.ids.length} 站`;nxt=r.ids[j+1];prv=r.ids[j-1]}
 const p=nxt?path(id,nxt):null;
 card.innerHTML=`<div class="cl"><div class="k">${k}</div><h3>${s.n}<small>${s.line}</small></h3>
 ${p?`<div class="leg">下一站 <b>${get(nxt).n}</b>：${modes(p)}，约 ${p.min} 分钟</div>`:''}</div>
 <div class="cr"><div class="nav2"><button aria-label="上一站" ${prv?'':'disabled style="opacity:.3"'} data-g="${prv||''}">‹</button><button aria-label="下一站" ${nxt?'':'disabled style="opacity:.3"'} data-g="${nxt||''}">›</button></div>
 <div class="acts"><button class="btn small" data-d="${id}">看详情</button>${GAMES.includes(id)?`<button class="btn small red" data-p="${id}">去玩：${s.game[0]}</button>`:''}</div></div>`;
 card.classList.remove('cswap');void card.offsetWidth;card.classList.add('cswap');
 $$('[data-g]',card).forEach(b=>b.onclick=()=>b.dataset.g&&goStop(O.indexOf(b.dataset.g)));
 $('[data-d]',card).onclick=()=>openDetail(id);$('[data-p]',card)&&($('[data-p]',card).onclick=()=>goPlay(id));emit('stop',id)}
let lastTx=0,vel=0,mood='',t0=performance.now(),still=0;
function fly(t){const tx=txOf();vel=vel*.85+(tx-lastTx)*.15;lastTx=tx;
 const atEnd=tx>=L.W-L.vw-2;let m=Math.abs(vel)>1.2?'zq_hype':(atEnd?'zq_love':'zq_joy');if(m!==mood){mood=m;flyer.src=ip(m)}
 if(!L.mob){const fr=$('#scFill')?.getBoundingClientRect(),pr=flyer.offsetParent?.getBoundingClientRect();if(fr&&pr&&fr.width>=0)flyer.style.left=(fr.right-pr.left)+'px'}card.classList.toggle('pre',tx<L.intro*.55);
 const y=Math.sin(t/600)*8,rot=Math.max(-14,Math.min(14,vel*.6));flyer.style.transform=`translateY(${y}px) rotate(${rot}deg) scaleX(${vel<-1?-1:1})`;
 if(secVisible)requestAnimationFrame(fly)}
let secVisible=false;new IntersectionObserver(es=>{secVisible=es[0].isIntersecting;if(secVisible)requestAnimationFrame(fly)}).observe(sec);
addEventListener('scroll',update,{passive:true});scX.addEventListener('scroll',update,{passive:true});
let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{if(Math.abs(innerWidth-L.vw)>40||Math.abs(innerHeight-L.vh)>120)layout()},150)});
addEventListener('keydown',e=>{if(!secVisible||document.activeElement.closest('input,select,textarea,.gpanel'))return;if(!$('#detail').hidden)return;const r=sec.getBoundingClientRect();if(r.top>0||r.bottom<innerHeight)return;
 if(e.key==='ArrowRight'){e.preventDefault();goStop(curI+1)}if(e.key==='ArrowLeft'){e.preventDefault();goStop(curI-1)}});

/* =========================================================
   交通
   ========================================================= */
const opts=(sel,list)=>list.map(([v,t])=>`<option value="${v}"${v===sel?' selected':''}>${t}</option>`).join('');
const PLACES=[...HUBS.map(h=>[h[0],h[1]+'（'+h[2]+'）']),...A.map(id=>[id,get(id).n])];
let pf='east',pt='hbs';
function renderPlanner(){$('#from').innerHTML=opts(pf,PLACES);$('#to').innerHTML=opts(pt,PLACES);
 const p=path(pf,pt);const tk=$('#ticket');
 if(pf===pt||!p){tk.innerHTML=`<li class="pt"><span class="dot">!</span><div><b>起点和终点一样</b><small>换一个终点试试。</small></div></li>`;$('#tfoot').innerHTML='';return}
 let h=`<li class="pt"><span class="dot">起</span><div><b>${NAME(pf)}</b><small>出发</small></div></li>`;
 p.legs.forEach((l,i)=>{const [c,g]=MC[l.mode];h+=`<li class="leg" style="--c:${c}"><span class="dot">${g}</span><div><b>${l.mode}</b><small>${l.txt}</small></div><span class="min">约${l.min}分</span></li>`;
  const last=i===p.legs.length-1;h+=`<li class="pt${last?' end':''}"><span class="dot">${last?'终':'·'}</span><div><b>${NAME(l.to)}</b><small>${last?'到达':(STNS[l.to]?'换乘 / 出站':'途经')}</small></div></li>`});
 tk.innerHTML=h;
 $('#tfoot').innerHTML=`<span class="sum">全程约 ${p.min} 分钟</span><span style="display:flex;gap:8px;flex-wrap:wrap">${get(pt)?`<button class="btn small ghost dark" data-d="${pt}">看${get(pt).n}</button>`:''}<a class="btn small red" href="${amapTo(pt)}" target="_blank" rel="noopener">高德查实时路线 ↗</a></span>`;
 $('[data-d]',$('#tfoot'))?.addEventListener('click',e=>openDetail(e.currentTarget.dataset.d))}
$('#from').onchange=e=>{pf=e.target.value;renderPlanner();emit('plan',[pf,pt])};$('#to').onchange=e=>{pt=e.target.value;renderPlanner();emit('plan',[pf,pt])};
$('#swap').onclick=()=>{[pf,pt]=[pt,pf];renderPlanner()};
function planTo(id,from){pt=id;if(from)pf=from;else if(pf===id)pf='east';renderPlanner();document.getElementById('go').scrollIntoView({behavior:'smooth'})}
/* 拼行程 */
let bl=[],bf='east';try{const v=JSON.parse(localStorage.getItem('xz3_trip')||'null');if(v){bl=v.l.filter(get);bf=v.f}}catch(e){}
function saveTrip(){try{localStorage.setItem('xz3_trip',JSON.stringify({l:bl,f:bf}))}catch(e){}}
function renderBuilder(){
 $('#bPool').innerHTML=A.map(id=>`<button class="chip${bl.includes(id)?' in':''}" data-id="${id}" aria-pressed="${bl.includes(id)}">${bl.includes(id)?'✓ ':'+ '}${get(id).n}</button>`).join('');
 $('#bFrom').innerHTML=opts(bf,[['none','第一站'],...HUBS.map(h=>[h[0],h[1]])]);
 let tot=0,h='';const seq=bf==='none'?bl:[bf,...bl];
 if(!bl.length)h=`<li class="empty">还没有景点，先从上面挑几个吧。</li>`;
 bl.forEach((id,i)=>{const prev=bf==='none'?bl[i-1]:seq[i];const p=prev?path(prev,id):null;if(p)tot+=p.min;
  h+=`<li><span class="n">${i+1}</span><b>${get(id).n}</b><span class="ops"><button data-u="${i}" aria-label="上移">↑</button><button data-dn="${i}" aria-label="下移">↓</button><button data-x="${i}" aria-label="移除">×</button></span>${p?`<span class="lg">从${NAME(prev)}：<b>${modes(p)}</b> 约${p.min}分 · ${p.legs.map(l=>l.txt).join('；')}</span>`:''}</li>`});
 $('#bList').innerHTML=h;
 const stay=bl.reduce((s,id)=>s+({'约1小时':60,'约1.5小时':90,'约2小时':120,'半天':180}[get(id).time]||60),0);
 $('#bSum').innerHTML=bl.length?`路上约 ${tot} 分钟 + 游览约 ${Math.round(stay/30)/2} 小时，合计约 ${Math.round((tot+stay)/30)/2} 小时。${bl.length>4?'<br><span style="color:var(--red)">景点有点多，建议分两天。</span>':''}`:'';
 $$('#bPool .chip').forEach(b=>b.onclick=()=>{const id=b.dataset.id;bl=bl.includes(id)?bl.filter(x=>x!==id):[...bl,id];saveTrip();renderBuilder();emit('trip',bl)});
 $$('[data-u]').forEach(b=>b.onclick=()=>{const i=+b.dataset.u;if(i>0){[bl[i-1],bl[i]]=[bl[i],bl[i-1]];saveTrip();renderBuilder()}});
 $$('[data-dn]').forEach(b=>b.onclick=()=>{const i=+b.dataset.dn;if(i<bl.length-1){[bl[i+1],bl[i]]=[bl[i],bl[i+1]];saveTrip();renderBuilder()}});
 $$('[data-x]').forEach(b=>b.onclick=()=>{bl.splice(+b.dataset.x,1);saveTrip();renderBuilder()});
 $('#bFrom').onchange=e=>{bf=e.target.value;saveTrip();renderBuilder()}}
$('#bSort').onclick=()=>{if(bl.length<2)return;let rest=[...bl],cur=bf==='none'?rest.shift():bf,out=bf==='none'?[cur]:[];
 while(rest.length){rest.sort((a,b)=>path(cur,a).min-path(cur,b).min);cur=rest.shift();out.push(cur)}bl=out;saveTrip();renderBuilder()};
$('#bClear').onclick=()=>{bl=[];saveTrip();renderBuilder()};
function addTrip(id){if(!bl.includes(id)){bl.push(id);saveTrip();renderBuilder();emit('trip',bl)}}
/* 地铁示意图 */
(function(){const l1=['路窝','杏山子','韩山','工农路','人民广场','苏堤路','徐医附院','彭城广场','民主北路','徐州火车站','子房山','铜山路','黄山垅','庆丰路','医科大学','乔家湖','金龙湖','徐州东站'];
 const Y=230,x0=40,dx=1120/17;let s='';const st=(x,y,n,an,lx,ly,hl)=>`<circle cx="${x}" cy="${y}" r="${hl?8:5.5}" fill="#fff" stroke="#2A241E" stroke-width="${hl?3:2}"/><text x="${lx}" y="${ly}" text-anchor="${an}" font-size="${hl?14:12}" font-weight="${hl?800:500}">${n}</text>`;
 s+=`<path d="M${x0} ${Y} H${x0+dx*17}" stroke="#C8423A" stroke-width="8" stroke-linecap="round"/>`;const P=x0+dx*7,Q=x0+dx*9;
 s+=`<path d="M${P} 40 V${Y} V300 V345 L540 390 L600 430 H780" fill="none" stroke="#2E6DB4" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
 s+=`<path d="M${Q} 160 V${Y} V300 V400 L600 430 V495" fill="none" stroke="#3F9A5F" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
 l1.forEach((n,i)=>{const x=x0+dx*i;if(i===7||i===9)return;s+=st(x,Y,n,'middle',x,Y-16,i===17)});
 s+=st(P,Y,'彭城广场','end',P-12,Y+28,1)+st(Q,Y,'徐州火车站','start',Q+12,Y+28,1);
 ['庆云桥','九龙湖','奔腾大道','九里山','李沃','客运北站'].forEach((n,i)=>{const y=190-i*30;s+=st(P,y,n,'end',P-12,y+4)});
 s+=st(P,300,'户部山','start',P+12,304,1)+st(P,345,'师大云龙校区','start',P+12,349)+st(540,390,'中心医院','start',554,394)+st(600,430,'淮塔','end',588,446);
 s+=st(Q,190,'白云山','start',Q+12,194)+st(Q,160,'下淀','start',Q+12,164)+st(Q,300,'天桥','start',Q+12,304)+st(Q,345,'和平大桥','start',Q+12,349);
 s+=`<text x="790" y="435" font-size="12" fill="#2E6DB4">科技城 … 新城区东</text><text x="612" y="500" font-size="12" fill="#3F9A5F">矿大文昌校区 … 高新区南</text>`;
 const tag=(x,y,t,a)=>`<text x="${x}" y="${y}" text-anchor="${a||'end'}" font-size="12.5" font-weight="800" fill="#B23A2E">${t}</text>`;
 s+=tag(P-12,304,'戏马台 · 户部山 · 回龙窝 →')+tag(P-12,Y+48,'文庙街区：出站沿彭城路北行')+tag(x0+dx*17,Y+28,'高铁站','middle');
 s+=`<g font-size="13" font-weight="800"><rect x="40" y="440" width="14" height="6" fill="#C8423A"/><text x="60" y="447">1号线</text><rect x="120" y="440" width="14" height="6" fill="#2E6DB4"/><text x="140" y="447">2号线</text><rect x="200" y="440" width="14" height="6" fill="#3F9A5F"/><text x="220" y="447">3号线</text></g><text x="40" y="472" font-size="12" fill="#6A5F52">示意图：站序依据徐州地铁官网线路数据，2、3号线只画了部分站。</text>`;
 $('#metro').innerHTML=`<svg viewBox="0 0 1200 500" role="img" aria-label="徐州地铁1、2、3号线示意图" font-family="var(--sans)" fill="#2A241E">${s}</svg>`})();

/* =========================================================
   集章册
   ========================================================= */
function renderPass(){return;
 $('#pgrid').innerHTML=O.map(id=>{const s=get(id),g=stamps.includes(id);return `<a class="pst${g?' got':''}" href="#site-${id}" aria-label="${s.n}${g?' 已盖章':' 未盖章'}"><span class="sg">${s.g}</span>${s.n.replace('古民居','').replace('街区','')}</a>`}).join('');
 const n=stamps.length;$('#preward').innerHTML=n>=O.length?`<div class="duo2"><img src="${ip('zq_love')}" alt=""><img src="${ip('bh_love')}" alt=""></div><h4>彭城通关！</h4><p>九枚印章都集齐了。朱雀和白虎谢谢你陪它们逛完彭城。</p><button class="btn small ghost dark" id="reset">清空印章重新玩</button>`
 :`<div class="duo2"><img src="${ip(n?'zq_proud':'zq_ask')}" alt=""><img src="${ip(n?'bh_joy':'bh_peek')}" alt=""></div><h4>已集 ${n} / ${O.length}</h4><div class="meter"><i style="width:${n/O.length*100}%"></i></div><p>${n?'还差 '+(O.length-n)+' 枚，点空的格子去那个景点看看。':'点任意一格，从那个景点开始。'}</p>`;
 $('#reset')&&($('#reset').onclick=()=>{if(confirm('确定清空全部印章吗？')){stamps=[];try{localStorage.removeItem('xz3_stamps')}catch(e){}refresh()}})}

/* =========================================================
   详情 & 灯箱
   ========================================================= */
/* ---------- v5 开放状态 ---------- */
function nowCN(){const p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Shanghai',hour12:false,weekday:'short',hour:'2-digit',minute:'2-digit',month:'numeric'}).formatToParts(new Date());const g=t=>(p.find(x=>x.type===t)||{}).value;
 return {d:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),m:+g('month'),t:(+g('hour')%24)*60+(+g('minute'))}}
const tm=v=>{const [h,m]=v.split(':');return (+h)*60+(+m)};
function status(id){const h=(get(id)||{}).hrs;if(!h)return null;if(h.all)return {c:'ok',t:'全天开放'};
 const n=nowCN();let {o,c,e}=h;if(h.w&&(n.m<4||n.m>10))({o,c,e}=h.w);const sx=h.street?' · 古街区全天可逛':'';
 if(!h.d.includes(n.d))return {c:'off',t:'今日闭馆'+(h.mon?'（法定节假日除外）':'')};
 if(n.t<tm(o))return {c:'soon',t:`未开门 · ${o} 开放${sx}`};
 if(n.t>=tm(e))return {c:'off',t:`${n.t>=tm(c)?'今日已结束开放':'已停止入园'}${sx}`};
 return {c:tm(e)-n.t<=60?'soon':'ok',t:`开放中 · ${e} 停止入园`}}
const stPill=id=>{const s=status(id);if(!s){const x=get(id);return x&&x.info?`<span class="st unk"><i></i>开放时间以景区公告为准</span>`:''}return `<span class="st ${s.c}"><i></i>${s.t}</span>`};
/* ---------- v5 详情页 ---------- */
const D=$('#detail');let lastFocus=null,curD=null;
const TOC=[['d-story','故事'],['d-culture','文化'],['d-tl','年表'],['d-food','美食'],['d-go','怎么到'],['d-rub','拓印'],['d-src','出处']];
const LV={a:'官方 / 原典',b:'公开信息整理',c:'说法不一 · 请现场确认'};
function infoBar(s){const f=s.info;if(!f)return'';const warn=f.off&&!/^无/.test(f.off);
 return `<section class="i5" aria-label="开放信息"><div><small>开放时间</small><b>${f.open}</b></div><div><small>门票</small><b>${f.tix}</b></div><div><small>预约</small><b>${f.book}</b></div><div${warn?' class="warn"':''}><small>闭馆日</small><b>${f.off}</b></div>
 <p class="src"><span class="lv ${f.lv}">${LV[f.lv]}</span>来源：${f.src} · 2026年10月整理 · 节假日可能调整，以官方公告为准</p></section>`}
function mustList(s){if(!s.must)return'';
 return `<div class="must"><div class="mh"><h3>看展清单</h3><p>${s.must.length} 件值得专门去找的馆藏。尺寸、出土地与编号来自徐州博物馆官网“典藏”栏目，配图为依馆藏图重绘的插画。</p></div><ol>${s.must.map((m,i)=>`<li>${m[0]?`<img src="${art(m[0])}" alt="" loading="lazy">`:`<span class="no">${String(i+1).padStart(2,'0')}</span>`}<div><b>${m[1]}</b><small>${m[2]}</small><small>出土：${m[3]} · 编号 ${m[4]}</small></div></li>`).join('')}</ol></div>`}
function storyOf(s){if(s.story)return s.story;const F=[[.5,.5,1],[.38,.48,1.4],[.62,.55,1.4],[.5,.45,1.15]];
 return s.tl.map((t,i)=>({k:t[0],t:'',d:t[1],f:F[i%4]}))}
function openDetail(id,push=true){const s=get(id);if(!s)return;if(D.hidden)lastFocus=document.activeElement;curD=id;
 const i=A.indexOf(id),nx=get(A[(i+1)%A.length]),pv=get(A[(i+A.length-1)%A.length]);
 const g=s.gallery.map(x=>({src:art(x[0]),t:x[1],d:x[2],kind:'paint',st:'钢笔淡彩',nat:x[3]}));const c=s.col||[];const by=k=>c.find(x=>x.kind===k);
 const seq=[g[0],by('rub'),by('cut'),by('wood'),by('stamp'),g[1],g[2],g[3]];
 const SL=[[1,3,33,-1.5],[37,0,29,1.5],[69,2,26,-2.5],[2,46,30,2],[36,40,18,-3],[57,46,24,-1],[72,60,24,2.5],[24,74,22,-2]];
 const list=[];let items='';
 seq.forEach((it,k)=>{if(!it)return;const [l,t,w,r]=SL[k];const n=list.push(it)-1;
  items+=`<figure class="ci ${it.kind}" style="left:${l}%;top:${t}%;width:${w}%;--r:${r}deg;--d:${k*60}ms" data-k="${n}" tabindex="0" role="button" aria-label="放大查看${it.t}"><div class="im"><img src="${it.src}" alt="${it.t}" loading="lazy"${it.kind=='rub'?' onload="window.XZfit&&XZfit(this)"':''}></div><figcaption><b>${it.t}</b><span>${it.st}</span></figcaption></figure>`});
 const ST=storyOf(s),p=path('east',id);
 const tun=s.tunnel?`<section class="tun" id="d-tun" aria-label="提灯走甬道"><div class="tun-in" id="tunIn"><img src="${art(s.tunnel.img)}" alt="龟山汉墓甬道插画">${s.tunnel.caps.map(c=>`<p class="tcap" style="left:${c[0]*100}%;top:${c[1]*100}%" data-x="${c[0]}" data-y="${c[1]}">${c[2]}</p>`).join('')}<div class="dark"></div></div><p class="thint">移动鼠标或手指，提灯照亮甬道</p></section>`:'';
 D.innerHTML=`<div class="v5bar"><button id="dClose" class="bk" aria-label="返回">‹ <span>返回</span></button><b class="bt">${s.n}</b><nav class="d-toc" aria-label="本页目录">${TOC.map(([k,t])=>`<button data-t="${k}">${t}</button>`).join('')}</nav><a class="bnav" href="${amapTo(id)}" target="_blank" rel="noopener">导航 ↗</a></div>
 <article class="dv5">
 <header class="h5"><p class="eye">${s.tag} · ${s.era}</p><h1>${s.n}</h1><p class="sub">${s.line}</p><div class="h5act">${stPill(id)}<button class="pcbtn" type="button" data-pc="${id}">生成明信片</button></div></header>
 <figure class="h5img"><img src="${art(s.cover)}" alt="${s.n}插画"></figure>
 ${infoBar(s)}
 <section class="intro5"><p class="lead5">${s.lead}</p><dl><div><dt>建议停留</dt><dd>${s.time}</dd></div><div><dt>${s.go.m}</dt><dd>${s.go.l}</dd></div><div><dt>小贴士</dt><dd>${s.go.tip}</dd></div></dl></section>
 <section class="story" id="d-story" aria-label="${s.n}的故事"><div class="stk"><div class="frame"><div class="cam" id="cam"><img class="ia on" src="${art(ST[0].img||s.cover)}" alt=""><img class="ib" alt=""></div><div class="spin" id="spin"><i></i><span></span></div></div><div class="sdots">${ST.map((_,k)=>`<button data-s="${k}" aria-label="第${k+1}段"></button>`).join('')}</div></div>
  <div class="steps">${ST.map((x,k)=>`<div class="step" data-s="${k}"><div class="sc"><p class="eye">${x.k}</p>${x.t?`<h3>${x.t}</h3>`:''}<p>${x.d}</p></div></div>`).join('')}</div></section>
 ${tun}${window.V6?V6.moment(s):''}
 <section class="d5" id="d-culture"><header class="sh"><p class="eye">文化</p><h2>${s.culture.t}</h2><p>${s.culture.d}</p></header><div class="board">${items}</div>${mustList(s)}</section>
 <section class="d5" id="d-tl"><header class="sh"><p class="eye">年表</p><h2>时间里的${s.n}</h2></header><ol class="tl5">${s.tl.map(t=>`<li><b>${t[0]}</b><p>${t[1]}</p></li>`).join('')}</ol></section>
 <section class="d5" id="d-food"><header class="sh"><p class="eye">美食</p><h2>逛累了，来一口</h2></header><div class="f5"><img src="${art('food_'+s.food.k)}" alt="${s.food.n}插画" loading="lazy"><div><small>附近可尝</small><h3>${s.food.n}</h3><p>${s.food.d}</p></div></div></section>
 <section class="d5" id="d-go"><header class="sh"><p class="eye">怎么到</p><h2>从徐州东站出发</h2><p>全程约 ${p?p.min:'—'} 分钟（估算），出发前用导航确认实时信息。</p></header>
  <div class="g5"><ol>${p?p.legs.map(l=>{const [cc,gg]=MC[l.mode];return `<li style="--c:${cc}"><span class="m">${gg}</span><div><b>${l.mode} · 约${l.min}分</b><p>${l.txt}</p><small>到 ${NAME(l.to)}</small></div></li>`}).join(''):''}</ol>
  <div class="acts"><a class="b5 pri" href="${amapTo(id)}" target="_blank" rel="noopener">高德导航 ↗</a><button class="b5" data-plan="${id}">换个起点规划</button><button class="b5" data-trip="${id}">加入我的行程</button></div></div></section>
 ${window.V6?V6.srcSec(s):''}
 <nav class="dnext" aria-label="上一站下一站"><a href="#site-${pv.id}"><img src="${art(pv.cover)}" alt=""><span><small>上一站</small><b>${pv.n}</b></span></a><a href="#site-${nx.id}"><img src="${art(nx.cover)}" alt=""><span><small>下一站</small><b>${nx.n}</b></span></a></nav>
 </article>`;
 D.hidden=false;D.scrollTop=0;document.body.style.overflow='hidden';
 $('#dClose').onclick=closeDetail;
 $('[data-plan]',D).onclick=()=>{closeDetail();planTo(id,'east')};
 $('[data-trip]',D).onclick=e=>{addTrip(id);e.currentTarget.textContent='已加入行程 ✓'};
 $$('.board figure',D).forEach(f=>{const o=()=>openLB(list,+f.dataset.k);f.onclick=o;f.onkeydown=e=>{if(e.key==='Enter')o()}});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{root:D,threshold:.12});$$('.ci,.tl5 li,.f5,.g5,.sh,.i5,.intro5,.must',D).forEach(el=>io.observe(el));
 detailInit(s,ST);window.V6&&V6.afterDetail(D,s);
 if(push&&location.hash!=='#site-'+id)history.pushState(null,'','#site-'+id);$('#dClose').focus({preventScroll:true});emit('detail',id)}

/* v5 背景纹样：汉代云气纹 + 景点专属线稿 */
const CLP=['<path d="M20 140 C90 140 120 80 175 78 C228 76 238 132 200 138 C172 142 166 108 190 104"/><path d="M30 152 C100 154 130 96 178 92 C214 90 222 122 204 126"/><path d="M175 78 C210 40 290 30 330 62 C362 88 348 124 318 118 C296 113 302 88 322 92"/><path d="M250 44 C268 20 300 12 318 26"/><path d="M330 62 C350 52 372 54 388 66"/><path d="M98 120 C108 98 130 92 142 104 C150 112 144 124 134 120"/>',
'<path d="M10 120 C60 60 130 130 170 100 C200 78 186 46 160 52 C140 57 146 82 164 78"/><path d="M170 100 C220 70 260 110 300 88 C330 72 360 70 380 90"/><path d="M300 88 C310 60 340 48 358 62 C370 72 362 88 350 84"/><path d="M22 134 C70 86 132 146 178 114"/><path d="M200 118 C240 98 270 130 310 110"/>',
'<path d="M190 150 C150 150 110 120 120 82 C128 52 170 46 184 70 C194 88 178 104 164 96"/><path d="M120 82 C80 70 50 90 40 120 C34 140 50 152 64 144"/><path d="M184 70 C200 40 250 30 280 50 C304 66 300 96 278 98 C262 99 258 82 270 78"/><path d="M280 50 C310 36 350 44 370 66"/><path d="M200 160 C240 162 300 150 340 120"/>'];
window.XZ_CLP=CLP;
const cloud=(v,cls,st,k)=>`<i class="dk cl ${cls||''}" style="${st}" data-k="${k}" aria-hidden="true"><svg viewBox="0 0 400 170" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${CLP[v]}</svg></i>`;
const motif=(id,cls,st,k)=>`<i class="dk mo ${cls||''}" style="${st}" data-k="${k}" aria-hidden="true"><img src="assets/motif/${id}.webp" alt="" loading="lazy"></i>`;
const DL=x=>`left:calc(50% - 50vw + ${x}vw)`,DR=x=>`right:calc(50% - 50vw + ${x}vw)`;
function decorate(root,id){const put=(sel,html)=>{const el=$(sel,root);if(el)el.insertAdjacentHTML('afterbegin',html)};
 put('.h5',cloud(0,'',`${DL(2)};top:-10px;width:min(24vw,360px)`,.18)+cloud(2,'',`${DR(3)};top:150px;width:min(20vw,300px)`,.1));
 put('.story',motif(id,'big',`${DR(4)};top:-40px;width:min(30vw,460px)`,.14)+cloud(1,'mh',`${DL(1)};top:55%;width:min(18vw,280px)`,.22));
 put('#d-culture',cloud(0,'fl',`${DR(2)};top:-20px;width:min(24vw,360px)`,.16)+cloud(2,'mh',`${DL(0)};bottom:12%;width:min(16vw,240px)`,.2));
 put('#d-tl',motif(id,'fl mh',`${DR(5)};top:10px;width:min(24vw,360px)`,.12));
 put('#d-food',cloud(1,'',`${DL(2)};top:0;width:min(22vw,320px)`,.18));
 put('#d-go',cloud(2,'fl',`${DR(2)};top:30%;width:min(22vw,320px)`,.16)+motif(id,'sm mh',`${DL(3)};bottom:-60px;width:min(18vw,260px)`,.1));
 return $$('.dk',root)}
function parallax(list){const vh=innerHeight;list.forEach(el=>{const p=el.parentElement.getBoundingClientRect(),c=p.top+el.offsetTop+el.offsetHeight/2;if(c<-vh||c>vh*2)return;el.style.transform=`translate3d(0,${((c-vh/2)*+el.dataset.k).toFixed(1)}px,0)`})}

/* 首页背景云气纹 */
(()=>{const put=(sel,h)=>{const el=$(sel);if(el){el.style.position='relative';el.insertAdjacentHTML('afterbegin',h)}};
 put('#sites',cloud(0,'fl',`${DR(3)};top:60px;width:min(26vw,380px)`,.15)+cloud(2,'mh',`${DL(1)};bottom:8%;width:min(18vw,260px)`,.2));
 put('#go',cloud(1,'',`${DR(2)};top:40px;width:min(24vw,340px)`,.15));
 const H=$$('#sites>.dk,#go>.dk');let rq=0;addEventListener('scroll',()=>{if(!rq)rq=requestAnimationFrame(()=>{rq=0;parallax(H)})},{passive:true});parallax(H)})();
function detailInit(s,ST){const nav=$('.d-toc',D),bs=$$('button',nav),bar=$('.v5bar',D),DK=decorate(D,s.id);
 const top=el=>el.getBoundingClientRect().top-D.getBoundingClientRect().top+D.scrollTop;
 bs.forEach(b=>b.onclick=()=>{const el=document.getElementById(b.dataset.t);if(el)D.scrollTo({top:top(el)-70,behavior:'smooth'})});
 const cam=$('#cam'),ia=$('.ia',cam),ib=$('.ib',cam),spin=$('#spin'),steps=$$('.step',D),dots=$$('.sdots button',D);let cur=-1,front=ia,curImg=ST[0].img||s.cover;
 dots.forEach(d=>d.onclick=()=>{const el=steps[+d.dataset.s];D.scrollTo({top:top(el)-innerHeight*.25,behavior:'smooth'})});
 function setStep(k){if(k===cur)return;cur=k;const x=ST[k],im0=x.img||s.cover,cv=window.V6?V6.conv(im0,!!x.fit):(a,b)=>[a,b];let [fx,fy,fk]=x.f||[.5,.5,1];[fx,fy]=cv(fx,fy);
  steps.forEach((el,j)=>el.classList.toggle('on',j===k));dots.forEach((el,j)=>el.classList.toggle('on',j===k));
  const im=im0;if(im!==curImg){curImg=im;const back=front===ia?ib:ia;back.src=art(im);back.classList.toggle('fit',!!x.fit);back.classList.add('on');front.classList.remove('on');front=back}else front.classList.toggle('fit',!!x.fit);
  const m=(1-1/fk)/2,sx=Math.max(-m,Math.min(m,.5-fx)),sy=Math.max(-m,Math.min(m,.5-fy));
  cam.style.transform=`scale(${fk}) translate(${(sx*100).toFixed(2)}%,${(sy*100).toFixed(2)}%)`;
  if(x.p){const [qx,qy]=cv(x.p[0],x.p[1]),px=.5+(qx-.5+sx)*fk,py=.5+(qy-.5+sy)*fk;spin.style.left=px*100+'%';spin.style.top=py*100+'%';$('span',spin).textContent=x.p[2];spin.classList.add('on')}else spin.classList.remove('on')}
 setStep(0);
 /* 提灯 */
 const T=$('#tunIn');if(T){const caps=$$('.tcap',T);let auto=true;
  const light=(x,y)=>{T.style.setProperty('--x',x*100+'%');T.style.setProperty('--y',y*100+'%');const r=T.getBoundingClientRect();
   caps.forEach(c=>{const dx=(x-c.dataset.x)*r.width,dy=(y-c.dataset.y)*r.height;c.classList.toggle('lit',Math.hypot(dx,dy)<Math.max(120,r.width*.14))})};
  const mv=e=>{auto=false;const r=T.getBoundingClientRect(),pt=e.touches?e.touches[0]:e;light((pt.clientX-r.left)/r.width,(pt.clientY-r.top)/r.height)};
  T.addEventListener('pointermove',mv);T.addEventListener('touchmove',mv,{passive:true});T.addEventListener('pointerleave',()=>auto=true);
  T._auto=()=>{if(!auto)return;const r=T.getBoundingClientRect(),q=Math.max(0,Math.min(1,(innerHeight*.75-r.top)/(r.height+innerHeight*.3)));light(.25+q*.5,.25+q*.5)};light(.25,.25)}
 let raf=0;const upd=()=>{raf=0;let k=-1;TOC.forEach(([id],j)=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<innerHeight*.4)k=j});
  if(D.scrollTop+D.clientHeight>=D.scrollHeight-4)k=TOC.length-1;
  bs.forEach((b,j)=>{b.classList.toggle('on',j===k);j===k?b.setAttribute('aria-current','true'):b.removeAttribute('aria-current')});
  bar.classList.toggle('solid',D.scrollTop>40);
  const on=bs[k];if(on&&innerWidth<=720){const r=on.getBoundingClientRect(),nr=nav.getBoundingClientRect();if(r.left<nr.left||r.right>nr.right)nav.scrollTo({left:on.offsetLeft-16,behavior:'smooth'})}
  let sk=0;steps.forEach((el,j)=>{if(el.getBoundingClientRect().top<innerHeight*.55)sk=j});setStep(sk);
  T&&T._auto();parallax(DK)};
 D.onscroll=()=>{if(!raf)raf=requestAnimationFrame(upd)};upd()}
function closeDetail(){if(D.hidden)return;D.hidden=true;document.body.style.overflow='';curD=null;if(location.hash.startsWith('#site-'))history.pushState(null,'',location.pathname+location.search);lastFocus&&lastFocus.focus&&lastFocus.focus()}
const LB=$('#lb');let lbS,lbK;
function openLB(L2,k){lbS=L2;lbK=k;const g=L2[k];LB.innerHTML=`<div class="lbb"><button id="lbX" aria-label="关闭">×</button></div><button class="side prev" aria-label="上一张">‹</button><img src="${g.src}" alt="${g.t}"><div class="cap"><b>${g.t}</b><small>${g.st||''}${g.nat?` · <em class="nat">${g.nat}</em>`:''}</small>${g.d}${g.rel?`<span class="rel">与景点：${g.rel}</span>`:''}</div><button class="side next" aria-label="下一张">›</button>`;LB.hidden=false;
 $('#lbX').onclick=()=>LB.hidden=true;$('.prev',LB).onclick=()=>openLB(L2,(k+L2.length-1)%L2.length);$('.next',LB).onclick=()=>openLB(L2,(k+1)%L2.length);$('#lbX').focus()}
LB.onclick=e=>{if(e.target===LB)LB.hidden=true};
addEventListener('keydown',e=>{if(e.key==='Escape'){if(!LB.hidden)LB.hidden=true;else closeDetail()}if(!LB.hidden&&e.key==='ArrowRight')openLB(lbS,(lbK+1)%lbS.length);if(!LB.hidden&&e.key==='ArrowLeft')openLB(lbS,(lbK+lbS.length-1)%lbS.length)});
function goPlay(id){if(!GAMES.includes(id)){openDetail(id);return}closeDetail();emit('play',id);document.getElementById('play').scrollIntoView({behavior:'smooth'})}
function route_(){const h=location.hash;if(h.startsWith('#site-'))openDetail(h.slice(6),false);else{closeDetail();if(h.startsWith('#play-')){const id=h.slice(6);if(get(id))setTimeout(()=>goPlay(id),60)}}}
addEventListener('popstate',route_);addEventListener('hashchange',route_);
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#play-"]');if(a){e.preventDefault();goPlay(a.getAttribute('href').slice(6))}});

window.XZ={status,addTrip,get,art,ip,esc,on,emit,stamp,has:id=>stamps.includes(id),stamps:()=>stamps.slice(),openDetail,closeDetail,goPlay,goStop:id=>{document.getElementById('scroll').scrollIntoView();setTimeout(()=>goStop(O.indexOf(id)),50)},planTo,path,NAME,modes,amapTo,openLB,decorate,parallax,cloud,stPill,curStop:()=>curI>=0?O[curI]:null};
function renderSites(){const g=$('#sgrid');if(!g)return;const CH=window.CHAPTERS;let n=0;
 const cardH=id=>{const s=get(id);n++;return `<a class="sc5" href="#site-${id}"><div class="im"><img src="${art(s.cover)}" alt="" loading="lazy"></div><div class="tx"><small>${String(n).padStart(2,'0')} · ${s.era.split(' · ')[0]}</small><h3>${s.n}</h3><p>${s.line}</p>${s.lead?`<p class="ld6">${s.lead}</p>`:''}${stPill(id)}</div></a>`};
 g.innerHTML=CH?CH.map((c,k)=>`<section class="chap ct${k+1}" aria-label="${c[0]}"><header class="chh"><span class="chn">${['壹','贰','叁'][k]}</span><div><h3>${c[0]}</h3><p><small>${c[1]}</small>${c[2]}</p></div>${(()=>{const q=(window.CHQ||[])[k];return q?`<figure class="q7"><blockquote>${q.q.map(x=>`<span>${x}</span>`).join('')}</blockquote><figcaption>${q.c} · ${q.s}</figcaption></figure>`:''})()}</header><div class="cgrid n${c[3].length}">${c[3].map(cardH).join('')}</div></section>`).join(''):O.map(cardH).join('')}
renderSites();setInterval(renderSites,60000);
layout();renderPlanner();renderBuilder();renderPass();setTimeout(route_,0);
})();
