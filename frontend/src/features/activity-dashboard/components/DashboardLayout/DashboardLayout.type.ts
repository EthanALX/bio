import { YearData } from "../../types";
import { GlobalStats } from "../../api";

export type ViewMode = "list" | "calendar" | "chart" | "map";

export interface DashboardLayoutState {
  years: number[];
  selectedYear: number;
  viewMode: ViewMode;
  data: YearData | null;
  globalStats: GlobalStats | null;
  globalStatsLoading: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface DashboardLayoutActions {
  setSelectedYear: (year: number) => void;
  setViewMode: (mode: ViewMode) => void;
}

export interface UseDashboardLayoutResult {
  state: DashboardLayoutState;
  actions: DashboardLayoutActions;
}
