import type { User } from '@/types/User';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
};

type LoginResponse = {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

const apiUrl = import.meta.env.VITE_API_URL;

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (data: LoginPayload) => {
      try {
        const response = await axios.post(`${apiUrl}/auth/login`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Login failed';

        throw new Error(message);
      }
    },
  });
};
