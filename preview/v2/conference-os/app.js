/* Conference OS v2 — concept demo. All data below is fictional, deterministic sample data. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 1. Sample data                                                      */
  /* ------------------------------------------------------------------ */
  var STORE_KEY = 'v2-conference-os-state';
  var START_CLOCK = 14 * 60 + 41; // 2:41 PM sample time
  var CONF = { name: 'Kestrel Plains Conference', week: 'Week 4', day: 'Saturday slate' };
  var ME = 'Priya Raman';
  var ME_ROLE = 'Duty officer';

  var GAMES = [
    { id: 'G1', home: 'Harlow State', homeAbbr: 'HAR', away: 'Brightwater', awayAbbr: 'BRI', venue: 'Ridgeline Field', kick: 825, score: [10, 7] },
    { id: 'G2', home: 'Calder Ridge', homeAbbr: 'CAL', away: 'Sable Creek', awayAbbr: 'SAB', venue: 'Calder Bowl', kick: 660, score: [24, 21] },
    { id: 'G3', home: 'Orrin Valley State', homeAbbr: 'ORV', away: 'Kestrel Point', awayAbbr: 'KPT', venue: 'Millrace Stadium', kick: 780, score: [14, 3] },
    { id: 'G4', home: 'Tamsin Falls', homeAbbr: 'TAM', away: 'Hollin State', awayAbbr: 'HOL', venue: 'Falls Park Field', kick: 930 },
    { id: 'G5', home: 'Ashgrove', homeAbbr: 'ASH', away: 'Corvane State', awayAbbr: 'COR', venue: 'Commons Stadium', kick: 960 },
    { id: 'G6', home: 'Merriton', homeAbbr: 'MER', away: 'Quarry Hill', awayAbbr: 'QUA', venue: 'Old Quarry Field', kick: 690, score: [17, 20] },
    { id: 'G7', home: 'Pellam', homeAbbr: 'PEL', away: 'Marrow Bay State', awayAbbr: 'MBS', venue: 'Pellam Yard', kick: 1140 },
    { id: 'G8', home: 'Fennick', homeAbbr: 'FEN', away: 'Wrenfield', awayAbbr: 'WRE', venue: 'Lantern Hill Stadium', kick: 1170 }
  ];
  var GAME = {}; GAMES.forEach(function (g) { GAME[g.id] = g; });

  var BROADCAST_ITEMS = ['Production truck power', 'Graphics feed check', 'Stadium PA sync', 'Pre-game timing sheet', 'Replay booth comms check'];

  var POSITIONS = [
    { k: 'R', name: 'Referee' }, { k: 'U', name: 'Umpire' }, { k: 'HL', name: 'Head line judge' },
    { k: 'LJ', name: 'Line judge' }, { k: 'SJ', name: 'Side judge' }, { k: 'FJ', name: 'Field judge' }, { k: 'BJ', name: 'Back judge' }
  ];
  var REPLAY = [{ k: 'RO', name: 'Replay official' }, { k: 'RC', name: 'Replay communicator' }];

  var FIRST = ['Adrian', 'Beth', 'Calvin', 'Dmitri', 'Elena', 'Felix', 'Hana', 'Isaac', 'Jonah', 'Keira', 'Lamar', 'Maya', 'Nolan', 'Omar', 'Paige', 'Quinn', 'Rafael', 'Sonia', 'Trent', 'Uma', 'Victor', 'Wade', 'Yvette', 'Zane', 'Andre', 'Brooke', 'Colin', 'Delia', 'Emmett', 'Farah', 'Gideon', 'Hollis', 'Ines', 'Jasper', 'Lena', 'Miles', 'Nadia', 'Orson', 'Petra', 'Reid', 'Selma', 'Tobias', 'Vera', 'Warren', 'Yusuf', 'Ada', 'Boris', 'Cora', 'Dev', 'Esme', 'Flynn', 'Gwen', 'Hector', 'Iris', 'Joel', 'Kira', 'Levi', 'Mina', 'Ned', 'Opal', 'Pierce', 'Rhea', 'Silas', 'Tess', 'Vince', 'Wren', 'Abel', 'Bianca', 'Cyrus', 'Dora', 'Ezra', 'Fern'];
  var LAST = ['Ashby', 'Brandt', 'Castell', 'Dunleavy', 'Ellery', 'Fairbanks', 'Garrow', 'Holloway', 'Ivers', 'Jessup', 'Kettering', 'Lindqvist', 'Marchetti', 'Norcross', 'Oyelaran', 'Pruitt', 'Quarles', 'Rasmussen', 'Sandoval', 'Thackeray', 'Upshaw', 'Vantreese', 'Whitcombe', 'Yarrow', 'Zelenko'];

  // Officials not assigned to any game — the reassignment pool.
  var SPARES = [
    { name: 'Tomas Beaumont', note: '42 mi from Falls Park Field' },
    { name: 'Grace Whitfield', note: '68 mi from Falls Park Field' },
    { name: 'Keon Ellery', note: '120 mi from Falls Park Field' }
  ];
  var REPLAY_SPARES = [{ name: 'Mara Lindgren', note: 'remote replay qualified' }];

  function seedAssignments() {
    var a = {}, n = 0, r = 0;
    GAMES.forEach(function (g) {
      var crew = {};
      POSITIONS.forEach(function (p) {
        crew[p.k] = { name: FIRST[n % FIRST.length] + ' ' + LAST[(n * 7 + 3) % LAST.length], conf: true };
        n++;
      });
      REPLAY.forEach(function (p) {
        crew[p.k] = { name: FIRST[(r * 5 + 11) % FIRST.length] + ' ' + LAST[(r * 3 + 1) % LAST.length], conf: true, replay: true };
        r++;
      });
      a[g.id] = crew;
    });
    a.G1.R = { name: 'Luis Carrera', conf: true };
    a.G7.LJ = { name: 'Marcus Okafor', conf: true };
    a.G4.LJ = { name: 'Marcus Okafor', conf: false };
    return a;
  }

  // Lightning strikes near Ridgeline Field (sample, illustrative). t = minutes after midnight.
  var STRIKES = [
    { t: 864, d: 11.2, b: 272 },
    { t: 871, d: 9.4, b: 246 },
    { t: 878, d: 7.6, b: 222 },
    { t: 889, d: 6.3, b: 200 },
    { t: 903, d: 12.8, b: 168 }
  ];
  var THRESHOLD = 8, POLICY_MIN = 30;

  var INCIDENTS = {
    'INC-204': {
      id: 'INC-204', kind: 'weather', game: 'G1', sev: 'critical', opened: 878,
      title: 'Lightning within 8 miles of Ridgeline Field',
      short: 'Lightning 7.6 mi from Ridgeline Field',
      responses: [
        { k: 'delay30', label: 'Issue 30-minute weather delay', help: 'Suspend play, clear the field, shelter spectators. The 30-minute clock restarts with every strike within 8 miles.', rec: true, ack: 'Acknowledge and issue delay' },
        { k: 'monitor', label: 'Monitor without stopping play', help: 'Not allowed by policy — the last strike was inside 8 miles.', disabled: true },
        { k: 'suspend', label: 'Suspend and evaluate postponement', help: 'Use when radar shows the cell will hold for more than 90 minutes. Starts the same 30-minute clock.', ack: 'Acknowledge and suspend' }
      ],
      owners: [
        { k: 'dana', label: 'Dana Whitlock — Game management, Harlow State' },
        { k: 'luis', label: 'Luis Carrera — Referee, crew chief' },
        { k: 'priya', label: 'Priya Raman — Conference duty officer (you)' }
      ],
      notify: [
        { k: 'crew', label: 'Referee crew chief', who: 'Luis Carrera', rec: true },
        { k: 'home', label: 'Home team operations', who: 'Harlow State', rec: true },
        { k: 'away', label: 'Visiting team operations', who: 'Brightwater', rec: true },
        { k: 'replay', label: 'Replay center', who: 'KPC replay desk' },
        { k: 'prod', label: 'Production truck', who: 'Conference production producer' },
        { k: 'pa', label: 'Stadium PA / public safety', who: 'Ridgeline Field operations', rec: true }
      ],
      stakeholders: [
        { role: 'Game management (home)', name: 'Dana Whitlock', org: 'Harlow State' },
        { role: 'Referee · crew chief', name: 'Luis Carrera', org: 'KPC officials' },
        { role: 'Visiting team operations', name: 'Colette Ambrose', org: 'Brightwater' },
        { role: 'Venue public safety', name: 'Sgt. Rowan Pike', org: 'Ridgeline Field' },
        { role: 'Production producer', name: 'Anika Szabo', org: 'Conference production' },
        { role: 'Conference duty officer', name: 'Priya Raman', org: 'KPC operations (you)' }
      ]
    },
    'INC-201': {
      id: 'INC-201', kind: 'equipment', game: 'G6', sev: 'low', opened: 772,
      title: 'Scoreboard game clock fault at Old Quarry Field',
      short: 'Scoreboard clock fault — backup clocks in use',
      responses: [
        { k: 'backup', label: 'Keep field-level backup clocks through the final', help: 'Side judge keeps official time; PA announces time at each stoppage.' },
        { k: 'close', label: 'Close — venue confirms scoreboard repaired', help: 'Only when stadium operations confirm the main clock matches the field clock.', ack: 'Record update and close' }
      ],
      owners: [
        { k: 'merriton', label: 'Hal Brennan — Game management, Merriton' },
        { k: 'priya', label: 'Priya Raman — Conference duty officer (you)' }
      ],
      notify: [
        { k: 'crew', label: 'Referee crew chief', who: 'G6 crew', rec: true },
        { k: 'home', label: 'Home team operations', who: 'Merriton', rec: true },
        { k: 'away', label: 'Visiting team operations', who: 'Quarry Hill' },
        { k: 'prod', label: 'Production truck', who: 'Conference production producer' }
      ],
      stakeholders: [
        { role: 'Game management (home)', name: 'Hal Brennan', org: 'Merriton' },
        { role: 'Stadium operations', name: 'Kofi Adebayo-Lane', org: 'Old Quarry Field' },
        { role: 'Side judge (official time)', name: 'from G6 crew', org: 'KPC officials' },
        { role: 'Conference duty officer', name: 'Priya Raman', org: 'KPC operations (you)' }
      ]
    }
  };

  function initialState() {
    return {
      v: 2,
      clock: START_CLOCK,
      filter: 'all',
      guided: false,
      explainerOpen: true,
      bc: { G1: 5, G2: 5, G3: 5, G4: 5, G5: 4, G6: 5, G7: 3, G8: 2 },
      asg: seedAssignments(),
      delay: {},       // gameId -> { start, inc }
      paused: {},      // gameId -> minutes paused
      inc: {
        'INC-204': { status: 'new', response: null, owner: '', notify: [], ackAt: null, ackResponse: null },
        'INC-201': { status: 'monitoring', response: 'backup', owner: 'merriton', notify: ['crew', 'home'], ackAt: 775, ackResponse: 'backup' }
      },
      flags: { opened204: false, seenDelayedBoard: false },
      seq: 100,
      audit: [
        { t: 552, ref: 'ASN-118', actor: 'Scheduling rule', text: 'Marcus Okafor (Line judge) confirmed for Pellam vs. Marrow Bay State, 7:00 PM.' },
        { t: 665, ref: 'ASN-118', actor: 'Crew desk import', text: 'Marcus Okafor also listed as Line judge for Tamsin Falls vs. Hollin State, 3:30 PM. Kickoffs 3h 30m apart, 190 mi travel — conflict flagged.' },
        { t: 772, ref: 'INC-201', actor: 'Kofi Adebayo-Lane · stadium ops', text: 'Main scoreboard game clock stopped updating in Q2. INC-201 opened.' },
        { t: 775, ref: 'INC-201', actor: 'Priya Raman · duty officer', text: 'Response: keep field-level backup clocks. Owner: Hal Brennan (game management).' },
        { t: 820, ref: 'INC-201', actor: 'Kofi Adebayo-Lane · stadium ops', text: 'Technician on site; repair planned after the final whistle.' },
        { t: 864, ref: 'INC-204', actor: 'System · sample strike feed', text: 'Strike 11.2 mi from Ridgeline Field — outside 8 mi threshold.' },
        { t: 870, ref: 'BRD-311', actor: 'Checklist rule', text: 'Ashgrove vs. Corvane State broadcast checklist at 4/5 at the 90-minute mark. “Replay booth comms check” not logged.' },
        { t: 871, ref: 'INC-204', actor: 'System · sample strike feed', text: 'Strike 9.4 mi — outside threshold. Weather watch posted to Harlow State game management.' },
        { t: 878, ref: 'INC-204', actor: 'System · sample strike feed', text: 'Strike 7.6 mi — inside 8 mi threshold. INC-204 opened as Critical.' },
        { t: 879, ref: 'INC-204', actor: 'Routing rule', text: 'Paged conference duty officer Priya Raman. Not yet acknowledged.' }
      ]
    };
  }

  /* ------------------------------------------------------------------ */
  /* 2. State + persistence                                              */
  /* ------------------------------------------------------------------ */
  var state;
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) { var s = JSON.parse(raw); if (s && s.v === 2) return s; }
    } catch (e) { /* storage unavailable */ }
    return initialState();
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  state = load();
  state.audit.forEach(function (a, i) { if (a.seq == null) a.seq = i; });

  function log(ref, text, actor) {
    state.seq++;
    state.audit.push({ t: state.clock, ref: ref, actor: actor || (ME + ' · duty officer (you)'), text: text, seq: state.seq, fresh: true });
  }

  /* ------------------------------------------------------------------ */
  /* 3. Helpers                                                          */
  /* ------------------------------------------------------------------ */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(m) { var h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'PM' : 'AM', h12 = h % 12 || 12; return h12 + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap; }
  function dur(m) { if (m < 60) return m + ' min'; var h = Math.floor(m / 60), r = m % 60; return h + 'h' + (r ? ' ' + r + 'm' : ''); }
  function icon(id, cls) { return '<svg class="ic ' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="#i-' + id + '"/></svg>'; }
  function matchup(g) { return g.home + ' vs. ' + g.away; }
  var mq = window.matchMedia('(max-width: 760px)');
  function isMobile() { return mq.matches; }

  function gameState(g) {
    var d = state.delay[g.id];
    if (d) return { k: 'delayed', label: 'Delayed · weather', icon: 'bolt', tone: 'amber' };
    var el = state.clock - g.kick - (state.paused[g.id] || 0);
    if (el < 0) return { k: 'pre', label: 'Pre-game', icon: 'clock', tone: 'neutral', el: el };
    if (el < 50) return { k: 'live', q: 1, label: 'In progress · Q1', icon: 'play', tone: 'blue' };
    if (el < 100) return { k: 'live', q: 2, label: 'In progress · Q2', icon: 'play', tone: 'blue' };
    if (el < 125) return { k: 'half', label: 'Halftime', icon: 'pause', tone: 'neutral' };
    if (el < 175) return { k: 'live', q: 3, label: 'In progress · Q3', icon: 'play', tone: 'blue' };
    if (el < 220) return { k: 'live', q: 4, label: 'In progress · Q4', icon: 'play', tone: 'blue' };
    return { k: 'final', label: 'Final', icon: 'flag', tone: 'muted' };
  }

  function weatherClock() {
    var visible = STRIKES.filter(function (s) { return s.t <= state.clock; });
    var inside = visible.filter(function (s) { return s.d <= THRESHOLD; });
    var last = inside.length ? inside[inside.length - 1] : null;
    var resumeAt = last ? last.t + POLICY_MIN : null;
    return { visible: visible, last: last, resumeAt: resumeAt, remaining: resumeAt == null ? 0 : Math.max(0, resumeAt - state.clock), expired: resumeAt != null && state.clock >= resumeAt };
  }

  // Assignments: conflicts = same official in two games with kickoffs < 4h apart.
  function slotsFor(name) {
    var out = [];
    GAMES.forEach(function (g) {
      var crew = state.asg[g.id];
      Object.keys(crew).forEach(function (k) { if (crew[k].name === name) out.push({ game: g, pos: k, slot: crew[k] }); });
    });
    return out;
  }
  function slotConflicts(gid, pos) {
    var name = state.asg[gid][pos].name, g = GAME[gid];
    return slotsFor(name).filter(function (o) { return !(o.game.id === gid && o.pos === pos) && Math.abs(o.game.kick - g.kick) < 240; });
  }
  function slotIsGap(gid, pos) { var s = state.asg[gid][pos]; return slotConflicts(gid, pos).length > 0 && !s.conf; }
  function crewReady(gid) { var n = 0; POSITIONS.forEach(function (p) { if (!slotIsGap(gid, p.k)) n++; }); return n; }
  function allConflicts() {
    var list = [];
    GAMES.forEach(function (g) {
      POSITIONS.concat(REPLAY).forEach(function (p) {
        if (slotIsGap(g.id, p.k)) list.push({ gid: g.id, pos: p.k, name: state.asg[g.id][p.k].name, other: slotConflicts(g.id, p.k) });
      });
    });
    return list;
  }
  function posName(k) { var p = POSITIONS.concat(REPLAY).filter(function (x) { return x.k === k; })[0]; return p ? p.name : k; }

  function bcStatus(g) {
    var n = state.bc[g.id], due = g.kick - 90, st = gameState(g);
    if (n >= 5) return { n: n, tone: 'green', icon: 'check', text: 'Ready' };
    if (st.k === 'pre' && state.clock >= due) return { n: n, tone: 'amber', icon: 'warn', text: 'Overdue' };
    return { n: n, tone: 'neutral', icon: 'dot', text: 'Due ' + fmt(due) };
  }

  /* ------------------------------------------------------------------ */
  /* 4. Exception queue                                                  */
  /* ------------------------------------------------------------------ */
  var SEV = {
    critical: { rank: 0, label: 'Critical', icon: 'critical', tone: 'red' },
    high: { rank: 1, label: 'High', icon: 'warn', tone: 'amber' },
    moderate: { rank: 2, label: 'Moderate', icon: 'info', tone: 'blue' },
    low: { rank: 3, label: 'Low', icon: 'info', tone: 'neutral' }
  };
  var STATUS_RANK = { new: 0, monitoring: 1, resolved: 2 };

  function queueItems() {
    var items = [], wc = weatherClock();
    // INC-204
    var i204 = state.inc['INC-204'];
    var sub204;
    if (i204.status === 'new') sub204 = 'Unacknowledged · paged ' + fmt(879);
    else if (i204.status === 'monitoring') sub204 = wc.expired ? 'Clock expired · ready to resume play' : 'Delay clock · resume no earlier than ' + fmt(wc.resumeAt) + ' (' + wc.remaining + ' min)';
    else sub204 = 'Play resumed';
    items.push({ id: 'INC-204', type: 'Weather', typeIcon: 'bolt', sev: 'critical', game: 'G1', title: INCIDENTS['INC-204'].short, status: i204.status, sub: sub204, href: '#/incident/INC-204', t: 878, actionNeeded: i204.status === 'new' || (i204.status === 'monitoring' && wc.expired) });
    // ASN-118
    var conflicts = allConflicts();
    if (conflicts.length) {
      var c = conflicts[0], other = c.other[0];
      items.push({ id: 'ASN-118', type: 'Staffing', typeIcon: 'users', sev: 'high', game: c.gid, title: 'Official double-booked: ' + c.name, status: 'new',
        sub: posName(c.pos) + ' · ' + GAME[c.gid].home + ' ' + fmt(GAME[c.gid].kick) + ' and ' + other.game.home + ' ' + fmt(other.game.kick) + (conflicts.length > 1 ? ' · +' + (conflicts.length - 1) + ' more' : ''),
        href: '#/assignments/' + c.gid, t: 665, actionNeeded: true });
    } else {
      items.push({ id: 'ASN-118', type: 'Staffing', typeIcon: 'users', sev: 'high', game: 'G4', title: 'Crew conflict resolved', status: 'resolved', sub: 'All crews 7/7', href: '#/assignments/G4', t: 665 });
    }
    // BRD-311
    var g5 = GAME.G5;
    items.push({ id: 'BRD-311', type: 'Broadcast', typeIcon: 'broadcast', sev: 'moderate', game: 'G5', title: 'Replay booth comms check not logged', status: state.bc.G5 >= 5 ? 'resolved' : 'new',
      sub: g5.home + ' vs. ' + g5.away + ' · kickoff ' + fmt(g5.kick) + ' · checklist ' + state.bc.G5 + '/5', inline: state.bc.G5 < 5, t: 870, actionNeeded: state.bc.G5 < 5 });
    // INC-201
    var i201 = state.inc['INC-201'];
    items.push({ id: 'INC-201', type: 'Equipment', typeIcon: 'tool', sev: 'low', game: 'G6', title: INCIDENTS['INC-201'].short, status: i201.status,
      sub: i201.status === 'resolved' ? 'Closed' : 'Owner Hal Brennan · repair after final', href: '#/incident/INC-201', t: 772 });

    items.sort(function (a, b) {
      return (STATUS_RANK[a.status] - STATUS_RANK[b.status]) || (SEV[a.sev].rank - SEV[b.sev].rank) || (a.t - b.t);
    });
    return items;
  }
  function openIssuesFor(gid) { return queueItems().filter(function (q) { return q.game === gid && q.status !== 'resolved'; }); }

  /* ------------------------------------------------------------------ */
  /* 5. Rendering pieces                                                 */
  /* ------------------------------------------------------------------ */
  function chip(tone, ic, text, extra) {
    return '<span class="chip t-' + tone + (extra ? ' ' + extra : '') + '">' + icon(ic) + '<span>' + esc(text) + '</span></span>';
  }
  function sevChip(sev) { var s = SEV[sev]; return chip(s.tone, s.icon, s.label, 'chip-sev'); }
  function statusChip(st) {
    if (st === 'new') return chip('amber', 'warn', 'Needs action');
    if (st === 'monitoring') return chip('blue', 'eye', 'Monitoring');
    return chip('green', 'check', 'Resolved');
  }

  function stateCell(g) {
    var st = gameState(g), sub = '';
    if (st.k === 'delayed') {
      var wc = weatherClock();
      sub = wc.expired ? '<span class="st-sub t-green-text">' + icon('check') + 'Clock expired · clear to resume</span>'
        : '<span class="st-sub mono">Resume ≥ ' + fmt(wc.resumeAt) + ' · <strong>' + wc.remaining + ' min</strong> left</span>';
    } else if (st.k === 'pre') {
      var until = -st.el; sub = '<span class="st-sub mono">Kickoff in ' + dur(until) + '</span>';
    } else if (g.score && st.k !== 'pre') {
      sub = '<span class="st-sub mono">' + g.homeAbbr + ' ' + g.score[0] + ' – ' + g.awayAbbr + ' ' + g.score[1] + '</span>';
    }
    return '<div class="st">' + chip(st.tone, st.icon, st.label, 'chip-state') + sub + '</div>';
  }
  function crewCell(g, withLink) {
    var n = crewReady(g.id), ok = n === 7;
    var inner = '<span class="rd t-' + (ok ? 'green' : 'amber') + '">' + icon(ok ? 'check' : 'warn') + '<span class="mono">' + n + '/7</span><span class="rd-t">' + (ok ? 'Ready' : 'Gap') + '</span></span>';
    return withLink ? '<a class="cell-link" href="#/assignments/' + g.id + '" aria-label="Officials ' + n + ' of 7, ' + (ok ? 'ready' : 'gap') + ' — open assignments for ' + esc(matchup(g)) + '">' + inner + '</a>' : inner;
  }
  function bcCell(g) {
    var b = bcStatus(g);
    return '<span class="rd t-' + b.tone + '">' + icon(b.icon) + '<span class="mono">' + b.n + '/5</span><span class="rd-t">' + esc(b.text) + '</span></span>';
  }
  function issuesCell(g) {
    var open = openIssuesFor(g.id);
    if (!open.length) return '<span class="rd t-muted">' + icon('check') + '<span class="mono">0</span><span class="sr-only">open issues</span></span>';
    var top = open[0];
    var target = top.href || '#/board';
    var more = open.length > 1 ? '<span class="issue-more mono">+' + (open.length - 1) + '</span>' : '';
    var inner = icon(SEV[top.sev].icon) + '<span class="issue-id mono">' + top.id + '</span><span class="sr-only">, ' + SEV[top.sev].label + ', ' + esc(top.title) + '</span>' + more;
    if (!top.href) return '<span class="rd issue-link t-' + SEV[top.sev].tone + '" id="bi-' + g.id + '">' + inner + '</span>';
    return '<a class="cell-link issue-link t-' + SEV[top.sev].tone + '" href="' + target + '" id="bi-' + g.id + '">' + inner + '</a>';
  }

  function queueHTML(opts) {
    var items = queueItems();
    var groups = [
      { k: 'new', title: 'Needs action' },
      { k: 'monitoring', title: 'Monitoring' },
      { k: 'resolved', title: 'Resolved' }
    ];
    var h = '<div class="q-head"><h2 id="queue-h" class="h2" tabindex="-1">' + (opts && opts.inbox ? 'Incident inbox' : 'Exception queue') + '</h2><span class="q-sort">Sorted by urgency</span></div>';
    groups.forEach(function (gr) {
      var list = items.filter(function (i) { return i.status === gr.k; });
      h += '<section class="q-group q-' + gr.k + '" aria-labelledby="qg-' + gr.k + '"><h3 class="q-gtitle" id="qg-' + gr.k + '">' + gr.title + ' <span class="mono count">' + list.length + '</span></h3>';
      if (!list.length) h += '<p class="q-empty">' + (gr.k === 'new' ? 'Nothing needs action right now.' : 'None.') + '</p>';
      else {
        h += '<ul class="q-list">';
        list.forEach(function (i) {
          var g = GAME[i.game];
          var body = '<span class="qi-top">' + sevChip(i.sev) + '<span class="qi-type">' + icon(i.typeIcon) + i.type + '</span><span class="qi-id mono">' + i.id + '</span></span>' +
            '<span class="qi-title">' + esc(i.title) + '</span>' +
            '<span class="qi-game">' + esc(matchup(g)) + '</span>' +
            '<span class="qi-sub mono">' + esc(i.sub) + '</span>';
          h += '<li class="qi sev-' + i.sev + ' st-' + i.status + (i.actionNeeded ? ' needs' : '') + '">';
          if (i.href) h += '<a class="qi-main" id="q-' + i.id + '" href="' + i.href + '">' + body + '<span class="qi-go">' + icon('arrow-right') + '<span class="sr-only">Open</span></span></a>';
          else h += '<div class="qi-main">' + body + '</div>';
          if (i.inline) h += '<div class="qi-actions"><button type="button" class="btn btn-sm btn-outline" id="q-' + i.id + '-act" data-act="log-bc" data-game="' + i.game + '">' + icon('check') + 'Log comms check complete</button></div>';
          h += '</li>';
        });
        h += '</ul>';
      }
      h += '</section>';
    });
    return h;
  }

  /* ------------------------------------------------------------------ */
  /* 6. Views                                                            */
  /* ------------------------------------------------------------------ */
  var FILTERS = [
    { k: 'all', label: 'All' }, { k: 'pre', label: 'Pre-game' }, { k: 'live', label: 'In progress' },
    { k: 'half', label: 'Halftime' }, { k: 'delayed', label: 'Delayed' }, { k: 'final', label: 'Final' }
  ];

  function viewBoard() {
    if (state.inc['INC-204'].status !== 'new' && !state.flags.seenDelayedBoard) { state.flags.seenDelayedBoard = true; save(); }
    var counts = { all: GAMES.length };
    GAMES.forEach(function (g) { var k = gameState(g).k; counts[k] = (counts[k] || 0) + 1; });
    var shown = GAMES.slice().sort(function (a, b) { return a.kick - b.kick; }).filter(function (g) { return state.filter === 'all' || gameState(g).k === state.filter; });

    var filt = '<div class="filters" role="toolbar" aria-label="Filter games by state" id="filters">';
    FILTERS.forEach(function (f) {
      var on = state.filter === f.k;
      filt += '<button type="button" class="fbtn" id="f-' + f.k + '" data-filter="' + f.k + '" aria-pressed="' + on + '" tabindex="' + (on ? '0' : '-1') + '">' + f.label + ' <span class="mono count">' + (counts[f.k] || 0) + '</span></button>';
    });
    filt += '</div>';

    var head = '<div class="view-head"><div><h2 class="h1" id="board-h" tabindex="-1">Game board</h2><p class="sub">' + CONF.day + ' · ' + GAMES.length + ' games · sample time <span class="mono">' + fmt(state.clock) + '</span></p></div></div>';

    var body;
    if (isMobile()) {
      body = '<ul class="gcards">';
      shown.forEach(function (g) {
        body += '<li class="gcard ' + (gameState(g).k === 'delayed' ? 'is-delayed' : '') + '" id="row-' + g.id + '">' +
          '<div class="gc-top"><span class="gc-match">' + esc(g.home) + ' <span class="vs">vs.</span> ' + esc(g.away) + '</span><span class="mono gc-kick">' + fmt(g.kick) + '</span></div>' +
          '<div class="gc-venue">' + esc(g.venue) + '</div>' + stateCell(g) +
          '<div class="gc-meta"><span class="gc-l">Officials</span>' + crewCell(g, true) + '<span class="gc-l">Broadcast</span>' + bcCell(g) + '<span class="gc-l">Issues</span>' + issuesCell(g) + '</div></li>';
      });
      body += '</ul>';
    } else {
      body = '<div class="table-wrap"><table class="slate"><caption class="sr-only">Saturday slate, ' + shown.length + ' games shown</caption><thead><tr>' +
        '<th scope="col">Game</th><th scope="col">Kickoff</th><th scope="col">State</th><th scope="col">Officials</th><th scope="col">Broadcast</th><th scope="col">Open issues</th></tr></thead><tbody>';
      shown.forEach(function (g) {
        var st = gameState(g);
        body += '<tr id="row-' + g.id + '" class="' + (st.k === 'delayed' ? 'is-delayed' : '') + (st.k === 'final' ? ' is-final' : '') + '">' +
          '<th scope="row"><span class="m-teams">' + esc(g.home) + ' <span class="vs">vs.</span> ' + esc(g.away) + '</span><span class="m-venue">' + esc(g.venue) + '</span></th>' +
          '<td class="mono kick">' + fmt(g.kick) + '</td><td>' + stateCell(g) + '</td><td>' + crewCell(g, true) + '</td><td>' + bcCell(g) + '</td><td>' + issuesCell(g) + '</td></tr>';
      });
      if (!shown.length) body += '<tr><td colspan="6" class="empty">No games in this state at ' + fmt(state.clock) + '.</td></tr>';
      body += '</tbody></table></div>';
    }
    if (isMobile() && !shown.length) body = '<p class="empty">No games in this state at ' + fmt(state.clock) + '.</p>';

    if (isMobile()) return '<section class="board board-m" aria-labelledby="board-h">' + head + filt + body + '</section>';
    return '<div class="board-layout"><section class="board" aria-labelledby="board-h">' + head + filt + body +
      '<p class="legend">' + icon('info') + 'Officials = on-field crew of 7 without conflicts. Broadcast = 5-item readiness checklist, due 90 minutes before kickoff. All figures are sample data.</p></section>' +
      '<aside class="queue" aria-labelledby="queue-h">' + queueHTML() + '</aside></div>';
  }

  function viewInbox() {
    var h = '<div class="inbox">' + '<section class="queue queue-m" aria-labelledby="queue-h">' + queueHTML({ inbox: true }) + '</section>';
    h += '<section class="gstatus" aria-labelledby="gs-h"><div class="q-head"><h2 class="h2" id="gs-h">Game status</h2><a class="link-sm" href="#/board">All games' + icon('arrow-right') + '</a></div><ul class="gs-list">';
    GAMES.slice().sort(function (a, b) {
      var order = { delayed: 0, live: 1, half: 2, pre: 3, final: 4 };
      return (order[gameState(a).k] - order[gameState(b).k]) || (a.kick - b.kick);
    }).forEach(function (g) {
      var st = gameState(g);
      h += '<li class="gs-row' + (st.k === 'delayed' ? ' is-delayed' : '') + '" id="gs-' + g.id + '"><span class="gs-m"><span class="gs-teams">' + esc(g.home) + ' <span class="vs">vs.</span> ' + esc(g.away) + '</span><span class="mono gs-kick">' + fmt(g.kick) + '</span></span>' + chip(st.tone, st.icon, st.label, 'chip-state') + '</li>';
    });
    h += '</ul></section></div>';
    return h;
  }

  function viewAssignments(gid) {
    var conflicts = allConflicts();
    if (!gid || !GAME[gid]) gid = conflicts.length ? conflicts[0].gid : 'G1';
    var g = GAME[gid];
    var h = '<div class="view-head"><div><h2 class="h1" id="asg-h" tabindex="-1">Assignments</h2><p class="sub">Officials crews and replay staff by game · sample names</p></div></div>';

    if (conflicts.length) {
      h += '<div class="banner t-amber-bg" role="status">' + icon('warn') + '<div><strong>' + conflicts.length + ' crew conflict' + (conflicts.length > 1 ? 's' : '') + '</strong>';
      conflicts.forEach(function (c) {
        var o = c.other[0];
        h += '<p>' + esc(c.name) + ' is assigned as ' + posName(c.pos) + ' for <a href="#/assignments/' + c.gid + '">' + esc(matchup(GAME[c.gid])) + '</a> (' + fmt(GAME[c.gid].kick) + ', unconfirmed) and ' + posName(o.pos) + ' for ' + esc(matchup(o.game)) + ' (' + fmt(o.game.kick) + ', confirmed). Kickoffs ' + dur(Math.abs(o.game.kick - GAME[c.gid].kick)) + ' apart; crews need 4h. Reassign the unconfirmed slot.</p>';
      });
      h += '</div></div>';
    } else {
      h += '<div class="banner t-green-bg" role="status">' + icon('check') + '<div><strong>No crew conflicts.</strong><p>Every game has a full 7-person on-field crew.</p></div></div>';
    }

    // Game picker
    var picker = '<div class="asg-games"><h3 class="h3" id="asg-list-h">Games</h3><ul class="asg-list" aria-labelledby="asg-list-h">';
    GAMES.slice().sort(function (a, b) { return a.kick - b.kick; }).forEach(function (x) {
      var n = crewReady(x.id), cur = x.id === gid;
      picker += '<li><a class="asg-game' + (cur ? ' is-current' : '') + '" id="ag-' + x.id + '" href="#/assignments/' + x.id + '"' + (cur ? ' aria-current="true"' : '') + '>' +
        '<span class="ag-m">' + esc(x.home) + ' <span class="vs">vs.</span> ' + esc(x.away) + '</span><span class="ag-meta"><span class="mono">' + fmt(x.kick) + '</span>' +
        '<span class="rd t-' + (n === 7 ? 'green' : 'amber') + '">' + icon(n === 7 ? 'check' : 'warn') + '<span class="mono">' + n + '/7</span><span class="sr-only">' + (n === 7 ? 'ready' : 'gap') + '</span></span></span></a></li>';
    });
    picker += '</ul></div>';

    // Mobile game select
    var msel = '<div class="asg-msel field"><label for="asg-game-select">Game</label><select id="asg-game-select" data-act="asg-game">';
    GAMES.slice().sort(function (a, b) { return a.kick - b.kick; }).forEach(function (x) {
      msel += '<option value="' + x.id + '"' + (x.id === gid ? ' selected' : '') + '>' + esc(matchup(x)) + ' · ' + fmt(x.kick) + ' · ' + crewReady(x.id) + '/7</option>';
    });
    msel += '</select></div>';

    var n = crewReady(gid);
    var crew = '<section class="asg-crew" aria-labelledby="crew-h"><div class="crew-head"><div><h3 class="h2" id="crew-h">' + esc(matchup(g)) + '</h3><p class="sub">' + esc(g.venue) + ' · kickoff <span class="mono">' + fmt(g.kick) + '</span> · ' + chip(gameState(g).tone, gameState(g).icon, gameState(g).label, 'chip-state') + '</p></div>' +
      '<div class="crew-ready" id="crew-ready">' + '<span class="rd rd-lg t-' + (n === 7 ? 'green' : 'amber') + '">' + icon(n === 7 ? 'check' : 'warn') + '<span class="mono">' + n + '/7</span><span class="rd-t">' + (n === 7 ? 'Crew ready' : 'Crew gap') + '</span></span></div></div>';

    function rows(list, title, isReplay) {
      var r = '<table class="crew"><caption class="crew-cap">' + title + '</caption><thead><tr><th scope="col">Position</th><th scope="col">Assigned</th><th scope="col">Status</th><th scope="col">Reassign</th></tr></thead><tbody>';
      list.forEach(function (p) {
        var s = state.asg[gid][p.k], cf = slotConflicts(gid, p.k), gap = cf.length && !s.conf;
        var status;
        if (gap) status = chip('red', 'critical', 'Conflict · ' + cf[0].game.home + ' ' + fmt(cf[0].game.kick));
        else if (cf.length) status = chip('amber', 'warn', 'Confirmed · also ' + cf[0].game.home);
        else status = chip('green', 'check', 'Confirmed');
        var selId = 'sel-' + gid + '-' + p.k;
        r += '<tr class="' + (gap ? 'is-gap' : '') + '"><th scope="row"><span class="pos-k mono">' + p.k + '</span> ' + p.name + '</th><td class="who">' + esc(s.name) + '</td><td>' + status + '</td><td>' +
          '<label class="sr-only" for="' + selId + '">Reassign ' + p.name + ' for ' + esc(matchup(g)) + '</label>' + selectFor(gid, p.k, selId, isReplay) + '</td></tr>';
      });
      return r + '</tbody></table>';
    }
    crew += '<div class="table-wrap">' + rows(POSITIONS, 'On-field crew (counts toward readiness)', false) + '</div>';
    crew += '<div class="table-wrap">' + rows(REPLAY, 'Replay staff', true) + '</div>';
    crew += '<p class="legend">' + icon('info') + 'Changes save in this browser only. No official is contacted — demo.</p></section>';

    var logItems = state.audit.filter(function (a) { return a.ref === 'ASN-118' || a.ref === 'ASSIGN'; });
    var logH = '<section class="asg-log" aria-labelledby="asg-log-h"><h3 class="h3" id="asg-log-h">Change log</h3>' + auditList(logItems, 'asg-audit') + '</section>';

    return '<div class="asg">' + h + '<div class="asg-grid">' + picker + '<div class="asg-main">' + msel + crew + logH + '</div></div></div>';
  }

  function selectFor(gid, pos, id, isReplay) {
    var g = GAME[gid], cur = state.asg[gid][pos].name;
    var avail = [], clash = [], other = [];
    var spares = isReplay ? REPLAY_SPARES : SPARES;
    spares.forEach(function (s) {
      var used = slotsFor(s.name).filter(function (o) { return Math.abs(o.game.kick - g.kick) < 240 && !(o.game.id === gid && o.pos === pos); });
      if (s.name === cur) return;
      (used.length ? clash : avail).push({ name: s.name, note: used.length ? 'conflict · ' + used[0].game.home + ' ' + fmt(used[0].game.kick) : 'available · ' + s.note });
    });
    GAMES.forEach(function (x) {
      if (x.id === gid) return;
      var s = state.asg[x.id][pos]; if (!s || s.name === cur) return;
      var overlap = Math.abs(x.kick - g.kick) < 240;
      (overlap ? clash : other).push({ name: s.name, note: (overlap ? 'conflict · ' : 'also works ') + x.home + ' ' + fmt(x.kick) });
    });
    var o = '<select id="' + id + '" data-act="reassign" data-game="' + gid + '" data-pos="' + pos + '"><option value="" selected>Keep ' + esc(cur) + '</option>';
    if (avail.length) { o += '<optgroup label="Available (no overlap)">'; avail.forEach(function (a) { o += '<option value="' + esc(a.name) + '">' + esc(a.name) + ' — ' + esc(a.note) + '</option>'; }); o += '</optgroup>'; }
    if (other.length) { o += '<optgroup label="Assigned to a non-overlapping game">'; other.forEach(function (a) { o += '<option value="' + esc(a.name) + '">' + esc(a.name) + ' — ' + esc(a.note) + '</option>'; }); o += '</optgroup>'; }
    if (clash.length) { o += '<optgroup label="Would create a conflict">'; clash.forEach(function (a) { o += '<option value="' + esc(a.name) + '">' + esc(a.name) + ' — ' + esc(a.note) + '</option>'; }); o += '</optgroup>'; }
    return o + '</select>';
  }

  function auditList(items, id) {
    var sorted = items.slice().sort(function (a, b) { return (a.t - b.t) || ((a.seq || 0) - (b.seq || 0)); }).reverse();
    var h = '<ol class="audit" id="' + id + '" reversed>';
    sorted.forEach(function (a) {
      h += '<li class="' + (a.fresh ? 'is-fresh' : '') + '"><span class="au-t mono">' + fmt(a.t) + '</span><span class="au-b"><span class="au-actor">' + esc(a.actor) + '</span><span class="au-text">' + esc(a.text) + '</span></span></li>';
    });
    return h + '</ol>';
  }

  /* ---- Incident detail ---- */
  function radarSVG() {
    var wc = weatherClock(), cx = 140, cy = 140, k = 9.2;
    var ba = (222 - 90) * Math.PI / 180, bx = Math.round(cx + Math.cos(ba) * 7 * k), by = Math.round(cy + Math.sin(ba) * 7 * k);
    var s = '<svg class="radar" viewBox="0 0 280 280" role="img" aria-labelledby="radar-t radar-d"><title id="radar-t">Sample radar — illustrative</title><desc id="radar-d">Illustrative map centred on Ridgeline Field with rings at 4, 8 and 12 miles and ' + wc.visible.length + ' plotted strikes approaching from the southwest. Not live data; see the strike table.</desc>';
    s += '<rect width="280" height="280" fill="#111820"/>';
    // illustrative precipitation cell
    s += '<g opacity=".8"><ellipse cx="' + (bx - 8) + '" cy="' + (by + 8) + '" rx="66" ry="36" transform="rotate(45 ' + (bx - 8) + ' ' + (by + 8) + ')" fill="#2E6B4F" opacity=".5"/>' +
      '<ellipse cx="' + (bx - 4) + '" cy="' + (by + 4) + '" rx="38" ry="20" transform="rotate(45 ' + (bx - 4) + ' ' + (by + 4) + ')" fill="#7E7C36" opacity=".55"/>' +
      '<ellipse cx="' + bx + '" cy="' + by + '" rx="15" ry="9" transform="rotate(45 ' + bx + ' ' + by + ')" fill="#9A4E3B" opacity=".7"/></g>';
    [4, 8, 12].forEach(function (r) {
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r * k + '" fill="none" stroke="' + (r === 8 ? '#D5A84B' : '#4A5D72') + '" stroke-width="' + (r === 8 ? 1.6 : 1) + '"' + (r === 8 ? '' : ' stroke-dasharray="3 4"') + '/>';
      s += '<text x="' + (cx + r * k * 0.707 + 3) + '" y="' + (cy - r * k * 0.707 - 3) + '" class="rt' + (r === 8 ? ' rt-amber' : '') + '">' + r + ' mi</text>';
    });
    s += '<path d="M' + cx + ' 14v12M' + (cx - 4) + ' 22l4-8 4 8" stroke="#A7B4C2" fill="none" stroke-width="1.2"/><text x="' + (cx + 7) + '" y="24" class="rt">N</text>';
    wc.visible.forEach(function (st, i) {
      var a = (st.b - 90) * Math.PI / 180, x = cx + Math.cos(a) * st.d * k, y = cy + Math.sin(a) * st.d * k, inside = st.d <= THRESHOLD;
      s += '<g class="strike"><path d="M' + (x + 1) + ' ' + (y - 8) + 'l-5 8h4l-2 7 6-9h-4z" fill="' + (inside ? '#F28B82' : '#9FB0C2') + '"/>' +
        '<text x="' + (x < cx && x > 64 ? x - 7 : x + 9) + '" y="' + (y + 4) + '"' + (x < cx && x > 64 ? ' text-anchor="end"' : '') + ' class="rt' + (inside ? ' rt-red' : '') + '">' + fmt(st.t).replace(' PM', '') + '</text></g>';
    });
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="4.5" fill="#E8EDF2"/><circle cx="' + cx + '" cy="' + cy + '" r="9" fill="none" stroke="#E8EDF2" stroke-width="1"/>';
    s += '<text x="' + (cx + 12) + '" y="' + (cy + 4) + '" class="rt rt-strong">Ridgeline Field</text>';
    s += '<rect x="8" y="248" width="196" height="24" rx="3" fill="#243140"/><text x="16" y="265" class="rt rt-strong">SAMPLE · not live radar</text>';
    return s + '</svg>';
  }

  function strikeChartSVG() {
    var wc = weatherClock(), x0 = 855, x1 = 935, W = isMobile() ? 310 : 520, H = isMobile() ? 200 : 190, L = 34, R = 10, T = 18, B = 30, step = isMobile() ? 20 : 10;
    function X(t) { return L + (t - x0) / (x1 - x0) * (W - L - R); }
    function Y(d) { return T + (1 - d / 14) * (H - T - B); }
    var s = '<svg class="schart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="sc-t"><title id="sc-t">Strike distance over time, sample data. Details in the table below.</title>';
    if (wc.last) {
      var bx0 = X(wc.last.t), bx1 = X(Math.min(wc.resumeAt, x1));
      s += '<rect x="' + bx0 + '" y="' + T + '" width="' + Math.max(0, bx1 - bx0) + '" height="' + (H - T - B) + '" fill="#D5A84B" opacity=".10"/>';
      s += '<text x="' + (bx1 - 4) + '" y="' + (T + 12) + '" class="ct ct-amber" text-anchor="end">' + (isMobile() ? 'clock → ' : '30-min clock → ') + fmt(wc.resumeAt) + '</text>';
    }
    s += '<rect x="' + L + '" y="' + Y(THRESHOLD) + '" width="' + (W - L - R) + '" height="' + (Y(0) - Y(THRESHOLD)) + '" fill="#F28B82" opacity=".06"/>';
    [0, 4, 8, 12].forEach(function (d) {
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(d) + '" y2="' + Y(d) + '" stroke="' + (d === 8 ? '#D5A84B' : '#33445A') + '" stroke-width="' + (d === 8 ? 1.4 : 1) + '"' + (d === 8 ? ' stroke-dasharray="6 4"' : '') + '/>';
      s += '<text x="' + (L - 6) + '" y="' + (Y(d) + 4) + '" class="ct" text-anchor="end">' + d + '</text>';
    });
    s += '<text x="' + (W - R) + '" y="' + (Y(8) - 5) + '" class="ct ct-amber" text-anchor="end">' + (isMobile() ? '8 mi limit' : '8 mi policy threshold') + '</text>';
    for (var t = 860; t <= 930; t += step) s += '<text x="' + X(t) + '" y="' + (H - 10) + '" class="ct" text-anchor="middle">' + fmt(t).replace(/ [AP]M/, '') + '</text>';
    s += '<text x="6" y="' + (T + 2) + '" class="ct">mi</text>';
    var pts = wc.visible.map(function (st) { return X(st.t) + ',' + Y(st.d); }).join(' ');
    if (wc.visible.length > 1) s += '<polyline points="' + pts + '" fill="none" stroke="#6B7F95" stroke-width="1.2"/>';
    wc.visible.forEach(function (st) {
      var inside = st.d <= THRESHOLD;
      s += inside ? '<rect x="' + (X(st.t) - 4.5) + '" y="' + (Y(st.d) - 4.5) + '" width="9" height="9" transform="rotate(45 ' + X(st.t) + ' ' + Y(st.d) + ')" fill="#F28B82"/>' : '<circle cx="' + X(st.t) + '" cy="' + Y(st.d) + '" r="4" fill="#9FB0C2"/>';
      s += '<text x="' + (X(st.t) - 7) + '" y="' + (Y(st.d) + (inside ? 16 : -6)) + '" text-anchor="end" class="ct' + (inside ? ' ct-red' : '') + '">' + st.d + '</text>';
    });
    if (state.clock <= x1) s += '<line x1="' + X(state.clock) + '" x2="' + X(state.clock) + '" y1="' + T + '" y2="' + (H - B) + '" stroke="#7DB3EE" stroke-width="1.4"/><text x="' + (X(state.clock) + 4) + '" y="' + (H - B - 5) + '" class="ct ct-blue">now ' + fmt(state.clock).replace(/ [AP]M/, '') + '</text>';
    return s + '</svg>';
  }

  function nextAction(id) {
    var inc = INCIDENTS[id], st = state.inc[id], wc = weatherClock();
    if (st.status === 'resolved') return { k: 'back', label: isMobile() ? 'Back to inbox' : 'Back to game board', note: 'Incident resolved at ' + fmt(st.resolvedAt || state.clock) + '.' };
    if (inc.kind === 'weather' && st.status === 'monitoring') {
      if (wc.expired) return { k: 'resume', label: 'Resume play', note: 'No strike inside 8 mi for 30 minutes. Confirm with the crew chief, then resume.' };
      return { k: 'advance', label: 'Advance sample clock 15 min', note: 'Monitoring · ' + wc.remaining + ' min left on the delay clock. Any strike inside 8 mi resets it.' };
    }
    var dirty = st.status === 'monitoring' && st.response !== st.ackResponse;
    if (st.status === 'monitoring' && !dirty) return { k: 'focus-response', label: 'Choose an updated response', note: 'Monitoring since ' + fmt(st.ackAt) + '. Select a different response to record an update.' };
    if (!st.response) return { k: 'focus-response', label: 'Choose a response', note: 'Step 1 of 3 — pick a response allowed by policy.' };
    if (!st.owner) return { k: 'focus-owner', label: 'Assign an owner', note: 'Step 2 of 3 — one person owns the response.' };
    if (!st.notify.length) return { k: 'focus-notify', label: 'Choose who to notify', note: 'Step 2 of 3 — select at least one recipient.' };
    var r = inc.responses.filter(function (x) { return x.k === st.response; })[0];
    return { k: 'ack', label: r.ack || 'Acknowledge', note: 'Step 3 of 3 — records the decision, owner and notify list in the audit history.' };
  }

  function messagePreview(id) {
    var inc = INCIDENTS[id], st = state.inc[id], g = GAME[inc.game], wc = weatherClock();
    if (!st.response) return 'Choose a response to preview the message.';
    var owner = inc.owners.filter(function (o) { return o.k === st.owner; })[0];
    var ownerName = owner ? owner.label.split(' — ')[0] : '[owner not set]';
    if (inc.kind === 'weather') {
      var verb = st.response === 'suspend' ? 'Play suspended; postponement under evaluation.' : 'Weather delay in effect; play suspended.';
      return 'KPC OPS — ' + matchup(g) + ', ' + g.venue + '\n' + verb + ' Lightning ' + (wc.last ? wc.last.d + ' mi at ' + fmt(wc.last.t) : '') + '.\n30-minute clock: earliest resume ' + fmt(wc.resumeAt) + ' (resets on any strike within 8 mi).\nOwner: ' + ownerName + '. Next update by ' + fmt(state.clock + 15) + '.';
    }
    var r = inc.responses.filter(function (x) { return x.k === st.response; })[0];
    return 'KPC OPS — ' + matchup(g) + ', ' + g.venue + '\n' + inc.title + '.\nUpdate: ' + r.label + '.\nOwner: ' + ownerName + '.';
  }

  function viewIncident(id) {
    var inc = INCIDENTS[id];
    if (!inc) return '<div class="view-head"><h2 class="h1" tabindex="-1" id="inc-h">Incident not found</h2></div><p><a href="#/board">Back to game board</a></p>';
    if (id === 'INC-204' && !state.flags.opened204) { state.flags.opened204 = true; save(); }
    var st = state.inc[id], g = GAME[inc.game], gs = gameState(g), wc = weatherClock(), mobile = isMobile();
    var locked = inc.kind === 'weather' ? st.status !== 'new' : st.status === 'resolved';

    var h = '<div class="inc' + (mobile ? ' inc-m' : '') + '">';
    h += '<header class="inc-head">';
    if (mobile) h += '<button type="button" class="sheet-close" data-act="close-sheet" id="sheet-close">' + icon('close') + '<span class="sr-only">Close incident</span></button>';
    else h += '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/board">' + icon('arrow-left') + 'Game board</a><span aria-hidden="true">/</span><span class="mono">' + id + '</span></nav>';
    h += '<div class="inc-eyebrow"><span class="mono">' + id + '</span> · ' + (inc.kind === 'weather' ? 'Weather' : 'Equipment') + ' · opened <span class="mono">' + fmt(inc.opened) + '</span></div>';
    h += '<h2 class="h1" id="inc-h" tabindex="-1">' + esc(inc.title) + '</h2>';
    h += '<div class="inc-chips">' + sevChip(inc.sev) + statusChip(st.status) + chip(gs.tone, gs.icon, gs.label, 'chip-state') + '</div>';
    if (!mobile) {
      h += '<div class="inc-switch" aria-label="Other incidents">';
      Object.keys(INCIDENTS).forEach(function (k) { if (k !== id) h += '<a class="link-sm" href="#/incident/' + k + '">' + icon('arrow-right') + k + ' · ' + esc(INCIDENTS[k].short) + '</a>'; });
      h += '</div>';
    }
    h += '</header>';

    /* Context column */
    var ctx = '<div class="inc-ctx">';
    if (inc.kind === 'weather') {
      ctx += '<section class="card" aria-labelledby="tl-h"><div class="card-h"><h3 class="h3" id="tl-h">Timeline · strike distance</h3><span class="tag">Sample data</span></div>' +
        '<div class="chart-wrap">' + strikeChartSVG() + '</div>' +
        '<div class="table-wrap"><table class="mini"><caption class="sr-only">Strikes near Ridgeline Field (sample)</caption><thead><tr><th scope="col">Time</th><th scope="col">Distance</th><th scope="col">Effect on 30-min clock</th></tr></thead><tbody>';
      var lastResume = null;
      wc.visible.slice().reverse().forEach(function (s) {
        var inside = s.d <= THRESHOLD;
        ctx += '<tr><td class="mono">' + fmt(s.t) + '</td><td class="mono">' + s.d.toFixed(1) + ' mi</td><td>' + (inside ? chip('red', 'bolt', 'Inside 8 mi · clock to ' + fmt(s.t + 30)) : chip('neutral', 'dot', 'Outside threshold · no reset')) + '</td></tr>';
      });
      ctx += '</tbody></table></div></section>';

      ctx += '<section class="card" aria-labelledby="ctx-h"><div class="card-h"><h3 class="h3" id="ctx-h">Context</h3><span class="tag">Sample · illustrative</span></div><div class="ctx-grid">' + '<div class="radar-wrap">' + radarSVG() + '</div>' +
        '<div class="policy"><h4 class="h4">Policy · lightning (sample conference policy)</h4><ul class="plist"><li>Suspend play when a strike is detected within <strong>8 miles</strong> of the venue.</li><li>Play may resume <strong>30 minutes</strong> after the last strike within 8 miles.</li><li>Each new strike within 8 miles <strong>restarts the 30-minute clock</strong>.</li><li>Referee and home game management jointly confirm resumption.</li></ul>' +
        '<div class="clockbox ' + (wc.expired ? 't-green-bg' : 't-amber-bg') + '" id="policy-clock">' + icon(wc.expired ? 'check' : 'clock') + '<div><span class="cb-l">' + (st.status === 'new' ? 'If delayed now' : 'Delay clock') + '</span><span class="cb-v mono">' + (wc.expired ? 'Expired at ' + fmt(wc.resumeAt) : 'Earliest resume ' + fmt(wc.resumeAt) + ' · ' + wc.remaining + ' min') + '</span><span class="cb-s">Last strike inside 8 mi: <span class="mono">' + (wc.last ? fmt(wc.last.t) + ', ' + wc.last.d + ' mi' : '—') + '</span></span></div></div></div></div></section>';
    } else {
      ctx += '<section class="card" aria-labelledby="tl-h"><div class="card-h"><h3 class="h3" id="tl-h">Timeline</h3><span class="tag">Sample data</span></div><ul class="evlist">' +
        '<li><span class="mono">' + fmt(772) + '</span>Main scoreboard game clock froze with 6:40 left in Q2.</li><li><span class="mono">' + fmt(774) + '</span>Side judge takes official time; PA announces time at stoppages.</li><li><span class="mono">' + fmt(820) + '</span>Technician on site; repair planned after the final.</li></ul></section>';
      ctx += '<section class="card" aria-labelledby="ctx-h"><div class="card-h"><h3 class="h3" id="ctx-h">Context</h3></div><div class="policy"><h4 class="h4">Policy · game clock (sample)</h4><ul class="plist"><li>When the stadium clock fails, the on-field official clock is authoritative.</li><li>Both teams are told the remaining time at every stoppage.</li></ul></div></section>';
    }

    // Affected game
    ctx += '<section class="card" aria-labelledby="ag-h"><div class="card-h"><h3 class="h3" id="ag-h">Affected game</h3><a class="link-sm" href="#/assignments/' + g.id + '">Crew' + icon('arrow-right') + '</a></div>' +
      '<dl class="kv"><div><dt>Matchup</dt><dd>' + esc(matchup(g)) + '</dd></div><div><dt>Venue</dt><dd>' + esc(g.venue) + '</dd></div><div><dt>Kickoff</dt><dd class="mono">' + fmt(g.kick) + '</dd></div>' +
      '<div><dt>State</dt><dd id="inc-game-state">' + stateCell(g) + '</dd></div><div><dt>Officials</dt><dd>' + crewCell(g) + '</dd></div><div><dt>Broadcast</dt><dd>' + bcCell(g) + '</dd></div></dl></section>';

    // Stakeholders
    ctx += '<section class="card" aria-labelledby="sh-h"><div class="card-h"><h3 class="h3" id="sh-h">Stakeholders</h3><span class="tag">Fictional people</span></div><ul class="people">';
    inc.stakeholders.forEach(function (p) { ctx += '<li><span class="p-name">' + esc(p.name) + '</span><span class="p-role">' + esc(p.role) + ' · ' + esc(p.org) + '</span></li>'; });
    ctx += '</ul></section></div>';

    /* Response column */
    var rs = '<div class="inc-resp"><section class="card card-resp" aria-labelledby="resp-h"><div class="card-h"><h3 class="h3" id="resp-h">Response</h3>' + (locked || st.status === 'monitoring' ? '<span class="tag">Recorded ' + fmt(st.ackAt) + '</span>' : '') + '</div>';
    rs += '<form id="resp-form" novalidate onsubmit="return false">';
    rs += '<fieldset class="fs"' + (locked ? ' disabled' : '') + '><legend class="lg"><span class="step mono">1</span>Response option</legend>';
    inc.responses.forEach(function (r) {
      var rid = 'r-' + id + '-' + r.k;
      rs += '<div class="radio' + (r.disabled ? ' is-disabled' : '') + (st.response === r.k ? ' is-on' : '') + '"><input type="radio" name="resp-' + id + '" id="' + rid + '" value="' + r.k + '" data-act="resp" data-inc="' + id + '"' + (st.response === r.k ? ' checked' : '') + (r.disabled ? ' disabled' : '') + ' aria-describedby="' + rid + '-h">' +
        '<label for="' + rid + '"><span class="r-l">' + esc(r.label) + (r.rec ? ' <span class="rec">Policy default</span>' : '') + (locked && st.response === r.k ? ' <span class="chosen">' + icon('check') + 'Chosen</span>' : '') + '</span><span class="r-h" id="' + rid + '-h">' + (r.disabled ? icon('lock') : '') + esc(r.help) + '</span></label></div>';
    });
    rs += '</fieldset>';

    rs += '<fieldset class="fs"' + (locked ? ' disabled' : '') + '><legend class="lg"><span class="step mono">2</span>Owner and notify list</legend>';
    rs += '<div class="field"><label for="owner-' + id + '">Owner</label><select id="owner-' + id + '" data-act="owner" data-inc="' + id + '"><option value="">Select an owner…</option>';
    inc.owners.forEach(function (o) { rs += '<option value="' + o.k + '"' + (st.owner === o.k ? ' selected' : '') + '>' + esc(o.label) + '</option>'; });
    rs += '</select></div>';
    rs += '<div class="notify" role="group" aria-labelledby="nt-' + id + '"><span class="flabel" id="nt-' + id + '">Notify</span>';
    inc.notify.forEach(function (n) {
      var nid = 'n-' + id + '-' + n.k;
      rs += '<div class="check"><input type="checkbox" id="' + nid + '" data-act="notify" data-inc="' + id + '" value="' + n.k + '"' + (st.notify.indexOf(n.k) > -1 ? ' checked' : '') + '><label for="' + nid + '"><span>' + esc(n.label) + (n.rec ? ' <span class="rec">Recommended</span>' : '') + '</span><span class="n-who">' + esc(n.who) + '</span></label></div>';
    });
    rs += '</div>';
    rs += '<div class="preview"><div class="pv-h"><span class="flabel">Message preview</span><span class="notsent">' + icon('lock') + 'Not sent — demo</span></div><pre class="pv mono" id="pv-' + id + '">' + esc(messagePreview(id)) + '</pre><p class="pv-to">' + (st.notify.length ? 'Would go to: ' + esc(inc.notify.filter(function (n) { return st.notify.indexOf(n.k) > -1; }).map(function (n) { return n.who; }).join(', ')) : 'No recipients selected.') + '</p></div>';
    rs += '</fieldset></form>';

    var na = nextAction(id);
    var bar = '<div class="' + (mobile ? 'actionbar-m' : 'actionbar') + '" id="actionbar"><p class="ab-note" id="ab-note">' + esc(na.note) + '</p><button type="button" class="btn btn-primary btn-lg" id="primary-action" data-act="primary" data-inc="' + id + '" data-next="' + na.k + '" aria-describedby="ab-note">' + esc(na.label) + '</button></div>';
    if (!mobile) rs += bar;
    rs += '</section>';

    rs += '<section class="card" aria-labelledby="au-h"><div class="card-h"><h3 class="h3" id="au-h">Audit history</h3><span class="tag">' + state.audit.filter(function (a) { return a.ref === id; }).length + ' entries</span></div>' + auditList(state.audit.filter(function (a) { return a.ref === id; }), 'audit-' + id) + '</section></div>';

    if (mobile) {
      var summary = '';
      if (inc.kind === 'weather') summary = '<section class="card situ" aria-label="Situation summary"><div class="clockbox ' + (wc.expired ? 't-green-bg' : 't-amber-bg') + '">' + icon(wc.expired ? 'check' : 'bolt') + '<div><span class="cb-l">Last strike inside 8 mi</span><span class="cb-v mono">' + (wc.last ? fmt(wc.last.t) + ' · ' + wc.last.d + ' mi' : '—') + '</span><span class="cb-s">Policy: 30-min clock, restarts on each strike inside 8 mi. ' + (wc.expired ? 'Clock expired ' + fmt(wc.resumeAt) + '.' : 'Earliest resume <span class="mono">' + fmt(wc.resumeAt) + '</span> · ' + wc.remaining + ' min.') + '</span></div></div><p class="situ-game">' + esc(matchup(g)) + ' · ' + esc(g.venue) + '</p></section>';
      h += '<div class="inc-body">' + summary + rs + ctx + '</div>' + bar;
    }
    else h += '<div class="inc-grid">' + ctx + rs + '</div>';
    return h + '</div>';
  }

  /* ------------------------------------------------------------------ */
  /* 7. Chrome: status bar, nav, tabbar, guide                           */
  /* ------------------------------------------------------------------ */
  function statusbarHTML() {
    var items = queueItems(), need = items.filter(function (i) { return i.status === 'new'; }).length, crit = items.filter(function (i) { return i.status === 'new' && i.sev === 'critical'; }).length;
    return '<div class="sb-brand"><span class="mark" aria-hidden="true"><svg viewBox="0 0 20 20" width="20" height="20"><rect x="1" y="1" width="18" height="18" rx="4" fill="none" stroke="#D5A84B" stroke-width="1.6"/><path d="M5 13h3V7h4v6h3" fill="none" stroke="#E8EDF2" stroke-width="1.6" stroke-linejoin="round"/></svg></span><span class="sb-name">Conference OS</span><span class="sb-conf">' + CONF.name + ' · ' + CONF.week + '</span></div>' +
      '<div class="sb-alerts" aria-label="Queue summary">' + (crit ? chip('red', 'critical', crit + ' critical') : '') + (need ? chip('amber', 'warn', need + ' need action') : chip('green', 'check', 'Queue clear')) + '</div>' +
      '<div class="sb-clock"><span class="sb-cl"><span class="lg-only">Sample time</span><span class="sm-only">Sample</span></span><span class="sb-time mono" id="sample-time">' + fmt(state.clock) + '</span><button type="button" class="btn btn-sm btn-outline" id="advance" data-act="advance">' + '<span class="lg-only">' + icon('forward') + 'Advance </span><span class="sm-only" aria-hidden="true">+</span>15 min</button></div>' +
      '<div class="sb-user"><span class="avatar" aria-hidden="true">PR</span><span class="sb-u"><span>' + ME + '</span><span class="sb-role">' + ME_ROLE + '</span></span></div>';
  }

  function currentIncidentLink() {
    var open = queueItems().filter(function (i) { return i.id.indexOf('INC') === 0 && i.status !== 'resolved'; });
    return '#/incident/' + (open.length ? open[0].id : 'INC-204');
  }

  function navHTML(route) {
    var items = queueItems();
    var incOpen = items.filter(function (i) { return i.id.indexOf('INC') === 0 && i.status !== 'resolved'; }).length;
    var conflicts = allConflicts().length;
    function link(href, key, ic, label, badge) {
      var cur = route.view === key;
      return '<li><a href="' + href + '" class="nv' + (cur ? ' is-current' : '') + '"' + (cur ? ' aria-current="page"' : '') + '>' + icon(ic) + '<span>' + label + '</span>' + (badge ? '<span class="nv-b mono">' + badge.split(' ')[0] + '<span class="sr-only"> ' + badge.split(' ').slice(1).join(' ') + '</span></span>' : '') + '</a></li>';
    }
    return '<ul class="nv-list">' + link('#/board', 'board', 'grid', 'Game board') + link('#/assignments', 'assignments', 'users', 'Assignments', conflicts ? conflicts + ' conflict' : '') +
      link(currentIncidentLink(), 'incident', 'bolt', 'Incidents', incOpen ? incOpen + ' open' : '') + '</ul>' +
      '<p class="nv-sec">Not in demo</p><ul class="nv-list nv-off"><li><span class="nv" aria-disabled="true">' + icon('lock') + '<span>Schedules</span><span class="nv-note">not in demo</span></span></li><li><span class="nv" aria-disabled="true">' + icon('lock') + '<span>Reports</span><span class="nv-note">not in demo</span></span></li></ul>';
  }

  function tabbarHTML(route) {
    var need = queueItems().filter(function (i) { return i.status === 'new'; }).length;
    function t(href, key, ic, label, badge) {
      var cur = route.view === key || (key === 'inbox' && route.view === 'incident');
      return '<a href="' + href + '" class="tb' + (cur ? ' is-current' : '') + '"' + (cur ? ' aria-current="page"' : '') + '>' + icon(ic) + '<span>' + label + '</span>' + (badge ? '<span class="tb-b mono">' + badge + '<span class="sr-only"> need action</span></span>' : '') + '</a>';
    }
    return t('#/inbox', 'inbox', 'inbox', 'Inbox', need) + t('#/board', 'board', 'grid', 'Games') + t('#/assignments', 'assignments', 'users', 'Assignments');
  }

  function guideSteps() {
    var i = state.inc['INC-204'];
    return [
      { label: 'Open INC-204 from the exception queue', done: state.flags.opened204, href: '#/incident/INC-204' },
      { label: 'Inspect the strike timeline and policy, then choose a response', done: !!i.response || i.status !== 'new', href: '#/incident/INC-204' },
      { label: 'Assign an owner and pick who to notify (preview only)', done: (!!i.owner && i.notify.length > 0) || i.status !== 'new', href: '#/incident/INC-204' },
      { label: 'Acknowledge the response', done: i.status !== 'new', href: '#/incident/INC-204' },
      { label: 'See the board row change to “Delayed · weather”', done: state.flags.seenDelayedBoard, href: isMobile() ? '#/inbox' : '#/board' },
      { label: 'Resolve the double-booked official in Assignments (6/7 → 7/7)', done: allConflicts().length === 0, href: '#/assignments/G4' }
    ];
  }
  function guideHTML() {
    if (!state.guided) return '<div class="g-idle"><p class="g-t">Guided scenario</p><p>Lightning within 8 miles at <strong>Harlow State vs. Brightwater (sample)</strong>, then a double-booked official. About two minutes; every step is keyboard-accessible.</p></div>';
    var steps = guideSteps(), firstOpen = -1;
    steps.forEach(function (s, i) { if (!s.done && firstOpen < 0) firstOpen = i; });
    var h = '<p class="g-t">Guided scenario ' + (firstOpen < 0 ? '· complete' : '· step ' + (firstOpen + 1) + ' of ' + steps.length) + '</p><ol class="g-steps">';
    steps.forEach(function (s, i) {
      h += '<li class="' + (s.done ? 'done' : i === firstOpen ? 'cur' : '') + '">' + icon(s.done ? 'check' : i === firstOpen ? 'arrow-right' : 'dot') + '<span>' + esc(s.label) + (s.done ? '<span class="sr-only"> (done)</span>' : '') + '</span>' + (i === firstOpen ? '<a class="g-go" href="' + s.href + '">Go</a>' : '') + '</li>';
    });
    h += '</ol>';
    if (firstOpen < 0) h += '<p class="g-done">Done. Try “Advance 15 min” to watch a new strike reset the delay clock, then resume play.</p>';
    return h;
  }

  /* ------------------------------------------------------------------ */
  /* 8. Router + render                                                  */
  /* ------------------------------------------------------------------ */
  function parseRoute() {
    var parts = (location.hash || '').replace(/^#\/?/, '').split('/');
    var view = parts[0] || '';
    if (['board', 'assignments', 'incident', 'inbox'].indexOf(view) < 0) view = isMobile() ? 'inbox' : 'board';
    if (view === 'inbox' && !isMobile()) view = 'board';
    return { view: view, param: parts[1] || '' };
  }

  var els = {};
  var lastRouteKey = null;
  var sheetReturnFocus = null;

  function render(opts) {
    opts = opts || {};
    var route = parseRoute(), mobile = isMobile();
    var active = document.activeElement, activeId = active && active.id && active !== document.body ? active.id : null;
    var routeKey = route.view + '/' + route.param + '/' + mobile;
    var routeChanged = routeKey !== lastRouteKey;

    els.statusbar.innerHTML = statusbarHTML();
    els.sidenav.innerHTML = navHTML(route);
    els.tabbar.innerHTML = tabbarHTML(route);
    els.guide.innerHTML = guideHTML();
    els.app.setAttribute('data-view', route.view);

    var sheetOpen = false;
    if (route.view === 'incident') {
      if (mobile) {
        els.view.innerHTML = viewInbox();
        els.sheet.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="inc-h">' + viewIncident(route.param) + '</div>';
        sheetOpen = true;
      } else {
        els.view.innerHTML = viewIncident(route.param);
      }
    } else if (route.view === 'assignments') {
      if (!route.param || !GAME[route.param]) {
        var c0 = allConflicts(); route.param = c0.length ? c0[0].gid : 'G1';
        try { history.replaceState(null, '', '#/assignments/' + route.param); } catch (e) { /* ignore */ }
        routeKey = route.view + '/' + route.param + '/' + mobile;
      }
      els.view.innerHTML = viewAssignments(route.param);
    } else if (route.view === 'inbox') {
      els.view.innerHTML = viewInbox();
    } else {
      els.view.innerHTML = viewBoard();
    }
    if (!sheetOpen) els.sheet.innerHTML = '';
    els.sheet.hidden = !sheetOpen;
    [els.app, els.explainer, els.honesty, els.footer].forEach(function (el) { if (sheetOpen) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
    document.body.classList.toggle('sheet-open', sheetOpen);

    // clear "fresh" flags after they have been painted once
    state.audit.forEach(function (a) { if (a.fresh) a._paint = (a._paint || 0) + 1; if (a._paint > 1) { delete a.fresh; delete a._paint; } });

    // Focus management
    lastRouteKey = routeKey;
    if (opts.focus) {
      var f = document.getElementById(opts.focus); if (f) { f.focus({ preventScroll: false }); return; }
    }
    if (routeChanged && !opts.initial) {
      if (sheetOpen) { var hh = document.getElementById('inc-h'); if (hh) hh.focus(); }
      else if (opts.returnFocus && document.getElementById(opts.returnFocus)) document.getElementById(opts.returnFocus).focus();
      else { var heading = els.view.querySelector('h2[tabindex="-1"]'); if (heading) heading.focus({ preventScroll: true }); window.scrollTo({ top: Math.max(0, els.app.getBoundingClientRect().top + window.scrollY - 8), behavior: 'auto' }); }
    } else if (activeId) {
      var again = document.getElementById(activeId); if (again && again !== document.activeElement) again.focus({ preventScroll: true });
    }
  }

  function announce(msg) { els.announce.textContent = ''; setTimeout(function () { els.announce.textContent = msg; }, 30); }

  /* ------------------------------------------------------------------ */
  /* 9. Actions                                                          */
  /* ------------------------------------------------------------------ */
  function advance() {
    var before = state.clock;
    state.clock += 15;
    var i = state.inc['INC-204'];
    if (i.status !== 'resolved') {
      STRIKES.forEach(function (s) {
        if (s.t > before && s.t <= state.clock) {
          state.seq++;
          var inside = s.d <= THRESHOLD;
          state.audit.push({ t: s.t, seq: state.seq, fresh: true, ref: 'INC-204', actor: 'System · sample strike feed', text: 'Strike ' + s.d + ' mi' + (inside ? ' — inside 8 mi threshold. 30-minute clock restarts: earliest resume ' + fmt(s.t + 30) + '.' : ' — outside threshold, clock unchanged.') });
        }
      });
      var wc = weatherClock();
      if (i.status === 'monitoring' && wc.expired && !i.expiredLogged) {
        i.expiredLogged = true; state.seq++;
        state.audit.push({ t: wc.resumeAt, seq: state.seq, fresh: true, ref: 'INC-204', actor: 'System · delay clock', text: '30-minute clock expired with no strike inside 8 mi. Ready to resume on crew chief confirmation.' });
      }
    }
    save();
    announce('Sample time advanced to ' + fmt(state.clock) + '.');
  }

  function acknowledge(id) {
    var inc = INCIDENTS[id], st = state.inc[id], g = GAME[inc.game];
    var r = inc.responses.filter(function (x) { return x.k === st.response; })[0];
    var owner = inc.owners.filter(function (o) { return o.k === st.owner; })[0];
    var who = inc.notify.filter(function (n) { return st.notify.indexOf(n.k) > -1; }).map(function (n) { return n.label + ' (' + n.who + ')'; });
    if (inc.kind === 'weather') {
      var wc = weatherClock();
      st.status = 'monitoring'; st.ackAt = state.clock; st.ackResponse = st.response;
      state.delay[g.id] = { start: state.clock, inc: id };
      log(id, 'Acknowledged INC-204. Response: ' + r.label + '.');
      log(id, 'Owner assigned: ' + owner.label + '.');
      log(id, 'Notification prepared for ' + who.length + ' recipient' + (who.length > 1 ? 's' : '') + ': ' + who.join('; ') + '. Not sent — demo.');
      log(id, 'Game board: ' + matchup(g) + ' set to “Delayed · weather”. Earliest resume ' + fmt(wc.resumeAt) + '. Queue item moved to Monitoring.', 'System');
      save();
      announce('Weather delay issued. ' + matchup(g) + ' is now Delayed, weather. Earliest resume ' + fmt(wc.resumeAt) + '. INC-204 moved to Monitoring.');
    } else {
      st.ackAt = state.clock; st.ackResponse = st.response;
      log(id, 'Update recorded. Response: ' + r.label + '. Owner: ' + owner.label + '.');
      log(id, 'Notification prepared for ' + who.length + ' recipient(s). Not sent — demo.');
      if (st.response === 'close') { st.status = 'resolved'; st.resolvedAt = state.clock; log(id, id + ' closed.', 'System'); }
      else st.status = 'monitoring';
      save();
      announce(id + ' updated' + (st.status === 'resolved' ? ' and closed.' : '.'));
    }
  }

  function resumePlay(id) {
    var inc = INCIDENTS[id], st = state.inc[id], g = GAME[inc.game], d = state.delay[g.id];
    if (d) { state.paused[g.id] = (state.paused[g.id] || 0) + (state.clock - d.start); delete state.delay[g.id]; }
    st.status = 'resolved'; st.resolvedAt = state.clock;
    log(id, 'Play resumed at ' + matchup(g) + ' after ' + dur(state.clock - d.start) + ' delay. Confirmed with crew chief Luis Carrera. INC-204 resolved.');
    save();
    announce('Play resumed. INC-204 resolved.');
  }

  function doReset(guided) {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
    var open = state.explainerOpen;
    state = initialState();
    state.explainerOpen = open;
    state.guided = !!guided;
    save();
  }

  function onClick(e) {
    var t = e.target.closest('[data-act], #guide-start, #reset-demo, #ex-toggle, [data-filter]');
    if (!t) return;
    if (t.id === 'ex-toggle') {
      state.explainerOpen = !state.explainerOpen; save(); applyExplainer(); return;
    }
    if (t.id === 'reset-demo') {
      doReset(false); announce('Demo reset to the initial sample state.');
      var target = isMobile() ? '#/inbox' : '#/board';
      if (location.hash !== target) { lastRouteKey = null; location.hash = target; } else render();
      return;
    }
    if (t.id === 'guide-start') {
      doReset(true); state.explainerOpen = true; save(); applyExplainer();
      announce('Guided scenario started. Step 1: open INC-204 from the exception queue.');
      var dest = isMobile() ? '#/inbox' : '#/board';
      var go = function () { render({ focus: 'q-INC-204' }); var q = document.getElementById('q-INC-204'); if (q) q.scrollIntoView({ block: 'center' }); };
      if (location.hash !== dest) { pendingFocus = 'q-INC-204'; location.hash = dest; } else go();
      return;
    }
    if (t.hasAttribute('data-filter')) {
      state.filter = t.getAttribute('data-filter'); save(); render({ focus: t.id }); return;
    }
    var act = t.getAttribute('data-act');
    if (act === 'advance') { advance(); render({ focus: 'advance' }); }
    else if (act === 'log-bc') {
      var gid = t.getAttribute('data-game'); state.bc[gid] = 5;
      log('BRD-311', 'Logged “Replay booth comms check” complete for ' + matchup(GAME[gid]) + '. Broadcast checklist 5/5. BRD-311 resolved.');
      save(); announce('Broadcast checklist complete for ' + matchup(GAME[gid]) + '. BRD-311 resolved.');
      render({ focus: 'queue-h' });
    }
    else if (act === 'close-sheet') { closeSheet(); }
    else if (act === 'primary') {
      var id = t.getAttribute('data-inc'), nx = t.getAttribute('data-next');
      if (nx === 'focus-response') { var r = document.querySelector('input[data-act="resp"]:checked') || document.querySelector('input[data-act="resp"]:not([disabled])'); if (r) { r.focus(); r.scrollIntoView({ block: 'center' }); } }
      else if (nx === 'focus-owner') { var o = document.getElementById('owner-' + id); o.focus(); o.scrollIntoView({ block: 'center' }); }
      else if (nx === 'focus-notify') { var c = document.querySelector('input[data-act="notify"]'); c.focus(); c.scrollIntoView({ block: 'center' }); }
      else if (nx === 'ack') { acknowledge(id); render({ focus: 'primary-action' }); }
      else if (nx === 'advance') { advance(); render({ focus: 'primary-action' }); }
      else if (nx === 'resume') { resumePlay(id); render({ focus: 'primary-action' }); }
      else if (nx === 'back') { location.hash = isMobile() ? '#/inbox' : '#/board'; }
    }
  }

  var pendingFocus = null;

  function onChange(e) {
    var t = e.target, act = t.getAttribute('data-act');
    if (!act) return;
    if (act === 'resp' || act === 'owner' || act === 'notify') {
      var id = t.getAttribute('data-inc'), st = state.inc[id];
      if (act === 'resp') st.response = t.value;
      if (act === 'owner') st.owner = t.value;
      if (act === 'notify') {
        var i = st.notify.indexOf(t.value);
        if (t.checked && i < 0) st.notify.push(t.value); if (!t.checked && i > -1) st.notify.splice(i, 1);
      }
      save(); render({ focus: t.id });
    } else if (act === 'reassign') {
      if (!t.value) return;
      var gid = t.getAttribute('data-game'), pos = t.getAttribute('data-pos'), g = GAME[gid];
      var prev = state.asg[gid][pos].name, name = t.value;
      var clash = slotsFor(name).filter(function (o) { return Math.abs(o.game.kick - g.kick) < 240; });
      var before = crewReady(gid);
      state.asg[gid][pos] = { name: name, conf: clash.length === 0 };
      var after = crewReady(gid);
      log('ASSIGN', posName(pos) + ' for ' + matchup(g) + ': ' + prev + ' → ' + name + '.' + (clash.length ? ' Creates a conflict with ' + clash[0].game.home + ' ' + fmt(clash[0].game.kick) + '.' : '') + ' Crew readiness ' + before + '/7 → ' + after + '/7. Official not contacted — demo.');
      if (allConflicts().length === 0 && before < 7 && after === 7) log('ASN-118', 'All crew conflicts cleared. ASN-118 resolved.', 'System');
      save();
      announce(posName(pos) + ' reassigned to ' + name + '. ' + matchup(g) + ' crew ' + after + ' of 7.');
      render({ focus: 'sel-' + gid + '-' + pos });
    } else if (act === 'asg-game') {
      location.hash = '#/assignments/' + t.value;
    }
  }

  function closeSheet() {
    var route = parseRoute();
    var ret = route.param ? 'q-' + route.param : null;
    lastRouteKey = null;
    pendingReturn = ret;
    location.hash = '#/inbox';
  }
  var pendingReturn = null;

  function onKey(e) {
    if (e.key === 'Escape' && !els.sheet.hidden) { e.preventDefault(); closeSheet(); return; }
    // Arrow keys in the filter toolbar (roving tabindex)
    var f = e.target.closest && e.target.closest('#filters');
    if (f && (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Home' || e.key === 'End')) {
      var btns = Array.prototype.slice.call(f.querySelectorAll('.fbtn')), i = btns.indexOf(e.target);
      if (i < 0) return;
      e.preventDefault();
      var n = e.key === 'ArrowRight' ? (i + 1) % btns.length : e.key === 'ArrowLeft' ? (i - 1 + btns.length) % btns.length : e.key === 'Home' ? 0 : btns.length - 1;
      btns[n].click();
    }
  }

  function applyExplainer() {
    var open = state.explainerOpen;
    els.explainer.classList.toggle('is-collapsed', !open);
    var b = document.getElementById('ex-toggle');
    b.setAttribute('aria-expanded', String(open));
    b.querySelector('.ex-toggle-label').textContent = open ? 'Hide' : 'Show';
    document.getElementById('ex-body').hidden = !open;
  }

  /* ------------------------------------------------------------------ */
  /* 10. Boot                                                            */
  /* ------------------------------------------------------------------ */
  function boot() {
    els = {
      app: document.getElementById('app'), statusbar: document.getElementById('statusbar'), sidenav: document.getElementById('sidenav'),
      view: document.getElementById('view'), tabbar: document.getElementById('tabbar'), sheet: document.getElementById('sheet-host'),
      guide: document.getElementById('guide'), announce: document.getElementById('announce'), explainer: document.getElementById('explainer'),
      honesty: document.getElementById('honesty'), footer: document.querySelector('.site-foot')
    };
    // Explainer starts collapsed on small screens unless the guide is running
    try { if (isMobile() && !localStorage.getItem(STORE_KEY)) state.explainerOpen = false; } catch (e) { /* ignore */ }
    applyExplainer();
    document.addEventListener('click', onClick);
    document.addEventListener('change', onChange);
    document.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', function () {
      var f = pendingFocus, r = pendingReturn; pendingFocus = null; pendingReturn = null;
      render({ focus: f, returnFocus: r });
    });
    var onMq = function () { lastRouteKey = null; render({ initial: true }); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else mq.addListener(onMq);
    render({ initial: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
