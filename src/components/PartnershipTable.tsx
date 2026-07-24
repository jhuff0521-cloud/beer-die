import { Avatar } from "@/components/ui/Avatar";
import { StatTable, type StatColumn } from "@/components/ui/StatTable";
import { partnershipSlug } from "@/lib/api";
import type { Partnership } from "@/lib/types";

const TEAM_COLUMNS: StatColumn<Partnership>[] = [
  { key: "rank", label: "#", align: "right", width: "32px", render: (_r, i) => i + 1 },
  {
    key: "partnership",
    label: "Partnership",
    render: (r) => (
      <div className="flex items-center gap-2 font-sans normal-case">
        <div className="flex -space-x-2">
          <Avatar src={r.photoA} alt={r.playerA} size="xs" className="ring-2 ring-bg" />
          <Avatar src={r.photoB} alt={r.playerB} size="xs" className="ring-2 ring-bg" />
        </div>
        <span className="font-semibold text-ink">
          {r.playerA} <span className="text-ink-faint">&amp;</span> {r.playerB}
        </span>
      </div>
    ),
  },
  { key: "games", label: "GP", align: "right", render: (r) => r.games },
  { key: "record", label: "Record", align: "right", render: (r) => `${r.wins}-${r.losses}` },
  { key: "winPct", label: "WIN%", align: "right", emphasize: true, render: (r) => `${Math.round(r.winPct * 100)}%` },
  { key: "ppt", label: "PPT Together", align: "right", render: (r) => r.pptTogether.toFixed(3) },
  { key: "ctr", label: "CTR Together", align: "right", render: (r) => r.ctrTogether.toFixed(3) },
];

export function PartnershipTable({ rows, highlightSlug }: { rows: Partnership[]; highlightSlug?: string }) {
  return (
    <StatTable
      columns={TEAM_COLUMNS}
      rows={rows}
      rowKey={(r) => partnershipSlug(r.playerA, r.playerB)}
      rowHref={(r) => `/teams/${partnershipSlug(r.playerA, r.playerB)}`}
      rowClassName={(r) =>
        highlightSlug && partnershipSlug(r.playerA, r.playerB) === highlightSlug
          ? "outline outline-2 -outline-offset-2 outline-accent"
          : undefined
      }
    />
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-bg-border px-6 py-14 text-center">
      <p className="mx-auto max-w-sm font-sans text-sm text-ink-faint">{message}</p>
    </div>
  );
}
