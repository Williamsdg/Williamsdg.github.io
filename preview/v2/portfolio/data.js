// Portfolio v2 data. Industry and capability are stored separately.
// Status values: "concept" (fictional brand), "redesign" (independent redesign of a real business),
// "client" (client project). Private/unconfirmed items are intentionally absent — see
// ~/portfolio-overhaul/PHASE-1-INVENTORY.md §6 for what was left out and why.

const P = "../../";          // → /preview/
const V2 = "../";            // → /preview/v2/

const INDUSTRIES = {
  food: "Restaurants & food",
  medical: "Medical & wellness",
  legal: "Legal",
  home: "Home services",
  hospitality: "Hospitality & tourism",
  sports: "Sports & NIL",
  pro: "Professional services",
  civic: "Civic & local",
  faith: "Faith & community",
  retail: "Retail & ecommerce",
  automotive: "Automotive",
};

// "Dashboards" and "Contracts & utilities" from the current archive became capabilities.
const CAPABILITIES = {
  website: "Websites",
  booking: "Booking & scheduling",
  portal: "Client portals",
  dashboard: "Dashboards",
  commerce: "Ecommerce",
  tools: "Interactive tools",
};

const STATUS_LABEL = {
  concept: "Concept project",
  redesign: "Independent redesign concept",
  client: "Client project",
};

// Curated, in display order. Captures live in thumbs/ (desktop 1200×750, mobile 390×844).
const SELECTED = [
  {
    id: "greycliff", name: "Greycliff Builders", status: "concept", industry: "home",
    premise: "An architectural monograph: the house is the subject, and one study switches between the finished home, its plan, materials, and construction stage.",
    caps: ["website", "portal", "dashboard"],
    links: [
      { label: "Explore website", href: V2 + "greycliff-builders/" },
      { label: "View residence study", href: V2 + "greycliff-builders/residence.html" },
      { label: "View client portal", href: P + "greycliff-builders/client.html" },
    ],
  },
  {
    id: "iron-oak", name: "Iron Oak", status: "concept", industry: "food",
    premise: "A neighborhood venue told through print: Morning, Midday, and After Dark change the menu, the poster, and what you can do next.",
    caps: ["website", "booking"],
    links: [{ label: "Explore website", href: V2 + "iron-oak/" }],
  },
  {
    id: "gulf-coast", name: "Gulf Coast Adventure Co.", status: "concept", industry: "hospitality",
    premise: "A coastal field guide: explore a schematic route map, then build a day on the water and keep the trip pass.",
    caps: ["website", "booking"],
    links: [
      { label: "Explore website", href: V2 + "gulf-coast/" },
      { label: "Try workflow", href: V2 + "gulf-coast/#planner" },
    ],
  },
  {
    id: "aldridge-vance", name: "Aldridge & Vance", status: "concept", industry: "legal",
    premise: "A typographic legal journal that routes people by situation to plain-language guidance and a short introductory request.",
    caps: ["website", "tools"],
    links: [{ label: "Explore website", href: V2 + "aldridge-vance/" }],
  },
  {
    id: "linden-vale", name: "Linden & Vale Care", status: "concept", industry: "medical",
    premise: "Care navigation that starts with the visitor's practical choice: visit type, provider, a sample time, and what to bring.",
    caps: ["website", "booking"],
    links: [
      { label: "Explore website", href: V2 + "linden-vale-care/" },
      { label: "Try workflow", href: V2 + "linden-vale-care/appointment.html" },
    ],
  },
  {
    id: "marbleyard", name: "Marbleyard Goods", status: "concept", industry: "retail",
    premise: "A shop built as a window shelf of illustrated objects, with a gift-set builder and a bag whose totals always add up.",
    caps: ["website", "commerce"],
    links: [{ label: "Explore shop", href: V2 + "marbleyard-goods/" }],
  },
  {
    id: "quarry-bend", name: "The Quarry Bend Record", status: "concept", industry: "civic",
    premise: "A local newspaper front page the reader can re-set: the same stories laid out as a broadsheet, a morning digest, or a newsroom wire.",
    caps: ["website", "tools"],
    links: [
      { label: "Explore front page", href: V2 + "quarry-bend-record/" },
      { label: "Read a story", href: V2 + "quarry-bend-record/story.html" },
    ],
  },
];

const WORKFLOWS = [
  {
    id: "conference-os", name: "Conference OS", status: "concept", industry: "sports",
    task: "Handle a lightning delay",
    steps: ["Open the incident", "Inspect context", "Assign a response", "Acknowledge", "Board and audit log update"],
    note: "Operations board for a fictional athletic conference. Deterministic sample Saturday; no real games or feeds.",
    href: V2 + "conference-os/",
  },
  {
    id: "greycliff-office", name: "Greycliff · The Site Office", status: "concept", industry: "home",
    task: "Review a builder's day",
    steps: ["Choose a role", "See what needs attention", "Open a build", "Review change orders"],
    note: "Builder operations demo with role-based views (existing prototype; change-order workflow refinement is planned for Phase 3).",
    href: P + "greycliff-builders/dashboard.html",
  },
  {
    id: "linden-vale-flow", name: "Linden & Vale Care", status: "concept", industry: "medical",
    task: "Request a sample appointment",
    steps: ["Pick a visit type", "Choose a provider", "Pick a sample time", "Get a preparation checklist"],
    note: "Administrative, never diagnostic. Stores nothing beyond this browser.",
    href: V2 + "linden-vale-care/appointment.html",
  },
];

// Library: everything public-safe. Groups collapse template families into one entry.
const LIBRARY = [
  // Featured originals (kept as-is for outreach)
  { name: "Greycliff Builders — original site + Site Office", industry: "home", caps: ["website", "dashboard", "portal"], status: "concept", href: P + "greycliff-builders/" },
  { name: "Iron Oak — original site + The Pass", industry: "food", caps: ["website", "dashboard"], status: "concept", href: P + "iron-oak-hospitality/" },
  { name: "River City Sports Network", industry: "sports", caps: ["website", "dashboard"], status: "concept", href: P + "river-city-sports-network/" },
  { name: "Summit Home Services", industry: "home", caps: ["website", "dashboard"], status: "concept", href: P + "summit-home-services/" },
  { name: "Gulf Coast Adventure Co. — original site + The Helm", industry: "hospitality", caps: ["website", "booking", "dashboard"], status: "concept", href: P + "gulf-coast-adventure-co/" },
  { name: "Deep South Retrievers", industry: "home", caps: ["website", "portal", "dashboard"], status: "concept", href: P + "deep-south-retrievers/", tags: "pets dog training" },
  { name: "Maison Verre", industry: "food", caps: ["website", "booking", "dashboard"], status: "concept", href: P + "maisonverre-site/",
    variants: [["Menu", P + "maisonverre-menu/"], ["Reserve", P + "maisonverre-reserve/"], ["Service operations", P + "maisonverre/"]] },
  { name: "Conference OS — original platform", industry: "sports", caps: ["dashboard"], status: "concept", href: P + "conference-os/" },
  { name: "Pitch It Junk Removal", industry: "home", caps: ["website", "tools", "dashboard"], status: "concept", href: P + "pitch-it-junk-removal/" },
  { name: "The Grace Table", industry: "faith", caps: ["website"], status: "concept", href: P + "grace-table-church/" },
  { name: "Aldridge & Vance — original", industry: "legal", caps: ["website"], status: "concept", href: P + "aldridge-vance/" },

  // Food
  { name: "Aurora Coffee", industry: "food", caps: ["website", "commerce", "dashboard"], status: "concept", href: P + "aurora-coffee-site/",
    variants: [["Menu", P + "aurora-menu/"], ["Pre-order", P + "aurora-order/"], ["Operations", P + "aurora-coffee/"]] },

  // Medical
  { name: "Cedar Family Dental — operatory schedule", industry: "medical", caps: ["dashboard", "booking"], status: "concept", href: P + "cedar-dental/" },

  // Home services
  { name: "Trade website + dashboard pairs", industry: "home", caps: ["website", "dashboard"], status: "concept", href: P + "dashboards/",
    tags: "hvac plumbing windows flooring framing water electrical masonry drywall landscaping",
    variants: [
      ["ClearView Windows", P + "clearview-windows-site/"], ["Climate Air Pros", P + "climate-air-pros-site/"],
      ["FlowRight Plumbing", P + "flowright-plumbing-site/"], ["Grainline Flooring", P + "grainline-flooring-site/"],
      ["HomeCare Services", P + "homecare-services-site/"], ["Ironwood Framing", P + "ironwood-framing-site/"],
      ["AquaLine Water", P + "aqualine-water-site/"], ["Dashboard index", P + "dashboards/"],
    ] },
  { name: "Customer HVAC portal", industry: "home", caps: ["portal"], status: "concept", href: P + "hvac-portal/" },
  { name: "Appointment tracker", industry: "home", caps: ["portal", "tools"], status: "concept", href: P + "job-tracker/" },
  { name: "Landscaping — five service levels", industry: "home", caps: ["website", "dashboard"], status: "concept", href: P + "landscaping-tier3-premium/",
    variants: [["Starter", P + "landscaping-tier1-starter/"], ["Professional", P + "landscaping-tier2-professional/"], ["Premium", P + "landscaping-tier3-premium/"], ["Enterprise", P + "landscaping-tier4-enterprise/"], ["Ultimate", P + "landscaping-tier5-ultimate/"]] },
  { name: "Apex Auto Repair — bay board", industry: "automotive", caps: ["dashboard"], status: "concept", href: P + "apex-auto-repair/" },

  // Hospitality
  { name: "Northpoint Alpine Resort", industry: "hospitality", caps: ["website"], status: "concept", href: P + "northpoint-alpine-site/" },
  { name: "Sandbar Coastal Co.", industry: "hospitality", caps: ["website", "booking"], status: "concept", href: P + "sandbar-coastal-site/" },
  { name: "Tourism operations dashboard", industry: "hospitality", caps: ["dashboard"], status: "concept", href: P + "tourism/" },
  { name: "Magnolia Crest — club member portal", industry: "hospitality", caps: ["portal", "booking"], status: "concept", href: P + "magnolia-crest/" },

  // Professional
  { name: "Southside Court Reporting", industry: "pro", caps: ["website", "booking"], status: "concept", href: P + "southside-court-reporting/" },
  { name: "Staff portal", industry: "pro", caps: ["portal", "dashboard"], status: "concept", href: P + "staff-portal/" },

  // Utilities
  { name: "Estimate review & approval", industry: "home", caps: ["tools"], status: "concept", href: P + "estimate-view/", tags: "quote contract approval" },
];
