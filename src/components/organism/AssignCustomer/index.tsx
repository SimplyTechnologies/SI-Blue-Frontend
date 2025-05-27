import { type Dispatch, type SetStateAction, type FC, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/atom/Modal';
import { Input } from '@/components/atom/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atom/Form';
import { assignCustomerFormSchema, type AssignCustomerFormValues } from './AssignCustomer.data';
import { inputClassname } from '../AddVehicle/AddVehicle.data';
import { useDebounce } from '@/hooks/useDebounce';

const AddVehicle: FC<{ open: boolean; onOpenChange: Dispatch<SetStateAction<boolean>> }> = ({ open, onOpenChange }) => {
  const items = [
    { id: 1, email: 'nika.jaghinyan@gmail.com', firstName: 'Nika', lastName: 'Jaghinyan', phoneNumber: '+37499663274' },
    { id: 2, email: 'nika.jagh@gmail.com', firstName: 'Nik', lastName: 'Jagh', phoneNumber: '+47499663274' },
    { id: 3, email: 'nika@gmail.com', firstName: 'Veronika', lastName: 'Test', phoneNumber: '+57499663274' },
  ];

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

  const { debounceValue } = useDebounce({ inputValue: form.getValues('email'), delay: 300 });

  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const errorMessageSpacerClass = 'min-h-[1.25rem]';

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredItems, setFilteredItems] = useState(items);

  const disableFields = filteredItems.length === 1 && form.getValues('email') === filteredItems[0].email;

  useEffect(() => {
    setFilteredItems(items.filter(item => item.email.includes(form.getValues('email'))));
  }, [debounceValue]);

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
  }, [autocompleteRef, inputRef, showAutocomplete, filteredItems]);

  useEffect(() => {
    form.reset();
    console.log('form', form)
  }, [open, form]);

  const handleEmailBlur = (target: EventTarget) => {
    if (!autocompleteRef?.current?.contains(target) && !inputRef?.current?.contains(target)) {
      setShowAutocomplete(false);
      if (filteredItems.length === 1 && filteredItems[0].email === form.getValues('email')) {
        handleAutocomplete(filteredItems[0]);
      }
    }
  };

  const onSubmit = (values: AssignCustomerFormValues) => {
    console.log(values);
    onOpenChange(false);
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

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      title="Assign to Customer"
      closeOnOutsideClick={false}
      footerButtonProps={{
        form: 'assign-customer',
        text: 'Submit',
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
                    />
                    <div
                      ref={autocompleteRef}
                      className={`absolute top-[56px] left-0 ${showAutocomplete ? '' : 'hidden'} w-full overflow-auto bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-[150px] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md`}
                    >
                      {filteredItems.map((item, index) => (
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
                  <Input className={inputClassname} placeholder="+1-XXX-XXX-XXXX" {...field} disabled={disableFields} />
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

export default AddVehicle;

