import { useLocation, useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import Map from '@/components/organism/Map';
import { Button } from '@/components/atom/Button';
import VehicleCard from '@/components/molecule/VehicleCard';
import { Toaster } from '@/components/atom/Toaster';

const VehicleDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle } = location.state;

  // const { id } = useParams();
  
  const handleBack = () => {
    navigate('/vehicles');
  };

  return (
    <div className="flex w-full h-[calc(100vh-78px)]">
      <div className="flex flex-col gap-2 flex-[0_1_40%] h-full bg-white px-6 pt-6 max-[768px]:px-2 max-[768px]:pt-2">
        <div className="flex flex-col h-full">
          <div
            className={`flex justify-between items-start w-full border-b border-support-8 gap-[6rem] max-[1200px]:gap-0 transition-all duration-300 ease-in-out max-w-full`}
          >
            <Button variant="text" className="w-auto flex text-xs text-primary hover:opacity-80" onClick={handleBack}>
              <ChevronLeft color="currentColor" className="h-[24px] w-[24px]" />
            </Button>
          </div>
          <div
            className="flex-1 h-full max-h-[calc(100vh-13.125rem)] max-[1200px]:max-h-[calc(100vh-16.125rem)] max-[600px]:max-h-[calc(100vh-18.125rem)] overflow-y-auto   [&::-webkit-scrollbar]:w-[0.25rem]
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-track]:h-[1px]
                [&::-webkit-scrollbar-thumb]:bg-support-8
                [&::-webkit-scrollbar-thumb]:rounded-full
              "
          >
            {vehicle && <VehicleCard vehicle={vehicle} />}
          </div>
          <Toaster richColors visibleToasts={1} />
        </div>
      </div>

      <div className="flex-[1_1_60%] h-full">
        <Map />
      </div>
    </div>
  );
};

export default VehicleDetails;

