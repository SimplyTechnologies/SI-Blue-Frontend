import { Outlet } from 'react-router';
import carBg from '@/assets/carBackground.svg';
import carlifeLogo from '@/assets/carlifeLogo.svg';

const Auth: React.FC = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-start gap-2 md:justify-start">
          <img src={carlifeLogo} alt="carlifeLogo" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[450px]">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img src={carBg} alt="Image" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    </div>
  );
};

export default Auth;
