document.addEventListener('DOMContentLoaded',function(){var b=document.querySelector('.menu-btn'),n=document.getElementById('nav');if(b&&n)b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)})});

(function(){var F={"fade": true, "up": false, "stagger": true, "count": false, "marquee": false, "parallax": false},d=document,R=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(R||!('IntersectionObserver' in window)||navigator.webdriver||/[?&]nomo\b/.test(location.search))return;
d.documentElement.classList.add('mo');
addEventListener('beforeprint',function(){d.querySelectorAll('[data-fx]').forEach(function(e){e.classList.add('in')})});
function mark(sel,fx){d.querySelectorAll(sel).forEach(function(e){if(!e.closest('.hero')&&!e.hasAttribute('data-fx'))e.setAttribute('data-fx',fx)})}
if(F.fade)mark('.sec-hd,.page-hd,.answer','fade');
if(F.up)mark('.card,.tx-quote','up');
if(F.stagger)d.querySelectorAll('.grid,.steps,.chips,[data-stagger]').forEach(function(g){if(g.closest('.hero'))return;var s=parseFloat(g.getAttribute('data-stagger')||'0.08');
[].forEach.call(g.children,function(c,i){if(!c.hasAttribute('data-fx'))c.setAttribute('data-fx',F.up?'up':'fade');c.style.setProperty('--mo-delay',Math.min(i*s,0.8)+'s')})});
function count(e){var t=e.getAttribute('data-count'),m=(t||e.textContent).match(/^(\D*?)(\d[\d,]*)(.*)$/);if(!m)return;var to=+m[2].replace(/,/g,''),p=m[1],sfx=t?'':m[3],c=m[2].indexOf(',')>-1,st=null,du=1200;
function f(ts){st=st||ts;var k=Math.min((ts-st)/du,1),v=Math.round(to*(1-Math.pow(1-k,3)));e.textContent=p+(c?v.toLocaleString('ko-KR'):v)+sfx;if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
if(F.count)d.querySelectorAll('.facts dd').forEach(function(e){var x=e.textContent.trim();if(/^\d{1,6}(,\d{3})*\s*(년|건|명|곳|개|%|분|일|회|가지|종|배)?\+?$/.test(x)&&!/^(19|20)\d\d\s*년?$/.test(x)&&!e.closest('.hero'))e.setAttribute('data-count-auto','')});
var io=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;var e=en.target;e.classList.add('in');if(F.count&&(e.hasAttribute('data-count')||e.hasAttribute('data-count-auto')))count(e);io.unobserve(e)})},{rootMargin:'0px 0px -8% 0px'});
d.querySelectorAll('[data-fx]'+(F.count?',[data-count],[data-count-auto]':'')).forEach(function(e){io.observe(e)});
if(F.marquee)d.querySelectorAll('.marquee').forEach(function(m){if(m.querySelector('.mq-track'))return;var t=d.createElement('div');t.className='mq-track';while(m.firstChild)t.appendChild(m.firstChild);t.innerHTML+=t.innerHTML;[].forEach.call(t.children,function(c,i){if(i>=t.children.length/2)c.setAttribute('aria-hidden','true')});m.appendChild(t)});
var px=F.parallax?[].slice.call(d.querySelectorAll('[data-parallax]')):[];if(px.length){var tick=false;function run(){px.forEach(function(e){var r=e.getBoundingClientRect(),k=parseFloat(e.getAttribute('data-parallax'))||0.15;e.style.transform='translateY('+((r.top+r.height/2-innerHeight/2)*-k).toFixed(1)+'px)'});tick=false}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(run)}},{passive:true});run()}
})();
