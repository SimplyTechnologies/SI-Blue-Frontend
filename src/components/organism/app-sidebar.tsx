import * as React from 'react';
import { CarFrontIcon, HomeIcon, UserPlusIcon, UsersIcon } from 'lucide-react';

import { NavMain } from '@/components/molecule/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, SidebarTrigger } from '@/components/atom/sidebar';
import logo from '@/assets/favicon.png';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: HomeIcon,
      isActive: true,
    },
    {
      title: 'Vehicles',
      url: '/vehicles',
      icon: CarFrontIcon,
      isActive: true,
    },
    {
      title: 'Users',
      url: '/users',
      icon: UsersIcon,
      isActive: true,
    },
    {
      title: 'Customers',
      url: '/customers',
      icon: UserPlusIcon,
      isActive: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <img src={logo} alt="logo" />
        </div>
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
