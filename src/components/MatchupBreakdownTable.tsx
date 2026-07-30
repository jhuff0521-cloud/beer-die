import { clsx } from "@/lib/clsx";
import { EmptyState } from "@/components/PartnershipTable";
import { pointsFor } from "@/lib/stats";
import type { PBPEvent } from "@/lib/types";

export function MatchupBreakdownTable({
  pbp,
  name,
  seasonPpt,
}: {
  pbp: PBPEvent[];
  name: string;
  seasonPpt: number;
}) {
  const throws = pbp.filter((e) => e.thrower === name);
  const byDefender = new Map<string, PBPEvent[]>();
  for (const e of throws) {
    if (!e.defender) continue;
    if (!byDefender.has(e.defender)) byDefender.set(e.defender, []);
    byDefender.get(e.defender)!.push(e);
  }

  const rows = Array.from(byDefender.entries())
    .map(([defender, events]) => {
      const points = events.reduce((s, e) => s + pointsFor(e.outcome), 0);
      const ppt = events.length ? points / events.length : 0;
      return { defender, throws: events.length, ppt, delta: ppt - seasonPpt };
    })
    .filter((r) => r.throws >= 3)
    .sort((a, b) => b.ppt - a.ppt);

  return (
    <section className="mb-12">
      <h2 className="mb-4 font-display text-xl font-bold uppercase tracking-tight text-brandBlue">
        Matchup Breakdown
      </h2>
      {rows.length === 0 ? (
        <EmptyState message="Not enough data yet." />
      ) : (
        <div className="w-full overflow-x-auto border border-bg-border">
          <table className="w-full min-w-max border-collapse text-sm">
            <thead>
              <tr className="border-b border-bg-border bg-bg-surface">
                {["Defender", "Throws", "PPT vs Them", "vs Season Avg"].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-3 py-2 text-left font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const above = r.delta >= 0;
                return (
                  <tr
                    key={r.defender}
                    className={clsx(above ? "bg-emerald-50" : "bg-red-50")}
                  >
                    <td className="whitespace-nowrap px-3 py-2 font-sans text-ink">{r.defender}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{r.throws}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{r.ppt.toFixed(3)}</td>
                    <td
                      className={clsx(
                        "whitespace-nowrap px-3 py-2 font-mono tnum font-semibold",
                        above ? "text-emerald-600" : "text-accent"
                      )}
                    >
                      {above ? "+" : ""}
                      {r.delta.toFixed(3)} {above ? "▲" : "▼"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
