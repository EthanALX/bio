"use client";

import React from "react";
import { usePersonalBests } from "./PersonalBests.hook";
import type { PersonalBestsProps } from "./PersonalBests.type";
import styles from "./PersonalBests.module.css";

export function PersonalBests(props: PersonalBestsProps) {
  const { data } = usePersonalBests(props);
  const { pbs } = data;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={`material-symbols-outlined ${styles.headerIcon}`}>
          {/*trophy*/}
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
