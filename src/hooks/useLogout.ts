import { useMutation } from '@tanstack/react-query';

type LogoutResponse = {
  error: boolean;
  message: string;
};

export const useLogout = () => {
  return useMutation<LogoutResponse, Error>({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.json();
    },
  });
};

