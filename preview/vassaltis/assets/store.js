/* ==========================================================================
   VASSALTIS — concept demo store
   ALL PEOPLE, RESERVATIONS, EVENTS AND MESSAGES HERE ARE FICTIONAL.
   Emails use example.com. Nothing is sent anywhere; state lives in this
   browser's localStorage only and can be reset at any time.
   Shared by dashboard.html, client.html and the public pages (content +
   event inquiries), so an action in one surface shows up in the others.
   ========================================================================== */
(function () {
  const KEY = 'vassaltis.demo.v1';
  const TZ = 'Europe/Athens';

  /* ---- dates, always in Europe/Athens ---------------------------------- */
  function athensToday() {
    const p = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    return p; // YYYY-MM-DD
  }
  function addDays(iso, n) {
    const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function weekday(iso) { return new Date(iso + 'T12:00:00Z').getUTCDay(); } // 0 Sun
  function nextDinnerDay(iso, skip = 0) { // Tue(2) Thu(4) Sat(6)
    let d = iso, found = 0;
    for (let i = 0; i < 21; i++) { if ([2, 4, 6].includes(weekday(d))) { if (found === skip) return d; found++; } d = addDays(d, 1); }
    return d;
  }
  function stamp(iso, time) { return iso + 'T' + (time || '12:00') + ':00'; }

  /* ---- seed ------------------------------------------------------------- */
  function seed() {
    const T = athensToday();
    const G = [
      { id: 'g1', name: 'Claire Donnelly', email: 'claire.donnelly@example.com', phone: '+44 7700 900123', lang: 'English', country: 'United Kingdom', marketing: false, member: null, dietary: '', internal: 'First visit. Staying at The Vasilicos.' },
      { id: 'g2', name: 'Nikos Papadakis-Theodoropoulos', email: 'nikos.pt@example.com', phone: '+30 690 000 0001', lang: 'Ελληνικά', country: 'Greece', marketing: true, marketingAt: addDays(T, -410), member: { ref: 'CLUB-0418', since: '2023' }, dietary: '', internal: 'Club member. Loves Plethora; ask about older vintages.' },
      { id: 'g3', name: 'Hannah Whitfield', email: 'hannah.whitfield@example.com', phone: '+1 555 010 4477', lang: 'English', country: 'United States', marketing: false, member: null, dietary: 'Partner: coeliac', internal: 'Wedding client. Planner-free; prefers email.' },
      { id: 'g4', name: 'Marco Bellandi', email: 'marco.b@example.com', phone: '+39 333 000 0000', lang: 'Italiano', country: 'Italy', marketing: false, member: null, dietary: '', internal: '' },
      { id: 'g5', name: 'Aiko Tanaka', email: 'aiko.tanaka@example.com', phone: '+81 90 0000 0000', lang: 'English', country: 'Japan', marketing: false, member: null, dietary: 'Shellfish allergy', internal: 'Group of 4, one guest allergic to shellfish.' },
      { id: 'g6', name: 'Sofia Lindqvist-Aurelius von Hohenberg', email: 'sofia.lah@example.com', phone: '+46 70 000 00 00', lang: 'English', country: 'Sweden', marketing: true, marketingAt: addDays(T, -30), member: null, dietary: '', internal: '' },
      { id: 'g7', name: 'Daniel Okafor', email: 'd.okafor@example.com', phone: '+1 555 010 8812', lang: 'English', country: 'United States', marketing: false, member: null, dietary: 'Vegetarian', internal: '' },
      { id: 'g8', name: 'Eleni Markou', email: 'eleni.markou@example.com', phone: '+30 690 000 0002', lang: 'Ελληνικά', country: 'Greece', marketing: true, marketingAt: addDays(T, -200), member: { ref: 'CLUB-0231', since: '2022' }, dietary: '', internal: 'Athens-based. Hosts client dinners.' },
      { id: 'g9', name: 'Priya Raman', email: 'priya.raman@example.com', phone: '+44 7700 900456', lang: 'English', country: 'United Kingdom', marketing: false, member: null, dietary: '', internal: 'Anniversary.' },
      { id: 'g10', name: 'Lucas Moreau', email: 'lucas.moreau@example.com', phone: '+33 6 00 00 00 00', lang: 'Français', country: 'France', marketing: false, member: null, dietary: '', internal: '' },
      { id: 'g11', name: 'Emma Schulz', email: 'emma.schulz@example.com', phone: '+49 151 0000000', lang: 'Deutsch', country: 'Germany', marketing: false, member: null, dietary: 'No pork', internal: '' },
      { id: 'g12', name: 'Tom Reyes', email: 'tom.reyes@example.com', phone: '+1 555 010 2290', lang: 'English', country: 'United States', marketing: false, member: null, dietary: '', internal: '' }
    ];

    let n = 1040;
    const R = (o) => {
      const ref = 'VX-' + (n++);
      const src = o.source || 'i-host (manual import)';
      return Object.assign({
        id: ref, ref, venue: 'santorini', party: 2, status: 'Confirmed', payment: 'Not tracked',
        source: src, extId: src.startsWith('i-host') ? 'IH-' + (70000 + n * 7) : null,
        staff: 'Artemis K.', notes: '', winesServed: [],
        history: [{ at: stamp(addDays(o.date, -6), '10:14'), by: src.startsWith('i-host') ? 'Import' : 'Guest', text: src.startsWith('i-host') ? 'Imported from i-host export' : 'Requested via My Vassaltis' }]
      }, o);
    };
    const din0 = nextDinnerDay(T), din1 = nextDinnerDay(addDays(T, 1), 1);
    const res = [
      // today
      R({ guestId: 'g4', exp: 'tasting', date: T, time: '12:00', party: 2 }),
      R({ guestId: 'g9', exp: 'whole', date: T, time: '12:30', party: 2, notes: 'Anniversary — small card on table.', status: 'Checked in', history: [{ at: stamp(T, '09:02'), by: 'Import', text: 'Imported from i-host export' }, { at: stamp(T, '12:26'), by: 'Artemis K.', text: 'Checked in' }] }),
      R({ guestId: 'g11', exp: 'lunch', date: T, time: '13:30', party: 3, notes: 'No pork — adjust sharing course.' }),
      R({ guestId: 'g5', exp: 'cellar', date: T, time: '16:00', party: 4, notes: 'One guest: shellfish allergy.', staff: 'Yannis P.' }),
      R({ guestId: 'g7', exp: 'cellar', date: T, time: '16:00', party: 2, status: 'Requested', source: 'Portal request', staff: '' }),
      R({ guestId: 'g10', exp: 'tasting', date: T, time: '18:00', party: 2 }),
      // upcoming
      R({ guestId: 'g1', exp: 'tasting', date: T, time: '17:00', party: 2, notes: 'Staying at The Vasilicos.' }),
      R({ guestId: 'g6', exp: 'dinner', date: din0 === T ? nextDinnerDay(addDays(T, 1)) : din0, time: '20:00', party: 2, notes: 'Wine pairing +€55.' }),
      R({ guestId: 'g12', exp: 'dinner', date: din1, time: '20:00', party: 4, status: 'Requested', source: 'Portal request', staff: '' }),
      R({ guestId: 'g2', exp: 'whole', date: addDays(T, 9), time: '12:30', party: 2, notes: 'Club member.' }),
      R({ guestId: 'g8', exp: 'athens-tasting', venue: 'athens', date: addDays(T, 8), time: '19:00', party: 8, staff: 'Maria P.', notes: 'Client group. Amuse-bouches option.' }),
      R({ guestId: 'g4', exp: 'lunch', date: addDays(T, 2), time: '13:00', party: 2, status: 'Cancelled', history: [{ at: stamp(addDays(T, -3), '11:00'), by: 'Import', text: 'Imported from i-host export' }, { at: stamp(addDays(T, -1), '15:40'), by: 'Kiriaki K.', text: 'Cancelled in i-host by guest' }] }),
      R({ guestId: 'g11', exp: 'cellar', date: addDays(T, 1), time: '16:00', party: 2 }),
      // past
      R({ guestId: 'g2', exp: 'tasting', date: addDays(T, -21), time: '17:00', party: 2, status: 'Completed', winesServed: ['santorini', 'nassitis', 'gramina', 'vinsanto'] }),
      R({ guestId: 'g2', exp: 'dinner', date: nextDinnerDay(addDays(T, -60)), time: '20:00', party: 2, status: 'Completed', winesServed: ['petnat', 'aidani', 'plethora', 'mavrotragano', 'vinsanto'] }),
      R({ guestId: 'g8', exp: 'athens-dinner', venue: 'athens', date: addDays(T, -34), time: '20:30', party: 10, status: 'Completed', staff: 'Maria P.', winesServed: ['alcyone', 'gramina', 'vassanos'] }),
      R({ guestId: 'g7', exp: 'lunch', date: addDays(T, -2), time: '13:30', party: 2, status: 'Completed', winesServed: [] }),
      R({ guestId: 'g12', exp: 'tasting', date: addDays(T, -1), time: '12:00', party: 3, status: 'No-show' }),
      R({ guestId: 'g10', exp: 'cellar', date: addDays(T, -4), time: '16:00', party: 2, status: 'Completed', winesServed: ['santorini', 'nassitis', 'vassanos', 'vinsanto'] })
    ];

    const wedDate = addDays(T, 268);
    const events = [
      { id: 'E-201', title: 'Whitfield wedding', clientId: 'g3', type: 'Wedding', venue: 'santorini', date: wedDate, guests: 64, stage: 'awaiting', coordinator: 'Artemis K.', budget: '€€€ — shared on call', createdAt: addDays(T, -52),
        thread: [
          { at: stamp(addDays(T, -52), '09:12'), from: 'client', name: 'Hannah Whitfield', text: 'We visited last summer and can’t stop thinking about the hall at sunset. Could we hold a dinner reception for around 60–70 guests?' },
          { at: stamp(addDays(T, -51), '11:40'), from: 'staff', name: 'Artemis K.', text: 'Lovely to hear from you, Hannah. An inquiry doesn’t hold the date, but I’ve pencilled a call for Thursday to talk it through.' },
          { at: stamp(addDays(T, -6), '16:05'), from: 'staff', name: 'Artemis K.', text: 'Menu v2 is attached with the gluten-free swaps we discussed for James. Take your time — approve it in your portal when you’re both happy.' }
        ],
        internal: [{ at: stamp(addDays(T, -6), '16:10'), name: 'Artemis K.', text: 'Chef confirmed GF bread + dessert. Hold on final numbers until 60 days out.' }],
        menus: [
          { v: 1, sentAt: stamp(addDays(T, -20), '10:00'), status: 'Superseded', courses: ['Fava, capers, onion jam', 'Tomato keftedes', 'Sea bream, wild greens', 'Lamb, smoked aubergine', 'Vinsanto cream, sesame'] },
          { v: 2, sentAt: stamp(addDays(T, -6), '16:00'), status: 'Sent', courses: ['Fava, capers, onion jam', 'Tomato keftedes (GF batter)', 'Sea bream, wild greens', 'Lamb, smoked aubergine', 'Vinsanto cream, GF sesame crumble'] }
        ],
        approvals: [],
        docs: [{ name: 'Proposal', v: 2, at: addDays(T, -20) }, { name: 'Menu', v: 2, at: addDays(T, -6) }, { name: 'Floor sketch', v: 1, at: addDays(T, -14) }],
        decisions: [{ id: 'd1', text: 'Approve menu v2', due: addDays(T, 10), done: false }, { id: 'd2', text: 'Confirm ceremony location (off-site)', due: addDays(T, 30), done: false }, { id: 'd3', text: 'Final guest count', due: addDays(wedDate, -60), done: false }],
        runOfShow: [{ t: '18:30', what: 'Guests arrive — PetNat on the terrace' }, { t: '19:30', what: 'Sunset toast' }, { t: '20:00', what: 'Dinner in the hall' }, { t: '22:30', what: 'First dance' }]
      },
      { id: 'E-202', title: 'Halcyon Partners client dinner', clientId: 'g8', type: 'Corporate dinner', venue: 'athens', date: addDays(T, 23), guests: 10, stage: 'proposal', coordinator: 'Maria P.', budget: '', createdAt: addDays(T, -12),
        thread: [{ at: stamp(addDays(T, -12), '14:20'), from: 'client', name: 'Eleni Markou', text: 'Ten guests at Downtown again — could we build the dinner around the older whites?' }],
        internal: [], menus: [], approvals: [], docs: [{ name: 'Proposal draft', v: 1, at: addDays(T, -3) }], decisions: [], runOfShow: [] },
      { id: 'E-203', title: '40th birthday lunch', clientId: 'g6', type: 'Private celebration', venue: 'santorini', date: addDays(T, 41), guests: 18, stage: 'inquiry', coordinator: '', budget: '', createdAt: addDays(T, -1),
        thread: [{ at: stamp(addDays(T, -1), '21:02'), from: 'client', name: 'Sofia Lindqvist-Aurelius von Hohenberg', text: 'Long lunch for my partner’s 40th, flexible on the date in late October.' }],
        internal: [], menus: [], approvals: [], docs: [], decisions: [], runOfShow: [] },
      { id: 'E-198', title: 'Company offsite dinner', clientId: 'g12', type: 'Corporate dinner', venue: 'santorini', date: addDays(T, -18), guests: 30, stage: 'completed', coordinator: 'Artemis K.', budget: '', createdAt: addDays(T, -90), thread: [], internal: [], menus: [], approvals: [], docs: [{ name: 'Final invoice (external)', v: 1, at: addDays(T, -16) }], decisions: [], runOfShow: [] },
      { id: 'E-190', title: 'Rehearsal dinner', clientId: 'g10', type: 'Wedding', venue: 'santorini', date: addDays(T, 12), guests: 26, stage: 'lost', outcome: 'Date unavailable — offered alternative', coordinator: 'Artemis K.', budget: '', createdAt: addDays(T, -70), thread: [], internal: [], menus: [], approvals: [], docs: [], decisions: [], runOfShow: [] }
    ];

    const tasks = [
      { id: 't1', text: 'Confirm Daniel Okafor’s cellar tour request in i-host', due: T, done: false, who: 'Artemis K.', link: 'VX-1044' },
      { id: 't2', text: 'Tell kitchen: shellfish allergy, cellar tour 16:00', due: T, done: false, who: 'Yannis P.', link: 'VX-1043' },
      { id: 't3', text: 'Reply to 40th birthday lunch inquiry', due: addDays(T, 1), done: false, who: 'Artemis K.', link: 'E-203' },
      { id: 't4', text: 'Send Halcyon Partners proposal', due: addDays(T, 2), done: false, who: 'Maria P.', link: 'E-202' },
      { id: 't5', text: 'Upload Gramina 2023 fact sheet to wine page', due: addDays(T, -1), done: true, who: 'Kiriaki K.', link: '' }
    ];

    return {
      version: 1, seededOn: T, guests: G, reservations: res, events, tasks,
      notes: { 'g2:VX-1054:plethora': { text: 'Mushroom, sea salt. Better with the fava than I expected.', rating: 5, at: stamp(addDays(T, -58), '22:10') } },
      saved: { g1: ['santorini'], g2: ['plethora', 'gramina', 'vinsanto'], g3: ['petnat'] },
      content: {
        published: { heroTitle: 'Born of volcanic earth.\nShared around the table.', heroLede: 'Wines from old Assyrtiko vines on Santorini’s volcanic soil, poured in a winery built between two arches.', featured: ['santorini', 'gramina', 'nassitis', 'vinsanto'], notice: '' },
        draft: null, history: []
      },
      audit: []
    };
  }

  /* ---- persistence ------------------------------------------------------ */
  let cache = null;
  function load() {
    if (cache) return cache;
    try { const raw = localStorage.getItem(KEY); if (raw) { cache = JSON.parse(raw); return cache; } } catch (e) {}
    cache = seed(); persist(); return cache;
  }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) {} }
  const subs = [];
  window.addEventListener('storage', (e) => { if (e.key === KEY) { cache = null; load(); subs.forEach(f => f(cache)); } });

  const extra = {
    'athens-tasting': { id: 'athens-tasting', name: 'Downtown wine tasting', kind: 'Athens', price: null },
    'athens-dinner': { id: 'athens-dinner', name: 'Downtown wine dinner', kind: 'Athens', price: null }
  };

  window.VXS = {
    TZ, today: athensToday, addDays, weekday,
    get: load,
    update(fn, auditText, by) {
      const s = load(); fn(s);
      if (auditText) s.audit.unshift({ at: new Date().toISOString(), by: by || 'Demo', text: auditText });
      persist(); subs.forEach(f => f(s)); return s;
    },
    reset() { cache = seed(); persist(); subs.forEach(f => f(cache)); },
    onChange(f) { subs.push(f); },
    guest: id => load().guests.find(g => g.id === id),
    exp: id => extra[id] || (window.VX && VX.exp(id)) || { id, name: id },
    uid: p => p + Math.random().toString(36).slice(2, 7).toUpperCase(),
    fmtDate(iso, opts) { return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', Object.assign({ weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }, opts || {})); },
    fmtStamp(ts) { const d = new Date(ts.length <= 19 ? ts + 'Z' : ts); return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: ts.length <= 19 ? 'UTC' : TZ }); },
    nowStamp() { const p = new Intl.DateTimeFormat('sv-SE', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()); return p.replace(' ', 'T'); },
    esc: s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  };
})();
