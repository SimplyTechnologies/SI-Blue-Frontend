import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/types/User';

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  auth: (user: User, tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('ACCESS_TOKEN') : false,
      user: null,
      auth: (user, tokens) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('ACCESS_TOKEN', tokens.accessToken);
          if (tokens.refreshToken) {
            localStorage.setItem('REFRESH_TOKEN', tokens.refreshToken);
          }
          set({ user, isAuthenticated: true });
        }
      },
      logout: () => {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'authStore',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);

export default useAuthStore;
