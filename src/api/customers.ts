import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { AssignCustomerForm } from '@/types/Customer';
import api from './axios';

export const getCustomerEmails = async (email: string) => {
  try {
    const response = await api.get(`/customers/search?email=${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer emails:', error);
  }
};

export const assignToCustomer = async (body: AssignCustomerForm) => {
  try {
    const response = await api.post('/customers/customer', body);
    return response.data;
  } catch (error) {
    console.error('Error creating a customer:', error);
    const axiosError = error as AxiosError<{ message: string }>;
    const message = axiosError.response?.data?.message || axiosError.message || 'Something went wrong';
    toast.error(message);
  }
};

