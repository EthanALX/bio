"use client";

import React, { useRef } from "react";
import { useDashboardLayout } from "./DashboardLayout.hook";
import { YearSelector } from "../YearSelector";
import { SummaryStats } from "../SummaryStats";
import { ActivityList } from "../ActivityList";
import { ActivityCalendar } from "../ActivityCalendar";
import { ActivityMap } from "../ActivityMap";
import { ActivityChart } from "../ActivityChart";
import styles from "./DashboardLayout.module.css";
import { RouteSketch } from "../RouteSketch";

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

  // if (isLoading) {
  //   return (
  //     <div className={styles.loading}>
  //       <div className={styles.spinner} />
  //       <p>Loading activity data...</p>
  //     </div>
  //   );
  // }

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
          )}

          {viewMode === "chart" && (
            <ActivityChart activities={data.activities} />
          )}

          {viewMode === "map" && (
            <div className={styles.mapPlaceholderView}>
              <div className={styles.trajectoryGrid}>
                {data.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={styles.trajectoryBlock}
                    title={`${activity.route} - ${activity.distance}km`}
                  >
                    <RouteSketch
                      coordinates={activity.coordinates}
                      seed={activity.id}
                    />
                    <div className={styles.trajectoryInfo}>
                      <div>{activity.distance}km</div>
                    </div>
                  </div>
                ))}
              </div>
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
