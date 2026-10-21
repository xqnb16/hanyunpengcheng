/* v8：九景拓片 + 隔空拓印（摄像头动作 → 拓包） */
(function(){const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)');
let CAM=null; // 全局只开一路摄像头
function stopCam(){if(!CAM)return;clearInterval(CAM.raf);CAM.stream.getTracks().forEach(t=>t.stop());CAM.ui&&CAM.ui(false);CAM=null}
addEventListener('visibilitychange',()=>{if(document.hidden)stopCam()});
window.XZstopCam=stopCam;

/* 通用拓印组件：el 内需含 .rb8 容器 */
function Rub(el,o){const box=$('.rb8',el),cv=$('canvas',box),g=cv.getContext('2d'),tip=$('.rt8',el),pp=$('.rp8 b',el),bar=$('.rbar8 i',el),dn=$('.rd8',el),cb=$('.rc8',el),st=$('.rs8',el),pv=$('.rv8',el);
 const GX=20,GY=15;let cells,done=false,drag=false,last=null,W=0,H=0;
 function paper(){const r=box.getBoundingClientRect();if(!r.width)return;W=r.width;H=r.height;const dp=Math.min(2,devicePixelRatio||1);cv.width=W*dp;cv.height=H*dp;g.setTransform(dp,0,0,dp,0,0);
  g.globalCompositeOperation='source-over';g.fillStyle='#EEE5D3';g.fillRect(0,0,W,H);
  let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;g.strokeStyle='rgba(120,100,70,.09)';g.lineWidth=1;
  for(let i=0;i<520;i++){const x=rnd()*W,y=rnd()*H,l=6+rnd()*18,a=rnd()*Math.PI;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke()}
  g.strokeStyle='rgba(31,26,21,.14)';g.setLineDash([4,6]);g.strokeRect(10,10,W-20,H-20);g.setLineDash([]);
  cells=new Uint8Array(GX*GY);done=false;cv.style.opacity=1;box.classList.remove('done');dn.hidden=true;set(0);tip.hidden=false}
 function set(p){pp.textContent=Math.round(p*100)+'%';bar.style.width=p*100+'%'}
 function dab(x,y,s=1){if(done)return;const R=Math.max(16,W*.045)*s;g.globalCompositeOperation='destination-out';
  const gr=g.createRadialGradient(x,y,0,x,y,R);gr.addColorStop(0,'rgba(0,0,0,.5)');gr.addColorStop(.6,'rgba(0,0,0,.3)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,R,0,7);g.fill();
  const cw=W/GX,cx=Math.floor(x/cw),cy=Math.floor(y/(H/GY)),k=Math.max(0,Math.ceil(R/cw)-1);
  for(let i=-k;i<=k;i++)for(let j=-k;j<=k;j++){const a=cx+i,b=cy+j;if(a>=0&&b>=0&&a<GX&&b<GY)cells[b*GX+a]=Math.min(4,cells[b*GX+a]+1)}
  let n=0;cells.forEach(v=>n+=v>=2);const p=n/(GX*GY);set(Math.min(1,p/.8));if(p>=.8)finish()}
 function finish(){if(done)return;done=true;set(1);cv.style.opacity=0;box.classList.add('done');dn.hidden=false;tip.hidden=true;if(CAM&&CAM.el===el)stopCam()}
 const pos=e=>{const r=box.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
 cv.addEventListener('pointerdown',e=>{if(done)return;drag=true;cv.setPointerCapture(e.pointerId);tip.hidden=true;last=pos(e);dab(...last)});
 cv.addEventListener('pointermove',e=>{if(!drag||done)return;const p=pos(e),d=Math.hypot(p[0]-last[0],p[1]-last[1]),n=Math.max(1,Math.floor(d/14));for(let i=1;i<=n;i++)dab(last[0]+(p[0]-last[0])*i/n,last[1]+(p[1]-last[1])*i/n);last=p});
 ['pointerup','pointercancel'].forEach(t=>cv.addEventListener(t,()=>drag=false));
 $('[data-r=all]',el).onclick=finish;$('[data-r=re]',el).onclick=()=>{paper()};
 /* —— 隔空拓印 —— */
 function ui(on){cb.setAttribute('aria-pressed',on);cb.textContent=on?'关闭摄像头':'隔空拓印（开摄像头）';pv.hidden=!on;box.classList.toggle('on8',on);if(!on){st.textContent='';$('.rk8',box).hidden=true}}
 async function startCam(){if(CAM){const mine=CAM.el===el;stopCam();if(mine)return}
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){st.textContent='这个浏览器不支持摄像头调用，可以直接用手指或鼠标拓。';return}
  if(done)paper();st.textContent='正在请求摄像头权限…';
  let stream;try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:320},height:{ideal:240}},audio:false})}
  catch(e){st.textContent=e&&e.name==='NotAllowedError'?'没有拿到摄像头权限。可在浏览器地址栏旁重新允许，或直接用手指 / 鼠标拓。':'摄像头没有打开（'+(e&&e.name||'未知错误')+'），可以直接用手指 / 鼠标拓。';return}
  const v=$('video',pv);v.srcObject=stream;v.muted=true;v.playsInline=true;try{await v.play()}catch(e){}
  const SW=64,SH=48,c=document.createElement('canvas');c.width=SW;c.height=SH;const cx=c.getContext('2d',{willReadFrequently:true});let prev=null;
  const ring=$('.rk8',box);ring.hidden=false;tip.hidden=true;
  CAM={el,stream,ui,raf:0};ui(true);st.textContent='对着摄像头挥手：手在哪儿动，拓包就拍在哪儿。';
  const loop=()=>{if(!CAM||CAM.el!==el)return;if(v.readyState<2)return;
   cx.drawImage(v,0,0,SW,SH);const d=cx.getImageData(0,0,SW,SH).data,gray=new Uint8Array(SW*SH);for(let i=0;i<SW*SH;i++)gray[i]=(d[i*4]*3+d[i*4+1]*6+d[i*4+2])/10;
   if(prev){const CX=16,CY=12,bw=SW/CX,bh=SH/CY,cnt=new Uint16Array(CX*CY);let sx=0,sy=0,n=0;
    for(let y=0;y<SH;y++)for(let x=0;x<SW;x++){const i=y*SW+x;if(Math.abs(gray[i]-prev[i])>28){cnt[Math.floor(y/bh)*CX+Math.floor(x/bw)]++;sx+=x;sy+=y;n++}}
    if(n>SW*SH*.004&&n<SW*SH*.6){const hits=[];cnt.forEach((k,i)=>{if(k>bw*bh*.3)hits.push([k,i])});hits.sort((a,b)=>b[0]-a[0]);
     hits.slice(0,6).forEach(([k,i])=>{const gx=i%CX,gy=Math.floor(i/CX);dab((1-(gx+Math.random())/CX)*W,(gy+Math.random())/CY*H,.9)}); // 镜像
     const mx=(1-sx/n/SW)*W,my=sy/n/SH*H;ring.style.transform=`translate(${mx}px,${my}px)`}}
   prev=gray};
  CAM.raf=setInterval(loop,66)}
 cb.onclick=startCam;
 const img=$('img',box);const go=()=>paper();img.complete?go():img.addEventListener('load',go);
 let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{if(!done&&el.isConnected)paper()},200)});
 return {paper,finish}}
window.XZRub=Rub;

function html(s){const n=s.n;return `<section class="d5 rub8" id="d-rub" aria-label="拓一张${n}"><header class="sh"><p class="eye">拓印</p><h2>拓一张${n}</h2><p>宣纸已经覆在“石面”上。按住拖动，或者打开摄像头隔空挥手，把这张${n}拓片拍出来。</p></header>
 <div class="rw8"><div class="rb8"><img src="assets/img/rub/${s.id}.webp" alt="${n}拓片风格画稿" draggable="false"><canvas aria-hidden="true"></canvas><i class="rk8" hidden></i><p class="rt8"><span>按住拖动</span>像拓工一样轻拍宣纸</p>
  <div class="rv8" hidden><video aria-label="摄像头画面（仅在本机处理，不上传）"></video></div></div>
 <div class="rside8"><div class="rp8"><span>拓印进度</span><b>0%</b></div><div class="rbar8"><i></i></div>
  <div class="rd8" hidden><b>${n} · 拓本</b><p>拓好了。可以把这张拓片存下来，做壁纸或者发给同去的朋友。</p><a class="b5 pri" href="assets/img/rub/${s.id}.webp" download="${n}拓片.webp">保存拓片</a></div>
  <div class="ract8"><button class="b5 pri rc8" type="button" aria-pressed="false">隔空拓印（开摄像头）</button><button class="b5" type="button" data-r="all">一键拓完</button><button class="b5" type="button" data-r="re">重新拓</button></div>
  <p class="rs8" role="status" aria-live="polite"></p>
  <p class="rn8">隔空拓印：画面只在你的设备上做“前后帧对比”，找出哪里在动，不识别人脸、不录像、不上传。<br>画稿说明：这不是真实拓片，是团队定下线稿、纹框、钤印规则后，由程序把本站插画转绘成拓片风格。<a href="#about" data-ab="ai">AI 使用说明</a></p></div></div></section>`}

const A=window.V6&&V6.afterDetail;
if(A){V6.afterDetail=function(D,s){stopCam();const ref=$('#d-src',D)||$('.dnext',D);if(ref&&!$('#d-rub',D)){ref.insertAdjacentHTML('beforebegin',html(s))}
 A(D,s);const el=$('#d-rub',D);if(el){$$('.sh',el).forEach(h=>h.classList.add('in'));Rub(el)}}}
/* 详情关闭时关摄像头 */
const D=$('#detail');if(D)new MutationObserver(()=>{if(D.hidden)stopCam()}).observe(D,{attributes:true,attributeFilter:['hidden']});
})();
