import type {
  LiveResponse,
  NewsArticle,
  Partnership,
  PBPEvent,
  PlayerStanding,
  PlayerSummary,
} from "./types";
import { normalizeOutcome, normalizePBPEvents } from "./outcomes";

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

export async function getPlayers(): Promise<PlayerSummary[]> {
  const data = await callAppsScript<{ status: string; players: PlayerSummary[] }>(
    { action: "get_players" },
    60
  );
  return data?.players ?? [];
}

/**
 * The stats sheet ("player stat input") that get_standings/get_player read from has no photo
 * column — only the roster sheet behind get_players does. This backfills photos by name so
 * every page shows real photos instead of initials whenever the roster has one on file.
 */
async function getPlayerPhotoMap(): Promise<Map<string, string>> {
  const players = await getPlayers();
  const map = new Map<string, string>();
  for (const p of players) {
    if (p.photo) map.set(p.name.toLowerCase().trim(), p.photo);
  }
  return map;
}

function withPhotoFallback<T extends { name: string; photo: string | null }>(
  row: T,
  photoMap: Map<string, string>
): T {
  if (row.photo) return row;
  const fallback = photoMap.get(row.name.toLowerCase().trim());
  return fallback ? { ...row, photo: fallback } : row;
}

export async function getStandings(): Promise<PlayerStanding[]> {
  const [data, photoMap] = await Promise.all([
    callAppsScript<{ status: string; standings: PlayerStanding[] }>({ action: "get_standings" }, 60),
    getPlayerPhotoMap(),
  ]);
  return (data?.standings ?? []).map((p) => withPhotoFallback(p, photoMap));
}

export async function getPlayer(name: string): Promise<PlayerStanding | null> {
  const [data, photoMap] = await Promise.all([
    callAppsScript<{ status: string; player: PlayerStanding | null }>({ action: "get_player", name }, 60),
    getPlayerPhotoMap(),
  ]);
  const player = data?.player ?? null;
  if (!player) return null;
  const withPhoto = withPhotoFallback(player, photoMap);
  return { ...withPhoto, pbp: normalizePBPEvents(withPhoto.pbp) };
}

export async function getPBPHistory(player: string): Promise<PBPEvent[]> {
  const data = await callAppsScript<{ status: string; pbp: PBPEvent[] }>(
    { action: "get_pbp_history", player },
    60
  );
  return normalizePBPEvents(data?.pbp);
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
    bio: (raw.bio as string) ?? null,
    recentForm: Array.isArray(raw.recentForm) ? (raw.recentForm as ("W" | "L")[]) : undefined,
  };
}

function withPartnershipPhotoFallback(p: Partnership, photoMap: Map<string, string>): Partnership {
  return {
    ...p,
    photoA: p.photoA ?? photoMap.get(p.playerA.toLowerCase().trim()) ?? null,
    photoB: p.photoB ?? photoMap.get(p.playerB.toLowerCase().trim()) ?? null,
  };
}

export async function getPartnerships(): Promise<Partnership[]> {
  const [data, photoMap] = await Promise.all([
    callAppsScript<{ status: string; partnerships: Record<string, unknown>[] }>(
      { action: "get_partnerships" },
      60
    ),
    getPlayerPhotoMap(),
  ]);
  return (data?.partnerships ?? [])
    .map(normalizePartnership)
    .filter((p): p is Partnership => p !== null)
    .map((p) => withPartnershipPhotoFallback(p, photoMap));
}

export async function getPartnership(nameA: string, nameB: string): Promise<Partnership | null> {
  const [data, photoMap] = await Promise.all([
    callAppsScript<{ status: string; partnership: Record<string, unknown> | null }>(
      { action: "get_partnership", names: `${nameA},${nameB}` },
      60
    ),
    getPlayerPhotoMap(),
  ]);
  if (!data?.partnership) return null;
  const normalized = normalizePartnership(data.partnership);
  return normalized ? withPartnershipPhotoFallback(normalized, photoMap) : null;
}

function newsSlug(date: string, headline: string, index: number) {
  const kebab = headline
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${date || "undated"}-${kebab || "article"}-${index}`;
}

export async function getNews(): Promise<NewsArticle[]> {
  const data = await callAppsScript<{ status: string; news: NewsArticle[] }>(
    { action: "get_news" },
    120
  );
  // The Apps Script doesn't send a unique id per article — derive a stable one from
  // date + headline so routing (/news/[id]) and React keys work.
  return (data?.news ?? []).map((a, i) => ({
    ...a,
    id: a.id || newsSlug(a.date, a.headline, i),
  }));
}

export async function getLiveGame(): Promise<LiveResponse | null> {
  const data = await callAppsScript<LiveResponse>({}, false);
  if (!data?.game) return data;
  return {
    ...data,
    game: {
      ...data.game,
      lastOutcome: normalizeOutcome(data.game.lastOutcome),
      pbp: normalizePBPEvents(data.game.pbp),
    },
  };
}

export function partnershipSlug(a: string, b: string) {
  return [a, b]
    .sort((x, y) => x.localeCompare(y))
    .map((n) => n.toLowerCase().trim().replace(/\s+/g, "-"))
    .join("-");
}
