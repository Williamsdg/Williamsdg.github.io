/* ============================================
   Auburn Business Network - Shared Utilities
   ============================================ */

// SVG Icons used throughout the site
const ICONS = {
  location: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  arrow: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  lock: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  external: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  directions: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`
};

// Industry-specific icons (inline SVGs for card/modal headers)
const INDUSTRY_ICONS = {
  'Construction': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18l5-5 2 2-5 5z"/><path d="M7 13l3-3 2 2-3 3z"/><path d="M14 6l4-4 4 4-4 4z"/><path d="M10 10l4-4"/></svg>`,
  'Financial Services': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  'Food & Beverage': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  'Real Estate': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  'Technology': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  'Legal': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v19"/><path d="M5 8l7-5 7 5"/><path d="M3 18h18"/><path d="M4 21h16"/></svg>`,
  'Home Services': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  'Creative Services': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
  'Automotive': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M12 17h-3m8 0h2"/></svg>`,
  'Healthcare': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  'Marketing': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  'Health & Fitness': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  'Insurance': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  'Other': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`
};

// Auburn-branded gradient color for all cards
const AUBURN_COLOR = 'linear-gradient(135deg, #03244d 0%, #0a3a6b 60%, #F26522 100%)';

function getIndustryIcon(industry) {
  return INDUSTRY_ICONS[industry] || INDUSTRY_ICONS['Other'];
}

function getIndustryColor() {
  return AUBURN_COLOR;
}

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
});

// Create a business card HTML
function createBusinessCard(business) {
  const icon = getIndustryIcon(business.industry);
  const color = getIndustryColor(business.industry);
  const contactActions = [];

  if (business.phone) {
    contactActions.push(`<a href="tel:${business.phone}" class="contact-action" title="Call" onclick="event.stopPropagation()">${ICONS.phone}</a>`);
  }
  if (business.contact) {
    contactActions.push(`<a href="mailto:${business.contact}" class="contact-action" title="Email" onclick="event.stopPropagation()">${ICONS.email}</a>`);
  }
  if (business.website) {
    contactActions.push(`<a href="${business.website}" target="_blank" rel="noopener" class="contact-action" title="Website" onclick="event.stopPropagation()">${ICONS.globe}</a>`);
  }

  return `
    <div class="business-card" data-id="${business.id}" onclick="openBusinessModal('${business.id}')">
      <div class="card-inner">
        <div class="card-top-bar">
          <span class="card-type-badge">${business.industry}</span>
          <span class="card-we-badge">WE</span>
        </div>
        <div class="card-art" style="background:${color}">
          <div class="card-art-icon">${icon}</div>
          <div class="card-art-pattern"></div>
        </div>
        <div class="card-name-bar">
          <h3>${business.name}</h3>
          <span class="card-verified-dot" title="Auburn Verified"></span>
        </div>
        <div class="card-desc">
          <p>${business.bio}</p>
        </div>
        <div class="card-stats">
          <div class="card-stat">
            <span class="stat-icon">${ICONS.location}</span>
            <span class="stat-text">${business.location}</span>
          </div>
          <div class="card-stat">
            <span class="stat-icon">${ICONS.user}</span>
            <span class="stat-text">${business.owner}</span>
          </div>
        </div>
        <div class="card-bottom">
          <span class="card-brand">Auburn Business Network</span>
          <div class="card-contact-actions">${contactActions.join('')}</div>
        </div>
      </div>
    </div>
  `;
}

// Business detail modal
function openBusinessModal(id) {
  const business = getBusinessById(id);
  if (!business) return;

  const icon = getIndustryIcon(business.industry);
  const color = getIndustryColor(business.industry);
  const websiteLink = business.website
    ? `<a href="${business.website}" target="_blank" rel="noopener">${business.website.replace('https://', '')} ${ICONS.external}</a>`
    : 'N/A';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address || business.location)}`;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header" style="background:${color}">
        <button class="modal-close" onclick="closeModal(this)">&times;</button>
        <div class="modal-icon">${icon}</div>
        <h2>${business.name}</h2>
        <span class="modal-industry">${business.industry}</span>
      </div>
      <div class="modal-body">
        <div class="modal-info-row">
          ${ICONS.location}
          <div>
            <div class="info-label">Address</div>
            <div class="info-value">${business.address || business.location}</div>
          </div>
        </div>
        <div class="modal-info-row">
          ${ICONS.user}
          <div>
            <div class="info-label">Owner</div>
            <div class="info-value">${business.owner}</div>
          </div>
        </div>
        <div class="modal-info-row">
          ${ICONS.email}
          <div>
            <div class="info-label">Contact</div>
            <div class="info-value"><a href="mailto:${business.contact}">${business.contact}</a></div>
          </div>
        </div>
        <div class="modal-info-row">
          ${ICONS.phone}
          <div>
            <div class="info-label">Phone</div>
            <div class="info-value"><a href="tel:${business.phone}">${business.phone}</a></div>
          </div>
        </div>
        <div class="modal-info-row">
          ${ICONS.globe}
          <div>
            <div class="info-label">Website</div>
            <div class="info-value">${websiteLink}</div>
          </div>
        </div>
        <div class="modal-bio">
          <h4>About</h4>
          <p>${business.bio}</p>
        </div>
      </div>
      <div class="modal-actions">
        ${business.phone ? `<a href="tel:${business.phone}" class="btn btn-primary">Call Now ${ICONS.phone}</a>` : ''}
        ${business.website ? `<a href="${business.website}" target="_blank" rel="noopener" class="btn btn-secondary">Visit Website</a>` : ''}
        <a href="${mapsUrl}" target="_blank" rel="noopener" class="btn btn-outline">Get Directions</a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    modal.classList.add('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal.querySelector('.modal-close'));
  });

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(modal.querySelector('.modal-close'));
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

function closeModal(btn) {
  const overlay = btn.closest('.modal-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => overlay.remove(), 300);
}
