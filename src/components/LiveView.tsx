"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SprayExplorer } from "@/components/SprayExplorer";
import { OUTCOME_COLOR, OUTCOME_LABEL } from "@/components/SprayChart";
import { EmptyState } from "@/components/PartnershipTable";
import { APPS_SCRIPT_URL } from "@/lib/api";
import { fetchFromSheet } from "@/lib/jsonp";
import { winProb } from "@/lib/winProb";
import { normalizeOutcome, normalizePBPEvents } from "@/lib/outcomes";
import type { LiveResponse, PBPEvent } from "@/lib/types";
import { clsx } from "@/lib/clsx";

const POLL_MS = 5000;
const FLASH_MS = 3000;

export function LiveView({ initial }: { initial: LiveResponse | null }) {
  const [data, setData] = useState<LiveResponse | null>(initial);
  const [flash, setFlash] = useState<{ event: PBPEvent; key: number } | null>(null);
  const throwNumRef = useRef<number>(initial?.game?.throwNum ?? 0);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const raw = await fetchFromSheet<LiveResponse>(APPS_SCRIPT_URL);
        if (cancelled || !raw?.game) return;
        const next: LiveResponse = {
          ...raw,
          game: {
            ...raw.game,
            lastOutcome: normalizeOutcome(raw.game.lastOutcome),
            pbp: normalizePBPEvents(raw.game.pbp),
          },
        };

        if (next.game.throwNum > throwNumRef.current) {
          const latest = next.game.pbp[next.game.pbp.length - 1];
          if (latest) {
            if (flashTimer.current) clearTimeout(flashTimer.current);
            setFlash({ event: latest, key: Date.now() });
            flashTimer.current = setTimeout(() => setFlash(null), FLASH_MS);
          }
        }
        throwNumRef.current = next.game.throwNum;
        setData(next);
      } catch {
        // stay on last known-good data; retry next tick
      }
    }

    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  const game = data?.game;

  if (!game) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <SectionHeader title="Live" className="mb-6" />
        <EmptyState message="No live game data available right now." />
      </main>
    );
  }

  const teamAPlayers = game.players.filter((p) => p.team === "A");
  const teamBPlayers = game.players.filter((p) => p.team === "B");
  const teamAPPT = teamAPlayers.length
    ? teamAPlayers.reduce((s, p) => s + p.ppt, 0) / teamAPlayers.length
    : 0;
  const teamBPPT = teamBPlayers.length
    ? teamBPlayers.reduce((s, p) => s + p.ppt, 0) / teamBPlayers.length
    : 0;
  const prob = winProb(game.scoreA, game.scoreB, game.scoreTgt, teamAPPT, teamBPPT);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {flash && (
        <div
          key={flash.key}
          className="mb-6 flex items-center justify-center gap-3 px-4 py-4 font-sans text-sm font-semibold uppercase tracking-widest2 text-white"
          style={{ background: OUTCOME_COLOR[flash.event.outcome] }}
        >
          {flash.event.thrower} — {OUTCOME_LABEL[flash.event.outcome]}
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <SectionHeader
          title="Live"
          subtitle={game.status === "LIVE" ? `Throw ${game.throwNum}` : game.status}
          className="flex-1"
        />
      </div>

      <section className="mb-8 border border-bg-border bg-bg-surface p-6">
        <div className="mb-2 flex items-center justify-center gap-2">
          <span
            className={clsx(
              "h-1.5 w-1.5 rounded-full",
              game.status === "LIVE" ? "animate-pulse bg-accent" : "bg-ink-faint"
            )}
          />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
            {game.status} · Target {game.scoreTgt}
          </span>
        </div>
        <div className="flex items-center justify-center gap-6 sm:gap-12">
          <div className="text-center">
            <div className="font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-faint">
              {game.teamA.join(" / ")}
            </div>
            <div className="font-display text-6xl font-bold tabular-nums text-ink sm:text-7xl">
              {game.scoreA}
            </div>
          </div>
          <div className="font-display text-xl text-ink-faint">–</div>
          <div className="text-center">
            <div className="font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-faint">
              {game.teamB.join(" / ")}
            </div>
            <div className="font-display text-6xl font-bold tabular-nums text-ink sm:text-7xl">
              {game.scoreB}
            </div>
          </div>
        </div>
        {(game.thrower || game.defender) && (
          <div className="mt-3 text-center font-mono text-xs text-ink-faint">
            {game.thrower && `${game.thrower} throwing`}
            {game.thrower && game.defender && " · "}
            {game.defender && `${game.defender} defending`}
          </div>
        )}

        <div className="mx-auto mt-5 max-w-md">
          <div className="mb-1 flex justify-between font-mono text-[10px] text-ink-faint">
            <span>{prob}%</span>
            <span>{100 - prob}%</span>
          </div>
          <div className="flex h-2 w-full overflow-hidden bg-bg-border">
            <div className="h-full bg-accent" style={{ width: `${prob}%` }} />
            <div className="h-full bg-ink-faint" style={{ width: `${100 - prob}%` }} />
          </div>
        </div>
      </section>

      <section className="mb-8">
        <SectionHeader title="Players" className="mb-4" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {game.players.map((p) => (
            <div key={p.name} className="border border-bg-border bg-bg-raised p-4 text-center">
              <Avatar src={p.photo} alt={p.name} size="lg" className="mx-auto mb-2" />
              <div className="font-sans text-sm font-semibold text-ink">{p.name}</div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-faint">
                Team {p.team}
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-xs text-ink-dim">
                <div>PPT {p.ppt.toFixed(3)}</div>
                <div>CTR {p.ctr.toFixed(3)}</div>
                <div>THR {p.thr.toFixed(3)}</div>
                <div className="font-semibold text-accent">{p.pts} pts</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionHeader title="Spray Chart" subtitle="This game" className="mb-4" />
        <SprayExplorer
          events={game.pbp}
          teamA={game.teamA}
          teamB={game.teamB}
          filterOptions={[
            { value: "all", label: "All throwers" },
            { value: "team-a", label: game.teamA.join(" / ") },
            { value: "team-b", label: game.teamB.join(" / ") },
            ...game.players.map((p) => ({ value: p.name, label: p.name })),
          ]}
        />
      </section>

      <details className="group mb-4 border border-bg-border">
        <summary className="cursor-pointer bg-bg-surface px-4 py-3 font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-dim">
          Advanced Stats
        </summary>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-sm">
            <thead>
              <tr className="border-b border-bg-border bg-bg-surface">
                {["Player", "Team", "Throws", "Sinks", "Cup", "Table", "Catches", "Opp Pts", "PPT", "CTR", "THR"].map(
                  (h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-3 py-2 text-left font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {game.players.map((p, i) => (
                <tr key={p.name} className={i % 2 === 1 ? "bg-bg-surface/40" : undefined}>
                  <td className="whitespace-nowrap px-3 py-2 font-sans text-ink">{p.name}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{p.team}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{p.throws}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{p.sinks ?? 0}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{p.cupHits ?? 0}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{p.tableHits ?? 0}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{p.catches ?? 0}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{p.oppPts ?? 0}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{p.ppt.toFixed(3)}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{p.ctr.toFixed(3)}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{p.thr.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <details className="group border border-bg-border" open>
        <summary className="cursor-pointer bg-bg-surface px-4 py-3 font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-dim">
          Play-by-Play
        </summary>
        {game.pbp.length > 0 ? (
          <ul className="divide-y divide-bg-border">
            {[...game.pbp].reverse().map((e) => (
              <li key={e.n} className="flex items-center gap-3 px-4 py-2.5 font-mono text-sm">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: OUTCOME_COLOR[e.outcome], opacity: e.outcome === "fault" ? 0.5 : 1 }}
                />
                <span className="text-ink-faint">#{e.n}</span>
                <span className="flex-1 text-ink">
                  {e.thrower} → {OUTCOME_LABEL[e.outcome]}
                </span>
                <span className="text-ink-faint">
                  {e.scoreA}–{e.scoreB}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center font-sans text-sm text-ink-faint">No throws yet.</div>
        )}
      </details>
    </main>
  );
}
