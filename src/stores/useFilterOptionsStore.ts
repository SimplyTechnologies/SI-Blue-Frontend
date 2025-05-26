import { create } from 'zustand';
import { availabilityOptions } from '@/utils/constants';

type UseFilterOptionsState = {
  validMakeIds: string[];
  validModelIds: string[];
  validAvailabilityOptions: string[];
  setValidMakeIds: (validMakeIds: string[]) => void;
  setValidModelIds: (validModelIds: string[]) => void;
  setValidAvailabilityOptions: (validAvailabilityOptions: string[]) => void;
};

export const useFilterOptionsStore = create<UseFilterOptionsState>(set => ({
  validMakeIds: [],
  validModelIds: [],
  validAvailabilityOptions: availabilityOptions.map((item) => item.id),
  setValidMakeIds: (validMakeIds: string[]) => set({ validMakeIds }),
  setValidModelIds: (validModelIds: string[]) => set({ validModelIds }),
  setValidAvailabilityOptions: (validAvailabilityOptions: string[]) => set({ validAvailabilityOptions }),
}));

