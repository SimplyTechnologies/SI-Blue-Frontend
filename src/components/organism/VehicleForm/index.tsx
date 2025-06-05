import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import { zodResolver } from '@hookform/resolvers/zod';
import type { TAddress } from '@/types/Address';
import Modal from '@/components/atom/Modal';
import { Label } from '@/components/atom/Label';
import InputField from '@/components/molecule/InputField';
import CustomSelect from '@/components/molecule/CustomSelect';
import AddressAutocomplete from '@/components/molecule/AddressAutocomplete/ui/AddressAutocomplete';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atom/Form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atom/Select';
import { createVehicle, getMakes, getModelsByMakeId, decodeVehicleVin, editVehicle } from '@/api/vehicles';
import { carFormSchema, type CarFormValues, getVehicleYearOptions, buildLocation } from './VehicleForm.data';
import type { AddVehicleProps } from './VehicleForm.types';

const VehicleForm = ({ open, onOpenChange, onSuccess, data, vehicleId }: AddVehicleProps) => {
  const queryClient = useQueryClient();

  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: data || {
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

  const [vinLoading, setVinLoading] = useState(false);

  const { data: makeOptions, refetch: refetchMakes } = useQuery({
    queryKey: ['make'],
    queryFn: getMakes,
    enabled: open,
  });

  const { data: modelOptions, refetch: refetchModels } = useQuery({
    queryKey: ['model'],
    queryFn: () => getModelsByMakeId(form.getValues().make),
    enabled: !!form.getValues().make,
  });

  const vinValue = form.watch('vin');

  useEffect(() => {
    if (vinValue.length !== 17 || data?.vin === vinValue) return;
    setVinLoading(true);
    (async () => {
      try {
        const { data } = await decodeVehicleVin({ vin: vinValue });
        if (!data) return;
        const { vehicleMake, vehicleModel, year } = data;
        if (!vehicleMake && !vehicleModel && !year) return;

        let makeId = makeOptions?.find(
          (m: { id: number; name: string }) => m.name.toLowerCase() === vehicleMake?.name?.toLowerCase(),
        )?.id;
        if (!makeId && vehicleMake) {
          await refetchMakes();
          const updatedMakes = queryClient.getQueryData(['make']) as { id: number; name: string }[];
          makeId = updatedMakes?.find(
            (m: { id: number; name: string }) => m.name.toLowerCase() === vehicleMake?.name?.toLowerCase(),
          )?.id;
        }
        if (makeId) {
          form.setValue('make', makeId.toString());
          const { data: updatedModelOptions } = await refetchModels();

          const modelId = updatedModelOptions?.find((m: { id: number; name: string }) => m.id === vehicleModel?.id)?.id;

          if (modelId) {
            form.setValue('model', modelId.toString());
          }
        }
        if (year) {
          form.setValue('year', year.toString());
        }
        form.trigger(['make', 'model', 'year', 'vin']);
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error(error.response?.data?.message || 'Could not decode VIN.');
      } finally {
        setVinLoading(false);
      }
    })();
  }, [vinValue]);

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

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
      if (vehicleId) {
        const updatedData = await editVehicle(body, vehicleId);
        onSuccess?.(updatedData);
      } else {
        await createVehicle(body);
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (e) {
      const error = e as AxiosError<{ message?: string }>;
      toast.error(
        error.response?.data?.message || `An error occurred while ${vehicleId ? 'editing' : 'adding'} the vehicle.`,
      );
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
    if (vehicleId && data) {
      form.setValue('make', data.make);
      form.setValue('model', data.model);
      form.setValue('year', data.year);
      form.setValue('vin', data.vin);
      form.setValue('location', data.location);
      form.setValue('street', data.street);
      form.setValue('city', data.city);
      form.setValue('state', data.state);
      form.setValue('country', data.country);
      form.setValue('zipcode', data.zipcode);
      form.setValue('lat', data.lat);
      form.setValue('lng', data.lng);
    }
  }, [data, vehicleId]);

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      title={`${vehicleId ? 'Edit' : 'Add New'} Vehicle`}
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
                      makeOptions?.map((item: { id: number; name: string }) => ({
                        id: item.id.toString(),
                        name: item.name,
                      })) || []
                    }
                    onChange={value => {
                      field.onChange(value);
                      form.setValue('model', '');
                      refetchModels();
                    }}
                    placeholder="Select Make"
                    className="bg-white"
                    disabled={vinLoading || !makeOptions?.length}
                  />
                  <div className={form.formState.errors.model ? 'min-h-[1.25rem]' : ''}>
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
                      modelOptions?.map((item: { id: number; name: string }) => ({
                        id: item.id.toString(),
                        name: item.name,
                      })) || []
                    }
                    onChange={field.onChange}
                    placeholder="Select Model"
                    className="bg-white"
                    disabled={vinLoading || !modelOptions?.length || !form.getValues().make}
                  />
                  <div className={form.formState.errors.make ? 'min-h-[1.25rem]' : ''}>
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
                  <Select value={field.value} onValueChange={field.onChange} disabled={vinLoading}>
                    <FormControl>
                      <SelectTrigger className="w-[100%]">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getVehicleYearOptions().map(year => (
                        <SelectItem key={year} value={year} disabled={vinLoading}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className={form.formState.errors.vin ? 'min-h-[1.25rem]' : ''}>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <InputField
              form={form}
              name="vin"
              label="VIN"
              placeholder="Enter VIN"
              errorClassName="min-h-[1.25rem]"
              disabled={vinLoading}
              onChange={(e, field) => {
                if (e.target.value.length > 17) return;
                field.onChange(e);
                form.setValue('vin', e.target.value, { shouldValidate: true });
              }}
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
            <InputField
              form={form}
              name="street"
              label="Street"
              placeholder="Enter Street"
              errorClassName={form.formState.errors.city ? 'min-h-[1.25rem]' : ''}
              onChange={(e, field) => {
                field.onChange(e);
                form.setValue('street', e.target.value, { shouldValidate: true });
                const updatedFields = { street: e.target.value };
                const newLocation = buildLocation(updatedFields, form);
                form.setValue('location', newLocation);
              }}
            />
            <InputField
              form={form}
              name="city"
              label="City"
              placeholder="Enter City"
              errorClassName={form.formState.errors.street ? 'min-h-[1.25rem]' : ''}
              onChange={(e, field) => {
                field.onChange(e);
                form.setValue('city', e.target.value, { shouldValidate: true });
                const updatedFields = { city: e.target.value };
                const newLocation = buildLocation(updatedFields, form);
                form.setValue('location', newLocation);
              }}
            />
            <InputField
              form={form}
              name="state"
              label="State"
              placeholder="Enter State"
              errorClassName={form.formState.errors.country ? 'min-h-[1.25rem]' : ''}
              onChange={(e, field) => {
                field.onChange(e);
                form.setValue('state', e.target.value, { shouldValidate: true });
                const updatedFields = { state: e.target.value };
                const newLocation = buildLocation(updatedFields, form);
                form.setValue('location', newLocation);
              }}
            />
            <InputField
              form={form}
              name="country"
              label="Country"
              placeholder="Enter Country"
              errorClassName={form.formState.errors.state ? 'min-h-[1.25rem]' : ''}
              onChange={(e, field) => {
                field.onChange(e);
                form.setValue('country', e.target.value, { shouldValidate: true });
                const updatedFields = { country: e.target.value };
                const newLocation = buildLocation(updatedFields, form);
                form.setValue('location', newLocation);
              }}
            />
            <InputField
              form={form}
              name="zipcode"
              label="Zip Code"
              placeholder="Enter Zip Code"
              formItemClassName="md:col-span-2"
              errorClassName="min-h-[1.25rem]"
              onChange={(e, field) => {
                field.onChange(e);
                form.setValue('zipcode', e.target.value, { shouldValidate: true });
                const updatedFields = { zipcode: e.target.value };
                const newLocation = buildLocation(updatedFields, form);
                form.setValue('location', newLocation);
              }}
            />
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default VehicleForm;

