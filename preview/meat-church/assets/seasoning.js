/* ==========================================================================
   Meat Church — seasoning engine
   The opening: a shaker pours from the top of the screen and the falling
   granules settle into the wordmark, then fall away to reveal the site.
   ========================================================================== */
(function () {
  'use strict';
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ground-spice palette — weighted so it reads as seasoning, not confetti.
     Mostly salt and paprika, a little gold, a little cracked pepper. */
  var SPICE = [
    '#EFE6D5','#EFE6D5','#E4D6BE','#D9C8AC',          /* salt / coarse grain */
    '#C4451F','#B9331B','#A8331A','#C0522B',          /* paprika / chili */
    '#E8A33D','#D08B33',                              /* Texas Sugar gold */
    '#8A5A2B','#6E4E2E',                              /* cumin / brown sugar */
    '#5A5044'                                         /* cracked pepper */
  ];
  function spice() { return SPICE[(Math.random() * SPICE.length) | 0]; }

  function dpr() { return Math.min(window.devicePixelRatio || 1, 2); }

  function fit(cv) {
    var r = dpr(), w = cv.clientWidth, h = cv.clientHeight;
    cv.width = Math.max(1, w * r); cv.height = Math.max(1, h * r);
    var c = cv.getContext('2d'); c.setTransform(r, 0, 0, r, 0, 0);
    return c;
  }

  /* ---- sample a stacked wordmark into target points -------------------- */
  function wordmarkPoints(w, h, lines, budget) {
    /* sample at half resolution — same shape, a quarter of the pixels to walk */
    var SS = 0.5, sw = Math.round(w * SS), sh = Math.round(h * SS);
    var off = document.createElement('canvas');
    off.width = sw; off.height = sh;
    var c = off.getContext('2d', { willReadFrequently: true });

    var maxW = sw * (w < 700 ? 0.90 : 0.74);
    var fam = '800 SIZEpx "Big Shoulders Display", "Barlow Condensed", Impact, sans-serif';
    var size = 20;
    for (var t = 20; t < 300; t += 2) {
      c.font = fam.replace('SIZE', t);
      var wide = 0;
      for (var i = 0; i < lines.length; i++) wide = Math.max(wide, c.measureText(lines[i]).width);
      if (wide > maxW) break;
      size = t;
    }
    var lh = size * 0.82, blockH = lh * lines.length;
    if (blockH > sh * 0.60) { size *= (sh * 0.60) / blockH; lh = size * 0.82; blockH = lh * lines.length; }

    c.font = fam.replace('SIZE', size);
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle';
    var top = (sh - blockH) / 2 + lh / 2;
    for (var j = 0; j < lines.length; j++) c.fillText(lines[j], sw / 2, top + j * lh);

    /* one pass, stride 1 at half-res == stride 2 at full res */
    var data = c.getImageData(0, 0, sw, sh).data, all = [];
    for (var y = 0; y < sh; y++) {
      for (var x = 0; x < sw; x++) {
        if (data[(y * sw + x) * 4 + 3] > 120) all.push(x, y);
      }
    }
    var count = all.length / 2;
    if (!count) return { pts: [], grain: 1.6 };

    /* thin to the budget by random selection — keeps coverage even but irregular */
    var keep = Math.min(budget, count), step = count / keep, pts = [];
    for (var k = 0; k < keep; k++) {
      var idx = Math.floor(k * step + Math.random() * step);
      if (idx >= count) idx = count - 1;
      pts.push([ all[idx * 2] / SS + (Math.random() - .5) * 1.8,
                 all[idx * 2 + 1] / SS + (Math.random() - .5) * 1.8 ]);
    }
    /* grain scales a touch with how sparse the dusting is */
    var grain = Math.max(1.0, Math.min(2.4, Math.sqrt(count / keep) * 1.15));
    return { pts: pts, grain: grain, size: size / SS };
  }

  /* ---- the intro ------------------------------------------------------- */
  function intro(opts) {
    opts = opts || {};
    var host = document.getElementById('mc-intro');
    if (!host) return;
    var finished = false, safety = 0, raf = 0;
    var done = function () {
      if (host._mcDone) return;
      host._mcDone = true;
      clearTimeout(safety);
      if (raf) cancelAnimationFrame(raf);
      host.classList.add('gone');
      document.documentElement.classList.remove('mc-locked');
      document.body.classList.add('mc-revealed');
      setTimeout(function () { if (host.parentNode) host.parentNode.removeChild(host); }, 900);
    };

    /* Hard wall-clock stop. requestAnimationFrame is throttled in background
       tabs and offscreen frames, so the simulation alone can never be what
       decides whether a visitor gets to the site. */
    safety = setTimeout(function () { finished = true; done(); }, 5500);

    if (RM || opts.skip) { host.parentNode && host.parentNode.removeChild(host); document.body.classList.add('mc-revealed'); return; }

    document.documentElement.classList.add('mc-locked');

    /* the wordmark is sampled from rendered text — wait for the real face,
       otherwise we'd stencil Impact and the letterforms would be wrong */
    if (document.fonts && document.fonts.load && !opts._fontsReady) {
      var gate = Promise.all([
        document.fonts.load('800 160px "Big Shoulders Display"'),
        document.fonts.ready
      ]);
      var bail = new Promise(function (r) { setTimeout(r, 1200); });
      Promise.race([gate, bail]).then(function () {
        opts._fontsReady = true; intro(opts);
      });
      return;
    }

    var cv = host.querySelector('canvas'), ctx = fit(cv);
    var W = cv.clientWidth, H = cv.clientHeight;
    var budget = W < 700 ? 4200 : 9000;
    var sample = wordmarkPoints(W, H, ['MEAT', 'CHURCH'], budget);
    var pts = sample.pts;
    if (!pts.length) { document.documentElement.classList.remove('mc-locked'); done(); return; }

    /* settlers — granules that fall into the wordmark */
    var P = [], i, n = pts.length;
    for (i = 0; i < n; i++) {
      var tx = pts[i][0], ty = pts[i][1];
      P.push({
        tx: tx, ty: ty,
        x: tx + (Math.random() - .5) * 90,
        y: ty - (520 + Math.random() * 760),
        vy: 0, vx: 0,
        sz: sample.grain * (0.62 + Math.random() * 0.78),
        col: spice(),
        delay: (ty / H) * 420 + Math.random() * 420,
        sway: Math.random() * 6.283, swayAmp: 6 + Math.random() * 16,
        set: false, a: 0
      });
    }

    /* strays — the rest of the pour, falling past and off the screen */
    var S = [];
    function stray() {
      return { x: Math.random() * W, y: -20 - Math.random() * H,
               vy: 2.4 + Math.random() * 5.2, sz: .6 + Math.random() * 1.5,
               col: spice(), sway: Math.random() * 6.283,
               swayAmp: 4 + Math.random() * 14, a: .25 + Math.random() * .5 };
    }
    for (i = 0; i < (W < 700 ? 200 : 420); i++) S.push(stray());

    /* Fixed-timestep simulation. The physics is per-step, so the timeline has
       to be per-step too — driving it off wall-clock made the pour run at
       double speed on a 120Hz panel and stall out when a frame ran long. */
    var STEP = 1000 / 60, POUR_END = 1850, HOLD = 900, LET_GO = 820;
    var simT = 0, acc = 0, last = performance.now();
    var startWall = last, wallT = 0;
    var formedAt = -1, releasedAt = -1;

    function sim() {
      simT += STEP;

      for (var i = 0; i < S.length; i++) {          /* the pour passing by */
        var s = S[i];
        s.y += s.vy; s.sway += .035;
        if (s.y > H + 20) S[i] = stray();
      }

      var allSet = true;
      for (i = 0; i < P.length; i++) {
        var p = P[i];
        if (simT < p.delay) { allSet = false; continue; }

        if (!p.set) {
          p.a = Math.min(1, p.a + .085);
          p.vy += .62; p.y += p.vy; p.sway += .06;
          p.x = p.tx + Math.sin(p.sway) * p.swayAmp * Math.max(0, (p.ty - p.y) / 420);
          if (p.y >= p.ty) { p.y = p.ty; p.x = p.tx; p.set = true; p.jit = 2.2; }
          else allSet = false;
        } else if (releasedAt >= 0) {
          p.vy += .78; p.y += p.vy; p.x += p.vx;
          p.a = Math.max(0, p.a - .012);
        } else if (p.jit > .02) {
          p.jit *= .86;
        }
      }

      /* Phases follow the simulation, but never lag the clock by more than a
         beat — on a slow device the motion gets chunkier rather than stalling. */
      var T = Math.max(simT, wallT - 700);

      if (formedAt < 0 && (allSet || T > POUR_END)) {
        formedAt = T;
        host.classList.add('formed');
        host.dataset.formed = '1';
      }
      if (formedAt >= 0 && releasedAt < 0 && T >= formedAt + HOLD) {
        releasedAt = T;
        host.classList.add('releasing');
        for (var k = 0; k < P.length; k++) {
          P[k].vy = -1.4 - Math.random() * 2.6;
          P[k].vx = (Math.random() - .5) * 2.4;
        }
        setTimeout(function () { if (!finished) { finished = true; done(); } }, LET_GO);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var strayA = releasedAt >= 0 ? Math.max(0, 1 - (simT - releasedAt) / 700) : 1;
      if (strayA > 0) {
        for (var i = 0; i < S.length; i++) {
          var s = S[i];
          ctx.globalAlpha = s.a * strayA;
          ctx.fillStyle = s.col;
          ctx.fillRect(s.x + Math.sin(s.sway) * s.swayAmp * .25, s.y, s.sz, s.sz * 1.5);
        }
      }
      for (i = 0; i < P.length; i++) {
        var p = P[i];
        if (p.a <= 0) continue;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.col;
        var j = p.jit || 0;
        ctx.fillRect(p.x + (j ? (Math.random() - .5) * j : 0),
                     p.y + (j ? (Math.random() - .5) * j : 0), p.sz, p.sz);
      }
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      wallT = now - startWall;
      acc += Math.min(now - last, 120);   /* clamp so a stall doesn't fast-forward */
      last = now;
      var guard = 0;
      while (acc >= STEP && guard++ < 8) { sim(); acc -= STEP; }
      draw();
      if (releasedAt >= 0 && simT - releasedAt > 1500) { cancelAnimationFrame(raf); return; }
      raf = requestAnimationFrame(frame);
    }

    /* deterministic render at an exact simulated time — used to verify frames */
    if (opts.freezeAt) {          /* debug: render one exact simulated frame */
      clearTimeout(safety);
      while (simT < opts.freezeAt) sim();
      draw();
      return;
    }

    last = performance.now();
    raf = requestAnimationFrame(frame);

    /* let people out */
    function skip() {
      if (finished) return; finished = true;
      cancelAnimationFrame(raf); done();
    }
    host._mcSkip = skip;
    host.querySelector('.mc-skip') && host.querySelector('.mc-skip').addEventListener('click', skip);
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') skip(); });
    window.addEventListener('wheel', function () { if (host.dataset.formed) skip(); }, { passive: true, once: true });
  }

  /* ---- ambient drift: a light dusting behind the hero ------------------ */
  function ambient(cv, density) {
    if (!cv || RM) return;
    var ctx = fit(cv), W = cv.clientWidth, H = cv.clientHeight, A = [];
    var N = Math.round((density || 1) * (W < 700 ? 34 : 90));
    function mk(seed) {
      return { x: Math.random() * W, y: seed ? Math.random() * H : -10,
               vy: .28 + Math.random() * .95, sz: .6 + Math.random() * 1.7,
               col: spice(), a: .1 + Math.random() * .34,
               sway: Math.random() * 6.283, amp: 6 + Math.random() * 20 };
    }
    for (var i = 0; i < N; i++) A.push(mk(true));
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < A.length; i++) {
        var p = A[i]; p.y += p.vy; p.sway += .012;
        if (p.y > H + 8) A[i] = mk(false);
        ctx.globalAlpha = p.a; ctx.fillStyle = p.col;
        ctx.fillRect(p.x + Math.sin(p.sway) * p.amp, p.y, p.sz, p.sz * 1.4);
      }
      requestAnimationFrame(loop);
    })();
    window.addEventListener('resize', function () { ctx = fit(cv); W = cv.clientWidth; H = cv.clientHeight; });
  }

  /* ---- a shake of seasoning over any element --------------------------- */
  function burst(el) {
    if (RM || !el || el._mcBurst) return;
    el._mcBurst = true;
    var cv = document.createElement('canvas');
    cv.className = 'mc-burst';
    el.appendChild(cv);
    var ctx = fit(cv), W = cv.clientWidth, H = cv.clientHeight, A = [], on = false;
    el.addEventListener('mouseenter', function () {
      if (on) return; on = true;
      ctx = fit(cv); W = cv.clientWidth; H = cv.clientHeight;
      A = [];
      for (var i = 0; i < 90; i++) {
        A.push({ x: W * (.2 + Math.random() * .6), y: -8 - Math.random() * 40,
                 vy: 1 + Math.random() * 3.4, sz: .8 + Math.random() * 1.8,
                 col: spice(), a: .5 + Math.random() * .5,
                 sway: Math.random() * 6.283, amp: 3 + Math.random() * 11 });
      }
      (function loop() {
        ctx.clearRect(0, 0, W, H);
        var live = 0;
        for (var i = 0; i < A.length; i++) {
          var p = A[i]; p.vy += .07; p.y += p.vy; p.sway += .05;
          if (p.y > H) { p.a -= .05; }
          if (p.a <= 0) continue;
          live++;
          ctx.globalAlpha = Math.max(0, p.a); ctx.fillStyle = p.col;
          ctx.fillRect(p.x + Math.sin(p.sway) * p.amp, Math.min(p.y, H), p.sz, p.sz * 1.4);
        }
        if (live) requestAnimationFrame(loop); else { ctx.clearRect(0, 0, W, H); on = false; }
      })();
    });
  }

  window.MC = window.MC || {};
  MC.seasoning = { intro: intro, ambient: ambient, burst: burst, reduced: RM };
})();

/* ---- shared UI behaviour ------------------------------------------------ */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    /* mobile nav */
    var b = document.querySelector('.burger'), n = document.querySelector('.nav');
    if (b && n) b.addEventListener('click', function () { n.classList.toggle('open'); });

    /* scroll reveal */
    var els = document.querySelectorAll('.rv');
    function showAll() { for (var i = 0; i < els.length; i++) els[i].classList.add('in'); }
    if ('IntersectionObserver' in window && els.length) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
      els.forEach(function (e) { io.observe(e); });
      /* belt and braces — nothing stays hidden for long */
      setTimeout(showAll, 2500);
    } else {
      showAll();
    }
  });
})();
