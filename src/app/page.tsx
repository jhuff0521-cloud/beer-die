import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PlayerCard } from "@/components/PlayerCard";
import { EmptyState } from "@/components/PartnershipTable";
import { TopStoriesGallery } from "@/components/TopStoriesGallery";
import { getLiveGame, getNews, getStandings } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [standings, news, live] = await Promise.all([getStandings(), getNews(), getLiveGame()]);

  const featured = [...standings].sort((a, b) => b.overall - a.overall)[0];
  const topThree = [...standings].sort((a, b) => b.bdwar - a.bdwar).slice(0, 3);
  // Status flips to LIVE as soon as a game is set up, before the first throw — only
  // treat it as "live" for the banner once a throw has actually been recorded.
  const hasLiveGame = live?.game?.status === "LIVE" && live.game.throwNum > 0;

  return (
    <main>
      <TopStoriesGallery articles={news} />

      {hasLiveGame && (
        <Link
          href="/live"
          className="flex items-center justify-center gap-3 bg-accent px-4 py-3 font-sans text-xs font-semibold uppercase tracking-widest2 text-white hover:bg-accent-dim"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          Live now — {live!.game.teamA.join(" / ")} {live!.game.scoreA}–{live!.game.scoreB}{" "}
          {live!.game.teamB.join(" / ")}
        </Link>
      )}

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <section className="mb-14">
          <SectionHeader title="Recent Results" className="mb-4" />
          <EmptyState message="No completed games logged yet." />
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
          {featured ? (
            <div>
              <SectionHeader title="Featured Player" className="mb-4" />
              <PlayerCard player={featured} size="lg" />
            </div>
          ) : (
            <div>
              <SectionHeader title="Featured Player" className="mb-4" />
              <EmptyState message="No player stats yet." />
            </div>
          )}

          <div>
            <SectionHeader title="BDWAR Leaders" subtitle="Top 3" className="mb-4" />
            {topThree.length > 0 ? (
              <div className="flex flex-col gap-2">
                {topThree.map((p, i) => (
                  <Link
                    key={p.name}
                    href={`/players/${encodeURIComponent(p.name)}`}
                    className="flex items-center gap-4 border border-bg-border bg-bg-raised p-4 hover:border-accent"
                  >
                    <span className="font-display text-2xl font-bold text-ink-faint">{i + 1}</span>
                    <Avatar src={p.photo} alt={p.name} size="md" />
                    <div className="flex-1">
                      <div className="font-sans text-sm font-semibold text-ink">{p.name}</div>
                      <div className="font-mono text-xs text-ink-faint">Overall {p.overall}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg font-semibold text-accent">{p.bdwar.toFixed(3)}</div>
                      <div className="font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
                        BDWAR
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState message="No player stats yet." />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
