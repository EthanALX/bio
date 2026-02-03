"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3-hierarchy";
import * as d3Select from "d3-selection";
import * as d3Transition from "d3-transition";
import * as d3Shape from "d3-shape";
import * as d3Ease from "d3-ease";
import { useActivityChart } from "./ActivityChart.hook";
import type { ActivityChartProps, HierarchyNode, ChartViewMode } from "./ActivityChart.type";
import styles from "./ActivityChart.module.css";
import {
  createHierarchy,
  createTreemapLayout,
  createSunburstLayout,
  getNodeColor,
  getMaxValue,
} from "../../utils/d3-hierarchy";

export function ActivityChart({ activities }: ActivityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const transitionRef = useRef<any>(null);

  const [viewMode, setViewMode] = useState<ChartViewMode>("treemap");
  const [currentRoot, setCurrentRoot] = useState<HierarchyNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });
  const [isAnimating, setIsAnimating] = useState(false);

  const { hierarchyData } = useActivityChart({ activities });

  // Show tooltip
  const showTooltip = useCallback((
    event: MouseEvent,
    node: HierarchyNode
  ) => {
    if (!tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    tooltip.innerHTML = `
      <div class="${styles.tooltipTitle}">${node.name}</div>
      <div class="${styles.tooltipRow}">
        <span class="${styles.tooltipLabel}">Distance:</span>
        <span class="${styles.tooltipValue}">${node.value.toFixed(1)} km</span>
      </div>
      <div class="${styles.tooltipRow}">
        <span class="${styles.tooltipLabel}">Activities:</span>
        <span class="${styles.tooltipValue}">${node.count}</span>
      </div>
      ${node.avgPace ? `
      <div class="${styles.tooltipRow}">
        <span class="${styles.tooltipLabel}">Avg Pace:</span>
        <span class="${styles.tooltipValue}">${node.avgPace}</span>
      </div>
      ` : ""}
    `;

    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY - 10}px`;
    tooltip.classList.add(styles.tooltipVisible);
  }, []);

  // Hide tooltip
  const hideTooltip = useCallback(() => {
    if (!tooltipRef.current) return;
    tooltipRef.current.classList.remove(styles.tooltipVisible);
  }, []);

  // Handle node click for drill-down
  const handleNodeClick = useCallback((node: HierarchyNode) => {
    if (node.level === "month" || !node.children || node.children.length === 0) {
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

  // Handle back navigation
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

  // Handle view mode change with animation
  const handleViewChange = useCallback((newMode: ChartViewMode) => {
    if (newMode === viewMode || isAnimating) return;

    setIsAnimating(true);

    const svg = d3Select.select(svgRef.current);

    if (transitionRef.current) {
      transitionRef.current = null;
    }

    const transition = svg
      .selectAll("*")
      .transition()
      .duration(400)
      .ease(d3Ease.easeCubicIn)
      .style("opacity", 0)
      .attr("transform", "scale(0.8)");

    transitionRef.current = transition;

    transition.on("end", () => {
      if (isMountedRef.current) {
        setViewMode(newMode);
        setIsAnimating(false);
      }
      transitionRef.current = null;
    });
  }, [viewMode, isAnimating]);

  // Render treemap visualization
  const renderTreemap = useCallback((
    svg: d3Select.Selection<SVGSVGElement, unknown, null, undefined>,
    root: HierarchyNode,
    dims: { width: number; height: number },
    maxValue: number
  ) => {
    const layout = createTreemapLayout(dims.width, dims.height);
    const hierarchy = createHierarchy(root);
    const tree = layout(hierarchy);

    const g = svg.append("g");

    const nodes = g
      .selectAll("g")
      .data(tree.descendants().filter((d) => d.depth === 1 || d.depth === 2))
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    nodes
      .append("rect")
      .attr("width", (d) => (d.x1 || 0) - (d.x0 || 0))
      .attr("height", (d) => (d.y1 || 0) - (d.y0 || 0))
      .attr("fill", (d) => getNodeColor(d.data, maxValue))
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", styles.node)
      .style("cursor", "pointer")
      .on("click", (event, d) => handleNodeClick(d.data))
      .on("mouseenter", (event, d) => showTooltip(event, d.data))
      .on("mouseleave", hideTooltip);

    nodes
      .filter((d) => {
        const width = (d.x1 || 0) - (d.x0 || 0);
        const height = (d.y1 || 0) - (d.y0 || 0);
        return width > 60 && height > 40;
      })
      .append("text")
      .attr("x", 8)
      .attr("y", 20)
      .text((d) => d.data.name)
      .attr("fill", "#e2e8f0")
      .attr("fontSize", "12px")
      .attr("fontFamily", "var(--font-space-mono)")
      .style("pointer-events", "none");

    nodes
      .filter((d) => {
        const width = (d.x1 || 0) - (d.x0 || 0);
        const height = (d.y1 || 0) - (d.y0 || 0);
        return width > 80 && height > 60;
      })
      .append("text")
      .attr("x", 8)
      .attr("y", 36)
      .text((d) => `${d.data.value.toFixed(1)} km`)
      .attr("fill", "#94a3b8")
      .attr("fontSize", "10px")
      .attr("fontFamily", "var(--font-space-mono)")
      .style("pointer-events", "none");
  }, [handleNodeClick, showTooltip, hideTooltip]);

  // Render sunburst visualization
  const renderSunburst = useCallback((
    svg: d3Select.Selection<SVGSVGElement, unknown, null, undefined>,
    root: HierarchyNode,
    dims: { width: number; height: number },
    maxValue: number
  ) => {
    const radius = Math.min(dims.width, dims.height) / 2 - 20;
    const innerRadius = 50;

    const layout = createSunburstLayout(radius);
    const hierarchy = createHierarchy(root);
    const tree = layout(hierarchy);

    const g = svg
      .append("g")
      .attr("transform", `translate(${dims.width / 2},${dims.height / 2})`);

    const arc = d3Shape
      .arc<d3.HierarchyRectangularNode<HierarchyNode>>()
      .startAngle((d: d3.HierarchyRectangularNode<HierarchyNode>) => d.x0 || 0)
      .endAngle((d: d3.HierarchyRectangularNode<HierarchyNode>) => d.x1 || 0)
      .padAngle(0.005)
      .padRadius(radius / 2)
      .innerRadius((d: d3.HierarchyRectangularNode<HierarchyNode>) => innerRadius + (d.y0 || 0))
      .outerRadius((d: d3.HierarchyRectangularNode<HierarchyNode>) => innerRadius + (d.y1 || 0) - 1);

    g.selectAll("path")
      .data(tree.descendants().filter((d) => d.depth > 0))
      .enter()
      .append("path")
      .attr("d", arc as any)
      .attr("fill", (d) => getNodeColor(d.data, maxValue))
      .attr("class", styles.node)
      .style("cursor", "pointer")
      .on("click", (event, d) => handleNodeClick(d.data))
      .on("mouseenter", (event, d) => showTooltip(event, d.data))
      .on("mouseleave", hideTooltip);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text(root.name)
      .attr("fill", "#e2e8f0")
      .attr("fontSize", "16px")
      .attr("fontFamily", "var(--font-space-mono)")
      .style("font-weight", "600");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .text(`${root.value.toFixed(1)} km`)
      .attr("fill", "#94a3b8")
      .attr("fontSize", "12px")
      .attr("fontFamily", "var(--font-space-mono)");
  }, [handleNodeClick, showTooltip, hideTooltip]);

  // Initialize current root when hierarchy data changes
  useEffect(() => {
    if (hierarchyData && hierarchyData.id !== "empty") {
      setCurrentRoot(hierarchyData);
    }
  }, [hierarchyData]);

  // Handle responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(width, 600), height: 450 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Render visualization when dependencies change
  useEffect(() => {
    if (!svgRef.current || !currentRoot) return;

    const svg = d3Select.select(svgRef.current);
    svg.selectAll("*").remove();

    const maxValue = getMaxValue(createHierarchy(currentRoot));

    if (viewMode === "treemap") {
      renderTreemap(svg, currentRoot, dimensions, maxValue);
    } else {
      renderSunburst(svg, currentRoot, dimensions, maxValue);
    }
  }, [currentRoot, viewMode, dimensions, renderTreemap, renderSunburst]);

  // Cleanup on unmount - cancel transitions and mark as unmounted
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
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!tooltipRef.current) return;
    const tooltip = tooltipRef.current;
    if (tooltip.classList.contains(styles.tooltipVisible)) {
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY - 10}px`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  if (!currentRoot || currentRoot.id === "empty") {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>No activity data available</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.breadcrumb}>
          {currentRoot.level !== "year" && currentRoot.parent && (
            <button
              className={styles.backButton}
              onClick={handleBack}
              disabled={isAnimating}
            >
              ← Back
            </button>
          )}
          <span className={styles.currentLevel}>{currentRoot.name}</span>
        </div>

        <div className={styles.viewToggle}>
          <button
            className={viewMode === "treemap" ? styles.active : ""}
            onClick={() => handleViewChange("treemap")}
            disabled={isAnimating}
          >
            Treemap
          </button>
          <button
            className={viewMode === "sunburst" ? styles.active : ""}
            onClick={() => handleViewChange("sunburst")}
            disabled={isAnimating}
          >
            Sunburst
          </button>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className={styles.svg}
        style={{ opacity: isAnimating ? 0.5 : 1 }}
      />

      <div ref={tooltipRef} className={styles.tooltip} />
    </div>
  );
}
