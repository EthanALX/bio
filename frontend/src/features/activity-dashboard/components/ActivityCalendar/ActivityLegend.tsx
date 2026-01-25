import React from "react";
import styles from "./ActivityCalendar.module.css";

interface ActivityLegendProps {
  className?: string;
}

export function ActivityLegend({ className = "" }: ActivityLegendProps) {
  const legendItems = [
    { level: 0, label: "No activity", distance: "0km" },
    { level: 1, label: "0-4.9 km", distance: "< 5km" },
    { level: 2, label: "5-9.9 km", distance: "5-10km" },
    { level: 3, label: "10-14.9 km", distance: "10-15km" },
    { level: 4, label: "15-19.9 km", distance: "15-20km" },
    { level: 5, label: "20-24.9 km", distance: "20-25km" },
    { level: 6, label: "25-29.9 km", distance: "25-30km" },
    { level: 7, label: "30+ km", distance: "30+km" },
  ];

  return (
    <div className={`${styles.legend} ${className}`}>
      <div className={styles.legendTitle}>Activity Intensity</div>
      <div className={styles.legendItems}>
        {legendItems.map((item) => (
          <div key={item.level} className={styles.legendItem}>
            <div
              className={`${styles.legendDay} ${styles.day}  ${styles[`level-${item.level}`]}`}
            />
            <div className={styles.legendLabel}>
              <div className={styles.legendDistance}>{item.distance}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
