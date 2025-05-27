import useAuthStore from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import type { Vehicle } from '@/types/Vehicle';
import axios, { AxiosError } from 'axios';

type GetVehiclesResponse = {
  vehicles: Vehicle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const apiUrl = import.meta.env.VITE_API_URL;

export const useGetVehicles = () => {
  const user = useAuthStore(state => state.user);

  return useQuery<GetVehiclesResponse>({
    queryKey: ['vehicles'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${apiUrl}/vehicles/${user?.id}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Failed to fetch vehicles';

        throw new Error(message);
      }
    },
    staleTime: 1000 * 60 * 2,
    // keepPreviousData: true,
  });
};
