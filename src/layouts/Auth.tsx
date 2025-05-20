import carBg from '@/assets/carBackground.svg';

type AuthProps = {
  children: React.ReactNode;
};

const Auth: React.FC<AuthProps> = ({ children }) => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[450px]">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img src={carBg} alt="Image" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    </div>
  );
};

export default Auth;
