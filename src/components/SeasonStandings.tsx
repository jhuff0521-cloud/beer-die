import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { RankChangeArrow } from "@/components/ui/RankChangeArrow";
import { FormIndicator } from "@/components/ui/FormIndicator";
import { EmptyState } from "@/components/PartnershipTable";
import { partnershipSlug } from "@/lib/api";
import type { Partnership } from "@/lib/types";

export function SeasonStandings({
  partnerships,
  deltas,
}: {
  partnerships: Partnership[];
  deltas: Record<string, number>;
}) {
  if (partnerships.length === 0) {
    return (
      <EmptyState message="No season teams yet. Standings will appear once locked partnerships have played games." />
    );
  }

  const ranked = [...partnerships].sort((a, b) => b.winPct - a.winPct || b.wins - a.wins);

  return (
    <div className="border border-bg-border">
      {ranked.map((p, i) => {
        const slug = partnershipSlug(p.playerA, p.playerB);
        return (
          <Link
            key={slug}
            href={`/teams/${slug}`}
            className="flex items-center gap-5 border-b border-bg-border px-5 py-5 last:border-b-0 hover:bg-bg-surface sm:px-8"
          >
            <div className="flex w-10 shrink-0 flex-col items-center gap-1">
              <span className="font-display text-3xl font-bold text-ink-faint sm:text-4xl">{i + 1}</span>
              <RankChangeArrow delta={deltas[slug]} />
            </div>

            <div className="flex shrink-0 -space-x-3">
              <Avatar src={p.photoA} alt={p.playerA} size="lg" className="ring-2 ring-bg" />
              <Avatar src={p.photoB} alt={p.playerB} size="lg" className="ring-2 ring-bg" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-ink sm:text-2xl">
                {p.playerA} <span className="text-accent">&amp;</span> {p.playerB}
              </div>
              <div className="mt-1 font-mono text-xs text-ink-faint">{p.games} games played</div>
            </div>

            <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
              <FormIndicator form={p.recentForm} />
              <div className="font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
                Last 5
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="font-mono text-xl font-semibold text-ink sm:text-2xl">
                {p.wins}-{p.losses}
              </div>
              <div className="font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
                Record
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
