/* Williams Digital · CFB Predictor — prediction engine.
 * Pure functions, no DOM. Loads in the browser (window.CFBModel) and in Node (module.exports) for tests.
 *
 * Ideas borrowed (re-implemented, no code copied) from:
 *  - gmalbert/college-football-predictions: the market line is the anchor; edges under a threshold = no bet;
 *    de-vig moneylines; walk-forward (point-in-time) validation only.
 *  - zachringnight/cfbmodel (weekly_picks_cfbd): blend Elo / SP+ / FPI / SRS on a common scale, confidence tiers
 *    from how strongly and how consistently the signals agree.
 *  - blaizerlahman/CFB-Model: predict the score differential from team strength + 247 talent + SP+, compare to the
 *    Vegas spread, report the historical hit rate by size of disagreement.
 *  - sportsdataverse/cfbfastR: play-by-play efficiency (EPA / PPA per play) as a team-strength signal.
 *  - CFBD/cfbd-python: same CollegeFootballData API, called directly from the page.
 */
(function (root) {
  'use strict';

  var DEFAULTS = {
    hfa: 3.0,          // points of home-field advantage (0 at neutral sites)
    eloPerPt: 23,      // Elo points per point of margin (fit on 2025: 23.2, 2026 to date: 22.0)
    sigma: 15.0,       // SD of actual margin around a good forecast (Vegas RMSE 2025: 15.1)
    edgeMin: 3,        // minimum model-vs-line gap (points) before calling a side
    powerCap: 28,      // blowout cap when building the in-house power rating
    powerLambda: 3,    // prior strength, in games, for the in-house power rating
    fcsPrior: -16,     // prior rating for teams with no talent score (mostly FCS)
    weights: { market: 40, sp: 14, fpi: 14, power: 10, elo: 8, srs: 5, epa: 5, talent: 4 }
  };

  var COMPONENTS = [
    { key: 'market', label: 'Vegas line', src: 'Sportsbook consensus (median spread)', leakFree: true },
    { key: 'sp', label: 'SP+', src: 'Bill Connelly SP+ via CFBD', leakFree: false },
    { key: 'fpi', label: 'FPI', src: 'ESPN FPI via CFBD', leakFree: false },
    { key: 'power', label: 'WD power', src: 'In-house opponent-adjusted margin rating, built only from games already played', leakFree: true },
    { key: 'elo', label: 'Elo', src: 'CFBD pregame Elo', leakFree: true },
    { key: 'srs', label: 'SRS', src: 'Simple Rating System via CFBD', leakFree: false },
    { key: 'epa', label: 'EPA/play', src: 'Play-by-play efficiency (PPA), garbage time removed', leakFree: false },
    { key: 'talent', label: 'Talent', src: '247Sports roster talent composite', leakFree: true }
  ];

  function num(x) { return typeof x === 'number' && isFinite(x) ? x : null; }
  function median(a) {
    var v = a.filter(function (x) { return num(x) !== null; }).sort(function (p, q) { return p - q; });
    if (!v.length) return null;
    var m = v.length >> 1;
    return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
  }
  function mean(a) { var s = 0, n = 0; a.forEach(function (x) { if (num(x) !== null) { s += x; n++; } }); return n ? s / n : null; }

  // Standard normal CDF (Abramowitz-Stegun 7.1.26 via erf)
  function normCdf(z) {
    var t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2);
    return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
  }
  function winProb(margin, sigma) { return normCdf(margin / sigma); }

  function mlToProb(ml) {
    if (num(ml) === null || ml === 0) return null;
    return ml < 0 ? -ml / (-ml + 100) : 100 / (ml + 100);
  }

  /** Consensus market from one CFBD /lines entry. Spread is CFBD/sportsbook notation: -7 = home favored by 7. */
  function marketFromLines(entry) {
    if (!entry || !entry.lines || !entry.lines.length) return null;
    var spreads = [], opens = [], totals = [], wps = [], books = [];
    entry.lines.forEach(function (l) {
      if (num(l.spread) !== null) spreads.push(l.spread);
      if (num(l.spreadOpen) !== null) opens.push(l.spreadOpen);
      if (num(l.overUnder) !== null) totals.push(l.overUnder);
      var ph = mlToProb(l.homeMoneyline), pa = mlToProb(l.awayMoneyline);
      if (ph !== null && pa !== null && ph + pa > 0) wps.push(ph / (ph + pa)); // de-vig within each book
      books.push(l.provider);
    });
    var spread = median(spreads);
    return {
      spread: spread,
      spreadOpen: median(opens),
      total: median(totals),
      homeWP: mean(wps),
      books: books,
      margin: spread === null ? null : -spread
    };
  }

  /** Least-squares y = a + b x */
  function linfit(xs, ys) {
    var n = xs.length; if (n < 3) return null;
    var mx = mean(xs), my = mean(ys), sxx = 0, sxy = 0;
    for (var i = 0; i < n; i++) { sxx += (xs[i] - mx) * (xs[i] - mx); sxy += (xs[i] - mx) * (ys[i] - my); }
    if (!sxx) return null;
    var b = sxy / sxx; return { a: my - b * mx, b: b };
  }

  /**
   * In-house power rating (leak-free). Ridge-shrunk least squares on capped margins:
   *   margin_g ≈ r_home − r_away + hfa·(not neutral),   shrunk toward prior_i with weight λ games.
   * Solved by Gauss-Seidel. Only games with week < beforeWeek (same season type) are used.
   */
  function powerRatings(games, priors, opts, beforeWeek) {
    var lam = opts.powerLambda, cap = opts.powerCap, hfa = opts.hfa;
    var played = games.filter(function (g) {
      return g.completed && num(g.homePoints) !== null && num(g.awayPoints) !== null &&
        (beforeWeek == null || (g.seasonType === 'regular' && g.week < beforeWeek));
    });
    var teams = {}, adj = {};
    function touch(t) { if (!(t in teams)) { teams[t] = priors[t] != null ? priors[t] : opts.fcsPrior; adj[t] = []; } }
    played.forEach(function (g) {
      touch(g.homeTeam); touch(g.awayTeam);
      var m = Math.max(-cap, Math.min(cap, g.homePoints - g.awayPoints)) - (g.neutralSite ? 0 : hfa);
      adj[g.homeTeam].push([g.awayTeam, m]);
      adj[g.awayTeam].push([g.homeTeam, -m]);
    });
    Object.keys(priors).forEach(touch);
    var names = Object.keys(teams), r = {};
    names.forEach(function (t) { r[t] = teams[t]; });
    for (var it = 0; it < 60; it++) {
      var delta = 0;
      names.forEach(function (t) {
        var prior = teams[t], s = lam * prior, n = lam;
        adj[t].forEach(function (p) { s += r[p[0]] + p[1]; n += 1; });
        var v = s / n; delta = Math.max(delta, Math.abs(v - r[t])); r[t] = v;
      });
      if (delta < 1e-4) break;
    }
    var gp = {}; names.forEach(function (t) { gp[t] = adj[t].length; });
    return { rating: r, games: gp };
  }

  /**
   * Build per-team ratings for one season.
   * data = { games, lines, sp, fpi, srs, talent, ppa }  (raw or slimmed CFBD arrays)
   */
  function buildContext(data, opts) {
    opts = Object.assign({}, DEFAULTS, opts || {});
    var T = {};
    function team(n) { return T[n] || (T[n] = { name: n }); }
    var natl = null;
    (data.sp || []).forEach(function (r) {
      if (r.team === 'nationalAverages') { natl = r; return; }
      var t = team(r.team); t.conf = t.conf || r.conference;
      t.sp = num(r.rating); t.spOff = r.offense ? num(r.offense.rating) : null; t.spDef = r.defense ? num(r.defense.rating) : null;
      t.spRank = r.ranking;
    });
    (data.fpi || []).forEach(function (r) { var t = team(r.team); t.conf = t.conf || r.conference; t.fpi = num(r.fpi); });
    (data.srs || []).forEach(function (r) { var t = team(r.team); t.conf = t.conf || r.conference; t.srs = num(r.rating); });
    (data.talent || []).forEach(function (r) { team(r.team).talent = num(typeof r.talent === 'string' ? parseFloat(r.talent) : r.talent); });
    (data.ppa || []).forEach(function (r) {
      var t = team(r.team); t.conf = t.conf || r.conference;
      t.epaOff = r.offense ? num(r.offense.overall) : null; t.epaDef = r.defense ? num(r.defense.overall) : null;
      t.epaNet = (t.epaOff !== null && t.epaDef !== null) ? t.epaOff - t.epaDef : null;
    });

    // Put talent and EPA on the SP+ points scale (scale only — a cross-sectional fit, not a forecast).
    var xs = [], ys = [], ex = [], ey = [];
    Object.keys(T).forEach(function (k) {
      var t = T[k];
      if (t.sp != null && t.talent != null) { xs.push(t.talent); ys.push(t.sp); }
      if (t.sp != null && t.epaNet != null) { ex.push(t.epaNet); ey.push(t.sp); }
    });
    var tf = linfit(xs, ys), ef = linfit(ex, ey);
    // Fallback when SP+ isn't out yet: ~0.06 pts per talent point around the mean, ~65 plays/game for EPA.
    if (!tf && data.talent && data.talent.length) { var tm = mean(data.talent.map(function (r) { return +r.talent; })); tf = { a: -0.06 * tm, b: 0.06 }; }
    if (!ef) ef = { a: 0, b: 65 };
    Object.keys(T).forEach(function (k) {
      var t = T[k];
      t.talentR = (tf && t.talent != null) ? tf.a + tf.b * t.talent : null;
      t.epaR = t.epaNet != null ? ef.a + ef.b * t.epaNet : null;
    });

    // Latest Elo + conference from games; pregame Elo of the next game is the freshest rating.
    var games = (data.games || []).slice().sort(function (a, b) { return (a.startDate || '').localeCompare(b.startDate || ''); });
    games.forEach(function (g) {
      [['home', g.homeTeam], ['away', g.awayTeam]].forEach(function (p) {
        var t = team(p[1]);
        t.conf = t.conf || g[p[0] + 'Conference'];
        t.cls = g[p[0] + 'Classification'] || t.cls;
        var pre = num(g[p[0] + 'PregameElo']), post = num(g[p[0] + 'PostgameElo']);
        if (g.completed && post !== null) t.elo = post; else if (t.eloNext == null && pre !== null && !g.completed) t.eloNext = pre;
        if (t.elo == null && pre !== null) t.elo = pre;
      });
    });
    Object.keys(T).forEach(function (k) { var t = T[k]; if (t.eloNext != null) t.elo = t.eloNext; });

    var priors = {};
    Object.keys(T).forEach(function (k) { if (T[k].talentR != null) priors[k] = T[k].talentR; });
    var pw = powerRatings(games, priors, opts, null);
    Object.keys(pw.rating).forEach(function (k) { team(k).power = pw.rating[k]; team(k).powerGames = pw.games[k]; });

    var lineById = {};
    (data.lines || []).forEach(function (l) { lineById[l.id] = l; });

    var natlAvg = natl && natl.offense && natl.defense ? (natl.offense.rating + natl.defense.rating) / 2 : 27;
    return { teams: T, games: games, lineById: lineById, priors: priors, natlAvg: natlAvg, opts: opts, talentFit: tf, epaFit: ef };
  }

  /** Margin estimate (home − away) from each component. Missing inputs → null. */
  function componentMargins(H, A, neutral, ctx, market, override) {
    var o = ctx.opts, hfa = neutral ? 0 : o.hfa;
    override = override || {};
    function diff(f) { return (H && A && H[f] != null && A[f] != null) ? H[f] - A[f] + hfa : null; }
    var eloH = override.eloH != null ? override.eloH : (H && H.elo), eloA = override.eloA != null ? override.eloA : (A && A.elo);
    var powH = override.powH != null ? override.powH : (H && H.power), powA = override.powA != null ? override.powA : (A && A.power);
    return {
      market: market && market.margin != null ? market.margin : null,
      sp: diff('sp'),
      fpi: diff('fpi'),
      power: (powH != null && powA != null) ? powH - powA + hfa : null,
      elo: (eloH != null && eloA != null) ? (eloH - eloA) / o.eloPerPt + hfa : null,
      srs: diff('srs'),
      epa: diff('epaR'),
      talent: diff('talentR')
    };
  }

  function blend(comps, weights, exclude) {
    var s = 0, w = 0, used = [];
    Object.keys(weights).forEach(function (k) {
      if (exclude && exclude.indexOf(k) >= 0) return;
      var v = comps[k], wt = +weights[k] || 0;
      if (v == null || wt <= 0) return;
      s += wt * v; w += wt; used.push(k);
    });
    return w ? { margin: s / w, used: used } : { margin: null, used: [] };
  }

  /** Projected total points: market O/U where available, else SP+ offense vs defence. */
  function projectTotal(H, A, neutral, ctx, market) {
    var spTot = null, hfa = neutral ? 0 : ctx.opts.hfa;
    if (H && A && H.spOff != null && A.spOff != null && H.spDef != null && A.spDef != null) {
      spTot = (H.spOff + A.spDef - ctx.natlAvg) + (A.spOff + H.spDef - ctx.natlAvg);
      spTot = Math.max(20, spTot);
    }
    if (market && market.total != null && spTot != null) return 0.75 * market.total + 0.25 * spTot;
    if (market && market.total != null) return market.total;
    if (spTot != null) return spTot;
    return 55;
  }

  /**
   * Full prediction for a matchup.
   * game: { homeTeam, awayTeam, neutralSite, id?, homePregameElo?, awayPregameElo? }
   */
  function predict(game, ctx, extra) {
    extra = extra || {};
    var o = ctx.opts, T = ctx.teams;
    var H = T[game.homeTeam], A = T[game.awayTeam];
    var market = extra.market !== undefined ? extra.market : marketFromLines(ctx.lineById[game.id]);
    var comps = componentMargins(H, A, !!game.neutralSite, ctx, market, {
      eloH: game.completed ? null : num(game.homePregameElo), eloA: game.completed ? null : num(game.awayPregameElo)
    });
    var all = blend(comps, o.weights, null);
    var indep = blend(comps, o.weights, ['market']);
    var margin = all.margin;
    var total = projectTotal(H, A, !!game.neutralSite, ctx, market);
    var res = {
      comps: comps, margin: margin, indep: indep.margin, used: all.used, total: total,
      homeWP: margin == null ? null : winProb(margin, o.sigma),
      homePts: margin == null ? null : Math.max(0, (total + margin) / 2),
      awayPts: margin == null ? null : Math.max(0, (total - margin) / 2),
      market: market, edge: null, pick: null, tier: null, agree: null, reasons: []
    };
    if (market && market.margin != null && indep.margin != null) {
      res.edge = indep.margin - market.margin; // + → home is better than the line says
      var side = res.edge >= 0 ? 'home' : 'away';
      // Agreement: share of independent signals on the same side of the line.
      var keys = indep.used, n = 0, k = 0;
      keys.forEach(function (c) { n++; if ((comps[c] - market.margin) * (side === 'home' ? 1 : -1) > 0) k++; });
      res.agree = { k: k, n: n };
      var ae = Math.abs(res.edge), score = 0;
      if (ae >= 8) { score += 3; res.reasons.push('Model is ' + ae.toFixed(1) + ' pts off the line'); }
      else if (ae >= 5) { score += 2; res.reasons.push('Model is ' + ae.toFixed(1) + ' pts off the line'); }
      else if (ae >= o.edgeMin) { score += 1; res.reasons.push('Model is ' + ae.toFixed(1) + ' pts off the line'); }
      if (n >= 3 && k / n >= 0.8) { score += 2; res.reasons.push(k + ' of ' + n + ' ratings agree'); }
      else if (n >= 3 && k / n >= 0.6) { score += 1; res.reasons.push(k + ' of ' + n + ' ratings agree'); }
      else if (n) res.reasons.push('Only ' + k + ' of ' + n + ' ratings agree');
      if (extra.second && extra.second.side === side) { score += 1; res.reasons.push('gmalbert model agrees'); }
      if (market.spreadOpen != null && market.spread != null && market.spreadOpen !== market.spread) {
        var moved = market.spreadOpen - market.spread; // + → line moved toward home
        if ((moved > 0) === (side === 'home')) { score += 1; res.reasons.push('Line has moved this way since open'); }
      }
      if (ae >= o.edgeMin) {
        res.pick = side;
        res.tier = score >= 5 ? 'HIGH' : score >= 3 ? 'MEDIUM' : 'LOW';
      }
    }
    return res;
  }

  /**
   * Walk-forward backtest over completed regular-season games, using only signals that were
   * knowable before kickoff: Vegas line, CFBD pregame Elo, talent, and the in-house power rating
   * rebuilt each week from earlier games only.
   */
  function backtest(ctx, opts) {
    var o = Object.assign({}, ctx.opts, opts || {});
    var games = ctx.games.filter(function (g) {
      return g.completed && g.seasonType === 'regular' && num(g.homePoints) !== null && num(g.awayPoints) !== null;
    });
    var weeks = {}; games.forEach(function (g) { (weeks[g.week] = weeks[g.week] || []).push(g); });
    var leakW = {}; ['market', 'power', 'elo', 'talent'].forEach(function (k) { leakW[k] = o.weights[k]; });
    var stats = {}, keys = ['market', 'power', 'elo', 'talent', 'model'];
    keys.forEach(function (k) { stats[k] = { n: 0, su: 0, abs: 0, sq: 0, brier: 0 }; });
    var ats = { n: 0, w: 0, l: 0, p: 0 }, buckets = [
      { lo: 0, hi: 2, w: 0, l: 0, p: 0 }, { lo: 2, hi: 4, w: 0, l: 0, p: 0 }, { lo: 4, hi: 7, w: 0, l: 0, p: 0 }, { lo: 7, hi: 999, w: 0, l: 0, p: 0 }
    ];
    var byWeek = [], rows = [];
    Object.keys(weeks).map(Number).sort(function (a, b) { return a - b; }).forEach(function (wk) {
      var pw = powerRatings(ctx.games, ctx.priors, o, wk);
      var wkStat = { week: wk, n: 0, model: 0, market: 0, atsW: 0, atsL: 0 };
      weeks[wk].forEach(function (g) {
        var market = marketFromLines(ctx.lineById[g.id]);
        var hfa = g.neutralSite ? 0 : o.hfa;
        var H = ctx.teams[g.homeTeam] || {}, A = ctx.teams[g.awayTeam] || {};
        var c = {
          market: market && market.margin != null ? market.margin : null,
          power: (pw.rating[g.homeTeam] != null && pw.rating[g.awayTeam] != null) ? pw.rating[g.homeTeam] - pw.rating[g.awayTeam] + hfa : null,
          elo: (num(g.homePregameElo) !== null && num(g.awayPregameElo) !== null) ? (g.homePregameElo - g.awayPregameElo) / o.eloPerPt + hfa : null,
          talent: (H.talentR != null && A.talentR != null) ? H.talentR - A.talentR + hfa : null
        };
        var indep = blend(c, leakW, ['market']).margin;
        c.model = indep;
        var actual = g.homePoints - g.awayPoints;
        // Score every signal on the same games: those where both the model and a Vegas line exist.
        var shared = indep != null && c.market != null;
        keys.forEach(function (k) {
          var m = c[k]; if (!shared || m == null || actual === 0) return;
          var s = stats[k], p = winProb(m, o.sigma), y = actual > 0 ? 1 : 0;
          s.n++; if ((m > 0) === (actual > 0)) s.su++;
          s.abs += Math.abs(actual - m); s.sq += (actual - m) * (actual - m); s.brier += (p - y) * (p - y);
        });
        if (shared && actual !== 0) {
          wkStat.n++; if ((indep > 0) === (actual > 0)) wkStat.model++;
          if ((c.market > 0) === (actual > 0)) wkStat.market++;
        }
        var row = { id: g.id, week: wk, home: g.homeTeam, away: g.awayTeam, actual: actual, model: indep, market: c.market, edge: null, result: null };
        if (indep != null && c.market != null) {
          var edge = indep - c.market, ae = Math.abs(edge), cover = actual - c.market; // + → home covered
          row.edge = edge;
          var outcome = cover === 0 ? 'P' : ((cover > 0) === (edge > 0) ? 'W' : 'L');
          buckets.forEach(function (b) { if (ae >= b.lo && ae < b.hi) b[outcome.toLowerCase()]++; });
          if (ae >= o.edgeMin) {
            row.result = outcome; ats.n++; ats[outcome.toLowerCase()]++;
            if (outcome === 'W') wkStat.atsW++; else if (outcome === 'L') wkStat.atsL++;
          }
        }
        rows.push(row);
      });
      byWeek.push(wkStat);
    });
    keys.forEach(function (k) {
      var s = stats[k];
      s.suPct = s.n ? s.su / s.n : null; s.mae = s.n ? s.abs / s.n : null; s.rmse = s.n ? Math.sqrt(s.sq / s.n) : null; s.brierAvg = s.n ? s.brier / s.n : null;
    });
    return { stats: stats, ats: ats, buckets: buckets, byWeek: byWeek, rows: rows };
  }

  var api = {
    DEFAULTS: DEFAULTS, COMPONENTS: COMPONENTS,
    median: median, normCdf: normCdf, winProb: winProb, mlToProb: mlToProb,
    marketFromLines: marketFromLines, powerRatings: powerRatings, buildContext: buildContext,
    componentMargins: componentMargins, blend: blend, projectTotal: projectTotal, predict: predict, backtest: backtest
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CFBModel = api;
})(typeof window !== 'undefined' ? window : this);
