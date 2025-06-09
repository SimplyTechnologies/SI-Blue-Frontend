import type { AccountActivationPayload } from '@/hooks/useActivateAccount';
import axios, { AxiosError } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const getUserDataOnAccountActivation = async (token: string) => {
  try {
    const response = await axios.get(`${apiUrl}/users/user/${token}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const message = axiosError.response?.data?.message || axiosError.message || 'Something went wrong';

    throw new Error(message);
  }
};

export const activateUser = async (data: AccountActivationPayload) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/activate-account`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const message = axiosError.response?.data?.message || axiosError.message || 'Something went wrong';

    throw new Error(message);
  }
};

