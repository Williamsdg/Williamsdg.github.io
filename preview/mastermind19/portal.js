/* Mastermind19 portal engine (concept). Sample data lives in this browser only (localStorage). Nothing is sent anywhere. */
(function(){
  var KEY='m19-portal-demo-v1';
  var today=new Date(); var ymd=today.toISOString().slice(0,10);

  function seed(){
    return {
      day: ymd,
      me: 'm1',
      members: [
        {id:'m1', first:'Grant', last:'Whitfield', company:'Whitfield Capital Partners', industry:'Real estate', city:'Scottsdale, AZ', club:'Yes', hcp:9.4, tier:'Founding Member', joined:'2026-08', revenue:'$3M – $10M', events:3},
        {id:'m2', first:'Priya', last:'Raman', company:'Northstar Dental Group', industry:'Healthcare', city:'Dallas, TX', club:'Yes', hcp:14.2, tier:'Founding Member', joined:'2026-08', revenue:'$10M – $25M', events:2},
        {id:'m3', first:'Caleb', last:'Osterman', company:'Osterman Roofing', industry:'Home services', city:'Boise, ID', club:'No', hcp:6.8, tier:'Member', joined:'2026-09', revenue:'$3M – $10M', events:1},
        {id:'m4', first:'Danielle', last:'Kwan', company:'Kwan & Vale Law', industry:'Legal', city:'Irvine, CA', club:'Yes', hcp:18.0, tier:'Member', joined:'2026-09', revenue:'$1M – $3M', events:1},
        {id:'m5', first:'Marcus', last:'Beaumont', company:'Beaumont Logistics', industry:'Logistics', city:'Nashville, TN', club:'Yes', hcp:11.5, tier:'Founding Member', joined:'2026-08', revenue:'$25M+', events:3},
        {id:'m6', first:'Tomás', last:'Herrera', company:'Herrera Home Builders', industry:'Construction', city:'San Antonio, TX', club:'No', hcp:8.1, tier:'Member', joined:'2026-10', revenue:'$10M – $25M', events:0},
        {id:'m7', first:'Avery', last:'Lindqvist', company:'Lindqvist Capital', industry:'Investing', city:'Denver, CO', club:'Yes', hcp:12.9, tier:'Member', joined:'2026-09', revenue:'Investor', events:1},
        {id:'m8', first:'Jordan', last:'Okafor', company:'Okafor Digital', industry:'Marketing', city:'Atlanta, GA', club:'No', hcp:21.3, tier:'Member', joined:'2026-10', revenue:'$1M – $3M', events:0},
        {id:'m9', first:'Elena', last:'Petrova', company:'Petrova Ortho', industry:'Healthcare', city:'Las Vegas, NV', club:'Yes', hcp:15.7, tier:'Founding Member', joined:'2026-08', revenue:'$3M – $10M', events:2},
        {id:'m10', first:'Wes', last:'Calloway', company:'Calloway Fleet Services', industry:'Automotive', city:'Phoenix, AZ', club:'Yes', hcp:5.2, tier:'Member', joined:'2026-09', revenue:'$10M – $25M', events:1},
        {id:'m11', first:'Naomi', last:'Fischer', company:'Fischer Franchise Group', industry:'Franchising', city:'Salt Lake City, UT', club:'No', hcp:16.4, tier:'Member', joined:'2026-10', revenue:'$3M – $10M', events:0},
        {id:'m12', first:'Reid', last:'Tanaka', company:'Tanaka Property Management', industry:'Real estate', city:'Henderson, NV', club:'Yes', hcp:10.0, tier:'Member', joined:'2026-09', revenue:'$1M – $3M', events:1}
      ],
      events: [
        {id:'e1', kind:'Vegas Golf & Mastermind Day', title:'Vegas Golf & Mastermind Day', date:'2026-11-14', where:'Las Vegas, NV', spots:16, note:'Play a round and mastermind with our founder Ryan & other M19 members.', price:'Set per event'},
        {id:'e2', kind:'Monthly Business Training', title:'November business training', date:'2026-11-05', where:'Online', spots:0, note:'Monthly business training for the M19 online community.', price:'Included'},
        {id:'e3', kind:'Member-Only Tournament', title:'Winter Member-Only Tournament', date:'2026-12-05', where:'Announced to members', spots:24, note:'Competitive & casual formats to network & claim bragging rights.', price:'Set per event'},
        {id:'e4', kind:'Monthly Business Training', title:'December business training', date:'2026-12-03', where:'Online', spots:0, note:'Monthly business training for the M19 online community.', price:'Included'},
        {id:'e5', kind:'Bucket List Golf Trip', title:'Spring Bucket List Trip', date:'2027-03-18', end:'2027-03-21', where:'Destination shared with confirmed members', spots:12, note:'Epic golf trip with masterminds built in to grow your business.', price:'Set per event'}
      ],
      rsvps: {e1:['m1','m2','m5','m9','m10','m12','m3','m7'], e2:['m1','m2','m4','m5','m9'], e3:['m5','m9','m10'], e4:[], e5:['m2','m5']},
      waitlist: {},
      trainings: [
        {id:'t1', when:'2026-08-06', title:'August business training', status:'replay'},
        {id:'t2', when:'2026-09-03', title:'September business training', status:'replay'},
        {id:'t3', when:'2026-10-01', title:'October business training', status:'replay'},
        {id:'t4', when:'2026-11-05', title:'November business training', status:'upcoming'},
        {id:'t5', when:'2026-12-03', title:'December business training', status:'upcoming'}
      ],
      intros: [ {from:'m1', to:'m5', when:'2026-10-19', status:'Connected'}, {from:'m1', to:'m2', when:'2026-10-22', status:'Requested'} ],
      applications: [
        {id:'a1', first:'Nolan', last:'Reyes', email:'nolan@reyesproperties.example', phone:'(702) 555-0142', website:'reyesproperties.example', revenue:'$1M – $3M', club:'No', hcp:'14', stage:'new', when:'2026-10-24', ref:'Website'},
        {id:'a2', first:'Simone', last:'Achebe', email:'simone@achebeclinics.example', phone:'(469) 555-0188', website:'achebeclinics.example', revenue:'$10M – $25M', club:'Yes', hcp:'22', stage:'new', when:'2026-10-23', ref:'Website'},
        {id:'a3', first:'Hank', last:'Delacroix', email:'hank@dlxtrucking.example', phone:'(615) 555-0107', website:'dlxtrucking.example', revenue:'$3M – $10M', club:'Yes', hcp:'7', stage:'call', when:'2026-10-20', ref:'Referred by Marcus Beaumont', call:'2026-10-28 10:00'},
        {id:'a4', first:'Lena', last:'Marsh', email:'lena@marshstudios.example', phone:'(323) 555-0191', website:'marshstudios.example', revenue:'Under $1M', club:'No', hcp:'', stage:'new', when:'2026-10-22', ref:'Website'},
        {id:'a5', first:'Owen', last:'Pruitt', email:'owen@pruittcapital.example', phone:'(303) 555-0133', website:'pruittcapital.example', revenue:'$25M+', club:'Yes', hcp:'3', stage:'vetting', when:'2026-10-15', ref:'Referred by Avery Lindqvist', call:'2026-10-21 14:00'},
        {id:'a6', first:'Bianca', last:'Soto', email:'bianca@sotohospitality.example', phone:'(480) 555-0155', website:'sotohospitality.example', revenue:'$3M – $10M', club:'No', hcp:'19', stage:'vetting', when:'2026-10-14', ref:'Website', call:'2026-10-20 11:00'},
        {id:'a7', first:'Trent', last:'Haverford', email:'trent@haverfordhvac.example', phone:'(801) 555-0170', website:'haverfordhvac.example', revenue:'$1M – $3M', club:'Yes', hcp:'12', stage:'accepted', when:'2026-10-08', ref:'Website', call:'2026-10-13 09:00'},
        {id:'a8', first:'Kai', last:'Morimoto', email:'kai@morimoto.example', phone:'(415) 555-0119', website:'morimoto.example', revenue:'Under $1M', club:'No', hcp:'', stage:'declined', when:'2026-10-06', ref:'Website'}
      ],
      announcements: [
        {when:'2026-10-18', title:'Vegas Golf & Mastermind Day: spots open', body:'Reserve your spot in the portal. Play a round and mastermind with Ryan & other M19 members in Las Vegas, NV.'},
        {when:'2026-10-02', title:'October training replay is up', body:'The replay is in Trainings for anyone who missed it.'}
      ]
    };
  }

  var S;
  function load(){ try{ var raw=localStorage.getItem(KEY); S = raw ? JSON.parse(raw) : null; }catch(e){ S=null; } if(!S || S.day!==ymd){ S=seed(); save(); } }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
  function reset(){ try{ localStorage.removeItem(KEY); }catch(e){} location.reload(); }
  window.addEventListener('storage', function(e){ if(e.key===KEY){ load(); render(); } });

  // ---- helpers ----
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function mem(id){ return S.members.filter(function(m){return m.id===id;})[0]; }
  function me(){ return mem(S.me); }
  function name(m){ return m.first+' '+m.last; }
  function ini(m){ return (m.first[0]+m.last[0]).toUpperCase(); }
  function d(s){ var p=s.split('-'); return new Date(+p[0], +p[1]-1, +p[2]); }
  function fmt(s, o){ return d(s).toLocaleDateString('en-US', o||{weekday:'short', month:'short', day:'numeric'}); }
  function dateBox(s){ var x=d(s); return '<div class="date"><b>'+x.getDate()+'</b><span>'+x.toLocaleDateString('en-US',{month:'short'})+'</span></div>'; }
  function upcoming(){ return S.events.filter(function(e){return e.date>=ymd;}).sort(function(a,b){return a.date<b.date?-1:1;}); }
  function going(e){ return (S.rsvps[e.id]||[]); }
  function isGoing(e){ return going(e).indexOf(S.me)>=0; }
  function spotsLeft(e){ return e.spots? Math.max(0, e.spots-going(e).length) : null; }
  function toast(msg){ var t=document.getElementById('toast'); if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; t.setAttribute('role','status'); document.body.appendChild(t);} t.textContent=msg; t.classList.add('on'); clearTimeout(t._k); t._k=setTimeout(function(){t.classList.remove('on');},2600); }
  function download(filename, text, type){ var b=new Blob([text],{type:type||'text/plain'}); var u=URL.createObjectURL(b); var a=document.createElement('a'); a.href=u; a.download=filename; document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(u); a.remove();},500); }
  function ics(e){ var s=e.date.replace(/-/g,''); var en=(e.end||e.date); var x=d(en); x.setDate(x.getDate()+1); var en2=x.toISOString().slice(0,10).replace(/-/g,'');
    var txt=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Mastermind19 concept//EN','BEGIN:VEVENT','UID:'+e.id+'@mastermind19.concept','DTSTAMP:'+ymd.replace(/-/g,'')+'T120000Z','DTSTART;VALUE=DATE:'+s,'DTEND;VALUE=DATE:'+en2,'SUMMARY:'+e.title,'LOCATION:'+e.where,'DESCRIPTION:'+e.note,'END:VEVENT','END:VCALENDAR'].join('\r\n');
    download(e.title.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.ics', txt, 'text/calendar'); toast('Calendar file downloaded'); }
  function csv(filename, rows){ download(filename, rows.map(function(r){ return r.map(function(c){ c=String(c==null?'':c); return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c; }).join(','); }).join('\r\n'), 'text/csv'); toast('CSV downloaded'); }

  var ICONS={
    home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    flag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 21V4m0 0h11l-2 4 2 4H5"/></svg>',
    people:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-5-6.3"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    inbox:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 13l2.5-8h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 13h5l1.5 3h5L16 13h5"/></svg>',
    mega:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 10v4h3l7 4V6l-7 4z"/><path d="M18 9a4 4 0 0 1 0 6"/></svg>'
  };

  // ---- views ----
  var ROLE=document.body.getAttribute('data-role')||'member';
  var VIEWS = ROLE==='member' ? {
    overview:{t:'Overview', i:'home', r:vOverview},
    events:{t:'Events', i:'flag', r:vEvents},
    members:{t:'Members', i:'people', r:vMembers},
    trainings:{t:'Trainings', i:'play', r:vTrainings},
    account:{t:'Account', i:'user', r:vAccount}
  } : {
    applications:{t:'Applications', i:'inbox', r:vApplications},
    members:{t:'Members', i:'people', r:vRoster},
    events:{t:'Events', i:'flag', r:vAdminEvents},
    trainings:{t:'Trainings', i:'play', r:vAdminTrainings},
    announcements:{t:'Announcements', i:'mega', r:vAnnouncements}
  };

  function current(){ var h=(location.hash||'').replace('#',''); return VIEWS[h]?h:Object.keys(VIEWS)[0]; }
  function nav(){
    var cur=current(); var html='';
    Object.keys(VIEWS).forEach(function(k){ var v=VIEWS[k]; var n=''; if(k==='applications'){ var c=S.applications.filter(function(a){return a.stage==='new';}).length; if(c) n='<span class="n">'+c+'</span>'; }
      html+='<a href="#'+k+'"'+(k===cur?' aria-current="page"':'')+'>'+ICONS[v.i]+'<span>'+v.t+'</span>'+n+'</a>'; });
    document.getElementById('nav').innerHTML=html; var tabs=document.getElementById('tabs'); if(tabs) tabs.innerHTML=html;
  }
  function render(){ var k=current(); nav(); document.getElementById('title').textContent=VIEWS[k].t; var out=VIEWS[k].r(); document.getElementById('view').innerHTML=out.html; document.getElementById('sub').textContent=out.sub||''; bind(); document.querySelector('.side').classList.remove('open'); var sc=document.querySelector('.scrim'); if(sc) sc.classList.remove('on'); }
  window.addEventListener('hashchange', function(){ render(); window.scrollTo(0,0); });

  // ---------- MEMBER ----------
  function vOverview(){
    var m=me(); var up=upcoming(); var next=up.filter(isGoing)[0]||up[0]; var nextT=S.trainings.filter(function(t){return t.status==='upcoming';})[0]; var lastT=S.trainings.filter(function(t){return t.status==='replay';}).slice(-1)[0];
    var hour=today.getHours(); var greet=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
    var html='<div class="g g73">'+
      '<div class="stack">'+
        '<div class="card dark"><div class="lab">Next up</div>'+(next?('<h2 style="font-size:26px;margin:4px 0 6px">'+esc(next.title)+'</h2><div class="muted">'+fmt(next.date,{weekday:'long',month:'long',day:'numeric'})+(next.end?' to '+fmt(next.end,{month:'long',day:'numeric'}):'')+' · '+esc(next.where)+'</div><div class="sep"></div><div class="row">'+(isGoing(next)?'<span class="pill gold">You’re in</span>':'<button class="btn gold" data-rsvp="'+next.id+'">Reserve my spot</button>')+'<button class="btn" data-ics="'+next.id+'">Add to calendar</button><a class="btn ghost" href="#events">All events</a></div>'):'<div class="empty"><b>Nothing scheduled yet</b>Watch for the next invitation.</div>')+'</div>'+
        '<div class="card"><div class="row between"><h2>Upcoming</h2><a class="btn sm" href="#events">See all</a></div><div class="list">'+up.slice(0,4).map(function(e){ return '<div class="it">'+dateBox(e.date)+'<div><div class="t">'+esc(e.title)+'</div><div class="m">'+esc(e.where)+(e.spots?' · '+spotsLeft(e)+' of '+e.spots+' spots open':'')+'</div></div><div class="act">'+(isGoing(e)?'<span class="pill ok">Reserved</span>':(e.spots&&!spotsLeft(e)?'<button class="btn sm" data-wait="'+e.id+'">Join waitlist</button>':'<button class="btn sm pri" data-rsvp="'+e.id+'">Reserve</button>'))+'</div></div>'; }).join('')+'</div></div>'+
        '<div class="card"><h2>From the club</h2><div class="stack">'+S.announcements.map(function(a){ return '<div><div class="muted">'+fmt(a.when,{month:'long',day:'numeric'})+'</div><div style="font-weight:500">'+esc(a.title)+'</div><div class="muted" style="color:var(--ink2)">'+esc(a.body)+'</div></div>'; }).join('<div class="sep" style="margin:6px 0"></div>')+'</div></div>'+
      '</div>'+
      '<div class="stack">'+
        '<div class="card"><div class="lab">Your membership</div><div class="big">'+esc(m.tier)+'</div><div class="muted" style="margin-top:6px">Member since '+fmt(m.joined+'-01',{month:'long',year:'numeric'})+' · '+esc(m.company)+'</div><div class="sep"></div><div class="row" style="gap:18px"><div class="stat"><span class="big" style="font-size:26px">'+m.events+'</span><span class="d">events attended</span></div><div class="stat"><span class="big" style="font-size:26px">'+m.hcp.toFixed(1)+'</span><span class="d">handicap</span></div><div class="stat"><span class="big" style="font-size:26px">'+(m.club==='Yes'?'Yes':'No')+'</span><span class="d">private club</span></div></div></div>'+
        '<div class="card"><div class="row between"><h2>Trainings</h2><a class="btn sm" href="#trainings">All</a></div>'+(nextT?'<div class="muted">Next</div><div style="font-weight:500">'+esc(nextT.title)+'</div><div class="muted">'+fmt(nextT.when,{weekday:'long',month:'long',day:'numeric'})+' · Online</div>':'')+(lastT?'<div class="sep"></div><div class="muted">Latest replay</div><div class="row between"><span style="font-weight:500">'+esc(lastT.title)+'</span><button class="btn sm" data-play="'+lastT.id+'">Watch</button></div>':'')+'</div>'+
        '<div class="card"><div class="row between"><h2>Introductions</h2><a class="btn sm" href="#members">Directory</a></div>'+(S.intros.length?'<div class="stack">'+S.intros.map(function(i){ var o=mem(i.to); return '<div class="row between"><div class="row" style="gap:10px"><span class="av sm">'+ini(o)+'</span><div><div style="font-weight:500">'+esc(name(o))+'</div><div class="muted">'+esc(o.company)+'</div></div></div><span class="pill '+(i.status==='Connected'?'ok':'')+'">'+i.status+'</span></div>'; }).join('')+'</div>':'<div class="empty">No intros yet. Browse the directory and ask for one.</div>')+'</div>'+
      '</div></div>';
    return {html:html, sub:greet+', '+m.first+'. '+(up.length)+' upcoming events.'};
  }

  var evFilter='all';
  function vEvents(){
    var kinds=['all'].concat(S.events.map(function(e){return e.kind;}).filter(function(k,i,a){return a.indexOf(k)===i;}));
    var list=upcoming().filter(function(e){return evFilter==='all'||e.kind===evFilter;});
    var html='<div class="chips" style="margin-bottom:18px">'+kinds.map(function(k){ return '<button type="button" data-filter="'+esc(k)+'" aria-pressed="'+(evFilter===k)+'">'+(k==='all'?'All':esc(k))+'</button>'; }).join('')+'</div>'+
      '<div class="stack">'+(list.length?list.map(function(e){ var g=going(e); var left=spotsLeft(e); var full=e.spots&&left===0; var onWait=(S.waitlist[e.id]||[]).indexOf(S.me)>=0;
        return '<div class="card ev"><div><div class="kind">'+esc(e.kind)+'</div><h3>'+esc(e.title)+'</h3><div class="meta"><span>'+fmt(e.date,{weekday:'long',month:'long',day:'numeric'})+(e.end?' to '+fmt(e.end,{month:'long',day:'numeric'}):'')+'</span><span>'+esc(e.where)+'</span><span>'+esc(e.price)+'</span></div><p style="margin:10px 0 0;color:var(--ink2);max-width:60ch">'+esc(e.note)+'</p>'+(e.spots?'<div class="cap" aria-hidden="true"><i class="'+(full?'full':'')+'" style="width:'+Math.round(100*g.length/e.spots)+'%"></i></div><div class="muted" style="margin-top:6px">'+g.length+' of '+e.spots+' spots taken'+(full?' · full':'')+'</div>':'<div class="muted" style="margin-top:10px">Open to all members</div>')+'</div>'+
        '<div class="act">'+(isGoing(e)?'<button class="btn done" data-unrsvp="'+e.id+'">Reserved · cancel</button>':(full?(onWait?'<span class="pill warn">On the waitlist</span>':'<button class="btn" data-wait="'+e.id+'">Join waitlist</button>'):'<button class="btn pri" data-rsvp="'+e.id+'">Reserve my spot</button>'))+'<button class="btn" data-ics="'+e.id+'">Add to calendar</button></div></div>'; }).join(''):'<div class="card"><div class="empty"><b>Nothing here yet</b>Try another filter.</div></div>')+'</div>';
    return {html:html, sub:'Reserve a spot, join a waitlist, add it to your calendar.'};
  }

  var memQ='';
  function vMembers(){
    var q=memQ.toLowerCase(); var list=S.members.filter(function(m){return m.id!==S.me;}).filter(function(m){ return !q || (name(m)+' '+m.company+' '+m.industry+' '+m.city).toLowerCase().indexOf(q)>=0; });
    var html='<div class="row" style="margin-bottom:18px"><input class="in" id="memq" type="search" placeholder="Search by name, company, industry or city" value="'+esc(memQ)+'" style="max-width:440px" aria-label="Search members"><span class="muted">'+list.length+' members</span></div>'+
      '<div class="g g3">'+list.map(function(m){ var intro=S.intros.filter(function(i){return i.to===m.id;})[0];
        return '<div class="card mem"><span class="av">'+ini(m)+'</span><div style="min-width:0"><b>'+esc(name(m))+'</b><div class="co">'+esc(m.company)+'</div><div class="d"><span>'+esc(m.industry)+'</span><span>'+esc(m.city)+'</span></div><div class="d"><span>'+(m.club==='Yes'?'Private club member':'No private club')+'</span><span>'+m.hcp.toFixed(1)+' hcp</span></div><div class="act">'+(intro?'<span class="pill '+(intro.status==='Connected'?'ok':'')+'">'+intro.status+'</span>':'<button class="btn sm" data-intro="'+m.id+'">Request intro</button>')+'</div></div></div>'; }).join('')+'</div>';
    return {html:html, sub:'Connect with other members. Intros go through the M19 team.'};
  }

  function vTrainings(){
    var up=S.trainings.filter(function(t){return t.status==='upcoming';}); var past=S.trainings.filter(function(t){return t.status==='replay';}).reverse();
    var html='<div class="g g2"><div class="card"><h2>Upcoming</h2><div class="list">'+(up.map(function(t){ return '<div class="it">'+dateBox(t.when)+'<div><div class="t">'+esc(t.title)+'</div><div class="m">'+fmt(t.when,{weekday:'long',month:'long',day:'numeric'})+' · Online</div></div><div class="act"><button class="btn sm" data-tics="'+t.id+'">Add to calendar</button></div></div>'; }).join('')||'<div class="empty">Next session will be announced.</div>')+'</div></div>'+
      '<div class="card"><h2>Replays</h2><div class="list">'+past.map(function(t){ return '<div class="it">'+dateBox(t.when)+'<div><div class="t">'+esc(t.title)+'</div><div class="m">Replay</div></div><div class="act"><button class="btn sm pri" data-play="'+t.id+'">Watch</button></div></div>'; }).join('')+'</div></div></div>';
    return {html:html, sub:'Monthly business trainings, live and on replay.'};
  }

  function vAccount(){
    var m=me(); var mine=upcoming().filter(isGoing);
    var html='<div class="g g2"><div class="card"><h2>Profile</h2><div class="f-row two"><div><label class="fl">First name</label><input class="in" value="'+esc(m.first)+'" readonly></div><div><label class="fl">Last name</label><input class="in" value="'+esc(m.last)+'" readonly></div><div><label class="fl">Business</label><input class="in" value="'+esc(m.company)+'" readonly></div><div><label class="fl">City</label><input class="in" value="'+esc(m.city)+'" readonly></div><div><label class="fl">Private club membership</label><input class="in" value="'+esc(m.club)+'" readonly></div><div><label class="fl">Handicap</label><input class="in" value="'+m.hcp.toFixed(1)+'" readonly></div></div><div class="muted" style="margin-top:12px">Concept: fields are read-only here. Members would edit these themselves.</div></div>'+
      '<div class="stack"><div class="card"><h2>Your reservations</h2><div class="list">'+(mine.length?mine.map(function(e){ return '<div class="it">'+dateBox(e.date)+'<div><div class="t">'+esc(e.title)+'</div><div class="m">'+esc(e.where)+'</div></div><div class="act"><button class="btn sm" data-unrsvp="'+e.id+'">Cancel</button></div></div>'; }).join(''):'<div class="empty">No reservations yet.</div>')+'</div></div>'+
      '<div class="card"><h2>Messages from M19</h2><label class="sw"><span>Text (SMS) updates<small>Membership follow-ups, event invitations and reminders, member updates.</small></span><input type="checkbox" checked></label><label class="sw"><span>Marketing and promotional messages<small>Special offers and new product updates.</small></span><input type="checkbox"></label></div></div></div>';
    return {html:html, sub:m.tier+' · member since '+fmt(m.joined+'-01',{month:'long',year:'numeric'})};
  }

  // ---------- TEAM ----------
  var STAGES=[['new','New'],['call','Call booked'],['vetting','Vetting'],['accepted','Accepted'],['declined','Declined']];
  function meets(a){ return a.revenue!=='Under $1M'; }
  function vApplications(){
    var wk=S.applications.filter(function(a){ var x=d(a.when); return (today-x)/864e5<=7; }).length;
    var html='<div class="g g4" style="margin-bottom:18px"><div class="card stat"><span class="lab">New this week</span><span class="big">'+wk+'</span><span class="d">from the website form</span></div><div class="card stat"><span class="lab">Calls booked</span><span class="big">'+S.applications.filter(function(a){return a.stage==='call';}).length+'</span><span class="d">waiting to be held</span></div><div class="card stat"><span class="lab">In vetting</span><span class="big">'+S.applications.filter(function(a){return a.stage==='vetting';}).length+'</span><span class="d">after the call</span></div><div class="card stat"><span class="lab">Accepted this month</span><span class="big">'+S.applications.filter(function(a){return a.stage==='accepted';}).length+'</span><span class="d">invited to join</span></div></div>'+
      '<div class="pipe">'+STAGES.map(function(st){ var items=S.applications.filter(function(a){return a.stage===st[0];});
        return '<div class="col"><h3>'+st[1]+'<span>'+items.length+'</span></h3>'+(items.map(function(a){
          return '<div class="app"><b>'+esc(a.first+' '+a.last)+'</b><div class="w">'+esc(a.website)+'</div><div class="f"><span class="pill '+(meets(a)?'ok':'warn')+'">'+esc(a.revenue)+'</span><span class="pill">'+(a.club==='Yes'?'Private club':'No club')+'</span>'+(a.hcp?'<span class="pill">'+esc(a.hcp)+' hcp</span>':'')+'</div><div class="muted" style="font-size:12.5px">'+esc(a.ref)+' · '+fmt(a.when,{month:'short',day:'numeric'})+(a.call?'<br>Call '+esc(a.call):'')+'</div><div class="a">'+
            (st[0]==='new'?'<button class="btn" data-stage="call" data-id="'+a.id+'">Book call</button><button class="btn ghost" data-stage="declined" data-id="'+a.id+'">Decline</button>':'')+
            (st[0]==='call'?'<button class="btn" data-stage="vetting" data-id="'+a.id+'">Call held</button>':'')+
            (st[0]==='vetting'?'<button class="btn pri" data-stage="accepted" data-id="'+a.id+'">Accept</button><button class="btn ghost" data-stage="declined" data-id="'+a.id+'">Decline</button>':'')+
            (st[0]==='accepted'?'<span class="pill ok">Invite sent</span>':'')+(st[0]==='declined'?'<button class="btn ghost" data-stage="new" data-id="'+a.id+'">Reopen</button>':'')+
          '</div></div>'; }).join('')||'<div class="empty" style="padding:16px 0">Empty</div>')+'</div>'; }).join('')+'</div>'+
      '<p class="muted" style="margin-top:16px">Every application lands here from the website form with the same fields: name, email, phone, business website, yearly revenue, private club membership and handicap. Revenue under $1M is flagged amber against the $1M+ standard.</p>';
    return {html:html, sub:S.applications.filter(function(a){return a.stage==='new';}).length+' new applications to review.'};
  }

  function vRoster(){
    var html='<div class="card"><div class="row between" style="margin-bottom:10px"><h2 style="margin:0">'+S.members.length+' members</h2><button class="btn sm" id="exp-members">Export CSV</button></div><div class="tblwrap"><table class="tbl"><thead><tr><th>Member</th><th>Business</th><th>Industry</th><th>City</th><th>Private club</th><th class="num">Hcp</th><th>Tier</th><th>Joined</th><th class="num">Events</th></tr></thead><tbody>'+
      S.members.map(function(m){ return '<tr><td><div class="row" style="gap:10px;flex-wrap:nowrap"><span class="av sm">'+ini(m)+'</span><span style="white-space:nowrap">'+esc(name(m))+'</span></div></td><td>'+esc(m.company)+'</td><td>'+esc(m.industry)+'</td><td>'+esc(m.city)+'</td><td>'+esc(m.club)+'</td><td class="num">'+m.hcp.toFixed(1)+'</td><td><span class="pill '+(m.tier==='Founding Member'?'gold':'')+'">'+esc(m.tier)+'</span></td><td>'+fmt(m.joined+'-01',{month:'short',year:'numeric'})+'</td><td class="num">'+m.events+'</td></tr>'; }).join('')+'</tbody></table></div></div>';
    return {html:html, sub:'Everyone who has been accepted, with what the team needs at a glance.'};
  }

  function vAdminEvents(){
    var html='<div class="stack">'+upcoming().map(function(e){ var g=going(e); var w=S.waitlist[e.id]||[]; var left=spotsLeft(e);
      return '<div class="card"><div class="ev"><div><div class="kind">'+esc(e.kind)+'</div><h3>'+esc(e.title)+'</h3><div class="meta"><span>'+fmt(e.date,{weekday:'long',month:'long',day:'numeric'})+(e.end?' to '+fmt(e.end,{month:'long',day:'numeric'}):'')+'</span><span>'+esc(e.where)+'</span></div>'+(e.spots?'<div class="cap" aria-hidden="true"><i class="'+(left===0?'full':'')+'" style="width:'+Math.round(100*g.length/e.spots)+'%"></i></div><div class="muted" style="margin-top:6px">'+g.length+' of '+e.spots+' spots taken'+(w.length?' · '+w.length+' on the waitlist':'')+'</div>':'<div class="muted" style="margin-top:10px">'+g.length+(g.length===1?' member':' members')+' registered · open to all</div>')+'</div><div class="act"><button class="btn" data-roster="'+e.id+'">Export roster</button><button class="btn ghost" data-toggle="r-'+e.id+'">Show roster</button></div></div>'+
        '<div id="r-'+e.id+'" hidden><div class="sep"></div><div class="row" style="gap:8px">'+(g.map(function(id){ var m=mem(id); return m?'<span class="pill"><span class="av sm" style="width:20px;height:20px;font-size:10px">'+ini(m)+'</span>'+esc(name(m))+'</span>':''; }).join('')||'<span class="muted">No reservations yet.</span>')+'</div>'+(w.length?'<div class="muted" style="margin-top:10px">Waitlist: '+w.map(function(id){var m=mem(id);return m?esc(name(m)):'';}).join(', ')+'</div>':'')+'</div></div>'; }).join('')+'</div>';
    return {html:html, sub:'Reservations update here the moment a member reserves.'};
  }

  function vAdminTrainings(){
    var html='<div class="g g73"><div class="card"><h2>Schedule</h2><div class="list">'+S.trainings.slice().reverse().map(function(t){ return '<div class="it">'+dateBox(t.when)+'<div><div class="t">'+esc(t.title)+'</div><div class="m">'+fmt(t.when,{weekday:'long',month:'long',day:'numeric'})+' · Online</div></div><div class="act"><span class="pill '+(t.status==='replay'?'ok':'')+'">'+(t.status==='replay'?'Replay posted':'Upcoming')+'</span></div></div>'; }).join('')+'</div></div>'+
      '<div class="card"><h2>Add a training</h2><form id="f-training" class="f-row"><div><label class="fl" for="tt">Title</label><input class="in" id="tt" required placeholder="January business training"></div><div><label class="fl" for="td">Date</label><input class="in" id="td" type="date" required></div><div><label class="fl" for="tl">Replay link (after the session)</label><input class="in" id="tl" type="url" placeholder="https://"></div><button class="btn pri" type="submit">Add to schedule</button><div class="muted">Members see it in Trainings right away.</div></form></div></div>';
    return {html:html, sub:'Monthly business trainings for the online community.'};
  }

  function vAnnouncements(){
    var html='<div class="g g73"><div class="card"><h2>Send an announcement</h2><form id="f-ann" class="f-row"><div><label class="fl" for="at">Title</label><input class="in" id="at" required placeholder="Spring trip: dates announced"></div><div><label class="fl" for="ab">Message</label><textarea class="in" id="ab" required placeholder="What members need to know"></textarea></div><div class="row"><button class="btn pri" type="submit">Post to members</button><span class="muted">Shows on every member’s overview. Text and email delivery would run through your current messaging.</span></div></form></div>'+
      '<div class="card"><h2>Sent</h2><div class="stack">'+S.announcements.map(function(a){ return '<div><div class="muted">'+fmt(a.when,{month:'long',day:'numeric'})+'</div><div style="font-weight:500">'+esc(a.title)+'</div><div class="muted" style="color:var(--ink2)">'+esc(a.body)+'</div></div>'; }).join('<div class="sep" style="margin:6px 0"></div>')+'</div></div></div>';
    return {html:html, sub:'One place to tell every member what’s next.'};
  }

  // ---- interactions ----
  function on(sel, fn){ document.querySelectorAll(sel).forEach(function(el){ el.addEventListener('click', function(ev){ fn(el, ev); }); }); }
  function bind(){
    on('[data-rsvp]', function(el){ var id=el.getAttribute('data-rsvp'); var e=S.events.filter(function(x){return x.id===id;})[0]; S.rsvps[id]=going(e).concat([S.me]); save(); render(); toast('Reserved: '+e.title); });
    on('[data-unrsvp]', function(el){ var id=el.getAttribute('data-unrsvp'); S.rsvps[id]=(S.rsvps[id]||[]).filter(function(x){return x!==S.me;}); var w=S.waitlist[id]||[]; if(w.length){ S.rsvps[id].push(w.shift()); S.waitlist[id]=w; } save(); render(); toast('Reservation cancelled'); });
    on('[data-wait]', function(el){ var id=el.getAttribute('data-wait'); S.waitlist[id]=(S.waitlist[id]||[]).concat([S.me]); save(); render(); toast('You’re on the waitlist. We’ll move you in when a spot opens.'); });
    on('[data-ics]', function(el){ var e=S.events.filter(function(x){return x.id===el.getAttribute('data-ics');})[0]; ics(e); });
    on('[data-tics]', function(el){ var t=S.trainings.filter(function(x){return x.id===el.getAttribute('data-tics');})[0]; ics({id:t.id, title:t.title, date:t.when, where:'Online', note:'Monthly business training'}); });
    on('[data-play]', function(el){ toast('Replay would open here (concept).'); });
    on('[data-intro]', function(el){ var id=el.getAttribute('data-intro'); S.intros.push({from:S.me, to:id, when:ymd, status:'Requested'}); save(); render(); toast('Intro requested. The M19 team will connect you.'); });
    on('[data-filter]', function(el){ evFilter=el.getAttribute('data-filter'); render(); });
    var q=document.getElementById('memq'); if(q){ q.addEventListener('input', function(){ memQ=q.value; var pos=q.selectionStart; render(); var q2=document.getElementById('memq'); q2.focus(); try{q2.setSelectionRange(pos,pos);}catch(e){} }); }
    on('[data-stage]', function(el){ var a=S.applications.filter(function(x){return x.id===el.getAttribute('data-id');})[0]; var st=el.getAttribute('data-stage'); a.stage=st; if(st==='call'&&!a.call){ var x=new Date(today); x.setDate(x.getDate()+3); a.call=x.toISOString().slice(0,10)+' 10:00'; } if(st==='accepted'){ S.members.push({id:'m'+(S.members.length+1), first:a.first, last:a.last, company:a.website.replace(/\.example$/,''), industry:'New member', city:'', club:a.club, hcp:parseFloat(a.hcp)||0, tier:'Member', joined:ymd.slice(0,7), revenue:a.revenue, events:0}); } save(); render(); toast(a.first+' '+a.last+': '+STAGES.filter(function(s){return s[0]===st;})[0][1]); });
    on('[data-toggle]', function(el){ var t=document.getElementById(el.getAttribute('data-toggle')); t.hidden=!t.hidden; el.textContent=t.hidden?'Show roster':'Hide roster'; });
    on('[data-roster]', function(el){ var e=S.events.filter(function(x){return x.id===el.getAttribute('data-roster');})[0]; var rows=[['Member','Business','City','Private club','Handicap','Status']]; going(e).forEach(function(id){ var m=mem(id); if(m) rows.push([name(m),m.company,m.city,m.club,m.hcp,'Reserved']); }); (S.waitlist[e.id]||[]).forEach(function(id){ var m=mem(id); if(m) rows.push([name(m),m.company,m.city,m.club,m.hcp,'Waitlist']); }); csv(e.title.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'-roster.csv', rows); });
    var em=document.getElementById('exp-members'); if(em) em.addEventListener('click', function(){ var rows=[['Member','Business','Industry','City','Private club','Handicap','Tier','Joined','Events']]; S.members.forEach(function(m){ rows.push([name(m),m.company,m.industry,m.city,m.club,m.hcp,m.tier,m.joined,m.events]); }); csv('m19-members.csv', rows); });
    var ft=document.getElementById('f-training'); if(ft) ft.addEventListener('submit', function(ev){ ev.preventDefault(); var t=document.getElementById('tt').value.trim(), dt=document.getElementById('td').value; if(!t||!dt) return; S.trainings.push({id:'t'+(S.trainings.length+1), when:dt, title:t, status: dt<ymd?'replay':'upcoming'}); S.trainings.sort(function(a,b){return a.when<b.when?-1:1;}); if(dt>=ymd) S.events.push({id:'e'+(S.events.length+1), kind:'Monthly Business Training', title:t, date:dt, where:'Online', spots:0, note:'Monthly business training for the M19 online community.', price:'Included'}); save(); render(); toast('Added: '+t); });
    var fa=document.getElementById('f-ann'); if(fa) fa.addEventListener('submit', function(ev){ ev.preventDefault(); var t=document.getElementById('at').value.trim(), b=document.getElementById('ab').value.trim(); if(!t||!b) return; S.announcements.unshift({when:ymd, title:t, body:b}); save(); render(); toast('Posted to members'); });
  }

  // shell
  function shell(){
    var m=me();
    var who=document.getElementById('who'); if(who){ who.innerHTML= ROLE==='member' ? '<span class="av">'+ini(m)+'</span><div><b>'+esc(name(m))+'</b><span>'+esc(m.tier)+'</span></div>' : '<span class="av">M19</span><div><b>M19 team</b><span>Club office</span></div>'; }
    var r=document.getElementById('reset'); if(r) r.addEventListener('click', reset);
    var mb=document.querySelector('.menu-btn'), side=document.querySelector('.side'), scrim=document.querySelector('.scrim');
    if(mb){ mb.addEventListener('click', function(){ side.classList.add('open'); scrim.classList.add('on'); }); scrim.addEventListener('click', function(){ side.classList.remove('open'); scrim.classList.remove('on'); }); }
    var t=document.getElementById('today'); if(t) t.textContent=today.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  }

  load(); shell(); render();
})();
