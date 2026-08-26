/* =========================================================================
   WQVZ MISSION RADIO — concept preview
   Schedule data transcribed from missionmedia.info/shows.
   `tbc: true` marks a block the current site lists WITHOUT published times.
   ========================================================================= */
(function(){
'use strict';

var STREAM = 'https://gra19-eu-hls.clrd.net/dfa7ae1d/stream.m3u8';

/* ---------- program definitions ---------- */
var P = {
  pen:    {n:"RyanORadiO Penitentiary", h:"Ryan O'Neal & Andrah P'lonas", c:'talk', a:'#E32636',
           d:"A different type of talk show about everything: headline news, odd news, sports, entertainment news, true crime daily, dumb crook news, and knowledgeable guests — with spiritual encouragement, fresh conversation, and the power of prayer."},
  starnes:{n:"The Todd Starnes Show", h:"Todd Starnes", c:'talk', a:'#7FB4E8',
           d:"Politics, faith, and culture news from award-winning journalists."},
  carson: {n:"The Rob Carson Show", h:"Rob Carson · Washington, D.C.", c:'talk', a:'#7FB4E8',
           d:"Carson's commentary, parodies, and interviews with newsmakers, broadcast from Washington, D.C."},
  pedersen:{n:"The Rod Pedersen Show", h:"Rod Pedersen", c:'sports', a:'#78D6A0',
           d:"Canada's daytime sports talk show — football, hockey, interviews, and sports conversation."},
  rick:   {n:"The Rick Smith Show", h:"Rick Smith", c:'talk', a:'#7FB4E8',
           d:"A program for working people and the class war — billed as the most popular working-class program in America."},
  spaced: {n:"Spaced Out Radio", h:"Dave Scott", c:'talk', a:'#C79BE8',
           d:"Late-night conversation on the unexplained with host Dave Scott."},
  armchair:{n:"Armchair Quarterbacks Today", h:"Mac Magee", c:'sports', a:'#78D6A0',
           d:"Football wagers, prop bets, fantasy advice and DFS — four picks each, underdog predictions, survivor picks, and DFS lineups."},
  fnl:    {n:"Friday Night Lights", h:"Creekbank Sports Network", c:'sports', a:'#78D6A0',
           d:"Creekbank Sports Network brings you Ohatchee HS Football on Friday nights."},
  crt:    {n:"Classic Radio Theater", h:"", c:'music', a:'#F2B544',
           d:"Popular radio programs of the 1930s, 1940s and 1950s — radio plays and programs of mystery, intrigue, and comedy."},
  sonrise:{n:"Son Rise Sunday", h:"", c:'faith', a:'#F2B544',
           d:"Church services, teachings, Christian talk, and inspirational music every Sunday morning."},
  tricia: {n:"Sunday Morning Inspiration", h:"Tricia", c:'faith', a:'#F2B544', d:"Sunday morning inspiration with Tricia."},
  newnan: {n:"Newnan City Church Service", h:"Newnan City Church", c:'faith', a:'#F2B544', d:"Sunday service broadcast live on 1700 AM."},
  letgo:  {n:"Let Go and Let God", h:"", c:'faith', a:'#F2B544', d:"Sunday morning faith programming."},
  wayback:{n:"Wayback Saturday Night", h:"", c:'music', a:'#C79BE8', d:"Saturday night music from the archives."},
  noize:  {n:"Noize in the Attic", h:"", c:'music', a:'#C79BE8', d:"Weekend music programming on Mission Radio."},
  hits:   {n:"Classic Hits", h:"", c:'music', a:'#C79BE8', d:"Classic hits across the weekend daypart."},
  praise: {n:"Praise and Worship", h:"", c:'faith', a:'#F2B544', d:"Praise and worship music on Mission Radio."},
  morn:   {n:"Morning Programming", h:"", c:'music', a:'#9BA3AF', d:"Music and community programming between the morning and midday shows."},
  eve:    {n:"Evening Programming", h:"", c:'music', a:'#9BA3AF', d:"Music and community programming."},
  night:  {n:"Overnight Music", h:"", c:'music', a:'#9BA3AF', d:"Overnight music and programming until the morning show."}
};

/* Additional programs the current site lists without a time slot. */
var UNSCHEDULED = [
  {n:"Bobby Parker Radio Show", c:'music', a:'#C79BE8'},
  {n:"Sports Beat", h:"Richard Holdridge", c:'sports', a:'#78D6A0'},
  {n:"Nightly Crowd Catcher", c:'music', a:'#C79BE8'},
  {n:"Spirit Force", h:"Michael Basham", c:'faith', a:'#F2B544'},
  {n:"Bible with Bob Page", h:"Bob Page", c:'faith', a:'#F2B544'},
  {n:"Red Letters Radio", h:"Andrah P'lonas", c:'faith', a:'#F2B544'}
];

/* ---------- weekly grid (minutes from midnight, station time) ---------- */
function b(s,e,k,tbc,sub){ return {s:s,e:e,k:k,tbc:!!tbc,sub:sub||null}; }

var WEEKDAY_CORE = [
  b(0,330,'night',true),
  b(330,540,'pen'),
  b(540,660,'morn',true),
  b(660,840,'starnes'),
  b(840,1020,'carson'),
  b(1020,1140,'pedersen'),
  b(1140,1200,'eve',true),
  b(1200,1260,'rick',true),
  b(1260,1440,'spaced',true)
];

function weekdayWith(mods){
  var out = WEEKDAY_CORE.map(function(x){return {s:x.s,e:x.e,k:x.k,tbc:x.tbc,sub:x.sub};});
  return mods ? mods(out) : out;
}

var WEEK = {
  0:[ /* Sunday */
    b(0,120,'crt'),
    b(120,360,'night',true),
    b(360,720,'sonrise',false,[
      {t:'8:00 – 8:30 AM', n:'Sunday Morning Inspiration with Tricia'},
      {t:'9:30 – 10:30 AM', n:'Newnan City Church Service Live'},
      {t:'10:30 – 11:00 AM', n:'Let Go and Let God'}
    ]),
    b(720,1200,'crt'),
    b(1200,1440,'eve',true)
  ],
  1: weekdayWith(),
  2: weekdayWith(),
  3: weekdayWith(),
  4: weekdayWith(function(a){ a[2] = b(540,600,'armchair',true); a.splice(3,0,b(600,660,'morn',true)); return a; }),
  5: (function(){ /* Friday */
      return [
        b(0,330,'night',true),
        b(330,540,'pen'),
        b(540,600,'armchair',true),
        b(600,660,'morn',true),
        b(660,840,'starnes'),
        b(840,1020,'carson'),
        b(1020,1080,'armchair'),
        b(1080,1140,'pedersen',true),
        b(1140,1380,'fnl',true),
        b(1380,1440,'night',true)
      ];
    })(),
  6:[ /* Saturday */
    b(0,360,'night',true),
    b(360,720,'hits',true),
    b(720,900,'praise',true),
    b(900,1020,'wayback',true),
    b(1020,1140,'noize',true),
    b(1140,1440,'crt')
  ]
};

var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var DSHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var CATLABEL = {talk:'Talk',faith:'Faith',sports:'Sports',music:'Music'};

/* ---------- station time (America/Chicago) ---------- */
function stationNow(){
  var f = new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  var p = {}; f.formatToParts(new Date()).forEach(function(x){p[x.type]=x.value;});
  var h = parseInt(p.hour,10); if(h===24) h=0;
  return { dow: DSHORT.indexOf(p.weekday), mins: h*60 + parseInt(p.minute,10) };
}
function fmt(m){
  m = ((m % 1440) + 1440) % 1440;
  var h = Math.floor(m/60), mm = m%60, ap = h < 12 ? 'AM' : 'PM';
  var hh = h % 12; if(hh===0) hh = 12;
  return hh + ':' + (mm<10?'0':'') + mm + ' ' + ap;
}
function range(x){ return fmt(x.s) + ' – ' + fmt(x.e); }

/* ---------- timeline walking ---------- */
function blockAt(dow, mins){
  var day = WEEK[dow];
  for(var i=0;i<day.length;i++){ if(mins >= day[i].s && mins < day[i].e) return {dow:dow, b:day[i], i:i}; }
  return {dow:dow, b:day[day.length-1], i:day.length-1};
}
function after(ref){
  var day = WEEK[ref.dow];
  if(ref.i + 1 < day.length) return {dow:ref.dow, b:day[ref.i+1], i:ref.i+1};
  var nd = (ref.dow + 1) % 7;
  return {dow:nd, b:WEEK[nd][0], i:0};
}
window.WQVZ = {P:P, WEEK:WEEK, DAYS:DAYS, DSHORT:DSHORT, CATLABEL:CATLABEL, UNSCHEDULED:UNSCHEDULED,
                stationNow:stationNow, fmt:fmt, range:range, blockAt:blockAt, after:after, STREAM:STREAM};
})();
