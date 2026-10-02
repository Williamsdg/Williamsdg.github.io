(function(){
'use strict';
var TICKETS='https://oxfordfestivaloflights.aluvii.com/store/shop/categories?id=1';
var YEAR=2026;
var MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
var DOW=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

/* ---------- schedule (from the festival's Nov/Dec 2026 calendars) ---------- */
var SPECIALS=[
  {id:'ga',  name:'Georgia Night',                              m:10,d:[23,24],     c:'#e8b94a'},
  {id:'ib',  name:'Iron Bowl Night',                            m:10,d:[25],        c:'#6fc2cf'},
  {id:'ed',  name:'Educators, School Staff & Healthcare',       m:11,d:[1,2,3],     c:'#a6d36f'},
  {id:'fr',  name:'First Responders & Industry',                m:11,d:[7,8,9,10],  c:'#6fc2cf'},
  {id:'toy', name:'Toy Drive',                                  m:11,d:[14],        c:'#e18ad6'},
  {id:'mil', name:'Military, Veterans & Oxford Strong',         m:11,d:[15,16,17],  c:'#e8b94a'}
];
var CLOSED={'10-26':'Closed for Thanksgiving','11-25':'Closed for Christmas Day'};
function specialFor(m,d){for(var i=0;i<SPECIALS.length;i++){if(SPECIALS[i].m===m&&SPECIALS[i].d.indexOf(d)>-1)return SPECIALS[i]}return null}
function night(m,d){
  var dt=new Date(YEAR,m,d), w=dt.getDay();
  var inSeason=(m===10&&d>=20)||(m===11);
  if(!inSeason)return null;
  var key=m+'-'+d;
  if(CLOSED[key])return {m:m,d:d,w:w,closed:CLOSED[key]};
  var weekend=(w===5||w===6||w===0);
  var late=weekend||(m===11&&d>=18);           // calendar: every night 5–10 from Dec 18
  return {m:m,d:d,w:w,weekend:weekend,open:17,close:late?22:21,sp:specialFor(m,d)};
}
var PRICES={car:[20,25],van:[30,35],bus:[50,55]};
function price(n,veh){
  if(n.sp&&veh==='car')return 15;
  return PRICES[veh][n.weekend?1:0];
}
function hr(h){return (h>12?h-12:h)+' PM'}

/* ---------- time in Oxford (Central) ---------- */
function centralNow(){
  try{
    var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var o={};p.forEach(function(x){o[x.type]=+x.value});
    return {y:o.year,m:o.month-1,d:o.day,h:o.hour%24,min:o.minute};
  }catch(e){var n=new Date();return {y:n.getFullYear(),m:n.getMonth(),d:n.getDate(),h:n.getHours(),min:n.getMinutes()}}
}
var NOW=centralNow();
var todayIn=(NOW.y===YEAR)?night(NOW.m,NOW.d):null;

/* status pill */
(function(){
  var el=document.getElementById('status'); if(!el)return;
  var t=el.querySelector('span'), start=Date.UTC(YEAR,10,20), now=Date.UTC(NOW.y,NOW.m,NOW.d);
  var days=Math.round((start-now)/864e5);
  if(days>0){t.textContent='Opens Friday, Nov 20 · '+(days===1?'tomorrow':days+' days to go');return}
  if(NOW.y>YEAR||(NOW.y===YEAR&&NOW.m===11&&NOW.d===31&&NOW.h>=22)){t.textContent='See you next season';el.classList.add('closed');return}
  var n=todayIn;
  if(n&&n.closed){t.textContent=n.closed+' · open again tomorrow at 5 PM';el.classList.add('closed');return}
  if(n){
    if(NOW.h<n.open){t.textContent='Open tonight '+hr(n.open)+' – '+hr(n.close)+(n.sp?' · '+n.sp.name:'');el.classList.add('open');return}
    if(NOW.h<n.close){t.textContent='Open now · gates close at '+hr(n.close);el.classList.add('open');return}
    t.textContent='Closed for tonight · back tomorrow at 5 PM';
  }
})();

/* ---------- planner ---------- */
var state={m:10,d:20,veh:'car',bands:0};
if(todayIn&&!todayIn.closed){state.m=todayIn.m;state.d=todayIn.d}
else if(NOW.y===YEAR&&(NOW.m===11||(NOW.m===10&&NOW.d>20))){var nx=nextOpen(NOW.m,NOW.d);if(nx){state.m=nx.m;state.d=nx.d}}
function nextOpen(m,d){for(var i=0;i<50;i++){var dt=new Date(YEAR,m,d+i),n=night(dt.getMonth(),dt.getDate());if(n&&!n.closed)return n}return null}

var daysEl=document.getElementById('days'), detail=document.getElementById('detail');
function renderMonth(){
  var m=state.m, first=new Date(YEAR,m,1).getDay(), len=new Date(YEAR,m+1,0).getDate(), h='';
  for(var i=0;i<first;i++)h+='<span class="day pad"></span>';
  for(var d=1;d<=len;d++){
    var n=night(m,d), cls='day', sm='', lab=MON[m]+' '+d;
    if(!n){h+='<span class="day off" aria-hidden="true">'+d+'</span>';continue}
    if(n.closed){cls+=' closed';sm='Closed';lab+=', closed'}
    else{
      if(n.weekend)cls+=' wknd';
      sm='5–'+(n.close-12);
      if(n.sp){cls+=' special';lab+=', '+n.sp.name}
      lab+=', open 5 to '+(n.close-12)+' PM';
    }
    if(NOW.y===YEAR&&NOW.m===m&&NOW.d===d)cls+=' today';
    var sel=(state.m===m&&state.d===d);
    h+='<button class="'+cls+'" data-d="'+d+'" aria-pressed="'+sel+'" aria-label="'+lab+'"'+(n.sp?' style="--c:'+n.sp.c+'"':'')+'>'+d+'<small>'+sm+'</small></button>';
  }
  // drop whole weeks with no festival nights (Nov 1–14)
  var cells=h.match(/<(span|button)[^>]*>.*?<\/\1>/g)||[], out='';
  for(var k=0;k<cells.length;k+=7){var wk=cells.slice(k,k+7);if(wk.some(function(c){return c.indexOf('<button')===0}))out+=wk.join('')}
  daysEl.innerHTML=out;
  document.querySelectorAll('.cal-tabs button').forEach(function(b){b.setAttribute('aria-selected',String(+b.dataset.m===m))});
}
function renderDetail(){
  var n=night(state.m,state.d), dt=new Date(YEAR,state.m,state.d);
  var h='<div class="when">'+DOW[dt.getDay()]+'</div><h3>'+MON[state.m]+' '+state.d+'</h3>';
  if(n.closed){
    var nx=nextOpen(state.m,state.d+1);
    h+='<span class="tag cl">'+n.closed+'</span><p style="margin:16px 0">The lights and Santa\'s Village are closed tonight. Merry Christmas and happy Thanksgiving from all of us.</p>';
    if(nx)h+='<button class="btn btn-dark" style="width:100%" data-jump="'+nx.m+'-'+nx.d+'">See '+MON[nx.m]+' '+nx.d+' instead</button>';
    detail.innerHTML=h;return;
  }
  h+=n.sp?'<span class="tag sp-tag" style="--c:'+n.sp.c+'">★ '+n.sp.name+' · $15 a car</span>':'<span class="tag">'+(n.weekend?'Weekend night':'Weeknight')+' pricing</span>';
  h+='<div class="rows"><div class="row"><span>Gates</span><b>'+hr(n.open)+' – '+hr(n.close)+'</b></div>'+
     '<div class="row"><span>Santa in the village</span><b>Usually 5 – 9 PM</b></div>'+
     '<div class="row"><span>Ticket type</span><b>'+(n.weekend?'Weekend (Fri–Sun)':'Weekday (Mon–Thu)')+'</b></div></div>';
  h+='<div class="lbl">Your vehicle</div><div class="seg" role="group" aria-label="Vehicle">'+
     seg('car','Car','up to 8')+seg('van','Van','9–15')+seg('bus','Bus / limo','15+')+'</div>';
  h+='<div class="lbl">Activity wristbands</div><div class="stepper"><span>Tubing, skating &amp; inflatables</span><div class="ctl"><button data-b="-1" aria-label="One fewer wristband">−</button><output id="bands">'+state.bands+'</output><button data-b="1" aria-label="One more wristband">+</button></div></div>'+
     '<p class="hint">Village entry is free. Only buy wristbands for the people riding.</p>';
  var adm=price(n,state.veh), wb=state.bands?20+10*(state.bands-1):0;
  h+='<div class="total"><span>Estimated total</span><b>$'+(adm+wb)+'</b></div>';
  h+='<div class="acts"><a class="btn btn-gold" href="'+TICKETS+'" target="_blank" rel="noopener">Buy '+(n.weekend?'weekend':'weekday')+' tickets</a>'+
     '<button class="btn btn-line" id="ics">Add to calendar</button><a class="btn btn-line" href="https://maps.google.com/?daddr=954+Leon+Smith+Parkway,+Oxford,+AL+36203" target="_blank" rel="noopener">Directions</a></div>';
  h+='<div id="wx"></div>';
  if(n.sp&&state.veh!=='car')h+='<p class="note">The $15 theme-night rate is listed per car. Vans and buses are shown at the regular price.</p>';
  h+='<p class="note">Admission $'+adm+(wb?' + wristbands $'+wb:'')+'. Food and merchandise extra.</p>';
  detail.innerHTML=h;
  weather(n);
}
function seg(k,t,s){return '<button data-v="'+k+'" aria-pressed="'+(state.veh===k)+'">'+t+'<small>'+s+'</small></button>'}

daysEl.addEventListener('click',function(e){var b=e.target.closest('button.day');if(!b)return;state.d=+b.dataset.d;renderMonth();renderDetail();
  if(window.innerWidth<1061)detail.scrollIntoView({behavior:'smooth',block:'start'})});
document.querySelectorAll('.cal-tabs button').forEach(function(b){b.addEventListener('click',function(){
  state.m=+b.dataset.m; var n=nextOpen(state.m,state.m===10?20:1); state.d=n?n.d:1;
  renderMonth();renderDetail()})});
detail.addEventListener('click',function(e){
  var v=e.target.closest('[data-v]'),b=e.target.closest('[data-b]'),j=e.target.closest('[data-jump]');
  if(v){state.veh=v.dataset.v;renderDetail()}
  if(b){state.bands=Math.max(0,Math.min(15,state.bands+ +b.dataset.b));renderDetail();var f=detail.querySelector('[data-b="'+b.dataset.b+'"]');f&&f.focus()}
  if(j){var p=j.dataset.jump.split('-');state.m=+p[0];state.d=+p[1];renderMonth();renderDetail()}
  if(e.target.id==='ics')ics();
});
/* specials list */
(function(){
  var box=document.getElementById('specials'),h='';
  SPECIALS.forEach(function(s){
    var ds=s.d.length>1?s.d[0]+'–'+s.d[s.d.length-1]:s.d[0];
    h+='<button class="sp" style="--c:'+s.c+'" data-m="'+s.m+'" data-d="'+s.d[0]+'"><span class="dt">'+MON[s.m].slice(0,3)+' '+ds+'</span><span class="nm">'+s.name+'</span><span class="pr">$15</span></button>';
  });
  box.insertAdjacentHTML('beforeend',h);
  box.addEventListener('click',function(e){var b=e.target.closest('.sp');if(!b)return;state.m=+b.dataset.m;state.d=+b.dataset.d;renderMonth();renderDetail();
    if(window.innerWidth<1061)detail.scrollIntoView({behavior:'smooth',block:'start'})});
})();

function pad(x){return (x<10?'0':'')+x}
function ics(){
  var n=night(state.m,state.d), ymd=YEAR+pad(state.m+1)+pad(state.d);
  var title='Festival of Lights'+(n.sp?' · '+n.sp.name:'');
  var body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Festival of Lights Oxford//EN','BEGIN:VEVENT',
    'UID:fol-'+ymd+'@oxfordfestivaloflights.com','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z',
    'DTSTART;TZID=America/Chicago:'+ymd+'T170000','DTEND;TZID=America/Chicago:'+ymd+'T'+n.close+'0000',
    'SUMMARY:'+title,'LOCATION:Choccolocco Park\\, 954 Leon Smith Parkway\\, Oxford\\, AL 36203',
    'DESCRIPTION:Gates '+hr(n.open)+' – '+hr(n.close)+'. Headlights off after the ticket booth. Santa\'s Village is card only.\\nTickets: '+TICKETS,
    'END:VEVENT','END:VCALENDAR'].join('\r\n');
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([body],{type:'text/calendar'}));a.download='festival-of-lights-'+ymd+'.ics';
  document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);
}

/* live forecast for the chosen night (Open-Meteo, when it's within range) */
var wxCache=null;
function weather(n){
  var target=Date.UTC(YEAR,n.m,n.d), now=Date.UTC(NOW.y,NOW.m,NOW.d), ahead=(target-now)/864e5;
  if(ahead<0||ahead>15)return;
  function show(j){
    var key=YEAR+'-'+pad(n.m+1)+'-'+pad(n.d), i=j.hourly.time.indexOf(key+'T19:00');
    var box=document.getElementById('wx'); if(i<0||!box)return;
    var t=Math.round(j.hourly.temperature_2m[i]), r=j.hourly.precipitation_probability[i];
    var tip=t<40?'Bundle up: toboggan, gloves, jacket.':t<55?'Bring layers.':'A mild night.';
    if(r>=40)tip='Rain likely. We run rain or shine.';
    box.innerHTML='<div class="wx"><b>'+t+'°</b><div>Forecast at 7 PM'+(r!=null?' · '+r+'% chance of rain':'')+'<br>'+tip+'</div></div>';
  }
  if(wxCache){show(wxCache);return}
  fetch('https://api.open-meteo.com/v1/forecast?latitude=33.6142&longitude=-85.8355&hourly=temperature_2m,precipitation_probability&temperature_unit=fahrenheit&timezone=America%2FChicago&forecast_days=16')
    .then(function(r){return r.json()}).then(function(j){wxCache=j;show(j)}).catch(function(){});
}
renderMonth();renderDetail();

/* ---------- gallery ---------- */
var PHOTOS=[['arch','The Oxford Festival of Lights archway with an elf'],['tunnel','Tunnel of blue lights'],['tree-girl','A child reaching for a lit tree'],['rink','The skating rink under string lights'],
 ['sleigh','Kids in a lit sleigh display'],['displays','Light displays along the drive'],['santa-kids','Kids with Santa'],['cider','Spiced apple cider cups'],
 ['big-tree','The big tree in the village'],['car-kids','Kids waving from a car window'],['tunnel2','Driving into the light tunnel'],['pajamas','Teens in matching pajamas'],
 ['fudge','Trays of gourmet fudge'],['mailbox','Letters to Santa mailbox'],['skate-kid','A small skater with a big smile'],['blue-tree','Blue light tree'],
 ['family','A family by the trees'],['snowman','Snowman display'],['merch','Light-up necklaces, wands and antlers'],['truck','Food truck in Santa\'s Village'],
 ['shirts','Festival long-sleeve tees'],['princess','A visit from a princess'],['tree-kids','Kids by the lit tree'],['elf-letter','Elf holding a letter to Santa'],
 ['displays2','Light displays at night'],['bumble','Bumble the snow monster'],['girls-rink','Friends at the rink'],['cocoa','Hot cocoa'],['booth','Ticket booth'],['sky-lights','String lights against the evening sky']];
var DIM={"arch": [799, 1000], "tunnel": [1365, 1400], "tree-girl": [667, 1000], "rink": [1000, 667], "sleigh": [876, 1000], "displays": [1000, 667], "santa-kids": [1000, 751], "cider": [1000, 667], "big-tree": [667, 1000], "car-kids": [1000, 727], "tunnel2": [1024, 600], "pajamas": [1000, 750], "fudge": [1000, 930], "mailbox": [1000, 667], "skate-kid": [750, 1000], "blue-tree": [751, 1000], "family": [1000, 563], "snowman": [667, 1000], "merch": [1000, 667], "truck": [1000, 751], "shirts": [751, 1000], "princess": [667, 1000], "tree-kids": [751, 1000], "elf-letter": [667, 1000], "displays2": [667, 1000], "bumble": [751, 1000], "girls-rink": [1000, 667], "cocoa": [1000, 667], "booth": [800, 1000], "sky-lights": [1000, 751]};
var gal=document.getElementById('gal');
gal.innerHTML=PHOTOS.map(function(p,i){return '<button data-i="'+i+'"'+(i>=12?' class="x-more"':'')+' aria-label="Open photo: '+p[1]+'"><img src="img/'+p[0]+'.jpg" alt="'+p[1]+'" width="'+DIM[p[0]][0]+'" height="'+DIM[p[0]][1]+'" loading="lazy"></button>'}).join('');
var more=document.getElementById('galmore');
if(window.matchMedia('(max-width:760px)').matches){more.style.display='flex'}
more.addEventListener('click',function(){gal.classList.add('open');more.remove()});
var lb=document.getElementById('lb'),lbImg=lb.querySelector('img'),cur=0,lastFocus=null;
function openLb(i){cur=(i+PHOTOS.length)%PHOTOS.length;lbImg.src='img/'+PHOTOS[cur][0]+'.jpg';lbImg.alt=PHOTOS[cur][1];lb.classList.add('on');document.body.style.overflow='hidden'}
function closeLb(){lb.classList.remove('on');document.body.style.overflow='';lastFocus&&lastFocus.focus()}
gal.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;lastFocus=b;openLb(+b.dataset.i);lb.querySelector('.x').focus()});
lb.querySelector('.x').onclick=closeLb;lb.querySelector('.pv').onclick=function(){openLb(cur-1)};lb.querySelector('.nx').onclick=function(){openLb(cur+1)};
lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')openLb(cur-1);if(e.key==='ArrowRight')openLb(cur+1)});
var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)openLb(cur+(dx<0?1:-1))});

/* ---------- FAQ search + filter ---------- */
var q=document.getElementById('q'),cat='all',qas=[].slice.call(document.querySelectorAll('.qa'));
qas.forEach(function(d){d._a=d.querySelector('.a').innerHTML});
function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function filt(){
  var term=q.value.trim().toLowerCase(),shown=0;
  qas.forEach(function(d){
    var a=d.querySelector('.a'); a.innerHTML=d._a;
    var ok=(cat==='all'||d.dataset.c===cat)&&(!term||d.textContent.toLowerCase().indexOf(term)>-1);
    d.hidden=!ok; if(ok)shown++;
    if(ok&&term.length>1){d.open=true;
      var re=new RegExp('('+esc(term)+')','ig');
      a.querySelectorAll('p,li').forEach(function(el){if(!el.querySelector('a'))el.innerHTML=el.textContent.replace(re,function(m){return '<mark>'+m+'</mark>'})});
    } else if(!term)d.open=false;
  });
  document.getElementById('noresults').style.display=shown?'none':'block';
}
q.addEventListener('input',filt);
document.getElementById('chips').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;cat=b.dataset.c;
  this.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});filt()});

/* ---------- sponsors ---------- */
var SP=[['01','Nadya Britt Photography'],['02','Alabama Plumbing & Drain'],['03',"Hubbard's off Main"],['04','Danny Shears, Calhoun County Commission'],['05','Fort McClellan Credit Union'],['06','Coca-Cola'],
 ['07','Baptist Health Citizens Hospital'],['08','The Sinclair Social'],['09','Family Savings Credit Union'],['10','Emblem Credit Union'],['11',"Culver's"],['12','Old Noble'],
 ['13',"Martin's Pharmacy"],['14','Forsyth Building Company'],['15','Harrison Sports Chiropractic'],['16','Three Notch Group'],['17','Rice & Rice, P.C.'],['18','Cotton Antiques & Collectibles'],
 ['19','The Supply Room'],['20','ABC Supply Co.'],['21','Jax State'],['22','Anniston Museums and Gardens'],['23','Eastman'],['24',"Nunnally's Noble Framing & Gallery"],
 ['25','The Whitmore Mortgage Group, Success Mortgage Partners'],['28','Alabama Power'],['29','Mike Rogers for Congress'],['32','Evans Flower Shop'],['34','Jack Green Oil Company'],['36','Miller Funeral Home'],
 ['38','Oxford Lumber'],['39','Southern Hometown Selling'],['40','Associated Metalcast'],['41','AOD Federal Credit Union'],['44','Auto Custom Carpets']];
var logos=document.getElementById('logos'),lim=window.matchMedia('(max-width:760px)').matches?9:12;
logos.innerHTML=SP.map(function(s,i){return '<div'+(i>=lim?' class="more"':'')+'><img src="img/sponsors/s'+s[0]+'.png" alt="'+s[1].replace(/"/g,'&quot;')+'" loading="lazy"></div>'}).join('');
document.getElementById('logomore').addEventListener('click',function(){logos.classList.add('open');this.remove()});

/* general store toggle */
document.querySelectorAll('[data-tg]').forEach(function(b){b.addEventListener('click',function(){var bd=document.getElementById(b.dataset.tg);bd.classList.toggle('open');b.textContent=bd.classList.contains('open')?'Show fewer':'Show all 9 items'})});

/* ---------- nav drawer ---------- */
var mb=document.querySelector('.menu-btn'),dr=document.getElementById('drawer');
mb.addEventListener('click',function(){var on=dr.classList.toggle('on');mb.setAttribute('aria-expanded',on);mb.setAttribute('aria-label',on?'Close menu':'Open menu')});
dr.addEventListener('click',function(e){if(e.target.closest('a')){dr.classList.remove('on');mb.setAttribute('aria-expanded','false')}});

/* ---------- string lights ---------- */
(function(){
  var svg=document.getElementById('bulbs');if(!svg)return;var cols=['#f6c453','#e5483b','#5ee08a','#7cc8e8','#e18ad6'],h='<path d="M0 6 ';
  for(var x=0;x<=1200;x+=60)h+='Q'+(x+30)+' 22 '+(x+60)+' 6 ';
  h+='" fill="none" stroke="#1d2a1d" stroke-width="2"/>';
  for(var i=0;i<40;i++){var cx=i*30+15,cy=19;
    h+='<ellipse class="bulb" cx="'+cx+'" cy="'+cy+'" rx="4" ry="6" fill="'+cols[i%5]+'" style="animation-delay:'+(i*0.37%3).toFixed(2)+'s;filter:drop-shadow(0 0 4px '+cols[i%5]+')"/>'}
  svg.innerHTML=h;
})();

/* ---------- reveal + sticky ---------- */
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  setTimeout(function(){document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')})},4000);
  var sticky=document.getElementById('sticky'),hideOn=['top','tickets','plan'].map(function(id){return document.getElementById(id)}),vis={};
  var so=new IntersectionObserver(function(es){es.forEach(function(e){vis[e.target.id]=e.isIntersecting});
    sticky.classList.toggle('hide',!!(vis.top||vis.tickets||vis.plan))},{threshold:.15});
  hideOn.forEach(function(el){so.observe(el)});
}else{document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')})}
})();
