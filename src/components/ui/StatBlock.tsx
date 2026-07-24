import { clsx } from "@/lib/clsx";
import { StatLabel } from "./StatLabel";
import { StatNumber } from "./StatNumber";

export function StatBlock({
  label,
  value,
  size = "md",
  accent = false,
  align = "left",
  className,
}: {
  label: string;
  value: string | number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  accent?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-1",
        align === "center" && "items-center text-center",
        align === "right" && "items-end text-right",
        className
      )}
    >
      <StatNumber value={value} size={size} accent={accent} />
      <StatLabel>{label}</StatLabel>
    </div>
  );
}
