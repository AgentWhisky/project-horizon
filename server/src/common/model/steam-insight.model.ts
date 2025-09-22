export interface SteamInsightUpdateStats {
  games: { inserts: number; updates: number; noChange: number };
  dlc: { inserts: number; updates: number; noChange: number };
  errors: number;
  total: number;
}
