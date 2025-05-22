import { useState } from 'react';
import { Input } from '@/components/atom/Input';
import Map from '@/components/organism/Map';
import filterIcon from '@/assets/filter.svg';
import searchIcon from '@/assets/search.svg';
import downloadIcon from '@/assets/download.svg';
import { Button } from '@/components/atom/Button';
import VehicleCard from '@/components/molecule/VehicleCard';

const Vehicles: React.FC = () => {
  const [active, setActive] = useState<string>('vehicles');

  return (
    <div className="w-full h-[calc(100vh-78px)] flex">
      <div className="h-full flex flex-col gap-[0.5rem] flex-[0_1_40%] bg-[var(--white-color)] px-[1.5rem] pt-[1.5rem] max-[768px]:px-[0.5rem] max-[768px]:pt-[0.5rem]">
        <div className="flex item-start justify-between gap-[1rem] max-[1200px]:flex-col">
          <div className="w-full max-w-[352px] h-[42px] flex items-center">
            <div className="relative w-full">
              <img src={searchIcon} alt="Search" className="absolute left-[1.5rem] top-1/2 -translate-y-1/2 " />
              <Input
                className="w-full  max-w-[308px] h-[42px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[3.5rem] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] placeholder:leading-[140%] placeholder:font-[var(--fw-regular)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
                placeholder="Search..."
              />
            </div>
            <div className="flex justify-end items-center w-[44px] h-[42px]">
              <img src={filterIcon} alt="Filter" />
            </div>
          </div>
          <div>
            <Button variant={'default'} className="w-[132px] h-[56px] max-[1200px]:h-[42px]">
              + Add
            </Button>
          </div>
        </div>
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
