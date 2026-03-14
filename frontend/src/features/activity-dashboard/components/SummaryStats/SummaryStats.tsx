import React from "react";
import { useSummaryStats } from "./SummaryStats.hook";
import type { SummaryStatsProps } from "./SummaryStats.type";
import styles from "./SummaryStats.module.css";

export function SummaryStats({
  stats,
  globalStats,
  year,
  isLoading,
}: SummaryStatsProps) {
  const { state } = useSummaryStats({ stats, globalStats, year });
  const { sections } = state;

  return (
    <div className={`${styles.card} ${isLoading ? styles.loading : ""}`}>
      {sections.map((section, index) => (
        <section
          key={section.id}
          className={`${styles.section} ${index > 0 ? styles.sectionSplit : ""}`}
          data-variant={section.variant ?? "default"}
        >
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
          </div>
          <div className={styles.sectionGrid}>
            {section.items.map((item) => (
              <div key={item.label} className={styles.statItem}>
                <span className={styles.value}>{item.value}</span>
                <span className={styles.label}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
