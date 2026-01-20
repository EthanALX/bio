export interface Activity {
    id: string;
    date: string; // ISO date string
    distance: number; // in km
    pace: string; // e.g., "5'20\"/km"
    bpm: number; // heart rate
    time: string; // duration, e.g., "1h 23m"
    route: string; // route name
    type: 'run' | 'workout' | 'cycling'; // activity type
    coordinates?: Array<{ lat: number; lng: number }>; // for map visualization
}

export interface ActivityStats {
    Distance: number; // in km
    Days: number;
    AvgPace: string;
    Routes: number;
}

export interface YearData {
    year: number;
    stats: ActivityStats;
    activities: Activity[];
}
