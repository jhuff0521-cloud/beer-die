import type {
  LiveResponse,
  NewsArticle,
  Partnership,
  PBPEvent,
  PlayerStanding,
  PlayerSummary,
} from "./types";

export const APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ??
  "https://script.google.com/macros/s/AKfycbzdvlJbtIzm8pjQSZqdoHTX6w5cMqrTgIR9C3HUvaV6j5W-vtvpfGUgT6vW5EgIc2qATw/exec";

async function callAppsScript<T>(
  params: Record<string, string>,
  revalidate: number | false
): Promise<T | null> {
  const qs = new URLSearchParams(params);
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?${qs}`, {
      next: revalidate === false ? undefined : { revalidate },
      cache: revalidate === false ? "no-store" : undefined,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getStandings(): Promise<PlayerStanding[]> {
  const data = await callAppsScript<{ status: string; standings: PlayerStanding[] }>(
    { action: "get_standings" },
    60
  );
  return data?.standings ?? [];
}

export async function getPlayers(): Promise<PlayerSummary[]> {
  const data = await callAppsScript<{ status: string; players: PlayerSummary[] }>(
    { action: "get_players" },
    60
  );
  return data?.players ?? [];
}

export async function getPlayer(name: string): Promise<PlayerStanding | null> {
  const data = await callAppsScript<{ status: string; player: PlayerStanding | null }>(
    { action: "get_player", name },
    60
  );
  return data?.player ?? null;
}

export async function getPBPHistory(player: string): Promise<PBPEvent[]> {
  const data = await callAppsScript<{ status: string; pbp: PBPEvent[] }>(
    { action: "get_pbp_history", player },
    60
  );
  return data?.pbp ?? [];
}

function normalizePartnership(raw: Record<string, unknown>): Partnership | null {
  const names = (raw.names as string[] | undefined) ?? undefined;
  const playerA = (raw.playerA as string) ?? names?.[0] ?? (raw.a as string) ?? (raw.player1 as string);
  const playerB = (raw.playerB as string) ?? names?.[1] ?? (raw.b as string) ?? (raw.player2 as string);
  if (!playerA || !playerB) return null;
  const games = Number(raw.games ?? 0);
  const wins = Number(raw.wins ?? 0);
  const winPct = Number(raw.winPct ?? (games ? wins / games : 0));
  return {
    playerA,
    playerB,
    photoA: (raw.photoA as string) ?? null,
    photoB: (raw.photoB as string) ?? null,
    games,
    wins,
    losses: Number(raw.losses ?? games - wins),
    winPct,
    pptTogether: Number(raw.pptTogether ?? raw.ppt ?? 0),
    ctrTogether: Number(raw.ctrTogether ?? raw.ctr ?? 0),
  };
}

export async function getPartnerships(): Promise<Partnership[]> {
  const data = await callAppsScript<{ status: string; partnerships: Record<string, unknown>[] }>(
    { action: "get_partnerships" },
    60
  );
  return (data?.partnerships ?? []).map(normalizePartnership).filter((p): p is Partnership => p !== null);
}

export async function getPartnership(nameA: string, nameB: string): Promise<Partnership | null> {
  const data = await callAppsScript<{ status: string; partnership: Record<string, unknown> | null }>(
    { action: "get_partnership", names: `${nameA},${nameB}` },
    60
  );
  if (!data?.partnership) return null;
  return normalizePartnership(data.partnership);
}

export async function getNews(): Promise<NewsArticle[]> {
  const data = await callAppsScript<{ status: string; news: NewsArticle[] }>(
    { action: "get_news" },
    120
  );
  return data?.news ?? [];
}

export async function getLiveGame(): Promise<LiveResponse | null> {
  return callAppsScript<LiveResponse>({}, false);
}

export function partnershipSlug(a: string, b: string) {
  return [a, b]
    .sort((x, y) => x.localeCompare(y))
    .map((n) => n.toLowerCase().trim().replace(/\s+/g, "-"))
    .join("-");
}
