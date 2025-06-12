import type { AssignCustomerForm } from '@/types/Customer';
import api from './axios';

export const getCustomerEmails = async (email: string) => {
  try {
    const response = await api.get(`/customers/search?email=${email}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching customer emails:', error);
  }
};

export const assignToCustomer = async (body: AssignCustomerForm) => {
  const response = await api.post('/customers/customer', body);
  return response.data.data;
};

