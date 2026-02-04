"use client";

import React from "react";
import { useActivities } from "@/features/homepage/hooks";
import styles from "./ActivityHeatmap.module.css";

interface ActivityHeatmapProps {
  selectedYear?: number;
}

export function ActivityHeatmap({ selectedYear }: ActivityHeatmapProps) {
  const { heatmapData } = useActivities(selectedYear);

  const cellClasses = [
    styles.cellLevel0,
    styles.cellLevel1,
    styles.cellLevel2,
    styles.cellLevel3,
  ];

  return (
    <div className={styles.heatmapContainer}>
      <div className={styles.heatmapHeader}>
        <h3 className={styles.title}>
          <span className={`material-symbols-outlined ${styles.titleIcon}`}>
            grid_view
          </span>
          活动热力图
        </h3>
        <div className={styles.legend}>
          <span className={styles.legendLabel}>少</span>
          <div className={styles.legendCells}>
            <div className={styles.legendCell0} />
            <div className={styles.legendCell1} />
            <div className={styles.legendCell2} />
            <div className={styles.legendCell3} />
          </div>
          <span className={styles.legendLabel}>多</span>
        </div>
      </div>
      <div className={styles.grid}>
        {heatmapData.map((week, weekIndex) =>
          week.map((level, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`${styles.cell} ${cellClasses[level]}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
