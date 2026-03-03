/* ═══════════════════════════════════════════
   Harris Robinson Construction - Main JS
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navigation: scroll effect ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll-triggered reveals (Intersection Observer) ── */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ── Animated counters ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ── Parallax hero backgrounds + video ── */
  const heroBgs = document.querySelectorAll('.hero-bg');
  const heroVideos = document.querySelectorAll('.hero-video');
  if ((heroBgs.length > 0 || heroVideos.length > 0) && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBgs.forEach(bg => {
        bg.style.transform = `scale(1.1) translateY(${scrollY * 0.3}px)`;
      });
      heroVideos.forEach(vid => {
        vid.style.transform = `scale(1.1) translateY(${scrollY * 0.3}px)`;
      });
    }, { passive: true });
  }

  /* ── Portfolio filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card, i) => {
          const category = card.getAttribute('data-category');
          const show = filter === 'all' || category === filter;

          card.style.transition = 'opacity 0.4s, transform 0.4s';
          if (show) {
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, i * 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => { card.style.display = 'none'; }, 400);
          }
        });
      });
    });
  }

  /* ── Lightbox ── */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('.lightbox-img');
    const lbCounter = lightbox.querySelector('.lightbox-counter');
    const lbClose = lightbox.querySelector('.lightbox-close');
    const lbPrev = lightbox.querySelector('.lightbox-prev');
    const lbNext = lightbox.querySelector('.lightbox-next');

    let currentImages = [];
    let currentIndex = 0;

    // Open lightbox from project cards
    document.querySelectorAll('.project-card[data-images]').forEach(card => {
      card.addEventListener('click', () => {
        const images = JSON.parse(card.getAttribute('data-images'));
        const title = card.querySelector('h3')?.textContent || '';
        currentImages = images;
        currentIndex = 0;
        showImage();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function showImage() {
      if (!lbImg || currentImages.length === 0) return;
      lbImg.src = currentImages[currentIndex];
      if (lbCounter) {
        lbCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
      }
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      showImage();
    });
    if (lbNext) lbNext.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % currentImages.length;
      showImage();
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
      if (e.key === 'ArrowRight' && lbNext) lbNext.click();
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* ── Loading screen (index.html only) ── */
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    const phrases = ['Building', 'Measuring', 'Crafting', 'Finishing'];
    let phraseIndex = 0;
    let progress = 0;

    const progressInterval = setInterval(() => {
      const speed = progress < 30 ? 1.2 : progress < 70 ? 0.6 : 1.5;
      progress = Math.min(100, progress + speed);
      if (progressFill) progressFill.style.width = progress + '%';

      const newIndex = Math.floor((progress / 100) * phrases.length);
      if (newIndex !== phraseIndex && newIndex < phrases.length) {
        phraseIndex = newIndex;
        if (progressText) {
          progressText.style.opacity = '0';
          setTimeout(() => {
            progressText.textContent = phrases[phraseIndex];
            progressText.style.opacity = '1';
          }, 200);
        }
      }

      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          loadingScreen.classList.add('fade-out');
          document.body.style.overflow = '';
        }, 400);
      }
    }, 50);

    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
  }

});
