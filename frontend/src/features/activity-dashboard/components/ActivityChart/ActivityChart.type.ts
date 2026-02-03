import { Activity } from "../../types";

// Animation phases for view transitions
export type AnimationPhase = "idle" | "contracting" | "morphing" | "expanding";

// Hierarchy node for treemap data structure
export interface HierarchyNode {
  id: string; // Unique identifier (e.g., "2024-Jan-W1")
  name: string; // Display name (e.g., "2024 Jan")
  level: "year" | "month" | "week";
  value: number; // Cumulative distance (km)
  count: number; // Number of running activities
  avgPace: string; // Average pace (e.g., "5'30\"")
  avgBpm?: number; // Average heart rate
  children?: HierarchyNode[];
  parent?: HierarchyNode;
  color?: string;
  // Treemap coordinates
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
}

// Animation state for transitions
export interface AnimationState {
  phase: AnimationPhase;
  progress: number; // 0-1
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
  state: {
    // Current state
    currentRoot: HierarchyNode | null;
    dimensions: { width: number; height: number };
    isAnimating: boolean;
    // Refs
    svgRef: React.RefObject<SVGSVGElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    tooltipRef: React.RefObject<HTMLDivElement | null>;
    // Callbacks
    handleBack: () => void;
    handleMouseMove: (event: MouseEvent) => void;
    handleMonthNavigate: (direction: "prev" | "next") => void;
    currentMonthIndex: number;
    totalMonths: number;
  };
}
