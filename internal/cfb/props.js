/* Williams Digital · CFB Predictor — player prop engine.
 * Pure functions, no DOM. Browser: window.CFBProps. Node: module.exports (for tests and fitting).
 *
 * Ideas borrowed:
 *  - LeSingh1/edge-ncaaf (MIT): recency-weighted mean and spread from the game log (half-life in games),
 *    line → over probability, quarter-Kelly sizing. Its trained calibrator is NOT used: it was fit on
 *    synthesized lines, so it can't be trusted against real books.
 *  - fongster87/CFB-Player-Betting: adjust a player's per-game production for the opponent's yards allowed
 *    and the game script (spread / team scoring).
 *  - popcawn/cfb-td-predictor: anytime TD = team's Vegas-implied points → expected offensive TDs, split by
 *    opportunity (carries, catches) with TD rates shrunk toward the league rate; idle players scaled down.
 * Re-implemented from the published descriptions; no code copied.
 */
(function (root) {
  'use strict';

  // Fitted on 2025 + 2026 FBS box scores, walk-forward (see the Props track record in the app).
  var P = {
    oppK: 3,              // pseudo-games pulling an opponent's yards-allowed toward league average
    tdPerPoint: 0.119,    // offensive TDs per implied point (popcawn measured 0.119; refit below)
    tdShrink: 20,         // pseudo-opportunities pulling TD rates toward the league rate
    idleScale: 0.4,       // played last game but no touches / missed last game
    tdHalfLife: 4,
    tdCalA: 0.7, tdCalG: 0.6, // P(TD) = 1 − exp(−a·λ^g): fit on 2025, held-out 2026 Brier skill 8% vs base rate
    // FBS per-team-game averages, 2025 + 2026 box scores (stable year to year)
    league: { passYds: 219, passTD: 1.53, cmp: 18.8, rushYds: 156.8, rushTD: 1.61, car: 35.2, rec: 18.8, recYds: 219, recTD: 1.53, pts: 26.6, rushRec: 376 },
    // hl = recency half-life in games; opp / vol = exponents on the opponent and game-script factors;
    // cal = bias correction; sd = s0 + s1 * mean (spread of outcomes); dist = outcome distribution.
    stats: {
      passYds: { label: 'Passing yards',    hl: 4,  opp: 0.25, vol: 0.25, cal: 1.0,   s0: 75, s1: 0.07, dist: 'normal' },
      passTD:  { label: 'Passing TDs',      hl: 10, opp: 0.25, vol: 0.75, cal: 1.0,   dist: 'poisson' },
      rushYds: { label: 'Rushing yards',    hl: 6,  opp: 0.5,  vol: 0.25, cal: 0.983, s0: 28, s1: 0.2, dist: 'gamma', shift: 10 },
      recYds:  { label: 'Receiving yards',  hl: 10, opp: 0.25, vol: 0.25, cal: 0.943, s0: 15, s1: 0.42, dist: 'gamma', shift: 0 },
      rec:     { label: 'Receptions',       hl: 10, opp: 0.5,  vol: 0,    cal: 0.939, dist: 'negbin', disp: 0.06 },
      rushRec: { label: 'Rush + rec yards', hl: 6,  opp: 0.5,  vol: 0.25, cal: 0.986, s0: 30, s1: 0.21, dist: 'gamma', shift: 10 }
    }
  };

  /* ---------- parse CFBD /games/players into a compact shape ---------- */
  function n(x) { var v = parseFloat(x); return isFinite(v) ? v : 0; }
  /** → [{ id, teams: [{ team, homeAway, points, pl: { athleteId: [name, cmp, att, pyd, ptd, int, car, ryd, rtd, rec, reyd, retd] } }] }] */
  function slimBox(arr) {
    return (arr || []).map(function (g) {
      return {
        id: g.id, teams: (g.teams || []).map(function (t) {
          var pl = {};
          function row(id, name) { if (!pl[id]) pl[id] = [name, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; return pl[id]; }
          (t.categories || []).forEach(function (c) {
            if (c.name !== 'passing' && c.name !== 'rushing' && c.name !== 'receiving') return;
            (c.types || []).forEach(function (ty) {
              (ty.athletes || []).forEach(function (a) {
                if (!a.id || String(a.id).charAt(0) === '-' || /^\s*team\s*$/i.test(a.name || '')) return;
                var r = row(String(a.id), (a.name || '').trim());
                if (c.name === 'passing') {
                  if (ty.name === 'C/ATT') { var s = String(a.stat).split('/'); r[1] = n(s[0]); r[2] = n(s[1]); }
                  else if (ty.name === 'YDS') r[3] = n(a.stat); else if (ty.name === 'TD') r[4] = n(a.stat); else if (ty.name === 'INT') r[5] = n(a.stat);
                } else if (c.name === 'rushing') {
                  if (ty.name === 'CAR') r[6] = n(a.stat); else if (ty.name === 'YDS') r[7] = n(a.stat); else if (ty.name === 'TD') r[8] = n(a.stat);
                } else {
                  if (ty.name === 'REC') r[9] = n(a.stat); else if (ty.name === 'YDS') r[10] = n(a.stat); else if (ty.name === 'TD') r[11] = n(a.stat);
                }
              });
            });
          });
          return { team: t.team, homeAway: t.homeAway, points: t.points, pl: pl };
        })
      };
    });
  }

  function statOf(r, k) {
    switch (k) {
      case 'cmp': return r[1]; case 'att': return r[2]; case 'passYds': return r[3]; case 'passTD': return r[4];
      case 'car': return r[6]; case 'rushYds': return r[7]; case 'rushTD': return r[8];
      case 'rec': return r[9]; case 'recYds': return r[10]; case 'recTD': return r[11];
      case 'rushRec': return r[7] + r[10];
    }
    return 0;
  }

  /**
   * Build player logs and team logs from slimmed box scores.
   * meta: map gameId → { week, seasonType, startDate, neutralSite } (from /games).
   */
  function buildLogs(box, meta) {
    var players = {}, teams = {};
    box.forEach(function (g) {
      var m = meta[g.id] || {};
      var t0 = m.startDate ? Date.parse(m.startDate) : 0;
      if (g.teams.length !== 2) return;
      g.teams.forEach(function (T, i) {
        var O = g.teams[1 - i];
        var tot = { passYds: 0, passTD: 0, cmp: 0, rushYds: 0, rushTD: 0, car: 0, rec: 0, recYds: 0, recTD: 0 };
        Object.keys(T.pl).forEach(function (pid) {
          var r = T.pl[pid];
          tot.passYds += r[3]; tot.passTD += r[4]; tot.cmp += r[1]; tot.car += r[6]; tot.rushYds += r[7]; tot.rushTD += r[8]; tot.rec += r[9]; tot.recYds += r[10]; tot.recTD += r[11];
          var p = players[pid] || (players[pid] = { id: pid, name: r[0], team: T.team, games: [] });
          p.games.push({ gid: g.id, t: t0, week: m.week, opp: O.team, team: T.team, r: r });
        });
        var tl = teams[T.team] || (teams[T.team] = { team: T.team, games: [] });
        tl.games.push({ gid: g.id, t: t0, week: m.week, opp: O.team, pf: n(T.points), pa: n(O.points), off: tot, roster: Object.keys(T.pl) });
      });
    });
    // second pass: what each team allowed = opponent's offense in that game
    Object.keys(teams).forEach(function (k) {
      teams[k].games.forEach(function (tg) {
        var o = teams[tg.opp], og = o && o.games.filter(function (x) { return x.gid === tg.gid; })[0];
        tg.allowed = og ? og.off : null;
      });
      teams[k].games.sort(function (a, b) { return a.t - b.t; });
    });
    Object.keys(players).forEach(function (k) {
      var p = players[k]; p.games.sort(function (a, b) { return a.t - b.t; });
      p.team = p.games[p.games.length - 1].team; // latest team (transfers)
    });
    return { players: players, teams: teams };
  }

  /** Simple role from usage: QB (passes), RB (carries), WR/TE (catches). */
  function role(p, before) {
    var att = 0, car = 0, rec = 0;
    p.games.forEach(function (g) { if (before && g.t >= before) return; att += g.r[2]; car += g.r[6]; rec += g.r[9]; });
    if (att >= 8 * Math.max(1, gamesBefore(p, before).length) * 0.5 && att > car) return 'QB';
    return car >= rec ? 'RB' : 'WR';
  }
  function gamesBefore(p, before) { return before ? p.games.filter(function (g) { return g.t < before; }) : p.games; }

  /** League per-team-game averages of what offenses produce (used for opponent and volume factors). */
  function leagueAvg(logs, before) {
    var s = { passYds: 0, passTD: 0, cmp: 0, rushYds: 0, rushTD: 0, car: 0, rec: 0, recYds: 0, recTD: 0, pts: 0 }, c = 0;
    Object.keys(logs.teams).forEach(function (k) {
      logs.teams[k].games.forEach(function (g) {
        if (before && g.t >= before) return;
        Object.keys(g.off).forEach(function (x) { s[x] += g.off[x]; }); s.pts += g.pf; c++;
      });
    });
    Object.keys(s).forEach(function (x) { s[x] = c ? s[x] / c : 0; });
    s.rushRec = s.rushYds + s.recYds; s.games = c;
    return s;
  }
  var ALLOWED_KEY = { passYds: 'passYds', passTD: 'passTD', rushYds: 'rushYds', recYds: 'recYds', rec: 'rec', rushRec: 'rushRec' };
  function allowedOf(o, k) { return k === 'rushRec' ? o.rushYds + o.recYds : o[ALLOWED_KEY[k]]; }

  /** Opponent factor: yards (etc.) the opponent allows per game ÷ league average, shrunk toward 1. */
  function oppFactor(logs, opp, stat, before, lg) {
    var t = logs.teams[opp], sum = 0, cnt = 0;
    if (t) t.games.forEach(function (g) { if ((!before || g.t < before) && g.allowed) { sum += allowedOf(g.allowed, stat); cnt++; } });
    var avg = allowedOf(lg, stat);
    if (!avg) return 1;
    return (sum + P.oppK * avg) / ((cnt + P.oppK) * avg);
  }
  function teamPts(logs, team, before) {
    var t = logs.teams[team], s = 0, c = 0;
    if (t) t.games.forEach(function (g) { if (!before || g.t < before) { s += g.pf; c++; } });
    return c ? { avg: s / c, n: c } : null;
  }

  /** Recency-weighted mean / SD (edge-ncaaf). values oldest → newest. */
  function weighted(values, hl) {
    var nv = values.length; if (!nv) return { mean: 0, sd: 0, n: 0 };
    var ws = 0, ms = 0, i, w = [];
    for (i = 0; i < nv; i++) { w[i] = Math.pow(0.5, (nv - 1 - i) / hl); ws += w[i]; ms += w[i] * values[i]; }
    var mean = ms / ws, vs = 0;
    for (i = 0; i < nv; i++) vs += w[i] * (values[i] - mean) * (values[i] - mean);
    return { mean: mean, sd: Math.sqrt(vs / ws), n: nv };
  }

  /**
   * Project one stat for one player in an upcoming game.
   * ctx: { logs, before (ms), opp, impliedPts (team's Vegas-implied points, optional), lg (leagueAvg) }
   */
  function project(p, stat, ctx) {
    var cfg = P.stats[stat], hist = gamesBefore(p, ctx.before);
    var vals = hist.map(function (g) { return statOf(g.r, stat); });
    if (!vals.length) return null;
    var w = weighted(vals, cfg.hl);
    var lg = ctx.lg || leagueAvg(ctx.logs, ctx.before);
    var of = ctx.opp ? oppFactor(ctx.logs, ctx.opp, stat, ctx.before, lg) : 1;
    var vf = 1, tp = teamPts(ctx.logs, p.team, ctx.before);
    if (ctx.impliedPts != null && tp && tp.avg > 0) {
      var exp = (tp.avg * tp.n + lg.pts * 2) / (tp.n + 2); // shrink the team's scoring average
      vf = ctx.impliedPts / exp;
    }
    // cal: measured shrink — players who earn a prop line have usually been running hot, so they regress a bit.
    var mult = (cfg.cal || 1) * Math.pow(of, cfg.opp) * Math.pow(Math.max(0.3, vf), cfg.vol);
    if (ctx.idle) mult *= P.idleScale;
    var mean = Math.max(0, w.mean * mult);
    var sd = cfg.s0 != null ? cfg.s0 + cfg.s1 * mean : null;
    return { stat: stat, mean: mean, sd: sd, n: w.n, base: w.mean, oppF: of, volF: vf, mult: mult, log: vals, dist: cfg.dist, disp: cfg.disp, shift: cfg.shift || 0 };
  }

  /* ---------- probabilities ---------- */
  function normCdf(z) {
    var t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989422804014327 * Math.exp(-z * z / 2);
    var q = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - q : q;
  }
  function poissonCdf(k, lam) { if (k < 0) return 0; var s = 0, term = Math.exp(-lam); for (var i = 0; i <= k; i++) { s += term; term *= lam / (i + 1); } return Math.min(1, s); }
  function lgamma(x) { var c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5], y = x, tmp = x + 5.5; tmp -= (x + 0.5) * Math.log(tmp); var ser = 1.000000000190015; for (var j = 0; j < 6; j++) ser += c[j] / ++y; return -tmp + Math.log(2.5066282746310005 * ser / x); }
  /** Negative binomial with mean mu and dispersion alpha (var = mu + alpha mu²). */
  function negbinCdf(k, mu, alpha) {
    if (k < 0) return 0; if (alpha <= 1e-6) return poissonCdf(k, mu);
    var r = 1 / alpha, p = r / (r + mu), s = 0;
    for (var i = 0; i <= k; i++) s += Math.exp(lgamma(i + r) - lgamma(r) - lgamma(i + 1) + r * Math.log(p) + i * Math.log(1 - p));
    return Math.min(1, s);
  }
  /** Regularized lower incomplete gamma P(a, x). */
  function gammaP(a, x) {
    if (x <= 0) return 0;
    var gln = lgamma(a), i, ap, sum, del;
    if (x < a + 1) {
      ap = a; sum = del = 1 / a;
      for (i = 0; i < 300; i++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-10) break; }
      return Math.min(1, sum * Math.exp(-x + a * Math.log(x) - gln));
    }
    var b = x + 1 - a, c = 1 / 1e-300, d = 1 / b, h = d, an;
    for (i = 1; i < 300; i++) {
      an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d; del = d * c; h *= del; if (Math.abs(del - 1) < 1e-10) break;
    }
    return Math.max(0, 1 - Math.exp(-x + a * Math.log(x) - gln) * h);
  }
  /** CDF of the outcome distribution at x (continuous) — yards are right-skewed, so a shifted gamma. */
  function cdf(proj, x) {
    if (proj.dist === 'normal') return normCdf((x - proj.mean) / (proj.sd || 1));
    if (proj.dist === 'gamma') {
      var m = proj.mean + proj.shift, sd = proj.sd || 1;
      if (m <= 0.01) return x + proj.shift >= 0 ? 1 : 0;
      var k = m * m / (sd * sd), th = sd * sd / m;
      return gammaP(k, Math.max(0, (x + proj.shift)) / th);
    }
    var fk = Math.floor(x);
    return proj.dist === 'poisson' ? poissonCdf(fk, proj.mean) : negbinCdf(fk, proj.mean, proj.disp);
  }
  /** {over, under, push} for a line. Whole-number lines can push. */
  function probs(proj, line) {
    if (!proj) return null;
    var over, push = 0, disc = proj.dist === 'poisson' || proj.dist === 'negbin';
    if (line % 1 === 0) {
      if (disc) { push = cdf(proj, line) - cdf(proj, line - 1); over = 1 - cdf(proj, line); }
      else { push = cdf(proj, line + 0.5) - cdf(proj, line - 0.5); over = 1 - cdf(proj, line + 0.5); }
    } else over = 1 - cdf(proj, line);
    return { over: over, under: 1 - over - push, push: push };
  }
  /** Value x such that P(outcome <= x) ≈ q (for drawing ranges). */
  function quantile(proj, q) {
    var lo = -20, hi = Math.max(10, proj.mean * 6 + 60);
    for (var i = 0; i < 50; i++) { var mid = (lo + hi) / 2; if (cdf(proj, mid) < q) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }

  /* ---------- odds helpers ---------- */
  function amToDec(am) { return am > 0 ? 1 + am / 100 : 1 + 100 / -am; }
  function probToAm(p) { if (!(p > 0 && p < 1)) return null; return p >= 0.5 ? -Math.round(100 * p / (1 - p)) : Math.round(100 * (1 - p) / p); }
  /** EV per $1 staked and quarter-Kelly fraction (edge-ncaaf sizing). */
  function ev(p, am) { var d = amToDec(am); return { ev: p * (d - 1) - (1 - p), kelly: Math.max(0, ((d - 1) * p - (1 - p)) / (d - 1)) * 0.25 }; }

  /* ---------- anytime touchdown (popcawn approach) ---------- */
  /**
   * Expected rush+rec TDs for every player on a team in an upcoming game.
   * impliedPts: team's Vegas-implied points. favoredBy: points (+ = favored).
   */
  function tdTable(logs, team, impliedPts, favoredBy, before, lgIn) {
    var t = logs.teams[team]; if (!t) return [];
    var lg = lgIn || leagueAvg(logs, before);
    var rushRate = lg.car ? lg.rushTD / lg.car : 0.035, recRate = lg.rec ? lg.recTD / lg.rec : 0.07;
    var hist = t.games.filter(function (g) { return !before || g.t < before; });
    if (!hist.length) return [];
    var lastGid = hist[hist.length - 1].gid, nG = hist.length;
    var rows = [];
    Object.keys(logs.players).forEach(function (pid) {
      var p = logs.players[pid];
      var gs = p.games.filter(function (g) { return g.team === team && (!before || g.t < before); });
      if (!gs.length) return;
      var car = 0, rtd = 0, rec = 0, retd = 0, att = 0;
      var wts = 0;
      gs.forEach(function (g) { car += g.r[6]; rtd += g.r[8]; rec += g.r[9]; retd += g.r[11]; att += g.r[2]; });
      var rr = (rtd + P.tdShrink * rushRate) / (car + P.tdShrink), qr = (retd + P.tdShrink * recRate) / (rec + P.tdShrink);
      // recency-weighted touches per team game (a missed game counts as zero)
      var carW = 0, recW = 0;
      hist.forEach(function (tg, i) {
        var w = Math.pow(0.5, (nG - 1 - i) / P.tdHalfLife), pg = gs.filter(function (g) { return g.gid === tg.gid; })[0];
        wts += w; if (pg) { carW += w * pg.r[6]; recW += w * pg.r[9]; }
      });
      var carPG = carW / wts, recPG = recW / wts;
      var raw = carPG * rr + recPG * qr;
      var last = gs.filter(function (g) { return g.gid === lastGid; })[0];
      var idle = !last || (last.r[6] + last.r[9] === 0 && last.r[2] === 0);
      rows.push({ id: pid, name: p.name, raw: raw * (idle ? P.idleScale : 1), idle: idle, carPG: carPG, recPG: recPG, tds: rtd + retd, games: gs.length, qb: att > car });
    });
    var sum = rows.reduce(function (s, r) { return s + r.raw; }, 0);
    var teamTD = impliedPts * P.tdPerPoint * (1 + 0.05 * Math.max(0, favoredBy || 0) / 10);
    // Expected offensive TDs include passing TDs counted once (as receiving TDs) + rushing TDs; the raw model already
    // splits the share between carries and catches, so scale the total to the team expectation.
    rows.forEach(function (r) {
      r.lambda = sum > 0 ? teamTD * r.raw / sum : 0;
      r.p = r.lambda > 0 ? 1 - Math.exp(-P.tdCalA * Math.pow(r.lambda, P.tdCalG)) : 0;
      r.fair = probToAm(r.p);
    });
    return rows.sort(function (a, b) { return b.p - a.p; });
  }

  /** Vegas-implied points for home and away from a spread (home notation) and a total. */
  function implied(spread, total) {
    if (spread == null || total == null) return null;
    var m = -spread; return { home: (total + m) / 2, away: (total - m) / 2 };
  }

  var api = { P: P, slimBox: slimBox, buildLogs: buildLogs, statOf: statOf, role: role, leagueAvg: leagueAvg, oppFactor: oppFactor, weighted: weighted,
    project: project, probs: probs, cdf: cdf, quantile: quantile, gammaP: gammaP, normCdf: normCdf, poissonCdf: poissonCdf, negbinCdf: negbinCdf, amToDec: amToDec, probToAm: probToAm, ev: ev,
    tdTable: tdTable, implied: implied, gamesBefore: gamesBefore };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CFBProps = api;
})(typeof window !== 'undefined' ? window : this);
