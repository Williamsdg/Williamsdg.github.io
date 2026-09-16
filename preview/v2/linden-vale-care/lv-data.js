/* Linden & Vale Care — fictional concept. All data below is deterministic sample data. */
window.LV = (function () {
  'use strict';

  var VISITS = [
    { id: 'primary-care', name: 'Primary care visit', length: 30,
      desc: 'For a new concern, a follow-up, or a medication check-in with a regular clinician.' },
    { id: 'annual-physical', name: 'Annual physical', length: 45,
      desc: 'A yearly check-in: your history, routine measurements, and unhurried time for questions.' },
    { id: 'physical-therapy', name: 'Physical therapy', length: 50,
      desc: 'Movement-based sessions for recovery and strength, with exercises you can keep doing at home.' },
    { id: 'nutrition', name: 'Nutrition counseling', length: 45,
      desc: 'A practical conversation about meals, routines, and what fits your week. No products to buy.' },
    { id: 'behavioral-health', name: 'Behavioral-health intake conversation', length: 60,
      desc: 'A first, private conversation about what has been going on, to find the right next step together.' },
    { id: 'pediatric-well', name: 'Pediatric well visit', length: 30,
      desc: 'Growth, development, and routine check-ins for children, with a parent or guardian in the room.' }
  ];

  /* Roles only. No degrees, schools, certifications, or awards are claimed. */
  var PROVIDERS = [
    { id: 'okafor', name: 'Adaeze Okafor', initials: 'AO', role: 'Family nurse practitioner',
      languages: ['English', 'Igbo'], visits: ['primary-care', 'annual-physical', 'pediatric-well'],
      note: 'Sees adults and children. Likes to end each visit by writing the plan down together.',
      days: { Mon: [[8, 12], [13, 17]], Tue: [[8, 12]], Thu: [[10, 12], [13, 18]], Sat: [[9, 12]] } },
    { id: 'reyes', name: 'Tomás Reyes', initials: 'TR', role: 'Family physician',
      languages: ['English', 'Spanish'], visits: ['primary-care', 'annual-physical', 'behavioral-health', 'pediatric-well'],
      note: 'Sees whole families. Intake conversations with him are fully held this sample week.',
      full: ['behavioral-health'],
      days: { Mon: [[9, 12]], Tue: [[13, 18]], Wed: [[8, 12], [13, 17]], Fri: [[8, 12]] } },
    { id: 'lindqvist', name: 'Maren Lindqvist', initials: 'ML', role: 'Physical therapist',
      languages: ['English', 'Swedish'], visits: ['physical-therapy'],
      note: 'Works in the movement room on the ground floor. Sessions end with a short home routine.',
      days: { Mon: [[8, 12]], Wed: [[12, 18]], Thu: [[8, 12]], Fri: [[8, 16]], Sat: [[9, 12]] } },
    { id: 'anand', name: 'Priya Anand', initials: 'PA', role: 'Nutrition & wellness counselor',
      languages: ['English', 'Hindi'], visits: ['nutrition', 'behavioral-health'],
      note: 'Leads nutrition conversations and first behavioral-health intake conversations.',
      days: { Tue: [[9, 12], [13, 17]], Wed: [[9, 12]], Thu: [[13, 18]] } }
  ];

  var DAYS = [
    { id: 'Mon', label: 'Monday' }, { id: 'Tue', label: 'Tuesday' }, { id: 'Wed', label: 'Wednesday' },
    { id: 'Thu', label: 'Thursday' }, { id: 'Fri', label: 'Friday' }, { id: 'Sat', label: 'Saturday' }
  ];

  var HOURS = [
    ['Monday – Thursday', '8:00 am – 6:00 pm'],
    ['Friday', '8:00 am – 4:00 pm'],
    ['Saturday', '9:00 am – 12:00 pm'],
    ['Sunday', 'Closed']
  ];

  var CHECKLIST = {
    common: [
      { id: 'id', text: 'Photo ID', hint: 'Any government-issued card.' },
      { id: 'insurance', text: 'Insurance card', hint: 'Placeholder — this demo never asks for insurance details.' }
    ],
    newPatient: [
      { id: 'early', text: 'Arrive 15 minutes early', hint: 'New patients finish a short paperwork packet at the front desk.' }
    ],
    'primary-care': [
      { id: 'meds', text: 'A list of medicines and supplements you take', hint: 'Names and doses on paper or in your phone — not typed here.' },
      { id: 'top2', text: 'The one or two things you most want to talk about', hint: 'Short visits go further with a clear starting point.' },
      { id: 'records', text: 'Notes or results from other clinics, if you have them', hint: '' }
    ],
    'annual-physical': [
      { id: 'meds', text: 'A list of medicines and supplements you take', hint: 'Names and doses on paper or in your phone — not typed here.' },
      { id: 'vaccines', text: 'Dates of recent vaccines, if you know them', hint: '' },
      { id: 'questions', text: 'Questions you have been saving up', hint: 'Physicals have room for them.' },
      { id: 'breakfast', text: 'Ask the front desk whether any lab work means skipping breakfast', hint: 'An administrative check — this demo sends no reminders.' }
    ],
    'physical-therapy': [
      { id: 'clothes', text: 'Comfortable clothes you can move in', hint: 'Shorts or loose trousers work well.' },
      { id: 'shoes', text: 'Supportive shoes', hint: '' },
      { id: 'sheets', text: 'Any referral or exercise sheets you already have', hint: '' },
      { id: 'water', text: 'A water bottle', hint: '' }
    ],
    'nutrition': [
      { id: 'typical', text: 'A rough idea of a typical day of meals', hint: 'Keep it on paper for the conversation.' },
      { id: 'meds', text: 'A list of medicines and supplements you take', hint: 'Names and doses on paper or in your phone — not typed here.' },
      { id: 'budget', text: 'Questions about shopping, cooking, or budget', hint: '' }
    ],
    'behavioral-health': [
      { id: 'settle', text: 'Plan to arrive a few minutes early to settle in', hint: 'The quiet room is to the left of the front desk.' },
      { id: 'notes', text: 'Anything you want to say first, written for yourself', hint: 'Keep it with you — never type it into this demo.' },
      { id: 'support', text: 'Someone you can check in with after the visit, if you like', hint: '' }
    ],
    'pediatric-well': [
      { id: 'guardian', text: 'A parent or legal guardian comes along', hint: '' },
      { id: 'vaccine-record', text: "The child's vaccine record, if you have it", hint: '' },
      { id: 'comfort', text: 'A favorite book or toy for waiting', hint: '' },
      { id: 'growth', text: 'Questions about sleep, eating, or milestones', hint: '' }
    ]
  };

  function visit(id) { for (var i = 0; i < VISITS.length; i++) if (VISITS[i].id === id) return VISITS[i]; return null; }
  function provider(id) { for (var i = 0; i < PROVIDERS.length; i++) if (PROVIDERS[i].id === id) return PROVIDERS[i]; return null; }
  function providersFor(visitId) { return PROVIDERS.filter(function (p) { return p.visits.indexOf(visitId) > -1; }); }

  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  function fmt(mins) {
    var h = Math.floor(mins / 60), m = mins % 60, ap = h >= 12 ? 'pm' : 'am', hh = h % 12 || 12;
    return hh + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
  }

  /* Deterministic sample slots for one provider + visit type. */
  function slotsFor(providerId, visitId) {
    var p = provider(providerId), v = visit(visitId), out = [];
    if (!p || !v || p.visits.indexOf(visitId) < 0) return out;
    if (p.full && p.full.indexOf(visitId) > -1) return out;
    DAYS.forEach(function (d, di) {
      var blocks = p.days[d.id] || [], dayCount = 0;
      blocks.forEach(function (b) {
        for (var t = b[0] * 60; t + v.length <= b[1] * 60; t += 30) {
          if (dayCount >= 4) return;
          if (hash(p.id + d.id + t + v.id) % 10 < 6) continue; /* sample "already held" */
          out.push({ key: p.id + '-' + d.id + '-' + t, provider: p.id, day: d.id, dayIndex: di, start: t,
                     label: fmt(t), end: fmt(t + v.length) });
          dayCount++;
        }
      });
    });
    return out;
  }

  function slotsFirstAvailable(visitId) {
    var all = [];
    providersFor(visitId).forEach(function (p) { all = all.concat(slotsFor(p.id, visitId)); });
    all.sort(function (a, b) { return a.dayIndex - b.dayIndex || a.start - b.start; });
    return all;
  }

  function findSlot(key, visitId) {
    if (!key) return null;
    var pid = key.split('-')[0];
    var list = slotsFor(pid, visitId);
    for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
    return null;
  }

  function dayLabel(id) { for (var i = 0; i < DAYS.length; i++) if (DAYS[i].id === id) return DAYS[i].label; return id; }

  function checklist(visitId, isNew) {
    var items = [].concat(isNew ? CHECKLIST.newPatient : [], CHECKLIST.common, CHECKLIST[visitId] || []);
    return items;
  }

  /* Storage — this browser only, wrapped for private modes. */
  var PREFIX = 'v2-linden-vale-';
  function load(k, fallback) { try { var v = localStorage.getItem(PREFIX + k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
  function save(k, v) { try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  function clearAll() { try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf(PREFIX) === 0) localStorage.removeItem(k); }); } catch (e) { /* ignore */ } }

  return { VISITS: VISITS, PROVIDERS: PROVIDERS, DAYS: DAYS, HOURS: HOURS,
    visit: visit, provider: provider, providersFor: providersFor, slotsFor: slotsFor,
    slotsFirstAvailable: slotsFirstAvailable, findSlot: findSlot, dayLabel: dayLabel,
    checklist: checklist, load: load, save: save, clearAll: clearAll };
})();
