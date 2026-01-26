import React from 'react';
import { Activity } from '../../types';
import { useTrajectoryLayer } from './TrajectoryLayer.hook';
import styles from './TrajectoryLayer.module.css';

interface TrajectoryLayerProps {
    activities: Activity[];
    isVisible?: boolean;
}

export function TrajectoryLayer({ activities, isVisible = true }: TrajectoryLayerProps) {
    const { projectedTrajectories } = useTrajectoryLayer(activities);

    const containerClasses = [
        styles.container,
        isVisible ? styles.visible : styles.hidden
    ].join(' ');

    return (
        <div className={containerClasses}>
            <svg className={styles.svg} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
                <g className={styles.trajectoryLayer}>
                    {projectedTrajectories.map((trajectory) => (
                        <polyline
                            key={`trajectory-${trajectory.id}`}
                            points={trajectory.points}
                            className={styles.trajectoryPath}
                            fill="none"
                            stroke={trajectory.color}
                            style={{ color: trajectory.color } as React.CSSProperties}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
}