import type { CustomerVehicle } from './Vehicle';
import * as z from 'zod';

export const assignCustomerFormSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .email('Enter a valid email address.'),
  firstName: z
    .string({
      required_error: 'First Name is required.',
    })
    .min(1, 'First Name is required.')
    .max(50, 'First name must be less than 50 characters.')
    .transform(str => str.trim()),
  lastName: z
    .string({
      required_error: 'Last Name is required.',
    })
    .min(1, 'Last Name is required.')
    .max(50, 'Last Name must be less than 50 characters.')
    .transform(str => str.trim()),
  phoneNumber: z
    .string({
      required_error: 'Phone Number is required.',
    })
    .min(1, 'Phone Number is required.')
    .max(25, 'Phone Number must be less than 25 digits.')
    .regex(/^\+?[\d\s()-]+$/, 'Invalid phone number format.')
    .transform(str => str.replace(/\s/g, '')),
});

export type AssignCustomerFormValues = z.infer<typeof assignCustomerFormSchema>;

export type CustomerType = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type AssignCustomerFormResponse = {
  customer: CustomerType;
  message: string;
}

export type AssignCustomerForm = AssignCustomerFormValues & {
  vehicleId: number;
};

export type Customers = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  vehicles: CustomerVehicle[];
};

export type CustomersResponse = {
  customers: Customers[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

