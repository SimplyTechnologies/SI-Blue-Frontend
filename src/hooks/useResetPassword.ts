import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  token: string;
}

interface ResetPasswordResponse {
  message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;
const RESET_PASSWORD_ENDPOINT = '/auth/reset-password';

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
      try {
        const response = await axios.put<ResetPasswordResponse>(`${API_BASE_URL}${RESET_PASSWORD_ENDPOINT}`, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Reset password failed';
        throw new Error(message);
      }
    },
  });
};
