/*
 * Heuristic crowd index for Disney's six resorts worldwide.
 * Returns an integer 1-10 per date + resort code.
 *
 * Resort codes:
 *   wdw  - Walt Disney World (Florida)
 *   dlr  - Disneyland Resort (California)
 *   tdr  - Tokyo Disney Resort (Japan)
 *   dlp  - Disneyland Paris (France)
 *   shdr - Shanghai Disney Resort (China)
 *   hkdl - Hong Kong Disneyland (Hong Kong)
 *
 * Each resort has its own holiday calendar, school-break pattern,
 * and weekday/weekend skew. These are heuristics — not forecasts.
 */

const CrowdCalc = (() => {

  // ---- shared date helpers ----

  function ymd(d) {
    return d.toISOString().slice(0, 10);
  }

  function nthWeekdayOfMonth(year, month, weekday, n) {
    const first = new Date(year, month, 1);
    const offset = (weekday - first.getDay() + 7) % 7;
    return new Date(year, month, 1 + offset + (n - 1) * 7);
  }

  function lastWeekdayOfMonth(year, month, weekday) {
    const last = new Date(year, month + 1, 0);
    const offset = (last.getDay() - weekday + 7) % 7;
    return new Date(year, month, last.getDate() - offset);
  }

  function easter(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  function daysBetween(a, b) {
    return Math.round((a - b) / 86400000);
  }

  function inMonthRange(d, m1, d1, m2, d2) {
    const m = d.getMonth(), day = d.getDate();
    if (m < m1 || m > m2) return false;
    if (m === m1 && day < d1) return false;
    if (m === m2 && day > d2) return false;
    return true;
  }

  // Lunar (Chinese) New Year — approximate cached table 2024-2030.
  function lunarNewYear(year) {
    const table = {
      2024: [1, 10], 2025: [0, 29], 2026: [1, 17],
      2027: [1, 6],  2028: [0, 26], 2029: [1, 13], 2030: [1, 3]
    };
    const e = table[year];
    return e ? new Date(year, e[0], e[1]) : null;
  }

  // ---- shared boost functions ----

  function dayOfWeekBase(d, weights) {
    return weights[d.getDay()];
  }

  function clamp(n) {
    n = Math.round(n);
    if (n < 1) return 1;
    if (n > 10) return 10;
    return n;
  }

  // =============================================
  // WDW (Florida) — U.S. travel destination resort
  // =============================================
  function calcWDW(d) {
    const yr = d.getFullYear();
    const m = d.getMonth(), day = d.getDate();
    let s = dayOfWeekBase(d, [4.0, 3.4, 3.0, 3.4, 4.0, 4.6, 4.8]);

    // soft / lift months
    s += ({ 0: -0.6, 1: -0.4, 4: -0.2, 8: -0.6, 11: -0.2 }[m] || 0);
    s += ({ 5: 0.4, 6: 0.6, 9: 0.4 }[m] || 0);

    // U.S. spring break (Easter-anchored)
    const e = easter(yr);
    const diffE = Math.abs(daysBetween(d, e));
    if (m === 2 || (m === 3 && day <= 15)) s += 1.2;
    if (diffE <= 4) s += 2.2;
    else if (diffE <= 9) s += 1.4;
    else if (diffE <= 14) s += 0.6;

    // U.S. summer break
    if (m === 5 && day >= 12) s += 1.5;
    else if (m === 6) s += day <= 20 ? 2.4 : 1.8;
    else if (m === 7 && day <= 15) s += 1.2;
    else if (m === 7) s += 0.6;

    // Winter holiday peak
    if (m === 11 && day >= 26) s += 5.5;
    else if (m === 11 && day >= 22) s += 4.0;
    else if (m === 11 && day >= 20) s += 2.8;
    else if (m === 0 && day <= 2) s += 5.0;
    else if (m === 0 && day <= 5) s += 1.6;
    else if (m === 11 && day >= 1 && day <= 19) s += 0.5;

    // Thanksgiving (4th Thu Nov)
    const tg = nthWeekdayOfMonth(yr, 10, 4, 4);
    const diffT = daysBetween(d, tg);
    if (diffT >= -1 && diffT <= 3) s += 2.8;
    else if (diffT >= -3 && diffT <= 5) s += 1.0;

    // U.S. federal-holiday 3-day weekends
    const holidays = [
      nthWeekdayOfMonth(yr, 0, 1, 3),  // MLK
      nthWeekdayOfMonth(yr, 1, 1, 3),  // Presidents
      lastWeekdayOfMonth(yr, 4, 1),    // Memorial
      nthWeekdayOfMonth(yr, 8, 1, 1),  // Labor
      nthWeekdayOfMonth(yr, 9, 1, 2),  // Columbus
      new Date(yr, 10, 11),            // Veterans
      new Date(yr, 5, 19),             // Juneteenth
      new Date(yr, 6, 4),              // July 4
    ];
    let maxH = 0;
    for (let i = 0; i < holidays.length; i++) {
      const diff = Math.abs(daysBetween(d, holidays[i]));
      let b = 0;
      if (i === 7) { if (diff <= 1) b = 2.2; else if (diff <= 3) b = 1.0; }
      else if (i === 2 || i === 3) { if (diff <= 1) b = 2.6; else if (diff <= 3) b = 1.2; }
      else { if (diff <= 1) b = 1.2; else if (diff <= 3) b = 0.4; }
      if (b > maxH) maxH = b;
    }
    s += maxH;

    // Halloween season
    if (m === 9) {
      const dow = d.getDay();
      if (day >= 25) s += 1.6;
      else if (dow === 5 || dow === 6) s += 1.0;
      else s += 0.5;
    } else if (m === 8 && day >= 15) s += 0.6;

    // Marathon weekend
    if (m === 0 && day >= 5 && day <= 14) {
      const dow = d.getDay();
      s += (dow === 5 || dow === 6 || dow === 0) ? 1.2 : 0.5;
    }

    return s;
  }

  // =============================================
  // DLR (California) — local annual-passholder heavy, day-trip park
  // =============================================
  function calcDLR(d) {
    const yr = d.getFullYear();
    const m = d.getMonth(), day = d.getDate();
    let s = dayOfWeekBase(d, [4.2, 3.0, 2.6, 3.0, 3.6, 5.0, 5.4]);

    s += ({ 0: -0.6, 1: -0.4, 4: -0.2, 8: -0.6, 11: -0.2 }[m] || 0);
    s += ({ 5: 0.4, 6: 0.6, 9: 0.4 }[m] || 0);

    const e = easter(yr);
    const diffE = Math.abs(daysBetween(d, e));
    if (m === 2 || (m === 3 && day <= 15)) s += 1.2;
    if (diffE <= 4) s += 2.2;
    else if (diffE <= 9) s += 1.4;
    else if (diffE <= 14) s += 0.6;

    if (m === 5 && day >= 12) s += 1.2;
    else if (m === 6) s += day <= 20 ? 2.0 : 1.6;
    else if (m === 7 && day <= 15) s += 1.0;
    else if (m === 7) s += 0.5;

    if (m === 11 && day >= 26) s += 4.8;
    else if (m === 11 && day >= 22) s += 3.5;
    else if (m === 11 && day >= 20) s += 2.4;
    else if (m === 0 && day <= 2) s += 4.4;
    else if (m === 11 && day >= 1 && day <= 19) s += 0.6;

    const tg = nthWeekdayOfMonth(yr, 10, 4, 4);
    const diffT = daysBetween(d, tg);
    if (diffT >= -1 && diffT <= 3) s += 2.4;
    else if (diffT >= -3 && diffT <= 5) s += 0.9;

    // Federal holiday 3-day weekends (lighter spike than WDW — DLR is day-trip)
    const holidays = [
      nthWeekdayOfMonth(yr, 0, 1, 3),
      nthWeekdayOfMonth(yr, 1, 1, 3),
      lastWeekdayOfMonth(yr, 4, 1),
      nthWeekdayOfMonth(yr, 8, 1, 1),
      new Date(yr, 6, 4),
    ];
    let maxH = 0;
    for (let i = 0; i < holidays.length; i++) {
      const diff = Math.abs(daysBetween(d, holidays[i]));
      let b = 0;
      if (i === 4) { if (diff <= 1) b = 1.8; else if (diff <= 3) b = 0.8; }
      else { if (diff <= 1) b = 1.5; else if (diff <= 3) b = 0.6; }
      if (b > maxH) maxH = b;
    }
    s += maxH;

    if (m === 9) {
      const dow = d.getDay();
      if (day >= 25) s += 1.6;
      else if (dow === 5 || dow === 6) s += 1.0;
      else s += 0.5;
    } else if (m === 8 && day >= 15) s += 0.6;

    return s * 0.96; // DLR slightly less swingy
  }

  // =============================================
  // TDR (Tokyo) — local-heavy, Japanese holiday calendar
  // =============================================
  function calcTDR(d) {
    const yr = d.getFullYear();
    const m = d.getMonth(), day = d.getDate();

    // Japan park weekend skew is huge — local day-trip culture
    let s = dayOfWeekBase(d, [5.6, 3.0, 2.4, 2.6, 3.4, 5.2, 6.0]);

    s += ({ 0: -0.2, 5: 0.3, 1: -0.4 }[m] || 0);

    // Japanese New Year (Dec 30 – Jan 3 is the big spike)
    if (m === 11 && day >= 30) s += 4.0;
    else if (m === 11 && day >= 26) s += 2.4;
    else if (m === 0 && day <= 3) s += 4.5;
    else if (m === 0 && day <= 7) s += 2.0;

    // Coming-of-age day (2nd Monday Jan)
    const coa = nthWeekdayOfMonth(yr, 0, 1, 2);
    const diffCoa = Math.abs(daysBetween(d, coa));
    if (diffCoa <= 1) s += 1.4;

    // Golden Week: Apr 29 - May 5 (Showa Day, Constitution Day, Greenery, Children's)
    if (m === 3 && day === 29) s += 3.0;
    if (m === 4 && day <= 5) s += 4.0;
    if (m === 4 && day >= 6 && day <= 8) s += 1.4;
    if (m === 3 && day >= 27 && day <= 28) s += 1.8;

    // Obon holiday (mid August)
    if (m === 7 && day >= 11 && day <= 16) s += 3.2;
    else if (m === 7 && day >= 8 && day <= 10) s += 1.4;
    else if (m === 7 && day >= 17 && day <= 20) s += 1.0;

    // Silver Week — mid-late September (rough heuristic, varies year to year)
    if (m === 8 && day >= 19 && day <= 23) s += 1.6;

    // Japanese school summer holiday: mid-July to end of August
    if (m === 6 && day >= 20) s += 1.4;
    else if (m === 7 && day <= 31) s += 1.6;

    // Spring school holiday late March
    if (m === 2 && day >= 22) s += 1.2;
    else if (m === 3 && day <= 5) s += 1.0;

    // Christmas season at TDR is huge for couples / dates
    if (m === 11 && day >= 18 && day <= 25) s += 2.4;
    else if (m === 11 && day >= 1 && day <= 17) s += 0.6;

    // Halloween — TDR Halloween is one of their biggest events
    if (m === 9) {
      const dow = d.getDay();
      if (day >= 25) s += 2.0;
      else if (dow === 5 || dow === 6 || dow === 0) s += 1.4;
      else s += 0.7;
    }
    if (m === 8 && day >= 15) s += 0.8;

    return s;
  }

  // =============================================
  // DLP (Paris) — French school zones + European holidays
  // =============================================
  function calcDLP(d) {
    const yr = d.getFullYear();
    const m = d.getMonth(), day = d.getDate();
    let s = dayOfWeekBase(d, [4.6, 3.0, 2.6, 3.2, 3.4, 4.2, 5.0]);

    s += ({ 0: -0.6, 1: -0.4, 8: -0.4, 10: -0.6 }[m] || 0);

    // French school holidays (roughly nationwide):
    // Toussaint: late Oct - early Nov (2 weeks)
    if (m === 9 && day >= 19) s += 2.4;
    else if (m === 10 && day <= 5) s += 2.2;

    // Christmas: Dec 19 - Jan 3
    if (m === 11 && day >= 23) s += 4.2;
    else if (m === 11 && day >= 19) s += 2.6;
    else if (m === 0 && day <= 3) s += 3.4;
    else if (m === 0 && day <= 6) s += 1.4;
    else if (m === 11 && day >= 1) s += 0.8;

    // February break (winter holidays — rotating zones, broad window mid-Feb to early March)
    if (m === 1 && day >= 8) s += 1.6;
    else if (m === 2 && day <= 8) s += 1.4;

    // Easter / spring break — French Easter holidays are 2 weeks around Easter
    const e = easter(yr);
    const diffE = daysBetween(d, e);
    if (diffE >= -10 && diffE <= 10) s += 2.4;
    else if (diffE >= -16 && diffE <= 16) s += 1.2;

    // May has multiple bank holidays (Labour Day, Victory Day, Ascension)
    if (m === 4 && day <= 10) s += 1.4;
    if (m === 4 && day === 1) s += 0.8;
    if (m === 4 && day === 8) s += 0.8;

    // Summer school break: July - August (peak first 3 weeks of Aug)
    if (m === 6 && day >= 8) s += 1.6;
    else if (m === 7 && day <= 22) s += 2.4;
    else if (m === 7) s += 1.6;

    // Halloween season at DLP
    if (m === 9) {
      const dow = d.getDay();
      if (day >= 25) s += 1.6;
      else if (dow === 5 || dow === 6) s += 1.0;
      else s += 0.4;
    }

    // UK half-term in late October bumps DLP
    if (m === 9 && day >= 24 && day <= 30) s += 0.6;

    return s;
  }

  // =============================================
  // SHDR (Shanghai) — Chinese national holidays
  // =============================================
  function calcSHDR(d) {
    const yr = d.getFullYear();
    const m = d.getMonth(), day = d.getDate();
    let s = dayOfWeekBase(d, [4.8, 2.6, 2.2, 2.6, 3.2, 4.4, 5.4]);

    s += ({ 1: -0.4, 10: -0.4 }[m] || 0);

    // Chinese New Year - 7-day Golden Week
    const cny = lunarNewYear(yr);
    if (cny) {
      const diffC = daysBetween(d, cny);
      if (diffC >= -1 && diffC <= 6) s += 4.4;
      else if (diffC >= -3 && diffC <= 9) s += 1.8;
    }

    // National Day Golden Week: Oct 1-7 (the single biggest crowd window)
    if (m === 9 && day >= 1 && day <= 7) s += 5.0;
    else if (m === 9 && day === 8) s += 2.2;
    else if (m === 8 && day >= 28) s += 1.4;

    // Labour Day holiday: May 1-5
    if (m === 4 && day <= 5) s += 3.4;
    else if (m === 3 && day >= 29) s += 1.4;

    // Tomb-Sweeping (Qingming): April 4-6 ish
    if (m === 3 && day >= 3 && day <= 6) s += 1.6;

    // Dragon Boat: typically early June (varies)
    if (m === 5 && day >= 7 && day <= 12) s += 1.2;

    // Mid-Autumn / mooncake (varies, broad mid-late Sep)
    if (m === 8 && day >= 15 && day <= 22) s += 1.2;

    // Chinese summer school break: mid-July through end of August
    if (m === 6 && day >= 15) s += 1.8;
    else if (m === 7) s += day <= 25 ? 2.0 : 1.2;

    // Winter break around CNY already covered; Christmas itself is mild in mainland China
    if (m === 11 && day >= 24 && day <= 26) s += 0.8;

    return s;
  }

  // =============================================
  // HKDL (Hong Kong) — mix of local + mainland tourism
  // =============================================
  function calcHKDL(d) {
    const yr = d.getFullYear();
    const m = d.getMonth(), day = d.getDate();
    let s = dayOfWeekBase(d, [4.6, 2.8, 2.4, 2.8, 3.2, 4.4, 5.2]);

    s += ({ 1: -0.4, 10: -0.4 }[m] || 0);

    // Chinese New Year crush from mainland visitors
    const cny = lunarNewYear(yr);
    if (cny) {
      const diffC = daysBetween(d, cny);
      if (diffC >= -1 && diffC <= 6) s += 4.0;
      else if (diffC >= -3 && diffC <= 9) s += 1.6;
    }

    // National Day Golden Week (mainland visitors)
    if (m === 9 && day >= 1 && day <= 7) s += 3.8;
    else if (m === 9 && day === 8) s += 1.6;

    // Easter (HK has Good Friday + Easter Monday as public holidays)
    const e = easter(yr);
    const diffE = daysBetween(d, e);
    if (diffE >= -3 && diffE <= 2) s += 2.4;
    else if (diffE >= -7 && diffE <= 7) s += 1.0;

    // Buddha's Birthday — early-mid May (varies)
    if (m === 4 && day >= 5 && day <= 15) s += 0.8;

    // HK summer break: July to August
    if (m === 6 && day >= 10) s += 1.4;
    else if (m === 7) s += day <= 22 ? 1.8 : 1.2;

    // Mid-Autumn
    if (m === 8 && day >= 15 && day <= 22) s += 1.0;

    // Christmas — bigger in HK than mainland
    if (m === 11 && day >= 22 && day <= 26) s += 2.4;
    else if (m === 11 && day >= 27) s += 1.4;

    // Labour Day
    if (m === 4 && day === 1) s += 1.0;

    return s;
  }

  // ---- dispatch ----

  const calculators = {
    wdw: calcWDW,
    dlr: calcDLR,
    tdr: calcTDR,
    dlp: calcDLP,
    shdr: calcSHDR,
    hkdl: calcHKDL,
  };

  function indexFor(date, resort) {
    const fn = calculators[resort] || calcWDW;
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return clamp(fn(d));
  }

  // ---- "why" / reasons explainer ----

  function reasonsFor(date, resort) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const yr = d.getFullYear();
    const m = d.getMonth(), day = d.getDate(), dow = d.getDay();
    const reasons = [];

    if (dow === 5 || dow === 6 || dow === 0) reasons.push("Weekend");

    // Universal Easter window
    const e = easter(yr);
    const diffE = daysBetween(d, e);

    if (resort === "wdw" || resort === "dlr") {
      if (m === 2 || (m === 3 && day <= 15)) reasons.push("U.S. spring break window");
      if (Math.abs(diffE) <= 9) reasons.push("Easter holiday week");
      if (m === 5 && day >= 15) reasons.push("Summer break begins");
      else if (m === 6) reasons.push("Peak summer break");
      else if (m === 7 && day <= 15) reasons.push("Late summer break");
      if (m === 11 && day >= 22) reasons.push("Christmas / New Year peak");
      if (m === 0 && day <= 5) reasons.push("New Year week");
      const tg = nthWeekdayOfMonth(yr, 10, 4, 4);
      const dt = daysBetween(d, tg);
      if (dt >= -1 && dt <= 3) reasons.push("Thanksgiving holiday");
      if (m === 9) reasons.push("Halloween season");
      if (m === 6 && day >= 2 && day <= 6) reasons.push("Independence Day weekend");
      if (resort === "wdw" && m === 0 && day >= 5 && day <= 14) reasons.push("runDisney Marathon weekend");
    }

    if (resort === "tdr") {
      if (m === 11 && day >= 30) reasons.push("Japanese New Year (Oshōgatsu)");
      if (m === 0 && day <= 3) reasons.push("Japanese New Year (Oshōgatsu)");
      if ((m === 3 && day >= 29) || (m === 4 && day <= 5)) reasons.push("Golden Week");
      if (m === 7 && day >= 11 && day <= 16) reasons.push("Obon holiday");
      if (m === 9 && day >= 1) reasons.push("Disney Halloween season");
      if (m === 11 && day >= 18 && day <= 25) reasons.push("Christmas season");
      if ((m === 6 && day >= 20) || (m === 7 && day <= 31)) reasons.push("School summer holiday");
    }

    if (resort === "dlp") {
      if (Math.abs(diffE) <= 10) reasons.push("Easter / spring holidays");
      if (m === 9 && day >= 19) reasons.push("Toussaint school holidays");
      if (m === 10 && day <= 5) reasons.push("Toussaint school holidays");
      if (m === 11 && day >= 19) reasons.push("Christmas holidays");
      if (m === 0 && day <= 3) reasons.push("New Year holidays");
      if ((m === 6 && day >= 8) || m === 7) reasons.push("European summer holiday");
      if (m === 9) reasons.push("Halloween season");
      if (m === 4 && (day === 1 || day === 8)) reasons.push("French bank holiday");
    }

    if (resort === "shdr") {
      const cny = lunarNewYear(yr);
      if (cny) {
        const diffC = daysBetween(d, cny);
        if (diffC >= -1 && diffC <= 6) reasons.push("Chinese New Year Golden Week");
      }
      if (m === 9 && day >= 1 && day <= 7) reasons.push("National Day Golden Week");
      if (m === 4 && day <= 5) reasons.push("Labour Day holiday");
      if ((m === 6 && day >= 15) || m === 7) reasons.push("Summer school break");
    }

    if (resort === "hkdl") {
      const cny = lunarNewYear(yr);
      if (cny) {
        const diffC = daysBetween(d, cny);
        if (diffC >= -1 && diffC <= 6) reasons.push("Chinese New Year holidays");
      }
      if (m === 9 && day >= 1 && day <= 7) reasons.push("Golden Week (mainland visitors)");
      if (Math.abs(diffE) <= 3) reasons.push("Easter long weekend");
      if (m === 6 && day >= 10) reasons.push("Summer school break");
      else if (m === 7) reasons.push("Summer school break");
      if (m === 11 && day >= 22 && day <= 26) reasons.push("Christmas season");
    }

    if (reasons.length === 0) reasons.push("Typical day for this season");
    return reasons;
  }

  // ---- resort metadata for UI ----

  const resorts = [
    { code: "wdw",  name: "Walt Disney World",     short: "WDW",      flag: "🇺🇸", country: "Florida, USA",     parks: "Magic Kingdom · EPCOT · DHS · AK" },
    { code: "dlr",  name: "Disneyland Resort",     short: "DLR",      flag: "🇺🇸", country: "California, USA",  parks: "Disneyland Park · DCA" },
    { code: "tdr",  name: "Tokyo Disney Resort",   short: "TDR",      flag: "🇯🇵", country: "Tokyo, Japan",     parks: "Tokyo Disneyland · DisneySea" },
    { code: "dlp",  name: "Disneyland Paris",      short: "DLP",      flag: "🇫🇷", country: "Paris, France",    parks: "Disneyland Park · Walt Disney Studios" },
    { code: "shdr", name: "Shanghai Disney Resort", short: "Shanghai", flag: "🇨🇳", country: "Shanghai, China",  parks: "Shanghai Disneyland" },
    { code: "hkdl", name: "Hong Kong Disneyland",  short: "Hong Kong", flag: "🇭🇰", country: "Hong Kong",        parks: "Hong Kong Disneyland" },
  ];

  return { indexFor, reasonsFor, ymd, resorts };
})();
