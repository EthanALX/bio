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
      label: "距离",
      hint: "今年跑步总距离",
    },
    {
      value: stats.AvgPace,
      label: "平均配速",
      hint: "所有跑步的平均配速",
    },
    {
      value: stats.Days,
      label: "天数",
      hint: "有活动的独立天数",
    },
    {
      value: stats.Routes,
      label: "路线",
      hint: "带有GPS轨迹数据的跑步",
    },
  ];

  return {
    state: { statItems },
  };
};
