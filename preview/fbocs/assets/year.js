/* School-year engine. Every date here comes from the rules on fbocs.org/calendar:
   fixed month/day deadlines, plus "second Sunday in August" and "third Thursday in January". */
window.FBOCS = (() => {
  const D = (y, m, d) => new Date(y, m, d);
  const nth = (y, m, wd, n) => { const off = (wd - D(y, m, 1).getDay() + 7) % 7; return D(y, m, 1 + off + 7 * (n - 1)); };
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day0 = d => D(d.getFullYear(), d.getMonth(), d.getDate());
  const daysUntil = (d, now = new Date()) => Math.round((day0(d) - day0(now)) / 864e5);
  const short = d => MON[d.getMonth()] + ' ' + d.getDate();
  const long = d => DAY[d.getDay()] + ', ' + MONTH[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  const rel = (d, now) => { const n = daysUntil(d, now); return n === 0 ? 'today' : n === 1 ? 'tomorrow' : n > 1 ? 'in ' + n + ' days' : n === -1 ? 'yesterday' : -n + ' days ago'; };

  function year(now = new Date()) {
    const y = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
    const periods = [
      ['p1', 'July/August', D(y, 8, 10)], ['p2', 'September/October', D(y, 10, 10)], ['p3', 'November/December', D(y + 1, 0, 10)],
      ['p4', 'January/February', D(y + 1, 2, 10)], ['p5', 'March/April', D(y + 1, 4, 10)], ['p6', 'May/June', D(y + 1, 5, 10)],
    ].map(([key, label, due]) => ({ key, label, due }));
    const ev = (date, title, detail, kind) => ({ date, title, detail, kind });
    const events = [
      ev(D(y, 6, 15), 'HSLDA membership and Course of Study', 'Verify your HSLDA membership or renewal, and submit Course of Study forms online.', 'deadline'),
      ev(nth(y, 7, 0, 2), 'Fall Orientation Meeting', 'For both parents. 3:00 pm – 5:00 pm, First Baptist Church Opelika.', 'meeting'),
      ev(periods[0].due, 'July/August Bimonthly Report', 'Submit online.', 'deadline'),
      ev(periods[1].due, 'September/October Bimonthly Report', 'Submit online.', 'deadline'),
      ev(periods[2].due, 'November/December Bimonthly Report', 'Submit online.', 'deadline'),
      ev(nth(y + 1, 0, 4, 3), 'Midyear Progress Meeting', 'For the teaching parent. 6:00 pm – 8:00 pm, First Baptist Church Opelika, room to be announced.', 'meeting'),
      ev(periods[3].due, 'January/February Bimonthly Report', 'Submit online.', 'deadline'),
      ev(D(y + 1, 3, 1), 'Applications open for current families', 'Current FBOCS families may begin submitting applications.', 'registration'),
      ev(D(y + 1, 3, 15), 'Applications open for First Baptist Opelika members', 'New families who are members of First Baptist Church Opelika may begin submitting applications.', 'registration'),
      ev(D(y + 1, 4, 1), 'Applications open for all other new families', 'Registration closes once membership is full.', 'registration'),
      ev(periods[4].due, 'March/April Bimonthly Report', 'Submit online.', 'deadline'),
      ev(D(y + 1, 5, 10), 'Year-end reports', 'May/June Bimonthly Report if needed, K-8 Report Card, High School Course Documentation and Annual Attendance Record.', 'deadline'),
      ev(D(y + 1, 5, 30), 'Registration materials, tuition and fees', 'Annual Enrollment Application, signed Handbook Verification, Church School Enrollment Forms for new students, tuition and fees.', 'deadline'),
    ];
    return { y, label: y + '–' + String(y + 1).slice(2), periods, events, start: D(y, 6, 1), end: D(y + 1, 5, 30) };
  }

  /* Registration window: applications are only accepted April 1 – June 30. */
  function registration(now = new Date()) {
    const y = now.getFullYear(), t = day0(now);
    if (t < D(y, 3, 1)) return { open: false, text: 'Applications open April 1, ' + y + '.', next: D(y, 3, 1) };
    if (t < D(y, 3, 15)) return { open: true, text: 'Open now for current FBOCS families. New First Baptist Opelika member families may apply from April 15.' };
    if (t < D(y, 4, 1)) return { open: true, text: 'Open now for current families and new families who are members of First Baptist Church Opelika. All other new families may apply from May 1.' };
    if (t <= D(y, 5, 30)) return { open: true, text: 'Open now through June 30, or until membership is full.' };
    return { open: false, text: 'Applications open April 1, ' + (y + 1) + '.', next: D(y + 1, 3, 1) };
  }

  /* Fees from the About Us and Registration pages. */
  function fees({ type = 'member', firstYear = false, hs = 0 }) {
    const lines = [[type === 'associate' ? 'Annual tuition, associate member family' : 'Annual tuition, member family', type === 'associate' ? 50 : 150]];
    if (firstYear) lines.push(['Registration fee, first year only', 35]);
    if (type !== 'associate' && hs === 1) lines.push(['High school fee, one student', 50]);
    if (type !== 'associate' && hs >= 2) lines.push(['High school fee, two or more students', 75]);
    return { lines, total: lines.reduce((s, l) => s + l[1], 0) };
  }

  /* GPA as described on the High School page. */
  const QP = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  function gpa(courses) {
    let cr = 0, un = 0, wt = 0, weighted = false;
    courses.forEach(c => {
      const q = QP[c.grade]; const credit = +c.credit;
      if (q === undefined || !credit) return;
      const bump = q > 0 ? (c.type === 'honors' ? 0.5 : c.type === 'college' ? 1 : 0) : 0;
      if (c.type === 'honors' || c.type === 'college') weighted = true;
      cr += credit; un += q * credit; wt += (q + bump) * credit;
    });
    return { credits: cr, unweighted: cr ? un / cr : null, weighted: cr && weighted ? wt / cr : null };
  }

  return { year, registration, fees, gpa, daysUntil, short, long, rel, MONTH, MON };
})();
