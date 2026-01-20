import { useState } from 'react';
import { useActivityData, useAvailableYears } from '../../hooks';
import { YearData } from '../../types';

export type ViewMode = 'list' | 'calendar' | 'chart' | 'map';

export interface UseDashboardLayoutResult {
    state: {
        years: number[];
        selectedYear: number;
        viewMode: ViewMode;
        data: YearData | null;
        isLoading: boolean;
        error: Error | null;
    };
    actions: {
        setSelectedYear: (year: number) => void;
        setViewMode: (mode: ViewMode) => void;
    };
}

export const useDashboardLayout = (): UseDashboardLayoutResult => {
    const { years, loading: yearsLoading } = useAvailableYears();
    const [selectedYear, setSelectedYear] = useState<number>(2026);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const { data, loading, error } = useActivityData(selectedYear);

    const isLoading = yearsLoading || loading;

    return {
        state: {
            years,
            selectedYear,
            viewMode,
            data,
            isLoading,
            error: error as Error | null,
        },
        actions: {
            setSelectedYear,
            setViewMode,
        },
    };
};
