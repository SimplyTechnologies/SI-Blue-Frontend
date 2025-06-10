import { type ChangeEvent } from 'react';
import type { FieldValues, UseFormReturn, Path, ControllerRenderProps } from 'react-hook-form';

import { Input } from '@/components/atom/Input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/atom/Form';
import { inputClassname } from '../organism/VehicleForm/VehicleForm.data';

interface InputFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  formItemClassName?: string;
  errorClassName?: string;
  disabled?: boolean;
  maxLength?: number;
  onChange?: (e: ChangeEvent<HTMLInputElement>, field: ControllerRenderProps<T, Path<T>>) => void;
}

function InputField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  formItemClassName,
  errorClassName,
  disabled = false,
  maxLength,
  onChange,
}: InputFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={formItemClassName}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              className={inputClassname}
              placeholder={placeholder}
              type={type}
              maxLength={maxLength}
              {...field}
              value={field.value}
              onChange={e => {
                if (onChange) {
                  onChange(e, field);
                } else {
                  field.onChange(e);
                }
              }}
              disabled={disabled}
            />
          </FormControl>
          <div className={errorClassName}>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

export default InputField;
