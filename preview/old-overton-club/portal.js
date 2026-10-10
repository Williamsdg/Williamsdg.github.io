/* Old Overton Club — portal concept, shared data layer (member.html + admin.html).
   Williams Digital, 2026-10-09.
   Everything here is SAMPLE data: member names, bookings, prices and event dates are invented
   for the demonstration. Course figures, room names, staff names and shop brands come from
   oldovertonclub.com. State is kept in this browser only (localStorage), so a booking made
   on the member side shows up on the admin side on the same device. */
var OOC=(function(){
  var KEY='ooc-portal-demo-v1';
  var ME={name:'Charles Whitmore',no:'1042'};

  /* ---------- dates ---------- */
  function pad(n){return (n<10?'0':'')+n}
  function iso(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
  function day(n){var d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+(n||0));return d}
  function today(){return iso(day(0))}
  function parse(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2],12)}
  var DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function nice(s){var d=parse(s);return s===today()?'Today':s===iso(day(1))?'Tomorrow':DOW[d.getDay()]+', '+MON[d.getMonth()]+' '+d.getDate()}
  function long(s){var d=parse(s);return DOW[d.getDay()]+', '+MON[d.getMonth()]+' '+d.getDate()}
  function t12(t){var p=t.split(':'),h=+p[0];return ((h+11)%12+1)+':'+p[1]+(h<12?' am':' pm')}
  function hr12(h){return ((h+11)%12+1)+(h<12?' am':' pm')}
  function money(n){return '$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function uid(){return 'u'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}

  /* ---------- deterministic sample generator ---------- */
  function rng(str){var h=2166136261;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
    return function(){h+=0x6D2B79F5;var t=Math.imul(h^h>>>15,1|h);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296}}
  var SUR=['Calloway','Pruitt','Ashby','Langford','Mercer','Bledsoe','Tillman','Garrison','Weatherly','Kimbrough','Ramsey','Northcutt','Sterling','Hargrove','Ellison','Thackeray','Marlowe','Beaumont','Dunaway','Lockhart','Fairchild','Stokes','Winslow','Abernathy'];
  var INI=['J.','M.','R.','A.','W.','S.','T.','L.','E.','H.','B.','K.'];
  function person(r){return INI[Math.floor(r()*INI.length)]+' '+SUR[Math.floor(r()*SUR.length)]}

  /* ---------- club facts (from the club's own site) ---------- */
  var PAR=[4,5,3,4,4,4,4,3,4,5,4,3,4,4,4,5,3,4];
  var TEES=[
    {n:'Black',r:74.6,s:134,y:7228},{n:'Blue',r:71.8,s:131,y:6516},{n:'Pate (B/W)',r:70.2,s:129,y:6203},
    {n:'White',r:69.2,s:127,y:6015},{n:'Fazio (W/G)',r:68.0,s:125,y:5791},{n:'Gold',r:65.8,s:110,y:5291},{n:'Red',r:69.4,s:122,y:5117}
  ];
  var ROOMS=['The Overton Grill','The Overlook Dining Room','The Hillside Terrace'];
  var COURTS=[1,2,3,4,5,6,7,8,9];
  function courtType(c){return c<=7?'Soft':'Hard'}
  /* sample operating grid */
  var TEE_TIMES=(function(){var a=[];for(var m=7*60+30;m<=16*60;m+=10)a.push(pad(Math.floor(m/60))+':'+pad(m%60));return a})();
  var COURT_HOURS=[8,9,10,11,12,13,14,15,16,17,18,19];
  var DINE_TIMES=['11:30','12:00','12:30','13:00','17:30','18:00','18:30','19:00','19:30','20:00'];

  /* sample catalogue: brands are the ones the club says it carries, prices are placeholders */
  var PRODUCTS=[
    {sku:'g1',shop:'Golf Shop',brand:'Peter Millar',name:'Performance Polo',price:98,sizes:['S','M','L','XL']},
    {sku:'g2',shop:'Golf Shop',brand:'Holderness & Bourne',name:'Quarter-Zip Pullover',price:145,sizes:['S','M','L','XL']},
    {sku:'g3',shop:'Golf Shop',brand:'Johnnie-O',name:'Striped Polo',price:95,sizes:['S','M','L','XL']},
    {sku:'g4',shop:'Golf Shop',brand:'FootJoy',name:'Golf Shoes',price:170,sizes:['8','9','10','11','12']},
    {sku:'g5',shop:'Golf Shop',brand:'Titleist',name:'Golf Balls, one dozen',price:55},
    {sku:'g6',shop:'Golf Shop',brand:'Callaway',name:'Golf Balls, one dozen',price:55},
    {sku:'g7',shop:'Golf Shop',brand:'Ping',name:'Stand Bag',price:260},
    {sku:'g8',shop:'Golf Shop',brand:'Stitch',name:'Golf Bag',price:348},
    {sku:'g9',shop:'Golf Shop',brand:'Old Overton',name:'Lantern Logo Cap',price:32},
    {sku:'t1',shop:'Tennis Shop',brand:'Wilson',name:'Racket',price:249},
    {sku:'t2',shop:'Tennis Shop',brand:'Wilson',name:'Tennis Balls, one can',price:6},
    {sku:'t3',shop:'Tennis Shop',brand:'Nike',name:'Court Skirt',price:65,sizes:['XS','S','M','L']},
    {sku:'t4',shop:'Tennis Shop',brand:'IBKUL',name:'Long Sleeve Top',price:88,sizes:['XS','S','M','L']},
    {sku:'t5',shop:'Tennis Shop',brand:'Lucky In Love',name:'Pleated Skirt',price:78,sizes:['XS','S','M','L']},
    {sku:'t6',shop:'Tennis Shop',brand:'Oakley',name:'Sunglasses',price:190},
    {sku:'t7',shop:'Tennis Shop',brand:'Corkcicle',name:'Logo Tumbler',price:38},
    {sku:'t8',shop:'Tennis Shop',brand:'Tennis Shop',name:'Racket Restringing',price:35}
  ];

  /* traditions from the club's site; the dates are sample dates */
  function nextDow(dow,after){var d=day(after);while(d.getDay()!==dow)d.setDate(d.getDate()+1);return iso(d)}
  var BASE_EVENTS=[
    {id:'e1',name:'Fall Festival',date:nextDow(6,8),time:'16:00',where:'The Hillside Terrace'},
    {id:'e2',name:'Tennis Mixer',date:nextDow(5,12),time:'18:00',where:'Tennis Courts'},
    {id:'e3',name:"Men's & Women's Golf Outing",date:nextDow(6,22),time:'09:00',where:'First Tee'},
    {id:'e4',name:'Thanksgiving Lunch',date:nextDow(4,36),time:'11:30',where:'The Overlook Dining Room'},
    {id:'e5',name:'Dinner with Santa',date:nextDow(5,55),time:'18:00',where:'The Overlook Dining Room'},
    {id:'e6',name:'Brunch with Santa',date:nextDow(0,57),time:'11:00',where:'The Overlook Dining Room'},
    {id:'e7',name:'Member Christmas',date:nextDow(6,63),time:'18:30',where:'The Clubhouse'}
  ];

  /* ---------- store ---------- */
  var mem=null;
  function seed(){
    var t=today();
    return {v:1,
      tee:[{id:'m-t1',date:iso(day(2)),time:'08:40',players:[ME.name,'Guest: Tom Reilly'],holes:18,cart:'Cart',member:ME.name}],
      dining:[{id:'m-d1',date:iso(day(1)),time:'18:30',venue:ROOMS[1],party:4,note:'Anniversary',member:ME.name,status:'Confirmed'}],
      courts:[{id:'m-c1',date:iso(day(-3)),hour:9,court:3,kind:'Singles match',opp:'R. Langford',member:ME.name,score:null,status:''}],
      rounds:[
        {id:'m-r1',date:iso(day(-6)),tee:'White',total:84,diff:13.2,member:ME.name,status:'Verified'},
        {id:'m-r2',date:iso(day(-13)),tee:'White',total:87,diff:15.8,member:ME.name,status:'Verified'},
        {id:'m-r3',date:iso(day(-20)),tee:'Blue',total:89,diff:14.8,member:ME.name,status:'Verified'},
        {id:'s-r1',date:iso(day(-1)),tee:'Blue',total:79,diff:6.2,member:'W. Garrison',status:'Pending'},
        {id:'s-r2',date:iso(day(-1)),tee:'Red',total:91,diff:20.0,member:'L. Weatherly',status:'Pending'}
      ],
      tennis:[
        {id:'s-x1',date:iso(day(-1)),kind:'Doubles match',member:'A. Mercer',opp:'S. Ellison',sets:[[6,4],[3,6],[10,7]],status:'Pending'},
        {id:'m-x0',date:iso(day(-10)),kind:'Singles match',member:ME.name,opp:'H. Sterling',sets:[[6,3],[6,4]],status:'Verified'}
      ],
      orders:[
        {id:'s-o1',when:iso(day(0)),member:'M. Calloway',items:[{name:'Titleist Golf Balls, one dozen',qty:2,price:55}],total:110,pickup:'Golf Shop',status:'New'},
        {id:'s-o2',when:iso(day(-1)),member:'E. Beaumont',items:[{name:'Tennis Shop Racket Restringing',qty:1,price:35}],total:35,pickup:'Tennis Shop',status:'Ready for pickup'}
      ],
      stock:{},
      rsvps:[{id:'s-v1',event:'e1',adults:2,kids:3,member:'T. Northcutt'},{id:'s-v2',event:'e1',adults:2,kids:1,member:'K. Dunaway'},{id:'s-v3',event:'e4',adults:6,kids:2,member:'B. Hargrove'},{id:'s-v4',event:'e2',adults:2,kids:0,member:'A. Mercer'}],
      events:[],
      guests:[{id:'s-g1',date:t,name:'Daniel Okafor',reason:'Golf, 9:20 tee time',member:'J. Pruitt',arrived:false},{id:'s-g2',date:t,name:'Meredith Shaw',reason:'Dinner, The Overton Grill',member:'S. Tillman',arrived:true},{id:'m-g1',date:iso(day(2)),name:'Tom Reilly',reason:'Golf, 8:40 tee time',member:ME.name,arrived:false}],
      notices:[{id:'n1',when:t,title:'Course notes',body:'Cart path only on holes 4 and 12 today. The practice facility is open.'},{id:'n2',when:iso(day(-2)),title:'Fall Festival',body:'RSVPs are open under Events. Bring the whole family to The Hillside Terrace.'}],
      charges:[
        {id:'c1',date:iso(day(-2)),desc:'The Overton Grill, lunch',amt:46.5},
        {id:'c2',date:iso(day(-6)),desc:'Golf Shop, guest fee',amt:95},
        {id:'c3',date:iso(day(-6)),desc:'The Overton Grill, dinner',amt:128.4},
        {id:'c4',date:iso(day(-9)),desc:'Tennis Shop, racket restringing',amt:35}
      ],
      blocks:{tee:[{date:t,time:'12:00',reason:'Course maintenance'},{date:t,time:'12:10',reason:'Course maintenance'}],court:[{date:t,hour:9,court:1,reason:'Ladies Clinic'},{date:t,hour:9,court:2,reason:'Ladies Clinic'},{date:iso(day(1)),hour:16,court:5,reason:'Junior Clinic'},{date:iso(day(1)),hour:16,court:6,reason:'Junior Clinic'}]},
      removed:{},
      log:[{when:Date.now()-36e5,text:'W. Garrison posted a golf score of 79 (Blue tees)'},{when:Date.now()-72e5,text:'M. Calloway placed a Golf Shop order for pickup'}]
    };
  }
  function load(){
    if(mem)return mem;
    try{var raw=localStorage.getItem(KEY);if(raw){var o=JSON.parse(raw);if(o&&o.v===1&&o.day===today()){mem=o;return mem}}}catch(e){}
    mem=seed();mem.day=today();save();return mem;
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(mem))}catch(e){}}
  function reset(){mem=seed();mem.day=today();save()}
  function log(text){var s=load();s.log.unshift({when:Date.now(),text:text});s.log=s.log.slice(0,40);save()}
  function ago(ts){var m=Math.round((Date.now()-ts)/6e4);return m<1?'just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' hr ago':Math.round(m/1440)+' d ago'}

  /* ---------- tee sheet ---------- */
  function teeSlot(date,time){
    var s=load(),r=rng('tee'+date+time),groups=[];
    var blk=s.blocks.tee.filter(function(b){return b.date===date&&b.time===time})[0];
    var id='s-tee-'+date+'-'+time;
    if(!blk&&r()<0.5&&!s.removed[id]){var n=2+Math.floor(r()*3),pl=[];for(var i=0;i<n;i++)pl.push(person(r));groups.push({id:id,players:pl,holes:r()<0.8?18:9,cart:r()<0.75?'Cart':'Walking',member:pl[0],sample:true})}
    s.tee.forEach(function(b){if(b.date===date&&b.time===time)groups.push(b)});
    var used=groups.reduce(function(a,g){return a+g.players.length},0);
    return {time:time,groups:groups,used:used,open:blk?0:Math.max(0,4-used),block:blk||null,mine:groups.some(function(g){return g.member===ME.name})};
  }
  function teeDay(date){return TEE_TIMES.map(function(t){return teeSlot(date,t)})}

  /* ---------- courts ---------- */
  function courtCell(date,hour,court){
    var s=load(),r=rng('ct'+date+hour+'-'+court);
    var blk=s.blocks.court.filter(function(b){return b.date===date&&b.hour===hour&&b.court===court})[0];
    if(blk)return {state:'block',reason:blk.reason};
    var mineB=s.courts.filter(function(b){return b.date===date&&b.hour===hour&&b.court===court})[0];
    if(mineB)return {state:'booked',b:mineB,mine:mineB.member===ME.name};
    var id='s-ct-'+date+'-'+hour+'-'+court,busy=(hour<=10||hour>=17)?0.42:0.18;
    if(r()<busy&&!s.removed[id]){var k=r()<0.5?'Doubles':'Singles';return {state:'booked',b:{id:id,member:person(r),kind:k+' match',opp:person(r),sample:true},mine:false}}
    return {state:'open'};
  }

  /* ---------- dining ---------- */
  function diningDay(date){
    var s=load(),r=rng('dn'+date),out=[],n=9+Math.floor(r()*8);
    for(var i=0;i<n;i++){var id='s-dn-'+date+'-'+i,o={id:id,date:date,time:DINE_TIMES[Math.floor(r()*DINE_TIMES.length)],venue:ROOMS[Math.floor(r()*ROOMS.length)],party:2+Math.floor(r()*5),note:'',member:person(r),status:'Confirmed',sample:true};if(!s.removed[id]){if(s.seated&&s.seated[id])o.status='Seated';out.push(o)}}
    s.dining.forEach(function(d){if(d.date===date)out.push(d)});
    out.sort(function(a,b){return a.time<b.time?-1:a.time>b.time?1:0});
    return out;
  }

  function events(){var s=load();return BASE_EVENTS.concat(s.events).sort(function(a,b){return a.date<b.date?-1:1})}
  function products(){var s=load();return PRODUCTS.map(function(p){var o=s.stock[p.sku]||{};return {sku:p.sku,shop:p.shop,brand:p.brand,name:p.name,sizes:p.sizes,price:o.price!=null?o.price:p.price,off:!!o.off}})}
  function diff(total,teeName){var t=TEES.filter(function(x){return x.n===teeName})[0];return Math.round((113/t.s)*(total-t.r)*10)/10}
  function index(member){var ds=load().rounds.filter(function(r){return r.member===member&&r.status==='Verified'}).map(function(r){return r.diff}).sort(function(a,b){return a-b});if(!ds.length)return null;var n=Math.max(1,Math.round(ds.length*0.4));return Math.round(ds.slice(0,n).reduce(function(a,b){return a+b},0)/n*10)/10}

  var toastT;
  function toast(msg){var el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){el.classList.remove('show')},3200)}
  function dayStrip(sel,from,count){var h='<div class="days" role="group" aria-label="Choose a day">';for(var i=from;i<from+count;i++){var d=day(i),s=iso(d);h+='<button type="button" class="day" data-act="day" data-date="'+s+'" aria-pressed="'+(s===sel)+'"><small>'+(i===0?'Today':DOW[d.getDay()])+'</small><b>'+d.getDate()+'</b><small>'+MON[d.getMonth()]+'</small></button>'}return h+'</div>'}

  return {ME:ME,PAR:PAR,TEES:TEES,ROOMS:ROOMS,COURTS:COURTS,COURT_HOURS:COURT_HOURS,DINE_TIMES:DINE_TIMES,TEE_TIMES:TEE_TIMES,
    load:load,save:save,reset:reset,log:log,ago:ago,iso:iso,day:day,today:today,nice:nice,long:long,t12:t12,hr12:hr12,money:money,esc:esc,uid:uid,
    teeSlot:teeSlot,teeDay:teeDay,courtCell:courtCell,courtType:courtType,diningDay:diningDay,events:events,products:products,diff:diff,index:index,toast:toast,dayStrip:dayStrip};
})();
