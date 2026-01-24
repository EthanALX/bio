import { useMemo } from 'react';
import { Activity } from '../../types';

interface UseActivityChartProps {
    activities: Activity[];
}

export function useActivityChart({ activities }: UseActivityChartProps) {
    const chartData = useMemo(() => {
        if (!activities.length) return [];

        const MAX_PACE_SECONDS = 450; // 7'30"

        const parsed = activities.map(a => {
            let paceSeconds = 0;
            const match = a.pace.match(/(\d+)'(\d+)/);
            if (match) {
                paceSeconds = parseInt(match[1]) * 60 + parseInt(match[2]);
            }
            return {
                ...a,
                paceSeconds,
                bpm: a.bpm
            };
        });



        const bpmValues = parsed.map(p => p.bpm).filter(v => v > 0);
        const bpmMax = Math.max(...bpmValues);
        const bpmMin = Math.min(...bpmValues);

        return parsed.map(p => ({
            id: p.id,
            date: p.date,
            paceValue: p.pace,
            bpmValue: `${p.bpm} BPM`,
            // Normalize for display
            // Constant baseline: 7'30" (450s) = 100% width
            // Faster pace (smaller seconds) = shorter width
            pacePercent: Math.min((p.paceSeconds / MAX_PACE_SECONDS) * 100, 100),
            hrPercent: ((p.bpm - bpmMin * 0.9) / (bpmMax - bpmMin * 0.9 || 1)) * 100
        }));
    }, [activities]);

    return {
        chartData
    };
}
