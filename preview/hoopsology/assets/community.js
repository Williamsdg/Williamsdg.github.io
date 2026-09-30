/* Locker Room preview — a Discord-style community hub.
 * Channels, an auto-populated episode forum, subscriber-locked channels, replies, reactions,
 * polls and a member list. Sample posts come from fictional fans (the page says so); anything
 * the visitor posts is kept in localStorage. Phase 2 = Supabase threads/posts in schema.sql. */
(function () {
  const U = HS.ui, I = U.I, esc = U.esc;
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const K = { me: 'hs_lr_me', posts: 'hs_lr_posts2', rx: 'hs_lr_rx2', poll: 'hs_lr_poll', read: 'hs_lr_read', cats: 'hs_lr_cats', notice: 'hs_lr_notice' };
  const COLORS = ['#b8323f', '#c25a12', '#1f7a9b', '#6a4fc0', '#2d8a57', '#a07a12', '#b03a6a', '#3a6fb0'];
  const colorOf = (h) => COLORS[[...h].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
  const TEAMS = ['No team yet', 'Hawks', 'Celtics', 'Nets', 'Hornets', 'Bulls', 'Cavaliers', 'Mavericks', 'Nuggets', 'Pistons', 'Warriors', 'Rockets', 'Pacers', 'Clippers', 'Lakers', 'Grizzlies', 'Heat', 'Bucks', 'Timberwolves', 'Pelicans', 'Knicks', 'Thunder', 'Magic', '76ers', 'Suns', 'Trail Blazers', 'Kings', 'Spurs', 'Raptors', 'Jazz', 'Wizards',
    'Aces', 'Dream', 'Fever', 'Liberty', 'Lynx', 'Mercury', 'Mystics', 'Sky', 'Sparks', 'Storm', 'Sun', 'Tempo', 'Valkyries', 'Wings'];
  const EMOJI = ['🏀', '🔥', '🧪', '😤', '😂', '🙌', '👀', '💯', '🐐', '📈', '🎙', '⬆️'];

  const ico = {
    hash: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.9 3.2a1 1 0 0 0-1.97-.35L8.3 6H5a1 1 0 0 0 0 2h2.95l-.8 4.5H4a1 1 0 1 0 0 2h2.8l-.64 3.63a1 1 0 0 0 1.97.35L8.83 14.5h4.47l-.64 3.63a1 1 0 0 0 1.97.35l.7-3.98H19a1 1 0 1 0 0-2h-3.3l.8-4.5H20a1 1 0 1 0 0-2h-3.15l.64-3.65a1 1 0 0 0-1.97-.35L14.82 6h-4.47zM10 8h4.47l-.8 4.5H9.2z"/></svg>',
    megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 8a5 5 0 0 1 0 8M18 5a9 9 0 0 1 0 14"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>',
    forum: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M7 8h10M7 12h6"/></svg>',
    live: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 8a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM4 19c0-3.3 3.1-6 7-6s7 2.7 7 6v1H4zM19.5 13.2A5.5 5.5 0 0 1 22 18v1h-2.5v-1a7.6 7.6 0 0 0-2.1-5.1 4.6 4.6 0 0 1 2.1.3zM16.5 4.5a3.5 3.5 0 0 1 0 7 5.4 5.4 0 0 0 0-7z"/></svg>',
    reply: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    msgs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/></svg>',
  };

  /* ───────── fictional fans + sample conversation (topics from real episodes) ───────── */
  const USERS = {
    hoopsology: { role: 'bot', status: 'online' },
    courtvision_kay: { team: 'Celtics', role: 'sub', status: 'online' },
    ripcity_rae: { team: 'Trail Blazers', role: 'member', status: 'online' },
    nuggetsnate: { team: 'Nuggets', role: 'sub', status: 'online' },
    stretch_four: { team: 'Knicks', role: 'member', status: 'idle' },
    lynxlaura: { team: 'Lynx', role: 'sub', status: 'online' },
    baseline_ben: { team: 'Hornets', role: 'member', status: 'online' },
    dubnation_dee: { team: 'Warriors', role: 'member', status: 'idle' },
    aces_ally: { team: 'Aces', role: 'member', status: 'online' },
    bayarea_bri: { team: 'Valkyries', role: 'sub', status: 'online' },
    tempo_tess: { team: 'Tempo', role: 'sub', status: 'off' },
    fever_fan_mo: { team: 'Fever', role: 'member', status: 'off' },
  };
  const ago = (m) => new Date(Date.now() - m * 60000).toISOString();
  const M = (id, who, min, text, extra = {}) => ({ id, who, at: ago(min), text, rx: {}, ...extra });
  const SAMPLE = {
    'the-lab': [
      M('l1', 'courtvision_kay', 185, 'That Clippers breakdown on ITL was wild. Five first-round picks, 2029 through 2033. That is an entire era with no firsts.', { rx: { '🔥': 14, '😤': 3 } }),
      M('l2', 'courtvision_kay', 184, 'and the Kawhi line 😭'),
      M('l3', 'ripcity_rae', 172, 'The question at the end got me: which other front offices are cleaning their books right now? 👀', { reply: 'l1', rx: { '👀': 9 } }),
      M('l4', 'nuggetsnate', 150, 'Meanwhile Jokić saying "if they want me" like there is any universe where Denver says no 😂', { rx: { '😂': 21, '🏀': 4 } }),
      M('l5', 'stretch_four', 95, '@nuggetsnate business is business lol. Bigger story is Adelman naming the "bad 10 days" out loud. Most honest thing said at media day.', { reply: 'l4', rx: { '🔥': 6 } }),
      M('l6', 'nuggetsnate', 93, '@stretch_four fair. Rebounding and transition D, he knows exactly what went wrong'),
      M('l7', 'lynxlaura', 40, 'Can we get a full episode on Olivia Miles please. A rookie judged on veteran benchmarks and beating them??', { rx: { '🙌': 11 } }),
      M('l8', 'baseline_ben', 12, 'Just found the show through the Travis Demers interview. Hearing how a radio voice preps for a game was so good.', { rx: { '🧪': 5 } }),
      M('l9', 'baseline_ben', 11, 'what episode should I watch next?'),
      M('l10', 'ripcity_rae', 9, '@baseline_ben start with the Lynx one with Cassidy Hettesheimer, then the Toronto Tempo episode', { reply: 'l9', rx: { '🙌': 3 } }),
    ],
    nba: [
      M('n1', 'dubnation_dee', 240, 'Steph: 2 years, $116M. Loyalty move or a real push in the West? I say both.', { rx: { '🏀': 8 } }),
      M('n2', 'courtvision_kay', 230, 'Both. He is not leaving the Bay and everyone knows it.', { reply: 'n1' }),
      M('n3', 'stretch_four', 130, 'Everyone is sleeping on what DeRozan brings to that Denver bench.'),
      M('n4', 'courtvision_kay', 60, 'Kawhi back in Toronto while all of this lands is the most Kawhi thing ever.', { rx: { '😂': 12 } }),
      M('n5', 'dubnation_dee', 25, 'lmaooo'),
    ],
    wnba: [
      M('w1', 'lynxlaura', 300, 'Lynx are the favorite and I am not being humble about it.', { rx: { '🔥': 7 } }),
      M('w2', 'aces_ally', 262, "A healthy Caitlin Clark vs A'ja in round one is appointment TV. Still taking the Aces.", { rx: { '🏀': 10 } }),
      M('w3', 'aces_ally', 261, '', { poll: { q: 'Who wins the 2026 WNBA title?', opts: { Lynx: 41, Aces: 33, Fever: 26, Liberty: 18, 'Someone else': 7 } } }),
      M('w4', 'bayarea_bri', 200, 'The ITL comparison of the Valkyries defense to the mid-2000s Pistons is the nicest thing anyone has ever said about us.', { rx: { '🙌': 9 } }),
      M('w5', 'tempo_tess', 90, "The Savanna Hamilton episode on Toronto's first season got me emotional. Marina Mabrey's 53-point night!!", { rx: { '🔥': 13 } }),
    ],
    'game-night': [
      M('g1', 'hoopsology', 8, '🔴 **Game night is live.** Keep it civil and no spoilers in thread titles.'),
      M('g2', 'aces_ally', 6, "LET'S GOOO", { rx: { '🏀': 6 } }),
      M('g3', 'fever_fan_mo', 5, 'that is a foul every day of the week'),
      M('g4', 'lynxlaura', 4, 'closeout was a half-second late every single time'),
      M('g5', 'courtvision_kay', 3, 'somebody clip that possession for the show 🧪', { rx: { '🧪': 7 } }),
      M('g6', 'bayarea_bri', 1, 'timeout. breathe, everyone.', { rx: { '😂': 4 } }),
    ],
    'film-room': [
      M('f1', 'hoopsology', 50, '🎬 **Members:** the bonus breakdown drops Friday.'),
      M('f2', 'nuggetsnate', 30, 'Any chance the full uncut Jokić media day segment goes up in here?'),
      M('f3', 'lynxlaura', 10, 'Voting on next week\'s guest is open 👇', { poll: { q: 'Who should the show book next?', opts: { 'A beat writer': 12, 'A former player': 19, 'A broadcaster': 8 } } }),
    ],
    'ask-the-hosts': [
      M('a1', 'baseline_ben', 60, 'Q for the crew: who replaces Engelbert, and would Sue Bird even want the job?', { rx: { '⬆️': 31 } }),
      M('a2', 'ripcity_rae', 40, 'Q: is Portland really a one-sport city or is that a Blazers-radio thing?', { rx: { '⬆️': 18 } }),
    ],
  };
  const THREAD_REPLIES = [
    [M('t1', 'stretch_four', 55, "The RICO angle was the part I hadn't heard anywhere else.", { rx: { '🔥': 4 } }), M('t2', 'courtvision_kay', 20, 'Engelbert segment starts right after the Clippers breakdown for anyone looking.', { rx: { '🙌': 6 } })],
    [M('t3', 'nuggetsnate', 70, 'Rebounding + transition D. He knows exactly what went wrong.', { rx: { '🏀': 3 } })],
    [M('t4', 'nuggetsnate', 80, 'He is signing. Calm down, everyone 😂', { rx: { '😂': 7 } })],
  ];

  const CATS = [
    { id: 'info', name: 'Start here', chans: [
      { id: 'welcome', ico: 'book', topic: 'House rules and how the Locker Room works.', ro: true },
      { id: 'announcements', ico: 'megaphone', topic: 'New episodes and Shorts, posted automatically.', ro: true },
    ] },
    { id: 'lab', name: 'The Lab', chans: [
      { id: 'the-lab', ico: 'hash', topic: 'Main room. Talk the latest episodes and anything hoops.' },
      { id: 'nba', ico: 'hash', topic: 'NBA news, trades and takes.' },
      { id: 'wnba', ico: 'hash', topic: 'WNBA news, playoffs and takes.' },
      { id: 'game-night', ico: 'live', topic: 'Opens live during the big NBA and WNBA games.', live: true },
    ] },
    { id: 'eps', name: 'Episodes', chans: [
      { id: 'episode-talk', ico: 'forum', topic: 'Every new episode gets its own thread automatically.', forum: true },
    ] },
    { id: 'subs', name: 'Subscribers', chans: [
      { id: 'film-room', ico: 'hash', topic: 'Bonus breakdowns, uncut segments, guest votes.', locked: true },
      { id: 'ask-the-hosts', ico: 'hash', topic: 'Submit questions and vote them up. The best make the show.', locked: true },
    ] },
  ];
  const CHANS = CATS.flatMap((c) => c.chans);
  const UNREAD0 = { announcements: 1, nba: 2, 'game-night': 3 };

  let me = LS.get(K.me, null), posts = LS.get(K.posts, {}), myRx = LS.get(K.rx, {}), read = LS.get(K.read, {}), collapsed = LS.get(K.cats, {});
  let vd = { episodes: [], shorts: [] }, cur = null, thread = null, replyTo = null, unlocked = false, forumTag = 'all', q = '';

  /* ───────── helpers ───────── */
  const userOf = (h) => USERS[h] || (me && h === me.handle ? { team: me.team, role: 'you', status: 'online' } : { role: 'member', status: 'online' });
  const roleCls = (h) => ({ sub: 'r-sub', bot: 'r-bot', you: 'r-you' }[userOf(h).role] || '');
  const avatar = (h, cls = '', status = false) => h === 'hoopsology'
    ? `<div class="av bot ${cls}">${status ? '<i class="st"></i>' : ''}</div>`
    : `<div class="av ${cls}" style="background:${colorOf(h)}">${esc(h[0].toUpperCase())}${status ? `<i class="st ${userOf(h).status === 'online' ? '' : userOf(h).status}"></i>` : ''}</div>`;
  const hm = (d) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  function stamp(iso) {
    const d = new Date(iso), t = new Date(), y = new Date(Date.now() - 864e5);
    if (d.toDateString() === t.toDateString()) return 'Today at ' + hm(d);
    if (d.toDateString() === y.toDateString()) return 'Yesterday at ' + hm(d);
    return d.toLocaleDateString('en-US') + ' ' + hm(d);
  }
  const dayLabel = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const fmt = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|\s)@([A-Za-z0-9_]{3,20})/g, (m0, s, h) => `${s}<span class="mention" data-user="${h}">@${h}</span>`).replace(/\n/g, '<br>');
  const chan = (id) => CHANS.find((c) => c.id === id);
  const key = () => thread ? 'ep-' + thread.id : cur.id;
  const toast = (t) => { let el = $('#lrToast'); if (!el) { el = document.createElement('div'); el.id = 'lrToast'; el.style.cssText = 'position:fixed;left:50%;bottom:96px;transform:translateX(-50%);background:#f6efe6;color:#0c0a0b;font-weight:700;padding:10px 16px;border-radius:10px;z-index:90;transition:opacity .2s;pointer-events:none'; document.body.append(el); } el.textContent = t; el.style.opacity = 1; clearTimeout(el._h); el._h = setTimeout(() => { el.style.opacity = 0; }, 2000); };

  function messagesFor(k) {
    let base;
    if (k === 'welcome') base = [M('w0', 'hoopsology', 60 * 24 * 3, '', { welcome: true })];
    else if (k === 'announcements') {
      base = [...vd.episodes.slice(0, 6), ...vd.shorts.slice(0, 3)].sort((a, b) => (a.published || '').localeCompare(b.published || ''))
        .map((v) => ({ id: 'an-' + v.id, who: 'hoopsology', at: v.published, text: vd.shorts.includes(v) ? '⚡ **New Short**' : '🎙 **New episode is up.** Discussion thread is open in #episode-talk.', embed: v, rx: {} }));
    } else if (k.startsWith('ep-')) {
      const i = vd.episodes.findIndex((v) => 'ep-' + v.id === k), v = vd.episodes[i];
      base = [{ id: 'op-' + v.id, who: 'hoopsology', at: v.published, text: (v.description || '').split('\n')[0].slice(0, 280) + ((v.description || '').length > 280 ? '…' : ''), embed: v, rx: {} }, ...(THREAD_REPLIES[i] || [])];
    } else base = SAMPLE[k] || [];
    return [...base, ...(posts[k] || [])];
  }

  /* ───────── channel sidebar ───────── */
  function drawChans() {
    $('#chans').innerHTML = CATS.map((c) => `<button class="cat" data-cat="${c.id}" aria-expanded="${!collapsed[c.id]}">${ico.chev}${esc(c.name)}</button>
      <div class="cat-body" ${collapsed[c.id] ? 'hidden' : ''}>${c.chans.map((ch) => {
        const unread = !read[ch.id] && UNREAD0[ch.id];
        return `<button class="ch ${unread ? 'unread' : ''}" data-ch="${ch.id}" aria-current="${cur && cur.id === ch.id}">
          <span class="hash">${ico[ch.ico]}</span><span class="nm">${ch.id}</span>
          ${ch.live ? '<span class="live">LIVE</span>' : ''}${ch.locked && !unlocked ? `<span class="lk">${I.lock}</span>` : ''}${unread && ch.id === 'announcements' ? `<span class="ping">${UNREAD0[ch.id]}</span>` : ''}</button>`;
      }).join('')}</div>`).join('');
    $('#me').innerHTML = me
      ? `${avatar(me.handle, 'sm', true)}<div class="who"><b>${esc(me.handle)}</b><span>${esc(me.team && me.team !== 'No team yet' ? me.team + ' fan' : 'Online')}</span></div><button class="gear" id="editMe" aria-label="Edit profile">${ico.gear}</button>`
      : `<div class="av sm" style="background:#3a3236">?</div><div class="who"><b>Guest</b><span>Previewing</span></div><button class="btn-d" id="joinBtn">Join</button>`;
  }

  /* ───────── messages ───────── */
  function msgHtml(x, prev, list) {
    const u = userOf(x.who);
    const head = !prev || prev.who !== x.who || x.reply || (new Date(x.at) - new Date(prev.at)) > 7 * 60000 || x.embed || prev.poll;
    const mine = me && (x.text || '').includes('@' + me.handle);
    const rx = { ...(x.rx || {}) };
    Object.keys(myRx).forEach((k) => { if (myRx[k] && k.startsWith(x.id + '|')) { const e = k.slice(x.id.length + 1); rx[e] = (rx[e] || 0) + 1; } });
    const r = x.reply && list.find((y) => y.id === x.reply);
    let extra = '';
    if (x.embed) {
      const v = x.embed;
      extra += `<div class="embed"><div class="prov">YouTube · Hoopsology Podcast</div><button class="et" data-play="${v.id}">${esc(v.title)}</button>
        <div class="th" data-play="${v.id}"><img src="${U.thumb(v.id, 'hqdefault')}" alt="" loading="lazy"><span class="pb">${I.play}</span></div></div>`;
    }
    if (x.welcome) {
      extra += `<div class="embed rules"><div class="et" style="color:var(--t-head)">Welcome to the Locker Room 🧪🏀</div>
        <p class="ed">The home of the Hoopsology community. Smart takes, real conversation, respect for the game.</p>
        <ol><li>Smart takes, no personal attacks.</li><li>Respect the players, the hosts and each other.</li><li>No spoilers in game-night titles.</li><li>Mods can hide posts or remove members.</li></ol>
        <div class="fields" style="margin-top:14px"><div><b>#the-lab</b><span>Main chat</span></div><div><b>#episode-talk</b><span>A thread per episode</span></div><div><b>#game-night</b><span>Live during big games</span></div><div><b>🔒 Subscribers</b><span>Members-only rooms</span></div></div></div>`;
    }
    if (x.poll) {
      const mine = LS.get(K.poll + ':' + x.id, null), votes = { ...x.poll.opts }; if (mine) votes[mine]++;
      const total = Object.values(votes).reduce((a, b) => a + b, 0);
      extra += `<div class="poll"><div class="q">${esc(x.poll.q)}</div><div class="h">${mine ? 'You voted. Click another option to change.' : 'Select one answer'}</div>
        ${Object.entries(votes).map(([k, n]) => { const p = Math.round(n / total * 100); return `<button data-vote="${esc(k)}" data-poll="${x.id}" class="${mine === k ? 'mine' : ''}"><i style="width:${mine ? p : 0}%"></i><span>${esc(k)}</span><span class="p">${mine ? p + '%' : ''}</span></button>`; }).join('')}
        <div class="foot">${total} votes · Sample poll</div></div>`;
    }
    return `<div class="m ${head ? 'head' : ''} ${mine ? 'hl' : ''}" data-id="${esc(x.id)}">
      ${r ? `<div class="reply">${avatar(r.who)}<b class="${roleCls(r.who)}" data-user="${esc(r.who)}">@${esc(r.who)}</b><span>${esc(Array.from(r.text || '📊 Poll').slice(0, 90).join(''))}</span></div>` : ''}
      <div class="gut">${head ? `<span data-user="${esc(x.who)}" style="cursor:pointer">${avatar(x.who)}</span>` : `<time>${hm(new Date(x.at))}</time>`}</div>
      <div>${head ? `<div class="nameline"><span class="name ${roleCls(x.who)}" data-user="${esc(x.who)}">${x.who === 'hoopsology' ? 'Hoopsology' : esc(x.who)}</span>${u.role === 'bot' ? '<span class="tagb">✓ BOT</span>' : ''}${u.team && u.team !== 'No team yet' ? `<span class="tagb team">${esc(u.team)}</span>` : ''}<span class="when">${stamp(x.at)}</span></div>` : ''}
        ${x.text ? `<div class="body">${fmt(x.text)}</div>` : ''}${extra}
        ${Object.keys(rx).length ? `<div class="reacts">${Object.entries(rx).map(([e, n]) => `<button class="rx ${myRx[x.id + '|' + e] ? 'on' : ''}" data-rx="${e}" aria-label="React ${e}">${e}<span>${n}</span></button>`).join('')}</div>` : ''}</div>
      <div class="tools"><button data-rx="🔥" aria-label="React fire">🔥</button><button data-rx="🏀" aria-label="React basketball">🏀</button><button data-rx="😂" aria-label="React laughing">😂</button><button data-reply aria-label="Reply">${ico.reply}</button></div></div>`;
  }

  function drawMessages() {
    const k = key(), list = messagesFor(k);
    const shown = q ? list.filter((x) => (x.who + ' ' + (x.text || '') + ' ' + (x.embed ? x.embed.title : '')).toLowerCase().includes(q)) : list;
    const unreadN = !read[k + ':seen'] && UNREAD0[k];
    let out = '', prevDay = '';
    shown.forEach((x, i) => {
      const day = dayLabel(x.at);
      if (unreadN && i === shown.length - unreadN) { out += '<div class="divider new"><span>NEW</span></div>'; prevDay = day; }
      else if (day !== prevDay) { out += `<div class="divider">${day}</div>`; prevDay = day; }
      out += msgHtml(x, i && !q ? shown[i - 1] : null, list);
    });
    const c = cur, t = thread;
    const intro = t ? '' : `<div class="intro"><div class="big">${ico[c.ico]}</div><h2>Welcome to #${esc(c.id)}!</h2><p>This is the start of the #${esc(c.id)} channel. ${esc(c.topic)}</p></div>`;
    const sc = $('#scroller');
    sc.innerHTML = intro + (out || (q ? `<p style="padding:24px 16px;color:var(--t-mut)">No messages match “${esc(q)}”.</p>` : ''));
    sc.scrollTop = sc.scrollHeight;
    read[k + ':seen'] = true; LS.set(K.read, read);
  }

  function composerHtml() {
    const c = cur;
    if (c.ro) return `<div class="ro">🔒 Only the Hoopsology team can post in this channel.</div>`;
    if (!me) return `<div class="joinbar"><span>You're previewing <b>Hoopsology</b>. Join to chat, react and reply.</span><button class="btn-d" data-join>Join the Locker Room</button></div>`;
    const target = thread ? 'this thread' : '#' + c.id;
    return `${replyTo ? `<div class="replying">Replying to <b>@${esc(replyTo.who)}</b><button id="cancelReply" aria-label="Cancel reply">✕</button></div>` : ''}
      <form class="cbox" id="cform"><button type="button" class="plus" aria-label="Attach (coming soon)" id="plus"><span>+</span></button>
      <label class="sr" for="ct">Message</label><textarea id="ct" rows="1" maxlength="2000" placeholder="Message ${esc(target)}"></textarea>
      <button type="button" class="ebtn" id="emoBtn" aria-label="Emoji">🏀</button><button type="button" class="ebtn" data-quick="🔥" aria-label="Insert fire">🔥</button></form>
      <div class="emo-pop" id="emoPop">${EMOJI.map((e) => `<button type="button" data-ins="${e}">${e}</button>`).join('')}</div>`;
  }

  /* ───────── views ───────── */
  function topbar(title, iconKey, topic, backToForum) {
    return `<div class="topbar">
      <button class="tb-btn back" id="navBtn" aria-label="Channels">${I.menu}</button>
      ${backToForum ? `<button class="tb-btn" id="backForum" aria-label="Back to episode-talk" style="display:grid">${I.left}</button>` : ''}
      <div class="ttl">${ico[iconKey]}<span>${esc(title)}</span></div>${topic ? `<div class="topic">${esc(topic)}</div>` : '<div style="flex:1"></div>'}
      <input class="search" id="search" type="search" placeholder="Search" aria-label="Search this channel" value="${esc(q)}">
      <button class="tb-btn" id="memBtn" aria-label="Toggle member list" aria-pressed="${!$('#app').classList.contains('no-members')}">${ico.people}</button></div>
      ${LS.get(K.notice, false) ? '' : '<div class="notice"><b>PREVIEW</b><span>Sample conversation from example fans. Anything you post stays on this device.</span><button id="noticeX" aria-label="Dismiss">×</button></div>'}`;
  }

  function open(id, opts = {}) {
    const c = chan(id) || chan('the-lab');
    cur = c; thread = opts.thread || null; replyTo = null; q = '';
    read[c.id] = true; LS.set(K.read, read);
    $('#app').classList.remove('nav-open');
    drawChans();
    const chat = $('#chat');
    if (c.locked && !unlocked) {
      chat.innerHTML = topbar(c.id, c.ico, c.topic) + `<div class="locked"><div><div class="ic">${I.lock}</div><h3>#${esc(c.id)} is for Subscribers</h3>
        <p>${esc(c.topic)} Subscribers also get:</p><ul><li>Members-only channels</li><li>Bonus breakdowns and uncut segments</li><li>A vote on upcoming guests</li><li>A Subscriber badge in every room</li></ul>
        <button class="btn-d" id="unlock" style="height:42px;padding:0 22px">Preview as a Subscriber</button></div></div>`;
    } else if (c.forum && !thread) {
      const tags = [['all', 'All'], ['nba', 'NBA'], ['wnba', 'WNBA'], ['interview', 'Interview'], ['itl', 'In The Lab']];
      const eps = vd.episodes.slice(0, 12).filter((v) => forumTag === 'all' || U.tagOf(v).k === forumTag);
      chat.innerHTML = topbar(c.id, c.ico, c.topic) + `<div class="scroller" id="scroller"><div class="forum">
        <div class="forum-bar">${tags.map(([k, t]) => `<button class="pill" data-ftag="${k}" aria-pressed="${forumTag === k}">${t}</button>`).join('')}</div>
        ${eps.map((v) => { const n = messagesFor('ep-' + v.id).length - 1, last = messagesFor('ep-' + v.id).slice(-1)[0];
          return `<button class="post" data-thread="${v.id}"><div><div class="tags"><span class="tg">${U.tagOf(v).label}</span>${v.seconds ? `<span class="tg">${U.fmtDur(v.seconds)}</span>` : ''}</div>
          <h3>${esc(v.title)}</h3><p>${esc((v.description || '').split('\n')[0])}</p>
          <div class="stats"><span>${ico.msgs}${n} ${n === 1 ? 'reply' : 'replies'}</span><span>${n ? 'Last reply ' + stamp(last.at).replace('Today at ', '') : 'Posted ' + U.ago(v.published)}</span></div></div>
          <div class="th"><img src="${U.thumb(v.id, 'mqdefault')}" alt="" loading="lazy"></div></button>`; }).join('') || '<p style="color:var(--t-mut)">No episodes with this tag yet.</p>'}
      </div></div>`;
    } else {
      chat.innerHTML = (thread ? topbar(thread.title, 'forum', '', true) : topbar(c.id, c.ico, c.topic)) +
        `<div class="scroller" id="scroller"></div><div class="composer" style="position:relative">${composerHtml()}</div>`;
      drawMessages();
    }
    bindChat();
    try { history.replaceState(null, '', '#' + c.id + (thread ? '/' + thread.id : '')); } catch (e) {}
  }

  function bindChat() {
    const s = $('#search');
    if (s) s.addEventListener('input', () => { q = s.value.trim().toLowerCase(); if ($('#scroller') && !(cur.forum && !thread)) drawMessages(); });
    const f = $('#cform'); if (!f) return;
    const ta = $('#ct');
    const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'; };
    ta.addEventListener('input', grow);
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); f.requestSubmit(); }
      if (e.key === 'Escape' && replyTo) { replyTo = null; reComposer(); }
    });
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = ta.value.trim(); if (!text) return;
      const k = key();
      (posts[k] = posts[k] || []).push({ id: 'p' + Date.now().toString(36), who: me.handle, at: new Date().toISOString(), text, rx: {}, reply: replyTo ? replyTo.id : undefined });
      LS.set(K.posts, posts);
      replyTo = null; drawMessages(); reComposer();
    });
    if (window.matchMedia('(min-width: 761px)').matches) ta.focus();
  }
  function reComposer() { const c = $('.composer'); if (c) { c.innerHTML = composerHtml(); bindChat(); } }

  /* ───────── members ───────── */
  function drawMembers() {
    const all = Object.entries(USERS).map(([h, u]) => ({ h, ...u }));
    if (me) all.push({ h: me.handle, team: me.team, role: 'you', status: 'online' });
    const groups = [
      ['Hoopsology Team', all.filter((u) => u.role === 'bot')],
      ['Subscribers', all.filter((u) => u.role === 'sub' && u.status !== 'off')],
      ['Online', all.filter((u) => (u.role === 'member' || u.role === 'you') && u.status !== 'off')],
      ['Offline', all.filter((u) => u.role !== 'bot' && u.status === 'off')],
    ];
    $('#members').innerHTML = groups.filter((g) => g[1].length).map(([t, us]) => `<h5>${t} — ${us.length}</h5>` + us.map((u) =>
      `<button class="mem ${u.status === 'off' ? 'off' : ''}" data-user="${esc(u.h)}">${avatar(u.h, 'sm', true)}<span style="min-width:0"><span class="nm ${roleCls(u.h)}">${u.h === 'hoopsology' ? 'Hoopsology' : esc(u.h)}</span>${u.team && u.team !== 'No team yet' ? `<span class="sub">${esc(u.team)} fan</span>` : u.role === 'bot' ? '<span class="sub">Posts every new episode</span>' : ''}</span></button>`).join('')).join('') +
      '<p style="margin:18px 8px 0;font-size:11.5px;color:var(--t-dim)">Sample members for the preview.</p>';
  }

  function profile(h, x, y) {
    const u = userOf(h), p = $('#pop');
    const roles = [u.role === 'bot' ? ['Hoopsology Team', 'var(--bot)'] : null, u.role === 'sub' ? ['Subscriber', 'var(--sub)'] : null, u.role === 'you' ? ['You', '#b9a5ff'] : null, u.role !== 'bot' ? ['Member', '#9b9088'] : null].filter(Boolean);
    p.innerHTML = `<div class="ban" style="background:${h === 'hoopsology' ? 'var(--maroon)' : colorOf(h)}"></div>${avatar(h, 'pav', true)}
      <div class="pbody"><b>${h === 'hoopsology' ? 'Hoopsology' : esc(h)}</b><span class="h">@${esc(h)}</span>
      ${u.team && u.team !== 'No team yet' ? `<div class="sec"><h6>Repping</h6>${esc(u.team)}</div>` : ''}
      <div class="sec"><h6>Roles</h6><div class="roles">${roles.map(([t, c]) => `<span class="role"><i style="background:${c}"></i>${t}</span>`).join('')}</div></div></div>`;
    p.classList.add('on');
    const w = 280, hgt = p.offsetHeight;
    p.style.left = Math.max(8, Math.min(x, innerWidth - w - 8)) + 'px';
    p.style.top = Math.max(80, Math.min(y, innerHeight - hgt - 8)) + 'px';
  }

  /* ───────── join modal ───────── */
  function openJoin() {
    $('#jt').innerHTML = TEAMS.map((t) => `<option ${me && me.team === t ? 'selected' : ''}>${t}</option>`).join('');
    $('#jh').value = me ? me.handle : ''; $('#jerr').textContent = '';
    $('#veil').classList.add('on'); setTimeout(() => $('#jh').focus(), 50);
  }
  $('#joinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const h = $('#jh').value.trim();
    if (!/^[A-Za-z0-9_]{3,20}$/.test(h)) { $('#jerr').textContent = '3–20 characters: letters, numbers or underscores.'; return; }
    if (USERS[h.toLowerCase()] || h.toLowerCase() === 'hoopsology') { $('#jerr').textContent = 'That handle is taken.'; return; }
    me = { handle: h, team: $('#jt').value }; LS.set(K.me, me);
    $('#veil').classList.remove('on'); drawMembers(); open(cur.id, { thread });
    toast('Welcome to the Locker Room, ' + h + '!');
  });
  $('#jcancel').addEventListener('click', () => $('#veil').classList.remove('on'));
  $('#veil').addEventListener('click', (e) => { if (e.target.id === 'veil') $('#veil').classList.remove('on'); });

  /* ───────── events ───────── */
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t.closest('#pop') && !t.closest('[data-user]')) $('#pop').classList.remove('on');
    if (!t.closest('#emoPop') && !t.closest('#emoBtn') && $('#emoPop')) $('#emoPop').classList.remove('on');
    let el;
    if ((el = t.closest('[data-cat]'))) { collapsed[el.dataset.cat] = !collapsed[el.dataset.cat]; LS.set(K.cats, collapsed); return drawChans(); }
    if ((el = t.closest('[data-ch]'))) { forumTag = 'all'; return open(el.dataset.ch); }
    if ((el = t.closest('[data-thread]'))) { const v = vd.episodes.find((x) => x.id === el.dataset.thread); return open('episode-talk', { thread: v }); }
    if (t.closest('#backForum')) return open('episode-talk');
    if ((el = t.closest('[data-ftag]'))) { forumTag = el.dataset.ftag; return open('episode-talk'); }
    if ((el = t.closest('[data-play]'))) { const v = [...vd.episodes, ...vd.shorts].find((x) => x.id === el.dataset.play); if (v) U.openPlayer([v], 0, vd.shorts.includes(v)); return; }
    if ((el = t.closest('[data-user]'))) { const r = el.getBoundingClientRect(); return profile(el.dataset.user, el.closest('.members') ? r.left - 290 : r.right + 8, r.top); }
    if (t.closest('#navBtn')) return $('#app').classList.toggle('nav-open');
    if (t.closest('#scrim')) return $('#app').classList.remove('nav-open');
    if (t.closest('#memBtn')) {
      const app = $('#app');
      if (innerWidth > 1200) app.classList.toggle('no-members'); else app.classList.toggle('show-members');
      t.closest('#memBtn').setAttribute('aria-pressed', innerWidth > 1200 ? !app.classList.contains('no-members') : app.classList.contains('show-members'));
      return;
    }
    if (t.closest('#noticeX')) { LS.set(K.notice, true); t.closest('.notice').remove(); return; }
    if (t.closest('#unlock')) { unlocked = true; toast('Previewing as a Subscriber'); return open(cur.id); }
    if (t.closest('[data-join]') || t.closest('#joinBtn') || t.closest('#editMe')) return openJoin();
    if (t.closest('#plus')) return toast('Image and clip uploads come with the live version');
    if (t.closest('#emoBtn')) return $('#emoPop').classList.toggle('on');
    if ((el = t.closest('[data-ins]')) || (el = t.closest('[data-quick]'))) { const ta = $('#ct'); ta.value += el.dataset.ins || el.dataset.quick; ta.dispatchEvent(new Event('input')); ta.focus(); $('#emoPop').classList.remove('on'); return; }
    if (t.closest('#cancelReply')) { replyTo = null; return reComposer(); }
    if ((el = t.closest('[data-vote]'))) { LS.set(K.poll + ':' + el.dataset.poll, el.dataset.vote); return drawMessages(); }
    const msg = t.closest('.m');
    if (msg && t.closest('[data-reply]')) {
      if (!me) return openJoin();
      if (cur.ro) return toast('This channel is read-only');
      replyTo = messagesFor(key()).find((x) => x.id === msg.dataset.id); reComposer(); $('#ct') && $('#ct').focus(); return;
    }
    if (msg && (el = t.closest('[data-rx]'))) {
      if (!me) return openJoin();
      const k2 = msg.dataset.id + '|' + el.dataset.rx; myRx[k2] = !myRx[k2]; LS.set(K.rx, myRx);
      const sc = $('#scroller'), top = sc.scrollTop; drawMessages(); sc.scrollTop = top;
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { $('#pop').classList.remove('on'); $('#veil').classList.remove('on'); $('#app').classList.remove('nav-open', 'show-members'); } });

  document.addEventListener('DOMContentLoaded', async () => {
    try { vd = await HS.store.videos(); } catch (e) {}
    drawMembers();
    const [ch, tid] = decodeURIComponent(location.hash.slice(1)).split('/');
    const v = tid && vd.episodes.find((x) => x.id === tid);
    open(ch || 'the-lab', v ? { thread: v } : {});
  });
})();
