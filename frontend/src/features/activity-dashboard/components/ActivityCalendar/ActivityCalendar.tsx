import React from 'react';
import { Activity } from '../../types';
import { useActivityCalendar } from './ActivityCalendar.hook';
import styles from './ActivityCalendar.module.css';

interface ActivityCalendarProps {
    activities: Activity[];
    year: number;
}

export function ActivityCalendar(props: ActivityCalendarProps) {
    const { state } = useActivityCalendar(props);
    const { months } = state;

    return (
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
                                            <div
                                                key={dayIdx}
                                                className={`${styles.day} ${dayData?.hasActivity ? styles.active : ''} ${!dayData ? styles.empty : ''}`}
                                                title={dayData?.hasActivity ? `Activity on ${dayData.date}` : ''}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
