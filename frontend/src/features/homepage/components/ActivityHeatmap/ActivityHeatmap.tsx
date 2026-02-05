"use client";

import React from "react";
import { useActivityHeatmap } from "./ActivityHeatmap.hook";
import type { ActivityHeatmapProps } from "./ActivityHeatmap.type";
import styles from "./ActivityHeatmap.module.css";

export function ActivityHeatmap(props: ActivityHeatmapProps) {
  const { data } = useActivityHeatmap(props);
  const { heatmapData } = data;

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
          {/*活动热力图*/}
        </h3>
        <div className={styles.legend}>
          {/*<span className={styles.legendLabel}>less</span>*/}
          <div className={styles.legendCells}>
            <div className={styles.legendCell0} />
            <div className={styles.legendCell1} />
            <div className={styles.legendCell2} />
            <div className={styles.legendCell3} />
          </div>
          {/*<span className={styles.legendLabel}>more</span>*/}
        </div>
      </div>
      <div className={styles.grid}>
        {heatmapData.map((week, weekIndex) =>
          week.map((level, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`${styles.cell} ${cellClasses[level]}`}
            />
          )),
        )}
      </div>
    </div>
  );
}
