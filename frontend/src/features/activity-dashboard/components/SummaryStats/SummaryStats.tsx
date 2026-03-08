import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useSummaryStats } from "./SummaryStats.hook";
import type { SummaryStatsProps } from "./SummaryStats.type";
import styles from "./SummaryStats.module.css";

export function SummaryStats({ stats, isLoading }: SummaryStatsProps) {
  const { state } = useSummaryStats({ stats });
  const { statItems } = state;

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className={`${styles.container} ${isLoading ? styles.loading : ""}`}>
        {statItems.map((item) => (
          <Tooltip.Root key={item.label}>
            <Tooltip.Trigger asChild>
              <div className={styles.statItem} tabIndex={0}>
                <span className={styles.value}>{item.value}</span>
                <span className={styles.label}>{item.label}</span>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className={styles.tooltipContent} sideOffset={6}>
                {item.hint}
                <Tooltip.Arrow className={styles.tooltipArrow} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
