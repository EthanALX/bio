export interface ActivityHeatmapProps {
  selectedYear?: number;
}

export interface ActivityHeatmapData {
  heatmapData: number[][];
}

export interface UseActivityHeatmapProps {
  selectedYear?: number;
}

export interface UseActivityHeatmapResult {
  data: ActivityHeatmapData;
}
