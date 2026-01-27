import React, { useEffect, useRef, useState } from 'react';
import { ActivityStats } from '../../types';
import { useSummaryStats, ViewMode } from './SummaryStats.hook';
import styles from './SummaryStats.module.css';

interface SummaryStatsProps {
    stats: ActivityStats;
    viewMode: ViewMode;
    onViewChange: (mode: ViewMode) => void;
}

function AnimatedCounter({ value, duration = 1000 }: { value: string | number, duration?: number }) {
    const [displayValue, setDisplayValue] = useState<string | number>(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) {
            setDisplayValue(value);
            return;
        }

        // Check if value is numeric
        const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));

        if (isNaN(numericValue)) {
            setDisplayValue(value);
            hasAnimated.current = true;
            return;
        }

        const startTime = Date.now();
        const endTime = startTime + duration;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(numericValue * easeOutQuart);

            // Preserve original format (e.g., "123 km" or "5'20"/km")
            if (typeof value === 'string') {
                const formatted = String(value).replace(/[\d.]+/, String(current));
                setDisplayValue(formatted);
            } else {
                setDisplayValue(current);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
                hasAnimated.current = true;
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return <>{displayValue}</>;
}

export function SummaryStats(props: SummaryStatsProps) {
    const { state, actions } = useSummaryStats(props);
    const { statItems } = state;
    const { handleViewChange } = actions;

    return (
        <div className={styles.container}>
            {statItems.map((item, index) => (
                <div
                    key={item.label}
                    className={`${styles.statCard} ${props.viewMode === item.mode ? styles.active : ''}`}
                    onClick={() => handleViewChange(item.mode)}
                    style={{
                        animationDelay: `${index * 0.1}s`
                    }}
                >
                    <div className={styles.value}>
                        <AnimatedCounter value={item.value} duration={1200} />
                    </div>
                    <div className={styles.label}>{item.label}</div>
                </div>
            ))}
        </div>
    );
}
