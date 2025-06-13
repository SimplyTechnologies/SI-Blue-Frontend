import type { VehicleTab } from '@/types/Vehicle';
import { create } from 'zustand';

type ActiveTabState = {
  activeTab: VehicleTab;
  setActiveTab: (activeTab: VehicleTab) => void;
};

export const useActiveTabStore = create<ActiveTabState>(set => ({
  activeTab: 'vehicles',
  setActiveTab: (activeTab: VehicleTab) => set({ activeTab }),
}));

