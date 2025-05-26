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
  availability?: string;
};

export const filterSchema = z.object({
  make: z.string().optional().default(''),
  models: z.array(z.string()).optional().default([]),
  availability: z.string().optional().default(''),
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
  validAvailabilityOptions,
}: {
  validMakeIds: string[];
  validModelIds: string[];
  validAvailabilityOptions: string[];
}) {
  return z
    .object({
      makeId: z
        .string()
        .refine(id => validMakeIds.includes(id), {
          message: 'Invalid makeId',
        })
        .optional(),

      availability: z
        .string()
        .refine(val => validAvailabilityOptions.includes(val), {
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
    })
    .strict()
    .transform(data => {
      const cleaned: {
        makeId?: string;
        modelIds?: string[];
        availability?: string;
      } = {};

      if (data.makeId && validMakeIds.includes(data.makeId)) {
        cleaned.makeId = data.makeId;

        const filteredModels = (data.modelIds ?? []).filter(id => validModelIds.includes(id));

        if (filteredModels.length > 0) {
          cleaned.modelIds = filteredModels;
        }
      }
      if (data.availability && validAvailabilityOptions.includes(data.availability)) {
        cleaned.availability = data.availability;
      }

      return cleaned;
    });
}

