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
                        <h1 className={styles.title}>Activity Dashboard</h1>
                        <p className={styles.subtitle}>Track your fitness journey</p>
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
