import { useMutation } from '@tanstack/react-query';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (data: LoginPayload) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  });
};
