import { addFavorite, removeFavorite } from '@/api/vehicles';
import type { AddRemoveFavoriteResponse, AddRemoveFavoriteWithMethod } from '@/types/vehicles';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useFavoriteToggle = () => {
  return useMutation<AddRemoveFavoriteResponse, Error, AddRemoveFavoriteWithMethod>({
    mutationFn: async (data: AddRemoveFavoriteWithMethod) => {
      try {
        const response =
          data.method === 'POST'
            ? addFavorite({ vehicleId: data.vehicleId })
            : removeFavorite({ vehicleId: data.vehicleId });
        return response;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Something went wrong';

        throw new Error(message);
      }
    },
  });
};

