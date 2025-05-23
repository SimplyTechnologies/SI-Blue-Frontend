'use client';

import { NavLink } from 'react-router';

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/atom/Sidebar';
import type { ReactElement } from 'react';

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
  const { state } = useSidebar();

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
                  className={state === 'collapsed' ? 'dd-collapsed' : ''}
                >
                  {isActive ? item.iconActive : item.icon}
                  <span className={state === 'collapsed' ? 'hidden' : ''}>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </NavLink>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

