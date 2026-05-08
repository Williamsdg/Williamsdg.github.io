/* ============================================
   LIBERTY PARK MANAGEMENT SERVICES
   Shared Portal JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initTabs();
  initModals();
  initDropdowns();
  initSearch();
  initScrollAnimations();
  initTooltips();
});

/* --- Sidebar --- */
function initSidebar() {
  const toggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      overlay?.classList.toggle('open', isOpen);
      toggle.innerHTML = isOpen
        ? '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

  // Close sidebar on link click (mobile)
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) closeSidebar();
    });
  });
}

function closeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const toggle = document.querySelector('.sidebar-toggle');
  sidebar?.classList.remove('open');
  overlay?.classList.remove('open');
  if (toggle) {
    toggle.innerHTML = '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
  }
}

/* --- Tabs --- */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabBar => {
    const tabs = tabBar.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        if (!targetId) return;

        // Deactivate siblings
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Find the parent content area and toggle panels
        const contentArea = tabBar.nextElementSibling || tabBar.parentElement;
        const panels = contentArea.querySelectorAll('.tab-panel');
        panels.forEach(panel => {
          panel.style.display = panel.id === targetId ? '' : 'none';
        });
      });
    });
  });
}

/* --- Modals --- */
function initModals() {
  // Open modal
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modal = document.getElementById(trigger.dataset.modal);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', () => {
      const modal = el.closest('.modal');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(modal => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });
}

/* --- Dropdowns --- */
function initDropdowns() {
  document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = trigger.nextElementSibling;
      const isOpen = dropdown?.classList.toggle('open');

      // Close other dropdowns
      document.querySelectorAll('.dropdown-menu.open').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
      });
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu.open').forEach(d => d.classList.remove('open'));
  });
}

/* --- Search Filter --- */
function initSearch() {
  document.querySelectorAll('[data-search-input]').forEach(input => {
    const targetId = input.dataset.searchInput;
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase();
      const target = document.getElementById(targetId);
      if (!target) return;

      target.querySelectorAll('[data-searchable]').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? '' : 'none';
      });
    });
  });
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

/* --- Tooltips --- */
function initTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.style.position = 'relative';
    el.addEventListener('mouseenter', () => {
      const tip = document.createElement('div');
      tip.className = 'tooltip-popup';
      tip.textContent = el.dataset.tooltip;
      tip.style.cssText = 'position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#0D1B2A;color:#fff;padding:6px 12px;border-radius:6px;font-size:12px;white-space:nowrap;z-index:1000;pointer-events:none;animation:fadeIn 0.15s ease;';
      el.appendChild(tip);
    });
    el.addEventListener('mouseleave', () => {
      el.querySelector('.tooltip-popup')?.remove();
    });
  });
}

/* --- Utility: Toast Notification --- */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const colors = {
    success: '#2E7D6F',
    error: '#C0392B',
    warning: '#D4943A',
    info: '#2980B9'
  };
  const icons = {
    success: '&#10003;',
    error: '&#10007;',
    warning: '&#9888;',
    info: '&#8505;'
  };
  toast.innerHTML = `<span style="margin-right:8px">${icons[type]}</span>${message}`;
  toast.style.cssText = `position:fixed;bottom:24px;right:24px;background:${colors[type]};color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:500;z-index:10000;display:flex;align-items:center;box-shadow:0 8px 32px rgba(0,0,0,0.15);animation:fadeInUp 0.3s ease;font-family:'Inter',sans-serif;`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* --- Utility: Confirm Dialog --- */
function showConfirm(message, onConfirm) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;font-family:"Inter",sans-serif;';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:24px;max-width:400px;width:100%;box-shadow:0 24px 64px rgba(0,0,0,0.2);">
      <h4 style="margin-bottom:8px;color:#0D1B2A;font-family:'Plus Jakarta Sans',sans-serif;">Confirm Action</h4>
      <p style="color:#3A4A5C;margin-bottom:20px;font-size:14px;line-height:1.5;">${message}</p>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button class="confirm-cancel" style="padding:8px 16px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;border:1.5px solid #E2DFD8;background:#fff;color:#3A4A5C;">Cancel</button>
        <button class="confirm-ok" style="padding:8px 16px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;background:#C8A254;color:#0F1D35;border:none;">Confirm</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelector('.confirm-cancel').addEventListener('click', () => modal.remove());
  modal.querySelector('.confirm-ok').addEventListener('click', () => { modal.remove(); onConfirm(); });
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

/* --- Utility: Format Currency --- */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

/* --- Utility: Format Date --- */
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* --- Utility: Relative Time --- */
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = { year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60 };
  for (const [unit, secs] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secs);
    if (interval >= 1) return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

/* ===========================================================
   COMMAND PALETTE — Cmd+K / Ctrl+K global search across portal
   =========================================================== */
(function() {
  if (window.__lpCmdK) return;
  window.__lpCmdK = true;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {
    var isStaff = /\/staff\//.test(location.pathname);
    var isMember = /\/member\//.test(location.pathname);
    if (!isStaff && !isMember) return;

    var staffNav = [
      { type: 'page', label: 'Dashboard', desc: 'Staff overview, KPIs, weekly snapshot', url: 'index.html' },
      { type: 'page', label: 'Calendar', desc: 'Events and reservations', url: 'calendar.html' },
      { type: 'page', label: 'Communities', desc: '15 neighborhoods, health scores', url: 'communities.html' },
      { type: 'page', label: 'Residents', desc: '1,547 homeowner records', url: 'residents.html' },
      { type: 'page', label: 'Work Orders', desc: 'Maintenance tasks and vendor assignments', url: 'work-orders.html' },
      { type: 'page', label: 'Compliance', desc: 'Violations and CC&R notices', url: 'compliance.html' },
      { type: 'page', label: 'Communications', desc: 'Send announcements and notices', url: 'communications.html' },
      { type: 'page', label: 'ARC Review', desc: 'Architectural review committee', url: 'arc-review.html' },
      { type: 'page', label: 'Amenities', desc: 'Pool, clubhouse, sports complex', url: 'amenities.html' },
      { type: 'page', label: 'Documents', desc: 'Governing documents and forms', url: 'documents.html' },
      { type: 'page', label: 'Reports', desc: 'Financial, compliance, ARC reports', url: 'reports.html' },
      { type: 'page', label: 'Financials', desc: 'Revenue, AR aging, by-neighborhood', url: 'financials.html' },
      { type: 'page', label: 'Audit Log', desc: 'Tamper-evident log of staff actions', url: 'audit-log.html' }
    ];
    var memberNav = [
      { type: 'page', label: 'Dashboard', desc: 'Account overview and quick actions', url: 'index.html' },
      { type: 'page', label: 'My Account', desc: 'Profile, household, vehicles, pets', url: 'account.html' },
      { type: 'page', label: 'Payments', desc: 'Pay dues, history, auto-pay, plan', url: 'payments.html' },
      { type: 'page', label: 'Maintenance', desc: 'Submit and track maintenance requests', url: 'maintenance.html' },
      { type: 'page', label: 'Community', desc: 'Events, news, community info', url: 'community.html' },
      { type: 'page', label: 'Documents', desc: 'Governing documents and forms', url: 'documents.html' },
      { type: 'page', label: 'Services', desc: 'Reserve clubhouse, request access devices', url: 'services.html' },
      { type: 'page', label: 'Messages', desc: 'Direct messages with staff', url: 'messages.html' },
      { type: 'page', label: 'Neighbor Connect', desc: 'Community marketplace and posts', url: 'neighbor-connect.html' }
    ];
    var nav = isStaff ? staffNav : memberNav;

    var actions = isStaff ? [
      { type: 'action', label: 'Send Announcement', desc: 'Notify residents by email/portal/SMS', url: 'communications.html' },
      { type: 'action', label: 'Generate Report', desc: 'Run a financial or compliance report', url: 'reports.html' },
      { type: 'action', label: 'New Work Order', desc: 'Create a maintenance work order', url: 'work-orders.html' },
      { type: 'action', label: 'Review ARC Request', desc: 'Approve or deny architectural request', url: 'arc-review.html' }
    ] : [
      { type: 'action', label: 'Pay Dues', desc: 'Make a one-time payment', url: 'payments.html' },
      { type: 'action', label: 'Set Up Auto-Pay', desc: 'Automate quarterly assessments', url: 'payments.html#autopay' },
      { type: 'action', label: 'Request Payment Plan', desc: 'Spread past-due balance over installments', url: 'payments.html#plan' },
      { type: 'action', label: 'Submit Maintenance Request', desc: 'Report an issue with photos', url: 'maintenance.html' },
      { type: 'action', label: 'Reserve Clubhouse', desc: 'Book the clubhouse for an event', url: 'services.html#clubhouse' }
    ];

    var residentItems = [];
    var communityItems = [];
    if (window.LPMS) {
      if (LPMS.residents) {
        residentItems = LPMS.residents.slice(0, 80).map(function(r) {
          return {
            type: 'resident',
            label: r.firstName + ' ' + r.lastName,
            desc: r.address + ' · ' + r.communityName,
            url: isStaff ? 'residents.html' : 'community.html'
          };
        });
      }
      if (LPMS.communities) {
        communityItems = LPMS.communities.map(function(c) {
          return {
            type: 'community',
            label: c.name,
            desc: c.homes + ' homes · ' + c.location,
            url: isStaff ? 'communities.html' : 'community.html'
          };
        });
      }
    }

    var allItems = nav.concat(actions, communityItems, residentItems);

    var styleEl = document.createElement('style');
    styleEl.textContent = ''
      + '#cmdk-overlay { position: fixed; inset: 0; background: rgba(13,20,35,0.5); backdrop-filter: blur(4px); z-index: 500; display: none; align-items: flex-start; justify-content: center; padding-top: 12vh; padding-left: 12px; padding-right: 12px; }'
      + '#cmdk-overlay.open { display: flex; }'
      + '#cmdk-shell { width: min(620px, 100%); background: white; border-radius: 14px; box-shadow: 0 30px 80px rgba(0,0,0,0.4); overflow: hidden; }'
      + '#cmdk-input-wrap { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #E5DDC8; }'
      + '#cmdk-input-wrap svg { color: #888; flex-shrink: 0; }'
      + '#cmdk-input { flex: 1; border: none; outline: none; font-size: 16px; font-family: inherit; padding: 4px 0; background: transparent; color: #0D1B2A; }'
      + '#cmdk-input::placeholder { color: #999; }'
      + '#cmdk-hint { font-size: 11px; color: #999; background: #F4F4F5; padding: 3px 8px; border-radius: 4px; font-family: monospace; }'
      + '#cmdk-list { max-height: 50vh; overflow-y: auto; padding: 6px 0; }'
      + '.cmdk-section { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; font-weight: 700; padding: 12px 18px 4px; }'
      + '.cmdk-item { display: flex; align-items: center; gap: 12px; padding: 9px 18px; cursor: pointer; transition: background 0.1s; }'
      + '.cmdk-item.active, .cmdk-item:hover { background: #F5F1EA; }'
      + '.cmdk-item-icon { width: 28px; height: 28px; border-radius: 6px; background: #F8F6F1; display: flex; align-items: center; justify-content: center; color: #1B2A4A; flex-shrink: 0; font-size: 12px; font-weight: 700; }'
      + '.cmdk-item-icon.resident { background: rgba(46,125,111,0.1); color: #2E7D6F; }'
      + '.cmdk-item-icon.community { background: rgba(200,162,84,0.12); color: #C8A254; }'
      + '.cmdk-item-icon.action { background: rgba(27,42,74,0.08); color: #1B2A4A; }'
      + '.cmdk-item-text { flex: 1; min-width: 0; }'
      + '.cmdk-item-label { font-weight: 600; color: #0D1B2A; font-size: 13.5px; }'
      + '.cmdk-item-desc { font-size: 12px; color: #6B7B8D; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }'
      + '.cmdk-item-arrow { color: #ccc; font-size: 14px; }'
      + '.cmdk-item.active .cmdk-item-arrow { color: #C8A254; }'
      + '#cmdk-empty { padding: 32px 18px; text-align: center; color: #888; font-size: 13.5px; }'
      + '#cmdk-footer { padding: 8px 18px; border-top: 1px solid #E5DDC8; display: flex; justify-content: space-between; font-size: 11px; color: #999; background: #FAFAFA; }'
      + '#cmdk-footer kbd { background: white; border: 1px solid #ddd; border-radius: 3px; padding: 1px 5px; font-family: monospace; font-size: 10px; margin: 0 1px; }';
    document.head.appendChild(styleEl);

    var overlay = document.createElement('div');
    overlay.id = 'cmdk-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = ''
      + '<div id="cmdk-shell">'
      +   '<div id="cmdk-input-wrap">'
      +     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
      +     '<input type="text" id="cmdk-input" placeholder="Search residents, pages, actions..." autocomplete="off" autocorrect="off" spellcheck="false">'
      +     '<span id="cmdk-hint">esc</span>'
      +   '</div>'
      +   '<div id="cmdk-list"></div>'
      +   '<div id="cmdk-footer">'
      +     '<span><kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> select</span>'
      +     '<span>' + (isStaff ? 'Staff Portal' : 'Owner Portal') + '</span>'
      +   '</div>'
      + '</div>';
    document.body.appendChild(overlay);

    var input = overlay.querySelector('#cmdk-input');
    var list = overlay.querySelector('#cmdk-list');
    var activeIndex = 0;
    var filtered = allItems.slice(0, 30);

    function iconFor(item) {
      if (item.type === 'resident') return '<span class="cmdk-item-icon resident">' + (item.label[0] || '?') + '</span>';
      if (item.type === 'community') return '<span class="cmdk-item-icon community"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></span>';
      if (item.type === 'action') return '<span class="cmdk-item-icon action"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg></span>';
      return '<span class="cmdk-item-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></span>';
    }

    function escapeHtml(s) {
      return String(s || '').replace(/[&<>"']/g, function(c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
    }

    function render() {
      if (filtered.length === 0) {
        list.innerHTML = '<div id="cmdk-empty">No results. Try another query.</div>';
        return;
      }
      var groups = { page: 'Pages', action: 'Actions', community: 'Communities', resident: 'Residents' };
      var html = '';
      var lastType = null;
      filtered.forEach(function(item, idx) {
        if (item.type !== lastType) {
          html += '<div class="cmdk-section">' + (groups[item.type] || item.type) + '</div>';
          lastType = item.type;
        }
        html += '<div class="cmdk-item' + (idx === activeIndex ? ' active' : '') + '" data-idx="' + idx + '">'
          + iconFor(item)
          + '<div class="cmdk-item-text"><div class="cmdk-item-label">' + escapeHtml(item.label) + '</div><div class="cmdk-item-desc">' + escapeHtml(item.desc) + '</div></div>'
          + '<span class="cmdk-item-arrow">→</span>'
          + '</div>';
      });
      list.innerHTML = html;
      list.querySelectorAll('.cmdk-item').forEach(function(el) {
        el.addEventListener('click', function() {
          var item = filtered[parseInt(el.dataset.idx)];
          if (item) navigate(item);
        });
      });
      var activeEl = list.querySelector('.cmdk-item.active');
      if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
    }

    function filter(query) {
      var q = (query || '').toLowerCase().trim();
      if (!q) { filtered = allItems.slice(0, 30); }
      else {
        filtered = allItems.filter(function(item) {
          return (item.label + ' ' + item.desc).toLowerCase().indexOf(q) > -1;
        }).slice(0, 30);
      }
      activeIndex = 0;
      render();
    }

    function navigate(item) {
      close();
      if (item.url) location.href = item.url;
    }

    function open() {
      overlay.classList.add('open');
      document.body.classList.add('modal-open');
      input.value = '';
      filter('');
      setTimeout(function() { input.focus(); }, 50);
    }
    function close() {
      overlay.classList.remove('open');
      document.body.classList.remove('modal-open');
    }

    input.addEventListener('input', function() { filter(input.value); });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIndex]) navigate(filtered[activeIndex]); }
    });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (overlay.classList.contains('open')) close(); else open();
      }
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    // First-time hint
    try {
      if (!localStorage.getItem('lp_cmdk_seen')) {
        var hint = document.createElement('div');
        hint.style.cssText = 'position:fixed;bottom:18px;right:18px;background:#1B2A4A;color:white;padding:9px 14px;border-radius:8px;font-size:12px;font-family:Inter,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.25);z-index:400;cursor:pointer;display:flex;align-items:center;gap:8px;';
        hint.innerHTML = 'Press <kbd style="background:rgba(255,255,255,0.15);padding:2px 6px;border-radius:3px;font-family:monospace;font-size:11px;">⌘K</kbd> to search anything';
        hint.addEventListener('click', open);
        document.body.appendChild(hint);
        setTimeout(function() {
          hint.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          hint.style.opacity = '0';
          hint.style.transform = 'translateY(8px)';
          setTimeout(function() { if (hint.parentNode) hint.remove(); }, 600);
        }, 6000);
        localStorage.setItem('lp_cmdk_seen', '1');
      }
    } catch (e) {}
  });
})();
