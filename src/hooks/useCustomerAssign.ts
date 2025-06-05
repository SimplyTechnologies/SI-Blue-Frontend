import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import type { AssignCustomerForm, AssignCustomerFormResponse } from '@/types/Customer';
import { assignToCustomer } from '@/api/customers';

export const useCustomerAssign = () => {
  return useMutation<AssignCustomerFormResponse, Error, AssignCustomerForm>({
    mutationFn: async (data: AssignCustomerForm) => {
      try {
        const response = await assignToCustomer(data);
        return response;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Something went wrong';

        throw new Error(message);
      }
    },
  });
};

