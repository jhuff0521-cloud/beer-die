import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatBlock } from "@/components/ui/StatBlock";
import { PlayerCard } from "@/components/PlayerCard";
import { SprayExplorer } from "@/components/SprayExplorer";
import { BdwarTrendChart } from "@/components/BdwarTrendChart";
import { getPartnerships, getPlayer, partnershipSlug } from "@/lib/api";
import { groupPBPByGame } from "@/lib/stats";
import { EmptyState } from "@/components/PartnershipTable";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { name: string } }) {
  return { title: `${decodeURIComponent(params.name)} — Beer Die` };
}

export default async function PlayerPage({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  const player = await getPlayer(name);
  if (!player) notFound();

  const pbp = player.pbp ?? [];
  const games = groupPBPByGame(pbp, player.name);

  let partners = (player.partnerships ?? []).map((raw) => normalizePartnerRow(raw, player.name));
  if (partners.length === 0) {
    const all = await getPartnerships();
    partners = all
      .filter((p) => p.playerA === player.name || p.playerB === player.name)
      .map((p) => ({
        partner: p.playerA === player.name ? p.playerB : p.playerA,
        photo: p.playerA === player.name ? p.photoB : p.photoA,
        games: p.games,
        wins: p.wins,
        losses: p.losses,
        winPct: p.winPct,
      }));
  }
  partners.sort((a, b) => b.winPct - a.winPct);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link href="/standings" className="mb-6 inline-block font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-faint hover:text-accent">
        ← Standings
      </Link>

      <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <PlayerCard player={player} size="lg" />

        <div>
          <SectionHeader title="Career Stats" className="mb-4" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 border border-bg-border bg-bg-surface p-5 sm:grid-cols-4">
            <StatBlock label="BDWAR" value={player.bdwar.toFixed(3)} size="lg" accent />
            <StatBlock label="Win %" value={`${Math.round(player.winPct * 100)}%`} size="lg" />
            <StatBlock label="PPT" value={player.ppt.toFixed(3)} size="md" />
            <StatBlock label="SKR" value={player.skr.toFixed(3)} size="md" />
            <StatBlock label="THR" value={player.thr.toFixed(3)} size="md" />
            <StatBlock label="CHR" value={player.chr.toFixed(3)} size="md" />
            <StatBlock label="CTR" value={player.ctr.toFixed(3)} size="md" />
            <StatBlock label="DSR" value={player.dsr.toFixed(3)} size="md" />
            <StatBlock label="SPD" value={player.spd.toFixed(3)} size="sm" />
            <StatBlock label="CSI" value={player.csi.toFixed(3)} size="sm" />
            <StatBlock label="CON" value={player.con.toFixed(1)} size="sm" />
            <StatBlock label="Games" value={player.games} size="sm" />
            <StatBlock label="Throws" value={player.throws} size="sm" />
            <StatBlock label="Sinks" value={player.sinks} size="sm" />
            <StatBlock label="Cup Hits" value={player.cupHits} size="sm" />
            <StatBlock label="Table Hits" value={player.tableHits} size="sm" />
          </div>
        </div>
      </div>

      <section className="mb-12">
        <SectionHeader title="Spray Chart" subtitle="Career throws" className="mb-4" />
        <SprayExplorer events={pbp} />
      </section>

      <section className="mb-12">
        <SectionHeader title="BDWAR Trend" subtitle="By game" className="mb-4" />
        <BdwarTrendChart games={games} />
      </section>

      <section className="mb-12">
        <SectionHeader title="Game Log" className="mb-4" />
        {games.length > 0 ? (
          <div className="w-full overflow-x-auto border border-bg-border">
            <table className="w-full min-w-max border-collapse text-sm">
              <thead>
                <tr className="border-b border-bg-border bg-bg-surface">
                  {["Date", "Throws", "PPT", "Defended", "CTR", "DSR", "BDWAR"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-2 text-left font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
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
                    <td className="whitespace-nowrap px-3 py-2 font-mono tnum font-semibold text-accent">{g.bdwar.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No games logged yet." />
        )}
      </section>

      <section>
        <SectionHeader title="Best Partnerships" className="mb-4" />
        {partners.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => (
              <Link
                key={p.partner}
                href={`/teams/${partnershipSlug(player.name, p.partner)}`}
                className="flex items-center gap-3 border border-bg-border bg-bg-raised p-4 hover:border-accent"
              >
                <Avatar src={p.photo} alt={p.partner} size="md" />
                <div>
                  <div className="font-sans text-sm font-semibold text-ink">{p.partner}</div>
                  <div className="font-mono text-xs text-ink-faint">
                    {p.wins}-{p.losses} · {Math.round(p.winPct * 100)}%
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState message="No shared-team history yet. Partnerships appear once this player shares a team in a logged game." />
        )}
      </section>
    </main>
  );
}

function normalizePartnerRow(raw: Record<string, unknown>, selfName: string) {
  const a = raw.playerA as string | undefined;
  const b = raw.playerB as string | undefined;
  const partner = a === selfName ? b : a ?? (raw.partner as string) ?? (raw.name as string);
  const games = Number(raw.games ?? 0);
  const wins = Number(raw.wins ?? 0);
  return {
    partner: partner ?? "Unknown",
    photo: (raw.photo as string | null | undefined) ?? null,
    games,
    wins,
    losses: Number(raw.losses ?? games - wins),
    winPct: Number(raw.winPct ?? (games ? wins / games : 0)),
  };
}
