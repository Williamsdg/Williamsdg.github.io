/* ================================================================
   HUDDLE WITH COACH PINK — Auburn film room
   Single-file vanilla JS app
   ================================================================ */
(function () {
'use strict';

// =================== STATE ====================
const LS_INDEX = 'huddle-coach-pink:games';
const LS_GAME  = (id) => `huddle-coach-pink:game:${id}`;

const state = {
  game: null,          // active Game object
  activeMarkerId: null,
  inPoint: null,
  outPoint: null,
  loopActive: false,
  tool: null,          // active draw tool
  penColor: '#DD550C',
  penWidth: 4,
  strokes: {},         // markerId -> [stroke, ...] in-memory cache
  redoStacks: {},      // markerId -> [stroke, ...]
  isDrawing: false,
  drawStart: null,
  currentStroke: null,
  adapter: null,
  mp4File: null,       // current local File (not persisted)
  search: '',
  filterQuarter: '',
  filterDown: '',
  filterTag: '',
  ngSource: 'youtube',
  rightTab: 'play',
  playbackRate: 1,
  autoClearOnPlay: false,
  pinDrawingsToClip: false,
  filterDrive: '',
  listFilterPT: '',
  listFilterQuarter: '',
  listFilterDown: '',
  listFilterTag: '',
  listFilterDrive: '',
  selectedIds: new Set(),
  selectAnchorId: null,     // for shift-click range selection
  currentDrive: 1,
  autoAdvance: false,
  loopCycleCount: 0,
  lastLoopReset: 0,
  viewMode: 'review',       // review | gameday | compare
  readOnly: false,          // true when loaded from #share=
  shareFilters: null,       // { tag, pt } when loaded read-only
};

// =================== UTILITIES ====================
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 10)}`;
const nowISO = () => new Date().toISOString();
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function fmtTime(s) {
  if (!isFinite(s)) return '0:00';
  s = Math.max(0, Math.floor(s));
  const m = Math.floor(s / 60), r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

let _toastTimer;
function toast(msg, kind = '') {
  const el = $('#toast');
  el.textContent = msg;
  el.className = 'toast' + (kind ? ' ' + kind : '');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.classList.add('hidden'); }, 3000);
}

function debounce(fn, ms) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// =================== PERSISTENCE ====================
function loadIndex() {
  try { return JSON.parse(localStorage.getItem(LS_INDEX) || '[]'); }
  catch { return []; }
}
function saveIndex(ix) { localStorage.setItem(LS_INDEX, JSON.stringify(ix)); }

function loadGame(id) {
  try { return JSON.parse(localStorage.getItem(LS_GAME(id))); }
  catch { return null; }
}
const persistGame = debounce(function () {
  if (!state.game) return;
  if (state.readOnly) return; // shared/read-only games never persist
  state.game.updatedAt = nowISO();
  try {
    const json = JSON.stringify(state.game);
    if (json.length > 4 * 1024 * 1024) {
      toast('This game is over 4MB. Consider exporting and clearing.', 'error');
    }
    localStorage.setItem(LS_GAME(state.game.id), json);
    const ix = loadIndex();
    const i = ix.findIndex(g => g.id === state.game.id);
    const entry = { id: state.game.id, opponent: state.game.opponent, date: state.game.date };
    if (i >= 0) ix[i] = entry; else ix.push(entry);
    saveIndex(ix);
  } catch (e) {
    toast('Save failed: ' + e.message, 'error');
  }
}, 400);

function deleteGameFromStorage(id) {
  localStorage.removeItem(LS_GAME(id));
  saveIndex(loadIndex().filter(g => g.id !== id));
}

function newGameObj({ opponent, date, season, homeAway, source }) {
  return {
    id: uid('g'),
    opponent: opponent || 'Opponent',
    date: date || new Date().toISOString().slice(0, 10),
    season: season || new Date().getFullYear(),
    homeAway: homeAway || 'home',
    source,
    markers: [],
    clips: [],
    quickTags: ['3rd down', 'red zone', 'explosive', 'TFL'],
    currentDrive: 1,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
}

function emptyOffense() {
  return { down: 1, distance: 10, yardLine: 25, hash: 'M', personnel: '11', formation: '',
           motion: false, playType: 'pass', concept: '', resultYards: 0,
           success: false, explosive: false, notes: '' };
}
function emptyDefense() {
  return { down: 1, distance: 10, yardLine: 25, front: '4-2-5', coverage: 'Cover 3',
           blitz: false, blitzer: '', resultYards: 0,
           tfl: false, sack: false, pbu: false, int: false, missedTackle: false, notes: '' };
}
function emptyST() {
  return { phase: 'punt', result: '', returnYards: 0, notes: '' };
}

// =================== VIDEO ADAPTERS ====================
// Common interface: play(), pause(), seek(t), getTime(), getDuration(),
//                   onTimeUpdate(cb), getVideoRect(), capabilities, destroy()

function Mp4Adapter(file, mountEl) {
  const video = document.createElement('video');
  video.src = URL.createObjectURL(file);
  video.controls = false;
  video.playsInline = true;
  video.preload = 'auto';
  mountEl.appendChild(video);

  let timeCb = null;
  video.addEventListener('timeupdate', () => timeCb && timeCb(video.currentTime));
  video.addEventListener('loadedmetadata', () => timeCb && timeCb(video.currentTime));

  return {
    kind: 'mp4',
    el: video,
    videoEl: video,
    play: () => video.play(),
    pause: () => video.pause(),
    seek: (t) => { video.currentTime = clamp(t, 0, video.duration || 0); },
    getTime: () => video.currentTime || 0,
    getDuration: () => video.duration || 0,
    isPaused: () => video.paused,
    onTimeUpdate: (cb) => { timeCb = cb; },
    getVideoRect: () => ({ width: video.videoWidth || 1920, height: video.videoHeight || 1080 }),
    frameStep: (dir) => { video.pause(); video.currentTime = clamp(video.currentTime + dir * (1 / 30), 0, video.duration || 0); },
    setRate: (r) => { video.playbackRate = r; },
    capabilities: { frameStep: true, mediaRecorder: true, scrub: true, control: true, speed: true },
    destroy: () => {
      try { URL.revokeObjectURL(video.src); } catch {}
      video.remove();
    },
  };
}

function extractYouTubeId(input) {
  if (!input) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
  const m = input.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

async function YouTubeAdapter(videoId, mountEl) {
  await window.YT_API_READY;
  // YT IFrame API replaces the element it mounts to with an iframe — give it a fresh div
  const host = document.createElement('div');
  host.id = 'yt-player-' + uid();
  mountEl.appendChild(host);

  let player = null;
  let timeCb = null;
  let pollTimer = null;
  let lastErr = null;

  await new Promise((resolve) => {
    player = new YT.Player(host.id, {
      videoId,
      playerVars: {
        controls: 1, modestbranding: 1, rel: 0, enablejsapi: 1,
        origin: location.origin,
        playsinline: 1,
      },
      events: {
        onReady: () => resolve(),
        onError: (e) => {
          lastErr = e.data;
          if (e.data === 101 || e.data === 150) {
            toast('This YouTube video disallows embedding. Try a different URL or upload the MP4.', 'error');
          } else {
            toast('YouTube error: ' + e.data, 'error');
          }
        },
      },
    });
  });

  pollTimer = setInterval(() => {
    if (timeCb && player && player.getCurrentTime) {
      try { timeCb(player.getCurrentTime() || 0); } catch {}
    }
  }, 250);

  return {
    kind: 'youtube',
    play: () => player.playVideo(),
    pause: () => player.pauseVideo(),
    seek: (t) => player.seekTo(Math.max(0, t), true),
    getTime: () => { try { return player.getCurrentTime() || 0; } catch { return 0; } },
    getDuration: () => { try { return player.getDuration() || 0; } catch { return 0; } },
    isPaused: () => { try { return player.getPlayerState() !== YT.PlayerState.PLAYING; } catch { return true; } },
    onTimeUpdate: (cb) => { timeCb = cb; },
    getVideoRect: () => ({ width: 1920, height: 1080 }),
    setRate: (r) => { try { player.setPlaybackRate(r); } catch {} },
    capabilities: { frameStep: false, mediaRecorder: false, scrub: true, control: true, speed: true },
    destroy: () => {
      clearInterval(pollTimer);
      try { player.destroy(); } catch {}
    },
  };
}

function IframeAdapter(embedUrl, mountEl) {
  const iframe = document.createElement('iframe');
  iframe.src = embedUrl;
  iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
  iframe.setAttribute('allowfullscreen', 'true');
  mountEl.appendChild(iframe);

  // Wall-clock stopwatch state (user-controlled). Time comes from there.
  let timeCb = null;
  return {
    kind: 'iframe',
    play: () => toast('Use the embedded player\'s own controls for iframe sources.'),
    pause: () => {},
    seek: () => toast('Iframe sources can\'t be seeked programmatically.'),
    getTime: () => state._iframeStopwatchTime || 0,
    getDuration: () => 0,
    isPaused: () => true,
    onTimeUpdate: (cb) => { timeCb = cb; state._iframeTimeCb = cb; },
    getVideoRect: () => ({ width: 1920, height: 1080 }),
    capabilities: { frameStep: false, mediaRecorder: false, scrub: false, control: false, speed: false },
    destroy: () => { iframe.remove(); },
  };
}

// =================== ADAPTER LIFECYCLE ====================
async function attachAdapter() {
  const mount = $('#videoMount');
  mount.innerHTML = '';
  if (state.adapter) { try { state.adapter.destroy(); } catch {} state.adapter = null; }
  if (!state.game) { showEmptyVideo(true); return; }

  const src = state.game.source;
  $('#reattachBanner').classList.add('hidden');
  $('#stopwatch').classList.add('hidden');

  try {
    if (src.kind === 'youtube') {
      state.adapter = await YouTubeAdapter(src.ytId, mount);
    } else if (src.kind === 'mp4') {
      if (!state.mp4File) {
        $('#reattachFileName').textContent = src.fileName ? `"${src.fileName}"` : '';
        $('#reattachBanner').classList.remove('hidden');
        showEmptyVideo(true);
        return;
      }
      state.adapter = Mp4Adapter(state.mp4File, mount);
    } else if (src.kind === 'iframe') {
      state.adapter = IframeAdapter(src.embedUrl, mount);
      $('#stopwatch').classList.remove('hidden');
    }
  } catch (e) {
    toast('Failed to load video: ' + e.message, 'error');
    showEmptyVideo(true);
    return;
  }

  showEmptyVideo(false);
  state.adapter.onTimeUpdate(onTimeUpdate);
  // Restore previous speed if adapter supports it
  if (state.adapter.capabilities.speed && state.adapter.setRate) {
    state.adapter.setRate(state.playbackRate || 1);
  }
  resizeOverlay();
  updateCapabilities();
}

function showEmptyVideo(show) {
  $('#videoEmpty').classList.toggle('hidden', !show);
}

function updateCapabilities() {
  const caps = state.adapter?.capabilities || { frameStep: false, mediaRecorder: false, control: false, speed: false };
  $('#btnFrameBack').disabled  = !caps.frameStep;
  $('#btnFrameFwd').disabled   = !caps.frameStep;
  $('#btnExportClip').disabled = !caps.mediaRecorder;
  $('#btnPlayPause').disabled  = !caps.control;
  $('#btnBack').disabled       = !caps.control;
  $('#btnFwd').disabled        = !caps.control;
  $('#speedSelect').disabled   = !caps.speed;
}

function onTimeUpdate(t) {
  const d = state.adapter?.getDuration() || 0;
  $('#timeReadout').textContent = `${fmtTime(t)} / ${fmtTime(d)}`;
  if (d > 0) $('#scrubber').value = String(Math.round((t / d) * 1000));
  // Manual loop (IN/OUT clip)
  if (state.loopActive && state.inPoint != null && state.outPoint != null) {
    if (t >= state.outPoint) state.adapter.seek(state.inPoint);
  }
  // Play-range loop: if the active marker has inTime/outTime, loop within it while playing
  const am = activeMarker();
  if (am && playRange(am) && state.adapter && !state.adapter.isPaused()) {
    const loopStart = (am.loopFromPreSnap && am.preSnapTime != null) ? am.preSnapTime : am.inTime;
    if (t >= am.outTime) {
      state.loopCycleCount = (state.loopCycleCount || 0) + 1;
      if (state.autoAdvance) {
        // Advance to the next play instead of looping again
        maybeAutoAdvance();
      } else {
        state.adapter.seek(loopStart);
      }
    }
  }
  // Track play state transitions for auto-clear / pin-to-clip
  if (state.adapter) {
    const paused = state.adapter.isPaused();
    if (state._wasPaused === undefined) state._wasPaused = paused;
    if (state._wasPaused && !paused) onPlaybackResumed();
    if (!state._wasPaused && paused) onPlaybackPaused();
    state._wasPaused = paused;
  }
}

function onPlaybackResumed() {
  if (!state.autoClearOnPlay) { state._drawingsHidden = false; renderStrokes(); return; }
  // Don't hide if pin-to-clip is on AND we have an active clip range
  if (state.pinDrawingsToClip && state.loopActive &&
      state.inPoint != null && state.outPoint != null) {
    state._drawingsHidden = false; renderStrokes(); return;
  }
  state._drawingsHidden = true;
  renderStrokes();
}

function onPlaybackPaused() {
  // Show drawings again when paused
  state._drawingsHidden = false;
  renderStrokes();
}

// =================== CANVAS / TELESTRATOR ====================
const overlay = () => $('#overlay');
function ctx() { return overlay().getContext('2d'); }

function resizeOverlay() {
  const wrap = $('#videoWrap');
  const o = overlay();
  const rect = wrap.getBoundingClientRect();
  // Use a high-resolution backing store (1280 wide max) for smooth strokes
  const targetW = 1280;
  const targetH = Math.round(targetW * (rect.height / rect.width));
  o.width = targetW;
  o.height = targetH;
  o.style.width = '100%';
  o.style.height = '100%';
  renderStrokes();
}

function setDrawMode(toolName) {
  state.tool = toolName;
  const o = overlay();
  o.style.pointerEvents = toolName ? 'auto' : 'none';
  o.style.cursor = toolName ? 'crosshair' : 'default';
  $$('.tool[data-tool]').forEach(b => b.classList.toggle('active', b.dataset.tool === toolName));
}

function getStrokes() {
  if (!state.activeMarkerId) return [];
  if (!state.strokes[state.activeMarkerId]) state.strokes[state.activeMarkerId] = [];
  return state.strokes[state.activeMarkerId];
}
function pushStroke(s) {
  if (!state.activeMarkerId) { toast('Mark a play first, then draw on it.'); return; }
  getStrokes().push(s);
  state.redoStacks[state.activeMarkerId] = [];
  renderStrokes();
  saveDrawingToMarker();
}

function renderStrokes() {
  const c = ctx();
  c.clearRect(0, 0, overlay().width, overlay().height);
  if (state._drawingsHidden) {
    if (state.currentStroke) drawShape(c, state.currentStroke);
    return;
  }
  for (const s of getStrokes()) drawShape(c, s);
  if (state.currentStroke) drawShape(c, state.currentStroke);
}

function drawShape(c, s) {
  c.strokeStyle = s.color;
  c.fillStyle = s.color;
  c.lineWidth = s.width;
  c.lineCap = 'round';
  c.lineJoin = 'round';

  if (s.type === 'pen') {
    c.beginPath();
    s.pts.forEach((p, i) => i === 0 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y));
    c.stroke();
  } else if (s.type === 'arrow') {
    const { x1, y1, x2, y2 } = s;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const head = 14 + s.width * 1.5;
    c.beginPath();
    c.moveTo(x2, y2);
    c.lineTo(x2 - head * Math.cos(ang - Math.PI / 7), y2 - head * Math.sin(ang - Math.PI / 7));
    c.lineTo(x2 - head * Math.cos(ang + Math.PI / 7), y2 - head * Math.sin(ang + Math.PI / 7));
    c.closePath();
    c.fill();
  } else if (s.type === 'ellipse') {
    const cx = (s.x1 + s.x2) / 2, cy = (s.y1 + s.y2) / 2;
    const rx = Math.abs(s.x2 - s.x1) / 2, ry = Math.abs(s.y2 - s.y1) / 2;
    c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); c.stroke();
  } else if (s.type === 'rect') {
    c.strokeRect(Math.min(s.x1, s.x2), Math.min(s.y1, s.y2), Math.abs(s.x2 - s.x1), Math.abs(s.y2 - s.y1));
  } else if (s.type === 'text') {
    c.font = `bold ${16 + s.width * 2}px Inter, sans-serif`;
    c.fillText(s.text, s.x, s.y);
  } else if (s.type === 'legacyPng') {
    if (!s._img) {
      s._img = new Image();
      s._img.onload = () => renderStrokes();
      s._img.src = s.png;
      return;
    }
    if (s._img.complete) c.drawImage(s._img, 0, 0, overlay().width, overlay().height);
  }
}

function canvasPos(e) {
  const o = overlay();
  const rect = o.getBoundingClientRect();
  const sx = o.width / rect.width;
  const sy = o.height / rect.height;
  return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
}

function wireCanvas() {
  const o = overlay();
  o.addEventListener('mousedown', (e) => {
    if (!state.tool) return;
    state.isDrawing = true;
    const p = canvasPos(e);
    state.drawStart = p;
    if (state.tool === 'pen') {
      state.currentStroke = { type: 'pen', color: state.penColor, width: state.penWidth, pts: [p] };
    } else if (state.tool === 'text') {
      const txt = prompt('Text:');
      state.isDrawing = false;
      if (txt) pushStroke({ type: 'text', text: txt, x: p.x, y: p.y, color: state.penColor, width: state.penWidth });
    } else {
      state.currentStroke = { type: state.tool, color: state.penColor, width: state.penWidth,
                              x1: p.x, y1: p.y, x2: p.x, y2: p.y };
    }
  });
  o.addEventListener('mousemove', (e) => {
    if (!state.isDrawing || !state.currentStroke) return;
    const p = canvasPos(e);
    if (state.currentStroke.type === 'pen') state.currentStroke.pts.push(p);
    else { state.currentStroke.x2 = p.x; state.currentStroke.y2 = p.y; }
    renderStrokes();
  });
  function endDraw() {
    if (state.isDrawing && state.currentStroke) {
      pushStroke(state.currentStroke);
      state.currentStroke = null;
    }
    state.isDrawing = false;
  }
  o.addEventListener('mouseup', endDraw);
  o.addEventListener('mouseleave', endDraw);
}

function saveDrawingToMarker() {
  if (!state.activeMarkerId || !state.game) return;
  const m = state.game.markers.find(x => x.id === state.activeMarkerId);
  if (!m) return;
  m.strokes = getStrokes().slice();
  m.drawingPng = null; // legacy field — no longer used as source of truth
  persistGame();
}

function restoreDrawingForMarker(m) {
  state.activeMarkerId = m ? m.id : null;
  if (!m) { renderStrokes(); return; }
  // Hydrate strokes from saved data if not already cached
  if (!state.strokes[m.id]) {
    if (Array.isArray(m.strokes) && m.strokes.length) {
      state.strokes[m.id] = m.strokes.slice();
    } else if (m.drawingPng) {
      // Legacy: marker saved before stroke persistence existed.
      // Show the PNG once as a backdrop. New strokes will replace it.
      state.strokes[m.id] = [{ type: 'legacyPng', png: m.drawingPng }];
    } else {
      state.strokes[m.id] = [];
    }
  }
  renderStrokes();
}

function undo() {
  const ss = getStrokes();
  if (!ss.length) return;
  const s = ss.pop();
  if (!state.redoStacks[state.activeMarkerId]) state.redoStacks[state.activeMarkerId] = [];
  state.redoStacks[state.activeMarkerId].push(s);
  renderStrokes(); saveDrawingToMarker();
}
function redo() {
  const r = state.redoStacks[state.activeMarkerId];
  if (!r || !r.length) return;
  getStrokes().push(r.pop());
  renderStrokes(); saveDrawingToMarker();
}
function clearDraw() {
  if (!state.activeMarkerId) return;
  state.strokes[state.activeMarkerId] = [];
  state.redoStacks[state.activeMarkerId] = [];
  const m = state.game.markers.find(x => x.id === state.activeMarkerId);
  if (m) { m.strokes = []; m.drawingPng = null; }
  renderStrokes(); persistGame();
}

async function snapshot() {
  if (!state.adapter) { toast('No video loaded.'); return; }
  const rect = state.adapter.getVideoRect();
  const c = document.createElement('canvas');
  c.width = rect.width; c.height = rect.height;
  const cc = c.getContext('2d');
  cc.fillStyle = '#000'; cc.fillRect(0, 0, c.width, c.height);
  if (state.adapter.kind === 'mp4') {
    try { cc.drawImage(state.adapter.videoEl, 0, 0, c.width, c.height); }
    catch (e) { toast('Snapshot frame failed.'); }
  } else {
    cc.fillStyle = '#0C2340';
    cc.fillRect(0, 0, c.width, c.height);
    cc.fillStyle = '#FAF7F2';
    cc.font = 'bold 48px Inter, sans-serif';
    cc.textAlign = 'center';
    cc.fillText('Drawing only — frame export requires MP4 source', c.width / 2, c.height / 2);
  }
  cc.drawImage(overlay(), 0, 0, c.width, c.height);
  c.toBlob((blob) => {
    if (!blob) return toast('Snapshot failed.', 'error');
    const t = state.adapter.getTime();
    const m = activeMarker();
    const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
    const parts = ['huddle-snap', slug(state.game.opponent)];
    if (m && m.quarter) parts.push('q' + slug(m.quarter));
    if (m && m.title) parts.push(slug(m.title));
    parts.push(fmtTime(t).replace(':', 'm'));
    downloadBlob(blob, parts.filter(Boolean).join('-') + '.png');
  }, 'image/png');
}

// =================== MARKERS ====================
function markPlay() {
  if (!state.game || !state.adapter) { toast('Load a game first.'); return; }
  const now = state.adapter.getTime();
  // Range mode: both IN and OUT set, OUT after IN -> capture as play range
  // Quick mode: no IN/OUT set -> single timestamp marker (legacy)
  let inT, outT, anchor;
  const haveRange = state.inPoint != null && state.outPoint != null && state.outPoint > state.inPoint;
  if (haveRange) {
    inT = state.inPoint; outT = state.outPoint;
    anchor = inT;
  } else {
    anchor = now;
    inT = null; outT = null;
  }
  const m = {
    id: uid('m'),
    time: anchor,
    inTime: inT,
    outTime: outT,
    preSnapTime: null,
    drive: state.currentDrive || 1,
    quarter: '',
    title: haveRange
      ? `Play ${fmtTime(inT)}–${fmtTime(outT)}`
      : `Play at ${fmtTime(now)}`,
    playType: 'offense',
    notes: '',
    comments: [],
    tags: [],
    offense: emptyOffense(),
    defense: null,
    st: null,
    strokes: [],
  };
  state.game.markers.push(m);
  state.game.markers.sort((a, b) => playStart(a) - playStart(b));
  setActiveMarker(m.id);
  // Consume the IN/OUT once they're stored on the play
  if (haveRange) { state.inPoint = null; state.outPoint = null; renderIO(); }
  renderMarkerList();
  renderPlayPane();
  renderQuickStats();
  persistGame();
  toast(haveRange
    ? `Marked play ${fmtTime(inT)}–${fmtTime(outT)} (${(outT - inT).toFixed(1)}s)`
    : 'Marked play at ' + fmtTime(now));
}

// Returns the start time of a marker (inTime if set, else legacy time)
function playStart(m) { return m.inTime != null ? m.inTime : m.time; }
function playEnd(m)   { return m.outTime != null ? m.outTime : null; }
function playRange(m) { return playEnd(m) != null; }

function setActiveMarker(id) {
  state.activeMarkerId = id;
  state.loopCycleCount = 0;
  const m = state.game?.markers.find(x => x.id === id);
  if (m && state.adapter && state.adapter.capabilities.control) {
    const seekTo = (m.loopFromPreSnap && m.preSnapTime != null) ? m.preSnapTime : playStart(m);
    state.adapter.seek(seekTo);
    state.adapter.pause();
  }
  restoreDrawingForMarker(m);
  renderMarkerList();
  renderPlayPane();
}

function nudgeActiveMarkerTime(delta) {
  const m = activeMarker();
  if (!m) return;
  if (m.inTime != null) {
    // Shift the whole range so the play duration stays the same
    const newIn = Math.max(0, m.inTime + delta);
    const dur = (m.outTime != null) ? (m.outTime - m.inTime) : 0;
    m.inTime = newIn;
    if (m.outTime != null) m.outTime = newIn + dur;
    m.time = newIn;
  } else {
    m.time = Math.max(0, m.time + delta);
  }
  state.game.markers.sort((a, b) => playStart(a) - playStart(b));
  if (state.adapter && state.adapter.capabilities.control) state.adapter.seek(playStart(m));
  renderMarkerList();
  renderPlayPane();
  persistGame();
}

function gotoAdjacentMarker(dir) {
  if (!state.game || !state.game.markers.length) return;
  // Walk only within the filtered list so [/] respects the active filter
  const filtered = state.game.markers.filter(passesListFilters);
  const ms = (filtered.length ? filtered : state.game.markers).slice().sort((a, b) => playStart(a) - playStart(b));
  const idx = ms.findIndex(x => x.id === state.activeMarkerId);
  let next;
  if (idx < 0) {
    next = dir > 0 ? ms[0] : ms[ms.length - 1];
  } else {
    next = ms[clamp(idx + dir, 0, ms.length - 1)];
  }
  if (next) setActiveMarker(next.id);
}

// =================== DUPLICATE PLAY (#1) ====================
function duplicatePlay(id) {
  if (!state.game) return;
  const src = state.game.markers.find(m => m.id === id);
  if (!src) return;
  // Deep clone, give it a new id, offset the timestamp by the play duration (or +5s)
  const offset = playRange(src) ? (src.outTime - src.inTime) : 5;
  const clone = JSON.parse(JSON.stringify(src));
  clone.id = uid('m');
  clone.time = src.time + offset;
  if (clone.inTime != null) clone.inTime = src.inTime + offset;
  if (clone.outTime != null) clone.outTime = src.outTime + offset;
  if (clone.preSnapTime != null) clone.preSnapTime = src.preSnapTime + offset;
  clone.title = (src.title || 'Play') + ' (copy)';
  clone.strokes = [];           // start with no drawings
  clone.drawingPng = null;
  clone.comments = [];          // fresh comment thread
  state.game.markers.push(clone);
  state.game.markers.sort((a, b) => playStart(a) - playStart(b));
  setActiveMarker(clone.id);
  renderMarkerList(); renderPlayPane(); renderQuickStats();
  persistGame();
  toast(`Duplicated "${src.title}"`);
}

// =================== LIST FILTERS (#5) ====================
function passesListFilters(m) {
  if (state.listFilterPT && m.playType !== state.listFilterPT) return false;
  if (state.listFilterQuarter && m.quarter !== state.listFilterQuarter) return false;
  if (state.listFilterDown) {
    const bucket = m[m.playType];
    if (!bucket || String(bucket.down || '') !== state.listFilterDown) return false;
  }
  if (state.listFilterTag && !(m.tags || []).includes(state.listFilterTag)) return false;
  if (state.listFilterDrive && String(m.drive || '') !== state.listFilterDrive) return false;
  // Search box
  if (state.search) {
    const q = state.search.toLowerCase();
    const hay = `${m.title} ${m.notes || ''} ${(m.tags || []).join(' ')}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function clearListFilters() {
  state.listFilterPT = state.listFilterQuarter = state.listFilterDown = state.listFilterTag = state.listFilterDrive = '';
  state.search = '';
  $('#listFilterPT').value = '';
  $('#listFilterQuarter').value = '';
  $('#listFilterDown').value = '';
  $('#listFilterTag').value = '';
  $('#listFilterDrive').value = '';
  $('#markerSearch').value = '';
  renderMarkerList();
}

// =================== BULK SELECT (#2) ====================
function toggleSelect(id, withShift, withCtrl) {
  if (withShift && state.selectAnchorId) {
    // Range select within the currently-visible (filtered) list
    const visible = state.game.markers.filter(passesListFilters).sort((a, b) => playStart(a) - playStart(b));
    const a = visible.findIndex(m => m.id === state.selectAnchorId);
    const b = visible.findIndex(m => m.id === id);
    if (a >= 0 && b >= 0) {
      const [lo, hi] = a < b ? [a, b] : [b, a];
      for (let i = lo; i <= hi; i++) state.selectedIds.add(visible[i].id);
    }
  } else if (withCtrl) {
    if (state.selectedIds.has(id)) state.selectedIds.delete(id);
    else state.selectedIds.add(id);
    state.selectAnchorId = id;
  } else {
    // No modifier: treat as plain click — clear selection, navigate
    state.selectedIds.clear();
    state.selectAnchorId = id;
  }
  updateBulkBar();
  renderMarkerList();
}

function clearSelection() {
  state.selectedIds.clear();
  state.selectAnchorId = null;
  updateBulkBar();
  renderMarkerList();
}

function updateBulkBar() {
  const bar = $('#bulkBar');
  const n = state.selectedIds.size;
  if (n > 1) {
    bar.classList.remove('hidden');
    $('#bulkCount').textContent = `${n} selected`;
  } else {
    bar.classList.add('hidden');
  }
}

function bulkTag(tag) {
  if (!tag) return;
  const v = tag.trim();
  if (!v) return;
  let count = 0;
  for (const id of state.selectedIds) {
    const m = state.game.markers.find(x => x.id === id);
    if (!m) continue;
    if (!Array.isArray(m.tags)) m.tags = [];
    if (!m.tags.includes(v)) { m.tags.push(v); count++; }
  }
  persistGame();
  renderMarkerList(); renderPlayPane();
  refreshTagFilter(); refreshTagSuggestions();
  toast(`Tagged ${count} plays with "${v}"`);
}

function bulkDelete() {
  const n = state.selectedIds.size;
  if (!n) return;
  if (!confirm(`Delete ${n} plays? Can't be undone.`)) return;
  for (const id of state.selectedIds) {
    state.game.markers = state.game.markers.filter(m => m.id !== id);
    delete state.strokes[id];
    if (state.activeMarkerId === id) state.activeMarkerId = null;
  }
  clearSelection();
  renderAll(); persistGame();
  toast(`Deleted ${n} plays.`);
}

function bulkSetPlayType(pt) {
  let count = 0;
  for (const id of state.selectedIds) {
    const m = state.game.markers.find(x => x.id === id);
    if (!m) continue;
    m.playType = pt;
    if (pt === 'offense' && !m.offense) m.offense = emptyOffense();
    if (pt === 'defense' && !m.defense) m.defense = emptyDefense();
    if (pt === 'st' && !m.st) m.st = emptyST();
    count++;
  }
  persistGame(); renderMarkerList(); renderPlayPane();
  toast(`Set ${count} plays to ${pt}`);
}

// =================== DRIVES (#3) ====================
function newDrive() {
  if (!state.game) return;
  state.currentDrive = (state.game.currentDrive || 1) + 1;
  state.game.currentDrive = state.currentDrive;
  persistGame();
  toast(`Drive ${state.currentDrive} — next marked play starts the new drive.`);
}

function refreshDriveFilters() {
  if (!state.game) return;
  const drives = [...new Set(state.game.markers.map(m => m.drive).filter(Boolean))].sort((a, b) => a - b);
  for (const id of ['filterDrive', 'listFilterDrive']) {
    const sel = $('#' + id);
    if (!sel) continue;
    const cur = sel.value;
    sel.innerHTML = '<option value="">' + (id === 'listFilterDrive' ? 'Dr —' : 'All') + '</option>' +
      drives.map(d => `<option ${String(d)===cur?'selected':''}>${d}</option>`).join('');
  }
}

// =================== QUICK TAGS (#4) ====================
function renderQuickTagBar() {
  const wrap = $('#quickTagChips');
  if (!wrap) return;
  if (!state.game) { wrap.innerHTML = ''; return; }
  if (!Array.isArray(state.game.quickTags)) state.game.quickTags = [];
  wrap.innerHTML = state.game.quickTags.map(t =>
    `<button class="qt-chip" data-qt="${escapeHTML(t)}">${escapeHTML(t)} <span class="qt-x" title="Remove preset">×</span></button>`
  ).join('');
  wrap.querySelectorAll('.qt-chip').forEach(btn => {
    btn.addEventListener('click', e => {
      if (e.target.classList.contains('qt-x')) {
        state.game.quickTags = state.game.quickTags.filter(t => t !== btn.dataset.qt);
        persistGame(); renderQuickTagBar(); return;
      }
      const m = activeMarker();
      if (!m) { toast('No active play. Mark a play first.'); return; }
      if (!Array.isArray(m.tags)) m.tags = [];
      const t = btn.dataset.qt;
      if (m.tags.includes(t)) {
        m.tags = m.tags.filter(x => x !== t);
        toast(`Removed "${t}" from this play`);
      } else {
        m.tags.push(t);
        toast(`Tagged with "${t}"`);
      }
      persistGame(); renderTagChips(); refreshTagFilter(); renderStatsIfActive();
    });
  });
}

function addQuickTagPreset() {
  const v = prompt('Preset tag name:');
  if (!v) return;
  if (!state.game) return;
  if (!Array.isArray(state.game.quickTags)) state.game.quickTags = [];
  if (!state.game.quickTags.includes(v.trim())) {
    state.game.quickTags.push(v.trim());
    persistGame(); renderQuickTagBar();
  }
}

// =================== AUTO-ADVANCE (#6) ====================
function maybeAutoAdvance() {
  if (!state.autoAdvance) return;
  const am = activeMarker();
  if (!am || !playRange(am)) return;
  // Move to the next marker in the filtered list
  gotoAdjacentMarker(+1);
  state.adapter && state.adapter.play();
}

// =================== COMMENTS (#8) ====================
function addComment() {
  const m = activeMarker();
  if (!m) return;
  const author = $('#commentAuthor').value.trim() || 'Anonymous';
  const body = $('#commentBody').value.trim();
  if (!body) return;
  if (!Array.isArray(m.comments)) m.comments = [];
  m.comments.push({ id: uid('c'), author, body, at: nowISO() });
  $('#commentBody').value = '';
  renderComments(); persistGame();
}

function renderComments() {
  const list = $('#commentsList');
  const m = activeMarker();
  if (!m || !Array.isArray(m.comments)) { if (list) list.innerHTML = ''; return; }
  list.innerHTML = m.comments.map(c => `
    <li class="comment">
      <div class="comment-head">
        <strong>${escapeHTML(c.author)}</strong>
        <span class="muted small">${new Date(c.at).toLocaleString()}</span>
        ${state.readOnly ? '' : `<button class="comment-del" data-cid="${c.id}" title="Delete">×</button>`}
      </div>
      <div class="comment-body">${escapeHTML(c.body)}</div>
    </li>
  `).join('');
  list.querySelectorAll('.comment-del').forEach(b => b.addEventListener('click', () => {
    m.comments = m.comments.filter(c => c.id !== b.dataset.cid);
    renderComments(); persistGame();
  }));
}

// =================== CSV EXPORT (#10) ====================
function exportCSV() {
  if (!state.game) { toast('No game loaded.'); return; }
  const rows = [];
  const header = [
    'play_id','title','time','in_time','out_time','pre_snap','duration','drive','quarter','play_type',
    'down','distance','yard_line','hash','personnel','formation','motion',
    'off_play_type','concept','result_yards','success','explosive',
    'def_front','def_coverage','blitz','blitzer','def_result','tfl','sack','pbu','int','missed_tackle',
    'st_phase','st_result','return_yards',
    'tags','notes','comment_count'
  ];
  rows.push(header.map(csvField).join(','));
  for (const m of state.game.markers) {
    const o = m.offense || {};
    const d = m.defense || {};
    const s = m.st || {};
    const dur = playRange(m) ? (m.outTime - m.inTime).toFixed(2) : '';
    const row = [
      m.id, m.title, fmtTimePrecise(m.time),
      m.inTime != null ? fmtTimePrecise(m.inTime) : '',
      m.outTime != null ? fmtTimePrecise(m.outTime) : '',
      m.preSnapTime != null ? fmtTimePrecise(m.preSnapTime) : '',
      dur, m.drive || '', m.quarter || '', m.playType,
      o.down || '', o.distance || '', o.yardLine || '', o.hash || '', o.personnel || '', o.formation || '', o.motion ? 'Y' : '',
      o.playType || '', o.concept || '', o.resultYards != null ? o.resultYards : '', o.success ? 'Y' : '', o.explosive ? 'Y' : '',
      d.front || '', d.coverage || '', d.blitz ? 'Y' : '', d.blitzer || '', d.resultYards != null ? d.resultYards : '',
      d.tfl ? 'Y' : '', d.sack ? 'Y' : '', d.pbu ? 'Y' : '', d.int ? 'Y' : '', d.missedTackle ? 'Y' : '',
      s.phase || '', s.result || '', s.returnYards != null ? s.returnYards : '',
      (m.tags || []).join('; '), m.notes || '', (m.comments || []).length
    ];
    rows.push(row.map(csvField).join(','));
  }
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  downloadBlob(blob, `huddle-${slug(state.game.opponent)}-${state.game.date}.csv`);
  toast('CSV exported.');
}
function csvField(v) {
  const s = String(v == null ? '' : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function fmtTimePrecise(s) { return Number(s || 0).toFixed(2); }

// =================== SHARE LINK (#7) ====================
function openShareModal() {
  if (!state.game) { toast('No game loaded.'); return; }
  refreshShareTagSelect();
  $('#shareModal').classList.remove('hidden');
  updateShareLink();
}
function refreshShareTagSelect() {
  const sel = $('#shareTag');
  sel.innerHTML = '<option value="">All plays</option>' +
    allGameTags().map(t => `<option>${escapeHTML(t)}</option>`).join('');
}
function updateShareLink() {
  if (!state.game) return;
  const filterTag = $('#shareTag').value;
  const filterPT = $('#sharePT').value;
  let markers = state.game.markers;
  if (filterTag) markers = markers.filter(m => (m.tags || []).includes(filterTag));
  if (filterPT) markers = markers.filter(m => m.playType === filterPT);
  const shareGame = {
    opponent: state.game.opponent, date: state.game.date, season: state.game.season,
    homeAway: state.game.homeAway, source: state.game.source,
    markers, clips: state.game.clips, quickTags: state.game.quickTags,
  };
  const json = JSON.stringify(shareGame);
  let payload;
  try {
    // Compress via simple base64 (most URLs handle it). For real size wins we'd need pako, but stay dependency-free.
    payload = encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  } catch {
    payload = encodeURIComponent(json);
  }
  const url = `${location.origin}${location.pathname}#share=${payload}`;
  $('#shareLink').value = url;
  const kb = (url.length / 1024).toFixed(1);
  $('#shareLinkSize').textContent = `${markers.length} plays · ~${kb} KB link${url.length > 8000 ? ' (browser limit ~8KB — consider exporting JSON instead)' : ''}`;
}
function loadShareFromURL() {
  const h = location.hash || '';
  const mm = h.match(/^#share=(.+)$/);
  if (!mm) return false;
  try {
    const raw = decodeURIComponent(mm[1]);
    let json;
    try { json = decodeURIComponent(escape(atob(raw))); }
    catch { json = raw; }
    const g = JSON.parse(json);
    g.id = uid('g_share');
    g.updatedAt = nowISO();
    state.game = g;
    state.readOnly = true;
    state.mp4File = null;
    document.body.classList.add('read-only');
    refreshGameSelect();
    attachAdapter();
    renderAll();
    toast('Loaded shared breakdown (read-only).');
    return true;
  } catch (e) {
    toast('Failed to load shared link: ' + e.message, 'error');
    return false;
  }
}

// =================== COMPARE (#11) ====================
function openCompareView() {
  $('#compareView').classList.remove('hidden');
  const ix = loadIndex().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  for (const id of ['cmpGameA', 'cmpGameB']) {
    const sel = $('#' + id);
    sel.innerHTML = '<option value="">— Pick a game —</option>' +
      ix.map(g => `<option value="${g.id}">${escapeHTML(g.opponent)} — ${g.date || ''}</option>`).join('');
  }
  if (state.game) $('#cmpGameA').value = state.game.id;
  renderCompare();
}
function closeCompareView() {
  $('#compareView').classList.add('hidden');
}
function renderCompare() {
  const aId = $('#cmpGameA').value, bId = $('#cmpGameB').value;
  const a = aId ? loadGame(aId) : null;
  const b = bId ? loadGame(bId) : null;
  if (!a || !b) {
    $('#compareBody').innerHTML = '<p class="muted">Pick two games to compare.</p>';
    return;
  }
  const sA = computeStats(a.markers), sB = computeStats(b.markers);
  const rows = [
    ['Plays', a.markers.length, b.markers.length],
    ['Offense plays', sA.offPlays, sB.offPlays],
    ['Off Y/P', num(sA.ypp, 1), num(sB.ypp, 1)],
    ['Success rate', sA.offPlays ? pct(sA.success/sA.offPlays) : '—', sB.offPlays ? pct(sB.success/sB.offPlays) : '—'],
    ['Explosive', sA.explosive, sB.explosive],
    ['3rd-down %', sA.third ? pct(sA.thirdConv) : '—', sB.third ? pct(sB.thirdConv) : '—'],
    ['Defense plays', sA.defPlays, sB.defPlays],
    ['Yards allowed/play', num(sA.ypa, 1), num(sB.ypa, 1)],
    ['TFLs', sA.tfls, sB.tfls],
    ['Sacks', sA.sacks, sB.sacks],
    ['Takeaways', sA.takeaways, sB.takeaways],
    ['Missed tackles', sA.missed, sB.missed],
  ];
  $('#compareBody').innerHTML = `
    <table class="compare-table">
      <thead><tr><th></th><th>${escapeHTML(a.opponent)}<br><span class="muted small">${a.date}</span></th><th>${escapeHTML(b.opponent)}<br><span class="muted small">${b.date}</span></th></tr></thead>
      <tbody>${rows.map(([k, va, vb]) => `<tr><td><strong>${k}</strong></td><td>${va}</td><td>${vb}</td></tr>`).join('')}</tbody>
    </table>
  `;
}

// =================== VIEW MODE (#14) ====================
function setViewMode(mode) {
  state.viewMode = mode;
  document.body.classList.remove('vm-review', 'vm-gameday', 'vm-compare');
  document.body.classList.add('vm-' + mode);
  $$('.vm').forEach(b => b.classList.toggle('active', b.dataset.vm === mode));
  if (mode === 'compare') openCompareView();
  else closeCompareView();
}

function deletePlay(id) {
  if (!state.game) return;
  if (!confirm('Delete this play?')) return;
  state.game.markers = state.game.markers.filter(m => m.id !== id);
  delete state.strokes[id];
  if (state.activeMarkerId === id) state.activeMarkerId = null;
  renderMarkerList();
  renderPlayPane();
  renderQuickStats();
  refreshTagFilter();
  refreshConceptSuggestions();
  persistGame();
}

function setPlayType(pt) {
  const m = activeMarker();
  if (!m) return;
  m.playType = pt;
  if (pt === 'offense' && !m.offense) m.offense = emptyOffense();
  if (pt === 'defense' && !m.defense) m.defense = emptyDefense();
  if (pt === 'st' && !m.st) m.st = emptyST();
  renderPlayPane();
  renderMarkerList();
  persistGame();
}

function activeMarker() {
  return state.game?.markers.find(m => m.id === state.activeMarkerId) || null;
}

// =================== SCHEMA FORMS ====================
function computeSuccess(off) {
  const r = +off.resultYards || 0, d = +off.distance || 10, dn = +off.down || 1;
  if (dn === 1) return r >= d * 0.5;
  if (dn === 2) return r >= d * 0.7;
  return r >= d;
}
function computeExplosive(off) {
  const r = +off.resultYards || 0;
  const isRun = off.playType === 'run';
  return isRun ? r >= 12 : r >= 16;
}

function renderSchemaForm() {
  const wrap = $('#schemaForm');
  const m = activeMarker();
  if (!m) { wrap.innerHTML = ''; return; }
  if (m.playType === 'offense') wrap.innerHTML = offenseFormHTML(m.offense);
  else if (m.playType === 'defense') wrap.innerHTML = defenseFormHTML(m.defense);
  else if (m.playType === 'st') wrap.innerHTML = stFormHTML(m.st);
  bindSchemaFormChange(m);
}

function offenseFormHTML(o) {
  return `
    <label>Down<select data-k="down">${[1,2,3,4].map(n => `<option ${o.down==n?'selected':''}>${n}</option>`).join('')}</select></label>
    <label>Distance<input type="number" data-k="distance" value="${o.distance}"></label>
    <label>Yard Line<input type="number" data-k="yardLine" value="${o.yardLine}"></label>
    <label>Hash
      <select data-k="hash">
        ${['L','M','R'].map(h => `<option ${o.hash===h?'selected':''}>${h}</option>`).join('')}
      </select>
    </label>
    <label>Personnel<input data-k="personnel" value="${o.personnel}" placeholder="11"></label>
    <label>Formation<input data-k="formation" value="${o.formation}" placeholder="Trips R"></label>
    <label>Play Type
      <select data-k="playType">
        ${['run','pass','rpo','screen','pa'].map(p => `<option ${o.playType===p?'selected':''}>${p}</option>`).join('')}
      </select>
    </label>
    <label>Concept<input data-k="concept" list="conceptList" value="${o.concept}" placeholder="Mesh, Stick, Counter…"></label>
    <label>Result (yards)<input type="number" data-k="resultYards" value="${o.resultYards}"></label>
    <div class="checkbox-row">
      <label><input type="checkbox" data-k="motion" ${o.motion?'checked':''}> Motion</label>
    </div>
    <div class="computed-badges">
      <span class="badge success ${o.success?'on':''}">${o.success?'✓ Success':'Success: no'}</span>
      <span class="badge ${o.explosive?'on':''}">${o.explosive?'★ Explosive':'Explosive: no'}</span>
    </div>
  `;
}
function defenseFormHTML(d) {
  return `
    <label>Down<select data-k="down">${[1,2,3,4].map(n => `<option ${d.down==n?'selected':''}>${n}</option>`).join('')}</select></label>
    <label>Distance<input type="number" data-k="distance" value="${d.distance}"></label>
    <label>Yard Line<input type="number" data-k="yardLine" value="${d.yardLine}"></label>
    <label>Front<input data-k="front" value="${d.front}" placeholder="4-2-5"></label>
    <label>Coverage
      <select data-k="coverage">
        ${['Cover 0','Cover 1','Cover 2','Cover 3','Cover 4','Cover 6','Quarters','Match'].map(c => `<option ${d.coverage===c?'selected':''}>${c}</option>`).join('')}
      </select>
    </label>
    <label>Blitzer<input data-k="blitzer" value="${d.blitzer}" placeholder="MIKE, NICKEL…"></label>
    <label>Result (yds allowed)<input type="number" data-k="resultYards" value="${d.resultYards}"></label>
    <label>&nbsp;<input data-k="_pad" style="visibility:hidden"></label>
    <div class="checkbox-row">
      <label><input type="checkbox" data-k="blitz" ${d.blitz?'checked':''}> Blitz</label>
      <label><input type="checkbox" data-k="tfl" ${d.tfl?'checked':''}> TFL</label>
      <label><input type="checkbox" data-k="sack" ${d.sack?'checked':''}> Sack</label>
      <label><input type="checkbox" data-k="pbu" ${d.pbu?'checked':''}> PBU</label>
      <label><input type="checkbox" data-k="int" ${d.int?'checked':''}> INT</label>
      <label><input type="checkbox" data-k="missedTackle" ${d.missedTackle?'checked':''}> Missed tackle</label>
    </div>
  `;
}
function stFormHTML(s) {
  return `
    <label>Phase
      <select data-k="phase">
        ${['kickoff','punt','fg','pat','onside'].map(p => `<option ${s.phase===p?'selected':''}>${p}</option>`).join('')}
      </select>
    </label>
    <label>Result<input data-k="result" value="${s.result}" placeholder="Made, Blocked, Returned…"></label>
    <label class="full">Return yards<input type="number" data-k="returnYards" value="${s.returnYards}"></label>
  `;
}

function bindSchemaFormChange(m) {
  const wrap = $('#schemaForm');
  wrap.querySelectorAll('[data-k]').forEach(el => {
    el.addEventListener('change', () => updateSchemaField(m, el));
    el.addEventListener('input',  () => updateSchemaField(m, el));
  });
}
function updateSchemaField(m, el) {
  const k = el.dataset.k;
  if (k === '_pad') return;
  let v;
  if (el.type === 'checkbox') v = el.checked;
  else if (el.type === 'number') v = el.value === '' ? '' : +el.value;
  else v = el.value;
  const bucket = m[m.playType];
  if (!bucket) return;
  bucket[k] = v;
  if (m.playType === 'offense') {
    m.offense.success = computeSuccess(m.offense);
    m.offense.explosive = computeExplosive(m.offense);
    if (k === 'concept') refreshConceptSuggestions();
    renderSchemaForm(); // re-render to update computed badges
  }
  persistGame();
  renderStatsIfActive();
  renderQuickStats();
}

// =================== RENDER: MARKER LIST ====================
function outcomeClass(m) {
  if (m.playType === 'offense' && m.offense) {
    if (m.offense.explosive) return 'outcome-explosive';
    if (m.offense.success)   return 'outcome-success';
    if (m.offense.resultYards != null && m.offense.resultYards !== '' && +m.offense.resultYards <= 0) return 'outcome-bad';
    if (m.offense.resultYards != null && m.offense.resultYards !== '') return 'outcome-fail';
  }
  if (m.playType === 'defense' && m.defense) {
    if (m.defense.sack || m.defense.tfl || m.defense.int) return 'outcome-success';
    if (m.defense.missedTackle) return 'outcome-bad';
  }
  return '';
}

function renderMarkerList() {
  const list = $('#markerList');
  list.innerHTML = '';
  if (!state.game) { $('#markerCount').textContent = '0'; return; }
  const items = state.game.markers.filter(passesListFilters);
  $('#markerCount').textContent = `${items.length}/${state.game.markers.length}`;
  for (const m of items) {
    const li = document.createElement('li');
    const isActive   = m.id === state.activeMarkerId;
    const isSelected = state.selectedIds.has(m.id);
    li.className = 'marker-item ' + outcomeClass(m) +
      (isActive ? ' active' : '') + (isSelected ? ' selected' : '');
    const tsLabel = playRange(m)
      ? `${fmtTime(m.inTime)}–${fmtTime(m.outTime)}`
      : fmtTime(m.time);
    const driveBadge = m.drive ? `<span class="drive-chip" title="Drive ${m.drive}">D${m.drive}</span>` : '';
    li.innerHTML = `
      <span class="ts-chip ${playRange(m) ? 'ts-range' : ''}">${tsLabel}</span>
      ${driveBadge}
      <span class="pt-chip ${m.playType}">${m.playType === 'st' ? 'ST' : m.playType.slice(0,3)}</span>
      <span class="marker-title">${escapeHTML(m.title || '(untitled)')}</span>
      ${state.readOnly ? '' : '<button class="marker-del" title="Delete">×</button>'}
    `;
    li.addEventListener('click', (e) => {
      if (e.target.classList.contains('marker-del')) { deletePlay(m.id); return; }
      // Shift / Ctrl = selection, plain click = navigate
      if (e.shiftKey) { toggleSelect(m.id, true, false); return; }
      if (e.ctrlKey || e.metaKey) { toggleSelect(m.id, false, true); return; }
      // Plain click — clear any selection and navigate
      if (state.selectedIds.size > 0) clearSelection();
      setActiveMarker(m.id);
      state.selectAnchorId = m.id;
    });
    li.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (state.readOnly) return;
      // Quick context menu: duplicate
      if (confirm(`Duplicate "${m.title}"?`)) duplicatePlay(m.id);
    });
    list.appendChild(li);
  }
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

// =================== RENDER: PLAY PANE ====================
function renderPlayPane() {
  const empty = $('#playPaneEmpty'), body = $('#playPaneBody');
  const m = activeMarker();
  if (!m) { empty.classList.remove('hidden'); body.classList.add('hidden'); return; }
  empty.classList.add('hidden'); body.classList.remove('hidden');

  $('#playTitle').value = m.title || '';
  $('#playTime').value = fmtTime(playStart(m));
  $('#playQuarter').value = m.quarter || '';
  $('#playNotes').value = m.notes || '';
  if ($('#playDrive')) $('#playDrive').value = m.drive || '';

  // Range row
  const outLabel = $('#playOutLabel');
  const durLabel = $('#playDuration');
  if (playRange(m)) {
    outLabel.textContent = fmtTime(m.outTime);
    durLabel.textContent = `${(m.outTime - m.inTime).toFixed(1)}s loop`;
  } else {
    outLabel.textContent = '—';
    durLabel.textContent = '';
  }

  // Pre-snap row
  const ps = $('#playPreSnapLabel');
  if (ps) ps.textContent = m.preSnapTime != null ? fmtTime(m.preSnapTime) : '—';
  const lps = $('#loopFromPreSnap');
  if (lps) lps.checked = !!m.loopFromPreSnap;

  $$('.pt').forEach(b => b.classList.toggle('active', b.dataset.pt === m.playType));
  renderSchemaForm();
  renderTagChips();
  refreshTagSuggestions();
  renderComments();
}

// =================== TAGS ====================
function renderTagChips() {
  const m = activeMarker();
  const ul = $('#tagChips');
  ul.innerHTML = '';
  if (!m) return;
  if (!Array.isArray(m.tags)) m.tags = [];
  for (const tag of m.tags) {
    const li = document.createElement('li');
    li.className = 'tag-chip';
    li.innerHTML = `<span>${escapeHTML(tag)}</span><button class="x" title="Remove">×</button>`;
    li.querySelector('.x').addEventListener('click', () => {
      m.tags = m.tags.filter(t => t !== tag);
      renderTagChips(); persistGame(); refreshTagFilter(); renderStatsIfActive();
    });
    ul.appendChild(li);
  }
}

function addTagFromInput() {
  const inp = $('#tagInput');
  const v = inp.value.trim();
  if (!v) return;
  const m = activeMarker();
  if (!m) return;
  if (!Array.isArray(m.tags)) m.tags = [];
  if (!m.tags.includes(v)) m.tags.push(v);
  inp.value = '';
  renderTagChips(); persistGame(); refreshTagFilter(); refreshTagSuggestions(); renderStatsIfActive();
}

function allGameTags() {
  if (!state.game) return [];
  const set = new Set();
  for (const mk of state.game.markers) {
    (mk.tags || []).forEach(t => set.add(t));
  }
  return [...set].sort();
}

function refreshTagSuggestions() {
  const dl = $('#tagSuggestions');
  if (!dl) return;
  dl.innerHTML = allGameTags().map(t => `<option value="${escapeHTML(t)}"></option>`).join('');
}

function refreshTagFilter() {
  const sel = $('#filterTag');
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">All</option>' +
    allGameTags().map(t => `<option ${t===cur?'selected':''}>${escapeHTML(t)}</option>`).join('');
}

// =================== CONCEPT AUTOCOMPLETE ====================
function refreshConceptSuggestions() {
  // Inject/refresh a <datalist id="conceptList"> reflecting all unique offense concepts used in this game.
  let dl = document.getElementById('conceptList');
  if (!dl) {
    dl = document.createElement('datalist');
    dl.id = 'conceptList';
    document.body.appendChild(dl);
  }
  const set = new Set();
  if (state.game) {
    for (const mk of state.game.markers) {
      if (mk.offense && mk.offense.concept) set.add(mk.offense.concept);
    }
  }
  dl.innerHTML = [...set].sort().map(c => `<option value="${escapeHTML(c)}"></option>`).join('');
}

// =================== CLIPS ====================
function setIn()  { if (!state.adapter) return; state.inPoint  = state.adapter.getTime(); renderIO(); }
function setOut() { if (!state.adapter) return; state.outPoint = state.adapter.getTime(); renderIO(); }
function renderIO() {
  $('#ioReadout').textContent = `IN: ${state.inPoint!=null?fmtTime(state.inPoint):'—'}   OUT: ${state.outPoint!=null?fmtTime(state.outPoint):'—'}`;
}
function toggleLoop() {
  if (state.inPoint == null || state.outPoint == null) { toast('Set IN and OUT first.'); return; }
  state.loopActive = !state.loopActive;
  $('#btnLoop').classList.toggle('t-btn-primary', state.loopActive);
  toast(state.loopActive ? 'Loop ON' : 'Loop OFF');
  if (state.loopActive && state.adapter) state.adapter.seek(state.inPoint);
}
function saveClip() {
  if (!state.game) return;
  if (state.inPoint == null || state.outPoint == null) { toast('Set IN and OUT first.'); return; }
  const name = prompt('Clip name:', `Clip ${state.game.clips.length + 1}`);
  if (!name) return;
  state.game.clips.push({ id: uid('c'), name, in: state.inPoint, out: state.outPoint, createdAt: nowISO() });
  renderClipList();
  persistGame();
}
function renderClipList() {
  const list = $('#clipList'); list.innerHTML = '';
  if (!state.game) { $('#clipCount').textContent = '0'; return; }
  $('#clipCount').textContent = String(state.game.clips.length);
  for (const c of state.game.clips) {
    const li = document.createElement('li');
    li.className = 'clip-item';
    li.innerHTML = `
      <span class="ts-chip">${fmtTime(c.in)}–${fmtTime(c.out)}</span>
      <span class="marker-title">${escapeHTML(c.name)}</span>
      <button class="marker-del" title="Delete">×</button>
    `;
    li.addEventListener('click', (e) => {
      if (e.target.classList.contains('marker-del')) {
        state.game.clips = state.game.clips.filter(x => x.id !== c.id);
        renderClipList(); persistGame(); return;
      }
      state.inPoint = c.in; state.outPoint = c.out;
      renderIO();
      if (state.adapter) state.adapter.seek(c.in);
    });
    list.appendChild(li);
  }
}

async function exportClipWebM() {
  if (!state.adapter || state.adapter.kind !== 'mp4') { toast('WebM export requires MP4 source.', 'error'); return; }
  if (state.inPoint == null || state.outPoint == null) { toast('Set IN and OUT first.'); return; }
  if (state.outPoint <= state.inPoint) { toast('OUT must be after IN.', 'error'); return; }
  const burn = confirm('Burn in drawings (from the active play)?');
  const v = state.adapter.videoEl;
  const c = document.createElement('canvas');
  c.width = v.videoWidth || 1280;
  c.height = v.videoHeight || 720;
  const cc = c.getContext('2d');
  v.currentTime = state.inPoint;
  await new Promise(r => v.addEventListener('seeked', r, { once: true }));
  await v.play();
  const stream = c.captureStream(30);
  try {
    const aud = v.captureStream && v.captureStream().getAudioTracks();
    if (aud && aud[0]) stream.addTrack(aud[0]);
  } catch {}
  let mime = 'video/webm;codecs=vp9,opus';
  if (!MediaRecorder.isTypeSupported(mime)) mime = 'video/webm';
  const rec = new MediaRecorder(stream, { mimeType: mime });
  const chunks = [];
  rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
  rec.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    downloadBlob(blob, `huddle-clip-${state.game.opponent}-${fmtTime(state.inPoint).replace(':','m')}.webm`);
    toast('Clip exported.');
  };
  rec.start();
  const tick = () => {
    cc.drawImage(v, 0, 0, c.width, c.height);
    if (burn) cc.drawImage(overlay(), 0, 0, c.width, c.height);
    if (v.currentTime >= state.outPoint) { rec.stop(); v.pause(); return; }
    requestAnimationFrame(tick);
  };
  tick();
}

// =================== STATS ====================
function applyFilters(markers) {
  return markers.filter(m => {
    if (state.filterQuarter && m.quarter !== state.filterQuarter) return false;
    if (state.filterDown) {
      const bucket = m[m.playType];
      if (!bucket || String(bucket.down || '') !== state.filterDown) return false;
    }
    if (state.filterTag && !(m.tags || []).includes(state.filterTag)) return false;
    if (state.filterDrive && String(m.drive || '') !== state.filterDrive) return false;
    return true;
  });
}

function computeStats(markers) {
  const off = markers.filter(m => m.playType === 'offense').map(m => m.offense).filter(Boolean);
  const def = markers.filter(m => m.playType === 'defense').map(m => m.defense).filter(Boolean);
  const st  = markers.filter(m => m.playType === 'st').map(m => m.st).filter(Boolean);

  const sum = (a, f) => a.reduce((s, x) => s + (+f(x) || 0), 0);
  const avg = (a, f) => a.length ? (sum(a, f) / a.length) : 0;

  // Offense
  const offPlays = off.length;
  const ypp = avg(off, x => x.resultYards);
  const success = off.filter(x => x.success).length;
  const explosive = off.filter(x => x.explosive).length;
  const runs = off.filter(x => x.playType === 'run').length;
  const passes = off.filter(x => x.playType === 'pass' || x.playType === 'pa' || x.playType === 'screen' || x.playType === 'rpo').length;
  const third = off.filter(x => +x.down === 3);
  const thirdConv = third.length ? (third.filter(x => +x.resultYards >= +x.distance).length / third.length) : 0;

  // Defense
  const defPlays = def.length;
  const ypa = avg(def, x => x.resultYards);
  const tfls = def.filter(x => x.tfl).length;
  const sacks = def.filter(x => x.sack).length;
  const takeaways = def.filter(x => x.int).length;
  const missed = def.filter(x => x.missedTackle).length;
  const pbus = def.filter(x => x.pbu).length;

  // ST
  const stPlays = st.length;
  const stReturnAvg = avg(st, x => x.returnYards);

  return { offPlays, ypp, success, explosive, runs, passes, thirdConv, third: third.length,
           defPlays, ypa, tfls, sacks, takeaways, missed, pbus,
           stPlays, stReturnAvg };
}

function pct(n) { return (n * 100).toFixed(0) + '%'; }
function num(n, dec = 1) { return (+n || 0).toFixed(dec); }

function renderStats() {
  const body = $('#statsBody');
  if (!state.game) { body.innerHTML = '<p class="muted">No game loaded.</p>'; return; }
  const filtered = applyFilters(state.game.markers);
  const s = computeStats(filtered);
  body.innerHTML = `
    <div class="stats-section">
      <h4>Offense</h4>
      <div class="stat-grid">
        <div class="stat-tile"><div class="label">Plays</div><div class="value">${s.offPlays}</div></div>
        <div class="stat-tile"><div class="label">Yards / Play</div><div class="value">${num(s.ypp, 1)}</div></div>
        <div class="stat-tile"><div class="label">Success Rate</div><div class="value">${s.offPlays?pct(s.success/s.offPlays):'—'}</div></div>
        <div class="stat-tile"><div class="label">Explosive</div><div class="value">${s.offPlays?pct(s.explosive/s.offPlays):'—'}</div></div>
        <div class="stat-tile"><div class="label">Run / Pass</div><div class="value">${s.runs}/${s.passes}</div></div>
        <div class="stat-tile"><div class="label">3rd Down %</div><div class="value">${s.third?pct(s.thirdConv):'—'}</div></div>
      </div>
    </div>
    <div class="stats-section">
      <h4>Defense</h4>
      <div class="stat-grid">
        <div class="stat-tile"><div class="label">Plays</div><div class="value">${s.defPlays}</div></div>
        <div class="stat-tile"><div class="label">Yards Allowed / Play</div><div class="value">${num(s.ypa, 1)}</div></div>
        <div class="stat-tile"><div class="label">TFLs</div><div class="value">${s.tfls}</div></div>
        <div class="stat-tile"><div class="label">Sacks</div><div class="value">${s.sacks}</div></div>
        <div class="stat-tile"><div class="label">Takeaways</div><div class="value">${s.takeaways}</div></div>
        <div class="stat-tile"><div class="label">Missed Tackles</div><div class="value">${s.missed}</div></div>
        <div class="stat-tile"><div class="label">PBUs</div><div class="value">${s.pbus}</div></div>
      </div>
    </div>
    <div class="stats-section">
      <h4>Special Teams</h4>
      <div class="stat-grid">
        <div class="stat-tile"><div class="label">Plays</div><div class="value">${s.stPlays}</div></div>
        <div class="stat-tile"><div class="label">Avg Return</div><div class="value">${num(s.stReturnAvg, 1)}</div></div>
      </div>
    </div>
  `;
}
function renderStatsIfActive() {
  if (state.rightTab === 'stats') renderStats();
}

function renderQuickStats() {
  const grid = $('#qsGrid');
  if (!grid) return;
  if (!state.game || !state.game.markers.length) {
    grid.innerHTML = '<div class="qs-empty muted small">No plays yet</div>';
    return;
  }
  const s = computeStats(state.game.markers);
  const tiles = [
    ['Plays', state.game.markers.length],
    ['Off Y/P', num(s.ypp, 1)],
    ['Success', s.offPlays ? pct(s.success / s.offPlays) : '—'],
    ['Expl', s.explosive],
    ['TFL', s.tfls],
    ['Sack', s.sacks],
  ];
  grid.innerHTML = tiles.map(([k, v]) =>
    `<div class="qs-tile"><div class="k">${k}</div><div class="v">${v}</div></div>`
  ).join('');
}

// =================== SETTINGS ====================
function renderSettings() {
  const body = $('#settingsBody');
  if (!state.game) {
    body.innerHTML = '<p class="muted">No game loaded. Use <strong>+ New Game</strong> to start.</p>';
    return;
  }
  const g = state.game;
  body.innerHTML = `
    <label>Opponent<input id="set_opponent" value="${escapeHTML(g.opponent)}"></label>
    <label>Date<input id="set_date" type="date" value="${g.date}"></label>
    <label>Season<input id="set_season" type="number" value="${g.season}"></label>
    <label>Home / Away
      <select id="set_homeAway">
        ${['home','away','neutral'].map(v => `<option value="${v}" ${g.homeAway===v?'selected':''}>${v[0].toUpperCase()+v.slice(1)}</option>`).join('')}
      </select>
    </label>
    <p class="muted small">Source: <strong>${g.source.kind.toUpperCase()}</strong>${g.source.fileName?` — ${escapeHTML(g.source.fileName)}`:''}${g.source.ytId?` — ${g.source.ytId}`:''}</p>
    <button class="btn btn-ghost" id="set_delete" style="color:var(--danger); border:1px solid var(--danger); margin-top:8px;">Delete this game</button>
  `;
  $('#set_opponent').addEventListener('change', e => { g.opponent = e.target.value; persistGame(); refreshGameSelect(); });
  $('#set_date').addEventListener('change', e => { g.date = e.target.value; persistGame(); refreshGameSelect(); });
  $('#set_season').addEventListener('change', e => { g.season = +e.target.value; persistGame(); });
  $('#set_homeAway').addEventListener('change', e => { g.homeAway = e.target.value; persistGame(); });
  $('#set_delete').addEventListener('click', () => {
    if (!confirm(`Delete "${g.opponent}" permanently? This can't be undone.`)) return;
    deleteGameFromStorage(g.id);
    state.game = null; state.activeMarkerId = null;
    refreshGameSelect();
    attachAdapter(); renderAll();
    toast('Game deleted.');
  });
}

// =================== GAME LIFECYCLE ====================
function newGame(opts) {
  const g = newGameObj(opts);
  state.game = g;
  state.activeMarkerId = null;
  state.inPoint = state.outPoint = null;
  state.strokes = {}; state.redoStacks = {};
  state.mp4File = opts.mp4File || null;
  persistGame();
  refreshGameSelect();
  $('#gameSelect').value = g.id;
  attachAdapter();
  renderAll();
}

function loadGameById(id) {
  const g = loadGame(id);
  if (!g) { toast('Game not found.', 'error'); return; }
  state.game = g;
  state.activeMarkerId = null;
  state.inPoint = state.outPoint = null;
  state.strokes = {}; state.redoStacks = {};
  state.mp4File = null;
  refreshGameSelect();
  $('#gameSelect').value = id;
  attachAdapter();
  renderAll();
}

function refreshGameSelect() {
  const sel = $('#gameSelect');
  const ix = loadIndex();
  sel.innerHTML = '<option value="">— Select game —</option>' +
    ix.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .map(g => `<option value="${g.id}">${escapeHTML(g.opponent)} — ${g.date || ''}</option>`).join('');
  if (state.game) sel.value = state.game.id;
}

function renderAll() {
  renderMarkerList();
  renderClipList();
  renderPlayPane();
  renderStats();
  renderSettings();
  renderIO();
  renderQuickStats();
  refreshTagFilter();
  refreshConceptSuggestions();
  refreshDriveFilters();
  renderQuickTagBar();
  updateCapabilities();
  // Sync drive counter from loaded game
  if (state.game) state.currentDrive = state.game.currentDrive || 1;
}

// =================== EXPORT / IMPORT ====================
function exportGameJSON() {
  if (!state.game) { toast('No game loaded.'); return; }
  const blob = new Blob([JSON.stringify(state.game, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `huddle-${state.game.opponent}-${state.game.date}.json`.replace(/\s+/g, '-'));
}
function importGameJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const g = JSON.parse(reader.result);
      if (!g.markers || !g.source) throw new Error('Not a valid game file.');
      g.id = uid('g');
      g.updatedAt = nowISO();
      state.game = g;
      state.mp4File = null;
      persistGame();
      refreshGameSelect();
      $('#gameSelect').value = g.id;
      attachAdapter();
      renderAll();
      toast('Game imported: ' + g.opponent);
    } catch (e) {
      toast('Import failed: ' + e.message, 'error');
    }
  };
  reader.readAsText(file);
}

// =================== NEW GAME MODAL ====================
function openNewGameModal() {
  $('#newGameModal').classList.remove('hidden');
  $('#ng_opponent').focus();
  $('#ng_date').value = new Date().toISOString().slice(0, 10);
}
function closeNewGameModal() { $('#newGameModal').classList.add('hidden'); }

function pickNgSource(kind) {
  state.ngSource = kind;
  $$('.src-tab').forEach(t => t.classList.toggle('active', t.dataset.src === kind));
  $$('.src-pane').forEach(p => p.classList.toggle('hidden', p.dataset.srcPane !== kind));
}

function createGameFromModal() {
  const opponent = $('#ng_opponent').value.trim() || 'Opponent';
  const date = $('#ng_date').value;
  const season = +$('#ng_season').value;
  const homeAway = $('#ng_homeAway').value;

  let source = null, mp4File = null;
  if (state.ngSource === 'youtube') {
    const id = extractYouTubeId($('#ng_yt').value.trim());
    if (!id) { toast('Invalid YouTube URL or ID.', 'error'); return; }
    source = { kind: 'youtube', ytId: id };
  } else if (state.ngSource === 'mp4') {
    const f = $('#ng_mp4').files[0];
    if (!f) { toast('Pick a video file.', 'error'); return; }
    source = { kind: 'mp4', fileName: f.name };
    mp4File = f;
  } else {
    const url = $('#ng_iframe').value.trim();
    if (!url) { toast('Paste an embed URL.', 'error'); return; }
    source = { kind: 'iframe', embedUrl: url };
  }
  closeNewGameModal();
  newGame({ opponent, date, season, homeAway, source, mp4File });
}

// =================== HOTKEYS ====================
function wireHotkeys() {
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        if (!state.adapter) return;
        state.adapter.isPaused() ? state.adapter.play() : state.adapter.pause();
        break;
      case 'j': case 'J': if (state.adapter) state.adapter.seek(state.adapter.getTime() - 5); break;
      case 'l': case 'L': if (state.adapter) state.adapter.seek(state.adapter.getTime() + 5); break;
      case 'k': case 'K': if (state.adapter) state.adapter.pause(); break;
      case ',': if (state.adapter?.frameStep) state.adapter.frameStep(-1); break;
      case '.': if (state.adapter?.frameStep) state.adapter.frameStep(+1); break;
      case 'm': case 'M': markPlay(); break;
      case 'i': case 'I': setIn(); break;
      case 'o': case 'O': setOut(); break;
      case '1': if (activeMarker()) setPlayType('offense'); break;
      case '2': if (activeMarker()) setPlayType('defense'); break;
      case '3': if (activeMarker()) setPlayType('st'); break;
      case '[': gotoAdjacentMarker(-1); break;
      case ']': gotoAdjacentMarker(+1); break;
      case 'D': if (e.shiftKey) { const m = activeMarker(); if (m) duplicatePlay(m.id); } break;
      case 'd': if (e.shiftKey) { const m = activeMarker(); if (m) duplicatePlay(m.id); } break;
      case '?':
      case '/':
        if (e.shiftKey || e.key === '?') {
          e.preventDefault();
          $('#helpModal').classList.toggle('hidden');
        }
        break;
      case 'Escape':
        if (!$('#helpModal').classList.contains('hidden')) {
          $('#helpModal').classList.add('hidden');
        } else {
          setDrawMode(null);
        }
        break;
    }
  });
}

// =================== STOPWATCH (iframe sources) ====================
function wireStopwatch() {
  let running = false, t0 = 0, accum = 0, tickT = null;
  function fmtSW(ms) {
    const s = Math.floor(ms / 1000), tenths = Math.floor((ms % 1000) / 100);
    const m = Math.floor(s / 60), r = s % 60;
    return `${m}:${String(r).padStart(2,'0')}.${tenths}`;
  }
  function update() {
    const ms = accum + (running ? (Date.now() - t0) : 0);
    $('#swReadout').textContent = fmtSW(ms);
    state._iframeStopwatchTime = ms / 1000;
    if (state._iframeTimeCb) state._iframeTimeCb(ms / 1000);
  }
  $('#swStart').addEventListener('click', () => {
    if (running) { accum += Date.now() - t0; running = false; clearInterval(tickT); $('#swStart').textContent = 'Start'; }
    else { t0 = Date.now(); running = true; tickT = setInterval(update, 100); $('#swStart').textContent = 'Pause'; }
  });
  $('#swReset').addEventListener('click', () => {
    accum = 0; t0 = Date.now(); update();
  });
}

// =================== UI WIRING ====================
function wireUI() {
  // Top bar
  $('#btnNewGame').addEventListener('click', openNewGameModal);
  $('#btnNewGameInline').addEventListener('click', openNewGameModal);
  $('#btnExport').addEventListener('click', exportGameJSON);
  $('#btnExportCsv').addEventListener('click', exportCSV);
  $('#btnImport').addEventListener('click', () => $('#importFile').click());
  $('#btnShare').addEventListener('click', openShareModal);
  $('#importFile').addEventListener('change', e => { if (e.target.files[0]) importGameJSON(e.target.files[0]); e.target.value = ''; });
  $('#gameSelect').addEventListener('change', e => { if (e.target.value) loadGameById(e.target.value); });

  // View mode
  $$('.vm').forEach(b => b.addEventListener('click', () => setViewMode(b.dataset.vm)));

  // Compare
  $('#btnCompareClose').addEventListener('click', () => setViewMode('review'));
  $('#cmpGameA').addEventListener('change', renderCompare);
  $('#cmpGameB').addEventListener('change', renderCompare);

  // Share modal
  $('#shareTag').addEventListener('change', updateShareLink);
  $('#sharePT').addEventListener('change', updateShareLink);
  $('#btnShareCancel').addEventListener('click', () => $('#shareModal').classList.add('hidden'));
  $('#btnShareCopy').addEventListener('click', async () => {
    const link = $('#shareLink').value;
    try {
      await navigator.clipboard.writeText(link);
      toast('Link copied.');
    } catch {
      $('#shareLink').select();
      document.execCommand('copy');
      toast('Link copied.');
    }
  });

  // List filters
  $('#listFilterPT').addEventListener('change', e => { state.listFilterPT = e.target.value; renderMarkerList(); });
  $('#listFilterQuarter').addEventListener('change', e => { state.listFilterQuarter = e.target.value; renderMarkerList(); });
  $('#listFilterDown').addEventListener('change', e => { state.listFilterDown = e.target.value; renderMarkerList(); });
  $('#listFilterTag').addEventListener('change', e => { state.listFilterTag = e.target.value; renderMarkerList(); });
  $('#listFilterDrive').addEventListener('change', e => { state.listFilterDrive = e.target.value; renderMarkerList(); });
  $('#listClearFilters').addEventListener('click', clearListFilters);

  // Bulk bar
  $('#bulkClear').addEventListener('click', clearSelection);
  $('#bulkDelete').addEventListener('click', bulkDelete);
  $('#bulkTag').addEventListener('click', () => { const v = $('#bulkTagInput').value.trim(); if (v) { bulkTag(v); $('#bulkTagInput').value = ''; } });
  $('#bulkTagInput').addEventListener('keydown', e => { if (e.key === 'Enter') { const v = e.target.value.trim(); if (v) { bulkTag(v); e.target.value = ''; } } });
  $('#bulkPlayType').addEventListener('click', () => {
    $('#bulkPTCount').textContent = state.selectedIds.size;
    $('#bulkPTModal').classList.remove('hidden');
  });
  $('#bulkPTCancel').addEventListener('click', () => $('#bulkPTModal').classList.add('hidden'));
  $$('[data-bulkpt]').forEach(b => b.addEventListener('click', () => {
    bulkSetPlayType(b.dataset.bulkpt);
    $('#bulkPTModal').classList.add('hidden');
  }));

  // Quick tags
  $('#qtAdd').addEventListener('click', addQuickTagPreset);

  // Auto-advance + new drive
  $('#autoAdvance').addEventListener('change', e => { state.autoAdvance = e.target.checked; });
  $('#btnNewDrive').addEventListener('click', newDrive);

  // New Game modal
  $('#ng_cancel').addEventListener('click', closeNewGameModal);
  $('#ng_create').addEventListener('click', createGameFromModal);
  $$('.src-tab').forEach(t => t.addEventListener('click', () => pickNgSource(t.dataset.src)));

  // Reattach
  $('#reattachFile').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    state.mp4File = f;
    if (state.game) state.game.source.fileName = f.name;
    persistGame();
    attachAdapter();
  });

  // Transport
  $('#btnPlayPause').addEventListener('click', () => {
    if (!state.adapter) return;
    state.adapter.isPaused() ? state.adapter.play() : state.adapter.pause();
  });
  $('#btnPrevPlay').addEventListener('click', () => gotoAdjacentMarker(-1));
  $('#btnNextPlay').addEventListener('click', () => gotoAdjacentMarker(+1));
  $('#btnBack').addEventListener('click', () => state.adapter && state.adapter.seek(state.adapter.getTime() - 5));
  $('#btnFwd').addEventListener('click',  () => state.adapter && state.adapter.seek(state.adapter.getTime() + 5));
  $('#btnFrameBack').addEventListener('click', () => state.adapter?.frameStep && state.adapter.frameStep(-1));
  $('#btnFrameFwd').addEventListener('click',  () => state.adapter?.frameStep && state.adapter.frameStep(+1));
  $('#speedSelect').addEventListener('change', e => {
    state.playbackRate = +e.target.value;
    if (state.adapter?.setRate) state.adapter.setRate(state.playbackRate);
  });
  $('#btnHelp').addEventListener('click', () => $('#helpModal').classList.remove('hidden'));
  $('#help_close').addEventListener('click', () => $('#helpModal').classList.add('hidden'));
  $('#scrubber').addEventListener('input', e => {
    if (!state.adapter) return;
    const d = state.adapter.getDuration(); if (!d) return;
    state.adapter.seek((+e.target.value / 1000) * d);
  });

  $('#btnMark').addEventListener('click', markPlay);
  $('#btnSetIn').addEventListener('click', setIn);
  $('#btnSetOut').addEventListener('click', setOut);
  $('#btnLoop').addEventListener('click', toggleLoop);
  $('#btnSaveClip').addEventListener('click', saveClip);
  $('#btnExportClip').addEventListener('click', exportClipWebM);

  // Telestrator
  $$('.tool[data-tool]').forEach(b => b.addEventListener('click', () => {
    setDrawMode(state.tool === b.dataset.tool ? null : b.dataset.tool);
  }));
  $('#penColor').addEventListener('input', e => {
    state.penColor = e.target.value;
    $$('.color-swatch').forEach(s => s.classList.remove('active'));
  });
  $('#penWidth').addEventListener('input', e => { state.penWidth = +e.target.value; });
  $$('.color-swatch').forEach(sw => sw.addEventListener('click', () => {
    state.penColor = sw.dataset.color;
    $('#penColor').value = sw.dataset.color;
    $$('.color-swatch').forEach(s => s.classList.toggle('active', s === sw));
  }));
  $('#toggleAutoClear').addEventListener('change', e => {
    state.autoClearOnPlay = e.target.checked;
    if (!state.autoClearOnPlay) { state._drawingsHidden = false; renderStrokes(); }
  });
  $('#togglePinClip').addEventListener('change', e => {
    state.pinDrawingsToClip = e.target.checked;
  });
  $('#btnUndo').addEventListener('click', undo);
  $('#btnRedo').addEventListener('click', redo);
  $('#btnClearDraw').addEventListener('click', clearDraw);
  $('#btnSnapshot').addEventListener('click', snapshot);

  // Tabs
  $$('.tab').forEach(t => t.addEventListener('click', () => {
    state.rightTab = t.dataset.tab;
    $$('.tab').forEach(x => x.classList.toggle('active', x === t));
    $$('.tab-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === state.rightTab));
    if (state.rightTab === 'stats') renderStats();
    if (state.rightTab === 'settings') renderSettings();
  }));

  // Play details
  $('#playTitle').addEventListener('input', e => { const m = activeMarker(); if (m) { m.title = e.target.value; renderMarkerList(); persistGame(); } });
  $('#playQuarter').addEventListener('change', e => { const m = activeMarker(); if (m) { m.quarter = e.target.value; persistGame(); renderStatsIfActive(); } });
  $('#playNotes').addEventListener('input', e => { const m = activeMarker(); if (m) { m.notes = e.target.value; persistGame(); } });
  $$('.pt').forEach(b => b.addEventListener('click', () => setPlayType(b.dataset.pt)));
  $('#btnDeletePlay').addEventListener('click', () => { const m = activeMarker(); if (m) deletePlay(m.id); });
  $('#btnDuplicatePlay').addEventListener('click', () => { const m = activeMarker(); if (m) duplicatePlay(m.id); });
  $$('.nudge').forEach(b => b.addEventListener('click', () => nudgeActiveMarkerTime(+b.dataset.nudge)));

  // Drive on play
  if ($('#playDrive')) $('#playDrive').addEventListener('change', e => {
    const m = activeMarker(); if (!m) return;
    m.drive = e.target.value ? +e.target.value : null;
    persistGame(); renderMarkerList(); refreshDriveFilters();
  });

  // Pre-snap controls
  if ($('#btnSetPreSnap')) $('#btnSetPreSnap').addEventListener('click', () => {
    const m = activeMarker(); if (!m || !state.adapter) return;
    const t = state.adapter.getTime();
    const start = playStart(m);
    if (t >= start) { toast('Pre-snap must be before the play start.', 'error'); return; }
    m.preSnapTime = t;
    persistGame(); renderPlayPane();
    toast(`Pre-snap set to ${fmtTime(t)}`);
  });
  if ($('#btnClearPreSnap')) $('#btnClearPreSnap').addEventListener('click', () => {
    const m = activeMarker(); if (!m) return;
    m.preSnapTime = null; m.loopFromPreSnap = false;
    persistGame(); renderPlayPane();
  });
  if ($('#loopFromPreSnap')) $('#loopFromPreSnap').addEventListener('change', e => {
    const m = activeMarker(); if (!m) return;
    m.loopFromPreSnap = e.target.checked;
    persistGame();
  });

  // Comments
  if ($('#btnAddComment')) $('#btnAddComment').addEventListener('click', addComment);
  if ($('#commentBody')) $('#commentBody').addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); addComment(); }
  });

  $('#btnSetPlayOut').addEventListener('click', () => {
    const m = activeMarker();
    if (!m || !state.adapter) return;
    const t = state.adapter.getTime();
    const startT = playStart(m);
    if (t <= startT) { toast('OUT must be after the play start.', 'error'); return; }
    if (m.inTime == null) m.inTime = startT;
    m.outTime = t;
    persistGame(); renderPlayPane(); renderMarkerList();
    toast(`Play range set: ${fmtTime(m.inTime)}–${fmtTime(t)} (${(t - m.inTime).toFixed(1)}s)`);
  });

  $('#btnClearPlayRange').addEventListener('click', () => {
    const m = activeMarker();
    if (!m) return;
    if (m.inTime != null) m.time = m.inTime;
    m.inTime = null; m.outTime = null;
    persistGame(); renderPlayPane(); renderMarkerList();
    toast('Play range cleared.');
  });

  // Tag input
  $('#tagInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTagFromInput(); }
  });
  $('#tagInput').addEventListener('change', () => { if ($('#tagInput').value.trim()) addTagFromInput(); });

  // Search & filters
  $('#markerSearch').addEventListener('input', e => { state.search = e.target.value; renderMarkerList(); });
  $('#filterQuarter').addEventListener('change', e => { state.filterQuarter = e.target.value; renderStats(); });
  $('#filterDown').addEventListener('change', e => { state.filterDown = e.target.value; renderStats(); });
  $('#filterTag').addEventListener('change', e => { state.filterTag = e.target.value; renderStats(); });
  $('#filterDrive').addEventListener('change', e => { state.filterDrive = e.target.value; renderStats(); });

  // Resize
  window.addEventListener('resize', resizeOverlay);
  if (window.ResizeObserver) {
    new ResizeObserver(resizeOverlay).observe($('#videoWrap'));
  }
}

// =================== INIT ====================
function init() {
  wireUI();
  wireCanvas();
  wireHotkeys();
  wireStopwatch();
  refreshGameSelect();
  resizeOverlay();
  document.body.classList.add('vm-review');

  // Try share URL first
  if (loadShareFromURL()) return;

  const ix = loadIndex();
  if (ix.length) {
    // Auto-load most recently updated
    const sorted = ix.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    loadGameById(sorted[0].id);
  } else {
    renderAll();
    showEmptyVideo(true);
  }
}

document.addEventListener('DOMContentLoaded', init);

})();
