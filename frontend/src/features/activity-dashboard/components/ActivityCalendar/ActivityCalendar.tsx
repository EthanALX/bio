import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useActivityCalendar } from "./ActivityCalendar.hook";
import type { ActivityCalendarProps, CalendarDay } from "./ActivityCalendar.type";
import { ActivityLegend } from "./ActivityLegend";
import styles from "./ActivityCalendar.module.css";

function CalendarDayCell({ dayData }: { dayData: CalendarDay | null }) {
  if (!dayData) {
    return <div className={`${styles.day} ${styles.empty}`} />;
  }

  if (!dayData.hasActivity) {
    return (
      <div
        className={`${styles.day} ${styles["level-0"]}`}
        aria-label={dayData.date}
      />
    );
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div
          className={`${styles.day} ${styles[`level-${dayData.level}`]} ${styles.hasActivity}`}
          aria-label={`${dayData.date}: ${dayData.distance?.toFixed(1)} km`}
          role="button"
          tabIndex={0}
        />
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className={styles.tooltipContent} sideOffset={6}>
          <div className={styles.tooltipDate}>{dayData.date}</div>
          <div className={styles.tooltipDist}>{dayData.distance?.toFixed(1)} km</div>
          <Tooltip.Arrow className={styles.tooltipArrow} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export function ActivityCalendar({ activities, year }: ActivityCalendarProps) {
  const { state } = useActivityCalendar({ activities, year });
  const { months } = state;

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {months.map((month) => (
            <div key={month.name} className={styles.month}>
              <div className={styles.monthLabel}>{month.name}</div>
              <div className={styles.weeks}>
                {month.weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className={styles.week}>
                    <div className={styles.weekLabel}>W{week.weekNumber}</div>
                    <div className={styles.days}>
                      {week.days.map((dayData, dayIdx) => (
                        <CalendarDayCell key={dayIdx} dayData={dayData} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <ActivityLegend />
      </div>
    </Tooltip.Provider>
  );
}
