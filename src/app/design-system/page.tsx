"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatBlock } from "@/components/ui/StatBlock";
import { StatTable, type StatColumn } from "@/components/ui/StatTable";
import { PlayerCard } from "@/components/PlayerCard";
import { SprayChart, SprayLegend, type SprayFilter, type SprayView } from "@/components/SprayChart";
import { standings, liveGame, getPlayerPBPHistory } from "@/lib/mock-data";
import type { PlayerStanding } from "@/lib/types";

const SWATCHES: { name: string; className: string; hex: string }[] = [
  { name: "bg", className: "bg-bg", hex: "#ffffff" },
  { name: "bg-surface", className: "bg-bg-surface", hex: "#f5f5f2" },
  { name: "bg-raised", className: "bg-bg-raised", hex: "#ffffff" },
  { name: "bg-border", className: "bg-bg-border", hex: "#e3e2dd" },
  { name: "accent", className: "bg-accent", hex: "#d6202a" },
  { name: "ink", className: "bg-ink", hex: "#15140f" },
  { name: "outcome-sink", className: "bg-outcome-sink", hex: "#e8c84a" },
  { name: "outcome-cup", className: "bg-outcome-cup", hex: "#5b9cf6" },
  { name: "outcome-table", className: "bg-outcome-table", hex: "#f59e0b" },
  { name: "outcome-caught", className: "bg-outcome-caught", hex: "#8a8a8a" },
  { name: "outcome-fault", className: "bg-outcome-fault", hex: "#e05454" },
];

const STANDINGS_COLUMNS: StatColumn<PlayerStanding>[] = [
  { key: "rank", label: "#", render: (_r, i) => i + 1, align: "right", width: "36px" },
  {
    key: "player",
    label: "Player",
    render: (r) => (
      <div className="flex items-center gap-2 font-sans normal-case">
        <Avatar src={r.photo} alt={r.name} size="xs" />
        <span className="font-semibold text-ink">{r.name}</span>
      </div>
    ),
  },
  { key: "overall", label: "OVR", render: (r) => r.overall, align: "right", emphasize: true },
  { key: "bdwar", label: "BDWAR", render: (r) => r.bdwar.toFixed(3), align: "right" },
  { key: "ppt", label: "PPT", render: (r) => r.ppt.toFixed(3), align: "right" },
  { key: "skr", label: "SKR", render: (r) => r.skr.toFixed(3), align: "right" },
  { key: "thr", label: "THR", render: (r) => r.thr.toFixed(3), align: "right" },
  { key: "ctr", label: "CTR", render: (r) => r.ctr.toFixed(3), align: "right" },
  { key: "dsr", label: "DSR", render: (r) => r.dsr.toFixed(3), align: "right" },
  { key: "winPct", label: "WIN%", render: (r) => `${Math.round(r.winPct * 100)}%`, align: "right" },
  { key: "games", label: "GP", render: (r) => r.games, align: "right" },
];

export default function DesignSystemPage() {
  const [view, setView] = useState<SprayView>("spray");
  const [filter, setFilter] = useState<SprayFilter>("all");

  const top = standings[0];
  const second = standings[1];
  const careerEvents = getPlayerPBPHistory(top.name);
  const playerNames = standings.map((s) => s.name);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-10 flex items-baseline justify-between border-b border-bg-border pb-6">
        <div>
          <div className="flex items-center gap-2 font-display text-3xl font-bold uppercase tracking-tight">
            <span className="text-accent">⬥</span> Beer Die
          </div>
          <p className="mt-1 font-sans text-xs uppercase tracking-widest2 text-ink-faint">
            Design system reference
          </p>
        </div>
        <span className="font-mono text-xs text-ink-faint">/design-system</span>
      </header>

      {/* Colors */}
      <section className="mb-14">
        <SectionHeader title="Color" subtitle="Palette" className="mb-4" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {SWATCHES.map((s) => (
            <div key={s.name} className="border border-bg-border">
              <div className={`h-16 w-full ${s.className}`} />
              <div className="px-2 py-1.5">
                <div className="font-sans text-[11px] font-semibold text-ink">{s.name}</div>
                <div className="font-mono text-[10px] text-ink-faint">{s.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="mb-14">
        <SectionHeader title="Typography" subtitle="Display / Sans / Mono" className="mb-4" />
        <div className="space-y-4">
          <div className="font-display text-6xl font-bold uppercase tracking-tightest">Beer Die</div>
          <div className="font-display text-3xl font-semibold uppercase tracking-tight">Section Headline</div>
          <div className="font-sans text-base text-ink">
            Body copy in Geist Sans — used for prose, table row labels, and UI chrome.
          </div>
          <div className="font-mono text-2xl tabular-nums text-accent">0.361 PPT</div>
          <div className="font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
            Small caps label
          </div>
        </div>
      </section>

      {/* Stat blocks */}
      <section className="mb-14">
        <SectionHeader title="Stat Blocks" className="mb-4" />
        <div className="flex flex-wrap gap-10 border border-bg-border bg-bg-surface p-6">
          <StatBlock label="BDWAR" value={top.bdwar.toFixed(3)} size="xl" accent />
          <StatBlock label="Overall" value={top.overall} size="lg" />
          <StatBlock label="PPT" value={top.ppt.toFixed(3)} size="md" />
          <StatBlock label="Win %" value={`${Math.round(top.winPct * 100)}%`} size="sm" />
        </div>
      </section>

      {/* Standings table */}
      <section className="mb-14">
        <SectionHeader title="Standings" subtitle="Players · sorted by BDWAR" className="mb-4" />
        <StatTable columns={STANDINGS_COLUMNS} rows={standings} rowKey={(r) => r.name} />
      </section>

      {/* Player cards */}
      <section className="mb-14">
        <SectionHeader title="Player Card" subtitle="Madden-style rating card" className="mb-4" />
        <div className="flex flex-wrap items-start gap-6">
          <PlayerCard player={top} size="lg" />
          <PlayerCard player={second} size="md" />
        </div>
      </section>

      {/* Spray chart */}
      <section className="mb-14">
        <SectionHeader title="Spray Chart" subtitle={`${top.name} · career`} className="mb-4" />
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {(["spray", "offense", "defense"] as SprayView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`border px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-widest2 ${
                  view === v
                    ? "border-accent bg-accent text-bg"
                    : "border-bg-border bg-bg-surface text-ink-dim hover:border-ink-faint"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-bg-border bg-bg-surface px-2 py-1.5 font-sans text-xs text-ink"
          >
            <option value="all">All throwers</option>
            {playerNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <SprayChart events={careerEvents} view={view} filter={filter} showGrid />
        {view === "spray" && <SprayLegend className="mt-3" />}
      </section>

      {/* Live scoreboard preview */}
      <section className="mb-14">
        <SectionHeader title="Live Scoreboard" subtitle="Preview" className="mb-4" />
        <div className="border border-bg-border bg-bg-surface p-6">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-outcome-fault" />
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest2 text-outcome-fault">
              Live · Throw {liveGame.throwNum}
            </span>
          </div>
          <div className="flex items-center justify-center gap-10">
            <div className="text-center">
              <div className="font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-faint">
                {liveGame.teamA.join(" / ")}
              </div>
              <div className="font-display text-7xl font-bold tabular-nums text-ink">{liveGame.scoreA}</div>
            </div>
            <div className="font-display text-2xl text-ink-faint">–</div>
            <div className="text-center">
              <div className="font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-faint">
                {liveGame.teamB.join(" / ")}
              </div>
              <div className="font-display text-7xl font-bold tabular-nums text-ink">{liveGame.scoreB}</div>
            </div>
          </div>
          <div className="mt-4 text-center font-mono text-xs text-ink-faint">
            Target {liveGame.scoreTgt} · Last: {liveGame.lastOutcome}
          </div>
        </div>
      </section>
    </main>
  );
}
