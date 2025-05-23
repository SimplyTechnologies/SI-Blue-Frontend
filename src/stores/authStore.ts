import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { User } from '@/types/User';

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  auth: (user: User, tokens:{accessToken: string, refreshToken: string}) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      auth: (user, tokens) => {
        Cookies.set('accessToken', tokens.accessToken, { secure: true, sameSite: 'strict' });
        Cookies.set('refreshToken', tokens.refreshToken, { secure: true, sameSite: 'strict' });
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'authStore',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
