/* ============================================================
   _command.js — shared interactivity for TCB Command (demo)
   Modal system + toast notifications + smart button wiring.
   Loaded on every dashboard page (after the markup).
   ============================================================ */
(function () {
  /* ---------- mobile drawer ---------- */
  var ham = document.getElementById('ham'),
      side = document.getElementById('side'),
      scrim = document.getElementById('scrim');
  function drawer() { if (side) side.classList.toggle('open'); if (scrim) scrim.classList.toggle('open'); }
  if (ham) ham.addEventListener('click', drawer);
  if (scrim) scrim.addEventListener('click', drawer);

  /* ---------- toast ---------- */
  var toastWrap = document.createElement('div');
  toastWrap.className = 'tcb-toasts';
  document.body.appendChild(toastWrap);
  window.tcbToast = function (msg, kind) {
    var t = document.createElement('div');
    t.className = 'tcb-toast' + (kind ? ' ' + kind : '');
    t.innerHTML = '<span class="tt-ico">' + (kind === 'warn' ? '!' : '✓') + '</span><span>' + msg + '</span>';
    toastWrap.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('in'); });
    setTimeout(function () { t.classList.remove('in'); setTimeout(function () { t.remove(); }, 300); }, 3200);
  };

  /* ---------- modal ---------- */
  var modal = document.createElement('div');
  modal.className = 'tcb-modal';
  modal.innerHTML =
    '<div class="tcb-modal-scrim"></div>' +
    '<div class="tcb-modal-card" role="dialog" aria-modal="true">' +
    '<div class="tcb-modal-head"><h3 id="tcbModalTitle"></h3><button class="tcb-modal-x" aria-label="Close">✕</button></div>' +
    '<div class="tcb-modal-body" id="tcbModalBody"></div>' +
    '<div class="tcb-modal-foot" id="tcbModalFoot"></div>' +
    '</div>';
  document.body.appendChild(modal);
  var mTitle = modal.querySelector('#tcbModalTitle'),
      mBody = modal.querySelector('#tcbModalBody'),
      mFoot = modal.querySelector('#tcbModalFoot');

  function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
  modal.querySelector('.tcb-modal-x').addEventListener('click', closeModal);
  modal.querySelector('.tcb-modal-scrim').addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  // opts: {title, body(html), submitText, onSubmit(), cancelText}
  window.tcbModal = function (opts) {
    mTitle.textContent = opts.title || '';
    mBody.innerHTML = opts.body || '';
    mFoot.innerHTML = '';
    if (opts.cancelText !== null) {
      var cancel = document.createElement('button');
      cancel.className = 'tcb-btn ghost';
      cancel.textContent = opts.cancelText || 'Cancel';
      cancel.addEventListener('click', closeModal);
      mFoot.appendChild(cancel);
    }
    if (opts.submitText) {
      var submit = document.createElement('button');
      submit.className = 'tcb-btn navy';
      submit.textContent = opts.submitText;
      submit.addEventListener('click', function () {
        if (opts.onSubmit) { var r = opts.onSubmit(); if (r === false) return; }
        closeModal();
      });
      mFoot.appendChild(submit);
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    var first = mBody.querySelector('input,select,textarea');
    if (first) setTimeout(function () { first.focus(); }, 80);
  };

  /* ---------- field builders ---------- */
  function field(label, inner) {
    return '<div class="tcb-field"><label>' + label + '</label>' + inner + '</div>';
  }
  function inp(ph, val) { return '<input type="text" placeholder="' + (ph || '') + '" value="' + (val || '') + '">'; }
  function sel(opts) { return '<select>' + opts.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select>'; }
  function area(ph, val) { return '<textarea rows="3" placeholder="' + (ph || '') + '">' + (val || '') + '</textarea>'; }

  /* ---------- modal templates keyed by button label ---------- */
  var PROJECTS = ['Smith Residence — 123 Gulf View Dr', 'WaterSound Estate — 88 Scenic Hwy 30A', 'Miramar Modern — 204 Dune Allen Rd', 'Seagrove Retreat — 12 Eastern Lake Rd', 'Freeport Farmhouse — Emerald Bay Lot 14'];
  var CREWS = ['ABC Cabinets', 'Emerald Electric', 'Tidewater Plumbing', 'Gulf Drywall Co', 'Coastal Concrete', 'In-house crew · Diego'];
  var TRADES = ['Site Work', 'Foundation', 'Framing', 'Roofing', 'Electrical', 'Plumbing', 'Drywall', 'Finishes'];

  var TEMPLATES = {
    'New Project': {
      title: 'New Project',
      body: field('Project name', inp('e.g. Gulf View Estate')) +
            field('Customer', inp('Customer name')) +
            field('Phone', inp('850-555-0000')) +
            field('Site address', inp('Street, city')) +
            '<div class="tcb-2col">' + field('Floor plan', sel(['The Seagrove', 'The Rosemary', 'The WaterSound', 'The Grayton', 'The Inlet', 'The Camp Creek', 'Custom'])) + field('Contract value', inp('$0')) + '</div>',
      submitText: 'Create Project',
      toast: 'Project created — added to your active builds.'
    },
    'Schedule Job': {
      title: 'Schedule a Job',
      body: field('Project', sel(PROJECTS)) +
            '<div class="tcb-2col">' + field('Date', inp('', 'July 12, 2026')) + field('Time', inp('', '8:00 AM')) + '</div>' +
            field('Trade', sel(TRADES)) +
            field('Assign crew / sub', sel(CREWS)) +
            field('Scope of work', area('What needs to happen on site…', 'Install kitchen cabinets per plan.')) +
            '<div class="tcb-note">Crew is notified by SMS, email &amp; dashboard, and a work order is generated automatically.</div>',
      submitText: 'Schedule &amp; Notify Crew',
      toast: 'Job scheduled — crew notified and work order created.'
    },
    'New Work Order': {
      title: 'New Work Order',
      body: field('Project', sel(PROJECTS)) +
            field('Task', inp('e.g. Install kitchen cabinets')) +
            '<div class="tcb-2col">' + field('Date', inp('', 'July 12, 2026')) + field('Assign to', sel(CREWS)) + '</div>' +
            field('Instructions', area('Notes for the crew…')) +
            '<div class="tcb-note">📎 Attach plans &amp; photos after creating.</div>',
      submitText: 'Create &amp; Send',
      toast: 'Work order created and sent to the crew.'
    },
    'New Estimate': {
      title: 'New Estimate',
      body: field('Customer', inp('Customer name')) +
            field('Site address', inp('Street, city')) +
            field('Floor plan', sel(['The WaterSound', 'The Seagrove', 'The Rosemary', 'The Grayton', 'The Inlet', 'The Camp Creek', 'Custom'])) +
            '<div class="tcb-note">Opens the Estimate Builder with sections pre-loaded (Site Work → Finishes).</div>',
      submitText: 'Start Estimate',
      toast: 'New estimate started — building sections.'
    },
    'New Change Order': {
      title: 'New Change Order',
      body: field('Project', sel(PROJECTS)) +
            field('Describe the change', area('e.g. Add outdoor summer kitchen + pergola')) +
            '<div class="tcb-2col">' + field('Cost impact', inp('+$0')) + field('Schedule impact', inp('e.g. +3 days')) + '</div>' +
            '<div class="tcb-note">Owner receives it for e-signature; status tracks Sent → Viewed → Signed.</div>',
      submitText: 'Send for Signature',
      toast: 'Change order sent to owner for signature.'
    },
    'New Daily Log': {
      title: 'File a Daily Log',
      body: field('Project', sel(PROJECTS)) +
            '<div class="tcb-2col">' + field('Weather', inp('', 'Sunny · 88°F')) + field('Workers on site', inp('', '6')) + '</div>' +
            field('Work completed', area('What got done today…')) +
            field('Delays / issues', inp('None')) +
            '<div class="tcb-note">📷 Add site photos after filing.</div>',
      submitText: 'Submit Daily Log',
      toast: 'Daily log filed — added to the project history.'
    },
    'Schedule Delivery': {
      title: 'Schedule a Delivery',
      body: field('Project', sel(PROJECTS)) +
            '<div class="tcb-2col">' + field('Material', inp('e.g. Cabinets')) + field('Vendor', inp('e.g. ABC Millworks')) + '</div>' +
            field('Delivery date', inp('', 'July 14, 2026')),
      submitText: 'Schedule Delivery',
      toast: 'Delivery scheduled and added to the calendar.'
    },
    'Add Sub': {
      title: 'Add a Subcontractor',
      body: field('Company / name', inp('e.g. Emerald Electric')) +
            '<div class="tcb-2col">' + field('Trade', sel(TRADES)) + field('Phone', inp('850-555-0000')) + '</div>' +
            field('Email', inp('vendor@email.com')),
      submitText: 'Add to Directory',
      toast: 'Subcontractor added to your directory.'
    },
    'Send Update': {
      title: 'Send Homeowner Update',
      body: field('Project', sel(PROJECTS)) +
            field("This week's progress", area('Quick note for the homeowner…', 'Roofing is underway — the metal arrived and the crew is making great progress.')) +
            field('Next milestone', inp('', 'Dry-in complete · est. Jul 18')) +
            '<div class="tcb-note">📷 Includes the latest progress photos automatically.</div>',
      submitText: 'Send to Homeowner',
      toast: 'Update sent — the homeowner will get photos + timeline.'
    },
    'Invite Homeowner': {
      title: 'Invite a Homeowner',
      body: field('Project', sel(PROJECTS)) +
            field('Homeowner name', inp('e.g. The Hartwell Family')) +
            field('Email', inp('owner@email.com')) +
            '<div class="tcb-note">They get a secure link to their private project portal.</div>',
      submitText: 'Send Invite',
      toast: 'Portal invite sent to the homeowner.'
    },
    'Export Report': {
      title: 'Export Report',
      body: field('Report', sel(['Revenue summary', 'Pipeline by stage', 'Open change orders', 'Projects closed YTD', 'Vendor scorecard'])) +
            field('Format', sel(['PDF', 'CSV / Excel'])) +
            field('Date range', sel(['This quarter', 'This month', 'Year to date', 'Last 12 months'])),
      submitText: 'Download',
      toast: 'Report generated — downloading now.'
    }
  };

  function labelOf(btn) {
    return (btn.textContent || '').replace(/^[+\s]+/, '').replace(/\s+/g, ' ').trim();
  }

  /* ---------- wire all primary (.top-cta) buttons ---------- */
  document.querySelectorAll('.top-cta').forEach(function (btn) {
    if (btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', function () {
      var label = labelOf(btn);
      var tpl = TEMPLATES[label];
      if (tpl) {
        tcbModal({
          title: tpl.title,
          body: tpl.body,
          submitText: tpl.submitText,
          onSubmit: function () { tcbToast(tpl.toast); }
        });
      } else {
        tcbToast(label + ' — done.');
      }
    });
  });

  /* ---------- wire generic form-submit buttons inside cards ---------- */
  document.querySelectorAll('button.top-cta[style*="width:100%"]').forEach(function (btn) {
    // already covered above if it matches a template; otherwise give it a success toast
    if (TEMPLATES[labelOf(btn)]) return;
  });

  /* ---------- wire .pbtn / labeled action buttons (estimates, work orders) ---------- */
  document.querySelectorAll('.pbtn').forEach(function (btn) {
    if (btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', function () {
      var t = (btn.textContent || '').trim();
      if (/download/i.test(t)) tcbToast('PDF downloaded.');
      else if (/send/i.test(t)) tcbToast('Sent to client.');
      else if (/save/i.test(t)) tcbToast('Draft saved.');
      else if (/print/i.test(t)) { tcbToast('Opening print dialog…'); setTimeout(function () { window.print(); }, 400); }
      else if (/re-?send/i.test(t)) tcbToast('Re-sent to crew.');
      else if (/add section/i.test(t)) tcbToast('Section added.');
      else tcbToast(t + ' — done.');
    });
  });

  /* ---------- wire inline "+ Add line / Add section / card-action" demo links ---------- */
  document.querySelectorAll('.est-add').forEach(function (el) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function () { tcbToast('Line added to this section.'); });
  });

  /* ---------- wire real <form> elements + standalone full-width submit buttons ---------- */
  document.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      tcbToast('Submitted successfully.');
    });
  });
})();
