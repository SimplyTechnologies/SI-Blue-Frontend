import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter, type BrowserRouterProps, Navigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import Auth from '@/layouts/Auth';
import DashboardLayout from '@/layouts/Dashboard/ui/Dashboard';
import NotFound from '@/pages/NotFound';

const Protected = lazy(() => import('@/layouts/Protected'));
const Public = lazy(() => import('@/layouts/Public'));

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AccountActivation = lazy(() => import('@/pages/AccountActivation'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Vehicles = lazy(() => import('@/pages/Vehicles'));
const VehicleDetails = lazy(() => import('@/pages/VehicleDetails'));
const Users = lazy(() => import('@/pages/Users'));
const Customers = lazy(() => import('@/pages/Customers'));
const MyProfile = lazy(() => import('@/pages/MyProfile'));

interface AppRouterProps {
  Router?: React.ComponentType<BrowserRouterProps>;
}

const AppRoutes: React.FC<AppRouterProps> = ({ Router = BrowserRouter }) => {
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
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="vehicles/:id" element={<VehicleDetails />} />
              <Route path="users" element={<Users />} />
              <Route path="customers" element={<Customers />} />
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

