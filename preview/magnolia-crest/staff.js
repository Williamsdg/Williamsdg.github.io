/* Club portal engine — staff side. Williams Digital. Sample data only; nothing is sent anywhere. */
(function(){
  var O=Portal,C=O.C,E=O.esc,F=O.FEES,$=function(id){return document.getElementById(id)};
  var sp=$('splash');sp.innerHTML=O.MARK;if(O.STATIC||O.EMBED)sp.className='splash done';else setTimeout(function(){sp.classList.add('done')},850);
  $('sideLogo').innerHTML=O.MARK+'<b>'+C.wordmark+'</b>';$('topLogo').innerHTML=O.MARK+(C.logoImg?'':E(C.name));
  var ICON={
    today:'<path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z"/>',
    tee:'<path d="M12 21V4l7 3.5-7 3.5"/><ellipse cx="12" cy="21" rx="6" ry="1.4"/>',
    dining:'<path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10M16 3c-2 2-2 8 0 9v9"/>',
    orders:'<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
    gate:'<path d="M4 21V9l8-5 8 5v12M9 21v-7h6v7"/>',
    courts:'<circle cx="12" cy="12" r="9"/><path d="M5 6c3 3 3 9 0 12M19 6c-3 3-3 9 0 12"/>',
    scores:'<path d="M5 20V10M12 20V4M19 20v-7"/>',
    reports:'<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/>',
    events:'<path d="M5 6h14v14H5zM5 10h14M9 3v4M15 3v4"/>',
    more:'<path d="M4 7h16M4 12h16M4 17h16"/>'
  };
  var NAV=[['today','Today'],['tee','Tee Sheet'],['dining','Dining Rooms'],['courts','Court Sheet'],['scores','Scores'],['orders','Shop Orders'],['concierge','Concierge'],['events','Events & RSVPs'],['gate','Gate List'],['members','Members'],['reports','Reports'],['connect','How It Connects'],['notices','Notices']];
  /* each department signs in to its own slice of the club */
  var ROLES={'Club Office':null,'Golf Shop':['today','tee','scores','orders','reports'],'Food & Beverage':['today','dining','events','reports'],'Racquets':['today','courts','scores','orders'],'Gate':['gate']};
  var role='Club Office';try{role=sessionStorage.getItem(C.key+'-role')||role}catch(e){}if(!(role in ROLES))role='Club Office';
  function nav(){var a=ROLES[role];return a?NAV.filter(function(n){return a.indexOf(n[0])>-1}):NAV}
  var ui={teeDate:O.today(),course:O.COURSES[0],teeAll:window.innerWidth>900,teeReason:'Course maintenance',dnDate:O.today(),dnRoom:'All',ctDate:O.today(),ctGroup:O.GROUPS[0].k,ctSel:null,ctReason:C.clinics[0],gateDate:O.today(),ordTab:'Queue',q:''};

  function route(){var h=location.hash.replace('#',''),n=nav();return n.some(function(x){return x[0]===h})?h:n[0][0]}
  function head(eyebrow,title,sub,extra){return '<div class="page-head"><div><p class="eyebrow">'+eyebrow+'</p><h1>'+title+'</h1>'+(sub?'<p>'+sub+'</p>':'')+'</div>'+(extra||'')+'</div>'}
  function opt(list,sel){return list.map(function(v){var val=Array.isArray(v)?v[0]:v,lab=Array.isArray(v)?v[1]:v;return '<option value="'+E(val)+'"'+(String(val)===String(sel)?' selected':'')+'>'+E(lab)+'</option>'}).join('')}
  function pill(s){var c=/Verified|Confirmed|Ready|Picked|Seated|Arrived|Resolved|Checked/.test(s)?'ok':/Pending|New|Expected|Open|Waitlist/.test(s)?'warn':/Rejected|No-show/.test(s)?'bad':'';return '<span class="pill '+c+'">'+E(s)+'</span>'}
  function counts(){var s=O.load();return {scores:s.rounds.filter(function(r){return r.status==='Pending'}).length+s.results.filter(function(r){return r.status==='Pending'}).length,orders:s.orders.filter(function(o){return o.status==='New'}).length,concierge:s.requests.filter(function(q){return q.status==='Open'}).length}}
  function last7(){var a=[];for(var i=-6;i<=0;i++)a.push(O.iso(O.day(i)));return a}
  function bars(vals,labels,fmt){var mx=Math.max.apply(0,vals)||1;return '<div class="hours" role="img" aria-label="'+labels.map(function(l,i){return l+' '+(fmt?fmt(vals[i]):vals[i])}).join(', ')+'">'+vals.map(function(v,i){return '<div><em>'+(fmt?fmt(v):v)+'</em><i style="--i:'+i+';height:'+Math.max(4,Math.round(v/mx*100))+'%"></i>'+labels[i]+'</div>'}).join('')+'</div>'}
  function hbar(rows,fmt){var mx=Math.max.apply(0,rows.map(function(r){return r[1]}))||1;return '<div class="hb">'+rows.map(function(r,i){return '<div><span>'+E(r[0])+'</span><i><b style="--i:'+i+';width:'+Math.max(2,Math.round(r[1]/mx*100))+'%"></b></i><em>'+(fmt?fmt(r[1]):r[1])+'</em></div>'}).join('')+'</div>'}

  function chrome(r){
    var c=counts(),badge={scores:c.scores,orders:c.orders,concierge:c.concierge},N=nav(),tabs=N.slice(0,4).map(function(n){return n[0]}),more=N.slice(4).reduce(function(a,n){return a+(badge[n[0]]||0)},0);
    $('sideNav').innerHTML=N.map(function(n){return '<a href="#'+n[0]+'" class="'+(n[0]===r?'on':'')+'">'+n[1]+(badge[n[0]]?'<b>'+badge[n[0]]+'</b>':'')+'</a>'}).join('');
    $('whoami').innerHTML='<label class="f" for="roleSel" style="color:var(--mist)">Signed in as</label><select class="in role" id="roleSel" data-change="role">'+opt(Object.keys(ROLES),role)+'</select>';
    $('topRole').textContent=role;
    var short={today:'Today',tee:'Tee Sheet',dining:'Dining',courts:'Courts',scores:'Scores',orders:'Orders',reports:'Reports',events:'Events',gate:'Gate'};
    $('tabbar').style.gridTemplateColumns='repeat('+(tabs.length+(N.length>4?1:0)||1)+',1fr)';
    $('tabbar').innerHTML=tabs.map(function(k){return '<a href="#'+k+'" class="'+(k===r?'on':'')+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+(ICON[k]||ICON.today)+'</svg>'+(short[k]||k)+(badge[k]?'<em>'+badge[k]+'</em>':'')+'</a>'}).join('')+(N.length>4?'<button type="button" data-act="more" class="'+(tabs.indexOf(r)<0?'on':'')+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+ICON.more+'</svg>More'+(more?'<em>'+more+'</em>':'')+'</button>':'');
    $('moreList').innerHTML=N.map(function(n){return '<a href="#'+n[0]+'">'+n[1]+'<small>'+(badge[n[0]]?badge[n[0]]+' waiting':n[0]===r?'You are here':'')+'</small></a>'}).join('')+'<a href="member.html">Member portal<small></small></a><a href="'+C.site+'">Club website<small></small></a><a href="#" data-act="signout">Sign out<small></small></a>';
  }

  var V={};

  V.today=function(){
    var s=O.load(),t=O.today(),players=0,groups=0,hours={},wl=s.waitlist.filter(function(w){return w.date===t}).length;
    O.COURSES.forEach(function(c){O.teeDay(t,c).forEach(function(x){groups+=x.groups.length;players+=x.used;var h=+x.time.slice(0,2);hours[h]=(hours[h]||0)+x.used})});
    var dn=O.diningDay(t),covers=dn.reduce(function(a,d){return a+d.party},0),ct=0,ctAll=0;
    O.GROUPS.forEach(function(g){var u=O.courtUse(t,g);ct+=u.used;ctAll+=u.all});
    var g=s.guests.filter(function(x){return x.date===t}),arr=g.filter(function(x){return x.arrived}).length,c=counts(),need=[],a=ROLES[role],can=function(v){return !a||a.indexOf(v)>-1};
    if(can('orders'))s.orders.filter(function(o){return o.status==='New'}).forEach(function(o){need.push(['Shop order to prepare',E(o.member)+' · '+E(o.pickup)+' · '+O.money(o.total),'orders'])});
    if(can('concierge'))s.requests.filter(function(q){return q.status==='Open'}).forEach(function(q){need.push(['Concierge request',E(q.member)+' · '+E(q.topic),'concierge'])});
    if(can('scores')){s.rounds.filter(function(r){return r.status==='Pending'}).forEach(function(r){need.push(['Golf score to verify',E(r.member)+' · '+r.total+' from the '+E(r.tee)+' tees','scores'])});
      s.results.filter(function(r){return r.status==='Pending'}).forEach(function(r){need.push([E(r.sport)+' result to verify',E(r.member)+' and '+E(r.opp),'scores'])})}
    var hk=Object.keys(hours).map(Number).sort(function(x,y){return x-y});
    var st=[];
    if(can('tee'))st.push('<a class="stat dark" href="#tee"><b data-count="'+players+'">0</b><span>Golfers on the tee sheet'+(O.COURSES.length>1?'s':'')+'</span><small>'+groups+' groups'+(wl?' · '+wl+' on the waitlist':'')+'</small></a>');
    if(can('dining'))st.push('<a class="stat" href="#dining"><b data-count="'+covers+'">0</b><span>Covers booked</span><small>'+dn.length+' reservations today</small></a>');
    if(can('courts'))st.push('<a class="stat" href="#courts"><b data-count="'+Math.round(ct/ctAll*100)+'" data-suf="%">0</b><span>Court hours in use</span><small>'+ct+' of '+ctAll+' court hours</small></a>');
    if(can('orders'))st.push('<a class="stat" href="#orders"><b data-count="'+c.orders+'">0</b><span>Orders to prepare</span><small>'+E(C.shops.join(', '))+'</small></a>');
    if(can('scores'))st.push('<a class="stat" href="#scores"><b data-count="'+c.scores+'">0</b><span>Scores to verify</span><small>Golf and racquets</small></a>');
    if(can('gate'))st.push('<a class="stat" href="#gate"><b>'+arr+' / '+g.length+'</b><span>Guests arrived</span><small>'+E(C.gateTitle)+'</small></a>');
    return head(O.long(t)+' · '+E(role),'Today at <em>'+E(C.short)+'</em>','The whole club on one screen: the tee sheet, the dining rooms, the courts, the shops, the concierge and the gate.')+
    '<div class="grid g3" style="margin-bottom:18px">'+st.join('')+'</div>'+
    '<div class="grid g2" style="margin-bottom:18px">'+(can('tee')?'<div class="panel dark"><h2>The first tee, hour by hour</h2><p class="sub">Golfers booked today.</p>'+bars(hk.map(function(h){return hours[h]}),hk.map(function(h){return O.hr12(h).replace(' ','')}))+'</div>':'')+
      '<div class="panel"><h2>Needs attention</h2><p class="sub">Things waiting on staff.</p>'+(need.length?'<ul class="list">'+need.slice(0,6).map(function(n){return '<li><div class="what"><b>'+n[0]+'</b><small>'+n[1]+'</small></div><a class="btn sm" href="#'+n[2]+'">Open</a></li>'}).join('')+'</ul>'+(need.length>6?'<p class="note">And '+(need.length-6)+' more.</p>':''):'<p class="empty">All caught up.</p>')+'</div></div>'+
    '<div class="panel"><h2>Member activity</h2><p class="sub">Live from the member portal.</p><ul class="list">'+s.log.slice(0,8).map(function(l){return '<li><div class="what"><b style="font-weight:500">'+E(l.text)+'</b><small>'+O.ago(l.when)+'</small></div></li>'}).join('')+'</ul></div>';
  };

  V.tee=function(){
    var s=O.load(),slots=O.teeDay(ui.teeDate,ui.course),groups=0,players=0,open=0,now=new Date(),nowT=('0'+now.getHours()).slice(-2)+':'+('0'+now.getMinutes()).slice(-2),isToday=ui.teeDate===O.today();
    slots.forEach(function(x){groups+=x.groups.length;players+=x.used;if(!x.block&&x.open===4)open++});
    var wl=s.waitlist.filter(function(w){return w.date===ui.teeDate&&w.course===ui.course});
    var rows=slots.map(function(x){
      var w=x.wait.length?' <span class="pill warn">Waitlist: '+E(x.wait.map(function(q){return q.member+' ('+q.players+')'}).join(', '))+'</span>':'';
      if(x.block)return '<tr><td class="t">'+O.t12(x.time)+'</td><td data-l="Players" colspan="2"><span class="pill dk">Blocked</span> '+E(x.block.reason)+'</td><td class="act"><button class="btn sm line" type="button" data-act="tee-unblock" data-time="'+x.time+'">Reopen</button></td></tr>';
      if(!x.groups.length)return !ui.teeAll?'':'<tr><td class="t">'+O.t12(x.time)+'</td><td data-l="Players" colspan="2" style="color:var(--ok);font-weight:600">Open</td><td class="act"><button class="btn sm line" type="button" data-act="tee-block" data-time="'+x.time+'">Block</button></td></tr>';
      return x.groups.map(function(g,i){var st=s.noshow[g.id]?'No-show':s.checked[g.id]?'Checked in':'',due=isToday&&x.time<=nowT;
        return '<tr><td class="t">'+(i?'':O.t12(x.time))+'</td><td data-l="Players">'+E(g.players.join(', '))+(g.sample?'':' <span class="pill ok">'+(g.fromWait?'From waitlist':'Booked online')+'</span>')+(st?' '+pill(st):'')+(i?'':w)+'</td><td data-l="Round">'+g.holes+' holes · '+E(g.cart)+(g.fee?' · '+O.money(g.fee):'')+'</td><td class="act"><div class="row">'+(st?'':(due?'<button class="btn sm" type="button" data-act="tee-in" data-id="'+g.id+'">Check in</button><button class="btn sm line" type="button" data-act="tee-ns" data-id="'+g.id+'" data-sample="'+(g.sample?1:0)+'">No-show</button>':''))+'<button class="btn sm danger" type="button" data-act="tee-cancel" data-id="'+g.id+'" data-sample="'+(g.sample?1:0)+'" data-time="'+x.time+'">Cancel</button></div></td></tr>'}).join('');
    }).join('');
    return head('Golf Shop','Tee <em>Sheet</em>','Every group on the first tee. Cancel a group and the waitlist fills the spot on its own.','<button class="btn line" type="button" data-act="csv-tee">Export CSV</button>')+
      (O.COURSES.length>1?'<div class="seg2" role="group" aria-label="Course">'+O.COURSES.map(function(c){return '<button type="button" data-act="course" data-c="'+E(c)+'" aria-pressed="'+(ui.course===c)+'">'+E(c)+'</button>'}).join('')+'</div>':'')+
      O.dayStrip(ui.teeDate,0,8)+
      '<div class="grid g4" style="margin-bottom:18px"><div class="stat dark"><b>'+players+'</b><span>Golfers</span></div><div class="stat"><b>'+groups+'</b><span>Groups</span></div><div class="stat"><b>'+wl.length+'</b><span>On the waitlist</span></div><div class="stat"><label class="f" for="tr">Reason when blocking</label><select class="in" id="tr" data-change="tee-reason" style="margin:0">'+opt(['Course maintenance','Tournament','Golf outing','Frost delay'],ui.teeReason)+'</select></div></div>'+
      '<div class="panel"><h2>'+O.long(ui.teeDate)+'</h2><p class="sub">'+(O.COURSES.length>1?E(ui.course)+'. ':'')+open+' open times. Bookings from the member portal appear here immediately.</p><div class="tabs"><button type="button" data-act="tee-all" data-v="0" aria-pressed="'+(!ui.teeAll)+'">Booked and blocked</button><button type="button" data-act="tee-all" data-v="1" aria-pressed="'+ui.teeAll+'">All times</button></div><div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>Time</th><th>Players</th><th>Round</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
  };

  V.dining=function(){
    var all=O.diningDay(ui.dnDate),list=all.filter(function(d){return ui.dnRoom==='All'||d.venue===ui.dnRoom});
    var by=function(v){return all.filter(function(d){return d.venue===v}).reduce(function(a,d){return a+d.party},0)};
    return head('Food &amp; Beverage','Dining <em>Rooms</em>','Reservations for '+E(O.ROOMS.join(', ').replace(/, ([^,]*)$/,' and $1'))+'.','<button class="btn line" type="button" data-act="csv-dining">Export CSV</button>')+
      O.dayStrip(ui.dnDate,0,8)+
      '<div class="grid g4" style="margin-bottom:18px"><div class="stat dark"><b>'+all.reduce(function(a,d){return a+d.party},0)+'</b><span>Total covers</span></div>'+O.ROOMS.map(function(v){return '<div class="stat"><b>'+by(v)+'</b><span>'+E(v.replace('The ',''))+'</span></div>'}).join('')+'</div>'+
      '<div class="panel"><div class="tabs">'+['All'].concat(O.ROOMS).map(function(v){return '<button type="button" data-act="dn-room" data-room="'+E(v)+'" aria-pressed="'+(ui.dnRoom===v)+'">'+E(v==='All'?'All rooms':v.replace('The ',''))+'</button>'}).join('')+'</div>'+
      (list.length?'<div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>Time</th><th>Member</th><th>Room</th><th class="num">Party</th><th>Note</th><th>Status</th><th></th></tr></thead><tbody>'+list.map(function(d){
        return '<tr><td class="t">'+O.t12(d.time)+'</td><td data-l="Member">'+E(d.who&&d.who!==d.member?d.who+' ('+d.member+')':d.member)+(d.sample?'':' <span class="pill ok">Booked online</span>')+'</td><td data-l="Room">'+E(d.venue)+'</td><td class="num" data-l="Party">'+d.party+'</td><td data-l="Note">'+(E(d.note)||'–')+'</td><td>'+pill(d.status)+'</td><td class="act"><div class="row">'+(d.status==='Seated'?'':'<button class="btn sm" type="button" data-act="dn-seat" data-id="'+d.id+'" data-sample="'+(d.sample?1:0)+'">Seat</button>')+'<button class="btn sm danger" type="button" data-act="dn-cancel" data-id="'+d.id+'" data-sample="'+(d.sample?1:0)+'">Cancel</button></div></td></tr>'}).join('')+'</tbody></table></div>':'<p class="empty">No reservations.</p>')+'</div>';
  };

  V.courts=function(){
    var G=O.GROUPS.filter(function(g){return g.k===ui.ctGroup})[0],cs=[];for(var c=G.from;c<=G.to;c++)cs.push(c);
    var g='<div class="h"></div>'+cs.map(function(c){return '<div class="h">Court '+c+'<small>'+G.k+'</small></div>'}).join('');
    O.COURT_HOURS.forEach(function(h){
      g+='<div class="tm">'+O.hr12(h)+'</div>';
      cs.forEach(function(c){
        var x=O.courtCell(ui.ctDate,h,c),a='data-hour="'+h+'" data-court="'+c+'"';
        if(x.state==='block')g+='<button type="button" class="cell blk" data-act="ct-unblock" '+a+' aria-label="Court '+c+' at '+O.hr12(h)+', blocked for '+E(x.reason)+'. Tap to reopen">'+E(x.reason)+'</button>';
        else if(x.state==='booked')g+='<button type="button" class="cell '+(x.mine?'mine':'bk')+'" data-act="ct-show" '+a+'>'+E(x.b.member.split(' ').slice(-1)[0])+'</button>';
        else g+='<button type="button" class="cell" data-act="ct-block" '+a+' aria-label="Court '+c+' at '+O.hr12(h)+', open. Tap to block">Open</button>';
      });
    });
    var det='';
    if(ui.ctSel){var x=O.courtCell(ui.ctDate,ui.ctSel.hour,ui.ctSel.court);if(x.state==='booked')det='<div class="panel pop" id="ctDet" style="margin-bottom:18px;border-color:var(--bronze)"><div class="row" style="justify-content:space-between"><div><h2>Court '+ui.ctSel.court+' at '+O.hr12(ui.ctSel.hour)+'</h2><p class="sub" style="margin:0">'+E(x.b.who&&x.b.who!==x.b.member?x.b.who+' ('+x.b.member+')':x.b.member)+' · '+E(x.b.kind)+(x.b.opp?' with '+E(x.b.opp):'')+'</p></div><div class="row"><button class="btn sm danger" type="button" data-act="ct-cancel" data-id="'+x.b.id+'" data-sample="'+(x.b.sample?1:0)+'">Cancel reservation</button><button class="btn sm line" type="button" data-act="ct-close">Close</button></div></div></div>'}
    var u=O.courtUse(ui.ctDate,G);
    return head('Racquets','Court <em>Sheet</em>','Tap an open hour to block it for a clinic or lesson. Tap a reservation to see who has it.')+
      (O.GROUPS.length>1?'<div class="seg2" role="group" aria-label="Court type">'+O.GROUPS.map(function(x){return '<button type="button" data-act="ct-group" data-g="'+x.k+'" aria-pressed="'+(ui.ctGroup===x.k)+'">'+x.k+' '+x.from+'–'+x.to+'</button>'}).join('')+'</div>':'')+
      O.dayStrip(ui.ctDate,0,8)+det+
      '<div class="panel"><div class="row" style="justify-content:space-between;margin-bottom:14px"><div><h2>'+O.long(ui.ctDate)+'</h2><p class="sub" style="margin:0">'+G.k+' courts · '+Math.round(u.used/u.all*100)+'% in use</p></div><div style="min-width:220px"><label class="f" for="cr">Block open hours for</label><select class="in" id="cr" data-change="ct-reason" style="margin:0">'+opt(C.clinics,ui.ctReason)+'</select></div></div><div class="tbl-wrap"><div class="cgrid" style="--n:'+cs.length+'">'+g+'</div></div></div>';
  };

  V.scores=function(){
    var s=O.load(),pg=s.rounds.filter(function(r){return r.status==='Pending'}),pt=s.results.filter(function(r){return r.status==='Pending'});
    var done=s.rounds.filter(function(r){return r.status!=='Pending'}).sort(function(a,b){return a.date<b.date?1:-1}).slice(0,10);
    return head('Golf Shop &amp; Racquets','Scores to <em>Verify</em>','Members post their own scores. Staff verify them before they count.')+
      '<div class="grid g2" style="margin-bottom:18px"><div class="panel"><h2>Golf rounds</h2><p class="sub">'+pg.length+' waiting.</p>'+
        (pg.length?'<ul class="list">'+pg.map(function(r){return '<li><div class="what"><b>'+E(r.member)+': '+r.total+'</b><small>'+O.nice(r.date)+' · '+E(r.tee)+' tees · differential '+r.diff.toFixed(1)+(r.putts?' · '+r.putts+' putts':'')+'</small></div><div class="row"><button class="btn sm" type="button" data-act="rd-ok" data-id="'+r.id+'">Verify</button><button class="btn sm danger" type="button" data-act="rd-no" data-id="'+r.id+'">Reject</button></div></li>'}).join('')+'</ul>':'<p class="empty">No golf scores waiting.</p>')+'</div>'+
      '<div class="panel"><h2>Racquets results</h2><p class="sub">'+pt.length+' waiting.</p>'+
        (pt.length?'<ul class="list">'+pt.map(function(r){return '<li><div class="what"><b>'+E(r.member)+' and '+E(r.opp)+'</b><small>'+O.nice(r.date)+' · '+E(r.sport)+' · '+E(r.kind)+' · '+r.sets.map(function(p){return p[0]+'–'+p[1]}).join(', ')+'</small></div><div class="row"><button class="btn sm" type="button" data-act="tn-ok" data-id="'+r.id+'">Verify</button><button class="btn sm danger" type="button" data-act="tn-no" data-id="'+r.id+'">Reject</button></div></li>'}).join('')+'</ul>':'<p class="empty">No results waiting.</p>')+'</div></div>'+
      '<div class="panel"><h2>Recently reviewed rounds</h2><p class="sub">The last ten.</p><div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>Date</th><th>Member</th><th>Tees</th><th class="num">Score</th><th class="num">Diff.</th><th></th></tr></thead><tbody>'+
      done.map(function(r){return '<tr><td data-l="Date">'+O.nice(r.date)+'</td><td data-l="Member">'+E(r.member)+'</td><td data-l="Tees">'+E(r.tee)+'</td><td class="num t" data-l="Score">'+r.total+'</td><td class="num" data-l="Differential">'+r.diff.toFixed(1)+'</td><td>'+pill(r.status)+'</td></tr>'}).join('')+'</tbody></table></div></div>';
  };

  V.orders=function(){
    var s=O.load(),h=head('The shops','Shop <em>Orders</em>','Orders placed in the member portal for pickup at the counter, and the items on sale.')+
      '<div class="tabs">'+['Queue','Catalogue'].map(function(t){return '<button type="button" data-act="ord-tab" data-tab="'+t+'" aria-pressed="'+(ui.ordTab===t)+'">'+t+'</button>'}).join('')+'</div>';
    if(ui.ordTab==='Queue'){
      var col=function(st,next,lab){var l=s.orders.filter(function(o){return o.status===st});return '<div class="panel"><h2>'+st+'</h2><p class="sub">'+l.length+' order'+(l.length===1?'':'s')+'.</p>'+(l.length?'<ul class="list">'+l.map(function(o){return '<li style="flex-direction:column;align-items:stretch;gap:8px"><div class="what"><b>'+E(o.member)+'</b><small>'+E(o.items.map(function(i){return i.qty+' × '+i.name}).join(', '))+'</small><small>'+O.nice(o.when)+' · '+E(o.pickup)+' · '+O.money(o.total)+'</small></div>'+(next?'<button class="btn sm" type="button" data-act="ord-next" data-id="'+o.id+'" data-next="'+next+'">'+lab+'</button>':'')+'</li>'}).join('')+'</ul>':'<p class="empty">None.</p>')+'</div>'};
      h+='<div class="grid g3">'+col('New','Ready for pickup','Mark ready and text the member')+col('Ready for pickup','Picked up','Mark picked up')+col('Picked up')+'</div>';
    } else {
      h+='<div class="panel"><h2>Catalogue</h2><p class="sub">Change a price or take an item off sale. The member shop updates straight away.</p><div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>Item</th><th>Shop</th><th>Price</th><th>On sale</th></tr></thead><tbody>'+
        O.products().map(function(p){return '<tr><td data-l="Item"><b style="font-weight:600">'+E(p.name)+'</b> <small style="color:var(--ink2)">'+E(p.brand)+'</small></td><td data-l="Shop">'+E(p.shop)+'</td><td><input class="in" type="number" min="0" step="1" value="'+p.price+'" data-change="price" data-sku="'+p.sku+'" aria-label="Price of '+E(p.name)+'" style="max-width:110px;margin:0"></td><td class="act"><button class="btn sm '+(p.off?'line':'')+'" type="button" data-act="stock" data-sku="'+p.sku+'">'+(p.off?'Off sale':'On sale')+'</button></td></tr>'}).join('')+'</tbody></table></div></div>';
    }
    return h;
  };

  V.concierge=function(){
    var s=O.load(),open=s.requests.filter(function(q){return q.status==='Open'}).sort(function(a,b){return a.when-b.when}),done=s.requests.filter(function(q){return q.status!=='Open'}).sort(function(a,b){return b.when-a.when});
    return head('Member services','Concierge <em>Desk</em>','Requests sent from the member portal. Reply once and the member sees it straight away.')+
      '<div class="grid g2"><div class="panel"><h2>Open</h2><p class="sub">'+open.length+' waiting, oldest first.</p>'+
      (open.length?open.map(function(q){return '<form data-form="reply" data-id="'+q.id+'" style="padding:14px 0;border-bottom:1px solid var(--line)"><div class="row" style="justify-content:space-between"><b>'+E(q.member)+' · '+E(q.topic)+'</b><small style="color:var(--ink2)">'+O.ago(q.when)+'</small></div><p style="margin:6px 0 10px">'+E(q.body)+'</p><label class="f" for="r'+q.id+'">Reply</label><textarea class="in" id="r'+q.id+'" name="reply" required></textarea><button class="btn sm brass" type="submit">Reply and resolve</button></form>'}).join(''):'<p class="empty">Nothing waiting.</p>')+'</div>'+
      '<div class="panel"><h2>Resolved</h2><p class="sub">Recently answered.</p>'+(done.length?'<ul class="list">'+done.map(function(q){return '<li style="flex-direction:column;align-items:stretch;gap:6px"><div class="row" style="justify-content:space-between"><div class="what"><b>'+E(q.member)+' · '+E(q.topic)+'</b><small>'+O.ago(q.when)+'</small></div>'+pill(q.status)+'</div><div>'+E(q.body)+'</div><div class="thread"><small>Reply</small>'+E(q.reply)+'</div></li>'}).join('')+'</ul>':'<p class="empty">None yet.</p>')+'</div></div>';
  };

  V.events=function(){
    var s=O.load(),ev=O.events().filter(function(e){return e.date>=O.today()}),ds=[];for(var i=1;i<90;i++){var d=O.iso(O.day(i));ds.push([d,O.long(d)])}
    return head('Membership &amp; Events','Events &amp; <em>RSVPs</em>','Head counts for the kitchen and the event team, as members reply.')+
      '<div class="grid g21"><div class="panel"><h2>Upcoming</h2><p class="sub">Head counts update as members RSVP.</p><div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>Event</th><th>When</th><th class="num">Families</th><th class="num">Adults</th><th class="num">Children</th><th class="num">Total</th></tr></thead><tbody>'+
      ev.map(function(e){var r=s.rsvps.filter(function(x){return x.event===e.id}),a=r.reduce(function(n,x){return n+x.adults},0),k=r.reduce(function(n,x){return n+x.kids},0);
        return '<tr><td data-l="Event"><b style="font-weight:600">'+E(e.name)+'</b><br><small style="color:var(--ink2)">'+E(e.where)+(r.length?' · '+E(r.map(function(x){return x.member}).join(', ')):'')+'</small></td><td data-l="When" style="white-space:nowrap">'+O.long(e.date)+'<br><small style="color:var(--ink2)">'+O.t12(e.time)+'</small></td><td class="num" data-l="Families">'+r.length+'</td><td class="num" data-l="Adults">'+a+'</td><td class="num" data-l="Children">'+k+'</td><td class="num t" data-l="Total">'+(a+k)+'</td></tr>'}).join('')+'</tbody></table></div></div>'+
      '<div class="panel"><h2>Add an event</h2><p class="sub">It appears in the member portal for RSVPs.</p><form data-form="event"><label class="f" for="en">Event name</label><input class="in" id="en" name="name" required autocomplete="off">'+
      '<div class="fgrid"><div><label class="f" for="ed">Date</label><select class="in" id="ed" name="date">'+opt(ds,ds[13][0])+'</select></div><div><label class="f" for="et">Time</label><select class="in" id="et" name="time">'+opt([['08:00','8:00 am'],['11:00','11:00 am'],['17:00','5:00 pm'],['18:00','6:00 pm'],['18:30','6:30 pm'],['19:00','7:00 pm']],'18:30')+'</select></div></div>'+
      '<label class="f" for="ew">Where</label><select class="in" id="ew" name="where">'+opt(C.venues,C.venues[0])+'</select><button class="btn brass" type="submit">Publish event</button></form></div></div>';
  };

  V.gate=function(){
    var s=O.load(),g=s.guests.filter(function(x){return x.date===ui.gateDate}).sort(function(a,b){return a.name<b.name?-1:1});
    return head(E(C.gateTitle),'Gate <em>List</em>','Guests registered by members, for the guard on duty.','<button class="btn line" type="button" data-act="print">Print list</button>')+
      O.dayStrip(ui.gateDate,0,8)+
      '<div class="grid g21"><div class="panel"><h2>'+O.long(ui.gateDate)+'</h2><p class="sub">'+g.length+' guest'+(g.length===1?'':'s')+' expected, '+g.filter(function(x){return x.arrived}).length+' arrived.</p>'+
      (g.length?'<div class="tbl-wrap"><table class="tbl stack big"><thead><tr><th>Guest</th><th>Host member</th><th>Visiting for</th><th>Status</th><th></th></tr></thead><tbody>'+g.map(function(x){return '<tr><td data-l="Guest"><b style="font-weight:600">'+E(x.name)+'</b></td><td data-l="Host">'+E(x.member)+'</td><td data-l="For">'+E(x.reason)+'</td><td>'+pill(x.arrived?'Arrived':'Expected')+'</td><td class="act">'+(x.arrived?'':'<button class="btn sm" type="button" data-act="gate-in" data-id="'+x.id+'">Mark arrived</button>')+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="empty">No guests registered for this day.</p>')+'</div>'+
      '<div class="panel"><h2>Add a guest</h2><p class="sub">For a member who calls the club office.</p><form data-form="gate"><label class="f" for="gn">Guest name</label><input class="in" id="gn" name="name" required autocomplete="off"><label class="f" for="gm">Host member</label><select class="in" id="gm" name="member">'+opt(C.roster.map(function(r){return r[1]}),C.roster[0][1])+'</select><label class="f" for="gr">Visiting for</label><select class="in" id="gr" name="reason">'+opt(C.guestReasons,C.guestReasons[0])+'</select><button class="btn brass" type="submit">Add to list</button></form></div></div>';
  };

  function memberRows(){
    var s=O.load(),q=ui.q.toLowerCase();
    return C.roster.filter(function(r){return !q||(r.join(' ')).toLowerCase().indexOf(q)>-1}).map(function(r){
      var me=r[1]===O.N,n=+r[0],bal=me?s.charges.reduce(function(a,c){return a+c.amt},0):((n*37)%640)+(n%9)*11.5,rounds=me?s.rounds.filter(function(x){return x.member===O.N}).length:(n*7)%9,hh=me?C.household.length:1+(n%4);
      return {no:r[0],name:r[1],tier:r[2],me:me,bal:bal,rounds:rounds,hh:hh};
    });
  }
  V.members=function(){
    var rows=memberRows().map(function(r){return '<tr><td data-l="No." style="font-variant-numeric:tabular-nums">'+r.no+'</td><td data-l="Member"><b style="font-weight:600">'+E(r.name)+'</b>'+(r.me?' <span class="pill ok">Demo member</span>':'')+'</td><td data-l="Membership">'+E(r.tier)+'</td><td class="num" data-l="Household">'+r.hh+'</td><td class="num" data-l="Books ahead">'+O.windowDays(r.tier)+' days</td><td class="num" data-l="Rounds this month">'+r.rounds+'</td><td class="num" data-l="Balance">'+O.money(r.bal)+'</td></tr>'}).join('');
    return head('Club Office','Members','Sample roster. Search by name, number or membership.','<button class="btn line" type="button" data-act="csv-members">Export CSV</button>')+
      '<div class="panel"><label class="f" for="mq">Search</label><input class="in" id="mq" type="search" value="'+E(ui.q)+'" data-input="q" placeholder="Name, number or membership" autocomplete="off"><div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>No.</th><th>Member</th><th>Membership</th><th class="num">Household</th><th class="num">Books ahead</th><th class="num">Rounds this month</th><th class="num">Balance</th></tr></thead><tbody id="mRows">'+rows+'</tbody></table></div></div>';
  };

  V.reports=function(){
    var d7=last7(),lab=d7.map(function(d){return O.long(d).slice(0,3)});
    var rounds=d7.map(function(d){var n=0;O.COURSES.forEach(function(c){O.teeDay(d,c).forEach(function(x){n+=x.used})});return n});
    var covers=d7.map(function(d){return O.diningDay(d).reduce(function(a,x){return a+x.party},0)});
    var sales=d7.map(function(d){return C.shops.reduce(function(a,sh){return a+O.shopSales(d,sh)},0)});
    var ns=d7.reduce(function(a,d){return a+O.noShows(d)},0),sum=function(a){return a.reduce(function(x,y){return x+y},0)};
    var rooms=O.ROOMS.map(function(r){return [r.replace('The ',''),d7.reduce(function(a,d){return a+O.diningDay(d).filter(function(x){return x.venue===r}).reduce(function(p,x){return p+x.party},0)},0)]});
    var use=O.GROUPS.map(function(g){var u=0,all=0;d7.forEach(function(d){var c=O.courtUse(d,g);u+=c.used;all+=c.all});return [g.k+' courts',Math.round(u/all*100)]});
    var shops=C.shops.map(function(sh){return [sh,d7.reduce(function(a,d){return a+O.shopSales(d,sh)},0)]});
    var a=ROLES[role],can=function(v){return !a||a.indexOf(v)>-1};
    return head('Club Office','Reports','The last seven days. Every number here exports to a spreadsheet.','<button class="btn line" type="button" data-act="csv-week">Export the week</button>')+
      '<div class="grid g4" style="margin-bottom:18px"><div class="stat dark"><b data-count="'+sum(rounds)+'">0</b><span>Rounds this week</span><small>'+Math.round(sum(rounds)/7)+' a day on average</small></div><div class="stat"><b data-count="'+sum(covers)+'">0</b><span>Covers this week</span><small>Across '+O.ROOMS.length+' rooms</small></div><div class="stat"><b data-count="'+sum(sales)+'" data-pre="$">$0</b><span>Shop sales</span><small>'+E(C.shops.join(', '))+'</small></div><div class="stat"><b data-count="'+ns+'">0</b><span>No-shows</span><small>'+O.money(ns*F.noShow).replace('.00','')+' in fees</small></div></div>'+
      '<div class="grid g2" style="margin-bottom:18px">'+(can('tee')?'<div class="panel dark"><h2>Rounds per day</h2><p class="sub">Golfers through the first tee.</p>'+bars(rounds,lab)+'</div>':'')+
      (can('dining')?'<div class="panel dark"><h2>Covers per day</h2><p class="sub">All dining rooms.</p>'+bars(covers,lab)+'</div>':'')+'</div>'+
      '<div class="grid g3">'+(can('dining')?'<div class="panel"><h2>Covers by room</h2><p class="sub">Seven days.</p>'+hbar(rooms)+'</div>':'')+
      (can('courts')||!a?'<div class="panel"><h2>Court utilisation</h2><p class="sub">Share of court hours in use.</p>'+hbar(use,function(v){return v+'%'})+'</div>':'')+
      (can('orders')?'<div class="panel"><h2>Sales by shop</h2><p class="sub">Seven days.</p>'+hbar(shops,function(v){return '$'+v.toLocaleString('en-US')})+'</div>':'')+'</div>'+
      '<p class="note">Sample figures generated for the demonstration.</p>';
  };

  /* an honest account of what the demo is and how a live build would plug in */
  V.connect=function(){
    return head('For the club','How It <em>Connects</em>','What you are looking at is a working front end running on sample data. Here is how it would run at your club.')+
      '<div class="grid g2" style="margin-bottom:18px">'+
        '<div class="panel"><p class="tagline">Option one</p><h2>Layered on what you have</h2><p class="sub">Keep your current tee sheet, point of sale and billing.</p><ul class="ticks"><li>Members get this portal as their front door.</li><li>Bookings and charges are passed to your existing system, through its export, import or API.</li><li>Your accounting and member records stay exactly where they are.</li><li>Fastest to launch, least change for staff.</li></ul><p class="note">What can be connected depends on what your current vendor allows. That is the first thing we would confirm together.</p></div>'+
        '<div class="panel dark"><p class="tagline">Option two</p><h2>The club\'s own system</h2><p class="sub">The portal becomes the system of record.</p><ul class="ticks"><li>Tee sheet, courts, dining, shop orders and the gate list live here.</li><li>Month-end charges export to your accounting package.</li><li>No per-member software fees, and every screen is yours to change.</li><li>More to set up, and staff move to new screens.</li></ul><p class="note" style="color:var(--mist)">Member data would be migrated from your current provider with their export.</p></div>'+
      '</div>'+
      '<div class="panel"><h2>What moves between systems</h2><p class="sub">The same list either way. The second column is what the demo does today.</p><div class="tbl-wrap"><table class="tbl stack"><thead><tr><th>Data</th><th>In this demo</th><th>In a live build</th></tr></thead><tbody>'+
      [['Member roster and households','Sample members','Imported from your member records, then kept in step'],['Tee sheet','Sample bookings, real rules','Your tee sheet, or this one as the source'],['Dining reservations','Sample bookings','Your reservation book, or this one'],['Charges and statements','Sample charges','Posted to member billing; statements from your accounting'],['Handicaps','An estimate from posted rounds','Posted to the handicap service your club uses'],['Sign-in','Any member number','Each member\'s own login, with staff roles by department'],['Confirmations','Shown under Messages','Sent by email and text']].map(function(r){return '<tr><td data-l="Data"><b style="font-weight:600">'+r[0]+'</b></td><td data-l="Demo">'+r[1]+'</td><td data-l="Live">'+r[2]+'</td></tr>'}).join('')+'</tbody></table></div></div>';
  };

  V.notices=function(){
    var s=O.load();
    return head('Club Office','Notices','Post a notice and it appears on every member\'s home screen.')+
      '<div class="grid g2"><div class="panel"><h2>Post a notice</h2><p class="sub">Course conditions, closures, reminders.</p><form data-form="notice"><label class="f" for="nt">Headline</label><input class="in" id="nt" name="title" required autocomplete="off"><label class="f" for="nb">Message</label><textarea class="in" id="nb" name="body" required></textarea><button class="btn brass" type="submit">Post to members</button></form></div>'+
      '<div class="panel"><h2>Live notices</h2><p class="sub">Showing in the member portal now.</p>'+(s.notices.length?'<ul class="list">'+s.notices.map(function(n){return '<li><div class="what"><b>'+E(n.title)+'</b><small>'+O.nice(n.when)+' · '+E(n.body)+'</small></div><button class="btn sm danger" type="button" data-act="nt-del" data-id="'+n.id+'">Remove</button></li>'}).join('')+'</ul>':'<p class="empty">No notices posted.</p>')+'</div></div>';
  };

  /* ---------- sign in ---------- */
  function gate(){
    var el=$('login');if(O.signedIn('staff')){el.hidden=true;return true}
    el.hidden=false;
    el.innerHTML='<div class="login-card"><div class="lmark">'+O.MARK+'</div><p class="eyebrow">'+E(C.full)+'</p><h1>Staff <em>sign in</em></h1><form data-form="login"><label class="f" for="lu">Work email</label><input class="in" id="lu" type="email" value="office@club.example" autocomplete="username"><label class="f" for="lr">Department</label><select class="in" id="lr" name="role">'+opt(Object.keys(ROLES),role)+'</select><label class="f" for="lp">Password</label><input class="in" id="lp" type="password" value="clubhouse" autocomplete="current-password"><button class="btn brass" type="submit">Sign in</button></form><p class="note">Demonstration: any email and password will sign you in. Each department sees its own screens.</p><p class="note"><a href="'+C.site+'">Back to the club website</a></p></div>';
    return false;
  }
  function setRole(r){role=r;try{sessionStorage.setItem(C.key+'-role',r)}catch(e){}document.body.classList.toggle('role-gate',r==='Gate')}

  var main=$('view');
  function render(keep){
    var r=route();chrome(r);main.innerHTML=V[r]();$('more').classList.remove('open');
    main.classList.remove('enter');
    if(!keep){void main.offsetWidth;if(!O.STATIC)main.classList.add('enter');window.scrollTo(0,0);O.countUp(main)}else O.settle(main);
  }
  function data(form){var o={};[].forEach.call(form.elements,function(el){if(el.name)o[el.name]=el.value.trim()});return o}
  function drop(list,id,sample){var s=O.load();if(sample==='1')s.removed[id]=true;else s[list]=s[list].filter(function(x){return x.id!==id})}
  function ok(msg){O.save();render(true);O.toast(msg)}

  document.addEventListener('click',function(e){
    var el=e.target.closest('[data-act]');if(!el)return;var a=el.dataset.act,s=O.load(),d=el.dataset;
    if(a==='more'){$('more').classList.toggle('open');return}
    if(a==='signout'){e.preventDefault();O.sign('staff',false);location.hash='';gate();return}
    if(a==='reset'){O.reset();render();O.toast('Demo reset to the starting sample data.');return}
    if(a==='day'){var r=route();ui[r==='tee'?'teeDate':r==='dining'?'dnDate':r==='courts'?'ctDate':'gateDate']=d.date;ui.ctSel=null;render(true);return}
    if(a==='course'){ui.course=d.c;render(true);return}
    if(a==='ct-group'){ui.ctGroup=d.g;ui.ctSel=null;render(true);return}
    if(a==='tee-all'){ui.teeAll=d.v==='1';render(true);return}
    if(a==='tee-block'){s.blocks.tee.push({date:ui.teeDate,time:d.time,course:ui.course,reason:ui.teeReason});ok(O.t12(d.time)+' blocked: '+ui.teeReason+'.');return}
    if(a==='tee-unblock'){s.blocks.tee=s.blocks.tee.filter(function(b){return !(b.date===ui.teeDate&&b.time===d.time&&b.course===ui.course)});ok(O.t12(d.time)+' reopened.');return}
    if(a==='tee-cancel'){drop('tee',d.id,d.sample);var w=O.promote(ui.teeDate,d.time,ui.course);ok('Group removed.'+(w?' '+w.member+' was booked from the waitlist and notified.':''));return}
    if(a==='tee-in'){s.checked[d.id]=ui.teeDate;ok('Group checked in.');return}
    if(a==='tee-ns'){s.noshow[d.id]=ui.teeDate;var b=s.tee.filter(function(x){return x.id===d.id})[0];if(b&&b.member===O.N){s.charges.push({id:O.uid(),date:O.today(),desc:'No-show, '+O.t12(b.time)+' tee time',amt:F.noShow});O.notify('Email','Missed tee time: '+O.t12(b.time),'We missed you on the first tee. A '+O.money(F.noShow).replace('.00','')+' no-show fee has been added to your account.')}ok('Marked as a no-show. '+O.money(F.noShow).replace('.00','')+' fee recorded.');return}
    if(a==='dn-room'){ui.dnRoom=d.room;render(true);return}
    if(a==='dn-seat'){if(d.sample==='1')s.seated[d.id]=true;else s.dining.filter(function(x){return x.id===d.id})[0].status='Seated';ok('Party seated.');return}
    if(a==='dn-cancel'){drop('dining',d.id,d.sample);ok('Reservation cancelled.');return}
    if(a==='ct-block'){s.blocks.court.push({date:ui.ctDate,hour:+d.hour,court:+d.court,reason:ui.ctReason});ok('Court '+d.court+' at '+O.hr12(+d.hour)+' blocked: '+ui.ctReason+'.');return}
    if(a==='ct-unblock'){s.blocks.court=s.blocks.court.filter(function(b){return !(b.date===ui.ctDate&&b.hour===+d.hour&&b.court===+d.court)});ok('Court '+d.court+' at '+O.hr12(+d.hour)+' reopened.');return}
    if(a==='ct-show'){ui.ctSel={hour:+d.hour,court:+d.court};render(true);var p=$('ctDet');if(p)p.scrollIntoView({block:'center',behavior:'smooth'});return}
    if(a==='ct-close'){ui.ctSel=null;render(true);return}
    if(a==='ct-cancel'){drop('courts',d.id,d.sample);ui.ctSel=null;ok('Court reservation cancelled.');return}
    if(a==='rd-ok'||a==='rd-no'){var r1=s.rounds.filter(function(x){return x.id===d.id})[0];r1.status=a==='rd-ok'?'Verified':'Rejected';ok(r1.member+'\'s '+r1.total+' '+(a==='rd-ok'?'verified.':'rejected.'));return}
    if(a==='tn-ok'||a==='tn-no'){var t1=s.results.filter(function(x){return x.id===d.id})[0];t1.status=a==='tn-ok'?'Verified':'Rejected';var cb=s.courts.filter(function(x){return x.id===t1.court})[0];if(cb)cb.status=t1.status;ok(t1.sport+' result '+(a==='tn-ok'?'verified.':'rejected.'));return}
    if(a==='ord-tab'){ui.ordTab=d.tab;render(true);return}
    if(a==='ord-next'){var o=s.orders.filter(function(x){return x.id===d.id})[0];o.status=d.next;if(o.member===O.N&&d.next==='Ready for pickup')O.notify('Text',C.name,'Your order is ready for pickup at '+o.pickup+'.');ok(o.member+'\'s order: '+d.next.toLowerCase()+'.');return}
    if(a==='stock'){s.stock[d.sku]=s.stock[d.sku]||{};s.stock[d.sku].off=!s.stock[d.sku].off;O.save();render(true);return}
    if(a==='gate-in'){s.guests.filter(function(x){return x.id===d.id})[0].arrived=true;ok('Guest marked as arrived.');return}
    if(a==='nt-del'){s.notices=s.notices.filter(function(x){return x.id!==d.id});ok('Notice removed.');return}
    if(a==='print'){window.print();return}
    if(a==='csv-tee'){var rows=[['Date','Course','Time','Players','Holes','Transport','Fee','Booked online','Status']];O.teeDay(ui.teeDate,ui.course).forEach(function(x){x.groups.forEach(function(g){rows.push([ui.teeDate,ui.course,O.t12(x.time),g.players.join('; '),g.holes,g.cart,g.fee||0,g.sample?'No':'Yes',s.noshow[g.id]?'No-show':s.checked[g.id]?'Checked in':'Booked'])})});O.csv('tee-sheet-'+ui.teeDate+'.csv',rows);O.toast('Tee sheet exported.');return}
    if(a==='csv-dining'){O.csv('dining-'+ui.dnDate+'.csv',[['Date','Time','Member','Room','Party','Note','Status']].concat(O.diningDay(ui.dnDate).map(function(x){return [x.date,O.t12(x.time),x.member,x.venue,x.party,x.note,x.status]})));O.toast('Reservations exported.');return}
    if(a==='csv-members'){O.csv('members.csv',[['Number','Member','Membership','Household','Books ahead (days)','Rounds this month','Balance']].concat(memberRows().map(function(r){return [r.no,r.name,r.tier,r.hh,O.windowDays(r.tier),r.rounds,r.bal.toFixed(2)]})));O.toast('Roster exported.');return}
    if(a==='csv-week'){O.csv('week-report.csv',[['Date','Rounds','Covers','Shop sales','No-shows']].concat(last7().map(function(dt){var rn=0;O.COURSES.forEach(function(c){O.teeDay(dt,c).forEach(function(x){rn+=x.used})});return [dt,rn,O.diningDay(dt).reduce(function(p,x){return p+x.party},0),C.shops.reduce(function(p,sh){return p+O.shopSales(dt,sh)},0),O.noShows(dt)]})));O.toast('Week exported.');return}
  });
  document.addEventListener('change',function(e){
    var c=e.target.dataset.change,s=O.load();
    if(c==='tee-reason')ui.teeReason=e.target.value;
    if(c==='ct-reason')ui.ctReason=e.target.value;
    if(c==='role'){setRole(e.target.value);location.hash='';render();O.toast('Now viewing as '+role+'.')}
    if(c==='price'){var v=Math.max(0,+e.target.value||0);s.stock[e.target.dataset.sku]=s.stock[e.target.dataset.sku]||{};s.stock[e.target.dataset.sku].price=v;O.save();O.toast('Price updated to '+O.money(v)+'.')}
  });
  document.addEventListener('input',function(e){
    if(e.target.dataset.input==='q'){ui.q=e.target.value;var tmp=document.createElement('div');tmp.innerHTML=V.members();$('mRows').innerHTML=tmp.querySelector('#mRows').innerHTML}
  });
  document.addEventListener('submit',function(e){
    var f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();var k=f.dataset.form,d=data(f),s=O.load();
    if(k==='login'){setRole(d.role||role);O.sign('staff',true);$('login').classList.add('out');setTimeout(function(){$('login').hidden=true;$('login').classList.remove('out')},500);render();return}
    if(k==='event'){if(!d.name){O.toast('Please name the event.');return}s.events.push({id:O.uid(),name:d.name,date:d.date,time:d.time,where:d.where});ok(d.name+' published to members.')}
    if(k==='gate'){if(!d.name){O.toast('Please enter the guest\'s name.');return}s.guests.push({id:O.uid(),date:ui.gateDate,name:d.name,reason:d.reason,member:d.member,arrived:false});ok(d.name+' added to the gate list.')}
    if(k==='notice'){if(!d.title||!d.body){O.toast('Please add a headline and a message.');return}s.notices.unshift({id:O.uid(),when:O.today(),title:d.title,body:d.body});ok('Notice posted to members.')}
    if(k==='reply'){if(!d.reply){O.toast('Please write a reply.');return}var q=s.requests.filter(function(x){return x.id===f.dataset.id})[0];q.reply=d.reply;q.status='Resolved';if(q.member===O.N)O.notify('Text',C.name,'The concierge replied about '+q.topic.toLowerCase()+': '+d.reply);ok('Reply sent to '+q.member+'.')}
  });

  window.addEventListener('hashchange',function(){if(O.signedIn('staff'))render()});
  /* the other portal changed something: redraw, unless someone is mid-way through a form here */
  var pend=false;function busy(){var a=document.activeElement;return a&&main.contains(a)&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)}
  O.onChange(function(){if(!O.signedIn('staff'))return;if(busy()){pend=true;return}render(true)});
  main.addEventListener('focusout',function(){if(pend)setTimeout(function(){if(pend&&!busy()){pend=false;render(true)}},60)});
  setRole(role);
  if(gate())render();
})();
