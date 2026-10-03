/* CAMWS concept — Williams Digital. Plain JavaScript, no libraries. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // mobile menu
  var mb = $('#menuBtn'), dr = $('#drawer');
  if (mb && dr) mb.addEventListener('click', function () {
    var open = dr.classList.toggle('open');
    mb.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // tabs: any [data-tabs] group of buttons with data-tab, panels with data-panel
  $$('[data-tabs]').forEach(function (group) {
    var name = group.getAttribute('data-tabs');
    var btns = $$('[data-tab]', group);
    function show(id) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tab') === id ? 'true' : 'false'); });
      $$('[data-panel="' + name + '"]').forEach(function (p) { p.hidden = p.id !== id; });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { show(b.getAttribute('data-tab')); }); });
    var hash = location.hash.replace('#', '');
    if (hash && btns.some(function (b) { return b.getAttribute('data-tab') === hash; })) show(hash);
  });

  // ---- dates published on camws.org ----
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var FIXED = [
    ['2026-10-05', 'Individual paper abstracts due', 'CAMWS 2027 call for papers'],
    ['2026-11-16', 'Poster abstracts due', 'Undergraduates only'],
    ['2027-02-17', 'Hotel Cleveland room block closes', 'Reserve by this date'],
    ['2027-03-17', '123rd Annual Meeting opens', 'Cleveland, Ohio, through March 20']
  ];
  // annual deadlines (month, day) as listed on the CAMWS awards page
  var ANNUAL = [
    [11, 15, 'Teaching Awards nominations', 'Awards'],
    [12, 6, 'Faculty-Undergraduate Collaborative Research Grant', 'Awards'],
    [12, 20, 'Teaching Awards applications', 'Awards'],
    [1, 30, 'Summer Travel, Excavation and Field School, Stewart awards', 'Awards'],
    [1, 31, 'Masciantonio Diversity Award', 'Awards'],
    [2, 1, 'Teacher Training Initiative', 'Awards']
  ];
  function nextOccurrence(m, d, now) {
    var y = now.getFullYear();
    var dt = new Date(y, m - 1, d, 23, 59);
    if (dt < now) dt = new Date(y + 1, m - 1, d, 23, 59);
    return dt;
  }
  var dl = $('#deadlines');
  if (dl) {
    var now = new Date();
    var items = FIXED.map(function (f) {
      var p = f[0].split('-'); return { date: new Date(+p[0], +p[1] - 1, +p[2], 23, 59), title: f[1], sub: f[2] };
    }).concat(ANNUAL.map(function (a) { return { date: nextOccurrence(a[0], a[1], now), title: a[2], sub: a[3] }; }))
      .filter(function (i) { return i.date >= now; })
      .sort(function (a, b) { return a.date - b.date; }).slice(0, 5);
    dl.innerHTML = items.map(function (i) {
      var days = Math.ceil((i.date - now) / 864e5);
      var left = days <= 0 ? 'Today' : days === 1 ? 'Tomorrow' : days < 61 ? days + ' days' : Math.round(days / 30) + ' months';
      return '<li><span class="d"><b>' + i.date.getDate() + '</b><small>' + MONTHS[i.date.getMonth()] + ' ' + i.date.getFullYear() + '</small></span>' +
        '<span class="t">' + i.title + '<small>' + i.sub + '</small></span><span class="left">' + left + '</span></li>';
    }).join('');
  }

  // ---- membership categories and dues, from camws.org/duesstructure ----
  var CATS = {
    student: ['Student', 35, 'Undergraduate and graduate students.', ['Submit an abstract for the annual meeting', 'Apply for travel, excavation, and field school awards', 'Loeb Classical Library online']],
    firstyear: ['First-year teacher', 40, 'Teachers in their first year in the classroom.', ['Apply for CAMWS New Teacher Awards', 'Teacher Training Initiative support', 'Classroom activity grants through CPLG']],
    k12: ['K-12 teacher', 65, 'Teachers beyond their first year.', ['Teaching Awards for middle and high school teachers', 'Keely Lake Travel Grant for school groups', 'Teaching Classical Languages, the CAMWS pedagogy journal']],
    contingent: ['Contingent faculty', 50, 'Contingent as defined by the AAUP.', ['Present at the annual meeting', 'Eligible for CAMWS awards and committee service', 'Loeb Classical Library online']],
    individual: ['Individual', 75, 'College and university faculty, independent scholars, and friends of Classics.', ['Present at the annual meeting', 'Serve on committees and in elected positions', 'Eligible for awards, grants, and book prizes']],
    retired: ['Retired', 40, 'Active membership with The Classical Journal. An associate membership without the journal is free.', ['Stay in the directory and on committees', 'The Classical Journal, electronic', 'CAMWS Newsletter three times a year']],
    newm: ['New CAMWS member', 40, 'A first-year rate for anyone joining for the first time.', ['Everything in an individual membership', 'Submit an abstract in your first year', 'Loeb Classical Library online']]
  };
  var catBtns = $$('[data-cat]');
  function showCat(k) {
    var c = CATS[k]; if (!c) return;
    catBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === k ? 'true' : 'false'); });
    $('#catName').textContent = c[0];
    $('#catAmt').textContent = '$' + c[1];
    $('#catNote').textContent = c[2];
    $('#catTicks').innerHTML = ['The Classical Journal, electronic subscription'].concat(c[3]).map(function (t) { return '<li>' + t + '</li>'; }).join('');
    $('#catJoin').href = 'portal.html#join';
  }
  if (catBtns.length) { catBtns.forEach(function (b) { b.addEventListener('click', function () { showCat(b.getAttribute('data-cat')); }); }); showCat('student'); }

  // ---- awards, from camws.org/awards ----
  var AWARDS = [
    ['Manson A. Stewart Undergraduate Awards', 'Nominations January 6, applications January 30', 'student'],
    ['James Ruebel Undergraduate Travel Award', 'January 30', 'student'],
    ['Presidential Awards for Outstanding Student Papers', 'February 15', 'student'],
    ['CAMWS International Latin Translation Exam', 'October 31', 'student k12'],
    ['Faculty-Undergraduate Collaborative Research Grant', 'December 6', 'student faculty'],
    ['Anthony Fauci Award in STEM and Classics', 'January 30', 'student'],
    ['Summer Travel Awards (Semple, Grant, and Benario)', 'January 30', 'student k12'],
    ['Excavation and Field School Awards', 'January 30', 'student k12'],
    ['Rudolph Masciantonio CAMWS Diversity Award', 'January 31', 'student'],
    ['CAMWS New Teacher Awards', 'January 30', 'k12'],
    ['Manson A. Stewart Teacher Training Awards', 'January 30', 'k12'],
    ['Teacher Training Initiative Scholarship', 'February 1', 'k12'],
    ['Keely Lake Travel Grant for School Groups', 'October 7 and January 30', 'k12'],
    ['John Breuker Jr. Award for Exceptional Promise in Latin Teaching', 'January 30', 'k12'],
    ['Teaching Awards', 'Nominations November 15, applications December 20', 'k12 faculty'],
    ['CPLG Promotional Activity Award', 'January 30', 'k12 faculty'],
    ['CAMWS First Book Award', 'Nominations September 1', 'faculty'],
    ['Bolchazy Pedagogy Book Award', 'Nominations September 1', 'faculty k12'],
    ['Manson A. Stewart Travel Awards', 'September 3 (Southern Section), January 30', 'student k12 faculty']
  ];
  var aw = $('#awardList'), awBtns = $$('[data-aw]');
  function showAwards(k) {
    awBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-aw') === k ? 'true' : 'false'); });
    var list = AWARDS.filter(function (a) { return k === 'all' || a[2].indexOf(k) > -1; });
    aw.innerHTML = list.map(function (a) { return '<li><b>' + a[0] + '</b><span class="when">' + a[1] + '</span></li>'; }).join('');
    $('#awardCount').textContent = list.length + (list.length === 1 ? ' award' : ' awards');
    aw.classList.add('clip'); var mb2 = $('#awardMore'); if (mb2) mb2.hidden = list.length < 6;
  }
  if ($('#awardMore')) $('#awardMore').addEventListener('click', function () { aw.classList.remove('clip'); this.hidden = true; });
  if (aw) { awBtns.forEach(function (b) { b.addEventListener('click', function () { showAwards(b.getAttribute('data-aw')); }); }); showAwards('student'); }

  // ---- renewal calculator (portal) ----
  var rf = $('#renewForm');
  if (rf) {
    var calc = function () {
      var cat = CATS[$('#rCat').value];
      var fmt = +(rf.querySelector('input[name=fmt]:checked') || { value: 0 }).value;
      var gift = Math.max(0, parseFloat($('#rGift').value) || 0);
      $('#rLineCat').textContent = cat[0] + ' membership, July 1, 2026 to June 30, 2027';
      $('#rLineAmt').textContent = '$' + cat[1];
      $('#rTotal').textContent = '$' + (cat[1] + fmt + gift).toFixed(2).replace('.00', '');
    };
    rf.addEventListener('input', calc); rf.addEventListener('change', calc); calc();
    rf.addEventListener('submit', function (e) {
      e.preventDefault();
      $('#renewDone').hidden = false; $('#renewDone').focus();
    });
  }

  // ---- directory search (sample entries only) ----
  var dq = $('#dirQ');
  if (dq) {
    var rows = $$('#dirBody tr');
    var run = function () {
      var q = dq.value.trim().toLowerCase(), n = 0;
      rows.forEach(function (r) { var hit = !q || r.textContent.toLowerCase().indexOf(q) > -1; r.hidden = !hit; if (hit) n++; });
      $('#dirCount').textContent = n + ' of ' + rows.length + ' sample entries';
    };
    dq.addEventListener('input', run); run();
  }

  // ---- CSV export of the sample staff report ----
  var ex = $('#exportCsv');
  if (ex) ex.addEventListener('click', function () {
    var lines = $$('#reportTbl tr').map(function (tr) {
      return $$('th,td', tr).map(function (c) { return '"' + c.textContent.trim().replace(/"/g, '""') + '"'; }).join(',');
    });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
    a.download = 'camws-membership-sample.csv'; document.body.appendChild(a); a.click(); a.remove();
  });

  // ---- step flows (meeting page) ----
  $$('[data-flow]').forEach(function (flow) {
    var panes = $$('[data-step]', flow), marks = $$('.steps li', flow), i = 0;
    function go(n) {
      i = Math.max(0, Math.min(panes.length - 1, n));
      panes.forEach(function (p, k) { p.hidden = k !== i; });
      marks.forEach(function (m, k) {
        m.classList.toggle('done', k < i);
        if (k === i) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
      });
    }
    $$('[data-next]', flow).forEach(function (b) { b.addEventListener('click', function () { go(i + 1); flow.scrollIntoView({ block: 'start' }); }); });
    $$('[data-back]', flow).forEach(function (b) { b.addEventListener('click', function () { go(i - 1); flow.scrollIntoView({ block: 'start' }); }); });
    go(0);
  });

  // word counter for the abstract box
  var ab = $('#absText');
  if (ab) ab.addEventListener('input', function () {
    var n = (ab.value.trim().match(/\S+/g) || []).length;
    $('#absCount').textContent = n + (n === 1 ? ' word' : ' words');
  });
})();
