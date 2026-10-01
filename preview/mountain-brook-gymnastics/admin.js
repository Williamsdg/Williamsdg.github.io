/* MBG Staff Dashboard — concept. One store (mbg-data.js) shared with the public pages:
   anything edited under S.site shows up on the website the next time a page loads. */
(function () {
  var R = window.MBGR, store = window.MBG, S = store.load(), h = R.esc;
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }

  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var now = new Date(), todayIso = R.iso(now);
  var ui = { prog: 'All', day: 'All', cview: 'list', inbox: 'All', calY: now.getFullYear(), calM: now.getMonth() };
  var view = $('#view');

  /* ───────── helpers ───────── */
  function uid(p) { return p + Date.now().toString(36) + Math.floor(Math.random() * 1e3); }
  function ctype(id) { return R.find(S.site.classTypes, id) || { name: 'Class', program: '', minutes: 0, ages: '' }; }
  function staffName(id) { var s = R.find(S.staff, id); return s ? s.name : 'Unassigned'; }
  function t12(t) { var p = t.split(':'), H = +p[0]; return ((H + 11) % 12 + 1) + ':' + p[1] + (H < 12 ? ' AM' : ' PM'); }
  /* MBG rule: all Fantastic 4s classes after 3 PM run 45 minutes */
  function mins(c) { return c.type === 'f4' && c.start >= '15:00' ? 45 : ctype(c.type).minutes; }
  function endT(c) { var p = c.start.split(':'), m = +p[0] * 60 + +p[1] + mins(c); return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + m % 60).slice(-2); }
  function span(c) { return t12(c.start) + ' – ' + t12(endT(c)); }
  function cstatus(c) {
    if (c.enrolled < 2) return { k: 'bad', label: 'Below minimum' };
    if (c.enrolled >= c.cap) return { k: 'warn', label: c.wait ? 'Full · ' + c.wait + ' waiting' : 'Full' };
    return { k: 'ok', label: (c.cap - c.enrolled) + ' open' };
  }
  function pill(k, label) { return '<span class="pill p-' + k + '">' + h(label) + '</span>'; }
  function meter(n, cap) {
    var pct = cap ? Math.min(100, Math.round(n / cap * 100)) : 0;
    return '<div class="meter" role="img" aria-label="' + n + ' of ' + cap + '"><div class="meter-track"><div class="meter-fill" style="width:' + pct + '%"></div></div><b>' + n + ' / ' + cap + '</b></div>';
  }
  function tile(lbl, val, hint) { return '<div class="tile"><div class="lbl">' + h(lbl) + '</div><div class="val">' + h(val) + '</div>' + (hint ? '<div class="hint">' + h(hint) + '</div>' : '') + '</div>'; }
  function sum(list, f) { return list.reduce(function (a, x) { return a + (+f(x) || 0); }, 0); }
  function daysTo(iso) { return Math.round((R.parse(iso) - R.parse(todayIso)) / 864e5); }
  function inDays(n) { return n === 0 ? 'today' : n === 1 ? 'tomorrow' : 'in ' + n + ' days'; }
  function staffSelect(sel, act, id, label) {
    return '<select class="inl" data-chg="' + act + '" data-id="' + h(id) + '" aria-label="' + h(label) + '"><option value="">Unassigned</option>' +
      S.staff.map(function (s) { return '<option value="' + h(s.id) + '"' + (s.id === sel ? ' selected' : '') + '>' + h(s.name) + '</option>'; }).join('') + '</select>';
  }
  function options(list, sel) { return list.map(function (o) { var v = o.v !== undefined ? o.v : o, l = o.l || o; return '<option value="' + h(v) + '"' + (String(v) === String(sel) ? ' selected' : '') + '>' + h(l) + '</option>'; }).join(''); }
  function datechip(iso, end) {
    var d = R.parse(iso); if (!d) return '<span class="datechip"><i>TBA</i><b>–</b></span>';
    return '<span class="datechip"><i>' + R.MON[d.getMonth()].slice(0, 3) + '</i><b>' + d.getDate() + (end && end !== iso ? '–' + R.parse(end).getDate() : '') + '</b></span>';
  }
  function sampleTag(x) { return x && x.sample ? ' <span class="tagx">Sample</span>' : ''; }

  /* clinics + holiday camps marked "show on website" are what the public Events page lists */
  function syncSpecials() {
    S.site.specials = S.camps.filter(function (c) { return c.publish && (c.kind === 'Holiday camp' || c.kind === 'Skill clinic'); })
      .map(function (c) { return { kind: c.kind, name: c.name, start: c.start, end: c.end, time: c.time, ages: c.ages }; });
  }
  var toastT;
  function toast(msg, link) {
    var t = $('#toast'); t.innerHTML = h(msg) + (link ? '<a href="' + link + '" target="_blank" rel="noopener">View page ↗</a>' : '');
    t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 3600);
  }
  function save(msg, link) {
    syncSpecials();
    var ok = store.save(S);
    badge();
    toast(ok ? msg : msg + ' (this session only — browser storage is unavailable)', link);
  }
  function badge() { var n = S.inbox.filter(function (m) { return m.status === 'New'; }).length; $('#inboxCount').textContent = n || ''; }

  /* everything with a date, for Today + Calendar */
  function allItems() {
    var out = [];
    S.site.dates.forEach(function (d) { out.push({ date: d.date, end: d.end || d.date, label: d.label, kind: d.kind === 'closed' ? 'closed' : d.kind === 'partial' ? 'partial' : 'session', go: 'website' }); });
    S.site.meets.forEach(function (m) { if (m.start) out.push({ date: m.start, end: m.end || m.start, label: m.name, kind: 'meet', go: 'team' }); });
    S.events.forEach(function (e) { out.push({ date: e.date, end: e.date, label: e.kind === 'Birthday party' ? 'Party · ' + e.time.split(' – ')[0] : e.title, kind: 'event', go: 'events' }); });
    S.camps.forEach(function (c) { out.push({ date: c.start, end: c.end || c.start, label: c.name, kind: 'camp', go: 'camps' }); });
    return out.filter(function (i) { return i.date; }).sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
  }
  var KIND = { session: 'Session date', closed: 'Closed', partial: 'Partial day', meet: 'Home meet', event: 'Event or party', camp: 'Camp or clinic' };

  /* ───────── modal ───────── */
  var modal = $('#modal'), modalCfg = null;
  function openModal(cfg) {
    modalCfg = cfg;
    $('#modalTitle').textContent = cfg.title;
    $('#modalBody').innerHTML = '<div class="f">' + cfg.fields.map(function (f) {
      var id = 'mf-' + f.name, inp;
      if (f.type === 'select') inp = '<select id="' + id + '" name="' + f.name + '">' + options(f.options, f.value) + '</select>';
      else if (f.type === 'textarea') inp = '<textarea id="' + id + '" name="' + f.name + '">' + h(f.value) + '</textarea>';
      else inp = '<input id="' + id + '" name="' + f.name + '" type="' + (f.type || 'text') + '" value="' + h(f.value) + '"' + (f.min !== undefined ? ' min="' + f.min + '"' : '') + (f.required ? ' required' : '') + (f.type === 'number' ? ' inputmode="numeric"' : '') + '>';
      return '<div class="fld' + (f.full ? ' full' : '') + '"><label for="' + id + '">' + h(f.label) + '</label>' + inp + '</div>';
    }).join('') + '</div>';
    $('#modalDel').hidden = !cfg.onDelete;
    if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
  }
  function closeModal() { if (modal.close) modal.close(); else modal.removeAttribute('open'); modalCfg = null; }
  $('#modalForm').addEventListener('submit', function (e) {
    e.preventDefault(); if (!modalCfg) return;
    var v = {}; $$('input,select,textarea', $('#modalBody')).forEach(function (el) { v[el.name] = el.type === 'number' ? +el.value || 0 : el.value.trim(); });
    var cfg = modalCfg; closeModal(); cfg.onSave(v); render();
  });
  $('#modalCancel').addEventListener('click', closeModal);
  $('#modalX').addEventListener('click', closeModal);
  $('#modalDel').addEventListener('click', function () { var cfg = modalCfg; closeModal(); if (cfg && cfg.onDelete) { cfg.onDelete(); render(); } });

  /* ───────── views ───────── */
  var views = {};

  views.today = {
    title: 'Today',
    sub: function () { return R.DOW[now.getDay()] + ', ' + R.MON[now.getMonth()] + ' ' + now.getDate(); },
    render: function () {
      var di = (now.getDay() + 6) % 7; // 0 = Monday
      var closed = S.site.dates.filter(function (d) { return d.kind === 'closed' && d.date <= todayIso && (d.end || d.date) >= todayIso; })[0];
      var list = di > 5 || closed ? [] : S.classes.filter(function (c) { return c.day === di; }).sort(function (a, b) { return a.start < b.start ? -1 : 1; });
      var sess = S.site.sessions.filter(function (s) { return s.start <= todayIso && s.end >= todayIso; })[0];
      var nextSess = S.site.sessions.filter(function (s) { return s.start > todayIso; })[0];
      var sessLine = sess ? sess.name + ' · ' + (daysTo(sess.end) === 0 ? 'last day today' : 'ends ' + R.md(sess.end) + ' (' + inDays(daysTo(sess.end)) + ')')
        : nextSess ? 'Between sessions · ' + nextSess.name + ' starts ' + R.md(nextSess.start) + ' (' + inDays(daysTo(nextSess.start)) + ')' : 'No session scheduled';
      var newMsgs = S.inbox.filter(function (m) { return m.status === 'New'; });

      var attn = [];
      S.classes.filter(function (c) { return c.enrolled < 2; }).forEach(function (c) {
        attn.push({ k: 'bad', t: ctype(c.type).name + ' · ' + DAYS[c.day].slice(0, 3) + ' ' + t12(c.start) + ' has ' + c.enrolled + ' student' + (c.enrolled === 1 ? '' : 's'), s: 'Below the 2-student minimum — combine it or move the family.', go: 'classes' });
      });
      S.classes.filter(function (c) { return c.wait >= 3; }).forEach(function (c) {
        attn.push({ k: 'warn', t: ctype(c.type).name + ' · ' + DAYS[c.day].slice(0, 3) + ' ' + t12(c.start) + ' is full with ' + c.wait + ' waiting', s: 'Enough demand to open a similar class — waitlist families hear first.', go: 'classes' });
      });
      S.events.filter(function (e) { return e.status === 'Needs host' && e.date >= todayIso; }).forEach(function (e) {
        attn.push({ k: 'warn', t: 'Party on ' + R.md(e.date) + ' has no host yet', s: e.title + ' · ' + e.time, go: 'events' });
      });
      if (newMsgs.length) attn.push({ k: 'info', t: newMsgs.length + ' new request' + (newMsgs.length === 1 ? '' : 's') + ' from the website', s: newMsgs.map(function (m) { return m.type; }).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(' · '), go: 'inbox' });
      S.site.meets.forEach(function (m) {
        var d = m.start ? daysTo(m.start) : -1, open = S.meetTasks.filter(function (t) { return t.meet === m.id && !t.done; }).length;
        if (d >= 0 && d <= 45 && open) attn.push({ k: 'info', t: m.name + ' is ' + inDays(d), s: open + ' checklist item' + (open === 1 ? '' : 's') + ' still open.', go: 'team' });
      });

      var soon = allItems().filter(function (i) { return i.end >= todayIso && daysTo(i.date) <= 21; }).slice(0, 8);

      return '<div class="grid g-tiles">' +
        tile('Session', sess ? sess.name.replace('Fall ', '') : '—', sessLine.split(' · ')[1] || sessLine) +
        tile('Classes today', list.length, closed ? closed.label : di > 5 ? 'Sunday — by appointment' : sum(list, function (c) { return c.enrolled; }) + ' students expected') +
        tile('Open spots this week', sum(S.classes, function (c) { return Math.max(0, c.cap - c.enrolled); }), 'across ' + S.classes.length + ' classes') +
        tile('On waitlists', sum(S.classes, function (c) { return c.wait; }), S.classes.filter(function (c) { return c.wait; }).length + ' classes') +
        tile('New in inbox', newMsgs.length, 'from website forms') +
        '</div>' +
        '<div class="grid g-2"><div>' +
        '<div class="card"><div class="card-head"><div><h2>Today’s classes</h2><p class="sub">' + h(sessLine) + '</p></div><a class="btn btn-line btn-sm" href="#classes">Full schedule</a></div>' +
        (list.length ? '<ul class="rows">' + list.map(function (c) {
          return '<li><span class="time">' + t12(c.start) + '</span><span class="what"><b>' + h(ctype(c.type).name) + '</b><small>' + h(staffName(c.coach)) + ' · ' + mins(c) + ' min</small></span>' + meter(c.enrolled, c.cap) + '</li>';
        }).join('') + '</ul>' : '<p class="empty">' + (closed ? h(closed.label) + ' today.' : 'No classes on the schedule today.') + '</p>') + '</div>' +
        '</div><div>' +
        '<div class="card"><div class="card-head"><h2>Needs attention</h2></div>' +
        (attn.length ? '<ul class="rows attn">' + attn.map(function (a) {
          return '<li><span>' + pill(a.k, a.k === 'bad' ? 'Act' : a.k === 'warn' ? 'Check' : 'FYI') + '</span><span class="what"><b>' + h(a.t) + '</b><small>' + h(a.s) + '</small></span><a class="go" href="#' + a.go + '">Open →</a></li>';
        }).join('') + '</ul>' : '<p class="empty">Nothing needs attention right now.</p>') + '</div>' +
        '<div class="card stack"><div class="card-head"><h2>Next three weeks</h2><a class="btn btn-line btn-sm" href="#calendar">Calendar</a></div>' +
        (soon.length ? '<ul class="rows">' + soon.map(function (i) {
          return '<li>' + datechip(i.date, i.end) + '<span class="what"><b>' + h(i.label) + '</b><small>' + KIND[i.kind] + (daysTo(i.date) >= 0 ? ' · ' + inDays(daysTo(i.date)) : ' · under way') + '</small></span></li>';
        }).join('') + '</ul>' : '<p class="empty">Nothing scheduled.</p>') + '</div>' +
        '</div></div>';
    }
  };

  views.classes = {
    title: 'Classes',
    sub: function () { return 'Fall 2026 weekly schedule · ' + S.classes.length + ' classes'; },
    render: function () {
      var list = S.classes.filter(function (c) { return (ui.prog === 'All' || ctype(c.type).program === ui.prog) && (ui.day === 'All' || c.day === +ui.day); })
        .sort(function (a, b) { return a.day - b.day || (a.start < b.start ? -1 : 1); });
      var cap = sum(list, function (c) { return c.cap; }), enr = sum(list, function (c) { return c.enrolled; });
      var seg = function (key, opts) {
        return '<div class="seg" role="group">' + opts.map(function (o) {
          return '<button type="button" data-act="seg" data-key="' + key + '" data-val="' + h(o[0]) + '" class="' + (String(ui[key]) === String(o[0]) ? 'on' : '') + '" aria-pressed="' + (String(ui[key]) === String(o[0])) + '">' + h(o[1]) + '</button>';
        }).join('') + '</div>';
      };
      var body;
      if (ui.cview === 'week') {
        body = '<div class="week">' + DAYS.map(function (d, i) {
          if (ui.day !== 'All' && +ui.day !== i) return '';
          var col = list.filter(function (c) { return c.day === i; });
          return '<div class="week-col"><h3>' + d + '</h3>' + (col.length ? col.map(function (c) {
            var st = cstatus(c);
            return '<button type="button" class="slot s-' + st.k + '" data-act="editClass" data-id="' + c.id + '"><b>' + t12(c.start) + ' · ' + h(ctype(c.type).name) + '</b><span>' + h(staffName(c.coach)) + '</span><span>' + c.enrolled + ' / ' + c.cap + ' · ' + h(st.label) + '</span></button>';
          }).join('') : '<p class="empty">No classes</p>') + '</div>';
        }).join('') + '</div>';
      } else {
        body = '<div class="card"><table class="tbl"><thead><tr><th>Class</th><th>Day &amp; time</th><th>Coach</th><th>Enrolled</th><th>Status</th><th></th></tr></thead><tbody>' +
          (list.length ? list.map(function (c) {
            var t = ctype(c.type), st = cstatus(c);
            return '<tr><td><b>' + h(t.name) + '</b><small>' + h(t.program) + ' · ' + mins(c) + ' min</small></td>' +
              '<td data-l="When"><span><b>' + DAYS[c.day] + '</b><small>' + span(c) + '</small></span></td>' +
              '<td data-l="Coach">' + staffSelect(c.coach, 'classCoach', c.id, 'Coach for ' + t.name) + '</td>' +
              '<td data-l="Enrolled">' + meter(c.enrolled, c.cap) + '</td>' +
              '<td data-l="Status">' + pill(st.k, st.label) + '</td>' +
              '<td class="act"><button type="button" class="btn btn-line btn-sm" data-act="editClass" data-id="' + c.id + '">Edit</button></td></tr>';
          }).join('') : '<tr><td colspan="6" class="empty">No classes match these filters.</td></tr>') + '</tbody></table></div>';
      }
      return '<p class="note"><b>Planning view.</b> Registration, rosters and billing stay in iClassPro. The enrollment numbers and schedule here are sample data; prices and class lengths are MBG’s published ones.</p>' +
        '<div class="grid g-tiles">' + tile('Classes shown', list.length) + tile('Enrolled', enr, 'of ' + cap + ' spots') +
        tile('Fill rate', cap ? Math.round(enr / cap * 100) + '%' : '—') + tile('Waitlisted', sum(list, function (c) { return c.wait; })) +
        tile('Below minimum', list.filter(function (c) { return c.enrolled < 2; }).length, 'fewer than 2 students') + '</div>' +
        '<div class="toolbar">' + seg('prog', [['All', 'All programs'], ['Preschool', 'Preschool'], ['Recreational', 'Recreational']]) +
        seg('day', [['All', 'All days']].concat(DAYS.map(function (d, i) { return [i, d.slice(0, 3)]; }))) +
        '<span class="grow"></span>' + seg('cview', [['list', 'List'], ['week', 'Week']]) +
        '<button type="button" class="btn btn-solid" data-act="addClass">+ Add class</button></div>' + body;
    }
  };

  views.team = {
    title: 'Team',
    sub: function () { return 'Competitive program · USAG Levels 3–10 and Xcel'; },
    render: function () {
      var nextMeet = S.site.meets.filter(function (m) { return m.start && m.end >= todayIso; }).sort(function (a, b) { return a.start < b.start ? -1 : 1; })[0];
      return '<div class="grid g-tiles">' + tile('Team gymnasts', sum(S.teamGroups, function (g) { return g.athletes; }), 'sample group sizes') +
        tile('Training groups', S.teamGroups.length) +
        tile('Recruits on website', S.site.recruits.filter(function (r) { return r.show; }).length, 'of ' + S.site.recruits.length + ' listed') +
        tile('Next home meet', nextMeet ? R.md(nextMeet.start) : 'TBA', nextMeet ? inDays(Math.max(0, daysTo(nextMeet.start))) : 'set a date below') + '</div>' +

        '<div class="grid g-half"><div>' +
        '<div class="card"><div class="card-head"><div><h2>Home meets</h2><p class="sub">Dates here are what the website shows.</p></div></div>' +
        S.site.meets.map(function (m) {
          var tasks = S.meetTasks.filter(function (t) { return t.meet === m.id; });
          return '<div style="padding:12px 0;border-top:1px solid var(--line)"><div class="card-head" style="margin-bottom:8px"><div><b>' + h(m.name) + '</b><p class="sub">' + h(m.when) + ' · ' + h(m.who) + ' · ' + h(R.text(S.site, 'meet.' + m.id)) + '</p></div>' +
            '<button type="button" class="btn btn-line btn-sm" data-act="editMeet" data-id="' + m.id + '">Change dates</button></div>' +
            tasks.map(function (t) { return '<label class="check' + (t.done ? ' done' : '') + '"><input type="checkbox" data-chg="task" data-id="' + t.id + '"' + (t.done ? ' checked' : '') + '><span>' + h(t.text) + '</span></label>'; }).join('') +
            '<button type="button" class="btn btn-line btn-sm" data-act="addTask" data-id="' + m.id + '" style="margin-top:6px">+ Checklist item</button></div>';
        }).join('') + '</div>' +

        '<div class="card stack"><div class="card-head"><div><h2>Recruitable athletes</h2><p class="sub">Controls the Recruitable Athletes page.</p></div><button type="button" class="btn btn-solid btn-sm" data-act="addRecruit">+ Add athlete</button></div>' +
        '<table class="tbl"><thead><tr><th>Athlete</th><th>Class</th><th>On website</th><th></th></tr></thead><tbody>' +
        S.site.recruits.map(function (r) {
          return '<tr><td><b>' + h(r.name) + '</b><small>' + h(r.level || 'Level not listed') + (r.ig ? ' · @' + h(r.ig) : '') + '</small></td><td data-l="Class">' + h(r.year) + '</td>' +
            '<td data-l="On website"><label class="switch"><input type="checkbox" data-chg="recruitShow" data-id="' + r.id + '"' + (r.show ? ' checked' : '') + '><i></i><span>' + (r.show ? 'Shown' : 'Hidden') + '</span></label></td>' +
            '<td class="act"><button type="button" class="btn btn-line btn-sm" data-act="editRecruit" data-id="' + r.id + '">Edit</button></td></tr>';
        }).join('') + '</tbody></table></div>' +
        '</div><div>' +

        '<div class="card"><div class="card-head"><div><h2>Training groups</h2><p class="sub">Group sizes and hours are sample data. MBG’s groups train 6 to 25 hours a week.</p></div><button type="button" class="btn btn-solid btn-sm" data-act="addGroup">+ Add group</button></div>' +
        '<table class="tbl"><thead><tr><th>Group</th><th>Athletes</th><th>Hours / week</th><th></th></tr></thead><tbody>' +
        S.teamGroups.map(function (g) {
          return '<tr><td><b>' + h(g.name) + '</b><small>' + h(g.track) + '</small></td><td data-l="Athletes" class="num">' + g.athletes + '</td><td data-l="Hours / wk">' + meter(g.hours, 25).replace(' / 25</b>', ' hrs</b>') + '</td>' +
            '<td class="act"><button type="button" class="btn btn-line btn-sm" data-act="editGroup" data-id="' + g.id + '">Edit</button></td></tr>';
        }).join('') + '</tbody></table></div>' +
        '</div></div>';
    }
  };

  views.camps = {
    title: 'Camps & clinics',
    sub: function () { return 'Summer day camp, holiday camps and skill clinics'; },
    render: function () {
      var up = S.camps.slice().sort(function (a, b) { return a.start < b.start ? -1 : 1; });
      return '<p class="note"><b>Publishing.</b> Turn on “Show on website” for a holiday camp or skill clinic and it replaces the “check back” message on the Camps &amp; Events page. Sign-ups still happen in the Customer Portal. The camps listed here are sample data.</p>' +
        '<div class="grid g-tiles">' + tile('Planned', S.camps.length, 'camps & clinics') + tile('On the website', S.camps.filter(function (c) { return c.publish; }).length) +
        tile('Total capacity', sum(S.camps, function (c) { return c.cap; }), 'spots') + tile('Enrolled', sum(S.camps, function (c) { return c.enrolled; })) + '</div>' +
        '<div class="toolbar"><span class="grow"></span><button type="button" class="btn btn-solid" data-act="addCamp">+ Add camp or clinic</button></div>' +
        '<div class="card"><table class="tbl"><thead><tr><th>Camp</th><th>Dates</th><th>Enrolled</th><th>Status</th><th>Show on website</th><th></th></tr></thead><tbody>' +
        up.map(function (c) {
          var can = c.kind !== 'Summer day camp';
          return '<tr><td><b>' + h(c.name) + '</b><small>' + h(c.kind) + ' · Ages ' + h(c.ages) + ' · ' + h(c.time) + '</small></td>' +
            '<td data-l="Dates">' + h(R.range(c.start, c.end)) + ', ' + R.year(c.start) + '</td><td data-l="Enrolled">' + meter(c.enrolled, c.cap) + '</td>' +
            '<td data-l="Status">' + pill(c.status === 'Open' ? 'ok' : c.status === 'Full' ? 'warn' : 'mute', c.status) + '</td>' +
            '<td data-l="Website">' + (can ? '<label class="switch"><input type="checkbox" data-chg="campPublish" data-id="' + c.id + '"' + (c.publish ? ' checked' : '') + '><i></i><span>' + (c.publish ? 'Shown' : 'Hidden') + '</span></label>' : '<small>Listed in the portal</small>') + '</td>' +
            '<td class="act"><button type="button" class="btn btn-line btn-sm" data-act="editCamp" data-id="' + c.id + '">Edit</button></td></tr>';
        }).join('') + '</tbody></table></div>';
    }
  };

  views.events = {
    title: 'Events & parties',
    sub: function () { return 'Flippin’ Fridays and birthday parties'; },
    render: function () {
      var f = S.site.flippin, ff = S.events.filter(function (e) { return e.kind === 'Flippin’ Friday'; })[0];
      var parties = S.events.filter(function (e) { return e.kind !== 'Flippin’ Friday'; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      return '<div class="grid g-2"><div>' +
        '<div class="card"><div class="card-head"><div><h2>Parties &amp; bookings</h2><p class="sub">Sample bookings — no family details are stored in this concept.</p></div><button type="button" class="btn btn-solid btn-sm" data-act="addEvent">+ Add booking</button></div>' +
        '<table class="tbl"><thead><tr><th>When</th><th>Booking</th><th>Host</th><th>Status</th><th></th></tr></thead><tbody>' +
        (parties.length ? parties.map(function (e) {
          return '<tr><td><b>' + h(R.dow(e.date).slice(0, 3) + ', ' + R.md(e.date)) + '</b><small>' + h(e.time) + '</small></td><td data-l="Booking">' + h(e.title) + '</td>' +
            '<td data-l="Host">' + staffSelect(e.lead, 'eventLead', e.id, 'Host for ' + e.title) + '</td>' +
            '<td data-l="Status">' + pill(e.status === 'Confirmed' ? 'ok' : e.status === 'Needs host' ? 'warn' : 'mute', e.status) + '</td>' +
            '<td class="act"><button type="button" class="btn btn-line btn-sm" data-act="editEvent" data-id="' + e.id + '">Edit</button></td></tr>';
        }).join('') : '<tr><td colspan="5" class="empty">No bookings yet.</td></tr>') + '</tbody></table></div>' +
        '</div><div>' +
        '<div class="card"><div class="card-head"><div><h2>Next Flippin’ Friday</h2><p class="sub">These details publish to the home and events pages.</p></div>' + pill('ok', 'On the website') + '</div>' +
        '<div class="f">' +
        '<div class="fld"><label for="ff-date">Date</label><input id="ff-date" type="date" value="' + h(f.date) + '" data-chg="flippin" data-key="date"></div>' +
        '<div class="fld"><label for="ff-time">Time</label><input id="ff-time" value="' + h(f.time) + '" data-chg="flippin" data-key="time"></div>' +
        '<div class="fld"><label for="ff-price">Price ($)</label><input id="ff-price" type="number" inputmode="numeric" min="0" value="' + h(f.price) + '" data-chg="flippin" data-key="price"></div>' +
        '<div class="fld"><label for="ff-sib">Per sibling ($)</label><input id="ff-sib" type="number" inputmode="numeric" min="0" value="' + h(f.sibling) + '" data-chg="flippin" data-key="sibling"></div>' +
        '</div>' +
        (ff ? '<div style="margin-top:16px"><div class="lbl" style="font-size:12px;font-weight:800;color:var(--ink-2);margin-bottom:6px">Signed up (sample)</div>' + meter(ff.booked, ff.cap) +
          '<p class="sub" style="margin-top:10px">Lead: ' + staffSelect(ff.lead, 'eventLead', ff.id, 'Flippin’ Friday lead') + '</p></div>' : '') + '</div>' +
        '<div class="card stack"><div class="card-head"><h2>Party requests</h2><a class="btn btn-line btn-sm" href="#inbox">Open inbox</a></div>' +
        '<p class="sub">' + S.inbox.filter(function (m) { return m.type === 'Birthday party' && m.status === 'New'; }).length + ' new party request(s) from the website form. Confirmed ones become bookings here.</p></div>' +
        '</div></div>';
    }
  };

  var MSG_TYPES = ['All', 'Private lesson', 'Birthday party', 'Contact', 'Job interest'];
  var MSG_STATUS = ['New', 'Assigned', 'Replied', 'Scheduled', 'Closed'];
  views.inbox = {
    title: 'Inbox',
    sub: function () { return 'Requests from the website forms'; },
    render: function () {
      var list = S.inbox.filter(function (m) { return ui.inbox === 'All' || m.type === ui.inbox; });
      return '<p class="note"><b>Try it.</b> Submit the <a href="events.html#privates" target="_blank" rel="noopener" style="text-decoration:underline;font-weight:700">private lesson</a>, <a href="events.html#parties" target="_blank" rel="noopener" style="text-decoration:underline;font-weight:700">party</a>, <a href="contact.html" target="_blank" rel="noopener" style="text-decoration:underline;font-weight:700">contact</a> or <a href="employment.html#apply" target="_blank" rel="noopener" style="text-decoration:underline;font-weight:700">employment</a> form on the concept site, then reload this page. In this preview, requests are stored in your browser only.</p>' +
        '<div class="toolbar"><div class="seg" role="group">' + MSG_TYPES.map(function (t) {
          var n = t === 'All' ? S.inbox.length : S.inbox.filter(function (m) { return m.type === t; }).length;
          return '<button type="button" data-act="seg" data-key="inbox" data-val="' + h(t) + '" class="' + (ui.inbox === t ? 'on' : '') + '" aria-pressed="' + (ui.inbox === t) + '">' + h(t) + ' (' + n + ')</button>';
        }).join('') + '</div></div>' +
        '<div class="card">' + (list.length ? list.map(function (m) {
          var d = new Date(m.at);
          return '<div class="msg"><div><div class="msg-meta"><span class="prog">' + h(m.type) + '</span>' + pill(m.status === 'New' ? 'info' : m.status === 'Closed' ? 'mute' : 'ok', m.status) +
            '<span>' + h(m.from) + (m.email ? ' · ' + h(m.email) : '') + '</span><span>' + R.MON[d.getMonth()].slice(0, 3) + ' ' + d.getDate() + '</span>' + sampleTag(m) + '</div><p>' + h(m.summary) + '</p></div>' +
            '<div class="msg-ctl"><select class="inl" data-chg="msgStatus" data-id="' + m.id + '" aria-label="Status">' + options(MSG_STATUS, m.status) + '</select>' +
            staffSelect(m.assignee, 'msgAssign', m.id, 'Assign to') +
            '<button type="button" class="icon-btn" data-act="delMsg" data-id="' + m.id + '" aria-label="Delete request">×</button></div></div>';
        }).join('') : '<p class="empty">Nothing here yet.</p>') + '</div>';
    }
  };

  views.calendar = {
    title: 'Calendar',
    sub: function () { return 'Sessions, closures, meets, events and camps in one place'; },
    render: function () {
      var y = ui.calY, m = ui.calM, first = new Date(y, m, 1), startOff = first.getDay();
      var items = allItems(), cells = '', agenda = [];
      function on(isoD) { return items.filter(function (i) { return i.date <= isoD && i.end >= isoD; }); }
      for (var i = 0; i < 42; i++) {
        var d = new Date(y, m, 1 - startOff + i), isoD = R.iso(d), out = d.getMonth() !== m;
        if (i >= 35 && out && new Date(y, m, 1 - startOff + 35).getMonth() !== m) break;
        var evs = on(isoD);
        cells += '<div class="cal-day' + (out ? ' out' : '') + (isoD === todayIso ? ' now' : '') + '"><span class="dn">' + d.getDate() + '</span>' +
          evs.map(function (e) { return '<a class="ev ev-' + e.kind + '" href="#' + e.go + '" title="' + h(KIND[e.kind] + ': ' + e.label) + '">' + h(e.label) + '</a>'; }).join('') + '</div>';
        if (!out && evs.length) agenda.push({ iso: isoD, evs: evs });
      }
      return '<div class="card"><div class="cal-head"><h2>' + R.MON[m] + ' ' + y + '</h2>' +
        '<button type="button" class="btn btn-line btn-sm" data-act="cal" data-val="-1" aria-label="Previous month">←</button>' +
        '<button type="button" class="btn btn-line btn-sm" data-act="cal" data-val="0">Today</button>' +
        '<button type="button" class="btn btn-line btn-sm" data-act="cal" data-val="1" aria-label="Next month">→</button></div>' +
        '<div class="cal">' + ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(function (d) { return '<div class="cal-dow">' + d + '</div>'; }).join('') + cells + '</div>' +
        '<ul class="rows agenda">' + (agenda.length ? agenda.map(function (a) {
          return '<li>' + datechip(a.iso) + '<span class="what">' + a.evs.map(function (e) { return '<a class="ev ev-' + e.kind + '" href="#' + e.go + '" style="white-space:normal">' + h(KIND[e.kind] + ' · ' + e.label) + '</a>'; }).join('') + '</span></li>';
        }).join('') : '<li class="empty">Nothing scheduled this month.</li>') + '</ul>' +
        '<div class="legend">' + Object.keys(KIND).map(function (k) { return '<span><i class="ev-' + k + '"></i>' + KIND[k] + '</span>'; }).join('') + '</div></div>';
    }
  };

  views.staff = {
    title: 'Staff',
    sub: function () { return S.staff.length + ' people · weekly class load from the schedule'; },
    render: function () {
      return '<p class="note"><b>Names.</b> Helen, Hanna and Becky are named on MBG’s website. “Coach A–F” are placeholders — rename them to see the schedule update everywhere.</p>' +
        '<div class="toolbar"><span class="grow"></span><button type="button" class="btn btn-solid" data-act="addStaff">+ Add staff</button></div>' +
        '<div class="card"><table class="tbl"><thead><tr><th>Name</th><th>Areas</th><th>Classes / week</th><th>Hours on the floor</th><th></th></tr></thead><tbody>' +
        S.staff.map(function (s) {
          var mine = S.classes.filter(function (c) { return c.coach === s.id; }), hrs = sum(mine, mins) / 60;
          return '<tr><td><b>' + h(s.name) + '</b>' + sampleTag(s) + '<small>' + h(s.role) + '</small></td><td data-l="Areas">' + h(s.areas.join(', ')) + '</td>' +
            '<td data-l="Classes" class="num">' + mine.length + '</td><td data-l="Hours">' + meter(Math.round(hrs * 10) / 10, 12).replace(' / 12</b>', ' hrs</b>') + '</td>' +
            '<td class="act"><button type="button" class="btn btn-line btn-sm" data-act="editStaff" data-id="' + s.id + '">Edit</button></td></tr>';
        }).join('') + '</tbody></table></div>';
    }
  };

  var KINDS = [{ v: 'session', l: 'Session date' }, { v: 'closed', l: 'Closed — no classes' }, { v: 'partial', l: 'Partial day' }];
  views.website = {
    title: 'Website',
    sub: function () { return 'Change it once here — every page that shows it updates'; },
    render: function () {
      var st = S.site, a = st.announcement;
      return '<div class="grid g-half"><div>' +
        '<div class="card"><div class="card-head"><div><h2>Announcement bar</h2><p class="sub">Shown at the top of every page.</p></div>' +
        '<label class="switch"><input type="checkbox" data-chg="annOn"' + (a.on ? ' checked' : '') + '><i></i><span>' + (a.on ? 'On' : 'Off') + '</span></label></div>' +
        '<div class="fld"><label for="ann">Message</label><textarea id="ann" data-chg="annText" maxlength="140">' + h(a.text) + '</textarea></div>' +
        '<div class="preview-bar' + (a.on ? '' : ' off') + '"><span>' + h(a.text) + '</span><em>Register →</em></div></div>' +

        '<div class="card stack"><div class="card-head"><div><h2>Sessions</h2><p class="sub">Home and Classes pages.</p></div></div>' +
        st.sessions.map(function (s) {
          return '<div class="f" style="padding:10px 0;border-top:1px solid var(--line)"><div class="fld full"><label for="sn-' + s.id + '">Name</label><input id="sn-' + s.id + '" value="' + h(s.name) + '" data-chg="sess" data-id="' + s.id + '" data-key="name"></div>' +
            '<div class="fld"><label for="ss-' + s.id + '">Starts</label><input id="ss-' + s.id + '" type="date" value="' + h(s.start) + '" data-chg="sess" data-id="' + s.id + '" data-key="start"></div>' +
            '<div class="fld"><label for="se-' + s.id + '">Ends</label><input id="se-' + s.id + '" type="date" value="' + h(s.end) + '" data-chg="sess" data-id="' + s.id + '" data-key="end"></div>' +
            '<div class="fld full"><label for="so-' + s.id + '">Note</label><input id="so-' + s.id + '" value="' + h(s.note) + '" data-chg="sess" data-id="' + s.id + '" data-key="note"></div></div>';
        }).join('') + '</div>' +

        '<div class="card stack"><div class="card-head"><div><h2>Annual registration fee</h2><p class="sub">Appears on Home and in two places on Classes — from this one number.</p></div></div>' +
        '<div class="f"><div class="fld"><label for="fee1">One student ($)</label><input id="fee1" type="number" inputmode="numeric" min="0" value="' + h(st.regFee.single) + '" data-chg="fee" data-key="single"></div>' +
        '<div class="fld"><label for="fee2">Two or more ($)</label><input id="fee2" type="number" inputmode="numeric" min="0" value="' + h(st.regFee.family) + '" data-chg="fee" data-key="family"></div>' +
        '<div class="fld full"><label for="gy">Gym year</label><input id="gy" value="' + h(st.gymYear) + '" data-chg="gymYear"></div></div></div>' +
        '</div><div>' +

        '<div class="card"><div class="card-head"><div><h2>Important dates</h2><p class="sub">Home page list and the staff calendar.</p></div><button type="button" class="btn btn-solid btn-sm" data-act="addDate">+ Add date</button></div>' +
        st.dates.slice().sort(function (x, y) { return x.date < y.date ? -1 : 1; }).map(function (d) {
          return '<div class="daterow"><input class="inl lbl-in" value="' + h(d.label) + '" data-chg="date" data-id="' + d.id + '" data-key="label" aria-label="Label">' +
            '<input class="inl" type="date" value="' + h(d.date) + '" data-chg="date" data-id="' + d.id + '" data-key="date" aria-label="Date">' +
            '<input class="inl" type="date" value="' + h(d.end) + '" data-chg="date" data-id="' + d.id + '" data-key="end" aria-label="End date (optional)">' +
            '<select class="inl" style="width:100%" data-chg="date" data-id="' + d.id + '" data-key="kind" aria-label="Type">' + options(KINDS, d.kind) + '</select>' +
            '<button type="button" class="icon-btn" data-act="delDate" data-id="' + d.id + '" aria-label="Remove ' + h(d.label) + '">×</button></div>';
        }).join('') + '</div>' +

        '<div class="card stack"><div class="card-head"><div><h2>Class pricing</h2><p class="sub">Per 8-week session. Feeds the pricing table and the class finder.</p></div></div>' +
        '<table class="tbl"><thead><tr><th>Class</th><th>Minutes</th><th>Price ($)</th></tr></thead><tbody>' +
        st.classTypes.map(function (c) {
          return '<tr><td><b>' + h(c.name) + '</b><small>' + h(c.program) + ' · ' + h(c.ages) + '</small></td>' +
            '<td data-l="Minutes"><input class="inl" style="max-width:110px" type="number" inputmode="numeric" min="0" value="' + h(c.minutes) + '" data-chg="ctype" data-id="' + c.id + '" data-key="minutes" aria-label="' + h(c.name) + ' minutes"></td>' +
            '<td data-l="Price"><input class="inl" style="max-width:110px" type="number" inputmode="numeric" min="0" value="' + h(c.price) + '" data-chg="ctype" data-id="' + c.id + '" data-key="price" aria-label="' + h(c.name) + ' price"></td></tr>';
        }).join('') + '</tbody></table></div>' +
        '</div></div>';
    }
  };

  /* ───────── actions ───────── */
  var typeOpts = function () { return S.site.classTypes.map(function (t) { return { v: t.id, l: t.name }; }); };
  var dayOpts = DAYS.map(function (d, i) { return { v: i, l: d }; });
  var staffOpts = function () { return [{ v: '', l: 'Unassigned' }].concat(S.staff.map(function (s) { return { v: s.id, l: s.name }; })); };

  function classModal(c) {
    var isNew = !c; c = c || { id: uid('c'), type: 'beg', day: 0, start: '16:30', coach: '', cap: 8, enrolled: 0, wait: 0 };
    openModal({
      title: isNew ? 'Add a class' : 'Edit class',
      fields: [
        { name: 'type', label: 'Class', type: 'select', options: typeOpts(), value: c.type, full: true },
        { name: 'day', label: 'Day', type: 'select', options: dayOpts, value: c.day }, { name: 'start', label: 'Start time', type: 'time', value: c.start, required: true },
        { name: 'coach', label: 'Coach', type: 'select', options: staffOpts(), value: c.coach, full: true },
        { name: 'cap', label: 'Capacity', type: 'number', min: 1, value: c.cap }, { name: 'enrolled', label: 'Enrolled', type: 'number', min: 0, value: c.enrolled },
        { name: 'wait', label: 'Waitlist', type: 'number', min: 0, value: c.wait }
      ],
      onSave: function (v) { c.type = v.type; c.day = +v.day; c.start = v.start || c.start; c.coach = v.coach; c.cap = Math.max(1, v.cap); c.enrolled = Math.min(v.enrolled, c.cap); c.wait = v.wait; if (isNew) S.classes.push(c); save(isNew ? 'Class added' : 'Class updated'); },
      onDelete: isNew ? null : function () { S.classes = S.classes.filter(function (x) { return x.id !== c.id; }); save('Class removed'); }
    });
  }
  function campModal(c) {
    var isNew = !c; c = c || { id: uid('k'), name: '', kind: 'Skill clinic', start: todayIso, end: todayIso, ages: '5+', time: '', cap: 20, enrolled: 0, status: 'Draft', publish: false };
    openModal({
      title: isNew ? 'Add a camp or clinic' : 'Edit ' + c.name,
      fields: [
        { name: 'name', label: 'Name', value: c.name, full: true, required: true },
        { name: 'kind', label: 'Type', type: 'select', options: ['Skill clinic', 'Holiday camp', 'Summer day camp'], value: c.kind }, { name: 'status', label: 'Status', type: 'select', options: ['Draft', 'Planned', 'Open', 'Full', 'Done'], value: c.status },
        { name: 'start', label: 'Starts', type: 'date', value: c.start, required: true }, { name: 'end', label: 'Ends', type: 'date', value: c.end },
        { name: 'time', label: 'Time', value: c.time }, { name: 'ages', label: 'Ages', value: c.ages },
        { name: 'cap', label: 'Capacity', type: 'number', min: 0, value: c.cap }, { name: 'enrolled', label: 'Enrolled', type: 'number', min: 0, value: c.enrolled }
      ],
      onSave: function (v) { ['name', 'kind', 'status', 'start', 'time', 'ages', 'cap', 'enrolled'].forEach(function (k) { c[k] = v[k]; }); c.end = v.end || v.start; if (c.kind === 'Summer day camp') c.publish = false; if (isNew) S.camps.push(c); save(isNew ? 'Added' : 'Saved', c.publish ? 'events.html#clinics' : ''); },
      onDelete: isNew ? null : function () { S.camps = S.camps.filter(function (x) { return x.id !== c.id; }); save('Removed'); }
    });
  }
  function eventModal(e) {
    var isNew = !e; e = e || { id: uid('e'), kind: 'Birthday party', title: 'Birthday party', date: todayIso, time: '1:00 – 2:30 PM', cap: 0, booked: 0, lead: '', status: 'Needs host' };
    openModal({
      title: isNew ? 'Add a booking' : 'Edit booking',
      fields: [
        { name: 'title', label: 'Booking (no family details needed)', value: e.title, full: true, required: true },
        { name: 'date', label: 'Date', type: 'date', value: e.date, required: true }, { name: 'time', label: 'Time', value: e.time },
        { name: 'lead', label: 'Host', type: 'select', options: staffOpts(), value: e.lead }, { name: 'status', label: 'Status', type: 'select', options: ['Needs host', 'Confirmed', 'Done', 'Cancelled'], value: e.status }
      ],
      onSave: function (v) { e.title = v.title; e.date = v.date; e.time = v.time; e.lead = v.lead; e.status = v.lead && v.status === 'Needs host' ? 'Confirmed' : v.status; if (isNew) S.events.push(e); save(isNew ? 'Booking added' : 'Booking saved'); },
      onDelete: isNew ? null : function () { S.events = S.events.filter(function (x) { return x.id !== e.id; }); save('Booking removed'); }
    });
  }
  function recruitModal(r) {
    var isNew = !r; r = r || { id: uid('r'), name: '', year: now.getFullYear() + 2, level: '', ig: '', photo: '', show: true };
    openModal({
      title: isNew ? 'Add a recruitable athlete' : 'Edit ' + r.name,
      fields: [
        { name: 'name', label: 'Name', value: r.name, full: true, required: true },
        { name: 'year', label: 'Graduating class', type: 'number', min: 2026, value: r.year }, { name: 'level', label: 'Level', value: r.level },
        { name: 'ig', label: 'Instagram handle (no @)', value: r.ig, full: true }
      ],
      onSave: function (v) { r.name = v.name; r.year = v.year; r.level = v.level; r.ig = v.ig.replace(/^@/, ''); if (isNew) S.site.recruits.push(r); save('Recruit page updated', 'recruits.html'); },
      onDelete: isNew ? null : function () { S.site.recruits = S.site.recruits.filter(function (x) { return x.id !== r.id; }); save('Removed from the recruit page', 'recruits.html'); }
    });
  }
  function groupModal(g) {
    var isNew = !g; g = g || { id: uid('g'), name: '', track: 'USAG', athletes: 0, hours: 6 };
    openModal({
      title: isNew ? 'Add a training group' : 'Edit ' + g.name,
      fields: [{ name: 'name', label: 'Group', value: g.name, required: true }, { name: 'track', label: 'Program', type: 'select', options: ['USAG', 'Xcel'], value: g.track },
        { name: 'athletes', label: 'Athletes', type: 'number', min: 0, value: g.athletes }, { name: 'hours', label: 'Hours per week', type: 'number', min: 0, value: g.hours }],
      onSave: function (v) { g.name = v.name; g.track = v.track; g.athletes = v.athletes; g.hours = v.hours; if (isNew) S.teamGroups.push(g); save('Group saved'); },
      onDelete: isNew ? null : function () { S.teamGroups = S.teamGroups.filter(function (x) { return x.id !== g.id; }); save('Group removed'); }
    });
  }
  function staffModal(s) {
    var isNew = !s; s = s || { id: uid('s'), name: '', role: 'Instructor', areas: ['Recreational'], sample: false };
    openModal({
      title: isNew ? 'Add a staff member' : 'Edit ' + s.name,
      fields: [{ name: 'name', label: 'Name', value: s.name, full: true, required: true }, { name: 'role', label: 'Role', value: s.role, full: true },
        { name: 'areas', label: 'Areas (comma separated)', value: s.areas.join(', '), full: true }],
      onSave: function (v) { s.name = v.name; s.role = v.role; s.areas = v.areas.split(',').map(function (x) { return x.trim(); }).filter(Boolean); s.sample = false; if (isNew) S.staff.push(s); save('Staff saved'); },
      onDelete: isNew ? null : function () {
        S.staff = S.staff.filter(function (x) { return x.id !== s.id; });
        S.classes.forEach(function (c) { if (c.coach === s.id) c.coach = ''; }); S.events.forEach(function (e) { if (e.lead === s.id) e.lead = ''; });
        save('Staff removed — their classes are now unassigned');
      }
    });
  }

  var acts = {
    seg: function (el) { ui[el.getAttribute('data-key')] = el.getAttribute('data-val'); render(); },
    cal: function (el) {
      var v = +el.getAttribute('data-val');
      if (!v) { ui.calY = now.getFullYear(); ui.calM = now.getMonth(); }
      else { var d = new Date(ui.calY, ui.calM + v, 1); ui.calY = d.getFullYear(); ui.calM = d.getMonth(); }
      render();
    },
    addClass: function () { classModal(null); }, editClass: function (el, id) { classModal(R.find(S.classes, id)); },
    addCamp: function () { campModal(null); }, editCamp: function (el, id) { campModal(R.find(S.camps, id)); },
    addEvent: function () { eventModal(null); }, editEvent: function (el, id) { eventModal(R.find(S.events, id)); },
    addRecruit: function () { recruitModal(null); }, editRecruit: function (el, id) { recruitModal(R.find(S.site.recruits, id)); },
    addGroup: function () { groupModal(null); }, editGroup: function (el, id) { groupModal(R.find(S.teamGroups, id)); },
    addStaff: function () { staffModal(null); }, editStaff: function (el, id) { staffModal(R.find(S.staff, id)); },
    editMeet: function (el, id) {
      var m = R.find(S.site.meets, id);
      openModal({ title: m.name, fields: [{ name: 'start', label: 'First day', type: 'date', value: m.start }, { name: 'end', label: 'Last day', type: 'date', value: m.end }],
        onSave: function (v) { m.start = v.start; m.end = v.end || v.start; save('Meet dates published', 'meets.html'); } });
    },
    addTask: function (el, id) {
      openModal({ title: 'Add a checklist item', fields: [{ name: 'text', label: 'What needs to happen?', value: '', full: true, required: true }],
        onSave: function (v) { if (v.text) { S.meetTasks.push({ id: uid('m'), meet: id, text: v.text, done: false }); save('Added'); } } });
    },
    addDate: function () { S.site.dates.push({ id: uid('d'), date: todayIso, end: '', label: 'New date', kind: 'session' }); save('Date added', 'index.html#fall'); render(); },
    delDate: function (el, id) { S.site.dates = S.site.dates.filter(function (d) { return d.id !== id; }); save('Date removed', 'index.html#fall'); render(); },
    delMsg: function (el, id) { S.inbox = S.inbox.filter(function (m) { return m.id !== id; }); save('Request deleted'); render(); }
  };

  var chgs = {
    classCoach: function (el, id) { R.find(S.classes, id).coach = el.value; save('Coach updated'); },
    eventLead: function (el, id) { var e = R.find(S.events, id); e.lead = el.value; if (e.kind === 'Birthday party' && e.status !== 'Done' && e.status !== 'Cancelled') e.status = el.value ? 'Confirmed' : 'Needs host'; save('Host updated'); render(); },
    task: function (el, id) { R.find(S.meetTasks, id).done = el.checked; save(el.checked ? 'Checked off' : 'Reopened'); render(); },
    recruitShow: function (el, id) { R.find(S.site.recruits, id).show = el.checked; save(el.checked ? 'Shown on the recruit page' : 'Hidden from the recruit page', 'recruits.html'); render(); },
    campPublish: function (el, id) { R.find(S.camps, id).publish = el.checked; save(el.checked ? 'Published to the events page' : 'Removed from the events page', 'events.html#clinics'); render(); },
    flippin: function (el) {
      var k = el.getAttribute('data-key'); S.site.flippin[k] = el.type === 'number' ? +el.value || 0 : el.value;
      var ff = S.events.filter(function (e) { return e.kind === 'Flippin’ Friday'; })[0];
      if (ff) { ff.date = S.site.flippin.date; ff.time = S.site.flippin.time; }
      save('Flippin’ Friday published', 'events.html#flippin');
    },
    msgStatus: function (el, id) { R.find(S.inbox, id).status = el.value; save('Status updated'); render(); },
    msgAssign: function (el, id) { var m = R.find(S.inbox, id); m.assignee = el.value; if (el.value && m.status === 'New') m.status = 'Assigned'; save(el.value ? 'Assigned to ' + staffName(el.value) : 'Unassigned'); render(); },
    annOn: function (el) { S.site.announcement.on = el.checked; save(el.checked ? 'Announcement bar is on' : 'Announcement bar is off', 'index.html'); render(); },
    annText: function (el) { S.site.announcement.text = el.value.trim(); save('Announcement published', 'index.html'); render(); },
    sess: function (el, id) { R.find(S.site.sessions, id)[el.getAttribute('data-key')] = el.value; save('Session dates published', 'index.html#fall'); },
    fee: function (el) { S.site.regFee[el.getAttribute('data-key')] = +el.value || 0; save('Registration fee published', 'classes.html#pricing'); },
    gymYear: function (el) { S.site.gymYear = el.value.trim(); save('Gym year published', 'classes.html#pricing'); },
    date: function (el, id) { R.find(S.site.dates, id)[el.getAttribute('data-key')] = el.value; save('Important dates published', 'index.html#fall'); },
    ctype: function (el, id) { R.find(S.site.classTypes, id)[el.getAttribute('data-key')] = +el.value || 0; save('Pricing published', 'classes.html#pricing'); }
  };

  view.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]'); if (!el) return;
    var fn = acts[el.getAttribute('data-act')]; if (fn) fn(el, el.getAttribute('data-id'));
  });
  view.addEventListener('change', function (e) {
    var el = e.target.closest('[data-chg]'); if (!el) return;
    var fn = chgs[el.getAttribute('data-chg')]; if (fn) fn(el, el.getAttribute('data-id'));
  });

  /* ───────── shell ───────── */
  var current = 'today';
  function render() {
    var v = views[current];
    $('#viewTitle').textContent = v.title; $('#viewSub').textContent = v.sub();
    view.innerHTML = v.render();
    $$('#sideNav a').forEach(function (a) { var on = a.getAttribute('data-view') === current; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    document.title = v.title + ' · MBG Staff Dashboard — concept';
  }
  function route() {
    var k = (location.hash || '#today').slice(1);
    current = views[k] ? k : 'today';
    S = store.load(); // pick up requests submitted from the website in another tab
    setDrawer(false); badge(); render(); window.scrollTo(0, 0);
  }
  var side = $('#side'), scrim = $('#scrim'), menuBtn = $('#menuBtn');
  function setDrawer(open) { side.classList.toggle('open', open); scrim.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  menuBtn.addEventListener('click', function () { setDrawer(!side.classList.contains('open')); });
  scrim.addEventListener('click', function () { setDrawer(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });
  $('#sampleBtn').addEventListener('click', function () { var n = $('#sampleNote'); n.hidden = !n.hidden; this.setAttribute('aria-expanded', n.hidden ? 'false' : 'true'); });
  $('#resetBtn').addEventListener('click', function () { S = store.reset(); setDrawer(false); badge(); render(); toast('Demo data reset — the website is back to MBG’s published details'); });
  window.addEventListener('hashchange', route);
  window.addEventListener('storage', function (e) { if (e.key === store.KEY) { S = store.load(); badge(); render(); } });
  route();
})();
