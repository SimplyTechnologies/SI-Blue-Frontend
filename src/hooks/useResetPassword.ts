import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  token: string;
}

interface ForgotPasswordAxiosResponse {
  data: {
    data: {
      message: string;
    };
    message: string;
    success: boolean;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_URL;
const RESET_PASSWORD_ENDPOINT = '/auth/reset-password';

export const useResetPassword = () => {
  return useMutation<ForgotPasswordAxiosResponse, Error, ResetPasswordPayload>({
    mutationFn: async (payload: ResetPasswordPayload): Promise<ForgotPasswordAxiosResponse> => {
      try {
        const response = await axios.put<ForgotPasswordAxiosResponse>(
          `${API_BASE_URL}${RESET_PASSWORD_ENDPOINT}`,
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
        const message = axiosError.response?.data?.message || axiosError.message || 'Reset password failed';
        throw new Error(message);
      }
    },
  });
};
