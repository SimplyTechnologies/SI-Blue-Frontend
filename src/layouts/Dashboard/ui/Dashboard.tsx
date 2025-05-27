import { AppSidebar } from '@/components/organism/AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTriggerMobile } from '@/components/atom/Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atom/Avatar';
import CustomDropdown from '@/components/molecule/CustomDropdown';
import useAuthStore from '@/stores/authStore';
import { pathTitles } from '@/utils/constants';
import { AccountIcon } from '@/assets/svgIconComponents/AccountIcon';
import { LogOutIcon } from '@/assets/svgIconComponents/LogOutIcon';
import './dashboard.css';

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout, user } = useAuthStore();

  const pageTitle = pathTitles[location.pathname] || '';
  const userCredentials = (user?.first_name[0] || '') + (user?.last_name[0] || '');

  const handleProfileNavigate = () => {
    navigate('/my-profile');
  };

  const profileDropdownItems = [
    { label: 'My Profile', onClick: handleProfileNavigate, icon: <AccountIcon /> },
    { label: 'Log Out', onClick: logout, icon: <LogOutIcon /> },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between bg-white p-[24px] h-[78px] border-b-1 border-sidebar-border">
          <div className="flex gap-2">
            <SidebarTriggerMobile />
            <h1 className="text-2xl font-bold text-primary">{pageTitle}</h1>
          </div>
          <CustomDropdown
            sideOffset={0}
            align="end"
            trigger={
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="text-primary-3 font-medium bg-primary-5">
                  {userCredentials}
                </AvatarFallback>
              </Avatar>
            }
            items={profileDropdownItems}
            menuClassName="w-[220px] text-support-5"
          />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;

