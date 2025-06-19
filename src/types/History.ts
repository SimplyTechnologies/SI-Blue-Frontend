import type { TAddress } from './Address';

export interface CustomerValueType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface VehicleValueType {
  id: number;
  year: number;
  vin: string;
  location: TAddress;
  customer: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  } | null;
  customerId: number | null;
  model: {
    id: number;
    name: string;
  } | null;
  make: {
    id: number;
    name: string;
  } | null;
}

export interface UserActivity {
  id: number;
  userId: number;
  modelType: string;
  actionType: string;
  previousValue: null;
  currentValue: null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
}

