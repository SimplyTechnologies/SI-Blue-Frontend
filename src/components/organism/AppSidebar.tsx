import * as React from 'react';
import { Link } from 'react-router';

import { NavMain } from '@/components/molecule/NavMain';
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, useSidebar } from '@/components/atom/Sidebar';
import logo from '@/assets/favicon.svg';
import logoLight from '@/assets/faviconLight.svg';
import { DashboardIcon } from '@/assets/svgIconComponents/DashboardIcon';
import { VehiclesIcon } from '@/assets/svgIconComponents/VehiclesIcon';
import { CustomersIcon } from '@/assets/svgIconComponents/CustomersIcon';
import { UsersIcon } from '@/assets/svgIconComponents/UsersIcon';
import { VehiclesIconActive } from '@/assets/svgIconComponents/VehiclesIconActive';
import { UsersIconActive } from '@/assets/svgIconComponents/UsersIconActive';
import { CustomersIconActive } from '@/assets/svgIconComponents/CustomersIconActive';
import { DashboardIconActive } from '@/assets/svgIconComponents/DashboardIconActive';
import { useIsAdmin } from '@/hooks/useIsAdmin';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: <DashboardIcon />,
      iconActive: <DashboardIconActive />,
      isActive: true,
    },
    {
      title: 'Vehicles',
      url: '/vehicles',
      icon: <VehiclesIcon />,
      iconActive: <VehiclesIconActive />,
      isActive: true,
    },
    {
      title: 'Users',
      url: '/users',
      icon: <UsersIcon />,
      iconActive: <UsersIconActive />,
      isActive: true,
    },
    {
      title: 'Customers',
      url: '/customers',
      icon: <CustomersIcon />,
      iconActive: <CustomersIconActive />,
      isActive: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isAdmin = useIsAdmin();
  const { state, isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-[78px] relative">
        <Link to="/dashboard" className="">
          <img src={state === 'collapsed' && !isMobile ? logoLight : logo} alt="logo" className="w-[42px] h-[42px]" />
        </Link>
        <div className="flex items-center">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={isAdmin ? data.navMain : data.navMain.filter(i => i.title !== 'Users')} />
      </SidebarContent>
    </Sidebar>
  );
}
