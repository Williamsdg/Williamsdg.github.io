/* ═══════════════════════════════════════════════════════
   Magical Animations — Sparkles, Wand Trail, Effects
   ═══════════════════════════════════════════════════════ */

(function() {
  // Check reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ─── Sparkle Hover Effect ───
  var sparkleTargets = document.querySelectorAll(
    '.btn, .feature-card, .blog-card, .social-link, .donate-amount'
  );

  function createSparkle(x, y) {
    var types = ['sparkle-gold', 'sparkle-white', 'sparkle-star'];
    var type = types[Math.floor(Math.random() * types.length)];

    var sparkle = document.createElement('div');
    sparkle.className = 'sparkle ' + type;
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';

    // Random direction
    var angle = Math.random() * Math.PI * 2;
    var distance = 20 + Math.random() * 30;
    sparkle.style.setProperty('--sx', Math.cos(angle) * distance + 'px');
    sparkle.style.setProperty('--sy', Math.sin(angle) * distance + 'px');

    document.body.appendChild(sparkle);
    sparkle.addEventListener('animationend', function() {
      sparkle.remove();
    });
  }

  sparkleTargets.forEach(function(el) {
    el.addEventListener('mouseenter', function(e) {
      var rect = el.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;

      // Spawn 4-6 sparkles
      var count = 4 + Math.floor(Math.random() * 3);
      for (var i = 0; i < count; i++) {
        setTimeout(function() {
          createSparkle(
            centerX + (Math.random() - 0.5) * rect.width * 0.6,
            centerY + (Math.random() - 0.5) * rect.height * 0.6
          );
        }, i * 50);
      }
    });
  });

  // ─── Wand Cursor Trail (Hero section only, desktop) ───
  var hero = document.querySelector('.hero');
  if (hero && window.innerWidth > 768) {
    var lastTrailTime = 0;
    var TRAIL_THROTTLE = 40; // ms between trail dots

    hero.addEventListener('mousemove', function(e) {
      var now = Date.now();
      if (now - lastTrailTime < TRAIL_THROTTLE) return;
      lastTrailTime = now;

      var trail = document.createElement('div');
      trail.className = 'wand-trail';
      trail.style.left = e.pageX + 'px';
      trail.style.top = e.pageY + 'px';
      document.body.appendChild(trail);

      setTimeout(function() {
        trail.remove();
      }, 700);
    });
  }

  // ─── Parallax on Scroll (subtle, desktop only) ───
  if (window.innerWidth > 768) {
    var parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length > 0) {
      window.addEventListener('scroll', function() {
        var scrolled = window.scrollY;
        parallaxElements.forEach(function(el) {
          var speed = parseFloat(el.dataset.parallax) || 0.3;
          el.style.transform = 'translateY(' + scrolled * speed + 'px)';
        });
      });
    }
  }
})();
