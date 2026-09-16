/* Shared behaviour: dialogs, visit-info sheet, provider detail sheet. */
(function () {
  'use strict';
  var L = window.LV;

  var ICON = {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3"/></svg>',
    access: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="4.5" r="1.8"/><path d="M6 8.5l6 1 6-1M12 9.5v5m0 0l-3.5 6.5M12 14.5l3.5 6.5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  window.LV_ICON = ICON;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  window.LV_esc = esc;

  /* Dialog helper: native showModal gives inert background + Esc; we restore focus ourselves. */
  var lastFocus = null;
  function openDialog(dlg, opener) {
    lastFocus = opener || document.activeElement;
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    var f = dlg.querySelector('[data-autofocus]') || dlg.querySelector('button, a, [tabindex="0"]');
    if (f) f.focus();
  }
  function wire(dlg) {
    if (dlg._wired) return; dlg._wired = true;
    dlg.addEventListener('close', function () { if (lastFocus && lastFocus.focus) lastFocus.focus(); });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg) dlg.close();
      if (e.target.closest('[data-close]')) dlg.close();
    });
  }
  window.LV_openDialog = function (dlg, opener) { wire(dlg); openDialog(dlg, opener); };

  function visitInfoHTML() {
    var rows = L.HOURS.map(function (h) { return '<tr><th scope="row">' + h[0] + '</th><td>' + h[1] + '</td></tr>'; }).join('');
    return '' +
      '<table class="hours"><caption class="sr">Sample opening hours</caption>' + rows + '</table>' +
      '<ul class="info-list">' +
      '<li>' + ICON.pin + '<span><b>12 Linden Row (fictional)</b>Ground-floor entrance facing the lindens.</span></li>' +
      '<li>' + ICON.car + '<span><b>Parking</b>Free lot behind the building, entered from Vale Lane (fictional).</span></li>' +
      '<li>' + ICON.access + '<span><b>Step-free entry</b>Side door by the two accessible parking spaces.</span></li>' +
      '<li>' + ICON.phone + '<span><b>Front desk (sample)</b>(555) 010-0142 — a fictional number, not dialable.</span></li>' +
      '</ul>';
  }
  window.LV_visitInfoHTML = visitInfoHTML;

  document.addEventListener('DOMContentLoaded', function () {
    /* Visit info sheet (header, one tap) */
    var vdlg = document.getElementById('visit-sheet');
    if (vdlg) {
      document.querySelectorAll('[data-visit-body]').forEach(function (el) { el.innerHTML = visitInfoHTML(); });
      document.querySelectorAll('[data-open-visit]').forEach(function (b) {
        b.addEventListener('click', function () { window.LV_openDialog(vdlg, b); });
      });
    }

    /* Provider detail sheet */
    var pdlg = document.getElementById('provider-sheet');
    if (pdlg) {
      document.addEventListener('click', function (e) {
        var b = e.target.closest('[data-provider-detail]');
        if (!b) return;
        var p = L.provider(b.getAttribute('data-provider-detail'));
        if (!p) return;
        var days = L.DAYS.filter(function (d) { return p.days[d.id]; }).map(function (d) { return d.label; }).join(', ');
        var visits = p.visits.map(function (v) { return '<li>' + esc(L.visit(v).name) + '</li>'; }).join('');
        pdlg.querySelector('[data-provider-body]').innerHTML =
          '<div class="pd-top"><span class="mono" aria-hidden="true">' + p.initials + '</span><div>' +
          '<h2 id="provider-sheet-title" class="serif">' + esc(p.name) + '</h2>' +
          '<p class="muted">' + esc(p.role) + '</p></div>' +
          '<button class="x" type="button" data-close data-autofocus aria-label="Close provider details">' + ICON.close + '</button></div>' +
          '<p class="pd-note">' + esc(p.note) + '</p>' +
          '<dl class="pd-dl">' +
          '<div><dt>Languages</dt><dd>' + esc(p.languages.join(', ')) + '</dd></div>' +
          '<div><dt>In clinic (sample week)</dt><dd>' + days + '</dd></div>' +
          '<div><dt>New patients</dt><dd><span class="tag">Accepting new patients (sample)</span></dd></div>' +
          '<div><dt>Visit types</dt><dd><ul>' + visits + '</ul></dd></div>' +
          '</dl>' +
          '<p class="pd-fine">A fictional clinician. No degrees, schools, or certifications are listed because none exist.</p>' +
          (pdlg.hasAttribute('data-no-book') ? '' :
          '<a class="btn btn-primary" href="appointment.html?provider=' + p.id + '">Book with ' + esc(p.name.split(' ')[0]) + '</a>');
        window.LV_openDialog(pdlg, b);
      });
    }
  });
})();
