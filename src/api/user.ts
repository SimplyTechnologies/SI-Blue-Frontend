import api from '@/api/axios';
import type { AddNewUserType, UpdateUserRequest } from '@/types/User';


export const updateUser = async (body: UpdateUserRequest) => {
  const response = await api.put(`/users/update-user`, body);
  return response.data.data;
};

export const addUser = async (user: AddNewUserType) => {
  const response = await api.post(`/users/add-user`, user)
  return response.data.data
}

export const updateUserAvatar = async (id: number, body: FormData) => {
  const response = await api.post(`/users/upload-avatar/${id}`, body);
  return response.data.data;
};

export const deleteUserAvatar = async (id: number) => {
    const response = await api.delete(`/users/delete-avatar/${id}`);
    return response.data.data;
};
