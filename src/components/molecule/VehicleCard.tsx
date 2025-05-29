import React from 'react';
import { Loader2 } from 'lucide-react';
import type { VehicleType } from '@/types/Vehicle';
import { Button } from '@/components/atom/Button';
import CustomTooltip from '@/components/molecule/CustomTooltip';
import { FavoriteColor } from '@/assets/svgIconComponents/FavoriteIcon';
import carMarker from '@/assets/carMarkerPrimary.svg';

const VehicleCard = React.forwardRef<
  HTMLDivElement,
  {
    vehicle: VehicleType;
    handleFavoriteClick?: (vehicleId: number, isFavorite: boolean) => void;
    favoriteLoadingId?: number | null;
  }
>(({ vehicle, handleFavoriteClick, favoriteLoadingId }, ref) => {
  return (
    <div className="w-full py-6 border-b border-support-12 flex" ref={ref}>
      {/* Marker Circle */}
      <div
        className={`mr-3 w-12 h-12 flex justify-center items-center rounded-full bg-support-12 border-2 ${
          vehicle.sold ? 'border-support-11' : 'border-support-9'
        }`}
      >
        <img src={carMarker} alt="Vehicle" className="w-6 h-6" />
      </div>

      {/* Vehicle Info */}
      <div className="flex flex-col flex-1 w-full">
        <div className="flex justify-between items-center">
          <p className="text-[14px] cursor-pointer text-support-6 text-xs font-bold leading-[120%]">{vehicle.vin}</p>
        </div>

        <div className="flex flex-col gap-1 cursor-pointer">
          <p className="text-[14px] text-support-5 text-xs font-regular leading-[140%]">
            {vehicle.make.name} {vehicle.model.name} {vehicle.year}
          </p>
          <p className="text-[14px] text-support-5 text-xs font-regular leading-[140%]">
            Location:{' '}
            <span className="text-support-6 font-medium">
              {vehicle.location.street} {vehicle.location.city}
            </span>
          </p>
        </div>
      </div>

      {/* Status & Favorite */}
      <div className="flex items-start gap-5 ml-4">
        <div className="w-[64px] flex justify-center">
          <div
            className={`px-2 py-0.5 rounded-md flex items-center justify-center ${vehicle.sold ? 'bg-support-11' : 'bg-support-9'}`}
          >
            <p className="text-white text-[12px] font-regular leading-[140%]">{vehicle.sold ? 'Sold' : 'In Stock'}</p>
          </div>
        </div>

        {handleFavoriteClick ? (
          <CustomTooltip
            trigger={
              <Button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFavoriteClick(vehicle.id, vehicle.favorite);
                }}
                variant="text"
                className="w-[20px] hover:opacity-80"
                disabled={favoriteLoadingId === vehicle.id}
              >
                <FavoriteColor isFavorite={vehicle.favorite} />
              </Button>
            }
            content={vehicle.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
            side="right"
          />
        ) : null}
      </div>
    </div>
  );
});

export default VehicleCard;

