export function RankChangeArrow({ delta }: { delta: number | undefined }) {
  if (!delta) {
    return (
      <span className="inline-flex items-center font-mono text-xs text-ink-faint" aria-label="No change">
        —
      </span>
    );
  }
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 font-mono text-xs font-semibold text-emerald-600" aria-label={`Up ${delta}`}>
        ▲ {delta}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 font-mono text-xs font-semibold text-accent" aria-label={`Down ${Math.abs(delta)}`}>
      ▼ {Math.abs(delta)}
    </span>
  );
}
