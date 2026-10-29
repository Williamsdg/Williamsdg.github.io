/* Sword and Crown — appointment request forms (salon, Wig Maintenance,
 * Wig Alterations and Repair).
 *
 * Elana, 2026-10-29:
 *  - clients tick every named menu service they want to ask about;
 *  - each request is emailed to appointments@swordandcrownsalon.com AND kept
 *    as an admin record, and a failed delivery is visible, never silent;
 *  - the confirmation lists what they asked for and makes clear this is a
 *    request, not a booked appointment.
 *
 * Path: the request goes to the site's own intake function (/api/request),
 * which emails the salon and saves the record. If that function cannot be
 * reached, the request is saved straight into the admin with a note that no
 * email went out, so it still cannot disappear. Only if both fail does the
 * page tell the client to call.
 */
(function () {
  'use strict';
  var PAGE_T0 = Date.now();

  var form = document.getElementById('reqForm');
  if (!form) return;

  var MAILBOX = 'appointments@swordandcrownsalon.com';
  var PHONE = '205-259-6911';
  var CFG = window.SC_CONFIG || {};
  var ENDPOINT = CFG.REQUEST_ENDPOINT || 'https://swordandcrownsalon.netlify.app/api/request';
  var FORM_NAME = form.getAttribute('data-form') || 'Salon';
  var TEL = '<a href="tel:+1' + PHONE.replace(/-/g, '') + '">' + PHONE + '</a>';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function msg(html, kind) {
    document.getElementById('rqMsg').innerHTML = '<div class="msg ' + (kind || 'err') + '">' + html + '</div>';
  }
  function val(id) { var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; }
  function boxes() { return [].slice.call(form.querySelectorAll('input[name="svc"]')); }
  function chosen() { return boxes().filter(function (b) { return b.checked; }).map(function (b) { return b.value; }); }

  /* "Request this service" on a menu row ticks that service and brings the
     form up. The row's own name is used, so the tick always matches the menu. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a.svc-req, a[data-service]');
    if (!a) return;
    var row = a.closest('.svc-row, article');
    var h = row && row.querySelector('h3');
    var name = h ? h.textContent.trim() : '';
    var hit = name && boxes().filter(function (b) { return b.value === name; })[0];
    if (!hit) hit = boxes().filter(function (b) { return b.value === 'Other / Help me choose'; })[0];
    if (hit) hit.checked = true;
    var fs = document.getElementById('rqServices'); if (fs) fs.classList.remove('invalid');
  });

  function saveDirect(row) {
    // fallback: straight into the admin record, flagged so the team knows no email went out
    if (!CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY) return Promise.reject(new Error('no database'));
    return fetch(CFG.SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/requests', {
      method: 'POST',
      headers: {
        apikey: CFG.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + CFG.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json', Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        name: row.name, phone: row.phone, email: row.email,
        service: row.services.join(' · '),
        details: row.details + '\n\n— ' + row.form + ' request form (' + row.page + ')',
        status: 'new',
        staff_note: 'EMAIL NOT SENT — the website could not reach the mail service. Contact the client from this record.'
      })
    }).then(function (r) { if (!r.ok) throw new Error('database ' + r.status); return { ok: true, emailed: false }; });
  }

  function confirmDone(row) {
    form.innerHTML =
      '<div class="req-done" tabindex="-1">' +
      '<h3 class="d3">Your request is in!</h3>' +
      '<p>Our team will contact you to discuss your service and scheduling. ' +
      '<b>Your appointment is not confirmed until we follow up.</b></p>' +
      '<p>You asked about:</p><ul>' + row.services.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      '<p class="hint">If you need us sooner, call or text the salon at ' + TEL + '.</p>' +
      '</div>';
    var d = form.querySelector('.req-done');
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (d) d.focus({ preventScroll: true });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var row = {
      name: val('rqName'), phone: val('rqPhone'), email: val('rqEmail'),
      services: chosen(), details: val('rqDetails'),
      form: FORM_NAME, page: location.pathname.replace(/^.*\//, '') || 'index.html'
    };
    var fs = document.getElementById('rqServices');
    if (!row.services.length) {
      if (fs) fs.classList.add('invalid');
      msg('Please tick at least one service, or choose &ldquo;Other / Help me choose&rdquo;.');
      if (fs) fs.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (fs) fs.classList.remove('invalid');
    if (!row.name || !row.phone || !row.email || !row.details) {
      msg('Please fill in your name, phone, email and a short description.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) { msg('Please check your email address.'); return; }

    /* Spam guard: a hidden "company" field no person can see, and a form sent
       within three seconds of the page loading. Bots do both; we pretend to
       accept and save nothing. */
    var hp = document.getElementById('rqCompany');
    if ((hp && hp.value) || (Date.now() - PAGE_T0) < 3000) {
      form.innerHTML = '<div class="req-done"><h3 class="d3">Your request is in!</h3></div>';
      return;
    }

    var btn = document.getElementById('rqSend');
    var label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending…';
    document.getElementById('rqMsg').innerHTML = '';

    var payload = {
      name: row.name, phone: row.phone, email: row.email, services: row.services,
      details: row.details, form: row.form, page: row.page,
      elapsed: Date.now() - PAGE_T0, test: /\[TEST\]/.test(row.details)
    };

    fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }).then(function (j) { j.status = r.status; return j; }); })
      .then(function (j) {
        if (j && j.ok) return j;
        if (j && j.status === 422) throw Object.assign(new Error('fields'), { fields: true });
        return saveDirect(row);           // function answered but delivered nothing: keep a record anyway
      }, function () { return saveDirect(row); })   // function unreachable
      .then(function () { confirmDone(row); })
      .catch(function (err) {
        btn.disabled = false; btn.textContent = label;
        if (err && err.fields) { msg('Please check the details above and try again.'); return; }
        msg('<b>We couldn&rsquo;t send your request just now.</b><br>' +
            'Please call or text the salon at ' + TEL + ', or email ' +
            '<a href="mailto:' + MAILBOX + '">' + MAILBOX + '</a>, so you don&rsquo;t get missed.', 'err');
        if (window.console) console.warn('[sc-request]', err && err.message);
      });
  });
})();
