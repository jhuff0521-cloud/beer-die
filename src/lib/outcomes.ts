import type { Outcome, PBPEvent } from "./types";

function canon(s: string) {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * The Apps Script API doesn't return outcome strings in the exact casing/format documented
 * (e.g. "table_dropped" instead of "tableHit"). This tolerates spelling/format variations
 * so the UI doesn't silently mis-color or blank out throws as the sheet's conventions evolve.
 */
const OUTCOME_MAP: Record<string, Outcome> = {
  sink: "sink",
  sinks: "sink",
  cuphit: "cupHit",
  cup: "cupHit",
  tablehit: "tableHit",
  tabledropped: "tableHit",
  tabledrop: "tableHit",
  dropped: "tableHit",
  caught: "caught",
  catch: "caught",
  fault: "fault",
  faults: "fault",
};

export function normalizeOutcome(raw: unknown): Outcome {
  if (typeof raw !== "string" || !raw) return "";
  return OUTCOME_MAP[canon(raw)] ?? "";
}

export function normalizePBPEvent(raw: PBPEvent): PBPEvent {
  return { ...raw, outcome: normalizeOutcome(raw.outcome) };
}

export function normalizePBPEvents(raw: PBPEvent[] | undefined): PBPEvent[] {
  return (raw ?? []).map(normalizePBPEvent);
}
