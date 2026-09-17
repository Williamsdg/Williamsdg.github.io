/* ==========================================================================
   ALTHEA ANAFI SUITES — concept demo store · Williams Digital · 2026-09-16
   Suite facts are Althea's published ones (see SOURCES.md).
   ALL GUESTS, RESERVATIONS, REQUESTS, TEAM MEMBERS AND MESSAGES ARE FICTIONAL.
   Emails use example.com. Nothing is sent anywhere: state lives in this
   browser's localStorage only (key below) and can be reset at any time.
   Shared by index.html, dashboard.html and client.html.
   ========================================================================== */
(function () {
  const KEY = 'althea.demo.v1';
  const TZ = 'Europe/Athens';
  const TODAY = '2026-09-23';          // fixed demo date
  const NOW = TODAY + 'T10:30';        // fixed demo "now", Athens local

  /* ---- published facts ---------------------------------------------------- */
  const BOOKING_URL = 'https://altheaanafisuites.reserve-online.net/';
  const CONTACT = { phone: '+30 2286 062 341', tel: '+302286062341', email: 'altheaanafisuites@gmail.com', instagram: 'https://www.instagram.com/althea.anafi.suites/', facebook: 'https://www.facebook.com/altheasuitesanafi' };

  // kitchen: true = listed on the suite page; null = not listed (do not assume either way)
  const SUITES = [
    { id: 'helios', name: 'Helios', el: 'Ήλιος', cat: 'Junior Suite', size: 32, guests: 2, beds: ['1 double bed'], bedsEl: ['1 διπλό κρεβάτι'], kitchen: true, photos: 9,
      line: 'Bathed in sunlight from dawn till dusk — a space filled with warmth and golden silence.',
      lineEl: 'Λουσμένη στο φως από την αυγή ως το σούρουπο — ένας χώρος γεμάτος ζεστασιά και χρυσή σιωπή.' },
    { id: 'meltemi', name: 'Meltemi', el: 'Μελτέμι', cat: 'Suite', size: 36, guests: 3, beds: ['1 double bed', '1 single bed'], bedsEl: ['1 διπλό κρεβάτι', '1 μονό κρεβάτι'], kitchen: true, photos: 8,
      line: 'Cool August winds, a breath of the Aegean — and a suite that invites you to flow with it.',
      lineEl: 'Δροσερά αυγουστιάτικα μελτέμια, μια ανάσα Αιγαίου — και μια σουίτα που σας καλεί να αφεθείτε.' },
    { id: 'thalassa', name: 'Thalassa', el: 'Θάλασσα', cat: 'Suite', size: 34, guests: 3, beds: ['1 double bed', '1 single bed'], bedsEl: ['1 διπλό κρεβάτι', '1 μονό κρεβάτι'], kitchen: null, photos: 8,
      line: 'The suite that breathes the sea — serene, open, and surrounded by blue.',
      lineEl: 'Η σουίτα που αναπνέει θάλασσα — γαλήνια, ανοιχτή, τυλιγμένη στο μπλε.' },
    { id: 'selene', name: 'Selene', el: 'Σελήνη', cat: 'Junior Suite', size: 32, guests: 2, beds: ['1 double bed'], bedsEl: ['1 διπλό κρεβάτι'], kitchen: null, photos: 8,
      line: 'Named after the moon that rises gently over Anafi — for nights that glow in stillness.',
      lineEl: 'Πήρε το όνομά της από το φεγγάρι που ανατέλλει απαλά πάνω από την Ανάφη — για νύχτες που λάμπουν στη σιωπή.' },
    { id: 'tholos', name: 'Tholos', el: 'Θόλος', cat: 'Superior Suite', size: 42, guests: 4, beds: ['2 double beds'], bedsEl: ['2 διπλά κρεβάτια'], kitchen: true, photos: 9,
      line: 'A suite shaped by the soft, vaulted curves of Cycladic architecture — designed for quiet moments and a natural sense of flow.',
      lineEl: 'Μια σουίτα σμιλεμένη από τις απαλές καμπύλες των κυκλαδίτικων θόλων — για ήσυχες στιγμές και φυσική ροή.' }
  ];
  const suite = (id) => SUITES.find(s => s.id === id);

  // group sizes are the ones printed on the Curated Experiences page
  const EXPERIENCES = [
    { id: 'hike', name: 'Guided hike on Mount Kalamos', el: 'Πεζοπορία με ξεναγό στον Καλαμό', group: '6–8 people', img: 'stars' },
    { id: 'boat', name: 'Boat ride with Elmar Anafi', el: 'Βόλτα με σκάφος με την Elmar Anafi', group: 'Private RIB up to 4 guests · pre-notice required', img: 'boat' },
    { id: 'bbq', name: 'Under-the-moon barbecue night', el: 'Βραδιά barbecue κάτω από το φεγγάρι', group: '10–12 people', img: 'bbq' },
    { id: 'yoga', name: 'Yoga on the terrace', el: 'Yoga στη βεράντα', group: 'Small group or private, on request', img: 'yoga' },
    { id: 'massage', name: 'Thai massage', el: 'Ταϊλανδέζικο μασάζ', group: 'On request', img: null }
  ];

  const TEAM = [
    { id: 't1', name: 'Eleni', role: 'Host' },
    { id: 't2', name: 'Maria', role: 'Housekeeping' },
    { id: 't3', name: 'Giorgos', role: 'Maintenance & transfers' }
  ];

  const CARE = ['ready', 'occupied', 'needs-cleaning', 'cleaning', 'inspection', 'maintenance'];
  const CARE_LABEL = { ready: 'Ready', occupied: 'Occupied', 'needs-cleaning': 'Needs cleaning', cleaning: 'Cleaning', inspection: 'Inspection', maintenance: 'Maintenance' };
  const CHECKLIST = ['Strip beds and bring fresh linen', 'Bathroom, towels and KORRES amenities', 'Coffee machine and capsules restocked', 'Mini bar restocked', 'Welcome treat of local goods', 'Balcony furniture wiped down', 'Final walk-through'];

  const REQ_LABEL = { received: 'Received', reviewing: 'Reviewing', proposed: 'Proposed — awaiting guest', confirmed: 'Confirmed', completed: 'Completed', declined: 'Declined', cancelled: 'Cancelled' };
  const REQ_TYPE = { arrival: 'Arrival assistance', breakfast: 'Breakfast', housekeeping: 'Housekeeping', experience: 'Experience', message: 'Message', pets: 'Pets' };

  /* ---- dates (calendar dates only — never elapsed ms) --------------------- */
  function addDays(iso, n) { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function nights(a, b) { return Math.round((Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z')) / 864e5); }
  function fmtDate(iso, opts) { return new Date(iso.slice(0, 10) + 'T12:00:00Z').toLocaleDateString('en-GB', Object.assign({ timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' }, opts || {})); }
  function fmtTime(stamp) { return stamp && stamp.length > 10 ? stamp.slice(11, 16) : ''; }
  function fmtStamp(stamp) { return fmtDate(stamp) + (stamp.length > 10 ? ' · ' + fmtTime(stamp) : ''); }

  /* ---- seed -------------------------------------------------------------- */
  function seed() {
    const T = TODAY;
    const res = [
      { id: 'AL-2031', suite: 'selene', guest: 'Marta Ferreira', email: 'marta.ferreira@example.com', phone: '+351 900 000 001', country: 'Portugal', party: 2, from: '2026-09-20', to: T, source: 'Direct — reserve-online', pay: 'Sample: paid in full', status: 'checked-in', arrival: { at: '2026-09-20T15:10', note: 'Day ferry from Santorini' }, notes: 'Leaving on the afternoon ferry.' },
      { id: 'AL-2034', suite: 'helios', guest: 'Anna Berg', email: 'anna.berg@example.com', phone: '+46 70 000 00 01', country: 'Sweden', party: 2, from: '2026-09-21', to: '2026-09-25', source: 'Direct — reserve-online', pay: 'Sample: deposit recorded', status: 'checked-in', arrival: { at: '2026-09-21T16:40', note: '' }, notes: 'Keen hikers.' },
      { id: 'AL-2036', suite: 'meltemi', guest: 'Giulia Conti', email: 'giulia.conti@example.com', phone: '+39 333 000 0001', country: 'Italy', party: 3, from: '2026-09-22', to: '2026-09-24', source: 'Email / phone', pay: 'Sample: balance due on departure', status: 'checked-in', arrival: { at: '2026-09-22T14:05', note: '' }, notes: 'Travelling with a teenager.' },
      { id: 'AL-2039', suite: 'thalassa', guest: 'Claire Whitaker', email: 'claire.whitaker@example.com', phone: '+44 7700 900 321', country: 'United Kingdom', party: 2, from: T, to: '2026-09-26', source: 'Direct — reserve-online', pay: 'Sample: deposit recorded', status: 'booked', arrival: { at: '2026-09-24T00:40', note: 'Overnight ferry from Piraeus. Booked from the 23rd as your FAQ suggests.' }, notes: 'First time on Anafi.', portal: true },
      { id: 'AL-2041', suite: 'selene', guest: 'Léa Martin', email: 'lea.martin@example.com', phone: '+33 6 00 00 00 01', country: 'France', party: 2, from: '2026-09-24', to: '2026-09-27', source: 'Direct — reserve-online', pay: 'Sample: deposit recorded', status: 'booked', arrival: null, notes: '' },
      { id: 'AL-2044', suite: 'tholos', guest: 'Nikos Andreou', email: 'nikos.andreou@example.com', phone: '+30 690 000 0003', country: 'Greece', party: 4, from: '2026-09-25', to: '2026-09-29', source: 'Email / phone', pay: 'Sample: deposit recorded', status: 'booked', arrival: null, notes: 'Family of four with a small dog.' },
      { id: 'AL-2045', suite: 'meltemi', guest: 'Sophie Laurent', email: 'sophie.laurent@example.com', phone: '+32 470 00 00 01', country: 'Belgium', party: 2, from: '2026-09-25', to: '2026-09-28', source: 'Direct — reserve-online', pay: 'Sample: not yet paid', status: 'booked', arrival: null, notes: '' },
      { id: 'AL-2047', suite: 'helios', guest: 'James Porter', email: 'james.porter@example.com', phone: '+1 555 010 2211', country: 'United States', party: 2, from: '2026-09-26', to: '2026-09-30', source: 'Direct — reserve-online', pay: 'Sample: deposit recorded', status: 'booked', arrival: null, notes: 'Anniversary.' },
      { id: 'AL-2049', suite: 'thalassa', guest: 'Katerina Pappa', email: 'k.pappa@example.com', phone: '+30 690 000 0004', country: 'Greece', party: 3, from: '2026-09-27', to: '2026-10-01', source: 'Email / phone', pay: 'Sample: not yet paid', status: 'booked', arrival: null, notes: '' },
      { id: 'AL-2028', suite: 'tholos', guest: 'Oliver Grant', email: 'oliver.grant@example.com', phone: '+44 7700 900 555', country: 'United Kingdom', party: 4, from: '2026-09-18', to: '2026-09-22', source: 'Direct — reserve-online', pay: 'Sample: paid in full', status: 'checked-out', arrival: null, notes: '' }
    ];

    const req = [
      { id: 'RQ-118', res: 'AL-2039', type: 'arrival', title: 'Transfer from Agios Nikolaos port', status: 'received', owner: 't3', at: '2026-09-22T19:12',
        detail: { arrivalAt: '2026-09-24T00:40', party: 2, luggage: '2 suitcases' },
        thread: [{ by: 'guest', at: '2026-09-22T19:12', text: 'Our ferry from Piraeus gets in at 00:40 on the 24th. Could you help us get from the port up to Chora?' }],
        proposal: null, staffNotes: 'Reservation starts the 23rd, so the suite is theirs when they land. Confirm driver.' },
      { id: 'RQ-117', res: 'AL-2034', type: 'experience', exp: 'hike', title: 'Sunrise hike on Mount Kalamos', status: 'reviewing', owner: 't1', at: '2026-09-22T09:40',
        detail: { date: '2026-09-25', party: 2 },
        thread: [{ by: 'guest', at: '2026-09-22T09:40', text: 'We would love the sunrise hike, ideally on the 25th before we leave.' }],
        proposal: null, staffNotes: 'Ask the guide whether the 25th has enough people (6–8).' },
      { id: 'RQ-116', res: 'AL-2036', type: 'breakfast', title: 'À la carte breakfast for 3', status: 'confirmed', owner: 't1', at: '2026-09-22T20:02',
        detail: { date: '2026-09-23', time: '09:00', party: 3 },
        thread: [{ by: 'guest', at: '2026-09-22T20:02', text: 'Could we have breakfast tomorrow at 9?' }, { by: 'staff', at: '2026-09-22T20:30', text: 'Of course — breakfast for three at 09:00. It is charged separately to your stay.' }],
        proposal: null, staffNotes: '' },
      { id: 'RQ-115', res: 'AL-2044', type: 'pets', title: 'Bringing a small dog', status: 'received', owner: 't1', at: '2026-09-21T11:18',
        detail: {},
        thread: [{ by: 'guest', at: '2026-09-21T11:18', text: 'We will be travelling with our small dog. Is there anything we should know?' }],
        proposal: null, staffNotes: 'Cleaning fee amount — owner to confirm before replying.' },
      { id: 'RQ-114', res: 'AL-2034', type: 'housekeeping', title: 'Extra towels', status: 'completed', owner: 't2', at: '2026-09-22T08:15',
        detail: {},
        thread: [{ by: 'guest', at: '2026-09-22T08:15', text: 'Could we have two extra towels for the pool?' }, { by: 'staff', at: '2026-09-22T09:00', text: 'Left at your door — enjoy the pool.' }],
        proposal: null, staffNotes: '' }
    ];

    const care = {
      helios:   { state: 'occupied', assignee: 't2', checklist: [], note: 'Daily tidy at 11:00', issue: null, outOfService: false },
      meltemi:  { state: 'occupied', assignee: 't2', checklist: [], note: 'Departs tomorrow', issue: null, outOfService: false },
      thalassa: { state: 'inspection', assignee: 't1', checklist: CHECKLIST.map((_, i) => i < 6), note: 'Late arrival tonight (00:40) — leave a light on', issue: null, outOfService: false },
      selene:   { state: 'needs-cleaning', assignee: 't2', checklist: CHECKLIST.map(() => false), note: 'Turnover after today’s departure — next guests arrive 24 Sep', issue: null, outOfService: false },
      tholos:   { state: 'maintenance', assignee: 't3', checklist: CHECKLIST.map(() => true), note: '', issue: { text: 'Bathroom tap dripping (sample issue)', at: '2026-09-22T17:30' }, outOfService: false }
    };

    const content = {
      heroTitle: 'A quieter kind of island escape.',
      heroTitleEl: 'Μια πιο ήσυχη απόδραση στο νησί.',
      heroSub: 'Five individual suites. Space to slow down. An island to discover.',
      heroSubEl: 'Πέντε ξεχωριστές σουίτες. Χώρος για να επιβραδύνετε. Ένα νησί να ανακαλύψετε.',
      heroImage: 'hero-pool',
      intro: 'Althea takes its name from an ancient Greek word for healing. Five suites sit in the heart of Chora, Anafi’s traditional village — close enough to walk to the pedestrian centre, high enough to look out over the endless Aegean and the great rock of Kalamos.',
      introEl: 'Η Althea παίρνει το όνομά της από μια αρχαία ελληνική λέξη που σημαίνει «θεραπεία». Πέντε σουίτες στην καρδιά της Χώρας, του παραδοσιακού οικισμού της Ανάφης — κοντά στο πεζοδρομημένο κέντρο, ψηλά πάνω από το απέραντο Αιγαίο και τον βράχο του Καλαμού.',
      elReview: [],
      faqPets: 'Yes, we are pet-friendly. We kindly ask that pets are not left unattended in the suite, and a small cleaning fee may apply.',
      expOpen: { hike: true, boat: true, bbq: true, yoga: true, massage: true },
      order: { helios: [4, 2, 1, 3, 5, 6, 7, 8, 9] }
    };

    return {
      v: 1, today: TODAY, reservations: res, requests: req, care,
      content: { published: content, draft: JSON.parse(JSON.stringify(content)), publishedAt: null },
      log: [{ at: '2026-09-23T08:02', text: 'Demo data loaded' }], seq: 200
    };
  }

  /* ---- persistence ------------------------------------------------------- */
  let mem = null, storageOk = true;
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const d = JSON.parse(raw); if (d && d.v === 1) return d; }
    } catch (e) { storageOk = false; }
    const d = seed(); save(d); return d;
  }
  function save(d) {
    mem = d;
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { storageOk = false; }
  }
  const listeners = new Set();
  function get() { if (!mem) mem = load(); return mem; }
  function update(fn, logText) {
    const d = get(); fn(d);
    if (logText) d.log.unshift({ at: NOW, text: logText });
    save(d); listeners.forEach(l => l(d));
  }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} mem = null; const d = get(); listeners.forEach(l => l(d)); }
  window.addEventListener('storage', (e) => { if (e.key === KEY) { mem = null; const d = get(); listeners.forEach(l => l(d)); } });

  /* ---- derived ----------------------------------------------------------- */
  function occupiedOn(d, night) { // reservation covers the night starting on `night`
    return d.reservations.filter(r => r.status !== 'cancelled' && r.status !== 'checked-out' && r.from <= night && r.to > night);
  }
  function arrivalsOn(d, day) { return d.reservations.filter(r => r.from === day && r.status !== 'cancelled'); }
  function departuresOn(d, day) { return d.reservations.filter(r => r.to === day && r.status !== 'cancelled'); }
  function lateArrivals(d) { return d.reservations.filter(r => r.arrival && r.arrival.at && r.arrival.at.slice(0, 10) > r.from && r.status === 'booked'); }
  function res(d, id) { return d.reservations.find(r => r.id === id); }
  function overlaps(d, r) {
    return d.reservations.filter(o => o.id !== r.id && o.suite === r.suite && o.status !== 'cancelled' && o.status !== 'checked-out' && o.from < r.to && r.from < o.to);
  }
  function nextId(d, prefix) { d.seq += 1; return prefix + '-' + d.seq; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  window.Althea = {
    KEY, TZ, TODAY, NOW, BOOKING_URL, CONTACT, SUITES, EXPERIENCES, TEAM, CARE, CARE_LABEL, CHECKLIST, REQ_LABEL, REQ_TYPE,
    suite, get, update, reset, onChange: (fn) => listeners.add(fn), storageOk: () => storageOk,
    addDays, nights, fmtDate, fmtTime, fmtStamp, occupiedOn, arrivalsOn, departuresOn, lateArrivals, res, overlaps, nextId, esc,
    team: (id) => TEAM.find(t => t.id === id)
  };
})();
