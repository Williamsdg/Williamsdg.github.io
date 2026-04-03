/* ============================================
   SELECTIVE MANAGEMENT SERVICES
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
