import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import api from '@/api/axios';

type UnassignVehicleResponse = {
  message: string;
};

type UnassignVehicleParams = {
  customerId: number;
  vehicleId?: number;
  unassignAll?: boolean;
};

export const useUnassignVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation<UnassignVehicleResponse, Error, UnassignVehicleParams>({
    mutationFn: async (data: UnassignVehicleParams) => {
      const response = await api.post(`/vehicles/unassign`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customersList'] });
      queryClient.removeQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle unassigned successfully');
    },
    onError: error => {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || axiosError.message || 'Something went wrong';
      toast.error(message ?? 'Failed to unassign vehicle please try again');
    },
  });
};

