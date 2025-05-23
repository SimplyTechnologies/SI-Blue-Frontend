export type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: string;
}

export type UserInput = User & {
  password: string;
};