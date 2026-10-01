/* MBG shared data layer.
   One store drives both the public pages and the staff dashboard.
   `site`  = what is published (real facts taken from mountainbrookgymnastics.com, Oct 2026).
   the rest = operations data. Anything marked sample:true is illustrative, not real. */
(function (root) {
  var KEY = 'mbg.demo.v3';
  var IMG = 'https://img1.wsimg.com/isteam/ip/376cddf8-7865-464f-b0f9-69339fda12f0/';
  var PORTAL = 'https://app.iclasspro.com/portal/mountainbrookgymnastics';

  function seed() {
    var schedule = [
      // type, day(0=Mon), start, coach, capacity, enrolled, waitlist
      ['tb2', 0, '09:30', 'a', 8, 8, 2], ['am3', 0, '10:30', 'a', 6, 5, 0], ['f4', 0, '11:30', 'b', 8, 6, 0],
      ['f4', 0, '15:30', 'b', 8, 8, 1], ['beg', 0, '16:30', 'c', 8, 7, 0], ['int', 0, '16:30', 'd', 10, 9, 0],
      ['beg', 0, '17:30', 'c', 8, 4, 0], ['adv', 0, '17:45', 'hanna', 10, 10, 3],
      ['tb2', 1, '09:30', 'a', 8, 5, 0], ['am3', 1, '10:30', 'b', 6, 6, 1], ['f4', 1, '13:00', 'b', 8, 3, 0],
      ['beg', 1, '15:30', 'c', 8, 8, 0], ['beg', 1, '16:30', 'e', 8, 6, 0], ['int', 1, '17:30', 'd', 10, 7, 0],
      ['tb2', 2, '09:30', 'a', 8, 7, 0], ['tb2', 2, '10:30', 'a', 8, 1, 0], ['am3', 2, '11:30', 'b', 6, 4, 0],
      ['f4', 2, '15:30', 'e', 8, 5, 0], ['beg', 2, '16:30', 'c', 8, 8, 4], ['int', 2, '16:30', 'd', 10, 10, 1],
      ['adv', 2, '18:00', 'hanna', 10, 8, 0],
      ['am3', 3, '09:30', 'b', 6, 5, 0], ['f4', 3, '10:30', 'b', 8, 7, 0], ['tb2', 3, '11:30', 'a', 8, 6, 0],
      ['beg', 3, '15:30', 'e', 8, 5, 0], ['beg', 3, '16:30', 'c', 8, 7, 0], ['int', 3, '17:30', 'd', 10, 6, 0],
      ['adv', 3, '17:45', 'hanna', 10, 9, 0],
      ['tb2', 4, '09:30', 'a', 8, 8, 0], ['am3', 4, '10:30', 'b', 6, 3, 0], ['f4', 4, '11:30', 'e', 8, 4, 0],
      ['beg', 4, '15:30', 'c', 8, 6, 0], ['int', 4, '16:00', 'd', 10, 5, 0],
      ['tb2', 5, '08:30', 'f', 8, 6, 0], ['beg', 5, '09:00', 'e', 8, 8, 0], ['am3', 5, '09:30', 'f', 6, 6, 2],
      ['beg', 5, '10:15', 'e', 8, 5, 0], ['f4', 5, '10:30', 'f', 8, 7, 0]
    ].map(function (r, i) {
      return { id: 'c' + (i + 1), type: r[0], day: r[1], start: r[2], coach: r[3], cap: r[4], enrolled: r[5], wait: r[6] };
    });

    return {
      v: 3,
      /* ───────── published website content (real) ───────── */
      site: {
        announcement: { on: true, text: 'Fall registration is open. It’s never too late to sign up — we prorate if you join late.' },
        gymYear: 'Aug ’26 – Aug ’27',
        regFee: { single: 99, family: 135 },
        sessions: [
          { id: 's1', name: 'Fall Session 1', start: '2026-08-10', end: '2026-10-05', weeks: 8, note: 'No class Mon 9/7' },
          { id: 's2', name: 'Fall Session 2', start: '2026-10-08', end: '2026-12-09', weeks: 8, note: 'No PM classes Fri 10/23 · No class 11/23–11/27' }
        ],
        dates: [
          { id: 'd1', date: '2026-10-05', end: '', label: 'Last day of Session 1', kind: 'session' },
          { id: 'd2', date: '2026-10-06', end: '2026-10-07', label: 'No classes', kind: 'closed' },
          { id: 'd3', date: '2026-10-08', end: '', label: 'Session 2 starts', kind: 'session' },
          { id: 'd4', date: '2026-10-16', end: '', label: 'AM classes only', kind: 'partial' },
          { id: 'd5', date: '2026-10-23', end: '', label: 'No PM classes', kind: 'partial' },
          { id: 'd6', date: '2026-11-23', end: '2026-11-27', label: 'No classes — Thanksgiving', kind: 'closed' },
          { id: 'd7', date: '2026-12-09', end: '', label: 'Last day of Session 2', kind: 'session' }
        ],
        classTypes: [
          { id: 'tb2', program: 'Preschool', name: 'Tumble Buddy 2s', ages: '18 months – 3 years', minutes: 45, price: 185 },
          { id: 'am3', program: 'Preschool', name: '3 All Me', ages: '3 years', minutes: 45, price: 185 },
          { id: 'f4', program: 'Preschool', name: 'Fantastic 4s', ages: '4 & new 5s', minutes: 55, price: 210 },
          { id: 'beg', program: 'Recreational', name: 'Beginner Rec', ages: 'Girls 5+', minutes: 55, price: 220 },
          { id: 'int', program: 'Recreational', name: 'Intermediate Rec', ages: 'Girls 5+', minutes: 90, price: 305 },
          { id: 'adv', program: 'Recreational', name: 'Advanced Rec', ages: 'Girls 5+', minutes: 105, price: 325 }
        ],
        flippin: { date: '2026-10-24', time: '6:30 – 9:30 PM', ages: '4+', price: 35, sibling: 25 },
        meets: [
          { id: 'gjwhf', name: 'Girls Just Wanna Have Fun Invitational', start: '2026-10-23', end: '2026-10-24', who: 'Compulsory gymnasts', when: 'Every October' },
          { id: 'magic', name: 'Magic City Invitational', start: '2026-03-13', end: '2026-03-14', who: 'Optional & Xcel gymnasts', when: 'Every spring' }
        ],
        recruits: [
          { id: 'r1', name: 'Alexa Morgan', year: 2027, level: 'Level 10', ig: 'lexa_gymnastics_2027', photo: 'IMG_7080%202.JPG', show: true },
          { id: 'r2', name: 'Kaylee Eudy', year: 2027, level: 'Xcel Sapphire', ig: 'kaylee.eudy.gym_2027', photo: 'Kaylee%20HOCO%202025-2.JPG', show: true },
          { id: 'r3', name: 'Aspen Gonzalez', year: 2027, level: 'Level 9', ig: 'aspen.gymnast.2027', photo: 'IMG_7069.JPG', show: true },
          { id: 'r4', name: 'Mikayla Taylor', year: 2028, level: '', ig: 'mikayla_taylor_2028', photo: 'DSC_0270.JPG', show: true },
          { id: 'r5', name: 'Anniston Towe', year: 2029, level: 'Level 10', ig: 'anniston_k_towe2029', photo: 'IMG_8222.jpg', show: true },
          { id: 'r6', name: 'Maddie Kaplan', year: 2029, level: 'Level 9', ig: 'maddiekaplan2029', photo: 'IMG_8223.jpg', show: true }
        ],
        /* clinics + holiday camps staff choose to publish; empty = "check back" copy, as on the current site */
        specials: []
      },

      /* ───────── operations (sample unless noted) ───────── */
      staff: [
        { id: 'helen', name: 'Helen', role: 'Team Director', areas: ['Team'], sample: false },
        { id: 'hanna', name: 'Hanna Martin', role: 'Team Coach', areas: ['Team', 'Recreational'], sample: false },
        { id: 'becky', name: 'Becky', role: 'Home Meets & Parents’ Club contact', areas: ['Team'], sample: false },
        { id: 'a', name: 'Coach A', role: 'Preschool Instructor', areas: ['Preschool'], sample: true },
        { id: 'b', name: 'Coach B', role: 'Preschool Instructor', areas: ['Preschool', 'Camps'], sample: true },
        { id: 'c', name: 'Coach C', role: 'Recreational Instructor', areas: ['Recreational'], sample: true },
        { id: 'd', name: 'Coach D', role: 'Recreational Instructor', areas: ['Recreational', 'Events'], sample: true },
        { id: 'e', name: 'Coach E', role: 'Instructor', areas: ['Preschool', 'Recreational', 'Camps'], sample: true },
        { id: 'f', name: 'Coach F', role: 'Saturday Instructor', areas: ['Preschool', 'Events'], sample: true }
      ],
      classes: schedule,
      teamGroups: [
        { id: 'l3', name: 'Level 3', track: 'USAG', athletes: 18, hours: 6 }, { id: 'l4', name: 'Level 4', track: 'USAG', athletes: 16, hours: 9 },
        { id: 'l5', name: 'Level 5', track: 'USAG', athletes: 12, hours: 12 }, { id: 'l6', name: 'Level 6', track: 'USAG', athletes: 10, hours: 15 },
        { id: 'l7', name: 'Level 7', track: 'USAG', athletes: 9, hours: 18 }, { id: 'l8', name: 'Level 8', track: 'USAG', athletes: 7, hours: 20 },
        { id: 'l9', name: 'Level 9', track: 'USAG', athletes: 6, hours: 22 }, { id: 'l10', name: 'Level 10', track: 'USAG', athletes: 5, hours: 25 },
        { id: 'xs', name: 'Xcel Silver', track: 'Xcel', athletes: 14, hours: 6 }, { id: 'xg', name: 'Xcel Gold', track: 'Xcel', athletes: 12, hours: 8 },
        { id: 'xp', name: 'Xcel Platinum', track: 'Xcel', athletes: 8, hours: 10 }, { id: 'xd', name: 'Xcel Diamond', track: 'Xcel', athletes: 5, hours: 12 },
        { id: 'xsa', name: 'Xcel Sapphire', track: 'Xcel', athletes: 3, hours: 14 }
      ],
      meetTasks: [
        { id: 'm1', meet: 'gjwhf', text: 'Confirm judges panel', done: true },
        { id: 'm2', meet: 'gjwhf', text: 'Post session schedule to visiting clubs', done: true },
        { id: 'm3', meet: 'gjwhf', text: 'Parents’ Club volunteer sign-ups (concessions, awards, door)', done: false },
        { id: 'm4', meet: 'gjwhf', text: 'Order awards & 80s décor', done: false },
        { id: 'm5', meet: 'gjwhf', text: 'Move Friday PM classes (no PM classes 10/23)', done: true },
        { id: 'm6', meet: 'magic', text: 'Set 2027 dates and publish to the website', done: false }
      ],
      camps: [
        { id: 'k1', name: 'Winter Break Camp', kind: 'Holiday camp', start: '2026-12-21', end: '2026-12-23', ages: '3+', time: '9 AM – 12 PM', cap: 40, enrolled: 0, status: 'Draft', publish: false },
        { id: 'k2', name: 'Summer Camp · Week 1', kind: 'Summer day camp', start: '2027-06-01', end: '2027-06-04', ages: '3+', time: 'Half & full day', cap: 60, enrolled: 0, status: 'Planned', publish: false },
        { id: 'k3', name: 'Summer Camp · Week 2', kind: 'Summer day camp', start: '2027-06-07', end: '2027-06-11', ages: '3+', time: 'Half & full day', cap: 60, enrolled: 0, status: 'Planned', publish: false },
        { id: 'k4', name: 'Summer Camp · Week 3', kind: 'Summer day camp', start: '2027-06-14', end: '2027-06-18', ages: '3+', time: 'Half & full day', cap: 60, enrolled: 0, status: 'Planned', publish: false },
        { id: 'k5', name: 'Summer Camp · Week 4', kind: 'Summer day camp', start: '2027-06-21', end: '2027-06-25', ages: '3+', time: 'Half & full day', cap: 60, enrolled: 0, status: 'Planned', publish: false }
      ],
      events: [
        { id: 'e1', kind: 'Flippin’ Friday', title: 'Flippin’ Friday', date: '2026-10-24', time: '6:30 – 9:30 PM', cap: 40, booked: 22, lead: 'd', status: 'Open' },
        { id: 'e2', kind: 'Birthday party', title: 'Birthday party · turning 6 · 14 guests', date: '2026-10-03', time: '1:00 – 2:30 PM', cap: 0, booked: 0, lead: 'f', status: 'Confirmed' },
        { id: 'e3', kind: 'Birthday party', title: 'Birthday party · turning 8 · 18 guests', date: '2026-10-04', time: '2:00 – 3:30 PM', cap: 0, booked: 0, lead: 'd', status: 'Confirmed' },
        { id: 'e4', kind: 'Birthday party', title: 'Birthday party · turning 5 · 12 guests', date: '2026-10-10', time: '1:00 – 2:30 PM', cap: 0, booked: 0, lead: '', status: 'Needs host' },
        { id: 'e5', kind: 'Birthday party', title: 'Birthday party · turning 7 · 16 guests', date: '2026-10-17', time: '3:00 – 4:30 PM', cap: 0, booked: 0, lead: 'f', status: 'Confirmed' }
      ],
      inbox: [
        { id: 'i1', type: 'Private lesson', at: '2026-09-30T16:12:00', from: 'Sample parent', email: '', summary: 'Intermediate Rec · back walkover · weekday afternoons', status: 'New', assignee: '', sample: true },
        { id: 'i2', type: 'Private lesson', at: '2026-09-29T09:40:00', from: 'Sample parent', email: '', summary: 'Level 4 · kip on bars · Saturdays', status: 'Assigned', assignee: 'hanna', sample: true },
        { id: 'i3', type: 'Birthday party', at: '2026-09-30T20:05:00', from: 'Sample parent', email: '', summary: 'Turning 6 · about 15 kids · a Saturday in November', status: 'New', assignee: '', sample: true },
        { id: 'i4', type: 'Contact', at: '2026-09-28T13:22:00', from: 'Sample parent', email: '', summary: 'Is there a Saturday 3 All Me class with openings in Session 2?', status: 'Replied', assignee: '', sample: true },
        { id: 'i5', type: 'Job interest', at: '2026-09-27T11:02:00', from: 'Sample applicant', email: '', summary: 'Gymnastics Instructor · former Level 8 · available afternoons', status: 'New', assignee: '', sample: true }
      ]
    };
  }

  function load() {
    try {
      var raw = root.localStorage && root.localStorage.getItem(KEY);
      if (raw) { var s = JSON.parse(raw); if (s && s.v === 3 && s.site) return s; }
    } catch (e) {}
    return seed();
  }
  function save(state) {
    try { root.localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch (e) { return false; }
  }
  function reset() { try { root.localStorage.removeItem(KEY); } catch (e) {} return seed(); }
  function isCustom() { try { return !!root.localStorage.getItem(KEY); } catch (e) { return false; } }

  var api = { KEY: KEY, IMG: IMG, PORTAL: PORTAL, seed: seed, load: load, save: save, reset: reset, isCustom: isCustom };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MBG = api;
})(typeof window !== 'undefined' ? window : globalThis);
