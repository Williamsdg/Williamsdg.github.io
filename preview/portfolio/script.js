// Mark JS as ready so reveal CSS kicks in
document.documentElement.classList.add("js-ready");

const LIVE = "https://williamsdigital.io/preview/";
const ORG = "https://williams-digital.github.io/preview/";

// The 10 featured slugs — these are shown in the featured section,
// so we DO NOT duplicate them in the archive grid below.
const FEATURED_SLUGS = new Set([
  "andre-balazs", "flynn-hospitality", "jenkins-group", "mercier-orchards",
  "mcbride", "lilly-pad-village", "savannah-day-spa", "birmingham-reporting",
  "case-study-liberty-park", "grace-table-church"
]);

const ITEMS = [
  // Other featured / case studies / utilities
  { slug: "a1-hospitality", name: "A-1 Hospitality", cat: "hospitality", host: LIVE },
  { slug: "case-study-template", name: "Case study template", cat: "utilities", host: LIVE },
  { slug: "small-hoa-pitch", name: "Small HOA pitch", cat: "civic", host: LIVE },

  // Restaurants, cafes, food
  { slug: "andys-creekside", name: "Andy's Creekside", cat: "food", host: LIVE },
  { slug: "ash-restaurant", name: "Ash", cat: "food", host: LIVE },
  { slug: "aurora-coffee", name: "Aurora Coffee", cat: "food", host: LIVE },
  { slug: "aurora-coffee-site", name: "Aurora Coffee — site", cat: "food", host: LIVE },
  { slug: "aurora-menu", name: "Aurora Menu", cat: "food", host: LIVE },
  { slug: "aurora-order", name: "Aurora Order", cat: "food", host: LIVE },
  { slug: "backyard-market", name: "Backyard Market", cat: "food", host: LIVE },
  { slug: "birmingham-breadworks", name: "Birmingham Breadworks", cat: "food", host: LIVE },
  { slug: "bulletcoffeeco", name: "Bullet Coffee Co.", cat: "food", host: LIVE },
  { slug: "cahaba-heights-cafe", name: "Cahaba Heights Cafe", cat: "food", host: LIVE },
  { slug: "cala-coffee", name: "Cala Coffee", cat: "food", host: LIVE },
  { slug: "davenports-pizza", name: "Davenport's Pizza", cat: "food", host: LIVE },
  { slug: "edgars-bakery", name: "Edgar's Bakery", cat: "food", host: LIVE },
  { slug: "eugenes-hot-chicken", name: "Eugene's Hot Chicken", cat: "food", host: LIVE },
  { slug: "flower-betty", name: "Flower Betty", cat: "food", host: LIVE },
  { slug: "golden-lotus", name: "Golden Lotus", cat: "food", host: LIVE },
  { slug: "helen-bham", name: "Helen — Birmingham", cat: "food", host: LIVE },
  { slug: "heritage-coffee", name: "Heritage Coffee", cat: "food", host: LIVE },
  { slug: "homewood-grill", name: "Homewood Grill", cat: "food", host: LIVE },
  { slug: "irondale-cafe", name: "Irondale Cafe", cat: "food", host: LIVE },
  { slug: "liberty-park-bistro", name: "Liberty Park Bistro", cat: "food", host: LIVE },
  { slug: "maisonverre", name: "Maisonverre", cat: "food", host: LIVE },
  { slug: "maisonverre-menu", name: "Maisonverre — menu", cat: "food", host: LIVE },
  { slug: "maisonverre-reserve", name: "Maisonverre — reserve", cat: "food", host: LIVE },
  { slug: "maisonverre-site", name: "Maisonverre — site", cat: "food", host: LIVE },
  { slug: "mountain-brook-cafe", name: "Mountain Brook Cafe", cat: "food", host: LIVE },
  { slug: "mudtown", name: "Mudtown", cat: "food", host: LIVE },
  { slug: "nikis-west", name: "Niki's West", cat: "food", host: LIVE },
  { slug: "redbike-coffee", name: "Redbike Coffee", cat: "food", host: LIVE },
  { slug: "rocky-ridge-bbq", name: "Rocky Ridge BBQ", cat: "food", host: LIVE },
  { slug: "saws-bbq", name: "Saw's BBQ", cat: "food", host: LIVE },
  { slug: "vestavia-diner", name: "Vestavia Diner", cat: "food", host: LIVE },
  { slug: "whammy-coffee", name: "Whammy Coffee", cat: "food", host: LIVE },
  { slug: "brew-and-co", name: "Brew & Co.", cat: "food", host: ORG },

  // Medical / dental / vet / wellness
  { slug: "andrea-nunes-dmd", name: "Andrea Nunes DMD", cat: "medical", host: LIVE },
  { slug: "birmingham-smile-center", name: "Birmingham Smile Center", cat: "medical", host: LIVE },
  { slug: "brookwood-dental", name: "Brookwood Dental", cat: "medical", host: LIVE },
  { slug: "cahaba-heights-dental", name: "Cahaba Heights Dental", cat: "medical", host: LIVE },
  { slug: "cedar-dental", name: "Cedar Dental", cat: "medical", host: LIVE },
  { slug: "greystone-dental", name: "Greystone Dental", cat: "medical", host: LIVE },
  { slug: "homewood-chiropractic", name: "Homewood Chiropractic", cat: "medical", host: LIVE },
  { slug: "homewood-family-dentistry", name: "Homewood Family Dentistry", cat: "medical", host: LIVE },
  { slug: "hoover-dental-care", name: "Hoover Dental Care", cat: "medical", host: LIVE },
  { slug: "mountain-brook-dental", name: "Mountain Brook Dental", cat: "medical", host: LIVE },
  { slug: "mountain-brook-vet", name: "Mountain Brook Vet", cat: "medical", host: LIVE },
  { slug: "oakwood-vet", name: "Oakwood Vet", cat: "medical", host: LIVE },
  { slug: "relax-the-back", name: "Relax the Back", cat: "medical", host: LIVE },
  { slug: "vestavia-pet-hospital", name: "Vestavia Pet Hospital", cat: "medical", host: LIVE },

  // Legal
  { slug: "aldridge-vance", name: "Aldridge Vance", cat: "legal", host: LIVE },
  { slug: "birmingham-dui-defense", name: "Birmingham DUI Defense", cat: "legal", host: LIVE },
  { slug: "cahaba-heights-legal", name: "Cahaba Heights Legal", cat: "legal", host: LIVE },
  { slug: "chambers-family-law", name: "Chambers Family Law", cat: "legal", host: LIVE },
  { slug: "daniel-george", name: "Daniel George", cat: "legal", host: LIVE },
  { slug: "drake-injury-lawyers", name: "Drake Injury Lawyers", cat: "legal", host: LIVE },
  { slug: "harris-robinson", name: "Harris Robinson", cat: "legal", host: LIVE },
  { slug: "homewood-law-associates", name: "Homewood Law Associates", cat: "legal", host: LIVE },
  { slug: "hoover-family-law", name: "Hoover Family Law", cat: "legal", host: LIVE },
  { slug: "james-griffin-law", name: "James Griffin Law", cat: "legal", host: LIVE },
  { slug: "mountain-brook-legal", name: "Mountain Brook Legal", cat: "legal", host: LIVE },
  { slug: "over-mountain-law", name: "Over Mountain Law", cat: "legal", host: LIVE },
  { slug: "vestavia-estate-planning", name: "Vestavia Estate Planning", cat: "legal", host: LIVE },

  // Home services & trades
  { slug: "adkins-landscape", name: "Adkins Landscape", cat: "home", host: LIVE },
  { slug: "apex-auto-repair", name: "Apex Auto Repair", cat: "home", host: LIVE },
  { slug: "birmingham-emergency-plumbing", name: "Birmingham Emergency Plumbing", cat: "home", host: LIVE },
  { slug: "c2c-home-solutions", name: "C2C Home Solutions", cat: "home", host: LIVE },
  { slug: "cahaba-heights-plumbing", name: "Cahaba Heights Plumbing", cat: "home", host: LIVE },
  { slug: "clearview-windows-site", name: "Clearview Windows", cat: "home", host: LIVE },
  { slug: "climate-air-pros-site", name: "Climate Air Pros", cat: "home", host: LIVE },
  { slug: "climate-masters-hvac", name: "Climate Masters HVAC", cat: "home", host: LIVE },
  { slug: "cornerstone-masonry-site", name: "Cornerstone Masonry", cat: "home", host: LIVE },
  { slug: "elite-tire", name: "Elite Tire", cat: "home", host: LIVE },
  { slug: "flowright-plumbing-site", name: "Flowright Plumbing", cat: "home", host: LIVE },
  { slug: "generalhvac", name: "General HVAC", cat: "home", host: LIVE },
  { slug: "grainline-flooring-site", name: "Grainline Flooring", cat: "home", host: LIVE },
  { slug: "greenline-landscape-site", name: "Greenline Landscape", cat: "home", host: LIVE },
  { slug: "guinservice", name: "Guin Service", cat: "home", host: LIVE },
  { slug: "homecare-services-site", name: "Homecare Services", cat: "home", host: LIVE },
  { slug: "homewood-plumbing", name: "Homewood Plumbing", cat: "home", host: LIVE },
  { slug: "hoover-drain-plumbing", name: "Hoover Drain Plumbing", cat: "home", host: LIVE },
  { slug: "integrity-heating", name: "Integrity Heating", cat: "home", host: LIVE },
  { slug: "ironwood-framing-site", name: "Ironwood Framing", cat: "home", host: LIVE },
  { slug: "jb-lawn-care", name: "JB Lawn Care", cat: "home", host: LIVE },
  { slug: "lms-auto", name: "LMS Auto", cat: "home", host: LIVE },
  { slug: "mountain-brook-auto", name: "Mountain Brook Auto", cat: "home", host: LIVE },
  { slug: "mountain-brook-heating", name: "Mountain Brook Heating", cat: "home", host: LIVE },
  { slug: "mountain-brook-lawn", name: "Mountain Brook Lawn", cat: "home", host: LIVE },
  { slug: "mountain-brook-plumbing", name: "Mountain Brook Plumbing", cat: "home", host: LIVE },
  { slug: "over-the-mountain-plumbing", name: "Over the Mountain Plumbing", cat: "home", host: LIVE },
  { slug: "plumline-drywall-site", name: "Plumline Drywall", cat: "home", host: LIVE },
  { slug: "rainbow-paint", name: "Rainbow Paint", cat: "home", host: LIVE },
  { slug: "rjs-lawn-care", name: "RJ's Lawn Care", cat: "home", host: LIVE },
  { slug: "robe-mans-auto", name: "Robe-Man's Auto", cat: "home", host: LIVE },
  { slug: "summit-ridge-roofing-site", name: "Summit Ridge Roofing", cat: "home", host: LIVE },
  { slug: "summit-stone-site", name: "Summit Stone", cat: "home", host: LIVE },
  { slug: "vestavia-auto-service", name: "Vestavia Auto Service", cat: "home", host: LIVE },
  { slug: "vestavia-barber", name: "Vestavia Barber", cat: "home", host: LIVE },
  { slug: "vestavia-plumbing", name: "Vestavia Plumbing", cat: "home", host: LIVE },
  { slug: "voltworks-electrical-site", name: "Voltworks Electrical", cat: "home", host: LIVE },
  { slug: "landscaping-tier1-starter", name: "Landscaping Tier 1 — Starter", cat: "home", host: LIVE },
  { slug: "landscaping-tier2-professional", name: "Landscaping Tier 2 — Pro", cat: "home", host: LIVE },
  { slug: "landscaping-tier3-premium", name: "Landscaping Tier 3 — Premium", cat: "home", host: LIVE },
  { slug: "landscaping-tier4-enterprise", name: "Landscaping Tier 4 — Enterprise", cat: "home", host: LIVE },
  { slug: "landscaping-tier5-ultimate", name: "Landscaping Tier 5 — Ultimate", cat: "home", host: LIVE },

  // Hospitality / tourism / vacation
  { slug: "aqualine-water-site", name: "Aqualine", cat: "hospitality", host: LIVE },
  { slug: "blue-ridge-orchards", name: "Blue Ridge Orchards", cat: "hospitality", host: LIVE },
  { slug: "bolt-farm-treehouse", name: "Bolt Farm Treehouse", cat: "hospitality", host: LIVE },
  { slug: "magnolia-crest", name: "Magnolia Crest", cat: "hospitality", host: LIVE },
  { slug: "northpoint-alpine-site", name: "Northpoint Alpine", cat: "hospitality", host: LIVE },
  { slug: "sandbar-coastal-site", name: "Sandbar Coastal", cat: "hospitality", host: LIVE },
  { slug: "tourism", name: "Tourism", cat: "hospitality", host: LIVE },

  // Real estate & retail
  { slug: "meridian-realty", name: "Meridian Realty", cat: "realestate", host: LIVE },
  { slug: "rocky-ridge-drug", name: "Rocky Ridge Drug", cat: "realestate", host: LIVE },
  { slug: "rocky-ridge-hardware", name: "Rocky Ridge Hardware", cat: "realestate", host: LIVE },

  // Sports / NIL
  { slug: "broadcast-tools", name: "Broadcast Tools", cat: "sports", host: LIVE },
  { slug: "first-round-management", name: "First Round Management", cat: "sports", host: LIVE },
  { slug: "mgc-sports", name: "MGC Sports", cat: "sports", host: LIVE },
  { slug: "nil-management", name: "NIL Management", cat: "sports", host: LIVE },
  { slug: "nil-tier-starter", name: "NIL Tier — Starter", cat: "sports", host: LIVE },
  { slug: "nil-tier-pro", name: "NIL Tier — Pro", cat: "sports", host: LIVE },
  { slug: "nil-tier-elite", name: "NIL Tier — Elite", cat: "sports", host: LIVE },
  { slug: "nil-tier-enterprise", name: "NIL Tier — Enterprise", cat: "sports", host: LIVE },
  { slug: "players-collxctive", name: "Players Collxctive", cat: "sports", host: LIVE },
  { slug: "pliable-marketing", name: "Pliable Marketing", cat: "sports", host: LIVE },
  { slug: "soar", name: "Soar", cat: "sports", host: LIVE },
  { slug: "summit-sports-group", name: "Summit Sports Group", cat: "sports", host: LIVE },
  { slug: "total-nil", name: "Total NIL", cat: "sports", host: LIVE },

  // Casting / media
  { slug: "cc-redesign", name: "Central Casting redesign", cat: "casting", host: LIVE },
  { slug: "central-casting-redesign", name: "Central Casting", cat: "casting", host: LIVE },
  { slug: "donna-grossman-casting", name: "Donna Grossman Casting", cat: "casting", host: LIVE },
  { slug: "donnagrossmancasting", name: "Donna Grossman", cat: "casting", host: LIVE },
  { slug: "vestavia-voice", name: "Vestavia Voice", cat: "casting", host: LIVE },
  { slug: "central-casting", name: "Central Casting", cat: "casting", host: ORG },
  { slug: "paul-head-casting", name: "Paul Head Casting", cat: "casting", host: ORG },
  { slug: "telsey-office", name: "Telsey Office", cat: "casting", host: ORG },
  { slug: "waldron-casting", name: "Waldron Casting", cat: "casting", host: ORG },

  // Professional services
  { slug: "tvigil-cpa", name: "TVigil CPA", cat: "pro", host: LIVE },
  { slug: "tvigil-cpa-dashboard", name: "TVigil CPA — dashboard", cat: "pro", host: LIVE },
  { slug: "southside-court-reporting", name: "Southside Court Reporting", cat: "pro", host: LIVE },
  { slug: "verbatim", name: "Verbatim", cat: "pro", host: LIVE },
  { slug: "verbatim-portal", name: "Verbatim — portal", cat: "pro", host: LIVE },
  { slug: "verbatim-site", name: "Verbatim — site", cat: "pro", host: LIVE },

  // Civic & local
  { slug: "alabama-candidate", name: "Alabama Candidate", cat: "civic", host: LIVE },
  { slug: "auburn-daily", name: "Auburn Daily", cat: "civic", host: ORG },
  { slug: "leeds-historical-society", name: "Leeds Historical Society", cat: "civic", host: ORG },
  { slug: "suscc", name: "SUSCC", cat: "civic", host: ORG },

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
  { slug: "jeh-contract", name: "JEH contract", cat: "utilities", host: LIVE },
  { slug: "jeh-green-cream", name: "JEH — green/cream", cat: "utilities", host: LIVE },
  { slug: "jeh-navy-gold", name: "JEH — navy/gold", cat: "utilities", host: LIVE },
  { slug: "pco-plan-viewer", name: "PCO plan viewer", cat: "utilities", host: LIVE },
  { slug: "timely-contract", name: "Timely contract", cat: "utilities", host: LIVE },
  { slug: "barkingbee", name: "BarkingBee", cat: "utilities", host: LIVE }
];

// ---- Build index grid (skips featured slugs to avoid duplicates) ----
const grid = document.getElementById("indexGrid");
const fragment = document.createDocumentFragment();

ITEMS
  .filter(item => !FEATURED_SLUGS.has(item.slug))
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

// Stagger banner title words
document.querySelectorAll(".banner-title .word").forEach((w, i) => w.style.setProperty("--i", i));

// ---- Nav scroll state ----
const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

// ---- Magnetic links ----
// Subtle translate toward cursor on hover. No custom cursor, no trail.
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
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

// ---- Subtle parallax on card media (featured only) ----
const cards = document.querySelectorAll(".card-media");
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      cards.forEach(c => {
        const rect = c.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = center - window.innerHeight / 2;
        const offset = distance * -0.04;
        const img = c.querySelector("img");
        if (img && !img.dataset.hovered) {
          img.style.transform = `translateY(${offset}px) scale(1.06)`;
        }
      });
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
