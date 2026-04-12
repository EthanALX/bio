"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { ViewMode } from "../components/DashboardLayout/DashboardLayout.type";

interface DashboardQueryState {
  year: number;
  view: ViewMode;
  setYear: (year: number) => void;
  setView: (view: ViewMode) => void;
}

const VALID_VIEWS: ViewMode[] = ["list", "calendar", "chart", "map"];

function parseView(raw: string | null): ViewMode {
  if (raw && VALID_VIEWS.includes(raw as ViewMode)) {
    return raw as ViewMode;
  }
  return "list";
}

export function useDashboardQueryState(
  defaultYear: number = 2025,
): DashboardQueryState {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const year = Number(searchParams.get("year")) || defaultYear;
  const view = parseView(searchParams.get("view"));

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        params.set(key, value);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const setYear = useCallback(
    (y: number) => updateParams({ year: String(y), view }),
    [updateParams, view],
  );

  const setView = useCallback(
    (v: ViewMode) => updateParams({ year: String(year), view: v }),
    [updateParams, year],
  );

  return { year, view, setYear, setView };
}
