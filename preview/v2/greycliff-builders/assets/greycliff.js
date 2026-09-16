/* Greycliff v2 concept — sample data + interactions. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  /* ---------------- deterministic fictional data ---------------- */
  var DATA = {
    project: { no: 24, name: 'The Cahaba Ridge House', current: 'roofing' },
    modes: {
      finished: {
        kicker: 'Finished · street elevation',
        title: 'A long, low house that keeps its back to the ridge',
        body: '<p>The street side is mostly stone and shadow. Deep steel eaves shade a glazed living pavilion, and the entry is a narrow slot between two limestone piers.</p>' +
          '<p>Everything here was chosen to be looked after, not replaced: sawn stone, blackened steel, and white oak kept under cover.</p>' +
          '<dl><div><dt>Faces</dt><dd>South, to the street</dd></div><div><dt>Walls</dt><dd>Sawn limestone; steel-framed glass</dd></div><div><dt>Roofs</dt><dd>Low membrane roofs; copper upper roof</dd></div></dl>',
        cap: 'Fig. 2 — Street elevation. Stock photograph standing in for the finished house.'
      },
      plan: {
        kicker: 'Plan · single level',
        title: 'A row of rooms and a courtyard',
        body: '<p>The plan is a row of bays on a structural grid, numbered 1 to 6. Living spaces open north to a planted courtyard. The study and primary suite sit at the quieter east end.</p>' +
          '<ul class="rooms"><li>Screened porch</li><li>Workshop &amp; garage</li><li>Living pavilion</li><li>Entry gallery</li><li>Kitchen &amp; dining</li><li>Study</li><li>Primary suite &amp; bath</li><li>Courtyard</li></ul>',
        cap: 'Fig. 2P — Ground floor plan. Hand-drawn and indicative; not for construction.'
      },
      materials: {
        kicker: 'Materials · keyed to the photograph',
        title: 'Six materials, numbered',
        body: '<p>Choose a number on the photograph or in the key below. The same list is on the full residence page as a material schedule.</p>',
        cap: 'Fig. 2M — Street elevation with numbered material callouts. Stock photograph.'
      },
      stage: {
        kicker: 'Stage',
        title: '',
        body: '',
        cap: ''
      }
    },
    stages: [
      { id: 'foundation', name: 'Foundation', weeks: 10, state: 'done', stateLabel: 'Complete',
        dates: '12 Jan – 20 Mar 2026', short: 'Jan–Mar',
        img: 'assets/stage-foundation.jpg', tone: 'soft',
        alt: 'Aerial view of poured foundation walls and footings on a cleared site (stock photograph of another project).',
        title: 'Footings stepped to the ridge',
        body: 'The slab steps down eighteen inches at the study, so the east wing sits into the slope instead of on top of it. Footings went in over two pours after the soils engineer walked the cut.',
        hold: 'Soils sign-off; waterproofing checked before backfill',
        next: 'Framing, bay by bay along the grid',
        cap: 'Fig. 3a — Foundation. Illustrative photograph from an unrelated site.' },
      { id: 'framing', name: 'Framing', weeks: 18, state: 'done', stateLabel: 'Complete',
        dates: '23 Mar – 24 Jul 2026', short: 'Mar–Jul',
        img: 'assets/stage-framing.jpg', tone: 'soft',
        alt: 'Overhead view of a house frame with roof trusses being set (stock photograph of another project).',
        title: 'The grid stands up',
        body: 'Walls went up along the structural grid, one bay at a time. A crane set the entry gallery beam in one morning. Every window opening was checked against the steel-frame shop drawings before sheathing.',
        hold: 'Framing inspection; openings measured against shop drawings',
        next: 'Limestone cladding, then roofs',
        cap: 'Fig. 3b — Framing. Illustrative photograph from an unrelated site.' },
      { id: 'roofing', name: 'Roofing', weeks: 8, state: 'now', stateLabel: 'In progress',
        dates: '3 Aug – 25 Sep 2026 (planned end)', short: 'Aug–Sep',
        img: 'assets/stage-roofing.jpg', tone: 'soft',
        alt: 'Timber roof trusses over wall framing against a pale sky (stock photograph of another project).',
        title: 'Drying in before the weather does',
        body: 'The low roofs over the living pavilion and garage are watertight. This week the blackened steel fascia goes up. The standing-seam copper on the upper roof comes next, once the fascia is signed off.',
        hold: 'Fascia miters checked on the ground before lifting',
        next: 'Copper upper roof; then interior trades',
        cap: 'Fig. 3c — Roofing. Illustrative photograph from an unrelated site.' },
      { id: 'finishes', name: 'Finishes', weeks: 36, state: 'planned', stateLabel: 'Planned',
        dates: 'Oct 2026 – Jun 2027 (planned)', short: 'Oct–Jun',
        img: 'assets/study-finished.jpg', tone: 'toned',
        alt: 'The finished street elevation shown in muted tones as the intended result (stock photograph).',
        title: 'Interiors, once the house is dry',
        body: 'Once the house is closed in, the interior trades start in order: plaster, white oak floors, cabinetry, then fixtures. The photograph is muted on purpose. It shows the intended result, not where the house is now.',
        hold: 'Owner walk-through at each finish sample',
        next: 'Punch list and handover',
        cap: 'Fig. 3d — Finishes. The finished-house stock photograph, toned to show it is projected.' }
    ],
    markers: [
      { n: 1, x: 70, y: 62, name: 'Sawn limestone cladding', spec: '4 in. sawn-face veneer, random coursing, lime mortar' },
      { n: 2, x: 30, y: 64, name: 'Blackened steel window walls', spec: 'Thermally broken steel frames, three-panel bays' },
      { n: 3, x: 64, y: 43, name: 'Steel fascia and deep eaves', spec: 'Black steel fascia plate; eaves shade the glass' },
      { n: 4, x: 46, y: 66, name: 'Entry door, white oak soffit', spec: 'Steel pivot door; oak tongue-and-groove soffit beyond' },
      { n: 5, x: 52, y: 85, name: 'Cast concrete entry pavers', spec: 'Large pavers on gravel, dark river-stone joints' },
      { n: 6, x: 12, y: 63, name: 'Lime-plaster garden wall', spec: 'Smooth lime plaster over block, left unpainted' }
    ],
    materials: [
      { id: 'limestone', code: 'M-01', name: 'Sawn limestone', img: 'assets/swatch-limestone.jpg',
        alt: 'Close view of pale sawn limestone coursing with grey mottling.',
        used: 'Street and east walls; entry piers',
        spec: '4 in. sawn-face veneer, random coursing, recessed lime mortar joints',
        finish: 'Left unsealed',
        ages: 'Softens and darkens a little at the base where rain splashes. There is no coating to renew.' },
      { id: 'quarry', code: 'M-02', name: 'Quarry-face limestone', img: 'assets/swatch-quarry.jpg',
        alt: 'Rough, pale grey quarried limestone with a pitted face.',
        used: 'Courtyard retaining walls and garden steps',
        spec: 'Split and pitched blocks, dry-laid on a compacted base',
        finish: 'Natural split face',
        ages: 'Takes moss in the shaded north courtyard, and that is the intent.' },
      { id: 'oak', code: 'M-03', name: 'White oak', img: 'assets/swatch-oak.jpg',
        alt: 'Close view of light white oak with fine straight grain.',
        used: 'Entry soffit, floors, study joinery',
        spec: 'Rift-sawn 7 in. plank floors; tongue-and-groove soffit',
        finish: 'Hardwax oil, matte',
        ages: 'Warms toward honey in sunny rooms. The oil finish gets spot-repaired, not sanded.' },
      { id: 'steel', code: 'M-04', name: 'Blackened steel', img: 'assets/swatch-steel.jpg',
        alt: 'Black steel window grid silhouetted against bright glass.',
        used: 'Window walls, fascia, fireplace surround',
        spec: 'Thermally broken steel frames; hot-rolled fascia plate',
        finish: 'Powder-coated outside; blackened and waxed inside',
        ages: 'Outside, the coating holds its colour. Inside, the wax is renewed every few years.' },
      { id: 'copper', code: 'M-05', name: 'Copper', img: 'assets/swatch-copper.jpg',
        alt: 'Close view of a creased copper sheet with warm highlights.',
        used: 'Upper roof and scuppers (not visible from the street)',
        spec: '16 oz. standing-seam copper, mechanically seamed',
        finish: 'Mill finish, left to weather',
        ages: 'Bright for a season, then brown. A green patina can take many years in this climate.' }
    ]
  };

  /* ---------------- storage (namespaced, fail-safe) ---------------- */
  var PREFIX = 'v2-greycliff-';
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(PREFIX + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) {} },
    clear: function () { try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf(PREFIX) === 0) localStorage.removeItem(k); }); } catch (e) {} }
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rove(buttons, isOn) { var any = false; buttons.forEach(function (b) { var on = isOn(b); b.tabIndex = on ? 0 : -1; if (on) any = true; }); if (!any && buttons[0]) buttons[0].tabIndex = 0; }
  function stageById(id) { for (var i = 0; i < DATA.stages.length; i++) if (DATA.stages[i].id === id) return DATA.stages[i]; return DATA.stages[2]; }

  /* arrow-key roving focus for a set of buttons */
  function roving(buttons, onMove, opts) {
    opts = opts || {};
    buttons.forEach(function (b, i) {
      b.addEventListener('keydown', function (e) {
        var k = e.key, j = null, n = buttons.length;
        if (k === 'ArrowRight' || (opts.vertical && k === 'ArrowDown')) j = (i + 1) % n;
        else if (k === 'ArrowLeft' || (opts.vertical && k === 'ArrowUp')) j = (i - 1 + n) % n;
        else if (k === 'Home') j = 0;
        else if (k === 'End') j = n - 1;
        if (j === null) return;
        e.preventDefault();
        buttons[j].focus();
        if (onMove) onMove(buttons[j], j);
      });
    });
  }

  /* ---------------- residence study ---------------- */
  function initStudy() {
    var panel = $('#study-panel');
    if (!panel) return;
    var tabs = $$('[role="tab"]', $('.seg'));
    var img = $('#f-img'), plan = $('#f-plan'), mk = $('#f-markers'), stamp = $('#f-stamp');
    var cap = $('#f-cap'), kicker = $('#n-kicker'), title = $('#n-title'), body = $('#n-body'), key = $('#n-key');
    var pick = $('#stage-pick'), tl = $('#tl'), strip = $('#tl-strip'), tlStatus = $('#tl-status');

    var state = {
      mode: store.get('study-mode', 'finished'),
      stage: store.get('study-stage', DATA.project.current),
      marker: store.get('study-marker', 1)
    };
    if (!DATA.modes[state.mode]) state.mode = 'finished';

    // build stage selector
    pick.innerHTML = DATA.stages.map(function (s) {
      return '<button type="button" data-stage="' + s.id + '" aria-pressed="false">' + esc(s.name) + '<small>' + esc(s.stateLabel) + '</small></button>';
    }).join('');
    var pickBtns = $$('button', pick);
    pickBtns.forEach(function (b) { b.addEventListener('click', function () { setStage(b.dataset.stage); }); });
    roving(pickBtns, function (b) { setStage(b.dataset.stage); }, { vertical: true });

    // build timeline
    tl.innerHTML = DATA.stages.map(function (s) {
      return '<li style="--w:' + s.weeks + '" data-stage="' + s.id + '" data-state="' + s.state + '">' +
        '<span class="bar" aria-hidden="true"></span>' +
        '<span class="nm">' + esc(s.name) + '</span>' +
        '<span class="dt">' + esc(s.dates) + '</span>' +
        '<span class="st">' + esc(s.stateLabel) + '</span>' +
        '<span class="vw">Viewing</span></li>';
    }).join('');
    strip.innerHTML = DATA.stages.map(function (s) {
      return '<i style="--w:' + s.weeks + '" data-stage="' + s.id + '" data-state="' + s.state + '"></i>';
    }).join('');

    // build markers + key
    mk.innerHTML = DATA.markers.map(function (m) {
      return '<button type="button" class="marker" data-n="' + m.n + '" style="left:' + m.x + '%;top:' + m.y + '%" aria-pressed="false" aria-label="' + m.n + ': ' + esc(m.name) + '">' + m.n + '</button>';
    }).join('');
    key.innerHTML = DATA.markers.map(function (m) {
      return '<li><button type="button" data-n="' + m.n + '" aria-pressed="false"><span class="kn" aria-hidden="true">' + m.n + '</span><span><span class="kt">' + esc(m.name) + '</span><span class="ks">' + esc(m.spec) + '</span></span></button></li>';
    }).join('');
    var markerBtns = $$('.marker', mk), keyBtns = $$('button', key);
    markerBtns.concat(keyBtns).forEach(function (b) { b.addEventListener('click', function () { setMarker(+b.dataset.n); }); });
    roving(markerBtns, function (b) { setMarker(+b.dataset.n); });
    roving(keyBtns, function (b) { setMarker(+b.dataset.n); }, { vertical: true });

    // tabs
    tabs.forEach(function (t) { t.addEventListener('click', function () { setMode(t.dataset.mode); }); });
    roving(tabs, function (t) { setMode(t.dataset.mode); });

    // preload stage images
    DATA.stages.forEach(function (s) { var p = new Image(); p.src = s.img; });

    function swapImage(src, alt, tone) {
      var changed = img.getAttribute('src') !== src;
      img.setAttribute('src', src);
      img.alt = alt;
      img.className = tone || '';
      if (changed) { img.classList.add('fade'); }
    }

    function render(focusTab) {
      var mode = state.mode, m = DATA.modes[mode], s = stageById(state.stage);
      tabs.forEach(function (t) {
        var on = t.dataset.mode === mode;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on) { panel.setAttribute('aria-labelledby', t.id); if (focusTab) t.focus(); }
      });
      panel.dataset.mode = mode;

      plan.hidden = mode !== 'plan';
      img.hidden = mode === 'plan';
      mk.hidden = mode !== 'materials';
      key.hidden = mode !== 'materials';
      pick.hidden = mode !== 'stage';
      stamp.hidden = !(mode === 'stage' && s.id === 'finishes');

      if (mode === 'stage') {
        swapImage(s.img, s.alt, s.tone);
        kicker.textContent = 'Stage · ' + s.name + ' · ' + s.stateLabel;
        title.textContent = s.title;
        body.innerHTML = '<p>' + esc(s.body) + '</p><dl><div><dt>Dates</dt><dd>' + esc(s.dates) + '</dd></div><div><dt>Checks</dt><dd>' + esc(s.hold) + '</dd></div><div><dt>Then</dt><dd>' + esc(s.next) + '</dd></div></dl>';
        cap.textContent = s.cap;
      } else {
        if (mode !== 'plan') swapImage('assets/study-finished.jpg', 'Street elevation of the house: limestone walls, steel-framed glazing and deep black eaves (stock photograph).', '');
        kicker.textContent = m.kicker;
        title.textContent = m.title;
        body.innerHTML = m.body;
        cap.textContent = m.cap;
      }
      pickBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.stage === s.id ? 'true' : 'false'); });
      rove(pickBtns, function (b) { return b.dataset.stage === s.id; });

      // timeline: what is being viewed
      var viewing = mode === 'stage' ? s.id : DATA.project.current;
      $$('li', tl).forEach(function (li) { li.classList.toggle('viewing', li.dataset.stage === viewing); });
      $$('i', strip).forEach(function (i) { i.classList.toggle('viewing', i.dataset.stage === viewing); });
      var cur = stageById(DATA.project.current);
      tlStatus.textContent = mode === 'stage'
        ? 'Viewing: ' + s.name + ' (' + s.stateLabel.toLowerCase() + ') · now in this sample: ' + cur.name
        : 'Now in this sample: ' + cur.name + ', ' + cur.stateLabel.toLowerCase();

      renderMarker();
    }

    function renderMarker() {
      markerBtns.concat(keyBtns).forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.n === state.marker ? 'true' : 'false'); });
      rove(markerBtns, function (b) { return +b.dataset.n === state.marker; });
      rove(keyBtns, function (b) { return +b.dataset.n === state.marker; });
    }

    function setMode(mode) { if (!DATA.modes[mode]) return; state.mode = mode; store.set('study-mode', mode); render(); }
    function setStage(id) { state.stage = id; store.set('study-stage', id); if (state.mode !== 'stage') state.mode = 'stage'; render(); }
    function setMarker(n) { state.marker = n; store.set('study-marker', n); renderMarker(); }

    img.addEventListener('animationend', function () { img.classList.remove('fade'); });

    render();
    window.GreycliffStudyReset = function () {
      state.mode = 'finished'; state.stage = DATA.project.current; state.marker = 1; render();
    };
  }

  /* ---------------- project index ---------------- */
  function initIndex() {
    $$('.prow').forEach(function (row) {
      var btn = $('.phead button', row), bodyEl = $('.pbody', row), tog = $('.ptog', row);
      if (!btn) return;
      function set(open) {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        bodyEl.hidden = !open;
        row.classList.toggle('open', open);
        tog.textContent = open ? '−' : '+';
      }
      btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
      row._set = set;
    });
  }

  /* ---------------- material library ---------------- */
  function initMaterials() {
    var list = $('#swatches');
    if (!list) return;
    var sel = store.get('material', 'limestone');
    list.innerHTML = DATA.materials.map(function (m) {
      return '<li><button type="button" class="sw" data-id="' + m.id + '" aria-pressed="false">' +
        '<span class="img" style="background-image:url(' + m.img + ')" aria-hidden="true"></span>' +
        '<span class="code">' + m.code + '</span><span class="nm">' + esc(m.name) + '</span></button></li>';
    }).join('');
    var btns = $$('.sw', list);
    btns.forEach(function (b) { b.addEventListener('click', function () { select(b.dataset.id, b); }); });
    roving(btns, function (b) { select(b.dataset.id, b); });

    function select(id, btn) {
      var m = DATA.materials.filter(function (x) { return x.id === id; })[0] || DATA.materials[0];
      sel = m.id; store.set('material', m.id);
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === m.id ? 'true' : 'false'); });
      rove(btns, function (b) { return b.dataset.id === m.id; });
      $('#md-img').src = m.img; $('#md-img').alt = m.alt;
      $('#md-cap').textContent = 'Sample ' + m.code + ' — ' + m.name + '. Stock close-up photograph.';
      $('#md-code').textContent = m.code + ' · Material sample';
      $('#md-name').textContent = m.name;
      $('#md-dl').innerHTML =
        '<div><dt>Used at</dt><dd>' + esc(m.used) + '</dd></div>' +
        '<div><dt>Specification</dt><dd>' + esc(m.spec) + '</dd></div>' +
        '<div><dt>Finish</dt><dd>' + esc(m.finish) + '</dd></div>' +
        '<div><dt>How it ages</dt><dd>' + esc(m.ages) + '</dd></div>';
      if (btn && btn.scrollIntoView && list.scrollWidth > list.clientWidth) {
        var l = btn.parentNode.offsetLeft - list.firstElementChild.offsetLeft;
        list.scrollTo({ left: l, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    }
    select(sel);
    window.GreycliffMaterialReset = function () { select('limestone'); };
  }

  /* ---------------- inquiry ---------------- */
  function initInquiry() {
    var form = $('#inq-form');
    if (!form) return;
    var status = $('#inq-status');
    var fields = [
      { el: $('#f-name'), err: $('#e-name'), test: function (v) { return v.trim().length >= 2 ? '' : 'Please add a name (two letters or more).'; } },
      { el: $('#f-email'), err: $('#e-email'), test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter an email address like name@example.com.'; } },
      { el: $('#f-lot'), err: $('#e-lot'), test: function (v) { return v ? '' : 'Please choose a lot status.'; } },
      { el: $('#f-time'), err: $('#e-time'), test: function (v) { return v ? '' : 'Please choose a timeframe.'; } }
    ];
    function showSaved(rec) {
      status.innerHTML = '<div class="confirm"><p><strong>Sample inquiry saved in this browser only — nothing was sent.</strong></p>' +
        '<p>' + esc(rec.name) + ' · ' + esc(rec.lot) + ' · ' + esc(rec.timeframe) + '</p>' +
        '<p class="cap">Saved ' + esc(rec.saved) + '. Use “Reset demo” in the footer to clear it.</p></div>';
    }
    var prior = store.get('inquiry', null);
    if (prior) showSaved(prior);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (f) {
        var msg = f.test(f.el.value);
        f.err.textContent = msg;
        f.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (msg && !firstBad) firstBad = f.el;
      });
      if (firstBad) { status.textContent = ''; firstBad.focus(); return; }
      var d = new Date();
      var rec = { name: fields[0].el.value.trim(), lot: fields[2].el.value, timeframe: fields[3].el.value,
        saved: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) };
      store.set('inquiry', rec);
      form.reset();
      fields.forEach(function (f) { f.el.removeAttribute('aria-invalid'); });
      showSaved(rec);
    });
    window.GreycliffInquiryReset = function () {
      form.reset(); status.innerHTML = '';
      fields.forEach(function (f) { f.err.textContent = ''; f.el.removeAttribute('aria-invalid'); });
    };
  }

  /* ---------------- mobile dock ---------------- */
  function initDock() {
    var dock = $('#dock'), targets = [$('#inquiry'), $('.site-foot')];
    if (!dock || !targets[0] || !('IntersectionObserver' in window)) return;
    var seen = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen.set(en.target, en.isIntersecting); });
      var away = false; seen.forEach(function (v) { if (v) away = true; });
      dock.classList.toggle('away', away);
      dock.querySelector('a').tabIndex = away ? -1 : 0;
      dock.setAttribute('aria-hidden', away ? 'true' : 'false');
    }, { rootMargin: '0px 0px -15% 0px' });
    targets.forEach(function (t) { if (t) io.observe(t); });
  }

  /* ---------------- reset ---------------- */
  function initReset() {
    var btn = $('#reset-demo'), msg = $('#reset-msg');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (window.GreycliffStudyReset) window.GreycliffStudyReset();
      if (window.GreycliffMaterialReset) window.GreycliffMaterialReset();
      if (window.GreycliffInquiryReset) window.GreycliffInquiryReset();
      store.clear();
      $$('.prow').forEach(function (r) { if (r._set) r._set(false); });
      msg.textContent = 'Demo reset. Saved choices and the sample inquiry were cleared from this browser.';
    });
  }

  initStudy();
  initIndex();
  initMaterials();
  initInquiry();
  initDock();
  initReset();
})();
