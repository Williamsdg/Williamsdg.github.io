/* ============ ATN Mission Command Center ============ */
(function(){
'use strict';
var API='https://raolhzzsbzvevwpjvvcp.supabase.co/functions/v1/atn-cc';
var PASS_KEY='atn-cc-pass';
var pass='';

/* ---------- country -> map coordinates (auto-geocode, no network) ---------- */
var COUNTRY_LL={
  'afghanistan':[33.9,67.7],'albania':[41.2,20.2],'algeria':[28,1.7],'angola':[-11.2,17.9],'argentina':[-38.4,-63.6],
  'armenia':[40.1,45],'australia':[-25.3,133.8],'austria':[47.5,14.6],'azerbaijan':[40.1,47.6],'bangladesh':[23.7,90.4],
  'belarus':[53.7,27.9],'belgium':[50.5,4.5],'belize':[17.2,-88.5],'benin':[9.3,2.3],'bhutan':[27.5,90.4],'bolivia':[-16.5,-64],
  'bosnia':[43.9,17.7],'botswana':[-22.3,24.7],'brazil':[-14.2,-51.9],'bulgaria':[42.7,25.5],'burkina faso':[12.2,-1.6],
  'burundi':[-3.4,29.9],'cambodia':[12.6,105],'cameroon':[7.4,12.4],'canada':[56.1,-106.3],'chad':[15.5,18.7],'chile':[-35.7,-71.5],
  'china':[35.9,104.2],'colombia':[4.6,-74.3],'costa rica':[9.7,-83.8],'croatia':[45.1,15.2],'cuba':[21.5,-77.8],'cyprus':[35.1,33.4],
  'czech republic':[49.8,15.5],'democratic republic of the congo':[-4,21.8],'denmark':[56.3,9.5],'dominican republic':[18.7,-70.2],
  'ecuador':[-1.8,-78.2],'egypt':[26.8,30.8],'el salvador':[13.8,-88.9],'estonia':[58.6,25],'ethiopia':[9.1,40.5],'fiji':[-17.7,178],
  'finland':[61.9,25.7],'france':[46.2,2.2],'gabon':[-0.8,11.6],'georgia':[42.3,43.4],'germany':[51.2,10.5],'ghana':[7.9,-1],
  'greece':[39.1,21.8],'guatemala':[15.8,-90.2],'guinea':[9.9,-9.7],'haiti':[19,-72.3],'honduras':[15.2,-86.2],'hungary':[47.2,19.5],
  'iceland':[65,-19],'india':[20.6,79],'indonesia':[-0.8,113.9],'iran':[32.4,53.7],'iraq':[33.2,43.7],'ireland':[53.4,-8.2],
  'israel':[31,34.9],'italy':[41.9,12.6],'ivory coast':[7.5,-5.5],'jamaica':[18.1,-77.3],'japan':[36.2,138.3],'jordan':[30.6,36.2],
  'kazakhstan':[48,66.9],'kenya':[-0.02,37.9],'laos':[19.9,102.5],'latvia':[56.9,24.6],'lebanon':[33.9,35.9],'liberia':[6.4,-9.4],
  'lithuania':[55.2,23.9],'madagascar':[-18.8,46.9],'malawi':[-13.3,34.3],'malaysia':[4.2,101.9],'mali':[17.6,-4],'mexico':[23.6,-102.6],
  'moldova':[47.4,28.4],'mongolia':[46.9,103.8],'morocco':[31.8,-7.1],'mozambique':[-18.7,35.5],'myanmar':[21.9,95.9],'nepal':[28.4,84.1],
  'nepal & india':[27.7,85.3],'netherlands':[52.1,5.3],'new zealand':[-40.9,174.9],'nicaragua':[12.9,-85.2],'niger':[17.6,8.1],
  'nigeria':[9.1,8.7],'north korea':[40.3,127.5],'norway':[60.5,8.5],'pakistan':[30.4,69.3],'panama':[8.5,-80.8],
  'papua new guinea':[-6.3,143.9],'paraguay':[-23.4,-58.4],'peru':[-9.2,-75],'philippines':[12.9,121.8],'poland':[51.9,19.1],
  'portugal':[39.4,-8.2],'romania':[45.9,25],'russia':[61.5,105.3],'rwanda':[-1.9,29.9],'saudi arabia':[23.9,45.1],'senegal':[14.5,-14.5],
  'serbia':[44,21],'sierra leone':[8.5,-11.8],'singapore':[1.4,103.8],'slovakia':[48.7,19.7],'somalia':[5.2,46.2],'south africa':[-30.6,22.9],
  'south korea':[35.9,127.8],'south sudan':[7,30],'spain':[40.5,-3.7],'sri lanka':[7.9,80.8],'sudan':[12.9,30.2],'sweden':[60.1,18.6],
  'switzerland':[46.8,8.2],'syria':[34.8,39],'taiwan':[23.7,121],'tajikistan':[38.9,71.3],'tanzania':[-6.4,34.9],'thailand':[15.9,101],
  'togo':[8.6,0.8],'tunisia':[33.9,9.6],'turkey':[39,35.2],'uganda':[1.4,32.3],'ukraine':[48.4,31.2],'united arab emirates':[23.4,53.8],
  'united kingdom':[55.4,-3.4],'uk':[55.4,-3.4],'united states':[39.8,-98.6],'usa':[39.8,-98.6],'uruguay':[-32.5,-55.8],
  'uzbekistan':[41.4,64.6],'venezuela':[6.4,-66.6],'vietnam':[14.1,108.3],'yemen':[15.6,48.5],'zambia':[-13.1,27.8],'zimbabwe':[-19,29.2]
};
function geocodeCountry(name){
  if(!name) return null;
  var key=String(name).trim().toLowerCase();
  if(COUNTRY_LL[key]) return COUNTRY_LL[key];
  // try first part before "&"/"/"/"," (e.g. "Nepal & India" -> "nepal")
  var first=key.split(/[&/,]/)[0].trim();
  return COUNTRY_LL[first]||null;
}

/* ---------- tiny helpers ---------- */
var $=function(s,r){return (r||document).querySelector(s);};
var esc=function(s){return (s==null?'':String(s)).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
function api(body){
  return fetch(API,{method:'POST',headers:{'Content-Type':'application/json','x-atn-pass':pass},body:JSON.stringify(body||{})})
    .then(function(r){ if(r.status===401) throw new Error('unauthorized'); return r.json(); });
}
function toast(msg){ var t=$('#toast'); $('#toast-msg').textContent=msg; t.classList.add('show'); clearTimeout(t._h); t._h=setTimeout(function(){t.classList.remove('show');},2600); }
function money(n){ n=+n||0; return '$'+n.toLocaleString(); }
function fmtRange(a,b){ if(!a)return 'Dates TBD'; var o={month:'short',day:'numeric'}; var s=new Date(a+'T00:00:00'); var e=b?new Date(b+'T00:00:00'):null; var y=s.getFullYear(); return s.toLocaleDateString(undefined,o)+(e?' – '+e.toLocaleDateString(undefined,o):'')+', '+y; }
function monthDay(a){ if(!a)return {mo:'TBD',dy:''}; var d=new Date(a+'T00:00:00'); return {mo:d.toLocaleDateString(undefined,{month:'short'}),dy:d.getDate()}; }
function timeAgo(iso){ if(!iso)return ''; var s=Math.floor((Date.now()-new Date(iso).getTime())/1000); if(s<60)return 'just now'; if(s<3600)return Math.floor(s/60)+'m ago'; if(s<86400)return Math.floor(s/3600)+'h ago'; return Math.floor(s/86400)+'d ago'; }
function statusBadge(s){ return '<span class="badge b-'+esc(s)+'">'+esc((s||'').replace(/-/g,' '))+'</span>'; }

/* traveler pipeline order */
var PIPE=['applied','approved','deposit-paid','forms-complete','ready','completed'];
var PIPE_LABEL={'applied':'Applied','approved':'Approved','deposit-paid':'Deposit','forms-complete':'Forms','ready':'Ready','completed':'Done'};

/* ---------- NAV ---------- */
var NAV=[
  {grp:'Command'},
  {id:'overview',label:'Overview',icon:'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10'},
  {id:'trips',label:'Trips',icon:'M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7'},
  {id:'partners',label:'Mission Organizations',icon:'M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 6 4 2.8-2.8 4-4 6-4 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z'},
  {id:'missionaries',label:'Missionaries',icon:'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 4-6 8-6s8 2 8 6',soon:true},
  {id:'stories',label:'Stories',icon:'M4 5h16v14H4zM8 9h8M8 13h8M8 17h5'},
  {grp:'Operations'},
  {id:'contacts',label:'Contacts',icon:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM3 21c0-4 4-6 8-6M17 15l2 2 4-4',soon:true},
  {id:'forms',label:'Forms & Applications',icon:'M9 5h6M9 9h6M9 13h4M5 3h14v18H5z',soon:true},
  {id:'media',label:'Media Library',icon:'M4 5h16v14H4zM9 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM4 16l5-4 4 3 3-2 4 3',soon:true},
  {grp:''},
  {id:'settings',label:'Settings',icon:'M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 00-1.7-1l-.4-2.5H9.6l-.4 2.5a7 7 0 00-1.7 1l-2.4-1-2 3.4L3.1 11a7 7 0 000 2l-2 1.6 2 3.4 2.4-1a7 7 0 001.7 1l.4 2.5h4.8l.4-2.5a7 7 0 001.7-1l2.4 1 2-3.4-2-1.6a7 7 0 00.1-1z',soon:true}
];

function renderNav(){
  var html=NAV.map(function(n){
    if(n.grp!==undefined) return '<div class="grp">'+esc(n.grp)+'</div>';
    return '<div class="sb-item" data-view="'+n.id+'"><span class="ic"><svg viewBox="0 0 24 24"><path d="'+n.icon+'"/></svg></span>'+esc(n.label)+(n.soon?'<span class="soon">Soon</span>':'')+'</div>';
  }).join('');
  $('#sb-nav').innerHTML=html;
  Array.prototype.forEach.call(document.querySelectorAll('.sb-item'),function(el){
    el.addEventListener('click',function(){ go(el.dataset.view); $('#sidebar').classList.remove('open'); });
  });
}
function setActive(view){
  Array.prototype.forEach.call(document.querySelectorAll('.sb-item'),function(el){ el.classList.toggle('active',el.dataset.view===view); });
}

/* ---------- DATA CACHE ---------- */
var DATA={};
function loadOverview(){ return api({action:'overview'}).then(function(d){ DATA=d; return d; }); }

/* ---------- ROUTER ---------- */
var CUR='overview';
function go(view,arg){
  CUR=view; setActive(view.split(':')[0]);
  var C=$('#content');
  var v=view.split(':')[0];
  if(v==='overview'){ $('#crumb').textContent='Overview'; renderOverview(C); }
  else if(v==='trips'){ if(arg){ $('#crumb').textContent='Trips › '+(arg.name||''); renderTrip(C,arg); } else { $('#crumb').textContent='Trips'; renderTrips(C); } }
  else if(v==='partners'){ $('#crumb').textContent='Mission Organizations'; renderPartners(C); }
  else if(v==='stories'){ $('#crumb').textContent='Stories'; renderStories(C); }
  else { $('#crumb').textContent=titleFor(v); renderShell(C,v); }
  window.scrollTo(0,0);
}
function titleFor(v){ var n=NAV.filter(function(x){return x.id===v;})[0]; return n?n.label:v; }

/* ================= OVERVIEW ================= */
function renderOverview(C){
  C.innerHTML='<div class="loading">Loading…</div>';
  loadOverview().then(function(d){
    var now=new Date();
    var upcoming=d.trips.filter(function(t){return t.status!=='completed';});
    var travelersThisYear=d.travelers.length;
    var draftStories=d.stories.filter(function(s){return s.status!=='published';}).length;
    var activePartners=d.partners.filter(function(p){return p.published;}).length;
    var hour=now.getHours(); var greet=hour<12?'Good morning':hour<18?'Good afternoon':'Good evening';

    var stat=function(cls,lab,val,sub,icon){return '<div class="scard '+cls+'"><span class="ic"><svg viewBox="0 0 24 24"><path d="'+icon+'"/></svg></span><div class="lab">'+lab+'</div><div class="val">'+val+'</div><div class="sub">'+sub+'</div></div>';};

    var tripRows=upcoming.slice(0,5).map(function(t){
      var md=monthDay(t.start_date);
      var trav=d.travelers.filter(function(x){return x.trip_id===t.id;}).length;
      var pct=t.spots_total? Math.round(trav/t.spots_total*100):0;
      return '<div class="tl" data-trip="'+t.id+'"><div class="date"><div class="mo">'+md.mo+'</div><div class="dy">'+md.dy+'</div></div>'+
        '<div class="info"><div class="nm">'+esc(t.name)+'</div><div class="meta">'+esc(t.destination||t.country||'')+' · '+esc(t.team_leader||'Team leader TBD')+'</div></div>'+
        '<div class="fill"><div class="bar"><div style="width:'+pct+'%"></div></div><div class="txt">'+trav+' / '+(t.spots_total||'—')+' spots</div></div></div>';
    }).join('')||'<div style="padding:22px;color:var(--muted-d)">No upcoming trips.</div>';

    var feed=d.activity.map(function(a){
      return '<div class="feed-item '+esc(a.kind)+'"><span class="dot"></span><div><div class="ft">'+esc(a.message)+'</div><div class="fw">'+timeAgo(a.created_at)+'</div></div></div>';
    }).join('')||'<div style="padding:22px;color:var(--muted-d)">No recent activity.</div>';

    // world map dots (equirect approx)
    var pubP=d.partners.filter(function(p){return p.published && p.lat!=null;});
    var dots=pubP.map(function(p){ var x=(p.lon+180)/360*100; var y=(90-p.lat)/180*100; return '<div class="map-dot" style="left:'+x.toFixed(1)+'%;top:'+y.toFixed(1)+'%" title="'+esc(p.name)+'"></div>'; }).join('');
    var legend=pubP.map(function(p){return '<span>'+esc(p.country)+'</span>';}).join('');

    C.innerHTML=
      '<div class="page-head"><div class="greet serif">'+greet+', ATN Team</div><p>Here’s what’s happening among the nations.</p></div>'+
      '<div class="stat-row">'+
        stat('accent','Upcoming Trips',upcoming.length,'across '+new Set(upcoming.map(function(t){return t.country;})).size+' countries','M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7')+
        stat('','Active Mission Partners',activePartners,'published to website','M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 6 4 2.8-2.8 4-4 6-4 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z')+
        stat('','People Traveling This Year',travelersThisYear,'across '+upcoming.length+' trips','M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21c0-4 4-6 8-6s8 2 8 6')+
        stat('','Draft Stories',draftStories,'awaiting review or publish','M4 5h16v14H4zM8 9h8M8 13h5')+
      '</div>'+
      '<div class="grid-2">'+
        '<div class="panel"><div class="panel-head"><h3>Upcoming Trips</h3><span class="link" data-goto="trips">View all →</span></div><div class="panel-body">'+tripRows+'</div></div>'+
        '<div class="panel"><div class="panel-head"><h3>World Activity</h3></div><div class="mini-map"><div class="globe" style="background-image:url(\'../img/earth-satellite.jpg\')">'+dots+'</div><div class="map-legend">'+legend+'</div></div></div>'+
      '</div>'+
      '<div class="grid-2" style="margin-top:20px">'+
        '<div class="panel"><div class="panel-head"><h3>Recent Activity</h3></div><div class="feed">'+feed+'</div></div>'+
        '<div class="panel"><div class="panel-head"><h3>Stories Awaiting Publication</h3><span class="link" data-goto="stories">Manage →</span></div><div class="panel-body">'+
          d.stories.filter(function(s){return s.status!=='published';}).slice(0,4).map(function(s){
            return '<div class="tl" data-story="'+s.id+'"><div class="info"><div class="nm">'+esc(s.title)+'</div><div class="meta">'+esc([s.location,s.region].filter(Boolean).join(' · '))+'</div></div><div>'+statusBadge(s.status)+'</div></div>';
          }).join('')||'<div style="padding:22px;color:var(--muted-d)">All stories published 🎉</div>'+
        '</div></div>'+
      '</div>';

    Array.prototype.forEach.call(C.querySelectorAll('[data-goto]'),function(el){el.style.cursor='pointer';el.addEventListener('click',function(){go(el.dataset.goto);});});
    Array.prototype.forEach.call(C.querySelectorAll('[data-trip]'),function(el){el.addEventListener('click',function(){var t=DATA.trips.filter(function(x){return x.id===el.dataset.trip;})[0];go('trips:detail',t);});});
    Array.prototype.forEach.call(C.querySelectorAll('[data-story]'),function(el){el.addEventListener('click',function(){go('stories');});});
  }).catch(handleErr);
}

/* ================= TRIPS ================= */
function renderTrips(C){
  C.innerHTML='<div class="loading">Loading trips…</div>';
  loadOverview().then(function(d){
    var cards=d.trips.map(function(t){
      var trav=d.travelers.filter(function(x){return x.trip_id===t.id;});
      var pct=t.spots_total?Math.round(trav.length/t.spots_total*100):0;
      var partner=d.partners.filter(function(p){return p.id===t.partner_id;})[0];
      return '<div class="panel" data-trip="'+t.id+'" style="cursor:pointer">'+
        '<div style="padding:20px 22px">'+
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">'+
            '<div><div style="font-weight:700;font-size:1.1rem">'+esc(t.name)+'</div>'+
            '<div class="muted" style="font-size:.82rem;margin-top:3px">'+esc(t.destination||t.country)+'</div></div>'+
            statusBadge(t.status)+'</div>'+
          '<div class="muted" style="font-size:.82rem;margin-top:12px">'+fmtRange(t.start_date,t.end_date)+'</div>'+
          (partner?'<div class="muted" style="font-size:.78rem;margin-top:4px">Partner: '+esc(partner.name)+'</div>':'')+
          '<div style="margin-top:16px"><div class="bar" style="height:7px;background:var(--line-2);border-radius:4px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:var(--bronze);border-radius:4px"></div></div>'+
          '<div style="display:flex;justify-content:space-between;margin-top:6px"><span class="muted" style="font-size:.76rem">'+trav.length+' / '+(t.spots_total||'—')+' spots filled</span><span class="muted" style="font-size:.76rem">'+esc(t.team_leader||'')+'</span></div></div>'+
        '</div></div>';
    }).join('');
    C.innerHTML='<div class="page-head" style="display:flex;justify-content:space-between;align-items:flex-end"><div><h1>Trips</h1><p>Every mission trip gets its own workspace.</p></div>'+
      '<button class="btn btn-primary" id="new-trip"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>New Trip</button></div>'+
      '<div class="cards" style="grid-template-columns:repeat(2,1fr)">'+cards+'</div>';
    Array.prototype.forEach.call(C.querySelectorAll('[data-trip]'),function(el){el.addEventListener('click',function(){var t=d.trips.filter(function(x){return x.id===el.dataset.trip;})[0];go('trips:detail',t);});});
    $('#new-trip').addEventListener('click',function(){ tripForm(null); });
  }).catch(handleErr);
}

var TRIP_TABS=['Overview','Travelers','Payments','Documents','Schedule','Forms','Communications','Notes'];
function renderTrip(C,trip){
  C.innerHTML='<div class="loading">Loading trip…</div>';
  Promise.all([api({action:'get',resource:'trips',id:trip.id}),api({action:'list',resource:'travelers',where:{col:'trip_id',val:trip.id}})]).then(function(res){
    var t=res[0].row||trip; var travs=res[1].rows||[];
    var partner=(DATA.partners||[]).filter(function(p){return p.id===t.partner_id;})[0];
    var filled=travs.length, pct=t.spots_total?Math.round(filled/t.spots_total*100):0;
    var paid=travs.reduce(function(a,x){return a+(+x.amount_paid||0);},0);
    var target=filled*(+t.cost||0);

    var head='<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:8px">'+
      '<div><button class="btn btn-ghost btn-sm" id="back" style="margin-bottom:12px"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>All Trips</button>'+
      '<h1>'+esc(t.name)+'</h1>'+
      '<div class="muted" style="margin-top:4px">'+fmtRange(t.start_date,t.end_date)+' · '+esc(t.destination||t.country)+(partner?' · Partner: '+esc(partner.name):'')+'</div>'+
      '<div style="margin-top:8px">'+statusBadge(t.status)+' <span class="muted" style="font-size:.82rem;margin-left:8px">'+filled+' / '+(t.spots_total||'—')+' spots filled</span></div></div>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
        '<button class="btn btn-primary btn-sm" id="add-trav"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>Add Traveler</button>'+
        '<button class="btn btn-ghost btn-sm" id="send-reminder">Send Reminder</button>'+
        '<button class="btn btn-ghost btn-sm" id="email-team">Email Team</button>'+
        '<button class="btn btn-ghost btn-sm" id="export-roster">Export Roster</button>'+
      '</div></div>';

    var tabsHtml='<div class="tabs" id="trip-tabs">'+TRIP_TABS.map(function(tb,i){
      var ct=tb==='Travelers'?'<span class="ct">'+filled+'</span>':'';
      return '<button class="tab'+(i===0?' active':'')+'" data-tab="'+tb+'">'+tb+ct+'</button>';
    }).join('')+'</div><div id="trip-tabbody"></div>';

    C.innerHTML=head+tabsHtml;
    $('#back').addEventListener('click',function(){go('trips');});
    $('#add-trav').addEventListener('click',function(){ travelerForm(t,null); });
    $('#send-reminder').addEventListener('click',function(){ toast('Reminder queued to '+filled+' travelers'); logAct('Reminder sent to '+t.name+' travelers','trip'); });
    $('#email-team').addEventListener('click',function(){ toast('Team email drafted'); });
    $('#export-roster').addEventListener('click',function(){ exportRoster(t,travs); });

    function tabBody(tab){
      var B=$('#trip-tabbody');
      if(tab==='Travelers'){ B.innerHTML=travelerTable(t,travs); wireTravelers(t,travs); }
      else if(tab==='Overview'){
        B.innerHTML='<div class="grid-2"><div class="panel"><div class="panel-head"><h3>Trip Snapshot</h3></div><div style="padding:20px 22px">'+
          kv('Destination',t.destination||t.country)+kv('Dates',fmtRange(t.start_date,t.end_date))+kv('Team Leader',t.team_leader||'—')+kv('Partner',partner?partner.name:'—')+
          kv('Cost / person',money(t.cost))+kv('Deposit',money(t.deposit))+kv('Spots',filled+' / '+(t.spots_total||'—')+' ('+pct+'%)')+
          '</div></div>'+
          '<div class="panel"><div class="panel-head"><h3>Pipeline</h3></div><div style="padding:20px 22px">'+pipelineSummary(travs)+'</div></div></div>'+
          '<div class="panel" style="margin-top:20px"><div class="panel-head"><h3>Itinerary</h3><button class="btn btn-ghost btn-sm" id="edit-trip">Edit Trip</button></div><div style="padding:20px 22px;white-space:pre-wrap;color:var(--ink-2);font-size:.9rem">'+esc(t.itinerary||'No itinerary yet.')+'</div></div>';
        var e=$('#edit-trip'); if(e) e.addEventListener('click',function(){tripForm(t);});
      }
      else if(tab==='Payments'){
        B.innerHTML='<div class="panel"><div class="panel-head"><h3>Payments</h3><span class="muted" style="font-size:.82rem">'+money(paid)+' collected of '+money(target)+'</span></div>'+
          '<table class="tbl"><thead><tr><th>Traveler</th><th>Deposit</th><th class="right">Paid</th><th class="right">Balance</th><th>Status</th></tr></thead><tbody>'+
          travs.map(function(x){var bal=(+t.cost||0)-(+x.amount_paid||0);return '<tr><td>'+esc(x.name)+'</td><td>'+(x.amount_paid>=t.deposit?'✓':'—')+'</td><td class="right mono">'+money(x.amount_paid)+'</td><td class="right mono">'+money(bal>0?bal:0)+'</td><td>'+statusBadge(x.status)+'</td></tr>';}).join('')+
          '</tbody></table></div>';
      }
      else if(tab==='Schedule'){
        B.innerHTML='<div class="panel"><div class="panel-head"><h3>Itinerary & Schedule</h3></div><div style="padding:22px;white-space:pre-wrap;font-size:.9rem;color:var(--ink-2)">'+esc(t.itinerary||'No itinerary set. Use Edit Trip to add one.')+'</div></div>';
      }
      else {
        var blurbs={Documents:'Passport scans, waivers, and travel documents for each traveler live here.',Forms:'Application forms, medical forms, and waivers collected per traveler.',Communications:'Email history and message templates sent to this team.',Notes:'Internal staff notes about this trip.'};
        B.innerHTML='<div class="shell"><div class="ic"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM8 9h8M8 13h5"/></svg></div><h2>'+tab+'</h2><p>'+(blurbs[tab]||'')+'</p><span class="soon-tag">In this preview</span></div>';
      }
    }
    Array.prototype.forEach.call(C.querySelectorAll('#trip-tabs .tab'),function(el){el.addEventListener('click',function(){
      Array.prototype.forEach.call(C.querySelectorAll('#trip-tabs .tab'),function(x){x.classList.remove('active');}); el.classList.add('active'); tabBody(el.dataset.tab);
    });});
    tabBody('Overview');
  }).catch(handleErr);
}
function kv(k,v){return '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line)"><span class="muted" style="font-size:.8rem">'+esc(k)+'</span><span style="font-weight:600;font-size:.88rem">'+esc(v)+'</span></div>';}
function pipelineSummary(travs){
  return PIPE.map(function(s){var n=travs.filter(function(x){return x.status===s;}).length;return '<div style="display:flex;align-items:center;gap:12px;padding:7px 0"><div style="flex:1">'+statusBadge(s)+'</div><div style="font-weight:700;font-size:1.1rem;width:30px;text-align:right">'+n+'</div></div>';}).join('');
}
function travelerTable(t,travs){
  return '<div class="panel"><table class="tbl"><thead><tr><th>Name</th><th>Status</th><th>Passport</th><th class="right">Paid</th><th>Emergency</th><th></th></tr></thead><tbody>'+
    travs.map(function(x){
      return '<tr class="click" data-tid="'+x.id+'"><td><b>'+esc(x.name)+'</b><div class="muted" style="font-size:.74rem">'+esc(x.email||'')+'</div></td>'+
        '<td>'+statusBadge(x.status)+'</td>'+
        '<td><span class="muted" style="font-size:.8rem">'+esc(x.passport_status||'—')+'</span></td>'+
        '<td class="right mono">'+money(x.amount_paid)+'</td>'+
        '<td class="muted" style="font-size:.78rem">'+esc(x.emergency_contact||'—')+'</td>'+
        '<td class="right"><button class="btn btn-ghost btn-sm advance" data-tid="'+x.id+'">Advance →</button></td></tr>';
    }).join('')+'</tbody></table></div>';
}
function wireTravelers(t,travs){
  Array.prototype.forEach.call(document.querySelectorAll('.tbl tr.click'),function(el){el.addEventListener('click',function(e){ if(e.target.closest('.advance'))return; var x=travs.filter(function(v){return v.id===el.dataset.tid;})[0]; travelerForm(t,x); });});
  Array.prototype.forEach.call(document.querySelectorAll('.advance'),function(el){el.addEventListener('click',function(e){
    e.stopPropagation();
    var x=travs.filter(function(v){return v.id===el.dataset.tid;})[0];
    var idx=PIPE.indexOf(x.status); if(idx<PIPE.length-1){ var next=PIPE[idx+1];
      api({action:'update',resource:'travelers',id:x.id,values:{status:next}}).then(function(){ x.status=next; toast(x.name+' → '+PIPE_LABEL[next]); logAct(x.name+' advanced to '+PIPE_LABEL[next]+' for '+t.name,'trip'); go('trips:detail',t); });
    }
  });});
}
function exportRoster(t,travs){
  var cols=['name','email','status','passport_status','amount_paid','emergency_contact','dietary_medical'];
  var lines=[cols.join(',')].concat(travs.map(function(x){return cols.map(function(c){return '"'+String(x[c]==null?'':x[c]).replace(/"/g,'""')+'"';}).join(',');}));
  var blob=new Blob([lines.join('\n')],{type:'text/csv'}); var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=(t.name||'roster').replace(/\s+/g,'-').toLowerCase()+'-roster.csv'; a.click();
  toast('Roster exported ('+travs.length+' travelers)');
}

/* ================= PARTNERS ================= */
function renderPartners(C){
  C.innerHTML='<div class="loading">Loading partners…</div>';
  api({action:'list',resource:'partners'}).then(function(r){
    var rows=r.rows||[];
    var cards=rows.map(function(p){
      return '<div class="card" data-pid="'+p.id+'">'+
        '<div class="cimg" style="background-image:url(\'../'+esc(p.photo||'')+'\')"></div>'+
        '<div class="cbody"><div class="ctitle">'+esc(p.name)+'</div>'+
        '<div class="cmeta">'+esc(p.country||'')+' · '+esc(p.category||'')+'</div>'+
        '<div class="crow"><div class="toggle'+(p.published?' on':'')+'" data-toggle="'+p.id+'"><span class="track"></span><span class="tl-lab">'+(p.published?'On website':'Hidden')+'</span></div>'+
        '<button class="btn btn-ghost btn-sm edit-p" data-pid="'+p.id+'">Edit</button></div></div></div>';
    }).join('');
    C.innerHTML='<div class="page-head" style="display:flex;justify-content:space-between;align-items:flex-end"><div><h1>Mission Organizations</h1><p>These control the <b>Where We Serve</b> section of your website. Toggle <b>On website</b> to publish.</p></div>'+
      '<button class="btn btn-primary" id="new-partner"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>New Partner</button></div>'+
      '<div class="cards">'+cards+'</div>';
    Array.prototype.forEach.call(C.querySelectorAll('[data-toggle]'),function(el){el.addEventListener('click',function(e){
      e.stopPropagation(); var p=rows.filter(function(x){return x.id===el.dataset.toggle;})[0]; var nv=!p.published;
      api({action:'update',resource:'partners',id:p.id,values:{published:nv}}).then(function(){ p.published=nv; el.classList.toggle('on',nv); $('.tl-lab',el).textContent=nv?'On website':'Hidden'; toast(p.name+(nv?' published to website':' hidden from website')); logAct(p.name+(nv?' published to website':' hidden from website'),'partner'); });
    });});
    Array.prototype.forEach.call(C.querySelectorAll('.edit-p'),function(el){el.addEventListener('click',function(e){e.stopPropagation();var p=rows.filter(function(x){return x.id===el.dataset.pid;})[0];partnerForm(p);});});
    $('#new-partner').addEventListener('click',function(){partnerForm(null);});
  }).catch(handleErr);
}

/* ================= STORIES ================= */
function renderStories(C){
  C.innerHTML='<div class="loading">Loading stories…</div>';
  Promise.all([api({action:'list',resource:'stories',order:'updated_at',asc:false}),api({action:'overview'})]).then(function(res){
    var rows=res[0].rows||[]; DATA=res[1];
    var counts={draft:0,review:0,scheduled:0,published:0}; rows.forEach(function(s){counts[s.status]=(counts[s.status]||0)+1;});
    var chip=function(k,l){return '<div class="scard" style="padding:16px 20px"><div class="lab">'+l+'</div><div class="val" style="font-size:1.7rem">'+(counts[k]||0)+'</div></div>';};
    var cards=rows.map(function(s){
      return '<div class="card" data-sid="'+s.id+'">'+
        '<div class="cimg" style="background-image:url(\'../'+esc(s.featured_image||'img/story-community.jpg')+'\')"></div>'+
        '<div class="cbody"><div style="display:flex;justify-content:space-between;align-items:center"><div class="ctitle" style="font-size:.98rem">'+esc(s.title)+'</div>'+statusBadge(s.status)+'</div>'+
        '<div class="cmeta">'+esc([s.location,s.region].filter(Boolean).join(' · '))+'</div>'+
        '<div class="crow"><span class="muted" style="font-size:.74rem">'+esc(s.category||'')+'</span><button class="btn btn-ghost btn-sm edit-s" data-sid="'+s.id+'">Open editor</button></div></div></div>';
    }).join('');
    C.innerHTML='<div class="page-head" style="display:flex;justify-content:space-between;align-items:flex-end"><div><h1>Stories of Impact</h1><p>These power the <b>God Is Moving</b> section. Manage which three are featured below.</p></div>'+
      '<button class="btn btn-primary" id="new-story"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>New Story</button></div>'+
      '<div class="stat-row">'+chip('draft','Drafts')+chip('review','In Review')+chip('scheduled','Scheduled')+chip('published','Published')+'</div>'+
      godIsMovingManager()+
      '<div class="panel-head" style="border:none;padding:6px 0 14px"><h3>All Stories</h3></div>'+
      '<div class="cards">'+cards+'</div>';
    wireGodIsMoving();
    Array.prototype.forEach.call(C.querySelectorAll('.edit-s'),function(el){el.addEventListener('click',function(e){e.stopPropagation();var s=rows.filter(function(x){return x.id===el.dataset.sid;})[0];storyEditor(s);});});
    Array.prototype.forEach.call(C.querySelectorAll('.card[data-sid]'),function(el){el.addEventListener('click',function(){var s=rows.filter(function(x){return x.id===el.dataset.sid;})[0];storyEditor(s);});});
    $('#new-story').addEventListener('click',function(){storyEditor(null);});
  }).catch(handleErr);
}

function godIsMovingManager(){
  var pubStories=(DATA.stories||[]).filter(function(s){return s.status==='published';});
  var feat=(DATA.featured||[]).slice().sort(function(a,b){return a.position-b.position;});
  var slotHtml=[1,2,3].map(function(pos){
    var f=feat.filter(function(x){return x.position===pos;})[0];
    var story=f?pubStories.filter(function(s){return s.id===f.story_id;})[0]:null;
    var opts='<option value="">— choose a published story —</option>'+pubStories.map(function(s){return '<option value="'+s.id+'"'+(story&&story.id===s.id?' selected':'')+'>'+esc(s.title)+'</option>';}).join('');
    var img=story?'../'+esc(story.featured_image||'img/story-community.jpg'):'';
    return '<div class="card" style="cursor:default"><div class="cimg" style="background-image:url(\''+img+'\')"><div style="padding:8px 10px;font-weight:800;color:#fff;font-size:.9rem;text-shadow:0 1px 4px rgba(0,0,0,.6)">0'+pos+'</div></div>'+
      '<div class="cbody"><div class="ctitle" style="font-size:.92rem;min-height:1.3em">'+esc(story?story.title:'Empty slot')+'</div>'+
      '<select class="feat-select" data-pos="'+pos+'" style="width:100%;margin-top:10px;background:#fff;border:1px solid var(--line-2);border-radius:5px;padding:8px;font-size:.82rem">'+opts+'</select></div></div>';
  }).join('');
  return '<div class="panel" style="margin-bottom:26px"><div class="panel-head"><h3>Homepage · God Is Moving</h3><span class="muted" style="font-size:.8rem">The three featured stories, in order</span></div>'+
    '<div style="padding:20px 22px"><div class="cards">'+slotHtml+'</div>'+
    '<div style="margin-top:16px;display:flex;gap:10px;align-items:center"><button class="btn btn-primary btn-sm" id="save-featured">Save Featured</button><a href="../#stories" target="_blank" class="btn btn-ghost btn-sm">Live Preview ↗</a></div></div></div>';
}
function wireGodIsMoving(){
  var sf=$('#save-featured'); if(!sf)return;
  sf.addEventListener('click',function(){
    var sels=document.querySelectorAll('.feat-select');
    var ops=[]; Array.prototype.forEach.call(sels,function(s){ ops.push(api({action:'update',resource:'featured',id:+s.dataset.pos,values:{story_id:s.value||null}})); });
    Promise.all(ops).then(function(){ toast('God Is Moving updated — live on the website'); logAct('God Is Moving featured stories updated','story'); });
  });
}

/* ================= SHELLS ================= */
function renderShell(C,v){
  var info={
    missionaries:{t:'Missionaries',d:'Individual missionary families that power the Faces of the Field section — photo, family, country, ministry focus, bio, and a public/private visibility toggle.',ic:'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 4-6 8-6s8 2 8 6'},
    contacts:{t:'Contacts',d:'A lightweight missions CRM — one record per person (traveler, applicant, pastor, partner, donor, volunteer) with every trip, form, and note attached. No duplicates.',ic:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM3 21c0-4 4-6 8-6'},
    forms:{t:'Forms & Applications',d:'Build trip applications, interest forms, partner applications, prayer requests, volunteer forms, and post-trip testimonies. Submissions route to the right section — and a testimony can Turn Into Story.',ic:'M9 5h6M9 9h6M9 13h4M5 3h14v18H5z'},
    media:{t:'Media Library',d:'One centralized, filterable library (by country, trip, organization, missionary, story, year). Upload 40 Nepal photos once, reuse everywhere.',ic:'M4 5h16v14H4zM9 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM4 16l5-4 4 3 3-2 4 3'},
    settings:{t:'Settings',d:'Team members & roles, brand settings, passphrases, and website publishing controls.',ic:'M12 15a3 3 0 100-6 3 3 0 000 6z'}
  }[v]||{t:titleFor(v),d:'Coming soon.',ic:'M12 6v6l4 2'};
  C.innerHTML='<div class="page-head"><h1>'+esc(info.t)+'</h1></div>'+
    '<div class="shell"><div class="ic"><svg viewBox="0 0 24 24"><path d="'+info.ic+'"/></svg></div><h2>'+esc(info.t)+'</h2><p>'+esc(info.d)+'</p><span class="soon-tag">Next phase</span></div>';
}

/* ================= DRAWER FORMS ================= */
function openDrawer(title,bodyHtml,footHtml){
  $('#drawer-title').textContent=title; $('#drawer-body').innerHTML=bodyHtml; $('#drawer-foot').innerHTML=footHtml||'';
  $('#drawer').classList.add('open'); $('#scrim').classList.add('open');
}
function closeDrawer(){ $('#drawer').classList.remove('open'); $('#scrim').classList.remove('open'); }
$('#drawer-x').addEventListener('click',closeDrawer); $('#scrim').addEventListener('click',closeDrawer);

function fld(label,name,val,type){ return '<div class="field"><label>'+esc(label)+'</label><input name="'+name+'" type="'+(type||'text')+'" value="'+esc(val==null?'':val)+'"></div>'; }
function txt(label,name,val){ return '<div class="field"><label>'+esc(label)+'</label><textarea name="'+name+'">'+esc(val==null?'':val)+'</textarea></div>'; }
function sel(label,name,val,opts){ return '<div class="field"><label>'+esc(label)+'</label><select name="'+name+'">'+opts.map(function(o){var v=Array.isArray(o)?o[0]:o,l=Array.isArray(o)?o[1]:o;return '<option value="'+esc(v)+'"'+(v==val?' selected':'')+'>'+esc(l)+'</option>';}).join('')+'</select></div>'; }
function collect(){ var o={}; Array.prototype.forEach.call($('#drawer-body').querySelectorAll('[name]'),function(el){ var v=el.value; if(el.type==='number')v=v===''?null:+v; if(el.dataset.bool)v=(v==='true'); o[el.name]=v===''?null:v; }); return o; }

function partnerForm(p){
  p=p||{};
  var body=fld('Organization / Partner Name','name',p.name)+
    '<div class="grid2">'+fld('Country','country',p.country)+sel('Region','region',p.region,['Africa','Asia','Europe','North America','South America','Middle East','Global'])+'</div>'+
    '<div class="grid2">'+sel('Mission Category','category',p.category,['Church Planting','Leadership Training','Church Building','Discipleship','Mercy & Relief','Community Development','Childcare','Bible Translation'])+fld('Partner Since','partner_since',p.partner_since)+'</div>'+
    '<div class="grid2">'+fld('Primary Contact','primary_contact',p.primary_contact)+fld('Internal Owner','internal_owner',p.internal_owner)+'</div>'+
    '<div class="grid2">'+fld('Email','email',p.email,'email')+fld('Phone','phone',p.phone)+'</div>'+
    fld('Website','website',p.website)+
    fld('Public Photo (path)','photo',p.photo||'img/partners/')+
    '<div class="field"><label>Map Location — pin on the globe</label>'+
      '<div style="display:flex;gap:10px;align-items:center">'+
        '<input name="lat" type="number" step="any" placeholder="Latitude" value="'+esc(p.lat==null?'':p.lat)+'" style="flex:1;background:var(--white);border:1px solid var(--line-2);border-radius:5px;padding:10px 12px;font-size:.9rem">'+
        '<input name="lon" type="number" step="any" placeholder="Longitude" value="'+esc(p.lon==null?'':p.lon)+'" style="flex:1;background:var(--white);border:1px solid var(--line-2);border-radius:5px;padding:10px 12px;font-size:.9rem">'+
        '<button type="button" class="btn btn-ghost btn-sm" id="geo-btn" title="Fill from country">📍 From country</button>'+
      '</div>'+
      '<div class="hint" style="font-size:.72rem;color:var(--muted-d);margin-top:6px">Leave blank and we’ll auto-place the pin from the country name on save.</div>'+
    '</div>'+
    txt('Public Description','description',p.description)+
    '<div class="field"><label>Show on Website</label><select name="published" data-bool="1"><option value="true"'+(p.published?' selected':'')+'>Yes — visible in Where We Serve</option><option value="false"'+(!p.published?' selected':'')+'>No — hidden</option></select></div>';
  openDrawer(p.id?'Edit Partner':'New Partner',body,
    '<button class="btn btn-ghost" onclick="__closeDrawer()">Cancel</button><button class="btn btn-primary" id="save">Save Partner</button>');
  // "From country" button fills lat/lon from the country field
  $('#geo-btn').addEventListener('click',function(){
    var c=$('#drawer-body [name=country]').value;
    var ll=geocodeCountry(c);
    if(ll){ $('#drawer-body [name=lat]').value=ll[0]; $('#drawer-body [name=lon]').value=ll[1]; toast('Pin placed on '+c); }
    else toast('Couldn’t find "'+c+'" — enter coordinates manually');
  });
  $('#save').addEventListener('click',function(){
    var v=collect();
    // auto-geocode if coords are blank
    if((v.lat==null||v.lon==null) && v.country){ var ll=geocodeCountry(v.country); if(ll){ v.lat=ll[0]; v.lon=ll[1]; } }
    var act=p.id?{action:'update',resource:'partners',id:p.id,values:v}:{action:'create',resource:'partners',values:v};
    api(act).then(function(){ closeDrawer(); toast('Partner saved'+((v.lat!=null&&(p.lat==null))?' · pin placed':'')); if(!p.id)logAct('New partner "'+v.name+'" added','partner'); go('partners'); }).catch(function(e){alert('Save failed: '+e.message);});
  });
}

function tripForm(t){
  t=t||{};
  var partnerOpts=[['','— none —']].concat((DATA.partners||[]).map(function(p){return [p.id,p.name];}));
  var body=fld('Trip Name','name',t.name)+
    '<div class="grid2">'+fld('Destination','destination',t.destination)+fld('Country','country',t.country)+'</div>'+
    '<div class="grid2">'+fld('Start Date','start_date',t.start_date,'date')+fld('End Date','end_date',t.end_date,'date')+'</div>'+
    '<div class="grid2">'+sel('Partner','partner_id',t.partner_id,partnerOpts)+fld('Team Leader','team_leader',t.team_leader)+'</div>'+
    '<div class="grid3">'+fld('Spots','spots_total',t.spots_total,'number')+fld('Cost / person','cost',t.cost,'number')+fld('Deposit','deposit',t.deposit,'number')+'</div>'+
    sel('Status','status',t.status,['planning','open','full','in-progress','completed'])+
    txt('Itinerary','itinerary',t.itinerary);
  openDrawer(t.id?'Edit Trip':'New Trip',body,'<button class="btn btn-ghost" onclick="__closeDrawer()">Cancel</button><button class="btn btn-primary" id="save">Save Trip</button>');
  $('#save').addEventListener('click',function(){
    var v=collect(); var act=t.id?{action:'update',resource:'trips',id:t.id,values:v}:{action:'create',resource:'trips',values:v};
    api(act).then(function(res){ closeDrawer(); toast('Trip saved'); if(!t.id){logAct('New trip "'+v.name+'" created','trip'); go('trips');} else go('trips:detail',res.row); }).catch(function(e){alert('Save failed: '+e.message);});
  });
}

function travelerForm(trip,x){
  x=x||{};
  var body=fld('Name','name',x.name)+
    '<div class="grid2">'+fld('Email','email',x.email,'email')+fld('Phone','phone',x.phone)+'</div>'+
    '<div class="grid2">'+sel('Status','status',x.status||'applied',PIPE.map(function(s){return [s,PIPE_LABEL[s]||s];}))+sel('Passport','passport_status',x.passport_status,['none','pending','valid'])+'</div>'+
    '<div class="grid2">'+fld('Amount Paid','amount_paid',x.amount_paid,'number')+fld('Emergency Contact','emergency_contact',x.emergency_contact)+'</div>'+
    fld('Flight Info','flight_info',x.flight_info)+fld('Room Assignment','room_assignment',x.room_assignment)+
    txt('Dietary / Medical','dietary_medical',x.dietary_medical)+txt('Staff Notes','staff_notes',x.staff_notes);
  openDrawer(x.id?'Edit Traveler':'Add Traveler',body,
    (x.id?'<button class="btn btn-ghost" id="del" style="margin-right:auto;color:var(--red)">Remove</button>':'')+
    '<button class="btn btn-ghost" onclick="__closeDrawer()">Cancel</button><button class="btn btn-primary" id="save">Save</button>');
  $('#save').addEventListener('click',function(){
    var v=collect(); v.trip_id=trip.id; var act=x.id?{action:'update',resource:'travelers',id:x.id,values:v}:{action:'create',resource:'travelers',values:v};
    api(act).then(function(){ closeDrawer(); toast('Traveler saved'); if(!x.id)logAct(v.name+' added to '+trip.name,'trip'); go('trips:detail',trip); }).catch(function(e){alert('Save failed: '+e.message);});
  });
  var del=$('#del'); if(del)del.addEventListener('click',function(){ if(!confirm('Remove '+x.name+'?'))return; api({action:'delete',resource:'travelers',id:x.id}).then(function(){closeDrawer();toast('Traveler removed');go('trips:detail',trip);}); });
}

function storyEditor(s){
  s=s||{};
  var partnerOpts=[['','— none —']].concat((DATA.partners||[]).map(function(p){return [p.id,p.name];}));
  var tripOpts=[['','— none —']].concat((DATA.trips||[]).map(function(t){return [t.id,t.name];}));
  var body=fld('Story Title','title',s.title)+
    '<div class="grid3">'+fld('Location','location',s.location)+sel('Region','region',s.region,['Africa','Asia','Europe','North America','South America','Global'])+sel('Category','category',s.category,['Church Planting','Leadership Training','Community Development','Outreach','Discipleship','Mercy & Relief'])+'</div>'+
    fld('Featured Image (path)','featured_image',s.featured_image||'img/')+
    txt('Excerpt (shown on card)','excerpt',s.excerpt)+
    txt('Story Body','body',s.body)+
    '<div class="grid2">'+sel('Related Partner','partner_id',s.partner_id,partnerOpts)+sel('Related Trip','trip_id',s.trip_id,tripOpts)+'</div>'+
    '<div class="grid2">'+fld('Author','author',s.author)+fld('Publish Date','publish_date',s.publish_date,'date')+'</div>'+
    fld('SEO Title','seo_title',s.seo_title)+txt('SEO Description','seo_description',s.seo_description)+
    sel('Status','status',s.status||'draft',[['draft','Draft'],['review','In Review'],['scheduled','Scheduled'],['published','Published']]);
  openDrawer(s.id?'Edit Story':'New Story',body,
    '<button class="btn btn-ghost" id="preview" style="margin-right:auto">👁 Preview</button>'+
    '<button class="btn btn-ghost" onclick="__closeDrawer()">Cancel</button><button class="btn btn-primary" id="save">Save Story</button>');
  $('#preview').addEventListener('click',function(){ openStoryPreview(collect()); });
  $('#save').addEventListener('click',function(){
    var v=collect(); var act=s.id?{action:'update',resource:'stories',id:s.id,values:v}:{action:'create',resource:'stories',values:v};
    api(act).then(function(){ closeDrawer(); toast('Story saved'+(v.status==='published'?' & published':'')); if(v.status==='published')logAct('Story "'+v.title+'" published','story'); else if(!s.id)logAct('New story draft "'+v.title+'" created','story'); go('stories'); }).catch(function(e){alert('Save failed: '+e.message);});
  });
}
window.__closeDrawer=closeDrawer;

/* ---------- STORY PREVIEW (renders exactly like the public site) ---------- */
function imgPath(p){ // command-center is one level deeper than the site root
  if(!p) return '';
  return /^https?:/.test(p) ? p : '../'+p;
}
function nl2p(t){ // turn plain text into <p> if it isn't already HTML
  if(!t) return '<p style="color:#8a8578">Start writing the story body to see it here…</p>';
  if(/<(p|h[1-6]|ul|ol|blockquote|div|br)\b/i.test(t)) return t;
  return t.split(/\n{2,}/).map(function(x){return '<p>'+esc(x.trim()).replace(/\n/g,'<br>')+'</p>';}).join('');
}
var PV_STATE={s:null,mode:'article'};
function openStoryPreview(s){
  PV_STATE.s=s; PV_STATE.mode='article';
  document.querySelectorAll('.pv-tab').forEach(function(t){t.classList.toggle('active',t.dataset.pv==='article');});
  renderPreview();
  document.getElementById('preview-overlay').classList.add('open');
}
function renderPreview(){
  var s=PV_STATE.s||{}, F=document.getElementById('pv-frame');
  var region=[s.location,s.region].filter(Boolean).join(' · ')||'Location · Region';
  var img=imgPath(s.featured_image);
  if(PV_STATE.mode==='article'){
    var meta=[s.category, s.author, s.publish_date].filter(Boolean).join('  ·  ');
    F.innerHTML='<div class="pv-doc">'+
      '<div class="pv-hero" style="background-image:url(\''+esc(img)+'\')">'+
        '<div><div class="pv-region">'+esc(region)+'</div>'+
        '<h1>'+esc(s.title||'Untitled Story')+'</h1>'+
        '<div class="pv-meta">'+esc(meta||'Category · Author')+'</div></div>'+
      '</div>'+
      '<div class="pv-body">'+
        (s.excerpt?'<div class="pv-excerpt">'+esc(s.excerpt)+'</div>':'')+
        '<div class="pv-rich">'+nl2p(s.body)+'</div>'+
        '<div class="pv-foot">Among the Nations · '+esc([s.location,s.region].filter(Boolean).join(', ')||'')+(s.status?'  ·  '+esc(s.status.toUpperCase()):'')+'</div>'+
      '</div>'+
    '</div>';
  } else {
    // God Is Moving card row — show this story alongside the two other published featured stories
    var others=(DATA.stories||[]).filter(function(x){return x.status==='published' && x.title!==s.title;}).slice(0,2);
    var cards=[{story:s,isThis:true}].concat(others.map(function(o){return {story:o,isThis:false};})).slice(0,3);
    F.innerHTML='<div class="pv-cards-wrap"><div class="pv-lab">Stories of Impact</div><h2>God Is Moving</h2>'+
      '<div class="pv-row">'+cards.map(function(c){
        var st=c.story; var rg=[st.location,st.region].filter(Boolean).join(' · ');
        return '<div class="pv-story'+(c.isThis?' this':'')+'">'+
          (c.isThis?'<span class="pv-badge-this">This story</span>':'')+
          '<div class="pv-sph" style="background-image:url(\''+esc(imgPath(st.featured_image))+'\')"></div>'+
          '<span class="pv-sr">'+esc(rg||'Location')+'</span>'+
          '<h3>'+esc(st.title||'Untitled Story')+'</h3>'+
          '<span class="pv-read">Read Story →</span></div>';
      }).join('')+'</div>'+
      '<p style="margin-top:20px;color:#7D6A4F;font-size:.82rem">This is how the card looks in the homepage’s God Is Moving row. Feature it in a slot on the Stories page to make it appear live.</p>'+
    '</div>';
  }
}
(function initPreviewControls(){
  var ov=document.getElementById('preview-overlay'); if(!ov) return;
  document.getElementById('pv-close').addEventListener('click',function(){ov.classList.remove('open');});
  ov.addEventListener('click',function(e){ if(e.target===ov) ov.classList.remove('open'); });
  document.querySelectorAll('.pv-tab').forEach(function(t){
    t.addEventListener('click',function(){
      document.querySelectorAll('.pv-tab').forEach(function(x){x.classList.remove('active');});
      t.classList.add('active'); PV_STATE.mode=t.dataset.pv; renderPreview();
    });
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') ov.classList.remove('open'); });
})();

/* ---------- activity ---------- */
function logAct(message,kind){ api({action:'log',message:message,kind:kind||'info'}).catch(function(){}); }

/* ---------- errors ---------- */
function handleErr(e){
  if(e&&e.message==='unauthorized'){ sessionStorage.removeItem(PASS_KEY); location.reload(); return; }
  $('#content').innerHTML='<div class="loading">Something went wrong. <button class="btn btn-ghost btn-sm" onclick="location.reload()">Retry</button></div>';
}

/* ---------- GATE ---------- */
function unlock(p){
  pass=p;
  return api({action:'overview'}).then(function(){
    sessionStorage.setItem(PASS_KEY,p);
    $('#gate').classList.add('hidden'); $('#app').classList.remove('hidden');
    renderNav(); go('overview'); return true;
  }).catch(function(){ $('#gate-err').textContent='Incorrect passphrase.'; return false; });
}
$('#gate-btn').addEventListener('click',function(){ var v=$('#gate-input').value.trim(); if(v)unlock(v); });
$('#gate-input').addEventListener('keydown',function(e){ if(e.key==='Enter'){var v=$('#gate-input').value.trim();if(v)unlock(v);} });
$('#menu-btn').addEventListener('click',function(){ $('#sidebar').classList.toggle('open'); });
$('#signout').addEventListener('click',function(e){e.preventDefault();sessionStorage.removeItem(PASS_KEY);location.reload();});
$('#gate-input').focus();
var saved=sessionStorage.getItem(PASS_KEY); if(saved) unlock(saved);
})();
