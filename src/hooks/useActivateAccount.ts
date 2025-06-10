import type { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import type { User } from '@/types/User';
import { activateUser } from '@/api/accountActivation';

export type AccountActivationPayload = {
  password: string;
  confirmPassword: string;
  token: string;
  remember?: boolean;
};

type AccountActivationResponse = {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export const useActivateAccount = () => {
  return useMutation<AccountActivationResponse, Error, AccountActivationPayload>({
    mutationFn: async (data: AccountActivationPayload) => {
      try {
        const response = await activateUser(data);
        return response;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Something went wrong';

        throw new Error(message);
      }
    },
  });
};

