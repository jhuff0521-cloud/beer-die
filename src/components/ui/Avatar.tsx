import { clsx } from "@/lib/clsx";

const SIZES = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 88,
  xl: 140,
} as const;

const FONT_SIZE: Record<keyof typeof SIZES, string> = {
  xs: "text-[9px]",
  sm: "text-[11px]",
  md: "text-sm",
  lg: "text-2xl",
  xl: "text-4xl",
};

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function Avatar({
  src,
  alt,
  size = "md",
  ring = false,
  className,
}: {
  src?: string | null;
  alt: string;
  size?: keyof typeof SIZES;
  ring?: boolean;
  className?: string;
}) {
  const px = SIZES[size];
  return (
    <div
      className={clsx(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-surface",
        ring && "ring-2 ring-accent ring-offset-2 ring-offset-bg",
        className
      )}
      style={{ width: px, height: px }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className={clsx("font-display font-semibold text-ink-faint", FONT_SIZE[size])}>
          {initialsOf(alt)}
        </span>
      )}
    </div>
  );
}
