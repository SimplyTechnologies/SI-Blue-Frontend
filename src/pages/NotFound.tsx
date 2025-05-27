import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center text-center gap-1">
       <h1 className="text-primary text-[22px] font-bold">404 - Page Not Found</h1>
      <div className="text-support-5 text-[16px]">The page you’re looking for doesn’t exist.</div>
      <div className="text-support-5 text-[16px]">You will be navigated to home in 3 seconds.</div>
    </div>
  );
}

