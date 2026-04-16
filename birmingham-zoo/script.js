/* ============================================================
   Birmingham Zoo — Redesign JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // === Sticky header shadow on scroll ===
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // === Mobile menu ===
  const toggle = document.getElementById('mobileMenuToggle');
  const overlay = document.getElementById('mobileNavOverlay');
  const closeBtn = document.getElementById('mobileNavClose');

  function openMobile() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (toggle) toggle.addEventListener('click', openMobile);
  if (closeBtn) closeBtn.addEventListener('click', closeMobile);
  if (overlay) overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMobile();
  });

  // Mobile sub-menu toggles
  document.querySelectorAll('.mobile-nav-parent').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-toggle');
      if (targetId) {
        e.preventDefault();
        link.closest('.mobile-nav-group').classList.toggle('open');
      }
    });
  });

  // Close mobile on link click (non-parent)
  document.querySelectorAll('.mobile-nav-sub a, .mobile-nav-actions a').forEach(a => {
    a.addEventListener('click', closeMobile);
  });

  // === Scroll animation (IntersectionObserver) ===
  const animatedElements = document.querySelectorAll(
    '.exhibit-card, .experience-card, .event-card, .edu-card, .tip-card, .animal-card, .info-card'
  );

  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Find sibling index for stagger
          const parent = entry.target.parentElement;
          const siblings = Array.from(parent.children);
          const idx = siblings.indexOf(entry.target);
          entry.target.style.animationDelay = `${idx * 0.08}s`;
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

  // When animation class is added, unpause
  const style = document.createElement('style');
  style.textContent = '.animate-in { animation-play-state: running !important; }';
  document.head.appendChild(style);

  // === Active nav highlight ===
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.style.color = '#2E7D32';
      link.style.fontWeight = '600';
    }
  });

  // === Smooth scroll for hash links ===
  document.querySelectorAll('a[href^="#"], a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      const hash = href.substring(hashIndex);
      const page = href.substring(0, hashIndex);
      const currentFile = window.location.pathname.split('/').pop();

      // Only smooth-scroll if same page
      if (!page || page === currentFile || page === 'index.html') {
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          closeMobile();
        }
      }
    });
  });

  // === Keyboard navigation for dropdowns ===
  document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');
    const dropdownLinks = dropdown ? dropdown.querySelectorAll('a') : [];

    link.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && dropdownLinks.length > 0) {
        e.preventDefault();
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateX(-50%) translateY(8px)';
        dropdownLinks[0].focus();
      }
    });

    dropdownLinks.forEach((dLink, idx) => {
      dLink.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' && idx < dropdownLinks.length - 1) {
          e.preventDefault();
          dropdownLinks[idx + 1].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (idx > 0) {
            dropdownLinks[idx - 1].focus();
          } else {
            link.focus();
          }
        } else if (e.key === 'Escape') {
          dropdown.style.opacity = '';
          dropdown.style.visibility = '';
          dropdown.style.transform = '';
          link.focus();
        }
      });
    });
  });
});
