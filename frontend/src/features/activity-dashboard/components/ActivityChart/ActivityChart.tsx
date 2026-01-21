import React, { useMemo } from 'react';
import { Activity } from '../../types';
import { useActivityChart } from './ActivityChart.hook';
import styles from './ActivityChart.module.css';

interface ActivityChartProps {
    activities: Activity[];
}

export function ActivityChart({ activities }: ActivityChartProps) {
    const { chartData } = useActivityChart({ activities });

    const linePoints = useMemo(() => {
        return chartData
            .map((item, index) => {
                const x = item.hrPercent * 7;
                const y = index * 60 + 20 + 21; // y (text start) + 12 (offset) + 9 (half height of 18)
                return `${x},${y}`;
            })
            .join(' ');
    }, [chartData]);

    return (
        <div className={styles.container}>
            <div className={styles.chartArea}>
                <svg className={styles.svg} viewBox="0 0 800 500" preserveAspectRatio="xMinYMin meet">
                    <defs>
                        <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>

                    {/* Pace Bars */}
                    {chartData.map((item, index) => {
                        const y = index * 60 + 20;
                        return (
                            <g key={`pace-${item.id}`} className={styles.barGroup}>
                                <text x="0" y={y} className={styles.value}>
                                    {item.paceValue}
                                </text>
                                <rect
                                    x="0"
                                    y={y + 12}
                                    width={item.pacePercent * 7}
                                    height="18"
                                    rx="0"
                                    className={styles.bar}
                                    fill="url(#barGradient)"
                                />
                            </g>
                        );
                    })}

                    {/* Heart Rate Line */}
                    <polyline
                        points={linePoints}
                        fill="none"
                        stroke="#de24fb"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={styles.hrLine}
                    />

                    {/* Heart Rate Points & Values */}
                    {chartData.map((item, index) => {
                        const x = item.hrPercent * 7;
                        const y = index * 60 + 20 + 21;
                        return (
                            <g key={`hr-${item.id}`}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="1"
                                    className={styles.hrPoint}
                                />
                                <text x={x + 8} y={y + 4} className={styles.hrValue}>
                                    {item.bpmValue}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
