import { Activity } from '../../types';

export interface CalendarDay {
    day: number;
    date: string;
    hasActivity: boolean;
}

export interface CalendarWeek {
    weekNumber: number;
    days: (CalendarDay | null)[];
}

export interface CalendarMonth {
    name: string;
    weeks: CalendarWeek[];
}

export interface UseActivityCalendarProps {
    activities: Activity[];
    year: number;
}

export interface UseActivityCalendarResult {
    state: {
        months: CalendarMonth[];
    };
}

export const useActivityCalendar = ({ activities, year }: UseActivityCalendarProps): UseActivityCalendarResult => {
    const monthNames = [
        'Jan 一月', 'Feb 二月', 'Mar 三月', 'Apr 四月', 'May 五月', 'Jun 六月',
        'Jul 七月', 'Aug 八月', 'Sep 九月', 'Oct 十月', 'Nov 十一月', 'Dec 十二月'
    ];

    // Create a map of dates to activities
    const activityMap = new Map<string, Activity>();
    activities.forEach((activity) => {
        activityMap.set(activity.date, activity);
    });

    // Get week number of the year for a date
    const getWeekNumber = (date: Date): number => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    // Generate weeks for each month
    const generateMonthWeeks = (monthIndex: number): CalendarWeek[] => {
        const firstDay = new Date(year, monthIndex, 1);
        const lastDay = new Date(year, monthIndex + 1, 0);
        const weeks: CalendarWeek[] = [];

        let currentWeek: (CalendarDay | null)[] = [];
        let currentWeekNumber = getWeekNumber(firstDay);

        // Add empty cells for days before the first day of the month
        const firstDayOfWeek = firstDay.getDay();
        for (let i = 0; i < firstDayOfWeek; i++) {
            currentWeek.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, monthIndex, day);
            const dateString = date.toISOString().split('T')[0];
            const hasActivity = activityMap.has(dateString);

            currentWeek.push({ day, date: dateString, hasActivity });

            // If week is complete (7 days), start a new week
            if (currentWeek.length === 7) {
                weeks.push({ weekNumber: currentWeekNumber, days: [...currentWeek] });
                currentWeek = [];
                currentWeekNumber = getWeekNumber(new Date(year, monthIndex, day + 1));
            }
        }

        // Add remaining days to the last week
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push({ weekNumber: currentWeekNumber, days: currentWeek });
        }

        return weeks;
    };

    const months: CalendarMonth[] = monthNames.map((name, index) => ({
        name,
        weeks: generateMonthWeeks(index),
    }));

    return {
        state: {
            months,
        },
    };
};
