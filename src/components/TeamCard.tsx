import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { RankChangeArrow } from "@/components/ui/RankChangeArrow";
import { partnershipSlug } from "@/lib/api";
import type { Partnership } from "@/lib/types";

export function TeamCard({
  team,
  rank,
  delta,
}: {
  team: Partnership;
  rank: number;
  delta: number | undefined;
}) {
  return (
    <Link
      href={`/teams/${partnershipSlug(team.playerA, team.playerB)}`}
      className="flex items-center gap-4 border border-bg-border bg-bg-raised p-5 hover:border-accent"
    >
      <div className="flex w-10 shrink-0 flex-col items-center gap-1">
        <span className="font-display text-2xl font-bold text-ink-faint">{rank}</span>
        <RankChangeArrow delta={delta} />
      </div>

      <div className="flex shrink-0 -space-x-3">
        <Avatar src={team.photoA} alt={team.playerA} size="lg" className="ring-2 ring-bg" />
        <Avatar src={team.photoB} alt={team.playerB} size="lg" className="ring-2 ring-bg" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-ink">
          {team.playerA} <span className="text-accent">&amp;</span> {team.playerB}
        </div>
        <div className="mt-0.5 font-mono text-xs text-ink-faint">{team.games} games played</div>
        <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-xs text-ink-dim">
          <div>
            <span className="font-semibold text-ink">{team.pptTogether.toFixed(3)}</span> PPT
          </div>
          <div>
            <span className="font-semibold text-ink">{team.ctrTogether.toFixed(3)}</span> CTR
          </div>
          <div>
            <span className="font-semibold text-accent">
              {team.wins}-{team.losses}
            </span>{" "}
            REC
          </div>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="font-display text-3xl font-bold text-accent">{Math.round(team.winPct * 100)}%</div>
        <div className="font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">Win %</div>
      </div>
    </Link>
  );
}
