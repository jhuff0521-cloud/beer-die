import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { RankChangeArrow } from "@/components/ui/RankChangeArrow";
import type { PlayerStanding } from "@/lib/types";

export function PlayerRosterCard({
  player,
  rank,
  delta,
}: {
  player: PlayerStanding;
  rank: number;
  delta: number | undefined;
}) {
  return (
    <Link
      href={`/players/${encodeURIComponent(player.name)}`}
      className="flex items-center gap-4 border border-bg-border bg-bg-raised p-5 hover:border-accent"
    >
      <div className="flex w-10 shrink-0 flex-col items-center gap-1">
        <span className="font-display text-2xl font-bold text-ink-faint">{rank}</span>
        <RankChangeArrow delta={delta} />
      </div>

      <Avatar src={player.photo} alt={player.name} size="lg" ring className="shrink-0" />

      <div className="min-w-0 flex-1">
        <div className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-ink">
          {player.name}
        </div>
        <div className="mt-0.5 font-mono text-xs text-ink-faint">
          {player.games} games · {Math.round(player.winPct * 100)}% win
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-xs text-ink-dim">
          <div>
            <span className="font-semibold text-ink">{player.ppt.toFixed(3)}</span> PPT
          </div>
          <div>
            <span className="font-semibold text-ink">{player.ctr.toFixed(3)}</span> CTR
          </div>
          <div>
            <span className="font-semibold text-accent">{player.bdwar.toFixed(3)}</span> WAR
          </div>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="font-display text-3xl font-bold text-accent">{player.overall}</div>
        <div className="font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">OVR</div>
      </div>
    </Link>
  );
}
