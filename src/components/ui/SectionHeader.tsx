import { clsx } from "@/lib/clsx";

export function SectionHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-end justify-between gap-4 border-b border-bg-border pb-2", className)}>
      <div className="flex items-center gap-2.5">
        <span className="h-4 w-1 bg-accent" />
        <h2 className="font-display text-xl font-semibold uppercase tracking-tight text-ink">{title}</h2>
      </div>
      {subtitle && (
        <span className="font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
          {subtitle}
        </span>
      )}
    </div>
  );
}
