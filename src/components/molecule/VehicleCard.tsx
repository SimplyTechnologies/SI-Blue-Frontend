import React from 'react';
import type { Vehicle } from '@/types/Vehicle';
import { Button } from '@/components/atom/Button';
import carMarker from '@/assets/carMarkerPrimary.svg';
import favorite from '@/assets/favorite.svg';
import { FavoriteColor } from '@/assets/svgIconComponents/FavoriteIcon';
// import favoritePrimary from "@/assets/favoritePrimary.svg";

type VehicleCardProps = {
  vehicle: Vehicle;
  onClick?: () => void;
  details?: boolean;
};

const VehicleCard = React.forwardRef<HTMLDivElement, VehicleCardProps>(({ vehicle, onClick, details }, ref) => {
  return (
    <div ref={ref} className={`flex flex-col ${details && 'pb-[1.5rem] border-b-[1px] border-[#F5F5F7]'}`}>
      <div className="w-full py-[1.5rem] border-b-[1px] border-[#F5F5F7] flex" onClick={onClick}>
        <div className="w-[60px] pr-[12px] flex justify-start items-start cursor-pointer">
          <div
            className={`w-[48px] h-[48px] flex justify-center items-center bg-[#F5F7FF] border-[2px] ${vehicle.sold ? 'border-[var(--color-secondary-1)]' : 'border-[var(--color-support-9)]'} rounded-[50%]`}
          >
            <div className="w-[24px] h-[24px] flex justify-center items-center">
              <img src={carMarker} alt="Vehicle" />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col">
          <div className="flex justify-between items-center gap-[12px]">
            <div className="cursor-pointer">
              <p className="text-[var(--color-support-6)] text-[length:var(--xs-text)] font-[var(--fw-bold)] leading-[120%]">
                {vehicle.vin}
              </p>
            </div>
            <div className={`flex ${vehicle.sold ? 'gap-[2.5rem]' : 'gap-[calc(2.5rem-20px)]'}`}>
              <div
                className={`h-[21px] py-[2px] px-[0.5rem] ${vehicle.sold ? 'bg-[#23A1E9]' : 'bg-[var(--color-support-9)]'} rounded-[0.5rem]`}
              >
                <p className="text-[var(--color-white)] text-[12px] font-[var(--fw-regular)] leading-[140%]">
                  {vehicle.sold ? 'Sold' : 'In stock'}
                </p>
              </div>
              <div className="w-[20px] h-[20px] flex justify-center items-center">
                <img src={favorite} alt="Favorite" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[0.25rem] cursor-pointer">
            <div>
              <p className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-regular)] leading-[140%]">
                {vehicle.make.name + ' ' + vehicle.model.name + ' ' + vehicle.year}
              </p>
            </div>
            <div>
              <p className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-regular)] leading-[140%]">
                Location:{' '}
                <span className="text-[var(--color-support-6)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%]">
                  {vehicle.location.street}
                </span>
              </p>
            </div>
            {details && (
              <div>
                <p className="text-[var(--color-support-5)] text-[length:var(--xs-text)] font-[var(--fw-regular)] leading-[140%]">
                  Date Created:{' '}
                  <span className="text-[var(--color-support-6)] text-[length:var(--xs-text)] font-[var(--fw-medium)] leading-[140%]">
                    19.03.2023
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
        <Button onClick={() => {}} variant="text" className="w-[20px] hover:opacity-80">
          <FavoriteColor isFavorite={vehicle.favorite} />
        </Button>
      </div>
      {details && (
        <div>
          <Button variant={'default'} className="h-[40px] text-[12px] leading-[120%]">
            Assign to Customer
          </Button>
        </div>
      )}
    </div>
  );
});

export default VehicleCard;
