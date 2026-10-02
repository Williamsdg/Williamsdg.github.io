/* Noccalula Falls Park — concept redesign by Williams Digital */
(function(){
  var TIX_XMAS='https://tickets.eventhub.net/e/christmas-at-the-falls';
  var root=document.documentElement;
  var OPEN=new Date(2026,10,13), CLOSE=new Date(2027,0,2);
  var CLOSED_XMAS=['2026-11-16','2026-11-17','2026-11-18','2026-11-19','2026-12-24','2026-12-25'];
  function key(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function today(){var t=new Date();t.setHours(0,0,0,0);return t}
  function isXmasNight(d){return d>=OPEN&&d<=CLOSE&&CLOSED_XMAS.indexOf(key(d))<0}

  /* season switch */
  function setSeason(s,save){
    if(root.dataset.lock){
      if(save&&s==='day'){location.href='index.html?season=day';return}
      s=root.dataset.season;
    }
    root.dataset.season=s;
    document.querySelectorAll('.season button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.s===s))});
    if(save){try{localStorage.setItem('nf_season',s)}catch(e){}}
  }
  document.querySelectorAll('.season button').forEach(function(b){
    b.addEventListener('click',function(){setSeason(b.dataset.s,true)});
  });
  setSeason(root.dataset.season||'day',false);

  /* drawer */
  var drawer=document.querySelector('.drawer'),mb=document.querySelector('.menu-btn');
  function openD(o){drawer.classList.toggle('open',o);mb.setAttribute('aria-expanded',String(o));drawer.setAttribute('aria-hidden',String(!o));if(o)drawer.querySelector('.close').focus();else mb.focus()}
  if(drawer&&mb){
    mb.addEventListener('click',function(){openD(true)});
    drawer.querySelector('.close').addEventListener('click',function(){openD(false)});
    drawer.querySelector('.scrim').addEventListener('click',function(){openD(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&drawer.classList.contains('open'))openD(false)});
  }

  /* today at the park */
  function parkStatus(d){
    var m=d.getMonth(),day=d.getDay(),wk=(day===0||day===6);
    if(isXmasNight(d))return{open:true,v:'Christmas at the Falls tonight',s:'Arrive 4–8 PM · park closes 10 PM · tickets online only'};
    if(d>=OPEN&&d<=CLOSE)return{open:false,v:'Closed tonight',s:'Christmas at the Falls is dark tonight. Next night: '+nextNight(d)};
    var start=new Date(d.getFullYear(),1,16),end=new Date(d.getFullYear(),9,24);
    if(d>=start&&d<=end){
      if((m===5||m===6)&&wk)return{open:true,v:'Open today 9 AM – 7 PM',s:'Summer weekend hours · last ticket 6:30 PM'};
      return{open:true,v:'Open today 9 AM – 5 PM',s:'Last ticket sold 4:30 PM · trails, train, animals & gardens'};
    }
    if(d<OPEN&&d>end)return{open:false,v:'Between seasons',s:'Christmas at the Falls opens Nov. 13 — tickets on sale now'};
    return{open:false,v:'Closed for the season',s:'The park reopens Feb. 16'};
  }
  function fmt(d){return d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}
  function nextNight(d){var x=new Date(d);for(var i=0;i<60;i++){x.setDate(x.getDate()+1);if(isXmasNight(x))return fmt(x)}return'Nov. 13'}
  var t=document.querySelector('[data-today]');
  if(t){var st=parkStatus(today());
    t.querySelector('.v-t').textContent=st.v;t.querySelector('.s').textContent=st.s;
    t.querySelector('.dot').classList.toggle('off',!st.open);
    t.querySelector('.d').textContent=today().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  }

  /* countdown to opening night */
  document.querySelectorAll('[data-countdown]').forEach(function(el){
    function tick(){
      var now=new Date(),target=new Date(2026,10,13,16,0,0),ms=target-now;
      if(ms<=0){el.innerHTML='<div><b>Open</b><small>now</small></div>';return}
      var d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),mi=Math.floor(ms%36e5/6e4);
      el.innerHTML='<div><b>'+d+'</b><small>days</small></div><div><b>'+h+'</b><small>hours</small></div><div><b>'+mi+'</b><small>min</small></div>';
    }
    tick();setInterval(tick,30000);
  });

  /* ticket builder */
  var cal=document.querySelector('[data-cal]');
  if(cal){
    var months=[[2026,10],[2026,11],[2027,0]],cur=0,sel=null,slot=null,qa=2,qk=1,qt=0,qx=0;
    var PRICE=12,XP=15;
    var mbtns=document.querySelectorAll('.months button');
    mbtns.forEach(function(b,i){b.addEventListener('click',function(){cur=i;draw()})});
    function draw(){
      mbtns.forEach(function(b,i){b.setAttribute('aria-pressed',String(i===cur))});
      var y=months[cur][0],m=months[cur][1],first=new Date(y,m,1),n=new Date(y,m+1,0).getDate(),h='';
      ['S','M','T','W','T','F','S'].forEach(function(x){h+='<div class="dow" aria-hidden="true">'+x+'</div>'});
      for(var i=0;i<first.getDay();i++)h+='<div class="pad"></div>';
      for(var dd=1;dd<=n;dd++){
        var d=new Date(y,m,dd),ok=isXmasNight(d)&&d>=today(),k=key(d),wk=(d.getDay()===5||d.getDay()===6);
        h+='<button type="button" data-k="'+k+'" class="'+(wk&&ok?'wk':'')+'"'+(ok?'':' disabled')+' aria-pressed="'+(sel===k)+'" aria-label="'+d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})+(ok?'':' — closed')+'">'+dd+'</button>';
      }
      cal.innerHTML=h;
      cal.querySelectorAll('button:not([disabled])').forEach(function(b){b.addEventListener('click',function(){sel=b.dataset.k;draw();sum();var s=document.getElementById('slots');if(s&&window.innerWidth<860)s.scrollIntoView({behavior:'smooth',block:'center'})})});
    }
    document.querySelectorAll('.slots button').forEach(function(b){b.addEventListener('click',function(){slot=b.dataset.t;document.querySelectorAll('.slots button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});sum()})});
    document.querySelectorAll('[data-q]').forEach(function(w){
      var o=w.querySelector('output'),k=w.dataset.q;
      w.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){
        var dlt=+b.dataset.d;
        if(k==='a')qa=Math.max(0,Math.min(20,qa+dlt));if(k==='k')qk=Math.max(0,Math.min(20,qk+dlt));if(k==='t')qt=Math.max(0,Math.min(10,qt+dlt));if(k==='x')qx=Math.max(0,Math.min(5,qx+dlt));
        o.textContent={a:qa,k:qk,t:qt,x:qx}[k];sum();
      })});
    });
    function sum(){
      var s=document.querySelector('.sum');
      var paid=qa+qk,tot=paid*PRICE+qx*XP;
      s.querySelector('[data-night]').textContent=sel?fmt(new Date(sel+'T12:00:00')):'Pick a night';
      s.querySelector('[data-slot]').textContent=slot||'Pick a time';
      s.querySelector('[data-guests]').textContent=paid+' × $'+PRICE+(qt?' + '+qt+' free (3 & under)':'');
      s.querySelector('[data-xp]').textContent=qx?qx+' × $'+XP:'—';
      s.querySelector('[data-total]').textContent='$'+tot;
      var go=s.querySelector('.btn'),ready=sel&&slot&&(paid+qt)>0;
      go.setAttribute('aria-disabled',String(!ready));
      go.style.opacity=ready?1:.55;
      s.querySelector('[data-hint]').textContent=ready?'Next you’ll confirm this night and time on the park’s secure EventHub checkout.':'Choose a night and an arrival time to continue.';
    }
    var go=document.querySelector('.sum .btn');
    go.addEventListener('click',function(e){if(go.getAttribute('aria-disabled')==='true'){e.preventDefault();document.querySelector('.panel-b').scrollIntoView({behavior:'smooth'})}});
    go.href=TIX_XMAS;
    draw();sum();
  }

  /* bottom bar: hide while a hero or the ticket picker is on screen */
  var docks=document.querySelectorAll('.dock'),seen=new Set();
  if(docks.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?seen.add(e.target):seen.delete(e.target)});
      docks.forEach(function(d){d.classList.toggle('away',seen.size>0)})});
    document.querySelectorAll('.hero,#tickets,.ftr').forEach(function(el){io.observe(el)});
  }

  /* rental finder */
  var rng=document.querySelector('[data-guests-range]');
  if(rng){
    var out=document.querySelector('[data-guests-out]'),cnt=document.querySelector('[data-fit]');
    function f(){var g=+rng.value,n=0;out.textContent=g;
      document.querySelectorAll('.venue').forEach(function(v){var ok=+v.dataset.cap>=g;v.classList.toggle('off',!ok);if(ok)n++});
      cnt.textContent=n+(n===1?' space fits':' spaces fit')+' a group of '+g+'.';}
    rng.addEventListener('input',f);f();
  }
  var form=document.querySelector('form.inq');
  if(form)form.addEventListener('submit',function(e){e.preventDefault();form.nextElementSibling.classList.add('show');form.nextElementSibling.focus()});
})();
