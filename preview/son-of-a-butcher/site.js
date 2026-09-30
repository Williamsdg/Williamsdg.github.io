document.documentElement.classList.add('js');

/* nav + drawer */
const nav=document.getElementById('nav');
const onScroll=()=>nav.classList.toggle('solid',scrollY>40||document.body.classList.contains('nav-solid'));
addEventListener('scroll',onScroll,{passive:true});onScroll();
const menuBtn=document.getElementById('menuBtn');
const setMenu=o=>{document.body.classList.toggle('menu-open',o);menuBtn.setAttribute('aria-expanded',o);menuBtn.setAttribute('aria-label',o?'Close menu':'Open menu');document.body.style.overflow=o?'hidden':''};
menuBtn.addEventListener('click',()=>setMenu(!document.body.classList.contains('menu-open')));
document.querySelectorAll('#drawer a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

/* open / closed — shop time is America/Chicago */
const HOURS={0:null,1:[660,1110],2:[630,1110],3:[630,1110],4:[630,1110],5:[630,1110],6:[480,960]};
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const fmt=m=>{const h=Math.floor(m/60),mm=m%60,ap=h>=12?'pm':'am';return ((h+11)%12+1)+(mm?':'+String(mm).padStart(2,'0'):'')+ap};
function shopNow(){
  const p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:'short',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(new Date());
  const g=t=>p.find(x=>x.type===t).value;
  return {day:DAYS.indexOf(g('weekday')),min:(+g('hour'))*60+(+g('minute'))};
}
function shopStatus(){
  const {day,min}=shopNow(),h=HOURS[day];
  if(h&&min>=h[0]&&min<h[1]) return {open:true,text:'Open now · till '+fmt(h[1])};
  for(let i=0;i<8;i++){
    const d=(day+i)%7,hh=HOURS[d];
    if(!hh) continue;
    if(i===0&&min<hh[0]) return {open:false,text:'Opens today '+fmt(hh[0])};
    if(i>0) return {open:false,text:'Closed · opens '+(i===1?'tomorrow':DAYS[d])+' '+fmt(hh[0])};
  }
}
function paintStatus(){
  const s=shopStatus();
  document.querySelectorAll('.js-status').forEach(el=>{el.classList.toggle('closed',!s.open);el.querySelector('.js-status-text').textContent=s.text});
  document.dispatchEvent(new CustomEvent('shoptick',{detail:shopNow()}));
}

/* reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
setTimeout(()=>document.querySelectorAll('.rv').forEach(el=>el.classList.add('in')),4000);

/* the dock hides wherever the page already shows the same buttons */
const dock=document.getElementById('dock'),dockHide=document.querySelector('[data-hide-dock]');
if(dock&&dockHide) new IntersectionObserver(es=>es.forEach(e=>dock.classList.toggle('away',e.isIntersecting)),{threshold:.15}).observe(dockHide);

addEventListener('DOMContentLoaded',()=>{paintStatus();setInterval(paintStatus,60000)});
