/* Shared interactions across Bahamas preview pages */

// Reveal sections on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal, section, .island, .plan-card, .exp, .junk-card, .plan-strip').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// Interest chip toggle (newsletter)
document.querySelectorAll('.news-form .chip').forEach(c => {
  c.addEventListener('click', () => c.classList.toggle('on'));
});

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const navUl = document.querySelector('nav ul');
if (menuBtn && navUl) {
  menuBtn.addEventListener('click', () => {
    navUl.classList.toggle('open');
  });
}

// Mark current nav link active by data-page attribute on <body>
const page = document.body.dataset.page;
if (page) {
  document.querySelectorAll(`nav a[data-link="${page}"]`).forEach(a => a.classList.add('active'));
}
