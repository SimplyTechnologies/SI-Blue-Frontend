import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/types/User';

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  auth: (user: User, tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      isAuthenticated: !!localStorage.getItem('ACCESS_TOKEN'),
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
        localStorage.clear();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'authStore',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);

export default useAuthStore;
