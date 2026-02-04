"use client";

import React from "react";
import { useActivities } from "@/features/homepage/hooks";
import styles from "./QuickStats.module.css";

interface QuickStatsProps {
  selectedYear?: number;
}

export function QuickStats({ selectedYear }: QuickStatsProps) {
  const { totalRuns, totalDistance, activeDays } = useActivities(selectedYear);

  const stats = [
    { value: String(totalRuns), label: "跑步次数" },
    { value: `${totalDistance.toFixed(1)}km`, label: "总公里数" },
    { value: String(activeDays), label: "活跃天数" },
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.statCard}>
          <p className={styles.statValue}>{stat.value}</p>
          <p className={styles.statLabel}>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
