// Mark JS as ready so reveal CSS kicks in
document.documentElement.classList.add("js-ready");

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE_POINTER = matchMedia("(hover: hover) and (pointer: fine)").matches;

const LIVE = "https://williamsdigital.io/preview/";
const ORG = "https://williams-digital.github.io/preview/";

// Featured concept slugs — shown as cards above, not repeated in the archive.
const FEATURED_SLUGS = new Set([
  "greycliff-builders", "iron-oak-hospitality", "river-city-sports-network",
  "summit-home-services", "gulf-coast-adventure-co", "deep-south-retrievers",
  "maisonverre-site", "conference-os", "pitch-it-junk-removal", "grace-table-church"
]);

// Real client work — featured in section 01, never listed in the concept archive.
const CLIENT_SLUGS = new Set(["auburn-daily"]);
const CLIENT_COUNT = 7;

const ITEMS = [
  // Other featured / case studies / utilities
  { slug: "case-study-template", name: "Case study template", cat: "utilities", host: LIVE },
  { slug: "small-hoa-pitch", name: "Small HOA pitch", cat: "civic", host: LIVE },

  // Restaurants, cafes, food
  { slug: "aurora-coffee", name: "Aurora Coffee", cat: "food", host: LIVE },
  { slug: "aurora-coffee-site", name: "Aurora Coffee — site", cat: "food", host: LIVE },
  { slug: "aurora-menu", name: "Aurora Menu", cat: "food", host: LIVE },
  { slug: "aurora-order", name: "Aurora Order", cat: "food", host: LIVE },
  { slug: "cahaba-heights-cafe", name: "Cahaba Heights Cafe", cat: "food", host: LIVE },
  { slug: "golden-lotus", name: "Golden Lotus", cat: "food", host: LIVE },
  { slug: "homewood-grill", name: "Homewood Grill", cat: "food", host: LIVE },
  { slug: "liberty-park-bistro", name: "Liberty Park Bistro", cat: "food", host: LIVE },
  { slug: "maisonverre", name: "Maisonverre", cat: "food", host: LIVE },
  { slug: "maisonverre-menu", name: "Maisonverre — menu", cat: "food", host: LIVE },
  { slug: "maisonverre-reserve", name: "Maisonverre — reserve", cat: "food", host: LIVE },
  { slug: "maisonverre-site", name: "Maisonverre — site", cat: "food", host: LIVE },
  { slug: "mountain-brook-cafe", name: "Mountain Brook Cafe", cat: "food", host: LIVE },
  { slug: "rocky-ridge-bbq", name: "Rocky Ridge BBQ", cat: "food", host: LIVE },
  { slug: "vestavia-diner", name: "Vestavia Diner", cat: "food", host: LIVE },
  { slug: "brew-and-co", name: "Brew & Co.", cat: "food", host: ORG },

  // Medical / dental / vet / wellness
  { slug: "birmingham-smile-center", name: "Birmingham Smile Center", cat: "medical", host: LIVE },
  { slug: "cedar-dental", name: "Cedar Dental", cat: "medical", host: LIVE },
  { slug: "greystone-dental", name: "Greystone Dental", cat: "medical", host: LIVE },
  { slug: "homewood-chiropractic", name: "Homewood Chiropractic", cat: "medical", host: LIVE },
  { slug: "mountain-brook-vet", name: "Mountain Brook Vet", cat: "medical", host: LIVE },
  { slug: "vestavia-pet-hospital", name: "Vestavia Pet Hospital", cat: "medical", host: LIVE },

  // Legal
  { slug: "aldridge-vance", name: "Aldridge Vance", cat: "legal", host: LIVE },
  { slug: "birmingham-dui-defense", name: "Birmingham DUI Defense", cat: "legal", host: LIVE },
  { slug: "cahaba-heights-legal", name: "Cahaba Heights Legal", cat: "legal", host: LIVE },
  { slug: "harris-robinson", name: "Harris Robinson", cat: "legal", host: LIVE },
  { slug: "homewood-law-associates", name: "Homewood Law Associates", cat: "legal", host: LIVE },
  { slug: "hoover-family-law", name: "Hoover Family Law", cat: "legal", host: LIVE },
  { slug: "mountain-brook-legal", name: "Mountain Brook Legal", cat: "legal", host: LIVE },
  { slug: "vestavia-estate-planning", name: "Vestavia Estate Planning", cat: "legal", host: LIVE },

  // Home services & trades
  { slug: "apex-auto-repair", name: "Apex Auto Repair", cat: "home", host: LIVE },
  { slug: "cahaba-heights-plumbing", name: "Cahaba Heights Plumbing", cat: "home", host: LIVE },
  { slug: "clearview-windows-site", name: "Clearview Windows", cat: "home", host: LIVE },
  { slug: "climate-air-pros-site", name: "Climate Air Pros", cat: "home", host: LIVE },
  { slug: "flowright-plumbing-site", name: "Flowright Plumbing", cat: "home", host: LIVE },
  { slug: "grainline-flooring-site", name: "Grainline Flooring", cat: "home", host: LIVE },
  { slug: "homecare-services-site", name: "Homecare Services", cat: "home", host: LIVE },
  { slug: "homewood-plumbing", name: "Homewood Plumbing", cat: "home", host: LIVE },
  { slug: "hoover-drain-plumbing", name: "Hoover Drain Plumbing", cat: "home", host: LIVE },
  { slug: "ironwood-framing-site", name: "Ironwood Framing", cat: "home", host: LIVE },
  { slug: "mountain-brook-auto", name: "Mountain Brook Auto", cat: "home", host: LIVE },
  { slug: "mountain-brook-heating", name: "Mountain Brook Heating", cat: "home", host: LIVE },
  { slug: "mountain-brook-lawn", name: "Mountain Brook Lawn", cat: "home", host: LIVE },
  { slug: "mountain-brook-plumbing", name: "Mountain Brook Plumbing", cat: "home", host: LIVE },
  { slug: "vestavia-plumbing", name: "Vestavia Plumbing", cat: "home", host: LIVE },
  { slug: "landscaping-tier1-starter", name: "Landscaping Tier 1 — Starter", cat: "home", host: LIVE },
  { slug: "landscaping-tier2-professional", name: "Landscaping Tier 2 — Pro", cat: "home", host: LIVE },
  { slug: "landscaping-tier3-premium", name: "Landscaping Tier 3 — Premium", cat: "home", host: LIVE },
  { slug: "landscaping-tier4-enterprise", name: "Landscaping Tier 4 — Enterprise", cat: "home", host: LIVE },
  { slug: "landscaping-tier5-ultimate", name: "Landscaping Tier 5 — Ultimate", cat: "home", host: LIVE },

  // Hospitality / tourism / vacation
  { slug: "aqualine-water-site", name: "Aqualine", cat: "hospitality", host: LIVE },
  { slug: "blue-ridge-orchards", name: "Blue Ridge Orchards", cat: "hospitality", host: LIVE },
  { slug: "magnolia-crest", name: "Magnolia Crest", cat: "hospitality", host: LIVE },
  { slug: "northpoint-alpine-site", name: "Northpoint Alpine", cat: "hospitality", host: LIVE },
  { slug: "sandbar-coastal-site", name: "Sandbar Coastal", cat: "hospitality", host: LIVE },
  { slug: "tourism", name: "Tourism", cat: "hospitality", host: LIVE },

  // Real estate & retail

  // Sports / NIL
  { slug: "nil-tier-starter", name: "NIL Tier — Starter", cat: "sports", host: LIVE },
  { slug: "nil-tier-pro", name: "NIL Tier — Pro", cat: "sports", host: LIVE },
  { slug: "nil-tier-elite", name: "NIL Tier — Elite", cat: "sports", host: LIVE },
  { slug: "nil-tier-enterprise", name: "NIL Tier — Enterprise", cat: "sports", host: LIVE },

  // Casting / media

  // Professional services
  { slug: "southside-court-reporting", name: "Southside Court Reporting", cat: "pro", host: LIVE },

  // Civic & local
  { slug: "alabama-candidate", name: "Alabama Candidate", cat: "civic", host: LIVE },
  { slug: "auburn-daily", name: "Auburn Daily", cat: "civic", host: ORG },

  // Dashboards
  { slug: "brick-dashboard", name: "Brick", cat: "dashboards", host: LIVE },
  { slug: "dashboards", name: "Dashboards index", cat: "dashboards", host: LIVE },
  { slug: "flooring-dashboard", name: "Flooring", cat: "dashboards", host: LIVE },
  { slug: "framing-dashboard", name: "Framing", cat: "dashboards", host: LIVE },
  { slug: "home-services-dashboard", name: "Home services", cat: "dashboards", host: LIVE },
  { slug: "hvac-dashboard", name: "HVAC", cat: "dashboards", host: LIVE },
  { slug: "hvac-portal", name: "HVAC portal", cat: "dashboards", host: LIVE },
  { slug: "job-tracker", name: "Job tracker", cat: "dashboards", host: LIVE },
  { slug: "landscaping-dashboard", name: "Landscaping", cat: "dashboards", host: LIVE },
  { slug: "plumbing-dashboard", name: "Plumbing", cat: "dashboards", host: LIVE },
  { slug: "power-dashboard", name: "Power", cat: "dashboards", host: LIVE },
  { slug: "roofing-dashboard", name: "Roofing", cat: "dashboards", host: LIVE },
  { slug: "sheetrock-dashboard", name: "Sheetrock", cat: "dashboards", host: LIVE },
  { slug: "staff-portal", name: "Staff portal", cat: "dashboards", host: LIVE },
  { slug: "water-dashboard", name: "Water", cat: "dashboards", host: LIVE },
  { slug: "windows-dashboard", name: "Windows", cat: "dashboards", host: LIVE },

  // Contracts / utilities
  { slug: "estimate-view", name: "Estimate view", cat: "utilities", host: LIVE },
  { slug: "hero", name: "Hero", cat: "utilities", host: LIVE },
  { slug: "jeh-green-cream", name: "JEH — green/cream", cat: "utilities", host: LIVE },
  { slug: "jeh-navy-gold", name: "JEH — navy/gold", cat: "utilities", host: LIVE },
  { slug: "pco-plan-viewer", name: "PCO plan viewer", cat: "utilities", host: LIVE },
];

// ---- Banner title: split lines into words for blur-stagger reveal ----
(() => {
  const title = document.getElementById("bannerTitle");
  if (!title) return;
  let i = 0;
  title.querySelectorAll(".line").forEach(line => {
    const words = line.textContent.trim().split(/\s+/);
    line.textContent = "";
    words.forEach(word => {
      const span = document.createElement("span");
      span.className = "w";
      span.style.setProperty("--i", i++);
      span.textContent = word;
      line.appendChild(span);
    });
  });
})();

// ---- Animated stat counters ----
(() => {
  const archiveCount = ITEMS.filter(it => !FEATURED_SLUGS.has(it.slug) && !CLIENT_SLUGS.has(it.slug)).length;
  const builds = document.getElementById("statBuilds");
  if (builds) builds.dataset.count = archiveCount + FEATURED_SLUGS.size + CLIENT_COUNT;

  const counters = document.querySelectorAll(".stat-num");
  const runCounter = el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (REDUCED) { el.textContent = target; return; }
    const dur = 1400;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { runCounter(e.target); counterIO.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));
})();

// ---- Build index grid (skips featured + client slugs) ----
const grid = document.getElementById("indexGrid");
const fragment = document.createDocumentFragment();

ITEMS
  .filter(item => !FEATURED_SLUGS.has(item.slug) && !CLIENT_SLUGS.has(item.slug))
  .sort((a, b) => a.name.localeCompare(b.name))
  .forEach(item => {
    const url = item.host + item.slug + "/";
    const a = document.createElement("a");
    a.className = "tile";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.dataset.cat = item.cat;
    a.dataset.url = url;
    a.innerHTML = `
      <span class="tile-name">${item.name}</span>
      <span class="tile-meta">
        <span>${item.cat}</span>
        <span class="tile-arrow">↗</span>
      </span>
    `;
    fragment.appendChild(a);
  });

grid.appendChild(fragment);

// ---- Filters ----
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll(".tile").forEach(t => {
      t.style.display = (f === "all" || t.dataset.cat === f) ? "" : "none";
    });
  });
});

// ---- Scroll reveal ----
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in-view");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

document.querySelectorAll(".reveal, .reveal-up, .card").forEach(el => io.observe(el));

// ---- Nav scroll state + scroll progress bar ----
const nav = document.querySelector(".nav");
const scrollBar = document.getElementById("scrollBar");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
  if (scrollBar) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  }
}, { passive: true });

// ---- Magnetic links ----
// Subtle translate toward cursor on hover. No custom cursor, no trail.
if (FINE_POINTER && !REDUCED) {
  const STRENGTH = 0.25;
  const MAX_DIST = 60;

  document.querySelectorAll(".magnetic").forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.min(Math.hypot(dx, dy), MAX_DIST);
      const ratio = dist / MAX_DIST;
      const tx = dx * STRENGTH * (1 - ratio * 0.5);
      const ty = dy * STRENGTH * (1 - ratio * 0.5);
      el.style.transform = `translate(${tx}px, ${ty}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

// ---- 3D tilt + cursor glare on cards ----
if (FINE_POINTER && !REDUCED) {
  const MAX_TILT = 4; // degrees

  document.querySelectorAll(".card.tilt").forEach(card => {
    const glare = card.querySelector(".card-glare");

    card.addEventListener("mousemove", (e) => {
      if (!card.classList.contains("in-view")) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1
      const rx = (0.5 - py) * MAX_TILT * 2;
      const ry = (px - 0.5) * MAX_TILT * 2;
      card.classList.add("tilting");
      card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-2px)`;
      if (glare) {
        glare.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        glare.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      }
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("tilting");
      card.style.transform = "";
    });
  });
}

// ---- Cursor spotlight on archive tiles ----
if (FINE_POINTER && !REDUCED) {
  grid.addEventListener("mousemove", (e) => {
    const tile = e.target.closest(".tile");
    if (!tile) return;
    const rect = tile.getBoundingClientRect();
    tile.style.setProperty("--sx", `${((e.clientX - rect.left) / rect.width * 100).toFixed(1)}%`);
    tile.style.setProperty("--sy", `${((e.clientY - rect.top) / rect.height * 100).toFixed(1)}%`);
  });
}

// ---- Hover preview iframe on tiles ----
const preview = document.getElementById("hoverPreview");
const frame = document.getElementById("hoverFrame");
let previewTimer;
let currentUrl = "";

function positionPreview(x, y) {
  const pad = 24;
  const w = preview.offsetWidth;
  const h = preview.offsetHeight;
  let left = x + pad;
  let top = y + pad;
  if (left + w > window.innerWidth - pad) left = x - w - pad;
  if (top + h > window.innerHeight - pad) top = y - h - pad;
  preview.style.left = left + "px";
  preview.style.top = top + "px";
}

function showPreview(url, x, y) {
  if (currentUrl !== url) {
    frame.src = url;
    currentUrl = url;
  }
  positionPreview(x, y);
  preview.classList.add("active");
}

function hidePreview() {
  preview.classList.remove("active");
  clearTimeout(previewTimer);
}

document.querySelectorAll(".tile").forEach(tile => {
  tile.addEventListener("mouseenter", (e) => {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => showPreview(tile.dataset.url, e.clientX, e.clientY), 250);
  });
  tile.addEventListener("mousemove", (e) => {
    if (preview.classList.contains("active")) positionPreview(e.clientX, e.clientY);
  });
  tile.addEventListener("mouseleave", hidePreview);
});
