/* =============================================================================
   THE BIG CHILL — CALENDAR DATA LAYER  (the single integration seam)
   -----------------------------------------------------------------------------
   This is the ONLY place availability comes from. The public site and the
   owner dashboard both read from window.BigChill.

   TODAY (demo):  a simulated master calendar of reservations across
                  Airbnb / VRBO / Direct / Owner-block, generated locally.

   PRODUCTION:    OwnerRez is the chosen PMS / source of truth. Replace
                  `loadReservations()` with a fetch to a server-side OwnerRez
                  proxy, normalized via mapOwnerRezRow() — one function, one
                  return shape. Everything downstream keeps working unchanged.
                  See the loadReservations() note below for the exact endpoint.

   Reservation shape (the contract the rest of the app depends on):
     {
       id:        'BC-1042',
       source:    'airbnb' | 'vrbo' | 'direct' | 'block',
       guest:     'John Smith',        // '' for owner blocks
       checkIn:   '2026-08-14',        // ISO date, inclusive
       checkOut:  '2026-08-17',        // ISO date, EXCLUSIVE (guest leaves AM)
       guests:    6,
       nights:    3,
       total:     1245,                // USD, 0 for blocks
       confirmation: 'HMABCD1234',
       cleaning:  'scheduled' | 'done' | 'pending',
       notes:     ''
     }
   ============================================================================ */
(function () {
  'use strict';

  // ---- Property config (single source of truth for property facts) ----------
  var PROPERTY = {
    name: 'The Big Chill',
    tagline: 'Your Auburn home away from home.',
    bedrooms: 4,
    baths: 2.5,
    sleeps: 10,
    baseNightly: 389,      // direct-booking nightly rate (USD)
    cleaningFee: 165,
    taxRate: 0.11,         // AL lodging tax (illustrative)
    minNights: 2,
    directDiscountNote: 'Best available rate — no marketplace service fee.'
  };

  // ---- Deterministic pseudo-random so the demo looks the same each load ------
  // (Real integration doesn't need this — reservations come from the API.)
  var _seed = 20260730;
  function rnd() { _seed = (_seed * 1103515245 + 12345) & 0x7fffffff; return _seed / 0x7fffffff; }

  function iso(d) { return d.toISOString().slice(0, 10); }
  function addDays(dateStr, n) {
    var d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return iso(d);
  }
  function nightsBetween(a, b) {
    return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
  }

  // ---- Simulated master calendar --------------------------------------------
  // Seed a believable ~4-month spread of stays across channels around the
  // Auburn football / graduation calendar. Fixed "today" for demo stability.
  var TODAY = '2026-07-30';

  var FIRST_NAMES = ['John','Sarah','Mike','Emily','David','Jessica','Chris','Amanda',
    'Robert','Ashley','James','Brittany','Will','Megan','Daniel','Laura','Kevin','Rachel',
    'Brian','Katie','Jason','Holly','Mark','Caroline','Steve','Anna'];
  var LAST_NAMES = ['Smith','Johnson','Williams','Davis','Miller','Wilson','Moore','Taylor',
    'Anderson','Thomas','Jackson','White','Harris','Martin','Thompson','Garcia','Clark','Lewis',
    'Walker','Hall','Young','King','Wright','Scott','Green','Adams'];

  function name() {
    return FIRST_NAMES[Math.floor(rnd() * FIRST_NAMES.length)] + ' ' +
           LAST_NAMES[Math.floor(rnd() * LAST_NAMES.length)];
  }
  function conf() {
    var s = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', out = '';
    for (var i = 0; i < 8; i++) out += s[Math.floor(rnd() * s.length)];
    return out;
  }

  // Auburn home-game weekends 2026 (Fri check-in → Sun check-out, premium rate)
  var GAME_WEEKENDS = ['2026-08-28','2026-09-11','2026-09-25','2026-10-16','2026-11-06','2026-11-20'];

  function buildReservations() {
    var res = [];
    var idN = 1040;
    var cursor = '2026-07-05';
    var end = '2026-11-30';
    var sources = ['airbnb','airbnb','vrbo','direct','airbnb','direct','vrbo'];
    var si = 0;

    while (cursor < end) {
      // gap of 1–6 nights between stays
      var gap = 1 + Math.floor(rnd() * 6);
      var start = addDays(cursor, gap);
      if (start >= end) break;

      // Is this near a game weekend? snap to Fri and make it a 2–3 night premium
      var isGame = false, gw;
      for (var g = 0; g < GAME_WEEKENDS.length; g++) {
        if (Math.abs(nightsBetween(start, GAME_WEEKENDS[g])) <= 3) { isGame = true; gw = GAME_WEEKENDS[g]; break; }
      }

      var stayNights, src;
      if (isGame) {
        var gameStart = addDays(gw, -1);   // Thursday-in for a game weekend
        // never snap earlier than the current cursor (would overlap prior stay)
        start = gameStart < cursor ? cursor : gameStart;
        stayNights = 2 + Math.floor(rnd() * 2); // 2–3 nights
        src = rnd() < 0.5 ? 'airbnb' : (rnd() < 0.5 ? 'vrbo' : 'direct');
      } else {
        stayNights = 2 + Math.floor(rnd() * 4); // 2–5 nights
        src = sources[si % sources.length]; si++;
      }

      var checkIn = start;
      var checkOut = addDays(start, stayNights);
      if (checkOut > end) break;

      // Occasional owner block instead of a booking
      var isBlock = rnd() < 0.08;

      var nightly = isGame ? PROPERTY.baseNightly + 220 : PROPERTY.baseNightly + Math.floor(rnd() * 60) - 20;
      var g = 2 + Math.floor(rnd() * 8);
      var subtotal = nightly * stayNights;
      var total = isBlock ? 0 : Math.round(subtotal + PROPERTY.cleaningFee + subtotal * PROPERTY.taxRate);

      res.push({
        id: 'BC-' + (idN++),
        source: isBlock ? 'block' : src,
        guest: isBlock ? '' : name(),
        checkIn: checkIn,
        checkOut: checkOut,
        guests: isBlock ? 0 : g,
        nights: stayNights,
        total: total,
        confirmation: isBlock ? '' : conf(),
        cleaning: checkOut < TODAY ? 'done' : (checkOut < addDays(TODAY, 14) ? 'scheduled' : 'pending'),
        notes: isGame ? 'Game weekend' : (isBlock ? 'Owner use — maintenance/family' : ''),
        isGame: isGame
      });

      cursor = checkOut;
    }
    return res;
  }

  /* ---------------------------------------------------------------------------
     loadReservations() — THE SWAP POINT   (target PMS: OwnerRez)
     ---------------------------------------------------------------------------
     Demo returns the simulated set synchronously.

     GO-LIVE (OwnerRez): OwnerRez becomes the source of truth. Its API v2 is
     Basic-auth (username + access token) and MUST stay server-side — never in
     this file. Stand up a serverless proxy (Vercel/Netlify fn) that calls:

        GET https://api.ownerrez.com/v2/bookings?property_ids=<id>
            &since_utc=<iso>&include_charges=true
        Authorization: Basic base64(<user>:<PAT>)

     Then point this function at the proxy and normalize with mapOwnerRezRow():

        return fetch('/api/reservations')            // your OwnerRez proxy
          .then(function (r) { return r.json(); })
          .then(function (rows) { return rows.map(mapOwnerRezRow); });

     Keep the returned array in the documented reservation shape and NOTHING
     downstream changes. Availability = "any day covered by a booking is
     Unavailable." Recommended: also subscribe to OwnerRez webhooks
     (booking.created / .updated / .cancelled) so the proxy cache stays fresh
     without polling — that's what keeps the double-booking window near-zero.
  --------------------------------------------------------------------------- */

  // OwnerRez booking -> our shape. OwnerRez fields per API v2 /bookings.
  // Kept here (unused in the demo) so the go-live edit is copy/delete only.
  function mapOwnerRezRow(b) {
    var src = (b.listing_site || b.source || '').toLowerCase();
    var source = src.indexOf('airbnb') > -1 ? 'airbnb'
               : src.indexOf('vrbo') > -1 || src.indexOf('homeaway') > -1 ? 'vrbo'
               : b.is_block || b.type === 'block' ? 'block'
               : 'direct';
    var checkIn = (b.arrival || '').slice(0, 10);
    var checkOut = (b.departure || '').slice(0, 10);
    return {
      id: 'BC-' + b.id,
      source: source,
      guest: source === 'block' ? '' : ((b.guest && b.guest.name) || b.guest_name || 'Guest'),
      checkIn: checkIn,
      checkOut: checkOut,
      guests: b.adults ? (b.adults + (b.children || 0)) : (b.guests_count || 0),
      nights: checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0,
      total: Math.round(b.total_amount || b.total || 0),
      confirmation: b.uid || b.reference || '',
      cleaning: 'pending',   // derive from your OwnerRez task/field workflow
      notes: b.notes || ''
    };
  }
  // Exposed so the go-live proxy can reuse it if desired.
  // (Referenced on the public API below; harmless in the demo.)

  var _cache = null;
  function loadReservations() {
    if (!_cache) _cache = buildReservations();
    return _cache;
  }

  // ---- Availability helpers (derived; do not duplicate elsewhere) ------------
  // A date is booked if checkIn <= date < checkOut for ANY reservation.
  function isDateBooked(dateStr) {
    var r = loadReservations();
    for (var i = 0; i < r.length; i++) {
      if (dateStr >= r[i].checkIn && dateStr < r[i].checkOut) return true;
    }
    return false;
  }

  // Is a full [checkIn, checkOut) range available? (all nights free)
  function isRangeAvailable(checkIn, checkOut) {
    if (!checkIn || !checkOut || checkOut <= checkIn) return false;
    var d = checkIn;
    while (d < checkOut) {
      if (isDateBooked(d)) return false;
      d = addDays(d, 1);
    }
    return true;
  }

  function quote(checkIn, checkOut) {
    var n = nightsBetween(checkIn, checkOut);
    var subtotal = PROPERTY.baseNightly * n;
    var tax = Math.round(subtotal * PROPERTY.taxRate);
    var total = subtotal + PROPERTY.cleaningFee + tax;
    return {
      nights: n,
      nightly: PROPERTY.baseNightly,
      subtotal: subtotal,
      cleaningFee: PROPERTY.cleaningFee,
      tax: tax,
      total: total
    };
  }

  // ---- Public API ------------------------------------------------------------
  window.BigChill = {
    PROPERTY: PROPERTY,
    TODAY: TODAY,
    loadReservations: loadReservations,
    mapOwnerRezRow: mapOwnerRezRow,   // go-live: OwnerRez booking -> reservation shape
    isDateBooked: isDateBooked,
    isRangeAvailable: isRangeAvailable,
    quote: quote,
    addDays: addDays,
    nightsBetween: nightsBetween,
    iso: iso,
    sourceLabel: function (s) {
      return { airbnb: 'Airbnb', vrbo: 'VRBO', direct: 'Direct', block: 'Owner Block' }[s] || s;
    },
    sourceColor: function (s) {
      return { airbnb: '#7c3aed', vrbo: '#2563eb', direct: '#0f9d6b', block: '#4b5563' }[s] || '#888';
    }
  };
})();
