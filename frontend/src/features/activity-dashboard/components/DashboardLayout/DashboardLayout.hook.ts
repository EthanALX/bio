import { useActivityData, useAvailableYears, useGlobalStats } from "../../hooks";
import { useDashboardQueryState } from "../../hooks/useDashboardQueryState";
import type {
  DashboardLayoutState,
  DashboardLayoutActions,
  UseDashboardLayoutResult,
} from "./DashboardLayout.type";

export const useDashboardLayout = (): UseDashboardLayoutResult => {
  const { years, loading: yearsLoading } = useAvailableYears();
  const { data: globalStats, loading: globalStatsLoading } = useGlobalStats();
  const { year: selectedYear, view: viewMode, setYear: setSelectedYear, setView: setViewMode } = useDashboardQueryState();

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
