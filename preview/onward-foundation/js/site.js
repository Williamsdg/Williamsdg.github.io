/* Onward! redesign concept — vanilla JS, no build step */
(function () {
  var D = window.ONWARD || { funds: [], scholarships: [], other: [], awardees: [] };
  var DONATE = 'https://onwardfdn.fcsuite.com/erp/donate';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  /* ---- menu ---- */
  var menuBtn = $('.menu-btn'), nav = $('.nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---- reveal on scroll ---- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && rv.length) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* ---- mobile bottom bar: hidden while the hero buttons are on screen ---- */
  var mbar = $('.mbar'), heroCta = $('[data-hero-cta]');
  if (mbar) {
    document.body.classList.add('has-mbar');
    if (heroCta && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { mbar.classList.toggle('show', !es[0].isIntersecting); }).observe(heroCta);
    } else { mbar.classList.add('show'); }
  }

  /* ---- grant cycle status: opens September 1, closes October 15, every year ---- */
  function cycle(now) {
    var y = now.getFullYear(), open = new Date(y, 8, 1), close = new Date(y, 9, 15, 23, 59, 59);
    if (now >= open && now <= close) {
      var days = Math.ceil((close - now) / 864e5);
      return { open: true, title: 'The ' + y + ' grant cycle is open.', text: 'Applications close October 15' + (days <= 21 ? ' — ' + days + (days === 1 ? ' day' : ' days') + ' left.' : '.') };
    }
    var next = now < open ? y : y + 1;
    return { open: false, title: 'The ' + next + ' grant cycle opens September 1.', text: 'Applications are accepted September 1 through October 15.' };
  }
  $$('[data-cycle]').forEach(function (el) {
    var c = cycle(new Date());
    var t = $('[data-cycle-title]', el), x = $('[data-cycle-text]', el);
    if (t) t.textContent = c.title;
    if (x) x.textContent = c.text;
    el.classList.toggle('is-open', c.open);
  });

  /* ---- demo forms (newsletter, contact) ---- */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = $('.demo-msg', f.parentNode);
      if (m) { m.classList.add('show'); m.setAttribute('tabindex', '-1'); m.focus(); }
    });
  });

  /* ---- fund directory ---- */
  var TYPES = { all: 'All funds', fiscal: 'Fiscal projects', scholarship: 'Scholarships', agency: 'Agency funds', endowment: 'Endowments', daf: 'Donor advised', general: 'Specific interest' };
  var LABEL = { fiscal: 'Fiscal project', scholarship: 'Scholarship fund', agency: 'Agency fund', endowment: 'Endowment fund', daf: 'Donor advised fund', general: 'Specific interest fund' };
  var dir = $('#fund-directory');
  if (dir) {
    var chips = $('#fund-chips'), list = $('#fund-list'), q = $('#fund-search'), count = $('#fund-count'), moreBtn = $('#fund-more');
    var PAGE = 12, shown = PAGE, type = 'all';
    var p = new URLSearchParams(location.search).get('type');
    if (p && TYPES[p]) type = p;
    var totals = { all: D.funds.length };
    D.funds.forEach(function (f) { totals[f.t] = (totals[f.t] || 0) + 1; });
    chips.innerHTML = Object.keys(TYPES).map(function (k) {
      return '<button type="button" class="chip-btn" data-type="' + k + '" aria-pressed="' + (k === type) + '">' + TYPES[k] + '<i>' + (totals[k] || 0) + '</i></button>';
    }).join('');
    function draw() {
      var term = (q.value || '').trim().toLowerCase();
      var rows = D.funds.filter(function (f) {
        return (type === 'all' || f.t === type) && (!term || (f.n + ' ' + f.d).toLowerCase().indexOf(term) > -1);
      }).sort(function (a, b) { return a.n.replace(/^The /, '').localeCompare(b.n.replace(/^The /, '')); });
      count.textContent = rows.length + (rows.length === 1 ? ' fund' : ' funds') + (type !== 'all' ? ' · ' + TYPES[type] : '') + (term ? ' matching “' + q.value.trim() + '”' : '');
      if (!rows.length) { list.innerHTML = '<div class="empty">No funds match that search. Try a shorter word, or <a href="../#contact">ask us</a> — we are glad to help.</div>'; moreBtn.hidden = true; return; }
      list.innerHTML = rows.slice(0, shown).map(function (f) {
        var long = f.d.length > 230;
        return '<article class="fund"><span class="tag t-' + f.t + '">' + LABEL[f.t] + '</span><h3>' + esc(f.n) + '</h3><div class="est">Established ' + esc(f.e) + '</div>' +
          (f.d ? '<p class="' + (long ? 'clamp' : '') + '">' + esc(f.d) + '</p>' : '') +
          '<div class="row"><a class="give" href="' + DONATE + '" target="_blank" rel="noopener">Give to this fund &rarr;</a>' + (long ? '<button type="button" class="linkbtn" data-more>Read more</button>' : '') + '</div></article>';
      }).join('');
      moreBtn.hidden = rows.length <= shown;
      moreBtn.textContent = 'Show ' + Math.min(PAGE * 2, rows.length - shown) + ' more';
    }
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('.chip-btn'); if (!b) return;
      type = b.getAttribute('data-type'); shown = PAGE;
      $$('.chip-btn', chips).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
      draw();
    });
    q.addEventListener('input', function () { shown = PAGE; draw(); });
    moreBtn.addEventListener('click', function () { shown += PAGE * 2; draw(); });
    list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-more]'); if (!b) return;
      var para = $('p', b.closest('.fund')); var open = para.classList.toggle('clamp');
      b.textContent = open ? 'Read more' : 'Show less';
    });
    draw();
  }

  /* ---- scholarships ---- */
  var FIELD = { all: 'All fields', medical: 'Medical', education: 'Education', trades: 'Trade & vocational', stem: 'Engineering & science', athletics: 'Student athletes', '4h': '4-H', military: 'Armed forces' };
  var HOW = { online: ['how', 'Online application'], pdf: ['pdf', 'PDF application'], auto: ['auto', 'No separate application'], call: ['pdf', 'Apply by phone'] };
  var schList = $('#sch-list');
  function schMatch(s, school, field) {
    return (school === 'all' || s.open.indexOf(school) > -1) && (field === 'all' || s.f.indexOf(field) > -1);
  }
  if (schList) {
    var sSchool = $('#sch-school'), sChips = $('#sch-chips'), sCount = $('#sch-count'), field = 'all', schAll = false;
    sChips.innerHTML = Object.keys(FIELD).map(function (k) { return '<button type="button" class="chip-btn" data-field="' + k + '" aria-pressed="' + (k === 'all') + '">' + FIELD[k] + '</button>'; }).join('');
    function drawSch() {
      var rows = D.scholarships.filter(function (s) { return schMatch(s, sSchool.value, field); });
      sCount.textContent = rows.length + (rows.length === 1 ? ' scholarship' : ' scholarships') + ' match';
      var small = window.matchMedia && window.matchMedia('(max-width:640px)').matches;
      var total = rows.length, cut = small && !schAll && total > 6;
      if (cut) rows = rows.slice(0, 6);
      schList.innerHTML = rows.length ? rows.map(function (s) {
        var h = HOW[s.app];
        return '<article class="sch"><div><h3>' + esc(s.n) + '</h3><p>' + esc(s.d) + '</p><div class="meta"><span class="pill">' + esc(s.who) + '</span><span class="pill ' + h[0] + '">' + (s.app === 'auto' ? 'Considered automatically with the ' + esc(s.auto) : h[1]) + '</span>' +
          (s.deadline ? '<span class="pill pdf">Deadline: ' + esc(s.deadline) + '</span>' : '') + '</div></div><div class="amt">' + esc(s.amt || '') + '</div></article>';
      }).join('') + (cut ? '<div class="more-wrap"><button type="button" class="btn btn-ghost" data-sch-all>Show all ' + total + ' scholarships</button></div>' : '') : '<div class="empty">No scholarships match both filters. Try “All fields”.</div>';
    }
    schList.addEventListener('click', function (e) { if (e.target.closest('[data-sch-all]')) { schAll = true; drawSch(); } });
    sSchool.addEventListener('change', drawSch);
    sChips.addEventListener('click', function (e) {
      var b = e.target.closest('.chip-btn'); if (!b) return;
      field = b.getAttribute('data-field');
      $$('.chip-btn', sChips).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
      drawSch();
    });
    drawSch();
    var oth = $('#sch-other');
    if (oth) oth.innerHTML = D.other.map(function (s) { return '<div><b>' + esc(s.n) + '</b><p>' + esc(s.d) + '</p></div>'; }).join('');
  }

  /* ---- one-application demo ---- */
  var app = $('#app-demo');
  if (app) {
    var KEY = 'onward-concept-application', step = 0;
    var panes = $$('.app-pane', app), heads = $$('.app-step', app), back = $('#app-back'), next = $('#app-next'), saved = $('#app-saved'), picks = $('#app-picks'), aSchool = $('#app-school');
    function drawPicks() {
      var rows = D.scholarships.filter(function (s) { return s.app === 'online' && schMatch(s, aSchool.value || 'all', 'all'); });
      var st = store(KEY) || {};
      picks.innerHTML = rows.map(function (s, i) {
        var autos = D.scholarships.filter(function (x) { return x.app === 'auto' && x.auto === s.n.replace(/^The /, ''); }).map(function (x) { return x.n; });
        return '<label class="pick"><input type="checkbox" name="pick" value="' + esc(s.n) + '"' + ((st.picks || []).indexOf(s.n) > -1 ? ' checked' : '') + '><span><b>' + esc(s.n) + '</b><small>' + esc(s.who) + (s.amt ? ' · ' + esc(s.amt) : '') + (autos.length ? ' · also considers you for the ' + esc(autos.join(' and the ')) : '') + '</small></span></label>';
      }).join('');
    }
    function go(n) {
      step = Math.max(0, Math.min(panes.length - 1, n));
      panes.forEach(function (p, i) { p.classList.toggle('on', i === step); });
      heads.forEach(function (h, i) { h.classList.toggle('on', i === step); h.classList.toggle('done', i < step); });
      back.style.visibility = step === 0 || step === panes.length - 1 ? 'hidden' : 'visible';
      next.textContent = step === panes.length - 2 ? 'Submit application' : 'Continue';
      next.style.display = step === panes.length - 1 ? 'none' : '';
      if (step === 1) drawPicks();
    }
    function save() {
      var st = { school: aSchool.value, name: $('#app-name').value, email: $('#app-email').value, year: $('#app-year').value, picks: $$('input[name=pick]:checked', app).map(function (i) { return i.value; }) };
      store(KEY, st);
      saved.textContent = 'Progress saved on this device';
    }
    var st0 = store(KEY);
    if (st0) { aSchool.value = st0.school || ''; $('#app-name').value = st0.name || ''; $('#app-email').value = st0.email || ''; $('#app-year').value = st0.year || ''; saved.textContent = 'We kept your place from last time'; }
    app.addEventListener('change', save);
    next.addEventListener('click', function () {
      if (step === 0 && !aSchool.value) { aSchool.focus(); saved.textContent = 'Choose your high school to continue'; return; }
      if (step === panes.length - 2) store(KEY, null);
      go(step + 1);
      app.scrollIntoView({ block: 'nearest' });
    });
    back.addEventListener('click', function () { go(step - 1); });
    go(0);
  }

  /* ---- awardees ---- */
  var aw = $('#awardees');
  if (aw) aw.innerHTML = D.awardees.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');

  /* ---- board portal demo gate ---- */
  var gate = $('#gate-form');
  if (gate) {
    var wrap = $('#gate-wrap'), portal = $('#portal'), err = $('#gate-err');
    function unlock() { wrap.classList.add('off'); portal.classList.add('on'); try { sessionStorage.setItem('onward-concept-board', '1'); } catch (e) {} }
    try { if (sessionStorage.getItem('onward-concept-board') === '1') unlock(); } catch (e) {}
    gate.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('#gate-pass').value.trim().toLowerCase() === 'onward2026') { err.textContent = ''; unlock(); window.scrollTo(0, 0); }
      else { err.textContent = 'That password is not right. For this demo it is onward2026.'; }
    });
    var out = $('#portal-out');
    if (out) out.addEventListener('click', function () { try { sessionStorage.removeItem('onward-concept-board'); } catch (e) {} portal.classList.remove('on'); wrap.classList.remove('off'); $('#gate-pass').value = ''; });
  }
})();
