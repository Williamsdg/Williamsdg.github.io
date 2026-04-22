// Shared sidebar renderer — include on every demo app page.
// Reads data-page attribute on <body> to set active state.
(function () {
  const page = document.body.dataset.page || '';

  const nav = [
    { section: 'Community', items: [
      { key: 'feed', label: 'Home Feed', href: 'feed.html', icon: 'home', badge: '' },
      { key: 'shouts', label: 'Student Shouts', href: 'shouts.html', icon: 'megaphone', badge: '4' },
      { key: 'jobs', label: 'Ministry Jobs', href: 'jobs.html', icon: 'briefcase', badge: '12' },
      { key: 'map', label: 'Alumni Map', href: '#', icon: 'map', badge: '' },
      { key: 'events', label: 'Events', href: '#', icon: 'calendar', badge: '' },
    ]},
    { section: 'Channels', items: [
      { key: 'chat', label: 'general', href: 'chat.html', icon: 'hash', badge: '' },
      { key: 'announcements', label: 'announcements', href: 'chat.html', icon: 'hash', badge: '2' },
      { key: 'class-2023', label: 'class-of-2023', href: 'chat.html', icon: 'hash', badge: '' },
      { key: 'class-2024', label: 'class-of-2024', href: 'chat.html', icon: 'hash', badge: '' },
      { key: 'worship', label: 'worship-leaders', href: 'chat.html', icon: 'hash', badge: '' },
      { key: 'prayer', label: 'prayer', href: 'chat.html', icon: 'hash', badge: '1' },
    ]},
    { section: 'Staff', items: [
      { key: 'staff', label: 'Review Applications', href: 'staff.html', icon: 'shield', badge: '7' },
    ]},
  ];

  const icons = {
    home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    megaphone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
    briefcase: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    map: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
    calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    hash: '<span class="channel-hash">#</span>',
    shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  };

  const html = `
    <a href="index.html" class="brand">
      <div class="brand-mark">HC</div>
      <div class="brand-text">
        <div class="brand-title">ALUMNI</div>
        <div class="brand-sub">Highlands College</div>
      </div>
    </a>
    ${nav.map(sec => `
      <div class="side-section">
        <div class="side-label">${sec.section}</div>
        ${sec.items.map(it => `
          <a class="side-item ${it.key === page ? 'active' : ''}" href="${it.href}">
            <span class="icon">${icons[it.icon] || ''}</span>
            <span>${it.label}</span>
            ${it.badge ? `<span class="badge">${it.badge}</span>` : ''}
          </a>
        `).join('')}
      </div>
    `).join('')}
    <div class="side-footer">
      <div class="preview-avatar">MJ</div>
      <div>
        <div class="me-name">Marcus Jordan</div>
        <div class="me-role">Class of 2023 · Worship</div>
      </div>
    </div>
  `;

  const sidebar = document.querySelector('.app-sidebar');
  if (sidebar) sidebar.innerHTML = html;
})();
