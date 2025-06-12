import useAuthStore from '../stores/useAuthStore';

export const useIsAdmin = () => {
  const user = useAuthStore(state => state.user);
  return user?.role === 'superadmin';
};
