"use client";

import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/PartnershipTable";
import { OUTCOME_LABEL } from "@/components/SprayChart";
import { winProbAtScore } from "@/lib/winProb";
import type { PBPEvent } from "@/lib/types";

export function MatchMomentumChart({
  pbp,
  scoreTgt,
  teamAName,
}: {
  pbp: PBPEvent[];
  scoreTgt: number;
  teamAName: string;
}) {
  // pbp arrives newest-first from the API — chart needs chronological order.
  const chronological = [...pbp].reverse();
  const notEnough = chronological.length < 3;

  const data = chronological.map((e) => ({
    n: e.n,
    outcome: e.outcome,
    prob: winProbAtScore(e.scoreA ?? 0, e.scoreB ?? 0, scoreTgt),
  }));

  return (
    <div>
      <h3 className="mb-3 font-display text-lg font-bold uppercase tracking-tight text-brandBlue">
        Match Momentum
      </h3>
      {notEnough ? (
        <EmptyState message="Not enough data yet." />
      ) : (
        <div className="h-56 w-full border border-bg-border bg-bg-raised p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="momentumFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.08} />
                  <stop offset="50%" stopColor="var(--color-accent)" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="n"
                tick={{ fontSize: 10, fill: "var(--color-ink-faint)", fontFamily: "var(--font-geist-sans)" }}
                axisLine={{ stroke: "var(--color-bg-border)" }}
                tickLine={false}
                label={{ value: "Throw #", position: "insideBottom", offset: -2, fontSize: 10, fill: "var(--color-ink-faint)" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "var(--color-ink-faint)", fontFamily: "var(--font-geist-sans)" }}
                axisLine={{ stroke: "var(--color-bg-border)" }}
                tickLine={false}
                width={36}
              />
              <ReferenceLine y={50} stroke="var(--color-ink-faint)" strokeDasharray="4 3" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-bg-border)",
                  borderRadius: 0,
                  fontSize: 12,
                  fontFamily: "var(--font-geist-mono)",
                }}
                formatter={(value: any, _n: any, item: any) => [
                  `${teamAName}: ${value}%`,
                  `Throw ${item.payload.n} · ${OUTCOME_LABEL[item.payload.outcome as keyof typeof OUTCOME_LABEL]}`,
                ]}
                labelFormatter={() => ""}
              />
              <Area
                type="monotone"
                dataKey="prob"
                stroke="var(--color-brand-blue)"
                strokeWidth={2}
                fill="url(#momentumFill)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
