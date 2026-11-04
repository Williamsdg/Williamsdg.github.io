/* Williams Digital · College basketball predictor — player props.
 * Pure functions. Browser: window.CBBProps. Node: module.exports.
 * Reuses the football prop engine (../props.js) for the outcome distributions, odds and EV.
 * Approach (same ideas as the football props): recency-weighted game log (edge-ncaaf), opponent and
 * game-script adjustments (CFB-Player-Betting), Vegas-implied team points as the anchor (cfb-td-predictor).
 */
(function (root) {
  'use strict';
  var PR = (typeof module !== 'undefined' && module.exports) ? require('../props.js') : root.CFBProps;

  // Fitted walk-forward on 2025-26 D1 box scores: 41,774 player games, players averaging 20+ minutes.
  // hl = recency half-life (games); opp / vol = exponents on opponent and game-script factors;
  // cal = bias correction; sd = s0 + s1·mean for points; negbin dispersion for counts.
  var P = {
    minMinutes: 20,
    stats: {
      pts: { label: 'Points',          hl: 10, opp: 0.5, vol: 0.5, cal: 1.01,  s0: 4.0, s1: 0.178, dist: 'normal' },
      reb: { label: 'Rebounds',        hl: 10, opp: 0.5, vol: 0.5, cal: 1.07,  dist: 'negbin', disp: 0.10 },
      ast: { label: 'Assists',         hl: 10, opp: 0.5, vol: 1.0, cal: 1.09,  dist: 'negbin', disp: 0.06 },
      tpm: { label: 'Made threes',     hl: 20, opp: 0.5, vol: 0.5, cal: 0.98,  dist: 'negbin', disp: 0 },
      pra: { label: 'Pts + reb + ast', hl: 6,  opp: 0.5, vol: 0.5, cal: 1.03,  s0: 5.3, s1: 0.12, dist: 'normal' }
    }
  };
  var OPP_KEY = { pts: 'pts', reb: 'reb', ast: 'ast', tpm: 'tpm', pra: 'pra' };

  function n(x) { return typeof x === 'number' && isFinite(x) ? x : 0; }
  /** CBBD /games/players rows → compact team-game logs. Each row is one team in one game. */
  function slimBox(rows) {
    return (rows || []).map(function (r) {
      return {
        gid: r.gameId, t: Date.parse(r.startDate), team: r.team, opp: r.opponent, home: !!r.isHome, neutral: !!r.neutralSite, pace: n(r.gamePace),
        pl: (r.players || []).map(function (p) {
          return [String(p.athleteId), p.name, p.position || '', n(p.minutes), n(p.points), p.rebounds ? n(p.rebounds.total) : 0, n(p.assists), p.threePointFieldGoals ? n(p.threePointFieldGoals.made) : 0, p.starter ? 1 : 0];
        })
      };
    });
  }
  function val(r, stat) {
    switch (stat) { case 'min': return r[3]; case 'pts': return r[4]; case 'reb': return r[5]; case 'ast': return r[6]; case 'tpm': return r[7]; case 'pra': return r[4] + r[5] + r[6]; }
    return 0;
  }
  function buildLogs(box) {
    var players = {}, teams = {}, seen = {};
    box.forEach(function (tg) {
      var key = tg.gid + ':' + tg.team; if (seen[key]) return; seen[key] = 1;
      var tot = { pts: 0, reb: 0, ast: 0, tpm: 0 };
      tg.pl.forEach(function (r) {
        tot.pts += r[4]; tot.reb += r[5]; tot.ast += r[6]; tot.tpm += r[7];
        if (r[3] <= 0) return; // did not play
        var p = players[r[0]] || (players[r[0]] = { id: r[0], name: r[1], pos: r[2], team: tg.team, games: [] });
        p.games.push({ gid: tg.gid, t: tg.t, team: tg.team, opp: tg.opp, r: r, starter: r[8] });
      });
      (teams[tg.team] = teams[tg.team] || { team: tg.team, games: [] }).games.push({ gid: tg.gid, t: tg.t, opp: tg.opp, tot: tot, pace: tg.pace });
    });
    Object.keys(players).forEach(function (k) { var p = players[k]; p.games.sort(function (a, b) { return a.t - b.t; }); p.team = p.games[p.games.length - 1].team; });
    Object.keys(teams).forEach(function (k) { teams[k].games.sort(function (a, b) { return a.t - b.t; }); });
    return { players: players, teams: teams };
  }

  /** Per-game amounts each team allows, from CBBD /stats/team/season (opponentStats), plus the league average. */
  function allowedFromStats(stats) {
    var out = {}, sum = { pts: 0, reb: 0, ast: 0, tpm: 0, pra: 0, scored: 0 }, c = 0;
    (stats || []).forEach(function (s) {
      var g = s.games || 0, o = s.opponentStats; if (!g || !o || !o.points) return;
      var a = { games: g, pts: o.points.total / g, reb: o.rebounds ? o.rebounds.total / g : 0, ast: (o.assists || 0) / g,
        tpm: o.threePointFieldGoals ? o.threePointFieldGoals.made / g : 0, scored: s.teamStats && s.teamStats.points ? s.teamStats.points.total / g : null };
      a.pra = a.pts + a.reb + a.ast;
      out[s.team] = a; ['pts', 'reb', 'ast', 'tpm', 'pra'].forEach(function (k) { sum[k] += a[k]; }); c++;
    });
    if (c) { out._avg = {}; ['pts', 'reb', 'ast', 'tpm', 'pra'].forEach(function (k) { out._avg[k] = sum[k] / c; }); }
    return out;
  }
  /** Opponent factor: what the opponent allows ÷ league average, shrunk toward 1 by games played. */
  function oppFactor(allowed, opp, stat, k) {
    var a = allowed && allowed[opp], avg = allowed && allowed._avg && allowed._avg[stat];
    if (!a || a[stat] == null || !avg) return 1;
    k = k == null ? 4 : k;
    return (a[stat] * a.games + k * avg) / ((a.games + k) * avg);
  }

  /**
   * ctx: { before, allowed (map), opp, impliedPts (team's Vegas-implied points), teamScored (team's avg points) }
   */
  function project(p, stat, ctx) {
    var cfg = P.stats[stat];
    var hist = p.games.filter(function (g) { return g.t < ctx.before; });
    if (!hist.length) return null;
    var vals = hist.map(function (g) { return val(g.r, stat); });
    var w = PR.weighted(vals, cfg.hl);
    var mins = PR.weighted(hist.map(function (g) { return g.r[3]; }), cfg.hl).mean;
    var of = ctx.opp ? oppFactor(ctx.allowed, ctx.opp, stat) : 1;
    var vf = 1;
    if (ctx.impliedPts != null && ctx.teamScored) vf = ctx.impliedPts / ctx.teamScored;
    var mult = (cfg.cal || 1) * Math.pow(of, cfg.opp) * Math.pow(Math.max(0.5, Math.min(1.6, vf)), cfg.vol);
    var mean = Math.max(0, w.mean * mult);
    return { stat: stat, mean: mean, sd: cfg.s0 != null ? cfg.s0 + cfg.s1 * mean : null, dist: cfg.dist, disp: cfg.disp, shift: 0,
      n: w.n, base: w.mean, oppF: of, volF: vf, mult: mult, log: vals, mins: mins };
  }

  var api = { P: P, slimBox: slimBox, buildLogs: buildLogs, val: val, allowedFromStats: allowedFromStats, oppFactor: oppFactor, project: project };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CBBProps = api;
})(typeof window !== 'undefined' ? window : this);
