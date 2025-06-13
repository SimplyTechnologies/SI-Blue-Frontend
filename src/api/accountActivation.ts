import type { AccountActivationPayload } from '@/hooks/useActivateAccount';
import { AxiosError } from 'axios';
import api from './axios';

export const getUserDataOnAccountActivation = async (token: string) => {
  try {
    const response = await api.get(`/users/user/${token}`);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const message = axiosError.response?.data?.message || axiosError.message || 'Something went wrong';

    throw new Error(message);
  }
};

export const activateUser = async (data: AccountActivationPayload) => {
  const response = await api.post('/auth/activate-account', data);
  return response.data.data;
};

