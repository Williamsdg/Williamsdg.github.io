/* Shared renderers — run by the build (to bake the pages) and again in the browser
   (to apply edits made in the staff dashboard). Pure functions: data in, HTML out. */
(function (root) {
  var IMG = 'https://img1.wsimg.com/isteam/ip/376cddf8-7865-464f-b0f9-69339fda12f0/';
  var PORTAL = 'https://app.iclasspro.com/portal/mountainbrookgymnastics';
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function parse(iso) { var p = String(iso || '').split('-'); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null; }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function md(isoStr, long) { var d = parse(isoStr); if (!d) return ''; return (long ? MON[d.getMonth()] : MON[d.getMonth()].slice(0, 3)) + ' ' + d.getDate(); }
  function range(a, b, long) {
    if (!b || b === a) return md(a, long);
    var x = parse(a), y = parse(b);
    if (!x || !y) return md(a, long);
    if (x.getMonth() === y.getMonth() && x.getFullYear() === y.getFullYear()) return md(a, long) + '–' + y.getDate();
    return md(a, long) + ' – ' + md(b, long);
  }
  function dow(isoStr) { var d = parse(isoStr); return d ? DOW[d.getDay()] : ''; }
  function year(isoStr) { var d = parse(isoStr); return d ? d.getFullYear() : ''; }
  function money(n) { return '$' + Number(n || 0).toLocaleString('en-US'); }
  function img(name, w) { return IMG + name + '/:/rs=w:' + (w || 800) + ',m'; }
  function find(list, id) { for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }

  /* single values, addressed by key — used for {{bind:key}} and [data-bind] */
  function text(site, key) {
    var f = site.flippin || {}, s;
    switch (key) {
      case 'regFee.single': return money(site.regFee.single);
      case 'regFee.family': return money(site.regFee.family);
      case 'gymYear': return site.gymYear;
      case 'flippin.date': return f.date ? dow(f.date) + ', ' + md(f.date, true) : 'To be announced';
      case 'flippin.short': return f.date ? md(f.date) : 'TBA';
      case 'flippin.price': return money(f.price);
      case 'flippin.sibling': return money(f.sibling);
      case 'flippin.time': return f.time;
      case 'flippin.ages': return f.ages;
    }
    var m = /^meet\.(\w+)$/.exec(key);
    if (m) { var mt = find(site.meets, m[1]); return mt && mt.start ? range(mt.start, mt.end, true) + ', ' + year(mt.start) : 'Dates to be announced'; }
    m = /^session\.(\w+)$/.exec(key);
    if (m) { s = find(site.sessions, m[1]); return s ? range(s.start, s.end) : ''; }
    return '';
  }

  var blocks = {
    announcement: function (site) {
      var a = site.announcement;
      if (!a || !a.on || !a.text) return '';
      return '<div class="annc"><span class="annc-dot" aria-hidden="true"></span><p>' + esc(a.text) +
        '</p><a href="' + PORTAL + '" target="_blank" rel="noopener">Register <span aria-hidden="true">→</span></a></div>';
    },

    sessions: function (site, today) {
      return '<div class="sess-grid">' + site.sessions.map(function (s) {
        var state = '';
        if (today) state = today > s.end ? 'Complete' : today >= s.start ? 'In session' : 'Enrolling now';
        return '<div class="sess"><div class="sess-top"><b>' + esc(s.name) + '</b>' +
          (state ? '<span class="tag ' + (state === 'Complete' ? 'tag-mute' : 'tag-live') + '">' + state + '</span>' : '') + '</div>' +
          '<div class="sess-range">' + range(s.start, s.end, true) + '</div>' +
          '<div class="sess-meta">' + esc(s.weeks) + ' weeks' + (s.note ? ' · ' + esc(s.note) : '') + '</div></div>';
      }).join('') + '</div>';
    },

    dates: function (site, today) {
      var list = site.dates.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      var nextMarked = false;
      return '<ul class="dates">' + list.map(function (d) {
        var past = today && (d.end || d.date) < today, next = false;
        if (today && !past && !nextMarked) { next = nextMarked = true; }
        var dt = parse(d.date);
        return '<li class="date-row' + (past ? ' past' : '') + (next ? ' next' : '') + ' k-' + esc(d.kind || 'info') + '">' +
          '<span class="date-chip"><i>' + (dt ? MON[dt.getMonth()].slice(0, 3) : '') + '</i><b>' +
          (dt ? dt.getDate() : '') + (d.end && d.end !== d.date ? '–' + parse(d.end).getDate() : '') + '</b></span>' +
          '<span class="date-label">' + esc(d.label) + (next ? ' <em class="tag tag-live">Next up</em>' : '') + '</span></li>';
      }).join('') + '</ul>';
    },

    pricing: function (site) {
      var progs = [];
      site.classTypes.forEach(function (c) { if (progs.indexOf(c.program) < 0) progs.push(c.program); });
      return '<div class="price-wrap">' + progs.map(function (p) {
        return '<div class="price-group"><h3>' + esc(p) + ' classes</h3><div class="price-rows">' +
          site.classTypes.filter(function (c) { return c.program === p; }).map(function (c) {
            return '<div class="price-row"><div><b>' + esc(c.name) + '</b><span>' + esc(c.ages) + ' · ' + esc(c.minutes) +
              ' min · once a week</span></div><div class="price-amt"><b>' + money(c.price) + '</b><span>per 8-week session</span></div></div>';
          }).join('') + '</div></div>';
      }).join('') + '</div>';
    },

    recruits: function (site) {
      var list = site.recruits.filter(function (r) { return r.show; }), years = [];
      list.forEach(function (r) { if (years.indexOf(r.year) < 0) years.push(r.year); });
      years.sort();
      if (!list.length) return '<p class="muted">No athletes are listed right now. Please email our team director for current information.</p>';
      return years.map(function (y) {
        return '<div class="rec-year"><h2>Class of ' + esc(y) + '</h2><div class="rec-grid">' +
          list.filter(function (r) { return r.year === y; }).map(function (r) {
            return '<article class="rec-card">' +
              (r.photo ? '<img src="' + img(r.photo, 600) + '" alt="' + esc(r.name) + '" loading="lazy">' : '<div class="rec-noimg" aria-hidden="true">' + esc(r.name.split(' ').map(function (w) { return w[0]; }).join('')) + '</div>') +
              '<div class="rec-body"><h3>' + esc(r.name) + '</h3><p>' + esc(r.level || 'Class of ' + r.year) + '</p>' +
              (r.ig ? '<a href="https://www.instagram.com/' + encodeURIComponent(r.ig).replace(/%2E/gi, '.') + '/" target="_blank" rel="noopener">Instagram <span aria-hidden="true">→</span></a>' : '') +
              '</div></article>';
          }).join('') + '</div></div>';
      }).join('');
    },

    /* published clinics / holiday camps; falls back to the "check back" copy the gym uses today */
    clinics: function (site) { return specials(site, 'Skill clinic', 'Clinics are held throughout the year for different skills. Check back for when our next one is scheduled!'); },
    holidayCamps: function (site) { return specials(site, 'Holiday camp', 'Stay tuned for our next holiday camp. We’ll have crafts, games and gymnastics. Ages 3+. Sign up in the Customer Portal.'); }
  };

  function specials(site, kind, fallback) {
    var list = (site.specials || []).filter(function (s) { return s.kind === kind; });
    if (!list.length) return '<p>' + fallback + '</p>';
    return '<ul class="special-list">' + list.map(function (s) {
      return '<li><span class="tag tag-live">Scheduled</span><b>' + esc(s.name) + '</b><span>' + range(s.start, s.end, true) +
        (s.time ? ' · ' + esc(s.time) : '') + (s.ages ? ' · Ages ' + esc(s.ages) : '') + '</span></li>';
    }).join('') + '</ul><p>Sign up in the Customer Portal.</p>';
  }

  var api = { esc: esc, parse: parse, iso: iso, md: md, range: range, dow: dow, year: year, money: money, img: img, find: find, text: text, blocks: blocks, IMG: IMG, PORTAL: PORTAL, MON: MON, DOW: DOW };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MBGR = api;
})(typeof window !== 'undefined' ? window : globalThis);
