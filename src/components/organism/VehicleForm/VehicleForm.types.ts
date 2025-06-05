import type { Dispatch, SetStateAction } from 'react';
import type { CarFormValues } from './VehicleForm.data';

export type AddVehicleProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSuccess?: () => void;
  data?: CarFormValues | null;
  vehicleId?: number;
};
