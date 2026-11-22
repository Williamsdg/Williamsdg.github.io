/* ATN site text — applies wording saved in the Command Center ("Website Text").
   Every editable element carries data-edit="<key>". The HTML holds the original wording;
   a saved row in atn_site_text replaces it. If the network is down, the original stays.
   Values are written as text nodes (never innerHTML), so saved text cannot inject markup.
   Formatting rules (shared with the Command Center editor):
     - a new line becomes a line break
     - *words in asterisks* become the gold italic accent on fields with data-edit-type="accent"
     - data-edit-type="lines" turns each line into a list item */
(function(){
  'use strict';
  var SB='https://raolhzzsbzvevwpjvvcp.supabase.co';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhb2xoenpzYnp2ZXZ3cGp2dmNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NTE0NDIsImV4cCI6MjEwMjMyNzQ0Mn0.anZHWJjvaxSHyeFb7vhu-y4SCtOVak0jhZrXiNma7WM';
  var CACHE='atn-site-text-v1';

  function accentEl(spec){
    var parts=String(spec||'span.hl').split('.');
    var el=document.createElement(parts[0]||'span');
    if(parts.length>1) el.className=parts.slice(1).join(' ');
    return el;
  }

  function render(el,value){
    var type=el.getAttribute('data-edit-type')||'text';
    var v=String(value==null?'':value).replace(/\r\n?/g,'\n');
    while(el.firstChild) el.removeChild(el.firstChild);
    if(type==='lines'){
      v.split('\n').forEach(function(line){
        line=line.trim(); if(!line) return;
        var li=document.createElement('li'); li.textContent=line; el.appendChild(li);
      });
      return;
    }
    v.split('\n').forEach(function(line,i){
      if(i) el.appendChild(document.createElement('br'));
      if(type!=='accent'){ el.appendChild(document.createTextNode(line)); return; }
      line.split('*').forEach(function(part,j){
        if(!part) return;
        if(j%2){ var a=accentEl(el.getAttribute('data-accent')); a.textContent=part; el.appendChild(a); }
        else el.appendChild(document.createTextNode(part));
      });
    });
  }

  // keep the page's original wording so a field reset in the Command Center can be undone
  // here too, even after a cached edit was already applied
  var ORIG=[];
  var ELS=document.querySelectorAll('[data-edit]');
  for(var n=0;n<ELS.length;n++){
    ORIG.push(Array.prototype.map.call(ELS[n].childNodes,function(c){ return c.cloneNode(true); }));
  }
  function restore(i){
    var el=ELS[i];
    while(el.firstChild) el.removeChild(el.firstChild);
    ORIG[i].forEach(function(c){ el.appendChild(c.cloneNode(true)); });
    el.removeAttribute('data-edited');
  }
  function apply(map){
    if(!map) return;
    for(var i=0;i<ELS.length;i++){
      var k=ELS[i].getAttribute('data-edit');
      if(Object.prototype.hasOwnProperty.call(map,k)){ render(ELS[i],map[k]); ELS[i].setAttribute('data-edited',''); }
      else if(ELS[i].hasAttribute('data-edited')) restore(i);
    }
  }

  window.ATN_SITE_TEXT={render:render};

  // 1) last known wording straight away, so returning visitors don't see the text change
  try{ var c=JSON.parse(localStorage.getItem(CACHE)||'null'); if(c&&c.map) apply(c.map); }catch(e){}

  // 2) fresh wording from the database
  if(!window.fetch) return;
  fetch(SB+'/rest/v1/atn_site_text?select=key,value',{headers:{apikey:KEY,Authorization:'Bearer '+KEY},cache:'no-store'})
    .then(function(r){ if(!r.ok) throw new Error('site text '+r.status); return r.json(); })
    .then(function(rows){
      var map={};
      (rows||[]).forEach(function(r){ if(r&&typeof r.key==='string') map[r.key]=r.value; });
      apply(map);
      try{ localStorage.setItem(CACHE,JSON.stringify({at:Date.now(),map:map})); }catch(e){}
    })
    .catch(function(){ /* keep the wording already on the page */ });
})();
