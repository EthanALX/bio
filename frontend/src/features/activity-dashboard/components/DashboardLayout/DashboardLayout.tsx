'use client';

import React from 'react';
import { useDashboardLayout } from './DashboardLayout.hook';
import { YearSelector } from '../YearSelector';
import { SummaryStats } from '../SummaryStats';
import { ActivityList } from '../ActivityList';
import { ActivityCalendar } from '../ActivityCalendar';
import { ActivityChart } from '../ActivityChart';
import { ActivityMap } from '../ActivityMap';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
    const { state, actions } = useDashboardLayout();
    const { years, selectedYear, viewMode, data, isLoading, error } = state;
    const { setSelectedYear, setViewMode } = actions;

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Loading activity data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>Error loading data: {error.message}</p>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <header className={styles.header}>
                    <div className={styles.avatar}>E</div>
                    <div className={styles.headerText}>
                        <p className={styles.subtitle}>如果你想跑步，跑一公里就好，如果你想体验不一样的人生，去跑场马拉松  --艾米尔·扎托佩克</p>
                    </div>
                </header>

                <YearSelector
                    years={years}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                />
            </div>

            <div className={styles.mainLayout}>
                <div className={styles.content}>
                    {viewMode === 'list' && <ActivityList activities={data.activities} />}
                    {viewMode === 'calendar' && <ActivityCalendar activities={data.activities} year={selectedYear} />}
                    {viewMode === 'chart' && <ActivityChart activities={data.activities} />}
                    {viewMode === 'map' && <ActivityMap activities={data.activities} />}
                </div>

                <div className={styles.sidebar}>
                    <SummaryStats
                        stats={data.stats}
                        viewMode={viewMode}
                        onViewChange={setViewMode}
                    />
                </div>
            </div>
        </div>
    );
}
