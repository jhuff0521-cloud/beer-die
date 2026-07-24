import Link from "next/link";
import { notFound } from "next/navigation";
import { getNews } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const news = await getNews();
  const article = news.find((a) => a.id === params.id);
  return { title: article ? `${article.headline} — Beer Die` : "Beer Die" };
}

export default async function NewsArticlePage({ params }: { params: { id: string } }) {
  const news = await getNews();
  const article = news.find((a) => a.id === params.id);
  if (!article) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/news"
        className="mb-6 inline-block font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-faint hover:text-accent"
      >
        ← News
      </Link>
      <article>
        <div className="mb-3 font-mono text-xs uppercase tracking-widest2 text-ink-faint">
          {article.date}
          {article.author ? ` · ${article.author}` : ""}
        </div>
        <h1 className="mb-6 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {article.headline}
        </h1>
        <div className="whitespace-pre-line font-sans text-base leading-relaxed text-ink-dim">
          {article.body}
        </div>
      </article>
    </main>
  );
}
