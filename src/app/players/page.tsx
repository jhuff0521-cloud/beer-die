import { PageTitle } from "@/components/ui/PageTitle";
import { PlayerRosterCard } from "@/components/PlayerRosterCard";
import { BdwarRaceChart } from "@/components/BdwarRaceChart";
import { PointsDifferentialChart } from "@/components/PointsDifferentialChart";
import { EmptyState } from "@/components/PartnershipTable";
import { getStandings } from "@/lib/api";
import { getRankDeltas } from "@/lib/rankTracking";

export const metadata = { title: "Players — Beer Die" };
export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  const standings = await getStandings();
  const deltas = await getRankDeltas(
    "players",
    standings.map((p) => p.name)
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageTitle title="Players" subtitle={`${standings.length} players`} />

      <BdwarRaceChart standings={standings} />
      <PointsDifferentialChart standings={standings} />

      {standings.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {standings.map((p, i) => (
            <PlayerRosterCard
              key={p.name}
              player={p}
              rank={i + 1}
              delta={deltas[p.name.toLowerCase().trim()]}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No player stats yet. Once games are logged, standings will show up here." />
      )}
    </main>
  );
}
