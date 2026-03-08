import { useState } from "react";
import {
  useActivityData,
  useAvailableYears,
  useGlobalStats,
} from "../../hooks";
import type {
  ViewMode,
  DashboardLayoutState,
  DashboardLayoutActions,
  UseDashboardLayoutResult,
} from "./DashboardLayout.type";

export const useDashboardLayout = (): UseDashboardLayoutResult => {
  const { years, loading: yearsLoading } = useAvailableYears();
  const { data: globalStats, loading: globalStatsLoading } = useGlobalStats();
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { data, loading, error } = useActivityData(selectedYear);

  const isLoading = yearsLoading || loading || globalStatsLoading;

  return {
    state: {
      years,
      selectedYear,
      viewMode,
      data,
      globalStats,
      globalStatsLoading,
      isLoading,
      error: error as Error | null,
    },
    actions: {
      setSelectedYear,
      setViewMode,
    },
  };
};
