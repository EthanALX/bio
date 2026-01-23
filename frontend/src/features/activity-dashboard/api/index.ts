import { Activity, YearData, ActivityStats } from '../types';
import activitiesData from '../../../mocks/activities.json';

// Cast the imported data to Activity[] to ensure types match
const allActivities = activitiesData as unknown as Activity[];

/**
 * Helper to calculate stats from a list of activities
 */
function calculateStats(activities: Activity[]): ActivityStats {
    const totalDistance = activities.reduce((sum, act) => sum + act.distance, 0);

    // Count distinct days
    const days = new Set(activities.map(act => act.date.split('T')[0])).size;

    // Calculate average pace (total seconds / total km)
    let totalSeconds = 0;
    activities.forEach(act => {
        // Parse "30m" or "1h 23m" or "56m 00s"
        // The mock data currently has "30m".
        // joy.htm parser produced "30m" or "1h 30m".
        const parts = act.time.match(/(\d+)h/);
        const hours = parts ? parseInt(parts[1]) : 0;
        const minParts = act.time.match(/(\d+)m/);
        const minutes = minParts ? parseInt(minParts[1]) : 0;
        const secParts = act.time.match(/(\d+)s/);
        const seconds = secParts ? parseInt(secParts[1]) : 0;

        totalSeconds += hours * 3600 + minutes * 60 + seconds;
    });

    // Valid distance check
    if (totalDistance === 0) {
        return { Distance: 0, Days: 0, AvgPace: "0'00\"/km", Routes: 0 };
    }

    const avgPaceSeconds = totalSeconds / totalDistance;
    const paceMin = Math.floor(avgPaceSeconds / 60);
    const paceSec = Math.floor(avgPaceSeconds % 60);
    const avgPace = `${paceMin}'${paceSec.toString().padStart(2, '0')}"/km`;

    // Count routes (just count total activities for simplicity, or unique route names)
    // "Routes" usually implies tracks.
    const routeCount = activities.filter(a => a.coordinates && a.coordinates.length > 0).length;
    // Fallback: if no coords, maybe just total count or unique locations
    const totalCount = activities.length;

    return {
        Distance: parseFloat(totalDistance.toFixed(1)),
        Days: days,
        AvgPace: avgPace,
        Routes: routeCount,
    };
}

/**
 * Fetch activity data for a specific year
 */
export async function fetchYearData(year: number): Promise<YearData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const yearActivities = allActivities.filter(act => {
        const actYear = new Date(act.date).getFullYear();
        return actYear === year;
    });

    const stats = calculateStats(yearActivities);

    return {
        year,
        stats,
        activities: yearActivities,
    };
}

/**
 * Fetch available years
 */
export async function fetchAvailableYears(): Promise<number[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const years = new Set(allActivities.map(act => new Date(act.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
}

