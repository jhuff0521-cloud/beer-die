import type { PlayerStanding } from "./types";

/**
 * Merges every player's bdwarHistory into one dataset keyed by each player's own game number
 * (not a shared calendar date), so multiple players' trajectories can share an x-axis — the
 * standard way to race season-long per-player series against each other.
 */
export function mergeHistoryByGame(
  standings: PlayerStanding[],
  field: "bdwar" | "scoreDiff"
): { data: Record<string, number | string>[]; playerNames: string[]; maxGame: number } {
  const withHistory = standings.filter((p) => (p.bdwarHistory ?? []).length > 0);
  const maxGame = withHistory.reduce(
    (max, p) => Math.max(max, ...(p.bdwarHistory ?? []).map((h) => h.game)),
    0
  );

  const data: Record<string, number | string>[] = [];
  for (let g = 1; g <= maxGame; g++) {
    const row: Record<string, number | string> = { game: g };
    withHistory.forEach((p) => {
      const entry = (p.bdwarHistory ?? []).find((h) => h.game === g);
      if (entry) row[p.name] = entry[field];
    });
    data.push(row);
  }

  return { data, playerNames: withHistory.map((p) => p.name), maxGame };
}
