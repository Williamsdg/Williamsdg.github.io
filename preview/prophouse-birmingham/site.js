/* PropHouse Birmingham: website concept. Williams Digital. */
(function () {
  'use strict';
  var D = window.PH;
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var store = {
    get: function (k, f) { try { var v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private window */ } }
  };

  /* Colour */
  function rgb(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); }
  function hex(c) { return '#' + c.map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join(''); }
  function linear(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function lum(h) { var c = rgb(h); return 0.2126 * linear(c[0]) + 0.7152 * linear(c[1]) + 0.0722 * linear(c[2]); }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function onColor(h) { return contrast(h, '#000000') >= contrast(h, '#ffffff') ? '#000000' : '#ffffff'; }
  function textOnWhite(h) {
    var c = rgb(h), t = h;
    while (contrast(t, '#ffffff') < 5.2) { c = c.map(function (v) { return v * 0.93; }); t = hex(c); }
    return t;
  }
  function paintByName(n) { return D.paints.filter(function (p) { return p.n === n; })[0] || D.paints[0]; }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* Paint and trim state, shared by every page */
  var state = { paint: store.get('ph.paint', D.defaultPaint), trim: store.get('ph.trim', D.defaultTrim) };
  var query = new URLSearchParams(location.search);
  if (D.paints.some(function (p) { return p.n === query.get('paint'); })) state.paint = query.get('paint');
  if (D.trims[query.get('trim')]) state.trim = query.get('trim');

  function applyVars() {
    var p = paintByName(state.paint), on = onColor(p.h), text = textOnWhite(p.h);
    var s = root.style;
    s.setProperty('--paint', p.h);
    s.setProperty('--on-paint', on);
    s.setProperty('--paint-text', text);
    s.setProperty('--trim-url', 'url(img/trim-' + state.trim + '.png)');
    root.toggleAttribute('data-pale', on === '#000000');
    store.set('ph.vars', { p: p.h, o: on, t: text, r: state.trim, d: on === '#000000' });
    var meta = $('meta[name=theme-color]');
    if (meta) meta.setAttribute('content', p.h);
  }

  function setPaint(name) {
    state.paint = name;
    store.set('ph.paint', name);
    applyVars();
    $$('[data-paint-name]').forEach(function (e) { e.textContent = name; });
    $$('[data-paint]').forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.paint === name)); });
    document.dispatchEvent(new CustomEvent('ph:paint', { detail: paintByName(name) }));
  }

  function setTrim(name) {
    state.trim = name;
    store.set('ph.trim', name);
    applyVars();
    $$('[data-trim-name]').forEach(function (e) { e.textContent = D.trims[name].n; });
    $$('[data-trim]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.trim === name)); });
    document.dispatchEvent(new CustomEvent('ph:trim', { detail: name }));
  }

  /* Radio-group keyboard behaviour for any row of paints */
  function arrowNav(group) {
    group.addEventListener('keydown', function (e) {
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].indexOf(e.key) < 0) return;
      var items = $$('[role=radio]', group), i = items.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var n = items[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length];
      n.focus(); n.click();
    });
  }

  function buildChips() {
    $$('[data-chips]').forEach(function (box) {
      box.innerHTML = D.paints.map(function (p) {
        var c = p.n === state.paint;
        return '<button class="chip" role="radio" data-paint="' + p.n + '" aria-checked="' + c + '" aria-label="' + p.n + '" title="' + p.n + '" tabindex="' + (c ? 0 : -1) + '" style="--chip:' + p.h + ';--dot:' + onColor(p.h) + '"></button>';
      }).join('');
      arrowNav(box);
      var cur = $('[aria-checked=true]', box);
      if (cur && box.scrollWidth > box.clientWidth) box.scrollLeft = cur.offsetLeft - box.clientWidth / 2;
    });
    $$('[data-colorwall]').forEach(function (box) {
      box.innerHTML = D.paints.map(function (p) {
        return '<button class="pcard" role="radio" data-paint="' + p.n + '" aria-checked="' + (p.n === state.paint) + '" style="--chip:' + p.h + '"><i></i><span>' + p.n + '</span></button>';
      }).join('');
      arrowNav(box);
    });
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-paint]') : null;
      if (b && !b.closest('[data-trimpaint]')) setPaint(b.dataset.paint);
      var t = e.target.closest ? e.target.closest('[data-trim]') : null;
      if (t) setTrim(t.dataset.trim);
    });
  }

  /* Hero: the real photograph, repainted pixel by pixel.
     hero-mask = where the paint is. hero-shade = the light on the fluting. */
  function initHero() {
    var cv = $('#heroCanvas');
    if (!cv) return;
    var hero = cv.closest('.hero');
    var srcs = ['img/hero.webp', 'img/hero-mask.webp', 'img/hero-shade.webp'];
    var playIntro = !reduced && !sessionFlag();
    if (playIntro) hero.classList.add('priming');

    Promise.all(srcs.map(function (src) {
      return new Promise(function (res, rej) {
        var i = new Image();
        // Safari decodes large images off-thread: drawing before decode() finishes reads back black
        i.onload = function () { if (i.decode) i.decode().then(function () { res(i); }, function () { res(i); }); else res(i); };
        i.onerror = rej; i.src = src;
      });
    })).then(function (imgs) {
      var scale = window.innerWidth < 800 ? 0.68 : 1;
      var W = Math.round(imgs[0].naturalWidth * scale), H = Math.round(imgs[0].naturalHeight * scale);
      var read = function (img) {
        var c = document.createElement('canvas'); c.width = W; c.height = H;
        var x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, W, H);
        return x.getImageData(0, 0, W, H).data;
      };
      var isBlank = function (d) { for (var i = 0, t = 0; i < d.length; i += 160004) t += d[i] + d[i + 1] + d[i + 2]; return t === 0; };
      var base, mask, shade, tries = 0;
      (function attempt() {
      try { base = read(imgs[0]); mask = read(imgs[1]); shade = read(imgs[2]); }
      catch (e) { hero.classList.remove('priming'); return; }
      if (isBlank(base)) {
        if (++tries < 5) { setTimeout(attempt, 200); return; }
        hero.classList.remove('priming'); return;   // leave the plain photograph showing
      }

      cv.width = W; cv.height = H;
      var ctx = cv.getContext('2d');
      var off = document.createElement('canvas'); off.width = W; off.height = H;
      var octx = off.getContext('2d');
      var frame = octx.createImageData(W, H);

      function render(h) {
        var c = rgb(h), lumin = (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
        var k = 1 - 0.42 * lumin, d = frame.data, n = d.length, i, a, s, ia;
        for (i = 0; i < n; i += 4) {
          a = mask[i];
          if (a < 2) { d[i] = base[i]; d[i + 1] = base[i + 1]; d[i + 2] = base[i + 2]; }
          else {
            a /= 255; ia = 1 - a;
            s = 1 + (shade[i] / 255 * 2.2 - 1) * k;
            d[i] = base[i] * ia + Math.min(255, c[0] * s) * a;
            d[i + 1] = base[i + 1] * ia + Math.min(255, c[1] * s) * a;
            d[i + 2] = base[i + 2] * ia + Math.min(255, c[2] * s) * a;
          }
          d[i + 3] = 255;
        }
        octx.putImageData(frame, 0, 0);
      }

      var raf = 0;
      function roll(ms, done) {
        cancelAnimationFrame(raf);
        var t0 = performance.now(), lean = W * 0.07;
        (function step(t) {
          var p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3);
          var x = -lean + (W + lean * 2) * e;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, 0); ctx.lineTo(x + lean, 0); ctx.lineTo(x, H); ctx.lineTo(0, H); ctx.closePath();
          ctx.clip(); ctx.drawImage(off, 0, 0); ctx.restore();
          if (p < 1) raf = requestAnimationFrame(step);
          else if (done) done();
        })(t0);
      }

      function show(h, animate) {
        cancelAnimationFrame(raf);
        render(h);
        if (animate && !reduced) roll(620); else ctx.drawImage(off, 0, 0);
      }

      if (playIntro) {
        render(paintByName('Tofu').h);
        ctx.drawImage(off, 0, 0);
        cv.classList.add('ready');
        setSessionFlag();
        setTimeout(function () {
          render(paintByName(state.paint).h);
          roll(1500, function () { hero.classList.remove('priming'); });
          setTimeout(function () { hero.classList.remove('priming'); }, 1000);
        }, 420);
      } else {
        show(paintByName(state.paint).h, false);
        cv.classList.add('ready');
      }
      document.addEventListener('ph:paint', function (e) { show(e.detail.h, true); });
      })();
    }).catch(function () { hero.classList.remove('priming'); });
  }
  function sessionFlag() { try { return sessionStorage.getItem('ph.seen'); } catch (e) { return '1'; } }
  function setSessionFlag() { try { sessionStorage.setItem('ph.seen', '1'); } catch (e) { /* private window */ } }

  /* Navigation */
  function initNav() {
    var sheet = $('#sheet'), openB = $('#menuBtn');
    if (openB) openB.addEventListener('click', function () { sheet.classList.add('open'); openB.setAttribute('aria-expanded', 'true'); $('.close', sheet).focus(); document.body.style.overflow = 'hidden'; });
    function closeSheet() { sheet.classList.remove('open'); if (openB) { openB.setAttribute('aria-expanded', 'false'); openB.focus(); } document.body.style.overflow = ''; }
    if (sheet) $('.close', sheet).addEventListener('click', closeSheet);
    $$('.drop > .navbtn').forEach(function (b) {
      b.addEventListener('click', function () { var d = b.parentNode, o = d.classList.toggle('open'); b.setAttribute('aria-expanded', String(o)); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (sheet && sheet.classList.contains('open')) closeSheet();
      if ($('#drawer').classList.contains('open')) closeDrawer();
    });
  }

  /* Wishlist */
  var wish = store.get('ph.wish', []);
  function saveWish() { store.set('ph.wish', wish); renderWish(); }
  function hasWish(id) { return wish.some(function (w) { return w.id === id; }); }
  function toggleWish(item) {
    if (hasWish(item.id)) wish = wish.filter(function (w) { return w.id !== item.id; });
    else { wish.push(item); toast('Added to your wishlist'); }
    saveWish();
  }
  function renderWish() {
    $$('[data-wish-count]').forEach(function (e) { e.textContent = wish.length; });
    $$('[data-wish-id]').forEach(function (b) { b.setAttribute('aria-pressed', String(hasWish(b.dataset.wishId))); });
    var list = $('#wishList'), empty = $('#wishEmpty'), foot = $('#wishFoot');
    if (!list) return;
    list.innerHTML = wish.map(function (w) {
      return '<li><span>' + escapeHtml(w.name) + (w.note ? '<small>' + escapeHtml(w.note) + '</small>' : '') + '</span><button class="rm" data-rm="' + escapeHtml(w.id) + '" aria-label="Remove ' + escapeHtml(w.name) + '">Remove</button></li>';
    }).join('');
    empty.hidden = wish.length > 0;
    list.hidden = wish.length === 0;
    foot.hidden = wish.length === 0;
    var box = $('#wishBox');
    if (box) {
      box.hidden = wish.length === 0;
      $('ul', box).innerHTML = wish.map(function (w) { return '<li>' + escapeHtml(w.name) + (w.note ? ': ' + escapeHtml(w.note) : '') + '</li>'; }).join('');
    }
  }
  var lastFocus = null;
  function openDrawer() { lastFocus = document.activeElement; $('#drawer').classList.add('open'); $('#scrim').classList.add('open'); $('#drawer .x').focus(); }
  function closeDrawer() { $('#drawer').classList.remove('open'); $('#scrim').classList.remove('open'); if (lastFocus) lastFocus.focus(); }
  function initWish() {
    $$('[data-open-wish]').forEach(function (b) { b.addEventListener('click', openDrawer); });
    $('#drawer .x').addEventListener('click', closeDrawer);
    $('#scrim').addEventListener('click', closeDrawer);
    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      var h = e.target.closest('[data-wish-id]');
      if (h) toggleWish({ id: h.dataset.wishId, name: h.dataset.wishName, note: h.dataset.wishNote || '' });
      var r = e.target.closest('[data-rm]');
      if (r) { wish = wish.filter(function (w) { return w.id !== r.dataset.rm; }); saveWish(); }
    });
    renderWish();
  }
  var toastT;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }
  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5S3.5 15.2 3.5 9.2A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 8.5 2.6c0 6-8.5 11.3-8.5 11.3z"/></svg>';
  function heartBtn(id, name, note) {
    return '<button class="heart" data-wish-id="' + escapeHtml(id) + '" data-wish-name="' + escapeHtml(name) + '"' + (note ? ' data-wish-note="' + escapeHtml(note) + '"' : '') + ' aria-pressed="' + hasWish(id) + '" aria-label="Add ' + escapeHtml(name) + ' to wishlist">' + HEART + '</button>';
  }
  function fillHearts() {
    $$('[data-heart]').forEach(function (s) { s.outerHTML = heartBtn(s.dataset.heart, s.dataset.heartName, s.dataset.heartNote); });
  }

  /* Props Your Way: step one, two, three */
  function initStudio() {
    var cv = $('#studioCanvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var b = Object.assign({ prop: 'bar', style: 'baxter', sku: '', pattern: '', trimPaint: 'Tofu', useTrim: true, tab: 'paint' }, store.get('ph.build', {}));
    var cache = {};
    function img(src) {
      if (cache[src]) return cache[src];
      cache[src] = new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = rej; i.src = src; });
      return cache[src];
    }
    function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
    var propInfo = function () { return D.props[b.prop]; };
    var kind = function () { return propInfo().kind; };
    function skus() {
      var k = kind();
      if (k === 'bar' || k === 'stage') return (D.styles[b.style] && D.styles[b.style][k]) || [];
      return propInfo().sizes || [];
    }
    function styleFits(id) { var k = kind(); return (k !== 'bar' && k !== 'stage') || (D.styles[id][k] || []).length > 0; }

    function surface(w, h, tile, pattern, color) {
      var c = mk(w, h), x = c.getContext('2d');
      if (pattern) {
        var s = Math.max(w / pattern.naturalWidth, h / pattern.naturalHeight);
        x.imageSmoothingQuality = 'high';
        x.drawImage(pattern, (w - pattern.naturalWidth * s) / 2, (h - pattern.naturalHeight * s) / 2, pattern.naturalWidth * s, pattern.naturalHeight * s);
      } else { x.fillStyle = color; x.fillRect(0, 0, w, h); }
      x.globalCompositeOperation = 'multiply';
      x.imageSmoothingQuality = 'high';
      x.drawImage(tile, 0, 0, w, h);
      // multiply alone can't show moulding on dark paint, so bring the edges back as highlights
      var l = pattern ? 0.5 : lum(color);
      if (l < 0.5) {
        var inv = mk(w, h), ix = inv.getContext('2d');
        ix.fillStyle = '#fff'; ix.fillRect(0, 0, w, h);
        ix.globalCompositeOperation = 'difference';
        ix.drawImage(tile, 0, 0, w, h);
        x.globalCompositeOperation = 'screen';
        x.globalAlpha = Math.min(0.85, 0.3 + (0.5 - l) * 1.2);
        x.drawImage(inv, 0, 0);
        x.globalAlpha = 1;
      }
      return c;
    }
    function drawTrim(x, trimImg, color, px, py, w, h) {
      var tw = Math.max(1, Math.round(trimImg.naturalWidth * h / trimImg.naturalHeight));
      var s = mk(tw, h), sx = s.getContext('2d');
      sx.imageSmoothingQuality = 'high';
      sx.drawImage(trimImg, 0, 0, tw, h);
      sx.globalCompositeOperation = 'source-in';
      sx.fillStyle = color; sx.fillRect(0, 0, tw, h);
      x.save(); x.translate(px, py); x.fillStyle = x.createPattern(s, 'repeat-x'); x.fillRect(0, 0, w, h); x.restore();
    }

    var token = 0;
    function draw() {
      var mine = ++token, info = propInfo(), k = kind();
      var color = paintByName(state.paint).h, tc = paintByName(b.trimPaint).h;
      var flat = k === 'bar' || k === 'stage';
      var showTrim = flat && b.useTrim;
      Promise.all([
        img(flat ? 'img/f-' + b.style + '.webp' : info.img),
        b.pattern ? img('img/patc-' + b.pattern + '.webp') : null,
        showTrim ? img('img/trim-' + state.trim + '.png') : null
      ]).then(function (r) {
        if (mine !== token) return;
        var tile = r[0], pat = r[1], tr = r[2];
        if (k === 'bar') {
          var W = 1100, top = 46, H = Math.round(tile.naturalHeight * (W - 44) / tile.naturalWidth);
          cv.width = W; cv.height = top + H;
          ctx.clearRect(0, 0, W, cv.height);
          ctx.drawImage(surface(W - 44, H, tile, pat, color), 22, top);
          if (tr) drawTrim(ctx, tr, tc, 22, top, W - 44, 66);
          ctx.fillStyle = color; ctx.fillRect(0, 0, W, top);
          ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fillRect(0, 0, W, 8);
          ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(0, top - 6, W, 6);
        } else if (k === 'stage') {
          var W2 = 1100, H2 = Math.round(tile.naturalHeight * W2 / tile.naturalWidth);
          cv.width = W2; cv.height = H2;
          ctx.clearRect(0, 0, W2, H2);
          ctx.drawImage(surface(W2, H2, tile, pat, color), 0, 0);
          if (tr) drawTrim(ctx, tr, tc, 0, 0, W2, 66);
        } else {
          var sc = info.scale || 1, W3 = Math.round(tile.naturalWidth * sc), H3 = Math.round(tile.naturalHeight * sc);
          cv.width = W3; cv.height = H3;
          var c = surface(W3, H3, tile, pat, color), x = c.getContext('2d');
          x.globalCompositeOperation = 'destination-in';
          x.drawImage(tile, 0, 0, W3, H3);
          ctx.clearRect(0, 0, W3, H3);
          ctx.drawImage(c, 0, 0);
        }
      });
      renderSpec();
    }

    function title() {
      var s = skus(), k = kind();
      if (k === 'bar' || k === 'stage') return b.sku || s[0] || D.styles[b.style].n;
      return (b.sku ? b.sku + ' ' : '') + propInfo().n;
    }
    function sentence() {
      var flat = kind() === 'bar' || kind() === 'stage', out;
      if (b.pattern) out = 'In the ' + D.patterns[b.pattern].n + ' pattern';
      else out = 'Painted ' + state.paint;
      if (flat && b.useTrim) out += ', with ' + D.trims[state.trim].n + ' trim in ' + b.trimPaint;
      return out + '.';
    }
    function renderSpec() {
      $('#specTitle').textContent = title();
      $('#specLine').textContent = sentence();
      store.set('ph.build', b);
    }

    function renderProps() {
      $('#propGrid').innerHTML = Object.keys(D.props).map(function (id) {
        var p = D.props[id];
        return '<button class="opt" data-prop="' + id + '" aria-pressed="' + (b.prop === id) + '"><img src="' + p.img + '" alt="" loading="lazy">' + p.n + '</button>';
      }).join('');
    }
    function renderStyles() {
      var k = kind(), flat = k === 'bar' || k === 'stage';
      $('#styleBlock').hidden = !flat;
      $('#styleSkip').hidden = flat;
      if (flat) {
        if (!styleFits(b.style)) b.style = Object.keys(D.styles).filter(styleFits)[0];
        $('#styleGrid').innerHTML = Object.keys(D.styles).filter(styleFits).map(function (id) {
          return '<button class="opt" data-style="' + id + '" aria-pressed="' + (b.style === id) + '"><span class="thumb"><img src="img/f-' + id + '.webp" alt="" loading="lazy"></span>' + D.styles[id].n + '</button>';
        }).join('');
      }
      var list = skus(), sel = $('#skuSel');
      $('#skuWrap').hidden = list.length === 0;
      if (list.indexOf(b.sku) < 0) b.sku = list[0] || '';
      sel.innerHTML = list.map(function (s) { return '<option' + (s === b.sku ? ' selected' : '') + '>' + s + '</option>'; }).join('');
      $('#trimTab').hidden = !flat;
      if (!flat && b.tab === 'trim') { b.tab = 'paint'; }
    }
    function renderFans() {
      $('#fanPaint').innerHTML = D.paints.map(function (p) { return '<button role="radio" data-paint="' + p.n + '" aria-checked="' + (p.n === state.paint) + '" aria-label="' + p.n + '" title="' + p.n + '" style="--chip:' + p.h + '"></button>'; }).join('');
      arrowNav($('#fanPaint'));
      $('#fanTrim').innerHTML = D.paints.map(function (p) { return '<button role="radio" data-tpaint="' + p.n + '" aria-checked="' + (p.n === b.trimPaint) + '" aria-label="Trim in ' + p.n + '" title="' + p.n + '" style="--chip:' + p.h + '"></button>'; }).join('');
      arrowNav($('#fanTrim'));
      $('#patGrid').innerHTML = '<button class="none" data-pattern="" aria-pressed="' + (!b.pattern) + '">Paint only</button>' + Object.keys(D.patterns).map(function (id) {
        return '<button data-pattern="' + id + '" aria-pressed="' + (b.pattern === id) + '" aria-label="' + D.patterns[id].n + '" title="' + D.patterns[id].n + '" style="background-image:url(img/pat-' + id + '.webp)"></button>';
      }).join('');
      $('#trimGrid').innerHTML = '<button class="none" data-notrim aria-pressed="' + (!b.useTrim) + '">No trim</button>' + Object.keys(D.trims).map(function (id) {
        return '<button data-trim="' + id + '" aria-pressed="' + (b.useTrim && state.trim === id) + '" style="--u:url(img/trim-' + id + '.png)"><i></i>' + D.trims[id].n + '</button>';
      }).join('');
    }
    function setTab(t) {
      b.tab = t;
      $$('[role=tab]').forEach(function (e) { e.setAttribute('aria-selected', String(e.dataset.tab === t)); });
      $$('[data-panel]').forEach(function (p) { p.hidden = p.dataset.panel !== t; });
    }

    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      var t = e.target.closest('[data-prop],[data-style],[data-tpaint],[data-pattern],[data-notrim],[role=tab]');
      if (!t || !t.closest('.studio')) return;
      if (t.dataset.prop) { b.prop = t.dataset.prop; b.sku = ''; renderProps(); renderStyles(); setTab(b.tab); }
      else if (t.dataset.style) { b.style = t.dataset.style; b.sku = ''; renderStyles(); }
      else if (t.dataset.tpaint) { b.trimPaint = t.dataset.tpaint; $$('[data-tpaint]').forEach(function (x) { x.setAttribute('aria-checked', String(x.dataset.tpaint === b.trimPaint)); }); }
      else if ('pattern' in t.dataset) { b.pattern = t.dataset.pattern; $$('[data-pattern]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.pattern === b.pattern)); }); }
      else if ('notrim' in t.dataset) { b.useTrim = false; $$('#trimGrid button').forEach(function (x) { x.setAttribute('aria-pressed', String('notrim' in x.dataset)); }); }
      else if (t.dataset.tab) { setTab(t.dataset.tab); return; }
      draw();
    });
    $('#skuSel').addEventListener('change', function (e) { b.sku = e.target.value; renderSpec(); });
    document.addEventListener('ph:paint', function () { b.pattern = ''; $$('[data-pattern]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.pattern === '')); }); draw(); });
    document.addEventListener('ph:trim', function () { b.useTrim = true; $$('#trimGrid button').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.trim === state.trim)); }); draw(); });
    $('#saveBuild').addEventListener('click', function () {
      var name = title(), note = sentence();
      toggleWish({ id: 'build:' + name + ':' + note, name: name, note: note });
      openDrawer();
    });

    renderProps(); renderStyles(); renderFans(); setTab(b.tab); draw();
  }

  /* Collections page buttons feed the customizer */
  function initCollections() {
    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      var p = e.target.closest('[data-use-pattern]');
      if (p) {
        var b = Object.assign({}, store.get('ph.build', {}), { pattern: p.dataset.usePattern });
        store.set('ph.build', b);
        toast(D.patterns[p.dataset.usePattern].n + ' is on your prop');
        setTimeout(function () { location.href = 'props-your-way.html'; }, 500);
      }
    });
  }

  /* Inventory: rooms of the house, search across everything named on the site */
  function initInventory() {
    var input = $('#invSearch');
    if (!input) return;
    var box = $('#roomResults'), itemsBox = $('#itemResults');
    function row(c) {
      return '<a class="row" href="' + c.href + '" target="_blank" rel="noopener"><span class="disc"><img src="img/c-' + c.i + '.webp" alt=""></span><span class="t">' + c.n + '</span></a>';
    }
    function show() {
      var q = input.value.trim().toLowerCase();
      $('#rooms').hidden = !!q;
      $('#planWrap').hidden = !!q;
      $('#searchWrap').hidden = !q;
      if (!q) return;
      var cats = D.cats.filter(function (c) { return c.n.toLowerCase().indexOf(q) >= 0; });
      var items = D.items.filter(function (x) { return (x.n + ' ' + x.w).toLowerCase().indexOf(q) >= 0; });
      box.innerHTML = cats.map(row).join('');
      itemsBox.innerHTML = items.slice(0, 60).map(function (x) {
        return '<li><span>' + escapeHtml(x.n) + '<small>' + escapeHtml(x.w) + '</small></span>' + heartBtn('item:' + x.n, x.n, '') + '</li>';
      }).join('');
      $('#catWrap').hidden = !cats.length;
      $('#itemWrap').hidden = !items.length;
      $('#noResults').hidden = !!(cats.length || items.length);
    }
    input.addEventListener('input', show);
  }

  /* Shop the Look: one look in view, the whole list beside it */
  function initLooks() {
    var viewer = $('#viewer');
    if (!viewer) return;
    var cur = 0, f = $('#lookFilter'), thumbs = $$('[data-look]');
    function show(i) {
      cur = i;
      var l = D.looks[i], im = $('#vImg');
      im.src = 'img/' + l.id + '.webp'; im.alt = l.alt;
      $('#vTag').textContent = l.k === 'w' ? 'Weddings' : 'Corporate Events';
      $('#vTitle').textContent = l.t;
      $('#vProps').innerHTML = '<ul class="plist">' + l.props.map(function (p) {
        return '<li><span>' + escapeHtml(p) + '</span>' + heartBtn('item:' + p, p, '') + '</li>';
      }).join('') + '</ul>';
      $('#vVend').innerHTML = l.vend.map(function (v) { return '<div><b>' + escapeHtml(v[0]) + ':</b> ' + escapeHtml(v[1]) + '</div>'; }).join('');
      thumbs.forEach(function (t) { t.setAttribute('aria-pressed', String(+t.dataset.look === i)); });
    }
    thumbs.forEach(function (t) { t.addEventListener('click', function () { show(+t.dataset.look); }); });
    $$('button', f).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', f).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var vis = thumbs.filter(function (t) { var on = b.dataset.f === 'all' || t.dataset.k === b.dataset.f; t.hidden = !on; return on; });
        if (vis.indexOf(thumbs[cur]) < 0) show(+vis[0].dataset.look);
      });
    });
    $('#vAll').addEventListener('click', function () {
      D.looks[cur].props.forEach(function (p) { if (!hasWish('item:' + p)) wish.push({ id: 'item:' + p, name: p, note: '' }); });
      saveWish();
      toast('Added ' + D.looks[cur].props.length + ' props to your wishlist');
    });
  }

  function initFrames() {
    $$('.fr').forEach(function (b) { b.addEventListener('click', function () { var on = b.classList.toggle('on'); b.setAttribute('aria-pressed', String(on)); }); });
  }

  /* Contact: same questions as today, follow-ups only appear when they apply */
  function initForm() {
    var form = $('#inq');
    if (!form) return;
    $$('[data-when]', form).forEach(function (w) {
      var pair = w.dataset.when.split('='), src = form.elements[pair[0]];
      function sync() { var on = src.value === pair[1]; w.hidden = !on; $$('input,textarea', w).forEach(function (i) { i.required = on; }); }
      src.addEventListener('change', sync); sync();
    });
    var doors = $$('[data-door]');
    function openDoor(id) {
      doors.forEach(function (d) {
        var on = d.dataset.door === id;
        d.setAttribute('aria-pressed', String(on));
        if (on) form.elements.kind.value = d.dataset.kind;
      });
      $$('[data-visit]').forEach(function (v) { v.hidden = v.dataset.visit !== id; });
    }
    doors.forEach(function (d) { d.addEventListener('click', function () { openDoor(d.dataset.door); }); });
    openDoor(wish.length || location.hash === '#wishlist' ? 'inq' : 'tour');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      $$('.err', form).forEach(function (x) { x.remove(); });
      var bad = $$('input,select,textarea', form).filter(function (i) { return !i.closest('[hidden]') && !i.checkValidity(); });
      if (bad.length) {
        bad.forEach(function (i) {
          var m = document.createElement('p'); m.className = 'err';
          m.textContent = i.type === 'email' && i.value ? 'Enter a full email address, like name@example.com.' : 'Fill this in so the sales team can reach you.';
          i.setAttribute('aria-invalid', 'true');
          i.parentNode.appendChild(m);
        });
        bad[0].focus();
        return;
      }
      var name = form.elements.fname.value.trim();
      $('#formDone h2').textContent = 'Thanks, ' + name + '.';
      form.hidden = true;
      $('#formDone').hidden = false;
      $('#formDone').focus();
    });
  }

  function initDock() {
    var dock = $('#dock'), watched = $$('.ftr, .deck');
    if (!dock || !watched.length || !('IntersectionObserver' in window)) return;
    var seen = new Set();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) seen.add(x.target); else seen.delete(x.target); });
      dock.classList.toggle('hide', seen.size > 0);
    });
    watched.forEach(function (w) { io.observe(w); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyVars();
    $$('[data-paint-name]').forEach(function (e) { e.textContent = state.paint; });
    $$('[data-trim-name]').forEach(function (e) { e.textContent = D.trims[state.trim].n; });
    fillHearts();
    buildChips();
    initNav();
    initWish();
    initHero();
    initStudio();
    initCollections();
    initInventory();
    initLooks();
    initFrames();
    initForm();
    initDock();
  });
})();
