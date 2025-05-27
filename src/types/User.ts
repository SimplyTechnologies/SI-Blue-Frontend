export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone_number: string;
    role: string;
}

export type UserInput = User & {
  password: string;
};