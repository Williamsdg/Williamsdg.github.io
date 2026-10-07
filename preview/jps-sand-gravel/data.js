/* Sample catalogue for the concept. Names, sizes and weights are typical
   industry figures used as placeholders; the final list, photos and
   specifications come from the client. */
window.JPS = (function () {
  var CATS = [
    { id: 'sand', name: 'Sand', tone: ['#d9bd8b', '#c9a86f', '#e6cfa3', '#b8965c'], grain: 'fine' },
    { id: 'gravel', name: 'Gravel', tone: ['#a79a88', '#8c7f6e', '#c2b6a2', '#6f6558', '#d6cbb8'], grain: 'round' },
    { id: 'base', name: 'Base & Crushed Stone', tone: ['#b9b4aa', '#9a958b', '#d2cdc2', '#7d786f'], grain: 'angular' },
    { id: 'rock', name: 'Rock & Rip Rap', tone: ['#8f8b84', '#6c6862', '#aaa59c', '#56524d'], grain: 'large' },
    { id: 'soil', name: 'Soil & Fill', tone: ['#5a4332', '#6d5340', '#47352a', '#7c6048'], grain: 'fine' },
    { id: 'deco', name: 'Decorative', tone: ['#c98a5e', '#a9643f', '#e0b08a', '#8a4f33', '#d9c2a3'], grain: 'round' },
    { id: 'recycled', name: 'Recycled', tone: ['#9aa0a3', '#7b8184', '#b9bec0', '#5f6568'], grain: 'angular' }
  ];

  // [name, category, size, tons per cubic yard, uses, featured]
  var RAW = [
    ['Concrete Sand', 'sand', 'Coarse, washed', 1.35, 'Concrete mix, paver bedding, pipe bedding', 1],
    ['Masonry Sand', 'sand', 'Fine, washed', 1.3, 'Mortar, stucco, brick and block work', 1],
    ['Mortar Sand', 'sand', 'Fine, screened', 1.3, 'Mortar and grout mixes', 0],
    ['Cushion Sand', 'sand', 'Fine to medium', 1.3, 'Under slabs, pool liners and pavers', 0],
    ['Fill Sand', 'sand', 'Unwashed', 1.35, 'Backfill, leveling low spots', 0],
    ['Bank Sand', 'sand', 'Pit run', 1.35, 'Fill, compaction, trench backfill', 0],
    ['Play Sand', 'sand', 'Fine, washed, screened', 1.25, 'Sandboxes, playgrounds, volleyball courts', 0],
    ['Washed Sand', 'sand', 'Medium, washed', 1.3, 'Drainage, septic systems, general use', 0],
    ['Top Dressing Sand', 'sand', 'Fine, screened', 1.25, 'Lawns, sports fields, golf greens', 0],
    ['Arena Sand', 'sand', 'Medium, angular', 1.3, 'Horse arenas and round pens', 0],
    ['Septic Sand', 'sand', 'Coarse, washed', 1.35, 'Septic drain fields and filters', 0],
    ['Paver Sand', 'sand', 'Coarse, washed', 1.35, 'Paver base and joint filling', 0],

    ['Pea Gravel 3/8"', 'gravel', '3/8 inch', 1.4, 'Walkways, patios, drainage, playgrounds', 1],
    ['Pea Gravel 5/8"', 'gravel', '5/8 inch', 1.4, 'Driveways, drainage, landscaping', 0],
    ['Washed Gravel 3/4"', 'gravel', '3/4 inch', 1.4, 'Concrete mix, drainage, driveways', 0],
    ['Washed Gravel 1"', 'gravel', '1 inch', 1.4, 'Driveways, French drains', 1],
    ['Washed Gravel 1-1/2"', 'gravel', '1-1/2 inch', 1.4, 'Drainage, septic, driveways', 0],
    ['River Gravel 1"–2"', 'gravel', '1 to 2 inch', 1.35, 'Landscape beds, dry creek beds', 0],
    ['Pit Run Gravel', 'gravel', 'Mixed, unwashed', 1.5, 'Fill, rough roads, pad building', 0],
    ['Drain Rock', 'gravel', '1 to 1-1/2 inch, washed', 1.4, 'French drains, retaining wall backfill', 0],
    ['Septic Rock', 'gravel', '1-1/2 inch, washed', 1.4, 'Septic drain fields', 0],
    ['Driveway Gravel Mix', 'gravel', '3/4 inch with fines', 1.5, 'Driveways and parking areas', 0],
    ['Bull Rock 2"–4"', 'gravel', '2 to 4 inch', 1.35, 'Drainage, erosion control, landscape accents', 0],
    ['Bull Rock 3"–5"', 'gravel', '3 to 5 inch', 1.35, 'Construction entrances, erosion control', 0],

    ['Flex Base', 'base', '1-3/4 inch minus', 1.5, 'Road base, driveways, building pads', 1],
    ['Road Base Grade 1–2', 'base', '1-3/4 inch minus', 1.5, 'County and private roads, parking lots', 0],
    ['Crushed Limestone 3/4"', 'base', '3/4 inch', 1.4, 'Driveways, drainage, concrete mix', 1],
    ['Crushed Limestone 1-1/2"', 'base', '1-1/2 inch', 1.4, 'Driveways, drainage, base layers', 0],
    ['#57 Stone', 'base', '3/4 to 1 inch', 1.4, 'Drainage, concrete, backfill', 0],
    ['#67 Stone', 'base', '1/2 to 3/4 inch', 1.4, 'Concrete, drainage, pipe bedding', 0],
    ['Crusher Fines', 'base', '1/4 inch minus', 1.5, 'Paths, paver base, compacted surfaces', 0],
    ['Limestone Screenings', 'base', '3/8 inch minus', 1.5, 'Paver leveling, patching, paths', 0],
    ['Manufactured Sand', 'base', '3/16 inch minus', 1.45, 'Pipe bedding, paver base', 0],
    ['Select Fill', 'base', 'Sandy clay blend', 1.4, 'Foundation pads and structural fill', 1],
    ['Stabilized Sand', 'base', 'Cement stabilized', 1.5, 'Utility bedding and backfill', 0],
    ['3"×5" Rock', 'base', '3 to 5 inch', 1.35, 'Construction entrances, soft ground', 0],

    ['Rip Rap 6"–12"', 'rock', '6 to 12 inch', 1.5, 'Erosion control, pond banks, culverts', 0],
    ['Rip Rap 12"–18"', 'rock', '12 to 18 inch', 1.5, 'Channel lining, shoreline protection', 0],
    ['Gabion Stone', 'rock', '4 to 8 inch', 1.4, 'Gabion baskets and retaining structures', 0],
    ['Limestone Boulders', 'rock', '2 to 4 foot', 1.5, 'Retaining, landscape features', 0],
    ['Chopped Limestone', 'rock', 'Sawn and chopped', 1.45, 'Edging, walls, borders', 0],
    ['Flagstone', 'rock', '1 to 2 inch thick', 1.4, 'Patios, walkways, stepping stones', 0],
    ['Ballast Rock', 'rock', '1-1/2 to 3 inch', 1.4, 'Rail, heavy drainage, stabilization', 0],
    ['Oversize Rock', 'rock', '5 to 8 inch', 1.4, 'Erosion control, fill for soft areas', 0],

    ['Topsoil', 'soil', 'Unscreened', 1.1, 'Lawns, grading, general fill', 0],
    ['Screened Topsoil', 'soil', 'Screened 1/2 inch', 1.1, 'Lawns, sod preparation, beds', 1],
    ['Sandy Loam', 'soil', 'Screened', 1.15, 'Lawn leveling, sod base', 0],
    ['Garden Mix', 'soil', 'Soil and compost blend', 1.0, 'Raised beds and gardens', 0],
    ['Compost', 'soil', 'Screened', 0.7, 'Soil amendment, top dressing', 0],
    ['Fill Dirt', 'soil', 'Unscreened', 1.2, 'Raising grade, filling holes', 0],
    ['Clay', 'soil', 'Unscreened', 1.3, 'Pond liners, dams, compaction', 0],
    ['Common Fill', 'soil', 'Mixed', 1.25, 'Bulk fill and backfill', 0],

    ['Decomposed Granite', 'deco', '1/4 inch minus', 1.4, 'Paths, patios, xeriscape', 1],
    ['Stabilized Decomposed Granite', 'deco', '1/4 inch minus', 1.4, 'Firm paths and driveways', 0],
    ['Texas River Rock 1"–3"', 'deco', '1 to 3 inch', 1.35, 'Landscape beds, borders', 0],
    ['Texas River Rock 3"–5"', 'deco', '3 to 5 inch', 1.35, 'Dry creek beds, accents', 0],
    ['Black Star Gravel', 'deco', '5/8 inch', 1.4, 'Modern landscape beds, driveways', 0],
    ['Red Lava Rock', 'deco', '3/4 inch', 0.6, 'Landscape beds, fire features', 0],
    ['Rainbow Gravel', 'deco', '3/4 inch', 1.4, 'Landscape beds and walkways', 0],
    ['White Limestone Chips', 'deco', '3/4 inch', 1.4, 'Bright landscape beds, borders', 0],

    ['Recycled Concrete Base', 'recycled', '1-1/2 inch minus', 1.4, 'Road base, driveways, pads', 0],
    ['Crushed Concrete 3"×5"', 'recycled', '3 to 5 inch', 1.35, 'Construction entrances, stabilization', 0],
    ['Recycled Asphalt (RAP)', 'recycled', '3/4 inch minus', 1.4, 'Driveways, parking areas, rural roads', 0],
    ['Recycled Asphalt Millings', 'recycled', 'Mixed', 1.4, 'Low-dust driveways and lots', 0]
  ];

  var slug = function (s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
  // sample ratings, deterministic so the app and the admin panel agree
  var products = RAW.map(function (r, i) {
    var n = (i * 7 + 3) % 23;
    return {
      id: slug(r[0]), name: r[0], cat: r[1], size: r[2], density: r[3], uses: r[4],
      featured: !!r[5], rating: 4.2 + ((i * 3) % 8) / 10, reviews: n + 2, live: true, seed: i + 1
    };
  });

  var locations = [
    { id: 1, name: 'Yard 1', city: 'Waco', lon: -97.15, lat: 31.55, hours: 'Mon–Fri 7am–5pm · Sat 7am–12pm' },
    { id: 2, name: 'Yard 2', city: 'Temple', lon: -97.34, lat: 31.10, hours: 'Mon–Fri 7am–5pm · Sat 7am–12pm' },
    { id: 3, name: 'Yard 3', city: 'Hillsboro', lon: -97.13, lat: 32.01, hours: 'Mon–Fri 7am–5pm' },
    { id: 4, name: 'Yard 4', city: 'Corsicana', lon: -96.47, lat: 32.10, hours: 'Mon–Fri 7am–5pm' },
    { id: 5, name: 'Yard 5', city: 'Bryan', lon: -96.37, lat: 30.67, hours: 'Mon–Fri 7am–5pm · Sat 7am–12pm' }
  ];

  var reviews = [
    { id: 1, product: 'flex-base', name: 'Sample reviewer', stars: 5, text: 'Sample review. Compacted well and the load arrived when the dispatcher said it would.', status: 'published', date: 'Sep 28' },
    { id: 2, product: 'flex-base', name: 'Sample reviewer', stars: 4, text: 'Sample review. Good base for a 600 foot driveway. Ordered a second load a week later.', status: 'published', date: 'Sep 19' },
    { id: 3, product: 'pea-gravel-3-8', name: 'Sample reviewer', stars: 5, text: 'Sample review. Clean and consistent. Used it for a patio and a French drain.', status: 'published', date: 'Sep 30' },
    { id: 4, product: 'concrete-sand', name: 'Sample reviewer', stars: 5, text: 'Sample review. Exactly what the paver installer asked for.', status: 'pending', date: 'Oct 6' },
    { id: 5, product: 'screened-topsoil', name: 'Sample reviewer', stars: 3, text: 'Sample review. Good soil, a few small clods. Driver was careful with the lawn.', status: 'pending', date: 'Oct 6' },
    { id: 6, product: 'decomposed-granite', name: 'Sample reviewer', stars: 5, text: 'Sample review. Packed down firm for the walking path.', status: 'pending', date: 'Oct 5' },
    { id: 7, product: 'select-fill', name: 'Sample reviewer', stars: 4, text: 'Sample review. Pad passed compaction testing on the first try.', status: 'published', date: 'Sep 12' }
  ];

  var enquiries = [
    { id: 1041, type: 'Inquiry', name: 'Sample customer', subject: 'Flex base for a 1,200 ft ranch road', yard: 'Yard 1', status: 'New', date: 'Today 8:14am' },
    { id: 1040, type: 'Inquiry', name: 'Sample customer', subject: 'Delivery of 3 loads of select fill', yard: 'Yard 2', status: 'New', date: 'Today 7:02am' },
    { id: 1039, type: 'Complaint', name: 'Sample customer', subject: 'Load arrived later than scheduled', yard: 'Yard 5', status: 'In progress', date: 'Yesterday' },
    { id: 1038, type: 'Recommendation', name: 'Sample customer', subject: 'Please stock black star gravel in Bryan', yard: 'Yard 5', status: 'In progress', date: 'Yesterday' },
    { id: 1037, type: 'Feedback', name: 'Sample customer', subject: 'Driver was great on a tight site', yard: 'Yard 3', status: 'Closed', date: 'Oct 5' },
    { id: 1036, type: 'Inquiry', name: 'Sample customer', subject: 'Do you deliver to Marlin?', yard: 'Yard 1', status: 'Closed', date: 'Oct 4' }
  ];

  var banners = [
    { id: 1, kicker: 'Delivery', title: 'Loads on the road six days a week', sub: '10+ dump trucks covering about 60 miles around every yard.', cta: 'See delivery area', go: 'locations', cat: 'base' },
    { id: 2, kicker: 'Catalogue', title: '64 materials. One place to look.', sub: 'Sand, gravel, base, rock, soil and decorative stone.', cta: 'Browse materials', go: 'products', cat: 'gravel' },
    { id: 3, kicker: 'Planning a job?', title: 'Work out how much you need', sub: 'Enter the area and depth. Get cubic yards and tons.', cta: 'Open the calculator', go: 'calc', cat: 'sand' },
    { id: 4, kicker: 'Five Texas yards', title: 'Pick up or have it delivered', sub: 'Find the yard closest to your job site.', cta: 'Find a yard', go: 'locations', cat: 'deco' },
    { id: 5, kicker: 'Talk to us', title: 'Questions about a material?', sub: 'Send an inquiry and the nearest yard will answer.', cta: 'Contact us', go: 'contact', cat: 'rock' }
  ];

  // Procedural material swatch: a seeded SVG of grains in the category's tones.
  function rng(seed) { var s = seed * 9301 + 49297; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function swatch(p, w, h) {
    var cat = CATS.filter(function (c) { return c.id === p.cat; })[0];
    var r = rng(p.seed), t = cat.tone, out = '', n, i, x, y, a, b, rot;
    if (/black/i.test(p.name)) t = ['#3b3b3d', '#2a2a2c', '#505053', '#1c1c1e'];
    else if (/white/i.test(p.name)) t = ['#f2efe8', '#e2ded4', '#faf8f3', '#c9c4b8'];
    else if (/lava/i.test(p.name)) t = ['#8e2f22', '#6e2018', '#a8402f', '#4e1610'];
    else if (/asphalt/i.test(p.name)) t = ['#3f4042', '#2c2d2f', '#57585a', '#1f2021'];
    var bg = t[t.length - 1];
    if (cat.grain === 'fine') {
      n = Math.min(260, Math.round(w * h / 30));
      for (i = 0; i < n; i++) { x = r() * w; y = r() * h; a = 0.6 + r() * 1.6; out += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + a.toFixed(1) + '" fill="' + t[Math.floor(r() * t.length)] + '"/>'; }
      bg = t[1];
    } else {
      var big = cat.grain === 'large', step = big ? 30 : cat.grain === 'round' ? 15 : 13;
      for (y = -step; y < h + step; y += step) for (x = -step; x < w + step; x += step) {
        var cx = x + r() * step, cy = y + r() * step;
        a = step * (0.42 + r() * 0.3); b = a * (0.62 + r() * 0.34); rot = Math.floor(r() * 180);
        var fill = t[Math.floor(r() * (t.length - 1))];
        if (cat.grain === 'round') {
          out += '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" rx="' + a.toFixed(1) + '" ry="' + b.toFixed(1) + '" fill="' + fill + '" transform="rotate(' + rot + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')"/>';
        } else {
          var pts = '', k, sides = 5 + Math.floor(r() * 3);
          for (k = 0; k < sides; k++) { var ang = (k / sides) * 6.283 + r() * 0.5, rad = a * (0.7 + r() * 0.4); pts += (cx + Math.cos(ang) * rad).toFixed(1) + ',' + (cy + Math.sin(ang) * rad * 0.85).toFixed(1) + ' '; }
          out += '<polygon points="' + pts + '" fill="' + fill + '"/>';
        }
      }
    }
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect width="' + w + '" height="' + h + '" fill="' + bg + '"/>' + out + '</svg>';
  }

  return { cats: CATS, products: products, locations: locations, reviews: reviews, enquiries: enquiries, banners: banners, swatch: swatch };
})();
