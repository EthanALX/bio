import { useState, useEffect, useRef } from "react";
import { useActivityData, useAvailableYears } from "../../hooks";
import { YearData } from "../../types";

export type ViewMode = "list" | "calendar" | "chart" | "map";

export interface UseDashboardLayoutResult {
  state: {
    years: number[];
    selectedYear: number;
    viewMode: ViewMode;
    data: YearData | null;
    isLoading: boolean;
    error: Error | null;
    isSidebarFixed: boolean;
    sidebarLeft: number;
  };
  actions: {
    setSelectedYear: (year: number) => void;
    setViewMode: (mode: ViewMode) => void;
  };
  refs: {
    sidebarRef: React.RefObject<HTMLDivElement | null>;
  };
}

export const useDashboardLayout = (): UseDashboardLayoutResult => {
  const { years, loading: yearsLoading } = useAvailableYears();
  const [selectedYear, setSelectedYear] = useState<number>(2022);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isSidebarFixed, setIsSidebarFixed] = useState<boolean>(false);
  const [sidebarLeft, setSidebarLeft] = useState<number>(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useActivityData(selectedYear);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      console.log("sss", scrollY);

      const shouldBeFixed = scrollY > 100;
      setIsSidebarFixed(shouldBeFixed);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (sidebarRef.current && !isSidebarFixed) {
        const rect = sidebarRef.current.getBoundingClientRect();
        const scrollLeft =
          window.pageXOffset || document.documentElement.scrollLeft;
        setSidebarLeft(rect.left + scrollLeft);
      }
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isSidebarFixed, data, loading]);

  const isLoading = yearsLoading || loading;

  return {
    state: {
      years,
      selectedYear,
      viewMode,
      data,
      isLoading,
      error: error as Error | null,
      isSidebarFixed,
      sidebarLeft,
    },
    actions: {
      setSelectedYear,
      setViewMode,
    },
    refs: {
      sidebarRef,
    },
  };
};
