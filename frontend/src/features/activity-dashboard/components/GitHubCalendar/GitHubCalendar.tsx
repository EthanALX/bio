import React from "react";
import { Activity } from "../../types";
import { useGitHubCalendar } from "./GitHubCalendar.hook";
import styles from "./GitHubCalendar.module.css";

export interface GitHubCalendarProps {
  activities: Activity[];
  year: number;
}

export function GitHubCalendar({ activities, year }: GitHubCalendarProps) {
  const { state } = useGitHubCalendar({ activities, year });
  const { weeks, months, dayLabels, dayLabelColors, dayLabelDates } = state;

  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <div className={styles.monthHeaders}>
          {months.map((month) => (
            <div
              key={month.name}
              className={styles.monthHeader}
              style={{
                left: `${month.startWeek * 16}px`,
                width: `${(month.endWeek - month.startWeek) * 16 - 3}px`,
              }}
            >
              {month.name}
            </div>
          ))}
        </div>

        <div className={styles.calendarGrid}>
          <div className={styles.dayLabels}>
            {dayLabels.map((label, dayIndex) => (
              <div key={dayIndex} className={styles.dayLabelRow}>
                <div className={styles.dayLabelName}>{label}</div>
                <div className={styles.dayLabelCells}>
                  {dayLabelColors[dayIndex].map((color, weekIndex) => (
                    <div
                      key={weekIndex}
                      className={`${styles.dayLabelCell} ${color ? styles[color] : styles["level-0"]}`}
                      title={`${label} - Week ${weekIndex + 1}: ${color}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.grid}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.week}>
                {week.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`${styles.day} ${
                      day ? styles[day.level] : styles.empty
                    }`}
                    title={day ? `${day.date}: ${day.distance}km` : ""}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendRow}>
          <span className={styles.legendText}>0km</span>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((level) => (
            <div
              key={level}
              className={`${styles.legendDay} ${styles[`level-${level}`]}`}
            />
          ))}
          <span className={styles.legendText}>35km+</span>
        </div>
      </div>
    </div>
  );
}
