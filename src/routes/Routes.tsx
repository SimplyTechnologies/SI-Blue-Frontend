import DashboardLayout from '@/layouts/Dashboard';
import Customers from '@/pages/Customers';
import Dashboard from '@/pages/Dashboard';
import Vehicles from '@/pages/Vehicles';
import { Users } from 'lucide-react';
import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter, type BrowserRouterProps } from 'react-router';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));

interface AppRouterProps {
  Router?: React.ComponentType<BrowserRouterProps>;
}

const AppRoutes: React.FC<AppRouterProps> = ({ Router = BrowserRouter }) => {
  return (
    <Router>
      <Routes>
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
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="users" element={<Users />} />
          <Route path="customers" element={<Customers />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
