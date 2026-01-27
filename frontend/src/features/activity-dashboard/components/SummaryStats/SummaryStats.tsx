import React from 'react';
import { ActivityStats } from '../../types';
import { useSummaryStats, ViewMode } from './SummaryStats.hook';
import { StatCard } from './StatCard';
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
            {statItems.map((item, index) => (
                <StatCard
                    key={item.label}
                    value={item.value}
                    label={item.label}
                    isActive={props.viewMode === item.mode}
                    onClick={() => handleViewChange(item.mode)}
                    index={index}
                />
            ))}
        </div>
    );
}
