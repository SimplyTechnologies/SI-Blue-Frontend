import { useEffect } from 'react';
import { AppSidebar } from '@/components/organism/AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTriggerMobile } from '@/components/atom/Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atom/Avatar';
import CustomDropdown from '@/components/molecule/CustomDropdown';
import useAuthStore from '@/stores/useAuthStore';
import { useSearchStore } from '@/stores/useSearchStore';
import { pathTitles } from '@/utils/constants';
import getColorFromName from '@/utils/getRandomColor';
import { AccountIcon } from '@/assets/svgIconComponents/AccountIcon';
import { LogOutIcon } from '@/assets/svgIconComponents/LogOutIcon';
import './dashboard.css';

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout, user } = useAuthStore();
  const { setIsSearchActive, setSearchValue } = useSearchStore();

  const activePath = location.pathname.split('/').filter(Boolean)[0];
  const pageTitle = pathTitles[activePath] || '';
  const userCredentials = (user?.firstName[0] || '') + (user?.lastName[0] || '');
  const avatarFallbackTextColor = getColorFromName(`${user?.firstName} ${user?.lastName}`).color;
  const avatarFallbackBg = getColorFromName(`${user?.firstName} ${user?.lastName}`).bg;

  const handleProfileNavigate = () => {
    navigate('/my-profile');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileDropdownItems = [
    { label: 'My Profile', onClick: handleProfileNavigate, icon: <AccountIcon /> },
    { label: 'Log Out', onClick: handleLogout, icon: <LogOutIcon /> },
  ];

  useEffect(() => {
    if (!location.pathname.includes('vehicles')) {
      setIsSearchActive(false);
      setSearchValue('');
    }
  }, [location]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="flex justify-between items-center bg-white px-[24px] py-[18px] h-[78px] min-h-[78px] border-b-1 border-sidebar-border">
          <div className="flex gap-2">
            <SidebarTriggerMobile />
            <h1 className="text-2xl font-bold text-primary">{pageTitle}</h1>
          </div>
          <CustomDropdown
            sideOffset={0}
            align="end"
            trigger={
              <Avatar style={{ backgroundColor: avatarFallbackBg }} className="w-[40px] h-[40px]">
                <AvatarImage
                  className="object-cover"
                  src={user?.avatarUrl || undefined}
                />
                <AvatarFallback
                  className="font-medium"
                  style={{ backgroundColor: 'transparent', color: avatarFallbackTextColor }}
                >
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
