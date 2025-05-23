import Auth from '@/layouts/Auth';
import DashboardLayout from '@/layouts/Dashboard/ui/Dashboard';
import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter, type BrowserRouterProps, Navigate } from 'react-router';

const Protected = lazy(() => import('@/layouts/Protected'));
const Public = lazy(() => import('@/layouts/Public'));

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AccountActivation = lazy(() => import('@/pages/AccountActivation'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Vehicles = lazy(() => import('@/pages/Vehicles'));
const Users = lazy(() => import('@/pages/Users'));
const Customers = lazy(() => import('@/pages/Customers'));
const MyProfile = lazy(() => import('@/pages/MyProfile'));

interface AppRouterProps {
  Router?: React.ComponentType<BrowserRouterProps>;
}

const AppRoutes: React.FC<AppRouterProps> = ({ Router = BrowserRouter }) => {
  return (
    <Router>
      <Routes>
        <Route element={<Public />}>
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
        </Route>

        <Route element={<Protected />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" index element={<Navigate to="/dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path="vehicles"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Vehicles />
                </Suspense>
              }
            />
            <Route
              path="users"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Users />
                </Suspense>
              }
            />
            <Route
              path="customers"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Customers />
                </Suspense>
              }
            />
            <Route
              path="my-profile"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <MyProfile />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
