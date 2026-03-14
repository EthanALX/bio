import type {
  StatItem,
  SummarySection,
  SummaryStatsState,
  UseSummaryStatsProps,
  UseSummaryStatsResult,
} from "./SummaryStats.type";

export const useSummaryStats = ({
  stats,
  globalStats,
  year,
}: UseSummaryStatsProps): UseSummaryStatsResult => {
  const formatDistance = (value?: number) =>
    typeof value === "number" && Number.isFinite(value)
      ? `${value.toFixed(1)} km`
      : "—";
  const formatCount = (value?: number) =>
    typeof value === "number" && Number.isFinite(value) ? value : "—";
  const formatBpm = (value?: number) =>
    typeof value === "number" && Number.isFinite(value) ? `${value} bpm` : "—";

  const total = globalStats?.totalStats;
  const personal = globalStats?.personalBest;

  const totalItems: StatItem[] = [
    {
      value: formatDistance(total?.Distance),
      label: "总距离",
    },
    {
      value: formatCount(total?.Days),
      label: "总天数",
    },
    {
      value: total?.AvgPace ?? "—",
      label: "平均配速",
    },
    {
      value: formatCount(total?.Routes),
      label: "总路线",
    },
  ];

  const personalItems: StatItem[] = [
    {
      value: formatDistance(personal?.longestDistance),
      label: "最长距离",
    },
    {
      value: personal?.fastestPace ?? "—",
      label: "最快配速",
    },
    {
      value: personal?.longestDuration ?? "—",
      label: "最长时间",
    },
    {
      value: formatBpm(personal?.maxHeartRate),
      label: "最高心率",
    },
  ];

  const yearItems: StatItem[] = [
    {
      value: formatDistance(stats.Distance),
      label: "距离",
    },
    {
      value: stats.AvgPace || "—",
      label: "平均配速",
    },
    {
      value: formatCount(stats.Days),
      label: "天数",
    },
    {
      value: formatCount(stats.Routes),
      label: "路线",
    },
  ];

  const sections: SummarySection[] = [
    {
      id: "total",
      title: "Total Summary",
      items: totalItems,
    },
    {
      id: "personal",
      title: "Personal Best",
      items: personalItems,
      variant: "best",
    },
    {
      id: "year",
      title: year ? `Year Summary (${year})` : "Year Summary",
      items: yearItems,
    },
  ];

  return {
    state: { sections },
  };
};
