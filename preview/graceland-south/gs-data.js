/* Graceland South concept: shared demo data + store.
   The site and the owner dashboard read the same store, so a request sent on
   the site shows up in the dashboard, and a weekend marked Booked in the
   dashboard shows Booked on the site. Demo only: it lives in this browser. */
(function () {
  var KEY = 'gs_concept_v1';

  var PROPS = {
    gs:   { name: 'Graceland South',      short: 'Graceland South',   beds: '3 bedrooms, 2 baths',   max: 8 },
    nr:   { name: "Neighbor's Retreat",   short: "Neighbor's Retreat", beds: '2 bedrooms, 2.5 baths', max: null },
    lake: { name: 'Graceland South at the Lake', short: 'Lake Harding', beds: '2 bedrooms, 2 baths', max: null }
  };

  // Statuses and wording are taken from augamedayrental.com as published.
  var WEEKENDS = [
    { id: 'vandy',   label: 'Vanderbilt vs. AU',  when: 'September 26',  kind: 'Football',   gs: 'booked',    nr: 'booked' },
    { id: 'lsu',     label: 'LSU vs. AU',         when: 'October 24',    kind: 'Football',   gs: 'booked',    nr: 'booked' },
    { id: 'ark',     label: 'Arkansas vs. AU',    when: 'November 7',    kind: 'Football',   gs: 'booked',    nr: 'booked' },
    { id: 'samford', label: 'Samford vs. AU',     when: 'November 21',   kind: 'Football',   gs: 'available', nr: 'available' },
    { id: 'fallgrad', label: 'Fall 2026 Graduation',  when: 'December',  kind: 'Graduation', gs: 'booked',    nr: 'available' },
    { id: 'springgrad', label: 'Spring 2027 Graduation', when: 'May',    kind: 'Graduation', gs: 'pending',   nr: 'booked' }
  ];

  // Sample guests for the demo. None of these are real people or real requests.
  var REQUESTS = [
    { id: 'r1', name: 'Sample guest: Dana Whitfield', email: 'dana@example.com', phone: '(555) 010-0142', prop: 'gs', weekend: 'samford', guests: 6,
      reason: 'Football weekend', stayed: 'First time',
      note: 'Three couples, all parents of Auburn students. We would arrive Friday around 4 and leave Sunday after lunch.',
      status: 'new', sent: 'Today, 8:12 AM' },
    { id: 'r2', name: 'Sample guest: Marcus Bell', email: 'marcus@example.com', phone: '(555) 010-0177', prop: 'gs', weekend: 'other', otherDates: 'October 9 to 11',
      guests: 4, reason: 'Tournament', stayed: 'Stayed before',
      note: 'Back for the fall pickleball tournament. Same four as last time.',
      status: 'new', sent: 'Yesterday, 6:40 PM' },
    { id: 'r3', name: 'Sample guest: Priya Raman', email: 'priya@example.com', phone: '(555) 010-0119', prop: 'nr', weekend: 'fallgrad', guests: 5,
      reason: 'Graduation', stayed: 'First time',
      note: 'Our daughter graduates in December. Grandparents are coming, so the two houses side by side would be perfect if both are open.',
      status: 'asked', sent: 'Monday, 2:05 PM',
      thread: [{ from: 'you', text: 'Thanks, Priya. How many of the five are adults, and will anyone need the downstairs bedroom?' }] }
  ];

  var STAYS = [
    { id: 's1', name: 'Sample guest: The Harmons', prop: 'gs', weekend: 'lsu', guests: 6, method: 'Zelle', paid: true },
    { id: 's2', name: 'Sample guest: Joel Castellano', prop: 'gs', weekend: 'ark', guests: 8, method: 'Check', paid: false },
    { id: 's3', name: 'Sample guest: The Okafors', prop: 'gs', weekend: 'fallgrad', guests: 5, method: 'Venmo', paid: true }
  ];

  var GUESTS = [
    { name: 'Sample guest: Marcus Bell', stays: 3, last: 'Spring tournament weekend', tag: 'Welcome back', note: 'Leaves the house spotless. Always the same four.' },
    { name: 'Sample guest: The Harmons', stays: 2, last: 'Last season, two games', tag: 'Welcome back', note: 'Parents of a senior. Asked about graduation weekend.' },
    { name: 'Sample guest: Joel Castellano', stays: 1, last: 'Booked for Arkansas', tag: 'New', note: '' },
    { name: 'Sample guest: Dana Whitfield', stays: 0, last: 'Requested Samford', tag: 'Not yet approved', note: '' }
  ];

  var QUESTIONS = [
    'Who all will be staying, and how do you know each other?',
    'Have you rented a game day home in Auburn before?',
    'About what time do you plan to arrive on Friday?'
  ];

  function fresh() {
    return {
      weekends: JSON.parse(JSON.stringify(WEEKENDS)),
      requests: JSON.parse(JSON.stringify(REQUESTS)),
      stays: JSON.parse(JSON.stringify(STAYS)),
      guests: JSON.parse(JSON.stringify(GUESTS)),
      questions: QUESTIONS.slice(),
      reviews: []
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.weekends && s.requests) return s;
      }
    } catch (e) { /* private mode or blocked storage: fall through to defaults */ }
    return fresh();
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch (e) { return false; }
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) { /* nothing stored */ }
    return fresh();
  }

  function weekendName(state, id, otherDates) {
    if (id === 'other') return otherDates ? otherDates : 'Other dates';
    for (var i = 0; i < state.weekends.length; i++) {
      if (state.weekends[i].id === id) return state.weekends[i].label + ' (' + state.weekends[i].when + ')';
    }
    return 'Other dates';
  }

  var STATUS = { available: 'Available', pending: 'Pending', booked: 'Booked', blocked: 'Not offered' };

  window.GS = { PROPS: PROPS, STATUS: STATUS, load: load, save: save, reset: reset, weekendName: weekendName,
    CLEANING: 125, EXTRA_GUEST: 50, BASE_OCCUPANCY: 6, NIGHTS: 2 };
})();
