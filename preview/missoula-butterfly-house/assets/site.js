/* Missoula Butterfly House & Insectarium — concept by Williams Digital.
   Reads the Butterfly House's own WordPress calendar (The Events Calendar REST API) and
   Open-Meteo for Missoula weather. Falls back to the calendar data baked in at build time. */
(function () {
  "use strict";
  var API = "https://www.missoulabutterflyhouse.org/wp-json";
  var TZ = "America/Denver";
  var D = window.MBH || { events: [], info: {}, hours: {}, overrides: {} };

  /* ---------- menu ---------- */
  var mb = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
  if (mb && nav) mb.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    mb.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* ---------- Mountain Time helpers ---------- */
  function mt(date) {
    var p = {}, parts = new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date || new Date());
    parts.forEach(function (x) { p[x.type] = x.value; });
    var wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
    return { iso: p.year + "-" + p.month + "-" + p.day, wd: wd, mins: (+p.hour % 24) * 60 + (+p.minute) };
  }
  function addDays(iso, n) {
    var d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function wdOf(iso) { return new Date(iso + "T12:00:00Z").getUTCDay(); }
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function longDate(iso) { var d = new Date(iso + "T12:00:00Z"); return DAYS[d.getUTCDay()] + ", " + MONTHS[d.getUTCMonth()] + " " + d.getUTCDate(); }
  function clock(m) {
    var h = Math.floor(m / 60), mi = m % 60, ap = h >= 12 ? "p.m." : "a.m.", hh = h % 12 || 12;
    return hh + (mi ? ":" + String(mi).padStart(2, "0") : "") + " " + ap;
  }
  function span(a, b) { // "9 to 10 a.m." or "11 a.m. to 1 p.m."
    if (b == null || b === a) return clock(a);
    var ca = clock(a), cb = clock(b), sa = ca.slice(-4), sb = cb.slice(-4);
    return (sa === sb ? ca.slice(0, -5) : ca) + " to " + cb;
  }
  function toMins(t) { var a = t.split(":"); return (+a[0]) * 60 + (+a[1]); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function unent(s) { var t = document.createElement("textarea"); t.innerHTML = s; return t.value; }

  /* ---------- hours ---------- */
  function hoursFor(iso) {
    if (Object.prototype.hasOwnProperty.call(D.overrides, iso)) return D.overrides[iso];
    var h = D.hours[wdOf(iso)];
    return h ? { open: h[0], close: h[1] } : null;
  }
  function nextOpen(iso, from) {
    for (var i = from; i < 21; i++) { var d = addDays(iso, i), h = hoursFor(d); if (h && h.open) return { iso: d, h: h, n: i }; }
    return null;
  }
    function status(now) {
    var h = hoursFor(now.iso);
    if (h && h.open && now.mins < toMins(h.open)) return { open: false, text: "Opens today at " + clock(toMins(h.open)) };
    if (h && h.open && now.mins < toMins(h.close)) return { open: true, text: "Open now until " + clock(toMins(h.close)) };
    var nx = nextOpen(now.iso, 1);
    var why = h && h.note ? h.note + ". " : "";
    return { open: false, text: why + (nx ? "Closed now. Opens " + (nx.n === 1 ? "tomorrow" : DAYS[wdOf(nx.iso)]) + " at " + clock(toMins(nx.h.open)) : "Closed now") };
  }
  var NOW = mt();
  document.querySelectorAll("[data-status]").forEach(function (el) {
    var s = status(NOW); el.classList.toggle("closed", !s.open);
    var t = el.querySelector("[data-status-text]"); if (t) t.textContent = s.text;
  });
  document.querySelectorAll(".hours tr[data-wd]").forEach(function (tr) {
    if (+tr.getAttribute("data-wd") === NOW.wd) tr.classList.add("is-today");
  });

  /* ---------- events: baked data, refreshed live ---------- */
  function infoFor(title) {
    var keys = Object.keys(D.info);
    for (var i = 0; i < keys.length; i++) if (title.indexOf(keys[i]) === 0) return D.info[keys[i]];
    return null;
  }
  function norm(e) { // e: {d,s,e,t,u?}
    var inf = infoFor(e.t) || {};
    return { d: e.d, s: e.s, e: e.e, t: inf.name || e.t, kind: inf.kind || "special", blurb: inf.blurb || "", u: e.u || inf.url || "", closed: /^CLOSED/i.test(e.t), allday: e.allday };
  }
  function bakedFor(iso) { return D.events.filter(function (e) { return e.d === iso; }).map(norm); }
  function extrasFor(iso) { return D.events.filter(function (e) { return e.d === iso && e.x; }).map(norm); }
  function fetchJSON(url, ms) {
    var c = "AbortController" in window ? new AbortController() : null;
    var t = setTimeout(function () { if (c) c.abort(); }, ms || 6000);
    return fetch(url, c ? { signal: c.signal } : {}).then(function (r) { clearTimeout(t); if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  function fromApi(ev) {
    var s = ev.start_date.slice(11, 16), e = ev.end_date.slice(11, 16);
    var t = unent(ev.title);
    return { d: ev.start_date.slice(0, 10), s: s, e: e, t: t, u: "", allday: ev.all_day || (s === "00:00" && e === "23:59") };
  }
  function liveRange(a, b, pages) {
    var all = [], n = pages || 1;
    function page(p) {
      return fetchJSON(API + "/tribe/events/v1/events?per_page=50&page=" + p + "&start_date=" + a + "%2000:00:00&end_date=" + b + "%2023:59:59", 7000)
        .then(function (j) {
          (j.events || []).forEach(function (ev) { all.push(fromApi(ev)); });
          if (j.total_pages && p < j.total_pages && p < n) return page(p + 1);
        });
    }
    return page(1).then(function () { return all; });
  }
  function dedupe(list) { // their calendar lists Insects 101 twice a day; keep the evening session
    var seen = {};
    return list.filter(function (e) {
      if (e.t === "Insects 101" && e.s === "08:00") return false;
      var k = e.d + e.s + e.t; if (seen[k]) return false; seen[k] = 1; return true;
    });
  }

  /* ---------- today line ---------- */
  var board = document.querySelector("[data-today]");
  function drawToday(target, items, live) {
    var h = hoursFor(target.iso);
    var title = board.querySelector("[data-today-title]"), sub = board.querySelector("[data-today-sub]");
    title.textContent = (target.n === 0 ? "Today, " : target.n === 1 ? "Tomorrow, " : "") + longDate(target.iso);
    sub.textContent = status(NOW).text;
    var ev = dedupe(items).filter(function (e) { return !e.closed && !e.allday; }).sort(function (a, b) { return a.s < b.s ? -1 : 1; });
    var open = toMins(h.open), close = toMins(h.close);
    var lo = Math.min(open, ev.length ? toMins(ev[0].s) : open), hi = close;
    ev.forEach(function (e) { hi = Math.max(hi, toMins(e.e && e.e !== e.s ? e.e : e.s)); });
    lo -= 30; hi += 30;
    function pos(m) { return ((m - lo) / (hi - lo) * 100).toFixed(2) + "%"; }
    var isToday = target.n === 0, nowM = NOW.mins;
    var html = '<div class="track-line"></div><div class="track-fill"></div>';
    html += '<div class="tick" style="left:' + pos(open) + '">' + clock(open).replace(" ", " ") + "<span class=\"vh\"> doors open</span></div>";
    html += '<div class="tick end" style="left:' + pos(close) + '">' + clock(close).replace(" ", " ") + "<span class=\"vh\"> closing</span></div>";
    var lastX = -100, low = false, list = [];
    list.push('<li class="edge' + (isToday && nowM > open ? " past" : "") + '"><b>' + clock(open) + "</b><span>Doors open</span></li>");
    ev.forEach(function (e) {
      var m = toMins(e.s), x = (m - lo) / (hi - lo) * 100, past = isToday && nowM > toMins(e.e && e.e !== e.s ? e.e : e.s) ;
      low = (x - lastX < 17) ? !low : false; lastX = x;
      var when = span(m, e.e && e.e !== e.s ? toMins(e.e) : null);
      var name = e.u ? '<a href="' + esc(e.u) + '">' + esc(e.t) + "</a>" : esc(e.t);
      html += '<div class="pin' + (past ? " past" : "") + (low ? " low" : "") + '" style="left:' + x.toFixed(2) + '%"><div class="pin-dot"></div><b>' + esc(clock(m)) + " " + name + "</b><span>" + esc(e.blurb) + "</span></div>";
      list.push("<li" + (past ? ' class="past"' : "") + "><b>" + esc(when) + " " + name + "</b><span>" + esc(e.blurb) + "</span></li>");
    });
    list.push('<li class="edge"><b>' + clock(close) + "</b><span>Closing</span></li>");
    var nowOn = isToday && nowM >= lo && nowM <= hi;
    if (nowOn) {
      html += '<div class="now" style="left:' + pos(lo) + '"><span class="now-label">Now ' + clock(nowM).replace(" ", " ") + '</span><svg viewBox="0 0 34 30" aria-hidden="true"><path d="M17 15C13 4 4 1 2 4s1 11 9 12c-7 2-8 9-5 11s8-2 11-10c3 8 8 12 11 10s2-9-5-11c8-1 11-9 9-12s-11 0-15 11z" fill="#FDDA25" stroke="#582C83" stroke-width="1.6" stroke-linejoin="round"/><path d="M17 8v16" stroke="#582C83" stroke-width="2.2" stroke-linecap="round"/></svg></div>';
    }
    var hasLow = /pin[^"]* low/.test(html);
    var track = board.querySelector(".track");
    track.style.height = hasLow ? "250px" : "178px";
    track.innerHTML = html;
    board.querySelector(".today-list").innerHTML = list.join("");
    var note = board.querySelector("[data-today-note]");
    if (note) note.textContent = live ? "Pulled live from the Butterfly House calendar." : "From the Butterfly House calendar.";
    if (nowOn) {
      var n = track.querySelector(".now"), f = track.querySelector(".track-fill");
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        n.classList.add("go"); f.classList.add("go"); n.style.left = pos(nowM); f.style.width = pos(nowM);
      }); });
    }
  }
  if (board) {
    var h0 = hoursFor(NOW.iso);
    var target = (h0 && h0.open && NOW.mins < toMins(h0.close)) ? { iso: NOW.iso, n: 0 } : nextOpen(NOW.iso, 1) || { iso: NOW.iso, n: 0 };
    if (!target.h) target.h = hoursFor(target.iso);
    drawToday(target, bakedFor(target.iso), false);
    liveRange(target.iso, target.iso).then(function (live) {
      var closed = live.some(function (e) { return /^CLOSED/i.test(e.t); });
      if (!live.length && D.events.some(function (e) { return e.d === target.iso; })) return; // keep baked
      if (closed) return; // a closure posted after build: keep the baked view rather than guess
      drawToday(target, live.map(norm).concat(extrasFor(target.iso)), true);
    }).catch(function () {});
  }

  /* ---------- weather (outside) ---------- */
  var wx = document.querySelector("[data-wx]");
  if (wx) {
    var W = { 0: "clear skies", 1: "mostly clear", 2: "partly cloudy", 3: "overcast", 45: "fog", 48: "freezing fog", 51: "light drizzle", 53: "drizzle", 55: "heavy drizzle", 56: "freezing drizzle", 57: "freezing drizzle", 61: "light rain", 63: "rain", 65: "heavy rain", 66: "freezing rain", 67: "freezing rain", 71: "light snow", 73: "snow", 75: "heavy snow", 77: "snow grains", 80: "rain showers", 81: "rain showers", 82: "heavy showers", 85: "snow showers", 86: "heavy snow showers", 95: "thunderstorms", 96: "thunderstorms", 99: "thunderstorms" };
    fetchJSON("https://api.open-meteo.com/v1/forecast?latitude=46.8721&longitude=-113.994&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FDenver", 6000)
      .then(function (j) {
        var c = j.current; if (!c || c.temperature_2m == null) return;
        wx.querySelector("[data-wx-temp]").textContent = Math.round(c.temperature_2m) + "°F";
        wx.querySelector("[data-wx-sky]").textContent = "and " + (W[c.weather_code] || "changeable");
        wx.hidden = false;
      }).catch(function () {});
  }

  /* ---------- upcoming (home): hide anything already past ---------- */
  document.querySelectorAll("[data-until]").forEach(function (el) {
    if (el.getAttribute("data-until") < NOW.iso) el.remove();
  });
  var ups = document.querySelectorAll(".upcoming .up");
  for (var u = 3; u < ups.length; u++) ups[u].remove();

  /* ---------- tabs ---------- */
  document.querySelectorAll("[role=tablist]").forEach(function (tl) {
    var tabs = Array.prototype.slice.call(tl.querySelectorAll("[role=tab]"));
    function sel(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { sel(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, j = k === "ArrowRight" ? i + 1 : k === "ArrowLeft" ? i - 1 : k === "Home" ? 0 : k === "End" ? tabs.length - 1 : null;
        if (j === null) return; e.preventDefault(); sel(tabs[(j + tabs.length) % tabs.length], true);
      });
    });
  });

  /* ---------- grade picker (learn) ---------- */
  var gp = document.querySelector("[data-grades]");
  if (gp) {
    var progs = document.querySelectorAll(".prog");
    gp.addEventListener("click", function (e) {
      var b = e.target.closest(".grade"); if (!b) return;
      gp.querySelectorAll(".grade").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      var g = b.getAttribute("data-g"), shown = 0;
      progs.forEach(function (p) {
        var on = g === "all" || (" " + p.getAttribute("data-for") + " ").indexOf(" " + g + " ") > -1;
        p.hidden = !on; if (on) shown++;
      });
      var c = document.querySelector("[data-grade-count]");
      if (c) c.textContent = shown + (shown === 1 ? " program" : " programs") + (g === "all" ? "" : " for this grade");
    });
  }

  /* ---------- events page ---------- */
  var cal = document.querySelector("[data-cal]");
  function renderCal(list) {
    var by = {};
    dedupe(list).forEach(function (e) {
      var n = e.kind ? e : norm(e);
      if (n.d < NOW.iso) return;
      (by[n.d] = by[n.d] || []).push(n);
    });
    var days = Object.keys(by).sort().slice(0, 60), html = "";
    days.forEach(function (d) {
      var items = by[d].sort(function (a, b) { return (a.allday ? "00" : a.s) < (b.allday ? "00" : b.s) ? -1 : 1; });
      var dt = new Date(d + "T12:00:00Z");
      html += '<section class="day" data-day="' + d + '"><h2 class="day-date">' + MONTHS[dt.getUTCMonth()].slice(0, 3) + " " + dt.getUTCDate() + "<small>" + DAYS[dt.getUTCDay()] + (d === NOW.iso ? ", today" : "") + "</small></h2><div>";
      items.forEach(function (e) {
        var when = e.closed || e.allday ? "All day" : span(toMins(e.s), e.e && e.e !== e.s ? toMins(e.e) : null);
        var name = e.u ? '<a href="' + esc(e.u) + '">' + esc(e.t) + "</a>" : esc(e.t);
        var k = e.closed ? "closed" : e.kind;
        html += '<div class="ev' + (e.closed ? " closed" : "") + '" data-kind="' + k + '"><time>' + when + "</time><div><h3>" + (e.closed ? "Closed" + (/MAINT/i.test(e.t) ? " for maintenance" : "") : name) + "</h3>" + (e.blurb && !e.closed && e.kind !== "daily" ? "<p>" + esc(e.blurb) + "</p>" : "") + "</div></div>";
      });
      html += "</div></section>";
    });
    cal.innerHTML = html || '<p class="lede">Nothing is on the calendar for the next few weeks yet. Check back soon, or call (406) 317-1211.</p>';
    applyFilter();
  }
  var curFilter = "all", expanded = false, LIMIT = 14;
  var moreBtn = document.querySelector("[data-cal-more]");
  function applyFilter() {
    var shown = 0, extra = 0;
    cal.querySelectorAll(".day").forEach(function (day) {
      var any = 0;
      day.querySelectorAll(".ev").forEach(function (ev) {
        var on = curFilter === "all" || ev.getAttribute("data-kind") === curFilter;
        ev.hidden = !on; if (on) any++;
      });
      if (any && !expanded && shown >= LIMIT) { day.hidden = true; extra++; return; }
      day.hidden = !any; if (any) shown++;
    });
    if (moreBtn) { moreBtn.hidden = !extra; moreBtn.textContent = "Show " + extra + " more " + (extra === 1 ? "day" : "days"); }
  }
  if (moreBtn) moreBtn.addEventListener("click", function () { expanded = true; applyFilter(); });
  if (cal) {
    document.querySelectorAll(".filter").forEach(function (b) {
      b.addEventListener("click", function () {
        curFilter = b.getAttribute("data-f");
        document.querySelectorAll(".filter").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        applyFilter();
      });
    });
    renderCal(D.events.map(norm));
    var note = document.querySelector("[data-cal-note]");
    liveRange(NOW.iso, addDays(NOW.iso, 45), 4).then(function (live) {
      if (!live.length) return;
      var extras = D.events.filter(function (e) { return e.x; });
      renderCal(live.map(norm).concat(extras.map(norm)));
      if (note) note.textContent = "Pulled live from the Butterfly House calendar just now.";
    }).catch(function () {});
  }

  /* ---------- What's Buzzin' (home): newest posts from their WordPress ---------- */
  var buzz = document.querySelector("[data-buzz]");
  if (buzz) {
    fetchJSON(API + "/wp/v2/posts?per_page=3&_fields=link,title,date,excerpt,jetpack_featured_media_url", 7000).then(function (posts) {
      if (!posts.length || posts[0].link === buzz.getAttribute("data-first")) return;
      buzz.innerHTML = posts.map(function (p) {
        var d = new Date(p.date), ex = unent(p.excerpt.rendered.replace(/<[^>]+>/g, "")).replace(/\s*\[…\]|\s*\[&hellip;\]/, "…").slice(0, 170);
        return '<article class="post">' + (p.jetpack_featured_media_url ? '<img src="' + esc(p.jetpack_featured_media_url.split("?")[0].replace("https://", "https://i0.wp.com/") + "?fit=700%2C700&quality=80&ssl=1") + '" alt="" loading="lazy" width="700" height="700">' : "") +
          '<p class="d">' + MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + '</p><h3><a href="' + esc(p.link) + '">' + esc(unent(p.title.rendered)) + "</a></h3><p>" + esc(ex) + "</p></article>";
      }).join("");
    }).catch(function () {});
  }
})();
