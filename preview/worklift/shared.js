/* WorkLift concept prototype: shared UI helpers (toast, sheets, modals, view router). UI only, nothing is saved or sent. */
(function () {
  var WL = window.WL = {};
  var toastT;
  WL.toast = function (msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2800);
  };
  WL.open = function (id) {
    var el = document.getElementById(id); if (!el) return;
    el.classList.add('open'); el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var f = el.querySelector('.pane, .box'); if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
  };
  WL.close = function (id) {
    var el = document.getElementById(id); if (!el) return;
    el.classList.remove('open'); el.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.sheet.open, .modal.open, .drawer.open')) document.body.style.overflow = '';
  };
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); WL.open(o.getAttribute('data-open')); return; }
    var c = e.target.closest('[data-close]');
    if (c) { e.preventDefault(); var w = c.closest('.sheet, .modal, .drawer'); WL.close(c.getAttribute('data-close') || (w && w.id)); return; }
    if (e.target.classList.contains('scrim')) { var w2 = e.target.closest('.sheet, .modal, .drawer'); if (w2) WL.close(w2.id); return; }
    var t = e.target.closest('[data-toast]');
    if (t) { if (t.tagName === 'A') e.preventDefault(); WL.toast(t.getAttribute('data-toast')); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.sheet.open, .modal.open, .drawer.open').forEach(function (w) { WL.close(w.id); });
  });
  /* Hash router for app views: .view[data-view] sections, [data-view-link] nav links */
  WL.router = function (def, onChange) {
    var views = Array.prototype.slice.call(document.querySelectorAll('.view[data-view]'));
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-view-link]'));
    function show(name) {
      var ok = views.some(function (v) { return v.dataset.view === name; });
      if (!ok) name = def;
      var cur = null;
      views.forEach(function (v) { var on = v.dataset.view === name; v.classList.toggle('on', on); if (on) cur = v; });
      links.forEach(function (a) { var on = a.dataset.viewLink === name; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
      var h = document.getElementById('viewTitle');
      if (h && cur && cur.dataset.title) { h.textContent = cur.dataset.title; document.title = cur.dataset.title + ' | WorkLift'; }
      window.scrollTo(0, 0);
      if (onChange) onChange(name);
    }
    window.addEventListener('hashchange', function () { show(location.hash.slice(1) || def); });
    show(location.hash.slice(1) || def);
    return show;
  };
  WL.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
})();
