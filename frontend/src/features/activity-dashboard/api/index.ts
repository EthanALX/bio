import { Activity, YearData } from '../types';

// Mock data for development
const mockActivities: Activity[] = [
    {
        id: '1',
        date: '2026-01-15',
        distance: 10.5,
        pace: "5'20\"/km",
        bpm: 145,
        time: '56m 00s',
        route: 'Morning Run',
        type: 'run',
    },
    {
        id: '2',
        date: '2026-01-14',
        distance: 5.2,
        pace: "5'45\"/km",
        bpm: 138,
        time: '29m 54s',
        route: 'Evening Jog',
        type: 'run',
    },
    {
        id: '3',
        date: '2026-01-12',
        distance: 15.8,
        pace: "5'10\"/km",
        bpm: 152,
        time: '1h 21m 38s',
        route: 'Long Distance',
        type: 'run',
    },
];

/**
 * Fetch activity data for a specific year
 * TODO: Replace with actual API call
 */
export async function fetchYearData(year: number): Promise<YearData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        year,
        stats: {
            Distance: 2020,
            Days: 245,
            AvgPace: "5'20\"/km",
            Routes: 18,
        },
        activities: mockActivities,
    };
}

/**
 * Fetch available years
 * TODO: Replace with actual API call
 */
export async function fetchAvailableYears(): Promise<number[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [2026, 2025, 2024, 2023, 2022];
}
