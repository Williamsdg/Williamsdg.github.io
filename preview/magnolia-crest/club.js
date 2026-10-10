/* Club portal engine — shared data layer for member.html, staff.html and demo.html.
   Williams Digital. Reads the club from window.CLUB (config.js), so one engine serves every club.

   Every member, booking, price and fee in the demo is SAMPLE data. State lives in this browser
   (localStorage), so something booked on the member side appears on the staff side on the same
   device, including across the two frames of demo.html.

   CROSS-DEVICE SYNC (off by default). Set CLUB.sync = {url, key} to a Supabase project's URL and
   publishable key and both portals share one "room" across devices. The table it expects:

     create table public.demo_rooms (
       code text primary key check (code ~ '^[a-z0-9-]{4,40}$'),
       state jsonb not null check (octet_length(state::text) < 400000),
       rev bigint not null default 0,
       updated_at timestamptz not null default now()
     );
     alter table public.demo_rooms enable row level security;
     create policy demo_rooms_read  on public.demo_rooms for select to anon using (true);
     create policy demo_rooms_write on public.demo_rooms for insert to anon with check (true);
     create policy demo_rooms_edit  on public.demo_rooms for update to anon using (true) with check (true);

   It holds demo data only. Put it in its own project, never beside client data. */
var Portal=(function(){
  var C=window.CLUB,KEY=C.key,ME=C.me,N=ME.name;
  var STATIC=/[?&]static/.test(location.search),EMBED=/[?&]embed/.test(location.search);
  var RM=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- dates + formatting ---------- */
  function pad(n){return (n<10?'0':'')+n}
  function iso(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
  function day(n){var d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+(n||0));return d}
  function today(){return iso(day(0))}
  function parse(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2],12)}
  var DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function long(s){var d=parse(s);return DOW[d.getDay()]+', '+MON[d.getMonth()]+' '+d.getDate()}
  function nice(s){return s===today()?'Today':s===iso(day(1))?'Tomorrow':s===iso(day(-1))?'Yesterday':long(s)}
  function t12(t){var p=t.split(':'),h=+p[0];return ((h+11)%12+1)+':'+p[1]+(h<12?' am':' pm')}
  function hr12(h){return ((h+11)%12+1)+(h<12?' am':' pm')}
  function money(n){return '$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function uid(){return 'u'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
  function ago(ts){var m=Math.round((Date.now()-ts)/6e4);return m<1?'just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' hr ago':Math.round(m/1440)+' d ago'}
  function hoursUntil(date,time){var p=date.split('-'),t=time.split(':');return (new Date(+p[0],+p[1]-1,+p[2],+t[0],+t[1])-Date.now())/36e5}

  /* ---------- deterministic sample generator ---------- */
  function rng(str){var h=2166136261;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
    return function(){h+=0x6D2B79F5;var t=Math.imul(h^h>>>15,1|h);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296}}
  var SUR=['Caldwell','Pruitt','Ashby','Langford','Mercer','Bledsoe','Tillman','Garrison','Weatherly','Kimbrough','Ramsey','Northcutt','Sterling','Hargrove','Ellison','Thackeray','Marlowe','Beaumont','Dunaway','Lockhart','Fairchild','Stokes','Winslow','Abernathy'];
  var INI=['J.','M.','R.','A.','W.','S.','T.','L.','E.','H.','B.','K.'];
  function person(r){return INI[Math.floor(r()*INI.length)]+' '+SUR[Math.floor(r()*SUR.length)]}

  /* ---------- the club, from config ---------- */
  var COURSES=C.courses,PAR=C.par,TEES=C.tees,ROOMS=C.rooms,GROUPS=C.courtGroups,FEES=C.fees;
  var COURTS=GROUPS.reduce(function(a,g){return Math.max(a,g.to)},0);
  function courtType(c){for(var i=0;i<GROUPS.length;i++)if(c>=GROUPS[i].from&&c<=GROUPS[i].to)return GROUPS[i].k;return ''}
  var TEE_TIMES=(function(){var a=[];for(var m=C.teeStart;m<=C.teeEnd;m+=10)a.push(pad(Math.floor(m/60))+':'+pad(m%60));return a})();
  var COURT_HOURS=[7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  var DINE_TIMES=['11:30','12:00','12:30','13:00','13:30','17:30','18:00','18:30','19:00','19:30','20:00','20:30'];
  function nextDow(dow,after){var d=day(after);while(d.getDay()!==dow)d.setDate(d.getDate()+1);return iso(d)}
  var BASE_EVENTS=C.events.map(function(e){return {id:e.id,name:e.name,date:nextDow(e.dow,e.after),time:e.time,where:e.where}});
  function diff(total,teeName){var t=TEES.filter(function(x){return x.n===teeName})[0];return Math.round((113/t.s)*(total-t.r)*10)/10}
  function windowDays(tier){var t=C.tiers.filter(function(x){return x.n===tier})[0];return t?t.days:7}

  /* ---------- store ---------- */
  var mem=null,listeners=[];
  function seed(){
    var t=today(),g1=GROUPS[0],g2=GROUPS[1]||GROUPS[0],T0=TEES[0].n,TL=TEES[TEES.length-1].n,MY=C.myTee,pr=function(shop){return C.products.filter(function(p){return p.shop===shop})[0]};
    function rd(id,d,tee,total,putts,member,status){return {id:id,date:iso(day(d)),course:COURSES[0],tee:tee,total:total,putts:putts,diff:diff(total,tee),member:member,status:status}}
    var p0=pr(C.shops[0]),p1=pr(C.shops[1]||C.shops[0]);
    return {v:3,rev:0,
      tee:[{id:'m-t1',date:iso(day(2)),time:'07:40',course:COURSES[0],players:[N,'R. Caldwell','Guest: Tom Reilly'],who:N,holes:18,cart:'Cart',fee:FEES.guest+3*FEES.cart,member:N}],
      waitlist:[{id:'s-w1',date:t,time:'09:00',course:COURSES[0],member:'H. Kimbrough',players:2}],
      dining:[{id:'m-d1',date:iso(day(1)),time:'19:00',venue:ROOMS[1],party:4,note:'Anniversary',who:N,member:N,status:'Confirmed'}],
      courts:[{id:'m-c1',date:iso(day(-2)),hour:9,court:g1.from+2,kind:'Singles match',opp:'R. Caldwell',who:N,member:N,score:null,status:''}],
      rounds:[rd('m-r1',-4,MY,79,30,N,'Verified'),rd('m-r2',-11,T0,81,32,N,'Verified'),rd('m-r3',-18,MY,82,33,N,'Verified'),rd('m-r4',-25,T0,84,34,N,'Verified'),rd('m-r5',-33,MY,80,31,N,'Verified'),rd('m-r6',-40,MY,85,34,N,'Verified'),
        rd('s-r1',-1,T0,76,29,'W. Garrison','Pending'),rd('s-r2',-1,TL,88,35,'L. Weatherly','Pending')],
      results:[
        {id:'s-x1',date:iso(day(-1)),sport:C.sports[1]||C.sports[0],kind:'Doubles match',member:'A. Mercer',opp:'S. Ellison',sets:C.sports[1]?[[11,8],[9,11],[11,6]]:[[6,4],[3,6],[10,7]],status:'Pending'},
        {id:'m-x0',date:iso(day(-9)),sport:C.sports[0],kind:'Singles match',member:N,opp:'H. Sterling',sets:[[6,4],[7,5]],status:'Verified'}],
      swims:C.swim?[{id:'m-s1',date:iso(day(-6)),event:'100 Free',time:'1:08.42',member:N},{id:'m-s2',date:iso(day(-20)),event:'50 Free',time:'0:31.10',member:N}]:[],
      orders:[
        {id:'s-o1',when:t,member:'M. Caldwell',items:[{name:p0.brand+' '+p0.name,qty:2,price:p0.price}],total:p0.price*2,pickup:p0.shop,status:'New'},
        {id:'s-o2',when:iso(day(-1)),member:'E. Beaumont',items:[{name:p1.brand+' '+p1.name,qty:1,price:p1.price}],total:p1.price,pickup:p1.shop,status:'Ready for pickup'}],
      stock:{},
      rsvps:[{id:'s-v1',event:'e1',adults:2,kids:0,member:'T. Northcutt'},{id:'s-v2',event:'e1',adults:4,kids:0,member:'K. Dunaway'},{id:'s-v3',event:'e4',adults:6,kids:3,member:'B. Hargrove'},{id:'s-v4',event:'e2',adults:2,kids:0,member:'A. Mercer'},{id:'m-v1',event:'e3',adults:2,kids:0,member:N}],
      events:[],
      guests:[{id:'s-g1',date:t,name:'Daniel Okafor',reason:'Golf, 9:20 tee time',member:'J. Pruitt',arrived:false},{id:'s-g2',date:t,name:'Meredith Shaw',reason:'Dinner, '+ROOMS[1],member:'S. Tillman',arrived:true},{id:'m-g1',date:iso(day(2)),name:'Tom Reilly',reason:'Golf, 7:40 tee time',member:N,arrived:false}],
      requests:[
        {id:'s-q1',when:Date.now()-5e6,topic:'Locker room',body:'Could I have my shoes re-spiked before Saturday?',member:'W. Garrison',status:'Open',reply:''},
        {id:'m-q0',when:Date.now()-2e8,topic:'Dining',body:'A corner table for my parents\' anniversary, please.',member:N,status:'Resolved',reply:'Done. Table 14 by the fireplace, and the kitchen knows about the cake.'}],
      notices:C.notices.map(function(n,i){return {id:'n'+i,when:iso(day(-i*2)),title:n[0],body:n[1]}}),
      messages:[
        {id:'g1',when:Date.now()-864e5,ch:'Email',subject:'Tee time confirmed: '+long(iso(day(2)))+' at 7:40 am',body:COURSES[0]+', three players, cart. One guest is on the gate list. Free cancellation until '+C.cancelHours+' hours before.',read:true},
        {id:'g2',when:Date.now()-9e7,ch:'Text',subject:C.name,body:'Your table at '+ROOMS[1]+' is confirmed for tomorrow at 7:00 pm, party of 4.',read:true}],
      charges:[
        {id:'c1',date:iso(day(-2)),desc:ROOMS[0]+', lunch',amt:52.5},
        {id:'c2',date:iso(day(-4)),desc:C.shops[0]+', guest fee',amt:FEES.guest},
        {id:'c3',date:iso(day(-4)),desc:ROOMS[1]+', dinner',amt:186.4},
        {id:'c4',date:iso(day(-9)),desc:p1.shop+', '+p1.name.toLowerCase(),amt:p1.price}],
      blocks:{tee:[{date:t,time:'12:00',course:COURSES[0],reason:'Course maintenance'},{date:t,time:'12:10',course:COURSES[0],reason:'Course maintenance'}],
        court:[{date:t,hour:9,court:g1.from,reason:C.clinics[0]},{date:t,hour:9,court:g1.from+1,reason:C.clinics[0]},{date:t,hour:16,court:g2.from,reason:C.clinics[1]},{date:t,hour:16,court:Math.min(g2.to,g2.from+1),reason:C.clinics[1]}]},
      removed:{},seated:{},checked:{},noshow:{},
      log:[{when:Date.now()-36e5,text:'W. Garrison posted a golf score of 76 ('+T0+' tees)'},{when:Date.now()-72e5,text:'M. Caldwell placed a '+p0.shop+' order for pickup'}]
    };
  }
  function read(){try{var raw=localStorage.getItem(KEY);if(raw){var o=JSON.parse(raw);if(o&&o.v===3&&o.day===today())return o}}catch(e){}return null}
  function load(){if(mem)return mem;mem=read();if(!mem){mem=seed();mem.day=today();write()}return mem}
  function write(){try{localStorage.setItem(KEY,JSON.stringify(mem))}catch(e){}}
  function save(){mem.rev=(mem.rev||0)+1;write();push()}
  function reset(){mem=seed();mem.day=today();save()}
  /* another tab, the other frame of demo.html, or another device changed the state */
  function refresh(){var o=read();if(o){mem=o;listeners.forEach(function(f){f()})}}
  function onChange(f){listeners.push(f)}
  if(typeof window!=='undefined')window.addEventListener('storage',function(e){if(e.key===KEY)refresh()});
  function log(text){var s=load();s.log.unshift({when:Date.now(),text:text});s.log=s.log.slice(0,40)}
  /* a confirmation the member would receive by email or text */
  function notify(ch,subject,body){var s=load();s.messages.unshift({id:uid(),when:Date.now(),ch:ch,subject:subject,body:body,read:false});s.messages=s.messages.slice(0,40)}

  /* ---------- optional cross-device sync ---------- */
  var SY=C.sync||{},room=null,pushT=null,lastPush=0;
  function syncOn(){return !!(SY.url&&SY.key)}
  function roomCode(){
    if(room)return room;var m=/[?&]room=([a-z0-9-]{4,40})/.exec(location.search);
    try{room=m?m[1]:localStorage.getItem(KEY+'-room');if(!room){room=C.id+'-'+Math.random().toString(36).slice(2,8)}localStorage.setItem(KEY+'-room',room)}catch(e){room=room||C.id+'-local'}
    return room;
  }
  function api(method,q,body){return fetch(SY.url+'/rest/v1/demo_rooms'+q,{method:method,headers:{apikey:SY.key,Authorization:'Bearer '+SY.key,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},body:body?JSON.stringify(body):undefined})}
  function push(){if(!syncOn())return;clearTimeout(pushT);pushT=setTimeout(function(){lastPush=Date.now();api('POST','?on_conflict=code',{code:roomCode(),state:mem,rev:mem.rev,updated_at:new Date().toISOString()}).catch(function(){})},250)}
  function pull(){if(!syncOn()||Date.now()-lastPush<1500)return;api('GET','?select=state,rev&code=eq.'+roomCode()).then(function(r){return r.json()}).then(function(rows){var r=rows&&rows[0];if(r&&r.state&&r.state.day===today()&&(r.rev||0)>(mem.rev||0)){mem=r.state;write();listeners.forEach(function(f){f()})}else if(!r)push()}).catch(function(){})}
  if(syncOn()&&typeof window!=='undefined'){roomCode();setTimeout(pull,300);setInterval(pull,2500)}

  /* ---------- tee sheet ---------- */
  function teeSlot(date,time,course){
    var s=load(),r=rng('tee'+course+date+time),groups=[];
    var blk=s.blocks.tee.filter(function(b){return b.date===date&&b.time===time&&b.course===course})[0];
    var id='s-tee-'+COURSES.indexOf(course)+'-'+date+'-'+time,busy=course===COURSES[0]?0.52:0.34;
    if(!blk&&r()<busy&&!s.removed[id]){var n=2+Math.floor(r()*3),pl=[];for(var i=0;i<n;i++)pl.push(person(r));var c=r();groups.push({id:id,players:pl,holes:r()<0.8?18:9,cart:c<0.55?'Cart':c<0.8?'Walking':'Caddie',member:pl[0],sample:true})}
    s.tee.forEach(function(b){if(b.date===date&&b.time===time&&b.course===course)groups.push(b)});
    var used=groups.reduce(function(a,g){return a+g.players.length},0);
    return {time:time,groups:groups,used:used,open:blk?0:Math.max(0,4-used),block:blk||null,mine:groups.some(function(g){return g.member===N}),
      wait:s.waitlist.filter(function(w){return w.date===date&&w.time===time&&w.course===course})};
  }
  function teeDay(date,course){return TEE_TIMES.map(function(t){return teeSlot(date,t,course)})}
  /* when a spot opens, the first party on the waitlist that fits is booked automatically */
  function promote(date,time,course){
    var s=load(),slot=teeSlot(date,time,course);if(slot.block||!slot.open||!slot.wait.length)return null;
    var w=slot.wait.filter(function(x){return x.players<=slot.open})[0];if(!w)return null;
    var pl=[w.member];for(var i=2;i<=w.players;i++)pl.push(w.member===N?'Player '+i:person(rng(w.id+i)));
    s.waitlist=s.waitlist.filter(function(x){return x.id!==w.id});
    s.tee.push({id:uid(),date:date,time:time,course:course,players:pl,who:w.member,holes:18,cart:'Cart',fee:pl.length*FEES.cart,member:w.member,fromWait:true});
    log(w.member+' was moved from the waitlist into '+t12(time)+' on '+long(date));
    if(w.member===N){notify('Text',C.name,'Good news: a spot opened. You are booked at '+t12(time)+' on '+long(date)+', '+course+'.');notify('Email','You are off the waitlist: '+long(date)+' at '+t12(time),course+', '+pl.length+' player'+(pl.length>1?'s':'')+'. Free cancellation until '+C.cancelHours+' hours before.')}
    return w;
  }

  /* ---------- courts ---------- */
  function courtCell(date,hour,court){
    var s=load(),r=rng('ct'+date+hour+'-'+court);
    var blk=s.blocks.court.filter(function(b){return b.date===date&&b.hour===hour&&b.court===court})[0];
    if(blk)return {state:'block',reason:blk.reason};
    var st=s.courts.filter(function(b){return b.date===date&&b.hour===hour&&b.court===court})[0];
    if(st)return {state:'booked',b:st,mine:st.member===N};
    var id='s-ct-'+date+'-'+hour+'-'+court,busy=(hour<=10||hour>=17)?0.44:0.18;
    if(r()<busy&&!s.removed[id]){var k=r()<0.5?'Doubles':'Singles';return {state:'booked',b:{id:id,member:person(r),kind:k+' match',opp:person(r),sample:true},mine:false}}
    return {state:'open'};
  }
  function courtUse(date,g){var used=0,all=0;COURT_HOURS.forEach(function(h){for(var c=g.from;c<=g.to;c++){all++;if(courtCell(date,h,c).state!=='open')used++}});return {used:used,all:all}}

  /* ---------- dining ---------- */
  function diningDay(date){
    var s=load(),r=rng('dn'+date),out=[],n=11+Math.floor(r()*9);
    for(var i=0;i<n;i++){var id='s-dn-'+date+'-'+i,o={id:id,date:date,time:DINE_TIMES[Math.floor(r()*DINE_TIMES.length)],venue:ROOMS[Math.floor(r()*r()*ROOMS.length)],party:2+Math.floor(r()*5),note:'',member:person(r),status:s.seated[id]?'Seated':'Confirmed',sample:true};if(!s.removed[id])out.push(o)}
    s.dining.forEach(function(d){if(d.date===date)out.push(d)});
    out.sort(function(a,b){return a.time<b.time?-1:a.time>b.time?1:0});
    return out;
  }
  function events(){var s=load();return BASE_EVENTS.concat(s.events).sort(function(a,b){return a.date<b.date?-1:1})}
  function products(){var s=load();return C.products.map(function(p){var o=s.stock[p.sku]||{};return {sku:p.sku,shop:p.shop,brand:p.brand,name:p.name,sizes:p.sizes,price:o.price!=null?o.price:p.price,off:!!o.off}})}
  function index(member){var ds=load().rounds.filter(function(r){return r.member===member&&r.status==='Verified'}).map(function(r){return r.diff}).sort(function(a,b){return a-b});if(!ds.length)return null;var n=Math.max(1,Math.round(ds.length*0.4));return Math.round(ds.slice(0,n).reduce(function(a,b){return a+b},0)/n*10)/10}
  /* sample shop takings for a day, so the reports have a week to show */
  function shopSales(date,shop){var r=rng('sale'+date+shop),base=shop===C.shops[0]?900:420;var v=Math.round(base*(0.6+r()*0.9));load().orders.forEach(function(o){if(o.when===date&&o.pickup.indexOf(shop)>-1)v+=o.total});return v}
  function noShows(date){var r=rng('ns'+date),n=Math.floor(r()*3),s=load();Object.keys(s.noshow).forEach(function(k){if(s.noshow[k]===date)n++});return n}

  /* ---------- files the browser can really download ---------- */
  function download(name,type,text){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
  function ics(o){
    var d=o.date.replace(/-/g,''),t=(o.time||'09:00').replace(':','')+'00',p=(o.time||'09:00').split(':'),end=new Date(2000,0,1,+p[0],+p[1]+(o.mins||60)),e=pad(end.getHours())+pad(end.getMinutes())+'00';
    var x=function(v){return String(v).replace(/([,;\\])/g,'\\$1').replace(/\n/g,'\\n')};
    download(o.title.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.ics','text/calendar',['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//'+C.name+'//Member Portal//EN','BEGIN:VEVENT','UID:'+uid()+'@'+C.id,'DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z','DTSTART:'+d+'T'+t,'DTEND:'+d+'T'+e,'SUMMARY:'+x(o.title),'LOCATION:'+x(o.where||C.full),'DESCRIPTION:'+x(o.note||''),'END:VEVENT','END:VCALENDAR'].join('\r\n'));
  }
  function csv(name,rows){download(name,'text/csv',rows.map(function(r){return r.map(function(v){v=String(v==null?'':v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(',')}).join('\r\n'))}

  /* ---------- small UI helpers shared by both portals ---------- */
  var toastT;
  function toast(msg){var el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){el.classList.remove('show')},3600)}
  function dayStrip(sel,from,count,lockAfter){var h='<div class="days" role="group" aria-label="Choose a day">';for(var i=from;i<from+count;i++){var d=day(i),s=iso(d),lock=lockAfter!=null&&i>lockAfter;h+='<button type="button" class="day'+(lock?' lock':'')+'" '+(lock?'disabled aria-label="'+long(s)+', not open for booking yet"':'data-act="day" data-date="'+s+'"')+' aria-pressed="'+(s===sel)+'"><small>'+(i===0?'Today':DOW[d.getDay()])+'</small><b>'+d.getDate()+'</b><small>'+(lock?'Locked':MON[d.getMonth()])+'</small></button>'}return h+'</div>'}
  function burst(){
    if(RM||STATIC||C.theme.noBurst)return;
    var box=document.createElement('div');box.className='burst';box.setAttribute('aria-hidden','true');
    for(var i=0;i<22;i++){var p=document.createElement('i');p.style.left=(8+Math.random()*84)+'%';p.style.setProperty('--dx',(Math.random()*240-120)+'px');p.style.setProperty('--r',(Math.random()*720-360)+'deg');p.style.animationDelay=(Math.random()*.35)+'s';p.style.animationDuration=(1.6+Math.random()*1.2)+'s';box.appendChild(p)}
    document.body.appendChild(box);setTimeout(function(){box.remove()},3400);
  }
  function countUp(root){
    [].forEach.call((root||document).querySelectorAll('[data-count]'),function(el){
      var to=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length,pre=el.dataset.pre||'',suf=el.dataset.suf||'',t0=null,fin=function(v){return pre+(dec?v.toFixed(dec):Math.round(v).toLocaleString('en-US'))+suf};
      if(RM||STATIC||isNaN(to)){el.textContent=isNaN(to)?el.dataset.count:fin(to);return}
      (function f(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/900);el.textContent=fin(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(performance.now());
    });
  }
  function settle(root){[].forEach.call(root.querySelectorAll('[data-count]'),function(el){var v=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length;el.textContent=(el.dataset.pre||'')+(dec?v.toFixed(dec):Math.round(v).toLocaleString('en-US'))+(el.dataset.suf||'')})}
  function spark(vals,w,h){if(vals.length<2)return '';var mn=Math.min.apply(0,vals),mx=Math.max.apply(0,vals),sp=(mx-mn)||1,d='';vals.forEach(function(v,i){var x=(i/(vals.length-1))*(w-8)+4,y=h-6-((v-mn)/sp)*(h-12);d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)});return d}
  var MARK=C.mark||('<img src="'+C.logoImg+'" alt="'+esc(C.name)+'">');
  /* shared page chrome: theme, logos, sign-in gate */
  function theme(){var v=C.theme&&C.theme.vars||{},r=document.documentElement;for(var k in v)r.style.setProperty(k,v[k]);if(C.theme&&C.theme.cls)r.classList.add(C.theme.cls);if(EMBED)r.classList.add('embed')}
  function signedIn(role){if(EMBED||STATIC)return true;try{return sessionStorage.getItem(KEY+'-in-'+role)==='1'}catch(e){return true}}
  function sign(role,on){try{if(on)sessionStorage.setItem(KEY+'-in-'+role,'1');else sessionStorage.removeItem(KEY+'-in-'+role)}catch(e){}}

  return {C:C,ME:ME,N:N,STATIC:STATIC,EMBED:EMBED,RM:RM,COURSES:COURSES,PAR:PAR,TEES:TEES,ROOMS:ROOMS,GROUPS:GROUPS,COURTS:COURTS,COURT_HOURS:COURT_HOURS,DINE_TIMES:DINE_TIMES,TEE_TIMES:TEE_TIMES,FEES:FEES,MARK:MARK,
    load:load,save:save,reset:reset,refresh:refresh,onChange:onChange,log:log,notify:notify,ago:ago,iso:iso,day:day,today:today,nice:nice,long:long,t12:t12,hr12:hr12,money:money,esc:esc,uid:uid,hoursUntil:hoursUntil,
    teeSlot:teeSlot,teeDay:teeDay,promote:promote,courtCell:courtCell,courtType:courtType,courtUse:courtUse,diningDay:diningDay,events:events,products:products,diff:diff,index:index,windowDays:windowDays,shopSales:shopSales,noShows:noShows,
    syncOn:syncOn,roomCode:roomCode,ics:ics,csv:csv,toast:toast,dayStrip:dayStrip,burst:burst,countUp:countUp,settle:settle,spark:spark,theme:theme,signedIn:signedIn,sign:sign};
})();
