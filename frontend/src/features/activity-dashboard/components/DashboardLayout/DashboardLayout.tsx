"use client";

import React, { useRef } from "react";
import { useDashboardLayout } from "./DashboardLayout.hook";
import { YearSelector } from "../YearSelector";
import { SummaryStats } from "../SummaryStats";
import { ActivityList } from "../ActivityList";
import { ActivityCalendar } from "../ActivityCalendar";
import { ActivityMap } from "../ActivityMap";
import { PaceDistribution } from "../PaceDistribution";
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
          {viewMode === "list" && (
            <div key="list" className={styles.viewTransition}>
              <ActivityList activities={data.activities} />
            </div>
          )}
          {viewMode === "calendar" && (
            <div key="calendar" className={styles.viewTransition}>
              <ActivityCalendar
                activities={data.activities}
                year={selectedYear}
              />
            </div>
          )}
          {viewMode === "pace" && (
            <div key="pace" className={styles.viewTransition}>
              <PaceDistribution activities={data.activities} />
            </div>
          )}

          {viewMode === "map" && (
            <div key="map" className={`${styles.viewTransition} ${styles.mapPlaceholderView}`}>
              <div className={styles.trajectoryGrid}>
                {data.activities.map((activity, index) => {
                  const distance = parseFloat(activity.distance);
                  const getRouteColor = (dist: number) => {
                    if (dist >= 15) return '#f59e0b';      // 橙色
                    if (dist >= 10) return '#0ea5e9';      // 蓝色
                    if (dist >= 7) return '#06b6d4';       // 青色
                    if (dist >= 5) return '#10b981';       // 绿色
                    if (dist >= 3) return '#8b5cf6';       // 紫色
                    return '#64748b';                       // 灰色
                  };

                  return (
                    <div
                      key={activity.id}
                      className={styles.trajectoryBlock}
                      title={`${activity.distance}km`}
                      style={{ '--index': index } as React.CSSProperties}
                    >
                      <RouteSketch
                        coordinates={activity.coordinates}
                        seed={activity.id}
                        color={getRouteColor(distance)}
                      />
                      <div className={styles.trajectoryInfo}>
                        <div>{activity.distance}</div>
                      </div>
                    </div>
                  );
                })}
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
