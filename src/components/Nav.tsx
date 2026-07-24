import Link from "next/link";

const LINKS = [
  { href: "/standings", label: "Standings" },
  { href: "/news", label: "News" },
  { href: "/live", label: "Live" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-bg-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 font-display text-xl font-bold uppercase tracking-tight text-ink">
          <span className="text-accent">⬥</span> Beer Die
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-dim hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="ml-1 whitespace-nowrap border-l border-bg-border px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint hover:text-ink-dim"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
