import React from 'react';
import { Activity } from '../../types';
import styles from './ActivityChart.module.css';

interface ActivityChartProps {
    activities: Activity[];
}

export function ActivityChart({ activities }: ActivityChartProps) {
    // Calculate chart data
    const maxBpm = Math.max(...activities.map(a => a.bpm));
    const minBpm = Math.min(...activities.map(a => a.bpm));

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${styles.active}`}>Pace</button>
                    <button className={styles.tab}>Heart Rate</button>
                </div>
            </div>

            <div className={styles.chartContainer}>
                <div className={styles.yAxis}>
                    <span className={styles.axisLabel}>{maxBpm}</span>
                    <span className={styles.axisLabel}>{Math.round((maxBpm + minBpm) / 2)}</span>
                    <span className={styles.axisLabel}>{minBpm}</span>
                </div>

                <div className={styles.chart}>
                    {activities.map((activity, index) => {
                        const height = ((activity.bpm - minBpm) / (maxBpm - minBpm)) * 100;
                        return (
                            <div key={activity.id} className={styles.barWrapper}>
                                <div
                                    className={styles.bar}
                                    style={{ height: `${height}%` }}
                                    title={`${activity.date}: ${activity.bpm} BPM`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }} />
                    <span>Heart Rate</span>
                </div>
            </div>
        </div>
    );
}
