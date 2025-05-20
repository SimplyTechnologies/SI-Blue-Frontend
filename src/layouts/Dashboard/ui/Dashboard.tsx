import { AppSidebar } from '@/components/organism/AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTriggerMobile } from '@/components/atom/Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atom/Avatar';
import CustomDropdown from '@/components/molecule/CustomDropdown';
import { pathTitles } from '@/utils/pageTitles';
import { generateStringToColor } from '@/utils/general';
import { AccountIcon } from '@/assets/svgIconComponents/AccountIcon';
import { LogOutIcon } from '@/assets/svgIconComponents/LogOutIcon';
import './dashboard.css';

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = pathTitles[location.pathname] || '';

  const avatarBg = generateStringToColor('C' + 'N');

  const handleProfileNavigate = () => {
    navigate('/my-profile');
  };

  const handleSignOut = () => {};

  const profileDropdownItems = [
    { label: 'My Profile', onClick: handleProfileNavigate, icon: <AccountIcon /> },
    { label: 'Log out', onclick: handleSignOut, icon: <LogOutIcon /> },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between bg-[#fff] p-[24px] h-[78px] border-b-1 border-[var(--sidebar-border)]">
          <div className="flex gap-2">
            <SidebarTriggerMobile />
            <h1 className="text-2xl font-bold text-[var(--primary)]">{pageTitle}</h1>
          </div>
          <CustomDropdown
            trigger={
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="text-[#403C89] font-medium" style={{ backgroundColor: avatarBg }}>
                  CN
                </AvatarFallback>
              </Avatar>
            }
            items={profileDropdownItems}
          />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;

