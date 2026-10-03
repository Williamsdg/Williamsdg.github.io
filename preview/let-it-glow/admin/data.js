/* Let It Glow concept: shared sample data + helpers for the dashboard, crew view and customer quote page.
   Everything is saved in this browser only. A live build keeps it in a shared database behind sign-in. */
(function(){
'use strict';
var KEY='lig_admin2';
var LS={get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}};
function iso(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function plus(n){var d=new Date();d.setDate(d.getDate()+n);return iso(d)}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function money(n){return '$'+Math.round(n).toLocaleString('en-US')}
function day(d){return d?new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}):''}

var STAGES=[['inquiry','Inquiry','Needs a quote'],['quoted','Quoted','Waiting on customer'],['scheduled','Scheduled','Deposit in, install booked'],['installed','Installed','Up, Stay-Lit active'],['takedown','Takedown','Coming down'],['stored','Stored','Labeled and binned']];
var CREWS=['Unassigned','Crew 1','Crew 2'];
var CENTERS={Homewood:[33.4718,-86.8008],'Mountain Brook':[33.5007,-86.7522],'Vestavia Hills':[33.4487,-86.7878],Hoover:[33.4054,-86.8114],Greystone:[33.418,-86.67],Birmingham:[33.5186,-86.8104]};
var PACKAGES=['Classic Glow','Signature Shine','Grand Display','Commercial','Permanent Lighting','Café Lighting','Wedding or Event'];
/* optional upgrades: sample prices, set by Let It Glow in the live build */
var UPGRADES=[['Lit wreath with bow',150],['Garland, per 10 ft',90],['Large tree wrap',275],['Shrub net lights, per shrub',45],['Walkway stake lights',180],['Extra timer',25]];
var DEP=50; /* deposit %, sample */
var CHECK={install:['Lights match the approved design','Every strand tested and lit','Timer set, dusk to 11 pm','Cords tucked and clips secure','Walked the property with the customer'],
  takedown:['All strands and décor down','Strands labeled for this property','Clips removed, nothing left on the roof','Loaded into the storage bin']};

function seed(){
  var jan=new Date().getFullYear()+1,last=new Date().getFullYear()-1;
  function q(pkg,base,extras,status,exp){return {pkg:pkg,base:base,extras:extras||[],status:status,expires:exp||''}}
  return {invSeq:1011,
   items:[
    {k:'c9ww',n:'C9 warm white strand',u:'ft',on:6000,loc:'Shelf A'},
    {k:'c9mc',n:'C9 multicolor strand',u:'ft',on:1500,loc:'Shelf A'},
    {k:'c9rg',n:'C9 red & green strand',u:'ft',on:1200,loc:'Shelf A'},
    {k:'mini',n:'Mini-light sets',u:'sets',on:220,loc:'Shelf B'},
    {k:'net',n:'Net lights for shrubs',u:'nets',on:14,loc:'Shelf B'},
    {k:'wr',n:'Lit wreaths',u:'',on:40,loc:'Rack C'},
    {k:'gar',n:'Garland',u:'ft',on:600,loc:'Rack C'},
    {k:'bow',n:'Red velvet bows',u:'',on:80,loc:'Rack C'},
    {k:'clip',n:'Roof clips',u:'bags',on:90,loc:'Bin wall'},
    {k:'tmr',n:'Timers',u:'',on:70,loc:'Bin wall'},
    {k:'cord',n:'Extension cords',u:'',on:110,loc:'Bin wall'}
   ],
   jobs:[
    {id:'J1',inv:'LIG-1001',name:'Sample · Dana R.',phone:'(205) 555-0142',area:'Homewood',kind:'holiday',stage:'inquiry',feet:0,notes:'Two front gables and a dormer. Wants a wreath over the door.',source:'Website',items:{},q:q('Signature Shine',0,[],'draft'),paid:0},
    {id:'J2',inv:'LIG-1002',name:'Sample · Marcus T.',phone:'(205) 555-0177',area:'Vestavia Hills',kind:'year',stage:'inquiry',feet:0,notes:'Asked about color-changing roofline LEDs before spring.',source:'Website',items:{},q:q('Permanent Lighting',0,[],'draft'),paid:0},
    {id:'J3',inv:'LIG-1003',name:'Sample · Priya N.',phone:'(205) 555-0119',area:'Mountain Brook',kind:'holiday',stage:'quoted',feet:310,notes:'Steep roof on the left wing. Three large oaks in the front yard.',design:'Warm white roofline, three tree wraps, garland on the porch rail',source:'Phone',items:{},q:q('Grand Display',2400,[['Large tree wrap × 3',825],['Garland, 20 ft',180]],'sent',plus(5)),paid:0},
    {id:'J4',inv:'LIG-1004',name:'Sample · Corner Café',phone:'(205) 555-0101',area:'Homewood',kind:'year',stage:'quoted',feet:0,notes:'Patio strings, owner wants install before a private event.',design:'Warm café strings across the patio, four runs',source:'Website',items:{},q:q('Café Lighting',2200,[],'approved',plus(9)),paid:0},
    {id:'J5',inv:'LIG-1005',name:'Sample · Lena K.',phone:'(205) 555-0163',area:'Homewood',kind:'holiday',stage:'scheduled',date:plus(0),crew:'Crew 1',down:jan+'-01-05',feet:205,notes:'Gate code on file. Outlet is on the right side of the porch. Dog in the back yard.',design:'Warm white roofline, two shrubs netted',items:{c9ww:205,net:2,clip:3,tmr:1,cord:3},q:q('Signature Shine',1760,[['Shrub net lights × 2',90]],'approved'),paid:925},
    {id:'J6',inv:'LIG-1006',name:'Sample · Whitfield Dental',phone:'(205) 555-0188',area:'Hoover',kind:'holiday',stage:'scheduled',date:plus(0),crew:'Crew 2',down:jan+'-01-07',feet:380,notes:'Install after 5:30 pm, once the lot empties. Roof access by ladder at the rear.',design:'Multicolor roofline and window frames, wreath over the sign',items:{c9mc:380,wr:1,bow:1,clip:5,tmr:2,cord:6},q:q('Commercial',3750,[['Lit wreath with bow',150]],'approved'),paid:1950},
    {id:'J7',inv:'LIG-1007',name:'Sample · The Hallorans',phone:'(205) 555-0126',area:'Greystone',kind:'holiday',stage:'scheduled',date:plus(2),crew:'Crew 1',down:jan+'-01-08',feet:420,notes:'Long driveway, bring the tall ladder. Timers go in the garage.',design:'Warm white roofline, driveway tree wraps, lit wreaths in six windows',items:{c9ww:420,mini:48,wr:6,bow:6,net:6,clip:6,tmr:3,cord:8},q:q('Grand Display',3150,[['Lit wreath with bow × 6',900],['Large tree wrap × 2',550]],'approved'),paid:2300},
    {id:'J8',inv:'LIG-1008',name:'Sample · Grace B.',phone:'(205) 555-0134',area:'Vestavia Hills',kind:'holiday',stage:'scheduled',date:plus(7),crew:'Unassigned',down:jan+'-01-06',feet:140,notes:'Hillside lot. Park on the street.',design:'Warm white front roofline',items:{c9ww:140,clip:2,tmr:1,cord:2},q:q('Classic Glow',950,[],'approved'),paid:950},
    {id:'J9',inv:'LIG-1009',name:'Sample · Omar S.',phone:'(205) 555-0155',area:'Homewood',kind:'holiday',stage:'installed',date:plus(-2),crew:'Crew 1',down:jan+'-01-05',feet:190,notes:'Returning customer. Strands are cut to fit, bin B-07.',design:'Red and green roofline, one wrapped tree',bin:'B-07',items:{c9rg:190,mini:12,net:4,clip:3,tmr:1,cord:3},q:q('Signature Shine',1325,[['Large tree wrap',275]],'approved'),paid:1600},
    {id:'J10',inv:'LIG-1010',name:'Sample · Tri-County Realty',phone:'(205) 555-0110',area:'Birmingham',kind:'holiday',stage:'installed',date:plus(-1),crew:'Crew 2',down:jan+'-01-07',feet:260,notes:'Storefront on a busy street. Cones are in the truck.',design:'Warm white roofline, garland and bows around the sign',items:{c9ww:260,gar:40,bow:4,clip:4,tmr:1,cord:4},q:q('Commercial',2440,[['Garland, 40 ft',360]],'approved'),paid:1400},
    {id:'J11',inv:'LIG-0987',name:'Sample · The Ansleys',phone:'(205) 555-0172',area:'Mountain Brook',kind:'holiday',stage:'stored',date:last+'-11-18',crew:'Crew 1',feet:230,notes:'Last season. Ready for a returning-customer call.',design:'Warm white roofline, wreaths on the gate posts',bin:'A-12',items:{},q:q('Signature Shine',1800,[['Lit wreath with bow × 2',300]],'approved'),paid:2100}
   ],
   tickets:[
    {id:'T1',job:'J9',name:'Sample · Omar S.',issue:'A few bulbs are out',where:'Left gable',at:plus(0),status:'open',source:'Text'},
    {id:'T2',job:'J10',name:'Sample · Tri-County Realty',issue:'The timer isn\'t working',where:'Front outlet',at:plus(-1),status:'done',source:'Phone'}
   ]};
}
function load(){return LS.get(KEY,null)||seed()}
function save(S){return LS.set(KEY,S)}
function reset(){try{[KEY,'lig_admin','lig_requests','lig_service','lig_site'].forEach(function(k){localStorage.removeItem(k)})}catch(e){}return seed()}
function total(j){if(!j.q)return 0;return (+j.q.base||0)+(j.q.extras||[]).reduce(function(a,x){return a+(+x[1]||0)},0)}
function deposit(j){return Math.round(total(j)*DEP/100)}
function due(j){return Math.max(0,total(j)-(j.paid||0))}
/* one label for where the money stands */
function pay(j){
  var t=total(j),p=j.paid||0;
  if(!t)return ['none','No quote yet'];
  if(j.q.status==='draft')return ['draft','Quote not sent'];
  if(j.q.status==='sent')return [j.q.expires&&j.q.expires<plus(0)?'expired':'sent',j.q.expires&&j.q.expires<plus(0)?'Quote expired':'Awaiting approval'];
  if(p<=0)return ['dep','Deposit due '+money(deposit(j))];
  if(p<t)return ['bal','Balance '+money(t-p)];
  return ['paid','Paid in full'];
}
window.LIG={LS:LS,STAGES:STAGES,CREWS:CREWS,CENTERS:CENTERS,PACKAGES:PACKAGES,UPGRADES:UPGRADES,DEP:DEP,CHECK:CHECK,
  load:load,save:save,reset:reset,seed:seed,total:total,deposit:deposit,due:due,pay:pay,esc:esc,money:money,day:day,plus:plus};
})();
