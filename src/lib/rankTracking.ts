import { getStore } from "@netlify/blobs";

interface RankSnapshot {
  date: string;
  ranks: Record<string, number>;
}

/**
 * Day-over-day rank-change tracking via Netlify Blobs. Reads whatever was last saved (from an
 * earlier day) as "previous", then — only when the date has rolled over — saves today's ranks
 * for tomorrow's comparison. Returns an empty map (no arrows shown) if Blobs isn't available,
 * e.g. in local `next dev` outside the Netlify runtime — this never throws.
 */
export async function getRankDeltas(
  key: string,
  currentOrder: string[]
): Promise<Record<string, number>> {
  const currentRanks: Record<string, number> = {};
  currentOrder.forEach((name, i) => {
    currentRanks[name.toLowerCase().trim()] = i + 1;
  });

  let store;
  try {
    store = getStore("rank-snapshots");
  } catch {
    return {};
  }

  const today = new Date().toISOString().slice(0, 10);
  let previous: RankSnapshot | null = null;
  try {
    previous = (await store.get(key, { type: "json" })) as RankSnapshot | null;
  } catch {
    previous = null;
  }

  const deltas: Record<string, number> = {};
  if (previous?.ranks) {
    for (const [name, rank] of Object.entries(currentRanks)) {
      const prevRank = previous.ranks[name];
      if (prevRank !== undefined) deltas[name] = prevRank - rank;
    }
  }

  if (!previous || previous.date !== today) {
    try {
      await store.setJSON(key, { date: today, ranks: currentRanks } satisfies RankSnapshot);
    } catch {
      // ignore write failures — worst case, deltas stay unavailable
    }
  }

  return deltas;
}
