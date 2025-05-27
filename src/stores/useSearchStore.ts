import { create } from 'zustand';

type SearchState = {
  isSearchActive: boolean;
  setIsSearchActive: (isSearchActive: boolean) => void;
};

export const useSearchStore = create<SearchState>(set => ({
  isSearchActive: false,
  setIsSearchActive: (isSearchActive: boolean) => set({ isSearchActive }),
}));
