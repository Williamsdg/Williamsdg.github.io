/* Cornerstone — shared behaviour. No dependencies. */
(function () {
  'use strict';

  /* ---------------------------------------------------------- Mobile nav */
  var burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.drawer a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------------- Scroll reveal */
  var targets = document.querySelectorAll('.rv');
  if (targets.length) {
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          var delay = parseInt(el.getAttribute('data-rv-delay') || '0', 10);
          setTimeout(function () { el.classList.add('is-in'); }, delay);
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });
      targets.forEach(function (el) { io.observe(el); });
    }
  }

  /* -------------------------------------------------------- Coverage map */
  var seg = document.querySelector('[data-map-toggle]');
  if (seg) {
    seg.addEventListener('click', function (ev) {
      var btn = ev.target.closest('button[data-mode]');
      if (!btn) return;
      var mode = btn.getAttribute('data-mode');
      seg.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      document.querySelectorAll('.tile[data-state]').forEach(function (t) {
        var core = t.getAttribute('data-core') === '1';
        var net = t.getAttribute('data-net') === '1';
        if (mode === 'core') t.setAttribute('data-on', core ? 'core' : '');
        else t.setAttribute('data-on', core ? 'core' : (net ? 'net' : ''));
      });
      var cap = document.querySelector('[data-map-caption]');
      if (cap) cap.textContent = btn.getAttribute('data-caption') || '';
    });
  }

  /* ------------------------------------------------------- File selection */
  document.querySelectorAll('.filedrop input[type=file]').forEach(function (inp) {
    inp.addEventListener('change', function () {
      var out = inp.closest('.filedrop').querySelector('.filedrop__s');
      if (!out) return;
      out.textContent = inp.files && inp.files.length
        ? inp.files[0].name
        : out.getAttribute('data-default') || '';
    });
  });

  /* -------------------------------------------------- Form validation
     NOTE: this is front-end only. No submission endpoint is wired yet —
     see the comment block at the top of assign.html / roster.html. */
  function fieldOf(el) { return el.closest('.field') || el.closest('.field--full'); }

  function showError(el, msg) {
    el.setAttribute('aria-invalid', 'true');
    var box = fieldOf(el);
    if (!box) return;
    var slot = box.querySelector('.err');
    if (!slot) { slot = document.createElement('div'); slot.className = 'err'; box.appendChild(slot); }
    slot.textContent = msg;
  }

  function clearError(el) {
    el.removeAttribute('aria-invalid');
    var box = fieldOf(el);
    var slot = box && box.querySelector('.err');
    if (slot) slot.textContent = '';
  }

  function validate(el) {
    var v = (el.value || '').trim();
    if (el.hasAttribute('required') && !v) { showError(el, 'Required'); return false; }
    if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      showError(el, 'Enter a valid email address'); return false;
    }
    if (el.type === 'tel' && v && v.replace(/\D/g, '').length < 10) {
      showError(el, 'Enter a 10-digit phone number'); return false;
    }
    clearError(el);
    return true;
  }

  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.setAttribute('novalidate', 'novalidate');

    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value.trim()) validate(el); });
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) validate(el); });
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = true, first = null;
      form.querySelectorAll('input,select,textarea').forEach(function (el) {
        if (el.type === 'file' || el.type === 'checkbox') return;
        if (!validate(el)) { ok = false; if (!first) first = el; }
      });
      if (!ok) {
        if (first) {
          first.focus();
          first.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        return;
      }
      var done = document.querySelector('#' + form.getAttribute('data-done'));
      form.classList.add('is-done');
      if (done) {
        done.classList.add('is-on');
        done.setAttribute('tabindex', '-1');
        done.focus();
        done.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    });
  });

  /* -------------------------------------------------------- Header state */
  var hdr = document.querySelector('.hdr');
  if (hdr) {
    var onScroll = function () {
      hdr.style.boxShadow = window.scrollY > 12 ? '0 18px 44px -30px rgba(0,0,0,.9)' : 'none';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------------------------------------- Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
