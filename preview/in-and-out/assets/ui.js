/* Shared UI helpers for the In and Out app pages. Depends on store.js. */
(function () {
  var P = {
    home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-8 8-2.3-2.3a4 4 0 0 0-5-5L4 12l8-8 2.7 2.3z" transform="scale(.9) translate(1 1)"/>',
    hammer: '<path d="m15 12-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9"/><path d="M17.6 15 22 10.6l-1.5-1.5-.6-2.5L17 3.7 13 3l-1 1 3 3-1.5 1.5L17.6 12z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M17.9 17.9A10 10 0 0 1 12 19c-6.5 0-10-7-10-7a18 18 0 0 1 5.1-5.9M9.9 4.2A9 9 0 0 1 12 4c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.2M1 1l22 22"/><path d="M14.1 14.1a3 3 0 0 1-4.2-4.2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    nav: '<path d="m3 11 19-9-9 19-2-8z"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    note: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'
  };

  function injectSprite() {
    if (document.getElementById('io-sprite')) return;
    var s = '<svg id="io-sprite" width="0" height="0" style="position:absolute" aria-hidden="true">';
    Object.keys(P).forEach(function (k) {
      var fill = k === 'star' ? ' fill="currentColor" stroke="none"' : ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
      s += '<symbol id="i-' + k + '" viewBox="0 0 24 24"><g' + fill + '>' + P[k] + '</g></symbol>';
    });
    s += '<g id="mark-half"><g fill="#1C9AED"><rect x="0" y="8" width="20" height="2"/><rect x="31" y="8" width="20" height="2"/><rect x="0" y="8" width="2" height="19"/><rect x="49" y="8" width="2" height="19"/><path d="M10 14h10v13h10v5H10z"/></g><g fill="#D9A877"><rect x="0" y="27" width="9" height="5"/><rect x="20" y="0" width="10" height="27"/><rect x="31" y="14" width="9" height="18"/><rect x="41" y="27" width="10" height="5"/></g></g>';
    s += '<g id="mark-half-d"><g fill="#1C9AED"><rect x="0" y="8" width="20" height="2"/><rect x="31" y="8" width="20" height="2"/><rect x="0" y="8" width="2" height="19"/><rect x="49" y="8" width="2" height="19"/><path d="M10 14h10v13h10v5H10z"/></g><g fill="#532913"><rect x="0" y="27" width="9" height="5"/><rect x="20" y="0" width="10" height="27"/><rect x="31" y="14" width="9" height="18"/><rect x="41" y="27" width="10" height="5"/></g></g>';
    s += '<symbol id="mark-light" viewBox="0 0 51 66"><use href="#mark-half"/><use href="#mark-half" transform="rotate(180 25.5 33)"/></symbol>';
    s += '<symbol id="mark" viewBox="0 0 51 66"><use href="#mark-half-d"/><use href="#mark-half-d" transform="rotate(180 25.5 33)"/></symbol>';
    s += '</svg>';
    document.body.insertAdjacentHTML('afterbegin', s);
  }

  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function parse(d) { if (!d) return null; var p = d.split(/[-T:]/); return new Date(+p[0], +p[1] - 1, +p[2], +(p[3] || 12), +(p[4] || 0)); }
  function diffDays(d) { var a = parse(d.slice(0, 10)); var b = parse(IO.day(0)); return Math.round((a - b) / 864e5); }

  var UI = {
    ic: function (n, cls) { return '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; },
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    date: function (d, opts) {
      if (!d) return '';
      var x = parse(d), n = diffDays(d), rel = '';
      if (opts !== 'plain') {
        if (n === 0) rel = 'Today'; else if (n === 1) rel = 'Tomorrow'; else if (n === -1) rel = 'Yesterday';
      }
      if (rel && opts !== 'full') return rel;
      return DOW[x.getDay()] + ', ' + MON[x.getMonth()] + ' ' + x.getDate() + (x.getFullYear() !== new Date().getFullYear() ? ', ' + x.getFullYear() : '');
    },
    short: function (d) { if (!d) return ''; var x = parse(d); return MON[x.getMonth()] + ' ' + x.getDate(); },
    time: function (hm) {
      if (!hm) return '';
      var p = hm.split(':'), h = +p[0], m = p[1];
      return (h % 12 || 12) + (m === '00' ? '' : ':' + m) + (h < 12 ? ' AM' : ' PM');
    },
    when: function (dt) {
      if (!dt) return '';
      var n = diffDays(dt), t = UI.time(dt.slice(11, 16));
      if (n === 0) return 'Today ' + t; if (n === -1) return 'Yesterday ' + t;
      if (n > -7 && n < 0) return DOW[parse(dt).getDay()] + ' ' + t;
      return UI.short(dt) + (parse(dt).getFullYear() !== new Date().getFullYear() ? ', ' + parse(dt).getFullYear() : '') + ' · ' + t;
    },
    rel: function (d) {
      var n = diffDays(d);
      if (n === 0) return 'today'; if (n === 1) return 'tomorrow'; if (n === -1) return 'yesterday';
      return n > 0 ? 'in ' + n + ' days' : Math.abs(n) + ' days ago';
    },
    diffDays: diffDays,
    initials: function (name) { return (name || '?').split(/\s+/).filter(function (w) { return /^[A-Za-z]/.test(w) && w !== '&'; }).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase(); },
    avatar: function (id, size) {
      var p = IO.person(id) || IO.client(id) || { name: '?' };
      var s = size ? ' style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * .38) + 'px"' : '';
      var kind = id && id.indexOf('c-') === 0 ? ' av-sub' : (id && id.indexOf('cl-') === 0 || id === 'client' ? ' av-client' : '');
      if (p.photo) return '<span class="av' + kind + '"' + s + '><img src="' + p.photo + '" alt=""></span>';
      return '<span class="av' + kind + '"' + s + '>' + UI.initials(p.name) + '</span>';
    },
    stars: function (v, label) {
      var out = '<span class="stars" role="img" aria-label="' + (label || (v.toFixed(1) + ' out of 5')) + '">';
      for (var i = 1; i <= 5; i++) {
        var f = Math.max(0, Math.min(1, v - i + 1));
        out += '<span class="st"><svg class="ic"><use href="#i-star"/></svg><span style="width:' + Math.round(f * 100) + '%"><svg class="ic"><use href="#i-star"/></svg></span></span>';
      }
      return out + '</span>';
    },
    maps: function (addr) {
      var q = encodeURIComponent(addr);
      return { google: 'https://www.google.com/maps/dir/?api=1&destination=' + q, apple: 'https://maps.apple.com/?daddr=' + q };
    },
    osm: function (geo) {
      var lat = geo[0], lng = geo[1];
      return 'https://www.openstreetmap.org/export/embed.html?bbox=' + (lng - 0.012) + ',' + (lat - 0.006) + ',' + (lng + 0.012) + ',' + (lat + 0.006) + '&layer=mapnik&marker=' + lat + ',' + lng;
    },
    toast: function (msg, kind) {
      var t = document.getElementById('toast');
      if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
      t.className = 'toast show' + (kind ? ' ' + kind : '');
      t.innerHTML = UI.ic(kind === 'error' ? 'alert' : 'check') + '<span>' + UI.esc(msg) + '</span>';
      clearTimeout(t._h); t._h = setTimeout(function () { t.className = 'toast'; }, 3200);
    },
    modal: function (html, opts) {
      opts = opts || {};
      UI.closeModal();
      var last = document.activeElement;
      var wrap = document.createElement('div');
      wrap.className = 'modal-wrap'; wrap.id = 'modal';
      wrap.innerHTML = '<div class="modal' + (opts.wide ? ' wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
        '<button class="icon-btn modal-x" type="button" data-close aria-label="Close">' + UI.ic('x') + '</button>' + html + '</div>';
      document.body.appendChild(wrap);
      document.body.classList.add('modal-open');
      wrap._last = last;
      wrap.addEventListener('click', function (e) { if (e.target === wrap || e.target.closest('[data-close]')) UI.closeModal(); });
      var dlg = wrap.querySelector('.modal'); dlg.setAttribute('tabindex', '-1');
      var touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      // on phones focus the sheet itself so the keyboard doesn't jump up before the person chooses a field
      var f = touch ? dlg : (wrap.querySelector('[autofocus]') || wrap.querySelector('input,select,textarea,button:not(.modal-x)'));
      setTimeout(function () { f && f.focus({ preventScroll: true }); }, 30);
      return wrap;
    },
    closeModal: function () {
      var m = document.getElementById('modal');
      if (!m) return;
      var last = m._last; m.remove(); document.body.classList.remove('modal-open');
      if (last && last.focus) last.focus();
    },
    compress: function (file, max, q) {
      max = max || 1100; q = q || 0.72;
      return new Promise(function (res, rej) {
        if (!file || !/^image\//.test(file.type)) return rej(new Error('Choose an image file (JPG, PNG or HEIC exported as JPG).'));
        var fr = new FileReader();
        fr.onerror = function () { rej(new Error('Could not read that file.')); };
        fr.onload = function () {
          var img = new Image();
          img.onerror = function () { rej(new Error('This browser cannot open that image type. Try a JPG or PNG.')); };
          img.onload = function () {
            var s = Math.min(1, max / Math.max(img.width, img.height));
            var c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            res(c.toDataURL('image/jpeg', q));
          };
          img.src = fr.result;
        };
        fr.readAsDataURL(file);
      });
    },
    nowLocal: function () { var d = new Date(); return IO.day(0) + 'T' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); },
    statusLabel: { planning: 'Planning', scheduled: 'Scheduled', active: 'In progress', complete: 'Complete' },
    asgLabel: { draft: 'Draft', sent: 'Awaiting reply', accepted: 'Confirmed', declined: 'Declined', onsite: 'On site', done: 'Done' },
    toolLabel: { shop: 'In shop', site: 'On a job site', repair: 'Out for repair', missing: 'Missing' },
    init: injectSprite
  };

  window.UI = UI;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectSprite); else injectSprite();
})();
