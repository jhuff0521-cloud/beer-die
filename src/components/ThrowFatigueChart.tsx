"use client";

import { Bar, BarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/PartnershipTable";
import { pointsFor } from "@/lib/stats";
import type { PBPEvent } from "@/lib/types";

const BUCKETS: { label: string; min: number; max: number }[] = [
  { label: "1-5", min: 1, max: 5 },
  { label: "6-10", min: 6, max: 10 },
  { label: "11-15", min: 11, max: 15 },
  { label: "16-20", min: 16, max: 20 },
  { label: "20+", min: 21, max: Infinity },
];

export function ThrowFatigueChart({ pbp, name, careerPpt }: { pbp: PBPEvent[]; name: string; careerPpt: number }) {
  const throws = pbp.filter((e) => e.thrower === name);

  if (throws.length < 20) {
    return (
      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl font-bold uppercase tracking-tight text-brandBlue">
          Throw Fatigue
        </h2>
        <EmptyState message="Not enough data yet." />
      </section>
    );
  }

  const data = BUCKETS.map((b) => {
    const inBucket = throws.filter((e) => e.n >= b.min && e.n <= b.max);
    const points = inBucket.reduce((s, e) => s + pointsFor(e.outcome), 0);
    return { label: b.label, ppt: inBucket.length ? points / inBucket.length : 0, count: inBucket.length };
  }).filter((b) => b.count > 0);

  return (
    <section className="mb-12">
      <h2 className="mb-4 font-display text-xl font-bold uppercase tracking-tight text-brandBlue">
        Throw Fatigue
      </h2>
      <div className="h-64 w-full border border-bg-border bg-bg-raised p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "var(--color-ink-faint)", fontFamily: "var(--font-geist-sans)" }}
              axisLine={{ stroke: "var(--color-bg-border)" }}
              tickLine={false}
              label={{ value: "Throw #", position: "insideBottom", offset: -2, fontSize: 10, fill: "var(--color-ink-faint)" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--color-ink-faint)", fontFamily: "var(--font-geist-sans)" }}
              axisLine={{ stroke: "var(--color-bg-border)" }}
              tickLine={false}
              width={40}
            />
            <ReferenceLine
              y={careerPpt}
              stroke="var(--color-ink-faint)"
              strokeDasharray="4 3"
              label={{ value: "Career PPT", position: "insideTopRight", fontSize: 10, fill: "var(--color-ink-faint)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-bg-border)",
                borderRadius: 0,
                fontSize: 12,
                fontFamily: "var(--font-geist-mono)",
              }}
              formatter={(value: any, _n: any, item: any) => [
                `${Number(value).toFixed(3)} (${item.payload.count} throws)`,
                "PPT",
              ]}
            />
            <Bar dataKey="ppt" fill="var(--color-accent)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
