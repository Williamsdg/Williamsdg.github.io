/* Sword & Crown concept — interactions. Zero dependencies. */
(function () {
  'use strict';
  var d = document, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };

  /* ── header state ─────────────────────────────── */
  var hdr = $('.hdr');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('scrolled', scrollY > 12); };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ── drawer ───────────────────────────────────── */
  var drawer = $('#drawer'), burger = $('.burger');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.hidden = !open;
    burger && burger.setAttribute('aria-expanded', String(open));
    d.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = $('button,a', drawer); f && f.focus(); } else { burger && burger.focus(); }
  }
  burger && burger.addEventListener('click', function () { setDrawer(true); });
  $$('[data-close-drawer]').forEach(function (b) { b.addEventListener('click', function () { setDrawer(false); }); });
  drawer && $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer && !drawer.hidden) setDrawer(false); });

  /* ── reveals + blade rules ────────────────────── */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 }) : null;
  $$('.rv,.blade').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  /* ── hero entrance ────────────────────────────── */
  var hero = $('.hero');
  if (hero) requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('go'); }); });

  /* ── marquee: duplicate the track for a seamless loop ── */
  $$('.mq-track').forEach(function (t) {
    var c = t.firstElementChild.cloneNode(true); c.setAttribute('aria-hidden', 'true'); t.appendChild(c);
  });

  /* ── hair strands (generated SVG, drawn in on scroll) ── */
  $$('svg.strands').forEach(function (svg, si) {
    var W = 400, H = 500, n = +(svg.getAttribute('data-n') || 46), seed = 7 + si * 13, out = '';
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    for (var i = 0; i < n; i++) {
      var x = -40 + i * (W + 80) / n + rnd() * 10, sw = 60 + rnd() * 90, y0 = -20 - rnd() * 40;
      out += '<path d="M' + x.toFixed(1) + ' ' + y0.toFixed(1) +
        ' C' + (x + sw).toFixed(1) + ' ' + (H * .28).toFixed(1) + ',' + (x - sw * .8).toFixed(1) + ' ' + (H * .62).toFixed(1) +
        ',' + (x + sw * .35).toFixed(1) + ' ' + (H + 30).toFixed(1) + '" style="opacity:' + (.18 + rnd() * .5).toFixed(2) + '"/>';
    }
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.innerHTML = out;
    if (reduce) return;
    $$('path', svg).forEach(function (p, k) {
      var L = p.getTotalLength();
      p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
      p.style.transition = 'stroke-dashoffset ' + (2.2 + (k % 7) * .25) + 's cubic-bezier(.2,.7,.1,1) ' + (k * .025) + 's';
    });
    var draw = function () { $$('path', svg).forEach(function (p) { p.style.strokeDashoffset = 0; }); };
    if (io) { var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { draw(); o.disconnect(); } }); o.observe(svg); }
    else draw();
  });

  /* ── wig finder quiz ──────────────────────────── */
  var quiz = $('#finder');
  if (quiz) {
    var steps = [
      { k: 'reason', q: 'What brings you in?', help: 'There’s no wrong answer — this just helps us point you somewhere useful.', opts: [
        ['loss', 'Navigating hair loss', 'Looking for something that feels like me again'],
        ['thin', 'Thinning at my part or crown', 'I want coverage on top, not a full wig'],
        ['look', 'Switching up my look', 'New colour, new length, just for fun'],
        ['explore', 'Just exploring', 'I’m curious and want to learn more']] },
      { k: 'wear', q: 'How do you want to wear it?', help: 'Think about a normal Tuesday, not a special occasion.', opts: [
        ['go', 'Put it on and go', 'Minimal fuss every morning'],
        ['style', 'I like to style it', 'Updos, parting, heat styling'],
        ['unsure', 'Not sure yet', 'Help me figure it out']] },
      { k: 'length', q: 'Which length feels like you?', help: 'You can always go shorter later — longer is harder.', opts: [
        ['chin', 'Chin length', 'Crisp and easy'], ['shoulder', 'Shoulder length', 'The most versatile'],
        ['chest', 'Mid-chest', 'Soft movement'], ['long', 'Long', 'Past the chest']] },
      { k: 'colour', q: 'Which colour family?', help: 'We’ll narrow the exact shade together in person.', swatch: true, opts: [
        ['black', 'Black', '', 'linear-gradient(#0E0C0B,#2A221C)'], ['brown', 'Brown', '', 'linear-gradient(#2A1B12,#7A5236)'],
        ['blonde', 'Blonde', '', 'linear-gradient(#6B5236,#D8B27A)'], ['red', 'Red & copper', '', 'linear-gradient(#3A1E12,#C06A3A)'],
        ['grey', 'Grey & silver', '', 'linear-gradient(#5E5A55,#DAD7D2)']] },
      { k: 'priority', q: 'What matters most to you?', help: 'Pick the one you’d never compromise on.', opts: [
        ['secure', 'Feeling secure', 'Stays put without glue'], ['hairline', 'A natural hairline', 'Nobody looks twice'],
        ['comfort', 'All-day comfort', 'Soft and breathable on top'], ['versatile', 'Styling freedom', 'Ponytails and updos']] }
    ];
    var ans = {}, i = 0;
    var stage = $('.qstage', quiz), bar = $('.qbar i', quiz), stepN = $('.qstep-n', quiz);
    var back = $('.qback', quiz), next = $('.qnext', quiz), nav = $('.qnav', quiz);
    var CAP = {
      glueless: ['Glueless lace front', 'secures with combs and an adjustable band — nothing to glue, nothing to remove'],
      lacefront: ['Lace front', 'puts a sheer lace hairline right where people look'],
      mono: ['Monofilament top', 'hand-tied on top so your part reads like real scalp, and it’s soft to wear all day'],
      '360': ['360 lace', 'has lace all the way around, so you can pull it back into a ponytail'],
      topper: ['Hair topper', 'clips into your own hair to add coverage on top without a full wig']
    };
    var LEN = { chin: 'Chin-length', shoulder: 'Shoulder-length', chest: 'Mid-chest', long: 'Long' };
    var COL = { black: 'Black', brown: 'Brown', blonde: 'Blonde', red: 'Copper', grey: 'Silver' };

    function render() {
      var s = steps[i];
      bar.style.transform = 'scaleX(' + ((i + 1) / (steps.length + 1)) + ')';
      stepN.textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
      back.disabled = i === 0; nav.hidden = false;
      var h = '<fieldset class="qstep"><legend>' + s.q + '</legend><p class="qhelp">' + s.help + '</p><div class="qopts">';
      s.opts.forEach(function (o) {
        h += '<label class="qopt"><input type="radio" name="' + s.k + '" value="' + o[0] + '"' + (ans[s.k] === o[0] ? ' checked' : '') + '><span>' +
          (s.swatch ? '<i class="sw" style="background:' + o[3] + '"></i>' : '') + '<b>' + o[1] + '</b>' + (o[2] ? '<small>' + o[2] + '</small>' : '') + '</span></label>';
      });
      stage.innerHTML = h + '</div></fieldset>';
      next.disabled = !ans[s.k];
      next.firstChild.nodeValue = i === steps.length - 1 ? 'See my starting point ' : 'Continue ';
      $$('input', stage).forEach(function (inp) {
        inp.addEventListener('change', function () {
          ans[s.k] = inp.value; next.disabled = false;
          if (!reduce) setTimeout(function () { if (steps[i] === s) go(1); }, 320);
        });
      });
    }
    function capFor() {
      if (ans.reason === 'thin') return 'topper';
      if (ans.priority === 'versatile' || (ans.wear === 'style' && ans.priority !== 'comfort')) return '360';
      if (ans.priority === 'comfort') return 'mono';
      if (ans.priority === 'hairline') return 'lacefront';
      return 'glueless';
    }
    function result() {
      bar.style.transform = 'scaleX(1)'; stepN.textContent = 'Your starting point'; nav.hidden = true;
      var c = CAP[capFor()], sensitive = ans.reason === 'loss' || ans.reason === 'thin';
      var piece = (LEN[ans.length] || '') + ' · ' + (COL[ans.colour] || '');
      var consult = '<div class="consult"><b>Private consultation</b><small>Sit down with us, try pieces on, and leave with a plan. No pressure to buy.</small></div>';
      var card = function (n) { return '<div><div class="plate" aria-hidden="true"><div class="frame"></div></div><b>' + c[0] + '</b><small>' + piece + ' · sample ' + n + '</small></div>'; };
      stage.innerHTML = '<div class="qres qstep"><span class="eyebrow">Based on your answers</span>' +
        '<h3>Start with a <em>' + c[0].toLowerCase() + '</em>.</h3>' +
        '<p>' + (sensitive
          ? 'We’d love to meet you privately first — the right fit matters more than any product page. Here’s where we’d begin.'
          : 'Here’s where we’d begin. Bring these to a consultation, or browse the shop.') + '</p>' +
        '<div class="why">Why: a ' + c[0].toLowerCase() + ' ' + c[1] + '.</div>' +
        '<div class="qpick">' + (sensitive ? consult + card(1) + card(2) : card(1) + card(2) + consult) + '</div>' +
        '<div class="hero-cta"><a class="btn" href="#consult">Book a private consultation <span class="arr">→</span></a>' +
        '<button class="btn ghost" type="button" data-restart>Start again</button></div></div>';
      $('[data-restart]', stage).addEventListener('click', function () { ans = {}; i = 0; render(); });
    }
    function go(dir) {
      if (dir > 0 && !ans[steps[i].k]) return;
      i += dir;
      if (i >= steps.length) { i = steps.length - 1; result(); return; }
      if (i < 0) i = 0;
      render();
      var fs = $('legend', stage); fs && fs.setAttribute('tabindex', '-1');
    }
    next.addEventListener('click', function () { go(1); });
    back.addEventListener('click', function () { go(-1); });
    render();
  }

  /* ── cap construction explorer ────────────────── */
  var caps = $('#caps');
  if (caps) {
    var Y = 'yes', P = 'part', N = 'no';
    var CAPS = {
      lacefront: { t: 'Lace front', z: ['hairline'],
        p: 'A sheer lace panel runs along the front hairline, and the rest of the cap is built from wefts. The most popular way to get a soft, natural-looking hairline.',
        f: [['Natural hairline', 'Yes', Y], ['Part anywhere', 'Front only', P], ['High ponytail', 'No', N], ['Coverage', 'Full wig', Y]] },
      glueless: { t: 'Glueless', z: ['hairline', 'nape'],
        p: 'Built to stay secure without adhesive — usually with combs and an adjustable band at the nape. A popular first wig: nothing to glue, nothing to remove.',
        f: [['Natural hairline', 'Usually', Y], ['No adhesive', 'Designed for it', Y], ['Beginner-friendly', 'Yes', Y], ['Coverage', 'Full wig', Y]] },
      '360': { t: '360 lace', z: ['perimeter'],
        p: 'Lace runs around the entire perimeter, not just the front, so the hair can be pulled back into a ponytail or high bun without showing the cap.',
        f: [['Natural hairline', 'All the way round', Y], ['High ponytail', 'Yes', Y], ['Part anywhere', 'Around the edges', P], ['Coverage', 'Full wig', Y]] },
      mono: { t: 'Monofilament top', z: ['part', 'crown'],
        p: 'A fine mesh on top where each hair is individually tied, so the part and crown look like scalp and can be brushed in any direction.',
        f: [['Part anywhere', 'On top', Y], ['Natural hairline', 'If lace front too', P], ['Feel on top', 'Soft, breathable', Y], ['Coverage', 'Full wig', Y]] },
      fulllace: { t: 'Full lace', z: ['full'],
        p: 'The whole cap is lace with hand-tied hair. Part it anywhere and wear it up — the most versatile construction, and the most delicate to care for.',
        f: [['Part anywhere', 'Yes', Y], ['High ponytail', 'Yes', Y], ['Beginner-friendly', 'Least', N], ['Coverage', 'Full wig', Y]] },
      topper: { t: 'Topper', z: ['top'],
        p: 'A partial piece that clips into your own hair to add coverage and volume on top — for thinning at the part or crown rather than full coverage.',
        f: [['Blends with your hair', 'Yes', Y], ['Coverage', 'Top & crown', P], ['Attaches with', 'Clips', Y], ['Full wig', 'No', N]] }
    };
    var ZL = { hairline: ['hairline'], nape: ['nape'], perimeter: ['hairline', 'nape', 'sides'], part: ['part'], crown: ['crown'], top: ['part', 'crown'], full: ['hairline', 'part', 'crown', 'nape', 'sides'] };
    var panel = $('.cap-panel', caps), tabs = $$('.cap-tab', caps);
    function show(key, focus) {
      var c = CAPS[key];
      tabs.forEach(function (t) { var on = t.dataset.cap === key; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
      $$('.zone,.zone-edge', caps).forEach(function (z) { z.classList.toggle('on', c.z.indexOf(z.dataset.z) > -1); });
      var lit = []; c.z.forEach(function (z) { lit = lit.concat(ZL[z] || []); });
      $$('.zlabel', caps).forEach(function (l) { l.classList.toggle('on', lit.indexOf(l.dataset.l) > -1); });
      panel.innerHTML = '<h3>' + c.t + '</h3><p>' + c.p + '</p><ul class="cap-facts">' +
        c.f.map(function (r) { return '<li><span>' + r[0] + '</span><b class="' + r[2] + '">' + r[1] + '</b></li>'; }).join('') + '</ul>';
      if (!reduce) panel.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.7,.1,1)' });
    }
    tabs.forEach(function (t, n) {
      t.addEventListener('click', function () { show(t.dataset.cap); });
      t.addEventListener('keydown', function (e) {
        var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (k) { e.preventDefault(); show(tabs[(n + k + tabs.length) % tabs.length].dataset.cap, true); }
      });
    });
    show('glueless');
  }

  /* ── colour studio ────────────────────────────── */
  var studio = $('#studio');
  if (studio) {
    var FAM = {
      Black: [['Jet', '#0E0C0B', '#1A1614', '#2A231E'], ['Off-black', '#141009', '#2A221C', '#3E3128'], ['Soft black', '#1A140F', '#33281F', '#4E3D2E']],
      Brown: [['Espresso', '#150E09', '#3A281C', '#56402F'], ['Chestnut', '#1E130C', '#5A3A24', '#82593A'], ['Mocha', '#241B14', '#5E4838', '#8F735B']],
      Blonde: [['Honey', '#3A2A1C', '#B08650', '#DDB982'], ['Champagne', '#4A3A2A', '#CDB38E', '#EAD8B6'], ['Ash', '#40392F', '#B7AA95', '#DCD1BD']],
      Red: [['Copper', '#2E170D', '#9A4A26', '#C8743F'], ['Auburn', '#23100A', '#6E2E1C', '#94492C']],
      'Grey & silver': [['Silver', '#5E5954', '#B8B4AE', '#DEDBD6'], ['Salt & pepper', '#2E2B28', '#7E7872', '#BAB4AD']]
    };
    var fam = 'Brown', shade = 0, rooted = true;
    var famWrap = $('.fam', studio), shadeWrap = $('.shades', studio), sw = $('.switch', studio);
    var stops = $$('#lockg stop'), nameB = $('.swatch-name b', studio), nameS = $('.swatch-name span', studio);
    famWrap.innerHTML = Object.keys(FAM).map(function (f) { return '<button type="button" aria-pressed="' + (f === fam) + '">' + f + '</button>'; }).join('');
    function paint() {
      var s = FAM[fam][shade];
      stops[0].setAttribute('stop-color', rooted ? s[1] : s[2]);
      stops[1].setAttribute('stop-color', rooted ? s[1] : s[2]);
      stops[2].setAttribute('stop-color', s[2]);
      stops[3].setAttribute('stop-color', s[3]);
      stops[1].setAttribute('offset', rooted ? '.2' : '0');
      nameB.textContent = s[0];
      nameS.textContent = fam + (rooted ? ' · rooted' : ' · solid') + ' · sample shade';
      $$('.shade', shadeWrap).forEach(function (b, n) { b.setAttribute('aria-checked', String(n === shade)); b.tabIndex = n === shade ? 0 : -1; });
    }
    function shades() {
      shadeWrap.innerHTML = FAM[fam].map(function (s, n) {
        return '<button type="button" class="shade" role="radio" aria-label="' + s[0] + '" style="background:linear-gradient(135deg,' + s[1] + ' 0%,' + s[2] + ' 55%,' + s[3] + ' 100%)"></button>';
      }).join('');
      $$('.shade', shadeWrap).forEach(function (b, n) { b.addEventListener('click', function () { shade = n; paint(); }); });
      paint();
    }
    $$('button', famWrap).forEach(function (b) {
      b.addEventListener('click', function () {
        fam = b.textContent; shade = 0;
        $$('button', famWrap).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        shades();
      });
    });
    sw.addEventListener('click', function () { rooted = !rooted; sw.setAttribute('aria-checked', String(rooted)); paint(); });
    shades();
  }


  /* ── before / after: one slider per card; brow card is drawn ── */
  $$('.ba-card').forEach(function (card) {
    var st = $('.ba-stage', card), rg = $('.ba-range', card);
    if (!st || !rg) return;
    var set = function () { st.style.setProperty('--pos', rg.value + '%'); };
    rg.addEventListener('input', set); set();
  });
  var ba = $('#ba');
  if (ba && $('.ba-before .hairs', ba)) {
    function brow(g, density, soft) {
      var seed = 3, out = '';
      function r() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
      for (var k = 0; k < density; k++) {
        var t = k / (density - 1), x = 120 + t * 360;
        var yb = 250 - Math.sin(Math.min(t * 1.35, 1) * Math.PI * .62) * 70 + (t > .74 ? (t - .74) * 180 : 0);
        var thick = (1 - Math.abs(t - .38) * 1.25), ang = -1.05 + t * 1.0 + (r() - .5) * .25;
        var len = 26 + thick * 22 + r() * 8, x2 = x + Math.cos(ang) * len, y2 = yb + Math.sin(ang) * len + 22;
        out += '<path d="M' + x.toFixed(1) + ' ' + (yb + 22).toFixed(1) + ' Q' + ((x + x2) / 2 + 6).toFixed(1) + ' ' + ((yb + y2) / 2).toFixed(1) +
          ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" stroke-width="' + (1.3 + thick * .9).toFixed(2) + '" opacity="' + (soft ? (.38 + r() * .25) : (.75 + r() * .25)).toFixed(2) + '"/>';
      }
      g.innerHTML = '<g fill="none" stroke="#3A2A1E" stroke-linecap="round"' + (soft ? ' filter="url(#soften)"' : '') + '>' + out + '</g>';
    }
    var bBefore = $('.ba-before .hairs', ba), bAfter = $('.ba-after .hairs', ba);
    brow(bBefore, 42, true);
    var bcard = bBefore.closest('.ba-card'), modes = $$('.ba-mode button', bcard), afterTag = $('.ba-tag.r', bcard);
    function mode(m) {
      modes.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.m === m)); });
      brow(bAfter, 120, m === 'healed');
      afterTag.textContent = m === 'healed' ? 'Healed' : 'Fresh';
    }
    modes.forEach(function (b) { b.addEventListener('click', function () { mode(b.dataset.m); }); });
    mode('fresh');
  }

  /* ── announcement bar: rotate + arrows ────────── */
  var ann = $('.announce');
  if (ann) {
    var msgs = $$('.announce-msg', ann), ai = 0, timer;
    var show = function (n) { ai = (n + msgs.length) % msgs.length; msgs.forEach(function (m, k) { m.classList.toggle('on', k === ai); }); };
    var auto = function () { clearInterval(timer); if (!reduce) timer = setInterval(function () { show(ai + 1); }, 5000); };
    $$('[data-ann]', ann).forEach(function (b) { b.addEventListener('click', function () { show(ai + (+b.dataset.ann)); auto(); }); });
    ann.addEventListener('mouseenter', function () { clearInterval(timer); });
    ann.addEventListener('mouseleave', auto);
    auto();
  }

  /* ── three steps: expanding cards ─────────────── */
  $$('.steps3').forEach(function (wrap) {
    var steps = $$('.step', wrap);
    steps.forEach(function (st) {
      var btn = $('.step-hd', st);
      var open = function () {
        steps.forEach(function (o) { var on = o === st; o.classList.toggle('open', on); $('.step-hd', o).setAttribute('aria-expanded', String(on)); });
      };
      btn.addEventListener('click', open);
      if (matchMedia('(hover:hover)').matches) st.addEventListener('mouseenter', open);
    });
  });

  /* ── shop filter ──────────────────────────────── */
  var shopTabs = $$('[data-shop]');
  if (shopTabs.length) {
    shopTabs.forEach(function (b) {
      b.addEventListener('click', function () {
        var cat = b.dataset.shop;
        shopTabs.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        $$('.pcard').forEach(function (c) {
          var on = cat === 'all' || c.dataset.cat === cat; c.hidden = !on;
          if (on && !reduce) c.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.7,.1,1)' });
        });
      });
    });
  }

  /* ── learn tabs (Wig Bible / Journal) ─────────── */
  var ltabs = $$('.learn-tabs [role="tab"]');
  ltabs.forEach(function (t, n) {
    var sel = function (focus) {
      ltabs.forEach(function (x) {
        var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        var panel = d.getElementById(x.getAttribute('aria-controls')); if (panel) panel.hidden = !on;
      });
      if (focus) t.focus();
    };
    t.addEventListener('click', function () { sel(); });
    t.addEventListener('keydown', function (e) {
      var k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); var nx = ltabs[(n + k + ltabs.length) % ltabs.length]; nx.click(); nx.focus(); }
    });
  });

  /* ── concept note: dismissible ────────────────── */
  var pill = $('.concept-pill');
  if (pill) {
    try { if (sessionStorage.getItem('sc-note') === 'x') pill.hidden = true; } catch (e) {}
    $('button', pill).addEventListener('click', function () { pill.hidden = true; try { sessionStorage.setItem('sc-note', 'x'); } catch (e) {} });
  }

  /* ── glossary popovers ────────────────────────── */
  var GLOSS = {
    'lace-front': ['Lace front', 'Cap construction', 'A sheer lace panel along the front hairline, knotted by hand, so the hair appears to grow straight from the scalp.'],
    'monofilament': ['Monofilament', 'Cap construction', 'A fine mesh top where each hair is tied individually. The part looks like scalp and can be brushed any direction.'],
    'density': ['Density', 'Fit & fullness', 'How much hair is on the cap, shown as a percentage. Lower density tends to look more natural, especially in a first wig.'],
    'glueless': ['Glueless', 'Cap construction', 'A wig designed to stay secure with combs, straps or an adjustable band instead of adhesive.'],
    'topper': ['Topper', 'Hair pieces', 'A partial piece that clips into your own hair to add coverage on top, rather than replacing all of it.'],
    'cap-size': ['Cap size', 'Fit & fullness', 'Based on the measurement around your head. The right size is the biggest single factor in comfort and security.'],
    'wefts': ['Wefts', 'Cap construction', 'Strips of hair sewn onto the cap in rows. Fast to make and airy to wear, but they can\u2019t be parted in any direction.'],
    'hand-tied': ['Hand-tied', 'Cap construction', 'Hairs knotted into the cap one at a time by hand, so they move freely and can be parted and brushed any way.'],
    '360-lace': ['360 lace', 'Cap construction', 'Lace around the entire perimeter of the cap, so the hair can be pulled back into a ponytail.'],
    'full-lace': ['Full lace', 'Cap construction', 'A cap made entirely of lace with hand-tied hair \u2014 part it anywhere and wear it up.'],
    'wig-grip': ['Wig grip', 'Wearing', 'A soft band worn under a wig for comfort and to help it stay in place.']
  };
  var openPop = null;
  function closePop() { if (openPop) { openPop.btn.setAttribute('aria-expanded', 'false'); openPop.el.remove(); openPop = null; } }
  $$('.term').forEach(function (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var same = openPop && openPop.btn === btn; closePop(); if (same) return;
      var g = GLOSS[btn.dataset.term]; if (!g) return;
      var host = btn.closest('.gloss-card') || d.body, el = d.createElement('div');
      el.className = 'pop'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', g[0]);
      el.innerHTML = '<span class="pk">' + g[1] + '</span><b>' + g[0] + '</b>' + g[2] + '<br><a href="wig-bible.html#glossary">Full glossary →</a>';
      host.appendChild(el);
      var hb = host.getBoundingClientRect(), bb = btn.getBoundingClientRect();
      var left = Math.max(10, Math.min(bb.left - hb.left, hb.width - el.offsetWidth - 10));
      el.style.left = left + 'px'; el.style.top = (bb.bottom - hb.top + 10) + 'px';
      btn.setAttribute('aria-expanded', 'true'); openPop = { btn: btn, el: el };
    });
  });
  d.addEventListener('click', function (e) { if (openPop && !openPop.el.contains(e.target)) closePop(); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openPop) { var b = openPop.btn; closePop(); b.focus(); } });

  /* ── opening-soon list (concept: stores nothing) ── */
  $$('.list-form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = f.parentNode.querySelector('.list-ok');
      f.hidden = true; if (ok) { ok.hidden = false; ok.focus(); }
    });
  });

  /* ── mobile bar hides while typing ────────────── */
  var mbar = $('.mbar');
  if (mbar) {
    d.addEventListener('focusin', function (e) { if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) mbar.classList.add('hide'); });
    d.addEventListener('focusout', function () { mbar.classList.remove('hide'); });
  }


  /* ── Wig Bible: glossary filter + hub search ─── */
  var gsearch = $('#hub-search');
  if (gsearch) {
    var entries = $$('[data-search]'), letters = $$('.gl-letter'), hits = $('.hits'), empty = $('.gl-empty');
    entries.forEach(function (el) { el._t = el.getAttribute('data-search').toLowerCase(); });
    function run(q) {
      q = q.trim().toLowerCase(); var n = 0;
      entries.forEach(function (el) { var on = !q || el._t.indexOf(q) > -1; el.hidden = !on; if (on && q) n++; });
      letters.forEach(function (L) {
        var any = false, sib = L.nextElementSibling;
        while (sib && !sib.classList.contains('gl-letter')) { if (sib.matches('[data-search]') && !sib.hidden) any = true; sib = sib.nextElementSibling; }
        L.hidden = !any;
      });
      if (empty) empty.hidden = !q || n > 0;
      hits.textContent = q ? (n ? n + ' match' + (n === 1 ? '' : 'es') + ' for “' + q + '”' : 'Nothing yet for “' + q + '” — ask us instead') : '';
    }
    gsearch.addEventListener('input', function () { run(gsearch.value); });
    $$('.try button').forEach(function (b) {
      b.addEventListener('click', function () { gsearch.value = b.textContent; run(b.textContent); gsearch.focus(); });
    });
  }

  /* ── article: reading progress + table-of-contents spy ── */
  var prog = $('.progress');
  if (prog) {
    var body = $('.prose');
    var upd = function () {
      var r = body.getBoundingClientRect(), total = r.height - innerHeight * .6;
      var v = Math.min(1, Math.max(0, -r.top / (total > 0 ? total : 1)));
      prog.style.transform = 'scaleX(' + v + ')';
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
    var tocLinks = $$('.toc a');
    if ('IntersectionObserver' in window && tocLinks.length) {
      var spy = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          tocLinks.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)); });
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      $$('.prose h2[id]').forEach(function (h) { spy.observe(h); });
    }
  }
  $$('.helpful').forEach(function (h) {
    $$('button', h).forEach(function (b) {
      b.addEventListener('click', function () { h.innerHTML = '<span>Thank you.</span> Still have a question? <a class="textlink" href="index.html#consult">Ask us privately →</a>'; });
    });
  });

  /* ── Journal: category chips ──────────────────── */
  var chips = $('.chips');
  if (chips) {
    var cards = $$('.jr-card'), count = $('.jr-count');
    $$('button', chips).forEach(function (b) {
      b.addEventListener('click', function () {
        var cat = b.dataset.cat, n = 0;
        $$('button', chips).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        cards.forEach(function (c) { var on = cat === 'all' || c.dataset.cat === cat; c.hidden = !on; if (on) n++; });
        if (count) count.textContent = 'Showing ' + n + ' post' + (n === 1 ? '' : 's');
      });
    });
  }

  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
