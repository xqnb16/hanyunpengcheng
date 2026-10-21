/* v7：纹样底纹、生死观主线、交通引文 */
(function(){const $=(s,r=document)=>r.querySelector(s);const R=document.documentElement.style;
const enc=s=>`url("data:image/svg+xml,${encodeURIComponent(s)}")`;
const CL=(window.XZ_CLP||[])[0]||'';
const cloud=c=>enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 170" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${CL}</svg>`);
R.setProperty('--cl7a',cloud('rgba(178,58,46,.10)'));
R.setProperty('--cl7d',cloud('rgba(201,149,74,.16)'));
const hh=()=>{const h=$('#top');h&&R.setProperty('--heroH',h.offsetHeight+'px')};hh();addEventListener('resize',hh);
/* 汉代三绝之前：生死观主线 */
const L=window.LIFE||[],S=$('#sanjue .sjg');
if(L.length&&S){const N=['壹','贰','叁','肆'];const box=document.createElement('div');box.className='life7';
 box.innerHTML=`<div class="lfh"><h3>汉代人怎么看生死</h3><p>三绝不是三件孤立的东西。它们背后是同一种观念：人死后还要像生前一样生活，最后升入仙境。</p></div>
 <ol class="lfl">${L.map((x,i)=>`<li><span class="lfn">${N[i]}</span><h4>${x.k}</h4><blockquote>“${x.q}”</blockquote><cite>${x.c}</cite><p>${x.d}</p>${x.go[0]==='#'?`<button type="button" class="lfa" data-rub>${x.gt} →</button>`:`<a class="lfa" href="#site-${x.go}">${x.gt} →</a>`}</li>`).join('')}</ol>
 <p class="lfs">引文据通行本；《抱朴子》成书于东晋，用来说明汉代以来的玉衣信仰。</p>`;
 S.parentNode.insertBefore(box,S);
 box.addEventListener('click',e=>{if(e.target.closest('[data-rub]')){const t=$('#sanjue .sjr');t&&t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}})}
/* 交通引文 */
const G=window.GOQ,gh=$('#go .sh5');
if(G&&gh){const f=document.createElement('figure');f.className='q7 q7s';f.innerHTML=`<blockquote>${G.q.map(x=>`<span>${x}</span>`).join('')}</blockquote><figcaption>${G.c} · ${G.s}</figcaption>`;gh.appendChild(f)}
})();
