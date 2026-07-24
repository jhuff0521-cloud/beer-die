import type {
  LiveGame,
  NewsArticle,
  Outcome,
  Partnership,
  PBPEvent,
  PlayerStanding,
} from "./types";

/**
 * Hardcoded stand-in for the Google Sheets / Apps Script API so every page
 * renders before live data is wired up. Derived metrics are computed from
 * raw counts using the same formulas the Apps Script applies, so the mock
 * numbers stay internally consistent with the real API response shapes.
 */

function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const avatar = (img: number) => `https://i.pravatar.cc/300?img=${img}`;

// ---------------------------------------------------------------------------
// Standings
// ---------------------------------------------------------------------------

interface RawPlayerStat {
  name: string;
  photo: string;
  games: number;
  wins: number;
  throws: number;
  sinks: number;
  cupHits: number;
  tableHits: number;
  catches: number;
  catchOpp: number;
  oppPtsAllowed: number;
  roundsDefended: number;
  legalThrows: number;
  faults: number;
  hlThrows: number;
  hlSinks: number;
}

const RAW_PLAYERS: RawPlayerStat[] = [
  { name: "Jake", photo: avatar(12), games: 18, wins: 13, throws: 260, sinks: 12, cupHits: 25, tableHits: 59, catches: 135, catchOpp: 169, oppPtsAllowed: 24, roundsDefended: 169, legalThrows: 250, faults: 10, hlThrows: 40, hlSinks: 3 },
  { name: "Marcus", photo: avatar(13), games: 18, wins: 13, throws: 245, sinks: 9, cupHits: 18, tableHits: 49, catches: 118, catchOpp: 159, oppPtsAllowed: 30, roundsDefended: 159, legalThrows: 232, faults: 13, hlThrows: 36, hlSinks: 2 },
  { name: "Lexi", photo: avatar(5), games: 16, wins: 11, throws: 230, sinks: 9, cupHits: 21, tableHits: 51, catches: 125, catchOpp: 150, oppPtsAllowed: 18, roundsDefended: 150, legalThrows: 221, faults: 9, hlThrows: 32, hlSinks: 2 },
  { name: "Cam", photo: avatar(14), games: 16, wins: 8, throws: 219, sinks: 4, cupHits: 13, tableHits: 39, catches: 91, catchOpp: 142, oppPtsAllowed: 34, roundsDefended: 142, legalThrows: 203, faults: 16, hlThrows: 29, hlSinks: 1 },
  { name: "Priya", photo: avatar(9), games: 14, wins: 9, throws: 195, sinks: 6, cupHits: 14, tableHits: 37, catches: 97, catchOpp: 127, oppPtsAllowed: 22, roundsDefended: 127, legalThrows: 187, faults: 8, hlThrows: 26, hlSinks: 1 },
  { name: "Tyler", photo: avatar(15), games: 15, wins: 6, throws: 224, sinks: 4, cupHits: 11, tableHits: 38, catches: 85, catchOpp: 146, oppPtsAllowed: 41, roundsDefended: 146, legalThrows: 203, faults: 21, hlThrows: 26, hlSinks: 1 },
  { name: "Devon", photo: avatar(33), games: 12, wins: 7, throws: 176, sinks: 6, cupHits: 13, tableHits: 37, catches: 81, catchOpp: 114, oppPtsAllowed: 23, roundsDefended: 114, legalThrows: 167, faults: 9, hlThrows: 21, hlSinks: 1 },
  { name: "Sam", photo: avatar(20), games: 9, wins: 3, throws: 121, sinks: 1, cupHits: 5, tableHits: 18, catches: 41, catchOpp: 79, oppPtsAllowed: 25, roundsDefended: 79, legalThrows: 109, faults: 12, hlThrows: 13, hlSinks: 0 },
];

function ratingFromValue(value: number, values: number[], invert = false) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 70;
  let pct = (value - min) / (max - min);
  if (invert) pct = 1 - pct;
  return Math.round(40 + pct * 58);
}

function computeStandings(raws: RawPlayerStat[]): PlayerStanding[] {
  const derived = raws.map((r) => {
    const ppt = (r.sinks * 3 + r.cupHits * 2 + r.tableHits) / r.throws;
    const skr = r.sinks / r.throws;
    const thr = r.tableHits / r.throws;
    const chr = r.cupHits / r.throws;
    const ctr = r.catches / r.catchOpp;
    const dsr = r.oppPtsAllowed / r.roundsDefended;
    const spd = skr + (1 - dsr);
    const csi = r.hlSinks / r.hlThrows;
    const con = r.legalThrows / r.faults;
    const winPct = r.wins / r.games;
    const bdwar = ppt * 1.8 + ctr * 1.2 - dsr * 1.0 - 0.6;
    return { ...r, ppt, skr, thr, chr, ctr, dsr, spd, csi, con, winPct, bdwar };
  });

  const pptVals = derived.map((d) => d.ppt);
  const ctrVals = derived.map((d) => d.ctr);
  const thrVals = derived.map((d) => d.thr);
  const skrVals = derived.map((d) => d.skr);
  const csiVals = derived.map((d) => d.csi);
  const dsrVals = derived.map((d) => d.dsr);

  return derived
    .map((d) => {
      const ppt_rating = ratingFromValue(d.ppt, pptVals);
      const ctr_rating = ratingFromValue(d.ctr, ctrVals);
      const thr_rating = ratingFromValue(d.thr, thrVals);
      const skr_rating = ratingFromValue(d.skr, skrVals);
      const csi_rating = ratingFromValue(d.csi, csiVals);
      const dsr_rating = ratingFromValue(d.dsr, dsrVals, true);
      const overall = Math.round(
        ppt_rating * 0.3 + ctr_rating * 0.25 + thr_rating * 0.2 + skr_rating * 0.15 + csi_rating * 0.1
      );
      return {
        name: d.name,
        photo: d.photo,
        games: d.games,
        wins: d.wins,
        throws: d.throws,
        sinks: d.sinks,
        cupHits: d.cupHits,
        tableHits: d.tableHits,
        ppt: round3(d.ppt),
        skr: round3(d.skr),
        thr: round3(d.thr),
        chr: round3(d.chr),
        ctr: round3(d.ctr),
        dsr: round3(d.dsr),
        spd: round3(d.spd),
        csi: round3(d.csi),
        con: round3(d.con),
        winPct: round3(d.winPct),
        bdwar: round3(d.bdwar),
        overall,
        ppt_rating,
        ctr_rating,
        thr_rating,
        skr_rating,
        csi_rating,
        dsr_rating,
      } satisfies PlayerStanding;
    })
    .sort((a, b) => b.bdwar - a.bdwar);
}

export const standings: PlayerStanding[] = computeStandings(RAW_PLAYERS);

export const players = RAW_PLAYERS.map((r) => ({ name: r.name, photo: r.photo }));

export function getPlayer(name: string) {
  return standings.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

// ---------------------------------------------------------------------------
// Play-by-play generation (deterministic — no Math.random, so SSR/CSR match)
// ---------------------------------------------------------------------------

const OUTCOME_ROLL: { cutoff: number; outcome: Outcome }[] = [
  { cutoff: 0.12, outcome: "sink" },
  { cutoff: 0.3, outcome: "cupHit" },
  { cutoff: 0.6, outcome: "tableHit" },
  { cutoff: 0.65, outcome: "fault" },
  { cutoff: 1, outcome: "caught" },
];

function outcomeFromRoll(r: number): Outcome {
  return OUTCOME_ROLL.find((o) => r < o.cutoff)!.outcome;
}

function pointsFor(outcome: Outcome) {
  if (outcome === "sink") return 3;
  if (outcome === "cupHit") return 2;
  if (outcome === "tableHit") return 1;
  return 0;
}

function generateEvents(
  seed: number,
  count: number,
  teamA: string[],
  teamB: string[]
): { events: PBPEvent[]; scoreA: number; scoreB: number } {
  const rand = seededRandom(seed);
  const throwers = [...teamA, ...teamB];
  let scoreA = 0;
  let scoreB = 0;
  const events: PBPEvent[] = [];

  for (let i = 1; i <= count; i++) {
    const thrower = throwers[i % throwers.length];
    const isTeamA = teamA.includes(thrower);
    const defTeam = isTeamA ? teamB : teamA;
    const defender = defTeam[i % defTeam.length];
    const outcome = outcomeFromRoll(rand());
    const pts = pointsFor(outcome);
    if (isTeamA) scoreA += pts;
    else scoreB += pts;

    events.push({
      n: i,
      thrower,
      defender,
      outcome,
      x: round3(0.08 + rand() * 0.84),
      y: round3(0.08 + rand() * 0.84),
      scoreA,
      scoreB,
      isHL: i > count - 4 ? "YES" : "NO",
    });
  }

  return { events, scoreA, scoreB };
}

// ---------------------------------------------------------------------------
// Live game
// ---------------------------------------------------------------------------

const LIVE_TEAM_A = ["Jake", "Marcus"];
const LIVE_TEAM_B = ["Lexi", "Cam"];
const liveGen = generateEvents(42, 23, LIVE_TEAM_A, LIVE_TEAM_B);

function buildLivePlayers(events: PBPEvent[], teamA: string[], teamB: string[]) {
  const all = [...teamA, ...teamB];
  return all.map((name) => {
    const team: "A" | "B" = teamA.includes(name) ? "A" : "B";
    const thrown = events.filter((e) => e.thrower === name);
    const sinks = thrown.filter((e) => e.outcome === "sink").length;
    const cupHits = thrown.filter((e) => e.outcome === "cupHit").length;
    const tableHits = thrown.filter((e) => e.outcome === "tableHit").length;
    const throws = thrown.length;
    const defended = events.filter((e) => e.defender === name);
    const caught = defended.filter((e) => e.outcome === "caught").length;
    const pts = sinks * 3 + cupHits * 2 + tableHits;
    const found = standings.find((p) => p.name === name);
    return {
      name,
      team,
      pts,
      throws,
      ppt: throws ? round3((sinks * 3 + cupHits * 2 + tableHits) / throws) : 0,
      ctr: defended.length ? round3(caught / defended.length) : 0,
      thr: throws ? round3(tableHits / throws) : 0,
      photo: found?.photo ?? avatar(1),
    };
  });
}

export const liveGame: LiveGame = {
  status: "LIVE",
  scoreTgt: 11,
  scoreA: liveGen.scoreA,
  scoreB: liveGen.scoreB,
  teamA: LIVE_TEAM_A,
  teamB: LIVE_TEAM_B,
  thrower: "Jake",
  defender: "Lexi",
  throwNum: liveGen.events.length,
  lastOutcome: liveGen.events[liveGen.events.length - 1].outcome,
  players: buildLivePlayers(liveGen.events, LIVE_TEAM_A, LIVE_TEAM_B),
  pbp: liveGen.events,
};

// ---------------------------------------------------------------------------
// Career PBP history (spray charts on /players/[name])
// ---------------------------------------------------------------------------

const DATES = [
  "2025-04-12", "2025-04-19", "2025-05-03", "2025-05-17", "2025-05-31",
  "2025-06-14", "2025-06-28", "2025-07-12", "2025-07-19",
];

export function getPlayerPBPHistory(name: string): PBPEvent[] {
  const seed = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 7);
  const opponents = players.map((p) => p.name).filter((n) => n !== name);
  const rand = seededRandom(seed);
  const events: PBPEvent[] = [];
  let n = 1;
  for (const date of DATES) {
    const throwsInGame = 14 + Math.floor(rand() * 10);
    const defender = opponents[Math.floor(rand() * opponents.length)];
    for (let i = 0; i < throwsInGame; i++) {
      const outcome = outcomeFromRoll(rand());
      events.push({
        date,
        n: n++,
        thrower: name,
        defender,
        outcome,
        x: round3(0.08 + rand() * 0.84),
        y: round3(0.08 + rand() * 0.84),
        isHL: rand() > 0.85 ? "YES" : "NO",
      });
    }
  }
  return events;
}

// ---------------------------------------------------------------------------
// Partnerships
// ---------------------------------------------------------------------------

function partnershipKey(a: string, b: string) {
  return [a, b].sort((x, y) => x.localeCompare(y));
}

function photoFor(name: string) {
  return players.find((p) => p.name === name)?.photo ?? avatar(1);
}

const RAW_PARTNERSHIPS: { a: string; b: string; games: number; wins: number; ppt: number; ctr: number }[] = [
  { a: "Jake", b: "Marcus", games: 18, wins: 13, ppt: 0.361, ctr: 0.79 },
  { a: "Lexi", b: "Cam", games: 12, wins: 8, ppt: 0.318, ctr: 0.83 },
  { a: "Priya", b: "Devon", games: 10, wins: 7, ppt: 0.334, ctr: 0.74 },
  { a: "Jake", b: "Lexi", games: 6, wins: 4, ppt: 0.352, ctr: 0.8 },
  { a: "Tyler", b: "Sam", games: 7, wins: 2, ppt: 0.256, ctr: 0.61 },
  { a: "Cam", b: "Devon", games: 5, wins: 2, ppt: 0.271, ctr: 0.68 },
  { a: "Marcus", b: "Priya", games: 4, wins: 3, ppt: 0.34, ctr: 0.77 },
];

export const partnerships: Partnership[] = RAW_PARTNERSHIPS.map((r) => {
  const [playerA, playerB] = partnershipKey(r.a, r.b);
  const losses = r.games - r.wins;
  return {
    playerA,
    playerB,
    photoA: photoFor(playerA),
    photoB: photoFor(playerB),
    games: r.games,
    wins: r.wins,
    losses,
    winPct: round3(r.wins / r.games),
    pptTogether: r.ppt,
    ctrTogether: r.ctr,
  };
}).sort((a, b) => b.winPct - a.winPct);

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

export const news: NewsArticle[] = [
  {
    id: "jake-mvp-pace",
    headline: "Jake's early-season BDWAR pace is unlike anything the league has seen",
    excerpt: "A .361 PPT through 18 games has Jake on track to shatter the single-season BDWAR record set two summers ago.",
    body: "A .361 PPT through 18 games has Jake on track to shatter the single-season BDWAR record set two summers ago. His partnership with Marcus has quietly become the most efficient two-man unit in league history, anchored by a defense that rarely lets a table hit go uncaught.",
    date: "2025-07-20",
    author: "League Office",
  },
  {
    id: "lexi-cam-streak",
    headline: "Lexi & Cam ride a six-game win streak into the second half",
    excerpt: "The league's stingiest defensive pairing has allowed the fewest opponent points per round of any partnership with 10+ games.",
    body: "The league's stingiest defensive pairing has allowed the fewest opponent points per round of any partnership with 10+ games played. Lexi's .167 DSR leads all qualified players, and Cam has quietly improved his catch rate by 11 points since May.",
    date: "2025-07-14",
    author: "League Office",
  },
  {
    id: "midseason-standings",
    headline: "Midseason standings: five things we've learned",
    excerpt: "From Sam's rookie struggles to Priya and Devon's surprise chemistry, here's what the numbers say at the season's halfway point.",
    body: "From Sam's rookie struggles to Priya and Devon's surprise chemistry, here's what the numbers say at the season's halfway point. Tyler's CON rate remains a concern for a team looking to make a playoff push.",
    date: "2025-06-30",
    author: "League Office",
  },
];
