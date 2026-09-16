/* Appointment request — CONCEPT DEMO.
   Nothing leaves the browser: no fetch, no storage, uploads stay as local object URLs. */
(function () {
  'use strict';
  var form = document.getElementById('req');
  if (!form) return;
  var $ = function (id) { return document.getElementById(id); };
  var steps = [].slice.call(form.querySelectorAll('fieldset[data-step]'));
  var prog = [].slice.call(document.querySelectorAll('.progress li'));
  var back = $('back'), next = $('next'), nav = $('formnav'), done = $('done');
  var step = 1, files = [], ref = null;
  var LABEL = { tattoo: 'Tattoo', piercing: 'Piercing', toothgem: 'Tooth gem', private: 'Private experience' };
  var HINT = {
    tattoo: 'The more the studio knows, the better the first reply. Rough ideas are welcome.',
    piercing: 'Tell the studio what you’d like, or skip ahead to your dates.',
    toothgem: 'Tell the studio what you’d like, or skip ahead to your dates.',
    private: 'Tell the studio about the occasion, the setting and who’s joining.'
  };

  /* ---- deep links: ?service=…&ref=w03 ---- */
  var qs = new URLSearchParams(location.search);
  var pre = qs.get('service');
  if (pre && LABEL[pre]) $('s-' + pre).checked = true;
  var refId = qs.get('ref');
  if (refId && window.STT) {
    ref = window.STT.byId(refId);
    if (ref) { $('s-tattoo').checked = true; }
  }
  function service() { var c = form.querySelector('input[name=service]:checked'); return c ? c.value : ''; }

  function renderRef() {
    var card = $('refcard');
    if (!ref || service() !== 'tattoo') { card.hidden = true; return; }
    card.hidden = false;
    card.querySelector('img').src = '../img/work/' + ref.id + '-s.webp';
    card.querySelector('img').alt = 'Reference: ' + ref.caption;
    card.querySelector('span').textContent = 'Reference: ' + ref.caption;
  }
  $('ref-remove').addEventListener('click', function () {
    ref = null; renderRef();
    history.replaceState(null, '', location.pathname + '?service=tattoo');
  });

  /* ---- conditional fields ---- */
  function applyService() {
    var s = service();
    form.querySelectorAll('[data-for]').forEach(function (el) {
      el.hidden = el.getAttribute('data-for').split(' ').indexOf(s) === -1;
    });
    form.querySelectorAll('[data-opt-private]').forEach(function (el) { el.hidden = s !== 'private'; });
    form.querySelector('[data-hint]').textContent = HINT[s] || '';
    renderRef();
  }
  form.querySelectorAll('input[name=service]').forEach(function (r) {
    r.addEventListener('change', function () { $('err-service').hidden = true; applyService(); });
  });

  /* ---- local-only reference previews ---- */
  $('files').addEventListener('change', function (e) {
    [].slice.call(e.target.files).forEach(function (f) {
      if (files.length >= 5 || !/^image\//.test(f.type)) return;
      files.push({ name: f.name, url: URL.createObjectURL(f) });
    });
    e.target.value = '';
    drawThumbs();
  });
  function drawThumbs() {
    var t = $('thumbs'); t.innerHTML = '';
    files.forEach(function (f, i) {
      var fig = document.createElement('figure');
      fig.innerHTML = '<img alt="">' + '<button type="button" aria-label="Remove ' + window.STT.esc(f.name) + '">&times;</button>';
      fig.querySelector('img').src = f.url; fig.querySelector('img').alt = 'Reference image ' + (i + 1);
      fig.querySelector('button').addEventListener('click', function () { URL.revokeObjectURL(f.url); files.splice(i, 1); drawThumbs(); });
      t.appendChild(fig);
    });
  }

  /* ---- validation ---- */
  function flag(id, bad) {
    var err = $('err-' + id), input = $(id === 'dfrom' ? 'd-from' : id === 'dto' ? 'd-to' : id);
    if (err) err.hidden = !bad;
    if (input) { if (bad) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
    return bad;
  }
  function validate(n) {
    var s = service(), bad = [];
    if (n === 1) { if (!s) { $('err-service').hidden = false; bad.push(form.querySelector('input[name=service]')); } }
    if (n === 2) {
      if (s === 'tattoo' || s === 'private') { if (flag('idea', !$('idea').value.trim())) bad.push($('idea')); }
      if (s === 'tattoo') {
        if (flag('placement', !$('placement').value)) bad.push($('placement'));
        if (flag('size', !$('size').value)) bad.push($('size'));
      } else { flag('placement', false); flag('size', false); }
      if (s === 'private') {
        if (flag('setting', !$('setting').value)) bad.push($('setting'));
        if (flag('group', !$('group').value)) bad.push($('group'));
      }
    }
    if (n === 3) {
      var a = $('d-from').value, b = $('d-to').value;
      if (flag('dfrom', !a)) bad.push($('d-from'));
      if (flag('dto', !!(a && b && b < a))) bad.push($('d-to'));
    }
    if (n === 4) {
      if (flag('fname', !$('fname').value.trim())) bad.push($('fname'));
      if (flag('lname', !$('lname').value.trim())) bad.push($('lname'));
      if (flag('email', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('email').value.trim()))) bad.push($('email'));
    }
    if (bad.length) bad[0].focus();
    return !bad.length;
  }
  form.addEventListener('input', function (e) {
    var id = e.target.id === 'd-from' ? 'dfrom' : e.target.id === 'd-to' ? 'dto' : e.target.id;
    var err = $('err-' + id);
    if (err && !err.hidden) flag(id, false);
  });

  /* ---- summary ---- */
  function fmt(d) {
    if (!d) return '';
    var p = d.split('-'); var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return parseInt(p[2], 10) + ' ' + m[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }
  function summary() {
    var s = service(), rows = [];
    function add(k, v, st) { if (v) rows.push([k, v, st]); }
    add('Experience', LABEL[s], 1);
    if (s === 'tattoo' || s === 'private') add('Idea', $('idea').value.trim(), 2);
    if (s === 'piercing' || s === 'toothgem') add('Details', $('svcnote').value.trim() || '—', 2);
    if (ref && s === 'tattoo') add('Style reference', ref.caption, 2);
    if (s === 'tattoo' || s === 'private') { add('Placement', $('placement').value, 2); add('Size', $('size').value, 2); }
    if (s === 'tattoo') { var st = form.querySelector('input[name=style]:checked'); add('Style', st && st.value, 2); }
    if (s === 'private') { add('Setting', $('setting').value, 2); add('People', $('group').value, 2); add('Occasion', $('occasion').value.trim(), 2); }
    if (files.length && (s === 'tattoo' || s === 'private')) add('References', files.length + ' image' + (files.length > 1 ? 's' : '') + ' (kept on this device)', 2);
    var dates = fmt($('d-from').value) + ($('d-to').value ? ' – ' + fmt($('d-to').value) : '');
    add('Preferred dates', dates + ($('flex').checked ? '\nFlexible' : ''), 3);
    if ($('arrive').value || $('leave').value) add('On the island', (fmt($('arrive').value) || '?') + ' – ' + (fmt($('leave').value) || '?'), 3);
    var dl = $('summary'); dl.innerHTML = '';
    rows.forEach(function (r) {
      var div = document.createElement('div');
      div.innerHTML = '<dt></dt><dd></dd><button type="button">Edit</button>';
      div.querySelector('dt').textContent = r[0];
      div.querySelector('dd').textContent = r[1];
      var b = div.querySelector('button');
      b.setAttribute('aria-label', 'Edit ' + r[0].toLowerCase());
      b.addEventListener('click', function () { go(r[2]); });
      dl.appendChild(div);
    });
  }

  /* ---- navigation ---- */
  function go(n, quiet) {
    step = n;
    steps.forEach(function (f) { f.hidden = +f.dataset.step !== n; });
    prog.forEach(function (li) {
      var p = +li.dataset.p;
      li.classList.toggle('is-current', p === n); li.classList.toggle('is-done', p < n);
      if (p === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    back.style.visibility = n === 1 ? 'hidden' : 'visible';
    next.innerHTML = n === 4 ? 'Send Request <span class="arr" aria-hidden="true">&rarr;</span>' : 'Continue <span class="arr" aria-hidden="true">&rarr;</span>';
    if (n === 2) applyService();
    if (n === 4) summary();
    if (quiet) return;
    var top = form.getBoundingClientRect().top + window.scrollY - 120;
    if (window.scrollY > top) window.scrollTo(0, top);
    var lg = steps[n - 1].querySelector('legend'); if (lg) lg.focus({ preventScroll: true });
  }
  back.addEventListener('click', function () { if (step > 1) go(step - 1); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(step)) return;
    if (step < 4) return go(step + 1);
    // DEMO: intentionally no network request.
    steps.forEach(function (f) { f.hidden = true; });
    nav.hidden = true; done.hidden = false;
    prog.forEach(function (li) { li.classList.add('is-done'); li.classList.remove('is-current'); });
    window.scrollTo(0, Math.max(0, form.getBoundingClientRect().top + window.scrollY - 140));
    done.focus({ preventScroll: true });
  });
  $('restart').addEventListener('click', function () {
    files.forEach(function (f) { URL.revokeObjectURL(f.url); }); files = [];
    form.reset(); drawThumbs(); ref = null;
    history.replaceState(null, '', location.pathname);
    done.hidden = true; nav.hidden = false; go(1);
  });

  applyService();
  go(1, true);
})();
