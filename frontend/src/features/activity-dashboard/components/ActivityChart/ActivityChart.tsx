import React from 'react';
import { Activity } from '../../types';
import { useActivityChart, ChartType } from './ActivityChart.hook';
import styles from './ActivityChart.module.css';

interface ActivityChartProps {
    activities: Activity[];
}

export function ActivityChart({ activities }: ActivityChartProps) {
    const { activeTab, setActiveTab, chartData } = useActivityChart({ activities });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.tabs}>
                    <div
                        className={`${styles.tab} ${activeTab === 'pace' ? styles.active : ''}`}
                        onClick={() => setActiveTab('pace')}
                    >
                        Pace
                    </div>
                    <div
                        className={`${styles.tab} ${activeTab === 'bpm' ? styles.active : ''}`}
                        onClick={() => setActiveTab('bpm')}
                    >
                        Heart Rate
                    </div>
                </div>
            </div>

            <div className={styles.chartArea}>
                <svg className={styles.svg} viewBox="0 0 400 300" preserveAspectRatio="xMinYMin meet">
                    <defs>
                        <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>
                    {chartData.map((item, index) => {
                        const y = index * 45 + 20;
                        return (
                            <g key={item.id} className={styles.barGroup}>
                                <text x="0" y={y} className={styles.value}>
                                    {item.displayValue}
                                </text>
                                <rect
                                    x="0"
                                    y={y + 8}
                                    width={item.percent * 3.5}
                                    height="12"
                                    rx="0"
                                    className={styles.bar}
                                    fill="url(#barGradient)"
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>

        </div>
    );
}
