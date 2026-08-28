/* The Coggin Firm — concept redesign · behaviour
   Restrained interactions only (plan §12). Everything degrades without JS. */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- header shrink on scroll ---------- */
  var header = $('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- desktop mega menu ---------- */
  var mega = $('.has-mega');
  if (mega) {
    var megaBtn = $('button[aria-expanded]', mega);
    var closeTimer;

    var setMega = function (open) {
      mega.classList.toggle('open', open);
      megaBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    megaBtn.addEventListener('click', function (e) {
      e.preventDefault();
      setMega(!mega.classList.contains('open'));
    });
    mega.addEventListener('mouseenter', function () {
      clearTimeout(closeTimer);
      if (window.matchMedia('(hover:hover)').matches) setMega(true);
    });
    mega.addEventListener('mouseleave', function () {
      if (window.matchMedia('(hover:hover)').matches) {
        closeTimer = setTimeout(function () { setMega(false); }, 140);
      }
    });
    mega.addEventListener('focusout', function (e) {
      if (!mega.contains(e.relatedTarget)) setMega(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mega.classList.contains('open')) {
        setMega(false);
        megaBtn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!mega.contains(e.target)) setMega(false);
    });
  }

  /* ---------- mobile panel ---------- */
  var panel  = $('#mobile-panel');
  var burger = $('.burger');
  var lastFocus = null;

  var setPanel = function (open) {
    if (!panel || !burger) return;
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('locked', open);
    document.dispatchEvent(new CustomEvent('coggin:panel'));  /* let the sticky bar stand down */
    if (open) {
      lastFocus = document.activeElement;
      var first = $('.m-close', panel);
      if (first) first.focus();
    } else if (lastFocus) {
      lastFocus.focus();
    }
  };

  if (burger) burger.addEventListener('click', function () { setPanel(!panel.classList.contains('open')); });
  var closeBtn = $('.m-close');
  if (closeBtn) closeBtn.addEventListener('click', function () { setPanel(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel && panel.classList.contains('open')) setPanel(false);
  });
  if (panel) {
    $$('a', panel).forEach(function (a) {
      a.addEventListener('click', function () { setPanel(false); });
    });
    /* simple focus containment */
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !panel.classList.contains('open')) return;
      var f = $$('a[href], button:not([disabled]), input, select, textarea', panel)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- generic accordions (mobile practice groups, FAQs, mobile nav) ---------- */
  $$('[data-acc]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('aria-controls'));
      if (!target) return;
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      target.classList.toggle('open', !open);
    });
  });

  /* ---------- reveal on scroll ---------- */
  var rv = $$('.rv');
  if (rv.length) {
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rv.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      rv.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- mobile sticky action bar ----------
     Shows once the hero has scrolled away; hides while the consultation form
     or the footer is on screen so it never covers a submit button (plan §6). */
  var bar = $('.sticky-bar');
  if (bar) {
    var hero = $('#hero');
    var blockers = [$('#consultation'), $('.site-footer')].filter(Boolean);

    var visible = function (el) {
      var r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    var syncBar = function () {
      var pastHero = hero ? !visible(hero) : true;
      var blocked = blockers.some(visible);
      var menuOpen = panel && panel.classList.contains('open');
      bar.classList.toggle('show', pastHero && !blocked && !menuOpen);
    };
    syncBar();
    window.addEventListener('scroll', syncBar, { passive: true });
    window.addEventListener('resize', syncBar, { passive: true });
    document.addEventListener('coggin:panel', syncBar);
  }

  /* ---------- consultation form ---------- */
  $$('form[data-consult]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('.field', form).forEach(function (field) {
        var input = $('input, select, textarea', field);
        if (!input || !input.required) return;
        var valid = input.type === 'checkbox' ? input.checked : input.checkValidity() && input.value.trim() !== '';
        field.classList.toggle('invalid', !valid);
        if (!valid && ok) { input.focus(); ok = false; }
      });
      var consent = $('.consent input[required]', form);
      if (consent && !consent.checked) {
        ok = false;
        consent.focus();
      }
      if (!ok) return;

      /* Preview only — no submission. Live build posts to the firm's approved inbox/CRM
         with hidden page / campaign / referrer fields (plan §8). */
      var success = $('.form-success', form.parentNode);
      if (success) {
        form.style.display = 'none';
        success.classList.add('show');
        success.setAttribute('tabindex', '-1');
        success.focus();
      }
    });

    $$('input, select, textarea', form).forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field) field.classList.remove('invalid');
      });
    });
  });

  /* ---------- prefill matter type from a practice-area link ---------- */
  var params = new URLSearchParams(window.location.search);
  var matter = params.get('matter');
  if (matter) {
    var sel = $('select[name="matter"]');
    if (sel) {
      Array.prototype.forEach.call(sel.options, function (o) {
        if (o.value === matter) sel.value = matter;
      });
    }
  }
})();
