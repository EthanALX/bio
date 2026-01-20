import React from 'react';
import { Activity } from '../../types';
import styles from './ActivityMap.module.css';

interface ActivityMapProps {
    activities: Activity[];
}

export function ActivityMap({ activities }: ActivityMapProps) {
    // For now, display a placeholder map
    // In production, this would integrate with a mapping library like Mapbox or Google Maps

    return (
        <div className={styles.container}>
            <div className={styles.mapPlaceholder}>
                <div className={styles.mapOverlay}>
                    <div className={styles.mapIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>
                    <h3 className={styles.mapTitle}>Activity Routes</h3>
                    <p className={styles.mapDescription}>
                        Map visualization of {activities.length} activities
                    </p>
                    <div className={styles.routeList}>
                        {activities.slice(0, 5).map((activity) => (
                            <div key={activity.id} className={styles.routeItem}>
                                <div className={styles.routeDot} />
                                <span>{activity.route}</span>
                                <span className={styles.routeDistance}>{activity.distance} km</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
