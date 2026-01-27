import React, { useMemo, useState } from "react";
import { Activity } from "../../types";
import { usePaceDistribution } from "./PaceDistribution.hook";
import styles from "./PaceDistribution.module.css";

interface PaceDistributionProps {
  activities: Activity[];
}

type ChartMode = "distribution" | "trend";

export function PaceDistribution({ activities }: PaceDistributionProps) {
  const [chartMode, setChartMode] = useState<ChartMode>("trend");
  const { paceRanges, paceStats, avgPaceSeconds, timeSeriesData, monthlyData } =
    usePaceDistribution({
      activities,
    });

  const chartDimensions = useMemo(() => {
    // Use monthly data for trend chart to reduce density
    const dataLength = chartMode === "trend" ? monthlyData.length : paceRanges.length;
    const chartWidth = Math.max(1200, dataLength * 60 + 300);
    const chartHeight = 600;
    const padding = { top: 60, right: 80, bottom: 100, left: 80 };
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;

    return {
      chartWidth,
      chartHeight,
      padding,
      plotWidth,
      plotHeight,
    };
  }, [chartMode, monthlyData.length, paceRanges.length]);

  // Find max count for scaling
  const maxCount = useMemo(() => {
    return Math.max(...paceRanges.map((r) => r.count), 1);
  }, [paceRanges]);

  // Calculate bar width
  const barWidth = useMemo(() => {
    return (
      (chartDimensions.plotWidth - (paceRanges.length - 1) * 30) /
      paceRanges.length
    );
  }, [chartDimensions.plotWidth, paceRanges.length]);

  // Find which range contains the average pace
  const avgPaceRangeIndex = useMemo(() => {
    return paceRanges.findIndex(
      (range) =>
        avgPaceSeconds >= range.minSeconds && avgPaceSeconds < range.maxSeconds
    );
  }, [paceRanges, avgPaceSeconds]);

  // Calculate trend line data using monthly aggregated data
  const trendLineData = useMemo(() => {
    if (monthlyData.length === 0) return { points: "", minPace: 0, maxPace: 0 };

    const paceValues = monthlyData.map((d) => d.avgPaceSeconds);
    const minPace = Math.min(...paceValues);
    const maxPace = Math.max(...paceValues);
    const paceRange = maxPace - minPace || 1;

    const points = monthlyData
      .map((dataPoint, index) => {
        const x =
          chartDimensions.padding.left +
          (index / (monthlyData.length - 1 || 1)) *
            chartDimensions.plotWidth;
        // 配速越小（越快）越高，所以用 (avgPaceSeconds - minPace) 而不是 (maxPace - avgPaceSeconds)
        const normalizedPace = (dataPoint.avgPaceSeconds - minPace) / paceRange;
        const y =
          chartDimensions.padding.top +
          normalizedPace * chartDimensions.plotHeight;
        return `${x},${y}`;
      })
      .join(" ");

    return { points, minPace, maxPace };
  }, [monthlyData, chartDimensions]);

  if (paceStats.totalActivities === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>暂无配速数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>配速分布</h2>
          <div className={styles.toggleButtons}>
            <button
              className={`${styles.toggleButton} ${
                chartMode === "trend" ? styles.active : ""
              }`}
              onClick={() => setChartMode("trend")}
            >
              趋势图
            </button>
            <button
              className={`${styles.toggleButton} ${
                chartMode === "distribution" ? styles.active : ""
              }`}
              onClick={() => setChartMode("distribution")}
            >
              分布图
            </button>
          </div>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>最快配速</span>
            <span className={styles.statValue}>{paceStats.fastest}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>平均配速</span>
            <span className={`${styles.statValue} ${styles.highlight}`}>
              {paceStats.average}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>最慢配速</span>
            <span className={styles.statValue}>{paceStats.slowest}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>总活动数</span>
            <span className={styles.statValue}>
              {paceStats.totalActivities}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.chartArea}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${chartDimensions.chartWidth} ${chartDimensions.chartHeight}`}
          preserveAspectRatio="xMinYMin meet"
        >
          <defs>
            {/* 普通柱状图 - 简化渐变 */}
            <linearGradient
              id="barGradientPace"
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(14, 165, 233, 0.4)" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0.7)" />
            </linearGradient>

            {/* 平均配速区间 - 简化渐变 */}
            <linearGradient
              id="barGradientAvg"
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(14, 165, 233, 0.5)" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0.85)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 6 }, (_, i) => {
            const y =
              chartDimensions.padding.top +
              (i * chartDimensions.plotHeight) / 5;

            // Different labels for different chart modes
            let value: string;
            if (chartMode === "trend") {
              const paceRange = trendLineData.maxPace - trendLineData.minPace || 1;
              // 从上到下：最快配速到最慢配速
              const paceSeconds = trendLineData.minPace + (i * paceRange) / 5;
              const minutes = Math.floor(paceSeconds / 60);
              const seconds = Math.floor(paceSeconds % 60);
              value = `${minutes}'${seconds.toString().padStart(2, "0")}"`;
            } else {
              value = Math.round(maxCount - (i * maxCount) / 5).toString();
            }

            return (
              <g key={`grid-${i}`}>
                <line
                  x1={chartDimensions.padding.left}
                  y1={y}
                  x2={
                    chartDimensions.chartWidth - chartDimensions.padding.right
                  }
                  y2={y}
                  className={styles.gridLine}
                />
                <text
                  x={chartDimensions.padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className={styles.axisLabel}
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Trend Line Chart */}
          {chartMode === "trend" && trendLineData.points && (
            <>
              {/* Area under the line */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(14, 165, 233, 0.25)" />
                  <stop offset="100%" stopColor="rgba(14, 165, 233, 0.03)" />
                </linearGradient>
              </defs>

              <polygon
                points={`${chartDimensions.padding.left},${chartDimensions.padding.top + chartDimensions.plotHeight} ${trendLineData.points} ${chartDimensions.padding.left + chartDimensions.plotWidth},${chartDimensions.padding.top + chartDimensions.plotHeight}`}
                fill="url(#areaGradient)"
                opacity="0.6"
              />

              {/* Main trend line */}
              <polyline
                points={trendLineData.points}
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />

              {/* Data points - monthly aggregated */}
              {monthlyData.map((dataPoint, index) => {
                const x =
                  chartDimensions.padding.left +
                  (index / (monthlyData.length - 1 || 1)) *
                    chartDimensions.plotWidth;
                const paceRange = trendLineData.maxPace - trendLineData.minPace || 1;
                const normalizedPace = (dataPoint.avgPaceSeconds - trendLineData.minPace) / paceRange;
                const y =
                  chartDimensions.padding.top +
                  normalizedPace * chartDimensions.plotHeight;

                return (
                  <g key={`point-${index}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#0ea5e9"
                      className={styles.trendPoint}
                    />
                    <title>
                      {`${dataPoint.monthLabel}\n平均配速: ${dataPoint.avgPaceString}\n活动数: ${dataPoint.activityCount}`}
                    </title>
                    {/* Month label on X-axis */}
                    <text
                      x={x}
                      y={chartDimensions.chartHeight - chartDimensions.padding.bottom + 20}
                      textAnchor="middle"
                      className={styles.barLabel}
                      transform={`rotate(-45, ${x}, ${chartDimensions.chartHeight - chartDimensions.padding.bottom + 20})`}
                    >
                      {dataPoint.monthLabel}
                    </text>
                  </g>
                );
              })}

              {/* Average pace line */}
              {avgPaceSeconds > 0 && (
                <>
                  <line
                    x1={chartDimensions.padding.left}
                    y1={
                      chartDimensions.padding.top +
                      ((avgPaceSeconds - trendLineData.minPace) /
                        (trendLineData.maxPace - trendLineData.minPace || 1)) *
                        chartDimensions.plotHeight
                    }
                    x2={chartDimensions.chartWidth - chartDimensions.padding.right}
                    y2={
                      chartDimensions.padding.top +
                      ((avgPaceSeconds - trendLineData.minPace) /
                        (trendLineData.maxPace - trendLineData.minPace || 1)) *
                        chartDimensions.plotHeight
                    }
                    className={styles.avgLine}
                  />
                  <text
                    x={chartDimensions.chartWidth - chartDimensions.padding.right + 10}
                    y={
                      chartDimensions.padding.top +
                      ((avgPaceSeconds - trendLineData.minPace) /
                        (trendLineData.maxPace - trendLineData.minPace || 1)) *
                        chartDimensions.plotHeight +
                      5
                    }
                    className={styles.avgLabel}
                  >
                    平均
                  </text>
                </>
              )}
            </>
          )}

          {/* Distribution Bars */}
          {chartMode === "distribution" && paceRanges.map((range, index) => {
            const x =
              chartDimensions.padding.left + index * (barWidth + 30);
            const barHeight =
              (range.count / maxCount) * chartDimensions.plotHeight;
            const barY =
              chartDimensions.padding.top +
              chartDimensions.plotHeight -
              barHeight;
            const isAvgRange = index === avgPaceRangeIndex;

            return (
              <g key={range.id}>
                {/* Bar */}
                <rect
                  x={x}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx="6"
                  className={styles.bar}
                  fill={
                    isAvgRange
                      ? "url(#barGradientAvg)"
                      : "url(#barGradientPace)"
                  }
                  opacity={isAvgRange ? 0.9 : 0.7}
                />

                {/* Count value on top of bar */}
                {range.count > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={Math.max(barY - 8, chartDimensions.padding.top + 35)}
                    textAnchor="middle"
                    className={styles.barValue}
                  >
                    {range.count}
                  </text>
                )}

                {/* Percentage below count */}
                {range.count > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={Math.max(barY - 24, chartDimensions.padding.top + 20)}
                    textAnchor="middle"
                    className={styles.barLabel}
                  >
                    {range.percentage.toFixed(1)}%
                  </text>
                )}

                {/* Average pace indicator */}
                {isAvgRange && (
                  <>
                    <circle
                      cx={x + barWidth / 2}
                      cy={Math.max(barY - 35, chartDimensions.padding.top + 15)}
                      r="4"
                      className={styles.avgMarker}
                    />
                    <text
                      x={x + barWidth / 2}
                      y={Math.max(barY - 45, chartDimensions.padding.top + 5)}
                      textAnchor="middle"
                      className={styles.avgLabel}
                    >
                      平均
                    </text>
                  </>
                )}

                {/* X-axis label (pace range) */}
                <text
                  x={x + barWidth / 2}
                  y={
                    chartDimensions.chartHeight -
                    chartDimensions.padding.bottom +
                    20
                  }
                  textAnchor="middle"
                  className={styles.barLabel}
                  transform={`rotate(-45, ${x + barWidth / 2}, ${
                    chartDimensions.chartHeight -
                    chartDimensions.padding.bottom +
                    20
                  })`}
                >
                  {range.label}
                </text>
              </g>
            );
          })}

          {/* Y-axis label */}
          <text
            x={chartDimensions.padding.left - 40}
            y={chartDimensions.padding.top + chartDimensions.plotHeight / 2}
            textAnchor="middle"
            className={styles.axisLabel}
            transform={`rotate(-90, ${chartDimensions.padding.left - 40}, ${
              chartDimensions.padding.top + chartDimensions.plotHeight / 2
            })`}
          >
            {chartMode === "trend" ? "配速" : "活动次数"}
          </text>

          {/* X-axis label */}
          <text
            x={chartDimensions.chartWidth / 2}
            y={chartDimensions.chartHeight - 15}
            textAnchor="middle"
            className={styles.axisLabel}
          >
            {chartMode === "trend" ? "月份" : "配速区间（每公里）"}
          </text>
        </svg>
      </div>
    </div>
  );
}
