/* 汉韵彭城 v6 · 汉代三绝（拓印）、彭城手艺、关于本作品、纹样与出处、明信片、玉衣放大镜 */
(()=>{
const X=window.XZ,$=(q,e=document)=>e.querySelector(q),$$=(q,e=document)=>[...e.querySelectorAll(q)];
const art=X.art,ip=X.ip,get=X.get,esc=X.esc;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const LV={a:['官方 / 原典','a'],b:['公开信息整理','b'],c:['待核实','c']};
const lvTag=l=>`<span class="lv ${l}">${LV[l][0]}</span>`;
/* ---------- 故事坐标：原图坐标 → 3:2 画框坐标 ---------- */
function conv(img,fit){const A=(window.ASP||{})[img]||1.5,F=1.5;
 return (x,y)=>{if(!fit){if(A>F)x=(x-.5)*A/F+.5;else y=(y-.5)*F/A+.5}else{if(A>F)y=(y-.5)*F/A+.5;else x=(x-.5)*A/F+.5}return [x,y]}}
/* ---------- 详情页：玉衣放大镜 ---------- */
const YY=[[.5,.66,'玉片','据馆方及公开资料，这件玉衣由4248片玉片组成。玉片磨成方形、长方形等形状，在边角钻孔。'],
 [.33,.68,'金丝','玉片之间用金丝穿孔缀合，所以叫“金缕”。据公开资料，用去金丝约1576克。'],
 [.16,.6,'头部','头罩和脸盖单独制作，再与衣身相接。'],
 [.84,.57,'足部','脚上也是玉片缀成的“鞋”。'],
 [.48,.22,'分件制作','上衣、袖筒、手套、裤筒等分件制作，再整体组合（插画为依馆藏图重绘的示意）。']];
function moment(s){if(s.id!=='bwg')return'';
 return `<section class="d5 lens6" id="d-lens" aria-label="近看金缕玉衣"><header class="sh"><p class="eye">近看</p><h2>拿放大镜看玉衣</h2><p>移动放大镜，或点下面的部位。汉代只有帝王和诸侯王才能用“金缕”，等级更低的用银缕、铜缕。</p></header>
 <div class="lw"><figure class="lfig" id="lfig"><img src="${art('bwg_yy')}" alt="西汉金缕玉衣插画（依馆藏图重绘）" draggable="false"><div class="lglass" id="lglass" aria-hidden="true"></div></figure>
 <div class="lside"><div class="lseg" role="group" aria-label="玉衣部位">${YY.map((h,i)=>`<button type="button" data-h="${i}" aria-pressed="${!i}">${h[2]}</button>`).join('')}</div><div class="lcap" id="lcap" aria-live="polite"></div><p class="lsrc"><span class="lv b">公开信息整理</span>数字来自徐州博物馆介绍及公开资料；插画依馆藏图重绘，细节为示意。</p></div></div></section>`}
function lensInit(D){const F=$('#lfig',D);if(!F)return;const G=$('#lglass',F),img=$('img',F),cap=$('#lcap',D),bs=$$('.lseg button',D),Z=2.6;
 G.style.backgroundImage=`url(${img.src})`;
 const put=(x,y,snap)=>{const r=F.getBoundingClientRect(),g=G.offsetWidth/2;G.style.left=x*r.width+'px';G.style.top=y*r.height+'px';
  G.style.backgroundSize=`${r.width*Z}px ${r.height*Z}px`;G.style.backgroundPosition=`${-(x*r.width*Z-g)}px ${-(y*r.height*Z-g)}px`;
  let k=snap;if(k==null){let best=1e9;YY.forEach((h,i)=>{const d=Math.hypot((h[0]-x)*r.width,(h[1]-y)*r.height);if(d<best){best=d;k=i}});if(best>r.width*.14)k=-1}
  if(k>=0){cap.innerHTML=`<b>${YY[k][2]}</b>${YY[k][3]}`;bs.forEach((b,j)=>b.setAttribute('aria-pressed',j===k))}};
 const mv=e=>{const r=F.getBoundingClientRect();put(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height)))};
 F.addEventListener('pointermove',mv);F.addEventListener('pointerdown',mv);
 bs.forEach((b,i)=>b.onclick=()=>put(YY[i][0],YY[i][1],i));
 const go=()=>put(YY[0][0],YY[0][1],0);img.complete?go():img.onload=go;addEventListener('resize',go)}
/* ---------- 详情页：纹样与出处 ---------- */
function srcSec(s){const m=(window.MOTIF||{})[s.id],L=(window.SRC||{})[s.id]||[];
 return `<section class="d5 src6" id="d-src" aria-label="纹样与出处"><header class="sh"><p class="eye">出处</p><h2>纹样与出处</h2><p>页面里的每一处装饰和每一条信息，都尽量说清楚它从哪里来。</p></header>
 <div class="s6g">${m?`<article class="s6c mo6"><div class="mi"><img src="assets/motif/${s.id}.webp" alt="" loading="lazy"></div><div><small>本页纹样</small><h3>${m[0]}</h3><p>${m[1]}</p></div></article>`:''}
 <article class="s6c cl6"><div class="mi"><svg viewBox="0 0 400 170" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true">${window.XZ_CLP?XZ_CLP[0]:''}</svg></div><div><small>背景纹样</small><h3>汉代云气纹</h3><p>${window.CLOUD_NOTE||''}</p></div></article>
 <article class="s6c ls6"><small>资料来源</small><ul>${L.map(x=>`<li>${lvTag(x[2])}<div><b>${x[0]}</b><span>${x[1]}</span></div></li>`).join('')}<li>${lvTag(s.info&&s.info.lv||'b')}<div><b>开放信息</b><span>${s.info?s.info.src:'—'} · 2026年10月整理</span></div></li></ul>
 <p class="aiN">插画、拓片 / 剪纸 / 木刻 / 邮票风格素材为 AI 辅助生成、团队筛选修改的示意图，不代表文物和建筑的真实样貌。<a href="#about" data-ab="ai">AI 使用说明</a></p></article></div></section>`}
/* ---------- 明信片 ---------- */
let PC=null;
function postcard(id){const s=get(id);if(!s)return;const stp=(s.col||[]).find(c=>c.kind==='stamp')||(s.col||[])[0];
 const d=new Date(),ds=`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
 if(!PC){PC=document.createElement('div');PC.className='pc6';PC.hidden=true;PC.setAttribute('role','dialog');PC.setAttribute('aria-modal','true');PC.setAttribute('aria-label','明信片');document.body.appendChild(PC);
  PC.addEventListener('click',e=>{if(e.target===PC)closePC()});addEventListener('keydown',e=>{if(e.key==='Escape'&&!PC.hidden){e.stopImmediatePropagation();closePC()}},true)}
 PC.innerHTML=`<div class="pcbox"><div class="pchd"><b>寄一张${s.n}</b><button class="pcx" aria-label="关闭">×</button></div>
 <div class="card6" id="card6"><div class="cimg"><img src="${art(s.cover)}" alt=""></div><div class="ctx"><div class="ctop"><span class="cseal">汉韵<br>彭城</span>${stp?`<span class="cstamp"><img src="${stp.src}" alt=""></span>`:''}</div>
  <h3>${s.n}</h3><p>${s.line}</p><div class="cmsg" contenteditable="true" role="textbox" aria-label="写一句话" spellcheck="false">${s.culture.t}，下次一起来。</div><small>${ds} · 徐州</small><img class="cmo" src="assets/motif/${s.id}.webp" alt=""></div></div>
 <p class="pchint" id="pchint">点卡片右侧的文字可以改成你想说的话。</p>
 <div class="pcact"><button class="b5 pri" id="pcdl" type="button">下载图片</button><button class="b5" id="pccp" type="button">复制景点链接</button></div></div>`;
 PC.hidden=false;$('.pcx',PC).onclick=closePC;$('.pcx',PC).focus();
 $('#pccp',PC).onclick=async e=>{const u=location.href.split('#')[0]+'#site-'+id;try{await navigator.clipboard.writeText(u);e.target.textContent='已复制 ✓'}catch(_){$('#pchint',PC).textContent='复制失败，可以手动复制地址：'+u}};
 $('#pcdl',PC).onclick=()=>drawPC(s,ds,stp)}
function closePC(){if(PC)PC.hidden=true;const b=$('.pcbtn');b&&b.focus()}
const loadImg=src=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=src});
async function drawPC(s,ds,stp){const hint=$('#pchint',PC);try{await document.fonts.ready;
 const W=1800,H=1200,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 g.fillStyle='#FBF7EF';g.fillRect(0,0,W,H);g.strokeStyle='rgba(31,26,21,.15)';g.lineWidth=2;g.strokeRect(30,30,W-60,H-60);
 const im=await loadImg(art(s.cover));const bw=1040,bh=H-120,r=Math.max(bw/im.width,bh/im.height),sw=bw/r,sh=bh/r;g.drawImage(im,(im.width-sw)/2,(im.height-sh)/2,sw,sh,60,60,bw,bh);
 const x0=1160;g.fillStyle='#B23A2E';g.fillRect(x0,90,96,96);g.fillStyle='#FBF7EF';g.font='900 36px XZSerif,serif';g.textAlign='center';g.fillText('汉韵',x0+48,132);g.fillText('彭城',x0+48,172);
 if(stp){const si=await loadImg(stp.src);const k=Math.min(200/si.width,240/si.height);g.drawImage(si,W-100-si.width*k,90,si.width*k,si.height*k)}
 g.textAlign='left';g.fillStyle='#1F1A15';g.font='900 84px XZSerif,serif';g.fillText(s.n,x0,440);
 g.fillStyle='#6B6157';g.font='500 34px XZSerif,serif';g.fillText(s.line,x0,500);
 g.strokeStyle='rgba(31,26,21,.18)';g.lineWidth=2;for(let k=0;k<4;k++){g.beginPath();g.moveTo(x0,640+k*80);g.lineTo(W-100,640+k*80);g.stroke()}
 const msg=($('.cmsg',PC).textContent||'').trim().slice(0,48);g.fillStyle='#1F1A15';g.font='600 40px XZSerif,serif';
 let line='',y=625;for(const ch of msg){if(g.measureText(line+ch).width>W-100-x0){g.fillText(line,x0,y);line='';y+=80}line+=ch}g.fillText(line,x0,y);
 g.fillStyle='#9A8F82';g.font='500 28px XZSerif,serif';g.fillText(ds+' · 徐州 · 汉韵彭城',x0,H-110);
 const url=c.toDataURL('image/png');const a=document.createElement('a');a.href=url;a.download=`汉韵彭城-${s.n}.png`;document.body.appendChild(a);a.click();a.remove();hint.textContent='已生成，开始下载。'}
 catch(e){hint.textContent='当前浏览器限制了图片导出（例如直接双击打开本地文件时）。可以截图保存，或在网页部署后再下载。'}}
/* ---------- 详情页初始化 ---------- */
function afterDetail(D,s){const b=$('.pcbtn',D);if(b)b.onclick=()=>postcard(s.id);lensInit(D);
 $$('[data-ab]',D).forEach(a=>a.onclick=e=>{e.preventDefault();X.closeDetail();setTimeout(()=>{openAbout(a.dataset.ab)},60)});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{root:D,threshold:.1});$$('.s6c,.lw',D).forEach(el=>io.observe(el))}
window.XZfit=im=>{const f=im.closest('.ci');if(!f||innerWidth<=720||f.dataset.w)return;const a=im.naturalHeight/im.naturalWidth;if(a>1.05){f.dataset.w=1;f.style.width=parseFloat(f.style.width)*1.05/a+'%'}};
window.V6={conv,moment,srcSec,afterDetail,postcard};

/* =========================================================
   首页：汉代三绝
   ========================================================= */
const SJ=window.SANJUE||[];
$('#sanjue .sjg').innerHTML=`<div class="sjl">${SJ.slice(0,2).map((x,i)=>`<a class="sjc" href="#site-${x.site}"><div class="im"><img src="${art(x.img)}" alt="" loading="lazy"></div><div class="tx"><small>第${['一','二','三'][i]}绝 · ${x.k}</small><h3>${x.t}</h3><p>${x.d}</p><span class="more">${x.act} →</span></div></a>`).join('')}</div>
 <div class="sjr"><div class="rubh"><small>第三绝 · ${SJ[2].k}</small><h3>${SJ[2].t}</h3><p>${SJ[2].d}</p></div>
 <div class="rubw"><div class="rub" id="rub"><img src="assets/img/col/bwg_rub.webp" alt="东汉朱雀行龙画像石拓片（依馆藏重绘）" draggable="false"><canvas id="rubc" aria-hidden="true"></canvas><p class="rubtip" id="rubtip"><span>按住拖动</span>像拓工一样，把画像拓出来</p></div>
 <div class="rubs"><div class="rubm"><span>拓印进度</span><b id="rubp">0%</b></div><div class="rubbar"><i id="rubb"></i></div>
 <div class="rubdone" id="rubdone" hidden><b>朱雀行龙（墓门）</b><p>东汉画像石，102×84×14厘米，铜山散存，徐州博物馆藏。上为朱雀、下为行龙。网站的 IP“朱雀”，就是从这类汉画里飞出来的。</p><small><span class="lv a">官方</span>尺寸与出处：徐州博物馆官网“典藏”；图为依馆藏图重绘的拓片风格插画。</small></div>
 <div class="rubact"><button class="b5" id="rubAll" type="button">一键拓完</button><button class="b5" id="rubRe" type="button">重新拓</button></div>
 <p class="rubn">真实的拓片是把湿纸覆在石面上，用拓包蘸墨轻拍，凸起处着墨、凹处留白。这里用手指或鼠标模拟这个过程。</p></div></div></div>`;
(function rubInit(){const box=$('#rub'),cv=$('#rubc'),g=cv.getContext('2d'),tip=$('#rubtip');const GX=14,GY=18;let cells,done=false,drag=false,last=null;
 function paper(){const r=box.getBoundingClientRect(),dp=Math.min(2,devicePixelRatio||1);cv.width=r.width*dp;cv.height=r.height*dp;g.setTransform(dp,0,0,dp,0,0);
  g.globalCompositeOperation='source-over';g.fillStyle='#EEE5D3';g.fillRect(0,0,r.width,r.height);
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;g.strokeStyle='rgba(120,100,70,.09)';g.lineWidth=1;
  for(let i=0;i<420;i++){const x=rnd()*r.width,y=rnd()*r.height,l=6+rnd()*18,a=rnd()*Math.PI;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke()}
  g.strokeStyle='rgba(31,26,21,.12)';g.setLineDash([4,6]);g.strokeRect(10,10,r.width-20,r.height-20);g.setLineDash([]);
  cells=new Uint8Array(GX*GY);done=false;cv.style.opacity=1;box.classList.remove('done');$('#rubdone').hidden=true;set(0);tip.hidden=false}
 function set(p){$('#rubp').textContent=Math.round(p*100)+'%';$('#rubb').style.width=p*100+'%'}
 function dab(x,y){const r=box.getBoundingClientRect(),R=Math.max(16,r.width*.05);g.globalCompositeOperation='destination-out';
  const gr=g.createRadialGradient(x,y,0,x,y,R);gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(.6,'rgba(0,0,0,.35)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,R,0,7);g.fill();
  const cx=Math.floor(x/r.width*GX),cy=Math.floor(y/r.height*GY),k=Math.ceil(R/(r.width/GX))-1;
  for(let i=-k;i<=k;i++)for(let j=-k;j<=k;j++){const a=cx+i,b=cy+j;if(a>=0&&b>=0&&a<GX&&b<GY)cells[b*GX+a]=Math.min(4,cells[b*GX+a]+1)}
  let n=0;cells.forEach(v=>n+=v>=2);const p=n/(GX*GY);set(Math.min(1,p/.78));if(p>=.78&&!done)finish()}
 function finish(){done=true;set(1);cv.style.opacity=0;box.classList.add('done');$('#rubdone').hidden=false;tip.hidden=true}
 const pos=e=>{const r=box.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
 cv.addEventListener('pointerdown',e=>{if(done)return;drag=true;cv.setPointerCapture(e.pointerId);tip.hidden=true;last=pos(e);dab(...last)});
 cv.addEventListener('pointermove',e=>{if(!drag||done)return;const p=pos(e),d=Math.hypot(p[0]-last[0],p[1]-last[1]),st=Math.max(1,Math.floor(d/14));for(let i=1;i<=st;i++)dab(last[0]+(p[0]-last[0])*i/st,last[1]+(p[1]-last[1])*i/st);last=p});
 ['pointerup','pointercancel'].forEach(t=>cv.addEventListener(t,()=>drag=false));
 $('#rubAll').onclick=finish;$('#rubRe').onclick=paper;
 const img=$('img',box);const go=()=>paper();img.complete?go():img.onload=go;let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{if(!done)paper()},200)})})();

/* =========================================================
   首页：彭城手艺（非遗）
   ========================================================= */
$('#fy .fyg').innerHTML=(window.CRAFTS||[]).map(c=>`<article class="fyc"><div class="im"><img src="${art(c.img)}" alt="${c.n}插画（示意）" loading="lazy"></div><div class="tx"><small>${c.k}</small><h3>${c.n}</h3><p>${c.d}</p><p class="use">${c.use}</p><p class="lvl"><span class="lv b">以名录为准</span>${c.lv}</p></div></article>`).join('');

/* =========================================================
   首页：关于本作品
   ========================================================= */
const SNAME=id=>get(id).n;
const TABS=[['intro','创作说明'],['src','资料来源'],['motif','纹样'],['ip','IP 设计'],['ai','AI <span class="abl">使用</span>说明']];
const P={
intro:`<div class="ab2"><div><h3>为什么做这个</h3><p>徐州是“两汉文化”的重要承载地，但很多游客到了徐州，只知道“有汉墓”。我们想做一个既能用来出行、又能读懂文化的导览：先把门票、开放时间、交通讲清楚，再把每个地方背后的故事、纹样和出处讲明白。</p>
 <h3>三条设计原则</h3><ol class="ab3"><li><b>有出处的文化</b>每条信息标注来源和可信程度；插画标明“示意”或“依馆藏重绘”；传说就写传说。</li><li><b>能动手的汉代</b>提灯走甬道、拓一张画像石、拿放大镜看玉衣——用一个动作记住一个知识点。</li><li><b>真能用上的导览</b>此刻是否开放、从高铁站怎么走、一天怎么排，都能直接算出来。</li></ol></div>
 <div><h3>内容结构</h3><ul class="ab4"><li><b>开卷</b>手绘彭城鸟瞰图，点景点进入详情。</li><li><b>长卷</b>横向滚动的“彭城七里”，九处地方由北向南展开。</li><li><b>九处彭城</b>按“楚汉风云 · 两汉遗珍 · 千年彭城”三个篇章排列。</li><li><b>汉代三绝</b>汉墓、汉兵马俑、汉画像石。</li><li><b>彭城手艺</b>剪纸、香包、柳琴戏、纸塑狮子头。</li><li><b>交通导览</b>任选起终点规划路线，拼一天的行程。</li><li><b>小导游</b>朱雀和白虎回答常见问题（预设问答，不联网）。</li></ul><p class="note">参赛类别：民族文化 · 创新表达。</p></div></div>`,
src:`<p class="ab-l">${lvTag('a')}官方渠道 &nbsp; ${lvTag('b')}公开信息整理 &nbsp; ${lvTag('c')}说法不一或待核实</p><div class="srcg">${(window.ALL||[]).map(id=>`<div class="srcc"><h4>${SNAME(id)}</h4><ul>${((window.SRC||{})[id]||[]).map(x=>`<li>${lvTag(x[2])}<span><b>${x[0]}</b>${x[1]}</span></li>`).join('')}</ul></div>`).join('')}<div class="srcc"><h4>全站通用</h4><ul>${(window.SRC_ALL||[]).map(x=>`<li>${lvTag(x[2])}<span><b>${x[0]}</b>${x[1]}</span></li>`).join('')}</ul></div></div><p class="note">开放时间、门票等信息为 2026 年 10 月整理，节假日可能调整，出行前请以官方公告为准。</p>`,
motif:`<div class="mo2"><div class="moc big"><div class="clouds">${(window.XZ_CLP||[]).map(p=>`<svg viewBox="0 0 400 170" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`).join('')}</div><h4>汉代云气纹</h4><p>${window.CLOUD_NOTE||''}</p></div>
 ${(window.ALL||[]).map(id=>{const m=(window.MOTIF||{})[id];return m?`<div class="moc"><div class="mi"><img src="assets/motif/${id}.webp" alt="" loading="lazy"></div><h4>${SNAME(id)} · ${m[0]}</h4><p>${m[1]}</p></div>`:''}).join('')}</div>`,
ip:`<div class="ip2"><figure class="ipsrc"><img src="assets/img/col/bwg_rub.webp" alt="朱雀行龙画像石拓片风格插画" loading="lazy"><figcaption>原型：东汉《朱雀行龙》墓门画像石（徐州博物馆藏，图为依馆藏重绘）</figcaption></figure>
 <div><h3>从画像石里飞出来的朱雀</h3><p>朱雀、白虎都属于汉代的“四神”（青龙、白虎、朱雀、玄武），常出现在汉代画像石、瓦当和墓门上，守护四方。我们取汉画中朱雀昂首、展翅、长尾的姿态，白虎修长、回首的动势，简化成圆润的形象，再配上一组表情，让它们在网站里带路、讲解。</p>
 <ul class="ab4"><li><b>朱雀</b>主“南方”，网站里负责带路和交通。</li><li><b>白虎</b>主“西方”，负责讲文化、陪你探墓。</li><li><b>配色</b>朱红取自汉代漆器的朱色，底色取自拓片的宣纸色。</li></ul>
 <div class="ipx">${['zq_joy','zq_hype','zq_ask','zq_love','bh_joy','bh_peek','bh_wow','bh_tea'].map(k=>`<img src="${ip(k)}" alt="" loading="lazy">`).join('')}</div><p class="note">IP 形象的设定稿与表情由团队设计；表情图的生成方式见“AI 使用说明”（请按团队实际情况填写）。</p></div></div>`,
ai:`<p>依照赛事要求，如实说明本作品中 AI 工具的使用情况。<b>以下为初稿，请团队按实际情况核对修改。</b></p>
 <table class="aitb"><thead><tr><th>内容</th><th>AI 的参与</th><th>团队的工作</th></tr></thead><tbody>
 <tr><td>景点插画、鸟瞰图</td><td>AI 图像生成工具辅助生成</td><td>确定构图与要素，依实景照片和馆藏图比对、筛选、修改，标注“示意”或“依馆藏重绘”</td></tr>
 <tr><td>拓片 / 剪纸 / 木刻 / 邮票风格素材</td><td>AI 辅助生成</td><td>选题、风格设定、抠图与排版；在说明中写明是否对应真实文物</td></tr>
 <tr><td>九景拓片画稿</td><td>底图为 AI 辅助生成的景点插画</td><td>团队定下拓片规则（白线刻痕、墨底、菱形纹框、竖排题签、“彭城拓本”钤印），用程序批量转绘并逐张检查；页面注明“不是真实拓片”</td></tr>
 <tr><td>隔空拓印（摄像头）</td><td>未使用 AI 模型</td><td>团队设计交互：在本机比较前后两帧画面找出动的位置，转成拓包落点；不识别人脸、不录像、不上传</td></tr>
 <tr><td>IP 形象朱雀、白虎</td><td>表情图：AI 辅助（待团队确认）</td><td>依据汉画像石原型设定形象、配色与性格</td></tr>
 <tr><td>文字内容</td><td>AI 辅助整理资料、润色文字</td><td>查证史实与开放信息，标注来源与可信度，传说与史实分开写</td></tr>
 <tr><td>网页代码</td><td>AI 编程助手辅助编写</td><td>交互设计、测试、修改</td></tr>
 <tr><td>小导游问答</td><td>不使用在线 AI，全部为预设问答</td><td>编写问答库</td></tr></tbody></table>
 <p class="note">网站不收集个人信息；“行程”只保存在你自己的浏览器里。</p>`};
const ab=$('#about .abw');
ab.innerHTML=`<div class="seg6" role="tablist" aria-label="关于本作品">${TABS.map(([k,t],i)=>`<button role="tab" id="abt-${k}" aria-controls="abp" aria-selected="${!i}" tabindex="${i?-1:0}" data-k="${k}">${t}</button>`).join('')}</div><div class="abp" id="abp" role="tabpanel" tabindex="0"></div>`;
const tabs=$$('.seg6 button',ab);
function showTab(k){tabs.forEach(b=>{const on=b.dataset.k===k;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});const p=$('#abp');p.setAttribute('aria-labelledby','abt-'+k);p.innerHTML=P[k];}
tabs.forEach((b,i)=>{b.onclick=()=>showTab(b.dataset.k);b.onkeydown=e=>{const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d){e.preventDefault();const n=tabs[(i+d+tabs.length)%tabs.length];n.focus();showTab(n.dataset.k)}}});
showTab('intro');
const dlg=document.getElementById('about');function openAbout(k){showTab(k||'intro');if(dlg.showModal&&!dlg.open)dlg.showModal();else dlg.setAttribute('open','')}
dlg.querySelector('.abdx').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
window.V6.openAbout=openAbout;
document.addEventListener('click',e=>{const a=e.target.closest('[data-ab]');if(a&&!a.closest('#detail')){e.preventDefault();openAbout(a.dataset.ab)}});

/* 背景云纹 */
(()=>{const put=(sel,h)=>{const el=$(sel);if(el)el.insertAdjacentHTML('afterbegin',h)};
 const DL=x=>`left:calc(50% - 50vw + ${x}vw)`,DR=x=>`right:calc(50% - 50vw + ${x}vw)`;
 put('#sanjue',X.cloud(1,'fl',`${DL(2)};top:40px;width:min(22vw,320px)`,.15));put('#fy',X.cloud(2,'',`${DR(2)};top:30px;width:min(22vw,320px)`,.15));
 const H=$$('#sanjue>.dk,#fy>.dk,#about>.dk');let rq=0;addEventListener('scroll',()=>{if(!rq)rq=requestAnimationFrame(()=>{rq=0;X.parallax(H)})},{passive:true});X.parallax(H)})();
})();
