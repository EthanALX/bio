import { useState, useMemo } from 'react';
import { Activity } from '../../types';

export type ChartType = 'pace' | 'bpm';

interface UseActivityChartProps {
    activities: Activity[];
}

export function useActivityChart({ activities }: UseActivityChartProps) {
    const [activeTab, setActiveTab] = useState<ChartType>('pace');

    const chartData = useMemo(() => {
        if (!activities.length) return [];

        // Parse values based on type
        const parsed = activities.map(a => {
            let value = 0;
            if (activeTab === 'bpm') {
                value = a.bpm;
            } else {
                // Parse pace "5'20\"/km" -> total seconds
                const match = a.pace.match(/(\d+)'(\d+)/);
                if (match) {
                    value = parseInt(match[1]) * 60 + parseInt(match[2]);
                }
            }
            return { ...a, numericValue: value };
        });

        const values = parsed.map(p => p.numericValue);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min || 1;

        return parsed.map(p => ({
            id: p.id,
            date: p.date,
            displayValue: activeTab === 'bpm' ? `${p.bpm} BPM` : p.pace,
            // For pace, lower is "better" but usually charts show higher bars for higher values.
            // However, "dynamic" often means literal magnitude.
            // Let's normalize so it fits 0-100%
            percent: ((p.numericValue - min * 0.8) / (max - min * 0.8 || 1)) * 100
        }));
    }, [activities, activeTab]);

    return {
        activeTab,
        setActiveTab,
        chartData
    };
}
