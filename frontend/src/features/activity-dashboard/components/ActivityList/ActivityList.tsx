import React from 'react';
import { useActivityList } from './ActivityList.hook';
import type { ActivityListProps } from './ActivityList.type';
import { RouteSketch } from '../RouteSketch';
import styles from './ActivityList.module.css';

export function ActivityList(props: ActivityListProps) {
    const { state } = useActivityList(props);
    const { formattedActivities } = state;

    const columnStyles = {
        '--col-distance': props.columnWidths?.distance,
        '--col-pace': props.columnWidths?.pace,
        '--col-bpm': props.columnWidths?.bpm,
        '--col-time': props.columnWidths?.time,
        '--col-route': props.columnWidths?.route,
        '--col-date': props.columnWidths?.date,
    } as React.CSSProperties;

    return (
        <div className={styles.container} style={columnStyles}>
            <div className={styles.header}>
                <div className={styles.headerCell}>Distance</div>
                <div className={styles.headerCell}>Pace</div>
                <div className={styles.headerCell}>BPM</div>
                <div className={styles.headerCell}>Time</div>
                <div className={styles.headerCell}>Route</div>
                <div className={styles.headerCell}>Date</div>
            </div>
            <div className={styles.list}>
                {formattedActivities.map((activity) => (
                    <div key={activity.id} className={styles.row}>
                        <div className={styles.cell}>{activity.distance}</div>
                        <div className={styles.cell}>{activity.pace}</div>
                        <div className={styles.cell}>{activity.bpm}</div>
                        <div className={styles.cell}>{activity.time}</div>
                        <div className={styles.cell}>
                            <RouteSketch coordinates={activity.coordinates} seed={activity.id} />
                        </div>
                        <div className={styles.cell}>{activity.dateDisplay}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
