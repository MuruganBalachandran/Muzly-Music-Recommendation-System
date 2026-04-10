//region imports
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
//endregion

//region interfaces
interface UseApiDataOptions<T> {
  fetchFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  errorMessage?: string;
  autoFetch?: boolean;
}

interface UseApiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
//endregion

//region hook
/**
 * Custom hook for fetching API data with loading and error states
 * Provides consistent error handling and loading patterns
 * 
 * @param options - Configuration options
 * @returns Object with data, loading, error, and refetch function
 */
export function useApiData<T>({
  fetchFn,
  onSuccess,
  onError,
  errorMessage = 'Failed to load data',
  autoFetch = true
}: UseApiDataOptions<T>): UseApiDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(errorMessage);
      setError(error);
      toast.error(error.message || errorMessage);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onSuccess, onError, errorMessage]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData };
}
//endregion
