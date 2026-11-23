/* ==========================================================================
   Scarlet & Gold — Visit & Help page (assets/visit.js)
   - marks today's posted store hours (America/Chicago)
   - FAQ accordion: button[aria-expanded] + one role=region per answer,
     Arrow/Home/End move between questions, #hash opens the target
   - jump chips track the group in view
   ========================================================================== */
(function () {
  'use strict';

  /* ---- today's posted hours ---- */
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var today = new Date().getDay();
  try {
    today = DAYS.indexOf(new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/Chicago' }).format(new Date()));
  } catch (e) { /* older browsers: fall back to the device day */ }
  document.querySelectorAll('.vi-hours__row').forEach(function (row) {
    if (row.getAttribute('data-days').split(',').indexOf(String(today)) < 0) return;
    row.classList.add('is-today');
    row.querySelector('dt').insertAdjacentHTML('beforeend', '<span class="vi-today">Today</span>');
  });

  /* ---- FAQ accordion ---- */
  var faq = document.querySelector('.vi-faq');
  if (!faq) throw new Error('visit.js: .vi-faq is missing');
  var buttons = Array.prototype.slice.call(faq.querySelectorAll('.vi-qa__b'));

  function setOpen(btn, open) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  }

  faq.addEventListener('click', function (e) {
    var b = e.target.closest('.vi-qa__b');
    if (!b) return;
    setOpen(b, b.getAttribute('aria-expanded') !== 'true');
  });

  faq.addEventListener('keydown', function (e) {
    var b = e.target.closest('.vi-qa__b');
    if (!b) return;
    var i = buttons.indexOf(b), next = null;
    if (e.key === 'ArrowDown') next = buttons[(i + 1) % buttons.length];
    else if (e.key === 'ArrowUp') next = buttons[(i - 1 + buttons.length) % buttons.length];
    else if (e.key === 'Home') next = buttons[0];
    else if (e.key === 'End') next = buttons[buttons.length - 1];
    if (next) { e.preventDefault(); next.focus(); }
  });

  /*
   * #shipping / #returns … open that group's first question; #q-… opens that question.
   * In-page links into the FAQ are handled here instead of by the browser: opening an answer
   * that sits above the viewport makes WebKit's scroll anchoring cancel a native smooth
   * fragment scroll (the reader lands further down the page). So: open first, then scroll
   * once layout includes the new answer, then record the hash with pushState.
   */
  function hashId() {
    try { return decodeURIComponent(location.hash.slice(1)); } catch (e) { return location.hash.slice(1); }
  }
  function jumpTo(id, push, scroll) {
    var el = id ? document.getElementById(id) : null;
    if (!el || !faq.contains(el)) return false;
    var qa = el.classList.contains('vi-group') ? el.querySelector('.vi-qa') : el.closest('.vi-qa');
    var b = qa ? qa.querySelector('.vi-qa__b') : null;
    if (b && b.getAttribute('aria-expanded') !== 'true') setOpen(b, true);
    if (scroll) {
      el.scrollIntoView({ block: 'start' });          // honours scroll-margin-top + CSS scroll-behavior
      if (b) b.focus({ preventScroll: true });        // keyboard users continue from the question
    }
    if (push && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    return true;
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href*="#"]');
    if (!a || (a.target && a.target !== '_self')) return;
    var u = new URL(a.href, location.href);         // also catches the footer's visit.html#shipping
    if (u.origin !== location.origin || u.pathname !== location.pathname || u.search !== location.search) return;
    if (jumpTo(u.hash.slice(1), true, true)) e.preventDefault();
  });
  window.addEventListener('hashchange', function () { jumpTo(hashId(), false, true); });
  window.addEventListener('popstate', function () { jumpTo(hashId(), false, true); });
  jumpTo(hashId(), false, false);

  /* ---- jump chips follow the group in view ---- */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.vi-chip'));
  var chipList = document.querySelector('.vi-jump__list');
  var groups = Array.prototype.slice.call(faq.querySelectorAll('.vi-group'));
  var current = null;
  function markChip(id) {
    if (id === current) return;
    current = id;
    var active = null;
    chips.forEach(function (c) {
      if (id && c.getAttribute('href') === '#' + id) { c.setAttribute('aria-current', 'true'); active = c; }
      else c.removeAttribute('aria-current');
    });
    if (chipList.scrollWidth > chipList.clientWidth) {
      chipList.scrollTo({ left: active ? Math.max(0, active.parentNode.offsetLeft - chipList.offsetLeft - 16) : 0, behavior: 'smooth' });
    }
  }
  function syncChips() {
    var line = SG.stickyTop() + 140;   // live header height (never the pre-CSS value WebKit can report at script time)
    var id = null;
    groups.forEach(function (g) { if (g.getBoundingClientRect().top <= line) id = g.id; });
    var lastBottom = groups[groups.length - 1].getBoundingClientRect().bottom;
    if (lastBottom < line) id = null;
    markChip(id);
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { syncChips(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', syncChips);
  syncChips();
})();
