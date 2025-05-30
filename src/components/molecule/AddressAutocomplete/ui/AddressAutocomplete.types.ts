import type { FormEvent } from 'react';
import type { ReactGoogleAutocompleteInputProps } from 'react-google-autocomplete';
import type { TAddress } from '@/types/Address';

export type TAddressAutocompleteProps = ReactGoogleAutocompleteInputProps & {
  changeAddress: (arg: TAddress) => void;
  value: string;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  handleChange: (
    e: FormEvent<HTMLInputElement>,
    value?: unknown,
  ) => void;
};
