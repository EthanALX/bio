import { Activity } from "../../types";

// View mode for chart visualization
export type ChartViewMode = 'treemap' | 'sunburst';

// Animation phases for view transitions
export type AnimationPhase = 'idle' | 'contracting' | 'morphing' | 'expanding';

// Hierarchy node for treemap/sunburst data structure
export interface HierarchyNode {
  id: string;           // Unique identifier (e.g., "2024-Q1-Apr-W1")
  name: string;         // Display name (e.g., "2024 Q1")
  level: 'year' | 'quarter' | 'month' | 'week';
  value: number;        // Cumulative distance (km)
  count: number;        // Number of running activities
  avgPace: string;      // Average pace (e.g., "5'30\"")
  children?: HierarchyNode[];
  parent?: HierarchyNode;
  color?: string;
  // Treemap coordinates
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  // Sunburst coordinates
  startAngle?: number;
  endAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
}

// Animation state for transitions
export interface AnimationState {
  phase: AnimationPhase;
  progress: number;     // 0-1
}

// Legacy interfaces (kept for backward compatibility)
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

// Component props
export interface ActivityChartProps {
  activities: Activity[];
}

// Hook interfaces
export interface UseActivityChartProps {
  activities: Activity[];
}

export interface UseActivityChartResult {
  chartData: ChartDataPoint[];
  hierarchyData: HierarchyNode;
}
