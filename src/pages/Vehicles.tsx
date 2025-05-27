import { useState } from 'react';
import Map from '@/components/organism/Map';
import VehiclesHeader from '@/components/organism/VehiclesHeader';
import downloadIcon from '@/assets/download.svg';
import arrowLeft from '@/assets/arrowLeft.svg';
import verticalDotes from '@/assets/verticalDotes.svg';
import { Button } from '@/components/atom/Button';
import VehicleCard from '@/components/molecule/VehicleCard';
import CustomDropdown from '@/components/molecule/CustomDropdown';
import type { Vehicle } from '@/types/Vehicle';
import { Pencil } from 'lucide-react';
import { Trash } from 'lucide-react';
import { useGetVehicles } from '@/hooks/useVehicle';

const Vehicles: React.FC = () => {
  const [active, setActive] = useState<'vehicles' | 'favorites' | 'details'>('vehicles');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const { data } = useGetVehicles();
  console.log(data);

  const vehiclesDropdownItems = [
    {
      label: 'Edit',
      onClick: () => console.log('Edit Vehicle'),
      icon: <Pencil className="text-[var(--color-support-5)] group-hover:text-[var(--color-primary-3)]" />,
    },
    {
      label: 'Delete',
      onClick: () => console.log('Delete Vehicles'),
      icon: <Trash className="text-[var(--color-support-5)] group-hover:text-[var(--color-primary-3)]" />,
    },
  ];

  const handleOpenDetails = (vehicle: Vehicle) => {
    setActive('details');
    setSelectedVehicle(vehicle);
  };

  const handleCloseDetails = () => {
    setActive('vehicles');
    setSelectedVehicle(null);
  };

  return (
    <div className="w-full h-[calc(100vh-78px)] flex">
      <div
        className={`h-full flex-[0_1_40%] flex flex-col gap-[0.5rem] bg-[var(--color-white)] px-[1.5rem] pt-[1.5rem] max-[768px]:px-[0.5rem] max-[768px]:pt-[0.5rem]`}
      >
        {active === 'details' ? (
          <div className="w-full h-[1.5rem] flex-1 flex justify-between items-center gap-[1rem]">
            <div
              onClick={() => handleCloseDetails()}
              className="flex w-[1.5rem] h-[1.5rem] items-center justify-center cursor-pointer"
            >
              <img src={arrowLeft} alt="Back" />
            </div>
            <div className="flex w-[1.5rem] h-[1.5rem] items-center justify-center cursor-pointer">
              <CustomDropdown
                trigger={<img src={verticalDotes} alt="Menu" />}
                items={vehiclesDropdownItems}
                menuClassName="w-[219px] h-[102px] p-[12px] border-none rounded-[16px] shadow-(box-shadow: 0px 4px 80px 0px #A7AEC133;)"
                itemClassName="group w-full h-32px rounded-[0.5rem] gap-[0.5rem] px-[12px] py-[0.5rem] text-[var(--color-support-5)] font-[var(--fw-regular)] font-[length:var(--sm-text)] leading-[140%] hover:bg-[var(--color-bg-2)] hover:text-[var(--color-support-6)] hover:font-[var(--fw-medium)]"
              />
            </div>
          </div>
        ) : (
          <VehiclesHeader />
        )}
        <div className="h-full flex flex-col relative">
          {active !== 'details' && (
            <div className="w-full max-w-[352px] flex items-start gap-[6rem] border-b-[1px] border-[var(--color-support-8)] max-[1200px]:gap-[0] max-[1200px]:justify-between">
              <div className="flex gap-[1rem] max-[600px]:flex-col">
                <Button
                  onClick={() => setActive('vehicles')}
                  className={`relative w-[67px] h-[37px] rounded-[0] pb-[1rem]`}
                >
                  <p
                    className={`text-[length:var(--sm-text)] ${active === 'vehicles' ? 'text-[var(--color-primary-3)] font-[var(--fw-bold)] ' : 'text-[var(--color-support-7)] font-[var(--fw-medium)]'}   leading-[140%]`}
                  >
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
                  <p
                    className={`text-[length:var(--sm-text)] ${active === 'vehicles' ? 'text-[var(--color-support-7)] font-[var(--fw-medium)]' : 'text-[var(--color-primary-3)] font-[var(--fw-bold)]'}   leading-[140%]`}
                  >
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
          )}
          <div
            className="flex-1 h-full max-h-[calc(100vh-13.125rem)] max-[1200px]:max-h-[calc(100vh-16.125rem)] max-[600px]:max-h-[calc(100vh-18.125rem)] [&::-webkit-scrollbar]:w-[0.25rem]
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-[var(--color-support-8)]
  [&::-webkit-scrollbar-thumb]:rounded-full
  overflow-y-scroll
"
          >
            {active === 'vehicles' &&
              data?.vehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={() => handleOpenDetails(vehicle)} />
              ))}
            {active === 'favorites' &&
              data?.vehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={() => handleOpenDetails(vehicle)} />
              ))}
            {selectedVehicle && <VehicleCard vehicle={selectedVehicle} details={true} />}
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
