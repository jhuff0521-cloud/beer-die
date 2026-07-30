/** Muted, distinguishable line colors for multi-series charts (e.g. one line per player). */
export const CHART_PALETTE = [
  "#5b7fb5", // slate blue
  "#8a6fb0", // muted purple
  "#4f9d8f", // teal
  "#c47f3a", // ochre
  "#7a8a5c", // olive
  "#b06699", // mauve
  "#6b8fa3", // steel
  "#a68a5c", // tan
  "#7a7a7a", // gray
  "#5c6bc0", // indigo
];

export function chartColorFor(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length];
}
