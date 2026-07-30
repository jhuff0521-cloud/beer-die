"use client";

import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/PartnershipTable";
import type { GameLogEntry } from "@/lib/types";

function shortDate(date: string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RollingPptChart({ gameLog }: { gameLog: GameLogEntry[] }) {
  if (gameLog.length < 3) {
    return (
      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl font-bold uppercase tracking-tight text-brandBlue">
          Points Per Throw
        </h2>
        <EmptyState message="Not enough data yet." />
      </section>
    );
  }

  const data = gameLog.map((g) => ({
    date: shortDate(g.date),
    ppt: g.throws ? (g.sinks * 3 + g.cupHits * 2 + g.tableHits) / g.throws : 0,
  }));
  const seasonAvg = data.reduce((s, d) => s + d.ppt, 0) / data.length;

  return (
    <section className="mb-12">
      <h2 className="mb-4 font-display text-xl font-bold uppercase tracking-tight text-brandBlue">
        Points Per Throw
      </h2>
      <div className="h-64 w-full border border-bg-border bg-bg-raised p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "var(--color-ink-faint)", fontFamily: "var(--font-geist-sans)" }}
              axisLine={{ stroke: "var(--color-bg-border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--color-ink-faint)", fontFamily: "var(--font-geist-sans)" }}
              axisLine={{ stroke: "var(--color-bg-border)" }}
              tickLine={false}
              width={40}
            />
            <ReferenceLine
              y={seasonAvg}
              stroke="var(--color-ink-faint)"
              strokeDasharray="4 3"
              label={{ value: `Avg ${seasonAvg.toFixed(3)}`, position: "insideTopRight", fontSize: 10, fill: "var(--color-ink-faint)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-bg-border)",
                borderRadius: 0,
                fontSize: 12,
                fontFamily: "var(--font-geist-mono)",
              }}
              formatter={(value: any) => Number(value).toFixed(3)}
            />
            <Bar dataKey="ppt">
              {data.map((d, i) => (
                <Cell key={i} fill={d.ppt >= seasonAvg ? "#16a34a" : "var(--color-accent)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
