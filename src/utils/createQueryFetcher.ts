import { fetchData } from "./fetch-data";

export function createQueryFetcher<T>(
  endpoint: string,
  params?: Record<string, string | number>
) {
  return async ({ signal }: { signal?: AbortSignal }) => {
    return fetchData<T>(endpoint, params, signal);
  };
}
