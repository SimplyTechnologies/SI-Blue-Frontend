import { type Dispatch, type SetStateAction, type FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import Modal from '@/components/atom/Modal';
import { Input } from '@/components/atom/Input';
import CustomerEmailSuggest from '@/components/molecule/CustomerEmailSuggest';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce } from '@/hooks/useDebounce';
import { assignCustomerFormSchema, type AssignCustomerFormValues, type CustomerType } from '@/types/Customer';
import { useCustomerAssign } from '@/hooks/useCustomerAssign';
import { getCustomerEmails } from '@/api/customers';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atom/Form';
import { inputClassname } from './VehicleForm/VehicleForm.data';

const AssignToCustomer: FC<{
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  vehicleId: number;
  onSuccess: (customerId: number) => void;
}> = ({ open, onOpenChange, vehicleId, onSuccess }) => {
  const form = useForm<AssignCustomerFormValues>({
    resolver: zodResolver(assignCustomerFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
    mode: 'onBlur',
  });

  const assignToCustomer = useCustomerAssign();

  const emailInput = form.watch('email');

  const { debounceValue } = useDebounce({ inputValue: emailInput, delay: 300 });

  const errorMessageSpacerClass = 'min-h-[1.25rem]';

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);

  const { data: autofillEmails } = useQuery<{ customers: CustomerType[] }>({
    queryKey: ['emails', debounceValue],
    queryFn: () => getCustomerEmails(debounceValue),
    enabled: !!debounceValue,
  });

  const disableFields = autofillEmails?.customers?.length === 1 && emailInput === autofillEmails?.customers?.[0].email;

  useEffect(() => {
    form.reset();
  }, [open, form]);

  const handleAutocomplete = (item: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => {
    if (item.id) {
      form.setValue('email', item.email);
      form.setValue('firstName', item.firstName);
      form.setValue('lastName', item.lastName);
      form.setValue('phoneNumber', item.phoneNumber);
    }
    setShowAutocomplete(false);
    form.clearErrors();
  };

  const onSubmit = (values: AssignCustomerFormValues) => {
    setCustomLoading(true);
    assignToCustomer.mutate(
      { ...values, vehicleId },
      {
        onSuccess: data => {
          if (data?.customer?.id) {
            onSuccess(data.customer.id);
          }
        },
        onError: () => {
          toast.error('Something went wrong. Please try again');
        },
        onSettled: () => {
          setCustomLoading(false);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      title="Assign to Customer"
      closeOnOutsideClick={false}
      footerButtonProps={{
        form: 'assign-to-customer-form',
        text: 'Submit',
        loading: customLoading,
      }}
    >
      <Form {...form}>
        <form id="assign-to-customer-form" onSubmit={form.handleSubmit(onSubmit)} className="mt-3">
          <div className="grid grid-cols-1 gap-x-[10px] gap-y-[10px]">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <CustomerEmailSuggest
                      inputValue={form.getValues('email')}
                      inputClassname={inputClassname}
                      open={showAutocomplete}
                      setOpen={setShowAutocomplete}
                      handleAutocomplete={handleAutocomplete}
                      options={autofillEmails?.customers || []}
                      field={field}
                    />
                  </FormControl>
                  <div className={form.formState.errors.email ? errorMessageSpacerClass : ''}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-x-[10px] gap-y-[10px] md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassname}
                        placeholder="Enter First Name"
                        {...field}
                        disabled={disableFields && !!field.value}
                        maxLength={50}
                      />
                    </FormControl>
                    <div className={form.formState.errors.firstName ? errorMessageSpacerClass : ''}>
                      <FormMessage />
                    </div>
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
                      <Input
                        className={inputClassname}
                        placeholder="Enter Last Name"
                        {...field}
                        disabled={disableFields && !!field.value}
                        maxLength={50}
                      />
                    </FormControl>
                    <div className={form.formState.errors.lastName ? errorMessageSpacerClass : ''}>
                      <FormMessage />
                    </div>
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
                    <Input
                      className={inputClassname}
                      placeholder="+1-XXX-XXX-XXXX"
                      {...field}
                      disabled={disableFields && !!field.value}
                      maxLength={25}
                    />
                  </FormControl>
                  <div className={form.formState.errors.phoneNumber ? errorMessageSpacerClass : ''}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default AssignToCustomer;

