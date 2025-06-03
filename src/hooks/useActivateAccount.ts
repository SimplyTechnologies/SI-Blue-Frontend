import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import type { User } from '@/types/User';

type AccountActivationPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  remember?: boolean;
};

type AccountActivationResponse = {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

const apiUrl = import.meta.env.VITE_API_URL;

export const useActivateAccount = () => {
  return useMutation<AccountActivationResponse, Error, AccountActivationPayload>({
    mutationFn: async (data: AccountActivationPayload) => {
      try {
        const response = await axios.post(`${apiUrl}/auth/activate-account`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Account Activation failed';

        throw new Error(message);
      }
    },
  });
};

