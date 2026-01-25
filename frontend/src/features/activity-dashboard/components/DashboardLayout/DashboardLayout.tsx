"use client";

import React, { useRef } from "react";
import { useDashboardLayout } from "./DashboardLayout.hook";
import { YearSelector } from "../YearSelector";
import { SummaryStats } from "../SummaryStats";
import { ActivityList } from "../ActivityList";
import { ActivityCalendar } from "../ActivityCalendar";
import { GitHubCalendar } from "../GitHubCalendar";
import { ActivityChart } from "../ActivityChart";
import { ActivityMap } from "../ActivityMap";
import styles from "./DashboardLayout.module.css";

export function DashboardLayout() {
  const { state, actions, refs } = useDashboardLayout();
  const {
    years,
    selectedYear,
    viewMode,
    data,
    isLoading,
    error,
    isSidebarFixed,
    sidebarLeft,
  } = state;
  const { setSelectedYear, setViewMode } = actions;
  const { sidebarRef } = refs;

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
    <div
      className={`${styles.container} ${viewMode === "map" ? styles.backgroundActive : ""}`}
    >
      <ActivityMap
        isBackground={true}
        isVisible={viewMode === "map"}
        activities={data.activities}
      />

      <YearSelector
        years={years}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      <div
        className={`${styles.mainLayout} ${viewMode === "calendar" ? styles.calendarGap : ""}`}
      >
        <div className={styles.content}>
          {viewMode === "list" && <ActivityList activities={data.activities} />}
          {viewMode === "calendar" && (
            <ActivityCalendar
              activities={data.activities}
              year={selectedYear}
            />
            // <GitHubCalendar activities={data.activities} year={selectedYear} />
          )}
          {/*{viewMode === "chart" && (
            <ActivityChart activities={data.activities} />
          )}*/}
          {viewMode === "map" && (
            <div className={styles.mapPlaceholderView}>
              <div className={styles.mapHint}></div>
            </div>
          )}
        </div>

        {isSidebarFixed && <div className={styles.sidebarPlaceholder} />}
        <div
          ref={sidebarRef}
          className={`${styles.sidebar} ${isSidebarFixed ? styles.fixed : styles.sticky}`}
          style={isSidebarFixed ? { left: `${sidebarLeft}px` } : {}}
        >
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
