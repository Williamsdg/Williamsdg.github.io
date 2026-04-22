// Shared app chrome — mobile sidebar toggle, active nav highlight
(function () {
  const sidebar = document.querySelector('.app-sidebar');
  const backdrop = document.querySelector('.app-backdrop');
  const menuBtns = document.querySelectorAll('[data-toggle-sidebar]');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    backdrop && backdrop.classList.add('open');
  }
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    backdrop && backdrop.classList.remove('open');
  }
  menuBtns.forEach(b => b.addEventListener('click', openSidebar));
  backdrop && backdrop.addEventListener('click', closeSidebar);
  document.querySelectorAll('.app-sidebar a').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth <= 820) closeSidebar();
  }));

  // Close on resize up
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeSidebar();
  });
})();

// Marketing page mobile menu
(function () {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });
})();
