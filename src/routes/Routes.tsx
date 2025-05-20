import Auth from '@/layouts/Auth';
import DashboardLayout from '@/layouts/Dashboard/ui/Dashboard';
import Customers from '@/pages/Customers';
import Dashboard from '@/pages/Dashboard';
import MyProfile from '@/pages/MyProfile';
import Vehicles from '@/pages/Vehicles';
import { Users } from 'lucide-react';
import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter, type BrowserRouterProps } from 'react-router';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AccountActivation = lazy(() => import('@/pages/AccountActivation'));
const Map = lazy(() => import('@/components/organism/Map'));

interface AppRouterProps {
  Router?: React.ComponentType<BrowserRouterProps>;
}

const AppRoutes: React.FC<AppRouterProps> = ({ Router = BrowserRouter }) => {
  return (
    <Router>
      <Routes>
        <Route element={<Auth />}>
          <Route
            path="/login"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ForgotPassword />
              </Suspense>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ResetPassword />
              </Suspense>
            }
          />
          <Route
            path="/account-activation"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AccountActivation />
              </Suspense>
            }
          />
        </Route>
        <Route path="/map" element={<Map />} />
        <Route element={<DashboardLayout />}>
          {/* <Route path="/" index element={<Navigate to="/dashboard" replace />} /> */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="users" element={<Users />} />
          <Route path="customers" element={<Customers />} />
          <Route path="my-profile" element={<MyProfile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;

