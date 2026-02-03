import { useMemo, useRef, useEffect, useCallback, useState } from "react";
import * as d3 from "d3-hierarchy";
import * as d3Select from "d3-selection";
import "d3-transition";
import { Activity } from "../../types";
import styles from "./ActivityChart.module.css";
import {
  createHierarchy,
  createTreemapLayout,
  getNodeColor,
  getMaxValue,
} from "../../utils/d3-hierarchy";
import type {
  WeeklyData,
  ChartDataPoint,
  HierarchyNode,
  UseActivityChartProps,
  UseActivityChartResult,
} from "./ActivityChart.type";

// ============================================
//           Data Processing Functions
// ============================================

function calculateAveragePace(activities: Activity[]): string {
  const paceSeconds = activities
    .map((a) => {
      const match = a.pace.match(/(\d+)'(\d+)/);
      return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
    })
    .filter((s) => s > 0);

  if (paceSeconds.length === 0) return "";

  const avgSeconds =
    paceSeconds.reduce((sum, s) => sum + s, 0) / paceSeconds.length;
  const minutes = Math.floor(avgSeconds / 60);
  const seconds = Math.round(avgSeconds % 60);
  return `${minutes}'${String(seconds).padStart(2, "0")}"`;
}

function calculateAverageBpm(activities: Activity[]): number | undefined {
  const bpms = activities.map((a) => a.bpm).filter((b) => b > 0);

  if (bpms.length === 0) return undefined;

  return bpms.reduce((sum, b) => sum + b, 0) / bpms.length;
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function createEmptyHierarchyNode(): HierarchyNode {
  return {
    id: "empty",
    name: "No Data",
    level: "year",
    value: 0,
    count: 0,
    avgPace: "",
  };
}

// ============================================
//           Hierarchy Data Builder
// ============================================

function buildHierarchyData(activities: Activity[]): HierarchyNode {
  if (!activities.length) {
    return createEmptyHierarchyNode();
  }

  const year = new Date(activities[0].date).getFullYear();

  const yearNode: HierarchyNode = {
    id: String(year),
    name: String(year),
    level: "year",
    value: 0,
    count: 0,
    avgPace: "",
    order: 0,
    children: [],
  };

  const monthNames = [
    "Jan 一月",
    "Feb 二月",
    "Mar 三月",
    "Apr 四月",
    "May 五月",
    "Jun 六月",
    "Jul 七月",
    "Aug 八月",
    "Sep 九月",
    "Oct 十月",
    "Nov 十一月",
    "Dec 十二月",
  ];

  // Group by month
  const monthsMap = new Map<number, Activity[]>();

  activities.forEach((activity) => {
    const date = new Date(activity.date);
    const monthIndex = date.getMonth();

    if (!monthsMap.has(monthIndex)) {
      monthsMap.set(monthIndex, []);
    }
    monthsMap.get(monthIndex)!.push(activity);
  });

  // Build ALL 12 month nodes (even if no data)
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const monthActivities = monthsMap.get(monthIndex) || [];
    const monthName = monthNames[monthIndex];
    const monthNode: HierarchyNode = {
      id: `${year}-${monthName}`,
      name: monthName,
      level: "month",
      value: 0,
      count: 0,
      avgPace: "",
      order: monthIndex,
      children: [],
      parent: yearNode,
    };

    if (monthActivities.length > 0) {
      // Group by week within month
      const weeksMap = new Map<number, Activity[]>();

      monthActivities.forEach((activity) => {
        const date = new Date(activity.date);
        const weekNumber = getWeekNumber(date);
        const weekKey = weekNumber;

        if (!weeksMap.has(weekKey)) {
          weeksMap.set(weekKey, []);
        }
        weeksMap.get(weekKey)!.push(activity);
      });

      // Build week nodes
      weeksMap.forEach((weekActivities, weekNumber) => {
        const totalDistance = weekActivities.reduce((sum, a) => sum + a.distance, 0);
        const avgPace = calculateAveragePace(weekActivities);
        const avgBpm = calculateAverageBpm(weekActivities);

        const weekNode: HierarchyNode = {
          id: `${year}-${monthName}-W${weekNumber}`,
          name: `W${weekNumber}`,
          level: "week",
          value: totalDistance,
          count: weekActivities.length,
          avgPace: avgPace,
          avgBpm: avgBpm,
          order: weekNumber,
          parent: monthNode,
        };

        monthNode.children!.push(weekNode);
        monthNode.value += totalDistance;
        monthNode.count += weekActivities.length;
      });

      // Sort weeks by week number
      monthNode.children!.sort((a, b) => {
        const weekNumA = parseInt(a.id.split("-W")[1]);
        const weekNumB = parseInt(b.id.split("-W")[1]);
        return weekNumA - weekNumB;
      });

      monthNode.avgPace = calculateAveragePace(monthActivities);
      monthNode.avgBpm = calculateAverageBpm(monthActivities);
    }

    yearNode.children!.push(monthNode);
    yearNode.value += monthNode.value;
    yearNode.count += monthNode.count;
  }

  yearNode.avgPace = calculateAveragePace(activities);
  yearNode.avgBpm = calculateAverageBpm(activities);

  return yearNode;
}

// ============================================
//           Chart Data Builder
// ============================================

function buildChartData(weeklyData: WeeklyData[]): ChartDataPoint[] {
  if (!weeklyData.length) return [];

  const paceValues = weeklyData
    .filter((w) => w.avgPaceSeconds > 0)
    .map((w) => w.avgPaceSeconds);
  const bpmValues = weeklyData.filter((w) => w.avgBpm > 0).map((w) => w.avgBpm);

  if (paceValues.length === 0 || bpmValues.length === 0) {
    return weeklyData.map((week) => ({
      id: `${week.year}-W${week.weekNumber}`,
      weekNumber: week.weekNumber,
      year: week.year,
      runningDays: week.runningDays,
      paceValue: "",
      bpmValue: "",
      pacePercent: 0,
      hrPercent: 0,
      hasData: false,
    }));
  }

  const paceMin = Math.min(...paceValues);
  const paceMax = Math.max(...paceValues);
  const bpmMin = Math.min(...bpmValues);
  const bpmMax = Math.max(...bpmValues);

  return weeklyData.map((week) => {
    const paceSeconds = week.avgPaceSeconds;
    const bpm = week.avgBpm;

    const paceMinutes = Math.floor(paceSeconds / 60);
    const paceSecs = Math.round(paceSeconds % 60);
    const paceValue =
      paceSeconds > 0
        ? `${paceMinutes}'${String(paceSecs).padStart(2, "0")}"`
        : "";

    return {
      id: `${week.year}-W${week.weekNumber}`,
      weekNumber: week.weekNumber,
      year: week.year,
      runningDays: week.runningDays,
      paceValue,
      bpmValue: bpm > 0 ? `${Math.round(bpm)} BPM` : "",
      pacePercent:
        paceSeconds > 0
          ? ((paceMax - paceSeconds) / (paceMax - paceMin || 1)) * 100
          : 0,
      hrPercent:
        bpm > 0
          ? ((bpm - bpmMin * 0.9) / (bpmMax - bpmMin * 0.9 || 1)) * 100
          : 0,
      hasData: paceSeconds > 0 || bpm > 0,
    };
  });
}

// ============================================
//           Weekly Data Builder
// ============================================

function buildWeeklyData(activities: Activity[]): WeeklyData[] {
  if (!activities.length) return [];

  const weeksMap = new Map<string, Activity[]>();

  activities.forEach((activity) => {
    const date = new Date(activity.date);
    const year = date.getFullYear();
    const weekNumber = getWeekNumber(date);
    const key = `${year}-W${weekNumber}`;

    if (!weeksMap.has(key)) {
      weeksMap.set(key, []);
    }
    weeksMap.get(key)!.push(activity);
  });

  const weeks: WeeklyData[] = [];
  weeksMap.forEach((weekActivities, key) => {
    const [year, weekStr] = key.split("-W");
    const weekNumber = parseInt(weekStr, 10);

    const paceSeconds = weekActivities
      .map((a) => {
        const match = a.pace.match(/(\d+)'(\d+)/);
        return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
      })
      .filter((s) => s > 0);

    const bpms = weekActivities.map((a) => a.bpm).filter((b) => b > 0);

    const avgPaceSeconds =
      paceSeconds.length > 0
        ? paceSeconds.reduce((sum, s) => sum + s, 0) / paceSeconds.length
        : 0;
    const avgBpm =
      bpms.length > 0 ? bpms.reduce((sum, b) => sum + b, 0) / bpms.length : 0;

    weeks.push({
      weekNumber,
      year: parseInt(year, 10),
      activities: weekActivities,
      avgPaceSeconds,
      avgBpm,
      runningDays: paceSeconds.length,
    });
  });

  weeks.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.weekNumber - b.weekNumber;
  });

  return weeks;
}

// ============================================
//           D3 Renderer Functions
// ============================================

type PartitionNode = d3.HierarchyNode<HierarchyNode> & {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};

function renderTreemap(
  svg: d3Select.Selection<SVGSVGElement, unknown, null, undefined>,
  root: HierarchyNode,
  dims: { width: number; height: number },
  maxValue: number,
  handleNodeClick: (node: HierarchyNode) => void,
  showTooltip: (event: MouseEvent, node: HierarchyNode) => void,
  hideTooltip: () => void,
  styles: typeof import("./ActivityChart.module.css"),
) {
  const chartPadding =
    root.level === "year"
      ? { x: 16, y: 12 }
      : { x: 0, y: 0 };
  const chartWidth = Math.max(dims.width - chartPadding.x * 2, 0);
  const chartHeight = Math.max(dims.height - chartPadding.y * 2, 0);
  const layout = createTreemapLayout(chartWidth, chartHeight);
  const hierarchy = createHierarchy(root);
  const tree = layout(hierarchy);

  const g = svg
    .append("g")
    .attr("transform", `translate(${chartPadding.x},${chartPadding.y})`);

  const labelPadding = 8;
  const valueOffset = 20;
  const metaOffset = 38;
  const minLabelWidth = 48;
  const minLabelHeight = 34;
  const minValueWidth = 84;
  const minValueHeight = 60;

  const truncateLabel = (label: string, width: number) => {
    if (width <= 0) return "";
    const approxCharWidth = 7;
    const maxChars = Math.max(Math.floor(width / approxCharWidth), 2);
    if (label.length <= maxChars) return label;
    return `${label.slice(0, Math.max(maxChars - 1, 1))}…`;
  };

  const formatLabel = (label: string, width: number) => {
    if (width < 90 && label.includes(" ")) {
      return truncateLabel(label.split(" ")[0], width);
    }
    return truncateLabel(label, width);
  };

  const nodes = g
    .selectAll("g")
    .data(tree.descendants().filter((d) => d.depth === 1))
    .enter()
    .append("g")
    .attr("class", styles.nodeGroup)
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  nodes
    .append("rect")
    .attr("width", (d) => (d.x1 || 0) - (d.x0 || 0))
    .attr("height", (d) => (d.y1 || 0) - (d.y0 || 0))
    .attr("fill", (d) => getNodeColor(d.data, maxValue))
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("class", (d) =>
      d.data.children && d.data.children.length > 0
        ? styles.nodeRect
        : `${styles.nodeRect} ${styles.nodeRectStatic}`,
    )
    .style("cursor", (d) => (d.data.children && d.data.children.length > 0 ? "pointer" : "default"))
    .on("click", (event, d) => {
      if (d.data.children && d.data.children.length > 0) {
        handleNodeClick(d.data);
      }
    })
    .on("mouseenter", (event, d) => showTooltip(event, d.data))
    .on("mouseleave", hideTooltip);

  nodes
    .filter((d) => {
      const width = (d.x1 || 0) - (d.x0 || 0);
      const height = (d.y1 || 0) - (d.y0 || 0);
      return width > minLabelWidth && height > minLabelHeight;
    })
    .append("text")
    .attr("x", labelPadding)
    .attr("y", labelPadding)
    .text((d) => {
      const width = (d.x1 || 0) - (d.x0 || 0);
      return formatLabel(d.data.name, width - labelPadding * 2);
    })
    .attr("class", styles.nodeLabel)
    .attr("dominant-baseline", "hanging")
    .style("pointer-events", "none");

  nodes
    .filter((d) => {
      const width = (d.x1 || 0) - (d.x0 || 0);
      const height = (d.y1 || 0) - (d.y0 || 0);
      return width > minValueWidth && height > minValueHeight;
    })
    .append("text")
    .attr("x", labelPadding)
    .attr("y", labelPadding + valueOffset)
    .text((d) => `${d.data.value.toFixed(1)} km`)
    .attr("class", styles.nodeValue)
    .attr("dominant-baseline", "hanging")
    .style("pointer-events", "none");

  nodes
    .filter((d) => {
      const width = (d.x1 || 0) - (d.x0 || 0);
      const height = (d.y1 || 0) - (d.y0 || 0);
      return (
        width > minValueWidth &&
        height > minValueHeight + 10 &&
        typeof d.data.avgBpm === "number" &&
        d.data.avgBpm > 0
      );
    })
    .append("text")
    .attr("x", labelPadding)
    .attr("y", labelPadding + metaOffset)
    .text((d) => `avg ${Math.round(d.data.avgBpm || 0)} bpm`)
    .attr("class", styles.nodeMeta)
    .attr("dominant-baseline", "hanging")
    .style("pointer-events", "none");
}

// ============================================
//           Main Hook
// ============================================

export const useActivityChart = ({
  activities,
}: UseActivityChartProps): UseActivityChartResult => {
  // Refs
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const transitionRef = useRef<any>(null);

  // State
  const [currentRoot, setCurrentRoot] = useState<HierarchyNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });
  const [isAnimating, setIsAnimating] = useState(false);

  // Build data
  const weeklyData = useMemo(() => buildWeeklyData(activities), [activities]);
  const chartData = useMemo(() => buildChartData(weeklyData), [weeklyData]);
  const hierarchyData = useMemo(
    () => buildHierarchyData(activities),
    [activities],
  );

  // ============================================
  //           Tooltip Handlers
  // ============================================

  const showTooltip = useCallback((event: MouseEvent, node: HierarchyNode) => {
    if (!tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    tooltip.innerHTML = `
      <div class="tooltipTitle">${node.name}</div>
      <div class="tooltipRow">
        <span class="tooltipLabel">Distance:</span>
        <span class="tooltipValue">${node.value.toFixed(1)} km</span>
      </div>
      ${
        node.avgPace
          ? `
      <div class="tooltipRow">
        <span class="tooltipLabel">Avg Pace:</span>
        <span class="tooltipValue">${node.avgPace}</span>
      </div>
      `
          : ""
      }
      ${
        node.avgBpm
          ? `
      <div class="tooltipRow">
        <span class="tooltipLabel">Avg BPM:</span>
        <span class="tooltipValue">${Math.round(node.avgBpm)}</span>
      </div>
      `
          : ""
      }
    `;

    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY - 10}px`;
    tooltip.classList.add("tooltipVisible");
  }, []);

  const hideTooltip = useCallback(() => {
    if (!tooltipRef.current) return;
    tooltipRef.current.classList.remove("tooltipVisible");
  }, []);

  // ============================================
  //           Node Interaction Handlers
  // ============================================

  const handleNodeClick = useCallback((node: HierarchyNode) => {
    if (
      node.level === "week" ||
      !node.children ||
      node.children.length === 0
    ) {
      return;
    }

    setIsAnimating(true);

    const svg = d3Select.select(svgRef.current);

    if (transitionRef.current) {
      transitionRef.current = null;
    }

    const transition = svg
      .selectAll("*")
      .transition()
      .duration(300)
      .style("opacity", 0);

    transitionRef.current = transition;

    transition.on("end", () => {
      if (isMountedRef.current) {
        setCurrentRoot(node);
        setIsAnimating(false);
      }
      transitionRef.current = null;
    });
  }, []);

  const handleBack = useCallback(() => {
    if (!currentRoot?.parent) return;

    setIsAnimating(true);

    const svg = d3Select.select(svgRef.current);

    if (transitionRef.current) {
      transitionRef.current = null;
    }

    const transition = svg
      .selectAll("*")
      .transition()
      .duration(300)
      .style("opacity", 0);

    transitionRef.current = transition;

    transition.on("end", () => {
      if (isMountedRef.current) {
        setCurrentRoot(currentRoot.parent || null);
        setIsAnimating(false);
      }
      transitionRef.current = null;
    });
  }, [currentRoot]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!tooltipRef.current) return;
    const tooltip = tooltipRef.current;
    if (tooltip.classList.contains("tooltipVisible")) {
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY - 10}px`;
    }
  }, []);

  // Month navigation handler
  const handleMonthNavigate = useCallback(
    (direction: "prev" | "next") => {
      if (!hierarchyData || !hierarchyData.children || hierarchyData.children.length === 0) {
        return;
      }

      const months = hierarchyData.children;
      let targetMonth: HierarchyNode | undefined;

      if (!currentRoot || currentRoot.level === "year") {
        // If at year level, navigate to first or last month
        targetMonth = direction === "next" ? months[0] : months[months.length - 1];
      } else if (currentRoot.level === "month") {
        // Find current month index and navigate
        const currentIndex = months.findIndex((m) => m.id === currentRoot.id);
        if (currentIndex !== -1) {
          const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
          if (newIndex >= 0 && newIndex < months.length) {
            targetMonth = months[newIndex];
          }
        }
      } else if (currentRoot.level === "week" && currentRoot.parent) {
        // If at week level, navigate month
        const currentIndex = months.findIndex((m) => m.id === currentRoot.parent!.id);
        if (currentIndex !== -1) {
          const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
          if (newIndex >= 0 && newIndex < months.length) {
            targetMonth = months[newIndex];
          }
        }
      }

      if (targetMonth) {
        setIsAnimating(true);

        const svg = d3Select.select(svgRef.current);

        if (transitionRef.current) {
          transitionRef.current = null;
        }

        const transition = svg
          .selectAll("*")
          .transition()
          .duration(300)
          .style("opacity", 0);

        transitionRef.current = transition;

        transition.on("end", () => {
          if (isMountedRef.current) {
            setCurrentRoot(targetMonth!);
            setIsAnimating(false);
          }
          transitionRef.current = null;
        });
      }
    },
    [hierarchyData, currentRoot]
  );

  // Calculate current month index and total months
  const currentMonthIndex = useMemo(() => {
    if (!hierarchyData || !hierarchyData.children || !currentRoot) {
      return -1;
    }

    if (currentRoot.level === "year") {
      return -1;
    }

    if (currentRoot.level === "month") {
      return hierarchyData.children.findIndex((m) => m.id === currentRoot.id);
    }

    if (currentRoot.level === "week" && currentRoot.parent) {
      return hierarchyData.children.findIndex((m) => m.id === currentRoot.parent!.id);
    }

    return -1;
  }, [hierarchyData, currentRoot]);

  const totalMonths = hierarchyData?.children?.length || 0;

  // ============================================
  //           Effects
  // ============================================

  // Initialize current root when hierarchy data changes
  useEffect(() => {
    if (hierarchyData && hierarchyData.id !== "empty") {
      setCurrentRoot(hierarchyData);
    }
  }, [hierarchyData]);

  // Handle responsive dimensions
  useEffect(() => {
    if (!svgRef.current) return;

    const element = svgRef.current;
    const updateDimensions = () => {
      const { width, height } = element.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      setDimensions({
        width: Math.max(width, 600),
        height: Math.max(height, 300),
      });
    };

    updateDimensions();
    const observer = new ResizeObserver(() => updateDimensions());
    observer.observe(element);
    window.addEventListener("resize", updateDimensions);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Render visualization when dependencies change
  useEffect(() => {
    if (!svgRef.current || !currentRoot) return;

    const svg = d3Select.select(svgRef.current);
    svg.selectAll("*").remove();

    const maxValue = getMaxValue(createHierarchy(currentRoot));

    renderTreemap(
      svg,
      currentRoot,
      dimensions,
      maxValue,
      handleNodeClick,
      showTooltip,
      hideTooltip,
      styles,
    );
  }, [currentRoot, dimensions, handleNodeClick, showTooltip, hideTooltip]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (transitionRef.current) {
        transitionRef.current = null;
      }

      if (svgRef.current) {
        d3Select.select(svgRef.current).selectAll("*").interrupt();
      }
    };
  }, []);

  // Handle mouse move for tooltip positioning
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // ============================================
  //           Return State
  // ============================================

  return {
    chartData,
    hierarchyData,
    state: {
      currentRoot,
      dimensions,
      isAnimating,
      svgRef,
      containerRef,
      tooltipRef,
      handleBack,
      handleMouseMove,
      handleMonthNavigate,
      currentMonthIndex,
      totalMonths,
    },
  };
};
