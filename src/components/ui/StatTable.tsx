import Link from "next/link";
import { clsx } from "@/lib/clsx";

export interface StatColumn<T> {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  width?: string;
  render: (row: T, index: number) => React.ReactNode;
  emphasize?: boolean;
}

export function StatTable<T>({
  columns,
  rows,
  rowKey,
  rowHref,
  rowClassName,
  className,
}: {
  columns: StatColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  rowHref?: (row: T) => string;
  rowClassName?: (row: T) => string | undefined;
  className?: string;
}) {
  return (
    <div className={clsx("w-full overflow-x-auto border border-bg-border", className)}>
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr className="border-b border-bg-border bg-bg-surface">
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={clsx(
                  "whitespace-nowrap px-3 py-2 font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  (!col.align || col.align === "left") && "text-left"
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const href = rowHref?.(row);
            return (
              <tr
                key={rowKey(row, i)}
                className={clsx(
                  "border-b border-bg-border/60",
                  i % 2 === 1 && "bg-bg-surface/40",
                  href && "hover:bg-bg-raised",
                  rowClassName?.(row)
                )}
              >
                {columns.map((col) => {
                  const cellClass = clsx(
                    "whitespace-nowrap font-mono tnum",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.emphasize ? "text-accent font-semibold" : "text-ink"
                  );
                  return (
                    <td key={col.key} className="p-0">
                      {href ? (
                        <Link href={href} className={clsx("block px-3 py-2", cellClass)}>
                          {col.render(row, i)}
                        </Link>
                      ) : (
                        <div className={clsx("px-3 py-2", cellClass)}>{col.render(row, i)}</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
