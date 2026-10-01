/* Public-site behaviour: menu, live content from the shared store, class finder, demo forms. */
(function () {
  var R = window.MBGR, store = window.MBG;
  var state = store.load(), site = state.site;
  var today = R.iso(new Date());
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }

  /* ── content: re-render every baked block from the store so dashboard edits show up ── */
  function paint() {
    $$('[data-block]').forEach(function (el) {
      var fn = R.blocks[el.getAttribute('data-block')];
      if (fn) el.innerHTML = fn(site, today);
    });
    $$('[data-bind]').forEach(function (el) { el.textContent = R.text(site, el.getAttribute('data-bind')); });
  }
  paint();
  window.addEventListener('storage', function (e) {
    if (e.key === store.KEY) { state = store.load(); site = state.site; paint(); }
  });

  /* ── mobile menu ── */
  var sheet = $('#sheet'), openBtn = $('#menuOpen'), closeBtn = $('#menuClose');
  function setSheet(open) {
    if (!sheet) return;
    sheet.classList.toggle('open', open);
    sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
    openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) closeBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setSheet(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setSheet(false); openBtn.focus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setSheet(false); });

  /* ── Team dropdown: tap to toggle on touch ── */
  $$('.nav-drop>button').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.parentNode.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ── today's row in the hours table ── */
  var row = $('.hours tr[data-dow="' + new Date().getDay() + '"]');
  if (row) row.classList.add('today');

  /* ── toast ── */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  }

  /* ── demo forms: land in the staff dashboard inbox (this browser only — nothing is sent) ── */
  $$('form[data-inbox]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = {}, parts = [];
      $$('input,select,textarea', form).forEach(function (el) { if (el.name) f[el.name] = el.value.trim(); });
      $$('[data-sum]', form).forEach(function (el) { if (el.value.trim()) parts.push(el.value.trim()); });
      state = store.load();
      state.inbox.unshift({
        id: 'i' + Date.now(), type: form.getAttribute('data-inbox'), at: new Date().toISOString(),
        from: f.name || 'Website visitor', email: f.email || '', summary: parts.join(' · ') || '(no details)',
        status: 'New', assignee: '', sample: false
      });
      var ok = store.save(state);
      form.classList.add('sent');
      if (!ok) toast('Saved for this page view only — browser storage is unavailable.');
    });
  });

  /* ── class finder ── */
  var finder = $('#finderBox');
  if (finder) {
    var types = {}; site.classTypes.forEach(function (c) { types[c.id] = c; });
    var copy = {
      tb2: { req: 'Each student brings ONE active grown-up buddy. No experience needed.', desc: 'An introductory movement class where little ones build strength, coordination, balance and agility — and the best part is the time buddies and children spend together.' },
      am3: { req: 'The first class students do all by themselves. No experience needed.', desc: 'Coaches introduce basic skills on vault, bars, beam and floor while students practice turn-taking, manners, body awareness and cooperative learning.' },
      f4: { req: 'For 4-year-olds and new 5-year-olds. Leads into the Recreational Program.', desc: 'Progressively harder gymnastics skills, plus Tumbl Trak jumping, loose-foam pit play and trench slide stations.' },
      beg: { req: 'No prerequisite skills required. Students must be 5+.', desc: 'Foundational skills, body form and positions, strength and flexibility on all four Olympic apparatuses — at each student’s own pace.' },
      begEval: { req: 'Start here, or request an evaluation to be placed in Intermediate.', desc: 'Intermediate Rec requires completion of Beginner Rec or an evaluation. If she already has pullovers, cartwheels and handstands, ask us about an evaluation.' },
      adv: { req: 'Placement is by evaluation — completion of the level below or an evaluation is required.', desc: 'Intermediate (90 min) polishes Beginner skills and adds new ones. Advanced (105 min) introduces the skills needed for our Compulsory Team Program, without competition. Team tryouts are held every fall for Advanced Rec students.' }
    };
    var age = null;
    var stepExp = $('#stepExp'), stepFit = $('#stepFit');
    function show(id, key, title) {
      var c = types[id], t = copy[key || id];
      $('#fitName').textContent = title || c.name;
      $('#fitMeta').innerHTML = [c.ages, c.minutes + ' min · once a week', R.money(c.price) + ' per 8-week session'].map(function (m) { return '<span>' + R.esc(m) + '</span>'; }).join('');
      $('#fitDesc').textContent = t.desc; $('#fitReq').textContent = t.req;
      stepFit.classList.add('show');
      stepFit.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    $('#ageChips').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      $$('.chip', finder).forEach(function (c) { c.classList.remove('on'); c.setAttribute('aria-pressed', 'false'); });
      b.classList.add('on'); b.setAttribute('aria-pressed', 'true');
      age = b.getAttribute('data-age');
      stepFit.classList.remove('show');
      if (age === 'rec') { stepExp.classList.add('show'); }
      else { stepExp.classList.remove('show'); show(age); }
    });
    $('#expChips').addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      $$('.chip', stepExp).forEach(function (c) { c.classList.remove('on'); c.setAttribute('aria-pressed', 'false'); });
      b.classList.add('on'); b.setAttribute('aria-pressed', 'true');
      var x = b.getAttribute('data-exp');
      if (x === 'new') show('beg');
      else if (x === 'some') show('beg', 'begEval');
      else show('int', 'adv', 'Intermediate or Advanced Rec');
    });
    $('#finderReset').addEventListener('click', function () {
      $$('.chip', finder).forEach(function (c) { c.classList.remove('on'); c.setAttribute('aria-pressed', 'false'); });
      stepExp.classList.remove('show'); stepFit.classList.remove('show');
      $('#stepAge').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
})();
