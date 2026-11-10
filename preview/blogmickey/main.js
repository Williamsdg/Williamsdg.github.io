(function(){
  var btn=document.getElementById('menuBtn'),dr=document.getElementById('drawer');
  if(btn&&dr){
    var close=dr.querySelector('.close'),scrim=dr.querySelector('.scrim'),last=null;
    function open(){last=document.activeElement;dr.classList.add('open');dr.setAttribute('aria-hidden','false');btn.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';setTimeout(function(){close.focus();},60);}
    function shut(){dr.classList.remove('open');dr.setAttribute('aria-hidden','true');btn.setAttribute('aria-expanded','false');document.body.style.overflow='';if(last)last.focus();}
    btn.addEventListener('click',open);close.addEventListener('click',shut);scrim.addEventListener('click',shut);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&dr.classList.contains('open'))shut();});
  }
  document.querySelectorAll('form.nl-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var n=f.querySelector('.nl-note');
      if(n){n.hidden=false;n.textContent='This is a design preview. Nothing was sent. The live sign-up is at blogmickey.com/newsletter.';}
    });
  });
})();
