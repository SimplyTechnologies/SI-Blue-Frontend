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
