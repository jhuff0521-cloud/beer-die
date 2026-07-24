import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getLiveGame, getNews, getPartnerships, getPlayers, getStandings } from "@/lib/api";

export const metadata = { title: "Admin — Beer Die" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [standings, players, news, partnerships, live] = await Promise.all([
    getStandings(),
    getPlayers(),
    getNews(),
    getPartnerships(),
    getLiveGame(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <SectionHeader title="Admin" subtitle="Beer Die league office" className="flex-1" />
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="ml-4 whitespace-nowrap border border-bg-border px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint hover:border-accent hover:text-accent"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/admin/players" className="block border border-bg-border bg-bg-raised p-5 hover:border-accent">
          <h3 className="font-display text-lg font-semibold uppercase text-ink">Players</h3>
          <p className="mt-1 font-sans text-sm text-ink-faint">Add or edit player names and photo URLs.</p>
        </Link>
        <Link href="/admin/news" className="block border border-bg-border bg-bg-raised p-5 hover:border-accent">
          <h3 className="font-display text-lg font-semibold uppercase text-ink">News</h3>
          <p className="mt-1 font-sans text-sm text-ink-faint">Write and publish a news article.</p>
        </Link>
      </div>

      <section>
        <SectionHeader title="Raw Data" subtitle="Live from Apps Script" className="mb-4" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RawBlock title={`get_standings (${standings.length})`} data={standings} />
          <RawBlock title={`get_players (${players.length})`} data={players} />
          <RawBlock title={`get_partnerships (${partnerships.length})`} data={partnerships} />
          <RawBlock title={`get_news (${news.length})`} data={news} />
          <RawBlock title="live game" data={live} />
        </div>
      </section>
    </main>
  );
}

function RawBlock({ title, data }: { title: string; data: unknown }) {
  return (
    <details className="border border-bg-border">
      <summary className="cursor-pointer bg-bg-surface px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-dim">
        {title}
      </summary>
      <pre className="max-h-80 overflow-auto bg-bg px-4 py-3 font-mono text-[11px] leading-relaxed text-ink-dim">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}
