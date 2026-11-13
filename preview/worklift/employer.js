/* WorkLift concept prototype: Employer LiftOff. Sample data only, nothing is saved or sent. */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = WL.esc;
  var ICON = function (id) { return '<svg class="ic"><use href="#' + id + '"/></svg>'; };

  var ROLES = { warehouse: 'Warehouse Associate', forklift: 'Forklift Operator', ma: 'Medical Assistant', cs: 'Customer Service Representative', admin: 'Administrative Assistant' };
  var AV = { now: 'Available now', '2w': 'Available in 2 weeks', '30d': 'Available in 30 days' };

  var C = [
    { id: 1, n: 'Devon Pruitt', in: 'DP', r: 'warehouse', t: 'Warehouse associate, 3 years on a high-volume dock', loc: 'Bessemer', mi: 4, score: 88, exp: 3, av: 'now', open: true, as: [['Warehouse Safety', 92], ['Forklift Operation', 85]], sk: ['Forklift certified', 'RF scanner', 'Pick and pack', 'Cycle counts', 'Trailer loading'], sum: 'Three years receiving and shipping on a dock that moves 1,200 pallets a week. Forklift certified on sit-down and reach trucks. Reliable on rotating shifts.', hist: [['Warehouse Associate, Shelby Distribution', '2023 to now'], ['Stocker, Valley Grocery', '2021 to 2023']] },
    { id: 2, n: 'Keisha Lowery', in: 'KL', r: 'ma', t: 'Medical assistant, 4 years in pediatrics', loc: 'Homewood', mi: 3, score: 86, exp: 4, av: '2w', open: false, as: [['Patient Care Basics', 92]], sk: ['Vitals', 'Immunizations', 'EHR charting', 'Pediatric intake'], sum: 'Four years in a busy pediatric practice. Strong with immunization schedules and nervous parents.', hist: [['Medical Assistant, Lakeview Pediatrics', '2022 to now'], ['Medical Assistant, Brookside Urgent Care', '2020 to 2022']] },
    { id: 3, n: 'Marcus Tran', in: 'MT', r: 'warehouse', t: 'Warehouse associate, fulfillment and returns', loc: 'Hoover', mi: 9, score: 81, exp: 1, av: '2w', open: false, as: [['Warehouse Safety', 88]], sk: ['Pick and pack', 'Returns processing', 'Label printing', 'Inventory scans'], sum: 'One year in e-commerce fulfillment with a strong accuracy record. Looking for a day shift closer to home.', hist: [['Fulfillment Associate, Southern Parcel', '2025 to now']] },
    { id: 4, n: 'Alana Whitfield', in: 'AW', r: 'cs', t: 'Customer service lead, inbound call center', loc: 'Birmingham', mi: 7, score: 90, exp: 5, av: 'now', open: true, as: [['Customer Service Basics', 96]], sk: ['Inbound calls', 'Escalations', 'CRM', 'Coaching new hires'], sum: 'Five years in inbound support, two as a team lead. Handles escalations calmly and coaches new hires.', hist: [['Customer Service Lead, Vulcan Utility Services', '2022 to now'], ['Customer Service Rep, Vulcan Utility Services', '2020 to 2022']] },
    { id: 5, n: 'Samuel Okafor', in: 'SO', r: 'warehouse', t: 'General labor, ready to train on warehouse work', loc: 'Bessemer', mi: 11, score: 64, exp: 0, av: 'now', open: true, as: [], sk: ['Loading', 'Pallet jack', 'Reliable transportation'], sum: 'Two years of general labor and landscaping. Hard worker looking for a first warehouse role and willing to train.', hist: [['Crew Member, Greenway Landscaping', '2024 to now']] },
    { id: 6, n: 'Brittany Hale', in: 'BH', r: 'admin', t: 'Administrative assistant, construction office', loc: 'Pelham', mi: 12, score: 84, exp: 6, av: '30d', open: false, as: [['Office and Admin Skills', 90]], sk: ['Scheduling', 'QuickBooks', 'Vendor calls', 'Records'], sum: 'Six years running the front office for a commercial contractor. Handles scheduling, invoicing and vendor calls.', hist: [['Office Administrator, Oak Mountain Builders', '2019 to now']] },
    { id: 7, n: 'Jordan Mims', in: 'JM', r: 'forklift', t: 'Forklift operator, reach and sit-down certified', loc: 'Bessemer', mi: 6, score: 91, exp: 4, av: 'now', open: true, as: [['Forklift Operation', 97], ['Warehouse Safety', 90]], sk: ['Reach truck', 'Sit-down forklift', 'Order picker', 'Dock safety'], sum: 'Four years on forklifts in cold storage and dry goods. Zero incidents. Comfortable with nights.', hist: [['Forklift Operator, Cahaba Cold Storage', '2021 to now']] },
    { id: 8, n: 'Priya Natarajan', in: 'PN', r: 'cs', t: 'Customer support, software help desk', loc: 'Vestavia Hills', mi: 8, score: 79, exp: 2, av: '2w', open: false, as: [['Customer Service Basics', 88]], sk: ['Ticketing', 'Live chat', 'Troubleshooting', 'Documentation'], sum: 'Two years on a software help desk. Writes clear instructions and keeps ticket queues moving.', hist: [['Support Specialist, Brightline Software', '2024 to now']] },
    { id: 9, n: 'Maya Dorsey', in: 'MD', r: 'ma', t: 'Medical assistant, 3 years in family practice', loc: 'Hoover', mi: 6, score: 90, exp: 3, av: 'now', open: true, as: [['Patient Care Basics', 100]], sk: ['Vitals', 'EHR charting', 'Injections', 'Phlebotomy', 'Spanish (conversational)'], sum: 'Certified medical assistant with three years in a busy family practice. Comfortable rooming patients, taking vitals, charting in the EHR and keeping exam rooms ready.', hist: [['Medical Assistant, Shades Valley Family Clinic', '2023 to now'], ['Receptionist, Lakeshore Dental', '2021 to 2023']] },
    { id: 10, n: 'Terrence Gaines', in: 'TG', r: 'warehouse', t: 'Shipping and receiving, 5 years', loc: 'Cullman', mi: 48, score: 77, exp: 5, av: '30d', open: true, as: [['Warehouse Safety', 84]], sk: ['Shipping', 'Receiving', 'Bills of lading', 'Forklift'], sum: 'Five years in shipping and receiving for a furniture manufacturer. Relocating to the Birmingham area in December.', hist: [['Shipping Clerk, Northfield Furniture', '2020 to now']] },
    { id: 11, n: 'Luis Herrera', in: 'LH', r: 'forklift', t: 'Forklift operator, lumber yard', loc: 'Birmingham', mi: 10, score: 83, exp: 2, av: '2w', open: false, as: [['Forklift Operation', 89]], sk: ['Sit-down forklift', 'Yard loading', 'Inventory', 'Bilingual, English and Spanish'], sum: 'Two years loading customer orders at a lumber yard. Bilingual in English and Spanish.', hist: [['Yard Associate, Red Mountain Lumber', '2023 to now']] },
    { id: 12, n: 'Dana McCullough', in: 'DM', r: 'admin', t: 'Receptionist and office assistant', loc: 'Homewood', mi: 5, score: 72, exp: 1, av: 'now', open: false, as: [['Office and Admin Skills', 82]], sk: ['Front desk', 'Microsoft Office', 'Scheduling', 'Mail and supplies'], sum: 'One year at a law office front desk. Organized, punctual and quick to learn new systems.', hist: [['Receptionist, Hartley Lane Law', '2025 to now']] }
  ];
  var byId = function (id) { return C.filter(function (c) { return c.id === id; })[0]; };

  var S = {
    saved: { 7: true },
    requests: [
      { id: 101, cid: 7, role: 'Forklift Operator', when: 'Tue, Nov 18 at 2:00 pm', type: 'In person', status: 'Accepted' },
      { id: 102, cid: 3, role: 'Warehouse Associate', when: 'Mon, Nov 17 at 9:00 am', type: 'Phone', status: 'Pending' }
    ],
    cur: null
  };
  var nextId = 103;
  function reqFor(cid) { return S.requests.filter(function (r) { return r.cid === cid; })[0]; }

  /* ---------- search ---------- */
  function filtered() {
    var role = $('#fRole').value, dist = +$('#fDist').value, av = $('#fAvail').value, exp = +$('#fExp').value, pass = $('#fPass').checked, open = $('#fOpen').checked;
    return C.filter(function (c) {
      if (c.r !== role) return false;
      if (c.mi > dist) return false;
      if (av === 'now' && c.av !== 'now') return false;
      if (av === '2w' && c.av === '30d') return false;
      if (c.exp < exp) return false;
      if (pass && !c.as.some(function (a) { return a[1] >= 70; })) return false;
      if (open && !c.open) return false;
      return true;
    }).sort(function (a, b) { return b.score - a.score; });
  }
  function card(c) {
    var r = reqFor(c.id);
    var tags = c.as.map(function (a) { return '<span class="chip pass">' + ICON('i-check') + esc(a[0]) + ' ' + a[1] + '%</span>'; }).join('') +
      (c.as.length ? '' : '<span class="chip warn">No assessment yet</span>') +
      c.sk.slice(0, 3).map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('');
    var reqBtn = r ? '<span class="status' + (r.status === 'Accepted' ? ' ok' : '') + '">Interview ' + (r.status === 'Accepted' ? 'accepted' : 'requested') + '</span>' : '<button class="btn btn-lift btn-sm" type="button" data-req="' + c.id + '">Request interview</button>';
    return '<div class="cand" data-cid="' + c.id + '">' +
      '<div class="avatar spark">' + c.in + '</div>' +
      '<div class="who"><h3>' + esc(c.n) + '</h3><p class="meta">' + esc(c.t) + '</p><p class="meta">' + esc(c.loc) + ', ' + c.mi + ' miles away. ' + AV[c.av] + '. ' + (c.exp ? c.exp + ' year' + (c.exp > 1 ? 's' : '') + ' of experience.' : 'Entry level.') + '</p><div class="tags">' + tags + '</div></div>' +
      '<div class="cside"><div class="score">' + c.score + '<small>LiftScore</small></div><div class="acts">' +
      '<button class="btn btn-ghost btn-sm" type="button" data-save="' + c.id + '" aria-pressed="' + !!S.saved[c.id] + '">' + (S.saved[c.id] ? 'Saved' : 'Save') + '</button>' +
      reqBtn +
      '<button class="btn btn-ghost btn-sm" type="button" data-cand="' + c.id + '">Profile</button></div></div></div>';
  }
  function renderSearch() {
    var list = filtered();
    $('#cnt').textContent = list.length === 1 ? '1 candidate matches' : list.length + ' candidates match';
    $('#cands').innerHTML = list.length ? list.map(card).join('') : '<div class="empty">No candidates match these filters yet. Try a wider distance, or switch off "Assessment passed" to see candidates who haven\'t taken one.</div>';
  }
  function renderSaved() {
    var list = C.filter(function (c) { return S.saved[c.id]; });
    $('#savedList').innerHTML = list.length ? list.map(card).join('') : '<div class="empty">Nothing saved yet. Use Save on any candidate in Search to keep them here.</div>';
  }
  function renderRequests() {
    var el = $('#reqList');
    if (!S.requests.length) { el.innerHTML = '<div class="empty">No interview requests yet.</div>'; return; }
    el.innerHTML = S.requests.map(function (r) {
      var c = byId(r.cid);
      var st = r.status === 'Accepted' ? 'ok' : (r.status === 'Declined' ? 'bad' : 'warn');
      return '<div class="req"><div class="avatar sm spark">' + c.in + '</div><div class="who"><b>' + esc(c.n) + ', ' + esc(r.role) + '</b><span>' + esc(r.when) + '. ' + esc(r.type) + '</span></div><div class="acts"><span class="status ' + st + '">' + r.status + '</span><button class="btn btn-ghost btn-sm" type="button" data-toast="Prototype: messaging is switched off on this preview.">Message</button>' + (r.status === 'Pending' ? '<button class="btn btn-ghost btn-sm" type="button" data-cancelreq="' + r.id + '">Withdraw</button>' : '') + '</div></div>';
    }).join('');
  }
  function renderRoles() {
    var roles = [
      { k: 'warehouse', n: 'Warehouse Associate', d: '2 openings. Days, Bessemer. $17 to $19 an hour' },
      { k: 'forklift', n: 'Forklift Operator', d: '1 opening. Nights, Bessemer. $19 to $22 an hour' }
    ];
    $('#roles').innerHTML = roles.map(function (r) {
      var n = C.filter(function (c) { return c.r === r.k; }).length;
      return '<div class="role"><div class="avatar sm sky">' + ICON('i-case') + '</div><div><b>' + esc(r.n) + '</b><span>' + esc(r.d) + '</span></div><span class="pct">' + n + '<small>matched</small></span><button class="btn btn-ghost btn-sm" type="button" data-role="' + r.k + '">Search matches</button></div>';
    }).join('');
  }
  function renderAll() { renderSearch(); renderSaved(); renderRequests(); renderRoles(); }

  /* ---------- candidate sheet ---------- */
  function openCand(id) {
    var c = byId(id); if (!c) return; S.cur = c;
    $('#candIn').textContent = c.in; $('#candName').textContent = c.n;
    $('#candBody').innerHTML =
      '<p class="muted" style="margin:0 0 14px">' + esc(c.t) + '. ' + esc(c.loc) + ', ' + c.mi + ' miles away. ' + AV[c.av] + '.</p>' +
      '<p>' + esc(c.sum) + '</p>' +
      '<h4>Assessment results</h4>' + (c.as.length ? '<div class="abar">' + c.as.map(function (a) { return '<div><span>' + esc(a[0]) + '</span><b>' + a[1] + '%</b><i style="--w:' + a[1] + '%"></i></div>'; }).join('') + '</div>' : '<p class="muted">No assessment taken yet. You can still request an interview.</p>') +
      '<h4>Skills</h4><div class="skills">' + c.sk.map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') + '</div>' +
      '<h4>Work history</h4><div class="hist">' + c.hist.map(function (h) { return '<div class="h"><b>' + esc(h[0]) + '</b><span>' + esc(h[1]) + '</span></div>'; }).join('') + '</div>' +
      '<h4>Schedule</h4><p>' + (c.open ? 'Open to nights or weekends.' : 'Days only.') + ' LiftScore ' + c.score + '.</p>';
    syncSheet();
    WL.open('candSheet');
  }
  function syncSheet() {
    var c = S.cur; if (!c) return;
    var r = reqFor(c.id);
    $('#candReq').textContent = r ? 'Interview ' + (r.status === 'Accepted' ? 'accepted' : 'requested') : 'Request interview';
    $('#candReq').disabled = !!r;
    $('#candSave').textContent = S.saved[c.id] ? 'Saved' : 'Save';
  }
  $('#candSave').addEventListener('click', function () { if (S.cur) toggleSave(S.cur.id); syncSheet(); });
  $('#candReq').addEventListener('click', function () { if (S.cur) openReq(S.cur.id); });

  /* ---------- actions ---------- */
  function toggleSave(id) {
    S.saved[id] = !S.saved[id];
    WL.toast(S.saved[id] ? byId(id).n.split(' ')[0] + ' saved.' : 'Removed from saved.');
    renderAll();
  }
  var reqCid = null;
  function fmtWhen(d, t) {
    var p = d.split('-'); if (p.length !== 3) return t;
    var dt = new Date(+p[0], +p[1] - 1, +p[2]);
    return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' at ' + t;
  }
  function openReq(id) {
    var c = byId(id); if (!c) return; reqCid = id;
    var first = c.n.split(' ')[0];
    var role = c.r === 'forklift' ? 'Forklift Operator' : 'Warehouse Associate';
    $('#qRole').value = role;
    $('#reqWho').textContent = 'With ' + c.n + '. They\'ll get an email and a notification in WorkLift, and can accept or propose another time.';
    $('#qMsg').value = 'Hi ' + first + ', we\'d like to talk with you about our ' + role + ' opening at Magnolia Logistics in Bessemer.';
    WL.close('candSheet');
    WL.open('reqModal');
  }
  $('#reqSend').addEventListener('click', function () {
    var c = byId(reqCid); if (!c) return;
    S.requests.unshift({ id: nextId++, cid: c.id, role: $('#qRole').value, when: fmtWhen($('#qDate').value, $('#qTime').value), type: $('#qType').value.split(' at ')[0], status: 'Pending' });
    WL.close('reqModal');
    WL.toast('Interview request sent to ' + c.n.split(' ')[0] + '.');
    renderAll();
  });
  $('#confirmCancel').addEventListener('click', function () { WL.close('cancelModal'); WL.toast('Prototype: cancellation is switched off on this preview.'); });

  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-save]'))) { toggleSave(+t.dataset.save); return; }
    if ((t = e.target.closest('[data-req]'))) { openReq(+t.dataset.req); return; }
    if ((t = e.target.closest('[data-cand]'))) { openCand(+t.dataset.cand); return; }
    if ((t = e.target.closest('[data-cancelreq]'))) {
      S.requests = S.requests.filter(function (r) { return r.id !== +t.dataset.cancelreq; });
      WL.toast('Request withdrawn.'); renderAll(); return;
    }
    if ((t = e.target.closest('[data-role]'))) { $('#fRole').value = t.dataset.role; renderSearch(); location.hash = 'search'; return; }
  });
  ['fRole', 'fDist', 'fAvail', 'fExp', 'fPass', 'fOpen'].forEach(function (id) { $('#' + id).addEventListener('change', renderSearch); });

  /* ---------- boot ---------- */
  renderAll();
  WL.router('search');
})();
