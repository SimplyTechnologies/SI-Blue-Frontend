'use client';

import { NavLink } from 'react-router';
import type { ReactElement } from 'react';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/atom/Sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: ReactElement;
    iconActive?: ReactElement;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { state, isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item => (
          <NavLink to={item.url} key={item.title}>
            {({ isActive }) => (
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive}
                  className={state === 'collapsed' && !isMobile ? 'dd-collapsed' : ''}
                  onClick={() => {
                    if (isMobile) {
                      setOpenMobile(false);
                    }
                  }}
                >
                  {isActive ? item.iconActive : item.icon}
                  <span className={state === 'collapsed' && !isMobile ? 'hidden' : ''}>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </NavLink>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

