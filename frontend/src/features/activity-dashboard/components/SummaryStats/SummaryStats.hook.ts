import { ActivityStats } from "../../types";
import type {
  ViewMode,
  StatItem,
  SummaryStatsState,
  SummaryStatsActions,
  UseSummaryStatsProps,
  UseSummaryStatsResult,
} from './SummaryStats.type';

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
    { value: stats.AvgPace, label: "Avg Pace", mode: "chart" as ViewMode },
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
