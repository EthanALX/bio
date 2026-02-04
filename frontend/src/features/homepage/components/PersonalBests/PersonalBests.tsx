"use client";

import React from "react";
import { useActivities } from "@/features/homepage/hooks";
import styles from "./PersonalBests.module.css";

interface PersonalBestsProps {
  selectedYear?: number;
}

export function PersonalBests({ selectedYear }: PersonalBestsProps) {
  const { personalBests } = useActivities(selectedYear);

  const pbs = [
    { event: "5K", time: personalBests.best5k || "--:--" },
    { event: "10K", time: personalBests.best10k || "--:--" },
    { event: "Half", time: personalBests.bestHalf || "--:--" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={`material-symbols-outlined ${styles.headerIcon}`}>
          trophy
        </span>
        <h3 className={styles.title}>个人最佳</h3>
      </div>
      <div className={styles.pbsGrid}>
        {pbs.map((pb) => (
          <div key={pb.event} className={styles.pbCard}>
            <p className={styles.pbLabel}>{pb.event}</p>
            <p className={styles.pbValue}>{pb.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
