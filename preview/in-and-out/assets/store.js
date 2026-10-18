/* In and Out — shared demo store.
   One localStorage document read by dashboard.html, client.html and crew.html.
   Dates are generated relative to the day the demo is first opened, so it always looks current. */
(function () {
  var KEY = 'inandout.demo.v1';
  var listeners = [];

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function day(n) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return iso(d); }
  function at(n, hm) { return day(n) + 'T' + (hm || '09:00'); }

  function seed() {
    var users = {
      'u-tre':     { id: 'u-tre', name: 'Tre Perry', first: 'Tre', title: 'Owner & CEO', role: 'admin', photo: 'img/tre.webp', phone: '(205) 900-7547' },
      'u-jordan':  { id: 'u-jordan', name: 'Jordan Ellis', first: 'Jordan', title: 'Project Manager', role: 'pm', initials: 'JE', phone: '(205) 555-0110' },
      'u-marcus':  { id: 'u-marcus', name: 'Marcus Hill', first: 'Marcus', title: 'Project Manager', role: 'pm', initials: 'MH', phone: '(205) 555-0112' },
      'u-tyler':   { id: 'u-tyler', name: 'Tyler Perry', first: 'Tyler', title: 'Director of First Impressions', role: 'office', photo: 'img/tyler.webp', phone: '(205) 900-7547' }
    };

    var contractors = {
      'c-luis':   { id: 'c-luis', name: 'Luis Ortega', trade: 'Tile setter', phone: '(205) 555-0141', email: 'luis.ortega@example.com', since: '2023', note: 'Prefers texts before 7 AM.' },
      'c-dwayne': { id: 'c-dwayne', name: 'Dwayne Hollis', trade: 'Plumber', phone: '(205) 555-0152', email: 'dwayne.h@example.com', since: '2022', note: '' },
      'c-jerome': { id: 'c-jerome', name: 'Jerome Banks', trade: 'Electrician', phone: '(205) 555-0163', email: 'jbanks@example.com', since: '2024', note: '' },
      'c-ray':    { id: 'c-ray', name: 'Ray Castillo', trade: 'Roofing crew lead', phone: '(205) 555-0174', email: 'ray.castillo@example.com', since: '2024', note: 'Crew of four. Needs the dumpster dropped the day before.' },
      'c-kevin':  { id: 'c-kevin', name: 'Kevin Tran', trade: 'Hardwood sand & finish', phone: '(205) 555-0185', email: 'kevin.tran@example.com', since: '2021', note: '' },
      'c-andre':  { id: 'c-andre', name: 'Andre Whitaker', trade: 'Drywall & paint', phone: '(205) 555-0196', email: 'andre.w@example.com', since: '2023', note: '' },
      'c-sam':    { id: 'c-sam', name: 'Sam Pruitt', trade: 'Finish carpentry & trim', phone: '(205) 555-0107', email: 'sam.pruitt@example.com', since: '2022', note: '' },
      'c-maria':  { id: 'c-maria', name: 'Maria Delgado', trade: 'Flooring installer', phone: '(205) 555-0118', email: 'maria.d@example.com', since: '2021', note: 'LVP, laminate and carpet tile.' }
    };

    // admin-only ratings: q = quality, t = on time, c = communication, cl = clean-up (1–5)
    var ratings = [
      { id: 'r1', who: 'c-luis', project: 'IO-2031', at: day(-20), by: 'u-tre', q: 5, t: 5, c: 4, cl: 5, rehire: true, note: 'Niche and grab-bar blocking were perfect. Best tile work this year.' },
      { id: 'r2', who: 'c-luis', project: 'IO-1966', at: day(-96), by: 'u-tre', q: 5, t: 4, c: 4, cl: 5, rehire: true, note: '' },
      { id: 'r3', who: 'c-dwayne', project: 'IO-2031', at: day(-20), by: 'u-tre', q: 4, t: 3, c: 3, cl: 4, rehire: true, note: 'Showed up a day late for the valve swap. Work itself was clean.' },
      { id: 'r4', who: 'c-maria', project: 'IO-2050', at: day(-9), by: 'u-tre', q: 5, t: 5, c: 5, cl: 5, rehire: true, note: 'Finished the suite a day early over a weekend. Client noticed.' },
      { id: 'r5', who: 'c-maria', project: 'IO-1975', at: day(-60), by: 'u-tre', q: 4, t: 5, c: 5, cl: 4, rehire: true, note: '' },
      { id: 'r6', who: 'c-kevin', project: 'IO-1988', at: day(-238), by: 'u-tre', q: 5, t: 4, c: 3, cl: 4, rehire: true, note: 'Great finish. Has to be chased for start-time confirmations.' },
      { id: 'r7', who: 'c-andre', project: 'IO-1979', at: day(-48), by: 'u-tre', q: 3, t: 2, c: 2, cl: 2, rehire: false, note: 'Left mud on the new LVP and missed two days. Do not book on finished floors.' },
      { id: 'r8', who: 'c-sam', project: 'IO-2039', at: day(-3), by: 'u-tre', q: 5, t: 4, c: 5, cl: 4, rehire: true, note: '' },
      { id: 'r9', who: 'c-ray', project: 'IO-1991', at: day(-130), by: 'u-tre', q: 4, t: 4, c: 3, cl: 3, rehire: true, note: 'Missed a few nails in the side yard. Asked for a second magnet sweep.' },
      { id: 'r10', who: 'c-jerome', project: 'IO-1979', at: day(-48), by: 'u-tre', q: 4, t: 5, c: 5, cl: 5, rehire: true, note: '' }
    ];

    var clients = {
      'cl-reeves':   { id: 'cl-reeves', name: 'Dana & Chris Reeves', first: 'Dana', phone: '(205) 555-0123', email: 'dana.reeves@example.com' },
      'cl-whitfield':{ id: 'cl-whitfield', name: 'Karen Whitfield', first: 'Karen', phone: '(205) 555-0134', email: 'kwhitfield@example.com' },
      'cl-okafor':   { id: 'cl-okafor', name: 'Chidi & Ann Okafor', first: 'Ann', phone: '(205) 555-0145', email: 'ann.okafor@example.com' },
      'cl-bennett':  { id: 'cl-bennett', name: 'Laura Bennett', first: 'Laura', phone: '(205) 555-0156', email: 'laura.bennett@example.com' },
      'cl-hollis':   { id: 'cl-hollis', name: 'Hollis & Pike CPAs', first: 'Renee', phone: '(205) 555-0167', email: 'office@example.com' },
      'cl-greene':   { id: 'cl-greene', name: 'Patricia Greene', first: 'Patricia', phone: '(205) 555-0178', email: 'pgreene@example.com' },
      'cl-castro':   { id: 'cl-castro', name: 'Mike & Jen Castro', first: 'Jen', phone: '(205) 555-0189', email: 'jen.castro@example.com' },
      'cl-ward':     { id: 'cl-ward', name: 'Ben Ward', first: 'Ben', phone: '(205) 555-0190', email: 'ben.ward@example.com' }
    };

    function st(id, name, s, e, done, note) { return { id: id, name: name, start: day(s), end: day(e), done: !!done, note: note || '', client: true }; }

    var projects = [
      {
        id: 'IO-2047', title: 'Primary bath remodel', client: 'cl-reeves', division: 'Remodeling', city: 'Vestavia Hills',
        address: '1842 Shades Crest Rd, Vestavia Hills, AL 35216', geo: [33.4487, -86.7878],
        access: 'Side gate code 4471. Park on the street, not the driveway. Two friendly dogs, kept in the back room.',
        pm: 'u-jordan', status: 'active', created: day(-30),
        scope: ['Remove tub, tile and vanity down to studs', 'Traditional mud-pan walk-in shower with niche and bench', 'Vertical blue wall tile, marble-look floor tile', 'Double navy vanity, new lighting and GFCI outlets', 'Frameless glass door'],
        crew: ['c-luis', 'c-dwayne', 'c-jerome', 'c-andre'],
        stages: [
          st('s1', 'Demo & haul-off', -8, -7, true, 'Down to studs; subfloor checked and solid.'),
          st('s2', 'Rough plumbing & electrical', -6, -4, true, 'Valve moved to the entry wall; two new GFCI circuits.'),
          st('s3', 'Shower pan & wall tile', -3, 1, false, 'Pan flood-tested 24 hours before tile.'),
          st('s4', 'Floor tile & grout', 2, 3, false, ''),
          st('s5', 'Vanity, fixtures & glass', 4, 6, false, 'Glass is measured after tile, installed about 5 days later.'),
          st('s6', 'Final walkthrough', 7, 7, false, '')
        ],
        photos: [
          { id: 'ph1', src: 'img/p-old-tub.webp', stage: 's1', at: at(-9, '15:10'), by: 'u-jordan', what: 'Existing tub surround before demo', why: 'Records the starting condition for the client file.', room: 'Primary bath', client: true },
          { id: 'ph2', src: 'img/p-vanity-out.webp', stage: 's1', at: at(-8, '11:20'), by: 'c-andre', what: 'Old vanity and backsplash removed', why: 'Clears the wall for the new double vanity rough-in.', room: 'Primary bath', client: true },
          { id: 'ph3', src: 'img/p-bath-studs.webp', stage: 's1', at: at(-7, '14:05'), by: 'c-andre', what: 'Walls open to the studs', why: 'Lets us inspect for moisture behind the old tub. None found.', room: 'Primary bath', client: true },
          { id: 'ph4', src: 'img/p-sink-plumbing.webp', stage: 's2', at: at(-5, '10:40'), by: 'c-dwayne', what: 'New supply and drain lines for the double vanity', why: 'Second sink needs its own trap and shut-offs.', room: 'Primary bath', client: true },
          { id: 'ph5', src: 'img/p-shower-framing.webp', stage: 's2', at: at(-4, '16:15'), by: 'c-luis', what: 'Blocking set for bench, niche and grab bar', why: 'Solid wood behind the tile so the grab bar can be added any time.', room: 'Shower', client: true },
          { id: 'ph6', src: 'img/p-shower-tile.webp', stage: 's3', at: at(-1, '14:40'), by: 'c-luis', what: 'Wall tile set over the flood-tested mud pan', why: 'A traditional mud pan, sloped by hand, outlasts a prefab tray.', room: 'Shower', client: true },
          { id: 'ph7', src: 'img/p-drywall-damage.webp', stage: 's2', at: at(-5, '09:15'), by: 'u-jordan', what: 'Hall-side drywall bulge found during rough-in', why: 'Old leak, dry now. Patching is on the punch list — internal until priced.', room: 'Hallway', client: false }
        ],
        messages: [
          { id: 'm1', at: at(-6, '18:22'), from: 'client', text: 'Is it OK if we keep the old medicine cabinet? We might use it in the garage.', read: true },
          { id: 'm2', at: at(-6, '19:05'), from: 'u-jordan', text: 'Absolutely — Andre set it aside in your garage, left side by the freezer.', read: true },
          { id: 'm3', at: at(-1, '17:10'), from: 'u-jordan', text: 'Pan passed its 24-hour flood test and wall tile is up. Floor tile starts tomorrow at 8. Photos are in your project page.', read: true },
          { id: 'm4', at: at(0, '07:12'), from: 'client', text: 'Looks amazing! Quick question — can we still switch the grout to the lighter gray?', read: false },
          { id: 'm5', at: at(-4, '12:30'), from: 'u-jordan', text: 'Hall drywall bulge: price the patch before mentioning it to Dana. Andre can do it during fixtures week.', internal: true, read: true }
        ]
      },
      {
        id: 'IO-2039', title: 'Whole-home LVP & kitchen refresh', client: 'cl-whitfield', division: 'Flooring', city: 'Hoover',
        address: '5129 Lorna Rd, Hoover, AL 35244', geo: [33.4054, -86.8114],
        access: 'Lockbox on the front door, code 0912. Homeowner works from home in the front office.',
        pm: 'u-marcus', status: 'active', created: day(-40),
        scope: ['Remove carpet and vinyl, 1,450 sq ft', 'Level subfloor in kitchen', 'Waterproof LVP throughout main level', 'New stair treads and risers', 'Paint kitchen cabinets white'],
        crew: ['c-maria', 'c-sam'],
        stages: [
          st('s1', 'Furniture move & tear-out', -16, -15, true),
          st('s2', 'Subfloor leveling', -14, -13, true, 'Two low spots by the fridge, self-leveler poured.'),
          st('s3', 'LVP install', -12, -7, true),
          st('s4', 'Stairs & trim', -6, -3, true),
          st('s5', 'Final walkthrough', -1, 1, false, 'Punch list: two transitions, quarter round in the pantry.')
        ],
        photos: [
          { id: 'ph1', src: 'img/kitchen-before.webp', stage: 's1', at: at(-17, '10:00'), by: 'u-marcus', what: 'Kitchen before tear-out', why: 'Starting condition.', room: 'Kitchen', client: true },
          { id: 'ph2', src: 'img/living-stairs.webp', stage: 's3', at: at(-8, '16:30'), by: 'c-maria', what: 'LVP down through the living room', why: 'Planks run toward the stairs so the long sightline reads as one room.', room: 'Living room', client: true },
          { id: 'ph3', src: 'img/kitchen-tray.webp', stage: 's3', at: at(-7, '15:45'), by: 'c-maria', what: 'Kitchen LVP finished under the island overhang', why: 'Installed after leveling, so no hollow spots near the fridge.', room: 'Kitchen', client: true },
          { id: 'ph4', src: 'img/kitchen-island.webp', stage: 's4', at: at(-3, '13:20'), by: 'c-sam', what: 'Shoe molding and stair nosing complete', why: 'Covers the expansion gap the floor needs to move.', room: 'Kitchen', client: true },
          { id: 'ph5', src: 'img/living-window.webp', stage: 's4', at: at(-3, '15:05'), by: 'c-sam', what: 'Stairs and main level done', why: 'Ready for the final walkthrough.', room: 'Living room', client: true }
        ],
        messages: [
          { id: 'm1', at: at(-3, '17:40'), from: 'u-marcus', text: 'Stairs are done. Walkthrough tomorrow at 10 if that works?', read: true },
          { id: 'm2', at: at(-3, '18:02'), from: 'client', text: '10 is perfect. I noticed the pantry threshold — we can look at it together.', read: true },
          { id: 'm3', at: at(-1, '11:30'), from: 'u-marcus', text: 'Walkthrough done. Maria will fix the two transitions and the pantry quarter round tomorrow morning.', read: true }
        ]
      },
      {
        id: 'IO-2052', title: 'Roof replacement', client: 'cl-okafor', division: 'Remodeling', city: 'Homewood',
        address: '1708 Oxmoor Rd, Homewood, AL 35209', geo: [33.4718, -86.8008],
        access: 'Dumpster in the driveway. Keep the side yard clear for the kids. Cars moved to the street by 7 AM.',
        pm: 'u-marcus', status: 'active', created: day(-21),
        scope: ['Tear off two layers of shingles', 'Replace soft decking (up to 6 sheets included)', 'Synthetic underlayment and ice & water at valleys', 'Architectural shingles, new drip edge and flashing', 'Magnetic nail sweep of the whole yard, twice'],
        crew: ['c-ray'],
        stages: [
          st('s1', 'Tear-off', -2, -2, true, 'Two layers removed.'),
          st('s2', 'Decking repair', -1, -1, true, 'Four sheets replaced over the back porch.'),
          st('s3', 'Underlayment & flashing', 0, 0, false),
          st('s4', 'Shingles', 1, 2, false),
          st('s5', 'Gutters, clean-up & nail sweep', 3, 3, false),
          st('s6', 'Final walkthrough', 4, 4, false)
        ],
        photos: [
          { id: 'ph1', src: 'img/exterior-3.webp', stage: 's1', at: at(-3, '16:00'), by: 'u-marcus', what: 'House before tear-off', why: 'Records the starting condition from the street.', room: 'Exterior', client: true },
          { id: 'ph2', src: 'img/house-roof.webp', stage: 's1', at: at(-2, '10:25'), by: 'c-ray', what: 'Crew tearing off the second layer', why: 'Two layers is too much weight; we go down to the decking.', room: 'Roof', client: true },
          { id: 'ph3', src: 'img/roof-underlay.webp', stage: 's3', at: at(0, '09:40'), by: 'c-ray', what: 'Synthetic underlayment going on', why: 'Keeps the house dry if a storm comes before shingles.', room: 'Roof', client: true }
        ],
        messages: [
          { id: 'm1', at: at(-1, '18:15'), from: 'u-marcus', text: 'We replaced four soft sheets of decking over the back porch — covered in your contract allowance, no extra cost.', read: true },
          { id: 'm2', at: at(0, '06:48'), from: 'client', text: 'Rain is in the forecast for Thursday. Will the roof be covered?', read: false }
        ]
      },
      {
        id: 'IO-2044', title: 'Hardwood refinishing', client: 'cl-bennett', division: 'Flooring', city: 'Mountain Brook',
        address: '2915 Canterbury Rd, Mountain Brook, AL 35223', geo: [33.5009, -86.7522],
        access: 'Family staying with relatives during the work. Garage keypad 2580. Thermostat must stay at 68–72°F.',
        pm: 'u-jordan', status: 'scheduled', created: day(-12),
        scope: ['Sand 900 sq ft red oak to bare wood', 'Stain samples on site for approval', 'Three coats of water-based finish', 'Move furniture out and back'],
        crew: ['c-kevin'],
        stages: [
          st('s1', 'Furniture move & dust containment', 2, 2, false),
          st('s2', 'Sand & edge', 3, 3, false),
          st('s3', 'Stain samples & approval', 4, 4, false, 'Client picks from three samples on the floor.'),
          st('s4', 'Stain & finish coats', 5, 6, false),
          st('s5', 'Cure & furniture back', 7, 9, false),
          st('s6', 'Final walkthrough', 9, 9, false)
        ],
        photos: [
          { id: 'ph1', src: 'img/hardwood-before.webp', stage: 's1', at: at(-12, '11:00'), by: 'u-jordan', what: 'Assessment: worn finish in the main room', why: 'Board depth is good enough for a full sand.', room: 'Living room', client: true }
        ],
        messages: [
          { id: 'm1', at: at(-2, '09:00'), from: 'u-jordan', text: 'Reminder: Kevin starts in two days. We will handle the furniture — just pack small items and anything breakable.', read: true }
        ]
      },
      {
        id: 'IO-2058', title: 'Basement finishing', client: 'cl-castro', division: 'Remodeling', city: 'Hoover',
        address: '2204 Chapel Rd, Hoover, AL 35226', geo: [33.3950, -86.8300],
        access: 'Walk-out basement door at the back, code to come.',
        pm: 'u-jordan', status: 'planning', created: day(-4),
        scope: ['Frame and insulate exterior walls', 'Add a bedroom and full bath', 'Waterproof LVP throughout', 'Egress window in the new bedroom'],
        crew: [],
        stages: [
          st('s1', 'Framing & insulation', 14, 18, false),
          st('s2', 'Plumbing & electrical rough-in', 19, 23, false),
          st('s3', 'Drywall & paint', 24, 32, false)
        ],
        photos: [],
        messages: [
          { id: 'm1', at: at(-3, '14:00'), from: 'client', text: 'We signed the estimate! When will we see the schedule?', read: true },
          { id: 'm2', at: at(-3, '14:35'), from: 'u-jordan', text: 'Great news — I am building your timeline now and will publish it to your project page this week.', read: true }
        ]
      },
      {
        id: 'IO-2061', title: 'Garage epoxy floor', client: 'cl-ward', division: 'Flooring', city: 'Homewood',
        address: '512 Edgewood Blvd, Homewood, AL 35209', geo: [33.4790, -86.7930],
        access: 'Garage code 7731. Cars out by 8 AM, back in no sooner than 72 hours after topcoat.',
        pm: 'u-marcus', status: 'scheduled', created: day(-8),
        scope: ['Diamond-grind 2-car garage slab', 'Crack repair', 'Full-broadcast flake epoxy, gray blend', 'Clear polyaspartic topcoat'],
        crew: ['c-maria'],
        stages: [
          st('s1', 'Grind & crack repair', 5, 5, false),
          st('s2', 'Base coat & flake broadcast', 6, 6, false),
          st('s3', 'Topcoat', 7, 7, false),
          st('s4', 'Cure (no cars for 72 hrs)', 7, 10, false)
        ],
        photos: [],
        messages: []
      },
      {
        id: 'IO-2050', title: 'Office carpet tile', client: 'cl-hollis', division: 'Flooring', city: 'Birmingham',
        address: 'Suite 300, Morris Ave, Birmingham, AL 35203', geo: [33.5186, -86.8104],
        access: 'After-hours install. Building engineer lets the crew in at 6 PM.',
        pm: 'u-marcus', status: 'complete', created: day(-30),
        scope: ['Remove broadloom, 3,200 sq ft', 'Carpet tile in an ashlar pattern', 'Rubber base throughout'],
        crew: ['c-maria'],
        stages: [
          st('s1', 'Furniture lift & tear-out', -14, -14, true),
          st('s2', 'Carpet tile install', -13, -11, true),
          st('s3', 'Base & clean-up', -10, -10, true),
          st('s4', 'Final walkthrough', -10, -10, true)
        ],
        photos: [
          { id: 'ph1', src: 'img/commercial-2.webp', stage: 's2', at: at(-12, '22:10'), by: 'c-maria', what: 'Ashlar carpet tile down the main corridor', why: 'Ashlar offsets hide seams in long hallways.', room: 'Corridor', client: true },
          { id: 'ph2', src: 'img/commercial-3.webp', stage: 's2', at: at(-11, '23:40'), by: 'c-maria', what: 'File room and lockers complete', why: '', room: 'File room', client: true },
          { id: 'ph3', src: 'img/p-commercial-lobby.webp', stage: 's3', at: at(-10, '06:30'), by: 'u-marcus', what: 'Reception ready for Monday', why: 'Furniture back before staff arrive.', room: 'Reception', client: true }
        ],
        messages: [
          { id: 'm1', at: at(-10, '08:15'), from: 'client', text: 'Everyone loves it. Thank you for working nights!', read: true }
        ]
      },
      {
        id: 'IO-2031', title: 'Tub-to-shower conversion', client: 'cl-greene', division: 'Remodeling', city: 'Greystone',
        address: '1012 Greystone Cove Dr, Birmingham, AL 35242', geo: [33.4146, -86.6655],
        access: 'Ring the bell; Patricia is home.',
        pm: 'u-jordan', status: 'complete', created: day(-45),
        scope: ['Remove 1960s tub and wall tile', 'Low-threshold walk-in shower', 'Grab bar and fold-down bench', 'New vanity and lighting'],
        crew: ['c-luis', 'c-dwayne'],
        stages: [
          st('s1', 'Demo', -32, -32, true),
          st('s2', 'Plumbing & pan', -31, -29, true),
          st('s3', 'Tile', -28, -25, true),
          st('s4', 'Vanity & fixtures', -24, -23, true),
          st('s5', 'Final walkthrough', -21, -21, true)
        ],
        photos: [
          { id: 'ph1', src: 'img/tub-before-2.webp', stage: 's1', at: at(-33, '10:00'), by: 'u-jordan', what: 'Original blue tub', why: 'Starting condition.', room: 'Hall bath', client: true },
          { id: 'ph2', src: 'img/tub-before.webp', stage: 's1', at: at(-33, '10:02'), by: 'u-jordan', what: 'Original vanity and tile', why: '', room: 'Hall bath', client: true },
          { id: 'ph3', src: 'img/shower-after.webp', stage: 's5', at: at(-21, '15:00'), by: 'u-jordan', what: 'Walk-in shower complete', why: 'Low threshold so Patricia can step in safely.', room: 'Hall bath', client: true },
          { id: 'ph4', src: 'img/shower-after-2.webp', stage: 's5', at: at(-21, '15:03'), by: 'u-jordan', what: 'New vanity and lighting', why: '', room: 'Hall bath', client: true }
        ],
        messages: []
      },
      {
        id: 'IO-1988', title: 'Hardwood refinishing', client: 'cl-reeves', division: 'Flooring', city: 'Vestavia Hills',
        address: '1842 Shades Crest Rd, Vestavia Hills, AL 35216', geo: [33.4487, -86.7878],
        access: '', pm: 'u-jordan', status: 'complete', created: day(-250),
        scope: ['Sand and refinish living and dining rooms', 'Natural stain, satin finish'],
        crew: ['c-kevin'],
        stages: [
          st('s1', 'Sand & edge', -242, -242, true),
          st('s2', 'Finish coats', -241, -240, true),
          st('s3', 'Final walkthrough', -238, -238, true)
        ],
        photos: [
          { id: 'ph1', src: 'img/hardwood-sanding.webp', stage: 's1', at: at(-242, '10:30'), by: 'c-kevin', what: 'Drum sanding to bare wood', why: 'Removes old finish and the gray water marks by the back door.', room: 'Living room', client: true },
          { id: 'ph2', src: 'img/hardwood-buffing.webp', stage: 's2', at: at(-241, '14:10'), by: 'c-kevin', what: 'Buffing between coats', why: 'A light screen between coats keeps the finish smooth.', room: 'Dining room', client: true },
          { id: 'ph3', src: 'img/hall-hardwood.webp', stage: 's3', at: at(-238, '11:00'), by: 'u-jordan', what: 'Finished floors, natural stain, satin', why: 'Stain: natural. Finish: water-based satin, 3 coats. Keep for future touch-ups.', room: 'Hallway', client: true }
        ],
        messages: []
      }
    ];

    var tools = [
      ['t1', 'IO-T-001', '10" wet tile saw', 'Tile', 'site', 'IO-2047', 'c-luis', -3, 2, 'Good'],
      ['t2', 'IO-T-002', 'Self-leveling laser level', 'Layout', 'site', 'IO-2047', 'c-luis', -3, 2, 'Good'],
      ['t3', 'IO-T-003', 'Mixing drill & paddle', 'Tile', 'site', 'IO-2047', 'c-luis', -3, 2, 'Fair'],
      ['t4', 'IO-T-004', 'Wet/dry shop vac', 'Clean-up', 'site', 'IO-2047', 'c-andre', -8, 7, 'Good'],
      ['t5', 'IO-T-005', 'Dust containment poles (set of 4)', 'Clean-up', 'site', 'IO-2047', 'c-andre', -8, 7, 'Good'],
      ['t6', 'IO-T-006', 'Roofing coil nailer', 'Roofing', 'site', 'IO-2052', 'c-ray', -2, 3, 'Good'],
      ['t7', 'IO-T-007', 'Roofing coil nailer', 'Roofing', 'site', 'IO-2052', 'c-ray', -2, 3, 'Fair'],
      ['t8', 'IO-T-008', 'Rolling magnetic sweeper', 'Roofing', 'site', 'IO-2052', 'c-ray', -2, 3, 'Good'],
      ['t9', 'IO-T-009', '28 ft extension ladder', 'Access', 'site', 'IO-2052', 'c-ray', -2, 3, 'Good'],
      ['t10', 'IO-T-010', 'Drum floor sander', 'Hardwood', 'shop', null, null, null, null, 'Good'],
      ['t11', 'IO-T-011', 'Floor edger', 'Hardwood', 'shop', null, null, null, null, 'Good'],
      ['t12', 'IO-T-012', 'Orbital floor buffer', 'Hardwood', 'repair', null, null, -5, 3, 'Needs service'],
      ['t13', 'IO-T-013', 'Pin & pinless moisture meter', 'Layout', 'shop', null, null, null, null, 'Good'],
      ['t14', 'IO-T-014', 'Undercut jamb saw', 'Flooring', 'site', 'IO-2039', 'c-maria', -16, -2, 'Good'],
      ['t15', 'IO-T-015', 'Flooring nailer', 'Hardwood', 'shop', null, null, null, null, 'Good'],
      ['t16', 'IO-T-016', 'Pancake compressor', 'General', 'site', 'IO-2039', 'c-sam', -6, -2, 'Good'],
      ['t17', 'IO-T-017', 'Power carpet stretcher', 'Flooring', 'shop', null, null, null, null, 'Good'],
      ['t18', 'IO-T-018', 'Concrete grinder, 7"', 'Concrete', 'shop', null, null, null, null, 'Good'],
      ['t19', 'IO-T-019', 'Rotary hammer', 'General', 'missing', null, 'c-andre', -48, -40, 'Unknown'],
      ['t20', 'IO-T-020', 'Oscillating multi-tool', 'General', 'shop', null, null, null, null, 'Good'],
      ['t21', 'IO-T-021', 'Commercial dehumidifier', 'Clean-up', 'shop', null, null, null, null, 'Good'],
      ['t22', 'IO-T-022', '6 ft step ladder', 'Access', 'site', 'IO-2047', 'c-jerome', -6, 6, 'Good']
    ].map(function (r) {
      return { id: r[0], tag: r[1], name: r[2], cat: r[3], status: r[4], project: r[5], holder: r[6],
        out: r[7] === null ? null : day(r[7]), due: r[8] === null ? null : day(r[8]), cond: r[9],
        log: r[7] === null ? [] : [{ at: day(r[7]), text: r[4] === 'repair' ? 'Sent for service: pad drive slipping' : (r[4] === 'missing' ? 'Not returned from IO-1979' : 'Checked out to ' + r[5]) }] };
    });

    var assignments = [
      { id: 'a1', project: 'IO-2047', who: 'c-luis', date: day(0), start: '08:00', end: '15:30', status: 'onsite', checkIn: at(0, '07:52'),
        scope: 'Finish shower wall tile and set the niche shelf. Keep 1/8" joints to match. Floor tile prep if time allows.', tools: ['t1', 't2', 't3'], bring: ['Thinset (white, 4 bags in garage)', 'Tile spacers'], sentAt: at(-2, '16:00') },
      { id: 'a2', project: 'IO-2052', who: 'c-ray', date: day(0), start: '07:00', end: '17:00', status: 'accepted',
        scope: 'Synthetic underlayment over the full roof, ice & water at both valleys, new drip edge. Tarp anything not covered by 5 PM.', tools: ['t6', 't7', 't8', 't9'], bring: ['Tarps', 'Drip edge (delivered)'], sentAt: at(-3, '12:00') },
      { id: 'a3', project: 'IO-2039', who: 'c-maria', date: day(1), start: '08:30', end: '11:30', status: 'accepted',
        scope: 'Punch list: replace two transition strips (kitchen to hall, pantry) and run quarter round in the pantry.', tools: ['t14'], bring: ['Transition strips (in garage)', 'Quarter round, white'], sentAt: at(-1, '12:00') },
      { id: 'a4', project: 'IO-2044', who: 'c-kevin', date: day(2), start: '08:00', end: '17:00', status: 'sent',
        scope: 'Move furniture with our crew, set dust containment, begin sanding the main room.', tools: ['t10', 't11'], bring: ['Sandpaper: 36, 60, 80, 100 grit'], sentAt: at(0, '08:10') },
      { id: 'a5', project: 'IO-2047', who: 'c-dwayne', date: day(4), start: '09:00', end: '14:00', status: 'sent',
        scope: 'Set double vanity tops, install faucets, drains and shower trim. Pressure-test before leaving.', tools: [], bring: ['Vanity faucets (in garage, labeled)'], sentAt: at(-1, '15:30') },
      { id: 'a6', project: 'IO-2047', who: 'c-jerome', date: day(5), start: '09:00', end: '12:00', status: 'draft',
        scope: 'Hang two vanity sconces and the exhaust fan cover. Test GFCIs.', tools: ['t22'], bring: [], sentAt: null },
      { id: 'a7', project: 'IO-2050', who: 'c-maria', date: day(-11), start: '18:00', end: '02:00', status: 'done', doneAt: at(-10, '05:40'),
        scope: 'Carpet tile install, corridor and offices.', tools: [], bring: [], sentAt: at(-15, '10:00') },
      { id: 'a8', project: 'IO-2039', who: 'c-sam', date: day(-4), start: '08:00', end: '16:00', status: 'done', doneAt: at(-3, '15:20'),
        scope: 'Stair treads, risers, shoe molding.', tools: ['t16'], bring: [], sentAt: at(-8, '10:00') },
      { id: 'a9', project: 'IO-2047', who: 'c-andre', date: day(-8), start: '08:00', end: '16:00', status: 'done', doneAt: at(-7, '15:00'),
        scope: 'Demo bath to studs, haul-off, set containment.', tools: ['t4', 't5'], bring: [], sentAt: at(-12, '10:00') },
      { id: 'a10', project: 'IO-2047', who: 'c-dwayne', date: day(-5), start: '08:00', end: '16:00', status: 'done', doneAt: at(-4, '14:10'),
        scope: 'Rough-in double vanity supplies and drains, move shower valve.', tools: [], bring: [], sentAt: at(-9, '10:00') }
    ];

    return {
      v: 1, seededOn: day(0),
      users: users, contractors: contractors, ratings: ratings, clients: clients,
      projects: projects, tools: tools, assignments: assignments,
      templates: {
        'Bathroom remodel': ['Demo & haul-off', 'Rough plumbing & electrical', 'Shower pan & wall tile', 'Floor tile & grout', 'Vanity, fixtures & glass', 'Final walkthrough'],
        'Flooring install': ['Furniture move & tear-out', 'Subfloor prep', 'Install', 'Trim & transitions', 'Final walkthrough'],
        'Hardwood refinish': ['Furniture move & containment', 'Sand & edge', 'Stain samples & approval', 'Stain & finish coats', 'Cure & furniture back', 'Final walkthrough'],
        'Roof replacement': ['Tear-off', 'Decking repair', 'Underlayment & flashing', 'Shingles', 'Gutters & clean-up', 'Final walkthrough'],
        'Basement finishing': ['Framing & insulation', 'Plumbing & electrical rough-in', 'Inspection', 'Drywall & paint', 'Flooring', 'Trim & doors', 'Final walkthrough']
      }
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { var d = JSON.parse(raw); if (d && d.v === 1) return d; }
    } catch (e) {}
    return seed();
  }

  var db = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); }
    catch (e) {
      emit('error', 'This demo ran out of browser storage. Use “Reset demo” to clear uploaded photos.');
      return false;
    }
    emit('change');
    return true;
  }
  function emit(type, detail) { listeners.forEach(function (fn) { try { fn(type, detail); } catch (e) { console.error(e); } }); }

  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { db = load(); emit('change'); }
  });

  var IO = {
    get db() { return db; },
    day: day, at: at,
    on: function (fn) { listeners.push(fn); },
    save: save,
    mutate: function (fn) { fn(db); return save(); },
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} db = seed(); save(); },
    uid: function (p) { return (p || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); },
    project: function (id) { return db.projects.find(function (p) { return p.id === id; }); },
    client: function (id) { return db.clients[id]; },
    contractor: function (id) { return db.contractors[id]; },
    user: function (id) { return db.users[id]; },
    tool: function (id) { return db.tools.find(function (t) { return t.id === id; }); },
    person: function (id) {
      if (!id) return null;
      if (id === 'client') return { name: 'Client', first: 'Client' };
      return db.users[id] || db.contractors[id] || null;
    },
    // stage status: done / active / late / next / upcoming
    stageState: function (p, s) {
      var today = day(0);
      if (s.done) return 'done';
      var firstOpen = p.stages.find(function (x) { return !x.done; });
      if (firstOpen === s) {
        if (s.end < today) return 'late';
        if (s.start <= today) return 'active';
        return 'next';
      }
      return 'upcoming';
    },
    currentStage: function (p) { return p.stages.find(function (x) { return !x.done; }) || null; },
    progress: function (p) {
      if (!p.stages.length) return 0;
      return Math.round(p.stages.filter(function (s) { return s.done; }).length / p.stages.length * 100);
    },
    ratingSummary: function (cid) {
      var rs = db.ratings.filter(function (r) { return r.who === cid; });
      if (!rs.length) return null;
      function avg(k) { return rs.reduce(function (a, r) { return a + r[k]; }, 0) / rs.length; }
      var q = avg('q'), t = avg('t'), c = avg('c'), cl = avg('cl');
      return { n: rs.length, q: q, t: t, c: c, cl: cl, overall: (q + t + c + cl) / 4,
        rehire: Math.round(rs.filter(function (r) { return r.rehire; }).length / rs.length * 100), list: rs };
    }
  };

  window.IO = IO;
})();
