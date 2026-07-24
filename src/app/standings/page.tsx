import { SectionHeader } from "@/components/ui/SectionHeader";
import { StandingsView } from "@/components/StandingsView";
import { getPartnerships, getStandings } from "@/lib/api";

export const metadata = { title: "Standings — Beer Die" };

export default async function StandingsPage() {
  const [standings, partnerships] = await Promise.all([getStandings(), getPartnerships()]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <SectionHeader title="Standings" subtitle={`${standings.length} players`} className="mb-6" />
      <StandingsView standings={standings} partnerships={partnerships} />
    </main>
  );
}
