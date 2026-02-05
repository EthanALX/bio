import { useActivities } from "@/features/homepage/hooks";
import type {
  UseQuickStatsProps,
  UseQuickStatsResult,
  StatItem,
  QuickStatsData,
} from "./QuickStats.type";

export const useQuickStats = (
  props: UseQuickStatsProps
): UseQuickStatsResult => {
  const { selectedYear } = props;
  const { totalRuns, totalDistance, activeDays } = useActivities(selectedYear);

  const stats: StatItem[] = [
    { value: String(totalRuns), label: "跑步次数" },
    { value: `${totalDistance.toFixed(1)}km`, label: "总公里数" },
    { value: String(activeDays), label: "活跃天数" },
  ];

  return {
    data: { stats },
  };
};
