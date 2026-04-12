import React from "react";
import { Icon } from "@/components/Icon";
import { useSummaryStats } from "./SummaryStats.hook";
import type { SummaryStatsProps } from "./SummaryStats.type";
import styles from "./SummaryStats.module.css";

const SECTION_ICONS: Record<string, string> = {
  total: "monitoring",
  personal: "emoji_events",
  year: "calendar_today",
};

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
      {sections.map((section, index) => {
        const [primary, ...rest] = section.items;

        return (
          <section
            key={section.id}
            className={`${styles.section} ${index > 0 ? styles.sectionSplit : ""}`}
            data-variant={section.variant ?? "default"}
          >
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Icon
                  name={SECTION_ICONS[section.id] ?? "analytics"}
                  className={styles.sectionIcon}
                />
                {section.title}
              </h3>
            </div>

            {primary && (
              <div className={styles.primaryBlock}>
                <span className={styles.primaryValue}>{primary.value}</span>
                <span className={styles.primaryLabel}>{primary.label}</span>
              </div>
            )}

            {rest.length > 0 && (
              <div className={styles.sectionGrid}>
                {rest.map((item) => (
                  <div key={item.label} className={styles.statItem}>
                    <span className={styles.value}>{item.value}</span>
                    <span className={styles.label}>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
