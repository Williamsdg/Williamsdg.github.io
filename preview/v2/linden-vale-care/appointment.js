/* Linden & Vale Care — appointment stepper (fictional; stores only in this browser). */
(function () {
  'use strict';
  var L = window.LV, esc = window.LV_esc;
  var STEP_NAMES = { 1: 'Type of visit', 2: 'Provider', 3: 'Time', 4: 'Your details' };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var blank = { visit: null, provider: null, slot: null, day: null, name: '', email: '', isNew: null, confirmed: false };
  var S = Object.assign({}, blank, L.load('booking', {}));
  var current = 1;

  function persist() { L.save('booking', S); }
  function $(id) { return document.getElementById(id); }

  /* ---------- Params from the home page ---------- */
  var params = new URLSearchParams(location.search);
  var pVisit = params.get('visit'), pProv = params.get('provider');
  var startStep = null;
  if ((pVisit && L.visit(pVisit)) || (pProv && L.provider(pProv))) {
    S = Object.assign({}, blank, { name: S.name, email: S.email });
    L.save('checklist', {});
    if (pProv && L.provider(pProv)) S.provider = pProv;
    if (pVisit && L.visit(pVisit)) {
      S.visit = pVisit;
      if (S.provider && L.provider(S.provider).visits.indexOf(pVisit) < 0) S.provider = null;
      startStep = 2;
    } else startStep = 1;
    persist();
  }

  function maxReachable() {
    if (S.confirmed && S.visit && S.slot) return 'done';
    if (!S.visit) return 1;
    if (!S.provider) return 2;
    if (!S.slot) return 3;
    return 4;
  }
  function allowed(step) {
    var m = maxReachable();
    if (step === 'done') return m === 'done';
    if (m === 'done') return true;
    return step <= m;
  }

  /* ---------- Rendering ---------- */
  function renderVisits() {
    var prov = S.provider && S.provider !== 'first' ? L.provider(S.provider) : null;
    $('visit-opts').innerHTML = L.VISITS.map(function (v) {
      var fit = prov && prov.visits.indexOf(v.id) > -1 ? '<span class="opt-fit">Offered by ' + esc(prov.name) + '</span>' : '';
      return '<label class="opt"><input type="radio" name="visit" value="' + v.id + '"' + (S.visit === v.id ? ' checked' : '') + '>' +
        '<span class="ring" aria-hidden="true"></span><span class="opt-t">' + esc(v.name) + '</span>' +
        '<span class="opt-m">About ' + v.length + ' min</span><span class="opt-d">' + esc(v.desc) + '</span>' + fit + '</label>';
    }).join('');
  }

  function renderProviders() {
    var v = L.visit(S.visit); if (!v) return;
    var list = L.providersFor(v.id);
    $('s2-intro').textContent = v.name + ': ' + (list.length === 1 ? 'one clinician offers this visit, accepting new patients in this sample.' : list.length + ' clinicians offer this visit, all accepting new patients in this sample.');
    var first = '<div class="opt-wrap"><label class="opt first"><input type="radio" name="provider" value="first"' + (S.provider === 'first' ? ' checked' : '') + '>' +
      '<span class="ring" aria-hidden="true"></span><span class="fa-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>' +
      '<span class="opt-t">First available</span><span class="opt-d">See every sample time for this visit, soonest first.</span></label></div>';
    $('provider-opts').innerHTML = first + list.map(function (p) {
      return '<div class="opt-wrap"><label class="opt prov"><input type="radio" name="provider" value="' + p.id + '"' + (S.provider === p.id ? ' checked' : '') + '>' +
        '<span class="ring" aria-hidden="true"></span><span class="mono" aria-hidden="true">' + p.initials + '</span>' +
        '<span class="opt-t">' + esc(p.name) + '</span><span class="opt-d">' + esc(p.role) + '</span>' +
        '<span class="opt-x"><span>Speaks ' + esc(p.languages.join(', ')) + '</span><span class="tag">Accepting new patients (sample)</span></span></label>' +
        '<span class="opt-about"><button class="btn btn-quiet btn-small" type="button" data-provider-detail="' + p.id + '" aria-haspopup="dialog">About<span class="sr"> ' + esc(p.name) + '</span></button></span></div>';
    }).join('');
  }

  function currentSlots() {
    if (!S.visit || !S.provider) return [];
    return S.provider === 'first' ? L.slotsFirstAvailable(S.visit) : L.slotsFor(S.provider, S.visit);
  }

  function renderTimes() {
    var v = L.visit(S.visit), slots = currentSlots(), area = $('time-area');
    var who = S.provider === 'first' ? 'any clinician' : L.provider(S.provider).name;
    $('s3-intro').textContent = v.name + ' with ' + who + ' · about ' + v.length + ' minutes. Times are a fictional sample week.';
    if (!slots.length) {
      var alts = L.providersFor(S.visit).filter(function (p) { return p.id !== S.provider && L.slotsFor(p.id, S.visit).length; });
      area.innerHTML = '<div class="empty" role="status"><h3>No sample times — try another provider</h3>' +
        '<p>' + esc(who) + ' has no open ' + esc(v.name.toLowerCase()) + ' times in this sample week.</p><div class="row">' +
        alts.map(function (p) { return '<button class="btn btn-quiet btn-small" type="button" data-switch="' + p.id + '">Try ' + esc(p.name) + '</button>'; }).join('') +
        '<button class="btn btn-quiet btn-small" type="button" data-switch="first">First available</button></div></div>';
      return;
    }
    var byDay = {};
    slots.forEach(function (s) { (byDay[s.day] = byDay[s.day] || []).push(s); });
    var sel = S.slot && slots.filter(function (s) { return s.key === S.slot; })[0];
    if (!S.day || !L.DAYS.some(function (d) { return d.id === S.day; })) S.day = sel ? sel.day : (L.DAYS.filter(function (d) { return byDay[d.id]; })[0] || L.DAYS[0]).id;

    var tabs = L.DAYS.map(function (d) {
      var n = (byDay[d.id] || []).length, on = d.id === S.day;
      return '<button class="day' + (n ? '' : ' none') + '" type="button" role="tab" id="tab-' + d.id + '" aria-controls="day-panel" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-day="' + d.id + '">' +
        '<b>' + d.label.slice(0, 3) + '<span class="sr">' + d.label.slice(3) + '</span></b><span>' + (n ? n + (n === 1 ? ' time' : ' times') : 'No times') + '</span></button>';
    }).join('');
    var daySlots = byDay[S.day] || [];
    var panel = daySlots.length ?
      '<fieldset><legend class="panel-h">' + L.dayLabel(S.day) + ' (sample)</legend><div class="slots">' + daySlots.map(function (s) {
        var id = 'slot-' + s.key;
        return '<div class="slot"><input type="radio" name="slot" id="' + id + '" value="' + s.key + '"' + (S.slot === s.key ? ' checked' : '') + '>' +
          '<label for="' + id + '"><b>' + s.label + '</b><span>' + (S.provider === 'first' ? esc(L.provider(s.provider).name) : 'until ' + s.end) + '</span></label></div>';
      }).join('') + '</div></fieldset>' :
      '<p class="panel-h">No sample times on ' + L.dayLabel(S.day) + '. Pick another day.</p>';
    area.innerHTML = '<div class="week" role="tablist" aria-label="Sample week">' + tabs + '</div>' +
      '<div id="day-panel" role="tabpanel" aria-labelledby="tab-' + S.day + '">' + panel + '</div>';
  }

  function renderDetails() {
    $('f-name').value = S.name || '';
    $('f-email').value = S.email || '';
    document.querySelectorAll('input[name="isNew"]').forEach(function (r) { r.checked = r.value === S.isNew; });
  }

  function summaryHTML() {
    var v = L.visit(S.visit), s = S.visit && L.findSlot(S.slot, S.visit);
    var provName = S.provider === 'first' ? (s ? L.provider(s.provider).name + ' (first available)' : 'First available') : (S.provider ? L.provider(S.provider).name : null);
    var rows = [
      ['Visit', v ? v.name : null, 1],
      ['Provider', provName, 2],
      ['Time', s ? L.dayLabel(s.day) + ', ' + s.label : null, 3],
      ['Length', v ? 'About ' + v.length + ' minutes' : null, 0]
    ];
    return rows.map(function (r) {
      var change = r[1] && r[2] && current !== r[2] && current !== 'done' ? '<button class="linkbtn" type="button" data-goto="' + r[2] + '">Change<span class="sr"> ' + r[0].toLowerCase() + '</span></button>' : '';
      return '<div><dt>' + r[0] + '</dt><dd' + (r[1] ? '' : ' class="empty-v"') + '>' + esc(r[1] || 'Not chosen yet') + '</dd>' + change + '</div>';
    }).join('');
  }

  function renderSummary() {
    var html = summaryHTML();
    document.querySelectorAll('[data-sum]').forEach(function (el) { el.innerHTML = html; });
    var v = L.visit(S.visit), s = S.visit && L.findSlot(S.slot, S.visit), bits = [];
    if (v) bits.push(v.name);
    if (S.provider) bits.push(S.provider === 'first' ? (s ? L.provider(s.provider).name : 'First available') : L.provider(S.provider).name);
    if (s) bits.push(s.day + ' ' + s.label);
    $('sum-mobile-line').innerHTML = bits.length ? '<span>Your visit:</span> <b>' + esc(bits.join(' · ')) + '</b>' : 'Your visit so far: nothing chosen yet';
  }

  function renderConfirmation() {
    var v = L.visit(S.visit), s = L.findSlot(S.slot, S.visit), p = L.provider(s.provider);
    $('card').innerHTML = '<div class="card-main"><p class="card-when">' + L.dayLabel(s.day) + '<br>' + s.label + '</p>' +
      '<p class="card-what"><b>' + esc(v.name) + '</b>with ' + esc(p.name) + ', ' + esc(p.role.toLowerCase()) + ' · about ' + v.length + ' min</p></div>' +
      '<div class="card-stub"><p><b>For</b>' + esc(S.name) + '</p><p><b>Where</b>12 Linden Row (fictional)</p><p><b>Status</b>Sample only</p></div>';
    var items = L.checklist(S.visit, S.isNew === 'yes'), done = L.load('checklist', {});
    $('checklist-area').innerHTML = '<div class="check-head"><h3>What to bring</h3><p class="meter" id="meter" aria-live="polite"></p></div>' +
      '<div class="meter-bar" aria-hidden="true"><i id="meter-i"></i></div>' +
      '<ul class="checks">' + items.map(function (it) {
        return '<li><label><input type="checkbox" data-check="' + it.id + '"' + (done[it.id] ? ' checked' : '') + '>' +
          '<span class="ct">' + esc(it.text) + '</span>' + (it.hint ? '<span class="ch">' + esc(it.hint) + '</span>' : '') + '</label></li>';
      }).join('') + '</ul>' +
      (S.visit === 'behavioral-health' ? '<p class="urgent crisis"><span><strong>In crisis right now?</strong> Call or text 988, or call 911. Don\'t wait for a scheduled visit.</span></p>' : '') +
      '<p class="muted" style="font-size:15px;margin-top:12px">Ticks are saved in this browser only.</p>';
    updateMeter();
  }

  function updateMeter() {
    var items = L.checklist(S.visit, S.isNew === 'yes'), done = L.load('checklist', {});
    var n = items.filter(function (i) { return done[i.id]; }).length;
    var m = $('meter'); if (!m) return;
    m.textContent = n === items.length ? 'All ' + n + ' ready' : n + ' of ' + items.length + ' ready';
    $('meter-i').style.width = (items.length ? (100 * n / items.length) : 0) + '%';
  }

  function renderProgress() {
    var segs = document.querySelectorAll('#segs li');
    var n = current === 'done' ? 5 : current;
    segs.forEach(function (li, i) {
      li.className = i + 1 < n ? 'done' : (i + 1 === n ? 'now' : '');
      if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    $('progress-count').innerHTML = current === 'done' ? 'All 4 steps done <span>· Preparation checklist</span>' :
      'Step ' + current + ' of 4 <span>· ' + STEP_NAMES[current] + '</span>';
  }

  function show(step, opts) {
    opts = opts || {};
    if (!allowed(step)) step = maxReachable();
    current = step;
    if (step === 1) renderVisits();
    if (step === 2) renderProviders();
    if (step === 3) renderTimes();
    if (step === 4) renderDetails();
    if (step === 'done') renderConfirmation();
    document.querySelectorAll('.step').forEach(function (sec) {
      var on = sec.getAttribute('data-step') === String(step);
      sec.hidden = !on;
      if (on && !reduced && !opts.initial) { sec.classList.remove('step-anim'); void sec.offsetWidth; sec.classList.add('step-anim'); }
    });
    document.querySelectorAll('.step-err').forEach(function (e) { e.hidden = true; });
    renderProgress(); renderSummary();
    $('sum-live').hidden = step === 'done'; $('sum-done').hidden = step !== 'done';
    $('sum-mobile').hidden = step === 'done';
    var hash = step === 'done' ? '#confirmed' : '#step-' + step;
    if (opts.push) history.pushState({ step: step }, '', 'appointment.html' + hash);
    else history.replaceState({ step: step }, '', 'appointment.html' + hash);
    if (!opts.initial) {
      var h = document.querySelector('.step[data-step="' + step + '"] h2');
      if (h) h.focus({ preventScroll: true });
      var top = document.getElementById('progress').getBoundingClientRect().top + window.scrollY - 8;
      if (window.scrollY > top) window.scrollTo(0, top);
    }
  }

  /* ---------- Events ---------- */
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'visit') {
      S.visit = t.value; S.slot = null; S.day = null; S.confirmed = false;
      if (S.provider && S.provider !== 'first' && L.provider(S.provider).visits.indexOf(S.visit) < 0) S.provider = null;
      $('s1-err').hidden = true;
    } else if (t.name === 'provider') {
      S.provider = t.value; S.slot = null; S.day = null; S.confirmed = false; $('s2-err').hidden = true;
    } else if (t.name === 'slot') {
      S.slot = t.value; S.confirmed = false; $('s3-err').hidden = true;
    } else if (t.name === 'isNew') {
      S.isNew = t.value; $('f-new-err').hidden = true;
    } else if (t.hasAttribute('data-check')) {
      var done = L.load('checklist', {}); done[t.getAttribute('data-check')] = t.checked; L.save('checklist', done); updateMeter(); return;
    } else return;
    persist(); renderSummary();
  });

  document.addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('[data-next]'))) {
      var n = +b.getAttribute('data-next');
      var ok = n === 1 ? !!S.visit : n === 2 ? !!S.provider : n === 3 ? !!S.slot : true;
      if (!ok) { var err = $('s' + n + '-err'); err.hidden = false; return; }
      show(n + 1, { push: true });
    } else if ((b = e.target.closest('[data-back]'))) {
      show(+b.getAttribute('data-back') - 1, { push: true });
    } else if ((b = e.target.closest('[data-goto]'))) {
      show(+b.getAttribute('data-goto'), { push: true });
    } else if ((b = e.target.closest('[data-switch]'))) {
      S.provider = b.getAttribute('data-switch'); S.slot = null; S.day = null; persist();
      renderTimes(); renderSummary();
      var firstDay = document.querySelector('.day[aria-selected="true"]'); if (firstDay) firstDay.focus();
    } else if ((b = e.target.closest('.day'))) {
      selectDay(b.getAttribute('data-day'), true);
    } else if ((b = e.target.closest('[data-reset]'))) {
      L.clearAll(); S = Object.assign({}, blank); show(1, { push: false });
    } else if (e.target.closest('#change-time')) {
      S.confirmed = false; persist(); show(3, { push: true });
    }
  });

  function selectDay(day, focus) {
    S.day = day; persist(); renderTimes();
    if (focus) { var t = document.getElementById('tab-' + day); if (t) t.focus(); }
  }

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (!t.classList || !t.classList.contains('day')) return;
    var ids = L.DAYS.map(function (d) { return d.id; }), i = ids.indexOf(t.getAttribute('data-day')), j = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % ids.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + ids.length) % ids.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = ids.length - 1;
    if (j === null) return;
    e.preventDefault(); selectDay(ids[j], true);
  });

  $('details').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('f-name').value.trim(), email = $('f-email').value.trim(), bad = null;
    var nameOk = name.length >= 2, emailOk = /^[^\s@]+@example\.com$/i.test(email), newOk = !!S.isNew;
    $('f-name').setAttribute('aria-invalid', String(!nameOk)); $('f-name-err').hidden = nameOk;
    $('f-email').setAttribute('aria-invalid', String(!emailOk)); $('f-email-err').hidden = emailOk;
    $('f-new-err').hidden = newOk;
    if (!nameOk) bad = $('f-name'); else if (!emailOk) bad = $('f-email'); else if (!newOk) bad = document.querySelector('input[name="isNew"]');
    if (bad) { bad.focus(); return; }
    S.name = name; S.email = email; S.confirmed = true; persist();
    show('done', { push: true });
  });

  window.addEventListener('popstate', function () {
    var h = location.hash, step = h === '#confirmed' ? 'done' : (/^#step-([1-4])$/.test(h) ? +h.slice(6) : 1);
    if (step !== 'done' && S.confirmed) { S.confirmed = false; persist(); }
    show(step, {});
  });

  /* ---------- Initial ---------- */
  var h0 = location.hash, initial;
  if (startStep) initial = startStep;
  else if (h0 === '#confirmed' || (!h0 && S.confirmed)) initial = 'done';
  else if (/^#step-([1-4])$/.test(h0)) initial = +h0.slice(6);
  else initial = maxReachable() === 'done' ? 'done' : 1;
  if (initial !== 'done' && S.confirmed && !startStep && h0) { /* keep confirmation reachable */ }
  show(initial, { initial: true });
})();
