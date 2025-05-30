import { z } from 'zod';
import type { TAddress } from './Address';

export type VehicleType = {
  id: number;
  year: number;
  vin: string;
  favorite: boolean;
  location: TAddress;
  sold: boolean;
  userId: number;
  createdAt: string;
  model: {
    id: number;
    name: string;
  };
  make: {
    id: number;
    name: string;
  };
};

export type FilterRequest = {
  makeId?: string;
  modelIds?: string;
  availability?: string;
  favorite?: number;
};

export const filterSchema = z
  .object({
    makeId: z
      .string()
      .optional()
      .refine(val => !val || !isNaN(parseInt(val)), { message: 'Invalid make ID' }),
    modelIds: z
      .array(z.string().refine(val => !val || !isNaN(parseInt(val)), { message: 'Invalid model ID' }))
      .optional(),
    availability: z.string().optional(),
  })
  .refine(({ makeId, modelIds }) => (modelIds?.length && makeId && !isNaN(parseInt(makeId))) || !modelIds?.length, {
    message: 'Invalid make ID',
  });

export type FilterState = z.infer<typeof filterSchema>;

export type VehicleRequest = FilterRequest & {
  page: number;
  offset: number;
  search?: string;
};

export type OptionType = {
  id: number;
  name: string;
};

export type CreateVehicleRequest = {
  location: TAddress;
  vin: string;
  year: number;
  modelId: number;
};

export type AddRemoveFavorite = {
  vehicleId: number;
};

export type AddRemoveFavoriteWithMethod = AddRemoveFavorite & {
  method: 'POST' | 'DELETE';
};

export type AddRemoveFavoriteResponse = {
  vehicle: VehicleType;
};

export type VehicleTab = 'vehicles' | 'favorites';

