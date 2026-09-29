(function () {
  // The enrollment service. On localhost an ?api= override is allowed for testing.
  var API = 'https://senn-enroll.vercel.app/api/enroll';
  var qs = new URLSearchParams(location.search);
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && qs.get('api')) API = qs.get('api');

  var form = document.getElementById('enrollForm');
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); };
  var val = function (name) { var el = form.elements[name]; return el ? String(el.value || '').trim() : ''; };
  var checked = function (name) { var el = form.elements[name]; return !!(el && el.checked); };

  // ---- test-mode banner -----------------------------------------------------
  fetch(API, { method: 'GET' }).then(function (r) { return r.json(); }).then(function (d) {
    if (d && d.testMode) $('#testNote').hidden = false;
  }).catch(function () {});

  // ---- plan preselect -------------------------------------------------------
  var plan = qs.get('plan');
  var planInput = plan && form.querySelector('input[name=plan][value="' + plan + '"]');
  (planInput || form.querySelector('input[name=plan][value=adult]')).checked = true;

  function ageFrom(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return null;
    var t = new Date(), a = t.getFullYear() - +m[1];
    if (t.getMonth() + 1 < +m[2] || (t.getMonth() + 1 === +m[2] && t.getDate() < +m[3])) a--;
    return a;
  }

  // ---- show/hide sections as choices change ---------------------------------
  function sync() {
    var p = form.elements.plan.value;
    var family = p === 'family';
    if (family) form.querySelector('input[name=who][value=self]').checked = true;
    var who = form.elements.who.value;
    var other = who === 'other';
    var age = ageFrom(val('p_dob'));

    $('#whoSet').hidden = family;
    $('#householdSet').hidden = !family;
    $('#studentHint').hidden = p !== 'student';
    $('#enrollerSet').hidden = !other;
    $('#billingGrid').hidden = !other || checked('e_same');
    $('#patientLegend').textContent = other ? 'Patient information' : 'Your information';

    // Adult patients sign for themselves, so we need their email even when a
    // parent is paying. Minors don't need their own contact details.
    var needPatientContact = !other || (age !== null && age >= 18);
    $('#pEmailWrap').hidden = other && age !== null && age < 18;
    $('#pPhoneWrap').hidden = other && age !== null && age < 18;
    form.elements.p_email.required = needPatientContact;
    form.elements.p_phone.required = !other;
    $('#adultSignsHint').hidden = !(other && age !== null && age >= 18);

    ['e_first', 'e_last', 'e_rel', 'e_phone', 'e_email'].forEach(function (n) { form.elements[n].required = other; });
    ['e_street', 'e_city', 'e_state', 'e_zip'].forEach(function (n) { form.elements[n].required = other && !checked('e_same'); });
    if (family && !$('#household').children.length) addMember();
  }
  form.addEventListener('change', sync);
  form.elements.p_dob.addEventListener('input', sync);

  // ---- family members ---------------------------------------------------------
  var memberCount = 0;
  function addMember() {
    memberCount++;
    var i = memberCount;
    var el = document.createElement('div');
    el.className = 'member';
    el.innerHTML =
      '<div class="member-top"><b>Family member</b><button type="button" class="member-x">Remove</button></div>' +
      '<div class="grid">' +
      '<label>First name<input data-f="firstName" required></label>' +
      '<label>Last name<input data-f="lastName" required></label>' +
      '<label>Date of birth<input data-f="dob" type="date" required></label>' +
      '<label>Relationship<select data-f="relationship" required><option value="">Choose…</option><option>Spouse / partner</option><option>Child</option></select></label>' +
      '<label class="full" data-email hidden>Email <small>(they sign their own privacy form)</small><input data-f="email" type="email"></label>' +
      '</div>';
    $('.member-x', el).addEventListener('click', function () { el.remove(); });
    var dob = $('[data-f=dob]', el);
    dob.addEventListener('input', function () {
      var a = ageFrom(dob.value), adult = a !== null && a >= 18;
      $('[data-email]', el).hidden = !adult;
      $('[data-f=email]', el).required = adult;
    });
    $('#household').appendChild(el);
  }
  $('#addMember').addEventListener('click', addMember);
  sync();

  // ---- submit -----------------------------------------------------------------
  var err = $('#formError');
  function fail(msg) {
    err.textContent = msg;
    err.hidden = false;
    err.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function payload() {
    var who = form.elements.who.value;
    var b = {
      plan: form.elements.plan.value,
      who: who,
      medicare: checked('medicare'),
      website: val('website'),
      patient: {
        firstName: val('p_first'), lastName: val('p_last'), dob: val('p_dob'),
        email: val('p_email'), phone: val('p_phone'),
        address: { street: val('p_street'), city: val('p_city'), state: val('p_state'), zip: val('p_zip') }
      },
      commPrefs: { phone: checked('c_phone'), voicemail: checked('c_voicemail'), email: checked('c_email'), text: checked('c_text'), portal: checked('c_portal') },
      authorized: [{ name: val('a1_name'), relationship: val('a1_rel') }, { name: val('a2_name'), relationship: val('a2_rel') }]
    };
    if (who === 'other') {
      b.enroller = {
        firstName: val('e_first'), lastName: val('e_last'), relationship: val('e_rel'),
        email: val('e_email'), phone: val('e_phone'), sameAddress: checked('e_same'),
        address: { street: val('e_street'), city: val('e_city'), state: val('e_state'), zip: val('e_zip') }
      };
    }
    if (b.plan === 'family') {
      b.household = $$('#household .member').map(function (m) {
        var o = {};
        $$('[data-f]', m).forEach(function (i) { o[i.getAttribute('data-f')] = i.value.trim(); });
        return o;
      });
    }
    return b;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.hidden = true;
    $$('.bad', form).forEach(function (el) { el.classList.remove('bad'); });

    var firstBad = null;
    $$('input,select', form).forEach(function (el) {
      if (el.closest('[hidden]') || el.name === 'website') return;
      if (!el.checkValidity()) { el.classList.add('bad'); firstBad = firstBad || el; }
    });
    if (firstBad) {
      fail(firstBad.name === 'medicare' ? 'Please confirm the Medicare statement to continue.' : 'Please fill in the highlighted fields.');
      firstBad.focus({ preventScroll: true });
      return;
    }

    var btn = $('#submitBtn');
    btn.disabled = true;
    btn.innerHTML = 'Preparing your paperwork…';

    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload()) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.d && res.d.error);
        start(res.d);
      })
      .catch(function (x) {
        fail((x && x.message) || 'Something went wrong. Please try again, or call the office.');
        btn.disabled = false;
        btn.innerHTML = 'Continue to your agreement <span aria-hidden="true">&rarr;</span>';
      });
  });

  // ---- steps 2 & 3 --------------------------------------------------------------
  function setStep(n) {
    $$('.steps li').forEach(function (li) {
      var s = +li.getAttribute('data-step');
      li.classList.toggle('on', s === n);
      li.classList.toggle('done', s < n);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function start(d) {
    if (d.testMode) $('#testNote').hidden = false;
    form.hidden = true;
    if (d.signUrl && window.SignWellEmbed) {
      $('#stepSign').hidden = false;
      setStep(2);
      new window.SignWellEmbed({
        url: d.signUrl,
        containerId: 'signwell',
        allowDecline: false,
        allowClose: false,
        showHeader: true,
        events: { completed: function () { showPay(d, true); } }
      }).open();
    } else {
      showPay(d, false);
    }
  }

  function showPay(d, signed) {
    $('#stepSign').hidden = true;
    $('#stepPay').hidden = false;
    setStep(3);
    $('#payHead').textContent = signed ? 'Signed. One last step.' : 'Paperwork sent. One last step.';
    if (d.emailed && d.emailed.length) {
      var names = d.emailed.map(function (p) { return p.name + ' (' + p.email + ')'; }).join(' and ');
      var note = $('#emailedNote');
      note.textContent = 'We’ve emailed ' + names + ' a link to sign their own paperwork. Their membership is complete once they’ve signed.';
      note.hidden = false;
    }
    $('#payPlan').textContent = d.payment.plan;
    $('#payPrice').textContent = d.payment.price;
    var btn = $('#payBtn');
    btn.href = d.payment.url;
    if (d.testMode) {
      btn.innerHTML = 'Preview the payment page <span aria-hidden="true">&rarr;</span>';
      btn.target = '_blank';
      btn.rel = 'noopener';
      $('#payFine').innerHTML = '<b>Test mode:</b> this opens Senn Medicine’s real Stripe checkout, with the email already filled in. Look, but don’t pay.';
    }
  }
})();
