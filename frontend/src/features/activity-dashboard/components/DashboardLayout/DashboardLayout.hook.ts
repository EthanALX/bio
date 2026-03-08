import { useState } from "react";
import { useActivityData, useAvailableYears } from "../../hooks";
import type {
  ViewMode,
  DashboardLayoutState,
  DashboardLayoutActions,
  UseDashboardLayoutResult,
} from "./DashboardLayout.type";

export const useDashboardLayout = (): UseDashboardLayoutResult => {
  const { years, loading: yearsLoading } = useAvailableYears();
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

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
