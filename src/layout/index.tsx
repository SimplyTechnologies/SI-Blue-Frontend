import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useLocation } from 'react-router';
import { pathTitles } from '@/utils/pageTitles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOutIcon, UserIcon } from 'lucide-react';

function Layout() {
  const location = useLocation();

  const pageTitle = pathTitles[location.pathname] || '';

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between bg-[#fff] p-6 border-b-1 border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-[var(--primary-color)]">{pageTitle}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem className='flex gap-1 p-2'>
                <UserIcon />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='flex gap-1 p-2'>
                <LogOutIcon />
                <span> Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Layout;
