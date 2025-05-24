import React from 'react';
import type { VehiclesType } from '@/pages/Vehicles';
import { Button } from '@/components/atom/Button';
import { FavoriteColor } from '@/assets/svgIconComponents/FavoriteIcon';
import carMarker from '@/assets/carMarkerPrimary.svg';

const VehicleCard = React.forwardRef<HTMLDivElement, { vehicle: VehiclesType }>(
  ({ vehicle }, ref) => {
  return (
    <div className="w-full py-6 border-b border-[#F5F5F7] flex" ref={ref}>
      {/* Marker Circle */}
      <div
        className={`mr-3 w-12 h-12 flex justify-center items-center rounded-full bg-[#F5F7FF] border-2 ${
          vehicle.sold ? 'border-[#23A1E9]' : 'border-[#0DCF89]'
        }`}
      >
        <img src={carMarker} alt="Vehicle" className="w-6 h-6" />
      </div>

      {/* Vehicle Info */}
      <div className="flex flex-col flex-1 w-full">
        <div className="flex justify-between items-center">
          <p className="text-[14px] cursor-pointer text-[var(--color-support-6)] text-xs font-bold leading-[120%]">
            {vehicle.vin}
          </p>
        </div>

        <div className="flex flex-col gap-1 cursor-pointer">
          <p className="text-[14px] text-[var(--color-support-5)] text-xs font-regular leading-[140%]">
            {vehicle.make.name} {vehicle.model.name} {vehicle.year}
          </p>
          <p className="text-[14px] text-[var(--color-support-5)] text-xs font-regular leading-[140%]">
            Location:{' '}
            <span className="text-[var(--color-support-6)] font-medium">
              {vehicle.location.street} {vehicle.location.city}
            </span>
          </p>
        </div>
      </div>

      {/* Status & Favorite */}
      <div className="flex items-start gap-5 ml-4">
        <div className="w-[64px] flex justify-center">
          <div
            className={`px-2 py-0.5 rounded-md flex items-center justify-center ${vehicle.sold ? 'bg-[#23A1E9]' : 'bg-[#0DCF89]'}`}
          >
            <p className="text-white text-[12px] font-regular leading-[140%]">{vehicle.sold ? 'Sold' : 'In Stock'}</p>
          </div>
        </div>
        <Button onClick={() => {}} variant="text" className="w-[20px] hover:opacity-80">
          <FavoriteColor isFavorite={false} />
        </Button>
      </div>
    </div>
  );
});

export default VehicleCard;

