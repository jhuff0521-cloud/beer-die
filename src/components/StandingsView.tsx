"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { StatTable, type StatColumn } from "@/components/ui/StatTable";
import { EmptyState, PartnershipTable } from "@/components/PartnershipTable";
import type { Partnership, PlayerStanding } from "@/lib/types";
import { clsx } from "@/lib/clsx";

const BASE_COLUMNS: StatColumn<PlayerStanding>[] = [
  { key: "rank", label: "#", align: "right", width: "32px", render: (_r, i) => i + 1 },
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
  { key: "overall", label: "OVR", align: "right", emphasize: true, render: (r) => r.overall },
  { key: "bdwar", label: "BDWAR", align: "right", render: (r) => r.bdwar.toFixed(3) },
  { key: "ppt", label: "PPT", align: "right", render: (r) => r.ppt.toFixed(3) },
  { key: "skr", label: "SKR", align: "right", render: (r) => r.skr.toFixed(3) },
  { key: "thr", label: "THR", align: "right", render: (r) => r.thr.toFixed(3) },
  { key: "ctr", label: "CTR", align: "right", render: (r) => r.ctr.toFixed(3) },
  { key: "dsr", label: "DSR", align: "right", render: (r) => r.dsr.toFixed(3) },
  { key: "winPct", label: "WIN%", align: "right", render: (r) => `${Math.round(r.winPct * 100)}%` },
  { key: "games", label: "GP", align: "right", render: (r) => r.games },
];

const EXTRA_COLUMNS: StatColumn<PlayerStanding>[] = [
  { key: "chr", label: "CHR", align: "right", render: (r) => r.chr.toFixed(3) },
  { key: "spd", label: "SPD", align: "right", render: (r) => r.spd.toFixed(3) },
  { key: "csi", label: "CSI", align: "right", render: (r) => r.csi.toFixed(3) },
  { key: "con", label: "CON", align: "right", render: (r) => r.con.toFixed(1) },
  { key: "throws", label: "THRWS", align: "right", render: (r) => r.throws },
  { key: "sinks", label: "SNK", align: "right", render: (r) => r.sinks },
  { key: "cupHits", label: "CUP", align: "right", render: (r) => r.cupHits },
  { key: "tableHits", label: "TBL", align: "right", render: (r) => r.tableHits },
  { key: "wins", label: "W", align: "right", render: (r) => r.wins },
];

export function StandingsView({
  standings,
  partnerships,
}: {
  standings: PlayerStanding[];
  partnerships: Partnership[];
}) {
  const [tab, setTab] = useState<"players" | "teams">("players");
  const [allStats, setAllStats] = useState(false);

  const playerColumns = allStats ? [...BASE_COLUMNS, ...EXTRA_COLUMNS] : BASE_COLUMNS;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex border border-bg-border">
          {(["players", "teams"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest2",
                tab === t ? "bg-accent text-white" : "bg-bg-raised text-ink-dim hover:text-ink"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "players" && (
          <label className="flex cursor-pointer items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-dim">
            <input
              type="checkbox"
              checked={allStats}
              onChange={(e) => setAllStats(e.target.checked)}
              className="accent-accent"
            />
            All stats
          </label>
        )}
      </div>

      {tab === "players" ? (
        standings.length > 0 ? (
          <StatTable
            columns={playerColumns}
            rows={standings}
            rowKey={(r) => r.name}
            rowHref={(r) => `/players/${encodeURIComponent(r.name)}`}
          />
        ) : (
          <EmptyState message="No player stats yet. Once games are logged, standings will show up here." />
        )
      ) : partnerships.length > 0 ? (
        <PartnershipTable rows={partnerships} />
      ) : (
        <EmptyState message="No partnerships yet. Partnerships are generated automatically once two players share a team in a game." />
      )}
    </div>
  );
}
