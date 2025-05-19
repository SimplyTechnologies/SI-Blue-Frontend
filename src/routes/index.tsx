import { Routes, Route } from 'react-router';
import Dashboard from '../pages/Dashboard';
import Layout from '../layout';

import Vehicles from '@/pages/Vehicles';
import { Users } from 'lucide-react';
import Customers from '@/pages/Customers';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="users" element={<Users />} />
        <Route path="customers" element={<Customers />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
