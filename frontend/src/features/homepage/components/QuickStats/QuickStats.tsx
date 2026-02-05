"use client";

import React from "react";
import { useQuickStats } from "./QuickStats.hook";
import type { QuickStatsProps } from "./QuickStats.type";
import styles from "./QuickStats.module.css";

export function QuickStats(props: QuickStatsProps) {
  const { data } = useQuickStats(props);
  const { stats } = data;

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
