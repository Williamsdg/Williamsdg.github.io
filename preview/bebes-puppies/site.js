/* BeBe's Precious Puppies — concept scripts (Williams Digital, 2026-10-22) */
(function(){
  'use strict';
  // Mobile menu
  var mb=document.querySelector('.menu-btn'), nav=document.getElementById('nav');
  if(mb&&nav){
    mb.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      mb.setAttribute('aria-expanded',open?'true':'false');
    });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&nav.classList.contains('open')){ nav.classList.remove('open'); mb.setAttribute('aria-expanded','false'); mb.focus(); } });
  }

  // Paw trail fills as you scroll (desktop only; CSS hides it under 1320px)
  var paws=document.querySelectorAll('.trail svg');
  if(paws.length){
    var tick=false;
    var update=function(){
      tick=false;
      var doc=document.documentElement;
      var max=doc.scrollHeight-doc.clientHeight; if(max<=0) return;
      var p=Math.min(1,window.scrollY/max);
      var n=Math.round(p*paws.length);
      for(var i=0;i<paws.length;i++) paws[i].classList.toggle('on',i<n);
    };
    window.addEventListener('scroll',function(){ if(!tick){ tick=true; requestAnimationFrame(update); } },{passive:true});
    update();
  }

  // Litter photo carousels
  document.querySelectorAll('.lcard .gal').forEach(function(gal){
    var slides=gal.querySelector('.slides'), n=gal.querySelector('.cnt .n'), imgs=slides.querySelectorAll('img');
    var idx=function(){ return Math.round(slides.scrollLeft/slides.clientWidth); };
    slides.addEventListener('scroll',function(){ if(n) n.textContent=idx()+1; },{passive:true});
    var go=function(d){ var i=Math.max(0,Math.min(imgs.length-1,idx()+d)); slides.scrollTo({left:i*slides.clientWidth,behavior:'smooth'}); };
    var l=gal.querySelector('.arr.l'), r=gal.querySelector('.arr.r');
    if(l) l.addEventListener('click',function(){ go(-1); });
    if(r) r.addEventListener('click',function(){ go(1); });
  });

  // Breed filter
  var filt=document.querySelector('.filters');
  if(filt){
    filt.addEventListener('click',function(e){
      var b=e.target.closest('button'); if(!b) return;
      filt.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed',x===b?'true':'false'); });
      var c=b.getAttribute('data-cat');
      document.querySelectorAll('.lcard').forEach(function(card){ card.classList.toggle('hide',c!=='all'&&card.getAttribute('data-cat')!==c); });
    });
  }

  // Pre-select a litter in the form from ?about=
  var about=new URLSearchParams(location.search).get('about');
  if(about){ var sel=document.getElementById('about'); if(sel){ sel.value=about; } }

  // Demo inquiry form: validates, shows the thank-you, sends nothing
  document.querySelectorAll('form.inq').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=true;
      f.querySelectorAll('[required]').forEach(function(i){ var bad=!i.value.trim()||(i.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value)); i.style.borderColor=bad?'#B93F15':''; if(bad) ok=false; });
      if(!ok) return;
      f.querySelector('.toast').classList.add('show');
      f.querySelector('button[type=submit]').disabled=true;
      f.querySelector('button[type=submit]').textContent='Sent';
    });
  });
})();
