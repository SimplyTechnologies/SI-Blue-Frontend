import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { RoutePaths } from './Routes.types';
import AuthLayout from '@/layouts/Auth';
import Layout from '@/layouts/Dashboard/ui/Dashboard';
import { privateRoutes, publicRoutes } from '@/routes/Routes.data';

const AppRoutes = () => {
  const isAuth = false;

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={isAuth ? <Layout /> : <AuthLayout />}>
          {!isAuth && <Route path="/" element={<Navigate replace to={`/${RoutePaths.LOGIN}`} />} />}
          {(isAuth ? privateRoutes : publicRoutes).map(({ path, Component }) => (
            <Route
              key={path}
              path={`${path}/*`}
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Component />
                </Suspense>
              }
            />
          ))}
          <Route path="*" element={<Navigate replace to={`/${isAuth ? RoutePaths.DASHBOARD : RoutePaths.LOGIN}`} />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
