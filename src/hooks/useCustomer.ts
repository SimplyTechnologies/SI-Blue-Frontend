import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AssignCustomerForm, AssignCustomerFormResponse } from '@/types/Customer';
import { assignToCustomer } from '@/api/customers';
import api from '@/api/axios';

export const useCustomerAssign = () => {
  return useMutation<AssignCustomerFormResponse, Error, AssignCustomerForm>({
    mutationFn: async (data: AssignCustomerForm) => {
      try {
        const response = await assignToCustomer(data);
        return response;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Something went wrong';
        toast.error(message);
      }
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/customers/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customersList'] });
      toast.success('Customer deleted successfully');
    },
    onError: error => {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message || axiosError.message || 'Something went wrong';
      toast.error(message ?? 'Failed to delete customer please try again');
    },
  });
};

