import { Outlet, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Map from '@/components/organism/Map';
import { vehiclesMapDataQueryOptions } from '@/hooks/useVehiclesMapDataQuery';
import { vehicleQueryOptions } from '@/hooks/useVehicleData';

const VehicleLayout: React.FC = () => {
  const { id } = useParams();

  const { data: singleVehicle } = useQuery(vehicleQueryOptions(id));
  const { data: vehiclesMapData } = useQuery(vehiclesMapDataQueryOptions(id));

  const getSingleVehicleMapData = () => {
    const mapData: { lat: string; lng: string; id: number }[] = [];

    if (singleVehicle?.location?.lat && singleVehicle?.location?.lng) {
      mapData.push({
        id: singleVehicle.id,
        lat: singleVehicle.location.lat,
        lng: singleVehicle.location.lng,
      });
    }

    return mapData;
  };

  return (
    <div className="flex w-full h-[calc(100vh-78px)] flex-col lg:flex-row">
      <Outlet />
      <div className="flex-[1_1_60%] lg:h-full h-[50%]">
        <Map cords={id ? getSingleVehicleMapData() : vehiclesMapData?.vehicles} />
      </div>
    </div>
  );
};

export default VehicleLayout;

