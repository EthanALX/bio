import { Activity } from "../../types";

export interface WeeklyData {
  weekNumber: number;
  year: number;
  activities: Activity[];
  avgPaceSeconds: number;
  avgBpm: number;
  runningDays: number;
}

export interface ChartDataPoint {
  id: string;
  weekNumber: number;
  year: number;
  runningDays: number;
  paceValue: string;
  bpmValue: string;
  pacePercent: number;
  hrPercent: number;
  hasData: boolean;
}

export interface ChartDimensions {
  chartWidth: number;
  chartHeight: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  plotWidth: number;
  plotHeight: number;
}

export interface ActivityChartProps {
  activities: Activity[];
}

export interface UseActivityChartProps {
  activities: Activity[];
}

export interface UseActivityChartResult {
  chartData: ChartDataPoint[];
}
