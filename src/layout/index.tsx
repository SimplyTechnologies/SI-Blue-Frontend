import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useLocation } from 'react-router';
import { pathTitles } from '@/utils/pageTitles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function Layout() {
  const location = useLocation();

  const pageTitle = pathTitles[location.pathname] || '';

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between bg-[#fff] p-6 border-b-1 border-[var(--border-color)]">
          <h1 className="text-2xl font-bold text-[var(--primary-color)]">{pageTitle}</h1>

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Layout;
