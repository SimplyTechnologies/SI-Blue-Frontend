import { create } from 'zustand';
import { availabilityOptions } from '@/utils/constants';
import { createJSONStorage, persist } from 'zustand/middleware';

type UseFilterOptionsState = {
  validMakeIds: string[];
  validModelIds: string[];
  validAvailabilityIds: string[];
  setValidMakeIds: (validMakeIds: string[]) => void;
  setValidModelIds: (validModelIds: string[]) => void;
  setValidAvailabilityIds: (validAvailabilityIds: string[]) => void;
};

export const useFilterOptionsStore = create<UseFilterOptionsState>()(
  persist(
    set => ({
      validMakeIds: [],
      validModelIds: [],
      validAvailabilityIds: availabilityOptions.map(item => item.id),
      setValidMakeIds: (validMakeIds: string[]) => set({ validMakeIds }),
      setValidModelIds: (validModelIds: string[]) => set({ validModelIds }),
      setValidAvailabilityIds: (validAvailabilityIds: string[]) => set({ validAvailabilityIds }),
    }),
    {
      name: 'filterOptionsStore',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

