/* Town of Decatur — shared content layer for the concept.
   Content edited in admin.html is saved to the browser and read by the public
   pages, so the editor genuinely works during a demo. A live build would store
   this server-side instead. */
(function(){
  var KEY='decaturSite.v1';

  var DEFAULTS={
    banner:{on:false,level:'info',title:'',msg:'',linkText:'',linkUrl:'',stamp:''},
    hero:{l1:'Faith. Family.',l2:'Education.',
          lede:'The Town of Decatur already painted its own front page on a downtown wall. This website just says the same thing — and then gets you to the water bill in two taps.'},
    week:{garbage:'Wednesdays',garbageNote:'Household garbage pickup, every week.',
          limbs:'Tuesdays',limbsNote:'Yard debris and cut limbs at the curb.',
          due:'Due the 10th',dueNote:'Service is disconnected the first working day after the 10th. Reconnection is $50.',
          hours:'8:00 a.m. – 12:00 p.m., closed for lunch, then 1:00 – 5:00 p.m.',
          cutoffs:'Monday, October 13 · Wednesday, November 12 · Friday, December 11'},
    news:[]
  };

  function clone(o){return JSON.parse(JSON.stringify(o));}
  function load(){
    try{
      var raw=localStorage.getItem(KEY);
      if(!raw) return clone(DEFAULTS);
      var d=JSON.parse(raw), out=clone(DEFAULTS);
      for(var k in d){ if(d[k]&&typeof d[k]==='object'&&!Array.isArray(d[k])) out[k]=Object.assign(out[k]||{},d[k]); else out[k]=d[k]; }
      return out;
    }catch(e){ return clone(DEFAULTS); }
  }
  function save(d){ try{ localStorage.setItem(KEY,JSON.stringify(d)); return true; }catch(e){ return false; } }
  function reset(){ try{ localStorage.removeItem(KEY); }catch(e){} }

  var LEVELS={
    emergency:{bg:'#7A1F00',fg:'#ffffff',accent:'#FFD9CC',label:'Emergency'},
    warning:  {bg:'#9A6712',fg:'#ffffff',accent:'#FBF0D9',label:'Advisory'},
    info:     {bg:'#423A63',fg:'#ffffff',accent:'#D9D3EA',label:'Notice'}
  };

  function styles(){
    if(document.getElementById('wd-banner-css')) return;
    var s=document.createElement('style'); s.id='wd-banner-css';
    s.textContent=
      '.wd-banner{position:relative;z-index:120;padding:14px 0;font-family:Inter,system-ui,sans-serif;'+
      'padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}'+
      '.wd-banner .wd-in{max-width:1180px;margin:0 auto;padding-inline:clamp(16px,4vw,40px);display:flex;gap:14px;align-items:flex-start}'+
      '.wd-banner .wd-ic{flex:0 0 auto;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:15px;line-height:1;margin-top:1px}'+
      '.wd-banner .wd-bd{flex:1;min-width:0}'+
      '.wd-banner .wd-lab{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;opacity:.85}'+
      '.wd-banner .wd-t{font-size:17px;font-weight:800;line-height:1.3;margin-top:3px}'+
      '.wd-banner .wd-m{font-size:15px;line-height:1.55;margin-top:5px}'+
      '.wd-banner a.wd-lk{color:inherit;font-weight:700;text-decoration:underline;display:inline-block;margin-top:8px;min-height:32px}'+
      '.wd-banner .wd-x{flex:0 0 auto;background:transparent;border:1px solid currentColor;color:inherit;border-radius:8px;'+
      'width:34px;height:34px;cursor:pointer;font-size:16px;line-height:1;opacity:.75}'+
      '.wd-banner .wd-x:hover{opacity:1}'+
      '@media(max-width:600px){.wd-banner .wd-t{font-size:16px}.wd-banner .wd-m{font-size:14.5px}}';
    document.head.appendChild(s);
  }

  function sig(b){ return (b.level||'')+'|'+(b.title||'')+'|'+(b.msg||''); }

  function renderBanner(d){
    var old=document.querySelector('.wd-banner'); if(old) old.remove();
    var b=d.banner;
    if(!b||!b.on||!(b.title||b.msg)) return;
    var dismissed='';
    try{ dismissed=sessionStorage.getItem('wdBannerDismissed')||''; }catch(e){}
    if(dismissed===sig(b)) return;
    styles();
    var L=LEVELS[b.level]||LEVELS.info;
    var el=document.createElement('div');
    el.className='wd-banner';
    el.setAttribute('role','region');
    el.setAttribute('aria-label','Town notice');
    el.style.backgroundColor=L.bg; el.style.color=L.fg;
    var html='<div class="wd-in">'+
      '<span class="wd-ic" style="background-color:'+L.accent+';color:'+L.bg+'" aria-hidden="true">!</span>'+
      '<span class="wd-bd">'+
        '<span class="wd-lab">'+esc(L.label)+'</span>'+
        (b.title?'<div class="wd-t">'+esc(b.title)+'</div>':'')+
        (b.msg?'<div class="wd-m">'+esc(b.msg)+'</div>':'')+
        (b.linkText&&b.linkUrl?'<a class="wd-lk" href="'+esc(b.linkUrl)+'">'+esc(b.linkText)+'</a>':'')+
      '</span>'+
      '<button class="wd-x" aria-label="Dismiss this notice">&times;</button></div>';
    el.innerHTML=html;
    el.querySelector('.wd-x').addEventListener('click',function(){
      try{ sessionStorage.setItem('wdBannerDismissed',sig(b)); }catch(e){}
      el.remove();
    });
    var anchor=document.querySelector('.concept');
    if(anchor&&anchor.parentNode) anchor.parentNode.insertBefore(el,anchor.nextSibling);
    else document.body.insertBefore(el,document.body.firstChild);
  }

  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  function setText(id,val){ var el=document.getElementById(id); if(el&&val!=null&&val!=='') el.textContent=val; }

  function renderNews(d){
    var host=document.getElementById('wdNews');
    if(!host) return;
    var items=(d.news||[]).filter(function(n){return n&&(n.t||n.b);});
    if(!items.length){ host.hidden=true; return; }
    host.hidden=false;
    host.innerHTML='<div class="wrap"><div class="sec-head"><p class="eyebrow">Town news</p>'+
      '<h2>What&rsquo;s happening in Decatur</h2></div><div class="cards c3">'+
      items.map(function(n){
        return '<div class="card"><h3>'+esc(n.t||'')+'</h3>'+
          (n.d?'<p style="font-size:13.5px;color:var(--ink-3);font-weight:600;margin-bottom:8px">'+esc(n.d)+'</p>':'')+
          '<p>'+esc(n.b||'')+'</p></div>';
      }).join('')+'</div></div>';
  }

  function apply(){
    var d=load();
    renderBanner(d);
    setText('wdHero1',d.hero.l1); setText('wdHero2',d.hero.l2); setText('wdLede',d.hero.lede);
    setText('wdGarbage',d.week.garbage); setText('wdGarbageNote',d.week.garbageNote);
    setText('wdLimbs',d.week.limbs);     setText('wdLimbsNote',d.week.limbsNote);
    setText('wdDue',d.week.due);         setText('wdDueNote',d.week.dueNote);
    setText('wdHours',d.week.hours);     setText('wdCutoffs',d.week.cutoffs);
    renderNews(d);
  }

  window.WDSite={KEY:KEY,DEFAULTS:DEFAULTS,load:load,save:save,reset:reset,apply:apply,LEVELS:LEVELS};

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply);
  else apply();

  /* live update when the editor publishes in another tab */
  window.addEventListener('storage',function(e){ if(e.key===KEY) apply(); });
})();
