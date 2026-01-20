import { Activity } from '../../types';

export interface FormattedActivity {
    id: string;
    distance: string;
    pace: string;
    bpm: number;
    time: string;
    route: string;
    coordinates?: Array<{ lat: number; lng: number }>;
    dateDisplay: string;
}

export interface UseActivityListProps {
    activities: Activity[];
}

export interface UseActivityListResult {
    state: {
        formattedActivities: FormattedActivity[];
    };
}

export const useActivityList = ({ activities }: UseActivityListProps): UseActivityListResult => {
    const formattedActivities: FormattedActivity[] = activities.map((activity) => ({
        id: activity.id,
        distance: `${activity.distance} km`,
        pace: activity.pace,
        bpm: activity.bpm,
        time: activity.time,
        route: activity.route,
        coordinates: activity.coordinates,
        dateDisplay: `${activity.date} 15:10`, // Preserving the user's custom formatting requirement
    }));

    return {
        state: {
            formattedActivities,
        },
    };
};
