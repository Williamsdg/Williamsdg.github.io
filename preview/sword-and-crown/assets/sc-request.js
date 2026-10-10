/* Sword and Crown — appointment request form (styling department).
 *
 * Her instruction, 2026-10-04:
 *   "can form submissions also be saved in the admin area so we don't lose
 *    requests if an email fails?"
 *
 * So the request is written to the database FIRST and the email is only a
 * notification on top. If the mailbox bounces, is filtered, or was never
 * created, the request is still sitting in her admin with a timestamp.
 *
 * And if there is no database yet, this form does NOT pretend to have sent
 * anything. A form that smiles and swallows the message is worse than no
 * form at all — someone would believe they had asked for an appointment.
 */
(function () {
  'use strict';

  var form = document.getElementById('reqForm');
  if (!form) return;

  var SC = window.SC;
  var MAILBOX = 'appointments@swordandcrownsalon.com';
  var PHONE = '205-259-6911';

  function msg(html, kind) {
    document.getElementById('rqMsg').innerHTML =
      '<div class="msg ' + (kind || 'err') + '">' + html + '</div>';
  }

  function val(id) { return (document.getElementById(id).value || '').trim(); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var row = {
      name: val('rqName'),
      phone: val('rqPhone'),
      email: val('rqEmail'),
      service: document.getElementById('rqService').value,
      details: val('rqDetails'),
      status: 'new'
    };

    if (!row.name || !row.phone || !row.email || !row.details) {
      msg('Please fill in your name, phone, email and a short description.');
      return;
    }

    var btn = document.getElementById('rqSend');
    btn.disabled = true; btn.textContent = 'Sending…';

    function done() { btn.disabled = false; btn.textContent = 'Request an Appointment'; }

    if (!SC || !SC.live) {
      // No backend. Say so plainly and give a route that actually works.
      done();
      msg('<b>This form isn’t connected yet.</b><br>' +
          'Nothing has been sent. Please call the salon on ' +
          '<a href="tel:+1' + PHONE.replace(/-/g, '') + '">' + PHONE + '</a> or email ' +
          '<a href="mailto:' + MAILBOX + '">' + MAILBOX + '</a> and we’ll get you booked in.',
          'err');
      return;
    }

    var CFG = window.SC_CONFIG;
    fetch(CFG.SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/requests', {
      method: 'POST',
      headers: {
        apikey: CFG.SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + CFG.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(row)
    }).then(function (r) {
      done();
      if (!r.ok) {
        return r.text().then(function (t) {
          msg('<b>Something went wrong saving your request.</b><br>' +
              'Please call us on <a href="tel:+1' + PHONE.replace(/-/g, '') + '">' + PHONE +
              '</a> rather than trying again, so you don’t get missed.', 'err');
          if (window.console) console.warn('[sc-request]', r.status, t.slice(0, 200));
        });
      }
      // Her confirmation copy, word for word.
      form.innerHTML =
        '<div class="req-done">' +
        '<h3 class="d3">Your request is in!</h3>' +
        '<p>Our team will contact you to discuss your service and scheduling. ' +
        '<b>Your appointment is not confirmed until we follow up.</b></p>' +
        '<p class="hint">If you need us sooner, call the salon on ' +
        '<a href="tel:+1' + PHONE.replace(/-/g, '') + '">' + PHONE + '</a>.</p>' +
        '</div>';
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }).catch(function (err) {
      done();
      msg('<b>We couldn’t reach the salon’s system.</b><br>' +
          'Please call <a href="tel:+1' + PHONE.replace(/-/g, '') + '">' + PHONE + '</a> ' +
          'or email <a href="mailto:' + MAILBOX + '">' + MAILBOX + '</a>.', 'err');
      if (window.console) console.warn('[sc-request]', err.message);
    });
  });
})();
