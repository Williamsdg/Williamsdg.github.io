/* Magnolia Crest Country Club — portal concept, shared data layer (member.html + staff.html).
   Williams Digital, 2026-10-09.
   Magnolia Crest is a FICTIONAL club: every member, booking, price, course figure and event
   here is invented. State lives in this browser only (localStorage), so something booked on
   the member side appears on the staff side on the same device. */
var MC=(function(){
  var KEY='mc-portal-demo-v2';
  var ME={name:'Dylan Williams',first:'Dylan',no:'0182',tier:'Founders'};

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

  /* ---------- deterministic sample generator ---------- */
  function rng(str){var h=2166136261;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
    return function(){h+=0x6D2B79F5;var t=Math.imul(h^h>>>15,1|h);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296}}
  var SUR=['Caldwell','Pruitt','Ashby','Langford','Mercer','Bledsoe','Tillman','Garrison','Weatherly','Kimbrough','Ramsey','Northcutt','Sterling','Hargrove','Ellison','Thackeray','Marlowe','Beaumont','Dunaway','Lockhart','Fairchild','Stokes','Winslow','Abernathy'];
  var INI=['J.','M.','R.','A.','W.','S.','T.','L.','E.','H.','B.','K.'];
  function person(r){return INI[Math.floor(r()*INI.length)]+' '+SUR[Math.floor(r()*SUR.length)]}

  /* ---------- the (fictional) club ---------- */
  var COURSES=['Magnolia Course','Crest Course'];
  var PAR=[4,5,4,3,4,4,3,5,4,4,4,3,5,4,4,3,5,4];
  var TEES=[{n:'Championship',r:72.4,s:138,y:7124},{n:'Member',r:70.1,s:132,y:6626},{n:'Forward',r:67.8,s:125,y:5700}];
  var ROOMS=['The Veranda Grille','The 1924 Room',"Founders' Cellar"];
  var COURT_GROUPS=[{k:'Clay',from:1,to:8},{k:'Hard',from:9,to:12},{k:'Pickleball',from:13,to:18}];
  function courtType(c){return c<=8?'Clay':c<=12?'Hard':'Pickleball'}
  var TEE_TIMES=(function(){var a=[];for(var m=6*60+40;m<=16*60+30;m+=10)a.push(pad(Math.floor(m/60))+':'+pad(m%60));return a})();
  var COURT_HOURS=[7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  var DINE_TIMES=['11:30','12:00','12:30','13:00','13:30','17:30','18:00','18:30','19:00','19:30','20:00','20:30'];
  var PRODUCTS=[
    {sku:'g1',shop:'Golf Shop',brand:'Crest Collection',name:'Magnolia Logo Polo',price:96,sizes:['S','M','L','XL']},
    {sku:'g2',shop:'Golf Shop',brand:'Crest Collection',name:'Quarter-Zip Pullover',price:138,sizes:['S','M','L','XL']},
    {sku:'g3',shop:'Golf Shop',brand:'1924',name:'Rope Cap',price:34},
    {sku:'g4',shop:'Golf Shop',brand:'Tour',name:'Golf Balls, one dozen',price:56},
    {sku:'g5',shop:'Golf Shop',brand:'Heritage',name:'Leather Headcover',price:84},
    {sku:'g6',shop:'Golf Shop',brand:'Sunday',name:'Carry Bag',price:285},
    {sku:'g7',shop:'Golf Shop',brand:'Caddie',name:'Glove',price:28,sizes:['S','M','ML','L']},
    {sku:'g8',shop:'Golf Shop',brand:'Founders',name:'Bag Tag, engraved',price:42},
    {sku:'r1',shop:'Racquet Shop',brand:'Center Court',name:'Racquet Restringing',price:36},
    {sku:'r2',shop:'Racquet Shop',brand:'Har-Tru',name:'Tennis Balls, one can',price:6},
    {sku:'r3',shop:'Racquet Shop',brand:'Dink',name:'Pickleball Paddle',price:165},
    {sku:'r4',shop:'Racquet Shop',brand:'Crest Collection',name:'Court Skirt',price:72,sizes:['XS','S','M','L']},
    {sku:'r5',shop:'Racquet Shop',brand:'Crest Collection',name:'Performance Visor',price:30},
    {sku:'r6',shop:'Racquet Shop',brand:'Veranda',name:'Logo Tumbler',price:36},
    {sku:'p1',shop:'Pool Hut',brand:'Camp Crest',name:'Swim Team Towel',price:44},
    {sku:'p2',shop:'Pool Hut',brand:'Camp Crest',name:'Goggles',price:22}
  ];
  function nextDow(dow,after){var d=day(after);while(d.getDay()!==dow)d.setDate(d.getDate()+1);return iso(d)}
  var BASE_EVENTS=[
    {id:'e1',name:'Supper Club on the Veranda',date:nextDow(5,3),time:'18:30',where:'The Veranda Grille'},
    {id:'e2',name:'Mixed Doubles Round Robin',date:nextDow(3,6),time:'18:30',where:'Center Court'},
    {id:'e3',name:'Member-Guest Invitational',date:nextDow(6,10),time:'08:00',where:'Magnolia Course'},
    {id:'e4',name:'Oyster Roast',date:nextDow(6,20),time:'17:00',where:'Magnolia Lawn'},
    {id:'e5',name:"Founders' Day Dinner",date:nextDow(4,34),time:'19:00',where:'The 1924 Room'},
    {id:'e6',name:'Holiday Tree Lighting',date:nextDow(0,55),time:'17:30',where:'The Front Porch'}
  ];
  function diff(total,teeName){var t=TEES.filter(function(x){return x.n===teeName})[0];return Math.round((113/t.s)*(total-t.r)*10)/10}

  /* ---------- store ---------- */
  var mem=null;
  function seed(){
    var t=today(),N=ME.name;
    function rd(id,d,tee,total,putts,member,status){return {id:id,date:iso(day(d)),course:COURSES[0],tee:tee,total:total,putts:putts,diff:diff(total,tee),member:member,status:status}}
    return {v:2,
      tee:[{id:'m-t1',date:iso(day(2)),time:'07:40',course:COURSES[0],players:[N,'R. Caldwell','Guest: Tom Reilly'],holes:18,cart:'Caddie',member:N}],
      dining:[{id:'m-d1',date:iso(day(1)),time:'19:00',venue:ROOMS[1],party:4,note:'Anniversary',member:N,status:'Confirmed'}],
      courts:[{id:'m-c1',date:iso(day(-2)),hour:9,court:3,kind:'Singles match',opp:'R. Caldwell',member:N,score:null,status:''}],
      rounds:[rd('m-r1',-4,'Member',79,30,N,'Verified'),rd('m-r2',-11,'Championship',81,32,N,'Verified'),rd('m-r3',-18,'Member',82,33,N,'Verified'),rd('m-r4',-25,'Championship',84,34,N,'Verified'),rd('m-r5',-33,'Member',80,31,N,'Verified'),rd('m-r6',-40,'Member',85,34,N,'Verified'),
        rd('s-r1',-1,'Championship',76,29,'W. Garrison','Pending'),rd('s-r2',-1,'Forward',88,35,'L. Weatherly','Pending')],
      results:[
        {id:'s-x1',date:iso(day(-1)),sport:'Pickleball',kind:'Doubles match',member:'A. Mercer',opp:'S. Ellison',sets:[[11,8],[9,11],[11,6]],status:'Pending'},
        {id:'m-x0',date:iso(day(-9)),sport:'Tennis',kind:'Singles match',member:N,opp:'H. Sterling',sets:[[6,4],[7,5]],status:'Verified'}],
      swims:[{id:'m-s1',date:iso(day(-6)),event:'100 Free',time:'1:08.42',member:N},{id:'m-s2',date:iso(day(-20)),event:'50 Free',time:'0:31.10',member:N}],
      orders:[
        {id:'s-o1',when:t,member:'M. Caldwell',items:[{name:'Tour Golf Balls, one dozen',qty:2,price:56}],total:112,pickup:'Golf Shop',status:'New'},
        {id:'s-o2',when:iso(day(-1)),member:'E. Beaumont',items:[{name:'Center Court Racquet Restringing',qty:1,price:36}],total:36,pickup:'Racquet Shop',status:'Ready for pickup'}],
      stock:{},
      rsvps:[{id:'s-v1',event:'e1',adults:2,kids:0,member:'T. Northcutt'},{id:'s-v2',event:'e1',adults:4,kids:0,member:'K. Dunaway'},{id:'s-v3',event:'e4',adults:6,kids:3,member:'B. Hargrove'},{id:'s-v4',event:'e2',adults:2,kids:0,member:'A. Mercer'},{id:'m-v1',event:'e3',adults:2,kids:0,member:N}],
      events:[],
      guests:[{id:'s-g1',date:t,name:'Daniel Okafor',reason:'Golf, 9:20 tee time',member:'J. Pruitt',arrived:false},{id:'s-g2',date:t,name:'Meredith Shaw',reason:'Dinner, The 1924 Room',member:'S. Tillman',arrived:true},{id:'m-g1',date:iso(day(2)),name:'Tom Reilly',reason:'Golf, 7:40 tee time',member:N,arrived:false}],
      requests:[
        {id:'s-q1',when:Date.now()-5e6,topic:'Locker room',body:'Could I have my shoes re-spiked before Saturday?',member:'W. Garrison',status:'Open',reply:''},
        {id:'m-q0',when:Date.now()-2e8,topic:'Dining',body:'A corner table for my parents\' anniversary, please.',member:N,status:'Resolved',reply:'Done. Table 14 by the fireplace, and the kitchen knows about the cake.'}],
      notices:[{id:'n1',when:t,title:'Course notes',body:'Greens rolling 11.5. Cart path only on Magnolia 4 and 12. The Crest Course is walking only today.'},{id:'n2',when:iso(day(-2)),title:'Supper Club',body:'Friday on the Veranda: a low-country boil and a jazz trio. RSVPs are open under Events.'}],
      charges:[
        {id:'c1',date:iso(day(-2)),desc:'The Veranda Grille, lunch',amt:52.5},
        {id:'c2',date:iso(day(-4)),desc:'Golf Shop, caddie fee',amt:110},
        {id:'c3',date:iso(day(-4)),desc:'The 1924 Room, dinner',amt:186.4},
        {id:'c4',date:iso(day(-9)),desc:'Racquet Shop, racquet restringing',amt:36}],
      blocks:{tee:[{date:t,time:'12:00',course:COURSES[0],reason:'Course maintenance'},{date:t,time:'12:10',course:COURSES[0],reason:'Course maintenance'}],
        court:[{date:t,hour:9,court:1,reason:'Ladies Clinic'},{date:t,hour:9,court:2,reason:'Ladies Clinic'},{date:t,hour:16,court:9,reason:'Junior Academy'},{date:t,hour:16,court:10,reason:'Junior Academy'},{date:t,hour:18,court:13,reason:'Pickleball Ladder'},{date:t,hour:18,court:14,reason:'Pickleball Ladder'}]},
      removed:{},seated:{},
      log:[{when:Date.now()-36e5,text:'W. Garrison posted a golf score of 76 (Championship tees)'},{when:Date.now()-72e5,text:'M. Caldwell placed a Golf Shop order for pickup'}]
    };
  }
  function load(){
    if(mem)return mem;
    try{var raw=localStorage.getItem(KEY);if(raw){var o=JSON.parse(raw);if(o&&o.v===2&&o.day===today()){mem=o;return mem}}}catch(e){}
    mem=seed();mem.day=today();save();return mem;
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(mem))}catch(e){}}
  function reset(){mem=seed();mem.day=today();save()}
  function log(text){var s=load();s.log.unshift({when:Date.now(),text:text});s.log=s.log.slice(0,40);save()}

  /* ---------- tee sheet ---------- */
  function teeSlot(date,time,course){
    var s=load(),r=rng('tee'+course+date+time),groups=[];
    var blk=s.blocks.tee.filter(function(b){return b.date===date&&b.time===time&&b.course===course})[0];
    var id='s-tee-'+course.charAt(0)+'-'+date+'-'+time,busy=course===COURSES[0]?0.52:0.34;
    if(!blk&&r()<busy&&!s.removed[id]){var n=2+Math.floor(r()*3),pl=[];for(var i=0;i<n;i++)pl.push(person(r));var c=r();groups.push({id:id,players:pl,holes:r()<0.8?18:9,cart:c<0.55?'Cart':c<0.8?'Walking':'Caddie',member:pl[0],sample:true})}
    s.tee.forEach(function(b){if(b.date===date&&b.time===time&&b.course===course)groups.push(b)});
    var used=groups.reduce(function(a,g){return a+g.players.length},0);
    return {time:time,groups:groups,used:used,open:blk?0:Math.max(0,4-used),block:blk||null,mine:groups.some(function(g){return g.member===ME.name})};
  }
  function teeDay(date,course){return TEE_TIMES.map(function(t){return teeSlot(date,t,course)})}

  /* ---------- courts ---------- */
  function courtCell(date,hour,court){
    var s=load(),r=rng('ct'+date+hour+'-'+court);
    var blk=s.blocks.court.filter(function(b){return b.date===date&&b.hour===hour&&b.court===court})[0];
    if(blk)return {state:'block',reason:blk.reason};
    var st=s.courts.filter(function(b){return b.date===date&&b.hour===hour&&b.court===court})[0];
    if(st)return {state:'booked',b:st,mine:st.member===ME.name};
    var id='s-ct-'+date+'-'+hour+'-'+court,busy=(hour<=10||hour>=17)?0.44:0.18;
    if(r()<busy&&!s.removed[id]){var k=r()<0.5?'Doubles':'Singles';return {state:'booked',b:{id:id,member:person(r),kind:k+' match',opp:person(r),sample:true},mine:false}}
    return {state:'open'};
  }

  /* ---------- dining ---------- */
  function diningDay(date){
    var s=load(),r=rng('dn'+date),out=[],n=11+Math.floor(r()*9);
    for(var i=0;i<n;i++){var id='s-dn-'+date+'-'+i,o={id:id,date:date,time:DINE_TIMES[Math.floor(r()*DINE_TIMES.length)],venue:ROOMS[Math.floor(r()*r()*ROOMS.length)],party:2+Math.floor(r()*5),note:'',member:person(r),status:s.seated[id]?'Seated':'Confirmed',sample:true};if(!s.removed[id])out.push(o)}
    s.dining.forEach(function(d){if(d.date===date)out.push(d)});
    out.sort(function(a,b){return a.time<b.time?-1:a.time>b.time?1:0});
    return out;
  }
  function events(){var s=load();return BASE_EVENTS.concat(s.events).sort(function(a,b){return a.date<b.date?-1:1})}
  function products(){var s=load();return PRODUCTS.map(function(p){var o=s.stock[p.sku]||{};return {sku:p.sku,shop:p.shop,brand:p.brand,name:p.name,sizes:p.sizes,price:o.price!=null?o.price:p.price,off:!!o.off}})}
  function index(member){var ds=load().rounds.filter(function(r){return r.member===member&&r.status==='Verified'}).map(function(r){return r.diff}).sort(function(a,b){return a-b});if(!ds.length)return null;var n=Math.max(1,Math.round(ds.length*0.4));return Math.round(ds.slice(0,n).reduce(function(a,b){return a+b},0)/n*10)/10}

  /* ---------- small UI helpers shared by both portals ---------- */
  var toastT,RM=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function toast(msg){var el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){el.classList.remove('show')},3400)}
  function dayStrip(sel,from,count){var h='<div class="days" role="group" aria-label="Choose a day">';for(var i=from;i<from+count;i++){var d=day(i),s=iso(d);h+='<button type="button" class="day" data-act="day" data-date="'+s+'" aria-pressed="'+(s===sel)+'"><small>'+(i===0?'Today':DOW[d.getDay()])+'</small><b>'+d.getDate()+'</b><small>'+MON[d.getMonth()]+'</small></button>'}return h+'</div>'}
  /* a burst of magnolia petals when something is confirmed */
  function burst(){
    if(RM||/[?&]static/.test(location.search))return;
    var box=document.createElement('div');box.className='burst';box.setAttribute('aria-hidden','true');
    for(var i=0;i<22;i++){var p=document.createElement('i');p.style.left=(8+Math.random()*84)+'%';p.style.setProperty('--dx',(Math.random()*240-120)+'px');p.style.setProperty('--r',(Math.random()*720-360)+'deg');p.style.animationDelay=(Math.random()*.35)+'s';p.style.animationDuration=(1.6+Math.random()*1.2)+'s';box.appendChild(p)}
    document.body.appendChild(box);setTimeout(function(){box.remove()},3400);
  }
  /* count numbers up when a view opens */
  function countUp(root){
    [].forEach.call((root||document).querySelectorAll('[data-count]'),function(el){
      var to=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length,pre=el.dataset.pre||'',t0=null;
      if(RM||isNaN(to)){el.textContent=pre+(isNaN(to)?el.dataset.count:to.toFixed(dec));return}
      (function f(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/900),v=to*(1-Math.pow(1-k,3));el.textContent=pre+(dec?v.toFixed(dec):Math.round(v).toLocaleString('en-US'));if(k<1)requestAnimationFrame(f)})(performance.now());
    });
  }
  /* sparkline path for a list of numbers */
  function spark(vals,w,h){if(vals.length<2)return '';var mn=Math.min.apply(0,vals),mx=Math.max.apply(0,vals),sp=(mx-mn)||1,d='';vals.forEach(function(v,i){var x=(i/(vals.length-1))*(w-8)+4,y=h-6-((v-mn)/sp)*(h-12);d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)});return d}
  var MARK='<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="28.5" fill="none" stroke="#C9A557"/><g fill="#F4EEE3" transform="translate(30 37) scale(.36)"><path d="M0 0C-16-18-14-52 0-70 14-52 16-18 0 0Z"/><path d="M0 0C-16-18-14-52 0-70 14-52 16-18 0 0Z" transform="rotate(-38)" opacity=".86"/><path d="M0 0C-16-18-14-52 0-70 14-52 16-18 0 0Z" transform="rotate(38)" opacity=".86"/><path d="M0 0C-16-18-14-52 0-70 14-52 16-18 0 0Z" transform="rotate(-76)" opacity=".7"/><path d="M0 0C-16-18-14-52 0-70 14-52 16-18 0 0Z" transform="rotate(76)" opacity=".7"/></g></svg>';

  return {ME:ME,COURSES:COURSES,PAR:PAR,TEES:TEES,ROOMS:ROOMS,COURT_GROUPS:COURT_GROUPS,COURT_HOURS:COURT_HOURS,DINE_TIMES:DINE_TIMES,TEE_TIMES:TEE_TIMES,MARK:MARK,
    load:load,save:save,reset:reset,log:log,ago:ago,iso:iso,day:day,today:today,nice:nice,long:long,t12:t12,hr12:hr12,money:money,esc:esc,uid:uid,
    teeSlot:teeSlot,teeDay:teeDay,courtCell:courtCell,courtType:courtType,diningDay:diningDay,events:events,products:products,diff:diff,index:index,
    toast:toast,dayStrip:dayStrip,burst:burst,countUp:countUp,spark:spark};
})();
