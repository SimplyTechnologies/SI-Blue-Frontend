import { z } from 'zod';

export type VehicleType = {
  id: number;
  year: number;
  vin: string;
  location: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
  sold: boolean;
  userId: number;
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
  availabilityId?: string;
};

export const filterSchema = z.object({
  makeId: z.string().optional().default(''),
  modelIds: z.array(z.string()).optional().default([]),
  availabilityId: z.string().optional().default(''),
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

export function createFilterSchema({
  validMakeIds,
  validModelIds,
  validAvailabilityIds,
}: {
  validMakeIds: string[];
  validModelIds: string[];
  validAvailabilityIds: string[];
}) {
  return z.object({
    makeId: z
      .string()
      .refine(id => validMakeIds.includes(id), {
        message: 'Invalid makeId',
      })
      .optional(),

    availabilityId: z
      .string()
      .refine(val => validAvailabilityIds.includes(val), {
        message: 'Invalid availability',
      })
      .optional(),

    modelIds: z
      .array(z.string())
      .refine(val => {
        val.map(item => validModelIds.includes(item), {
          message: 'Invalid availability',
        });
      })
      .optional(),
  });
}

