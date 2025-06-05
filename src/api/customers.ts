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
    const response = await api.post('/customers', body);
    return response.data;
  } catch (error) {
    console.error('Error creating a customer:', error);
  }
};
