import api from '@/api/axios';
import { format } from 'date-fns';
import { AxiosError } from 'axios';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import type { UserActivity } from '@/types/History';

interface HistoryParams {
  page?: number;
  offset?: number;
  search?: string;
  from?: Date;
  to?: Date;
}

interface HistoryResponse {
  data: UserActivity[];
  userActivity: UserActivity[];
  nextId?: number;
  previousId?: number;
  hasMore?: boolean;
  total?: number;
}

export const useHistory = ({ page = 1, offset = 25, search = '', from, to }: HistoryParams) => {
  return useInfiniteQuery({
    queryKey: ['history', page, offset, search.trim(), from, to],
    queryFn: async ({ pageParam = page }): Promise<HistoryResponse> => {
      const params: Record<string, string | number> = {
        page: pageParam,
        offset,
      };

      if (search.trim()) {
        params.search = encodeURIComponent(search.trim());
      }

      if (from && to) {
        params.from = format(new Date(from), 'yyyy-MM-dd');
        params.to = format(new Date(to), 'yyyy-MM-dd');
      }

      try {
        const response = await api.get('/userActivity', { params });
        return response.data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          const message =
            error.response?.data?.message || error.response?.statusText || error.message || 'Failed to fetch data';
          throw new Error(`API Error: ${message}`);
        }

        throw error instanceof Error ? error : new Error('An unexpected error occurred');
      }
    },
    getPreviousPageParam: firstPage => firstPage.previousId,
    getNextPageParam: lastPage => lastPage.nextId,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });
};
