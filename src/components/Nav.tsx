import Link from "next/link";
import { Logo } from "@/components/Logo";

const LINKS = [
  { href: "/players", label: "Players" },
  { href: "/teams", label: "Teams" },
  { href: "/standings", label: "Standings" },
  { href: "/news", label: "News" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-brandBlue">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-6">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap px-3 py-2 font-display text-sm font-bold uppercase tracking-widest2 text-white/80 hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/live"
            className="ml-1 whitespace-nowrap rounded-full bg-accent px-4 py-1.5 font-display text-sm font-bold uppercase tracking-widest2 text-white hover:bg-accent-dim"
          >
            Live
          </Link>
          <Link
            href="/admin"
            className="ml-1 whitespace-nowrap border-l border-white/20 px-3 py-2 font-display text-xs font-semibold uppercase tracking-widest2 text-white/50 hover:text-white/80"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
