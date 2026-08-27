/* Vestlake Communities — shared site behavior
   Mobile menu drawer + document search. Injected markup keeps one source of truth. */
(function () {
  'use strict';

  /* ===== Mobile menu ===== */
  var toggle = document.getElementById('navToggle');
  if (toggle) {
    var overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    overlay.hidden = true;

    var menu = document.createElement('aside');
    menu.className = 'mobile-menu';
    menu.id = 'mobileMenu';
    menu.hidden = true;
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', 'Site menu');

    var page = (location.pathname.split('/').pop() || 'index.html');
    function row(href, label, cls, external) {
      var current = href === page ? ' aria-current="page"' : '';
      var ext = external ? ' target="_blank" rel="noopener"' : '';
      return '<a class="' + cls + '" href="' + href + '"' + current + ext + '>' + label + '</a>';
    }

    menu.innerHTML =
      '<div class="mm-head">' +
        '<a href="index.html" class="nav-logo"><span class="nav-logo-bar"></span>' +
        '<span>VESTLAKE<span class="nav-logo-sub">AT LIBERTY PARK</span></span></a>' +
        '<button class="mm-close" type="button" aria-label="Close menu">' +
          '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="mm-body">' +
        '<p class="mm-label">Resident Services</p>' +
        row('https://neighborhoodmanagement.securecafe.com/residentservices/neighborhood-management/userlogin.aspx', 'Pay HOA Dues', 'mm-cta', true) +
        row('https://www.arctracker.com/vestlake', 'Submit ARC Request', 'mm-row', true) +
        row('https://vestlakepool.youcanbook.me/', 'Reserve the Pool Pavilion', 'mm-row', true) +
        '<p class="mm-label">Explore</p>' +
        row('index.html', 'Home', 'mm-row') +
        row('calendar.html', 'Calendar', 'mm-row') +
        row('newsletters.html', 'Newsletters', 'mm-row') +
        row('documents.html', 'Documents', 'mm-row') +
        row('resources.html', 'Community Resources', 'mm-row') +
      '</div>' +
      '<div class="mm-foot">' +
        '<a href="resources.html#hoa-contact">Contact the Board</a>' +
        '<span>Vestavia Hills, Alabama</span>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(menu);
    var closeBtn = menu.querySelector('.mm-close');

    function openMenu() {
      overlay.hidden = false;
      menu.hidden = false;
      requestAnimationFrame(function () {
        overlay.classList.add('visible');
        menu.classList.add('open');
      });
      document.body.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      closeBtn.focus();
    }
    function closeMenu() {
      overlay.classList.remove('visible');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      setTimeout(function () { overlay.hidden = true; menu.hidden = true; }, 250);
      toggle.focus();
    }

    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') closeMenu(); else openMenu();
    });
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) closeMenu();
      // simple focus trap while the drawer is open
      if (e.key === 'Tab' && !menu.hidden) {
        var focusables = menu.querySelectorAll('a[href], button');
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    menu.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && !a.target) closeMenu(); // same-tab navigation: release scroll lock
    });
  }

  /* ===== Document search (documents.html) ===== */
  var search = document.getElementById('docSearch');
  if (search) {
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      var anyVisible = false;
      document.querySelectorAll('.doc-category').forEach(function (cat) {
        var visibleRows = 0;
        cat.querySelectorAll('.doc-row').forEach(function (r) {
          var show = !q || r.textContent.toLowerCase().indexOf(q) !== -1;
          r.style.display = show ? '' : 'none';
          if (show) visibleRows++;
        });
        var hasRows = cat.querySelectorAll('.doc-row').length > 0;
        cat.style.display = (hasRows && visibleRows === 0) ? 'none' : '';
        if (visibleRows > 0 || !hasRows) anyVisible = true;
      });
      var empty = document.getElementById('docSearchEmpty');
      if (empty) empty.hidden = anyVisible || !q;
    });
  }
})();
