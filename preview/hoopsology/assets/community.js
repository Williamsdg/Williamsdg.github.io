/* Locker Room preview — chat rooms, auto-created episode threads, subscriber rooms.
 * Sample posts are clearly labeled on the page; anything the visitor posts is kept in
 * localStorage. Phase 2 swaps this for the Supabase threads/posts tables in schema.sql. */
(function () {
  const U = HS.ui, I = U.I, esc = U.esc;
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const K = { me: 'hs_lr_me', posts: 'hs_lr_posts', rx: 'hs_lr_rx', poll: 'hs_lr_poll' };
  const COLORS = ['#921f30', '#c25a12', '#1f6f8b', '#5b3fa0', '#2d7a4f', '#8a6d1d', '#a3324f', '#35608f'];
  const color = (h) => COLORS[[...h].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
  const mins = (m) => new Date(Date.now() - m * 60000).toISOString();
  const rel = (iso) => { const m = Math.round((Date.now() - new Date(iso)) / 60000); return m < 1 ? 'now' : m < 60 ? m + 'm' : m < 1440 ? Math.round(m / 60) + 'h' : Math.round(m / 1440) + 'd'; };
  const toast = (t) => { const el = $('#toast'); el.textContent = t; el.style.opacity = 1; el.style.visibility = 'visible'; clearTimeout(el._h); el._h = setTimeout(() => { el.style.opacity = 0; el.style.visibility = 'hidden'; }, 2200); };
  const TEAMS = ['No team yet', 'Hawks', 'Celtics', 'Nets', 'Hornets', 'Bulls', 'Cavaliers', 'Mavericks', 'Nuggets', 'Pistons', 'Warriors', 'Rockets', 'Pacers', 'Clippers', 'Lakers', 'Grizzlies', 'Heat', 'Bucks', 'Timberwolves', 'Pelicans', 'Knicks', 'Thunder', 'Magic', '76ers', 'Suns', 'Trail Blazers', 'Kings', 'Spurs', 'Raptors', 'Jazz', 'Wizards',
    'Aces', 'Dream', 'Fever', 'Liberty', 'Lynx', 'Mercury', 'Mystics', 'Sky', 'Sparks', 'Storm', 'Sun', 'Tempo', 'Valkyries', 'Wings'];

  /* sample conversation: fictional fans, topics taken from real episodes */
  const m = (who, team, ago, text, rx = {}, sub = false) => ({ who, team, at: mins(ago), text, rx, sub });
  const SAMPLE = {
    lab: [
      m('courtvision_kay', 'Celtics', 180, 'That Clippers breakdown on ITL was wild. Five first-round picks, 2029 through 2033. That is a whole era with no firsts.', { '🔥': 14, '😤': 3 }, true),
      m('ripcity_rae', 'Trail Blazers', 172, 'The question at the end got me: which other front offices are cleaning their books right now? 👀', { '👀': 9 }),
      m('nuggetsnate', 'Nuggets', 150, 'Meanwhile Jokić saying "if they want me" like there is any universe where Denver says no 😂', { '😂': 21, '🏀': 4 }, true),
      m('stretch_four', 'Knicks', 95, 'Hot take: Adelman naming the "bad 10 days" out loud is the most honest thing any coach said at media day.', { '🔥': 6 }),
      m('lynxlaura', 'Lynx', 40, 'Can we get a full episode on Olivia Miles please. A rookie getting judged on veteran benchmarks and beating them??', { '🙌': 11 }, true),
      m('baseline_ben', 'Hornets', 12, 'Just found this show through the Travis Demers interview. Hearing how a radio voice preps for a game was so good.', { '🧪': 5 }),
    ],
    nba: [
      m('dubnation_dee', 'Warriors', 240, 'Steph 2 years, $116M. Loyalty move or a real push in the West? I say both.', { '🏀': 8 }),
      m('nuggetsnate', 'Nuggets', 200, 'Adelman said you cannot run the #1 offense and struggle getting back. Transition D has to be the story this year.', { '🔥': 5 }, true),
      m('stretch_four', 'Knicks', 130, 'Everyone sleeping on what DeRozan brings to that Denver bench.', {}),
      m('courtvision_kay', 'Celtics', 60, 'Kawhi back in Toronto while all this lands is the most Kawhi thing ever.', { '😂': 12 }, true),
    ],
    wnba: [
      m('lynxlaura', 'Lynx', 300, 'Lynx are the favorite and I am not being humble about it.', { '🔥': 7 }, true),
      m('aces_ally', 'Aces', 260, 'A healthy Caitlin Clark vs A\'ja in round one is appointment TV. Still taking the Aces.', { '🏀': 10 }),
      m('bayarea_bri', 'Valkyries', 200, 'The ITL comparison of the Valkyries defense to the mid-2000s Pistons is the nicest thing anyone has said about us.', { '🙌': 9 }),
      m('tempo_tess', 'Tempo', 90, 'That Savanna Hamilton episode on Toronto\'s first season made me emotional. Marina Mabrey with the 53-point game!!', { '🔥': 13 }, true),
    ],
    game: [
      m('aces_ally', 'Aces', 6, 'Game night room is OPEN 🔴', { '🔴': 18 }),
      m('fever_fan_mo', 'Fever', 5, 'LET\'S GOOO', { '🏀': 6 }),
      m('lynxlaura', 'Lynx', 4, 'that closeout was a half-second late every time', {}, true),
      m('courtvision_kay', 'Celtics', 3, 'somebody clip that possession for the show 🧪', { '🧪': 7 }, true),
      m('bayarea_bri', 'Valkyries', 1, 'timeout. breathe, everyone.', { '😂': 4 }),
    ],
    film: [
      m('courtvision_kay', 'Celtics', 50, 'Bonus breakdown drops Friday for members.', {}, true),
      m('nuggetsnate', 'Nuggets', 30, 'Full uncut version of the Jokić segment is in here.', {}, true),
      m('lynxlaura', 'Lynx', 10, 'Voting on next week\'s guest is open.', {}, true),
    ],
    ask: [
      m('baseline_ben', 'Hornets', 60, 'Q for the crew: who replaces Engelbert, and would Sue Bird even want the job?', { '⬆️': 31 }),
      m('ripcity_rae', 'Trail Blazers', 40, 'Q: is Portland really a one-sport city or is that a Blazers-radio thing?', { '⬆️': 18 }),
    ],
  };
  const THREAD_REPLIES = [
    [m('stretch_four', 'Knicks', 55, 'The RICO angle was the part I had not heard anywhere else.', { '🔥': 4 }), m('courtvision_kay', 'Celtics', 20, 'Timestamp for anyone scrolling: the Engelbert segment is after the Clippers breakdown.', { '🙌': 6 }, true)],
    [m('nuggetsnate', 'Nuggets', 70, 'Rebounding + transition D. He knows exactly what went wrong.', { '🏀': 3 }, true)],
  ];

  const ROOMS = [
    { id: 'lab', grp: 'Chat rooms', ic: '#', name: 'the-lab', desc: 'Main room. Talk the latest episodes and anything hoops.' },
    { id: 'nba', grp: 'Chat rooms', ic: '#', name: 'nba', desc: 'NBA news, trades, takes.' },
    { id: 'wnba', grp: 'Chat rooms', ic: '#', name: 'wnba', desc: 'WNBA news, playoffs, takes.' },
    { id: 'game', grp: 'Chat rooms', ic: '●', name: 'game-night', desc: 'Opens live during the big games. Sample below.', live: true },
    { id: 'film', grp: 'Subscribers', ic: '#', name: 'film-room', desc: 'Members-only: bonus breakdowns, uncut segments, guest votes.', locked: true },
    { id: 'ask', grp: 'Subscribers', ic: '?', name: 'ask-the-hosts', desc: 'Submit questions and vote them up. The best ones make the show.', locked: true },
  ];

  let me = LS.get(K.me, null), posts = LS.get(K.posts, {}), myRx = LS.get(K.rx, {}), vd = null, current = null, unlocked = false;

  function allMessages(room) {
    const base = room.thread ? room.thread.replies : (SAMPLE[room.id] || []);
    return [...base.map((x, i) => ({ ...x, key: room.id + ':s' + i })), ...(posts[room.id] || []).map((x, i) => ({ ...x, key: room.id + ':p' + i, mine: true }))];
  }
  function msgHtml(x) {
    const rx = { ...(x.rx || {}) };
    Object.keys(myRx).forEach((k) => { const [key, e] = k.split('|'); if (key === x.key && myRx[k]) rx[e] = (rx[e] || 0) + 1; });
    return `<div class="msg" data-key="${esc(x.key)}">
      <div class="av" style="background:${color(x.who)}">${esc(x.who[0].toUpperCase())}</div>
      <div><div class="who"><b>${esc(x.who)}</b>${x.mine ? '<span class="badge b-you">You</span>' : ''}${x.sub ? '<span class="badge b-sub">Subscriber</span>' : ''}${x.team && x.team !== 'No team yet' ? `<span class="badge b-team">${esc(x.team)}</span>` : ''}<span class="tm">${rel(x.at)}</span></div>
        <p class="txt">${esc(x.text).replace(/\n/g, '<br>')}</p>
        <div class="reacts">${Object.entries(rx).map(([e, n]) => `<button class="rx ${myRx[x.key + '|' + e] ? 'on' : ''}" data-rx="${e}" aria-label="React ${e}">${e}<span>${n}</span></button>`).join('')}
          <button class="rx add" data-rx="🔥" aria-label="Add fire reaction">🔥+</button></div></div></div>`;
  }
  const botMsg = (v, text) => `<div class="msg"><div class="av bot"></div><div><div class="who"><b>Hoopsology</b><span class="badge b-bot">Official</span><span class="tm">${rel(v.published)}</span></div>
      <p class="txt">${text}</p>
      <button class="ep-card" data-play="${v.id}"><div class="th"><img src="${U.thumb(v.id)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${U.thumb(v.id, 'hqdefault')}'"><span class="ball-play">${I.play}</span></div>
      <div><span class="byline"><span class="cat">${U.tagOf(v).label}</span>${v.seconds ? ' · ' + U.fmtDur(v.seconds) : ''}</span><b>${esc(v.title)}</b></div></button></div></div>`;

  function drawRooms() {
    const threads = vd.episodes.slice(0, 6).map((v, i) => ({ id: 'ep-' + v.id, grp: 'Episode threads', ic: '🎙', name: U.cleanTitle(v.title), desc: 'Every new episode opens its own thread automatically.', thread: { v, replies: THREAD_REPLIES[i] || [] } }));
    const all = [...ROOMS.slice(0, 4), ...threads, ...ROOMS.slice(4)];
    let grp = '';
    $('#rooms').innerHTML = `<h2 class="display">Locker Room</h2><p class="sub">The Hoopsology community</p>` + all.map((r) => {
      const head = r.grp !== grp ? `<div class="grp"><span>${r.grp}</span>${r.grp === 'Episode threads' ? '<span>AUTO</span>' : ''}</div>` : '';
      grp = r.grp;
      const n = allMessages(r).length;
      return head + `<button class="room" data-room="${esc(r.id)}"><span class="ic">${r.ic}</span><span class="nm">${esc(r.name)}</span>${r.live ? '<span class="live">LIVE</span>' : ''}${r.locked ? `<span class="lock">${I.lock}</span>` : r.thread ? `<span class="cnt">${n}</span>` : ''}</button>`;
    }).join('');
    $('#rooms')._all = all;
  }

  function open(id) {
    const r = $('#rooms')._all.find((x) => x.id === id) || $('#rooms')._all[0];
    current = r;
    $$('.room').forEach((b) => b.setAttribute('aria-current', b.dataset.room === r.id));
    $('#rooms').classList.remove('open');
    const title = r.thread ? '🎙 Episode thread' : `<span style="color:var(--dim)">${r.ic === '●' ? '<span class="live-dot"></span>' : r.ic}</span>${esc(r.name)}`;
    const locked = r.locked && !unlocked;
    let body;
    if (r.thread) {
      const v = r.thread.v;
      body = `<div class="thread-op"><span class="kicker">${U.tagOf(v).label} · ${U.fmtDate(v.published)}</span><h3>${esc(v.title)}</h3>
        <div class="screen" data-play="${v.id}"><img src="${U.thumb(v.id)}" alt="" onerror="this.onerror=null;this.src='${U.thumb(v.id, 'hqdefault')}'"><span class="play"><span class="ball-play">${I.play}</span></span></div>
        <p class="txt" style="margin-top:12px;color:var(--muted)">${esc((v.description || '').split('\n')[0].slice(0, 260))}${(v.description || '').length > 260 ? '…' : ''}</p></div>
        <div class="day">${allMessages(r).length} ${allMessages(r).length === 1 ? 'REPLY' : 'REPLIES'}</div>` + (allMessages(r).map(msgHtml).join('') || '<p class="empty" style="margin:10px 0">No replies yet. Start the conversation.</p>');
    } else {
      body = `<div class="day">TODAY</div>`;
      if (r.id === 'lab' && vd.episodes[0]) body += botMsg(vd.episodes[0], 'New episode just dropped. Discussion thread is open in <b>Episode threads</b>.');
      body += allMessages(r).map(msgHtml).join('');
    }
    $('#stream').innerHTML = `<div class="room-head">
        <button class="btn btn-sm room-switch" id="roomSwitch" aria-label="Switch room">Rooms ▾</button>
        <div class="meta"><div class="t">${title}</div><div class="d">${esc(r.desc)}</div></div></div>
      ${locked ? `<div class="locked"><div class="msgs">${body}</div><div class="lock-card"><div><div class="big">${I.lock}</div><h3>Subscribers only</h3>
          <p>${esc(r.desc)} Members get bonus content, uncut segments and a say in the show.</p>
          <button class="btn btn-ball" id="unlock">Preview as a subscriber</button></div></div></div>`
        : `<div class="msgs" id="msgs">${body}</div>${composer(r)}`}`;
    const ms = $('#msgs'); if (ms) ms.scrollTop = r.thread ? 0 : ms.scrollHeight; // threads open at the episode, rooms at the latest message
    bindComposer(r);
    try { history.replaceState(null, '', '#' + r.id); } catch (e) {}
  }

  function composer(r) {
    if (!me) return `<div class="composer"><form class="handle-form" id="handleForm"><p>Pick a handle to join the conversation</p>
      <label class="sr" for="hh">Handle</label><input class="in" id="hh" maxlength="20" placeholder="e.g. hoops_head" autocomplete="nickname" required pattern="[A-Za-z0-9_]{3,20}" title="3–20 letters, numbers or underscores">
      <label class="sr" for="ht">Favorite team</label><select class="in" id="ht">${TEAMS.map((t) => `<option>${t}</option>`).join('')}</select>
      <button class="btn btn-ball">Join</button></form></div>`;
    const ph = r.thread ? 'Reply to this episode…' : `Message #${r.name}`;
    return `<div class="composer"><form class="comp-box" id="compForm"><label class="sr" for="ct">Message</label><textarea id="ct" rows="1" maxlength="1000" placeholder="${esc(ph)}"></textarea>
      <div class="emo"><button type="button" data-emo="🏀" aria-label="Insert basketball">🏀</button><button type="button" data-emo="🔥" aria-label="Insert fire">🔥</button><button type="button" data-emo="🧪" aria-label="Insert flask">🧪</button><button type="button" data-emo="😤" aria-label="Insert huff">😤</button></div>
      <button class="send" id="send" disabled aria-label="Send">${I.arrow}</button></form>
      <div class="comp-note"><span>Posting as <b style="color:var(--text)">${esc(me.handle)}</b> · <button type="button" id="changeMe" style="text-decoration:underline">change</button></span><span>Enter to send · Shift+Enter for a new line</span></div></div>`;
  }

  function bindComposer(r) {
    const hf = $('#handleForm');
    if (hf) hf.addEventListener('submit', (e) => { e.preventDefault(); me = { handle: $('#hh').value.trim(), team: $('#ht').value }; LS.set(K.me, me); open(r.id); $('#ct') && $('#ct').focus(); });
    const f = $('#compForm'); if (!f) return;
    const ta = $('#ct'), send = $('#send');
    const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'; send.disabled = !ta.value.trim(); };
    ta.addEventListener('input', grow);
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); f.requestSubmit(); } });
    $$('[data-emo]', f).forEach((b) => b.addEventListener('click', () => { ta.value += b.dataset.emo; grow(); ta.focus(); }));
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = ta.value.trim(); if (!text) return;
      (posts[r.id] = posts[r.id] || []).push({ who: me.handle, team: me.team, at: new Date().toISOString(), text, rx: {} });
      LS.set(K.posts, posts);
      const list = allMessages(r), x = list[list.length - 1];
      const empty = $('#msgs .empty'); if (empty) empty.remove();
      $('#msgs').insertAdjacentHTML('beforeend', msgHtml(x));
      $('#msgs').scrollTop = $('#msgs').scrollHeight;
      ta.value = ''; grow();
      const cnt = $(`.room[data-room="${CSS.escape(r.id)}"] .cnt`); if (cnt) cnt.textContent = list.length;
    });
    $('#changeMe').addEventListener('click', () => { me = null; LS.set(K.me, null); open(r.id); });
  }

  function drawSide() {
    const v = vd.episodes[0];
    const poll = LS.get(K.poll, null);
    const base = { Lynx: 41, Aces: 33, Liberty: 18, Fever: 26, 'Someone else': 7 };
    const votes = { ...base }; if (poll) votes[poll]++;
    const total = Object.values(votes).reduce((a, b) => a + b, 0);
    $('#side').innerHTML = `
      ${v ? `<div class="card"><h4><span>Now discussing</span><span style="color:var(--orange)">NEW</span></h4><button class="ep-card" data-play="${v.id}"><div class="th"><img src="${U.thumb(v.id)}" alt="" loading="lazy"><span class="ball-play">${I.play}</span></div><div><b>${esc(v.title)}</b></div></button>
        <button class="btn btn-sm" style="width:100%;margin-top:12px" data-room-go="ep-${v.id}">Open the thread</button></div>` : ''}
      <div class="card poll"><h4><span>Fan poll</span><span>Sample</span></h4><p style="margin:0 0 12px;font-weight:700">Who wins the WNBA title?</p>
        ${Object.entries(votes).map(([k, n]) => { const p = Math.round(n / total * 100); return `<button data-vote="${esc(k)}" class="${poll === k ? 'mine' : ''}"><i style="width:${poll ? p : 0}%"></i><span>${esc(k)}</span><span class="pct">${poll ? p + '%' : ''}</span></button>`; }).join('')}
        <p class="byline" style="margin:4px 0 0">${poll ? total + ' votes' : 'Vote to see results'}</p></div>
      <div class="card"><h4><span>House rules</span></h4><ol class="rules"><li>Smart takes, no personal attacks.</li><li>Respect the game, the players and each other.</li><li>No spoilers in game-night titles.</li><li>Mods can hide posts or remove members.</li></ol></div>`;
  }

  document.addEventListener('click', (e) => {
    const room = e.target.closest('[data-room]'); if (room) return open(room.dataset.room);
    const go = e.target.closest('[data-room-go]'); if (go) return open(go.dataset.roomGo);
    const play = e.target.closest('[data-play]');
    if (play) { const v = [...vd.episodes, ...vd.shorts].find((x) => x.id === play.dataset.play); if (v) HS.ui.openPlayer([v], 0, false); return; }
    if (e.target.closest('#roomSwitch')) return $('#rooms').classList.toggle('open');
    if (e.target.closest('#unlock')) { unlocked = true; toast('Previewing as a subscriber'); return open(current.id); }
    const vote = e.target.closest('[data-vote]'); if (vote) { LS.set(K.poll, vote.dataset.vote); drawSide(); return; }
    const rx = e.target.closest('[data-rx]');
    if (rx) {
      const msg = rx.closest('.msg'), key = msg.dataset.key + '|' + rx.dataset.rx;
      myRx[key] = !myRx[key]; LS.set(K.rx, myRx);
      const x = allMessages(current).find((y) => y.key === msg.dataset.key);
      if (x) msg.outerHTML = msgHtml(x);
    }
  });

  document.addEventListener('DOMContentLoaded', async () => {
    document.documentElement.style.setProperty('--pb', $('#pbar').offsetHeight + 'px');
    try { vd = await HS.store.videos(); } catch (e) { vd = { episodes: [], shorts: [] }; }
    drawRooms(); drawSide();
    open(decodeURIComponent(location.hash.slice(1)) || 'lab');
  });
})();
