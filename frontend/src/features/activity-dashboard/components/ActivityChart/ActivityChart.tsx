import React from "react";
import { useActivityChart } from "./ActivityChart.hook";
import type { ActivityChartProps } from "./ActivityChart.type";
import styles from "./ActivityChart.module.css";

export function ActivityChart({ activities }: ActivityChartProps) {
  const { state } = useActivityChart({ activities });
  const {
    currentRoot,
    dimensions,
    isAnimating,
    svgRef,
    containerRef,
    tooltipRef,
    handleBack,
    handleMonthNavigate,
    currentMonthIndex,
    totalMonths,
  } = state;

  if (!currentRoot || currentRoot.id === "empty") {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>No activity data available</div>
      </div>
    );
  }

  const showMonthNav = currentRoot.level === "month" || currentRoot.level === "week";
  const showWeekBack = currentRoot.level === "month";
  const currentMonthLabel =
    currentRoot.level === "month"
      ? currentRoot.name
      : currentRoot.level === "week" && currentRoot.parent
        ? currentRoot.parent.name
        : "";
  const currentYearLabel =
    currentRoot.level === "year"
      ? currentRoot.name
      : currentRoot.level === "month" && currentRoot.parent
        ? currentRoot.parent.name
        : currentRoot.level === "week" && currentRoot.parent?.parent
          ? currentRoot.parent.parent.name
          : "";

  return (
    <div ref={containerRef} className={styles.container}>
      {showWeekBack && (
        <div className={styles.weekHeader}>
          <button
            className={styles.weekBack}
            onClick={handleBack}
            disabled={isAnimating}
            title="Back to months"
          >
            ← {currentMonthLabel}
          </button>
        </div>
      )}

      <div className={styles.chartStage}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="none"
          className={styles.svg}
          style={{ opacity: isAnimating ? 0.5 : 1 }}
        />
      </div>

      {showMonthNav && currentMonthIndex >= 0 && (
        <div className={styles.monthNav}>
          <button
            className={styles.monthNavButton}
            onClick={() => handleMonthNavigate("prev")}
            disabled={isAnimating || currentMonthIndex === 0}
            title="Previous month"
          >
            ‹
          </button>
          <span className={styles.monthIndicator}>
            {currentYearLabel}
          </span>
          <button
            className={styles.monthNavButton}
            onClick={() => handleMonthNavigate("next")}
            disabled={isAnimating || currentMonthIndex === totalMonths - 1}
            title="Next month"
          >
            ›
          </button>
        </div>
      )}

      <div ref={tooltipRef} className={styles.tooltip} />
    </div>
  );
}
