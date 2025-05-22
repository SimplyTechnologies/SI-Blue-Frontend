import { lazy } from 'react';
import { RoutePaths } from './Routes.types';

// Public
const Login = lazy(() => import('@/pages/LoginPage'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const AccountActivation = lazy(() => import('@/pages/AccountActivation'));

// Private
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Vehicles = lazy(() => import('@/pages/Vehicles'));
const Users = lazy(() => import('@/pages/Users'));
const Customers = lazy(() => import('@/pages/Customers'));
const MyProfile = lazy(() => import('@/pages/MyProfile'));

export const publicRoutes = [
  { Component: Login, path: RoutePaths.LOGIN },
  { Component: ForgotPassword, path: RoutePaths.FORGOT_PASSWORD },
  { Component: ResetPassword, path: RoutePaths.RESET_PASSWORD },
  { Component: AccountActivation, path: RoutePaths.ACCOUNT_ACTIVATION },
];

export const privateRoutes = [
  { Component: Dashboard, path: RoutePaths.DASHBOARD },
  { Component: Vehicles, path: RoutePaths.VEHICLES },
  { Component: Users, path: RoutePaths.USERS },
  { Component: Customers, path: RoutePaths.CUSTOMERS },
  { Component: MyProfile, path: RoutePaths.MY_PROFILE },
];
