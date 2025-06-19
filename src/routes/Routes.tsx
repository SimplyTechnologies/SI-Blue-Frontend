import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter, type BrowserRouterProps, Navigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import Auth from '@/layouts/Auth';
import DashboardLayout from '@/layouts/Dashboard/ui/Dashboard';
import VehicleLayout from '@/layouts/Vehicles';
import NotFound from '@/pages/NotFound';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { mapDataLoader, vehicleDetailsLoader } from '@/queries/vehicles';

const Protected = lazy(() => import('@/layouts/Protected'));
const Public = lazy(() => import('@/layouts/Public'));

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AccountActivation = lazy(() => import('@/pages/AccountActivation/ui/AccountActivation'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Vehicles = lazy(() => import('@/pages/Vehicles'));
const VehicleDetails = lazy(() => import('@/pages/VehicleDetails'));
const Users = lazy(() => import('@/pages/Users'));
const Customers = lazy(() => import('@/pages/Customers'));
const History = lazy(() => import('@/pages/History'));
const MyProfile = lazy(() => import('@/pages/MyProfile'));

interface AppRouterProps {
  Router?: React.ComponentType<BrowserRouterProps>;
}

const AppRoutes: React.FC<AppRouterProps> = ({ Router = BrowserRouter }) => {
  const isAdmin = useIsAdmin();
  const queryClient = useQueryClient();

  return (
    <Router>
      <Suspense
        fallback={
          <div className="w-full h-[100vh] flex justify-center items-center">
            <Loader2 className="animate-spin h-8 w-8" color="#636777" />
          </div>
        }
      >
        <Routes>
          <Route element={<Public />}>
            <Route element={<Auth />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/account-activation" element={<AccountActivation />} />
            </Route>
          </Route>

          <Route element={<Protected />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} loader={() => mapDataLoader(queryClient)} />
              <Route element={<VehicleLayout />}>
                <Route path="vehicles" element={<Vehicles />} loader={() => mapDataLoader(queryClient)} />
                <Route
                  path="vehicles/:id"
                  element={<VehicleDetails />}
                  loader={() => vehicleDetailsLoader(queryClient)}
                />
              </Route>
              {isAdmin && <Route path="users" element={<Users />} />}
              <Route path="customers" element={<Customers />} />
              <Route path="history" element={<History />} />
              <Route path="my-profile" element={<MyProfile />} />
            </Route>
          </Route>
          {/* 404 fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;

