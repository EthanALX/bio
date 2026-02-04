"use client";

import React from "react";
import { useActivities } from "@/features/homepage/hooks";
import styles from "./MetricCards.module.css";

interface MetricCardsProps {
  selectedYear?: number;
}

export function MetricCards({ selectedYear }: MetricCardsProps) {
  const { totalDistance, avgPace, activeDays } = useActivities(selectedYear);

  const metrics = [
    {
      label: "总距离",
      value: `${totalDistance.toFixed(0)}`,
      unit: "km",
      icon: "timeline",
      variant: "primary" as const,
    },
    {
      label: "平均配速",
      value: avgPace.replace('"', ""),
      unit: "/km",
      icon: "speed",
      variant: "blue" as const,
    },
    {
      label: "活跃天数",
      value: String(activeDays),
      unit: "天",
      icon: "calendar_today",
      variant: "orange" as const,
    },
  ];

  return (
    <div className={styles.cardsGrid}>
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`${styles.card} ${
            metric.variant === "primary"
              ? styles.cardPrimary
              : metric.variant === "blue"
              ? styles.cardBlue
              : styles.cardOrange
          }`}
        >
          <div
            className={`${styles.glowBg} ${
              metric.variant === "primary"
                ? styles.glowBgPrimary
                : metric.variant === "blue"
                ? styles.glowBgBlue
                : styles.glowBgOrange
            }`}
          />
          <div className={styles.cardHeader}>
            <p className={styles.cardLabel}>{metric.label}</p>
            <span
              className={`material-symbols-outlined ${styles.cardIcon} ${
                metric.variant === "primary"
                  ? styles.cardIconPrimary
                  : metric.variant === "blue"
                  ? styles.cardIconBlue
                  : styles.cardIconOrange
              }`}
            >
              {metric.icon}
            </span>
          </div>
          <div className={styles.cardValue}>
            <span
              className={`${styles.cardNumber} ${
                metric.variant === "primary" ? styles.cardNumberPrimary : ""
              }`}
            >
              {metric.value}
            </span>
            <span className={styles.cardUnit}>{metric.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
