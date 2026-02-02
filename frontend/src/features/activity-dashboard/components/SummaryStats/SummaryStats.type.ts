import { ActivityStats } from "../../types";

export type ViewMode = "list" | "calendar" | "chart" | "map";

export interface StatItem {
  value: string | number;
  label: string;
  mode: ViewMode;
}

export interface SummaryStatsProps {
  stats: ActivityStats;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

export interface SummaryStatsState {
  statItems: StatItem[];
}

export interface SummaryStatsActions {
  handleViewChange: (mode: ViewMode) => void;
}

export interface UseSummaryStatsProps {
  stats: ActivityStats;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

export interface UseSummaryStatsResult {
  state: SummaryStatsState;
  actions: SummaryStatsActions;
}
