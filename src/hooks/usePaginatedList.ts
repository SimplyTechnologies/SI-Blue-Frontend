import api from '@/api/axios';
import { AxiosError } from 'axios';
import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { CustomersResponse } from '@/types/Customer';
import type { UsersResponse } from '@/types/User';

type QueryKey = 'customersList' | 'usersList';

interface PaginatedListParams {
  endpoint: string;
  queryKey: QueryKey;
  page?: number;
  offset?: number;
  search?: string;
}

type PaginatedListResponse<T extends QueryKey> = T extends 'customersList'
  ? CustomersResponse
  : T extends 'usersList'
    ? UsersResponse
    : never;

export const usePaginatedList = <T extends QueryKey>({
  endpoint,
  queryKey,
  page = 1,
  offset = 5,
  search = '',
}: PaginatedListParams & { queryKey: T }): UseQueryResult<PaginatedListResponse<T>, Error> => {
  return useQuery({
    queryKey: [queryKey, page, offset, search.trim()],
    queryFn: async (): Promise<PaginatedListResponse<T>> => {
      const params: Record<string, string | number> = {
        page,
        offset,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      try {
        const response = await api.get(endpoint, { params });
        return response.data.data as PaginatedListResponse<T>;
      } catch (error) {
        if (error instanceof AxiosError) {
          const message =
            error.response?.data?.message || error.response?.statusText || error.message || 'Failed to fetch data';
          throw new Error(`API Error: ${message}`);
        }

        throw error instanceof Error ? error : new Error('An unexpected error occurred');
      }
    },
    placeholderData: keepPreviousData
  });
};
