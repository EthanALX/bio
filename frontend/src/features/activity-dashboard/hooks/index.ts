import { useState, useEffect } from "react";
import { YearData } from "../types";
import {
  fetchYearData,
  fetchAvailableYears,
  fetchGlobalStats,
  GlobalStats,
} from "../api";

export function useActivityData(year: number) {
  const [data, setData] = useState<YearData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const yearData = await fetchYearData(year);
        if (isMounted) {
          setData(yearData);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to load data"),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [year]);

  return { data, loading, error };
}

export function useAvailableYears() {
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadYears() {
      try {
        const availableYears = await fetchAvailableYears();
        if (isMounted) {
          setYears(availableYears);
        }
      } catch (err) {
        console.error("Failed to load available years:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadYears();

    return () => {
      isMounted = false;
    };
  }, []);

  return { years, loading };
}

export function useGlobalStats() {
  const [data, setData] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadGlobalStats() {
      try {
        setLoading(true);
        setError(null);
        const globalStats = await fetchGlobalStats();
        if (isMounted) {
          setData(globalStats);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load global stats"),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadGlobalStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
