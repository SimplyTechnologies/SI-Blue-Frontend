import type { CustomerVehicle } from "./Vehicle";

export type TableHeaders = {
  id: string | number;
  firstName: string;
  lastName: string;
  vehicles?: CustomerVehicle[];
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  mail: string;
  assignedDate?: string;
  phone: string;
  status?: string;
};