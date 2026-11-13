/* WorkLift concept prototype: Employer LiftOff. Sample data only, nothing is saved or sent. */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var esc = WL.esc;
  var ICON = function (id) { return '<svg class="ic"><use href="#' + id + '"/></svg>'; };

  var ROLES = { warehouse: 'Warehouse Associate', forklift: 'Forklift Operator', ma: 'Medical Assistant', cs: 'Customer Service Representative', admin: 'Administrative Assistant' };
  var AV = { now: 'Available now', '2w': 'Available in 2 weeks', '30d': 'Available in 30 days' };

  /* Contact details exist in the data but are only ever rendered after an accepted interview request. */
  var C = [
    { id: 1, n: 'Devon Pruitt', in: 'DP', r: 'warehouse', t: 'Warehouse associate, 3 years on a high-volume dock', loc: 'Bessemer', mi: 4, exp: 3, av: 'now', open: true, as: [['Warehouse Safety', 92], ['Forklift Operation', 85]], sk: ['Forklift certified', 'RF scanner', 'Pick and pack', 'Cycle counts', 'Trailer loading'], why: ['Role: warehouse associate', 'Forklift certified, RF scanner', '4 miles away', 'Available now'], phone: '(205) 555-0131', email: 'devon.pruitt@example.com', sum: 'Three years receiving and shipping on a dock that moves 1,200 pallets a week. Forklift certified on sit-down and reach trucks. Reliable on rotating shifts.', hist: [['Warehouse Associate, Shelby Distribution', '2023 to now'], ['Stocker, Valley Grocery', '2021 to 2023']] },
    { id: 2, n: 'Keisha Lowery', in: 'KL', r: 'ma', t: 'Medical assistant, 4 years in pediatrics', loc: 'Homewood', mi: 3, exp: 4, av: '2w', open: false, as: [['Patient Care Basics', 92]], sk: ['Vitals', 'Immunizations', 'EHR charting', 'Pediatric intake'], why: ['Role: medical assistant', 'Patient Care Basics passed', '4 years of experience'], phone: '(205) 555-0144', email: 'keisha.lowery@example.com', sum: 'Four years in a busy pediatric practice. Strong with immunization schedules and nervous parents.', hist: [['Medical Assistant, Lakeview Pediatrics', '2022 to now'], ['Medical Assistant, Brookside Urgent Care', '2020 to 2022']] },
    { id: 3, n: 'Marcus Tran', in: 'MT', r: 'warehouse', t: 'Warehouse associate, fulfillment and returns', loc: 'Hoover', mi: 9, exp: 1, av: '2w', open: false, as: [['Warehouse Safety', 88]], sk: ['Pick and pack', 'Returns processing', 'Label printing', 'Inventory scans'], why: ['Role: warehouse associate', 'Pick and pack, inventory scans', 'Warehouse Safety passed'], phone: '(205) 555-0162', email: 'marcus.tran@example.com', sum: 'One year in e-commerce fulfillment with a strong accuracy record. Looking for a day shift closer to home.', hist: [['Fulfillment Associate, Southern Parcel', '2025 to now']] },
    { id: 4, n: 'Alana Whitfield', in: 'AW', r: 'cs', t: 'Customer service lead, inbound call center', loc: 'Birmingham', mi: 7, exp: 5, av: 'now', open: true, as: [['Customer Service Basics', 96]], sk: ['Inbound calls', 'Escalations', 'CRM', 'Coaching new hires'], why: ['Role: customer service', 'Customer Service Basics passed', '5 years of experience', 'Available now'], phone: '(205) 555-0118', email: 'alana.whitfield@example.com', sum: 'Five years in inbound support, two as a team lead. Handles escalations calmly and coaches new hires.', hist: [['Customer Service Lead, Vulcan Utility Services', '2022 to now'], ['Customer Service Rep, Vulcan Utility Services', '2020 to 2022']] },
    { id: 5, n: 'Samuel Okafor', in: 'SO', r: 'warehouse', t: 'General labor, ready to train on warehouse work', loc: 'Bessemer', mi: 11, exp: 0, av: 'now', open: true, as: [], sk: ['Loading', 'Pallet jack', 'Reliable transportation'], why: ['Role: warehouse associate', 'Pallet jack, loading', 'Available now'], phone: '(205) 555-0175', email: 'samuel.okafor@example.com', sum: 'Two years of general labor and landscaping. Hard worker looking for a first warehouse role and willing to train.', hist: [['Crew Member, Greenway Landscaping', '2024 to now']] },
    { id: 6, n: 'Brittany Hale', in: 'BH', r: 'admin', t: 'Administrative assistant, construction office', loc: 'Pelham', mi: 12, exp: 6, av: '30d', open: false, as: [['Office and Admin Skills', 90]], sk: ['Scheduling', 'QuickBooks', 'Vendor calls', 'Records'], why: ['Role: administrative assistant', 'Office and Admin Skills passed', '6 years of experience'], phone: '(205) 555-0109', email: 'brittany.hale@example.com', sum: 'Six years running the front office for a commercial contractor. Handles scheduling, invoicing and vendor calls.', hist: [['Office Administrator, Oak Mountain Builders', '2019 to now']] },
    { id: 7, n: 'Jordan Mims', in: 'JM', r: 'forklift', t: 'Forklift operator, reach and sit-down certified', loc: 'Bessemer', mi: 6, exp: 4, av: 'now', open: true, as: [['Forklift Operation', 97], ['Warehouse Safety', 90]], sk: ['Reach truck', 'Sit-down forklift', 'Order picker', 'Dock safety'], why: ['Role: forklift operator', 'Forklift Operation passed', 'Open to nights', 'Available now'], phone: '(205) 555-0107', email: 'jordan.mims@example.com', sum: 'Four years on forklifts in cold storage and dry goods. Zero incidents. Comfortable with nights.', hist: [['Forklift Operator, Cahaba Cold Storage', '2021 to now']] },
    { id: 8, n: 'Priya Natarajan', in: 'PN', r: 'cs', t: 'Customer support, software help desk', loc: 'Vestavia Hills', mi: 8, exp: 2, av: '2w', open: false, as: [['Customer Service Basics', 88]], sk: ['Ticketing', 'Live chat', 'Troubleshooting', 'Documentation'], why: ['Role: customer service', 'Customer Service Basics passed', 'Ticketing, live chat'], phone: '(205) 555-0152', email: 'priya.natarajan@example.com', sum: 'Two years on a software help desk. Writes clear instructions and keeps ticket queues moving.', hist: [['Support Specialist, Brightline Software', '2024 to now']] },
    { id: 9, n: 'Maya Dorsey', in: 'MD', r: 'ma', t: 'Medical assistant, 3 years in family practice', loc: 'Hoover', mi: 6, exp: 3, av: 'now', open: true, as: [['Patient Care Basics', 100]], sk: ['Vitals', 'EHR charting', 'Injections', 'Phlebotomy', 'Spanish (conversational)'], why: ['Role: medical assistant', 'Patient Care Basics passed', 'Vitals, EHR charting', 'Available now'], phone: '(205) 555-0142', email: 'maya.dorsey@example.com', sum: 'Certified medical assistant with three years in a busy family practice. Comfortable rooming patients, taking vitals, charting in the EHR and keeping exam rooms ready.', hist: [['Medical Assistant, Shades Valley Family Clinic', '2023 to now'], ['Receptionist, Lakeshore Dental', '2021 to 2023']] },
    { id: 10, n: 'Terrence Gaines', in: 'TG', r: 'warehouse', t: 'Shipping and receiving, 5 years', loc: 'Cullman', mi: 48, exp: 5, av: '30d', open: true, as: [['Warehouse Safety', 84]], sk: ['Shipping', 'Receiving', 'Bills of lading', 'Forklift'], why: ['Role: warehouse associate', '5 years of experience', 'Forklift'], phone: '(205) 555-0186', email: 'terrence.gaines@example.com', sum: 'Five years in shipping and receiving for a furniture manufacturer. Relocating to the Birmingham area in December.', hist: [['Shipping Clerk, Northfield Furniture', '2020 to now']] },
    { id: 11, n: 'Luis Herrera', in: 'LH', r: 'forklift', t: 'Forklift operator, lumber yard', loc: 'Birmingham', mi: 10, exp: 2, av: '2w', open: false, as: [['Forklift Operation', 89]], sk: ['Sit-down forklift', 'Yard loading', 'Inventory', 'Bilingual, English and Spanish'], why: ['Role: forklift operator', 'Forklift Operation passed', 'Bilingual'], phone: '(205) 555-0193', email: 'luis.herrera@example.com', sum: 'Two years loading customer orders at a lumber yard. Bilingual in English and Spanish.', hist: [['Yard Associate, Red Mountain Lumber', '2023 to now']] },
    { id: 12, n: 'Dana McCullough', in: 'DM', r: 'admin', t: 'Receptionist and office assistant', loc: 'Homewood', mi: 5, exp: 1, av: 'now', open: false, as: [['Office and Admin Skills', 82]], sk: ['Front desk', 'Microsoft Office', 'Scheduling', 'Mail and supplies'], why: ['Role: administrative assistant', 'Front desk, scheduling', 'Available now'], phone: '(205) 555-0127', email: 'dana.mccullough@example.com', sum: 'One year at a law office front desk. Organized, punctual and quick to learn new systems.', hist: [['Receptionist, Hartley Lane Law', '2025 to now']] }
  ];
  var byId = function (id) { return C.filter(function (c) { return c.id === id; })[0]; };

  var S = {
    saved: { 7: true },
    requests: [
      { id: 101, cid: 7, role: 'Forklift Operator', when: 'Tue, Nov 18 at 2:00 pm', type: 'In person', status: 'Accepted', shared: 'Nov 14' },
      { id: 102, cid: 3, role: 'Warehouse Associate', when: 'Mon, Nov 17 at 9:00 am', type: 'Phone', status: 'Pending' }
    ],
    searches: [
      { id: 1, f: { role: 'warehouse', dist: '25', av: 'any', exp: '0', pass: true, open: false }, label: 'Warehouse Associate, within 25 miles, assessment passed', since: 'Nov 10', fresh: 1 },
      { id: 2, f: { role: 'forklift', dist: '25', av: 'now', exp: '1', pass: true, open: true }, label: 'Forklift Operator, within 25 miles, available now, 1+ years, assessment passed, nights or weekends', since: 'Nov 4', fresh: 2 }
    ],
    cur: null
  };
  var nextId = 103, nextSearch = 3;
  function reqFor(cid) { return S.requests.filter(function (r) { return r.cid === cid; })[0]; }
  function accepted(cid) { var r = reqFor(cid); return r && r.status === 'Accepted' ? r : null; }

  /* ---------- search ---------- */
  function readFilters() {
    return { role: $('#fRole').value, dist: $('#fDist').value, av: $('#fAvail').value, exp: $('#fExp').value, pass: $('#fPass').checked, open: $('#fOpen').checked };
  }
  function writeFilters(f) {
    $('#fRole').value = f.role; $('#fDist').value = f.dist; $('#fAvail').value = f.av; $('#fExp').value = f.exp; $('#fPass').checked = f.pass; $('#fOpen').checked = f.open;
  }
  function labelFor(f) {
    var parts = [ROLES[f.role], 'within ' + f.dist + ' miles'];
    if (f.av === 'now') parts.push('available now'); if (f.av === '2w') parts.push('available within 2 weeks');
    if (+f.exp) parts.push(f.exp + '+ years');
    if (f.pass) parts.push('assessment passed');
    if (f.open) parts.push('nights or weekends');
    return parts.join(', ');
  }
  function filtered() {
    var f = readFilters(), dist = +f.dist, exp = +f.exp;
    return C.filter(function (c) {
      if (c.r !== f.role) return false;
      if (c.mi > dist) return false;
      if (f.av === 'now' && c.av !== 'now') return false;
      if (f.av === '2w' && c.av === '30d') return false;
      if (c.exp < exp) return false;
      if (f.pass && !c.as.some(function (a) { return a[1] >= 70; })) return false;
      if (f.open && !c.open) return false;
      return true;
    }).sort(function (a, b) { return (b.why.length - a.why.length) || (b.exp - a.exp); });
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
      '<div class="cside"><div class="why"><b>Why this match</b>' + esc(c.why.join(', ')) + '</div><div class="acts">' +
      '<button class="btn btn-ghost btn-sm" type="button" data-save="' + c.id + '" aria-pressed="' + !!S.saved[c.id] + '">' + (S.saved[c.id] ? 'Shortlisted' : 'Shortlist') + '</button>' +
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
    $('#savedList').innerHTML = list.length ? list.map(card).join('') : '<div class="empty">Nothing shortlisted yet. Use Shortlist on any candidate in Search to keep them here.</div>';
  }
  function renderRequests() {
    var el = $('#reqList');
    if (!S.requests.length) { el.innerHTML = '<div class="empty">No interview requests yet.</div>'; return; }
    el.innerHTML = S.requests.map(function (r) {
      var c = byId(r.cid);
      var st = r.status === 'Accepted' ? 'ok' : (r.status === 'Declined' ? 'bad' : 'warn');
      var contact = r.status === 'Accepted'
        ? '<span class="contact" style="color:var(--lift-deep);font-weight:500">' + esc(c.phone) + ', ' + esc(c.email) + '. Shared ' + esc(r.shared) + '.</span>'
        : '<span>Contact details unlock if ' + esc(c.n.split(' ')[0]) + ' accepts.</span>';
      var msg = r.status === 'Accepted'
        ? '<button class="btn btn-ghost btn-sm" type="button" data-toast="Prototype: messaging is switched off on this preview.">Message</button>'
        : '<button class="btn btn-ghost btn-sm" type="button" disabled title="Available once the candidate accepts">Message</button>';
      return '<div class="req"><div class="avatar sm spark">' + c.in + '</div><div class="who"><b>' + esc(c.n) + ', ' + esc(r.role) + '</b><span>' + esc(r.when) + '. ' + esc(r.type) + '</span>' + contact + '</div><div class="acts"><span class="status ' + st + '">' + r.status + '</span>' + msg + (r.status === 'Pending' ? '<button class="btn btn-ghost btn-sm" type="button" data-cancelreq="' + r.id + '">Withdraw</button>' : '') + '</div></div>';
    }).join('');
  }
  function renderSearches() {
    var el = $('#searchList');
    if (!S.searches.length) { el.innerHTML = '<div class="empty">No saved searches yet. Set your filters in Search and choose "Save this search".</div>'; return; }
    el.innerHTML = S.searches.map(function (s) {
      return '<div class="row"><div><b>' + esc(s.label) + '</b><span class="sub">Saved ' + esc(s.since) + '</span></div><div>' + (s.fresh ? '<span class="status ok">' + s.fresh + ' new since ' + esc(s.since) + '</span>' : '<span class="status off">No new candidates</span>') + '</div><div></div><div class="acts"><button class="btn btn-lift btn-sm" type="button" data-run="' + s.id + '">Run search</button><button class="btn btn-ghost btn-sm" type="button" data-delsearch="' + s.id + '">Delete</button></div></div>';
    }).join('');
  }
  function renderAll() { renderSearch(); renderSaved(); renderRequests(); renderSearches(); }

  /* ---------- candidate sheet ---------- */
  function openCand(id) {
    var c = byId(id); if (!c) return; S.cur = c;
    var a = accepted(c.id);
    $('#candIn').textContent = c.in; $('#candName').textContent = c.n;
    $('#candBody').innerHTML =
      '<p class="muted" style="margin:0 0 14px">' + esc(c.t) + '. ' + esc(c.loc) + ', ' + c.mi + ' miles away. ' + AV[c.av] + '.</p>' +
      '<p>' + esc(c.sum) + '</p>' +
      '<h4>Contact details</h4>' + (a
        ? '<div class="unlock">' + ICON('i-check') + '<div><b>' + esc(c.phone) + ', ' + esc(c.email) + '</b><small>Shared by ' + esc(c.n.split(' ')[0]) + ' when they accepted your interview request on ' + esc(a.shared) + '.</small></div></div>'
        : '<div class="lock">' + ICON('i-lock') + '<div>Contact details are shared when ' + esc(c.n.split(' ')[0]) + ' accepts an interview request. Until then, WorkLift carries your request for you.</div></div>') +
      '<h4>Why this match</h4><ul style="margin:0;padding-left:20px">' + c.why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>' +
      '<h4>Assessment results</h4>' + (c.as.length ? '<div class="abar">' + c.as.map(function (a2) { return '<div><span>' + esc(a2[0]) + '</span><b>' + a2[1] + '%</b><i style="--w:' + a2[1] + '%"></i></div>'; }).join('') + '</div><p class="muted" style="font-size:13px;margin:8px 0 0">Results supplement the profile. They are shown because the candidate chose to share them.</p>' : '<p class="muted">No assessment taken yet. You can still request an interview.</p>') +
      '<h4>Skills</h4><div class="skills">' + c.sk.map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') + '</div>' +
      '<h4>Work history</h4><div class="hist">' + c.hist.map(function (h) { return '<div class="h"><b>' + esc(h[0]) + '</b><span>' + esc(h[1]) + '</span></div>'; }).join('') + '</div>' +
      '<h4>Schedule</h4><p>' + (c.open ? 'Open to nights or weekends.' : 'Days only.') + ' ' + AV[c.av] + '.</p>';
    syncSheet();
    WL.open('candSheet');
  }
  function syncSheet() {
    var c = S.cur; if (!c) return;
    var r = reqFor(c.id);
    $('#candReq').textContent = r ? 'Interview ' + (r.status === 'Accepted' ? 'accepted' : 'requested') : 'Request interview';
    $('#candReq').disabled = !!r;
    $('#candSave').textContent = S.saved[c.id] ? 'Shortlisted' : 'Shortlist';
  }
  $('#candSave').addEventListener('click', function () { if (S.cur) toggleSave(S.cur.id); syncSheet(); });
  $('#candReq').addEventListener('click', function () { if (S.cur) openReq(S.cur.id); });

  /* ---------- actions ---------- */
  function toggleSave(id) {
    S.saved[id] = !S.saved[id];
    WL.toast(S.saved[id] ? byId(id).n.split(' ')[0] + ' added to your shortlist.' : 'Removed from your shortlist.');
    renderAll();
  }
  var reqCid = null;
  function fmtWhen(d, t) {
    var p = d.split('-'); if (p.length !== 3) return t;
    var dt = new Date(+p[0], +p[1] - 1, +p[2]);
    return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' at ' + t;
  }
  $('#qRole').innerHTML = Object.keys(ROLES).map(function (k) { return '<option>' + ROLES[k] + '</option>'; }).join('');
  function openReq(id) {
    var c = byId(id); if (!c) return; reqCid = id;
    var first = c.n.split(' ')[0];
    var role = ROLES[c.r];
    $('#qRole').value = role;
    $('#reqWho').textContent = 'With ' + c.n + '. They get an email and a notification in WorkLift, and can accept, decline or propose another time.';
    $('#qMsg').value = 'Hi ' + first + ', we\'d like to talk with you about a ' + role + ' role at Magnolia Logistics in Bessemer.';
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
  $('#saveSearch').addEventListener('click', function () {
    var f = readFilters();
    S.searches.unshift({ id: nextSearch++, f: f, label: labelFor(f), since: 'today', fresh: 0 });
    renderSearches();
    WL.toast('Search saved. We\'ll tell you when new candidates match.');
  });

  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-save]'))) { toggleSave(+t.dataset.save); return; }
    if ((t = e.target.closest('[data-req]'))) { openReq(+t.dataset.req); return; }
    if ((t = e.target.closest('[data-cand]'))) { openCand(+t.dataset.cand); return; }
    if ((t = e.target.closest('[data-cancelreq]'))) {
      S.requests = S.requests.filter(function (r) { return r.id !== +t.dataset.cancelreq; });
      WL.toast('Request withdrawn.'); renderAll(); return;
    }
    if ((t = e.target.closest('[data-run]'))) {
      var s = S.searches.filter(function (x) { return x.id === +t.dataset.run; })[0];
      if (s) { writeFilters(s.f); renderSearch(); location.hash = 'search'; }
      return;
    }
    if ((t = e.target.closest('[data-delsearch]'))) {
      S.searches = S.searches.filter(function (x) { return x.id !== +t.dataset.delsearch; });
      renderSearches(); WL.toast('Saved search deleted.'); return;
    }
  });
  ['fRole', 'fDist', 'fAvail', 'fExp', 'fPass', 'fOpen'].forEach(function (id) { $('#' + id).addEventListener('change', renderSearch); });

  /* ---------- boot ---------- */
  renderAll();
  WL.router('search');
})();
