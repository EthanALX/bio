import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types';

export function useApi<T>(endpoint: string, immediate = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ApiResponse<T>>(endpoint);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [endpoint, immediate]);

  return { data, loading, error, execute };
}
