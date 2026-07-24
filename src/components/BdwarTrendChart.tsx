"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { GameLine } from "@/lib/stats";

export function BdwarTrendChart({ games }: { games: GameLine[] }) {
  if (games.length === 0) {
    return (
      <div className="border border-dashed border-bg-border px-6 py-14 text-center">
        <p className="font-sans text-sm text-ink-faint">
          Not enough game history yet to plot a trend.
        </p>
      </div>
    );
  }

  const data = games.map((g) => ({ date: g.date, bdwar: Math.round(g.bdwar * 1000) / 1000 }));

  return (
    <div className="h-64 w-full border border-bg-border bg-bg-raised p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "var(--color-ink-faint)", fontFamily: "var(--font-geist-mono)" }}
            axisLine={{ stroke: "var(--color-bg-border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--color-ink-faint)", fontFamily: "var(--font-geist-mono)" }}
            axisLine={{ stroke: "var(--color-bg-border)" }}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-bg-border)",
              borderRadius: 0,
              fontSize: 12,
              fontFamily: "var(--font-geist-mono)",
            }}
            labelStyle={{ color: "var(--color-ink)" }}
          />
          <Line
            type="monotone"
            dataKey="bdwar"
            stroke="var(--color-accent)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--color-accent)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
