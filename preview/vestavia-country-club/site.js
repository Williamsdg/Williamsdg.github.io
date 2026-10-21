
(function(){
  // mobile menu
  var btn=document.querySelector('.menu-btn'),dr=document.getElementById('drawer');
  if(btn&&dr){btn.addEventListener('click',function(){var o=dr.hasAttribute('open');if(o){dr.removeAttribute('open');}else{dr.setAttribute('open','');}btn.setAttribute('aria-expanded',String(!o));btn.textContent=o?'Menu':'Close';document.body.classList.toggle('drawer-open',!o);});}
  // amenity index
  var list=document.getElementById('amenity-list'),stage=document.getElementById('amenity-stage'),cap=document.getElementById('amenity-cap');
  if(list&&stage){
    var links=list.querySelectorAll('a'),imgs=stage.querySelectorAll('img');
    var caps=Array.prototype.map.call(links,function(a){return a.getAttribute('data-cap')||'';});
    function show(i){links.forEach(function(a,j){a.classList.toggle('is-on',i===j);});imgs.forEach(function(im,j){im.classList.toggle('is-on',i===j);});if(cap&&window.AMEN_CAPS)cap.textContent=window.AMEN_CAPS[i];}
    links.forEach(function(a,i){a.addEventListener('mouseenter',function(){show(i);});a.addEventListener('focus',function(){show(i);});});
    show(0);
  }
  // plan a day
  var chips=document.querySelectorAll('.chips button'),cards=document.querySelectorAll('.plan-card');
  if(chips.length){
    function apply(){var on=[];chips.forEach(function(c){if(c.getAttribute('aria-pressed')==='true')on.push(c.getAttribute('data-tag'));});
      var seen={},n=0;cards.forEach(function(k){var tags=k.getAttribute('data-tags').split(' ');var hit=on.some(function(t){return tags.indexOf(t)>-1;});var key=k.querySelector('h3').textContent;if(hit&&seen[key])hit=false;if(hit)seen[key]=1;k.classList.toggle('is-on',hit);if(hit)n++;});
      var e=document.getElementById('plan-empty');if(e)e.hidden=n>0;}
    chips.forEach(function(c){c.addEventListener('click',function(){c.setAttribute('aria-pressed',c.getAttribute('aria-pressed')==='true'?'false':'true');apply();});});
    var grid=document.getElementById('plan-grid');if(grid){var e=document.createElement('p');e.id='plan-empty';e.className='plan-empty';e.textContent='Pick who is coming to see what the club has for them.';grid.parentNode.appendChild(e);}
    apply();
  }
  // demo form
  var f=document.getElementById('inquiry');
  if(f){f.addEventListener('submit',function(ev){ev.preventDefault();var ok=true;f.querySelectorAll('[required]').forEach(function(i){if(!i.value.trim()){ok=false;i.focus();}});if(!ok)return;document.getElementById('sent').style.display='block';f.querySelector('button[type=submit]').disabled=true;});}
})();
