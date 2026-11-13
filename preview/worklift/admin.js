/* WorkLift concept prototype: staff admin. Sample data only, nothing is saved or sent. */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = WL.esc;
  var ICON = function (id) { return '<svg class="ic"><use href="#' + id + '"/></svg>'; };

  /* ---------- candidates ---------- */
  var CANDS = [
    { id: 1, n: 'Devon Pruitt', r: 'Warehouse associate', c: 88, as: 2, flag: '', j: 'Oct 2' },
    { id: 2, n: 'Keisha Lowery', r: 'Medical assistant', c: 86, as: 1, flag: '', j: 'Oct 9' },
    { id: 3, n: 'Marcus Tran', r: 'Warehouse associate', c: 81, as: 1, flag: '', j: 'Oct 21' },
    { id: 4, n: 'Alana Whitfield', r: 'Customer service', c: 90, as: 1, flag: '', j: 'Sep 14' },
    { id: 5, n: 'Samuel Okafor', r: 'General labor', c: 64, as: 0, flag: '', j: 'Nov 8' },
    { id: 6, n: 'Brittany Hale', r: 'Administrative assistant', c: 84, as: 1, flag: '', j: 'Aug 30' },
    { id: 7, n: 'Jordan Mims', r: 'Forklift operator', c: 91, as: 2, flag: '', j: 'Sep 2' },
    { id: 8, n: 'Chris Dyer', r: 'Warehouse associate', c: 22, as: 0, flag: 'Looks like a duplicate of an existing profile', j: 'Nov 12' },
    { id: 9, n: 'Maya Dorsey', r: 'Medical assistant', c: 72, as: 0, flag: '', j: 'Nov 3' },
    { id: 10, n: 'Tonya Reese', r: 'Customer service', c: 48, as: 0, flag: 'Phone number typed into the public summary', j: 'Nov 11' },
    { id: 11, n: 'Luis Herrera', r: 'Forklift operator', c: 83, as: 1, flag: '', j: 'Oct 1' },
    { id: 12, n: 'Dana McCullough', r: 'Receptionist', c: 72, as: 1, flag: '', j: 'Nov 6' }
  ];
  var cf = 'all';
  function initials(n) { return n.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2); }
  function renderCands() {
    var q = $('#cSearch').value.trim().toLowerCase();
    var list = CANDS.filter(function (c) {
      if (q && (c.n + ' ' + c.r).toLowerCase().indexOf(q) === -1) return false;
      if (cf === 'flagged') return !!c.flag;
      if (cf === 'incomplete') return c.c < 60;
      return true;
    });
    $('#cCount').textContent = list.length + ' of ' + CANDS.length;
    $('#cRows').innerHTML = list.length ? list.map(function (c) {
      return '<div class="row' + (c.flag ? '' : '') + '" data-cid="' + c.id + '">' +
        '<div style="display:flex;gap:10px;align-items:center;min-width:0"><div class="avatar sm">' + initials(c.n) + '</div><div style="min-width:0"><b>' + esc(c.n) + '</b><span class="sub">' + esc(c.r) + '. Joined ' + esc(c.j) + '</span></div></div>' +
        '<div><span class="sub">Profile</span>' + c.c + '% complete</div>' +
        '<div><span class="sub">Assessments</span>' + (c.as ? c.as + ' passed' : 'None yet') + '</div>' +
        '<div class="acts">' + (c.flag ? '<span class="status bad">Flagged, hidden from search</span><button class="btn btn-ghost btn-sm" type="button" data-unflag="' + c.id + '">Clear flag</button>' : '<span class="status ok">Visible</span><button class="btn btn-ghost btn-sm" type="button" data-flag="' + c.id + '">Flag</button>') + '<button class="btn btn-ghost btn-sm" type="button" data-toast="Prototype: the full record opens here, with contact details visible to Owner and Admin staff only.">Open</button></div>' +
        (c.flag ? '<p class="note">' + ICON('i-flag') + esc(c.flag) + '</p>' : '') +
        '</div>';
    }).join('') : '<div class="empty">No candidates match.</div>';
    var fl = CANDS.filter(function (c) { return c.flag; }).length;
    $('#attnFlag').textContent = fl + ' candidate profile' + (fl === 1 ? '' : 's') + ' flagged';
  }
  $('#cSearch').addEventListener('input', renderCands);

  /* ---------- employers ---------- */
  var EMPS = [
    { id: 1, co: 'Magnolia Logistics', who: 'Renee Castillo', ver: 'Verified', sub: 'Active', next: 'Next payment Dec 13', s30: 41, r30: 6, j: 'Sep 13' },
    { id: 2, co: 'Red Mountain Family Medicine', who: 'Dr. Paul Okonkwo', ver: 'Verified', sub: 'Active', next: 'Next payment Nov 28', s30: 18, r30: 3, j: 'Jul 28' },
    { id: 3, co: 'Shades Creek Surgical Center', who: 'Tamika Boyd', ver: 'Verified', sub: 'Past due', next: 'Retry 2 of 3 on Nov 15', s30: 7, r30: 1, j: 'Aug 15', note: 'Card declined Nov 13. Searching pauses after the third failed retry.' },
    { id: 4, co: 'Cahaba Pediatric Dentistry', who: 'Erin Walsh', ver: 'Pending', sub: 'Plan set up, waiting', next: 'First charge on verification', s30: 0, r30: 0, j: 'Nov 12' },
    { id: 5, co: 'Ironworks Insurance Group', who: 'Marcus Bell', ver: 'Verified', sub: 'Active', next: 'Next payment Dec 2', s30: 23, r30: 4, j: 'Oct 2' },
    { id: 6, co: 'Valley Drug', who: 'Simone Park', ver: 'Pending', sub: 'Plan set up, waiting', next: 'First charge on verification', s30: 0, r30: 0, j: 'Nov 13' },
    { id: 7, co: 'Bluff Park Staffing Co.', who: 'Gary Lindell', ver: 'Needs info', sub: 'Plan set up, waiting', next: 'First charge on verification', s30: 0, r30: 0, j: 'Nov 10', note: 'Website and tax ID do not match. Asked for a business license on Nov 11.' },
    { id: 8, co: 'Vulcan Utility Services', who: 'Dee Hampton', ver: 'Verified', sub: 'Cancelled', next: 'Access ends Nov 20', s30: 3, r30: 0, j: 'Jun 4' },
    { id: 9, co: 'Brightline Software', who: 'Ana Ruiz', ver: 'Verified', sub: 'Past due', next: 'Retry 1 of 3 on Nov 14', s30: 12, r30: 2, j: 'Sep 20', note: 'Card expired. Reminder emailed Nov 13.' }
  ];
  var ef = 'all';
  function verChip(v) { return v === 'Verified' ? '<span class="status ok">Verified</span>' : (v === 'Pending' ? '<span class="status warn">Pending verification</span>' : '<span class="status bad">Needs info</span>'); }
  function subChip(s) { return s === 'Active' ? '<span class="status ok">Active</span>' : (s === 'Past due' ? '<span class="status bad">Past due</span>' : (s === 'Cancelled' ? '<span class="status off">Cancelled</span>' : '<span class="status">' + esc(s) + '</span>')); }
  function renderEmps() {
    var list = EMPS.filter(function (e) {
      if (ef === 'pending') return e.ver !== 'Verified';
      if (ef === 'pastdue') return e.sub === 'Past due';
      return true;
    });
    $('#eCount').textContent = list.length + ' of ' + EMPS.length;
    $('#eRows').innerHTML = list.length ? list.map(function (e) {
      var acts = e.ver === 'Verified'
        ? '<button class="btn btn-ghost btn-sm" type="button" data-toast="Prototype: the employer record opens here with searches, requests and invoices.">Open</button>' + (e.sub === 'Past due' ? '<button class="btn btn-ghost btn-sm" type="button" data-toast="Retry scheduled. The card is charged again tonight.">Retry now</button>' : '')
        : '<button class="btn btn-lift btn-sm" type="button" data-verify="' + e.id + '">Verify</button><button class="btn btn-ghost btn-sm" type="button" data-toast="Prototype: a request for more information would be emailed to ' + esc(e.who) + '.">Ask for info</button>';
      return '<div class="row">' +
        '<div><b>' + esc(e.co) + '</b><span class="sub">' + esc(e.who) + '. Joined ' + esc(e.j) + '</span></div>' +
        '<div>' + verChip(e.ver) + '<span class="sub">' + e.s30 + ' searches, ' + e.r30 + ' requests in 30 days</span></div>' +
        '<div>' + subChip(e.sub) + '<span class="sub">' + esc(e.next) + '</span></div>' +
        '<div class="acts">' + acts + '</div>' +
        (e.note ? '<p class="note">' + ICON('i-flag') + esc(e.note) + '</p>' : '') +
        '</div>';
    }).join('') : '<div class="empty">Nothing here right now.</div>';
    var pend = EMPS.filter(function (e) { return e.ver !== 'Verified'; }).length;
    $('#statPending').textContent = pend;
    $('#attnVerify').textContent = pend + ' employer' + (pend === 1 ? '' : 's') + ' waiting for verification';
  }

  /* ---------- assessments ---------- */
  var ASSESS = [
    { n: 'Patient Care Basics', q: 5, taken: 212, pass: 81, st: 'Live' },
    { n: 'Customer Service Basics', q: 5, taken: 340, pass: 88, st: 'Live' },
    { n: 'Warehouse Safety', q: 5, taken: 415, pass: 76, st: 'Live' },
    { n: 'Office and Admin Skills', q: 5, taken: 188, pass: 84, st: 'Live' },
    { n: 'Forklift Operation', q: 8, taken: 97, pass: 69, st: 'Live', note: 'Pass rate fell from 78% to 69% after question 6 was reworded on Nov 1.' },
    { n: 'Dental Front Desk', q: 5, taken: 0, pass: null, st: 'Draft' }
  ];
  function renderAssess() {
    $('#aRows').innerHTML = ASSESS.map(function (a) {
      return '<div class="row">' +
        '<div><b>' + esc(a.n) + '</b><span class="sub">' + a.q + ' questions, pass mark ' + Math.ceil(a.q * 0.8) + ' of ' + a.q + '</span></div>' +
        '<div><span class="sub">Taken</span>' + (a.taken ? a.taken.toLocaleString() + ' times' : 'Not yet published') + '</div>' +
        '<div><span class="sub">Pass rate</span>' + (a.pass === null ? 'n/a' : a.pass + '%') + '</div>' +
        '<div class="acts"><span class="status ' + (a.st === 'Live' ? 'ok' : 'off') + '">' + a.st + '</span><button class="btn btn-ghost btn-sm" type="button" data-toast="Prototype: the assessment editor is switched off on this preview.">Edit questions</button></div>' +
        (a.note ? '<p class="note">' + ICON('i-flag') + esc(a.note) + '</p>' : '') +
        '</div>';
    }).join('');
  }

  /* ---------- interactions ---------- */
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('.pick[data-single] button'))) { $$('button', t.parentElement).forEach(function (b) { var on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); }); return; }
    if ((t = e.target.closest('[data-cf]'))) { cf = t.dataset.cf; $$('[data-cf]').forEach(function (b) { b.classList.toggle('on', b === t); }); renderCands(); return; }
    if ((t = e.target.closest('[data-ef]'))) { ef = t.dataset.ef; $$('[data-ef]').forEach(function (b) { b.classList.toggle('on', b === t); }); renderEmps(); return; }
    if ((t = e.target.closest('[data-flag]'))) { var c = CANDS.filter(function (x) { return x.id === +t.dataset.flag; })[0]; c.flag = 'Flagged by staff for review'; renderCands(); WL.toast(c.n + ' is hidden from employer search while you review.'); return; }
    if ((t = e.target.closest('[data-unflag]'))) { var c2 = CANDS.filter(function (x) { return x.id === +t.dataset.unflag; })[0]; c2.flag = ''; renderCands(); WL.toast(c2.n + ' is visible to employers again.'); return; }
    if ((t = e.target.closest('[data-verify]'))) {
      var em = EMPS.filter(function (x) { return x.id === +t.dataset.verify; })[0];
      em.ver = 'Verified'; em.sub = 'Active'; em.next = 'First payment charged today'; em.note = '';
      renderEmps(); WL.toast(em.co + ' verified. Their $29 plan starts and searching is unlocked.'); return;
    }
  });
  $$('[data-toast-on]').forEach(function (i) { i.addEventListener('change', function () { WL.toast(i.checked ? i.dataset.toastOn : i.dataset.toastOff); }); });

  /* ---------- boot ---------- */
  renderCands(); renderEmps(); renderAssess();
  WL.router('overview');
})();
