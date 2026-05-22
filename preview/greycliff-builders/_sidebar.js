/* _sidebar.js — Greycliff Site Office shared sidebar + drawer
   Usage in each tab page:
     <aside class="side" id="side"></aside>
     <script src="_sidebar.js" data-active="daily-logs"></script>
   The script reads data-active and renders the sidebar with that
   nav item highlighted. Also wires the hamburger/close behavior. */
(function(){
  var script = document.currentScript;
  var active = (script && script.dataset.active) || '';

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

  html += section('Today');
  html += nav([
    {key:'overview', href:'dashboard.html', label:'Overview'},
    {key:'daily-logs', href:'daily-logs.html', label:'Daily Logs', count:'7'},
    {key:'friday-letter', href:'friday-letter.html', label:'Friday Letter', count:'due', warn:true},
    {key:'calendar', href:'calendar.html', label:'Calendar'}
  ]);

  html += section('Builds');
  html += nav([
    {key:'builds', href:'builds.html', label:'All Active', count:'7'},
    {key:'build-cahaba-ridge', href:'build-cahaba-ridge.html', label:'Cahaba Ridge'},
    {key:'build-pine-point', href:'build-cahaba-ridge.html#pine-point', label:'Pine Point'},
    {key:'build-old-leeds', href:'build-cahaba-ridge.html#old-leeds', label:'Old Leeds Way', warn:true},
    {key:'builds', href:'builds.html', label:'+ 4 more'}
  ]);

  html += section('Operations');
  html += nav([
    {key:'contractors', href:'contractors.html', label:'Contractors'},
    {key:'change-orders', href:'change-orders.html', label:'Change Orders', count:'3', warn:true},
    {key:'punch-lists', href:'punch-lists.html', label:'Punch Lists'},
    {key:'selections', href:'selections.html', label:'Selections'},
    {key:'documents', href:'documents.html', label:'Documents'},
    {key:'budget', href:'budget.html', label:'Budget & Draws'},
    {key:'warranty', href:'warranty.html', label:'Warranty'}
  ]);

  html += section('Company');
  html += nav([
    {key:'team', href:'team.html', label:'Team'},
    {key:'pipeline', href:'pipeline.html', label:'Pipeline'},
    {key:'reports', href:'reports.html', label:'Reports'},
    {key:'settings', href:'settings.html', label:'Settings'}
  ]);

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
