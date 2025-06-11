import { Navigate, Outlet } from 'react-router';
import useAuthStore from '@/stores/useAuthStore';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
