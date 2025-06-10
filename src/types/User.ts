import z from 'zod'

export const addNewUserFormSchema = z.object({
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
export type AddNewUserFormValue = z.infer<typeof addNewUserFormSchema>;


export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type UserInput = User & {
  password: string;
};

export type UpdateUserRequest = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  password?: string;
};

export type UsersResponse = {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
export type AddNewUserType = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}
