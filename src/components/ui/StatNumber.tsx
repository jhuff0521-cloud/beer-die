import { clsx } from "@/lib/clsx";

const SIZES = {
  xs: "text-lg",
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-7xl",
} as const;

export function StatNumber({
  value,
  size = "md",
  accent = false,
  className,
}: {
  value: string | number;
  size?: keyof typeof SIZES;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "font-display font-semibold tabular-nums leading-none tracking-tightest",
        SIZES[size],
        accent ? "text-accent" : "text-ink",
        className
      )}
    >
      {value}
    </span>
  );
}
