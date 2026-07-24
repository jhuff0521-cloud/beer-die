import type { Outcome, PBPEvent } from "@/lib/types";
import { clsx } from "@/lib/clsx";

export type SprayView = "spray" | "offense" | "defense";
export type SprayFilter = "all" | "team-a" | "team-b" | string;

export const OUTCOME_COLOR: Record<Outcome, string> = {
  sink: "#e8c84a",
  cupHit: "#5b9cf6",
  tableHit: "#f59e0b",
  caught: "#8a8a8a",
  fault: "#e05454",
  "": "#c9c8c2",
};

export const OUTCOME_LABEL: Record<Outcome, string> = {
  sink: "Sink",
  cupHit: "Cup Hit",
  tableHit: "Table Hit",
  caught: "Caught",
  fault: "Fault",
  "": "—",
};

const W = 400;
const H = 200;
const COLS = 3;
const ROWS = 2;

function zoneOf(x: number, y: number) {
  const col = Math.min(COLS - 1, Math.max(0, Math.floor(x * COLS)));
  const row = Math.min(ROWS - 1, Math.max(0, Math.floor(y * ROWS)));
  return row * COLS + col;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function heatColor(t: number, from: [number, number, number], to: [number, number, number]) {
  const r = Math.round(lerp(from[0], to[0], t));
  const g = Math.round(lerp(from[1], to[1], t));
  const b = Math.round(lerp(from[2], to[2], t));
  return `rgba(${r}, ${g}, ${b}, 0.55)`;
}

const OFFENSE_COLD: [number, number, number] = [40, 40, 180];
const OFFENSE_HOT: [number, number, number] = [220, 40, 40];
const DEFENSE_WEAK: [number, number, number] = [200, 40, 40];
const DEFENSE_STRONG: [number, number, number] = [40, 160, 40];

function pointsFor(outcome: Outcome) {
  if (outcome === "sink") return 3;
  if (outcome === "cupHit") return 2;
  if (outcome === "tableHit") return 1;
  return 0;
}

export function SprayChart({
  events,
  view = "spray",
  filter = "all",
  showGrid = true,
  teamA,
  teamB,
  className,
}: {
  events: PBPEvent[];
  view?: SprayView;
  filter?: SprayFilter;
  showGrid?: boolean;
  teamA?: string[];
  teamB?: string[];
  className?: string;
}) {
  const filtered = events.filter((e) => {
    if (filter === "all") return true;
    if (filter === "team-a") return teamA?.includes(e.thrower) ?? false;
    if (filter === "team-b") return teamB?.includes(e.thrower) ?? false;
    return e.thrower === filter;
  });

  const zoneAgg = Array.from({ length: COLS * ROWS }, () => ({
    throws: 0,
    points: 0,
    defended: 0,
    caught: 0,
  }));

  for (const e of filtered) {
    const z = zoneOf(e.x, e.y);
    zoneAgg[z].throws += 1;
    zoneAgg[z].points += pointsFor(e.outcome);
    zoneAgg[z].defended += 1;
    if (e.outcome === "caught") zoneAgg[z].caught += 1;
  }

  const zoneValues = zoneAgg.map((z) => {
    if (view === "offense") return z.throws ? z.points / z.throws / 3 : null;
    if (view === "defense") return z.defended ? z.caught / z.defended : null;
    return null;
  });

  const definedValues = zoneValues.filter((v): v is number => v !== null);
  const min = definedValues.length ? Math.min(...definedValues) : 0;
  const max = definedValues.length ? Math.max(...definedValues) : 1;

  return (
    <div className={clsx("w-full", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full border border-bg-border bg-bg-surface">
        <rect x={0} y={0} width={W} height={H} fill="var(--color-bg-surface)" />

        {(view === "offense" || view === "defense") &&
          zoneAgg.map((z, i) => {
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            const x = (col / COLS) * W;
            const y = (row / ROWS) * H;
            const w = W / COLS;
            const h = H / ROWS;
            const value = zoneValues[i];
            const t = value === null ? null : max === min ? 0.5 : (value - min) / (max - min);
            const fill =
              t === null
                ? "rgba(255,255,255,0.03)"
                : view === "offense"
                  ? heatColor(t, OFFENSE_COLD, OFFENSE_HOT)
                  : heatColor(t, DEFENSE_WEAK, DEFENSE_STRONG);
            return (
              <g key={i}>
                <rect x={x} y={y} width={w} height={h} fill={fill} stroke="var(--color-bg-border)" strokeWidth={1} />
                <text
                  x={x + w / 2}
                  y={y + h / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={13}
                  fontFamily="var(--font-geist-mono)"
                  fill="var(--color-ink)"
                  fontWeight={600}
                >
                  {value === null ? "–" : `${Math.round(value * 100)}%`}
                </text>
              </g>
            );
          })}

        {showGrid && (
          <g stroke="var(--color-bg-border)" strokeDasharray="2 3">
            <line x1={(W / COLS) * 1} y1={0} x2={(W / COLS) * 1} y2={H} />
            <line x1={(W / COLS) * 2} y1={0} x2={(W / COLS) * 2} y2={H} />
            <line x1={0} y1={H / ROWS} x2={W} y2={H / ROWS} />
          </g>
        )}

        {/* net */}
        <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="var(--color-accent)" strokeWidth={1.5} opacity={0.7} />

        {/* cups at true corners */}
        {[
          [W * 0.1, H * 0.1],
          [W * 0.9, H * 0.1],
          [W * 0.1, H * 0.9],
          [W * 0.9, H * 0.9],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={7} fill="none" stroke="var(--color-accent)" strokeWidth={1.5} />
        ))}

        {filtered.map((e, i) => (
          <circle
            key={i}
            cx={e.x * W}
            cy={e.y * H}
            r={3.5}
            fill={OUTCOME_COLOR[e.outcome]}
            fillOpacity={e.outcome === "fault" ? 0.5 : 0.9}
            stroke="var(--color-bg)"
            strokeWidth={0.75}
          >
            <title>
              {`#${e.n} ${e.thrower} → ${OUTCOME_LABEL[e.outcome]}`}
            </title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

export function SprayLegend({ className }: { className?: string }) {
  const items: Outcome[] = ["sink", "cupHit", "tableHit", "caught", "fault"];
  return (
    <div className={clsx("flex flex-wrap gap-x-4 gap-y-1", className)}>
      {items.map((o) => (
        <div key={o} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: OUTCOME_COLOR[o], opacity: o === "fault" ? 0.5 : 1 }}
          />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
            {OUTCOME_LABEL[o]}
          </span>
        </div>
      ))}
    </div>
  );
}
