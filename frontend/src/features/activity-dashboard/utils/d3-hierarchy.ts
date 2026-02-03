import * as d3 from 'd3-hierarchy';
import type { HierarchyNode } from '../components/ActivityChart/ActivityChart.type';

/**
 * Color scale configuration using ActivityCalendar green palette
 * Maps values to colors based on intensity (0-1 ratio)
 */
const COLOR_STOPS = [
  { ratio: 0, color: '#ccf5ee' }, // lightest
  { ratio: 0.16, color: '#c8e6c8' },
  { ratio: 0.32, color: '#a5d6a7' },
  { ratio: 0.48, color: '#81c784' },
  { ratio: 0.64, color: '#66bb6a' },
  { ratio: 0.8, color: '#4caf50' },
  { ratio: 1, color: '#388e3c' } // darkest
];

/**
 * Interpolate between two colors based on a ratio
 */
function interpolateColor(color1: string, color2: string, ratio: number): string {
  // Parse rgba values
  const parseRgba = (color: string) => {
    const trimmed = color.trim();
    const hexMatch = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
      const hex = hexMatch[1].length === 3
        ? hexMatch[1].split("").map((c) => c + c).join("")
        : hexMatch[1];
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1
      };
    }

    const match = trimmed.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
    );
    if (!match) return { r: 0, g: 0, b: 0, a: 1 };
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
      a: match[4] ? parseFloat(match[4]) : 1
    };
  };

  const c1 = parseRgba(color1);
  const c2 = parseRgba(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
  const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
  const b = Math.round(c1.b + (c2.b - c1.b) * ratio);
  const a = c1.a + (c2.a - c1.a) * ratio;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Get color for a value based on its ratio to the maximum value
 * Uses ActivityCalendar green gradient scale
 */
export function getColorForValue(value: number, maxValue: number): string {
  if (maxValue === 0) return COLOR_STOPS[0].color;
  
  const ratio = Math.min(value / maxValue, 1);
  
  // Find the two color stops to interpolate between
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const stop1 = COLOR_STOPS[i];
    const stop2 = COLOR_STOPS[i + 1];
    
    if (ratio >= stop1.ratio && ratio <= stop2.ratio) {
      const localRatio = (ratio - stop1.ratio) / (stop2.ratio - stop1.ratio);
      return interpolateColor(stop1.color, stop2.color, localRatio);
    }
  }
  
  return COLOR_STOPS[COLOR_STOPS.length - 1].color;
}

/**
 * Get color for a hierarchy node
 */
export function getNodeColor(node: HierarchyNode, maxValue: number): string {
  return '#2f6b58';
}

/**
 * Create a D3 treemap layout
 */
export function createTreemapLayout(width: number, height: number) {
  return d3.treemap<HierarchyNode>()
    .size([width, height])
    .paddingOuter(2)
    .paddingTop(0)
    .paddingInner(2)
    .round(true);
}

/**
 * Create a D3 partition layout for sunburst
 */
export function createSunburstLayout(radius: number) {
  return d3.partition<HierarchyNode>()
    .size([2 * Math.PI, radius]);
}

/**
 * Convert hierarchy data to D3 hierarchy structure
 */
export function createHierarchy(data: HierarchyNode): d3.HierarchyNode<HierarchyNode> {
  return d3.hierarchy<HierarchyNode>(data)
    .sum(d => d.value)
    .sort((a, b) => {
      const aOrder = a.data.order;
      const bOrder = b.data.order;
      if (typeof aOrder === "number" && typeof bOrder === "number") {
        return aOrder - bOrder;
      }
      if (typeof aOrder === "number") return -1;
      if (typeof bOrder === "number") return 1;
      return (b.value || 0) - (a.value || 0);
    });
}

/**
 * Calculate the maximum value in a hierarchy tree
 */
export function getMaxValue(node: d3.HierarchyNode<HierarchyNode>): number {
  let max = node.value || 0;

  if (node.children) {
    for (const child of node.children) {
      max = Math.max(max, getMaxValue(child));
    }
  }

  return max;
}

/**
 * Get all leaf nodes from a hierarchy
 */
export function getLeafNodes(node: d3.HierarchyNode<HierarchyNode>): d3.HierarchyNode<HierarchyNode>[] {
  if (!node.children || node.children.length === 0) {
    return [node];
  }
  
  const leaves: d3.HierarchyNode<HierarchyNode>[] = [];
  for (const child of node.children) {
    leaves.push(...getLeafNodes(child));
  }
  return leaves;
}
