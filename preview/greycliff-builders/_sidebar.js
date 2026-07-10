/* _sidebar.js — Greycliff Site Office shared sidebar + drawer
   Usage in each tab page:
     <aside class="side" id="side"></aside>
     <script src="_sidebar.js" data-active="daily-logs"></script>
   The script reads data-active and renders the sidebar with that
   nav item highlighted. Also wires the hamburger/close behavior. */
(function(){
  var script = document.currentScript;
  var active = (script && script.dataset.active) || '';
  // Individual build pages highlight the Builds item rather than their own entry
  if (active.indexOf('build-') === 0) active = 'builds';

  var html = ''
    + '<div class="side-mobile-head">'
    +   '<div style="display:flex;align-items:center;gap:10px">'
    +     '<div class="side-mark">G</div>'
    +     '<div><div class="side-brand-name">Greycliff <em>Builders</em></div>'
    +     '<div class="side-brand-sub">The Site Office</div></div>'
    +   '</div>'
    +   '<button class="side-close" aria-label="Close menu" onclick="document.body.classList.remove(\'drawer-open\')">×</button>'
    + '</div>'
    + '<div class="side-brand">'
    +   '<div class="side-mark">G</div>'
    +   '<div>'
    +     '<div class="side-brand-name">Greycliff <em>Builders</em></div>'
    +     '<div class="side-brand-sub">The Site Office</div>'
    +   '</div>'
    + '</div>';

  function section(title){ return '<div class="side-section">'+title+'</div>'; }
  function nav(items){
    var out = '<nav class="side-nav">';
    items.forEach(function(it){
      var cls = 'side-bullet' + (it.warn ? ' warn' : '');
      var act = (it.key === active) ? ' class="active"' : '';
      var cnt = it.count ? '<span class="side-count'+(it.warn?' warn':'')+'">'+it.count+'</span>' : '';
      out += '<a href="'+it.href+'"'+act+'><span class="'+cls+'"></span>'+it.label+cnt+'</a>';
    });
    return out + '</nav>';
  }

  html += section('Build');
  html += nav([
    {key:'overview', href:'dashboard.html', label:'Overview'},
    {key:'builds', href:'builds.html', label:'Builds', count:'7'},
    {key:'daily-logs', href:'daily-logs.html', label:'Daily Logs'},
    {key:'punch-lists', href:'punch-lists.html', label:'Punch Lists'},
    {key:'calendar', href:'calendar.html', label:'Calendar'}
  ]);

  html += section('Clients');
  html += nav([
    {key:'client-portal', href:'client.html', label:'Homeowner Portal'},
    {key:'selections', href:'selections.html', label:'Selections', count:'5'},
    {key:'change-orders', href:'change-orders.html', label:'Change Orders', count:'3', warn:true},
    {key:'friday-letter', href:'friday-letter.html', label:'Friday Letter', count:'due', warn:true}
  ]);

  html += section('Money');
  html += nav([
    {key:'budget', href:'budget.html', label:'Budget & Draws', count:'2', warn:true},
    {key:'pipeline', href:'pipeline.html', label:'Pipeline'},
    {key:'reports', href:'reports.html', label:'Reports'}
  ]);

  html += section('Office');
  html += nav([
    {key:'contractors', href:'contractors.html', label:'Trade Partners'},
    {key:'documents', href:'documents.html', label:'Documents & Permits'},
    {key:'warranty', href:'warranty.html', label:'Warranty'}
  ]);

  html += '<div class="side-utility">'
       +   '<a href="team.html"'+(active==='team'?' class="active"':'')+'>Team</a>'
       +   '<span class="side-utility-dot">·</span>'
       +   '<a href="settings.html"'+(active==='settings'?' class="active"':'')+'>Settings</a>'
       + '</div>';

  html += '<div class="side-user">'
       +   '<div class="side-avatar">W</div>'
       +   '<div>'
       +     '<div class="side-user-name">Wes Greycliff</div>'
       +     '<div class="side-user-role">President · Superintendent</div>'
       +   '</div>'
       + '</div>';

  var el = document.getElementById('side');
  if (el) el.innerHTML = html;

  // hamburger open / overlay close
  document.addEventListener('click', function(e){
    var ham = e.target.closest('.hamburger');
    if (ham) {
      document.body.classList.add('drawer-open');
      return;
    }
    // tap on overlay (body::before) — detect by clicking outside .side when drawer open
    if (document.body.classList.contains('drawer-open')) {
      if (!e.target.closest('.side') && !e.target.closest('.hamburger')) {
        document.body.classList.remove('drawer-open');
      }
    }
  });
})();

/* --- motion polish: scroll-reveal cards + KPI count-up ---
   Initial hidden state is applied here (not in CSS) so content stays
   visible if JS never runs. Everything is skipped under
   prefers-reduced-motion. Inline styles are cleared after the reveal
   so the CSS hover transitions take over cleanly. */
(function(){
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var cards = [].slice.call(document.querySelectorAll('.main .card'));
  cards.forEach(function(el){
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
  });

  function reveal(el, delay){
    el.style.transition = 'opacity .55s ease ' + delay + 'ms, transform .55s cubic-bezier(.22,1,.36,1) ' + delay + 'ms';
    requestAnimationFrame(function(){
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    el.addEventListener('transitionend', function done(e){
      if (e.propertyName !== 'transform') return;
      el.removeEventListener('transitionend', done);
      el.style.transition = el.style.opacity = el.style.transform = '';
    });
  }

  function countUp(el){
    var node = null;
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && /\d/.test(n.nodeValue)) { node = n; break; }
    }
    if (!node) return;
    var m = node.nodeValue.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!m) return;
    var prefix = m[1], raw = m[2], suffix = m[3];
    var target = parseFloat(raw.replace(/,/g, ''));
    var decimals = (raw.split('.')[1] || '').length;
    var commas = raw.indexOf(',') > -1;
    var start = null, dur = 900;
    function fmt(v){
      var s = v.toFixed(decimals);
      if (commas) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return prefix + s + suffix;
    }
    function tick(ts){
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      node.nodeValue = fmt(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var io = new IntersectionObserver(function(entries){
    var batch = 0;
    entries.forEach(function(entry){
      if (!entry.isIntersecting) return;
      var el = entry.target;
      io.unobserve(el);
      if (el.classList.contains('kpi-value')) { countUp(el); return; }
      reveal(el, Math.min(batch * 70, 350));
      batch++;
    });
  }, {rootMargin: '0px 0px -8% 0px', threshold: 0.05});

  cards.forEach(function(el){ io.observe(el); });
  [].slice.call(document.querySelectorAll('.kpi-value')).forEach(function(el){ io.observe(el); });
})();
