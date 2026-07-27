import { clsx } from "@/lib/clsx";

export function PageTitle({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={clsx("mb-8 flex items-end justify-between gap-4 border-b-2 border-brandBlue pb-3", className)}>
      <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-tight text-brandBlue sm:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <span className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-faint">
          {subtitle}
        </span>
      )}
    </div>
  );
}
