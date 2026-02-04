"use client";

import { useMemo } from 'react';
import activitiesData from '@/mocks/activities.json';
import {
  Activity,
  getLatestActivity,
  calculateTotalDistance,
  calculateTotalRuns,
  calculateActiveDays,
  calculateAvgPace,
  generateHeatmapData,
  calculatePersonalBests,
} from '@/features/homepage/utils';

interface UseActivitiesReturn {
  activities: Activity[];
  latestActivity: Activity | null;
  totalDistance: number;
  totalRuns: number;
  activeDays: number;
  avgPace: string;
  heatmapData: number[][];
  personalBests: {
    best5k: string | null;
    best10k: string | null;
    bestHalf: string | null;
  };
}

export function useActivities(selectedYear?: number): UseActivitiesReturn {
  const activities = useMemo(() => {
    // Sort by date descending (most recent first)
    const sorted = [...activitiesData].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (selectedYear) {
      return sorted.filter(a => new Date(a.date).getFullYear() === selectedYear);
    }
    return sorted;
  }, [selectedYear]);

  const latestActivity = useMemo(
    () => getLatestActivity(activities),
    [activities]
  );

  const totalDistance = useMemo(
    () => calculateTotalDistance(activities),
    [activities]
  );

  const totalRuns = useMemo(
    () => calculateTotalRuns(activities),
    [activities]
  );

  const activeDays = useMemo(
    () => calculateActiveDays(activities),
    [activities]
  );

  const avgPace = useMemo(
    () => calculateAvgPace(activities),
    [activities]
  );

  const heatmapData = useMemo(
    () => generateHeatmapData(activities),
    [activities]
  );

  const personalBests = useMemo(
    () => calculatePersonalBests(activities),
    [activities]
  );

  return {
    activities,
    latestActivity,
    totalDistance,
    totalRuns,
    activeDays,
    avgPace,
    heatmapData,
    personalBests,
  };
}
