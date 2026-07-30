"use client";

import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/PartnershipTable";
import type { BdwarHistoryEntry } from "@/lib/types";

function TrendDot(props: { cx?: number; cy?: number; payload?: BdwarHistoryEntry }) {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined || !payload) return null;
  const won = payload.win === 1;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3.5}
      fill={won ? "#16a34a" : "var(--color-accent)"}
      stroke="var(--color-bg)"
      strokeWidth={1}
    />
  );
}

export function BdwarTrendChart({ bdwarHistory }: { bdwarHistory: BdwarHistoryEntry[] }) {
  if (bdwarHistory.length < 3) {
    return <EmptyState message="Not enough data yet." />;
  }

  return (
    <div className="h-64 w-full border border-bg-border bg-bg-raised p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={bdwarHistory} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="bdwarFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="game"
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
          <ReferenceLine y={0} stroke="var(--color-ink-faint)" strokeDasharray="4 3" />
          <Tooltip
            contentStyle={{
              background: "var(--color-bg)",
              border: "1px solid var(--color-bg-border)",
              borderRadius: 0,
              fontSize: 12,
              fontFamily: "var(--font-geist-mono)",
            }}
            labelFormatter={(g) => `Game ${g}`}
            formatter={(value: any) => Number(value).toFixed(3)}
          />
          <Area
            type="monotone"
            dataKey="bdwar"
            stroke="var(--color-accent)"
            strokeWidth={2}
            fill="url(#bdwarFill)"
            dot={<TrendDot />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
