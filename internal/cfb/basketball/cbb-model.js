/* Williams Digital · College basketball predictor — game model.
 * Pure functions, no DOM. Browser: window.CBBModel. Node: module.exports (tests + fitting).
 * Uses the shared football engine (window.CFBModel / ../model.js) for normCdf, marketFromLines and blend.
 *
 * Same ideas as the football page, re-tuned for basketball:
 *  - Vegas line as the anchor; de-vigged moneylines; picks only when the ratings disagree by enough (gmalbert).
 *  - Blend several independent ratings on one points scale, confidence from agreement (zachringnight).
 *  - Predict the margin from efficiency ratings and compare with the spread (blaizerlahman), per-100-possession
 *    efficiency scaled by tempo (the KenPom / cfbfastR-style efficiency view).
 *  - In-house power rating from game margins, walk-forward only, seeded by last season (regressed).
 */
(function (root) {
  'use strict';
  var M = (typeof module !== 'undefined' && module.exports) ? require('../model.js') : root.CFBModel;

  // Fitted walk-forward on the 2025-26 season (5,409 games with lines). See the Track record tab.
  var DEFAULTS = {
    hfa: 3.5,          // points; 0 at neutral sites
    sigma: 11.4,       // SD of actual margin around a good forecast (Vegas RMSE 2025-26: 11.4)
    edgeMin: 3,        // points between ratings and the line before calling a side
    eloPerPt: 38,      // Elo points per point of margin
    carry: 0.9,        // share of last season's net rating that carries over (2025 → 2026 slope 0.89)
    priorGames: 8,     // games of current-season data that count as much as the prior
    powerCap: 35,      // blowout cap for the power rating
    powerLambda: 3,    // prior strength (games) for the power rating
    pace: 67.8,        // D1 average possessions per game
    eff: 109.1,        // D1 average points per 100 possessions
    weights: { market: 45, adj: 20, power: 15, srs: 8, elo: 5, prior: 2 }
  };
  var COMPONENTS = [
    { key: 'market', label: 'Vegas line', src: 'Sportsbook consensus (median spread)', leakFree: true },
    { key: 'adj', label: 'Efficiency', src: 'Adjusted offensive − defensive rating per 100 possessions × tempo (CollegeBasketballData), blended with last season early on', leakFree: false },
    { key: 'power', label: 'WD power', src: 'In-house rating from game margins, adjusted for opponent, seeded by last season', leakFree: true },
    { key: 'srs', label: 'SRS', src: 'Simple Rating System (points vs average), blended with last season early on', leakFree: false },
    { key: 'elo', label: 'Elo', src: 'CollegeBasketballData pregame Elo', leakFree: true },
    { key: 'prior', label: 'Last season', src: 'Last season’s efficiency rating, regressed toward average', leakFree: true }
  ];

  function num(x) { return typeof x === 'number' && isFinite(x) ? x : null; }

  /** Normalize CBBD /games rows. */
  function normGames(rows) {
    var seen = {};
    return (rows || []).filter(function (g) { if (seen[g.id]) return false; seen[g.id] = 1; return true; }).map(function (g) {
      var eh = num(g.homeTeamEloStart), ea = num(g.awayTeamEloStart);
      if (eh === 1500 && ea === 1500) { eh = ea = null; } // not computed yet (start of season)
      return {
        id: g.id, season: g.season, seasonType: g.seasonType, startDate: g.startDate, t: Date.parse(g.startDate), tbd: !!g.startTimeTbd,
        completed: g.status === 'final', status: g.status, neutralSite: !!g.neutralSite, conferenceGame: !!g.conferenceGame,
        homeTeam: g.homeTeam, awayTeam: g.awayTeam, homeConference: g.homeConference, awayConference: g.awayConference,
        homePoints: num(g.homePoints), awayPoints: num(g.awayPoints), homeElo: eh, awayElo: ea,
        notes: g.gameNotes || g.tournament || null, venue: g.venue, city: g.city, state: g.state,
        homeSeed: g.homeSeed, awaySeed: g.awaySeed
      };
    }).sort(function (a, b) { return a.t - b.t; });
  }

  /** Walk-forward power rating: games before time `before` (ms) only. */
  function powerRatings(games, priors, o, before) {
    var cap = o.powerCap, lam = o.powerLambda, hfa = o.hfa;
    var r = {}, adj = {};
    function touch(t) { if (!(t in r)) { r[t] = priors[t] != null ? priors[t] : -10; adj[t] = []; } }
    games.forEach(function (g) {
      if (!g.completed || g.homePoints == null || (before != null && g.t >= before)) return;
      touch(g.homeTeam); touch(g.awayTeam);
      var m = Math.max(-cap, Math.min(cap, g.homePoints - g.awayPoints)) - (g.neutralSite ? 0 : hfa);
      adj[g.homeTeam].push([g.awayTeam, m]); adj[g.awayTeam].push([g.homeTeam, -m]);
    });
    Object.keys(priors).forEach(touch);
    var names = Object.keys(r), prior = {};
    names.forEach(function (t) { prior[t] = r[t]; });
    for (var it = 0; it < 80; it++) {
      var delta = 0;
      names.forEach(function (t) {
        var s = lam * prior[t], n = lam;
        adj[t].forEach(function (p) { s += r[p[0]] + p[1]; n++; });
        var v = s / n; delta = Math.max(delta, Math.abs(v - r[t])); r[t] = v;
      });
      if (delta < 1e-4) break;
    }
    var gp = {}; names.forEach(function (t) { gp[t] = adj[t].length; });
    return { rating: r, games: gp };
  }

  /**
   * data = { games, lines, adj, srs, stats, prevAdj, prevStats }  (raw CBBD arrays; games may span several fetches)
   */
  function buildContext(data, opts) {
    var o = Object.assign({}, DEFAULTS, opts || {});
    o.weights = Object.assign({}, DEFAULTS.weights, (opts && opts.weights) || {});
    var T = {};
    function team(n) { return T[n] || (T[n] = { name: n }); }
    var games = normGames(data.games);
    var lineById = {};
    (data.lines || []).forEach(function (l) { if (l.lines && l.lines.length) lineById[l.gameId] = l; });

    var prevPace = {};
    (data.prevStats || []).forEach(function (s) { if (s.pace) prevPace[s.team] = s.pace; });
    (data.prevAdj || []).forEach(function (r) {
      var t = team(r.team); t.conf = t.conf || r.conference;
      t.prevNet = num(r.netRating); t.prevOff = num(r.offensiveRating); t.prevDef = num(r.defensiveRating);
    });
    (data.stats || []).forEach(function (s) {
      var t = team(s.team); t.conf = s.conference || t.conf; t.gp = s.games; t.pace = num(s.pace); t.wins = s.wins; t.losses = s.losses;
    });
    (data.adj || []).forEach(function (r) {
      var t = team(r.team); t.conf = r.conference || t.conf;
      t.curNet = num(r.netRating); t.curOff = num(r.offensiveRating); t.curDef = num(r.defensiveRating); t.netRank = r.rankings && r.rankings.net;
    });
    (data.srs || []).forEach(function (r) { var t = team(r.team); t.conf = r.conference || t.conf; t.curSrs = num(r.rating); });

    // games played this season from the schedule (stats can lag)
    var played = {};
    games.forEach(function (g) {
      if (!g.completed) return;
      played[g.homeTeam] = (played[g.homeTeam] || 0) + 1; played[g.awayTeam] = (played[g.awayTeam] || 0) + 1;
      team(g.homeTeam).conf = team(g.homeTeam).conf || g.homeConference; team(g.awayTeam).conf = team(g.awayTeam).conf || g.awayConference;
    });
    var k = o.priorGames;
    Object.keys(T).forEach(function (n) {
      var t = T[n], gp = played[n] || 0;
      t.played = gp;
      t.d1 = !!t.conf;
      var pace = t.pace != null ? (gp * t.pace + k * (prevPace[n] || o.pace)) / (gp + k) : (prevPace[n] || o.pace);
      t.tempo = pace;
      // last season regressed: per-100 net → points per game
      t.priorNet = t.prevNet != null ? o.carry * t.prevNet : null;
      t.prior = t.priorNet != null ? t.priorNet * pace / 100 : null;
      // efficiency: current-season adjusted ratings blended with the prior by games played
      var net = t.curNet != null && gp > 0 ? (t.priorNet != null ? (gp * t.curNet + k * t.priorNet) / (gp + k) : t.curNet) : t.priorNet;
      t.net = net;
      t.adj = net != null ? net * pace / 100 : null;
      var off = t.curOff != null && gp > 0 ? (t.prevOff != null ? (gp * t.curOff + k * (o.eff + o.carry * (t.prevOff - o.eff))) / (gp + k) : t.curOff) : (t.prevOff != null ? o.eff + o.carry * (t.prevOff - o.eff) : null);
      var def = t.curDef != null && gp > 0 ? (t.prevDef != null ? (gp * t.curDef + k * (o.eff + o.carry * (t.prevDef - o.eff))) / (gp + k) : t.curDef) : (t.prevDef != null ? o.eff + o.carry * (t.prevDef - o.eff) : null);
      t.off = off; t.def = def;
      t.srs = t.curSrs != null && gp > 0 ? (t.prior != null ? (gp * t.curSrs + k * t.prior) / (gp + k) : t.curSrs) : t.prior;
    });
    // latest Elo: next scheduled game's pregame Elo, else last known
    games.forEach(function (g) {
      [['home', g.homeTeam, g.homeElo], ['away', g.awayTeam, g.awayElo]].forEach(function (p) { if (p[2] != null) team(p[1]).elo = p[2]; });
    });
    var priors = {};
    Object.keys(T).forEach(function (n) { if (T[n].prior != null) priors[n] = T[n].prior; });
    var pw = powerRatings(games, priors, o, null);
    Object.keys(pw.rating).forEach(function (n) { team(n).power = pw.rating[n]; });
    return { teams: T, games: games, lineById: lineById, priors: priors, opts: o };
  }

  function componentMargins(H, A, neutral, ctx, market, over) {
    var o = ctx.opts, hfa = neutral ? 0 : o.hfa; over = over || {};
    function d(f) { return H && A && H[f] != null && A[f] != null ? H[f] - A[f] + hfa : null; }
    var eh = over.eloH !== undefined ? over.eloH : H && H.elo, ea = over.eloA !== undefined ? over.eloA : A && A.elo;
    var ph = over.powH !== undefined ? over.powH : H && H.power, pa = over.powA !== undefined ? over.powA : A && A.power;
    var adjM = null;
    if (H && A && H.net != null && A.net != null) adjM = (H.net - A.net) * ((H.tempo + A.tempo) / 2) / 100 + hfa;
    return {
      market: market && market.margin != null ? market.margin : null,
      adj: adjM,
      power: ph != null && pa != null ? ph - pa + hfa : null,
      srs: d('srs'),
      elo: eh != null && ea != null ? (eh - ea) / o.eloPerPt + hfa : null,
      prior: d('prior')
    };
  }

  function projectTotal(H, A, ctx, market) {
    var o = ctx.opts, mod = null;
    if (H && A && H.off != null && A.off != null && H.def != null && A.def != null) {
      var poss = (H.tempo + A.tempo) / 2;
      mod = ((H.off + A.def - o.eff) + (A.off + H.def - o.eff)) * poss / 100;
    }
    if (market && market.total != null && mod != null) return 0.75 * market.total + 0.25 * mod;
    if (market && market.total != null) return market.total;
    return mod != null ? mod : 2 * o.eff * o.pace / 100;
  }

  function predict(g, ctx, extra) {
    extra = extra || {};
    var o = ctx.opts, H = ctx.teams[g.homeTeam], A = ctx.teams[g.awayTeam];
    var market = extra.market !== undefined ? extra.market : M.marketFromLines(ctx.lineById[g.id]);
    var comps = componentMargins(H, A, !!g.neutralSite, ctx, market, g.completed ? {} : { eloH: g.homeElo != null ? g.homeElo : undefined, eloA: g.awayElo != null ? g.awayElo : undefined });
    var all = M.blend(comps, o.weights, null), indep = M.blend(comps, o.weights, ['market']);
    var total = projectTotal(H, A, ctx, market), margin = all.margin;
    var res = { comps: comps, margin: margin, indep: indep.margin, used: all.used, total: total,
      homeWP: margin == null ? null : M.winProb(margin, o.sigma),
      homePts: margin == null ? null : (total + margin) / 2, awayPts: margin == null ? null : (total - margin) / 2,
      market: market, edge: null, pick: null, tier: null, agree: null, reasons: [] };
    if (market && market.margin != null && indep.margin != null) {
      res.edge = indep.margin - market.margin;
      var side = res.edge >= 0 ? 'home' : 'away', n = 0, kk = 0;
      indep.used.forEach(function (c) { n++; if ((comps[c] - market.margin) * (side === 'home' ? 1 : -1) > 0) kk++; });
      res.agree = { k: kk, n: n };
      var ae = Math.abs(res.edge), score = 0;
      if (ae >= 8) score += 3; else if (ae >= 5) score += 2; else if (ae >= o.edgeMin) score += 1;
      if (ae >= o.edgeMin) res.reasons.push('Ratings are ' + ae.toFixed(1) + ' pts off the line');
      if (n >= 3 && kk / n >= 0.8) { score += 2; res.reasons.push(kk + ' of ' + n + ' ratings agree'); }
      else if (n >= 3 && kk / n >= 0.6) { score += 1; res.reasons.push(kk + ' of ' + n + ' ratings agree'); }
      else if (n) res.reasons.push('Only ' + kk + ' of ' + n + ' ratings agree');
      if (market.spreadOpen != null && market.spread != null && market.spreadOpen !== market.spread) {
        var moved = market.spreadOpen - market.spread;
        if ((moved > 0) === (side === 'home')) { score += 1; res.reasons.push('Line has moved this way since open'); }
      }
      if (ae >= o.edgeMin) { res.pick = side; res.tier = score >= 5 ? 'HIGH' : score >= 3 ? 'MEDIUM' : 'LOW'; }
    }
    return res;
  }

  /**
   * Walk-forward test on finished games: Vegas line, pregame Elo, last season's rating, and the power rating
   * rebuilt each week from earlier games only. Current-season efficiency and SRS are left out (they know the results).
   */
  function backtest(ctx, opts) {
    var o = Object.assign({}, ctx.opts, opts || {});
    var games = ctx.games.filter(function (g) { return g.completed && g.homePoints != null && g.homePoints !== g.awayPoints; });
    if (!games.length) return null;
    var W = 7 * 864e5, t0 = games[0].t, buckets = {};
    games.forEach(function (g) { var b = Math.floor((g.t - t0) / W); (buckets[b] = buckets[b] || []).push(g); });
    var lw = { market: o.weights.market, power: o.weights.power, elo: o.weights.elo, prior: o.weights.prior };
    var keys = ['market', 'model', 'power', 'elo', 'prior'], stats = {};
    keys.forEach(function (k) { stats[k] = { n: 0, su: 0, abs: 0, brier: 0 }; });
    var ats = { w: 0, l: 0, p: 0 }, bk = [{ lo: 0, hi: 2, w: 0, l: 0, p: 0 }, { lo: 2, hi: 4, w: 0, l: 0, p: 0 }, { lo: 4, hi: 7, w: 0, l: 0, p: 0 }, { lo: 7, hi: 999, w: 0, l: 0, p: 0 }];
    var byWeek = [], rows = [];
    Object.keys(buckets).map(Number).sort(function (a, b) { return a - b; }).forEach(function (b) {
      var start = t0 + b * W, pw = powerRatings(ctx.games, ctx.priors, o, start);
      var ws = { week: b + 1, start: start, n: 0, model: 0, market: 0, atsW: 0, atsL: 0 };
      buckets[b].forEach(function (g) {
        var mk = M.marketFromLines(ctx.lineById[g.id]); if (!mk || mk.margin == null) return;
        var hfa = g.neutralSite ? 0 : o.hfa, H = ctx.teams[g.homeTeam] || {}, A = ctx.teams[g.awayTeam] || {};
        var c = {
          market: mk.margin,
          power: pw.rating[g.homeTeam] != null && pw.rating[g.awayTeam] != null ? pw.rating[g.homeTeam] - pw.rating[g.awayTeam] + hfa : null,
          elo: g.homeElo != null && g.awayElo != null ? (g.homeElo - g.awayElo) / o.eloPerPt + hfa : null,
          prior: H.prior != null && A.prior != null ? H.prior - A.prior + hfa : null
        };
        var indep = M.blend(c, lw, ['market']).margin; if (indep == null) return;
        c.model = indep;
        var actual = g.homePoints - g.awayPoints;
        keys.forEach(function (k) {
          var m = c[k]; if (m == null) return; var s = stats[k], p = M.winProb(m, o.sigma), y = actual > 0 ? 1 : 0;
          s.n++; if ((m > 0) === (actual > 0)) s.su++; s.abs += Math.abs(actual - m); s.brier += (p - y) * (p - y);
        });
        ws.n++; if ((indep > 0) === (actual > 0)) ws.model++; if ((mk.margin > 0) === (actual > 0)) ws.market++;
        var edge = indep - mk.margin, ae = Math.abs(edge), cover = actual - mk.margin;
        var out = cover === 0 ? 'p' : ((cover > 0) === (edge > 0) ? 'w' : 'l');
        bk.forEach(function (x) { if (ae >= x.lo && ae < x.hi) x[out]++; });
        var row = { id: g.id, t: g.t, home: g.homeTeam, away: g.awayTeam, actual: actual, model: indep, market: mk.margin, edge: edge, result: null };
        if (ae >= o.edgeMin) { ats[out]++; row.result = out.toUpperCase(); if (out === 'w') ws.atsW++; if (out === 'l') ws.atsL++; }
        rows.push(row);
      });
      if (ws.n) byWeek.push(ws);
    });
    keys.forEach(function (k) { var s = stats[k]; s.suPct = s.n ? s.su / s.n : null; s.mae = s.n ? s.abs / s.n : null; s.brierAvg = s.n ? s.brier / s.n : null; });
    return { stats: stats, ats: ats, buckets: bk, byWeek: byWeek, rows: rows };
  }

  var api = { DEFAULTS: DEFAULTS, COMPONENTS: COMPONENTS, normGames: normGames, powerRatings: powerRatings, buildContext: buildContext,
    componentMargins: componentMargins, projectTotal: projectTotal, predict: predict, backtest: backtest };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CBBModel = api;
})(typeof window !== 'undefined' ? window : this);
