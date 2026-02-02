import { Activity } from '../../types';
import type {
  FormattedActivity,
  UseActivityListProps,
  UseActivityListResult,
} from './ActivityList.type';

export const useActivityList = ({ activities }: UseActivityListProps): UseActivityListResult => {
    const formattedActivities: FormattedActivity[] = activities.map((activity) => ({
        id: activity.id,
        distance: `${activity.distance} km`,
        pace: activity.pace,
        bpm: activity.bpm,
        time: activity.time,
        route: activity.route,
        coordinates: activity.coordinates,
        dateDisplay: new Date(activity.date).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\//g, '-'),
    }));

    return {
        state: {
            formattedActivities,
        },
    };
};
