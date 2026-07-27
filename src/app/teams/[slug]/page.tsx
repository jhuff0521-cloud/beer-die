import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatBlock } from "@/components/ui/StatBlock";
import { SprayExplorer } from "@/components/SprayExplorer";
import { CollapsibleBio } from "@/components/ui/CollapsibleBio";
import { PartnershipTable, EmptyState } from "@/components/PartnershipTable";
import { getPartnerships, getPlayer, partnershipSlug } from "@/lib/api";
import { dedupePBP, groupPBPByGame } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `${params.slug.replace(/-/g, " ")} — Beer Die` };
}

export default async function TeamPage({ params }: { params: { slug: string } }) {
  const partnerships = await getPartnerships();
  const partnership = partnerships.find((p) => partnershipSlug(p.playerA, p.playerB) === params.slug);
  if (!partnership) notFound();

  const [playerA, playerB] = await Promise.all([
    getPlayer(partnership.playerA),
    getPlayer(partnership.playerB),
  ]);

  const combinedPBP = dedupePBP(playerA?.pbp ?? [], playerB?.pbp ?? []);
  const sharedEvents = combinedPBP.filter(
    (e) => e.thrower === partnership.playerA || e.thrower === partnership.playerB
  );
  const games = groupPBPByGame(combinedPBP, [partnership.playerA, partnership.playerB]);
  const others = partnerships.filter((p) => partnershipSlug(p.playerA, p.playerB) !== params.slug);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        href="/standings"
        className="mb-6 inline-block font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-faint hover:text-accent"
      >
        ← Standings
      </Link>

      <div className="mb-10 flex flex-wrap items-center gap-4 border border-bg-border bg-bg-surface p-6">
        <div className="flex -space-x-4">
          <Avatar src={partnership.photoA} alt={partnership.playerA} size="xl" ring />
          <Avatar src={partnership.photoB} alt={partnership.playerB} size="xl" ring />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-brandBlue">
            {partnership.playerA} <span className="text-accent">&amp;</span> {partnership.playerB}
          </h1>
          <p className="mt-1 font-mono text-sm text-ink-dim">
            {partnership.wins}-{partnership.losses} · {Math.round(partnership.winPct * 100)}% win rate ·{" "}
            {partnership.games} games together
          </p>
        </div>
      </div>

      <section className="mb-12">
        <SectionHeader title="Partnership Summary" className="mb-4" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border border-bg-border bg-bg-surface p-5 sm:grid-cols-4">
          <StatBlock label="Win %" value={`${Math.round(partnership.winPct * 100)}%`} size="lg" accent />
          <StatBlock label="Record" value={`${partnership.wins}-${partnership.losses}`} size="lg" />
          <StatBlock label="PPT Together" value={partnership.pptTogether.toFixed(3)} size="md" />
          <StatBlock label="CTR Together" value={partnership.ctrTogether.toFixed(3)} size="md" />
        </div>
      </section>

      <div className="mb-12">
        <CollapsibleBio bio={partnership.bio} />
      </div>

      <section className="mb-12">
        <SectionHeader title="Spray Chart" subtitle="Shared offense" className="mb-4" />
        <SprayExplorer
          events={sharedEvents}
          filterOptions={[
            { value: "all", label: "Both players" },
            { value: partnership.playerA, label: partnership.playerA },
            { value: partnership.playerB, label: partnership.playerB },
          ]}
        />
      </section>

      <section className="mb-12">
        <SectionHeader title="Game Log Together" className="mb-4" />
        {games.length > 0 ? (
          <div className="w-full overflow-x-auto border border-bg-border">
            <table className="w-full min-w-max border-collapse text-sm">
              <thead>
                <tr className="border-b border-bg-border bg-bg-surface">
                  {["Date", "Throws", "PPT", "Defended", "CTR", "DSR"].map((h) => (
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
                {games.map((g, i) => (
                  <tr key={g.date} className={i % 2 === 1 ? "bg-bg-surface/40" : undefined}>
                    <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{g.date}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{g.throws}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{g.ppt.toFixed(3)}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{g.defended}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{g.ctr.toFixed(3)}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono tnum text-ink">{g.dsr.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No games logged together yet." />
        )}
      </section>

      <section>
        <SectionHeader title="Vs. Other Partnerships" subtitle="League comparison" className="mb-4" />
        {others.length > 0 ? (
          <PartnershipTable rows={partnerships} highlightSlug={params.slug} />
        ) : (
          <EmptyState message="No other partnerships in the league yet." />
        )}
      </section>
    </main>
  );
}
