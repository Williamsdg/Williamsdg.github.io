/* Gulf Coast Adventure Co. — v2 concept. Shared fictional data, map + species drawings, storage helpers.
   Everything here is SAMPLE data. Nothing is live inventory; nothing is booked or charged. */
(function () {
  'use strict';

  var ADDONS = {
    snorkel: { label: 'Snorkel set', price: 8, per: 'guest' },
    cooler: { label: 'Cooler with ice + water refills', price: 15, per: 'trip' },
    pouch: { label: 'Waterproof phone pouch', price: 6, per: 'guest' },
    photo: { label: "Crew photo set, shared after the trip", price: 25, per: 'trip' },
    clear: { label: 'Clear-bottom kayak upgrade', price: 12, per: 'guest' },
    lunch: { label: 'Boxed lunch', price: 18, per: 'guest' }
  };

  var BASE_CHECKLIST = [
    'Reef-safe sunscreen, applied before you arrive',
    'Refillable water bottle (one per guest)',
    'Hat or sunglasses with a strap',
    'Arrive 20 minutes before departure'
  ];

  var EXPERIENCES = [
    {
      id: 'dolphin', n: 1, name: 'Pass Dolphin Cruise',
      short: 'Ninety easy minutes out through Driftwood Pass, where dolphins often feed on the moving tide.',
      minutes: 90, duration: '1 hr 30 min', bucket: 'short',
      boat: 'Pelican', boatNote: 'Shaded 30-ft pontoon', capacity: 20,
      price: 38, pricing: 'guest',
      meeting: 'Harbor Slip 21 (fictional)',
      vibes: ['relaxed', 'family'], groups: ['1-2', '3-6', '7+'],
      img: 'assets/exp-dolphins.jpg', imgAlt: 'A pod of dolphins swimming just below the surface in deep blue water',
      species: ['dolphin', 'pelican', 'marker'],
      addons: ['pouch', 'photo'],
      slots: [
        { id: 'd1', day: 'Sat', time: '9:30 AM', h: 9.5, left: 12 },
        { id: 'd2', day: 'Sat', time: '11:30 AM', h: 11.5, left: 3 },
        { id: 'd3', day: 'Sat', time: '4:00 PM', h: 16, left: 0 },
        { id: 'd4', day: 'Sun', time: '10:00 AM', h: 10, left: 17 }
      ],
      timeline: [
        ['0:00', 'Check in at Harbor Slip 21', 'Find the crew at the slip sign; boarding starts 10 minutes before departure.'],
        ['0:10', 'No-wake channel past Marker 7', 'A slow idle out. Good time for the safety briefing and sunscreen top-ups.'],
        ['0:30', 'Inside Driftwood Pass', 'The captain slows to watch for fins where the tide pushes through.'],
        ['0:55', 'Short loop outside the pass', 'Only when the water is calm; otherwise the boat stays in the bay.'],
        ['1:30', 'Back at the slip', 'Off the boat and done before lunch.']
      ],
      bring: ['Sunscreen and a hat', 'Water bottle', 'A light layer for the breeze', 'Motion-sickness remedy if you need one'],
      checklist: ['Light layer for the ride back']
    },
    {
      id: 'sandbar', n: 2, name: 'Sandbar & Dolphin Half-Day',
      short: 'Anchor at Bottle Sandbar to wade and snorkel the shallows, then look for dolphins in the pass on the way home.',
      minutes: 240, duration: '4 hours', bucket: 'half',
      boat: 'Emerald Lady', boatNote: 'Covered 40-ft tour boat with a swim ladder', capacity: 18,
      price: 85, pricing: 'guest',
      meeting: 'Harbor Slip 21 (fictional)',
      vibes: ['family', 'relaxed'], groups: ['1-2', '3-6', '7+'],
      img: 'assets/exp-sandbar.jpg', imgAlt: 'Two people walking along a pale sandbar surrounded by clear turquoise shallows',
      species: ['sanddollar', 'stingray', 'dolphin', 'crab'],
      addons: ['snorkel', 'cooler', 'pouch', 'photo'],
      slots: [
        { id: 's1', day: 'Sat', time: '8:30 AM', h: 8.5, left: 9 },
        { id: 's2', day: 'Sat', time: '1:30 PM', h: 13.5, left: 2 },
        { id: 's3', day: 'Sun', time: '8:30 AM', h: 8.5, left: 14 },
        { id: 's4', day: 'Mon', time: '8:30 AM', h: 8.5, left: 18 }
      ],
      timeline: [
        ['0:00', 'Board Emerald Lady at Slip 21', 'Stow bags under the benches; the crew hands out snorkel sets if you added them.'],
        ['0:20', 'Channel run past Marker 7', 'Short safety talk: how the swim ladder works and where the shallows drop off.'],
        ['0:35', 'Anchor at Bottle Sandbar', 'About two hours to wade, float, and snorkel. Shuffle your feet in the sand.'],
        ['2:45', 'Pull anchor, head for the pass', 'Rinse off with the freshwater shower at the stern.'],
        ['3:05', 'Dolphin watch in Driftwood Pass', 'Engines low and a respectful distance. Sightings are common, never promised.'],
        ['4:00', 'Back at the slip', 'Collect your photo set link from the crew if you added one.']
      ],
      bring: ['Swimsuit worn under clothes', 'Towel', 'Water shoes for shell fragments', 'Snacks in a soft bag', 'Dry bag for phones and keys'],
      checklist: ['Swimsuit on under your clothes', 'Towel and water shoes', 'Dry bag for phones and keys']
    },
    {
      id: 'sail', n: 3, name: 'Bay Afternoon Sail',
      short: 'Two quiet hours under sail across the west bay, around Osprey Point and back on the breeze.',
      minutes: 120, duration: '2 hours', bucket: 'short',
      boat: 'Sea Breeze', boatNote: '34-ft sloop, six guests at most', capacity: 6,
      price: 65, pricing: 'guest',
      meeting: 'Harbor Slip 21 (fictional)',
      vibes: ['relaxed'], groups: ['1-2', '3-6'],
      img: 'assets/exp-sail.jpg', imgAlt: 'A white sailboat under full sail on open blue water',
      species: ['osprey', 'pelican', 'dolphin'],
      addons: ['cooler', 'photo'],
      slots: [
        { id: 'a1', day: 'Sat', time: '2:00 PM', h: 14, left: 4 },
        { id: 'a2', day: 'Sat', time: '5:00 PM', h: 17, left: 6 },
        { id: 'a3', day: 'Sun', time: '2:00 PM', h: 14, left: 1 },
        { id: 'a4', day: 'Sun', time: '5:00 PM', h: 17, left: 0 }
      ],
      timeline: [
        ['0:00', 'Step aboard Sea Breeze', 'Soft soles only on deck; the skipper shows you where to sit when the boat heels.'],
        ['0:15', 'Sails up past the harbor mouth', 'Engine off once there is enough wind. On a still day, the sail becomes a slow motor.'],
        ['0:45', 'Around Osprey Point', 'Look up at the nest platform on the point, viewed from the water only.'],
        ['1:15', 'West bay reach', 'Take the helm for a stretch if you like.'],
        ['2:00', 'Back at the slip', 'Sails down in the channel and tied up at Slip 21.']
      ],
      bring: ['Non-marking soft-soled shoes', 'Light jacket', 'Sunglasses with a strap', 'Water bottle'],
      checklist: ['Non-marking soft-soled shoes', 'Light jacket for the wind']
    },
    {
      id: 'kayak', n: 4, name: 'Heron Flats Paddle',
      short: 'A guided kayak or paddleboard trip over the seagrass flats to Heron Key, in shallow, sheltered water.',
      minutes: 180, duration: '3 hours', bucket: 'half',
      boat: 'Kayak + paddleboard fleet', boatNote: 'Single and tandem kayaks, paddleboards, one guide per five guests', capacity: 10,
      price: 55, pricing: 'guest',
      meeting: 'Heron Cove launch (fictional)',
      vibes: ['active'], groups: ['1-2', '3-6', '7+'],
      img: 'assets/exp-paddle.jpg', imgAlt: 'Aerial view of four paddleboarders on clear turquoise water',
      species: ['heron', 'stingray', 'pelican'],
      addons: ['clear', 'pouch'],
      slots: [
        { id: 'k1', day: 'Sat', time: '7:30 AM', h: 7.5, left: 6 },
        { id: 'k2', day: 'Sat', time: '10:30 AM', h: 10.5, left: 10 },
        { id: 'k3', day: 'Sun', time: '7:30 AM', h: 7.5, left: 3 },
        { id: 'k4', day: 'Sun', time: '10:30 AM', h: 10.5, left: 8 }
      ],
      timeline: [
        ['0:00', 'Meet at Heron Cove launch', 'Pick a kayak or board, fit your life vest, and get a 10-minute paddle lesson on the sand.'],
        ['0:20', 'Out across the cove', 'Stay behind the lead guide; the sweep guide paddles last.'],
        ['0:50', 'Heron Flats', 'Drift over seagrass and look down. This is where the clear-bottom kayaks earn their keep.'],
        ['1:40', 'Heron Key, from the water', 'A rest stop well back from the rookery. No landing on the key.'],
        ['3:00', 'Back at the launch', 'Rinse gear at the hose and hand it back.']
      ],
      bring: ['Closed-toe water shoes (required)', 'Clothes that can get wet', 'Hat with a chin strap', 'Water bottle with a clip', 'Small dry bag'],
      checklist: ['Closed-toe water shoes — required for the launch', 'Clothes that can get wet', 'Water bottle with a clip']
    },
    {
      id: 'private', n: 5, name: 'Private Island Day',
      short: "Your group's own boat and crew for the day: the sandbar, the pass, and a quiet gulf-side beach on the east island.",
      minutes: 420, duration: '7 hours', bucket: 'full',
      boat: 'Emerald Lady (private)', boatNote: 'Whole boat and crew for your group, up to 12 guests', capacity: 12,
      price: 1450, pricing: 'boat',
      meeting: 'Harbor Slip 21 (fictional)',
      vibes: ['family', 'active'], groups: ['3-6', '7+'],
      img: 'assets/panorama.jpg', imgAlt: 'Split view of turquoise shallow water below a bright sky',
      species: ['dolphin', 'sanddollar', 'crab', 'seaoats'],
      addons: ['snorkel', 'cooler', 'photo', 'lunch'],
      slots: [
        { id: 'p1', day: 'Tue', time: '8:00 AM', h: 8, left: 12 },
        { id: 'p2', day: 'Wed', time: '8:00 AM', h: 8, left: 12 },
        { id: 'p3', day: 'Thu', time: '8:00 AM', h: 8, left: 0 },
        { id: 'p4', day: 'Fri', time: '8:00 AM', h: 8, left: 12 }
      ],
      timeline: [
        ['0:00', 'Board at Slip 21', 'Your crew walks the group through the day and adjusts it to the weather.'],
        ['0:30', 'Morning at Bottle Sandbar', 'Wade and snorkel before the afternoon boats arrive.'],
        ['2:30', 'Through Driftwood Pass', 'Slow dolphin watch on the way out to the gulf side.'],
        ['3:00', 'East island beach stop', 'Lunch and a long swim on a quiet stretch of sand. Stay off the dunes.'],
        ['6:15', 'Easy run home through the bay', 'The captain picks the calmest line back.'],
        ['7:00', 'Back at the slip', '']
      ],
      bring: ['Swimsuits and towels', 'Shade layer or long sleeves', 'Water shoes', 'Lunch, unless you add boxed lunches', 'Dry bag'],
      checklist: ['Swimsuits, towels, and a shade layer', 'Water shoes', 'Lunch, or add boxed lunches']
    }
  ];

  var SPECIES = {
    dolphin: { name: 'Bottlenose dolphin', latin: 'Tursiops truncatus', where: 'Pass & channel', note: 'Often feeds where the tide funnels through the pass. Crews keep their distance and never feed or chase.' },
    pelican: { name: 'Brown pelican', latin: 'Pelecanus occidentalis', where: 'Pilings & markers', note: 'Rests on pilings and channel markers, then plunge-dives for bait fish.' },
    heron: { name: 'Great blue heron', latin: 'Ardea herodias', where: 'Grass flats', note: 'Stands still on the flats at low water. Paddle routes stay well back from nesting birds.' },
    osprey: { name: 'Osprey', latin: 'Pandion haliaetus', where: 'Points & platforms', note: 'The fish hawk. Hovers, then drops feet-first into the water.' },
    stingray: { name: 'Atlantic stingray', latin: 'Hypanus sabinus', where: 'Warm sand shallows', note: 'Rests half-buried in sand. Shuffle your feet as you wade so they glide away.' },
    sanddollar: { name: 'Sand dollar', latin: 'Mellita sp.', where: 'Sandbar bottom', note: 'Live ones are fuzzy and brownish. Look, then put them back in the water.' },
    crab: { name: 'Ghost crab', latin: 'Ocypode quadrata', where: 'Upper beach', note: 'Pale and fast, busiest near dusk. Watch for round burrows above the waterline.' },
    marker: { name: 'Channel marker', latin: 'Landmark', where: 'No-wake channel', note: 'Numbered posts guide boats through the channel. On this fictional chart, Marker 7 is the halfway point.' },
    seaoats: { name: 'Sea oats', latin: 'Uniola paniculata', where: 'Island dunes', note: 'Dune grass that holds the island together. Walk around dunes, never through them.' }
  };

  /* ---------- hand-drawn species icons (viewBox 0 0 80 56) ---------- */
  var S = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  var F = 'fill="var(--icon-fill, #D9E9DD)" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"';
  var ICONS = {
    dolphin: '<path ' + F + ' d="M6 36 C 16 22, 40 15, 58 21 C 64 23, 70 26, 76 30 L 67 32 C 58 35, 48 37, 38 37 C 28 37, 20 39, 13 44 Z"/><path ' + F + ' d="M34 20 C 36 13, 41 9, 47 7 C 44 12, 44 16, 45 19"/><path ' + S + ' d="M9 38 L 2 31 M9 40 L 3 47"/><path ' + S + ' d="M44 36 C 42 42, 38 45, 33 47"/><circle cx="63" cy="26" r="1.6" fill="currentColor"/><path ' + S + ' d="M10 52 C 22 48, 34 54, 46 50 C 56 47, 66 52, 76 49" opacity=".5"/>',
    pelican: '<rect x="30" y="46" width="14" height="10" ' + F + '/><path ' + F + ' d="M18 30 C 20 20, 38 17, 49 23 C 54 27, 54 34, 47 38 C 37 42, 22 40, 18 30 Z"/><path ' + S + ' d="M47 24 C 51 15, 54 8, 60 8 C 64 8, 66 10, 67 13"/><path ' + F + ' d="M66 12 L 78 26 C 72 26, 67 22, 63 17 Z"/><path ' + S + ' d="M35 40 L 35 46 M41 40 L 41 46 M24 28 C 30 26, 38 27, 44 31"/><circle cx="62" cy="11" r="1.4" fill="currentColor"/>',
    heron: '<path ' + F + ' d="M24 27 C 28 20, 44 19, 49 26 C 52 32, 43 36, 31 35 Z"/><path ' + S + ' d="M47 24 C 54 18, 47 13, 52 8"/><circle cx="54" cy="7" r="3.2" ' + F + '/><path ' + S + ' d="M57 7 L 72 9 M24 29 L 15 36 M36 35 L 34 53 M41 35 L 43 53 M30 53 L 38 53 M39 53 L 47 53"/><path ' + S + ' d="M4 53 C 12 50, 18 55, 26 52 M52 52 C 60 49, 68 54, 76 51" opacity=".5"/>',
    osprey: '<path ' + F + ' d="M40 27 C 33 18, 22 16, 5 21 C 16 23, 24 28, 35 33 Z"/><path ' + F + ' d="M40 27 C 47 18, 58 16, 75 21 C 64 23, 56 28, 45 33 Z"/><ellipse cx="40" cy="31" rx="5" ry="9" ' + F + '/><circle cx="40" cy="20" r="4" ' + F + '/><path ' + S + ' d="M37 39 L 40 47 L 43 39 M13 22 L 16 25 M67 22 L 64 25"/>',
    stingray: '<path ' + F + ' d="M40 8 C 56 12, 70 24, 76 30 C 66 35, 52 41, 40 43 C 28 41, 14 35, 4 30 C 10 24, 24 12, 40 8 Z"/><path ' + S + ' d="M40 43 C 40 49, 45 53, 56 55"/><circle cx="35" cy="19" r="1.6" fill="currentColor"/><circle cx="45" cy="19" r="1.6" fill="currentColor"/><path ' + S + ' d="M28 30 C 34 33, 46 33, 52 30" opacity=".6"/>',
    sanddollar: '<circle cx="40" cy="28" r="22" ' + F + '/><g ' + S + '><ellipse cx="40" cy="17" rx="3" ry="7"/><ellipse cx="40" cy="17" rx="3" ry="7" transform="rotate(72 40 28)"/><ellipse cx="40" cy="17" rx="3" ry="7" transform="rotate(144 40 28)"/><ellipse cx="40" cy="17" rx="3" ry="7" transform="rotate(216 40 28)"/><ellipse cx="40" cy="17" rx="3" ry="7" transform="rotate(288 40 28)"/></g><path ' + S + ' d="M30 42 L 32 46 M50 42 L 48 46 M40 45 L 40 49"/>',
    crab: '<ellipse cx="40" cy="32" rx="15" ry="9" ' + F + '/><path ' + S + ' d="M34 24 L 32 14 M46 24 L 48 14"/><circle cx="32" cy="12" r="2.6" ' + F + '/><circle cx="48" cy="12" r="2.6" ' + F + '/><path ' + S + ' d="M26 29 C 18 26, 14 21, 17 16 M17 16 L 22 18 M54 29 C 62 26, 66 21, 63 16 M63 16 L 58 18 M27 35 L 16 40 L 12 48 M29 38 L 21 45 L 19 53 M51 35 L 64 40 L 68 48 M49 38 L 59 45 L 61 53"/>',
    marker: '<path ' + S + ' d="M40 22 L 40 50"/><rect x="36" y="44" width="8" height="10" ' + F + '/><path ' + F + ' d="M28 26 L 40 5 L 52 26 Z"/><text x="40" y="23" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor" font-family="Figtree, sans-serif">7</text><path ' + S + ' d="M6 52 C 16 48, 24 55, 34 52 M46 52 C 56 48, 64 55, 74 52" opacity=".5"/>',
    seaoats: '<path ' + S + ' d="M30 54 C 30 38, 26 24, 20 8 M40 54 C 40 36, 42 22, 48 6 M50 54 C 52 42, 58 32, 66 24"/><g ' + F + '><ellipse cx="20" cy="10" rx="3" ry="5" transform="rotate(-20 20 10)"/><ellipse cx="23" cy="18" rx="3" ry="5" transform="rotate(-20 23 18)"/><ellipse cx="48" cy="8" rx="3" ry="5" transform="rotate(15 48 8)"/><ellipse cx="45" cy="17" rx="3" ry="5" transform="rotate(15 45 17)"/><ellipse cx="64" cy="26" rx="3" ry="5" transform="rotate(45 64 26)"/></g><path ' + S + ' d="M8 54 C 24 46, 56 46, 74 54" opacity=".5"/>'
  };
  function icon(key, cls) {
    return '<svg class="' + (cls || 'sp-ico') + '" viewBox="0 0 80 56" aria-hidden="true" focusable="false">' + (ICONS[key] || '') + '</svg>';
  }

  /* ---------- schematic chart ---------- */
  function smooth(pts, closed) {
    var p = pts.slice(), n = p.length, d = 'M' + p[0][0] + ' ' + p[0][1];
    function at(i) { return closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]; }
    var segs = closed ? n : n - 1;
    for (var i = 0; i < segs; i++) {
      var p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' + p2[0] + ' ' + p2[1];
    }
    return d + (closed ? 'Z' : '');
  }

  var GEO = {
    mainland: [[-40, -40], [1040, -40], [1040, 150], [930, 166], [860, 182], [800, 208], [752, 222], [708, 198], [640, 200], [560, 214], [492, 222], [466, 202], [432, 200], [414, 230], [350, 246], [292, 262], [252, 298], [224, 338], [202, 328], [184, 292], [130, 272], [60, 284], [-40, 280]],
    gulf: [[-40, 606], [180, 600], [320, 594], [440, 592], [490, 600], [530, 604], [570, 592], [620, 594], [760, 587], [900, 582], [1040, 576], [1060, 900], [-60, 900]],
    west: [[-40, 560], [80, 548], [200, 540], [320, 538], [420, 545], [470, 556], [480, 575], [440, 592], [320, 594], [180, 600], [60, 606], [-40, 612]],
    east: [[552, 556], [600, 540], [720, 532], [860, 526], [1040, 518], [1060, 576], [900, 584], [760, 590], [620, 596], [566, 590]],
    sandbar: [[505, 468], [540, 450], [600, 446], [648, 458], [630, 480], [566, 490]],
    shoal: [[478, 470], [530, 428], [610, 424], [676, 450], [650, 500], [560, 512]],
    flats: [[770, 262], [850, 250], [940, 290], [960, 380], [900, 430], [820, 400], [770, 330]],
    key: [[880, 380], [905, 368], [928, 382], [918, 402], [890, 404]]
  };

  var ROUTES = {
    dolphin: { dash: '', pts: [[440, 226], [462, 300], [484, 400], [505, 500], [512, 590], [530, 660], [580, 690], [612, 660], [570, 618], [528, 580], [512, 480], [494, 380], [470, 290], [452, 228]],
      badge: [612, 690], stops: [[440, 226, 'Harbor Slip 21'], [488, 410, 'Marker 7'], [512, 590, 'Driftwood Pass'], [604, 672, 'Outer pass loop']] },
    sandbar: { dash: '18 9', pts: [[430, 232], [446, 310], [480, 380], [530, 420], [580, 432], [610, 470], [560, 520], [500, 548], [470, 600], [440, 660], [406, 640], [436, 590], [470, 520], [456, 420], [428, 330], [420, 238]],
      badge: [380, 650], stops: [[430, 232, 'Harbor Slip 21'], [586, 436, 'Bottle Sandbar anchorage'], [446, 652, 'Pass dolphin watch']] },
    sail: { dash: '14 6 3 6', pts: [[420, 238], [380, 290], [310, 360], [230, 410], [130, 440], [70, 410], [110, 370], [210, 355], [300, 320], [380, 270], [412, 236]],
      badge: [58, 452], stops: [[420, 238, 'Harbor Slip 21'], [236, 404, 'Off Osprey Point'], [80, 420, 'West bay reach']] },
    kayak: { dash: '2 7', pts: [[752, 232], [772, 280], [820, 320], [880, 345], [946, 392], [920, 432], [860, 416], [806, 364], [766, 300], [744, 236]],
      badge: [960, 450], stops: [[752, 232, 'Heron Cove launch'], [836, 330, 'Heron Flats'], [940, 420, 'Heron Key (from the water)']] },
    'private': { dash: '26 6 6 6', pts: [[450, 226], [530, 290], [620, 360], [690, 440], [640, 506], [586, 540], [548, 580], [572, 640], [690, 646], [812, 616], [880, 640], [760, 684], [620, 690], [520, 640], [494, 560], [486, 460], [470, 340], [458, 226]],
      badge: [910, 672], stops: [[450, 226, 'Harbor Slip 21'], [690, 440, 'Sandbar, east side'], [548, 580, 'Driftwood Pass'], [812, 616, 'East island beach']] }
  };

  function textLabel(x, y, t, cls, extra) {
    return '<text x="' + x + '" y="' + y + '" class="' + cls + '"' + (extra || '') + '>' + t + '</text>';
  }

  function buildMap(opts) {
    opts = opts || {};
    var vb = opts.viewBox || '0 0 1000 780';
    var o = '<svg class="chart" viewBox="' + vb + '" role="group" aria-label="' + (opts.label || 'Schematic chart of the bay, pass and routes') + '" xmlns="http://www.w3.org/2000/svg">';
    o += '<defs>' +
      '<pattern id="stip-' + (opts.uid || 'm') + '" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.3" fill="#174D61" opacity=".16"/><circle cx="10" cy="10" r="1" fill="#174D61" opacity=".12"/></pattern>' +
      '<pattern id="grass-' + (opts.uid || 'm') + '" width="18" height="16" patternUnits="userSpaceOnUse"><path d="M4 12 l2 -7 M8 13 l0 -8 M12 12 l-2 -6" stroke="#2F7063" stroke-width="1.3" fill="none" opacity=".55"/></pattern>' +
      '<pattern id="hatch-' + (opts.uid || 'm') + '" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0 V8" stroke="#174D61" stroke-width="1" opacity=".14"/></pattern>' +
      '</defs>';
    var u = opts.uid || 'm';
    // water
    o += '<rect x="-60" y="-60" width="1120" height="960" fill="#CFE6E0"/>';
    o += '<path d="' + smooth(GEO.gulf, true) + '" fill="#A9D2D1"/>';
    // gulf contours
    ['M-40 680 C 160 660, 320 700, 520 690 S 860 660, 1040 672', 'M-40 740 C 200 722, 380 760, 600 748 S 880 724, 1040 734'].forEach(function (d) {
      o += '<path d="' + d + '" fill="none" stroke="#174D61" stroke-width="1.2" stroke-dasharray="4 6" opacity=".35"/>';
    });
    // shoal + flats
    o += '<path d="' + smooth(GEO.shoal, true) + '" fill="#E3F0E8"/>';
    o += '<path d="' + smooth(GEO.shoal, true) + '" fill="url(#hatch-' + u + ')"/>';
    o += '<path d="' + smooth(GEO.flats, true) + '" fill="#BFDDCB"/><path d="' + smooth(GEO.flats, true) + '" fill="url(#grass-' + u + ')"/>';
    // land
    o += '<path d="' + smooth(GEO.mainland, true) + '" fill="#BCD4C0" stroke="#174D61" stroke-width="2"/>';
    o += '<path d="' + smooth(GEO.mainland, true) + '" fill="url(#stip-' + u + ')"/>';
    o += '<path d="' + smooth(GEO.west, true) + '" fill="#F6F1E4" stroke="#174D61" stroke-width="2"/>';
    o += '<path d="' + smooth(GEO.east, true) + '" fill="#F6F1E4" stroke="#174D61" stroke-width="2"/>';
    o += '<path d="' + smooth(GEO.sandbar, true) + '" fill="#F6F1E4" stroke="#174D61" stroke-width="1.6" stroke-dasharray="5 4"/>';
    o += '<path d="' + smooth(GEO.key, true) + '" fill="#BCD4C0" stroke="#174D61" stroke-width="1.6"/>';
    // dunes ticks on islands
    [[120, 572], [260, 566], [380, 566], [660, 560], [800, 552], [950, 546]].forEach(function (p) {
      o += '<path d="M' + (p[0] - 10) + ' ' + p[1] + ' q10 -9 20 0" fill="none" stroke="#174D61" stroke-width="1.3" opacity=".45"/>';
    });
    // channel
    o += '<path d="M446 222 C 470 320, 500 460, 514 596" fill="none" stroke="#174D61" stroke-width="1.2" stroke-dasharray="2 5" opacity=".6"/>';
    // harbor
    o += '<g class="harbor"><rect x="428" y="206" width="30" height="10" rx="2" fill="#174D61"/><path d="M436 206 v-8 M450 206 v-8" stroke="#174D61" stroke-width="2"/></g>';
    // marker 7
    o += '<g><path d="M488 402 L 496 388 L 504 402 Z" fill="#F2C855" stroke="#174D61" stroke-width="1.6"/><text x="512" y="400" class="lbl-sm">7</text></g>';
    // labels
    if (!opts.noLabels) {
      o += textLabel(140, 120, 'MAINLAND', 'lbl-land');
      o += textLabel(250, 470, 'PELICAN BAY', 'lbl-water');
      o += textLabel(130, 720, 'OPEN GULF', 'lbl-water');
      o += textLabel(352, 188, 'Harbor · Slip 21', 'lbl-sm', ' text-anchor="end"');
      o += textLabel(352, 206, '(fictional)', 'lbl-xs', ' text-anchor="end"');
      o += textLabel(560, 628, 'DRIFTWOOD PASS', 'lbl-feat', ' text-anchor="start"');
      o += textLabel(712, 478, 'BOTTLE SANDBAR', 'lbl-feat', ' text-anchor="start"');
      o += '<path d="M706 472 L 652 466" stroke="#174D61" stroke-width="1.2" opacity=".6"/>';
      o += textLabel(820, 238, 'HERON FLATS', 'lbl-feat', ' text-anchor="start" dy="60" dx="10"');
      o += textLabel(752, 176, 'Heron Cove launch', 'lbl-sm', ' text-anchor="middle"');
      o += textLabel(196, 356, 'OSPREY PT.', 'lbl-feat', ' text-anchor="end"');
      o += textLabel(910, 360, 'Heron Key', 'lbl-xs', ' text-anchor="middle"');
    }
    // field-guide glyphs
    if (!opts.noLabels) {
      [['dolphin', 250, 624, 'dolphins in the pass'], ['heron', 628, 250, 'herons on the flats'], ['osprey', 96, 176, 'osprey nest'], ['seaoats', 150, 506, 'dune grass']].forEach(function (g) {
        o += '<g class="glyph" aria-hidden="true"><svg x="' + g[1] + '" y="' + g[2] + '" width="64" height="45" viewBox="0 0 80 56" color="#174D61" style="--icon-fill:#F6F1E4;overflow:visible">' + ICONS[g[0]] + '</svg>' +
          '<text x="' + (g[1] + 32) + '" y="' + (g[2] + 60) + '" text-anchor="middle" class="lbl-xs lbl-glyph">' + g[3] + '</text></g>';
      });
    }
    // compass
    if (!opts.noCompass) {
      o += '<g transform="translate(930 730)" aria-hidden="true"><circle r="30" fill="#F6F1E4" stroke="#174D61" stroke-width="1.5"/><path d="M0 -26 L 7 0 L 0 26 L -7 0 Z" fill="#174D61"/><path d="M0 -26 L 7 0 L -7 0 Z" fill="#F2C855" stroke="#174D61" stroke-width="1"/><text y="-36" text-anchor="middle" class="lbl-sm">N</text></g>';
    }
    // routes
    var only = opts.only;
    EXPERIENCES.forEach(function (e) {
      var r = ROUTES[e.id];
      if (only && only !== e.id) {
        o += '<path d="' + smooth(r.pts, false) + '" fill="none" stroke="#174D61" stroke-width="2" opacity=".18"' + (r.dash ? ' stroke-dasharray="' + r.dash + '"' : '') + '/>';
        return;
      }
      var d = smooth(r.pts, false);
      var interactive = !!opts.interactive;
      o += '<g class="route' + (only ? ' is-selected' : '') + '" data-id="' + e.id + '"' +
        (interactive ? ' tabindex="0" role="button" aria-pressed="false" aria-label="Route ' + e.n + ': ' + e.name + ', ' + e.duration + '"' : '') + '>';
      o += '<path class="r-hit" d="' + d + '"/>';
      o += '<path class="r-casing" d="' + d + '"/>';
      o += '<path class="r-line" d="' + d + '"' + (r.dash ? ' stroke-dasharray="' + r.dash + '"' : '') + '/>';
      o += '<g class="r-stops">';
      r.stops.forEach(function (s, i) {
        o += '<g class="stop"><circle cx="' + s[0] + '" cy="' + s[1] + '" r="11"/><text x="' + s[0] + '" y="' + (s[1] + 4.5) + '" text-anchor="middle">' + (i + 1) + '</text></g>';
      });
      o += '</g>';
      o += '<g class="r-badge"><circle cx="' + r.badge[0] + '" cy="' + r.badge[1] + '" r="17"/><text x="' + r.badge[0] + '" y="' + (r.badge[1] + 6) + '" text-anchor="middle">' + e.n + '</text></g>';
      o += '</g>';
    });
    o += '</svg>';
    return o;
  }

  /* ---------- tide sample ---------- */
  function tideAt(h) { return 0.5 + 0.42 * Math.sin(((h - 5.2) / 12.42) * Math.PI * 2); }
  function tideSvg(slots, selectedId) {
    var x0 = 6, x1 = 354, h0 = 6, h1 = 20, W = x1 - x0;
    function X(h) { return x0 + ((h - h0) / (h1 - h0)) * W; }
    function Y(v) { return 58 - v * 44; }
    var d = '';
    for (var h = h0; h <= h1 + 0.01; h += 0.25) d += (d ? ' L' : 'M') + X(h).toFixed(1) + ' ' + Y(tideAt(h)).toFixed(1);
    var o = '<svg class="tide" viewBox="0 0 360 82" aria-hidden="true" focusable="false">';
    o += '<path d="' + d + ' L' + x1 + ' 64 L' + x0 + ' 64 Z" fill="#D9E9DD"/><path d="' + d + '" fill="none" stroke="#174D61" stroke-width="1.6"/>';
    [6, 9, 12, 15, 18].forEach(function (t) {
      o += '<path d="M' + X(t) + ' 64 v4" stroke="#174D61" stroke-width="1"/><text x="' + X(t) + '" y="79" text-anchor="middle" class="tide-t">' + (t === 12 ? '12p' : t > 12 ? (t - 12) + 'p' : t + 'a') + '</text>';
    });
    (slots || []).forEach(function (s) {
      var on = s.id === selectedId;
      o += '<g class="tide-slot' + (on ? ' on' : '') + '"><path d="M' + X(s.h) + ' 6 V64" stroke="#174D61" stroke-width="' + (on ? 2 : 1) + '" stroke-dasharray="' + (on ? '' : '3 3') + '"/><circle cx="' + X(s.h) + '" cy="' + Y(tideAt(s.h)) + '" r="' + (on ? 5.5 : 3.5) + '" fill="' + (on ? '#F2C855' : '#fff') + '" stroke="#174D61" stroke-width="1.6"/></g>';
    });
    return o + '</svg>';
  }

  /* ---------- storage ---------- */
  var PREFIX = 'v2-gulf-coast-';
  var store = {
    get: function (k, fallback) { try { var v = localStorage.getItem(PREFIX + k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
    set: function (k, v) { try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) { } },
    del: function (k) { try { localStorage.removeItem(PREFIX + k); } catch (e) { } },
    clearAll: function () { ['draft', 'trip', 'checklist'].forEach(function (k) { store.del(k); }); }
  };

  function byId(id) { for (var i = 0; i < EXPERIENCES.length; i++) if (EXPERIENCES[i].id === id) return EXPERIENCES[i]; return null; }
  function money(n) { return '$' + n.toLocaleString('en-US'); }
  function priceLine(e) { return e.pricing === 'boat' ? money(e.price) + ' per boat' : money(e.price) + ' per guest'; }
  function computeTotal(e, guests, addonIds) {
    if (!e) return 0;
    var t = e.pricing === 'boat' ? e.price : e.price * guests;
    (addonIds || []).forEach(function (a) { var ad = ADDONS[a]; if (ad) t += ad.per === 'guest' ? ad.price * guests : ad.price; });
    return t;
  }

  window.GC = { EXPERIENCES: EXPERIENCES, ADDONS: ADDONS, SPECIES: SPECIES, BASE_CHECKLIST: BASE_CHECKLIST, ROUTES: ROUTES,
    icon: icon, buildMap: buildMap, tideSvg: tideSvg, store: store, byId: byId, money: money, priceLine: priceLine, computeTotal: computeTotal };
})();
