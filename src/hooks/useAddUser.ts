import { addUser } from "@/api/user";
import type { AddNewUserFormValue } from "@/types/User";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useAddUser = () => {
  return useMutation<string, Error, AddNewUserFormValue>({
    
    mutationFn: async (data: AddNewUserFormValue) => {
      try {
        const response = await addUser(data);
        return response;
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message || axiosError.message || 'Something went wrong';
        
        throw new Error(message);
      }
    }
  });
};