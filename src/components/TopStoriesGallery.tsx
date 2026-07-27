"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { clsx } from "@/lib/clsx";
import type { NewsArticle } from "@/lib/types";

const MAX_STORIES = 6;

export function TopStoriesGallery({ articles }: { articles: NewsArticle[] }) {
  const stories = articles.filter((a) => a.image).slice(0, MAX_STORIES);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cardRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { root: track, threshold: 0.6 }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [stories.length]);

  function scrollToIndex(i: number) {
    cardRefs.current[i]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  if (stories.length === 0) return null;

  return (
    <section className="relative border-b border-bg-border bg-bg">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {stories.map((a, i) => (
          <div
            key={a.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="relative aspect-[16/9] w-[88%] shrink-0 snap-start overflow-hidden bg-bg-raised sm:w-[70%] lg:w-[62%]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.image!} alt={a.headline} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

            <Link href={`/news/${a.id}`} className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
              <span className="mb-2 font-mono text-[11px] uppercase tracking-widest2 text-white/70">{a.date}</span>
              <h3 className="mb-2 max-w-xl font-display text-2xl font-bold uppercase leading-[1.05] text-white sm:text-4xl">
                {a.headline}
              </h3>
              {a.excerpt && (
                <p className="mb-4 max-w-md font-sans text-sm text-white/80 line-clamp-2">{a.excerpt}</p>
              )}
              <span className="inline-flex w-fit items-center gap-1.5 bg-white px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest2 text-bg">
                Read More →
              </span>
            </Link>
          </div>
        ))}
      </div>

      {stories.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 top-8 flex items-center justify-between px-6 sm:px-10">
          <div className="pointer-events-auto flex gap-1.5">
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to story ${i + 1}`}
                className={clsx(
                  "h-1.5 rounded-full transition-all",
                  active === i ? "w-5 bg-white" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
          <div className="pointer-events-auto flex gap-2">
            <button
              onClick={() => scrollToIndex(Math.max(0, active - 1))}
              aria-label="Previous story"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
            >
              ‹
            </button>
            <button
              onClick={() => scrollToIndex(Math.min(stories.length - 1, active + 1))}
              aria-label="Next story"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-bg hover:bg-white/90"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
