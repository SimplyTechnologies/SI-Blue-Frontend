import { type Dispatch, type SetStateAction, type FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Modal from '@/components/atom/Modal';
import { Input } from '@/components/atom/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atom/Form';
import { inputClassname } from './VehicleForm/VehicleForm.data';
import { addNewUserFormSchema, type AddNewUserFormValue, type AddNewUserType } from '@/types/User';
import { useAddUser } from '@/hooks/useAddUser';
import { useQueryClient } from '@tanstack/react-query';

const AddNewUser: FC<{
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}> = ({ open, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const addUserMutation = useAddUser();

  const form = useForm<AddNewUserType>({
    resolver: zodResolver(addNewUserFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (values: AddNewUserFormValue) => {
    setIsLoading(true);
    addUserMutation.mutate(values, {
      onSuccess: () => {
        toast.success('User added successfully!');
        queryClient.invalidateQueries({ queryKey: ['usersList'] });
        onOpenChange(false);
      },
      onError: () => {
        toast.error('User with this email exists.');
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      title="Add New User"
      closeOnOutsideClick={false}
      footerButtonProps={{
        form: 'add-new-user-form',
        text: 'Add User',
        loading: isLoading,
      }}
    >
      <Form {...form}>
        <form id="add-new-user-form" onSubmit={form.handleSubmit(onSubmit)} className="mt-3">
         <div className="grid grid-cols-1 gap-x-[10px] gap-y-[10px]">
            <div className="grid grid-cols-1 gap-x-[10px] gap-y-[10px] md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input className={inputClassname} placeholder="Enter First Name" {...field} maxLength={50} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input className={inputClassname} placeholder="Enter Last Name" {...field} maxLength={50} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input className={inputClassname} placeholder="+1-XXX-XXX-XXXX" {...field} maxLength={25} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mail</FormLabel>
                  <FormControl>
                    <Input className={inputClassname} placeholder="Enter Mail" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default AddNewUser;
