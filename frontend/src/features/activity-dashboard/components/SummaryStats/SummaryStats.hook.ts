import { ActivityStats } from "../../types";

export type ViewMode = "list" | "calendar" | "chart" | "map" | "pace";

export interface StatItem {
  value: string | number;
  label: string;
  mode: ViewMode;
}

export interface UseSummaryStatsProps {
  stats: ActivityStats;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

export interface UseSummaryStatsResult {
  state: {
    statItems: StatItem[];
  };
  actions: {
    handleViewChange: (mode: ViewMode) => void;
  };
}

export const useSummaryStats = ({
  stats,
  viewMode,
  onViewChange,
}: UseSummaryStatsProps): UseSummaryStatsResult => {
  const statItems: StatItem[] = [
    {
      value: `${stats.Distance}KM`,
      label: "Distance",
      mode: "list" as ViewMode,
    },
    { value: stats.Days, label: "Days", mode: "calendar" as ViewMode },
    { value: stats.AvgPace, label: "Avg Pace", mode: "pace" as ViewMode },
    { value: stats.Routes, label: "Routes", mode: "map" as ViewMode },
  ];

  const handleViewChange = (mode: ViewMode) => {
    onViewChange(mode);
  };

  return {
    state: {
      statItems,
    },
    actions: {
      handleViewChange,
    },
  };
};
