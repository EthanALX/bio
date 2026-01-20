import React from 'react';
import { ActivityStats } from '../../types';
import { useSummaryStats, ViewMode } from './SummaryStats.hook';
import styles from './SummaryStats.module.css';

interface SummaryStatsProps {
    stats: ActivityStats;
    viewMode: ViewMode;
    onViewChange: (mode: ViewMode) => void;
}

export function SummaryStats(props: SummaryStatsProps) {
    const { state, actions } = useSummaryStats(props);
    const { statItems } = state;
    const { handleViewChange } = actions;

    return (
        <div className={styles.container}>
            {statItems.map((item) => (
                <div
                    key={item.label}
                    className={`${styles.statCard} ${props.viewMode === item.mode ? styles.active : ''}`}
                    onClick={() => handleViewChange(item.mode)}
                >
                    <div className={styles.value}>{item.value}</div>
                    <div className={styles.label}>{item.label}</div>
                </div>
            ))}
        </div>
    );
}
