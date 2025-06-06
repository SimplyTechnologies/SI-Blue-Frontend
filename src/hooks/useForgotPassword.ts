import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

interface ForgotPasswordPayload {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;
const FORGET_PASSWORD_ENDPOINT = '/auth/forgot-password';

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
      if (!payload.email?.trim()) {
        throw new Error('Email is required');
      }

      try {
        const response = await axios.post<ForgotPasswordResponse>(
          `${API_BASE_URL}${FORGET_PASSWORD_ENDPOINT}`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Login failed';

        throw new Error(message);
      }
    },
  });
};
