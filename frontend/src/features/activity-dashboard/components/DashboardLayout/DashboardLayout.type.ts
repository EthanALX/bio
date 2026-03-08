import { YearData } from "../../types";

export type ViewMode = "list" | "calendar" | "chart" | "map";

export interface DashboardLayoutState {
  years: number[];
  selectedYear: number;
  viewMode: ViewMode;
  data: YearData | null;
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
