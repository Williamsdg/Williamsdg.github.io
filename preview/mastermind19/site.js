/* Mastermind19 concept — shared behaviour. No tracking, no network. */
(function(){
  // mobile drawer
  var btn=document.querySelector('.menu-btn'), drawer=document.getElementById('drawer');
  if(btn&&drawer){btn.addEventListener('click',function(){var open=drawer.classList.toggle('open');btn.setAttribute('aria-expanded',open?'true':'false');btn.textContent=open?'Close':'Menu';});}

  // yardage-book hole diagrams: drawn once here, placed wherever <div data-hole="n"> appears
  var H={
    // hero: the 19th hole
    19:'<svg class="yd" viewBox="0 0 520 700" role="img" aria-label="Yardage-book drawing of a hole numbered nineteen, pin on the green"><rect class="frame" x="1" y="1" width="518" height="698"/><g class="tr"><circle cx="86" cy="612" r="14"/><circle cx="118" cy="640" r="11"/><circle cx="62" cy="648" r="9"/><circle cx="430" cy="560" r="13"/><circle cx="458" cy="590" r="10"/><circle cx="402" cy="586" r="9"/><circle cx="96" cy="300" r="12"/><circle cx="70" cy="330" r="9"/><circle cx="446" cy="250" r="12"/><circle cx="472" cy="222" r="9"/><circle cx="420" cy="214" r="8"/></g><path class="wt" d="M300 470c40-10 90-6 120 18 18 14 14 40-6 50-30 14-80 10-110-10-22-16-26-50-4-58z"/><path class="fw" d="M224 652 C150 585 140 470 210 400 C268 342 300 300 282 232 C268 180 292 128 332 108 L372 128 C352 150 318 200 334 246 C352 298 322 356 290 420 C258 486 262 566 290 652 Z"/><ellipse class="tee" cx="258" cy="648" rx="22" ry="12"/><path class="bk" d="M172 448c12-8 32-6 40 8 6 12-6 24-22 24-16 0-30-20-18-32z"/><path class="bk" d="M330 150c14-6 30 2 32 16 2 14-12 22-26 18-14-4-20-26-6-34z"/><path class="bk" d="M232 250c10-10 30-6 34 8 4 12-10 22-24 20-14-2-22-18-10-28z"/><ellipse class="gr" cx="356" cy="112" rx="58" ry="40"/><path class="ln" d="M258 648 L292 430 L352 118"/><g class="pinset"><line class="pin" x1="352" y1="118" x2="352" y2="52"/><path class="flag" d="M352 52 l30 10 -30 10z"/><circle class="cup" cx="352" cy="118" r="3"/></g><text class="num" x="30" y="128">19</text><text class="lbl" x="34" y="156">The 19th hole</text><text class="lbl" x="34" y="176">where the real deals happen</text></svg>',
    1:'<svg class="yd" viewBox="0 0 220 300" role="img" aria-label="Hole one, a straight par three"><rect class="frame" x=".5" y=".5" width="219" height="299"/><g class="tr"><circle cx="40" cy="250" r="8"/><circle cx="26" cy="268" r="6"/><circle cx="182" cy="90" r="8"/><circle cx="196" cy="110" r="6"/></g><path class="fw" d="M92 262c-10-50-6-100 8-150 6-22 20-30 30-16 12 18 10 60 4 100-4 30-6 70-20 74-12 4-18-2-22-8z"/><ellipse class="tee" cx="104" cy="264" rx="12" ry="6"/><path class="bk" d="M60 120c8-6 20-2 22 8 2 8-8 14-16 12-10-2-14-14-6-20z"/><ellipse class="gr" cx="118" cy="86" rx="30" ry="22"/><path class="ln" d="M104 264 L116 90"/><g class="pinset"><line class="pin" x1="116" y1="90" x2="116" y2="50"/><path class="flag" d="M116 50 l18 6 -18 6z"/><circle class="cup" cx="116" cy="90" r="2"/></g></svg>',
    2:'<svg class="yd" viewBox="0 0 220 300" role="img" aria-label="Hole two, a dogleg right"><rect class="frame" x=".5" y=".5" width="219" height="299"/><g class="tr"><circle cx="150" cy="240" r="8"/><circle cx="170" cy="256" r="6"/><circle cx="46" cy="130" r="8"/><circle cx="30" cy="150" r="6"/></g><path class="fw" d="M70 262c-8-40-4-80 16-110 18-26 48-36 80-30 24 4 32 26 14 40-22 18-56 10-74 36-16 24-10 50-14 70-2 10-18 10-22-6z"/><ellipse class="tee" cx="78" cy="266" rx="12" ry="6"/><path class="bk" d="M120 160c8-6 20-2 22 8 2 8-8 14-16 12-10-2-14-14-6-20z"/><path class="bk" d="M190 140c6-6 16-2 16 6 0 8-8 12-14 8-6-4-8-10-2-14z"/><ellipse class="gr" cx="166" cy="96" rx="30" ry="22"/><path class="ln" d="M78 266 L96 150 L164 100"/><g class="pinset"><line class="pin" x1="164" y1="100" x2="164" y2="60"/><path class="flag" d="M164 60 l18 6 -18 6z"/><circle class="cup" cx="164" cy="100" r="2"/></g></svg>',
    3:'<svg class="yd" viewBox="0 0 220 300" role="img" aria-label="Hole three, over water to an island green"><rect class="frame" x=".5" y=".5" width="219" height="299"/><g class="tr"><circle cx="34" cy="250" r="8"/><circle cx="196" cy="240" r="7"/><circle cx="184" cy="40" r="7"/></g><path class="wt" d="M30 180c30-50 100-70 160-40 20 10 16 40-4 56-40 30-110 34-150 8-14-8-14-16-6-24z"/><path class="fw" d="M98 268c-6-30-4-56 6-72 6-10 18-10 24 0 10 18 8 44 0 68-4 12-26 16-30 4z"/><ellipse class="tee" cx="112" cy="268" rx="12" ry="6"/><ellipse class="gr" cx="116" cy="124" rx="30" ry="24"/><path class="bk" d="M140 148c6-6 16-2 16 6 0 8-8 12-14 8-6-4-8-10-2-14z"/><path class="ln" d="M112 268 L116 128"/><g class="pinset"><line class="pin" x1="116" y1="128" x2="116" y2="88"/><path class="flag" d="M116 88 l18 6 -18 6z"/><circle class="cup" cx="116" cy="128" r="2"/></g></svg>',
    4:'<svg class="yd" viewBox="0 0 220 300" role="img" aria-label="Hole four, a long dogleg left"><rect class="frame" x=".5" y=".5" width="219" height="299"/><g class="tr"><circle cx="40" cy="240" r="8"/><circle cx="24" cy="258" r="6"/><circle cx="186" cy="160" r="8"/><circle cx="200" cy="140" r="6"/><circle cx="60" cy="40" r="7"/></g><path class="fw" d="M150 262c8-40 4-84-18-116-16-24-50-26-74-14-20 10-26 32-8 42 22 12 54-4 70 20 12 20 6 48 8 70 0 10 18 12 22-2z"/><ellipse class="tee" cx="140" cy="266" rx="12" ry="6"/><path class="bk" d="M96 170c8-6 20-2 22 8 2 8-8 14-16 12-10-2-14-14-6-20z"/><path class="bk" d="M34 120c6-6 16-2 16 6 0 8-8 12-14 8-6-4-8-10-2-14z"/><ellipse class="gr" cx="64" cy="92" rx="30" ry="22"/><path class="ln" d="M140 266 L112 160 L66 96"/><g class="pinset"><line class="pin" x1="66" y1="96" x2="66" y2="56"/><path class="flag" d="M66 56 l18 6 -18 6z"/><circle class="cup" cx="66" cy="96" r="2"/></g></svg>'
  };
  document.querySelectorAll('[data-hole]').forEach(function(el){var n=el.getAttribute('data-hole');if(H[n])el.innerHTML=H[n];});

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
