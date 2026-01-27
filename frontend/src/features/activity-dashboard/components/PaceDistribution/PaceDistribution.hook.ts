import { useMemo } from "react";
import { Activity } from "../../types";

export interface PaceRange {
  id: string;
  label: string;
  minSeconds: number; // pace in seconds per km
  maxSeconds: number;
  count: number;
  percentage: number;
  activities: Activity[];
}

export interface PaceDataPoint {
  date: Date;
  dateString: string;
  paceSeconds: number;
  paceString: string;
  activity: Activity;
}

export interface PaceStats {
  fastest: string;
  average: string;
  slowest: string;
  totalActivities: number;
}

export interface UsePaceDistributionProps {
  activities: Activity[];
}

export interface UsePaceDistributionResult {
  paceRanges: PaceRange[];
  paceStats: PaceStats;
  avgPaceSeconds: number;
  timeSeriesData: PaceDataPoint[];
}

/**
 * Convert pace string (e.g., "5'20"/km") to seconds per km
 */
const paceToSeconds = (pace: string): number => {
  const match = pace.match(/(\d+)'(\d+)"/);
  if (!match) return 0;
  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  return minutes * 60 + seconds;
};

/**
 * Convert seconds per km to pace string (e.g., "5'20"/km")
 */
const secondsToPace = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}'${secs.toString().padStart(2, "0")}"/km`;
};

export const usePaceDistribution = ({
  activities,
}: UsePaceDistributionProps): UsePaceDistributionResult => {
  // Filter activities with valid pace (exclude workouts without pace)
  const validActivities = useMemo(() => {
    return activities.filter(
      (activity) => activity.pace && activity.pace !== "N/A"
    );
  }, [activities]);

  // Define pace ranges (in seconds per km)
  const rangeDefinitions = useMemo(
    () => [
      { id: "1", label: '< 4\'00"', minSeconds: 0, maxSeconds: 240 },
      { id: "2", label: '4\'00" - 4\'30"', minSeconds: 240, maxSeconds: 270 },
      { id: "3", label: '4\'30" - 5\'00"', minSeconds: 270, maxSeconds: 300 },
      { id: "4", label: '5\'00" - 5\'30"', minSeconds: 300, maxSeconds: 330 },
      { id: "5", label: '5\'30" - 6\'00"', minSeconds: 330, maxSeconds: 360 },
      { id: "6", label: '6\'00" - 6\'30"', minSeconds: 360, maxSeconds: 390 },
      { id: "7", label: '6\'30" - 7\'00"', minSeconds: 390, maxSeconds: 420 },
      { id: "8", label: '> 7\'00"', minSeconds: 420, maxSeconds: Infinity },
    ],
    []
  );

  // Calculate pace distribution
  const paceRanges = useMemo(() => {
    const ranges: PaceRange[] = rangeDefinitions.map((def) => ({
      ...def,
      count: 0,
      percentage: 0,
      activities: [],
    }));

    validActivities.forEach((activity) => {
      const paceSeconds = paceToSeconds(activity.pace);
      const range = ranges.find(
        (r) => paceSeconds >= r.minSeconds && paceSeconds < r.maxSeconds
      );
      if (range) {
        range.count++;
        range.activities.push(activity);
      }
    });

    // Calculate percentages
    const total = validActivities.length;
    ranges.forEach((range) => {
      range.percentage = total > 0 ? (range.count / total) * 100 : 0;
    });

    return ranges;
  }, [validActivities, rangeDefinitions]);

  // Calculate pace statistics
  const paceStats = useMemo(() => {
    if (validActivities.length === 0) {
      return {
        fastest: "N/A",
        average: "N/A",
        slowest: "N/A",
        totalActivities: 0,
      };
    }

    const paceSeconds = validActivities.map((a) => paceToSeconds(a.pace));
    const fastest = Math.min(...paceSeconds);
    const slowest = Math.max(...paceSeconds);
    const average =
      paceSeconds.reduce((sum, p) => sum + p, 0) / paceSeconds.length;

    return {
      fastest: secondsToPace(fastest),
      average: secondsToPace(average),
      slowest: secondsToPace(slowest),
      totalActivities: validActivities.length,
    };
  }, [validActivities]);

  // Calculate average pace in seconds for highlighting
  const avgPaceSeconds = useMemo(() => {
    if (validActivities.length === 0) return 0;
    const paceSeconds = validActivities.map((a) => paceToSeconds(a.pace));
    return paceSeconds.reduce((sum, p) => sum + p, 0) / paceSeconds.length;
  }, [validActivities]);

  // Generate time series data (sorted by date)
  const timeSeriesData = useMemo(() => {
    const dataPoints: PaceDataPoint[] = validActivities.map((activity) => ({
      date: new Date(activity.date),
      dateString: activity.date,
      paceSeconds: paceToSeconds(activity.pace),
      paceString: activity.pace,
      activity,
    }));

    // Sort by date (ascending)
    return dataPoints.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [validActivities]);

  return {
    paceRanges,
    paceStats,
    avgPaceSeconds,
    timeSeriesData,
  };
};
