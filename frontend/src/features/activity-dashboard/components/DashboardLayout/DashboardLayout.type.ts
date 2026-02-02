import { YearData } from "../../types";

export type ViewMode = "list" | "calendar" | "chart" | "map";

export interface DashboardLayoutState {
  years: number[];
  selectedYear: number;
  viewMode: ViewMode;
  data: YearData | null;
  isLoading: boolean;
  error: Error | null;
  isSidebarFixed: boolean;
  sidebarLeft: number;
}

export interface DashboardLayoutActions {
  setSelectedYear: (year: number) => void;
  setViewMode: (mode: ViewMode) => void;
}

export interface DashboardLayoutRefs {
  sidebarRef: React.RefObject<HTMLDivElement | null>;
}

export interface UseDashboardLayoutResult {
  state: DashboardLayoutState;
  actions: DashboardLayoutActions;
  refs: DashboardLayoutRefs;
}
