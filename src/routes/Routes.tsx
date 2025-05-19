import React, { Suspense, lazy } from "react";
import {
  Route,
  Routes,
  BrowserRouter,
  type BrowserRouterProps,
} from "react-router";

const LoginPage = lazy(() => import("@/components/pages/LoginPage"));
const ForgotPassword = lazy(() => import("@/components/pages/ForgotPassword"));

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
      </Routes>
    </Router>
  );
};

export default AppRoutes;
