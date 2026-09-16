/* Iron Oak v2 — shared data + rendering. Fictional business, sample data only. */
(function(){
'use strict';

var IO = window.IO = {};

/* ---------------- deterministic sample data ---------------- */
IO.DAYPARTS = {
  morning: {
    label:'Morning', when:'7–11 am', kicker:'Now pouring',
    headline:'Espresso, pour-overs & warm buns',
    blurb:'The machine warms up first. Stand-up coffee at the counter, a biscuit to go, or a table by the window while the street wakes up.',
    cta:{label:'Order ahead (sample)', action:'order'},
    photo:{src:'assets/morning.jpg', w:1400, h:933, alt:'An espresso machine and grinder on a café counter, a barista’s hand reaching for a portafilter, printed in butter and espresso ink.', cap:'Morning counter · stock photo, print-treated'},
    menuTitle:'Morning board', menuNote:'Served 7–11 am (8–11 on weekends)',
    menu:[
      {n:'House drip',d:'Medium roast, bottomless while you sit.',p:'3.25'},
      {n:'Cortado',d:'Double shot, equal part steamed milk.',p:'4.25'},
      {n:'Pour-over of the week',d:'Hand-poured to order. Ask what’s on the scale.',p:'6.00',tag:'slow bar'},
      {n:'Cardamom morning bun',d:'Laminated dough, cardamom sugar, orange zest.',p:'4.75'},
      {n:'Egg & cheddar biscuit',d:'Soft scramble, sharp cheddar, pepper jam.',p:'7.50'},
      {n:'Butter toast & jam',d:'Thick-cut sourdough, cultured butter, jam of the week.',p:'5.00'}
    ]
  },
  midday: {
    label:'Midday', when:'11 am–4 pm', kicker:'Now cooking',
    headline:'Scratch sandwiches, soup & big toast',
    blurb:'By eleven the flat-top is going. Order at the counter, grab a number, and we’ll bring it over — lunch in under an hour, or linger.',
    cta:{label:'See lunch menu', action:'menu'},
    photo:{src:'assets/midday.jpg', w:1400, h:933, alt:'A chicken salad sandwich in paper, waffle fries and a cup of soup on a white plate, printed in tomato and cream ink.', cap:'Lunch plate · stock photo, print-treated'},
    menuTitle:'Lunch board', menuNote:'Served 11 am–4 pm (until 3 on Mon & Sun)',
    menu:[
      {n:'Tomato & whipped ricotta toast',d:'Slow-roasted tomatoes, basil, sourdough.',p:'11.00'},
      {n:'The Iron Oak club',d:'Smoked turkey, bacon, sharp cheddar, griddled sourdough.',p:'14.00'},
      {n:'Squash & farro bowl',d:'Roasted squash, greens, pepitas, cider vinaigrette.',p:'13.00'},
      {n:'Chicken salad bun + cup of soup',d:'Herby chicken salad, pickled onion, waffle fries on the side.',p:'13.00',tag:'pictured'},
      {n:'Pickle plate',d:'Whatever we pickled this week, with mustard.',p:'6.00'},
      {n:'Half & half iced tea',d:'Black tea, fresh lemonade.',p:'3.50'}
    ]
  },
  afterdark: {
    label:'After Dark', when:'4 pm–late', kicker:'Now pouring & playing',
    headline:'Pints, pretzels & a small stage',
    blurb:'Chairs turn toward the stage. A short food menu, a handful of taps, and something happening most nights — trivia, open mic, or a band.',
    cta:{label:'Reserve a spot for tonight’s show', action:'show'},
    photo:{src:'assets/afterdark.jpg', w:1400, h:933, alt:'A small stage with a drum kit, two guitars and an amp against a velvet curtain, printed in espresso, tomato and butter ink.', cap:'Small stage · stock photo, print-treated'},
    menuTitle:'After-dark board', menuNote:'Kitchen until 9 pm · bar until close',
    menu:[
      {n:'House lager, 16 oz',d:'Crisp, cold, the one most people start with.',p:'6.00'},
      {n:'Guest tap',d:'One rotating pour from a nearby brewery — ask the bar.',p:'7.00'},
      {n:'Dry cider',d:'Apple-forward, not sweet.',p:'7.00'},
      {n:'Hot pretzel & beer mustard',d:'Big enough to share, salted on top.',p:'9.00'},
      {n:'Smash burger',d:'Two thin patties, onions, pickles, house sauce.',p:'15.00'},
      {n:'Espresso tonic',d:'For the ones staying late and staying sharp.',p:'5.50',tag:'no-alcohol'}
    ]
  }
};
IO.ORDER = ['morning','midday','afterdark'];
IO.ALWAYS = ['Drip coffee','Tea & cocoa','Sparkling water','Kids’ grilled cheese'];

/* hours: [morning, midday, afterdark] per day, Sun=0 */
IO.HOURS = [
  {d:'Sunday',   h:['8–11 am','11 am–3 pm',null]},
  {d:'Monday',   h:['7–11 am','11 am–3 pm',null]},
  {d:'Tuesday',  h:['7–11 am','11 am–4 pm','4–10 pm']},
  {d:'Wednesday',h:['7–11 am','11 am–4 pm','4–10 pm']},
  {d:'Thursday', h:['7–11 am','11 am–4 pm','4–10 pm']},
  {d:'Friday',   h:['7–11 am','11 am–4 pm','4 pm–midnight']},
  {d:'Saturday', h:['8–11 am','11 am–4 pm','4 pm–midnight']}
];

IO.EVENTS = [
  {id:'kettle-coils', part:'afterdark', title:'Kettle & The Coils', short:'Kettle & the Coils', day:'Friday', dayShort:'Fri', time:'8:30 pm', doors:'Doors 8:00 pm',
   where:'Small stage', price:'No cover (sample)', capacity:60, taken:37,
   line:'A four-piece porch-soul band (fictional) playing two short sets.',
   desc:['Kettle & The Coils are an invented band for this concept — think warm organ, a tidy rhythm section and songs short enough to order a second pretzel between.','Two sets with a break. The room is standing-friendly with a few tables held for sample reservations.']},
  {id:'trivia', part:'afterdark', title:'Tuesday Trivia', short:'Tuesday Trivia', day:'Tuesday', dayShort:'Tue', time:'7:00 pm', doors:'Teams seated by 6:45',
   where:'Main room', price:'Free to play (sample)', capacity:40, taken:28,
   line:'Six rounds, one picture round, teams of one to six.',
   desc:['Six rounds of general knowledge, one picture round and a final wager. Teams of one to six — solo players are welcome to join a table.','Kitchen stays open through the quiz. Places here count players, not teams.']},
  {id:'open-mic', part:'afterdark', title:'Open Mic Night', short:'Open Mic', day:'Thursday', dayShort:'Thu', time:'7:30 pm', doors:'Sign-up sheet at 7:00',
   where:'Small stage', price:'Free (sample)', capacity:30, taken:16,
   line:'Five minutes each. Songs, poems, short stand-up.',
   desc:['Put your name on the sheet at the bar from 7:00. Five minutes each, one house guitar and one mic — bring your own instrument if you have one.','A reserved place here holds a seat for listeners; performers still sign up on the night.']},
  {id:'pour-over-101', part:'morning', title:'Pour-Over 101', short:'Pour-Over 101', day:'Saturday', dayShort:'Sat', time:'9:00 am', doors:'45 minutes',
   where:'Slow bar', price:'Sample class', capacity:12, taken:7,
   line:'Grind, bloom, pour, taste — at the slow bar.',
   desc:['A small, hands-on class at the slow bar. We’ll dial in one coffee three ways so you can taste what grind size and pour speed actually change.','Everyone brews their own cup. No equipment needed.']},
  {id:'crossword-coffee', part:'morning', title:'Crossword & Coffee', short:'Crossword & Coffee', day:'Sunday', dayShort:'Sun', time:'8:30 am', doors:'Pens provided',
   where:'Long table', price:'Free (sample)', capacity:20, taken:9,
   line:'Printed puzzles, a long table, shared answers.',
   desc:['We print a stack of puzzles and push the tables together. Solve alone, trade clues with strangers, or just read over a shoulder.','Reserve a seat at the long table; the counter is open to everyone as usual.']},
  {id:'lunch-sketch', part:'midday', title:'Lunch-Hour Sketch Club', short:'Lunch-Hour Sketch', day:'Wednesday', dayShort:'Wed', time:'12:15 pm', doors:'45 minutes',
   where:'Window tables', price:'Free (sample)', capacity:16, taken:7,
   line:'Draw the room while you eat. Paper on us.',
   desc:['Bring a pencil — we put paper on the window tables. Draw the street, the counter, your sandwich. No teaching, no critique, just a quiet lunch with a sketchbook.','Back at your desk inside the hour.']}
];
IO.eventById = function(id){ for (var i=0;i<IO.EVENTS.length;i++) if (IO.EVENTS[i].id===id) return IO.EVENTS[i]; return null; };

/* ---------------- storage (localStorage, prefixed) ---------------- */
var KEY = 'v2-iron-oak-reservations';
IO.loadRes = function(){ try { var v = JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(v)?v:[]; } catch(e){ return []; } };
IO.saveRes = function(list){ try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch(e){ return false; } };
IO.resetDemo = function(){ try { localStorage.removeItem(KEY); localStorage.removeItem('v2-iron-oak-daypart'); } catch(e){} };
IO.placesLeft = function(ev){
  var mine = IO.loadRes().filter(function(r){return r.eventId===ev.id;}).reduce(function(s,r){return s+(+r.party||0);},0);
  return Math.max(0, ev.capacity - ev.taken - mine);
};

IO.esc = function(s){ return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); };

/* ---------------- SVG art ---------------- */
IO.svg = {
  sun:'<svg class="ico" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="34" r="12" fill="currentColor"/><g stroke="currentColor" stroke-width="4" stroke-linecap="square"><path d="M30 6v9M30 53v4M6 34h8M46 34h8M13 17l6 6M47 17l-6 6"/></g><path d="M4 48h52" stroke="currentColor" stroke-width="4"/></svg>',
  plate:'<svg class="ico" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="32" r="22" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="30" cy="32" r="12" fill="currentColor"/><path d="M24 30h12M26 35h8" stroke="var(--ground)" stroke-width="2.5"/><path d="M4 12v16M8 12v16M6 28v24M56 12c-5 3-5 14 0 16v24" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
  moon:'<svg class="ico" viewBox="0 0 60 60" aria-hidden="true"><path d="M38 8a22 22 0 1 0 16 36A18 18 0 0 1 38 8z" fill="currentColor"/><path d="M14 10l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="currentColor"/></svg>',
  mark:'<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18.5" fill="var(--ink)"/><path d="M10 19c0-6 4.5-9 10-9s10 3 10 9z" fill="var(--ground)"/><path d="M13 17h14M15 14h10" stroke="var(--ink)" stroke-width="1.6"/><path d="M12 21h16c0 7-3.6 11-8 11s-8-4-8-11z" fill="var(--ground)"/><path d="M20 10V6.5" stroke="var(--ground)" stroke-width="2.4"/></svg>',
  reg:'<svg class="reg {c}" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="6.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M13 0v26M0 13h26" stroke="currentColor" stroke-width="1.4"/></svg>',
  mic:'<svg viewBox="0 0 80 150" aria-hidden="true"><rect x="22" y="4" width="36" height="56" rx="18" fill="#F2DE98"/><g stroke="#A63A25" stroke-width="3"><path d="M26 22h28M26 32h28M26 42h28"/></g><path d="M12 44c0 22 12 34 28 34s28-12 28-34" fill="none" stroke="#F2DE98" stroke-width="7"/><path d="M40 78v52M18 142h44" stroke="#F2DE98" stroke-width="8"/></svg>',
  burst:'<svg viewBox="0 0 200 200" aria-hidden="true"><g fill="#C84C36">'+(function(){var s='';for(var i=0;i<16;i++){var a=i*Math.PI/8,b=a+Math.PI/22;s+='<path d="M100 100L'+(100+98*Math.cos(a)).toFixed(1)+' '+(100+98*Math.sin(a)).toFixed(1)+'L'+(100+98*Math.cos(b)).toFixed(1)+' '+(100+98*Math.sin(b)).toFixed(1)+'z"/>';}return s;})()+'</g><circle cx="100" cy="100" r="46" fill="#3A2821"/><circle cx="100" cy="100" r="30" fill="none" stroke="#F2DE98" stroke-width="4"/><circle cx="100" cy="100" r="6" fill="#F2DE98"/></svg>',
  dripper:'<svg viewBox="0 0 200 170" aria-hidden="true"><path d="M40 18h120l-44 70H84z" fill="#3A2821"/><path d="M58 30h84M70 46h60M82 62h36" stroke="#FBF4E2" stroke-width="4"/><path d="M160 30c22 0 22 30 0 30" fill="none" stroke="#3A2821" stroke-width="8"/><rect x="72" y="88" width="56" height="8" fill="#3A2821"/><path d="M100 98v14" stroke="#C84C36" stroke-width="5" stroke-dasharray="5 4"/><path d="M58 116h84v38a14 14 0 0 1-14 14H72a14 14 0 0 1-14-14z" fill="#C84C36"/><path d="M58 132h84" stroke="#3A2821" stroke-width="4"/><path d="M20 168h160" stroke="#3A2821" stroke-width="5"/><g fill="none" stroke="#C84C36" stroke-width="3"><path d="M100 8c-10-4-14 4-8 8"/></g></svg>',
  pencil:'<svg viewBox="0 0 90 200" aria-hidden="true"><path d="M8 14c30 8 50 2 74 10M6 40c28-6 54 6 78-2M10 64c22 10 50-2 70 8" fill="none" stroke="#C84C36" stroke-width="3" stroke-linecap="round"/><g transform="rotate(14 45 130)"><rect x="34" y="84" width="22" height="92" fill="#3A2821"/><rect x="34" y="84" width="22" height="12" fill="#C84C36"/><path d="M34 176h22l-11 22z" fill="#F2DE98" stroke="#3A2821" stroke-width="3"/><path d="M42 192h6l-3 6z" fill="#3A2821"/></g></svg>'
};

/* Storefront block print. Colors come from daypart tokens; sky + windows switch per daypart. */
IO.storefront = function(){
  return '<svg viewBox="0 0 560 380" role="img" aria-labelledby="sf-t"><title id="sf-t">Block-print illustration of the Iron Oak storefront: a corner building with a striped awning, a big front window, a door, a chalkboard sign and an oak tree.</title>'+
  '<g class="sky">'+
    '<g class="sk-morning"><circle cx="470" cy="70" r="36" fill="var(--accent)"/><g stroke="var(--ink)" stroke-width="5"><path d="M470 14v12M470 114v8M414 70h-12M538 70h-10M430 30l8 8M510 30l-8 8"/></g></g>'+
    '<g class="sk-midday"><circle cx="330" cy="36" r="28" fill="var(--accent)"/><g stroke="var(--ink)" stroke-width="5"><path d="M330 0v4M290 36h-12M382 36h-12M300 8l6 6M360 8l-6 6"/></g></g>'+
    '<g class="sk-afterdark"><path d="M488 32a34 34 0 1 0 26 56 28 28 0 0 1-26-56z" fill="var(--ink)"/><g fill="var(--ink)"><path d="M400 30l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/><circle cx="540" cy="130" r="3"/><circle cx="430" cy="92" r="2.5"/><circle cx="362" cy="18" r="2.5"/></g></g>'+
  '</g>'+
  /* building */
  '<path d="M40 92h384v272H40z" fill="var(--ink)"/>'+
  '<path d="M30 80h404v18H30z" fill="var(--ink)"/>'+
  '<g fill="var(--ground)"><rect x="46" y="86" width="10" height="5"/><rect x="72" y="86" width="10" height="5"/><rect x="98" y="86" width="10" height="5"/><rect x="124" y="86" width="10" height="5"/><rect x="150" y="86" width="10" height="5"/><rect x="176" y="86" width="10" height="5"/><rect x="202" y="86" width="10" height="5"/><rect x="228" y="86" width="10" height="5"/><rect x="254" y="86" width="10" height="5"/><rect x="280" y="86" width="10" height="5"/><rect x="306" y="86" width="10" height="5"/><rect x="332" y="86" width="10" height="5"/><rect x="358" y="86" width="10" height="5"/><rect x="384" y="86" width="10" height="5"/><rect x="410" y="86" width="10" height="5"/></g>'+
  /* sign band */
  '<rect x="64" y="110" width="336" height="42" fill="var(--ground)"/>'+
  '<text x="232" y="140" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="17" letter-spacing="2" fill="var(--ink)">COFFEE · KITCHEN · TAPS</text>'+
  /* awning */
  '<g><path d="M56 164h352v26H56z" fill="var(--ground)"/>'+
  (function(){var s='';for(var i=0;i<11;i++){ if(i%2===0) s+='<rect x="'+(56+i*32)+'" y="164" width="32" height="26" fill="var(--accent)"/>'; } for(var j=0;j<11;j++){ s+='<path d="M'+(56+j*32)+' 190a16 12 0 0 0 32 0z" fill="'+(j%2===0?'var(--accent)':'var(--ground)')+'"/>'; } return s;})()+
  '</g>'+
  /* front window */
  '<rect x="64" y="214" width="200" height="118" fill="var(--window)"/>'+
  '<g stroke="var(--ink)" stroke-width="6"><path d="M130 214v118M196 214v118"/></g>'+
  '<g class="lamps" fill="var(--ink)"><path d="M97 214v16M163 214v16M229 214v16" stroke="var(--ink)" stroke-width="2"/><path d="M87 240a10 10 0 0 1 20 0z"/><path d="M153 240a10 10 0 0 1 20 0z"/><path d="M219 240a10 10 0 0 1 20 0z"/></g>'+
  '<rect x="64" y="300" width="200" height="8" fill="var(--ink)"/>'+
  '<g fill="var(--ink)"><rect x="80" y="286" width="12" height="14"/><rect x="100" y="282" width="14" height="18"/><path d="M146 300h22l-3-18h-16z"/><rect x="210" y="280" width="10" height="20"/><rect x="224" y="286" width="16" height="14"/></g>'+
  '<g stroke="var(--ink)" stroke-width="2" opacity=".55"><path d="M72 322l20-10M110 326l26-14M208 324l30-16"/></g>'+
  /* door */
  '<rect x="288" y="206" width="84" height="158" fill="var(--ground)"/>'+
  '<rect x="296" y="214" width="68" height="142" fill="var(--ink)"/>'+
  '<circle cx="330" cy="252" r="22" fill="var(--window)"/><path d="M330 230v44M308 252h44" stroke="var(--ink)" stroke-width="4"/>'+
  '<rect x="352" y="294" width="6" height="22" fill="var(--ground)"/>'+
  '<g stroke="var(--ground)" stroke-width="2"><path d="M304 290v58M312 296v50"/></g>'+
  /* side window */
  '<rect x="392" y="214" width="22" height="100" fill="var(--window)"/>'+
  /* sidewalk */
  '<path d="M0 362h560v18H0z" fill="var(--ink)"/>'+
  '<g stroke="var(--ground)" stroke-width="2"><path d="M20 370h40M90 372h26M150 369h52M250 372h30M330 370h46M420 372h24M480 369h40"/></g>'+
  /* chalkboard */
  '<path d="M4 362l18-80h56l18 80h-10l-14-64H46l-14 64z" fill="var(--ink)"/><path d="M28 292h44l12 58H16z" fill="var(--ink)"/><path d="M30 300h40l9 42H21z" fill="var(--ground)"/><g stroke="var(--ink)" stroke-width="3" stroke-linecap="round"><path d="M34 312h30M30 322h38M28 332h22"/></g>'+
  /* oak tree */
  '<path d="M480 362c4-40 2-80-6-120h22c-6 40-6 80-2 120z" fill="var(--ink)"/>'+
  '<path d="M478 280l-26-24M492 270l24-18" stroke="var(--ink)" stroke-width="9"/>'+
  '<g fill="var(--ink)"><circle cx="486" cy="206" r="54"/><circle cx="438" cy="236" r="32"/><circle cx="534" cy="232" r="32"/><circle cx="460" cy="176" r="30"/><circle cx="516" cy="172" r="30"/><circle cx="488" cy="150" r="30"/></g>'+
  '<g fill="none" stroke="var(--ground)" stroke-width="3" stroke-linecap="round"><path d="M456 196c8-6 14-6 22 0M496 176c8-6 14-6 22 0M470 230c8-6 14-6 22 0M510 214c6-5 12-5 18 0M444 246c5-4 10-4 15 0M486 150c6-5 12-5 18 0"/></g>'+
  '<g fill="var(--accent)"><ellipse cx="452" cy="206" rx="6" ry="8"/><ellipse cx="522" cy="252" rx="6" ry="8"/></g>'+
  '</svg>';
};

/* ---------------- poster renderers ---------------- */
IO.poster = function(ev, opts){
  opts = opts || {};
  var tag = opts.tag || 'a';
  var href = tag==='a' ? ' href="event.html?id='+ev.id+'"' : '';
  var label = tag==='a' ? ' aria-label="'+IO.esc(ev.title+' — '+ev.day+' '+ev.time+'. Open event and reserve a sample place.')+'"' : '';
  var inner = '';
  switch(ev.id){
    case 'kettle-coils':
      inner = '<span class="pp-art">'+IO.svg.burst+'</span>'+
        '<span class="pp-kicker">Iron Oak small stage presents</span>'+
        '<span class="pp-title">Kettle<small>&amp; the</small>Coils</span>'+
        '<span class="pp-line">'+IO.esc(ev.line)+'</span>'+
        '<span class="pp-foot"><span class="pp-meta">'+ev.day+'s · music '+ev.time+'<br>'+ev.doors+'</span><span class="pp-kicker">No cover<br>(sample)</span></span>';
      break;
    case 'trivia':
      inner = '<span class="pp-q" aria-hidden="true">?</span>'+
        '<span class="pp-kicker">Every week · main room</span>'+
        '<span class="pp-title">Tuesday<br>Trivia</span>'+
        '<span class="pp-line">Six rounds. One picture round. Teams of 1–6.</span>'+
        '<span class="pp-meta">Tuesdays · 7:00 pm</span>';
      break;
    case 'pour-over-101':
      inner = '<span class="pp-kicker">A class at the slow bar</span>'+
        '<span class="pp-title">Pour-Over 101</span>'+
        '<span class="pp-art">'+IO.svg.dripper+'</span>'+
        '<ol><li><span>Grind</span><span>medium-fine</span></li><li><span>Bloom</span><span>30 sec</span></li><li><span>Pour</span><span>slow spiral</span></li><li><span>Taste</span><span>then again</span></li></ol>'+
        '<span class="pp-line">'+IO.esc(ev.line)+'</span>'+
        '<span class="pp-meta">Saturdays · 9:00 am · 45 min</span>';
      break;
    case 'open-mic':
      inner = '<span class="pp-kicker">Thursdays · small stage</span>'+
        '<span class="pp-title">Open<br>Mic</span>'+
        '<span class="pp-art">'+IO.svg.mic+'</span>'+
        '<span class="pp-line">Five minutes each. Songs, poems, short stand-up.</span>'+
        '<span class="signup" aria-hidden="true"><span>1. ______________</span><span>2. ______________</span><span>3. ______________</span></span>'+
        '<span class="pp-meta">Sheet out 7:00 · first act 7:30 pm</span>';
      break;
    case 'crossword-coffee':
      var g = 'COFFEE'.split('').map(function(c){return '<i class="hl">'+c+'</i>';}).join('') +
              '<i>U</i><i class="blk"></i><i>R</i><i class="blk"></i><i>A</i><i class="blk"></i>' +
              '<i>P</i><i class="blk"></i><i>E</i><i class="blk"></i><i>S</i><i class="blk"></i>';
      inner = '<span class="pp-kicker">Sundays · long table</span>'+
        '<span class="grid" aria-hidden="true">'+g+'</span>'+
        '<span class="pp-title">Crossword &amp; Coffee</span>'+
        '<span class="pp-line">'+IO.esc(ev.line)+'</span>'+
        '<span class="pp-meta">8:30 am · pens provided</span>';
      break;
    case 'lunch-sketch':
      inner = '<span class="pp-col"><span class="pp-kicker">Wednesdays · window tables</span>'+
        '<span class="pp-title">Lunch-Hour <em>Sketch</em> Club</span>'+
        '<span class="pp-line">'+IO.esc(ev.line)+'</span>'+
        '<span class="pp-meta">12:15 pm · back at your desk by 1</span></span>'+
        '<span class="pp-art">'+IO.svg.pencil+'</span>';
      break;
  }
  return '<'+tag+' class="pposter pp-'+ev.id+'"'+href+label+'><span class="pp-inner">'+inner+'</span></'+tag+'>';
};

IO.ticketCard = function(ev, isNow){
  var left = IO.placesLeft(ev);
  return '<li class="tcard tc-'+ev.id+(isNow?' is-now':'')+'"><a href="event.html?id='+ev.id+'">'+
    '<span class="tc-stub"><big>'+ev.dayShort+'</big>'+ev.time+'</span>'+
    '<span class="tc-body"><b>'+IO.esc(ev.title)+'</b><span>'+IO.esc(ev.line)+'</span>'+
    '<span class="mono">'+IO.DAYPARTS[ev.part].label+' · '+left+' of '+ev.capacity+' sample places left'+(isNow?' · on now':'')+'</span></span></a></li>';
};

IO.todayIndex = function(){ return new Date().getDay(); };
})();
