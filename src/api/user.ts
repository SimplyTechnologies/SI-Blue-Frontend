import api from '@/api/axios';
import type { AddNewUserType, UpdateUserRequest } from '@/types/User';


export const updateUser = async (body: UpdateUserRequest) => {
  const response = await api.put(`/users/update-user`, body);
  return response.data;
};

export const addUser = async (user: AddNewUserType) => {
  const response = await api.post(`/users/add-user`, user)
  return response.data
}
