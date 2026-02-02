import React from 'react';
import { useActivityMap } from './ActivityMap.hook';
import type { ActivityMapProps } from './ActivityMap.type';
import styles from './ActivityMap.module.css';

export function ActivityMap({ activities, isBackground = false, isVisible = true }: ActivityMapProps) {
    const { geoData, pathGenerator, projectedRoutes, viewBox } = useActivityMap(activities);

    if (!geoData) {
        if (isBackground) return null;
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading Map...</div>
            </div>
        );
    }

    const containerClasses = [
        styles.container,
        isBackground ? styles.backgroundMode : '',
        isVisible ? styles.visible : styles.hidden
    ].join(' ');

    return (
        <div className={containerClasses}>
            <div className={styles.mapWrapper}>
                <svg className={styles.svg} viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
                    {/* Background Layer: China Map */}
                    <g className={styles.mapLayer}>
                        {geoData.features.map((feature, index) => (
                            <path
                                key={`province-${index}`}
                                d={pathGenerator(feature) || ''}
                                className={styles.province}
                            />
                        ))}
                    </g>

                    {/* Foreground Layer: Running Heatmap */}
                    <g className={styles.heatmapLayer}>
                        {projectedRoutes.map((route) => (
                            <polyline
                                key={`route-${route.id}`}
                                points={route.points}
                                className={styles.routePath}
                                fill="none"
                                stroke={route.color}
                                style={{ color: route.color } as React.CSSProperties}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        ))}
                    </g>
                </svg>
            </div>
        </div>
    );
}
