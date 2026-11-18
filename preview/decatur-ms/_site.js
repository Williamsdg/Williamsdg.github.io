/* Town of Decatur — shared content layer (v12).
   The admin (admin.html) edits a DRAFT; Publish copies it to the PUBLISHED store and keeps a
   revision. Public pages read the published store, or the draft when opened with ?preview=1.
   Everything lives in this browser's localStorage so the demo works without a server; the
   finished site needs a shared, secure content system behind the same data shape. */
(function(){
  var KEY='decaturSite.v1', DRAFT='decaturSite.draft', REV='decaturSite.rev', USER='decaturSite.user', META='decaturSite.meta', MEDIA='decaturSite.media';

  var DEFAULTS={
    banner:{on:false,level:'info',title:'',msg:'',linkText:'',linkUrl:'',stamp:''},
    hero:{l1:'Newton County’s seat',l2:'since 1836',
          lede:'Decatur sits on State Highway 15 in east-central Mississippi, home to the Newton County Courthouse and East Central Community College.',
          photo:null},
    quick:[{t:'Pay a Bill',d:'Water bills'},{t:'Forms & Permits',d:'Applications, licenses & permits'},{t:'Pickup Schedule',d:''},{t:'Town Hall',d:'(601) 635-2761'}],
    meeting:{time:'6:00 p.m.',where:'Town Hall · 66 7th Street'},
    explore:{feat:{l:'Downtown',t:'Explore Downtown',d:'Local shops, dining & community',url:'explore.html',photo:null},
             items:[{l:'Outdoors',t:'Turkey Creek Water Park',d:'Fishing, camping & picnics',url:'https://www.phwd.net/parks/turkey-creek/',photo:null},
                    {l:'Community',t:'Jessie Mae Everett Public Library',d:'',url:'explore.html#Municipal',photo:null},
                    {l:'Education',t:'East Central Community College',d:'Workforce Development Center',url:'https://www.eccc.edu',photo:null}]},
    dephotos:{police:null,fire:null,works:null},
    hall:{photo:null},
    footer:{addr:'66 7th Street, Decatur, MS 39327',hours:'Mon–Fri · 8–Noon / 1–5',phone:'(601) 635-2761',email:'townclerk@townofdecaturms.gov'},
    pages:{},
    week:{garbage:'Wednesday',garbageNote:'One garbage can provided at no additional charge.',
          limbs:'Tuesday',limbsNote:'Place limbs and brush at the curb.',
          due:'due the 10th',dueNote:'Cut-off is the first working day after the 10th. No partial payments. Reconnection fee: $50.',
          hours:'Monday–Friday, 8:00 a.m. – 12:00 noon and 1:00 – 5:00 p.m.',
          cutoffs:''}  /* computed in apply() when the Town has not set one */,
    /*NEWS-SEED*/ news:[{"d":"2026-11-17","t":"Updated Zoning Ordinance now online","b":"The Town’s current Zoning Ordinance is posted on the Ordinances page as a PDF, replacing the 2001 ordinance.","l":"ordinances.html","lt":"Open the Ordinances page"},{"d":"2026-11-17","t":"Permit applications and Town forms available online","b":"Building, zoning and road permit applications, the privilege license application, water and sewer service forms and the employment application can be downloaded from the Forms & Permits page or picked up at Town Hall.","l":"forms-and-permits.html","lt":"Forms & Permits"}], /*END-NEWS-SEED*/
    stories:[],
    events:[],
    media:[],
    depts:{police:true,fire:true,works:true,chamber:false}
  };

  var PAGES=[['police','Police Department','police.html',true],['fire-department','Volunteer Fire Department','fire-department.html',true],['public-works','Public Works','public-works.html',true],
    ['forms-and-permits','Forms & Permits','forms-and-permits.html',false],['contact','Contact Us','contact.html',false],['history','History','history.html',false],
    ['elected-officials','Mayor & Board of Aldermen','elected-officials.html',false],['staff','Town Staff','staff.html',false],['ordinances','Ordinances','ordinances.html',false],
    ['financial-transparency','Financial Transparency','financial-transparency.html',false],['news','News & Notices','news.html',false],['stories','Stories','stories.html',false],
    ['calendar','Calendar','calendar.html',false],['explore','Business Directory','explore.html',false],['make-a-payment','Make a Payment','make-a-payment.html',false]];
  PAGES.forEach(function(p){ DEFAULTS.pages[p[0]]={lede:'',callout:'',photo:null}; });

  function clone(o){return JSON.parse(JSON.stringify(o));}
  function isObj(v){return v&&typeof v==='object'&&!Array.isArray(v);}
  function merge(base,over){ var out=clone(base); if(!isObj(over)) return out;
    for(var k in over){ var b=out[k], o=over[k];
      if(b===null||b===undefined){ if(o===null||isObj(o)||typeof o!=='object') out[k]=o===undefined?b:clone(o); continue; }
      if(isObj(b)){ if(isObj(o)) out[k]=merge(b,o); continue; }
      if(Array.isArray(b)){ if(Array.isArray(o)) out[k]=clone(o.filter(function(x){return x!==null&&typeof x==='object'&&!Array.isArray(x);})); continue; }
      if(typeof o===typeof b) out[k]=o; }
    return out; }
  function readKey(k){ try{ var raw=localStorage.getItem(k); return raw?JSON.parse(raw):null; }catch(e){ return null; } }
  function writeKey(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); return true; }catch(e){ return false; } }
  function isPreview(){ return /[?&]preview=1(&|$)/.test(location.search); }
  function load(){ var pub=readKey(KEY); if(isPreview()){ var dr=readKey(DRAFT); if(dr) return merge(DEFAULTS,dr); } return merge(DEFAULTS,pub||{}); }
  function loadDraft(){ var dr=readKey(DRAFT); return merge(DEFAULTS, dr||readKey(KEY)||{}); }
  function loadPublished(){ return merge(DEFAULTS, readKey(KEY)||{}); }
  function save(d){ return writeKey(KEY,d); }            /* kept for compatibility: writes the published store */
  function saveDraft(d){ return writeKey(DRAFT,d); }
  function hasDraft(){ var dr=readKey(DRAFT); if(!dr) return false; return JSON.stringify(merge(DEFAULTS,dr))!==JSON.stringify(merge(DEFAULTS,readKey(KEY)||{})); }
  function discardDraft(){ try{ localStorage.removeItem(DRAFT); }catch(e){} }
  function meta(){ return readKey(META)||{}; }
  function user(){ return readKey(USER)||{name:'Town Clerk',role:'publisher'}; }
  function setUser(u){ return writeKey(USER,u); }
  function revisions(){ return readKey(REV)||[]; }
  function publish(d,by,now){ now=now||new Date(); var prevRev=readKey(REV), prevMeta=readKey(META);
    var r=revisions(); r.unshift({ts:now.toISOString(),by:by||user().name||'',data:JSON.stringify(d)}); if(r.length>20) r.length=20;
    if(!writeKey(REV,r)){ return false; }
    if(!writeKey(META,{lastPublished:now.toISOString(),by:by||user().name||''})){ writeKey(REV,prevRev||[]); return false; }
    if(!writeKey(KEY,d)){ if(prevRev) writeKey(REV,prevRev); else { try{ localStorage.removeItem(REV); }catch(e){} } if(prevMeta) writeKey(META,prevMeta); else { try{ localStorage.removeItem(META); }catch(e){} } return false; }
    discardDraft(); return true; }
  function restore(i){ var r=revisions()[i]; if(!r) return null; try{ var d=merge(DEFAULTS,JSON.parse(r.data)); writeKey(DRAFT,d); return d; }catch(e){ return null; } }
  function reset(){ try{ localStorage.removeItem(KEY); localStorage.removeItem(DRAFT); }catch(e){} }
  /* uploaded photos live in their own store so drafts, the published copy and revisions stay small; photos refer to them as media:ID */
  function mediaStore(){ return readKey(MEDIA)||{}; }
  function setMedia(id,obj){ var m=mediaStore(); m[id]=obj; return writeKey(MEDIA,m); }
  function deleteMedia(id){ var m=mediaStore(); delete m[id]; return writeKey(MEDIA,m); }
  function resolveSrc(src){ if(!src) return src; if(String(src).indexOf('media:')===0){ var m=mediaStore()[String(src).slice(6)]; return m?m.src:''; } return src; }
  function usage(){ var n=0; try{ for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); if(k.indexOf('decaturSite')===0) n+=(localStorage.getItem(k)||'').length; } }catch(e){} return n; }

  var LEVELS={
    emergency:{bg:'#7A1F00',fg:'#ffffff',accent:'#FFD9CC',label:'Emergency'},
    warning:  {bg:'#9A6712',fg:'#ffffff',accent:'#FBF0D9',label:'Advisory'},
    info:     {bg:'#423A63',fg:'#ffffff',accent:'#D9D3EA',label:'Notice'}
  };

  function styles(){
    if(document.getElementById('wd-banner-css')) return;
    var s=document.createElement('style'); s.id='wd-banner-css';
    s.textContent=
      '.wd-banner{position:relative;z-index:120;padding:14px 0;font-family:Arial,Helvetica,sans-serif;'+
      'padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}'+
      '.wd-banner .wd-in{max-width:1180px;margin:0 auto;padding-inline:clamp(16px,4vw,40px);display:flex;gap:14px;align-items:flex-start}'+
      '.wd-banner .wd-ic{flex:0 0 auto;width:26px;height:26px;border-radius:3px;display:grid;place-items:center;font-weight:800;font-size:15px;line-height:1;margin-top:1px}'+
      '.wd-banner .wd-bd{flex:1;min-width:0}'+
      '.wd-banner .wd-lab{font-size:13px;font-weight:700;opacity:.9}'+
      '.wd-banner .wd-t{font-size:17px;font-weight:800;line-height:1.3;margin-top:3px}'+
      '.wd-banner .wd-m{font-size:15px;line-height:1.55;margin-top:5px}'+
      '.wd-banner a.wd-lk{color:inherit;font-weight:700;text-decoration:underline;display:inline-block;margin-top:8px;min-height:32px}'+
      '.wd-banner .wd-x{flex:0 0 auto;background:transparent;border:1px solid currentColor;color:inherit;border-radius:3px;'+
      'width:34px;height:34px;cursor:pointer;font-size:16px;line-height:1;opacity:.75}'+
      '.wd-banner .wd-x:hover{opacity:1}'+
      '.wd-banner .wd-x:focus-visible,.wd-banner a.wd-lk:focus-visible,.wd-preview a:focus-visible{outline:3px solid #fff;outline-offset:2px}'+
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
        (b.linkText&&safeUrl(b.linkUrl)?'<a class="wd-lk" href="'+esc(safeUrl(b.linkUrl))+'">'+esc(b.linkText)+'</a>':'')+
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

  function safeUrl(u){ u=normUrl(u); return /^\s*(javascript|data|vbscript|file):/i.test(u)?'':u; }
  function normUrl(u){
    u=String(u||'').trim();
    if(!u) return u;
    if(/^(https?:|mailto:|tel:|#|\/|\.\.?\/)/i.test(u)) return u;
    if(/\.(html?|pdf|jpe?g|png|webp)(\?|#|$)/i.test(u)) return u;
    if(/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u)) return 'https://'+u;
    return u;
  }
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  function setText(id,val){ var el=document.getElementById(id); if(el&&val!=null&&val!=='') el.textContent=val; }

  var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function fmtDate(s){ if(!s) return ''; var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s).trim()); if(m) return MONTHS[+m[2]-1]+' '+(+m[3])+', '+m[1]; return String(s); }
  function localDate(s){ var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s||'').trim()); if(m) return new Date(+m[1],+m[2]-1,+m[3]); var t=Date.parse(s||''); return isNaN(t)?null:new Date(t); }
  function newsTime(n){ var d=localDate(n.d); return d?d.getTime():0; }
  function renderNews(d){
    var host=document.getElementById('wdNews');
    if(!host) return;
    var items=(d.news||[]).filter(function(n){return n&&(n.t||n.b);}).map(function(n,i){return {n:n,i:i};});
    items.sort(function(a,b){ return (newsTime(b.n)-newsTime(a.n)) || (a.i-b.i); });  /* newest first; ties keep editor order */
    var limit=parseInt(host.getAttribute('data-limit')||'0',10)||0, total=items.length;
    host.setAttribute('data-total', total);
    if(!total){ host.hidden=true; host.innerHTML=''; return; }
    if(limit&&total>limit) items=items.slice(0,limit);
    host.hidden=false;
    var shared=items.length>1&&items[0].n.d&&items.every(function(x){return x.n.d===items[0].n.d;});
    host.innerHTML='<h2>News &amp; Notices</h2>'+(shared?'<p class="d dshared">Updated '+esc(fmtDate(items[0].n.d))+'</p>':'')+
      items.map(function(x){ var n=x.n;
        return '<div class="notice">'+(n.d&&!shared?'<p class="d">'+esc(fmtDate(n.d))+'</p>':'')+'<h3>'+esc(n.t||'')+'</h3>'+
          '<p>'+esc(n.b||'')+(safeUrl(n.l)?' <a href="'+esc(safeUrl(n.l))+'">'+esc(n.lt||'Read more')+'</a>':'')+'</p></div>';
      }).join('');
    var more=document.getElementById('nbMore'); if(more) more.hidden=false;
  }

  function renderDepts(d){
    var host=document.getElementById('deptCards');
    if(!host) return;
    var on=d.depts||{}, shown=0;
    host.querySelectorAll('[data-dept]').forEach(function(card){
      var vis = on[card.getAttribute('data-dept')]!==false;
      card.hidden=!vis;
      if(vis) shown++;
    });
    var sec=document.getElementById('depts');
    if(sec) sec.hidden = shown===0;
  }


  /* ---- dates -------------------------------------------------------------
     The Board meets the first Tuesday at 6 p.m. Bills are due the 10th and
     service is cut off the first WORKING day after it, so weekends and
     federal holidays have to be skipped — Oct 12 is Columbus Day and Nov 11
     is Veterans Day, which is why those months land a day later than a naive
     calculation suggests. Everything is computed from today so the pages
     never show a meeting that has already happened. */
  var DAY=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MON=['January','February','March','April','May','June','July','August','September','October','November','December'];

  function nthWeekday(y,m,wd,n){ var d=new Date(y,m,1),c=0;
    while(true){ if(d.getDay()===wd && ++c===n) return d; d.setDate(d.getDate()+1); } }
  function lastWeekday(y,m,wd){ var d=new Date(y,m+1,0);
    while(d.getDay()!==wd) d.setDate(d.getDate()-1); return d; }
  function holidays(y){
    var l=[new Date(y,0,1), nthWeekday(y,0,1,3), nthWeekday(y,1,1,3), lastWeekday(y,4,1),
           new Date(y,5,19), new Date(y,6,4), nthWeekday(y,8,1,1), nthWeekday(y,9,1,2),
           new Date(y,10,11), nthWeekday(y,10,4,4), new Date(y,11,25)];
    var o={}; for(var i=0;i<l.length;i++) o[l[i].getFullYear()+'-'+l[i].getMonth()+'-'+l[i].getDate()]=1;
    return o;
  }
  var _hol={};
  function isOff(d){
    if(d.getDay()===0||d.getDay()===6) return true;
    var y=d.getFullYear(); if(!_hol[y]) _hol[y]=holidays(y);
    return !!_hol[y][y+'-'+d.getMonth()+'-'+d.getDate()];
  }
  function cutoffFor(y,m){ var d=new Date(y,m,11); while(isOff(d)) d.setDate(d.getDate()+1); return d; }
  function cutoffList(n,now){
    now=now||new Date(); var out=[],y=now.getFullYear(),m=now.getMonth();
    if(now.getDate()>10){ m++; }
    for(var i=0;i<n;i++){ var mm=m+i, yy=y+Math.floor(mm/12); mm=((mm%12)+12)%12;
      out.push({due:new Date(yy,mm,10), cut:cutoffFor(yy,mm)}); }
    return out;
  }
  function boardFor(y,m){ return nthWeekday(y,m,2,1); }     /* first Tuesday */
  function nextBoard(now){
    now=now||new Date();
    var t=boardFor(now.getFullYear(),now.getMonth()), end=new Date(t); end.setHours(18,0,0,0);
    if(now>end){ var m=now.getMonth()+1, y=now.getFullYear()+Math.floor(m/12); t=boardFor(y,m%12); }
    return t;
  }
  function boardList(n,now){
    var out=[],d=nextBoard(now);
    for(var i=0;i<n;i++){ var m=d.getMonth()+i, y=d.getFullYear()+Math.floor(m/12);
      out.push(boardFor(y,((m%12)+12)%12)); }
    return out;
  }
  function fLong(d){ return DAY[d.getDay()]+', '+MON[d.getMonth()]+' '+d.getDate(); }
  function fShort(d){ return DAY[d.getDay()].slice(0,3)+', '+MON[d.getMonth()].slice(0,3)+' '+d.getDate()+', '+d.getFullYear(); }
  function fMD(d){ return MON[d.getMonth()].slice(0,3)+' '+d.getDate(); }

  function renderDates(){
    var b=nextBoard();
    setText('wdBoardWhen', fLong(b)+' at 6:00 p.m.');
    setText('wdAgendaPosts', (function(){ var a=new Date(b); a.setDate(a.getDate()-4); return DAY[a.getDay()]+', '+fMD(a); })());

    var ul=document.getElementById('wdCutoffList');
    if(ul){ var rows=cutoffList(6), h='';
      for(var i=0;i<rows.length;i++)
        h+='<li><span class="k">'+MON[rows[i].due.getMonth()]+'</span>'
          +'<span class="v">Due '+fMD(rows[i].due)+' &middot; cut-off '+DAY[rows[i].cut.getDay()]+' '+fMD(rows[i].cut)+'</span></li>';
      ul.innerHTML=h;
    }
    var bl=document.getElementById('wdBoardUpcoming');
    if(bl){ var ms=boardList(4), h2='';
      for(var j=0;j<ms.length;j++)
        h2+='<li><span class="w">'+fShort(ms[j])+'</span><span class="p">Regular Meeting &middot; 6:00 p.m. &middot; Town Hall</span></li>';
      bl.innerHTML=h2;
    }
  }

  /* ---- photos ------------------------------------------------------------ */
  function applyPhoto(imgId, photo, figId, capId){
    var im=document.getElementById(imgId); if(!im) return;
    var fig=figId?document.getElementById(figId):null;
    if(!photo) return;
    if(photo.remove){ if(fig) fig.hidden=true; else im.hidden=true; return; }
    if(fig) fig.hidden=false; im.hidden=false;
    if(photo.src){ var real=resolveSrc(photo.src); if(!real) return; im.removeAttribute('srcset'); if(photo.srcset) im.setAttribute('srcset',photo.srcset); if(photo.sizes) im.setAttribute('sizes',photo.sizes);
      im.src=real; if(photo.w) im.width=photo.w; if(photo.h) im.height=photo.h; }
    if(photo.alt!=null) im.alt=photo.alt;
    if(photo.pos) im.style.objectPosition=photo.pos;
    var cap=capId?document.getElementById(capId):null;
    if(cap&&photo.src){ var c=photo.credit, txt=(photo.cap||'').trim(); if(c&&c.by){ txt=(txt?txt+' ':'')+'Photo: '+c.by+(c.lic?', '+c.lic:''); } cap.textContent=txt; }
  }
  function previewStrip(){
    if(!isPreview()||document.querySelector('.wd-preview')) return;
    var el=document.createElement('div'); el.className='wd-preview';
    el.innerHTML='Previewing the unpublished draft. Residents see the published version. <a href="admin.html" id="wdBackToEditor">Back to the editor</a>';
    el.querySelector('#wdBackToEditor').addEventListener('click',function(ev){ try{ if(window.opener&&!window.opener.closed){ ev.preventDefault(); window.opener.focus(); window.close(); } }catch(e){} });
    var anchor=document.querySelector('.concept'); if(anchor&&anchor.parentNode) anchor.parentNode.insertBefore(el,anchor.nextSibling); else document.body.insertBefore(el,document.body.firstChild);
  }
  function rewritePreviewLinks(){ if(!isPreview()) return;
    document.querySelectorAll('a[href]').forEach(function(a){ var h=a.getAttribute('href')||''; if(/^(https?:|mailto:|tel:|#|javascript:)/i.test(h)||/admin\.html/.test(h)||!/\.html(\?[^#]*)?(#|$)/.test(h)||/preview=1/.test(h)) return;
      a.setAttribute('href', h.indexOf('?')>-1 ? h.replace(/\?/, '?preview=1&') : h.replace(/(\.html)(#.*)?$/, '$1?preview=1$2')); });
  }
  function paras(t){ return String(t||'').split(/\n\s*\n/).map(function(p){ return p.trim(); }).filter(Boolean).map(function(p){ return '<p>'+esc(p).replace(/\n/g,'<br>')+'</p>'; }).join(''); }
  function sortNew(a,b){ return (newsTime(b)-newsTime(a)); }

  /* ---- stories ----------------------------------------------------------- */
  function storyLink(s){ return 'story.html?s='+encodeURIComponent(s.id||'')+(isPreview()?'&preview=1':''); }
  function renderStories(d){
    var host=document.getElementById('wdStories'); if(!host) return;
    var list=(d.stories||[]).filter(function(s){return s&&s.t;}).slice().sort(sortNew);
    if(!list.length){ host.innerHTML='<p class="empty">No stories have been published yet.</p>'; return; }
    host.innerHTML=list.map(function(s){ var ph=s.photo&&resolveSrc(s.photo.src)?'<img src="'+esc(resolveSrc(s.photo.src))+'" alt="'+esc(s.photo.alt||s.photo.cap||'')+'"'+(s.photo.pos?' style="object-position:'+esc(s.photo.pos)+'"':'')+'>':'';
      return '<article class="st">'+ph+'<div class="stb">'+(s.d?'<p class="d">'+esc(fmtDate(s.d))+'</p>':'')+'<h2><a href="'+storyLink(s)+'">'+esc(s.t)+'</a></h2>'+(s.sum?'<p>'+esc(s.sum)+'</p>':'')+'<a class="more" href="'+storyLink(s)+'">Read the story <span aria-hidden="true">&rarr;</span></a></div></article>'; }).join('');
  }
  function renderStory(d){
    var host=document.getElementById('wdStory'); if(!host) return;
    var id=(new URLSearchParams(location.search)).get('s')||''; var s=(d.stories||[]).filter(function(x){return x&&x.id===id;})[0];
    if(!s){ return; }
    document.title=s.t+' — Town of Decatur, Mississippi';
    var h1=document.querySelector('.phero h1'); if(h1) h1.textContent=s.t;
    var ph=s.photo&&resolveSrc(s.photo.src)?'<figure style="margin:0 0 18px"><img src="'+esc(resolveSrc(s.photo.src))+'" alt="'+esc(s.photo.alt||s.photo.cap||'')+'">'+(s.photo.cap?'<figcaption class="cap">'+esc(s.photo.cap)+'</figcaption>':'')+'</figure>':'';
    host.innerHTML=(s.d?'<p class="d">'+esc(fmtDate(s.d))+'</p>':'')+ph+(s.sum?'<p><b>'+esc(s.sum)+'</b></p>':'')+paras(s.body)+'<p><a href="stories.html'+(isPreview()?'?preview=1':'')+'">All stories</a></p>';
  }

  /* ---- events (town calendar) -------------------------------------------- */
  function renderEvents(d){
    var host=document.getElementById('wdEvents'); if(!host) return;
    var today=new Date(); today.setHours(0,0,0,0);
    var list=(d.events||[]).filter(function(e){return e&&e.t&&e.d;}).map(function(e){ var dd=localDate(e.d); return {e:e,t:dd?dd.getTime():NaN}; }).filter(function(x){return !isNaN(x.t)&&x.t>=today.getTime();}).sort(function(a,b){return a.t-b.t;});
    if(!list.length){ host.innerHTML='<p class="empty">No events are posted at the moment.</p>'; return; }
    host.innerHTML=list.map(function(x){ var e=x.e, dt=new Date(x.t);
      return '<div class="ev"><div class="cal" aria-hidden="true"><span class="cm">'+MON[dt.getMonth()].slice(0,3)+'</span><span class="cd">'+dt.getDate()+'</span><span class="cw">'+DAY[dt.getDay()].slice(0,3)+'</span></div>'+
        '<div><h3>'+esc(e.t)+'</h3><p class="evm">'+esc(fmtDate(e.d))+(e.time?' · '+esc(e.time):'')+(e.where?' · '+esc(e.where):'')+'</p>'+(e.b?'<p>'+esc(e.b)+'</p>':'')+(safeUrl(e.link)?'<p><a href="'+esc(safeUrl(e.link))+'">'+esc(e.lt||'Details')+'</a></p>':'')+'</div></div>'; }).join('');
  }

  /* ---- apply everything --------------------------------------------------- */
  function apply(){
    var d=load();
    previewStrip();
    renderBanner(d);
    setText('wdHero1',d.hero.l1); setText('wdHero2',d.hero.l2); setText('wdLede',d.hero.lede);
    applyPhoto('wdHeroImg',d.hero.photo,'wdHeroFig','wdHeroCap');
    (d.quick||[]).forEach(function(q,i){ setText('wdQ'+(i+1)+'t',q.t); setText('wdQ'+(i+1)+'d',q.d); });
    setText('wdMeetTime',d.meeting.time); setText('wdMeetWhere',d.meeting.where);
    var ex=d.explore||{}, f=ex.feat||{};
    setText('wdExFl',f.l); setText('wdExFt',f.t); setText('wdExFd',f.d); var fa=document.getElementById('wdExFa'); if(fa&&safeUrl(f.url)) fa.href=safeUrl(f.url); applyPhoto('wdExFimg',f.photo,'wdExFfig');
    (ex.items||[]).forEach(function(it,i){ var n=i+1; setText('wdEx'+n+'l',it.l); setText('wdEx'+n+'t',it.t); var dd=document.getElementById('wdEx'+n+'d'); if(dd){ if(it.d){ dd.textContent=it.d; dd.hidden=false; } else if(!dd.textContent) dd.hidden=true; }
      var a=document.getElementById('wdEx'+n+'a'); if(a&&safeUrl(it.url)) a.href=safeUrl(it.url); applyPhoto('wdEx'+n+'img',it.photo,'wdEx'+n+'fig'); });
    var dp=d.dephotos||{}; applyPhoto('wdDeptImgPolice',dp.police,'wdDeptFigPolice'); applyPhoto('wdDeptImgFire',dp.fire,'wdDeptFigFire'); applyPhoto('wdDeptImgWorks',dp.works,'wdDeptFigWorks');
    var hp=document.getElementById('wdHallPhoto'), hm=document.getElementById('wdHallMark'); if(hp&&d.hall&&d.hall.photo&&resolveSrc(d.hall.photo.src)&&!d.hall.photo.remove){ hp.src=resolveSrc(d.hall.photo.src); hp.alt=d.hall.photo.alt||'Decatur Town Hall'; if(d.hall.photo.pos) hp.style.objectPosition=d.hall.photo.pos; hp.hidden=false; if(hm) hm.style.display='none'; }
    var ft=d.footer||{}; setText('wdFootAddr',ft.addr); setText('wdFootHours',ft.hours); setText('wdFootPhone',ft.phone); var fe=document.getElementById('wdFootEmail'); if(fe&&ft.email){ fe.textContent=ft.email; fe.href='mailto:'+ft.email; }
    if(ft.addr){ var ci=ft.addr.indexOf(', '), a1=ci>-1?ft.addr.slice(0,ci):ft.addr, a2=ci>-1?ft.addr.slice(ci+2):''; setText('wdHallAddr',a1); var h2=document.getElementById('wdHallAddr2'); if(h2) h2.textContent=a2; var ca=document.getElementById('wdContactAddr'); if(ca) ca.innerHTML=esc(a1)+(a2?'<br>'+esc(a2):''); }
    if(ft.phone){ var tel='tel:'+ft.phone.replace(/\D/g,''); setText('wdHallPhone',ft.phone); var hc=document.getElementById('wdHallCall'); if(hc) hc.href=tel; var cp=document.getElementById('wdContactPhone'); if(cp){ cp.textContent=ft.phone; cp.href=tel; } if(fe&&!ft.email){} }
    if(ft.email){ setText('wdHallEmail',ft.email); var he=document.getElementById('wdHallEmailA'); if(he) he.href='mailto:'+ft.email; var ce=document.getElementById('wdContactEmail'); if(ce){ ce.textContent=ft.email; ce.href='mailto:'+ft.email; } }
    var pg=document.body.getAttribute('data-page'), pd=(d.pages||{})[pg];
    if(pd){ var le=document.getElementById('wdPageLede'); if(le&&pd.lede){ le.textContent=pd.lede; le.hidden=false; }
      var co=document.getElementById('wdPageCallout'); if(co){ if(pd.callout){ co.innerHTML=paras(pd.callout); co.hidden=false; } else co.hidden=true; }
      applyPhoto('wdPageImg',pd.photo,'wdPageFig','wdPageCap'); }
    setText('wdGarbage',d.week.garbage); setText('wdGarbageNote',d.week.garbageNote);
    setText('wdLimbs',d.week.limbs);     setText('wdLimbsNote',d.week.limbsNote);
    setText('wdDue',d.week.due);         setText('wdDueNote',d.week.dueNote);
    setText('wdHours',d.week.hours);
    setText('wdCutoffs', d.week.cutoffs || cutoffList(3).map(function(r){
      return DAY[r.cut.getDay()]+', '+MON[r.cut.getMonth()]+' '+r.cut.getDate(); }).join(' · '));
    renderDates();
    renderNews(d);
    renderDepts(d);
    renderStories(d); renderStory(d); renderEvents(d);
    rewritePreviewLinks();
    try{ document.dispatchEvent(new CustomEvent('wd:applied')); }catch(e){}
  }

  window.WDSite={KEY:KEY,DRAFT:DRAFT,REV:REV,USER:USER,META:META,DEFAULTS:DEFAULTS,load:load,loadDraft:loadDraft,loadPublished:loadPublished,
    save:save,saveDraft:saveDraft,hasDraft:hasDraft,discardDraft:discardDraft,publish:publish,revisions:revisions,restore:restore,meta:meta,user:user,setUser:setUser,
    reset:reset,usage:usage,merge:merge,PAGES:PAGES,safeUrl:safeUrl,localDate:localDate,MEDIA:MEDIA,mediaStore:mediaStore,setMedia:setMedia,deleteMedia:deleteMedia,resolveSrc:resolveSrc,apply:apply,LEVELS:LEVELS,isPreview:isPreview,fmtDate:fmtDate,esc:esc,
    nextBoard:nextBoard,boardList:boardList,cutoffList:cutoffList,renderDates:renderDates};

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply);
  else apply();

  /* live update when the editor publishes (or previews) in another tab */
  window.addEventListener('storage',function(e){ if(e.key===KEY||e.key===MEDIA||(isPreview()&&e.key===DRAFT)) apply(); });
})();
