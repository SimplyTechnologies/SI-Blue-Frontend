import * as z from 'zod';

export const assignCustomerFormSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .email('Enter a valid email address.'),
  firstName: z.string({
    required_error: 'First Name is required.',
  }),
  lastName: z.string({
    required_error: 'Last Name is required.',
  }),
  phoneNumber: z.string({
    required_error: 'Phone Number is required.',
  }),
});

export type AssignCustomerFormValues = z.infer<typeof assignCustomerFormSchema>;

