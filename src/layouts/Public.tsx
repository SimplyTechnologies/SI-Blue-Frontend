import { Navigate, Outlet } from 'react-router';
import useAuthStore from '@/stores/useAuthStore';

const Public: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default Public;
