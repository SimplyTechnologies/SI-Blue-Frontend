import * as z from 'zod';

export const inputClassname = `h-[56px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[22px]
placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)]
caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px]
focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]`;

export const MAKES = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen'];

export const MODELS_BY_MAKE: Record<string, string[]> = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot'],
  Ford: ['F-150', 'Explorer', 'Mustang', 'Escape'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'],
  Audi: ['A4', 'A6', 'Q5', 'Q7'],
  Volkswagen: ['Jetta', 'Passat', 'Tiguan', 'Atlas'],
};

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
  vin: z.string().min(1, 'Vehicle VIN is required.'),
  location: z.string().optional(),
  street: z.string().min(1, 'Street is required.'),
  city: z.string().min(1, 'City is required.'),
  state: z.string().min(1, 'State is required.'),
  country: z.string().min(1, 'Country is required.'),
  zipCode: z.string().min(1, 'Zip Code is required.'),
});

export type CarFormValues = z.infer<typeof carFormSchema>;

export const getVehicleYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  return Array.from({ length: currentYear - startYear + 1 }, (_, i) => (currentYear - i).toString());
};
