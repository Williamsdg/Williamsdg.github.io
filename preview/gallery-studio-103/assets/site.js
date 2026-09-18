/* Gallery Studio 103 — concept · Williams Digital
   The drawn line: a single gesture that threads the page, drawn on scroll. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- sticky header ---- */
  var hdr = document.getElementById("hdr");
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle("stuck", window.scrollY > 12); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- mobile nav ---- */
  var tog = document.querySelector(".navtoggle"), nav = document.getElementById("nav");
  if (tog && nav) {
    var sync = function () {
      var wide = window.innerWidth > 940;
      if (wide) { nav.hidden = false; tog.setAttribute("aria-expanded", "false"); }
      else if (tog.getAttribute("aria-expanded") !== "true") { nav.hidden = true; }
    };
    tog.addEventListener("click", function () {
      var open = tog.getAttribute("aria-expanded") === "true";
      tog.setAttribute("aria-expanded", String(!open));
      nav.hidden = open;
    });
    window.addEventListener("resize", sync);
    sync();
  }

  /* ---- reveal on scroll ----
     Never allowed to leave content invisible: a hash load reveals everything up front,
     and a failsafe sweeps anything the observer missed. */
  var rev = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var showAll = function () { rev.forEach(function (el) { el.classList.add("in"); }); };
  if (rev.length) {
    if (reduce || !("IntersectionObserver" in window) || location.hash) {
      showAll();
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
      rev.forEach(function (el) { io.observe(el); });
      var sweep = function () {
        rev.forEach(function (el) {
          if (el.classList.contains("in")) return;
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 1.25) el.classList.add("in");
        });
      };
      window.addEventListener("load", function () { setTimeout(sweep, 350); });
      window.addEventListener("hashchange", showAll);
      setTimeout(sweep, 2500);
    }
  }

  /* ---- drawn rules: a hand stroke that draws itself when it arrives ---- */
  var rules = document.querySelectorAll(".drawn-rule path, .flourish path");
  if (rules.length) {
    rules.forEach(function (p) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = reduce ? 0 : len;
    });
    if (!reduce && "IntersectionObserver" in window) {
      var io2 = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var p = e.target;
          p.style.transition = "stroke-dashoffset 1.5s cubic-bezier(.3,.05,.2,1)";
          p.style.strokeDashoffset = 0;
          io2.unobserve(p);
        });
      }, { threshold: 0.3 });
      rules.forEach(function (p) { io2.observe(p); });
    }
  }

  /* ---- the spine: one continuous line down the page, drawn by scroll ---- */
  var spinePath = document.querySelector(".spine path");
  if (spinePath && !reduce) {
    var slen = spinePath.getTotalLength();
    spinePath.style.strokeDasharray = slen;
    spinePath.style.strokeDashoffset = slen;
    var ticking = false;
    var draw = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var prog = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      spinePath.style.strokeDashoffset = slen * (1 - prog);
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(draw); }
    }, { passive: true });
    window.addEventListener("resize", draw);
    draw();
  } else if (spinePath) {
    spinePath.style.opacity = ".25";
  }

  /* ---- demo forms: nothing is sent from a concept ---- */
  document.querySelectorAll("form[data-demo]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = f.querySelector(".ok");
      if (!msg) {
        msg = document.createElement("div");
        msg.className = "ok";
        f.insertBefore(msg, f.firstChild);
      }
      msg.textContent = f.dataset.demo;
      msg.setAttribute("role", "status");
      f.reset();
      msg.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ---- year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
