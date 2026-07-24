import type { PlayerStanding } from "@/lib/types";
import { clsx } from "@/lib/clsx";
import { Avatar } from "./ui/Avatar";

const ATTRIBUTES: { key: keyof PlayerStanding; label: string; abbr: string }[] = [
  { key: "thr_rating", label: "Accuracy", abbr: "ACC" },
  { key: "skr_rating", label: "Power", abbr: "POW" },
  { key: "ppt_rating", label: "Contact", abbr: "CON" },
  { key: "ctr_rating", label: "Glove", abbr: "GLV" },
  { key: "csi_rating", label: "Clutch", abbr: "CLU" },
  { key: "dsr_rating", label: "Defense", abbr: "DEF" },
];

function ratingColor(value: number) {
  if (value >= 90) return "text-accent";
  if (value >= 75) return "text-ink";
  if (value >= 55) return "text-ink-dim";
  return "text-ink-faint";
}

export function PlayerCard({
  player,
  size = "lg",
  className,
}: {
  player: PlayerStanding;
  size?: "md" | "lg";
  className?: string;
}) {
  const compact = size === "md";

  return (
    <div
      className={clsx(
        "relative w-full max-w-xs border border-bg-border bg-bg-raised",
        "before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-accent",
        className
      )}
    >
      <div className="flex items-start justify-between px-4 pt-5">
        <div className={clsx("font-display font-bold leading-none text-accent", compact ? "text-4xl" : "text-6xl")}>
          {player.overall}
        </div>
        <div className="text-right">
          <div className="font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
            Overall
          </div>
          <div className="mt-1 font-mono text-xs text-ink-dim">BDWAR {player.bdwar.toFixed(3)}</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 px-4 pb-4 pt-3">
        <Avatar src={player.photo} alt={player.name} size={compact ? "lg" : "xl"} ring />
        <div className={clsx("font-display font-semibold uppercase tracking-tight", compact ? "text-lg" : "text-2xl")}>
          {player.name}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-bg-border px-4 py-4">
        {ATTRIBUTES.map((attr) => {
          const value = player[attr.key] as number;
          return (
            <div key={attr.key} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
                  {attr.abbr}
                </span>
                <span className={clsx("font-mono text-sm font-semibold tabular-nums", ratingColor(value))}>
                  {value}
                </span>
              </div>
              <div className="h-1 w-full bg-bg-surface">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
