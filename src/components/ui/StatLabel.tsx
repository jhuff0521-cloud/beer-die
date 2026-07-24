import { clsx } from "@/lib/clsx";

export function StatLabel({
  children,
  className,
  muted = true,
}: {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <span
      className={clsx(
        "font-sans text-[10px] font-semibold uppercase tracking-widest2",
        muted ? "text-ink-faint" : "text-ink-dim",
        className
      )}
    >
      {children}
    </span>
  );
}
