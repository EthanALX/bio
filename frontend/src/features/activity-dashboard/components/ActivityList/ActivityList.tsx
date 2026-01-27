import React from 'react';
import { Activity } from '../../types';
import { useActivityList } from './ActivityList.hook';
import { RouteSketch } from '../RouteSketch';
import styles from './ActivityList.module.css';

interface ActivityListProps {
    activities: Activity[];
    columnWidths?: {
        distance?: string;
        pace?: string;
        bpm?: string;
        time?: string;
        route?: string;
        date?: string;
    };
}

export function ActivityList(props: ActivityListProps) {
    const { state } = useActivityList(props);
    const { formattedActivities } = state;

    // 距离颜色映射
    const getDistanceColor = (distance: number) => {
        if (distance >= 20) return 'ultra';
        if (distance >= 15) return 'long';
        if (distance >= 10) return 'medium';
        if (distance >= 5) return 'short';
        return 'easy';
    };

    // 获取路线颜色
    const getRouteColor = (distance: number) => {
        if (distance >= 20) return '#ef4444';      // 红色
        if (distance >= 15) return '#f59e0b';      // 橙色
        if (distance >= 10) return '#0ea5e9';      // 蓝色
        if (distance >= 5) return '#06b6d4';       // 青色
        return '#94a3b8';                           // 灰色
    };

    return (
        <div className={styles.container}>
            <div className={styles.list}>
                {formattedActivities.map((activity, index) => {
                    const distance = parseFloat(activity.distance);
                    const distanceClass = getDistanceColor(distance);

                    return (
                        <div
                            key={activity.id}
                            className={`${styles.row} ${styles[distanceClass]}`}
                            style={{ animationDelay: `${index * 0.02}s` }}
                        >
                            {/* 左侧：距离主视觉 */}
                            <div className={styles.distanceBlock}>
                                <div className={styles.distanceNumber}>{activity.distance}</div>
                                <div className={styles.distanceLabel}>KM</div>
                            </div>

                            {/* 中间：活动信息 */}
                            <div className={styles.infoBlock}>
                                <div className={styles.dateText}>{activity.dateDisplay}</div>
                                <div className={styles.metricsRow}>
                                    <span className={styles.metric}>
                                        <span className={styles.metricIcon}>⚡</span>
                                        {activity.pace}
                                    </span>
                                    <span className={styles.metric}>
                                        <span className={styles.metricIcon}>❤️</span>
                                        {activity.bpm}
                                    </span>
                                    <span className={styles.metric}>
                                        <span className={styles.metricIcon}>⏱️</span>
                                        {activity.time}
                                    </span>
                                </div>
                            </div>

                            {/* 右侧：路线缩略图 */}
                            <div className={styles.routeBlock}>
                                <RouteSketch
                                    coordinates={activity.coordinates}
                                    seed={activity.id}
                                    color={getRouteColor(distance)}
                                />
                            </div>

                            {/* 左侧色条 */}
                            <div className={styles.colorBar} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
