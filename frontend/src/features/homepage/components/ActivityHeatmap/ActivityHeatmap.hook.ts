import { useActivities } from "@/features/homepage/hooks";
import type {
  UseActivityHeatmapProps,
  UseActivityHeatmapResult,
  ActivityHeatmapData,
} from "./ActivityHeatmap.type";

export const useActivityHeatmap = (
  props: UseActivityHeatmapProps
): UseActivityHeatmapResult => {
  const { selectedYear } = props;
  const { heatmapData } = useActivities(selectedYear);

  const data: ActivityHeatmapData = {
    heatmapData,
  };

  return {
    data,
  };
};
