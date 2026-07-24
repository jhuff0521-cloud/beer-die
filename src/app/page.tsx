import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PlayerCard } from "@/components/PlayerCard";
import { EmptyState } from "@/components/PartnershipTable";
import { getLiveGame, getNews, getStandings } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [standings, news, live] = await Promise.all([getStandings(), getNews(), getLiveGame()]);

  const featured = [...standings].sort((a, b) => b.overall - a.overall)[0];
  const topThree = [...standings].sort((a, b) => b.bdwar - a.bdwar).slice(0, 3);
  const latestNews = news.slice(0, 2);
  // Status flips to LIVE as soon as a game is set up, before the first throw — only
  // treat it as "live" for the banner once a throw has actually been recorded.
  const hasLiveGame = live?.game?.status === "LIVE" && live.game.throwNum > 0;
  const topNewsItem = news[0];

  return (
    <main>
      <section className="border-b border-bg-border bg-bg-surface px-4 py-14 text-center sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <div className="flex items-center gap-3 font-display text-6xl font-bold uppercase tracking-tightest text-ink sm:text-7xl">
            <span className="text-accent">⬥</span> Beer Die
          </div>
          <p className="max-w-md font-sans text-sm text-ink-dim">
            League stats, standings, and live games — tracked throw by throw.
          </p>
          <div className="mt-2 flex gap-3">
            <Link
              href="/standings"
              className="border border-accent bg-accent px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest2 text-white hover:bg-accent-dim"
            >
              Standings
            </Link>
            <Link
              href="/live"
              className="border border-bg-border px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-dim hover:border-accent hover:text-accent"
            >
              Live
            </Link>
          </div>
        </div>
      </section>

      {hasLiveGame ? (
        <Link
          href="/live"
          className="flex items-center justify-center gap-3 bg-accent px-4 py-3 font-sans text-xs font-semibold uppercase tracking-widest2 text-white hover:bg-accent-dim"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          Live now — {live!.game.teamA.join(" / ")} {live!.game.scoreA}–{live!.game.scoreB}{" "}
          {live!.game.teamB.join(" / ")}
        </Link>
      ) : (
        topNewsItem && (
          <Link
            href={`/news/${topNewsItem.id}`}
            className="flex items-center justify-center gap-3 border-b border-bg-border bg-bg-surface px-4 py-3 font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-dim hover:text-accent"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {topNewsItem.headline}
          </Link>
        )
      )}

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
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

            <div className="mt-10">
              <SectionHeader title="Recent Results" className="mb-4" />
              <EmptyState message="No completed games logged yet." />
            </div>
          </div>
        </div>

        <section>
          <SectionHeader title="News" subtitle="Latest" className="mb-4" />
          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {latestNews.map((a) => (
                <Link
                  key={a.id}
                  href={`/news/${a.id}`}
                  className="block border border-bg-border bg-bg-raised p-5 hover:border-accent"
                >
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-faint">
                    {a.date}
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold leading-tight text-ink">
                    {a.headline}
                  </h3>
                  {a.excerpt && <p className="font-sans text-sm text-ink-dim">{a.excerpt}</p>}
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState message="No news articles yet." />
          )}
        </section>
      </div>
    </main>
  );
}
