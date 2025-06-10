import * as z from 'zod';
import { type UseFormReturn } from 'react-hook-form';

export const inputClassname = 'h-[56px] px-[22px]';

export const carFormSchema = z.object({
  make: z.string({
    required_error: 'Vehicle Make is required.',
  }),
  model: z
    .string({
      required_error: 'Vehicle Model is required.',
    })
    .min(1, 'Vehicle Model is required.'),
  year: z.string({
    required_error: 'Vehicle Year is required.',
  }),
  vin: z
    .string({ required_error: 'VIN is required.' })
    .min(1, 'VIN is required.')
    .length(17, 'VIN must be 17 characters.'),
  location: z.string().optional(),
  street: z.string().min(1, 'Street is required.'),
  city: z.string().min(1, 'City is required.'),
  state: z.string().min(1, 'State is required.'),
  country: z.string().min(1, 'Country is required.'),
  zipcode: z.string().min(1, 'Zip Code is required.'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type CarFormValues = z.infer<typeof carFormSchema>;

export const getVehicleYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  return Array.from({ length: currentYear - startYear + 1 }, (_, i) => (currentYear - i).toString());
};

export const buildLocation = (fields: Partial<CarFormValues>, form: UseFormReturn<CarFormValues>) => {
  const street = fields.street ?? form.getValues('street') ?? '';
  const city = fields.city ?? form.getValues('city') ?? '';
  const state = fields.state ?? form.getValues('state') ?? '';
  const zipcode = fields.zipcode ?? form.getValues('zipcode') ?? '';
  const country = fields.country ?? form.getValues('country') ?? '';
  let location = '';
  if (street || city || state || zipcode || country) {
    location = `${street}, ${city}, ${state} ${zipcode}, ${country}`
      .replace(/(, )+/g, ', ')
      .replace(/^[, ]+|[, ]+$/g, '');
  }
  return location;
};

export const buildLocationForEdit = (fields: Partial<CarFormValues>) => {
  const street = fields.street;
  const city = fields.city;
  const state = fields.state;
  const zipcode = fields.zipcode;
  const country = fields.country;
  let location = '';
  if (street || city || state || zipcode || country) {
    location = `${street}, ${city}, ${state} ${zipcode}, ${country}`
      .replace(/(, )+/g, ', ')
      .replace(/^[, ]+|[, ]+$/g, '');
  }
  return location;
};

