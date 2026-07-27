import { PageTitle } from "@/components/ui/PageTitle";
import { SeasonStandings } from "@/components/SeasonStandings";
import { getPartnerships, partnershipSlug } from "@/lib/api";
import { getRankDeltas } from "@/lib/rankTracking";

export const metadata = { title: "Standings — Beer Die" };
export const dynamic = "force-dynamic";

export default async function StandingsPage() {
  const partnerships = await getPartnerships();
  const ranked = [...partnerships].sort((a, b) => b.winPct - a.winPct || b.wins - a.wins);
  // Shares the "teams" snapshot key with /teams — both rank partnerships by the same criteria.
  const deltas = await getRankDeltas(
    "teams",
    ranked.map((p) => partnershipSlug(p.playerA, p.playerB))
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageTitle title="Standings" subtitle="Season teams" />
      <SeasonStandings partnerships={partnerships} deltas={deltas} />
    </main>
  );
}
