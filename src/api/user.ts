import api from '@/api/axios';
import type { UpdateUserRequest } from '@/types/User';

export const updateUser = async (body: UpdateUserRequest) => {
  const response = await api.put(`/users/update-user`, body);
  return response.data;
};
