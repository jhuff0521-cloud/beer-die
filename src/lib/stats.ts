import type { PBPEvent } from "./types";

export function pointsFor(outcome: PBPEvent["outcome"]) {
  if (outcome === "sink") return 3;
  if (outcome === "cupHit") return 2;
  if (outcome === "tableHit") return 1;
  return 0;
}

export interface GameLine {
  date: string;
  throws: number;
  sinks: number;
  cupHits: number;
  tableHits: number;
  ppt: number;
  defended: number;
  caught: number;
  ctr: number;
  oppPts: number;
  dsr: number;
  bdwar: number;
}

/**
 * Derives a per-game stat line for a player (or a partnership, when given
 * two names) from raw PBP history, applying the same formulas the
 * standings API uses league-wide. Events without a date are grouped under
 * "Unknown".
 */
export function groupPBPByGame(pbp: PBPEvent[], name: string | string[]): GameLine[] {
  const names = new Set(Array.isArray(name) ? name : [name]);
  const byDate = new Map<string, PBPEvent[]>();
  for (const e of pbp) {
    const key = e.date ?? "Unknown";
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(e);
  }

  const lines: GameLine[] = [];
  byDate.forEach((events, date) => {
    const offense = events.filter((e: PBPEvent) => names.has(e.thrower));
    const defense = events.filter((e: PBPEvent) => names.has(e.defender));

    const sinks = offense.filter((e: PBPEvent) => e.outcome === "sink").length;
    const cupHits = offense.filter((e: PBPEvent) => e.outcome === "cupHit").length;
    const tableHits = offense.filter((e: PBPEvent) => e.outcome === "tableHit").length;
    const throws = offense.length;
    const ppt = throws ? (sinks * 3 + cupHits * 2 + tableHits) / throws : 0;

    const caught = defense.filter((e: PBPEvent) => e.outcome === "caught").length;
    const defended = defense.length;
    const ctr = defended ? caught / defended : 0;
    const oppPts = defense.reduce((sum: number, e: PBPEvent) => sum + pointsFor(e.outcome), 0);
    const dsr = defended ? oppPts / defended : 0;

    const bdwar = ppt * 1.8 + ctr * 1.2 - dsr * 1.0 - 0.6;

    lines.push({ date, throws, sinks, cupHits, tableHits, ppt, defended, caught, ctr, oppPts, dsr, bdwar });
  });

  return lines.sort((a, b) => a.date.localeCompare(b.date));
}

/** Merges PBP arrays from multiple sources (e.g. two players' career histories) without duplicate events. */
export function dedupePBP(...lists: PBPEvent[][]): PBPEvent[] {
  const seen = new Map<string, PBPEvent>();
  for (const list of lists) {
    for (const e of list) {
      const key = `${e.date ?? ""}-${e.n}-${e.thrower}-${e.defender}-${e.outcome}`;
      seen.set(key, e);
    }
  }
  return Array.from(seen.values());
}
