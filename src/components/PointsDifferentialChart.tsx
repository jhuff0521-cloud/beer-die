"use client";

import { Line, LineChart, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { mergeHistoryByGame } from "@/lib/chartData";
import { chartColorFor } from "@/lib/chartColors";
import { EmptyState } from "@/components/PartnershipTable";
import type { PlayerStanding } from "@/lib/types";

export function PointsDifferentialChart({ standings }: { standings: PlayerStanding[] }) {
  const { data, playerNames, maxGame } = mergeHistoryByGame(standings, "scoreDiff");
  const leader = standings[0]?.name;

  return (
    <section className="mb-12">
      <h2 className="mb-4 font-display text-xl font-bold uppercase tracking-tight text-brandBlue">
        Points Differential
      </h2>
      {maxGame < 3 ? (
        <EmptyState message="Not enough data yet." />
      ) : (
        <div className="h-80 w-full border border-bg-border bg-bg-raised p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="game"
                tick={{ fontSize: 10, fill: "var(--color-ink-faint)", fontFamily: "var(--font-geist-sans)" }}
                axisLine={{ stroke: "var(--color-bg-border)" }}
                tickLine={false}
                label={{ value: "Game", position: "insideBottom", offset: -2, fontSize: 10, fill: "var(--color-ink-faint)" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--color-ink-faint)", fontFamily: "var(--font-geist-sans)" }}
                axisLine={{ stroke: "var(--color-bg-border)" }}
                tickLine={false}
                width={40}
              />
              <ReferenceLine y={0} stroke="var(--color-ink-faint)" strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-bg-border)",
                  borderRadius: 0,
                  fontSize: 12,
                  fontFamily: "var(--font-geist-mono)",
                }}
                labelFormatter={(g) => `Game ${g}`}
              />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-geist-sans)" }} />
              {playerNames.map((name, i) => {
                const isLeader = name === leader;
                return (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={isLeader ? "var(--color-accent)" : chartColorFor(i)}
                    strokeWidth={isLeader ? 3 : 1.5}
                    strokeOpacity={isLeader ? 1 : 0.75}
                    dot={false}
                    connectNulls
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
