import React from "react";
import { useGlobalPanel } from "./GlobalPanel.hook";
import type { GlobalPanelProps } from "./GlobalPanel.type";
import styles from "./GlobalPanel.module.css";

export function GlobalPanel({ globalStats, isLoading }: GlobalPanelProps) {
  const { state } = useGlobalPanel({ globalStats, isLoading });
  const { globalStats: stats, isLoading: loading } = state;

  if (!stats) {
    return null;
  }

  const { totalStats, personalBest } = stats;

  const totalStatItems = [
    {
      value: `${totalStats.Distance} km`,
      label: "总距离",
      hint: "历史累计跑量",
    },
    {
      value: totalStats.Days,
      label: "总天数",
      hint: "累计运动天数",
    },
    {
      value: totalStats.AvgPace,
      label: "平均配速",
      hint: "历史平均配速",
    },
    {
      value: totalStats.Routes,
      label: "总路线",
      hint: "记录的路线数",
    },
  ];

  const personalBestItems = [
    {
      value: `${personalBest.longestDistance} km`,
      label: "最长距离",
      icon: "straighten",
    },
    {
      value: personalBest.fastestPace,
      label: "最快配速",
      icon: "speed",
    },
    {
      value: personalBest.longestDuration,
      label: "最长时间",
      icon: "timer",
    },
    {
      value: personalBest.maxHeartRate,
      label: "最高心率",
      icon: "favorite",
    },
  ];

  return (
    <div className={`${styles.container} ${loading ? styles.loading : ""}`}>
      {/* Total Stats Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>📊</span>
          全历史统计
        </h3>
        <div className={styles.statsGrid}>
          {totalStatItems.map((item) => (
            <div key={item.label} className={styles.statItem}>
              <span className={styles.value}>{item.value}</span>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.hint}>{item.hint}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Best Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>🏆</span>
          个人最佳
        </h3>
        <div className={styles.bestGrid}>
          {personalBestItems.map((item) => (
            <div key={item.label} className={styles.bestItem}>
              <span className={styles.bestValue}>{item.value}</span>
              <span className={styles.bestLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
