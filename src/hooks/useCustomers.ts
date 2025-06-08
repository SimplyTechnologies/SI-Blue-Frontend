import api from '@/api/axios';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import type { CustomersResponse } from '@/types/Customers';

interface PaginationParams {
  page?: number;
  offset?: number;
  search?: string;
}

export const useGetCustomers = ({ page = 1, offset = 5, search = '' }: PaginationParams = {}) => {
  return useQuery({
    queryKey: ['customersList', page, offset, search],
    queryFn: async (): Promise<CustomersResponse> => {
      try {
        const params: { page: number; offset: number, search?: string } = { page, offset };

        if(search.trim()) {
          params.search = search.trim();
        }

        const response = await api.get(`/customers/get-customers`, {
          params,
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Failed to fetch customers';
        throw new Error(message);
      }
    },
  });
};
