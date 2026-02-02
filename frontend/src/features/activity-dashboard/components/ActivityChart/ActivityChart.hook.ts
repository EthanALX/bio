import { useMemo } from 'react';
import { Activity } from '../../types';
import type {
  WeeklyData,
  ChartDataPoint,
  UseActivityChartProps,
  UseActivityChartResult,
} from './ActivityChart.type';

export function useActivityChart({ activities }: UseActivityChartProps) {
    const weeklyData = useMemo(() => {
        console.log('=== Hook Processing ===');
        console.log('Input activities:', activities);
        
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
            
            console.log(`Week ${year}-W${weekNumber}:`, {
                activities: weekActivities,
                paceSeconds,
                bpms,
                avgPaceSeconds,
                avgBpm,
                runningDays: paceSeconds.length
            });

            weeks.push(weekData);
        });

        // Sort by year and week number
        weeks.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.weekNumber - b.weekNumber;
        });

        console.log('Final weekly data:', weeks);
        return weeks;
    }, [activities]);

    const chartData = useMemo(() => {
        console.log('\n=== Chart Data Calculation ===');
        console.log('Weekly data input:', weeklyData);
        
        if (!weeklyData.length) return [];

        // Get min/max for normalization
        const paceValues = weeklyData
            .filter(w => w.avgPaceSeconds > 0)
            .map(w => w.avgPaceSeconds);
        const bpmValues = weeklyData
            .filter(w => w.avgBpm > 0)
            .map(w => w.avgBpm);
        
        console.log('Pace values:', paceValues);
        console.log('BPM values:', bpmValues);
        
        // Handle case where no data exists
        if (paceValues.length === 0 || bpmValues.length === 0) {
            console.log('No valid pace or BPM data');
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
        
        console.log('Normalization ranges:', { paceMin, paceMax, bpmMin, bpmMax });

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
            
            console.log(`Chart point ${index}:`, dataPoint);
            return dataPoint;
        });
        
        console.log('Final chart data:', chartDataResult);
        return chartDataResult;
    }, [weeklyData]);

    return {
        chartData
    };
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}