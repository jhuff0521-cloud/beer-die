"use client";

import { useState } from "react";
import { SprayChart, SprayLegend, type SprayFilter, type SprayView } from "@/components/SprayChart";
import type { PBPEvent } from "@/lib/types";
import { clsx } from "@/lib/clsx";

export function SprayExplorer({
  events,
  filterOptions,
  teamA,
  teamB,
  defaultFilter = "all",
}: {
  events: PBPEvent[];
  filterOptions?: { value: string; label: string }[];
  teamA?: string[];
  teamB?: string[];
  defaultFilter?: SprayFilter;
}) {
  const [view, setView] = useState<SprayView>("spray");
  const [filter, setFilter] = useState<SprayFilter>(defaultFilter);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {(["spray", "offense", "defense"] as SprayView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={clsx(
                "border px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-widest2",
                view === v
                  ? "border-accent bg-accent text-white"
                  : "border-bg-border bg-bg-raised text-ink-dim hover:border-ink-faint"
              )}
            >
              {v}
            </button>
          ))}
        </div>
        {filterOptions && filterOptions.length > 0 && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-bg-border bg-bg-raised px-2 py-1.5 font-sans text-xs text-ink"
          >
            {filterOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
      </div>
      {events.length > 0 ? (
        <>
          <SprayChart events={events} view={view} filter={filter} teamA={teamA} teamB={teamB} showGrid />
          {view === "spray" && <SprayLegend className="mt-3" />}
        </>
      ) : (
        <div className="border border-dashed border-bg-border px-6 py-14 text-center">
          <p className="font-sans text-sm text-ink-faint">No throws recorded yet.</p>
        </div>
      )}
    </div>
  );
}
