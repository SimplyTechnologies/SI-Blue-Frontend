import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '@/api/axios';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/users/deactivate-user/${id}`);
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usersList'] });
      toast.success('User deleted successfully');
    },
    onError: error => {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || axiosError.message || 'Failed to delete user';
      toast.error(message);
    },
  });
};
