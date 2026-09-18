/* Gallery Studio 103 — the Studio Ledger.
   ONE data source. The public pages read from it; the studio page writes to it.
   Real pieces below are Anthe's own work (see SOURCES.md). Everything marked
   `sample:true` stands in for rows that would come from her own spreadsheet. */

const STUDIO = {
  artist: "Anthe Capitan-Valais",
  name: "Gallery Studio 103",
  address: "6230 Shirley Street #103",
  city: "Naples, FL 34109",
  find: "Fairways Trade Village — the teal building on the right, facing Shirley St.",
  district: "Naples Art District",
  phone: "(215) 233-3916",
  tel: "+12152333916",
  email: "GalleryStudio103@gmail.com",
  mission: "Distinctive art that spreads joy and honors God Almighty.",
  // Anthe's own figures, from her 18 Sep 2026 email
  stated: { total: "500+", inStudio: "~100" }
};

/* ---- the catalogued pieces (real work, real photographs) ---- */
const PIECES = [
  {
    id: "ACV-0001", slug: "white-line",
    title: "White Line",
    titleNote: null,
    year: null,
    medium: "Acrylic on canvas",
    series: "Drawing from Movement",
    kind: "original",
    status: "available",
    location: "Studio 103 — main wall",
    img: "img/white-line.webp",
    ratio: "r43",
    alt: "Acrylic painting: dancing figures drawn in continuous white, blue and violet line over a vermillion and sage ground.",
    blurb: "Dancers caught mid-phrase. One unlifted white line travels the whole canvas — the same line that starts in a Drawing from Music warm-up and ends up here, at scale, in oil-bright vermillion.",
    prints: { available: true, technique: "Hand-pulled original print", note: "Edition details set by Anthe" },
    exhibitions: [],
    scripture: null,
    featured: true
  },
  {
    id: "ACV-0002", slug: "performance",
    title: "Performance",
    titleNote: null,
    year: null,
    medium: "Mixed media on panel",
    series: "Drawing from Music",
    kind: "original",
    status: "available",
    location: "Studio 103",
    img: "img/performance.webp",
    ratio: "r11",
    alt: "Mixed-media painting in blues and golds: a vaulted hall with an audience and figures drawn in loose black line.",
    blurb: "A concert hall built out of scraped blue and gold, with the players and the listening room set down in quick ink. The architecture is paint; the people are line.",
    prints: { available: true, technique: "Hand-pulled original print", note: "Edition details set by Anthe" },
    exhibitions: [],
    scripture: null,
    featured: true
  },
  {
    id: "ACV-0003", slug: "painted-cello",
    title: "The Painted Cello",
    titleNote: "working title — to confirm",
    year: null,
    medium: "Acrylic on cello",
    series: "Drawing from Music",
    kind: "original",
    status: "not-for-sale",
    location: "Studio 103 — on stand",
    img: "img/cello-full.webp",
    ratio: "r23",
    gallery: ["img/cello-full.webp", "img/cello-studio.webp", "img/cello-front.webp"],
    alt: "A cello painted front and back with figures playing, drawn in bold outline over warm wood.",
    blurb: "An instrument that became a canvas. Players are painted onto the body in the same gestural line as the paintings — the music drawn onto the thing that makes it.",
    prints: { available: false },
    exhibitions: [],
    scripture: null,
    featured: true
  },
  {
    id: "ACV-0004", slug: "sea-turtle-collage",
    title: "Untitled",
    titleNote: "sea turtle — title to confirm",
    year: null,
    medium: "Torn-paper collage and mixed media",
    series: "God's Creatures",
    kind: "original",
    status: "available",
    location: "Studio 103",
    img: "img/collage-turtle.jpg",
    ratio: "r34",
    alt: "Torn-paper collage of a sea turtle swimming through layered blue and green water, under a thick white textured sky.",
    blurb: "Built entirely from torn paper and found texture — no drawn outline at all. The shell is assembled the way a mosaic is, one placed edge at a time.",
    prints: { available: true, technique: "Hand-pulled original print", note: "Edition details set by Anthe" },
    exhibitions: [],
    scripture: null,
    featured: true
  },
  {
    id: "ACV-0005", slug: "drawing-from-music-study",
    title: "Drawing from Music",
    titleNote: "study",
    year: null,
    medium: "Ink and coloured pencil on paper",
    series: "Drawing from Music",
    kind: "original",
    status: "available",
    location: "Studio 103 — flat file",
    img: "img/drawing-from-music.jpg",
    ratio: "r34",
    alt: "Small gestural drawing in ink and coloured pencil: overlapping curves and angles made while listening to music.",
    blurb: "Four minutes of a piece of music, drawn without lifting the pen. These studies are where the paintings start — and they are exactly what students make in their first hour here.",
    prints: { available: false },
    exhibitions: [],
    scripture: null,
    featured: false
  }
];

/* ---- classes (real; times and formats as published by the studio) ---- */
const CLASSES = [
  { n:"01", slug:"drawing-from-music", title:"Drawing from Music",
    blurb:"A warm-up that releases spontaneous, intuitive mark-making onto the page. A wide range of musical genres becomes the catalyst — mood and movement first, uninhibited expression after.",
    len:"2 hours", who:"All levels · no experience needed" },
  { n:"02", slug:"drawing-for-all-ages", title:"Drawing for All Ages",
    blurb:"Fundamentals taught the way they should be: seeing first, then line, then form. Children and adults work side by side at their own level.",
    len:"2 hours", who:"Ages 8 to adult" },
  { n:"03", slug:"collage-and-mixed-media", title:"Collage & Mixed Media",
    blurb:"Torn paper, found texture and layered surface. Composition without a single drawn line — building an image edge by edge.",
    len:"3.5 hours", who:"All levels" },
  { n:"04", slug:"painting-on-glass", title:"Painting on Glass",
    blurb:"Working on a surface that holds light instead of absorbing it. Colour behaves differently on glass, and the class starts there.",
    len:"2.5 hours", who:"All levels" },
  { n:"05", slug:"painting-on-clothing", title:"Painting on Clothing",
    blurb:"Take home something you will actually wear. Fabric technique, colour that survives a wash, and one finished garment.",
    len:"3 hours", who:"All levels" },
  { n:"06", slug:"private-lessons", title:"Private & Small Group",
    blurb:"One-to-one or a small group, in your medium, at your pace. Anthe has taught privately since 1995.",
    len:"By arrangement", who:"By appointment" }
];

/* ---- the rest of the ledger ----
   Anthe's own numbers: over 500 pieces, roughly 100 in the studio.
   These stand-in rows show what an import of her spreadsheet looks like
   before the details are filled in. Titles are deliberately blank. */
const LEDGER_TOTAL = 500;

function seeded(s){ return function(){ s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }

function buildLedger(){
  const rows = PIECES.map((p, i) => ({
    id: p.id, row: i + 1, title: p.title, titleNote: p.titleNote,
    medium: p.medium, kind: p.kind, status: p.status, location: p.location,
    img: p.img, slug: p.slug, complete: true, missing: [],
    year: p.year, series: p.series
  }));

  const rnd = seeded(103);
  const mediums = ["Acrylic on canvas","Watercolour on paper","Mixed media / collage","Drawing — ink on paper",
                   "Acrylic on panel","Watercolour and ink","Printmaking","Painted glass","Painted metal","Sculpture"];
  const series  = ["Drawing from Movement","Drawing from Music","God's Creatures","Scripture Series","Landscape","Uncategorised"];
  const shows   = ["Artful Arrangements","En Plein Air Festival","Naples Art District Open Studios","Palette to Palate","Juried show — archive"];

  for (let i = rows.length; i < LEDGER_TOTAL; i++){
    const r = rnd();
    let status, location;
    if (r < 0.20){ status = "available"; location = "Studio 103"; }
    else if (r < 0.40){ status = "available"; location = "Storage — flat files"; }
    else if (r < 0.70){ status = "sold"; location = "Collector"; }
    else if (r < 0.78){ status = "on-loan"; location = shows[Math.floor(rnd()*shows.length)]; }
    else if (r < 0.84){ status = "commission"; location = "Studio 103 — in progress"; }
    else { status = "archive"; location = "Storage — flat files"; }

    const missing = [];
    if (rnd() < 0.58) missing.push("photo");
    if (rnd() < 0.42) missing.push("size");
    if (rnd() < 0.36) missing.push("price");
    if (rnd() < 0.30) missing.push("year");

    rows.push({
      id: "ACV-" + String(i + 1).padStart(4, "0"),
      row: i + 1,
      title: null, titleNote: null,
      medium: mediums[Math.floor(rnd()*mediums.length)],
      kind: rnd() < 0.18 ? "original-print" : "original",
      status, location,
      img: null, slug: null,
      complete: missing.length === 0,
      missing,
      year: null,
      series: series[Math.floor(rnd()*series.length)],
      sample: true
    });
  }
  return rows;
}

const STATUS_LABEL = {
  "available":"Available", "sold":"Sold", "on-loan":"At a show",
  "commission":"Commission", "not-for-sale":"Not for sale", "archive":"Archive"
};

if (typeof module !== "undefined") module.exports = { STUDIO, PIECES, CLASSES, buildLedger };
