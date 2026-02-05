import { useActivities } from "@/features/homepage/hooks";
import type {
  UseMetricCardsProps,
  UseMetricCardsResult,
  MetricItem,
  MetricCardsData,
  MetricVariant,
} from "./MetricCards.type";

export const useMetricCards = (
  props: UseMetricCardsProps
): UseMetricCardsResult => {
  const { selectedYear } = props;
  const { totalDistance, avgPace, activeDays } = useActivities(selectedYear);

  const metrics: MetricItem[] = [
    {
      label: "总距离",
      value: `${totalDistance.toFixed(0)}`,
      unit: "km",
      icon: "",
      variant: "primary" as MetricVariant,
    },
    {
      label: "平均配速",
      value: avgPace.replace('"', ""),
      unit: "/km",
      icon: "",
      variant: "blue" as MetricVariant,
    },
    {
      label: "活跃天数",
      value: String(activeDays),
      unit: "天",
      icon: "",
      variant: "orange" as MetricVariant,
    },
  ];

  return {
    data: { metrics },
  };
};
