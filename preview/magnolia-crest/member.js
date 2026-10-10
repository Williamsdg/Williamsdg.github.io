/* Club portal engine — member side. Williams Digital. Sample data only; nothing is sent anywhere. */
(function(){
  var O=Portal,C=O.C,E=O.esc,ME=O.N,F=O.FEES,$=function(id){return document.getElementById(id)};
  var sp=$('splash');sp.innerHTML=O.MARK;if(O.STATIC||O.EMBED)sp.className='splash done';else setTimeout(function(){sp.classList.add('done')},850);
  $('sideLogo').innerHTML=O.MARK+'<b>'+C.wordmark+'</b>';$('topLogo').innerHTML=O.MARK+(C.logoImg?'':E(C.name));
  var ICON={
    home:'<path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z"/>',
    tee:'<path d="M12 21V4l7 3.5-7 3.5"/><ellipse cx="12" cy="21" rx="6" ry="1.4"/>',
    dining:'<path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10M16 3c-2 2-2 8 0 9v9"/>',
    courts:'<circle cx="12" cy="12" r="9"/><path d="M5 6c3 3 3 9 0 12M19 6c-3 3-3 9 0 12"/>',
    more:'<path d="M4 7h16M4 12h16M4 17h16"/>'
  };
  var NAV=[['home','Home'],['tee','Tee Times'],['dining','Dining'],['courts','Courts'],['scores','Post a Score'],['shop','Shop for Pickup'],['events','Events'],['guests','Guests & Gate'],['concierge','Concierge'],['inbox','Messages'],['account','Card & Account']];
  var TABS=['home','tee','dining','courts'];
  var WIN=O.windowDays(O.ME.tier),TIER=O.ME.tier==='Member'?'Member':O.ME.tier+' member',TIERS=O.ME.tier==='Member'?'Members':O.ME.tier+' members';
  var ui={teeDate:O.today(),teeSel:null,waitSel:null,lateId:null,course:O.COURSES[0],ctDate:O.today(),ctSel:null,ctGroup:O.GROUPS[0].k,shopTab:C.shops[0],bag:[],scoreTab:'golf',scoreMatch:'',flip:false};

  function route(){var h=location.hash.replace('#','');return NAV.some(function(n){return n[0]===h})?h:'home'}
  function head(eyebrow,title,sub,extra){return '<div class="page-head"><div><p class="eyebrow">'+eyebrow+'</p><h1>'+title+'</h1>'+(sub?'<p>'+sub+'</p>':'')+'</div>'+(extra||'')+'</div>'}
  function opt(list,sel){return list.map(function(v){var val=Array.isArray(v)?v[0]:v,lab=Array.isArray(v)?v[1]:v;return '<option value="'+E(val)+'"'+(String(val)===String(sel)?' selected':'')+'>'+E(lab)+'</option>'}).join('')}
  function pill(s){var c=/Verified|Confirmed|Ready|Picked|Seated|Resolved/.test(s)?'ok':/Pending|New|Open|Waitlist/.test(s)?'warn':/Rejected|No-show/.test(s)?'bad':'';return '<span class="pill '+c+'">'+E(s)+'</span>'}
  function balance(){return O.load().charges.reduce(function(a,c){return a+c.amt},0)}
  function bagCount(){return ui.bag.reduce(function(a,i){return a+i.qty},0)}
  function unread(){return O.load().messages.filter(function(m){return !m.read}).length}
  function days(n,from){var a=[];for(var i=from||0;i<(from||0)+n;i++){var d=O.iso(O.day(i));a.push([d,O.nice(d)])}return a}
  function who(sel){return '<label class="f" for="bw">Booking for</label><select class="in" id="bw" name="who">'+opt(C.household.map(function(h){return [h.name,h.name+' · '+h.role]}),sel||ME)+'</select>'}
  function cal(kind,id){return '<button class="btn sm line" type="button" data-act="ics" data-kind="'+kind+'" data-id="'+id+'">Add to calendar</button>'}

  function chrome(r){
    var u=unread(),badge=function(k){return k==='shop'&&bagCount()?bagCount():k==='inbox'&&u?u:0};
    $('sideNav').innerHTML=NAV.map(function(n){var b=badge(n[0]);return '<a href="#'+n[0]+'" class="'+(n[0]===r?'on':'')+'">'+n[1]+(b?'<b>'+b+'</b>':'')+'</a>'}).join('');
    $('whoami').textContent=ME+' · No. '+O.ME.no;
    var mb=bagCount()+u;
    $('tabbar').innerHTML=TABS.map(function(k){var n=NAV.filter(function(x){return x[0]===k})[0];return '<a href="#'+k+'" class="'+(k===r?'on':'')+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+ICON[k]+'</svg>'+n[1]+'</a>'}).join('')+'<button type="button" data-act="more" class="'+(TABS.indexOf(r)<0?'on':'')+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+ICON.more+'</svg>More'+(mb?'<em>'+mb+'</em>':'')+'</button>';
    $('moreList').innerHTML=NAV.map(function(n){var b=badge(n[0]);return '<a href="#'+n[0]+'">'+n[1]+'<small>'+(b?b+' new':n[0]===r?'You are here':'')+'</small></a>'}).join('')+'<a href="'+C.site+'">Club website<small></small></a><a href="staff.html">Staff portal<small></small></a><a href="#" data-act="signout">Sign out<small></small></a>';
  }

  var V={};

  V.home=function(){
    var s=O.load(),t=O.today(),h=new Date().getHours(),up=[];
    s.tee.filter(function(b){return b.member===ME&&b.date>=t}).forEach(function(b){up.push({d:b.date,k:b.time,t:'Tee time, '+O.t12(b.time),x:(O.COURSES.length>1?b.course+' · ':'')+b.players.length+' player'+(b.players.length>1?'s':'')+' · '+b.cart,go:'tee',c:['tee',b.id]})});
    s.waitlist.filter(function(w){return w.member===ME&&w.date>=t}).forEach(function(w){up.push({d:w.date,k:w.time,t:'Waitlist, '+O.t12(w.time),x:'You will be booked automatically if a spot opens',go:'tee'})});
    s.dining.filter(function(b){return b.member===ME&&b.date>=t}).forEach(function(b){up.push({d:b.date,k:b.time,t:'Table reserved, '+O.t12(b.time),x:b.venue+' · party of '+b.party,go:'dining',c:['dining',b.id]})});
    s.courts.filter(function(b){return b.member===ME&&b.date>=t}).forEach(function(b){up.push({d:b.date,k:('0'+b.hour).slice(-2),t:b.kind+', '+O.hr12(b.hour),x:'Court '+b.court+' ('+O.courtType(b.court)+')'+(b.opp?' · with '+b.opp:''),go:'courts',c:['court',b.id]})});
    s.rsvps.filter(function(v){return v.member===ME}).forEach(function(v){var e=O.events().filter(function(x){return x.id===v.event})[0];if(e&&e.date>=t)up.push({d:e.date,k:e.time,t:e.name+', '+O.t12(e.time),x:e.where+' · '+v.adults+' adults'+(v.kids?', '+v.kids+' children':''),go:'events',c:['event',e.id]})});
    s.guests.filter(function(g){return g.member===ME&&g.date>=t}).forEach(function(g){up.push({d:g.date,k:'00',t:'Guest at the gate: '+g.name,x:g.reason,go:'guests'})});
    up.sort(function(a,b){return (a.d+a.k)<(b.d+b.k)?-1:1});
    var nt=s.tee.filter(function(b){return b.member===ME&&b.date>=t}).sort(function(a,b){return (a.date+a.time)<(b.date+b.time)?-1:1})[0];
    var idx=O.index(ME),ready=s.orders.filter(function(o){return o.member===ME&&o.status!=='Picked up'}).length;
    var owe=s.courts.filter(function(b){return b.member===ME&&b.date<t&&/match/.test(b.kind)&&!b.score}).length;
    var rs=s.rounds.filter(function(r){return r.member===ME&&r.status==='Verified'}).sort(function(a,b){return a.date<b.date?-1:1}),tot=rs.map(function(r){return r.total}),u=unread();
    return head(E(TIER)+' · No. '+O.ME.no,(h<12?'Good morning':h<17?'Good afternoon':'Good evening')+', <em>'+E(O.ME.first)+'</em>','Everything you have coming up at '+E(C.short)+', in one place.','<a class="bell" href="#inbox" aria-label="Messages, '+u+' unread"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4"/></svg>'+(u?'<b>'+u+'</b>':'')+'</a>')+
    '<div class="grid g4" style="margin-bottom:18px">'+
      '<a class="stat dark" href="#tee"><b>'+(nt?O.t12(nt.time).replace(' ','<small style="display:inline;font-size:16px;margin-left:4px">')+'</small>':'None')+'</b><span>Next tee time</span><small>'+(nt?O.nice(nt.date)+(O.COURSES.length>1?' · '+E(nt.course):''):'Book a round')+'</small></a>'+
      '<a class="stat" href="#scores"><b '+(idx==null?'':'data-count="'+idx.toFixed(1)+'"')+'>'+(idx==null?'–':'0')+'</b><span>Handicap index</span><small>Estimate from verified rounds</small></a>'+
      '<a class="stat" href="#account"><b data-count="'+Math.round(balance())+'" data-pre="$">$0</b><span>Account balance</span><small>Current statement</small></a>'+
      '<a class="stat" href="#shop"><b data-count="'+ready+'">0</b><span>Shop orders</span><small>'+(ready?'Awaiting pickup':'Nothing waiting')+'</small></a>'+
    '</div>'+
    (owe?'<div class="panel" style="margin-bottom:18px;border-left:3px solid var(--brass)"><div class="row" style="justify-content:space-between"><div><b>You have '+owe+' match'+(owe>1?'es':'')+' without a score.</b><br><span style="color:var(--ink2)">Post it so the shop can update the ladder.</span></div><a class="btn sm" href="#scores" data-act="score-tab" data-tab="racquets">Post a result</a></div></div>':'')+
    '<div class="grid g21">'+
      '<div class="panel"><h2>Coming up</h2><p class="sub">Tee times, tables, courts, events and guests for your household.</p>'+
        (up.length?'<ul class="list">'+up.map(function(x){return '<li><div class="what"><b>'+E(x.t)+'</b><small>'+O.nice(x.d)+' · '+E(x.x)+'</small></div><div class="row">'+(x.c?cal(x.c[0],x.c[1]):'')+'<a class="btn sm line" href="#'+x.go+'">View</a></div></li>'}).join('')+'</ul>':'<p class="empty">Nothing booked yet.</p>')+
        '<div class="row" style="margin-top:16px"><a class="btn" href="#tee">Book a tee time</a><a class="btn line" href="#dining">Reserve a table</a><a class="btn line" href="#courts">Reserve a court</a></div>'+
      '</div>'+
      '<div class="grid" style="align-content:start">'+
        '<div class="panel dark"><h2>From the club</h2><p class="sub">Posted by the club office.</p>'+s.notices.map(function(n){return '<div class="notice"><b>'+E(n.title)+'</b><small>'+O.nice(n.when)+'</small><p>'+E(n.body)+'</p></div>'}).join('')+'</div>'+
        '<div class="panel"><h2>Your game</h2><p class="sub">Last '+tot.length+' verified rounds'+(tot.length?', low of '+Math.min.apply(0,tot):'')+'.</p><svg class="spark" viewBox="0 0 300 64" preserveAspectRatio="none" role="img" aria-label="Scores for your last rounds: '+tot.join(', ')+'"><path d="'+O.spark(tot.map(function(v){return -v}),300,64)+'"/></svg><div class="row" style="justify-content:space-between;font-size:13.5px;color:var(--ink2)"><span>'+(rs[0]?O.nice(rs[0].date):'')+'</span><span>'+(rs.length?O.nice(rs[rs.length-1].date):'')+'</span></div></div>'+
      '</div>'+
    '</div>';
  };

  /* ---------- tee times: booking window, guest fees, waitlist, late cancellation ---------- */
  function teeFee(n,guests,cart){return guests*F.guest+(cart==='Cart'?n*F.cart:0)+(cart==='Caddie'?F.caddie:0)}
  V.tee=function(){
    var s=O.load(),slots=O.teeDay(ui.teeDate,ui.course),now=new Date(),nowT=('0'+now.getHours()).slice(-2)+':'+('0'+now.getMinutes()).slice(-2);
    var mine=s.tee.filter(function(b){return b.member===ME&&b.date>=O.today()}).sort(function(a,b){return (a.date+a.time)<(b.date+b.time)?-1:1});
    var waits=s.waitlist.filter(function(w){return w.member===ME&&w.date>=O.today()});
    var sel=ui.teeSel?O.teeSlot(ui.teeDate,ui.teeSel,ui.course):null;
    var grid=slots.map(function(x,i){
      var past=ui.teeDate===O.today()&&x.time<nowT,onWait=x.wait.some(function(w){return w.member===ME});
      var cls=x.mine?'mine':x.block?'blocked':past?'full':x.open===0?'full wl':x.open<4?'part':'';
      var lab=x.mine?'Your tee time':x.block?E(x.block.reason):past?'Passed':onWait?'On the waitlist':x.open===0?'Full · join waitlist':x.open===4?'Open':x.open+' spot'+(x.open>1?'s':'')+' open';
      var act=x.mine||x.block||past||onWait?'disabled':x.open>0?'data-act="tee-pick" data-time="'+x.time+'"':'data-act="wait-pick" data-time="'+x.time+'"';
      return '<button type="button" style="--i:'+i+'" class="slot '+cls+((ui.teeSel||ui.waitSel)===x.time?' sel':'')+'" '+act+'><b>'+O.t12(x.time)+'</b><span>'+lab+'</span></button>';
    }).join('');
    var form='';
    if(sel&&sel.open>0){
      var n=[];for(var i=1;i<=sel.open;i++)n.push([i,i+(i>1?' players':' player')]);
      form='<div class="panel pop" id="teeForm" style="margin-bottom:18px;border-color:var(--bronze)"><h2>'+O.long(ui.teeDate)+' at '+O.t12(sel.time)+'</h2><p class="sub">'+(O.COURSES.length>1?E(ui.course)+'. ':'')+(sel.groups.length?'Joining '+E(sel.groups.map(function(g){return g.players.join(', ')}).join(', '))+'.':'The tee is yours.')+' '+sel.open+' spot'+(sel.open>1?'s':'')+' available.</p>'+
      '<form data-form="tee"><div class="fgrid">'+
        '<div class="full">'+who()+'</div>'+
        '<div><label class="f" for="tp">Players</label><select class="in" id="tp" name="n" data-change="tee-n">'+opt(n,Math.min(2,sel.open))+'</select></div>'+
        '<div><label class="f" for="th">Round</label><select class="in" id="th" name="holes">'+opt([[18,'18 holes'],[9,'9 holes']],18)+'</select></div>'+
        '<div class="full" id="teeNames"></div>'+
        '<div><label class="f" for="tc">How you will play</label><select class="in" id="tc" name="cart" data-change="tee-fee">'+opt([['Cart','Cart · '+O.money(F.cart).replace('.00','')+' each'],['Walking','Walking · no charge'],['Caddie','Caddie · '+O.money(F.caddie).replace('.00','')]],'Cart')+'</select></div>'+
        '<div><label class="f" for="tr">Range before</label><select class="in" id="tr" name="range">'+opt(['No thanks','Reserve a bay 30 minutes before'],'No thanks')+'</select></div>'+
      '</div><div class="fee" id="teeFee"></div><div class="row"><button class="btn brass" type="submit">Confirm tee time</button><button class="btn line" type="button" data-act="tee-clear">Cancel</button></div></form>'+
      '<p class="note">Guests you add go on the gate list automatically. Free cancellation until '+C.cancelHours+' hours before the tee time; after that a '+O.money(F.lateCancel).replace('.00','')+' late fee applies.</p></div>';
    } else if(ui.waitSel){
      form='<div class="panel pop" id="teeForm" style="margin-bottom:18px;border-color:var(--bronze)"><h2>'+O.t12(ui.waitSel)+' is full</h2><p class="sub">Join the waitlist and you will be booked automatically, and told by text, if a spot opens.</p><form data-form="wait"><div class="fgrid"><div><label class="f" for="wp">Players</label><select class="in" id="wp" name="n">'+opt([[1,'1 player'],[2,'2 players'],[3,'3 players'],[4,'4 players']],2)+'</select></div></div><div class="row"><button class="btn brass" type="submit">Join the waitlist</button><button class="btn line" type="button" data-act="tee-clear">Cancel</button></div></form></div>';
    }
    return head('Golf','Tee <em>Times</em>',E(C.copy.tee))+
      (O.COURSES.length>1?'<div class="seg2" role="group" aria-label="Course">'+O.COURSES.map(function(c){return '<button type="button" data-act="course" data-c="'+E(c)+'" aria-pressed="'+(ui.course===c)+'">'+E(c)+'</button>'}).join('')+'</div>':'')+
      O.dayStrip(ui.teeDate,0,WIN+3,WIN)+
      '<p class="rule-line">'+E(TIERS)+' book up to <b>'+WIN+' days</b> ahead. Later days unlock each morning at 7:00.</p>'+form+
      '<div class="grid g21"><div class="panel"><h2>'+O.long(ui.teeDate)+'</h2><p class="sub">'+(O.COURSES.length>1?E(ui.course)+', first tee. ':'First tee. ')+'Times every ten minutes.</p><div class="slots">'+grid+'</div></div>'+
      '<div class="grid" style="align-content:start"><div class="panel"><h2>Your tee times</h2><p class="sub">Upcoming rounds for your household.</p>'+
        (mine.length?'<ul class="list">'+mine.map(function(b){var late=O.hoursUntil(b.date,b.time)<C.cancelHours,sure=ui.lateId===b.id;
          return '<li><div class="what"><b>'+O.nice(b.date)+' at '+O.t12(b.time)+(b.fromWait?' <span class="pill ok">From waitlist</span>':'')+'</b><small>'+(O.COURSES.length>1?E(b.course)+' · ':'')+E(b.players.join(', '))+' · '+b.holes+' holes · '+E(b.cart)+(b.fee?' · '+O.money(b.fee)+' to your account':'')+'</small></div><div class="row">'+cal('tee',b.id)+'<button class="btn sm danger" type="button" data-act="tee-cancel" data-id="'+b.id+'"'+(sure?' data-sure="1"':'')+'>'+(sure?'Confirm: '+O.money(F.lateCancel).replace('.00','')+' late fee':late?'Cancel (late)':'Cancel')+'</button></div></li>'}).join('')+'</ul>':'<p class="empty">No rounds booked.</p>')+
        '<p class="note">After your round, <a href="#scores">post your score</a>.</p></div>'+
        (waits.length?'<div class="panel"><h2>Your waitlist</h2><p class="sub">We book you the moment a spot opens.</p><ul class="list">'+waits.map(function(w){return '<li><div class="what"><b>'+O.nice(w.date)+' at '+O.t12(w.time)+'</b><small>'+(O.COURSES.length>1?E(w.course)+' · ':'')+w.players+' player'+(w.players>1?'s':'')+'</small></div><button class="btn sm danger" type="button" data-act="wait-leave" data-id="'+w.id+'">Leave</button></li>'}).join('')+'</ul></div>':'')+
      '</div></div>';
  };
  function teeNames(){
    var box=$('teeNames');if(!box)return;var n=+$('tp').value,h='';
    for(var i=2;i<=n;i++)h+='<label class="f" for="pn'+i+'">Player '+i+'</label><div class="fgrid" style="grid-template-columns:150px 1fr"><select class="in" name="pt'+i+'" aria-label="Player '+i+' type" data-change="tee-fee"><option>Member</option><option value="Guest">Guest · '+O.money(F.guest).replace('.00','')+'</option></select><input class="in" id="pn'+i+'" name="pn'+i+'" placeholder="Name" autocomplete="off"></div>';
    box.innerHTML=h;teeFeeShow();
  }
  function teeFeeShow(){
    var box=$('teeFee');if(!box)return;var n=+$('tp').value,g=0;for(var i=2;i<=n;i++){var e=document.querySelector('[name=pt'+i+']');if(e&&e.value==='Guest')g++}
    var cart=$('tc').value,rows=[];if(g)rows.push([g+' guest fee'+(g>1?'s':''),g*F.guest]);if(cart==='Cart')rows.push([n+' cart fee'+(n>1?'s':''),n*F.cart]);if(cart==='Caddie')rows.push(['Caddie',F.caddie]);
    var tot=teeFee(n,g,cart);
    box.innerHTML=(rows.length?rows.map(function(r){return '<div><span>'+r[0]+'</span><span>'+O.money(r[1])+'</span></div>'}).join(''):'<div><span>Member round, walking</span><span>No charge</span></div>')+'<div class="tot"><span>Charged to account No. '+O.ME.no+'</span><b>'+O.money(tot)+'</b></div>';
    return tot;
  }

  V.dining=function(){
    var s=O.load(),ds=days(14).map(function(d,i){return [d[0],d[1]+(i>1?'':', '+O.long(d[0]).split(', ')[1])]});
    var mine=s.dining.filter(function(b){return b.member===ME&&b.date>=O.today()}).sort(function(a,b){return (a.date+a.time)<(b.date+b.time)?-1:1});
    var times=O.DINE_TIMES.map(function(t){return [t,O.t12(t)]}),party=[];for(var p=1;p<=14;p++)party.push([p,p+(p>1?' guests':' guest')]);
    return head('Clubhouse','Dining <em>Reservations</em>',E(C.copy.dining))+
    '<div class="grid g2"><div class="panel"><h2>Reserve a table</h2><p class="sub">You will get a confirmation by email and text.</p><form data-form="dining"><div class="fgrid">'+
      '<div class="full">'+who()+'</div>'+
      '<div class="full"><label class="f" for="dv">Dining room</label><select class="in" id="dv" name="venue">'+opt(O.ROOMS,O.ROOMS[0])+'</select></div>'+
      '<div><label class="f" for="dd">Date</label><select class="in" id="dd" name="date">'+opt(ds,O.iso(O.day(1)))+'</select></div>'+
      '<div><label class="f" for="dt">Time</label><select class="in" id="dt" name="time">'+opt(times,'19:00')+'</select></div>'+
      '<div><label class="f" for="dp">Party</label><select class="in" id="dp" name="party">'+opt(party,2)+'</select></div>'+
      '<div><label class="f" for="ds">Seating</label><select class="in" id="ds" name="seat">'+opt(C.seating,C.seating[0])+'</select></div>'+
      '<div class="full"><label class="f" for="dn">Occasion, allergies or requests</label><input class="in" id="dn" name="note" placeholder="Optional" autocomplete="off"></div>'+
    '</div><button class="btn brass" type="submit">Reserve</button></form></div>'+
    '<div class="panel"><h2>Your reservations</h2><p class="sub">Upcoming tables.</p>'+
      (mine.length?'<ul class="list">'+mine.map(function(b){return '<li><div class="what"><b>'+O.nice(b.date)+' at '+O.t12(b.time)+'</b><small>'+E(b.venue)+' · party of '+b.party+(b.who&&b.who!==ME?' · for '+E(b.who):'')+(b.note?' · '+E(b.note):'')+'</small></div><div class="row">'+pill(b.status)+cal('dining',b.id)+'<button class="btn sm danger" type="button" data-act="dine-cancel" data-id="'+b.id+'">Cancel</button></div></li>'}).join('')+'</ul>':'<p class="empty">No tables reserved.</p>')+
    '</div></div>';
  };

  V.courts=function(){
    var s=O.load(),t=O.today(),nowH=new Date().getHours(),G=O.GROUPS.filter(function(g){return g.k===ui.ctGroup})[0],cs=[];
    for(var c=G.from;c<=G.to;c++)cs.push(c);
    var g='<div class="h"></div>'+cs.map(function(c){return '<div class="h">Court '+c+'<small>'+G.k+'</small></div>'}).join('');
    O.COURT_HOURS.forEach(function(h){
      g+='<div class="tm">'+O.hr12(h)+'</div>';
      cs.forEach(function(c){
        var x=O.courtCell(ui.ctDate,h,c),past=ui.ctDate===t&&h<=nowH;
        if(x.state==='block')g+='<div class="cell blk">'+E(x.reason)+'</div>';
        else if(x.state==='booked')g+='<div class="cell '+(x.mine?'mine':'bk')+'">'+(x.mine?'Yours':'Reserved')+'</div>';
        else if(past)g+='<div class="cell bk">–</div>';
        else g+='<button type="button" class="cell" data-act="ct-pick" data-hour="'+h+'" data-court="'+c+'" aria-label="Court '+c+' at '+O.hr12(h)+', open">Open</button>';
      });
    });
    var form='';
    if(ui.ctSel)form='<div class="panel pop" id="ctForm" style="margin-bottom:18px;border-color:var(--bronze)"><h2>Court '+ui.ctSel.court+', '+O.long(ui.ctDate)+' at '+O.hr12(ui.ctSel.hour)+'</h2><p class="sub">'+O.courtType(ui.ctSel.court)+' court. One hour.</p><form data-form="court"><div class="fgrid">'+
      '<div class="full">'+who()+'</div>'+
      '<div><label class="f" for="ck">Reservation</label><select class="in" id="ck" name="kind">'+opt(['Singles match','Doubles match','Practice','Lesson with a pro'],/pickle/i.test(ui.ctGroup)?'Doubles match':'Singles match')+'</select></div>'+
      '<div><label class="f" for="co">Playing with</label><input class="in" id="co" name="opp" placeholder="Opponent or partners" autocomplete="off"></div>'+
      '</div><div class="row"><button class="btn brass" type="submit">Reserve court</button><button class="btn line" type="button" data-act="ct-clear">Cancel</button></div></form></div>';
    var mine=s.courts.filter(function(b){return b.member===ME}).sort(function(a,b){return (a.date+('0'+a.hour).slice(-2))<(b.date+('0'+b.hour).slice(-2))?1:-1});
    return head('Racquets','Courts &amp; <em>Matches</em>',E(C.copy.courts))+
      (O.GROUPS.length>1?'<div class="seg2" role="group" aria-label="Court type">'+O.GROUPS.map(function(x){return '<button type="button" data-act="ct-group" data-g="'+x.k+'" aria-pressed="'+(ui.ctGroup===x.k)+'">'+x.k+' '+x.from+'–'+x.to+'</button>'}).join('')+'</div>':'')+
      O.dayStrip(ui.ctDate,0,8)+form+
      '<div class="panel" style="margin-bottom:18px"><h2>'+O.long(ui.ctDate)+'</h2><p class="sub">'+G.k+' courts. Scroll sideways to see every court.</p><div class="tbl-wrap"><div class="cgrid" style="--n:'+cs.length+'">'+g+'</div></div></div>'+
      '<div class="panel"><h2>Your courts and matches</h2><p class="sub">Report a result once a match has been played.</p>'+
      (mine.length?'<ul class="list">'+mine.map(function(b){var past=b.date<t||(b.date===t&&b.hour<=nowH),isM=/match/.test(b.kind);
        return '<li><div class="what"><b>'+E(b.kind)+(b.opp?' with '+E(b.opp):'')+'</b><small>'+O.nice(b.date)+' at '+O.hr12(b.hour)+' · Court '+b.court+' ('+O.courtType(b.court)+')'+(b.who&&b.who!==ME?' · for '+E(b.who):'')+(b.score?' · '+E(b.score):'')+'</small></div><div class="row">'+(b.status?pill(b.status):'')+(past?(isM&&!b.score?'<a class="btn sm" href="#scores" data-act="score-match" data-id="'+b.id+'">Report result</a>':''):cal('court',b.id)+'<button class="btn sm danger" type="button" data-act="ct-cancel" data-id="'+b.id+'">Cancel</button>')+'</div></li>'}).join('')+'</ul>':'<p class="empty">No courts reserved.</p>')+
      '<p class="note">'+E(C.copy.courtsNote)+'</p></div>';
  };

  V.scores=function(){
    var s=O.load(),T=[['golf','Golf round'],['racquets',C.sports.length>1?'Racquets match':'Tennis match']];if(C.swim)T.push(['swim','Swim time']);
    var tabs='<div class="tabs">'+T.map(function(t){return '<button type="button" data-act="score-tab" data-tab="'+t[0]+'" aria-pressed="'+(ui.scoreTab===t[0])+'">'+t[1]+'</button>'}).join('')+'</div>';
    var ds=days(8,-7).reverse(),body;
    if(ui.scoreTab==='golf'){
      var holes=function(from){var h='<div class="holes">';for(var i=from;i<from+9;i++)h+='<div class="hole"><small>Hole '+(i+1)+'</small><i>Par '+O.PAR[i]+'</i><input type="number" inputmode="numeric" min="1" max="15" name="h'+i+'" aria-label="Hole '+(i+1)+' score" data-hole></div>';return h+'</div>'};
      var rounds=s.rounds.filter(function(r){return r.member===ME}).sort(function(a,b){return a.date<b.date?1:-1}),ix=O.index(ME);
      body='<div class="grid g2"><div class="panel"><h2>Post a round</h2><p class="sub">Enter each hole. Totals, score to par and your differential are worked out for you.</p><form data-form="round"><div class="fgrid">'+
        '<div><label class="f" for="rd">Date played</label><select class="in" id="rd" name="date">'+opt(ds,O.today())+'</select></div>'+
        '<div><label class="f" for="rt">Tees</label><select class="in" id="rt" name="tee" data-change="round-calc">'+opt(O.TEES.map(function(t){return [t.n,t.n+' · '+t.y.toLocaleString('en-US')+' yds · '+t.r.toFixed(1)+'/'+t.s]}),C.myTee)+'</select></div>'+
        '<div><label class="f" for="rp">Putts</label><input class="in" id="rp" name="putts" type="number" inputmode="numeric" min="0" max="72" placeholder="Optional"></div>'+
        '<div><label class="f" for="rw">Played with</label><input class="in" id="rw" name="partner" placeholder="Optional" autocomplete="off"></div></div>'+
        '<label class="f">Front nine</label>'+holes(0)+'<label class="f" style="margin-top:12px">Back nine</label>'+holes(9)+
        '<div class="totals" style="grid-template-columns:repeat(5,1fr)"><div><b id="rOut">–</b><span>Out</span></div><div><b id="rIn">–</b><span>In</span></div><div><b id="rTot">–</b><span>Total</span></div><div><b id="rPar">–</b><span>To par</span></div><div><b id="rDiff">–</b><span>Diff.</span></div></div>'+
        '<p class="note" id="rMix" style="margin:-6px 0 14px"></p>'+
        '<div class="row"><button class="btn brass" type="submit">Post score</button><button class="btn line" type="button" data-act="round-fill">Fill a sample round</button></div></form>'+
        '<p class="note">Scores go to the Golf Shop for verification before they count toward your index.</p></div>'+
        '<div class="panel"><h2>Your rounds</h2><p class="sub">Handicap index estimate: <b>'+(ix==null?'–':ix.toFixed(1))+'</b></p><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Date</th><th>Tees</th><th class="num">Score</th><th class="num">Putts</th><th class="num">Diff.</th><th></th></tr></thead><tbody>'+
        rounds.map(function(r){return '<tr><td style="white-space:nowrap">'+O.nice(r.date)+'</td><td>'+E(r.tee.length>8?r.tee.slice(0,5)+'.':r.tee)+'</td><td class="num t">'+r.total+'</td><td class="num">'+(r.putts||'–')+'</td><td class="num">'+r.diff.toFixed(1)+'</td><td>'+pill(r.status)+'</td></tr>'}).join('')+'</tbody></table></div></div></div>';
    } else if(ui.scoreTab==='racquets'){
      var open=s.courts.filter(function(b){return b.member===ME&&/match/.test(b.kind)&&!b.score&&b.date<=O.today()});
      var matches=open.map(function(b){return [b.id,O.nice(b.date)+' · '+O.courtType(b.court)+' · '+b.kind+(b.opp?' with '+b.opp:'')]});matches.push(['other','A match not on the court sheet']);
      var hist=s.results.filter(function(x){return x.member===ME}).sort(function(a,b){return a.date<b.date?1:-1});
      var setRow=function(w,k){return '<div>'+w+'</div>'+[1,2,3].map(function(n){return '<input class="in" type="number" inputmode="numeric" min="0" max="30" name="'+k+n+'" aria-label="'+w+', game '+n+'">'}).join('')};
      body='<div class="grid g2"><div class="panel"><h2>Report a match</h2><p class="sub">'+E(C.sports.join(', ').replace(/, ([^,]*)$/,' or $1'))+'. Leave the third column empty if it was not played.</p><form data-form="result">'+
        '<label class="f" for="xm">Match</label><select class="in" id="xm" name="match" data-change="x-match">'+opt(matches,ui.scoreMatch||matches[0][0])+'</select>'+
        '<div id="xOther" hidden><div class="fgrid"><div><label class="f" for="xs">Sport</label><select class="in" id="xs" name="sport">'+opt(C.sports,C.sports[0])+'</select></div><div><label class="f" for="xk">Format</label><select class="in" id="xk" name="kind">'+opt(['Singles match','Doubles match'],'Singles match')+'</select></div><div class="full"><label class="f" for="xo">Opponent</label><input class="in" id="xo" name="opp" autocomplete="off"></div></div></div>'+
        '<div class="sets"><div></div><div class="hd">1</div><div class="hd">2</div><div class="hd">3</div>'+setRow('You','a')+setRow('Opponent','b')+'</div>'+
        '<div class="row" style="margin-top:14px"><button class="btn brass" type="submit">Submit result</button></div></form>'+
        '<p class="note">Results go to the shop for verification and feed the club ladders.</p></div>'+
        '<div class="panel"><h2>Your results</h2><p class="sub">Matches you have reported.</p>'+
        (hist.length?'<ul class="list">'+hist.map(function(x){return '<li><div class="what"><b>'+E(x.sport)+': '+E(x.kind.toLowerCase())+' with '+E(x.opp)+'</b><small>'+O.nice(x.date)+' · '+x.sets.map(function(p){return p[0]+'–'+p[1]}).join(', ')+'</small></div>'+pill(x.status)+'</li>'}).join('')+'</ul>':'<p class="empty">No results yet.</p>')+'</div></div>';
    } else {
      var sw=s.swims.filter(function(x){return x.member===ME}).sort(function(a,b){return a.date<b.date?1:-1}),best={};
      sw.forEach(function(x){if(!best[x.event]||x.time<best[x.event])best[x.event]=x.time});
      body='<div class="grid g2"><div class="panel"><h2>Log a swim</h2><p class="sub">For the swim team board and your own personal bests.</p><form data-form="swim"><div class="fgrid">'+
        '<div><label class="f" for="se">Event</label><select class="in" id="se" name="event">'+opt(['50 Free','100 Free','200 Free','50 Back','50 Breast','50 Fly','100 IM'],'100 Free')+'</select></div>'+
        '<div><label class="f" for="sd">Date</label><select class="in" id="sd" name="date">'+opt(ds,O.today())+'</select></div>'+
        '<div><label class="f" for="sm">Minutes</label><input class="in" id="sm" name="min" type="number" inputmode="numeric" min="0" max="59" value="1"></div>'+
        '<div><label class="f" for="ss">Seconds</label><input class="in" id="ss" name="sec" type="number" inputmode="decimal" min="0" max="59.99" step="0.01" placeholder="07.80"></div>'+
        '</div><button class="btn brass" type="submit">Log time</button></form></div>'+
        '<div class="panel"><h2>Your times</h2><p class="sub">Personal bests are marked.</p>'+
        (sw.length?'<ul class="list">'+sw.map(function(x){return '<li><div class="what"><b>'+E(x.event)+' · '+E(x.time)+'</b><small>'+O.nice(x.date)+'</small></div>'+(best[x.event]===x.time?'<span class="pill ok">Personal best</span>':'')+'</li>'}).join('')+'</ul>':'<p class="empty">No swims logged.</p>')+'</div></div>';
    }
    return head('Scores','Post a <em>Score</em>','Golf rounds hole by hole'+(C.swim?', match results for the ladders, and swim times.':' and match results.'))+tabs+body;
  };
  function roundCalc(){
    var ins=document.querySelectorAll('[data-hole]');if(!ins.length)return null;var v=[].map.call(ins,function(i){return +i.value||0});
    var out=v.slice(0,9).reduce(function(a,b){return a+b},0),inn=v.slice(9).reduce(function(a,b){return a+b},0),full=v.every(function(x){return x>0}),tot=out+inn;
    var set=function(id,t){$(id).textContent=t};
    set('rOut',out||'–');set('rIn',inn||'–');set('rTot',tot||'–');
    var par=O.PAR.reduce(function(a,b){return a+b},0),tp=tot-par,d=full?O.diff(tot,$('rt').value):null;
    set('rPar',full?(tp===0?'E':(tp>0?'+':'')+tp):'–');set('rDiff',d==null?'–':d.toFixed(1));
    var m={e:0,b:0,p:0,g:0,d:0};v.forEach(function(x,i){if(!x)return;var k=x-O.PAR[i];if(k<=-2)m.e++;else if(k===-1)m.b++;else if(k===0)m.p++;else if(k===1)m.g++;else m.d++});
    set('rMix',full?(m.e?m.e+' eagle'+(m.e>1?'s':'')+' · ':'')+m.b+' birdie'+(m.b===1?'':'s')+' · '+m.p+' pars · '+m.g+' bogeys · '+m.d+' doubles or worse':'');
    return full?{total:tot,diff:d}:null;
  }

  V.shop=function(){
    var s=O.load(),tabs=C.shops.concat(['Bag']);
    var h=head('Pro Shops','Shop for <em>Pickup</em>','Order from '+E(C.shops.join(', ').replace(/, ([^,]*)$/,' or $1'))+' and collect it at the counter. Charged to your member account.')+
      '<div class="tabs">'+tabs.map(function(t){return '<button type="button" data-act="shop-tab" data-tab="'+E(t)+'" aria-pressed="'+(ui.shopTab===t)+'">'+(t==='Bag'?'Your bag ('+bagCount()+')':E(t))+'</button>'}).join('')+'</div>';
    if(ui.shopTab!=='Bag'){
      h+='<div class="prods">'+O.products().filter(function(p){return p.shop===ui.shopTab}).map(function(p,i){
        return '<article class="prod'+(p.off?' off':'')+'" style="--i:'+i*4+'"><div class="tile'+(i%2?' t2':'')+'">'+E(p.brand)+'</div><div class="bd"><b>'+E(p.name)+'</b><span class="pr">'+O.money(p.price).replace('.00','')+'</span>'+
          (p.sizes?'<select class="in" aria-label="Size for '+E(p.name)+'" id="sz-'+p.sku+'">'+opt(p.sizes.map(function(z){return [z,'Size '+z]}),p.sizes[1])+'</select>':'')+
          (p.off?'<button class="btn sm" disabled>Out of stock</button>':'<button class="btn sm" type="button" data-act="bag-add" data-sku="'+p.sku+'">Add to bag</button>')+'</div></article>'}).join('')+'</div>'+
        '<p class="note">'+E(C.copy.sample)+'</p>';
    } else {
      var tot=ui.bag.reduce(function(a,i){return a+i.qty*i.price},0),shops={};ui.bag.forEach(function(i){shops[i.shop]=1});
      var mine=s.orders.filter(function(o){return o.member===ME});
      h+='<div class="grid g2"><div class="panel"><h2>Your bag</h2><p class="sub">Pickup at '+(E(Object.keys(shops).join(' and '))||'the shop counter')+'.</p>'+
        (ui.bag.length?'<ul class="list">'+ui.bag.map(function(i,n){return '<li><div class="what"><b>'+E(i.name)+'</b><small>'+(i.size?'Size '+E(i.size)+' · ':'')+O.money(i.price)+' each</small></div><div class="qty"><button type="button" data-act="bag-qty" data-n="'+n+'" data-d="-1" aria-label="One fewer">−</button><span>'+i.qty+'</span><button type="button" data-act="bag-qty" data-n="'+n+'" data-d="1" aria-label="One more">+</button></div></li>'}).join('')+'</ul>'+
          '<div class="sum"><span>Charged to member account No. '+O.ME.no+'</span><b>'+O.money(tot)+'</b></div><button class="btn brass" type="button" data-act="order">Place order for pickup</button>'
          :'<p class="empty">Your bag is empty.</p><div class="row">'+C.shops.slice(0,2).map(function(x){return '<button class="btn line" type="button" data-act="shop-tab" data-tab="'+E(x)+'">'+E(x)+'</button>'}).join('')+'</div>')+'</div>'+
        '<div class="panel"><h2>Your orders</h2><p class="sub">We text you when it is ready at the counter.</p>'+
        (mine.length?'<ul class="list">'+mine.map(function(o){return '<li><div class="what"><b>'+E(o.items.map(function(i){return i.qty+' × '+i.name}).join(', '))+'</b><small>'+O.nice(o.when)+' · '+E(o.pickup)+' · '+O.money(o.total)+'</small></div>'+pill(o.status)+'</li>'}).join('')+'</ul>':'<p class="empty">No orders yet.</p>')+'</div></div>';
    }
    return h;
  };

  V.events=function(){
    var s=O.load(),ev=O.events().filter(function(e){return e.date>=O.today()});
    var num=function(max,from){var a=[];for(var i=from;i<=max;i++)a.push(i);return a};
    return head('The calendar','Events &amp; <em>RSVPs</em>','Let us know who is coming and we will hold your places.')+
      '<div class="grid g2">'+ev.map(function(e){var v=s.rsvps.filter(function(x){return x.event===e.id&&x.member===ME})[0],all=s.rsvps.filter(function(x){return x.event===e.id}),n=all.reduce(function(a,x){return a+x.adults+x.kids},0);
        return '<div class="panel"><div class="row" style="justify-content:space-between;align-items:flex-start"><div><h2>'+E(e.name)+'</h2><p class="sub">'+O.long(e.date)+' at '+O.t12(e.time)+' · '+E(e.where)+'</p></div>'+(v?'<span class="pill ok">Attending</span>':'')+'</div>'+
        '<div class="meter" aria-hidden="true"><i style="width:'+Math.min(100,8+n*6)+'%"></i></div><p class="note" style="margin:0 0 14px">'+n+' attending so far</p>'+
        '<form data-form="rsvp" data-id="'+e.id+'"><div class="fgrid"><div><label class="f" for="a'+e.id+'">Adults</label><select class="in" id="a'+e.id+'" name="adults">'+opt(num(8,1),v?v.adults:2)+'</select></div><div><label class="f" for="k'+e.id+'">Children</label><select class="in" id="k'+e.id+'" name="kids">'+opt(num(8,0),v?v.kids:0)+'</select></div></div>'+
        '<div class="row"><button class="btn '+(v?'line':'brass')+'" type="submit">'+(v?'Update RSVP':'RSVP')+'</button>'+(v?cal('event',e.id)+'<button class="btn danger" type="button" data-act="rsvp-cancel" data-id="'+v.id+'">Cancel RSVP</button>':'')+'</div></form></div>'}).join('')+'</div>';
  };

  V.guests=function(){
    var s=O.load(),mine=s.guests.filter(function(g){return g.member===ME&&g.date>=O.today()}).sort(function(a,b){return a.date<b.date?-1:1});
    return head('Guests','Guests &amp; <em>the Gate</em>',E(C.copy.guests))+
    '<div class="grid g2"><div class="panel"><h2>Register a guest</h2><p class="sub">Their name goes on the gate list for that day.</p><form data-form="guest"><div class="fgrid">'+
      '<div class="full"><label class="f" for="gn">Guest name</label><input class="in" id="gn" name="name" required autocomplete="off"></div>'+
      '<div><label class="f" for="gd">Date</label><select class="in" id="gd" name="date">'+opt(days(14),O.today())+'</select></div>'+
      '<div><label class="f" for="gr">Visiting for</label><select class="in" id="gr" name="reason">'+opt(C.guestReasons,C.guestReasons[0])+'</select></div>'+
    '</div><button class="btn brass" type="submit">Add to gate list</button></form><p class="note">Golf guests are charged a '+O.money(F.guest).replace('.00','')+' guest fee when you book the tee time.</p></div>'+
    '<div class="panel"><h2>Your guests</h2><p class="sub">Expected at the gate.</p>'+
      (mine.length?'<ul class="list">'+mine.map(function(g){return '<li><div class="what"><b>'+E(g.name)+'</b><small>'+O.nice(g.date)+' · '+E(g.reason)+'</small></div><div class="row">'+(g.arrived?'<span class="pill ok">Arrived</span>':'<button class="btn sm danger" type="button" data-act="guest-cancel" data-id="'+g.id+'">Remove</button>')+'</div></li>'}).join('')+'</ul>':'<p class="empty">No guests expected.</p>')+'</div></div>';
  };

  V.concierge=function(){
    var s=O.load(),mine=s.requests.filter(function(q){return q.member===ME}).sort(function(a,b){return b.when-a.when});
    return head('Concierge','Ask <em>the club</em>','A lesson, a cake in the kitchen, your clubs cleaned by Saturday. A person reads every one of these.')+
    '<div class="grid g2"><div class="panel"><h2>New request</h2><p class="sub">Usually answered within the hour.</p><form data-form="request">'+
      '<label class="f" for="qt">About</label><select class="in" id="qt" name="topic">'+opt(C.concierge,C.concierge[0])+'</select>'+
      '<label class="f" for="qb">Your request</label><textarea class="in" id="qb" name="body" required></textarea>'+
      '<button class="btn brass" type="submit">Send to the concierge</button></form></div>'+
    '<div class="panel"><h2>Your requests</h2><p class="sub">Replies appear here.</p>'+
      (mine.length?'<ul class="list">'+mine.map(function(q){return '<li style="flex-direction:column;align-items:stretch;gap:6px"><div class="row" style="justify-content:space-between"><div class="what"><b>'+E(q.topic)+'</b><small>'+O.ago(q.when)+'</small></div>'+pill(q.status)+'</div><div>'+E(q.body)+'</div>'+(q.reply?'<div class="thread"><small>The club replied</small>'+E(q.reply)+'</div>':'')+'</li>'}).join('')+'</ul>':'<p class="empty">No requests yet.</p>')+'</div></div>';
  };

  V.inbox=function(){
    var s=O.load(),ms=s.messages;
    return head('Messages','Your <em>Confirmations</em>','Every booking is confirmed by email and by text. These are the messages the club would send.')+
      (ms.length?'<div class="msgs">'+ms.map(function(m){return m.ch==='Text'
        ?'<div class="msg text'+(m.read?'':' new')+'"><small>Text message · '+O.ago(m.when)+'</small><div class="bubble"><b>'+E(m.subject)+'</b>'+E(m.body)+'</div></div>'
        :'<div class="msg mail'+(m.read?'':' new')+'"><small>Email · '+O.ago(m.when)+'</small><div class="letter"><span>From '+E(C.full)+'</span><b>'+E(m.subject)+'</b><p>'+E(m.body)+'</p></div></div>'}).join('')+'</div>':'<div class="panel"><p class="empty">No messages yet. Book something and the confirmation appears here.</p></div>');
  };

  function qr(){var r=17,h='';for(var y=0;y<21;y++)for(var x=0;x<21;x++){var f=function(a,b){return x>=a&&x<a+7&&y>=b&&y<b+7},on;if(f(0,0)||f(14,0)||f(0,14)){var lx=x>=14?x-14:x,ly=y>=14?y-14:y;on=lx===0||lx===6||ly===0||ly===6||(lx>=2&&lx<=4&&ly>=2&&ly<=4)}else{r=(r*1103515245+12345)&0x7fffffff;on=(r>>8)%5<2}h+='<i'+(on?'':' class="o"')+'></i>'}return h}
  V.account=function(){
    var s=O.load(),rows=s.charges.slice().sort(function(a,b){return a.date<b.date?1:-1}),spent=Math.min(C.diningMin,432);
    return head('Account','Card &amp; <em>Account</em>','Your member card, your household, and the charges to account No. '+O.ME.no+'.')+
      '<div class="grid g2" style="margin-bottom:18px"><div class="panel"><h2>Member card</h2><p class="sub">Tap the card to show your code at the gate or the counter.</p><div class="mcard-wrap"><button type="button" class="mcard'+(ui.flip?' flip':'')+'" data-act="flip" aria-label="Member card for '+E(ME)+', number '+O.ME.no+'. Tap to turn over.">'+
        '<span class="face"><span class="row" style="justify-content:space-between;align-items:flex-start"><span class="mk">'+O.MARK+'</span><small>'+E(TIER)+'</small></span><span class="nm">'+E(ME)+'</span><span class="row" style="justify-content:space-between"><span class="no">No. '+O.ME.no+'</span><small>Since '+O.ME.since+'</small></span></span>'+
        '<span class="face back"><span class="qr" aria-hidden="true">'+qr()+'</span><small>Show at the gate</small></span></button></div></div>'+
      '<div class="panel dark"><h2>Balance due</h2><p class="sub">Current statement</p><p style="font-family:var(--display);font-size:68px;line-height:1;margin:6px 0 20px;color:var(--brass)" data-count="'+balance().toFixed(2)+'" data-pre="$">$0.00</p><div class="row"><button class="btn brass" type="button" data-act="pay">Pay balance</button><button class="btn line" type="button" data-act="statement">Download statement</button></div><p class="note" style="color:var(--mist)">Dining minimum this quarter</p><div class="meter"><i style="width:'+Math.round(spent/C.diningMin*100)+'%"></i></div><p class="note" style="color:var(--mist);margin-top:4px">'+O.money(spent).replace('.00','')+' of '+O.money(C.diningMin).replace('.00','')+'</p></div></div>'+
      '<div class="grid g2" style="margin-bottom:18px"><div class="panel"><h2>Your household</h2><p class="sub">Everyone on member No. '+O.ME.no+' can be booked from this account.</p><ul class="list">'+C.household.map(function(h){return '<li><div class="what"><b>'+E(h.name)+'</b><small>'+E(h.role)+'</small></div><span class="pill '+(h.name===ME?'dk':'ok')+'">'+(h.name===ME?'Account holder':'Can be booked')+'</span></li>'}).join('')+'</ul><p class="note">'+E(TIERS)+' can book tee times '+WIN+' days ahead.</p></div>'+
      '<div class="panel"><h2>Keep the club on your phone</h2><p class="sub">The portal installs like an app, with its own icon and no browser bar.</p><ol class="steps"><li><b>iPhone:</b> tap Share, then Add to Home Screen.</li><li><b>Android:</b> tap the menu, then Install app.</li><li>Open it from your home screen and stay signed in.</li></ol></div></div>'+
      '<div class="panel"><h2>Charges</h2><p class="sub">Shop orders, guest fees and cart fees appear here as soon as they are booked.</p><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Date</th><th>Description</th><th class="num">Amount</th></tr></thead><tbody>'+
      rows.map(function(c){return '<tr><td style="white-space:nowrap">'+O.nice(c.date)+'</td><td>'+E(c.desc)+'</td><td class="num">'+O.money(c.amt)+'</td></tr>'}).join('')+'</tbody></table></div></div>';
  };

  /* ---------- sign in ---------- */
  function gate(){
    var el=$('login');if(O.signedIn('member')){el.hidden=true;return true}
    el.hidden=false;
    el.innerHTML='<div class="login-card"><div class="lmark">'+O.MARK+'</div><p class="eyebrow">'+E(C.full)+'</p><h1>Member <em>sign in</em></h1><form data-form="login"><label class="f" for="lu">Member number</label><input class="in" id="lu" value="'+O.ME.no+'" autocomplete="username" inputmode="numeric"><label class="f" for="lp">Password</label><input class="in" id="lp" type="password" value="clubhouse" autocomplete="current-password"><button class="btn brass" type="submit">Sign in</button><button class="btn line" type="button" data-act="faceid"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 10v1M15 10v1M12 10v3h-1M9 15c1.5 1.4 4.500 1.400 6 0"/></svg>Sign in with Face ID</button></form><p class="note">Demonstration: any member number and password will sign you in.</p><p class="note"><a href="'+C.site+'">Back to the club website</a></p></div>';
    return false;
  }
  function enter(){O.sign('member',true);$('login').classList.add('out');setTimeout(function(){$('login').hidden=true;$('login').classList.remove('out')},500);render()}

  /* ---------- render ---------- */
  var main=$('view');
  function render(keep){
    var r=route();chrome(r);main.innerHTML=V[r]();$('more').classList.remove('open');
    if(r==='tee'&&$('tp'))teeNames();if(r==='scores'&&ui.scoreTab==='racquets')xMatch();
    if(r==='inbox'){var s=O.load(),ch=false;s.messages.forEach(function(m){if(!m.read){m.read=true;ch=true}});if(ch){O.save();setTimeout(function(){chrome(r)},0)}}
    main.classList.remove('enter');
    if(!keep){void main.offsetWidth;if(!O.STATIC)main.classList.add('enter');window.scrollTo(0,0);O.countUp(main)}else O.settle(main);
  }
  function xMatch(){var m=$('xm');if(m)$('xOther').hidden=m.value!=='other'}
  function data(form){var o={};[].forEach.call(form.elements,function(el){if(el.name)o[el.name]=el.value.trim()});return o}
  function done(msg){O.save();render(true);O.toast(msg);O.burst()}
  function whoTag(w){return w&&w!==ME?' for '+w:''}

  document.addEventListener('click',function(e){
    var el=e.target.closest('[data-act]');if(!el)return;var a=el.dataset.act,s=O.load();
    if(a==='more'){$('more').classList.toggle('open');return}
    if(a==='signout'){e.preventDefault();O.sign('member',false);location.hash='';gate();return}
    if(a==='faceid'){el.classList.add('scan');setTimeout(enter,950);return}
    if(a==='reset'){O.reset();ui.bag=[];ui.teeSel=ui.ctSel=ui.waitSel=null;render();O.toast('Demo reset to the starting sample data.');return}
    if(a==='day'){if(route()==='tee'){ui.teeDate=el.dataset.date;ui.teeSel=ui.waitSel=null}else{ui.ctDate=el.dataset.date;ui.ctSel=null}render(true);return}
    if(a==='course'){ui.course=el.dataset.c;ui.teeSel=ui.waitSel=null;render(true);return}
    if(a==='ct-group'){ui.ctGroup=el.dataset.g;ui.ctSel=null;render(true);return}
    if(a==='tee-pick'||a==='wait-pick'){ui.teeSel=a==='tee-pick'?el.dataset.time:null;ui.waitSel=a==='wait-pick'?el.dataset.time:null;render(true);var f=$('teeForm');if(f)f.scrollIntoView({block:'center',behavior:'smooth'});return}
    if(a==='tee-clear'){ui.teeSel=ui.waitSel=null;render(true);return}
    if(a==='wait-leave'){s.waitlist=s.waitlist.filter(function(x){return x.id!==el.dataset.id});O.save();render(true);O.toast('You are off the waitlist.');return}
    if(a==='tee-cancel'){var b=s.tee.filter(function(x){return x.id===el.dataset.id})[0];if(!b)return;var late=O.hoursUntil(b.date,b.time)<C.cancelHours;
      if(late&&!el.dataset.sure){ui.lateId=b.id;render(true);return}
      ui.lateId=null;s.tee=s.tee.filter(function(x){return x.id!==b.id});s.guests=s.guests.filter(function(g){return g.tee!==b.id});s.charges=s.charges.filter(function(c){return c.ref!==b.id});
      if(late)s.charges.push({id:O.uid(),date:O.today(),desc:'Late cancellation, '+O.t12(b.time)+' tee time',amt:F.lateCancel});
      O.log(ME+' cancelled the '+O.t12(b.time)+' tee time on '+O.long(b.date)+(late?' (late, fee charged)':''));
      var w=O.promote(b.date,b.time,b.course);O.save();render(true);O.toast('Tee time cancelled.'+(late?' A '+O.money(F.lateCancel).replace('.00','')+' late fee was charged.':'')+(w?' '+w.member+' was booked from the waitlist.':''));return}
    if(a==='dine-cancel'){s.dining=s.dining.filter(function(x){return x.id!==el.dataset.id});O.log(ME+' cancelled a dining reservation');O.save();render(true);O.toast('Reservation cancelled.');return}
    if(a==='ct-pick'){ui.ctSel={hour:+el.dataset.hour,court:+el.dataset.court};render(true);var c=$('ctForm');if(c)c.scrollIntoView({block:'center',behavior:'smooth'});return}
    if(a==='ct-clear'){ui.ctSel=null;render(true);return}
    if(a==='ct-cancel'){s.courts=s.courts.filter(function(x){return x.id!==el.dataset.id});O.log(ME+' cancelled a court reservation');O.save();render(true);O.toast('Court released.');return}
    if(a==='score-tab'){ui.scoreTab=el.dataset.tab;if(route()==='scores')render(true);return}
    if(a==='score-match'){ui.scoreTab='racquets';ui.scoreMatch=el.dataset.id;return}
    if(a==='round-fill'){var smp=O.PAR.map(function(p,i){return p+(i%3===0?1:i%7===3?1:0)});[].forEach.call(document.querySelectorAll('[data-hole]'),function(i,n){i.value=smp[n]});$('rp').value=31;roundCalc();return}
    if(a==='shop-tab'){ui.shopTab=el.dataset.tab;render(true);return}
    if(a==='bag-add'){var p=O.products().filter(function(x){return x.sku===el.dataset.sku})[0],z=$('sz-'+p.sku),size=z?z.value:'';
      var ex=ui.bag.filter(function(i){return i.sku===p.sku&&i.size===size})[0];if(ex)ex.qty++;else ui.bag.push({sku:p.sku,name:p.brand+' '+p.name,price:p.price,size:size,qty:1,shop:p.shop});render(true);O.toast(p.name+' added to your bag.');return}
    if(a==='bag-qty'){var it=ui.bag[+el.dataset.n];it.qty+=+el.dataset.d;if(it.qty<1)ui.bag.splice(+el.dataset.n,1);render(true);return}
    if(a==='order'){var tot=ui.bag.reduce(function(x,i){return x+i.qty*i.price},0),sh={};ui.bag.forEach(function(i){sh[i.shop]=1});var where=Object.keys(sh).join(' and ');
      s.orders.unshift({id:O.uid(),when:O.today(),member:ME,items:ui.bag.map(function(i){return {name:i.name+(i.size?' ('+i.size+')':''),qty:i.qty,price:i.price}}),total:tot,pickup:where,status:'New'});
      s.charges.push({id:O.uid(),date:O.today(),desc:where+', order for pickup',amt:tot});O.log(ME+' placed a '+where+' order for pickup ('+O.money(tot)+')');
      O.notify('Email','Order received: '+where,ui.bag.map(function(i){return i.qty+' × '+i.name}).join(', ')+'. Total '+O.money(tot)+', charged to your account. We will text you when it is ready.');ui.bag=[];done('Order placed. We will text you when it is ready.');return}
    if(a==='rsvp-cancel'){s.rsvps=s.rsvps.filter(function(x){return x.id!==el.dataset.id});O.save();render(true);O.toast('RSVP cancelled.');return}
    if(a==='guest-cancel'){s.guests=s.guests.filter(function(x){return x.id!==el.dataset.id});O.save();render(true);O.toast('Guest removed from the gate list.');return}
    if(a==='flip'){ui.flip=!ui.flip;el.classList.toggle('flip',ui.flip);return}
    if(a==='ics'){var id=el.dataset.id,k=el.dataset.kind,x;
      if(k==='tee'&&(x=s.tee.filter(function(q){return q.id===id})[0]))O.ics({title:'Golf at '+C.name,date:x.date,time:x.time,mins:x.holes===9?130:260,where:x.course+', '+C.full,note:x.players.join(', ')+'. '+x.cart+'.'});
      if(k==='dining'&&(x=s.dining.filter(function(q){return q.id===id})[0]))O.ics({title:'Table at '+x.venue,date:x.date,time:x.time,mins:120,where:x.venue+', '+C.full,note:'Party of '+x.party+'.'});
      if(k==='court'&&(x=s.courts.filter(function(q){return q.id===id})[0]))O.ics({title:x.kind+' at '+C.name,date:x.date,time:('0'+x.hour).slice(-2)+':00',mins:60,where:'Court '+x.court+', '+C.full,note:x.opp?'With '+x.opp:''});
      if(k==='event'&&(x=O.events().filter(function(q){return q.id===id})[0]))O.ics({title:x.name,date:x.date,time:x.time,mins:180,where:x.where+', '+C.full});
      O.toast('Calendar file downloaded.');return}
    if(a==='pay'){O.toast('In the finished portal this opens secure card or bank payment.');return}
    if(a==='statement'){O.csv('statement-'+O.ME.no+'.csv',[['Date','Description','Amount']].concat(s.charges.map(function(c){return [c.date,c.desc,c.amt.toFixed(2)]})));O.toast('Statement downloaded.');return}
  });
  document.addEventListener('change',function(e){var c=e.target.dataset.change;if(c==='tee-n')teeNames();if(c==='tee-fee')teeFeeShow();if(c==='round-calc')roundCalc();if(c==='x-match')xMatch()});
  document.addEventListener('input',function(e){if(e.target.hasAttribute('data-hole'))roundCalc()});

  document.addEventListener('submit',function(e){
    var f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();var k=f.dataset.form,d=data(f),s=O.load();
    if(k==='login'){enter();return}
    if(k==='tee'){
      var slot=O.teeSlot(ui.teeDate,ui.teeSel,ui.course),n=Math.min(+d.n,slot.open),pl=[d.who],id=O.uid(),g=0;
      for(var i=2;i<=n;i++){var nm=d['pn'+i]||('Player '+i),isG=d['pt'+i]==='Guest';if(isG)g++;pl.push((isG?'Guest: ':'')+nm);if(isG&&d['pn'+i])s.guests.push({id:O.uid(),tee:id,date:ui.teeDate,name:nm,reason:'Golf, '+O.t12(ui.teeSel)+' tee time',member:ME,arrived:false})}
      var fee=teeFee(n,g,d.cart);
      s.tee.push({id:id,date:ui.teeDate,time:ui.teeSel,course:ui.course,players:pl,who:d.who,holes:+d.holes,cart:d.cart,fee:fee,member:ME});
      if(fee)s.charges.push({id:O.uid(),ref:id,date:O.today(),desc:'Golf, '+O.long(ui.teeDate)+': '+[g?g+' guest fee'+(g>1?'s':''):'',d.cart==='Cart'?n+' cart'+(n>1?'s':''):'',d.cart==='Caddie'?'caddie':''].filter(Boolean).join(', '),amt:fee});
      O.log(ME+' booked '+O.t12(ui.teeSel)+(O.COURSES.length>1?' on the '+ui.course:'')+', '+O.long(ui.teeDate)+', for '+n+' player'+(n>1?'s':'')+whoTag(d.who)+(d.cart==='Caddie'?' with a caddie':''));
      var txt=O.long(ui.teeDate)+' at '+O.t12(ui.teeSel);
      O.notify('Email','Tee time confirmed: '+txt,(O.COURSES.length>1?ui.course+'. ':'')+pl.join(', ')+'. '+d.holes+' holes, '+d.cart.toLowerCase()+'. '+(fee?O.money(fee)+' will be charged to your account. ':'')+'Free cancellation until '+C.cancelHours+' hours before.');
      O.notify('Text',C.name,'You are booked: '+txt+', '+n+' player'+(n>1?'s':'')+'. Reply C to cancel.');
      ui.teeSel=null;done('Tee time confirmed: '+txt+'.');
    }
    if(k==='wait'){s.waitlist.push({id:O.uid(),date:ui.teeDate,time:ui.waitSel,course:ui.course,member:ME,players:+d.n});O.log(ME+' joined the waitlist for '+O.t12(ui.waitSel)+' on '+O.long(ui.teeDate));O.notify('Text',C.name,'You are on the waitlist for '+O.t12(ui.waitSel)+' on '+O.long(ui.teeDate)+'. We will book you automatically if a spot opens.');var wt=ui.waitSel;ui.waitSel=null;done('You are on the waitlist for '+O.t12(wt)+'.')}
    if(k==='dining'){var note=[d.seat!==C.seating[0]?d.seat:'',d.note].filter(Boolean).join(' · ');s.dining.push({id:O.uid(),date:d.date,time:d.time,venue:d.venue,party:+d.party,note:note,who:d.who,member:ME,status:'Confirmed'});O.log(ME+' reserved '+d.venue+' for '+d.party+' on '+O.long(d.date)+' at '+O.t12(d.time)+whoTag(d.who));
      O.notify('Email','Table confirmed: '+d.venue,O.long(d.date)+' at '+O.t12(d.time)+', party of '+d.party+'.'+(note?' Noted: '+note+'.':''));O.notify('Text',C.name,'Your table at '+d.venue+' is confirmed for '+O.nice(d.date).toLowerCase()+' at '+O.t12(d.time)+', party of '+d.party+'.');done('Table reserved at '+d.venue+'.')}
    if(k==='court'){var cs=ui.ctSel;s.courts.push({id:O.uid(),date:ui.ctDate,hour:cs.hour,court:cs.court,kind:d.kind,opp:d.opp,who:d.who,member:ME,score:null,status:''});O.log(ME+' reserved Court '+cs.court+' ('+O.courtType(cs.court)+') on '+O.long(ui.ctDate)+' at '+O.hr12(cs.hour)+whoTag(d.who));
      O.notify('Text',C.name,'Court '+cs.court+' is yours on '+O.long(ui.ctDate)+' at '+O.hr12(cs.hour)+'.');ui.ctSel=null;done('Court '+cs.court+' reserved for '+O.hr12(cs.hour)+'.')}
    if(k==='round'){var r=roundCalc();if(!r){O.toast('Please enter a score for all 18 holes.');return}
      s.rounds.push({id:O.uid(),date:d.date,course:O.COURSES[0],tee:d.tee,total:r.total,putts:+d.putts||0,diff:r.diff,member:ME,status:'Pending'});O.log(ME+' posted a golf score of '+r.total+' ('+d.tee+' tees)');done('Score of '+r.total+' posted. Sent to the Golf Shop for verification.')}
    if(k==='result'){var sets=[];[1,2,3].forEach(function(n){if(d['a'+n]!==''&&d['b'+n]!=='')sets.push([+d['a'+n],+d['b'+n]])});if(sets.length<1){O.toast('Please enter at least one game score.');return}
      var m=s.courts.filter(function(b){return b.id===d.match})[0],st=sets.map(function(p){return p[0]+'–'+p[1]}).join(', '),sport=m?(/pickle/i.test(O.courtType(m.court))?'Pickleball':C.sports[0]):d.sport;
      if(m){m.score=st;m.status='Pending'}
      s.results.push({id:O.uid(),court:m?m.id:null,date:m?m.date:O.today(),sport:sport,kind:m?m.kind:d.kind,member:ME,opp:m?(m.opp||'Opponent'):(d.opp||'Opponent'),sets:sets,status:'Pending'});ui.scoreMatch='';O.log(ME+' reported a '+sport.toLowerCase()+' result: '+st);done('Result submitted for verification.')}
    if(k==='swim'){var sec=parseFloat(d.sec);if(isNaN(sec)){O.toast('Please enter the seconds.');return}var tm=(+d.min||0)+':'+(sec<10?'0':'')+sec.toFixed(2);s.swims.push({id:O.uid(),date:d.date,event:d.event,time:tm,member:ME});O.log(ME+' logged a '+d.event+' in '+tm);done(d.event+' logged at '+tm+'.')}
    if(k==='rsvp'){var id2=f.dataset.id,v=s.rsvps.filter(function(x){return x.event===id2&&x.member===ME})[0],ev=O.events().filter(function(x){return x.id===id2})[0];
      if(v){v.adults=+d.adults;v.kids=+d.kids}else s.rsvps.push({id:O.uid(),event:id2,adults:+d.adults,kids:+d.kids,member:ME});O.log(ME+' RSVP\'d to '+ev.name+' ('+d.adults+' adults, '+d.kids+' children)');
      O.notify('Email','You are on the list: '+ev.name,O.long(ev.date)+' at '+O.t12(ev.time)+', '+ev.where+'. '+d.adults+' adults'+(+d.kids?', '+d.kids+' children':'')+'.');done('You are on the list for '+ev.name+'.')}
    if(k==='guest'){if(!d.name){O.toast('Please enter your guest\'s name.');return}s.guests.push({id:O.uid(),date:d.date,name:d.name,reason:d.reason,member:ME,arrived:false});O.log(ME+' added '+d.name+' to the gate list for '+O.long(d.date));done(d.name+' is on the gate list for '+O.nice(d.date).toLowerCase()+'.')}
    if(k==='request'){if(!d.body){O.toast('Please tell us what you need.');return}s.requests.push({id:O.uid(),when:Date.now(),topic:d.topic,body:d.body,member:ME,status:'Open',reply:''});O.log(ME+' sent a concierge request ('+d.topic+')');done('Sent. The concierge will reply here.')}
  });

  window.addEventListener('hashchange',function(){if(O.signedIn('member'))render()});
  /* the other portal changed something: redraw, unless someone is mid-way through a form here */
  var pend=false;function busy(){var a=document.activeElement;return a&&main.contains(a)&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)}
  O.onChange(function(){if(!O.signedIn('member'))return;if(busy()){pend=true;return}render(true)});
  main.addEventListener('focusout',function(){if(pend)setTimeout(function(){if(pend&&!busy()){pend=false;render(true)}},60)});
  if(gate())render();
})();
