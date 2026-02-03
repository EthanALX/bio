import React from "react";
import { useActivityChart } from "./ActivityChart.hook";
import type { ActivityChartProps } from "./ActivityChart.type";
import styles from "./ActivityChart.module.css";

const MONTH_NAMES = [
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
            {MONTH_NAMES[currentMonthIndex % 12]}
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
