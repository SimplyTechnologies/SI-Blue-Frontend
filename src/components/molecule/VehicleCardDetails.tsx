import React from 'react';
import type { VehicleType } from '@/types/Vehicle';
import { formatDate } from '@/utils/general';
import { Button } from '@/components/atom/Button';
import carMarker from '@/assets/carMarkerPrimary.svg';

const VehicleCardDetails = React.forwardRef<
  HTMLDivElement,
  {
    vehicle: VehicleType;
  }
>(({ vehicle }, ref) => {
  return (
    <div className="w-full py-3 border-b border-support-12">
      <div className="w-full flex py-3" ref={ref}>
        {/* Marker Circle */}
        <div
          className={`mr-3 w-12 h-12 flex justify-center items-center rounded-full bg-support-12 border-2 ${
            vehicle.sold ? 'border-support-11' : 'border-support-9'
          }`}
        >
          <img src={carMarker} alt="Vehicle" className="w-6 h-6" />
        </div>

        {/* Vehicle Info */}
        <div className="flex flex-col flex-1 w-full gap-2">
          <div className="flex justify-between items-center">
            <p className="text-[14px] text-support-6 text-xs font-bold leading-[120%] max-w-[100%] overflow-ellipsis">{vehicle.vin}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[14px] text-support-5 text-xs font-regular leading-[140%]">
              {vehicle.make.name} {vehicle.model.name} {vehicle.year}
            </p>
            <p className="text-[14px] text-support-5 text-xs font-regular leading-[140%]">
              Location:{' '}
              <span className="text-support-6 font-medium">
                {vehicle.location.street} {vehicle.location.city}
              </span>
            </p>
            <p className="text-[14px] text-support-5 text-xs font-regular leading-[140%]">
              Date Created: <span className="text-support-6 font-medium">{formatDate(vehicle.createdAt)}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="default" className="w-full h-[40px] text-xs" onClick={() => {}} disabled={false}>
          Assign to Customer
        </Button>
      </div>
    </div>
  );
});

export default VehicleCardDetails;

