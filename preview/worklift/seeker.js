/* WorkLift concept prototype: job-seeker dashboard. Sample data only, nothing is saved or sent. */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = WL.esc;
  var ICON = function (id) { return '<svg class="ic"><use href="#' + id + '"/></svg>'; };

  var S = { score: 72, assessed: false, ref: false, read: {}, interested: {}, saved: {} };

  /* ---------- badges ---------- */
  var BADGES = [
    { k: 'first', n: 'First Lift', d: 'Created a profile', i: 'i-rocket', on: true },
    { k: 'resume', n: 'Résumé Ready', d: 'Built a résumé', i: 'i-doc', on: true },
    { k: 'five', n: 'Five Matches', d: 'Matched with 5 jobs', i: 'i-target', on: true },
    { k: 'pro', n: 'Profile Pro', d: 'LiftScore 85 or more', i: 'i-bars', on: false },
    { k: 'assessed', n: 'Assessed', d: 'Passed an assessment', i: 'i-cap', on: false },
    { k: 'scholar', n: 'Scholar', d: 'Read 3 lessons', i: 'i-star', on: false },
    { k: 'interview', n: 'Interview Booked', d: 'Accepted an interview', i: 'i-calendar', on: false },
    { k: 'hired', n: 'Hired', d: 'Got the job', i: 'i-trophy', on: false }
  ];
  function renderBadges(newKey) {
    var el = $('#badges'); if (!el) return;
    el.innerHTML = BADGES.map(function (b) {
      return '<div class="bdg' + (b.on ? '' : ' locked') + (b.k === newKey ? ' new' : '') + '" title="' + esc(b.d) + '"><div class="coin">' + ICON(b.i) + '</div>' + esc(b.n) + '</div>';
    }).join('');
    $('#badgeCount').textContent = BADGES.filter(function (b) { return b.on; }).length + ' of ' + BADGES.length;
  }
  function earn(k) {
    var b = BADGES.filter(function (x) { return x.k === k; })[0];
    if (!b || b.on) return;
    b.on = true; renderBadges(k);
    WL.toast('Badge earned: ' + b.n);
  }

  /* ---------- LiftScore ---------- */
  function setScore(n) {
    S.score = Math.min(100, n);
    var ring = $('#ring');
    ring.style.setProperty('--p', S.score);
    ring.setAttribute('aria-label', 'LiftScore ' + S.score + ' out of 100');
    $('#scoreVal').textContent = S.score;
    var left = (S.assessed ? 0 : 1) + (S.ref ? 0 : 1);
    $('#greetLine').textContent = S.score >= 100
      ? 'Your profile is complete. Employers searching for medical assistants see everything they need.'
      : 'Your profile is ' + S.score + '% complete. ' + (left === 1 ? 'One more lift' : 'Two more lifts') + ' and employers searching for medical assistants see everything they need.';
    $('#scoreHint').textContent = left ? 'Things to lift' : 'Nothing left to lift. Nice work.';
    if (S.score >= 85) earn('pro');
  }

  /* ---------- jobs ---------- */
  var JOBS = [
    { id: 1, title: 'Medical Assistant', co: 'Red Mountain Family Medicine', ab: 'RM', cat: 'health', loc: 'Homewood, 6 miles', pay: '$17 to $20 an hour', type: 'Full time, days', match: 94, skills: 95, exp: 90, assess: 100,
      about: 'Front-and-back office medical assistant for a four-provider family practice. Rooming, vitals, EHR charting, injections and specimen collection.',
      need: ['Medical assistant certificate or one year of experience', 'Comfortable charting in an EHR', 'Patient Care Basics assessment'] },
    { id: 2, title: 'Patient Care Technician', co: 'Shades Creek Surgical Center', ab: 'SC', cat: 'health', loc: 'Vestavia Hills, 4 miles', pay: '$16 to $19 an hour', type: 'Full time, rotating shifts', match: 88, skills: 85, exp: 85, assess: 100,
      about: 'Support nurses in pre-op and recovery: vitals, patient transport, room turnover and supply restocking.',
      need: ['BLS/CPR certification', 'Able to work rotating shifts', 'One year in a clinical setting'] },
    { id: 3, title: 'Front Desk Coordinator', co: 'Cahaba Pediatric Dentistry', ab: 'CP', cat: 'office', loc: 'Hoover, 2 miles', pay: '$15 to $17 an hour', type: 'Full time, days', match: 81, skills: 80, exp: 90, assess: 70,
      about: 'Greet families, schedule visits, verify insurance and keep the day running on time for three dentists.',
      need: ['Front desk or reception experience', 'Insurance verification', 'Friendly with kids and parents'] },
    { id: 4, title: 'Customer Care Specialist', co: 'Ironworks Insurance Group', ab: 'II', cat: 'service', loc: 'Birmingham, 9 miles', pay: '$36,000 to $41,000 a year', type: 'Full time, remote option', match: 76, skills: 70, exp: 75, assess: 80,
      about: 'Answer policyholder calls, update accounts and walk customers through claims paperwork.',
      need: ['Clear phone manner', 'Comfortable with several systems at once', 'Customer Service Basics assessment'] },
    { id: 5, title: 'Pharmacy Technician Trainee', co: 'Valley Drug', ab: 'VD', cat: 'health', loc: 'Pelham, 9 miles', pay: '$15 to $16 an hour', type: 'Part time', match: 71, skills: 65, exp: 70, assess: 80,
      about: 'Paid training toward pharmacy technician registration. Fill prescriptions, manage inventory and help at the counter.',
      need: ['High school diploma', 'Attention to detail', 'Willing to complete registration within 6 months'] },
    { id: 6, title: 'Scheduling Coordinator', co: 'Valleydale Home Health', ab: 'VH', cat: 'office', loc: 'Hoover, 3 miles', pay: '$17 to $19 an hour', type: 'Full time, days', match: 69, skills: 70, exp: 65, assess: 70,
      about: 'Build weekly visit schedules for 20 home-health aides and keep families informed of changes.',
      need: ['Scheduling or dispatch experience', 'Calm on the phone', 'Spreadsheet basics'] }
  ];
  var curJob = null, cat = 'all';
  function bar(l, w) { return '<span class="bar">' + l + '<i style="--w:' + w + '%"></i></span>'; }
  function jobStatus(j) {
    if (S.interested[j.id]) return '<span class="status ok">Interested</span>';
    if (S.saved[j.id]) return '<span class="status">Saved</span>';
    return '';
  }
  function renderJobs() {
    var list = JOBS.filter(function (j) { return cat === 'all' || (cat === 'saved' ? S.saved[j.id] : j.cat === cat); });
    var el = $('#jobs');
    if (!list.length) { el.innerHTML = '<div class="empty">Nothing saved yet. Tap a job and choose Save to keep it here.</div>'; return; }
    el.innerHTML = list.map(function (j) {
      return '<div class="job" role="button" tabindex="0" data-job="' + j.id + '" aria-label="' + esc(j.title + ' at ' + j.co + ', ' + j.match + ' percent match') + '">' +
        '<span class="co">' + j.ab + '</span>' +
        '<span><h3>' + esc(j.title) + '</h3><p class="meta">' + esc(j.co) + '. ' + esc(j.loc) + '. ' + esc(j.pay) + '</p>' +
        '<span class="bars">' + bar('Skills', j.skills) + bar('Experience', j.exp) + bar('Assessment', j.assess) + '</span></span>' +
        '<span class="act"><span class="pct">' + j.match + '%<small>match</small></span>' + jobStatus(j) + '</span></div>';
    }).join('');
  }
  function renderTop() {
    $('#topMatches').innerHTML = JOBS.slice(0, 3).map(function (j) {
      return '<button class="match" type="button" data-job="' + j.id + '"><span class="co">' + j.ab + '</span><span class="who"><b>' + esc(j.title) + '</b><span>' + esc(j.co) + '. ' + esc(j.loc) + '</span></span><span class="pct">' + j.match + '%<small>match</small></span></button>';
    }).join('');
  }
  function openJob(id) {
    var j = JOBS.filter(function (x) { return x.id === id; })[0]; if (!j) return;
    curJob = j;
    $('#jobCo').textContent = j.ab;
    $('#jobTitle').textContent = j.title + ' at ' + j.co;
    var assessNote = (!S.assessed && j.cat === 'health') ? '<p class="muted" style="font-size:13.5px;margin:8px 0 0">Pass Patient Care Basics in the Academy to confirm this part of your match.</p>' : '';
    $('#jobBody').innerHTML =
      '<p class="muted" style="margin:0 0 14px">' + esc(j.loc) + '. ' + esc(j.pay) + '. ' + esc(j.type) + '.</p>' +
      '<h4>About the role</h4><p>' + esc(j.about) + '</p>' +
      '<h4>What they\'re looking for</h4><ul style="margin:0 0 8px;padding-left:20px">' + j.need.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' +
      '<h4>Why you matched, ' + j.match + '%</h4><div class="abar"><div><span>Skills</span><b>' + j.skills + '%</b><i style="--w:' + j.skills + '%"></i></div><div><span>Experience</span><b>' + j.exp + '%</b><i style="--w:' + j.exp + '%"></i></div><div><span>Assessment</span><b>' + j.assess + '%</b><i style="--w:' + j.assess + '%"></i></div></div>' + assessNote;
    syncJobButtons();
    WL.open('jobSheet');
  }
  function syncJobButtons() {
    if (!curJob) return;
    var i = $('#jobInterest'), s = $('#jobSave');
    i.textContent = S.interested[curJob.id] ? 'Interested' : 'I\'m interested';
    i.disabled = !!S.interested[curJob.id];
    s.textContent = S.saved[curJob.id] ? 'Saved' : 'Save';
  }
  $('#jobInterest').addEventListener('click', function () {
    if (!curJob) return;
    S.interested[curJob.id] = true; syncJobButtons(); renderJobs();
    WL.toast(curJob.co + ' can see you\'re interested. Your contact details stay private until you accept an interview.');
  });
  $('#jobSave').addEventListener('click', function () {
    if (!curJob) return;
    S.saved[curJob.id] = !S.saved[curJob.id]; syncJobButtons(); renderJobs();
    WL.toast(S.saved[curJob.id] ? 'Saved to your list.' : 'Removed from your list.');
  });
  document.addEventListener('click', function (e) {
    var j = e.target.closest('[data-job]'); if (j) openJob(+j.dataset.job);
  });
  document.addEventListener('keydown', function (e) {
    var j = e.target.closest && e.target.closest('.job[data-job]');
    if (j && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openJob(+j.dataset.job); }
  });
  $('#matchFilters').addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]'); if (!b) return;
    $$('#matchFilters .chip-btn').forEach(function (x) { x.classList.toggle('on', x === b); });
    cat = b.dataset.cat; renderJobs();
  });

  /* ---------- résumé builder ---------- */
  var TPL = {
    ma: { name: 'Medical assistant', sub: 'Clinics, practices, urgent care', icon: 'i-cap',
      head: 'Medical assistant, 3 years in family practice',
      sum: 'Certified medical assistant with three years in a busy family practice. Comfortable rooming patients, taking vitals, charting in the EHR and keeping exam rooms ready.',
      jobT: 'Medical Assistant, Shades Valley Family Clinic', jobD: '2023 to now', jobB: 'Roomed patients and recorded vitals for a four-provider practice',
      edu: 'Medical Assistant certificate, Jefferson State Community College, 2021\nBLS/CPR certified, renewed 2025',
      skills: 'Vitals, EHR charting, Injections, Phlebotomy, Patient scheduling, Spanish (conversational)',
      sugSum: ['Known for calm, clear communication with anxious patients.', 'Cross-trained on front desk check-in and insurance verification.'],
      sugExp: ['Charted visits and updated medication lists in the EHR', 'Gave injections, ran EKGs and collected specimens under provider supervision', 'Prepared exam rooms and kept sterile supplies stocked', 'Covered check-in, scheduling and referrals when the front desk was short'] },
    cs: { name: 'Customer service', sub: 'Call centers, retail, support desks', icon: 'i-chat',
      head: 'Customer service professional with clinic and dental front-desk experience',
      sum: 'Five years facing customers in healthcare settings. Calm on the phone, quick with scheduling systems and used to explaining paperwork in plain language.',
      jobT: 'Receptionist, Lakeshore Dental', jobD: '2021 to 2023', jobB: 'Handled check-in, scheduling and insurance questions for a two-dentist office',
      edu: 'High school diploma, Hoover High School, 2018',
      skills: 'Phone support, Scheduling, Insurance verification, Conflict resolution, Multi-line phones',
      sugSum: ['Comfortable handling 40 or more calls a day without losing patience.', 'Keeps a clean record of every conversation so the next person can pick it up.'],
      sugExp: ['Resolved billing and scheduling questions on the first call whenever possible', 'Turned frustrated callers into repeat patients by explaining options clearly', 'Kept the daily schedule full by managing a cancellation waitlist', 'Trained two new receptionists on the scheduling system'] },
    wh: { name: 'Warehouse and logistics', sub: 'Distribution, fulfillment, docks', icon: 'i-case',
      head: 'Dependable warehouse associate, forklift certified',
      sum: 'Reliable on early and rotating shifts, with a clean safety record and experience on RF scanners, pallet jacks and sit-down forklifts.',
      jobT: 'Warehouse Associate, Shelby Distribution', jobD: '2023 to now', jobB: 'Picked and packed orders on a dock that ships 1,200 pallets a week',
      edu: 'Forklift certification, 2023\nHigh school diploma, 2018',
      skills: 'Forklift (sit-down), Pallet jack, RF scanner, Pick and pack, Cycle counts',
      sugSum: ['Perfect attendance for the last 12 months.', 'Comfortable lifting 50 pounds repeatedly through a full shift.'],
      sugExp: ['Picked and packed 300 or more orders a shift with 99.8% accuracy', 'Completed cycle counts and flagged inventory discrepancies', 'Loaded and unloaded trailers safely on a busy dock', 'Kept aisles clear and followed lockout and PPE rules every shift'] },
    oa: { name: 'Office and admin', sub: 'Front desks, scheduling, support', icon: 'i-doc',
      head: 'Organized administrative assistant with healthcare scheduling experience',
      sum: 'Keeps calendars, records and front desks running on time. Experienced with scheduling systems, insurance paperwork and multi-line phones.',
      jobT: 'Receptionist, Lakeshore Dental', jobD: '2021 to 2023', jobB: 'Managed scheduling, check-in and records for a two-dentist office',
      edu: 'High school diploma, Hoover High School, 2018',
      skills: 'Scheduling, Records management, Microsoft Office, Multi-line phones, Insurance verification',
      sugSum: ['Known for catching details other people miss.', 'Handles confidential records with care.'],
      sugExp: ['Kept two providers\' calendars accurate through daily changes', 'Processed insurance verifications and referrals before each visit', 'Maintained patient records and filing with zero audit findings', 'Ordered supplies and handled vendor calls'] }
  };
  var tplKey = 'ma', step = 1;
  var F = {};
  ['rName', 'rHead', 'rPhone', 'rEmail', 'rSum', 'rJobT', 'rJobD', 'rJobB', 'rEdu', 'rSkills', 'clJob', 'clWhy'].forEach(function (id) { F[id] = $('#' + id); });

  function renderTpls() {
    $('#tpls').innerHTML = Object.keys(TPL).map(function (k) {
      var t = TPL[k];
      return '<button type="button" class="tpl' + (k === tplKey ? ' on' : '') + '" data-tpl="' + k + '" aria-pressed="' + (k === tplKey) + '"><span class="ico">' + ICON(t.icon) + '</span><span><b>' + esc(t.name) + '</b><span>' + esc(t.sub) + '</span></span></button>';
    }).join('');
  }
  function sugg(container, items, apply) {
    container.innerHTML = items.map(function (s, i) { return '<button type="button" data-i="' + i + '">' + esc(s) + '</button>'; }).join('');
    container.onclick = function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      apply(items[+b.dataset.i]); b.disabled = true; renderPaper();
    };
  }
  function applyTpl(k) {
    tplKey = k; var t = TPL[k];
    F.rHead.value = t.head; F.rSum.value = t.sum; F.rJobT.value = t.jobT; F.rJobD.value = t.jobD; F.rJobB.value = t.jobB; F.rEdu.value = t.edu; F.rSkills.value = t.skills;
    sugg($('#suggSum'), t.sugSum, function (s) { F.rSum.value = (F.rSum.value.trim() + ' ' + s).trim(); });
    sugg($('#suggExp'), t.sugExp, function (s) { F.rJobB.value = (F.rJobB.value.trim() + '\n' + s).trim(); });
    renderTpls(); renderPaper();
  }
  $('#tpls').addEventListener('click', function (e) {
    var b = e.target.closest('[data-tpl]'); if (b) applyTpl(b.dataset.tpl);
  });
  function goStep(n) {
    step = n;
    $$('#stepper button').forEach(function (b) { var s = +b.dataset.step; b.classList.toggle('on', s === n); b.classList.toggle('done', s < n); });
    $$('.bstep').forEach(function (p) { p.classList.toggle('on', +p.dataset.step === n); });
    $('#paperLabel').textContent = n === 3 ? 'Cover letter preview' : 'Résumé preview';
    renderPaper();
    if (window.innerWidth <= 900) { var c = $('.builder'); if (c) c.scrollIntoView({ block: 'start' }); }
  }
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]'); if (g) { goStep(+g.dataset.go); return; }
    var s = e.target.closest('#stepper [data-step]'); if (s) goStep(+s.dataset.step);
  });
  function lines(v) { return v.split('\n').map(function (l) { return l.trim(); }).filter(Boolean); }
  function lc(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
  function renderPaper() {
    var body = $('#paperBody'), paper = $('#paper');
    if (step === 3) {
      paper.classList.add('letter');
      var j = JOBS.filter(function (x) { return x.id === +F.clJob.value; })[0] || JOBS[0];
      var why = F.clWhy.value.trim();
      var bl = lines(F.rJobB.value);
      var sentence2 = bl.length ? 'Most recently as ' + esc(F.rJobT.value) + ', I ' + esc(lc(bl[0]).replace(/\.$/, '')) + (bl[1] ? ', and ' + esc(lc(bl[1]).replace(/\.$/, '')) : '') + '.' : '';
      body.innerHTML =
        '<p>' + esc(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })) + '</p>' +
        '<p>Dear hiring manager at ' + esc(j.co) + ',</p>' +
        '<p>I\'m writing about the ' + esc(j.title) + ' opening' + (why ? ', and in particular because of ' + esc(why.replace(/\.$/, '')) : '') + '. ' + esc(F.rSum.value) + '</p>' +
        '<p>' + sentence2 + ' You\'re looking for ' + esc(lc(j.need[0])) + ' and ' + esc(lc(j.need[1])) + ', and that is the work I do every day.</p>' +
        '<p>I\'d welcome the chance to talk about how I can help ' + esc(j.co) + '. Thank you for your time.</p>' +
        '<p>' + esc(F.rName.value) + '<br>' + esc(F.rPhone.value) + '<br>' + esc(F.rEmail.value) + '</p>';
      return;
    }
    paper.classList.remove('letter');
    var skills = F.rSkills.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    body.innerHTML =
      '<h3>' + esc(F.rName.value) + '</h3><p class="hd">' + esc(F.rHead.value) + '<br>' + esc(F.rPhone.value) + ' &middot; ' + esc(F.rEmail.value) + '</p>' +
      '<h4>Summary</h4><p>' + esc(F.rSum.value) + '</p>' +
      '<h4>Experience</h4><div class="pjob"><b>' + esc(F.rJobT.value) + '</b><i>' + esc(F.rJobD.value) + '</i><ul>' + lines(F.rJobB.value).map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></div>' +
      (tplKey === 'ma' ? '<div class="pjob"><b>Receptionist, Lakeshore Dental</b><i>2021 to 2023</i><ul><li>Check-in, scheduling and insurance verification for a two-dentist office</li></ul></div>' : '') +
      '<h4>Education and certificates</h4>' + lines(F.rEdu.value).map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') +
      '<h4>Skills</h4><p>' + skills.map(esc).join(' &middot; ') + '</p>';
  }
  ['rName', 'rHead', 'rPhone', 'rEmail', 'rSum', 'rJobT', 'rJobD', 'rJobB', 'rEdu', 'rSkills', 'clWhy'].forEach(function (id) { F[id].addEventListener('input', renderPaper); });
  F.clJob.innerHTML = JOBS.map(function (j) { return '<option value="' + j.id + '">' + esc(j.title) + ' at ' + esc(j.co) + '</option>'; }).join('');
  F.clJob.addEventListener('change', renderPaper);

  /* ---------- assessment ---------- */
  var QUIZ = [
    { q: 'Before taking a patient back to the exam room, what should you check first?', a: ['Whether their insurance is active', 'Two identifiers, like their name and date of birth', 'That the provider is ready', 'Their reason for the visit'], c: 1, why: 'Two identifiers protect against mix-ups between patients with similar names.' },
    { q: 'A patient\'s blood pressure reads 158 over 96. What do you do?', a: ['Record it and tell the provider before the visit', 'Write it down and move on', 'Ask the patient to relax and skip it', 'Retake it at the next visit'], c: 0, why: 'A reading that high is worth flagging straight away. Record it, then let the provider know before they go in.' },
    { q: 'When is hand hygiene required?', a: ['Only after touching blood or body fluids', 'At the start and end of your shift', 'Before and after every patient contact', 'Only when gloves are not available'], c: 2, why: 'Before and after every contact, gloves or not. It is the single most effective way to prevent infection in a clinic.' },
    { q: 'A patient in the waiting room asks whether their neighbor\'s test results came back. You:', a: ['Check the chart and tell them', 'Tell them to ask the provider', 'Ask the neighbor\'s permission later', 'Explain that you can\'t share another patient\'s information'], c: 3, why: 'Another patient\'s information is private under HIPAA, even to a friend or family member, unless that patient has authorized it.' },
    { q: 'What is a normal resting pulse for an adult?', a: ['40 to 60 beats a minute', '60 to 100 beats a minute', '100 to 120 beats a minute', '120 or more beats a minute'], c: 1, why: 'Sixty to one hundred is the normal adult range. Athletes can sit lower; anything over 100 at rest is worth noting.' }
  ];
  var Q = { i: -1, right: 0, picked: null };
  var qb = $('#quizBody'), qf = $('#quizFoot');
  function quizIntro() {
    Q.i = -1; Q.right = 0; Q.picked = null;
    qb.innerHTML = '<div class="quiz"><div class="quiz-intro"><div class="assess" style="flex:1"><div class="ico">' + ICON('i-cap') + '</div><div><b>Patient Care Basics</b><span>5 questions, about 4 minutes</span></div></div></div>' +
      '<p>Pick the best answer for each question. You\'ll see why after each one.</p><p>Employers see your result next to your profile. A pass (4 of 5 or better) lifts your LiftScore by 18 and earns the Assessed badge.</p></div>';
    qf.innerHTML = '<button class="btn btn-lift" type="button" id="qStart">Start the assessment</button>';
    $('#qStart').addEventListener('click', function () { Q.i = 0; quizQ(); });
  }
  function quizQ() {
    var q = QUIZ[Q.i]; Q.picked = null;
    qb.innerHTML = '<div class="quiz"><div class="q"><span class="n">Question ' + (Q.i + 1) + ' of ' + QUIZ.length + '</span><h3>' + esc(q.q) + '</h3><div class="opts" id="opts">' +
      q.a.map(function (a, i) { return '<button type="button" class="opt" data-i="' + i + '">' + esc(a) + '</button>'; }).join('') + '</div><p id="qWhy" style="margin:12px 0 0;font-size:14.5px;color:var(--ink-2)"></p></div></div>';
    qf.innerHTML = '<button class="btn btn-lift" type="button" id="qNext" disabled>' + (Q.i === QUIZ.length - 1 ? 'See my result' : 'Next question') + '</button>';
    $('#opts').addEventListener('click', function (e) {
      var b = e.target.closest('.opt'); if (!b || Q.picked !== null) return;
      Q.picked = +b.dataset.i;
      $$('#opts .opt').forEach(function (o, i) { o.disabled = true; if (i === q.c) o.classList.add('right'); else if (i === Q.picked) o.classList.add('wrong'); });
      if (Q.picked === q.c) Q.right++;
      $('#qWhy').textContent = (Q.picked === q.c ? 'Correct. ' : 'Not quite. ') + q.why;
      $('#qNext').disabled = false;
    });
    $('#qNext').addEventListener('click', function () { Q.i++; if (Q.i < QUIZ.length) quizQ(); else quizResult(); });
  }
  function quizResult() {
    var pct = Math.round(Q.right / QUIZ.length * 100), pass = Q.right >= 4;
    qb.innerHTML = '<div class="quiz"><div class="result"><div class="ring" style="--p:' + pct + '" role="img" aria-label="Score ' + pct + ' percent"><svg viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="52"/><circle class="fg" cx="60" cy="60" r="52"/></svg><div class="val"><b>' + pct + '%</b></div></div><div class="txt"><h3>' + (pass ? 'You passed. ' : 'Not quite. ') + Q.right + ' of ' + QUIZ.length + '.</h3><p>' + (pass ? 'Patient Care Basics is on your profile. Employers see the result while result sharing is on in Privacy. LiftScore up 18.' : 'Four of five is a pass. Reread the explanations and try again whenever you like.') + '</p></div></div></div>';
    qf.innerHTML = pass ? '<button class="btn btn-lift" type="button" id="qDone">Back to the Academy</button>' : '<button class="btn btn-lift" type="button" id="qRetry">Try again</button>';
    if (pass) {
      if (!S.assessed) { S.assessed = true; setScore(S.score + 18); earn('assessed'); }
      $('#pcbStatus').textContent = 'Passed, ' + pct + '%, today';
      $('#startQuiz').textContent = 'Retake';
      $('#profAssessVal').textContent = pct + '%'; $('#profAssessVal').className = ''; $('#profAssessBar').style.setProperty('--w', pct + '%');
      var t = $('#todoAssess'); if (t) { t.classList.add('done'); t.innerHTML = ICON('i-check') + '<span>Patient Care Basics passed</span><span class="pts">Done</span>'; }
      $('#qDone').addEventListener('click', function () { WL.close('quizSheet'); });
    } else {
      $('#qRetry').addEventListener('click', function () { Q.i = 0; Q.right = 0; quizQ(); });
    }
  }
  $('#startQuiz').addEventListener('click', function () { quizIntro(); WL.open('quizSheet'); });

  /* ---------- lessons ---------- */
  $$('#lessons details').forEach(function (d, i) {
    d.addEventListener('toggle', function () {
      if (!d.open || S.read[i]) return;
      S.read[i] = true;
      var n = Object.keys(S.read).length;
      $('#lessonProg').textContent = n + ' of 5 read';
      if (n >= 3) earn('scholar');
    });
  });

  /* ---------- references ---------- */
  var refs = [];
  $('#addRef').addEventListener('click', function () {
    var n = $('#refName').value.trim(), r = $('#refRel').value.trim();
    if (!n) { $('#refName').focus(); WL.toast('Add the reference\'s name first.'); return; }
    refs.push({ n: n, r: r });
    $('#refList').innerHTML = '<div class="hist" style="margin-bottom:14px">' + refs.map(function (x) { return '<div class="h"><b>' + esc(x.n) + '</b>' + (x.r ? '<span>' + esc(x.r) + '</span>' : '') + '</div>'; }).join('') + '</div>';
    $('#refCount').textContent = refs.length + ' added';
    $('#refName').value = ''; $('#refRel').value = '';
    if (!S.ref) {
      S.ref = true; setScore(S.score + 10);
      var t = $('#todoRef'); if (t) { t.classList.add('done'); t.innerHTML = ICON('i-check') + '<span>Reference added</span><span class="pts">Done</span>'; }
      WL.toast('Reference added. LiftScore up 10.');
    } else WL.toast('Reference added.');
  });

  /* ---------- interview request ---------- */
  $('#acceptReq').addEventListener('click', function () {
    $('#req1').innerHTML = '<div class="avatar sm sky">RM</div><div class="who"><b>Red Mountain Family Medicine</b><span>Medical Assistant. Tuesday, Nov 18 at 10:00 am, in person</span><span class="muted" style="font-size:13px;margin-top:4px">Your phone number and email are now shared with Red Mountain.</span></div><div class="acts"><span class="status ok">Accepted</span></div>';
    $('#reqStatus').textContent = '1 accepted'; $('#reqStatus').className = 'status ok';
    earn('interview');
  });
  $('#declineReq').addEventListener('click', function () {
    $('#req1').innerHTML = '<div class="avatar sm sky">RM</div><div class="who"><b>Red Mountain Family Medicine</b><span>Medical Assistant. Tuesday, Nov 18 at 10:00 am, in person</span><span class="muted" style="font-size:13px;margin-top:4px">Red Mountain was told you declined. They never saw your contact details.</span></div><div class="acts"><span class="status off">Declined</span></div>';
    $('#reqStatus').textContent = '0 waiting'; $('#reqStatus').className = 'status off';
    WL.toast('Declined. Your contact details were not shared.');
  });

  /* ---------- privacy ---------- */
  $('#pvVisible').addEventListener('change', function () { WL.toast(this.checked ? 'Your profile is visible in employer searches.' : 'Your profile is hidden. Employers can no longer find you.'); });
  $('#pvAssess').addEventListener('change', function () { WL.toast(this.checked ? 'Assessment results are shown to employers.' : 'Assessment results are hidden from employers.'); });
  $('#confirmDelete').addEventListener('click', function () { WL.close('deleteModal'); WL.toast('Prototype: account deletion is switched off on this preview.'); });

  /* ---------- boot ---------- */
  renderBadges(); renderTop(); renderJobs(); applyTpl('ma');
  WL.router('overview', function (name) { if (name === 'resume') renderPaper(); });
})();
