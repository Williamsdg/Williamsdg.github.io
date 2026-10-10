/* Sword and Crown — consultation booking.
 *
 * Elana's rules, from her 2026-10-02 notes:
 *   Monday–Friday · 10:00–16:00 America/Chicago · 90-minute appointments
 *   → the last start of the day is 14:30
 *   $250 nonrefundable deposit, acknowledged before payment
 *   no overlapping bookings; blackout dates set from the admin
 *
 * Everything below is computed in the SALON's timezone, not the visitor's.
 * Someone booking from London must see 10:00 Central, not 16:00 their time.
 */
(function () {
  'use strict';

  var TZ = 'America/Chicago';
  var OPEN = 10 * 60;          // 10:00
  // Her 2026-10-04 correction: 4:00 p.m. is the latest appointment START, not the
  // latest finish. A 3.5-hour booking starting at 16:00 legitimately runs to 19:30.
  var LAST_START = 16 * 60;    // 16:00
  var DURATION = 90;
  var DEPOSIT = 25000;         // cents
  var DAYS_AHEAD = 28;

  var root = document.getElementById('bk');
  if (!root) return;

  /* Each department opens on different days, per her 2026-10-04 notes:
       consultation  Mon-Fri      (the wig consultation page)
       nano-brows    Tue, Thu     (Natalie)
       head-spa      Mon, Wed, Fri (Constantina)
     1 = Monday ... 7 = Sunday, matching Postgres isodow. The database can
     override these once department_hours is populated from the admin. */
  var DEPT = root.getAttribute('data-department') || 'consultation';
  var DEFAULT_DAYS = {
    'consultation': [1, 2, 3, 4, 5],
    'nano-brows':   [2, 4],
    'head-spa':     [1, 3, 5],
    'styling':      []
  };
  var OPEN_DAYS = DEFAULT_DAYS[DEPT] || [1, 2, 3, 4, 5];

  var elDays = document.getElementById('bkDays');
  var elSlots = document.getElementById('bkSlots');
  var form = document.getElementById('bkForm');
  var SC = window.SC;

  /* ── timezone-correct date helpers ───────────────────────────────── */

  // Parts of `date` as they read in the salon's timezone.
  function partsInTZ(date) {
    var f = new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
      weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    });
    var o = {};
    f.formatToParts(date).forEach(function (p) { o[p.type] = p.value; });
    return o;
  }

  function todayInTZ() {
    var p = partsInTZ(new Date());
    return { iso: p.year + '-' + p.month + '-' + p.day, minutes: (+p.hour) * 60 + (+p.minute) };
  }

  function isoPlusDays(iso, n) {
    var d = new Date(iso + 'T12:00:00Z');   // midday avoids any DST edge
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  function weekdayOf(iso) {
    // 1 = Monday … 7 = Sunday, matching Postgres isodow
    var d = new Date(iso + 'T12:00:00Z').getUTCDay();
    return d === 0 ? 7 : d;
  }

  function label(iso) {
    var d = new Date(iso + 'T12:00:00Z');
    return {
      dow: d.toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' }),
      day: d.toLocaleDateString(undefined, { day: 'numeric', timeZone: 'UTC' }),
      mon: d.toLocaleDateString(undefined, { month: 'short', timeZone: 'UTC' }),
      full: d.toLocaleDateString(undefined, {
        weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })
    };
  }

  function hhmm(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  function pretty(min) {
    var h = Math.floor(min / 60), m = min % 60;
    var ap = h >= 12 ? 'p.m.' : 'a.m.';
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + (m ? ':' + (m < 10 ? '0' : '') + m : ':00') + ' ' + ap;
  }

  // Every legal start time: 10:00, 11:30, 13:00, 14:30
  function slotsForDay() {
    var out = [];
    for (var t = OPEN; t <= LAST_START; t += DURATION) out.push(t);
    return out;
  }

  /* ── state ───────────────────────────────────────────────────────── */

  var taken = {};      // 'YYYY-MM-DD HH:MM' -> true
  var blackouts = [];  // {day, start_time, end_time}
  var chosen = null;
  var today = todayInTZ();

  function blocked(iso, start) {
    for (var i = 0; i < blackouts.length; i++) {
      var b = blackouts[i];
      if (b.day !== iso) continue;
      if (!b.start_time) return true;                       // whole day
      var s = b.start_time.slice(0, 5), e = (b.end_time || '23:59').slice(0, 5);
      if (hhmm(start) >= s && hhmm(start) < e) return true;
    }
    return false;
  }

  function dayIsBookable(iso) {
    var wd = weekdayOf(iso);
    if (OPEN_DAYS.indexOf(wd) === -1) return false;          // this department's days
    var s = slotsForDay();
    for (var i = 0; i < s.length; i++) if (slotFree(iso, s[i])) return true;
    return false;
  }

  function slotFree(iso, start) {
    if (taken[iso + ' ' + hhmm(start)]) return false;
    if (blocked(iso, start)) return false;
    if (iso === today.iso && start <= today.minutes + 60) return false;  // an hour's notice
    if (iso < today.iso) return false;
    return true;
  }

  /* ── rendering ───────────────────────────────────────────────────── */

  var activeDay = null;

  function renderDays() {
    var html = '', first = null, shown = 0;
    for (var n = 0; n <= DAYS_AHEAD && shown < 14; n++) {
      var iso = isoPlusDays(today.iso, n);
      if (OPEN_DAYS.indexOf(weekdayOf(iso)) === -1) continue;
      var ok = dayIsBookable(iso), l = label(iso);
      if (ok && !first) first = iso;
      html += '<button type="button" role="tab" class="bk-day" data-day="' + iso + '"' +
        (ok ? '' : ' disabled') + ' aria-selected="false">' +
        '<span class="d">' + l.dow + '</span><b>' + l.day + '</b>' +
        '<span class="m">' + l.mon + '</span></button>';
      shown++;
    }
    elDays.innerHTML = html || '<p class="lede">No times are open in the next few weeks. Please call us.</p>';
    if (first) selectDay(first);
    else elSlots.innerHTML = '';
  }

  function selectDay(iso) {
    activeDay = iso;
    Array.prototype.forEach.call(elDays.querySelectorAll('.bk-day'), function (b) {
      b.setAttribute('aria-selected', String(b.dataset.day === iso));
    });
    var s = slotsForDay(), html = '';
    s.forEach(function (start) {
      var free = slotFree(iso, start);
      html += '<button type="button" class="bk-slot" data-start="' + hhmm(start) + '"' +
        (free ? '' : ' disabled') + '>' + pretty(start) +
        (free ? '' : '<span class="gone">booked</span>') + '</button>';
    });
    elSlots.innerHTML = html;
  }

  elDays.addEventListener('click', function (e) {
    var b = e.target.closest('.bk-day');
    if (b && !b.disabled) { selectDay(b.dataset.day); form.hidden = true; }
  });

  // Her eligibility notice must be acknowledged before a tattoo slot can be
  // picked. This is a medical-suitability gate, not a formality.
  var elig = document.getElementById('eligAck');
  function eligOK() { return !elig || elig.checked; }
  if (elig) {
    var gate = document.getElementById('bkGate');
    var sync = function () { if (gate) gate.classList.toggle('locked', !elig.checked); };
    elig.addEventListener('change', sync); sync();
  }

  elSlots.addEventListener('click', function (e) {
    var b = e.target.closest('.bk-slot');
    if (!b || b.disabled) return;
    if (!eligOK()) {
      alert('Please read and tick the eligibility notice above before choosing a time.');
      elig.focus(); return;
    }
    Array.prototype.forEach.call(elSlots.querySelectorAll('.bk-slot'), function (x) {
      x.classList.toggle('on', x === b);
    });
    chosen = { day: activeDay, start: b.dataset.start };
    document.getElementById('bkChosen').textContent =
      label(activeDay).full + ' at ' + pretty(+b.dataset.start.slice(0, 2) * 60 + +b.dataset.start.slice(3)) + ' Central';
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('bkBack').addEventListener('click', function () {
    form.hidden = true;
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ── submit ──────────────────────────────────────────────────────── */

  function msg(text, kind) {
    document.getElementById('bkMsg').innerHTML =
      '<div class="msg ' + (kind || 'err') + '">' + text + '</div>';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!chosen) { msg('Please choose a time first.'); return; }
    var name = document.getElementById('bkName').value.trim();
    var email = document.getElementById('bkEmail').value.trim();
    if (!name || !email) { msg('Please give us your name and email.'); return; }
    if (!document.getElementById('bkAck').checked) {
      msg('Please confirm you understand the deposit is nonrefundable.'); return;
    }

    var btn = document.getElementById('bkPay');
    btn.disabled = true; btn.textContent = 'Holding your slot…';

    var row = {
      slot_date: chosen.day, slot_start: chosen.start, duration_min: DURATION,
      status: 'held', department: DEPT, name: name, email: email,
      phone: document.getElementById('bkPhone').value.trim() || null,
      notes: document.getElementById('bkNotes').value.trim() || null,
      deposit_cents: DEPOSIT, terms_ack_at: new Date().toISOString()
    };

    hold(row).then(function (res) {
      btn.disabled = false; btn.textContent = 'Reserve & pay $250';
      if (res && res.conflict) {
        msg('Sorry — someone took that time while you were typing. Please pick another.');
        refresh();
        return;
      }
      if (res && res.error) { msg('We couldn’t hold that slot: ' + res.error); return; }

      var pay = window.SC_CONFIG && window.SC_CONFIG.DEPOSIT_PAYMENT_URL;
      if (pay) {
        window.location.href = pay +
          (pay.indexOf('?') > -1 ? '&' : '?') +
          'client_reference_id=' + encodeURIComponent(res.id || '') +
          '&prefilled_email=' + encodeURIComponent(email);
      } else {
        // No payment link configured. Say so honestly rather than pretending
        // money changed hands.
        msg('Your time is held. <b>Online deposit payment isn’t switched on yet</b>, so we’ll ' +
            'email you a secure payment link to confirm it. Nothing has been charged.', 'ok');
        form.querySelector('.bk-actions').hidden = true;
      }
    });
  });

  function hold(row) {
    if (!SC || !SC.live) {
      // No backend yet — never pretend a reservation was recorded.
      return Promise.resolve({ error: null, id: null, preview: true });
    }
    var CFG = window.SC_CONFIG;
    return fetch(CFG.SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/bookings', {
      method: 'POST',
      headers: {
        apikey: CFG.SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + CFG.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(row)
    }).then(function (r) {
      if (r.status === 409) return { conflict: true };      // unique(slot_date,slot_start)
      if (!r.ok) return r.text().then(function (t) { return { error: 'HTTP ' + r.status + ' ' + t.slice(0, 120) }; });
      return r.json().then(function (d) { return { id: d && d[0] && d[0].id }; });
    }).catch(function (e) { return { error: e.message }; });
  }

  /* ── load availability ───────────────────────────────────────────── */

  function refresh() {
    taken = {}; blackouts = [];
    if (!SC || !SC.live) { renderDays(); return; }
    var CFG = window.SC_CONFIG, base = CFG.SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/';
    var h = { apikey: CFG.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + CFG.SUPABASE_ANON_KEY };
    var from = today.iso, to = isoPlusDays(today.iso, DAYS_AHEAD);
    // Let the admin override the built-in days for this department.
    fetch(base + 'department_hours?select=*&department=eq.' + encodeURIComponent(DEPT), { headers: h })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        if (rows && rows[0] && Array.isArray(rows[0].weekdays) && rows[0].weekdays.length) {
          OPEN_DAYS = rows[0].weekdays;
        }
      }).catch(function () {});

    Promise.all([
      fetch(base + 'slots_taken?select=*&slot_date=gte.' + from + '&slot_date=lte.' + to, { headers: h })
        .then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; }),
      fetch(base + 'blackouts?select=*&day=gte.' + from + '&day=lte.' + to, { headers: h })
        .then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; })
    ]).then(function (res) {
      (res[0] || []).forEach(function (b) {
        taken[b.slot_date + ' ' + String(b.slot_start).slice(0, 5)] = true;
      });
      blackouts = res[1] || [];
      renderDays();
    });
  }

  refresh();
})();
