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
                    <button
                        className={`${styles.tab} ${activeTab === 'pace' ? styles.active : ''}`}
                        onClick={() => setActiveTab('pace')}
                    >
                        Pace
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'bpm' ? styles.active : ''}`}
                        onClick={() => setActiveTab('bpm')}
                    >
                        Heart Rate
                    </button>
                </div>
            </div>

            <div className={styles.chartArea}>
                <svg className={styles.svg} viewBox="0 0 100 240" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>
                    {chartData.map((item, index) => {
                        const y = index * 30 + 10;
                        return (
                            <g key={item.id} className={styles.barGroup}>
                                {/* <text x="0" y={y + 14} className={styles.label}>{item.date.slice(5)}</text> */}
                                <rect
                                    x="15"
                                    y={y}
                                    width={item.percent * 0.75}
                                    height="20"
                                    rx="4"
                                    className={styles.bar}
                                    fill="url(#barGradient)"
                                />
                                <text x={item.percent * 0.75 + 18} y={y + 14} className={styles.value}>
                                    {item.displayValue}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={styles.legendColor} />
                    <span>{activeTab === 'pace' ? 'Pace' : 'Heart Rate'} Trend</span>
                </div>
            </div>
        </div>
    );
}
