import { type Dispatch, type SetStateAction, type FC, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/atom/Modal';
import { Input } from '@/components/atom/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atom/Form';
import { inputClassname } from './AddVehicle/AddVehicle.data';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { assignCustomerFormSchema, type AssignCustomerFormValues, type CustomerType } from '@/types/Customer';
import { useCustomerAssign } from '@/hooks/useCustomerAssign';
import { toast } from 'sonner';
import { getCustomerEmails } from '@/api/customers';

const AssignToCustomer: FC<{
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}> = ({ open, onOpenChange, onSuccess }) => {

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

  const { debounceValue } = useDebounce({ inputValue: form.getValues('email'), delay: 300 });

  const autocompleteRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const errorMessageSpacerClass = 'min-h-[1.25rem]';

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);
  const [autofillEmails, setAutofillEmails] = useState<CustomerType[]>([]);

  const disableFields = autofillEmails.length === 1 && form.getValues('email') === autofillEmails[0].email;

  const { data: emailsData } = useQuery({
    queryKey: ['emails', debounceValue],
    queryFn: () => getCustomerEmails(debounceValue),
    enabled: !!debounceValue,
  });

  useEffect(() => {
    setAutofillEmails(emailsData || []);
  }, [emailsData]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.target && showAutocomplete) {
        handleEmailBlur(e.target);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [autocompleteRef, inputRef, showAutocomplete, autofillEmails]);

  useEffect(() => {
    form.reset();
  }, [open, form]);

  const handleEmailBlur = (target: EventTarget) => {
    if (target instanceof Node && !autocompleteRef?.current?.contains(target) && !inputRef?.current?.contains(target)) {
      setShowAutocomplete(false);
      if (autofillEmails.length === 1 && autofillEmails[0].email === form.getValues('email')) {
        handleAutocomplete(autofillEmails[0]);
      }
    }
  };

  const onEmailFocus = () => {
    setShowAutocomplete(true);
  };

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
  };

  const onSubmit = (values: AssignCustomerFormValues) => {
    setCustomLoading(true);
    assignToCustomer.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast.success('Vehicle successfully assigned to the customer');
          onSuccess();
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
        form: 'assign-customer',
        text: 'Submit',
        loading: customLoading,
      }}
    >
      <Form {...form}>
        <form id="add-vehicle-form" onSubmit={form.handleSubmit(onSubmit)} className="mt-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className={`${inputClassname} w-full`}
                      placeholder="Enter Email"
                      {...field}
                      onFocus={onEmailFocus}
                      autoComplete="off"
                      ref={inputRef}
                      maxLength={100}
                    />
                    <div
                      ref={autocompleteRef}
                      className={`absolute top-[56px] left-0 ${showAutocomplete ? '' : 'hidden'} w-full overflow-auto bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-[150px] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md`}
                    >
                      {autofillEmails.map((item, index) => (
                        <div
                          className="hover:text-primary hover:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                          key={index}
                          onClick={() => handleAutocomplete(item)}
                        >
                          {item.email}
                        </div>
                      ))}
                    </div>
                  </div>
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
                      disabled={disableFields}
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
                      disabled={disableFields}
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
                    disabled={disableFields}
                    maxLength={25}
                  />
                </FormControl>
                <div className={form.formState.errors.phoneNumber ? errorMessageSpacerClass : ''}>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
};

export default AssignToCustomer;

