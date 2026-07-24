import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/PartnershipTable";
import { getNews } from "@/lib/api";

export const metadata = { title: "News — Beer Die" };
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await getNews();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <SectionHeader title="News" subtitle={`${news.length} articles`} className="mb-6" />
      {news.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((a) => (
            <Link
              key={a.id}
              href={`/news/${a.id}`}
              className="block border border-bg-border bg-bg-raised p-5 hover:border-accent"
            >
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-faint">{a.date}</div>
              <h3 className="mb-2 font-display text-lg font-semibold leading-tight text-ink">{a.headline}</h3>
              {a.excerpt && <p className="font-sans text-sm text-ink-dim">{a.excerpt}</p>}
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState message="No news articles yet. Check back once the league office posts an update." />
      )}
    </main>
  );
}
