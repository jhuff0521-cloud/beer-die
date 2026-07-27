import Link from "next/link";
import { PageTitle } from "@/components/ui/PageTitle";
import { EmptyState } from "@/components/PartnershipTable";
import { getNews } from "@/lib/api";

export const metadata = { title: "News — Beer Die" };
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await getNews();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageTitle title="News" subtitle={`${news.length} articles`} />
      {news.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((a) => (
            <Link
              key={a.id}
              href={`/news/${a.id}`}
              className="block border border-bg-border bg-bg-raised hover:border-accent"
            >
              {a.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.image} alt="" className="aspect-video w-full object-cover" />
              )}
              <div className="p-5">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-faint">{a.date}</div>
                <h3 className="mb-2 font-display text-lg font-semibold leading-tight text-brandBlue">{a.headline}</h3>
                {a.excerpt && <p className="font-sans text-sm text-ink-dim">{a.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState message="No news articles yet. Check back once the league office posts an update." />
      )}
    </main>
  );
}
