import { clsx } from "@/lib/clsx";
import type { GameLogEntry, PlayerStanding } from "@/lib/types";

/**
 * hlCupHits/hlTableHits aren't tracked separately from hlThrows/hlSinks, so clutch PPT is
 * approximated from sinks only (the one HL-specific breakdown available) — a defensible
 * lower bound, not a fabricated precise figure.
 */
export function ClutchSplitCards({ player, gameLog }: { player: PlayerStanding; gameLog: GameLogEntry[] }) {
  const hlThrows = gameLog.reduce((s, g) => s + (g.hlThrows || 0), 0);
  const hlSinks = gameLog.reduce((s, g) => s + (g.hlSinks || 0), 0);

  if (hlThrows < 5) return null;

  const clutchPpt = hlThrows ? (hlSinks * 3) / hlThrows : 0;
  const clutchSkr = hlThrows ? hlSinks / hlThrows : 0;

  const totalPoints = player.ppt * player.throws;
  const normalThrows = Math.max(0, player.throws - hlThrows);
  const normalPoints = Math.max(0, totalPoints - hlSinks * 3);
  const normalPpt = normalThrows ? normalPoints / normalThrows : 0;
  const normalSkr = normalThrows ? Math.max(0, player.sinks - hlSinks) / normalThrows : 0;

  const delta = clutchPpt - normalPpt;
  const better = delta >= 0;

  return (
    <section className="mb-12">
      <h2 className="mb-4 font-display text-xl font-bold uppercase tracking-tight text-brandBlue">
        Clutch vs Normal
      </h2>
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border border-bg-border bg-bg-surface p-5">
          <div className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-faint">
            Normal
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="font-display text-2xl font-bold text-ink">{normalPpt.toFixed(3)}</div>
              <div className="font-sans text-[10px] uppercase tracking-widest2 text-ink-faint">PPT</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-ink">{normalSkr.toFixed(3)}</div>
              <div className="font-sans text-[10px] uppercase tracking-widest2 text-ink-faint">SKR</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-ink">{player.ctr.toFixed(3)}</div>
              <div className="font-sans text-[10px] uppercase tracking-widest2 text-ink-faint">CTR</div>
            </div>
          </div>
        </div>

        <div className="border-2 border-accent bg-bg-raised p-5">
          <div className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest2 text-accent">
            Clutch ⚡
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="font-display text-2xl font-bold text-ink">{clutchPpt.toFixed(3)}</div>
              <div className="font-sans text-[10px] uppercase tracking-widest2 text-ink-faint">PPT</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-ink">{clutchSkr.toFixed(3)}</div>
              <div className="font-sans text-[10px] uppercase tracking-widest2 text-ink-faint">SKR</div>
            </div>
          </div>
        </div>

        <div
          className={clsx(
            "absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap border px-3 py-1.5 font-mono text-xs font-semibold sm:flex",
            better ? "border-emerald-600 bg-white text-emerald-600" : "border-accent bg-white text-accent"
          )}
        >
          {better ? "▲" : "▼"} {delta >= 0 ? "+" : ""}
          {delta.toFixed(3)} PPT
        </div>
      </div>
      <p className="mt-3 text-center font-sans text-xs text-ink-faint sm:hidden">
        {better ? "▲" : "▼"} {delta >= 0 ? "+" : ""}
        {delta.toFixed(3)} PPT {better ? "— performs better under pressure" : "— performance drops under pressure"}
      </p>
    </section>
  );
}
