import type { Dispatch, SetStateAction, FC } from 'react';
import { useForm } from 'react-hook-form';

import type { TAddress } from '@/types/Address';
import Modal from '@/components/atom/Modal';
import { Label } from '@/components/atom/Label';
import { Input } from '@/components/atom/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import AddressAutocomplete from '@/components/molecule/AddressAutocomplete/ui/AddressAutocomplete';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atom/Form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atom/Select';
import {
  carFormSchema,
  inputClassname,
  MAKES,
  MODELS_BY_MAKE,
  type CarFormValues,
  getVehicleYearOptions,
} from './AddVehicle.data';

const AddVehicle: FC<{ open: boolean; onOpenChange: Dispatch<SetStateAction<boolean>> }> = ({ open, onOpenChange }) => {
  const currentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 126 }, (_, i) => (currentYear - i).toString());

  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: undefined,
      model: undefined,
      year: undefined,
      vin: '',
      location: '',
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    mode: 'onBlur',
  });

  const errorMessageSpacerClass = 'min-h-[1.25rem]';
  const selectedMake = form.watch('make');

  const onSubmit = (values: CarFormValues) => {
    console.log(values);
  };

  const onAddressSelect = (address: TAddress) => {
    form.setValue('location', address.formatted_address);
    form.setValue('street', address.street);
    form.setValue('city', address.city);
    form.setValue('state', address.state);
    form.setValue('country', address.country);
    form.setValue('zipCode', address.zip);
    form.trigger();
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      title="Add New Vehicle"
      closeOnOutsideClick={false}
      footerButtonProps={{
        form: 'add-vehicle-form',
        text: 'Submit',
      }}
    >
      <Form {...form}>
        <Label className="text-[var(--color-support-6)] font-bold text-lg mb-3">General</Label>
        <form id="add-vehicle-form" onSubmit={form.handleSubmit(onSubmit)} className="mt-3">
          <div className="grid grid-cols-1 gap-x-[10px] gap-y-[10px] md:grid-cols-2 mb-[10px]">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <Select
                    onValueChange={value => {
                      field.onChange(value);
                      form.setValue('model', '');
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[100%]">
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MAKES.map(make => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className={form.formState.errors.model ? errorMessageSpacerClass : ''}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedMake}>
                    <FormControl>
                      <SelectTrigger className="w-[100%]">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedMake && MODELS_BY_MAKE[selectedMake] ? (
                        MODELS_BY_MAKE[selectedMake].map(model => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="placeholder" disabled>
                          {selectedMake ? 'No models available' : 'Select a make first'}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <div className={form.formState.errors.make ? errorMessageSpacerClass : ''}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[100%]">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getVehicleYearOptions().map(year => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className={form.formState.errors.vin ? errorMessageSpacerClass : ''}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN</FormLabel>
                  <FormControl>
                    <Input className={inputClassname} placeholder="Enter VIN" {...field} />
                  </FormControl>
                  <div className={form.formState.errors.year ? errorMessageSpacerClass : ''}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-[10px] gap-y-[10px] md:grid-cols-2">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <AddressAutocomplete
                      changeAddress={onAddressSelect}
                      handleChange={field.onChange}
                      value={field.value || ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input className={inputClassname} placeholder="Enter Street" {...field} />
                  </FormControl>
                  <div className={form.formState.errors.city ? errorMessageSpacerClass : ''}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input className={inputClassname} placeholder="Enter City" {...field} />
                  </FormControl>
                  <div className={form.formState.errors.street ? errorMessageSpacerClass : ''}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input className={inputClassname} placeholder="Enter State" {...field} />
                  </FormControl>
                  <div className={form.formState.errors.country ? errorMessageSpacerClass : ''}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input className={inputClassname} placeholder="Enter Country" {...field} />
                  </FormControl>
                  <div className={form.formState.errors.state ? errorMessageSpacerClass : ''}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input className={inputClassname} placeholder="Enter Zip Code" {...field} />
                  </FormControl>
                  <div className={errorMessageSpacerClass}>
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

export default AddVehicle;
