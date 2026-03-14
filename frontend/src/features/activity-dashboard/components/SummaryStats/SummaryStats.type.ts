import type { ActivityStats } from "../../types";
import type { GlobalStats } from "../../api";

export interface StatItem {
  value: string | number;
  label: string;
  hint?: string;
}

export interface SummarySection {
  id: "total" | "personal" | "year";
  title: string;
  items: StatItem[];
  variant?: "default" | "best";
}

export interface SummaryStatsProps {
  stats: ActivityStats;
  globalStats?: GlobalStats | null;
  year?: number;
  isLoading?: boolean;
}

export interface SummaryStatsState {
  sections: SummarySection[];
}

export interface UseSummaryStatsProps {
  stats: ActivityStats;
  globalStats?: GlobalStats | null;
  year?: number;
}

export interface UseSummaryStatsResult {
  state: SummaryStatsState;
}
