export function CollapsibleBio({ bio }: { bio?: string | null }) {
  if (!bio) return null;

  return (
    <details className="group border border-bg-border">
      <summary className="flex cursor-pointer list-none items-center justify-between bg-bg-surface px-5 py-3 font-display text-lg font-semibold uppercase tracking-tight text-brandBlue">
        Bio
        <span className="font-sans text-xs text-ink-faint transition-transform group-open:rotate-180">▾</span>
      </summary>
      <p className="whitespace-pre-line px-5 py-4 font-sans text-sm leading-relaxed text-ink-dim">{bio}</p>
    </details>
  );
}
