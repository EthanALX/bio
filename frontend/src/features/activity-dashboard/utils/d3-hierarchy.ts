import * as d3 from 'd3-hierarchy';
import type { HierarchyNode } from '../components/ActivityChart/ActivityChart.type';

/**
 * Color scale configuration using Indigo-Purple gradient
 * Maps values to colors based on intensity (0-1 ratio)
 */
const COLOR_STOPS = [
  { ratio: 0, color: 'rgba(99, 102, 241, 0.2)' },      // Low intensity - light indigo
  { ratio: 0.25, color: 'rgba(99, 102, 241, 0.4)' },   // Low-medium intensity
  { ratio: 0.5, color: 'rgba(129, 140, 248, 0.6)' },   // Medium intensity
  { ratio: 0.75, color: 'rgba(167, 139, 250, 0.8)' },  // Medium-high intensity
  { ratio: 1, color: 'rgba(168, 85, 247, 1)' }         // High intensity - purple
];

/**
 * Interpolate between two colors based on a ratio
 */
function interpolateColor(color1: string, color2: string, ratio: number): string {
  // Parse rgba values
  const parseRgba = (color: string) => {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return { r: 0, g: 0, b: 0, a: 1 };
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
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
 * Uses Indigo-Purple gradient scale
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
  return getColorForValue(node.value, maxValue);
}

/**
 * Create a D3 treemap layout
 */
export function createTreemapLayout(width: number, height: number) {
  return d3.treemap<HierarchyNode>()
    .size([width, height])
    .paddingOuter(4)
    .paddingTop(20)
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
    .sort((a, b) => (b.value || 0) - (a.value || 0));
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
