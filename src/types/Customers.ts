import type { CustomerVehicle } from './Vehicle';

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