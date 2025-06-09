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
      return await activateUser(data);
    },
  });
};

