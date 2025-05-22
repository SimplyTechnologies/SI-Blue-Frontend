import { useState } from 'react';
import Map from '@/components/organism/Map';
import VehiclesHeader from '@/components/organism/VehiclesHeader';
import downloadIcon from '@/assets/download.svg';
import { Button } from '@/components/atom/Button';
import VehicleCard from '@/components/molecule/VehicleCard';

const Vehicles: React.FC = () => {
  const [active, setActive] = useState<string>('vehicles');

  return (
    <div className="w-full h-[calc(100vh-78px)] flex">
      <div className="h-full flex flex-col gap-[0.5rem] flex-[0_1_40%] bg-[var(--white-color)] px-[1.5rem] pt-[1.5rem] max-[768px]:px-[0.5rem] max-[768px]:pt-[0.5rem]">
        <VehiclesHeader />
        <div className="h-full flex flex-col">
          <div className="w-full max-w-[352px] flex items-start gap-[6rem] border-b-[1px] border-[var(--color-support-8)] max-[1200px]:gap-[0] max-[1200px]:justify-between">
            <div className="flex gap-[1rem] max-[600px]:flex-col">
              <Button
                onClick={() => setActive('vehicles')}
                className={`relative w-[67px] h-[37px] rounded-[0] pb-[1rem]`}
              >
                <p className="font-[var(--fw-bold)] text-[length:var(--sm-text)] text-[var(--color-primary-3)] leading-[140%]">
                  Vehicles
                </p>
                {active === 'vehicles' && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--color-primary-3)] rounded-t-[2px]" />
                )}
              </Button>
              <Button
                onClick={() => setActive('favorites')}
                className={`relative w-[67px] h-[37px] pb-[1rem] rounded-[0]`}
              >
                <p className="font-[var(--fw-bold)] text-[length:var(--sm-text)] text-[var(--color-primary-3)] leading-[140%]">
                  Favorites
                </p>
                {active === 'favorites' && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--color-primary-3)] rounded-t-[2px]" />
                )}
              </Button>
            </div>
            <div className="flex w-[24px] h-[24px] items-center justify-center">
              <img src={downloadIcon} alt="Download" />
            </div>
          </div>
          <div
            className="flex-1 h-full max-h-[calc(100vh-13.125rem)] max-[1200px]:max-h-[calc(100vh-16.125rem)] max-[600px]:max-h-[calc(100vh-18.125rem)] overflow-y-auto   [&::-webkit-scrollbar]:w-[0.25rem]
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-track]:h-[1px]
  [&::-webkit-scrollbar-thumb]:bg-[var(--color-support-8)]
  [&::-webkit-scrollbar-thumb]:rounded-full
"
          >
            {active === 'vehicles' && Array.from({ length: 100 }, (_, i) => <VehicleCard key={i} />)}
            {active === 'favorites' && Array.from({ length: 10 }, (_, i) => <VehicleCard key={i} />)}
          </div>
        </div>
      </div>
      <div className="h-full flex-[1_1_60%]">
        <Map />
      </div>
    </div>
  );
};

export default Vehicles;
