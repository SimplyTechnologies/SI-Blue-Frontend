import type { Dispatch, SetStateAction } from 'react';

export type AddVehicleProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSuccess?: () => void;
};
