import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '@/api/axios';
import { updateUserAvatar, deleteUserAvatar } from '@/api/user';
import type { UpdateAvatarRequest, UpdateAvatarResponse } from '@/types/User';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/users/deactivate-user/${id}`);
      return response.data.data;
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

export const useUploadAvatar = () => {
  return useMutation<UpdateAvatarResponse, Error, UpdateAvatarRequest>({
    mutationFn: async (data: UpdateAvatarRequest) => {
      return  await updateUserAvatar(data.id, data.body);
    },
    onSuccess: () => {
      toast.success('Avatar uploaded successfully');
    },
    onError: error => {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || axiosError.message;
      toast.error(message ?? 'Failed to upload avatar. Please try again.');
    },
  });
};

export const useDeleteAvatar = () => {
  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      return deleteUserAvatar(id);
    },
    onSuccess: () => {
      toast.success('Avatar deleted successfully');
    },
    onError: error => {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || axiosError.message;
      toast.error(message ?? 'Failed to delete avatar. Please try again.');
    },
  });
};
