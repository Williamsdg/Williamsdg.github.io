/* ═══════════════════════════════════════════════════════
   Marauder's Map Loading Screen Controller
   ═══════════════════════════════════════════════════════ */

(function() {
  const map = document.getElementById('maraudersMap');
  const siteWrapper = document.getElementById('siteWrapper');
  const skipBtn = document.getElementById('mapSkip');

  if (!map || !siteWrapper) return;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skip intro if already seen this session or reduced motion
  if (sessionStorage.getItem('hp-intro-seen') || prefersReducedMotion) {
    map.classList.add('hidden');
    siteWrapper.classList.add('visible');
    document.body.style.overflow = '';
    return;
  }

  // Lock scroll during intro
  document.body.style.overflow = 'hidden';

  // Phase timers
  const timers = [];

  function addTimer(fn, delay) {
    timers.push(setTimeout(fn, delay));
  }

  function completeIntro() {
    // Clear any pending timers
    timers.forEach(clearTimeout);

    map.classList.add('hidden');
    siteWrapper.classList.add('visible');
    document.body.style.overflow = '';
    sessionStorage.setItem('hp-intro-seen', 'true');
  }

  // Phase sequence
  // 0-0.5s: Parchment fades in
  addTimer(function() {
    map.classList.add('phase-parchment');
  }, 100);

  // 0.5-2s: Ink lines draw
  addTimer(function() {
    map.classList.add('phase-ink');
  }, 600);

  // 1.5-3s: Footsteps appear
  addTimer(function() {
    map.classList.add('phase-footsteps');
  }, 1600);

  // 2.5-4.5s: Oath text types
  addTimer(function() {
    map.classList.add('phase-oath');
  }, 2600);

  // 4.8s: Hide oath, show title
  addTimer(function() {
    var oath = document.getElementById('mapOath');
    if (oath) oath.style.opacity = '0';
    map.classList.add('phase-title');
  }, 5000);

  // 6s: Fold open
  addTimer(function() {
    map.classList.add('phase-open');
  }, 6200);

  // 7.2s: Complete
  addTimer(function() {
    completeIntro();
  }, 7400);

  // Skip button
  if (skipBtn) {
    skipBtn.addEventListener('click', completeIntro);
  }

  // Also skip on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      completeIntro();
    }
  });
})();
