import { useMemo } from 'react';
import { Activity } from '../../types';
import type {
  WeeklyData,
  ChartDataPoint,
  HierarchyNode,
  UseActivityChartProps,
  UseActivityChartResult,
} from './ActivityChart.type';

export function useActivityChart({ activities }: UseActivityChartProps) {
    const weeklyData = useMemo(() => {
        if (!activities.length) return [];

        // Group activities by week
        const weeksMap = new Map<string, Activity[]>();
        
        activities.forEach(activity => {
            const date = new Date(activity.date);
            const year = date.getFullYear();
            const weekNumber = getWeekNumber(date);
            const key = `${year}-W${weekNumber}`;
            
            if (!weeksMap.has(key)) {
                weeksMap.set(key, []);
            }
            weeksMap.get(key)!.push(activity);
        });

        // Convert to array and sort by week
        const weeks: WeeklyData[] = [];
        weeksMap.forEach((weekActivities, key) => {
            const [year, weekStr] = key.split('-W');
            const weekNumber = parseInt(weekStr);
            
            // Calculate weekly averages based on actual running days
            const paceSeconds = weekActivities
                .map(a => {
                    const match = a.pace.match(/(\d+)'(\d+)/);
                    return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
                })
                .filter(s => s > 0);
            
            const bpms = weekActivities.map(a => a.bpm).filter(b => b > 0);
            
            const avgPaceSeconds = paceSeconds.length > 0 
                ? paceSeconds.reduce((sum, s) => sum + s, 0) / paceSeconds.length 
                : 0;
                
            const avgBpm = bpms.length > 0 
                ? bpms.reduce((sum, b) => sum + b, 0) / bpms.length 
                : 0;

            const weekData = {
                weekNumber,
                year: parseInt(year),
                activities: weekActivities,
                avgPaceSeconds,
                avgBpm,
                runningDays: paceSeconds.length
            };

            weeks.push(weekData);
        });

        // Sort by year and week number
        weeks.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.weekNumber - b.weekNumber;
        });

        return weeks;
    }, [activities]);

    const chartData = useMemo(() => {
        if (!weeklyData.length) return [];

        // Get min/max for normalization
        const paceValues = weeklyData
            .filter(w => w.avgPaceSeconds > 0)
            .map(w => w.avgPaceSeconds);
        const bpmValues = weeklyData
            .filter(w => w.avgBpm > 0)
            .map(w => w.avgBpm);

        // Handle case where no data exists
        if (paceValues.length === 0 || bpmValues.length === 0) {
            return weeklyData.map((week) => ({
                id: `${week.year}-W${week.weekNumber}`,
                weekNumber: week.weekNumber,
                year: week.year,
                runningDays: week.runningDays,
                paceValue: '',
                bpmValue: '',
                pacePercent: 0,
                hrPercent: 0,
                hasData: false
            }));
        }
        
        const paceMin = Math.min(...paceValues);
        const paceMax = Math.max(...paceValues);
        const bpmMin = Math.min(...bpmValues);
        const bpmMax = Math.max(...bpmValues);

        const chartDataResult = weeklyData.map((week, index) => {
            const paceSeconds = week.avgPaceSeconds;
            const bpm = week.avgBpm;
            
            // Format pace for display
            const paceMinutes = Math.floor(paceSeconds / 60);
            const paceSecs = Math.round(paceSeconds % 60);
            const paceValue = paceSeconds > 0 ? `${paceMinutes}'${String(paceSecs).padStart(2, '0')}"` : '';
            
            const dataPoint = {
                id: `${week.year}-W${week.weekNumber}`,
                weekNumber: week.weekNumber,
                year: week.year,
                runningDays: week.runningDays,
                paceValue,
                bpmValue: bpm > 0 ? `${Math.round(bpm)} BPM` : '',
                // Normalize for display - reversed for pace (lower is better)
                pacePercent: paceSeconds > 0 
                    ? ((paceMax - paceSeconds) / (paceMax - paceMin || 1)) * 100 
                    : 0,
                hrPercent: bpm > 0 
                    ? ((bpm - bpmMin * 0.9) / (bpmMax - bpmMin * 0.9 || 1)) * 100 
                    : 0,
                hasData: paceSeconds > 0 || bpm > 0
            };

            return dataPoint;
        });

        return chartDataResult;
    }, [weeklyData]);

    // Build hierarchy data for treemap/sunburst visualization
    const hierarchyData = useMemo(() => {
        if (!activities.length) {
            return createEmptyHierarchyNode();
        }

        // Get year from first activity
        const year = new Date(activities[0].date).getFullYear();
        
        // Create root year node
        const yearNode: HierarchyNode = {
            id: String(year),
            name: String(year),
            level: 'year',
            value: 0,
            count: 0,
            avgPace: '',
            children: []
        };

        // Group by quarter
        const quartersMap = new Map<string, Activity[]>();
        
        activities.forEach(activity => {
            const date = new Date(activity.date);
            const month = date.getMonth();
            const quarterIndex = Math.floor(month / 3);
            const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
            const quarterKey = quarterNames[quarterIndex];
            
            if (!quartersMap.has(quarterKey)) {
                quartersMap.set(quarterKey, []);
            }
            quartersMap.get(quarterKey)!.push(activity);
        });

        // Build quarter nodes
        quartersMap.forEach((quarterActivities, quarterKey) => {
            const quarterNode: HierarchyNode = {
                id: `${year}-${quarterKey}`,
                name: `${year} ${quarterKey}`,
                level: 'quarter',
                value: 0,
                count: 0,
                avgPace: '',
                children: [],
                parent: yearNode
            };

            // Group by month within quarter
            const monthsMap = new Map<string, Activity[]>();
            
            quarterActivities.forEach(activity => {
                const date = new Date(activity.date);
                const monthName = date.toLocaleString('en-US', { month: 'short' });
                
                if (!monthsMap.has(monthName)) {
                    monthsMap.set(monthName, []);
                }
                monthsMap.get(monthName)!.push(activity);
            });

            // Build month nodes
            monthsMap.forEach((monthActivities, monthName) => {
                const totalDistance = monthActivities.reduce((sum, a) => sum + a.distance, 0);
                const avgPace = calculateAveragePace(monthActivities);
                
                const monthNode: HierarchyNode = {
                    id: `${year}-${quarterKey}-${monthName}`,
                    name: monthName,
                    level: 'month',
                    value: totalDistance,
                    count: monthActivities.length,
                    avgPace: avgPace,
                    parent: quarterNode
                };

                quarterNode.children!.push(monthNode);
                quarterNode.value += totalDistance;
                quarterNode.count += monthActivities.length;
            });

            // Calculate quarter average pace
            quarterNode.avgPace = calculateAveragePace(quarterActivities);
            
            yearNode.children!.push(quarterNode);
            yearNode.value += quarterNode.value;
            yearNode.count += quarterNode.count;
        });

        // Calculate year average pace
        yearNode.avgPace = calculateAveragePace(activities);

        return yearNode;
    }, [activities]);

    return {
        chartData,
        hierarchyData
    };
}

// Helper function to calculate average pace from activities
function calculateAveragePace(activities: Activity[]): string {
    const paceSeconds = activities
        .map(a => {
            const match = a.pace.match(/(\d+)'(\d+)/);
            return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
        })
        .filter(s => s > 0);
    
    if (paceSeconds.length === 0) return '';
    
    const avgSeconds = paceSeconds.reduce((sum, s) => sum + s, 0) / paceSeconds.length;
    const minutes = Math.floor(avgSeconds / 60);
    const seconds = Math.round(avgSeconds % 60);
    return `${minutes}'${String(seconds).padStart(2, '0')}"`;
}

// Helper function to create empty hierarchy node
function createEmptyHierarchyNode(): HierarchyNode {
    return {
        id: 'empty',
        name: 'No Data',
        level: 'year',
        value: 0,
        count: 0,
        avgPace: ''
    };
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}