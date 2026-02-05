"use client";

import React from "react";
import { useMetricCards } from "./MetricCards.hook";
import type { MetricCardsProps } from "./MetricCards.type";
import styles from "./MetricCards.module.css";

export function MetricCards(props: MetricCardsProps) {
  const { data } = useMetricCards(props);
  const { metrics } = data;

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
