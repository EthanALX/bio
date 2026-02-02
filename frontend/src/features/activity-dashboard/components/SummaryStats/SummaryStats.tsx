import React from 'react';
import { useSummaryStats } from './SummaryStats.hook';
import type { SummaryStatsProps, ViewMode } from './SummaryStats.type';
import styles from './SummaryStats.module.css';

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
