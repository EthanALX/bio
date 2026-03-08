"use client";

import React, { useMemo } from "react";
import type { Activity } from "../../types";
import { Icon } from "@/components/Icon";
import styles from "./PersonalBestsPanel.module.css";

interface PersonalBestsPanelProps {
  activities: Activity[];
}

type BestItem = {
  label: string;
  value: string;
  meta: string;
  icon: string;
};

function parseSeconds(time: string): number {
  const hourMatch = time.match(/(\d+)h/);
  const minMatch = time.match(/(\d+)m/);
  const secMatch = time.match(/(\d+)s/);

  let total = 0;
  if (hourMatch) total += parseInt(hourMatch[1], 10) * 3600;
  if (minMatch) total += parseInt(minMatch[1], 10) * 60;
  if (secMatch) total += parseInt(secMatch[1], 10);
  return total;
}

function formatDuration(time: string): string {
  const total = parseSeconds(time);
  if (!total) return "--:--";

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatDateLabel(date: string): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  });
}

function findBestByDistance(
  activities: Activity[],
  minDistance: number,
  maxDistance: number
): Activity | null {
  return (
    activities
      .filter((activity) => activity.distance >= minDistance && activity.distance <= maxDistance)
      .sort((a, b) => parseSeconds(a.time) - parseSeconds(b.time))[0] ?? null
  );
}

export function PersonalBestsPanel({ activities }: PersonalBestsPanelProps) {
  const items = useMemo<BestItem[]>(() => {
    const best5k = findBestByDistance(activities, 4.5, 5.5);
    const best10k = findBestByDistance(activities, 9, 11);
    const bestHalf = findBestByDistance(activities, 20, 22);
    const longest = [...activities].sort((a, b) => b.distance - a.distance)[0] ?? null;

    return [
      {
        label: "5K",
        value: best5k ? formatDuration(best5k.time) : "--:--",
        meta: best5k ? `${formatDateLabel(best5k.date)} · ${best5k.pace}` : "暂无成绩",
        icon: "sprint",
      },
      {
        label: "10K",
        value: best10k ? formatDuration(best10k.time) : "--:--",
        meta: best10k ? `${formatDateLabel(best10k.date)} · ${best10k.pace}` : "暂无成绩",
        icon: "monitoring",
      },
      {
        label: "半马",
        value: bestHalf ? formatDuration(bestHalf.time) : "--:--",
        meta: bestHalf ? `${formatDateLabel(bestHalf.date)} · ${bestHalf.pace}` : "暂无成绩",
        icon: "trophy",
      },
      {
        label: "最长距离",
        value: longest ? `${longest.distance} km` : "--",
        meta: longest ? `${formatDateLabel(longest.date)} · ${longest.time}` : "暂无成绩",
        icon: "straighten",
      },
    ];
  }, [activities]);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>个人最佳</p>
          <h3 className={styles.title}>关键成绩</h3>
        </div>
        <p className={styles.caption}>按当前所选年份筛选，自动提取代表性表现。</p>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <article key={item.label} className={styles.card}>
            <Icon name={item.icon} className={styles.icon} />
            <div className={styles.cardBody}>
              <p className={styles.label}>{item.label}</p>
              <p className={styles.value}>{item.value}</p>
              <p className={styles.meta}>{item.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
