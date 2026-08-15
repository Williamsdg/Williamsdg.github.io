/* WCOPA concept — mobile navigation (self-contained: injects styles, button & panel) */
(function(){
  var nav=document.querySelector('nav.site')||document.querySelector('nav');
  if(!nav||document.getElementById('mnavBtn'))return;
  var groups=nav.querySelectorAll('.nav-group');
  if(!groups.length)return;

  var style=document.createElement('style');
  style.textContent=
  '.mnav-btn{display:none;width:44px;height:44px;border:1px solid rgba(255,255,255,.28);background:transparent;cursor:pointer;position:relative;flex:none;padding:0}'+
  '.mnav-btn span{position:absolute;left:12px;right:12px;height:1.5px;background:#F2D58A;transition:.3s}'+
  '.mnav-btn span:nth-child(1){top:15px}.mnav-btn span:nth-child(2){top:21px}.mnav-btn span:nth-child(3){top:27px}'+
  'body.mnav-open .mnav-btn span:nth-child(1){top:21px;transform:rotate(45deg)}'+
  'body.mnav-open .mnav-btn span:nth-child(2){opacity:0}'+
  'body.mnav-open .mnav-btn span:nth-child(3){top:21px;transform:rotate(-45deg)}'+
  '.mnav{display:none;position:fixed;inset:0;z-index:49;background:rgba(7,20,38,.985);overflow-y:auto;-webkit-overflow-scrolling:touch;padding:120px 30px 60px}'+
  'body.mnav-open .mnav{display:block}'+
  'body.mnav-open{overflow:hidden}'+
  '.mnav h5{font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#D6A84B;margin:30px 0 8px}'+
  '.mnav h5:first-child{margin-top:0}'+
  '.mnav a{display:block;padding:13px 0;font-family:Anton,sans-serif;font-size:24px;letter-spacing:.04em;text-transform:uppercase;color:#fff;border-bottom:1px solid rgba(255,255,255,.08);text-decoration:none}'+
  '.mnav a:active{color:#F2D58A}'+
  '.mnav a.soon{opacity:.35;pointer-events:none;font-size:17px;font-family:"JetBrains Mono",monospace;letter-spacing:.14em}'+
  '.mnav a.soon:after{content:"soon";margin-left:10px;font-size:8px;letter-spacing:.12em;border:1px solid currentColor;padding:2px 6px;border-radius:99px;vertical-align:middle}'+
  '.mnav .mnav-cc{margin-top:38px;display:inline-block;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.2em;border:1px solid rgba(214,168,75,.55);color:#F2D58A;padding:15px 22px;text-transform:uppercase;border-bottom:1px solid rgba(214,168,75,.55)}'+
  '@media(max-width:1080px){.mnav-btn{display:block}}'+
  'html,body{overflow-x:hidden}'+
  '@media(max-width:520px){nav .wrap{padding:0 14px}.nav-ctas{gap:8px}.nav-cta{padding:12px 13px;font-size:10px;letter-spacing:.14em}.brand-sub{display:none}.brand{gap:10px}}';
  document.head.appendChild(style);

  var btn=document.createElement('button');
  btn.className='mnav-btn';btn.id='mnavBtn';btn.setAttribute('aria-label','Menu');
  btn.innerHTML='<span></span><span></span><span></span>';
  var ctas=nav.querySelector('.nav-ctas');
  if(ctas)ctas.insertBefore(btn,ctas.firstChild);else nav.querySelector('.wrap').appendChild(btn);

  var panel=document.createElement('div');
  panel.className='mnav';
  var html='';
  groups.forEach(function(g){
    html+='<h5>'+g.querySelector('button').textContent+'</h5>';
    g.querySelectorAll('.dd a').forEach(function(a){
      html+='<a href="'+a.getAttribute('href')+'"'+(a.classList.contains('soon')?' class="soon"':'')+'>'+a.innerHTML+'</a>';
    });
  });
  var cc=nav.querySelector('.nav-cc');
  if(cc)html+='<a class="mnav-cc" href="'+cc.getAttribute('href')+'">'+cc.textContent+'</a>';
  panel.innerHTML=html;
  document.body.appendChild(panel);

  btn.onclick=function(){document.body.classList.toggle('mnav-open')};
  panel.addEventListener('click',function(e){if(e.target.tagName==='A')document.body.classList.remove('mnav-open')});
})();
