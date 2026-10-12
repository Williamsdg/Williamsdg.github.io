/* Yellowhammer Coffee concept. Vanilla JS, no dependencies.
   Open/closed status is worked out in Mobile's time zone, so it is right wherever the visitor is. */
(function () {
  'use strict';
  var YH = window.YH || { locs: [] };
  var TZ = 'America/Chicago';
  var DAY = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---- time in Mobile
  function now() {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    return { d: DAY.indexOf(o.weekday), m: (+o.hour % 24) * 60 + +o.minute };
  }
  function clock(mins) {
    var h = Math.floor(mins / 60), m = mins % 60, ap = h < 12 ? 'AM' : 'PM', h12 = h % 12 || 12;
    return h12 + (m ? ':' + (m < 10 ? '0' : '') + m : '') + ' ' + ap;
  }
  function status(loc, t) {
    t = t || now();
    var today = loc.hours[t.d];
    if (today && t.m >= today[0] && t.m < today[1]) return { open: true, text: 'Open until ' + clock(today[1]) };
    if (today && t.m < today[0]) return { open: false, text: 'Closed. Opens ' + clock(today[0]) };
    for (var i = 1; i <= 7; i++) {
      var h = loc.hours[(t.d + i) % 7];
      if (h) return { open: false, text: 'Closed. Opens ' + (i === 1 ? 'tomorrow' : DAY[(t.d + i) % 7]) + ' ' + clock(h[0]) };
    }
    return { open: false, text: 'Closed' };
  }
  YH.status = status; YH.now = now; YH.clock = clock;
  YH.byslug = {};
  YH.locs.forEach(function (l) { YH.byslug[l.slug] = l; });

  function paint() {
    var t = now(), open = 0;
    YH.locs.forEach(function (l) { if (status(l, t).open) open++; });
    $$('[data-loc]').forEach(function (el) {
      var loc = YH.byslug[el.getAttribute('data-loc')];
      if (!loc) return;
      var s = status(loc, t);
      el.classList.toggle('is-open', s.open);
      el.classList.toggle('is-closed', !s.open);
      var out = $('[data-status]', el);
      if (out) out.textContent = s.text;
    });
    $$('[data-opencount]').forEach(function (el) {
      var n = $$('[data-loc]', el.closest('.board')).length;
      var o = $$('.is-open[data-loc]', el.closest('.board')).length;
      el.textContent = o === 0 ? 'All closed right now' : o === n ? 'All ' + n + ' open right now' : o + ' of ' + n + ' open right now';
    });
    $$('[data-clock]').forEach(function (el) { el.textContent = DAY[t.d] + ', ' + clock(t.m) + ' in Mobile'; });
    $$('[data-hours] tr').forEach(function (tr) { tr.classList.toggle('is-today', +tr.getAttribute('data-day') === t.d); });
  }
  paint();
  setInterval(paint, 30000);

  // ---- navigation
  var tog = $('.hd__tog'), mnav = $('#mnav');
  if (tog && mnav) {
    var setNav = function (open) {
      mnav.hidden = !open;
      tog.setAttribute('aria-expanded', String(open));
      $('.sr', tog).textContent = open ? 'Close navigation' : 'Open navigation';
    };
    tog.addEventListener('click', function () { setNav(mnav.hidden); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mnav.hidden) { setNav(false); tog.focus(); } });
    window.matchMedia('(min-width: 941px)').addEventListener('change', function (e) { if (e.matches) setNav(false); });
  }

  // ---- video: the poster becomes the player
  $$('[data-video]').forEach(function (box) {
    var b = $('button', box);
    if (!b) return;
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + box.getAttribute('data-video') + '?autoplay=1&rel=0';
      f.title = 'Yellowhammer Coffee video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      box.appendChild(f);
      b.remove();
      f.focus();
    });
  });

  // ---- menu search and the sugar-free filter
  var ms = $('#msearch'), msf = $('#msf'), mnone = $('#mnone');
  if (ms) {
    var filter = function () {
      var q = ms.value.trim().toLowerCase(), sf = msf.checked, any = false;
      document.body.classList.toggle('sf-only', sf);
      $$('.mi').forEach(function (li) {
        var hit = (!q || li.getAttribute('data-s').indexOf(q) > -1) && (!sf || li.hasAttribute('data-sf'));
        li.hidden = !hit;
        if (hit) any = true;
        // a group of choices with no sugar-free option has nothing left to show
        $$('.ch', li).forEach(function (c) { c.hidden = sf && !$('li[data-sf]', c); });
      });
      $$('[data-sec]').forEach(function (sec) { sec.hidden = !$('.mi:not([hidden])', sec); });
      mnone.hidden = any;
    };
    ms.addEventListener('input', filter);
    msf.addEventListener('change', filter);
    $('#mclear').addEventListener('click', function () { ms.value = ''; msf.checked = false; filter(); ms.focus(); });
  }

  // ---- forms: steps, validation, and a finish that says plainly nothing was sent
  $$('form[data-steps]').forEach(function (form) {
    var steps = $$('[data-step]', form), at = 0;
    var card = form.parentNode, done = $('[data-done]', card);
    var bars = $$('.steps i', form), note = $('[data-stepnote]', form);

    function fail(box, msg) { box.classList.add('bad'); $('.err', box).textContent = msg; }
    function clear(box) { box.classList.remove('bad'); $('.err', box).textContent = ''; }

    function check(step) {
      var first = null;
      $$('.field', step).forEach(function (box) {
        if (box.closest('[hidden]')) return;
        var el = $('input,select,textarea', box), v = el.value.trim(), bad = false;
        if (el.required && !v) bad = true;
        else if (v && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) bad = true;
        else if (v && el.hasAttribute('data-digits') && v.replace(/\D/g, '').length !== +el.getAttribute('data-digits')) bad = true;
        else if (v && el.hasAttribute('data-number') && !/^\d{1,3}$/.test(v)) bad = true;
        else if (v && el.type === 'url' && !/^https?:\/\/\S+\.\S+/.test(v)) bad = true;
        if (bad) { fail(box, el.getAttribute('data-msg') || 'Fill this in.'); first = first || el; } else clear(box);
      });
      $$('.grp[data-req]', step).forEach(function (box) {
        if ($('input:checked', box)) clear(box);
        else { fail(box, box.getAttribute('data-msg')); first = first || $('input', box); }
      });
      if (first) first.focus();
      return !first;
    }
    function show(i) {
      at = i;
      steps.forEach(function (s, n) { s.hidden = n !== i; });
      bars.forEach(function (b, n) { b.classList.toggle('on', n <= i); });
      if (note) note.textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
      var top = card.getBoundingClientRect().top + window.scrollY - 90;
      if (window.scrollY > top) window.scrollTo(0, top);
      var f = $('input,select,textarea', steps[i]);
      if (f && i > 0) f.focus({ preventScroll: true });
    }
    form.addEventListener('click', function (e) {
      if (e.target.closest('[data-next]')) { if (check(steps[at])) show(at + 1); }
      else if (e.target.closest('[data-back]')) show(at - 1);
    });
    form.addEventListener('input', function (e) { var b = e.target.closest('.field,.grp'); if (b && b.classList.contains('bad')) clear(b); });
    form.addEventListener('change', function (e) {
      var b = e.target.closest('.grp'); if (b) clear(b);
      if (e.target.name === 'transport') $('#transport-more').hidden = e.target.value !== 'Yes, with some limitations';
      if (e.target.name === 'receive') $('#pickup-more').hidden = e.target.value.indexOf('Pick up') !== 0;
      // "No preference" and named locations cancel each other out
      if (e.target.name === 'locations' && e.target.checked) {
        $$('input[name=locations]', form).forEach(function (c) {
          if (c !== e.target && (e.target.value === 'none' || c.value === 'none')) c.checked = false;
        });
      }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!check(steps[at])) return;
      var name = (form.elements.first || form.elements.cname || {}).value || '';
      var p = $('[data-done-p]', done), h = $('[data-done-h]', done);
      name = name.trim().split(' ')[0];
      h.textContent = name ? 'Thanks, ' + name : 'Thanks';
      if (form.elements.locations) {
        var picked = $$('input[name=locations]:checked', form).map(function (c) { return c.nextElementSibling.textContent; });
        p.textContent = picked[0] === 'No preference'
          ? 'A manager will follow up about a spot at any of our locations.'
          : 'A manager for ' + list(picked) + ' will follow up.';
      } else {
        p.textContent = 'Our team will reach out about your ' + form.elements.date.value.replace(/^(\d+)-(\d+)-(\d+)$/, function (_, y, m, d) { return (+m) + '/' + (+d) + '/' + y; }) + ' event.';
      }
      form.hidden = true; done.hidden = false; done.focus();
    });
    $('[data-restart]', done).addEventListener('click', function () {
      form.reset(); $$('.bad', form).forEach(clear);
      $$('#transport-more,#pickup-more', form).forEach(function (el) { el.hidden = true; });
      done.hidden = true; form.hidden = false; show(0);
    });
    function list(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }

    // arriving from a location page: that store is already ticked
    var want = new URLSearchParams(location.search).get('loc');
    if (want) $$('input[name=locations]', form).forEach(function (c) { if (c.value === want) c.checked = true; });
  });
})();
