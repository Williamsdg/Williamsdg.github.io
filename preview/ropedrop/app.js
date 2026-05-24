(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // ---- Share button ----
  const shareBtn = $("#share-btn");
  const shareToast = $("#share-toast");
  let toastTimer = null;
  function flashToast(msg) {
    if (!shareToast) return;
    shareToast.textContent = msg;
    shareToast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => shareToast.classList.remove("show"), 2200);
  }
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const shareData = {
        title: "RopeDrop — Disney park-day launchpad",
        text: "RopeDrop: fast Lightning Lane & Virtual Queue launchpad plus a crowd calendar for your Disney park day.",
        url: "https://williamsdigital.io/preview/ropedrop/"
      };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareData.url);
          flashToast("Link copied to clipboard");
        } else {
          window.prompt("Copy this link:", shareData.url);
        }
      } catch (err) {
        if (err && err.name !== "AbortError") flashToast("Couldn't share — try copying the URL instead");
      }
    });
  }

  const overlay = $("#magic-overlay");
  const overlayTitle = $("#overlay-title");
  const overlaySub = $("#overlay-sub");
  const overlayIcon = $("#overlay-icon");
  const overlaySteps = $$(".overlay-step");

  function launchMagic(targetUrl, action, resortName, park) {
    const isLL = action === "ll";
    overlayIcon.textContent = isLL ? "⚡" : "🌐";
    overlayTitle.textContent = isLL
      ? "Securing your Lightning Lane…"
      : "Joining the Virtual Queue…";
    overlaySub.textContent = resortName;
    overlay.classList.remove("done");
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    overlaySteps.forEach((s) => s.classList.remove("active", "complete"));

    const stepTimings = [120, 700, 1500];
    stepTimings.forEach((t, i) => {
      setTimeout(() => {
        overlaySteps[i].classList.add("active");
        if (i > 0) overlaySteps[i - 1].classList.add("complete");
      }, t);
    });

    setTimeout(() => {
      overlaySteps[overlaySteps.length - 1].classList.add("complete");
      overlay.classList.add("done");
    }, 2200);

    setTimeout(() => {
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
      if (window.RopeDropLive) {
        window.RopeDropLive.open(park, action);
      } else {
        window.location.href = targetUrl;
      }
    }, 2200);
  }

  $$(".magic-btn").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      launchMagic(a.href, a.dataset.action, a.dataset.resortName || "", a.dataset.park);
    });
  });

  // ---- Resort rail ----
  const resortKey = "ropedrop.resort";
  const resorts = CrowdCalc.resorts;
  const validCodes = new Set(resorts.map((r) => r.code));
  let currentResort = localStorage.getItem(resortKey);
  if (!validCodes.has(currentResort)) currentResort = "wdw";

  const rail = $("#resort-rail");
  resorts.forEach((r) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "resort-chip" + (r.code === currentResort ? " active" : "");
    b.dataset.resort = r.code;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", r.code === currentResort ? "true" : "false");
    b.innerHTML =
      '<span class="chip-flag" aria-hidden="true">' + r.flag + '</span>' +
      '<span class="chip-name">' + r.short + '</span>';
    b.addEventListener("click", () => setResort(r.code));
    rail.appendChild(b);
  });

  const resortPill = $("#resort-pill");

  function setResort(r) {
    currentResort = r;
    localStorage.setItem(resortKey, r);
    const meta = resorts.find((x) => x.code === r);
    $$(".resort-chip").forEach((b) => {
      const active = b.dataset.resort === r;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    resortPill.textContent = meta.short;
    $("#meta-flag").textContent = meta.flag;
    $("#meta-name").textContent = meta.name;
    $("#meta-country").textContent = meta.country;
    $("#meta-parks").textContent = meta.parks;
    if (selectedDate) showSelected(selectedDate);
    else renderToday();
    renderCalendar();
  }

  // ---- Today / Selected panel ----
  const today = new Date();
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  function levelLabel(lvl) {
    if (lvl <= 2) return "Light";
    if (lvl <= 4) return "Moderate";
    if (lvl <= 6) return "Busy";
    if (lvl <= 8) return "Heavy";
    return "Packed";
  }

  function paintMeter(lvl) {
    $("#meter-fill").style.width = (lvl * 10) + "%";
    $("#meter-num").textContent = lvl;
    $("#meter-text").textContent = "/ 10";
    $("#meter-tier").textContent = levelLabel(lvl);
    $("#meter-tier").className = "meter-tier tier-" + lvl;
  }

  function renderToday() {
    const lvl = CrowdCalc.indexFor(today, currentResort);
    const reasons = CrowdCalc.reasonsFor(today, currentResort);
    $("#today-day").textContent = "Today · " + dayNames[today.getDay()];
    $("#today-full").textContent =
      monthNames[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();
    paintMeter(lvl);
    $("#today-note").textContent = reasons.join(" · ");
  }

  function showSelected(d) {
    const lvl = CrowdCalc.indexFor(d, currentResort);
    const reasons = CrowdCalc.reasonsFor(d, currentResort);
    const isToday = sameDay(d, today);
    $("#today-day").textContent = (isToday ? "Today · " : "") + dayNames[d.getDay()];
    $("#today-full").textContent =
      monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    paintMeter(lvl);
    $("#today-note").textContent = reasons.join(" · ");
  }

  // ---- Calendar ----
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = null;

  function sameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function renderCalendar() {
    $("#cal-title").textContent = monthNames[viewMonth] + " " + viewYear;
    const grid = $("#cal-grid");
    grid.innerHTML = "";
    grid.classList.remove("fade-in");
    // tiny reflow trick for the fade-in animation
    void grid.offsetWidth;
    grid.classList.add("fade-in");

    const dowLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    dowLabels.forEach((d, i) => {
      const el = document.createElement("div");
      el.className = "cal-dow" + (i === 0 || i === 6 ? " weekend" : "");
      el.textContent = d;
      grid.appendChild(el);
    });

    const first = new Date(viewYear, viewMonth, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < startDow; i++) {
      const el = document.createElement("div");
      el.className = "cal-cell empty";
      grid.appendChild(el);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day);
      const lvl = CrowdCalc.indexFor(d, currentResort);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-cell lvl-" + lvl;
      if (sameDay(d, today)) btn.classList.add("today");
      if (selectedDate && sameDay(d, selectedDate)) btn.classList.add("selected");
      btn.style.animationDelay = (day * 8) + "ms";
      btn.innerHTML =
        '<span class="cell-day">' + day + "</span>" +
        '<span class="cell-lvl">' + lvl + "</span>";
      btn.setAttribute(
        "aria-label",
        monthNames[viewMonth] + " " + day + ", level " + lvl + " of 10, " + levelLabel(lvl)
      );
      btn.addEventListener("click", () => {
        selectedDate = d;
        showSelected(d);
        renderCalendar();
      });
      grid.appendChild(btn);
    }
  }

  $("#prev-month").addEventListener("click", () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  $("#next-month").addEventListener("click", () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });
  $("#today-btn").addEventListener("click", () => {
    viewYear = today.getFullYear();
    viewMonth = today.getMonth();
    selectedDate = today;
    showSelected(today);
    renderCalendar();
  });

  // Keyboard nav: left/right arrows scroll months when calendar is in focus area
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowLeft") $("#prev-month").click();
    else if (e.key === "ArrowRight") $("#next-month").click();
  });

  // Boot
  setResort(currentResort);
})();
