import { ActivityStats } from "../../types";

export interface StatItem {
  value: string | number;
  label: string;
  hint: string;
}

export interface SummaryStatsProps {
  stats: ActivityStats;
  isLoading?: boolean;
}

export interface SummaryStatsState {
  statItems: StatItem[];
}

export interface UseSummaryStatsProps {
  stats: ActivityStats;
}

export interface UseSummaryStatsResult {
  state: SummaryStatsState;
}
