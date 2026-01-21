"use client";

import React from "react";
import { useDashboardLayout } from "./DashboardLayout.hook";
import { YearSelector } from "../YearSelector";
import { SummaryStats } from "../SummaryStats";
import { ActivityList } from "../ActivityList";
import { ActivityCalendar } from "../ActivityCalendar";
import { ActivityChart } from "../ActivityChart";
import { ActivityMap } from "../ActivityMap";
import styles from "./DashboardLayout.module.css";

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
        <div className={`${styles.container} ${viewMode === 'map' ? styles.backgroundActive : ''}`}>
            <ActivityMap isBackground={true} isVisible={viewMode === 'map'} activities={data.activities} />

            <YearSelector
                years={years}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
            />

            <div className={styles.mainLayout}>
                <div className={styles.content}>
                    {viewMode === "list" && <ActivityList activities={data.activities} />}
                    {viewMode === "calendar" && (
                        <ActivityCalendar
                            activities={data.activities}
                            year={selectedYear}
                        />
                    )}
                    {viewMode === "chart" && (
                        <ActivityChart activities={data.activities} />
                    )}
                    {viewMode === "map" && (
                        <div className={styles.mapPlaceholderView}>
                            <div className={styles.mapHint}></div>
                        </div>
                    )}
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
