import React, { useMemo } from "react";
import { useActivityChart } from "./ActivityChart.hook";
import type { ActivityChartProps } from "./ActivityChart.type";
import styles from "./ActivityChart.module.css";

export function ActivityChart({ activities }: ActivityChartProps) {
  const { chartData } = useActivityChart({ activities });

  const chartDimensions = useMemo(() => {
    const chartWidth = Math.max(800, chartData.length * 60 + 100); // Dynamic width based on data
    const chartHeight = 800;
    const padding = { top: 40, right: 40, bottom: 60, left: 80 };
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;

    const dimensions = {
      chartWidth,
      chartHeight,
      padding,
      plotWidth,
      plotHeight,
    };

    return dimensions;
  }, [chartData.length]);

  const heartRatePoints = useMemo(() => {
    const dataWithValues = chartData.filter((item) => item.hasData);

    if (dataWithValues.length === 0) {
      return "";
    }

    const points = dataWithValues
      .map((item, index) => {
        const x =
          chartDimensions.padding.left +
          index *
            (chartDimensions.plotWidth / (dataWithValues.length - 1 || 1));
        // Fix Y coordinate calculation - ensure it stays within chart bounds
        const hrAreaHeight = chartDimensions.plotHeight * 0.25; // Heart rate area is 25% of plot height
        const hrAreaTop =
          chartDimensions.padding.top + chartDimensions.plotHeight * 0.1; // Start heart rate area at 10% from top
        const y = hrAreaTop + (item.hrPercent * hrAreaHeight) / 100; // Scale properly within bounds

        return `${x},${y}`;
      })
      .join(" ");

    return points;
  }, [chartData, chartDimensions]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.button}>Pace</div>
        <div className={styles.button}>Avg Heart Rate</div>
      </div>
      <div className={styles.chartArea}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${chartDimensions.chartWidth} ${chartDimensions.chartHeight}`}
          preserveAspectRatio="xMinYMin meet"
        >
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 5 }, (_, i) => {
            const y =
              chartDimensions.padding.top +
              (i * chartDimensions.plotHeight) / 4;
            return (
              <line
                key={`grid-${i}`}
                x1={chartDimensions.padding.left}
                y1={y}
                x2={chartDimensions.chartWidth - chartDimensions.padding.right}
                y2={y}
                className={styles.gridLine}
              />
            );
          })}

          {/* Pace Bars (horizontal bars from bottom) */}
          {chartData.map((item, index) => {
            const x =
              chartDimensions.padding.left +
              index * (chartDimensions.plotWidth / (chartData.length - 1 || 1));
            const barHeight = item.hasData
              ? item.pacePercent * chartDimensions.plotHeight * 0.4
              : 0;
            const barY =
              chartDimensions.padding.top +
              chartDimensions.plotHeight -
              barHeight -
              20; // Bottom area for pace

            return (
              <g key={`pace-${item.id}`}>
                {item.hasData ? (
                  <>
                    <rect
                      x={x - 2} // Center on week position with narrow bar
                      y={barY}
                      width="10" // Narrow bar width
                      height={barHeight}
                      rx="2"
                      className={styles.bar}
                      fill="url(#barGradient)"
                    />
                    <text
                      x={x}
                      y={barY - 5}
                      textAnchor="middle"
                      className={styles.paceValue}
                    >
                      {item.paceValue}
                    </text>
                  </>
                ) : (
                  <>
                    {/* Empty week - show minimal indicator */}
                    <rect
                      x={x - 1}
                      y={barY}
                      width="2"
                      height="2"
                      rx="1"
                      className={styles.emptyWeekIndicator}
                    />
                    <text
                      x={x}
                      y={barY - 10}
                      textAnchor="middle"
                      className={styles.emptyWeekLabel}
                    >
                      -
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Heart Rate Line */}
          {heartRatePoints && heartRatePoints.trim() && (
            <polyline
              points={heartRatePoints}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.hrLine}
            />
          )}

          {/* Heart Rate Points & Values */}
          {(() => {
            const dataWithValues = chartData.filter((item) => item.hasData);
            return dataWithValues.map((item, index) => {
              const x =
                chartDimensions.padding.left +
                index *
                  (chartDimensions.plotWidth /
                    (dataWithValues.length - 1 || 1));
              // Apply same fixed Y coordinate calculation
              const hrAreaHeight = chartDimensions.plotHeight * 0.25;
              const hrAreaTop =
                chartDimensions.padding.top + chartDimensions.plotHeight * 0.1;
              const y = hrAreaTop + (item.hrPercent * hrAreaHeight) / 100;

              return (
                <g key={`hr-${item.id}`}>
                  <circle cx={x} cy={y} r="4" className={styles.hrPoint} />
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    className={styles.hrValue}
                  >
                    {item.bpmValue}
                  </text>
                </g>
              );
            });
          })()}

          {/* Week Labels */}
          {chartData.map((item, index) => {
            const x =
              chartDimensions.padding.left +
              index * (chartDimensions.plotWidth / (chartData.length - 1 || 1));
            const y =
              chartDimensions.chartHeight - chartDimensions.padding.bottom + 20;

            return (
              <text
                key={`label-${item.id}`}
                x={x}
                y={y}
                textAnchor="middle"
                className={`${styles.weekLabel} ${!item.hasData ? styles.noData : ""}`}
              >
                W{item.weekNumber}
              </text>
            );
          })}

          {/* Y-axis labels */}
          <text
            x={chartDimensions.padding.left - 10}
            y={chartDimensions.padding.top + chartDimensions.plotHeight * 0.8}
            textAnchor="end"
            className={styles.axisLabel}
          >
            Pace
          </text>
          <text
            x={chartDimensions.padding.left - 10}
            y={chartDimensions.padding.top + chartDimensions.plotHeight * 0.3}
            textAnchor="end"
            className={styles.axisLabel}
          >
            Heart Rate
          </text>
        </svg>
      </div>
    </div>
  );
}
