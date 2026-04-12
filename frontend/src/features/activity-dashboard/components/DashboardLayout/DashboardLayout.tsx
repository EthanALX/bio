"use client";

import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useDashboardLayout } from "./DashboardLayout.hook";
import { YearSelector } from "../YearSelector";
import { SummaryStats } from "../SummaryStats";
import { Icon } from "@/components/Icon";
import {
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/Feedback";
import { ActivityList } from "../ActivityList";
import { ActivityCalendar } from "../ActivityCalendar";
import { ActivityChart } from "../ActivityChart";
import { RouteSketch } from "../RouteSketch";
import styles from "./DashboardLayout.module.css";

const TAB_ITEMS = [
  { value: "list", label: "记录历程", icon: "format_list_bulleted" },
  { value: "calendar", label: "打卡日历", icon: "calendar_month" },
  // { value: "chart", label: "图表数据", icon: "area_chart" },
  { value: "map", label: "跑步路线", icon: "route" },
] as const;

export function DashboardLayout() {
  const { state, actions } = useDashboardLayout();
  const {
    years,
    selectedYear,
    viewMode,
    data,
    globalStats,
    isLoading,
    error,
  } = state;
  const { setSelectedYear, setViewMode } = actions;

  if (error) {
    return <ErrorState error={error} className={styles.error} />;
  }

  return (
    <div className={styles.container}>
      {/* ── Year Selector ──────────────────────────────────────── */}
      <div className={styles.yearSelectorWrapper}>
        <YearSelector
          years={years}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>

      {isLoading ? (
        <div className={styles.mainRow}>
          <div className={styles.tabsColumn}>
            <LoadingSkeleton variant="list" rows={6} />
          </div>
          <aside className={styles.summaryColumn}>
            <LoadingSkeleton variant="stat" rows={4} />
          </aside>
        </div>
      ) : !data ? (
        <EmptyState
          icon="directions_run"
          title="No activities found"
          description="Try selecting a different year."
        />
      ) : (
        <div className={styles.mainRow}>
          {/* ── Radix Tabs ────────────────────────────────────────── */}
          <div className={styles.tabsColumn}>
            <Tabs.Root
              value={viewMode}
              onValueChange={(v) => setViewMode(v as typeof viewMode)}
              className={styles.tabsRoot}
            >
              <Tabs.List
                className={styles.tabList}
                aria-label="Dashboard views"
              >
                {TAB_ITEMS.map(({ value, label, icon }) => (
                  <Tabs.Trigger
                    key={value}
                    value={value}
                    className={styles.tabTrigger}
                  >
                    <Icon name={icon} className={styles.tabIcon} />
                    <span className={styles.tabLabel}>{label}</span>
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              <Tabs.Content value="list" className={styles.tabContent}>
                <ActivityList activities={data.activities} />
              </Tabs.Content>

              <Tabs.Content value="calendar" className={styles.tabContent}>
                <ActivityCalendar
                  activities={data.activities}
                  year={selectedYear}
                />
              </Tabs.Content>

              <Tabs.Content value="chart" className={styles.tabContent}>
                <ActivityChart activities={data.activities} />
              </Tabs.Content>

              <Tabs.Content value="map" className={styles.tabContent}>
                {data.activities.length === 0 ? (
                  <EmptyState
                    icon="route"
                    title="No route data"
                    description="Activities with GPS coordinates will appear here."
                  />
                ) : (
                  <div className={styles.trajectoryGrid}>
                    {data.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className={styles.trajectoryBlock}
                        title={`${activity.route} — ${activity.distance} km`}
                      >
                        <RouteSketch
                          coordinates={activity.coordinates}
                          seed={activity.id}
                        />
                        <div className={styles.trajectoryDist}>
                          {activity.distance} km
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Tabs.Content>
            </Tabs.Root>
          </div>

          <aside className={styles.summaryColumn}>
            <SummaryStats
              stats={data.stats}
              globalStats={globalStats}
              year={selectedYear}
              isLoading={isLoading}
            />
          </aside>
        </div>
      )}
    </div>
  );
}
