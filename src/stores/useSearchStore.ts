import { create } from 'zustand';

type SearchState = {
  isSearchActive: boolean;
  searchValue: string;
  setIsSearchActive: (isSearchActive: boolean) => void;
  setSearchValue: (searchValue: string) => void;
};

export const useSearchStore = create<SearchState>(set => ({
  isSearchActive: false,
  searchValue: '',
  setIsSearchActive: (isSearchActive: boolean) => set({ isSearchActive }),
  setSearchValue: (searchValue: string) => set({ searchValue }),
}));

