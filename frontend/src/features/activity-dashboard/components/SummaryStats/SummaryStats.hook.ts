import type {
  StatItem,
  SummaryStatsState,
  UseSummaryStatsProps,
  UseSummaryStatsResult,
} from "./SummaryStats.type";

export const useSummaryStats = ({
  stats,
}: UseSummaryStatsProps): UseSummaryStatsResult => {
  const statItems: StatItem[] = [
    {
      value: `${stats.Distance} km`,
      label: "Distance",
      hint: "Total distance run this year",
    },
    {
      value: stats.AvgPace,
      label: "Avg Pace",
      hint: "Average pace across all runs",
    },
    {
      value: stats.Days,
      label: "Days",
      hint: "Unique days with an activity",
    },
    {
      value: stats.Routes,
      label: "Routes",
      hint: "Runs with GPS track data",
    },
  ];

  return {
    state: { statItems },
  };
};
