import type { Dispatch, SetStateAction } from 'react';
import type { VehicleType } from '@/types/Vehicle';
import type { CarFormValues } from './VehicleForm.data';

export type AddVehicleProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSuccess?: (data?: VehicleType) => void;
  data?: CarFormValues | null;
  vehicleId?: string;
};

