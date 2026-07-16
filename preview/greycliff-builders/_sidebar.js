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

  // ---- role-based navigation ----
  // Layer 1 (role) drives the sidebar; the switcher persists via localStorage.
  var role = 'owner';
  try { role = localStorage.getItem('gc-role') || 'owner'; } catch(e){}
  try {
    var qsRole = new URLSearchParams(window.location.search).get('role');
    if (qsRole) { role = qsRole; localStorage.setItem('gc-role', qsRole); }
  } catch(e){}

  var ROLES = {
    owner: {label:'Owner', home:'dashboard.html', user:['W','Wes Greycliff','7 active builds','\u26a0 2 items need attention'], nav:[
      ['Today', [
        ['overview','dashboard.html','Overview'],
        ['inbox','dashboard.html#attention','Inbox','4',1],
        ['tasks','dashboard.html#today','Tasks','8'],
        ['calendar','calendar.html','Calendar']]],
      ['Projects', [
        ['builds','builds.html','Builds','7'],
        ['daily-logs','daily-logs.html','Daily Logs'],
        ['punch-lists','punch-lists.html','Punch Lists'],
        ['inspections','documents.html','Inspections'],
        ['photos','daily-logs.html','Photos']]],
      ['Homeowners', [
        ['client-portal','client.html','Portal'],
        ['messages','dashboard.html#attention','Messages','4',1],
        ['selections','selections.html','Selections','5'],
        ['change-orders','change-orders.html','Change Orders','3',1],
        ['friday-letter','friday-letter.html','Friday Letters','due',1]]],
      ['Financial', [
        ['budget','budget.html','Draws','2',1],
        ['pipeline','pipeline.html','Pipeline'],
        ['reports','reports.html','Intelligence']]],
      ['Operations', [
        ['contractors','contractors.html','Trades'],
        ['permits','documents.html','Permits','2',1],
        ['documents','documents.html','Documents'],
        ['warranty','warranty.html','Warranty']]],
      ['\u2728 Site Office AI', [
        ['ai-brief','dashboard.html#briefing','Morning Brief'],
        ['ai-ask','dashboard.html#ask','Ask AI'],
        ['ai-letter','friday-letter.html','Generate Letter']]]
    ]},
    ops: {label:'Operations Director', home:'role-operations.html', user:['M','Mason Greycliff','Director of Construction','7 builds \u00b7 3 supers \u00b7 3 risks'], nav:[
      ['Today', [
        ['overview','role-operations.html','Operations Overview'],
        ['brief','role-operations.html#brief','Morning Brief']]],
      ['Field', [
        ['builds','builds.html','Build Health','7'],
        ['field','role-operations.html#field','Field Updates','3',1],
        ['inspections','documents.html','Inspections','2',1],
        ['permits','documents.html','Permits','2',1]]],
      ['People', [
        ['supers','role-operations.html#supers','Superintendents'],
        ['contractors','contractors.html','Trade Partners'],
        ['capacity','role-operations.html#capacity','Capacity Planning','1',1]]],
      ['Risk', [
        ['risks','role-operations.html#risks','Schedule Risks','3',1],
        ['warranty','warranty.html#escalations','Warranty Risks','2',1],
        ['portfolio','builds.html','Portfolio Health']]],
      ['\u2728 AI Command', [
        ['ai-ask','role-operations.html#brief','Ask AI'],
        ['forecast','role-operations.html#forecast','Weekly Forecast']]]
    ]},
    pm: {label:'Project Manager', home:'role-pm.html', user:['M','Marcus Mills','Project Manager \u00b7 2 builds \u00b7 4 approvals','\u26a0 8 open tasks'], nav:[
      ['My Day', [
        ['overview','role-pm.html','My Day'],
        ['actions','role-pm.html#actions','Action Items','8',1],
        ['calendar','calendar.html','Schedule']]],
      ['Projects', [
        ['b1','builds.html','Old Leeds Way','\u26a0',1],
        ['b2','builds.html','Pine Point','\u2713']]],
      ['Clients', [
        ['inbox','role-pm.html#actions','Inbox','2',1],
        ['selections','selections.html','Selections','3',1],
        ['change-orders','change-orders.html','Change Orders','2',1],
        ['friday-letter','friday-letter.html','Friday Letters']]],
      ['Operations', [
        ['documents','documents.html','Documents'],
        ['approvals','role-pm.html#approvals','Approvals','4',1]]],
      ['Financials', [
        ['budget','budget.html','Budget'],
        ['draws','budget.html','Draws']]]
    ]},
    superintendent: {label:'Superintendent', home:'role-super.html', user:['D','Diego Ruiz','Superintendent \u00b7 3 active sites','\u26a0 7 open tasks \u00b7 2 inspections this wk'], nav:[
      ['Today', [
        ['overview','role-super.html','Today'],
        ['actions','role-super.html#actions','Action Items','7',1]]],
      ['Field Work', [
        ['daily-logs','daily-logs.html','Daily Logs','2',1],
        ['photos','daily-logs.html','Photos'],
        ['punch-lists','punch-lists.html','Punch Lists'],
        ['inspections','documents.html','Inspections']]],
      ['Planning', [
        ['calendar','calendar.html','Schedule'],
        ['weather','role-super.html#weather','Weather','\u26c8',1],
        ['deliveries','role-super.html#deliveries','Deliveries','3']]],
      ['Communication', [
        ['inbox','role-super.html#actions','Inbox','2',1],
        ['homeowners','client.html','Homeowners'],
        ['trades','contractors.html','Trade Partners']]],
      ['My Sites', [
        ['s1','build-cahaba-ridge.html','Cahaba Ridge','52%'],
        ['s2','builds.html','Sycamore','96%'],
        ['s3','builds.html','Brook House','Y2'],
        ['s4','builds.html','+ 2 more']]]
    ]},
    designer: {label:'Designer', home:'role-designer.html', user:['S','Sarah Mitchell','Lead Designer \u00b7 5 active projects','\u26a0 7 items need attention'], nav:[
      ['Design Studio', [
        ['overview','role-designer.html','Design Overview'],
        ['attention','role-designer.html#attention','Needs Attention','7',1],
        ['projects','selections.html','Design Projects'],
        ['calendar','calendar.html','Appointments','4'],
        ['selections','selections.html','Selections','5',1],
        ['approvals','change-orders.html','Approvals','3',1],
        ['moodboards','role-designer.html','Mood Boards'],
        ['specs','documents.html','Specifications'],
        ['library','role-designer.html','Product Library'],
        ['allowances','selections.html','Allowance Tracker','2',1]]]
    ]},
    accounting: {label:'Accounting', home:'role-accounting.html', user:['M','Megan Cole','Controller \u00b7 $842k outstanding','\u26a0 17 items need attention'], nav:[
      ['Accounting', [
        ['overview','role-accounting.html','Accounting Overview'],
        ['attention','role-accounting.html#attention','Needs Attention','17',1]]],
      ['Receivables', [
        ['budget','budget.html','Draws','3',1],
        ['change-orders','change-orders.html','Change Orders','2',1],
        ['payments','budget.html','Client Payments']]],
      ['Payables', [
        ['invoices','role-accounting.html#attention','Invoices','8',1],
        ['vendors','contractors.html','Vendor Payments','4',1]]],
      ['Control', [
        ['budgets','budget.html','Budgets'],
        ['recon','role-accounting.html#reconciliation','Reconciliation','2',1],
        ['reports','reports.html','Reports'],
        ['documents','documents.html','Financial Documents']]]
    ]},
    warranty: {label:'Warranty Manager', home:'warranty.html', user:['D','Diego Ruiz','Warranty Manager \u00b7 23 homes','\u26a0 8 need action'], nav:[
      ['Warranty', [
        ['warranty','warranty.html','Warranty Overview'],
        ['needs-action','warranty.html#needs-action','Needs Action','8',1],
        ['escalations','warranty.html#escalations','Escalations','2',1]]],
      ['Operations', [
        ['tickets','warranty.html#homes','Tickets','6'],
        ['walks','warranty.html#walks','Scheduled Walks','4'],
        ['dispatch','warranty.html#dispatch','Trade Dispatch','3',1]]],
      ['Homeowners', [
        ['closings','punch-lists.html','Recent Closings'],
        ['homes','warranty.html#homes','Active Warranty Homes','23'],
        ['satisfaction','warranty.html#satisfaction','Customer Satisfaction']]],
      ['Analytics', [
        ['reports','reports.html','Reports']]]
    ]},
  };
  var R = ROLES[role] || ROLES.owner;

  // role switcher — the demo's centerpiece
  html += '<div class="side-switch">'
       +  '<label>View as</label>'
       +  '<select id="roleSwitch">';
  ['owner','ops','pm','superintendent','designer','accounting','warranty'].forEach(function(k){
    html += '<option value="' + k + '"' + (k === role ? ' selected' : '') + '>' + ROLES[k].label + '</option>';
  });
  html += '</select></div>';

  R.nav.forEach(function(sec){
    html += section(sec[0]);
    html += nav(sec[1].map(function(it){
      return {key: it[0], href: it[1], label: it[2], count: it[3], warn: !!it[4]};
    }));
  });

  if (role === 'owner') {
    html += '<div class="side-utility">'
         +   '<a href="team.html"' + (active === 'team' ? ' class="active"' : '') + '>Team & Permissions</a>'
         +   '<span class="side-utility-dot">\u00b7</span>'
         +   '<a href="settings.html"' + (active === 'settings' ? ' class="active"' : '') + '>Settings</a>'
         + '</div>';
  }

  html += '<div class="side-user"' + (role === 'owner' ? '' : ' style="margin-top:auto"') + '>'
       +   '<div class="side-avatar">' + R.user[0] + '</div>'
       +   '<div>'
       +     '<div class="side-user-name">' + R.user[1] + '</div>'
       +     '<div class="side-user-role">' + R.user[2] + '</div>'
       +     '<div class="side-user-role" style="color:#e0987a;margin-top:1px">' + R.user[3] + '</div>'
       +   '</div>'
       + '</div>';

  var el = document.getElementById('side');
  if (el) el.innerHTML = html;

  var sw = document.getElementById('roleSwitch');
  if (sw) sw.addEventListener('change', function(){
    try { localStorage.setItem('gc-role', sw.value); } catch(e){}
    window.location.href = ROLES[sw.value].home;
  });

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

/* --- sliding-pill segmented controls (.toolbar-tabs) ---
   Upgrades every toolbar tab group into an interactive segmented control:
   an indicator pill glides between tabs instead of the background jumping.
   Adds tablist ARIA roles and arrow-key navigation. */
(function(){
  [].slice.call(document.querySelectorAll('.toolbar-tabs')).forEach(function(list){
    var tabs = [].slice.call(list.querySelectorAll('a'));
    if (!tabs.length) return;
    // some pages hard-code the active look inline — class-based styles take over
    tabs.forEach(function(t){
      t.style.removeProperty('background');
      t.style.removeProperty('color');
    });

    var pill = document.createElement('span');
    pill.className = 'tt-pill';
    list.insertBefore(pill, list.firstChild);
    list.classList.add('tt-enhanced');

    function place(el, instant){
      if (!el) { pill.style.opacity = '0'; return; }
      if (instant) pill.style.transition = 'none';
      pill.style.opacity = '1';
      pill.style.left = el.offsetLeft + 'px';
      pill.style.top = el.offsetTop + 'px';
      pill.style.width = el.offsetWidth + 'px';
      pill.style.height = el.offsetHeight + 'px';
      if (instant) requestAnimationFrame(function(){ pill.style.transition = ''; });
    }

    function activate(a){
      tabs.forEach(function(t){
        t.classList.toggle('active', t === a);
        t.setAttribute('aria-selected', t === a ? 'true' : 'false');
      });
      place(a);
    }

    list.setAttribute('role', 'tablist');
    tabs.forEach(function(t){
      t.setAttribute('role', 'tab');
      t.setAttribute('tabindex', '0');
      t.setAttribute('aria-selected', t.classList.contains('active') ? 'true' : 'false');
    });

    place(list.querySelector('a.active'), true);
    window.addEventListener('resize', function(){ place(list.querySelector('a.active'), true); });
    // fonts loading late shifts tab widths — re-place once they settle
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function(){ place(list.querySelector('a.active'), true); });
    }

    list.addEventListener('click', function(e){
      var a = e.target.closest('a');
      if (!a || !list.contains(a)) return;
      var href = a.getAttribute('href');
      if (href && href !== '#') return; // real link — let it navigate
      e.preventDefault();
      activate(a);
    });

    list.addEventListener('keydown', function(e){
      var a = e.target.closest('a');
      if (!a) return;
      var idx = tabs.indexOf(a), next = null;
      if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Enter' || e.key === ' ') next = a;
      else return;
      e.preventDefault();
      next.focus();
      activate(next);
    });
  });
})();
