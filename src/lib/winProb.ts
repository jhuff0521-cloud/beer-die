export function winProb(
  scoreA: number,
  scoreB: number,
  tgt: number,
  teamAPPT: number,
  teamBPPT: number
) {
  const aPts = tgt - scoreA;
  const bPts = tgt - scoreB;
  if (aPts <= 0) return 98;
  if (bPts <= 0) return 2;
  const aStr = 1 / aPts;
  const bStr = 1 / bPts;
  const tot = teamAPPT + teamBPPT;
  const adj = tot > 0 ? ((teamAPPT - teamBPPT) / tot) * 0.15 : 0;
  return Math.min(98, Math.max(2, Math.round((aStr / (aStr + bStr) + adj) * 100)));
}

/** Pace-only win probability (no team-strength adjustment) — used for the Match Momentum chart,
 *  which plots win probability at every throw from just the running score. */
export function winProbAtScore(scoreA: number, scoreB: number, tgt: number) {
  const aPts = tgt - scoreA;
  const bPts = tgt - scoreB;
  if (aPts <= 0) return 98;
  if (bPts <= 0) return 2;
  return Math.min(98, Math.max(2, Math.round((1 / aPts / (1 / aPts + 1 / bPts)) * 100)));
}
