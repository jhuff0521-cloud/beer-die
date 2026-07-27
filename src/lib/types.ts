export type Outcome = "sink" | "cupHit" | "tableHit" | "caught" | "fault" | "";

export interface PlayerStanding {
  name: string;
  photo: string | null;
  games: number;
  wins: number;
  throws: number;
  sinks: number;
  cupHits: number;
  tableHits: number;
  faults?: number;
  catchOpp?: number;
  catches?: number;
  oppPts?: number;
  ppt: number;
  skr: number;
  thr: number;
  chr: number;
  ctr: number;
  dsr: number;
  spd: number;
  csi: number;
  con: number;
  winPct: number;
  bdwar: number;
  overall: number;
  ppt_rating: number;
  ctr_rating: number;
  thr_rating: number;
  skr_rating: number;
  csi_rating: number;
  dsr_rating: number;
  pbp?: PBPEvent[];
  partnerships?: Record<string, unknown>[];
  bio?: string | null;
}

export interface PlayerSummary {
  name: string;
  photo: string | null;
}

export interface PBPEvent {
  date?: string;
  n: number;
  thrower: string;
  defender: string;
  outcome: Outcome;
  x: number;
  y: number;
  isHL?: "YES" | "NO";
  scoreA?: number;
  scoreB?: number;
}

export interface LiveGamePlayer {
  name: string;
  team: "A" | "B";
  pts: number;
  throws: number;
  sinks?: number;
  cupHits?: number;
  tableHits?: number;
  catchOpp?: number;
  catches?: number;
  oppPts?: number;
  ppt: number;
  ctr: number;
  thr: number;
  photo: string | null;
}

export interface LiveGame {
  status: "LIVE" | "FINAL" | "IDLE" | string;
  scoreTgt: number;
  scoreA: number;
  scoreB: number;
  teamA: string[];
  teamB: string[];
  thrower: string;
  defender: string;
  throwNum: number;
  lastOutcome: Outcome;
  players: LiveGamePlayer[];
  pbp: PBPEvent[];
}

export interface LiveResponse {
  status: string;
  game: LiveGame;
  players?: PlayerSummary[];
}

export interface Partnership {
  playerA: string;
  playerB: string;
  photoA: string | null;
  photoB: string | null;
  games: number;
  wins: number;
  losses: number;
  winPct: number;
  pptTogether: number;
  ctrTogether: number;
  bio?: string | null;
  /** Most recent games first, e.g. ["W", "L", "W", "W", "L"]. Not available until the Apps
   *  Script exposes per-game history for a partnership — absent/undefined until then. */
  recentForm?: ("W" | "L")[];
}

export interface NewsArticle {
  id: string;
  headline: string;
  excerpt?: string;
  body: string;
  date: string;
  author?: string;
  image?: string | null;
}

