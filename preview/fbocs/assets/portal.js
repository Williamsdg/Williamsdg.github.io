/* FBOCS member area: working demo. Everything is kept in this browser (localStorage); there is no server.
   Families, students and messages are invented sample data. Dates, fees, subjects, credit and GPA rules come from fbocs.org. */
(() => {
  const F = window.FBOCS, NOW = new Date(), Y = F.year(NOW), KEY = 'fbocs-demo-v3';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const D = (y, m, d) => new Date(y, m, d);
  const SUBJ = ['Bible', 'Mathematics', 'Reading', 'Language Arts', 'Social Studies', 'Science', 'Physical Education'];
  const AREAS = [['English', 4, 'English/Language Arts'], ['Math', 4, 'Math'], ['Science', 4, 'Science'], ['Social Studies', 4, 'Social Studies'], ['PE', 1, 'Physical Education'], ['Health', .5, 'Health Education'], ['Art', .5, 'Art Education'], ['Bible', 2, 'Bible'], ['Electives', 4, 'Electives']];
  const LET = ['A', 'B', 'C', 'D', 'F'];
  const TYPES = { '': 'Standard', honors: 'Honors or advanced', college: 'Dual enrollment, AP or IB' };
  const STAFF = { admin: 'Administrator', principal: 'Principal' };
  const gradeName = g => g === 0 ? 'Kindergarten' : 'Grade ' + g;
  const isHS = s => s.grade >= 9;
  const cr = n => String(n).replace('.5', '½').replace(/^0½/, '½');
  const when = ms => { const d = new Date(ms), n = F.daysUntil(d, NOW); return n === 0 ? 'Today' : n === -1 ? 'Yesterday' : F.short(d); };
  const I = {
    home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>', kids: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.700 6 6M16 5.200a3 3 0 0 1 0 5.600M17.500 14.300c2.100.800 3.500 2.900 3.500 5.700"/>',
    paper: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>', chat: '<path d="M4 5h16v11H9l-5 4z"/>', acct: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.400 3.600-8 8-8s8 3.600 8 8"/>',
    check: '<path d="M4 12.500 9.500 18 20 6.500"/>', cap: '<path d="M2 9 12 4l10 5-10 5z"/><path d="M6 11.500V16c0 1.500 2.700 3 6 3s6-1.500 6-3v-4.500"/>',
  };
  const ico = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[k]}</svg>`;

  /* ---------- sample data ---------- */
  const rnd = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return ((h >>> 0) % 1000) / 1000; };
  const C = (yr, name, area, credit, type, final) => ({ id: 'c' + Math.abs((yr + name).split('').reduce((a, c) => a * 31 + c.charCodeAt(0) | 0, 7)), yr, name, area, credit, type: type || '', final: final || '' });
  function seed() {
    const y = Y.y;
    const fam = (id, name, parents, type, first, kids) => ({ id, name, parents, type, first, email: name.toLowerCase() + '.family@example.com', phone: '334-555-01' + String(10 + +id.slice(1) * 7).slice(0, 2), students: kids.map((k, i) => ({ id: id + 's' + (i + 1), first: k[0], grade: k[1], courses: k[2] || [] })) });
    const families = [
      fam('f1', 'Whitfield', 'James and Anna Whitfield', 'member', false, [['Caleb', 10, [
        C(y - 1, 'English 9', 'English', 1, '', 'A'), C(y - 1, 'Algebra I', 'Math', 1, '', 'B'), C(y - 1, 'Physical Science', 'Science', 1, '', 'A'), C(y - 1, 'World History with Geography', 'Social Studies', 1, '', 'A'),
        C(y - 1, 'Old Testament Survey', 'Bible', 1, '', 'A'), C(y - 1, 'Physical Education', 'PE', 1, '', 'A'), C(y - 1, 'Health', 'Health', .5, '', 'A'), C(y - 1, 'Art Appreciation', 'Art', .5, '', 'B'),
        C(y, 'English 10', 'English', 1), C(y, 'Geometry', 'Math', 1), C(y, 'Biology with lab', 'Science', 1), C(y, 'US History', 'Social Studies', 1), C(y, 'New Testament Survey', 'Bible', 1), C(y, 'Spanish I', 'Electives', 1), C(y, 'Piano', 'Electives', .5)]],
      ['Lydia', 8], ['Micah', 4]]),
      fam('f2', 'Okafor', 'Daniel and Grace Okafor', 'member', false, [['Naomi', 12, [
        C(y - 3, 'English 9', 'English', 1, '', 'A'), C(y - 3, 'Algebra I', 'Math', 1, '', 'A'), C(y - 3, 'Physical Science', 'Science', 1, '', 'A'), C(y - 3, 'World History with Geography', 'Social Studies', 1, '', 'A'), C(y - 3, 'Bible Doctrines', 'Bible', 1, '', 'A'), C(y - 3, 'Physical Education', 'PE', 1, '', 'A'),
        C(y - 2, 'English 10', 'English', 1, '', 'A'), C(y - 2, 'Geometry', 'Math', 1, '', 'B'), C(y - 2, 'Biology with lab', 'Science', 1, '', 'A'), C(y - 2, 'US History', 'Social Studies', 1, '', 'A'), C(y - 2, 'Life of Christ', 'Bible', 1, '', 'A'), C(y - 2, 'Health', 'Health', .5, '', 'A'), C(y - 2, 'Drawing', 'Art', .5, '', 'A'), C(y - 2, 'Spanish I', 'Electives', 1, '', 'B'),
        C(y - 1, 'English 11', 'English', 1, '', 'A'), C(y - 1, 'Algebra II', 'Math', 1, 'honors', 'B'), C(y - 1, 'Chemistry with lab', 'Science', 1, '', 'B'), C(y - 1, 'Economics', 'Social Studies', .5, '', 'A'), C(y - 1, 'Government', 'Social Studies', .5, '', 'A'), C(y - 1, 'Spanish II', 'Electives', 1, '', 'A'), C(y - 1, 'Choir', 'Electives', 1, '', 'A'),
        C(y, 'English Composition I', 'English', 1, 'college'), C(y, 'Precalculus', 'Math', 1, 'honors'), C(y, 'Physics with lab', 'Science', 1), C(y, 'Psychology', 'Electives', 1, 'college'), C(y, 'Community Service', 'Electives', .5)]],
      ['Josiah', 9, [C(y, 'English 9', 'English', 1), C(y, 'Algebra I', 'Math', 1), C(y, 'Physical Science', 'Science', 1), C(y, 'World History with Geography', 'Social Studies', 1), C(y, 'Old Testament Survey', 'Bible', 1), C(y, 'Physical Education', 'PE', 1)]]]),
      fam('f3', 'Brandt', 'Peter and Miriam Brandt', 'member', false, [['Eli', 6], ['Ruth', 3], ['Hannah', 0]]),
      fam('f4', 'Castellanos', 'Luis and Elena Castellanos', 'member', true, [['Mateo', 11, [
        C(y - 2, 'English 9', 'English', 1, '', 'B'), C(y - 2, 'Algebra I', 'Math', 1, '', 'B'), C(y - 2, 'Physical Science', 'Science', 1, '', 'C'), C(y - 2, 'World History with Geography', 'Social Studies', 1, '', 'B'), C(y - 2, 'Physical Education', 'PE', 1, '', 'A'), C(y - 2, 'Bible Survey', 'Bible', 1, '', 'A'),
        C(y - 1, 'English 10', 'English', 1, '', 'B'), C(y - 1, 'Geometry', 'Math', 1, '', 'C'), C(y - 1, 'Biology with lab', 'Science', 1, '', 'B'), C(y - 1, 'US History', 'Social Studies', 1, '', 'A'), C(y - 1, 'Health', 'Health', .5, '', 'A'), C(y - 1, 'Woodworking', 'Electives', 1, '', 'A'),
        C(y, 'English 11', 'English', 1), C(y, 'Algebra II', 'Math', 1), C(y, 'Chemistry with lab', 'Science', 1), C(y, 'Economics', 'Social Studies', .5), C(y, 'Government', 'Social Studies', .5), C(y, 'Life of Christ', 'Bible', 1), C(y, 'Guitar', 'Art', .5)]], ['Sofia', 7]]),
      fam('f5', 'Hadley', 'Sam and Laura Hadley', 'member', false, [['Wren', 5], ['Jude', 2]]),
      fam('f6', 'Nguyen', 'Minh and Katherine Nguyen', 'member', false, [['Thomas', 8], ['Claire', 4]]),
      fam('f7', 'Pruitt', 'Ben and Joy Pruitt', 'associate', true, []),
      fam('f8', 'Sorrell', 'Mark and Beth Sorrell', 'member', false, [['Levi', 10, [
        C(y - 1, 'English 9', 'English', 1, '', 'B'), C(y - 1, 'Algebra I', 'Math', 1, '', 'A'), C(y - 1, 'Physical Science', 'Science', 1, '', 'B'), C(y - 1, 'World History with Geography', 'Social Studies', 1, '', 'B'), C(y - 1, 'Physical Education', 'PE', 1, '', 'A'), C(y - 1, 'Bible Survey', 'Bible', 1, '', 'A'),
        C(y, 'English 10', 'English', 1), C(y, 'Geometry', 'Math', 1), C(y, 'Biology with lab', 'Science', 1), C(y, 'US History', 'Social Studies', 1), C(y, 'Health', 'Health', .5), C(y, 'Photography', 'Art', .5)]], ['Abigail', 1]]),
    ];
    const s = { v: 3, role: null, families, subs: {}, msgs: {}, treq: [], seen: {} };
    const past = Y.periods.filter(p => F.daysUntil(p.due, NOW) < 0 && p.key !== 'p6'), last = past[past.length - 1];
    const pick = (id, arr) => arr[Math.floor(rnd(id) * arr.length)];
    families.forEach(f => reqs(f).forEach(r => {
      if (!r.due || F.daysUntil(r.due, NOW) >= 0 || /^p6|final|att/.test(r.kind)) return;
      let status = 'approved';
      if (last && r.kind === last.key) { const x = rnd(r.id + 'st'); status = x < .6 ? 'approved' : x < .85 ? 'submitted' : null; }
      if (f.id === 'f6' && r.kind === 'hslda') status = null;
      if (f.id === 'f4' && r.kind === 'tuition') status = null;
      if (!status) return;
      s.subs[r.id] = { status, at: +r.due - 864e5 * (2 + Math.floor(rnd(r.id) * 6)), data: sample(r, pick) };
    }));
    if (last) { // the sign-in family shows one of each state
      const set = (sid, status, note) => { const id = sid + ':' + last.key, r = reqs(families[0]).find(q => q.id === id); const data = sample(r, pick); if (status === 'returned') data.days = ''; s.subs[id] = { status, at: +last.due - 864e5 * 3, data, note }; };
      set('f1s1', 'approved'); set('f1s2', 'submitted'); set('f1s3', 'returned', 'Please add the days of instruction for this period, then send it again.');
    }
    const t = n => +NOW - n * 864e5;
    const nextMeet = Y.events.find(e => e.kind === 'meeting' && F.daysUntil(e.date, NOW) >= 0), nextDue = Y.events.find(e => e.kind === 'deadline' && F.daysUntil(e.date, NOW) >= 0);
    const m = (by, name, text, at) => ({ by, name, text, at });
    s.msgs = {
      ann: [
        nextDue && m('admin', 'Administrator', `A reminder that the next deadline is the ${nextDue.title}, due ${F.long(nextDue.date)}. You can file it under Paperwork.`, t(6)),
        nextMeet && m('principal', 'Principal', `${nextMeet.title}: ${F.long(nextMeet.date)}. ${nextMeet.detail}`, t(2)),
      ].filter(Boolean),
      trips: [m('f3', 'Miriam Brandt', 'Would anyone like to help host a field trip this spring? We would be glad to plan one if another family can join us.', t(5)), m('f5', 'Laura Hadley', 'We can help. Weekday mornings work best for us.', t(4))],
      res: [m('f6', 'Katherine Nguyen', 'We have finished our grade 3 math books and would be glad to pass them along to another family.', t(9)), m('f3', 'Miriam Brandt', 'We would love them for Ruth. Thank you!', t(8))],
      hs: [m('f2', 'Grace Okafor', 'For families starting dual enrollment: ask the college to mail an official transcript to FBOCS so the grades can go on the high school transcript.', t(12))],
      'dm:f1:admin': [m('f1', 'Anna Whitfield', 'Good morning. I sent Micah\'s report again with the days filled in. Could you let me know if anything else is missing?', t(1))],
      'dm:f2:principal': [m('f2', 'Grace Okafor', 'Naomi would like a transcript sent for a scholarship application. I have put the request in under her name.', t(3))],
    };
    s.treq = [{ id: 't1', sid: 'f2s1', to: 'Auburn University', rush: false, fee: 0, at: t(3), status: 'requested' }];
    return s;
  }
  function sample(r, pick) {
    const st = r.student;
    if (/^p\d/.test(r.kind)) { const grades = {}; (isHS(st) ? st.courses.filter(c => c.yr === Y.y).map(c => c.id) : SUBJ).forEach(k => grades[k] = pick(r.id + k, ['A', 'A', 'A', 'B', 'B', 'C'])); return { days: 30 + Math.floor(rnd(r.id + 'd') * 9), grades, notes: '' }; }
    if (r.kind === 'cos' && !isHS(st)) { const subjects = {}; SUBJ.forEach(k => subjects[k] = ''); return { subjects }; }
    if (r.kind === 'hslda') return { no: '', exp: '' };
    return {};
  }

  /* ---------- requirements ---------- */
  function reqs(f) {
    const y = Y.y, out = [], add = (id, kind, label, due, o = {}) => out.push({ id: id + ':' + kind, fam: f, student: o.student || null, kind, label, due, office: !!o.office, optional: !!o.optional });
    add(f.id, 'app', 'Annual Enrollment Application', D(y, 5, 30));
    add(f.id, 'handbook', 'Signed Handbook Verification', D(y, 5, 30), { office: true });
    add(f.id, 'tuition', 'Tuition and fees', D(y, 5, 30), { office: true });
    if (f.type === 'associate') return out;
    add(f.id, 'hslda', 'HSLDA membership', D(y, 6, 15));
    f.students.forEach(s => {
      const o = { student: s };
      add(s.id, 'cos', isHS(s) ? 'High School Course of Study' : 'Course of Study', D(y, 6, 15), o);
      Y.periods.forEach(p => add(s.id, p.key, p.label + ' Bimonthly Report', p.due, { student: s, optional: p.key === 'p6' }));
      add(s.id, 'final', isHS(s) ? 'High School Course Documentation' : 'K-8 Report Card', Y.periods[5].due, o);
      add(s.id, 'att', 'Annual Attendance Record', Y.periods[5].due, o);
      if (s.grade === 4 || s.grade === 8) add(s.id, 'test', 'Standardized test scores', null, o);
    });
    return out;
  }
  function stat(r) {
    const sub = S.subs[r.id];
    if (sub) {
      if (sub.status === 'approved') return { code: 'ok', label: r.kind === 'tuition' ? 'Paid' : r.office ? 'Received' : 'Accepted' };
      if (sub.status === 'submitted') return { code: 'wait', label: 'Awaiting review' };
      return { code: 'warn', label: 'Returned for changes', act: true };
    }
    if (!r.due) return { code: '', label: 'This school year', act: true };
    const n = F.daysUntil(r.due, NOW);
    if (r.optional) return { code: '', label: 'Only if needed, by ' + F.short(r.due) };
    if (n < 0) return { code: 'late', label: 'Late, was due ' + F.short(r.due), act: true };
    if (n <= 45) return { code: 'warn', label: 'Due ' + F.short(r.due) + ', ' + F.rel(r.due, NOW), act: true };
    return { code: '', label: 'Due ' + F.short(r.due) };
  }
  const pill = st => `<span class="pill ${st.code}">${esc(st.label)}</span>`;
  const allReqs = () => S.families.flatMap(reqs);
  const findReq = id => allReqs().find(r => r.id === id);
  const fam = id => S.families.find(f => f.id === id);
  const student = sid => { for (const f of S.families) { const s = f.students.find(x => x.id === sid); if (s) return { s, f }; } };
  const daysSoFar = s => Y.periods.reduce((n, p) => { const sub = S.subs[s.id + ':' + p.key]; return n + (sub ? +sub.data.days || 0 : 0); }, 0);
  const credits = s => { const earned = c => c.final && c.final !== 'F'; return { earned: s.courses.filter(earned).reduce((n, c) => n + c.credit, 0), going: s.courses.filter(c => !c.final).reduce((n, c) => n + c.credit, 0) }; };

  /* ---------- state ---------- */
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || S.v !== 3 || S.sy !== Y.y) { S = seed(); S.sy = Y.y; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private window: the demo still works until the tab closes */ } };
  save();
  const ME = () => S.role === 'parent' ? { id: 'f1', name: 'Anna Whitfield', staff: false } : { id: S.role, name: STAFF[S.role], staff: true };
  const toast = t => { const n = $('#toast'); n.textContent = t; n.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => n.classList.remove('on'), 3200); };

  /* ---------- messages ---------- */
  const ROOMS = [['ann', 'Announcements', 'From the Administrator and Principal'], ['trips', 'Field trips and events', 'Plan and host group activities'], ['res', 'Curriculum and Resource Room', 'Share, lend and ask'], ['hs', 'High school families', 'Courses, dual enrollment, college']];
  function myRooms() {
    const me = ME(), rooms = ROOMS.map(([id, name, sub]) => ({ id, name, sub, group: 'Conversations' }));
    if (!me.staff) { rooms.push({ id: 'dm:f1:admin', name: 'Administrator', sub: 'Private, K-8 and membership questions', group: 'Staff' }, { id: 'dm:f1:principal', name: 'Principal', sub: 'Private, high school questions', group: 'Staff' }); }
    else S.families.forEach(f => rooms.push({ id: `dm:${f.id}:${me.id}`, name: f.name + ' family', sub: f.parents, group: 'Families' }));
    return rooms;
  }
  const unread = id => {
    const ms = S.msgs[id] || [], seen = S.seen[S.role + '|' + id];
    if (seen !== undefined) return Math.max(0, ms.length - seen);
    const last = ms[ms.length - 1]; // first visit: one unread where someone else spoke last in a place that concerns me
    if (!last || last.by === ME().id) return 0;
    return id === 'ann' ? (ME().staff ? 0 : 1) : id.startsWith('dm:') ? 1 : 0;
  };
  const unreadAll = () => myRooms().reduce((n, r) => n + unread(r.id), 0);

  /* ---------- views ---------- */
  const NAVS = {
    parent: [['home', 'Overview', 'home'], ['students', 'Grades', 'kids'], ['paperwork', 'Paperwork', 'paper'], ['messages', 'Messages', 'chat'], ['account', 'Account', 'acct']],
    staff: [['home', 'Overview', 'home'], ['review', 'Review', 'check'], ['families', 'Families', 'kids'], ['highschool', 'High school', 'cap'], ['messages', 'Messages', 'chat']],
  };
  const reqRow = (r, opts = {}) => {
    const st = stat(r), sub = S.subs[r.id], staff = ME().staff;
    let act = '';
    if (staff) {
      if (r.office && !sub) act = `<button class="btn sm ghost" data-act="office" data-id="${r.id}">${r.kind === 'tuition' ? 'Mark paid' : 'Mark received'}</button>`;
      else if (sub && !r.office) act = `<button class="btn sm ${sub.status === 'submitted' ? '' : 'ghost'}" data-act="review" data-id="${r.id}">${sub.status === 'submitted' ? 'Review' : 'View'}</button>`;
    } else if (!r.office) {
      if (!sub || sub.status === 'returned') act = `<button class="btn sm ${st.act ? '' : 'ghost'}" data-act="form" data-id="${r.id}">${sub ? 'Fix and send again' : 'Fill in'}</button>`;
      else act = `<button class="btn sm ghost" data-act="form" data-id="${r.id}">View</button>`;
    }
    const who = opts.who ? (r.student ? r.student.first + (staff ? ' ' + r.fam.name : '') : r.fam.name + ' family') : '';
    const sub2 = [who, r.office && !staff && !sub ? (r.kind === 'tuition' ? 'Pay by check to First Baptist Church Opelika' : 'Signed paper form, returned to the church office') : '', sub && sub.at ? (sub.status === 'approved' && r.office ? '' : 'Sent ' + when(sub.at)) : ''].filter(Boolean).join(', ');
    return `<li><div class="what"><b>${esc(r.label)}</b>${sub2 ? `<span>${esc(sub2)}</span>` : ''}</div>${pill(st)}<div class="acts">${act}</div>${sub && sub.status === 'returned' && sub.note ? `<div class="note"><b>${staff ? 'Your note' : 'Note from staff'}:</b> ${esc(sub.note)}</div>` : ''}</li>`;
  };
  const nextDates = n => Y.events.filter(e => F.daysUntil(e.date, NOW) >= 0).slice(0, n).map(e => `<li><div class="what"><b>${esc(e.title)}</b><span>${esc(e.detail)}</span></div><span class="pill">${F.short(e.date)}</span></li>`).join('');

  const V = {};
  V.p_home = () => {
    const f = fam('f1'), rs = reqs(f), need = rs.filter(r => stat(r).act && r.due && !r.office).sort((a, b) => a.due - b.due);
    const ann = (S.msgs.ann || []).slice(-1)[0];
    return `<div class="head"><div><h1>Good to see you, Anna</h1><p>${esc(f.name)} family, ${Y.label} school year</p></div></div>
    <div class="grid g21"><div class="stack">
      <section class="panel plain"><h2>Needs your attention</h2>${need.length ? `<ul class="rows">${need.slice(0, 6).map(r => reqRow(r, { who: true })).join('')}</ul>` : '<p class="empty">Nothing is due in the next 45 days.</p>'}</section>
      <section class="panel plain"><h2>Your students</h2><div style="margin-top:8px">${f.students.map(kidRow).join('')}</div></section>
    </div><div class="stack">
      <section class="panel plain"><h2>Coming up</h2><ul class="rows">${nextDates(3)}</ul></section>
      ${ann ? `<section class="panel"><h2>Latest announcement</h2><p style="font-family:var(--serif)">${esc(ann.text)}</p><p class="muted" style="margin:0">${esc(ann.name)}, ${when(ann.at)}. <a href="#/messages/ann">Open announcements</a></p></section>` : ''}
    </div></div>`;
  };
  const kidRow = s => {
    const rs = reqs(student(s.id).f).filter(r => r.student === s), open = rs.filter(r => stat(r).act && r.due).length;
    return `<a class="kid" href="#/student/${s.id}"><span class="av">${esc(s.first[0])}</span><span class="what"><b>${esc(s.first)}</b><span>${gradeName(s.grade)}, ${daysSoFar(s)} of 160 days reported</span></span>${open ? `<span class="pill warn">${open} to do</span>` : '<span class="pill ok">Up to date</span>'}</a>`;
  };
  V.p_students = () => `<div class="head"><div><h1>Grades and attendance</h1><p>Grades come from the bimonthly reports you file for each student.</p></div></div><section class="panel plain">${fam('f1').students.map(kidRow).join('')}</section>`;

  function studentView(sid, staff) {
    const { s, f } = student(sid), rs = reqs(f).filter(r => r.student === s), days = daysSoFar(s);
    const pers = Y.periods.filter(p => p.key !== 'p6' || S.subs[s.id + ':p6']);
    const keys = isHS(s) ? s.courses.filter(c => c.yr === Y.y) : SUBJ.map(k => ({ id: k, name: k }));
    const book = `<section class="panel plain"><h2>${Y.label} grades by reporting period</h2><div class="scroll"><table><thead><tr><th>${isHS(s) ? 'Course' : 'Subject'}</th>${pers.map(p => `<th class="c">${p.label.split('/').map(x => x.slice(0, 3)).join('/')}</th>`).join('')}${isHS(s) ? '<th class="c">Final</th>' : ''}</tr></thead><tbody>
      ${keys.map(k => `<tr><th>${esc(k.name)}${k.type ? `<br><span class="muted" style="font-weight:400;font-size:.9rem">${TYPES[k.type]}</span>` : ''}</th>${pers.map(p => { const sub = S.subs[s.id + ':' + p.key]; return `<td class="c">${sub && sub.data.grades && sub.data.grades[k.id] ? sub.data.grades[k.id] : '<span class="muted">–</span>'}</td>`; }).join('')}${isHS(s) ? `<td class="c">${k.final || '<span class="muted">–</span>'}</td>` : ''}</tr>`).join('')}
      <tr><th>Days of instruction</th>${pers.map(p => { const sub = S.subs[s.id + ':' + p.key]; return `<td class="c">${sub && sub.data.days ? sub.data.days : '<span class="muted">–</span>'}</td>`; }).join('')}${isHS(s) ? '<td></td>' : ''}</tr>
    </tbody></table></div></section>`;
    const att = `<section class="panel"><h2>Attendance</h2><div class="stat"><b>${days} of 160</b><span>days of instruction reported so far</span></div><div class="bar"><i class="${days >= 160 ? 'done' : ''}" style="width:${Math.min(100, days / 160 * 100)}%"></i></div><p class="muted" style="margin:8px 0 0">The school year runs July 1 to June 30.</p></section>`;
    let hs = '';
    if (isHS(s)) {
      const g = F.gpa(s.courses.filter(c => c.final).map(c => ({ credit: c.credit, grade: c.final, type: c.type }))), c = credits(s);
      hs = `<div class="grid g3" style="margin-bottom:16px"><section class="panel stat"><b>${cr(c.earned)} of 24</b><span>credits earned, ${cr(c.going)} in progress</span></section><section class="panel stat"><b>${g.unweighted === null ? '–' : g.unweighted.toFixed(2)}</b><span>unweighted GPA</span></section><section class="panel stat"><b>${g.weighted === null ? '–' : g.weighted.toFixed(2)}</b><span>${g.weighted === null ? 'weighted GPA, shown when honors, dual enrollment, AP or IB courses are present' : 'weighted GPA'}</span></section></div>
      <section class="panel"><h2>Graduation requirement worksheet</h2>${worksheet(s)}</section>`;
    }
    const tr = isHS(s) ? `<section class="panel plain"><h2>Transcripts</h2><ul class="rows">${S.treq.filter(t => t.sid === s.id).map(t => `<li><div class="what"><b>${esc(t.to)}</b><span>Requested ${when(t.at)}${t.rush ? ', rush' : ''}${t.fee ? ', fee $' + t.fee : ', no charge'}</span></div><span class="pill ${t.status === 'sent' ? 'ok' : 'wait'}">${t.status === 'sent' ? 'Sent' : 'Requested'}</span><div class="acts">${staff && t.status !== 'sent' ? `<button class="btn sm" data-act="tsent" data-id="${t.id}">Mark sent</button>` : ''}</div></li>`).join('') || '<li><div class="what"><span>No transcript requests yet.</span></div></li>'}</ul><div style="padding:0 18px 16px;display:flex;gap:10px;flex-wrap:wrap">${staff ? '' : `<button class="btn sm" data-act="treq" data-id="${s.id}">Request a transcript</button>`}<a class="btn sm ghost" href="#/transcript/${s.id}">${staff ? 'Open transcript' : 'View unofficial copy'}</a></div></section>` : '';
    return `<a class="back" href="#/${staff ? 'family/' + f.id : 'students'}">Back to ${staff ? esc(f.name) + ' family' : 'all students'}</a>
    <div class="head"><div><h1>${esc(s.first)} ${esc(f.name)}</h1><p>${gradeName(s.grade)}${isHS(s) ? ', high school' : ''}</p></div></div>
    ${hs}<div class="grid g21"><div class="stack">${book}${tr}</div><div class="stack">${att}<section class="panel plain"><h2>Paperwork for ${esc(s.first)}</h2><ul class="rows">${rs.map(r => reqRow(r)).join('')}</ul></section></div></div>`;
  }
  function worksheet(s) {
    return AREAS.map(([a, need, name]) => {
      const done = s.courses.filter(c => c.area === a && c.final && c.final !== 'F').reduce((n, c) => n + c.credit, 0), going = s.courses.filter(c => c.area === a && !c.final).reduce((n, c) => n + c.credit, 0);
      const w1 = Math.min(100, done / need * 100), w2 = Math.min(100 - w1, going / need * 100);
      return `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:12px"><span>${name}</span><span class="muted">${cr(done)} of ${cr(need)}${going ? ', ' + cr(going) + ' in progress' : ''}</span></div><div class="bar two" role="img" aria-label="${name}: ${done} of ${need} credits earned"><i class="${done >= need ? 'done' : ''}" style="width:${w1}%"></i><i class="plan" style="width:${w2}%"></i></div></div>`;
    }).join('') + '<p class="muted" style="margin:0">Solid bars are credits earned. Striped bars are courses in progress this year.</p>';
  }
  V.p_student = sid => studentView(sid, false);
  V.s_student = sid => studentView(sid, true);

  V.transcript = sid => {
    const { s, f } = student(sid), staff = ME().staff, years = [...new Set(s.courses.map(c => c.yr))].sort();
    const g = F.gpa(s.courses.filter(c => c.final).map(c => ({ credit: c.credit, grade: c.final, type: c.type }))), c = credits(s);
    return `<a class="back" href="#/${staff ? 'hs' : 'student'}/${s.id}">Back to ${esc(s.first)}</a>
    <div class="head"><div><h1>${staff ? 'Transcript' : 'Unofficial transcript'}</h1><p>Built from accepted course documentation.</p></div><button class="btn sm" data-act="print">Print</button></div>
    <div class="paper"><header><img src="../img/logo.png" alt="FBOCS"><div><h2>First Baptist Opelika Christian School</h2><div>High school transcript${staff ? '' : ', unofficial parent copy'}</div></div></header>
      <p><b>${esc(s.first)} ${esc(f.name)}</b>, ${gradeName(s.grade)}</p>
      ${years.map(y => `<h3>${y}–${String(y + 1).slice(2)}</h3><div class="scroll"><table><thead><tr><th>Course</th><th>Type</th><th class="c">Credit</th><th class="c">Grade</th></tr></thead><tbody>${s.courses.filter(c => c.yr === y).map(c => `<tr><th>${esc(c.name)}</th><td>${TYPES[c.type]}</td><td class="c">${cr(c.credit)}</td><td class="c">${c.final || 'In progress'}</td></tr>`).join('')}</tbody></table></div>`).join('')}
      <div class="tot"><span><b>${cr(c.earned)}</b> credits earned</span><span><b>${g.unweighted === null ? '–' : g.unweighted.toFixed(2)}</b> unweighted GPA</span>${g.weighted === null ? '' : `<span><b>${g.weighted.toFixed(2)}</b> weighted GPA</span>`}</div>
      <p class="draft">Grading scale: A=90-100, B=80-89, C=70-79, D=60-69, F=0-59. Sample student and sample courses.</p></div>`;
  };

  V.p_paperwork = () => {
    const f = fam('f1'), rs = reqs(f);
    const block = (title, list) => `<section class="panel plain"><h2>${title}</h2><ul class="rows">${list.map(r => reqRow(r)).join('')}</ul></section>`;
    return `<div class="head"><div><h1>Paperwork</h1><p>Every form for the ${Y.label} school year, with its due date.</p></div></div>${block(f.name + ' family', rs.filter(r => !r.student))}${f.students.map(s => block(`${esc(s.first)}, ${gradeName(s.grade)}`, rs.filter(r => r.student === s))).join('')}`;
  };

  V.p_account = () => {
    const f = fam('f1'), fee = F.fees({ type: f.type, firstYear: f.first, hs: f.students.filter(isHS).length }), paid = S.subs[f.id + ':tuition'], h = S.subs[f.id + ':hslda'];
    return `<div class="head"><div><h1>Account</h1><p>${esc(f.parents)}</p></div><button class="btn sm ghost" data-act="contact">Update contact details</button></div>
    <div class="grid g2"><section class="panel"><h2>Contact details</h2><div class="ro"><dl><dt>Parents</dt><dd>${esc(f.parents)}</dd><dt>Email</dt><dd style="overflow-wrap:anywhere">${esc(f.email)}</dd><dt>Phone</dt><dd>${esc(f.phone)}</dd><dt>Membership</dt><dd>${f.type === 'associate' ? 'Associate member' : 'Member'} family</dd></dl></div><p class="muted" style="margin:10px 0 0">The handbook asks families to report a change of name, address or phone number within five days.</p></section>
    <section class="panel"><h2>Tuition and fees, ${Y.label}</h2><div class="ro"><dl>${fee.lines.map(l => `<dt>${l[0]}</dt><dd>$${l[1]}</dd>`).join('')}<dt>Total</dt><dd>$${fee.total}</dd><dt>Status</dt><dd>${paid ? 'Paid' : 'Not yet received'}</dd></dl></div><p class="muted" style="margin:10px 0 0">Checks are payable to First Baptist Church Opelika.</p></section>
    <section class="panel"><h2>HSLDA membership</h2><div class="ro"><dl><dt>Status</dt><dd>${h ? stat(findReq(f.id + ':hslda')).label : 'Not yet verified'}</dd>${h && h.data.exp ? `<dt>Expires</dt><dd>${esc(h.data.exp)}</dd>` : ''}</dl></div></section>
    <section class="panel"><h2>This demo</h2><p class="muted">Sample family and sample data, kept only in this browser.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn sm ghost" data-act="reset">Reset sample data</button><a class="btn sm ghost" href="../index.html">Public site</a></div></section></div>`;
  };

  /* staff */
  V.s_home = () => {
    const rs = allReqs(), waiting = rs.filter(r => S.subs[r.id] && S.subs[r.id].status === 'submitted'), late = rs.filter(r => stat(r).code === 'late');
    const kids = S.families.reduce((n, f) => n + f.students.length, 0), tq = S.treq.filter(t => t.status !== 'sent');
    const byFam = S.families.map(f => ({ f, n: late.filter(r => r.fam === f).length })).filter(x => x.n);
    return `<div class="head"><div><h1>${STAFF[S.role]} overview</h1><p>${Y.label} school year</p></div></div>
    <div class="grid g3" style="margin-bottom:16px"><section class="panel stat"><b>${S.families.length}</b><span>families, ${kids} students</span></section><section class="panel stat"><b>${waiting.length + tq.length}</b><span>items waiting for review</span></section><section class="panel stat"><b>${late.length}</b><span>items past due across ${byFam.length} ${byFam.length === 1 ? 'family' : 'families'}</span></section></div>
    <div class="grid g21"><div class="stack">
      <section class="panel plain"><h2>Waiting for review</h2>${waiting.length ? `<ul class="rows">${waiting.slice(0, 5).map(r => reqRow(r, { who: true })).join('')}</ul>${waiting.length > 5 ? `<p class="empty"><a href="#/review">See all ${waiting.length}</a></p>` : ''}` : '<p class="empty">Nothing is waiting. Every submitted form has been reviewed.</p>'}</section>
      <section class="panel plain"><h2>Past due</h2>${byFam.length ? `<ul class="rows">${byFam.map(x => `<li><div class="what"><b>${esc(x.f.name)} family</b><span>${late.filter(r => r.fam === x.f).map(r => (r.student ? r.student.first + ': ' : '') + r.label).join('; ')}</span></div><span class="pill late">${x.n} late</span><div class="acts"><a class="btn sm ghost" href="#/family/${x.f.id}">Open</a></div></li>`).join('')}</ul>` : '<p class="empty">No family has anything past due.</p>'}</section>
    </div><div class="stack"><section class="panel plain"><h2>Coming up</h2><ul class="rows">${nextDates(4)}</ul></section></div></div>`;
  };
  V.s_review = () => {
    const waiting = allReqs().filter(r => S.subs[r.id] && S.subs[r.id].status === 'submitted'), tq = S.treq.filter(t => t.status !== 'sent');
    return `<div class="head"><div><h1>Review</h1><p>Accept a form, or return it with a note for the family.</p></div></div>
    <section class="panel plain"><h2>Forms</h2>${waiting.length ? `<ul class="rows">${waiting.map(r => reqRow(r, { who: true })).join('')}</ul>` : '<p class="empty">Nothing is waiting. Every submitted form has been reviewed.</p>'}</section>
    <section class="panel plain"><h2>Transcript requests</h2>${tq.length ? `<ul class="rows">${tq.map(t => { const x = student(t.sid); return `<li><div class="what"><b>${esc(x.s.first)} ${esc(x.f.name)} to ${esc(t.to)}</b><span>Requested ${when(t.at)}${t.rush ? ', rush' : ''}${t.fee ? ', fee $' + t.fee : ', no charge'}</span></div><div class="acts"><a class="btn sm ghost" href="#/transcript/${t.sid}">Open transcript</a><button class="btn sm" data-act="tsent" data-id="${t.id}">Mark sent</button></div></li>`; }).join('')}</ul>` : '<p class="empty">No transcript requests are open.</p>'}</section>`;
  };
  V.s_families = () => {
    const past = Y.periods.filter(p => F.daysUntil(p.due, NOW) < 0), last = past[past.length - 1];
    const cell = (f, kind) => { const rs = reqs(f).filter(r => r.kind === kind); if (!rs.length) return '<span class="muted">Not required</span>'; const ok = rs.filter(r => stat(r).code === 'ok').length, w = rs.filter(r => stat(r).code === 'wait').length; const code = ok === rs.length ? 'ok' : w ? 'wait' : rs.some(r => stat(r).code === 'late') ? 'late' : 'warn'; return `<span class="pill ${code}">${rs.length === 1 ? stat(rs[0]).label.split(',')[0] : ok + ' of ' + rs.length + ' accepted'}</span>`; };
    return `<div class="head"><div><h1>Families</h1><p>Where each family stands for ${Y.label}.</p></div></div>
    <section class="panel plain"><div class="scroll"><table><thead><tr><th>Family</th><th>Students</th><th>Tuition</th><th>HSLDA</th><th>Course of Study</th>${last ? `<th>${last.label} report</th>` : ''}</tr></thead><tbody>
    ${S.families.map(f => `<tr><th><a class="cell" href="#/family/${f.id}">${esc(f.name)}</a><br><span class="muted" style="font-weight:400;font-size:.9rem">${f.type === 'associate' ? 'Associate member' : 'Member'}</span></th><td>${f.students.length || '<span class="muted">None enrolled</span>'}</td><td>${cell(f, 'tuition')}</td><td>${cell(f, 'hslda')}</td><td>${cell(f, 'cos')}</td>${last ? `<td>${cell(f, last.key)}</td>` : ''}</tr>`).join('')}
    </tbody></table></div></section>`;
  };
  V.s_family = id => {
    const f = fam(id), rs = reqs(f), fee = F.fees({ type: f.type, firstYear: f.first, hs: f.students.filter(isHS).length });
    return `<a class="back" href="#/families">Back to all families</a><div class="head"><div><h1>${esc(f.name)} family</h1><p>${esc(f.parents)}, ${f.type === 'associate' ? 'associate member' : 'member'}${f.first ? ', first year' : ''}</p></div><a class="btn sm ghost" href="#/messages/dm:${f.id}:${S.role}">Message this family</a></div>
    <div class="grid g21"><div class="stack"><section class="panel plain"><h2>Family paperwork</h2><ul class="rows">${rs.filter(r => !r.student).map(r => reqRow(r)).join('')}</ul></section>
    ${f.students.map(s => `<section class="panel plain"><h2><a href="#/student/${s.id}" style="color:inherit">${esc(s.first)}</a>, ${gradeName(s.grade)}</h2><ul class="rows">${rs.filter(r => r.student === s && (S.subs[r.id] || stat(r).act)).map(r => reqRow(r)).join('') || '<li><div class="what"><span>Nothing submitted or due yet.</span></div></li>'}</ul><p class="empty" style="padding-top:0"><a href="#/student/${s.id}">Grades, attendance and all forms for ${esc(s.first)}</a></p></section>`).join('') || '<section class="panel"><p class="muted" style="margin:0">Associate member families have no students of mandatory attendance age, so no academic records are kept.</p></section>'}</div>
    <div class="stack"><section class="panel"><h2>Contact</h2><div class="ro"><dl><dt>Email</dt><dd style="overflow-wrap:anywhere">${esc(f.email)}</dd><dt>Phone</dt><dd>${esc(f.phone)}</dd></dl></div></section><section class="panel"><h2>Tuition and fees</h2><div class="ro"><dl>${fee.lines.map(l => `<dt>${l[0]}</dt><dd>$${l[1]}</dd>`).join('')}<dt>Total</dt><dd>$${fee.total}</dd></dl></div></section></div></div>`;
  };
  V.s_highschool = () => {
    const list = S.families.flatMap(f => f.students.filter(isHS).map(s => ({ s, f }))).sort((a, b) => b.s.grade - a.s.grade);
    return `<div class="head"><div><h1>High school</h1><p>Credits toward the 24 required, and GPA from accepted grades.</p></div></div><section class="panel plain"><div class="scroll"><table><thead><tr><th>Student</th><th class="c">Grade</th><th class="c">Credits earned</th><th class="c">In progress</th><th class="c">Unweighted</th><th class="c">Weighted</th></tr></thead><tbody>
    ${list.map(({ s, f }) => { const c = credits(s), g = F.gpa(s.courses.filter(x => x.final).map(x => ({ credit: x.credit, grade: x.final, type: x.type }))); return `<tr><th><a class="cell" href="#/hs/${s.id}">${esc(s.first)} ${esc(f.name)}</a></th><td class="c">${s.grade}</td><td class="c">${cr(c.earned)} of 24</td><td class="c">${cr(c.going)}</td><td class="c">${g.unweighted === null ? '–' : g.unweighted.toFixed(2)}</td><td class="c">${g.weighted === null ? '–' : g.weighted.toFixed(2)}</td></tr>`; }).join('')}</tbody></table></div></section>`;
  };

  V.messages = room => {
    const rooms = myRooms(), me = ME(), cur = rooms.find(r => r.id === room) || (matchMedia('(min-width:900px)').matches ? rooms[0] : null);
    if (cur) { S.seen[S.role + '|' + cur.id] = (S.msgs[cur.id] || []).length; save(); }
    let last = '';
    const list = rooms.map(r => { const ms = S.msgs[r.id] || [], l = ms[ms.length - 1], u = unread(r.id); const h = r.group !== last ? `<li><h3>${r.group}</h3></li>` : ''; last = r.group; return `${h}<li><button data-act="room" data-id="${r.id}" aria-current="${cur && cur.id === r.id}"><span class="what"><b>${esc(r.name)}</b><span class="last">${l ? esc(l.name.split(' ')[0] + ': ' + l.text) : esc(r.sub)}</span></span>${u ? `<span class="badge">${u}</span>` : ''}</button></li>`; }).join('');
    const ms = cur ? S.msgs[cur.id] || [] : [];
    const canPost = cur && (cur.id !== 'ann' || me.staff);
    const thread = cur ? `<div class="thread"><div class="thread-head"><a class="back" href="#/messages" aria-label="All conversations">‹</a><div><h2>${esc(cur.name)}</h2><p>${esc(cur.sub)}</p></div></div>
      <div class="msgs" id="msgs">${ms.map(m => `<div class="msg${m.by === me.id ? ' mine' : ''}${STAFF[m.by] ? ' staff' : ''}"><div class="who2"><b>${m.by === me.id ? 'You' : esc(m.name)}</b>, ${when(m.at)}</div><div class="bub">${esc(m.text)}</div></div>`).join('') || '<p class="muted">No messages here yet. Write the first one below.</p>'}</div>
      ${canPost ? `<form class="send" data-form="send" data-id="${cur.id}"><label class="sr" for="msg" style="position:absolute;left:-999px">Message</label><textarea id="msg" name="text" rows="1" placeholder="${cur.id === 'ann' ? 'Write an announcement to all families' : 'Write a message'}" required></textarea><button class="btn" type="submit">Send</button></form>` : '<p class="locked">Only the Administrator and Principal post here. To reply, write to them under Staff.</p>'}</div>` : '<div class="thread"></div>';
    return `<div class="head"><div><h1>Messages</h1></div></div><section class="panel plain chat${room ? ' in' : ''}"><div class="rooms-wrap"><ul class="rooms">${list}</ul></div>${thread}</section>`;
  };

  /* ---------- forms ---------- */
  const sel = (name, v, opts) => `<select name="${name}" aria-label="${esc(name)}">${opts.map(o => { const [val, t] = Array.isArray(o) ? o : [o, o || 'Choose']; return `<option value="${val}"${String(val) === String(v ?? '') ? ' selected' : ''}>${t}</option>`; }).join('')}</select>`;
  function fields(r, data, ro) {
    const s = r.student, d = data || {}, dis = ro ? ' disabled' : '';
    const keys = s ? (isHS(s) ? s.courses.filter(c => c.yr === Y.y) : SUBJ.map(k => ({ id: k, name: k }))) : [];
    if (/^p\d/.test(r.kind)) return `<div class="f"><label for="days">Days of instruction in ${r.label.replace(' Bimonthly Report', '')}</label><input id="days" name="days" type="number" inputmode="numeric" min="0" max="62" value="${esc(d.days ?? '')}" required${dis}><small>${daysSoFar(s)} of 160 days reported so far this year.</small></div>
      <div class="f"><div class="lab">Progress grade</div>${keys.map(k => `<div class="pair"><span>${esc(k.name)}</span>${sel('g:' + k.id, d.grades && d.grades[k.id], ['', ...LET]).replace('<select', '<select' + dis)}</div>`).join('')}<small>Grading scale: A=90-100, B=80-89, C=70-79, D=60-69, F=0-59.</small></div>
      <div class="f"><label for="notes">Progress notes</label><textarea id="notes" name="notes"${dis}>${esc(d.notes || '')}</textarea></div>`;
    if (r.kind === 'final') { const lastSub = [...Y.periods].reverse().map(p => S.subs[s.id + ':' + p.key]).find(Boolean); return `<div class="f"><div class="lab">Final grade for the year</div>${keys.map(k => `<div class="pair"><span>${esc(k.name)}${k.credit ? `<small>${cr(k.credit)} credit, ${TYPES[k.type]}</small>` : ''}</span>${sel('g:' + k.id, (d.grades && d.grades[k.id]) || (lastSub && lastSub.data.grades && lastSub.data.grades[k.id]), ['', ...LET]).replace('<select', '<select required' + dis)}</div>`).join('')}<small>Filled in from the latest bimonthly report. Change any grade that is different for the full year.</small></div>`; }
    if (r.kind === 'att') return `<div class="f"><label for="days">Total days of instruction, July 1 to June 30</label><input id="days" name="days" type="number" inputmode="numeric" min="0" max="366" value="${esc(d.days ?? daysSoFar(s))}" required${dis}><small>Your bimonthly reports add up to ${daysSoFar(s)} days. FBOCS requires at least 160.</small></div>`;
    if (r.kind === 'cos' && !isHS(s)) return `<p class="muted">List the curriculum or resources you plan to use for each subject.</p>${SUBJ.map(k => `<div class="f"><label for="s-${k}">${k}</label><input id="s-${k}" type="text" name="s:${k}" value="${esc(d.subjects && d.subjects[k] || '')}"${dis}></div>`).join('')}`;
    if (r.kind === 'cos') { const rows = [...keys, ...(ro ? [] : [{}, {}])]; return `<p class="muted">This year's courses. Honors and advanced designations must be approved in advance by the Principal.</p>${rows.map((c, i) => `<div class="f" style="border-top:1px solid var(--rule);padding-top:12px"><input type="text" name="c${i}:name" aria-label="Course name" placeholder="Course name" value="${esc(c.name || '')}"${dis}><div style="display:grid;grid-template-columns:minmax(0,1.2fr) 80px minmax(0,1.4fr);gap:8px;margin-top:8px">${sel(`c${i}:area`, c.area || 'Electives', AREAS.map(a => [a[0], a[2]])).replace('<select', '<select' + dis)}${sel(`c${i}:credit`, c.credit || 1, [[1, '1'], [0.5, '½']]).replace('<select', '<select' + dis)}${sel(`c${i}:type`, c.type || '', Object.entries(TYPES)).replace('<select', '<select' + dis)}</div><input type="hidden" name="c${i}:id" value="${c.id || ''}"></div>`).join('')}${ro ? '' : '<small class="muted">Leave a course name empty to remove it.</small>'}`; }
    if (r.kind === 'hslda') return `<div class="f"><label for="no">HSLDA member number</label><input id="no" name="no" type="text" value="${esc(d.no || '')}" required${dis}></div><div class="f"><label for="exp">Membership expires</label><input id="exp" name="exp" type="date" value="${esc(d.exp || '')}" required${dis}><small>Membership is required by July 15, or within 30 days of your current expiration date.</small></div>`;
    if (r.kind === 'test') return `<div class="f"><label for="test">Name of the test</label><input id="test" name="test" type="text" value="${esc(d.test || '')}" required${dis}></div>${ro ? `<div class="ro"><dl><dt>Score report</dt><dd>${esc(d.file || 'None attached')}</dd></dl></div>` : `<div class="f"><div class="lab">Score report</div><label class="file"><input type="file" name="file" accept=".pdf,image/*"><span data-file>${d.file ? esc(d.file) : 'Choose a PDF or photo of the score report'}</span></label><small>Tests must be administered by a non-family member and scored by an independent testing service.</small></div>`}`;
    return `<div class="f"><label for="parents">Parents</label><input id="parents" name="parents" type="text" value="${esc(d.parents || r.fam.parents)}" required${dis}></div><div class="f"><label for="email">Email you check regularly</label><input id="email" name="email" type="email" value="${esc(d.email || r.fam.email)}" required${dis}></div><div class="f"><label for="phone">Phone</label><input id="phone" name="phone" type="text" value="${esc(d.phone || r.fam.phone)}" required${dis}></div>`;
  }
  function openSheet(html) { const sh = $('#sheet'), box = $('.sheet-box', sh); box.innerHTML = html; sh.classList.add('open'); sh.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; box.focus(); }
  function closeSheet() { const sh = $('#sheet'); sh.classList.remove('open'); sh.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  const sheetHead = (t, sub) => `<div class="sheet-head"><div><h2>${esc(t)}</h2>${sub ? `<p>${esc(sub)}</p>` : ''}</div><button class="x" type="button" data-act="close" aria-label="Close">×</button></div>`;
  function openForm(id) {
    const r = findReq(id), sub = S.subs[id], ro = sub && sub.status !== 'returned';
    const who = r.student ? r.student.first + ', ' + gradeName(r.student.grade) : r.fam.name + ' family';
    openSheet(`<form data-form="req" data-id="${id}">${sheetHead(r.label, who + (r.due ? ', due ' + F.short(r.due) : ''))}<div class="sheet-body">${sub && sub.status === 'returned' && sub.note ? `<p class="note" style="background:var(--warn-bg);border-radius:8px;padding:10px 12px"><b>Note from staff:</b> ${esc(sub.note)}</p>` : ''}${ro ? `<p>${pill(stat(r))} Sent ${when(sub.at)}.</p>` : ''}${fields(r, sub && sub.data, ro)}</div><div class="sheet-foot"><button class="btn ghost" type="button" data-act="close">${ro ? 'Close' : 'Cancel'}</button>${ro ? '' : '<button class="btn" type="submit">Send to FBOCS</button>'}</div></form>`);
  }
  function openReview(id) {
    const r = findReq(id), sub = S.subs[id], who = (r.student ? r.student.first + ' ' : '') + r.fam.name + (r.student ? ', ' + gradeName(r.student.grade) : ' family');
    openSheet(`<form data-form="review" data-id="${id}">${sheetHead(r.label, who + ', sent ' + when(sub.at))}<div class="sheet-body"><p>${pill(stat(r))}</p>${fields(r, sub.data, true)}${sub.status === 'submitted' ? '<div class="f" style="margin-top:14px"><label for="note">Note to the family, if you are returning this</label><textarea id="note" name="note"></textarea></div>' : ''}</div><div class="sheet-foot"><button class="btn ghost" type="button" data-act="close">Close</button>${sub.status === 'submitted' ? '<button class="btn ghost" type="submit" name="go" value="returned">Return with note</button><button class="btn" type="submit" name="go" value="approved">Accept</button>' : ''}</div></form>`);
  }
  function collect(r, form) {
    const fd = new FormData(form), d = {}, s = r.student;
    if (fd.has('days')) d.days = +fd.get('days');
    const grades = {}; for (const [k, v] of fd) if (k.startsWith('g:') && v) grades[k.slice(2)] = v; if (Object.keys(grades).length) d.grades = grades;
    if (fd.has('notes')) d.notes = fd.get('notes').trim();
    if (r.kind === 'cos' && !isHS(s)) { d.subjects = {}; SUBJ.forEach(k => d.subjects[k] = (fd.get('s:' + k) || '').trim()); }
    if (r.kind === 'cos' && isHS(s)) {
      const rows = []; for (let i = 0; fd.has(`c${i}:name`); i++) { const name = fd.get(`c${i}:name`).trim(); if (!name) continue; const old = s.courses.find(c => c.id === fd.get(`c${i}:id`)); rows.push({ id: old ? old.id : 'c' + Date.now() + i, yr: Y.y, name, area: fd.get(`c${i}:area`), credit: +fd.get(`c${i}:credit`), type: fd.get(`c${i}:type`), final: old ? old.final : '' }); }
      s.courses = [...s.courses.filter(c => c.yr !== Y.y), ...rows]; d.courses = rows.length;
    }
    ['no', 'exp', 'test', 'parents', 'email', 'phone'].forEach(k => { if (fd.has(k)) d[k] = fd.get(k).trim(); });
    const file = fd.get('file'); if (file && file.name) d.file = file.name; else if (S.subs[r.id] && S.subs[r.id].data.file) d.file = S.subs[r.id].data.file;
    return d;
  }

  /* ---------- shell ---------- */
  function gate() {
    $('#app').innerHTML = `<main class="gate"><div class="gate-box"><img src="../img/logo.png" alt="FBOCS"><h1>Member area</h1><p>This is a working demo. Choose who to sign in as.</p>
      <div class="who"><button data-act="role" data-id="parent"><b>A member parent</b><span>File reports, keep grades and attendance, message staff</span></button><button data-act="role" data-id="admin"><b>The Administrator</b><span>Review forms, track every family, post announcements</span></button><button data-act="role" data-id="principal"><b>The Principal</b><span>High school credits, GPA and transcripts</span></button></div>
      <p class="fine">Families, students and messages here are invented samples. Nothing leaves this browser. <a href="../index.html">Back to the public site</a></p></div></main>`;
  }
  function render() {
    if (!S.role) return gate();
    const staff = S.role !== 'parent', nav = NAVS[staff ? 'staff' : 'parent'], me = ME();
    const [view = 'home', arg] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    const map = staff ? { home: V.s_home, review: V.s_review, families: V.s_families, family: V.s_family, highschool: V.s_highschool, hs: V.s_student, student: V.s_student, transcript: V.transcript, messages: V.messages }
      : { home: V.p_home, students: V.p_students, student: V.p_student, paperwork: V.p_paperwork, messages: V.messages, account: V.p_account, transcript: V.transcript };
    let html; try { html = (map[view] || map.home)(arg); } catch (e) { console.error(e); html = '<section class="panel"><h2>That page could not be opened</h2><p class="muted">Go back to the overview and try again.</p><a class="btn sm" href="#/home">Overview</a></section>'; }
    const active = { student: staff ? 'families' : 'students', family: 'families', hs: 'highschool', transcript: staff ? 'highschool' : 'students' }[view] || (map[view] ? view : 'home');
    const u = unreadAll(), rv = staff ? allReqs().filter(r => S.subs[r.id] && S.subs[r.id].status === 'submitted').length + S.treq.filter(t => t.status !== 'sent').length : 0;
    const links = cls => nav.map(([k, t, ic]) => `<a href="#/${k}"${k === active ? ' aria-current="page"' : ''}>${ico(ic)}<span>${t}</span>${k === 'messages' && u ? `<span class="badge">${u}</span>` : ''}${k === 'review' && rv ? `<span class="badge">${rv}</span>` : ''}</a>`).join('');
    $('#app').innerHTML = `<div class="shell"><div><header class="top"><a class="logo" href="#/home" aria-label="Overview"><img src="../img/logo.png" alt="FBOCS"></a><div class="me"><b>${esc(me.name)}</b><span>${staff ? 'FBOCS staff' : 'Whitfield family'}</span></div><button data-act="switch">Switch view</button></header><div class="demo">Demo with sample families. Nothing here is saved to a server.</div></div>
      <div class="body"><nav class="side" aria-label="Member area">${links()}</nav><main class="main" id="main">${html}</main></div><nav class="tabs" aria-label="Member area">${links()}</nav></div>`;
    const ms = $('#msgs'); if (ms) ms.scrollTop = ms.scrollHeight;
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    if (e.target.id === 'sheet') return closeSheet();
    const a = e.target.closest('[data-act]'); if (!a) return;
    const id = a.dataset.id, act = a.dataset.act;
    if (act === 'role') { S.role = id; save(); location.hash = '#/home'; render(); window.scrollTo(0, 0); }
    else if (act === 'switch') { S.role = null; save(); closeSheet(); render(); }
    else if (act === 'reset') { S = seed(); S.sy = Y.y; save(); render(); toast('Sample data reset.'); }
    else if (act === 'close') closeSheet();
    else if (act === 'form') openForm(id);
    else if (act === 'review') openReview(id);
    else if (act === 'office') { const r = findReq(id); S.subs[id] = { status: 'approved', at: Date.now(), data: {} }; save(); render(); toast(r.kind === 'tuition' ? 'Marked paid.' : 'Marked received.'); }
    else if (act === 'room') { location.hash = '#/messages/' + encodeURIComponent(id); }
    else if (act === 'print') window.print();
    else if (act === 'tsent') { S.treq.find(t => t.id === id).status = 'sent'; save(); render(); toast('Marked sent.'); }
    else if (act === 'treq') {
      const { s } = student(id), n = S.treq.filter(t => t.sid === id).length;
      openSheet(`<form data-form="treq" data-id="${id}">${sheetHead('Request a transcript', s.first)}<div class="sheet-body"><div class="f"><label for="to">Send to</label><input id="to" name="to" type="text" placeholder="School, agency or institution" required></div><label class="f" style="display:flex;gap:10px;align-items:center;min-height:44px"><input type="checkbox" name="rush" style="width:22px;height:22px;accent-color:var(--red)"> Needed in less than two weeks</label><div class="ro"><dl><dt>Transcripts requested so far</dt><dd>${n}</dd><dt>Fee for this one</dt><dd data-fee>$${n >= 5 ? 10 : 0}</dd></dl></div><p class="muted" style="margin-top:10px">The first five official transcripts are provided at no charge. Each additional transcript is $10. A transcript needed in less than the normal two-week processing period adds a $30 rush fee.</p></div><div class="sheet-foot"><button class="btn ghost" type="button" data-act="close">Cancel</button><button class="btn" type="submit">Send request</button></div></form>`);
    }
    else if (act === 'contact') { const f = fam('f1'); openSheet(`<form data-form="contact">${sheetHead('Update contact details', f.name + ' family')}<div class="sheet-body"><div class="f"><label for="email">Email you check regularly</label><input id="email" name="email" type="email" value="${esc(f.email)}" required></div><div class="f"><label for="phone">Phone</label><input id="phone" name="phone" type="text" value="${esc(f.phone)}" required></div></div><div class="sheet-foot"><button class="btn ghost" type="button" data-act="close">Cancel</button><button class="btn" type="submit">Save details</button></div></form>`); }
  });
  document.addEventListener('change', e => {
    if (e.target.type === 'file') { const n = e.target.closest('.file').querySelector('[data-file]'); n.textContent = e.target.files[0] ? e.target.files[0].name : 'Choose a PDF or photo of the score report'; }
    if (e.target.name === 'rush') { const f = e.target.form, n = S.treq.filter(t => t.sid === f.dataset.id).length; $('[data-fee]', f).textContent = '$' + ((n >= 5 ? 10 : 0) + (e.target.checked ? 30 : 0)); }
  });
  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-form]'); if (!f) return; e.preventDefault();
    const kind = f.dataset.form, id = f.dataset.id;
    if (kind === 'req') { const r = findReq(id); S.subs[id] = { status: 'submitted', at: Date.now(), data: collect(r, f) }; save(); closeSheet(); render(); toast('Sent. ' + (r.student && isHS(r.student) ? 'The Principal' : 'The Administrator') + ' will review it.'); }
    else if (kind === 'review') {
      const go = e.submitter ? e.submitter.value : 'approved', note = new FormData(f).get('note') || '', sub = S.subs[id], r = findReq(id);
      if (go === 'returned' && !note.trim()) { $('#note', f).focus(); return toast('Add a note so the family knows what to change.'); }
      sub.status = go; sub.note = go === 'returned' ? note.trim() : '';
      if (go === 'approved' && r.kind === 'final' && isHS(r.student)) r.student.courses.forEach(c => { if (sub.data.grades && sub.data.grades[c.id]) c.final = sub.data.grades[c.id]; });
      save(); closeSheet(); render(); toast(go === 'approved' ? 'Accepted.' : 'Returned to the family with your note.');
    }
    else if (kind === 'send') { const text = new FormData(f).get('text').trim(); if (!text) return; const me = ME(); (S.msgs[id] = S.msgs[id] || []).push({ by: me.id, name: me.name, text, at: Date.now() }); S.seen[S.role + '|' + id] = S.msgs[id].length; save(); render(); const t = $('#msg'); if (t && matchMedia('(pointer:fine)').matches) t.focus(); }
    else if (kind === 'treq') { const fd = new FormData(f), n = S.treq.filter(t => t.sid === id).length, rush = fd.get('rush') === 'on'; S.treq.push({ id: 't' + Date.now(), sid: id, to: fd.get('to').trim(), rush, fee: (n >= 5 ? 10 : 0) + (rush ? 30 : 0), at: Date.now(), status: 'requested' }); save(); closeSheet(); render(); toast('Request sent to the Principal.'); }
    else if (kind === 'contact') { const fd = new FormData(f), fm = fam('f1'); fm.email = fd.get('email').trim(); fm.phone = fd.get('phone').trim(); save(); closeSheet(); render(); toast('Details saved.'); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSheet();
    if (e.key === 'Enter' && !e.shiftKey && e.target.id === 'msg' && matchMedia('(pointer:fine)').matches) { e.preventDefault(); e.target.form.requestSubmit(); }
  });
  addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
  render();
})();
