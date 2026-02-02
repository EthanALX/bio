import { Activity } from '../../types';
import type {
  ActivityLevel,
  GitHubDay,
  GitHubWeek,
  GitHubMonth,
  GitHubCalendarState,
  UseGitHubCalendarProps,
  UseGitHubCalendarResult,
} from './GitHubCalendar.type';

export const useGitHubCalendar = ({ activities, year }: UseGitHubCalendarProps): UseGitHubCalendarResult => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const distanceMap = new Map<string, number>();
    activities.forEach((activity) => {
        const currentDistance = distanceMap.get(activity.date) || 0;
        distanceMap.set(activity.date, currentDistance + activity.distance);
    });

    const getLevel = (distance: number): 'level-0' | 'level-1' | 'level-2' | 'level-3' | 'level-4' | 'level-5' | 'level-6' | 'level-7' => {
        if (distance === 0) return 'level-0';
        if (distance < 5) return 'level-1';
        if (distance < 10) return 'level-2';
        if (distance < 15) return 'level-3';
        if (distance < 20) return 'level-4';
        if (distance < 25) return 'level-5';
        if (distance < 30) return 'level-6';
        return 'level-7';
    };

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    const startDayOfWeek = startDate.getDay();
    const firstSunday = new Date(startDate);
    if (startDayOfWeek !== 0) {
        firstSunday.setDate(startDate.getDate() - startDayOfWeek);
    }
    
    const lastDayOfWeek = endDate.getDay();
    const lastSaturday = new Date(endDate);
    if (lastDayOfWeek !== 6) {
        lastSaturday.setDate(endDate.getDate() + (6 - lastDayOfWeek));
    }

    const weeks: GitHubWeek[] = [];
    const months: GitHubMonth[] = [];
    
    const currentDate = new Date(firstSunday);
    let weekIndex = 0;

    monthNames.forEach((monthName, monthIndex) => {
        const monthStart = new Date(year, monthIndex, 1);
        const monthEnd = new Date(year, monthIndex + 1, 0);
        
        let monthStartWeek = -1;
        let monthEndWeek = -1;
        
        let tempDate = new Date(firstSunday);
        let tempWeekIndex = 0;
        
        while (tempDate <= lastSaturday) {
            const weekStart = new Date(tempDate);
            const weekEnd = new Date(tempDate);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            if (monthStartWeek === -1 && weekEnd >= monthStart) {
                monthStartWeek = tempWeekIndex;
            }
            
            if (monthStartWeek !== -1 && weekStart <= monthEnd) {
                monthEndWeek = tempWeekIndex + 1;
            }
            
            tempDate.setDate(tempDate.getDate() + 7);
            tempWeekIndex++;
        }
        
        if (monthStartWeek !== -1) {
            months.push({
                name: monthName,
                startWeek: monthStartWeek,
                endWeek: Math.max(monthEndWeek, monthStartWeek + 1)
            });
        }
    });

    while (currentDate <= lastSaturday) {
        const week: GitHubWeek = { days: [] };
        
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const dayDate = new Date(currentDate);
            dayDate.setDate(currentDate.getDate() + dayOffset);
            
            if (dayDate.getFullYear() !== year) {
                week.days.push(null);
            } else {
                const dateString = dayDate.toISOString().split('T')[0];
                const distance = distanceMap.get(dateString) || 0;
                
                week.days.push({
                    date: dateString,
                    distance,
                    level: getLevel(distance)
                });
            }
        }
        
        weeks.push(week);
        currentDate.setDate(currentDate.getDate() + 7);
        weekIndex++;
    }

    const dayLabelColors = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, dayIndex) => {
        return weeks.map((week, weekIndex) => {
            const day = week.days[dayIndex];
            if (day && day.distance > 0) {
                return day.level;
            } else {
                return 'level-0';
            }
        });
    });

    const dayLabelDates = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, dayIndex) => {
        const dayNumbers: string[] = [];
        
        weeks.forEach((week, weekIndex) => {
            if (week.days[dayIndex] && week.days[dayIndex]!.date) {
                const date = new Date(week.days[dayIndex]!.date);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                dayNumbers.push(`${month}/${day}`);
            }
        });
        
        return dayNumbers.join(', ');
    });

    return {
        state: {
            weeks,
            months,
            dayLabels,
            dayLabelColors,
            dayLabelDates
        }
    };
};