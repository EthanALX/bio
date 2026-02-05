export interface QuickStatsProps {
  selectedYear?: number;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface QuickStatsData {
  stats: StatItem[];
}

export interface UseQuickStatsProps {
  selectedYear?: number;
}

export interface UseQuickStatsResult {
  data: QuickStatsData;
}
