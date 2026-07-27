import { clsx } from "@/lib/clsx";

/** Last-5-games form dots. Renders neutral placeholders when no history is available yet. */
export function FormIndicator({ form }: { form?: ("W" | "L")[] }) {
  const slots = Array.from({ length: 5 }, (_, i) => form?.[i]);

  return (
    <div className="flex items-center gap-1">
      {slots.map((result, i) => (
        <span
          key={i}
          className={clsx(
            "flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-bold",
            result === "W" && "bg-emerald-600 text-white",
            result === "L" && "bg-accent text-white",
            !result && "bg-bg-border text-ink-faint"
          )}
        >
          {result ?? "–"}
        </span>
      ))}
    </div>
  );
}
