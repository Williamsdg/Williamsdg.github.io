/* Mastermind19 concept — shared behaviour. No tracking, no network. */
(function(){
  // mobile drawer
  var btn=document.querySelector('.menu-btn'), drawer=document.getElementById('drawer');
  if(btn&&drawer){btn.addEventListener('click',function(){var open=drawer.classList.toggle('open');btn.setAttribute('aria-expanded',open?'true':'false');btn.textContent=open?'Close':'Menu';});}

  // Engraved greens-book plates. One generator, five holes. Shared defs (gradient, stipple, hatch) injected once.
  document.body.insertAdjacentHTML('afterbegin','<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>'+
    '<linearGradient id="m19-fw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8A95E" stop-opacity=".17"/><stop offset="1" stop-color="#C8A95E" stop-opacity=".05"/></linearGradient>'+
    '<linearGradient id="m19-fwL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#155C41" stop-opacity=".18"/><stop offset="1" stop-color="#155C41" stop-opacity=".06"/></linearGradient>'+
    '<pattern id="m19-sand" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#E2CB8E" opacity=".75"/><circle cx="3" cy="3" r=".6" fill="#E2CB8E" opacity=".45"/></pattern>'+
    '<pattern id="m19-sandL" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#6E5420" opacity=".45"/><circle cx="3" cy="3" r=".6" fill="#6E5420" opacity=".25"/></pattern>'+
    '<pattern id="m19-water" width="6" height="4" patternUnits="userSpaceOnUse"><line x1="0" y1="2" x2="6" y2="2" stroke="#8FA398" stroke-width=".6" opacity=".6"/></pattern>'+
    '</defs></svg>');
  function hole(o){
    var s='<svg class="yd" viewBox="0 0 '+o.w+' '+o.h+'" role="img" aria-label="'+o.aria+'">';
    s+='<defs><clipPath id="'+o.id+'-clip"><path d="'+o.fw+'"/></clipPath></defs>';
    if(o.plate){ s+='<rect class="plate" x="10" y="10" width="'+(o.w-20)+'" height="'+(o.h-20)+'"/><rect class="frame" x="10" y="10" width="'+(o.w-20)+'" height="'+(o.h-20)+'"/><rect class="frame2" x="18" y="18" width="'+(o.w-36)+'" height="'+(o.h-36)+'"/>'; }
    else { s+='<rect class="frame" x=".5" y=".5" width="'+(o.w-1)+'" height="'+(o.h-1)+'"/>'; }
    s+='<g class="tr">'+o.trees.map(function(t){ var r=t[2]*.58; return '<circle cx="'+t[0]+'" cy="'+t[1]+'" r="'+t[2]+'" pathLength="1"/><path class="tri" d="M'+(t[0]-r).toFixed(1)+' '+t[1]+' A'+r.toFixed(1)+' '+r.toFixed(1)+' 0 0 1 '+t[0]+' '+(t[1]-r).toFixed(1)+'" pathLength="1"/>'; }).join('')+'</g>';
    if(o.wt) s+='<path class="wt" d="'+o.wt+'" pathLength="1"/>';
    s+='<path class="fw" d="'+o.fw+'" pathLength="1"/>';
    s+='<g class="mow" clip-path="url(#'+o.id+'-clip)">'; for(var x=-o.h; x<o.w+o.h; x+=o.stripe){ s+='<line x1="'+x+'" y1="0" x2="'+(x+o.h)+'" y2="'+o.h+'"/>'; } s+='</g>';
    o.tees.forEach(function(t){ s+='<rect class="tee" x="'+(t[0]-t[2]/2)+'" y="'+(t[1]-t[3]/2)+'" width="'+t[2]+'" height="'+t[3]+'" rx="1.5" pathLength="1"/>'; });
    o.bk.forEach(function(d){ s+='<path class="bk" d="'+d+'" pathLength="1"/>'; });
    var g=o.green; s+='<ellipse class="gr" cx="'+g.cx+'" cy="'+g.cy+'" rx="'+g.rx+'" ry="'+g.ry+'" pathLength="1"/>';
    s+='<ellipse class="ct" cx="'+(g.cx-g.rx*.08).toFixed(1)+'" cy="'+(g.cy-g.ry*.1).toFixed(1)+'" rx="'+(g.rx*.72).toFixed(1)+'" ry="'+(g.ry*.7).toFixed(1)+'" pathLength="1"/><ellipse class="ct" cx="'+(g.cx-g.rx*.14).toFixed(1)+'" cy="'+(g.cy-g.ry*.16).toFixed(1)+'" rx="'+(g.rx*.44).toFixed(1)+'" ry="'+(g.ry*.42).toFixed(1)+'" pathLength="1"/>';
    s+='<polyline class="ln" points="'+o.line+'"/>';
    var p=g.pin, fl=o.flag; s+='<g class="pinset"><line class="pin" x1="'+p[0]+'" y1="'+p[1]+'" x2="'+p[0]+'" y2="'+(p[1]-fl)+'"/><path class="flag" d="M'+p[0]+' '+(p[1]-fl)+' l'+(fl*.42).toFixed(1)+' '+(fl*.14).toFixed(1)+' -'+(fl*.42).toFixed(1)+' '+(fl*.14).toFixed(1)+'z"/><circle class="cup" cx="'+p[0]+'" cy="'+p[1]+'" r="'+o.cup+'"/></g>';
    if(o.north){ var n=o.north; s+='<g class="north"><line x1="'+n[0]+'" y1="'+(n[1]+38)+'" x2="'+n[0]+'" y2="'+(n[1]+8)+'"/><path d="M'+n[0]+' '+n[1]+' l5 11 -5 -3 -5 3z"/><text x="'+n[0]+'" y="'+(n[1]-7)+'" text-anchor="middle" class="nlab">N</text></g>'; }
    if(o.label){ var L=o.label; s+='<text class="num" x="'+L.x+'" y="'+L.y+'">'+L.num+'</text><line class="lrule" x1="'+(L.x+5)+'" y1="'+(L.y+18)+'" x2="'+(L.x+78)+'" y2="'+(L.y+18)+'"/><text class="lbl" x="'+(L.x+5)+'" y="'+(L.y+44)+'">'+L.l1+'</text><text class="lbl2" x="'+(L.x+5)+'" y="'+(L.y+68)+'">'+L.l2+'</text>'; }
    return s+'</svg>';
  }
  var SM={w:220,h:300,stripe:14,flag:34,cup:1.8,plate:false};
  var H={
    19: hole({id:'h19',w:520,h:700,stripe:24,flag:46,cup:2.6,plate:true,aria:'Greens-book plate of a hole numbered nineteen, pin on the green',
      trees:[[86,612,14],[118,640,11],[62,648,9],[430,560,13],[458,590,10],[402,586,9],[96,300,12],[70,330,9],[446,250,12],[472,222,9],[420,214,8],[150,530,11],[178,564,8]],
      wt:'M300 470c40-10 90-6 120 18 18 14 14 40-6 50-30 14-80 10-110-10-22-16-26-50-4-58z',
      fw:'M224 652 C150 585 140 470 210 400 C268 342 300 300 282 232 C268 180 292 128 332 108 L372 128 C352 150 318 200 334 246 C352 298 322 356 290 420 C258 486 262 566 290 652 Z',
      bk:['M172 448c12-8 32-6 40 8 6 12-6 24-22 24-16 0-30-20-18-32z','M330 150c14-6 30 2 32 16 2 14-12 22-26 18-14-4-20-26-6-34z','M232 250c10-10 30-6 34 8 4 12-10 22-24 20-14-2-22-18-10-28z'],
      green:{cx:356,cy:112,rx:58,ry:40,pin:[352,118]}, tees:[[256,644,30,11],[262,662,22,8]], line:'258 644 292 430 352 118',
      north:[466,52], label:{num:'19',x:40,y:150,l1:'The 19th hole',l2:'where the real deals happen'}}),
    1: hole(Object.assign({},SM,{id:'h1',aria:'Hole one, a straight par three',trees:[[40,250,8],[26,268,6],[182,90,8],[196,110,6],[36,120,7]],
      fw:'M92 262c-10-50-6-100 8-150 6-22 20-30 30-16 12 18 10 60 4 100-4 30-6 70-20 74-12 4-18-2-22-8z',bk:['M60 120c8-6 20-2 22 8 2 8-8 14-16 12-10-2-14-14-6-20z'],
      green:{cx:118,cy:86,rx:30,ry:22,pin:[116,90]},tees:[[104,264,16,6]],line:'104 261 116 90'})),
    2: hole(Object.assign({},SM,{id:'h2',aria:'Hole two, a dogleg right',trees:[[150,240,8],[170,256,6],[46,130,8],[30,150,6]],
      fw:'M70 262c-8-40-4-80 16-110 18-26 48-36 80-30 24 4 32 26 14 40-22 18-56 10-74 36-16 24-10 50-14 70-2 10-18 10-22-6z',
      bk:['M120 160c8-6 20-2 22 8 2 8-8 14-16 12-10-2-14-14-6-20z','M190 140c6-6 16-2 16 6 0 8-8 12-14 8-6-4-8-10-2-14z'],
      green:{cx:166,cy:96,rx:30,ry:22,pin:[164,100]},tees:[[78,266,16,6]],line:'78 263 96 150 164 100'})),
    3: hole(Object.assign({},SM,{id:'h3',aria:'Hole three, over water to an island green',trees:[[34,250,8],[196,240,7],[184,40,7]],
      wt:'M30 180c30-50 100-70 160-40 20 10 16 40-4 56-40 30-110 34-150 8-14-8-14-16-6-24z',
      fw:'M98 268c-6-30-4-56 6-72 6-10 18-10 24 0 10 18 8 44 0 68-4 12-26 16-30 4z',bk:['M140 148c6-6 16-2 16 6 0 8-8 12-14 8-6-4-8-10-2-14z'],
      green:{cx:116,cy:124,rx:30,ry:24,pin:[116,128]},tees:[[112,268,16,6]],line:'112 265 116 128'})),
    4: hole(Object.assign({},SM,{id:'h4',aria:'Hole four, a long dogleg left',trees:[[40,240,8],[24,258,6],[186,160,8],[200,140,6],[60,40,7]],
      fw:'M150 262c8-40 4-84-18-116-16-24-50-26-74-14-20 10-26 32-8 42 22 12 54-4 70 20 12 20 6 48 8 70 0 10 18 12 22-2z',
      bk:['M96 170c8-6 20-2 22 8 2 8-8 14-16 12-10-2-14-14-6-20z','M34 120c6-6 16-2 16 6 0 8-8 12-14 8-6-4-8-10-2-14z'],
      green:{cx:64,cy:92,rx:30,ry:22,pin:[66,96]},tees:[[140,266,16,6]],line:'140 263 112 160 66 96'}))
  };
  document.querySelectorAll('[data-hole]').forEach(function(el){ var n=el.getAttribute('data-hole'); if(H[n]) el.innerHTML=H[n]; });

  // hero draw-on, once per page load (after fonts settle so the numeral doesn't jump)
  var hero=document.querySelector('.hero .hole');
  if(hero){requestAnimationFrame(function(){hero.classList.add('draw');});}

  // mobile swipe dots for the yardage book
  var spreads=document.querySelector('.spreads'), dots=document.querySelector('.dots');
  if(spreads&&dots){
    var items=spreads.querySelectorAll('.spread');
    items.forEach(function(_,i){var d=document.createElement('i');if(i===0)d.className='on';dots.appendChild(d);});
    var ds=dots.querySelectorAll('i');
    spreads.addEventListener('scroll',function(){var w=items[0].getBoundingClientRect().width+12;var i=Math.round(spreads.scrollLeft/w);ds.forEach(function(d,k){d.classList.toggle('on',k===i);});},{passive:true});
  }

  // demo application form: sends nothing
  var form=document.querySelector('form.app');
  if(form){form.addEventListener('submit',function(e){e.preventDefault();if(!form.checkValidity()){form.reportValidity();return;}form.classList.add('sent');form.querySelector('.ok').scrollIntoView({behavior:'smooth',block:'center'});});}

  // sticky mobile CTA: hide while the hero / apply box is on screen
  var mcta=document.querySelector('.mcta');
  if(mcta&&'IntersectionObserver' in window){
    var targets=document.querySelectorAll('.hero .cta, .apply-cta, form.app');
    var seen=new Map();
    var io=new IntersectionObserver(function(es){es.forEach(function(e){seen.set(e.target,e.isIntersecting);});var any=false;seen.forEach(function(v){if(v)any=true;});mcta.style.visibility=any?'hidden':'visible';},{threshold:.05});
    targets.forEach(function(t){io.observe(t);});
  }
})();
