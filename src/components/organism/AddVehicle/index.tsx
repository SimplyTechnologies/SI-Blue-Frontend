import { type Dispatch, type SetStateAction, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import type { TAddress } from '@/types/Address';
import Modal from '@/components/atom/Modal';
import { Label } from '@/components/atom/Label';
import { Input } from '@/components/atom/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomSelect from '@/components/molecule/CustomSelect';
import AddressAutocomplete from '@/components/molecule/AddressAutocomplete/ui/AddressAutocomplete';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atom/Form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atom/Select';
import { createVehicle, getMakes, getModelsByMakeId } from '@/api/vehicles';
import {
  carFormSchema,
  inputClassname,
  type CarFormValues,
  getVehicleYearOptions,
  buildLocation,
} from './AddVehicle.data';

type AddVehicle = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSuccess?: () => void;
};

const AddVehicle = ({ open, onOpenChange, onSuccess }: AddVehicle) => {
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
      zipcode: '',
      lat: undefined,
      lng: undefined,
    },
    mode: 'onBlur',
  });

  const { data: makeOptions } = useQuery({
    queryKey: ['make'],
    queryFn: getMakes,
    enabled: open,
    refetchOnWindowFocus: false,
  });

  const { data: modelOptions } = useQuery({
    queryKey: ['model', form.getValues('make')],
    queryFn: () => getModelsByMakeId(form.getValues('make')),
    enabled: !!form.getValues('make'),
    refetchOnWindowFocus: false,
  });

  const errorMessageSpacerClass = 'min-h-[1.25rem]';
  const selectedMake = form.watch('make');

  const handleAddressFieldChange = (fieldName: keyof CarFormValues) => (value: string) => {
    form.setValue(fieldName, value, { shouldValidate: true });
    const updatedFields: Partial<CarFormValues> = { [fieldName]: value };
    const newLocation = buildLocation(updatedFields, form);
    form.setValue('location', newLocation);
  };

  const onSubmit = async (values: CarFormValues) => {
    try {
      const body = {
        modelId: Number(values.model),
        year: Number(values.year),
        vin: values.vin,
        location: {
          country: values.country,
          city: values.city,
          street: values.street,
          zipcode: values.zipcode,
          state: values.state,
          lat: values.lat,
          lng: values.lng,
        },
      };
      await createVehicle(body);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      const error = e as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || 'An error occurred while adding the vehicle.');
    }
  };

  const onAddressSelect = (address: TAddress) => {
    const location = buildLocation(address, form);

    form.setValue('location', location);
    form.setValue('street', address.street);
    form.setValue('city', address.city);
    form.setValue('state', address.state);
    form.setValue('country', address.country);
    form.setValue('zipcode', address.zipcode);
    form.setValue('lat', address.lat);
    form.setValue('lng', address.lng);
    form.trigger(['street', 'city', 'state', 'country', 'zipcode']);
  };

  useEffect(() => {
    form.reset();
  }, [open, form]);

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
        <Label className="text-support-6 font-bold text-lg mb-3">General</Label>
        <form id="add-vehicle-form" onSubmit={form.handleSubmit(onSubmit)} className="mt-3">
          <div className="grid grid-cols-1 gap-x-[10px] gap-y-[10px] md:grid-cols-2 mb-[10px]">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <CustomSelect
                    value={field.value}
                    items={
                      makeOptions?.map((item: { id: number; name: string }) => {
                        return { id: item.id.toString(), name: item.name };
                      }) || []
                    }
                    onChange={value => {
                      field.onChange(value);
                      form.setValue('model', '');
                    }}
                    placeholder="Select Make"
                    className="bg-white"
                    disabled={!makeOptions?.length}
                  />
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
                  <CustomSelect
                    value={field.value}
                    items={
                      modelOptions?.map((item: { id: number; name: string }) => {
                        return { id: item.id.toString(), name: item.name };
                      }) || []
                    }
                    onChange={field.onChange}
                    placeholder="Select Model"
                    className="bg-white"
                    disabled={!modelOptions?.length || !selectedMake}
                  />
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
                    <Input
                      className={inputClassname}
                      placeholder="Enter Street"
                      {...field}
                      onChange={e => handleAddressFieldChange('street')(e.target.value)}
                    />
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
                    <Input
                      className={inputClassname}
                      placeholder="Enter City"
                      {...field}
                      onChange={e => handleAddressFieldChange('city')(e.target.value)}
                    />
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
                    <Input
                      className={inputClassname}
                      placeholder="Enter State"
                      {...field}
                      onChange={e => handleAddressFieldChange('state')(e.target.value)}
                    />
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
                    <Input
                      className={inputClassname}
                      placeholder="Enter Country"
                      {...field}
                      onChange={e => handleAddressFieldChange('country')(e.target.value)}
                    />
                  </FormControl>
                  <div className={form.formState.errors.state ? errorMessageSpacerClass : ''}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      className={inputClassname}
                      placeholder="Enter Zip Code"
                      {...field}
                      onChange={e => handleAddressFieldChange('zipcode')(e.target.value)}
                    />
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
