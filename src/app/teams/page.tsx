import { PageTitle } from "@/components/ui/PageTitle";
import { TeamCard } from "@/components/TeamCard";
import { EmptyState } from "@/components/PartnershipTable";
import { getPartnerships, partnershipSlug } from "@/lib/api";
import { getRankDeltas } from "@/lib/rankTracking";

export const metadata = { title: "Teams — Beer Die" };
export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const partnerships = await getPartnerships();
  const ranked = [...partnerships].sort((a, b) => b.winPct - a.winPct || b.wins - a.wins);
  const deltas = await getRankDeltas(
    "teams",
    ranked.map((p) => partnershipSlug(p.playerA, p.playerB))
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageTitle title="Teams" subtitle={`${partnerships.length} partnerships`} />
      {ranked.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {ranked.map((p, i) => (
            <TeamCard
              key={partnershipSlug(p.playerA, p.playerB)}
              team={p}
              rank={i + 1}
              delta={deltas[partnershipSlug(p.playerA, p.playerB)]}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No partnerships yet. Partnerships are generated automatically once two players share a team in a game." />
      )}
    </main>
  );
}
