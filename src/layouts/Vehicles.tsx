import { Outlet, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Map from '@/components/organism/Map';
import { mapDataQuery, vehicleDetailsQuery } from '@/queries/vehicles';

const VehicleLayout: React.FC = () => {
  const { id } = useParams();

  const { data: singleVehicle } = useQuery(vehicleDetailsQuery(id));
  const { data: vehiclesMapData } = useQuery(mapDataQuery(''));

  const getSingleVehicleMapData = () => {
    const mapData: { lat: number; lng: number; id: number }[] = [];

    if (singleVehicle?.vehicle?.location?.lat && singleVehicle?.vehicle?.location?.lng) {
      mapData.push({
        id: singleVehicle.vehicle.id,
        lat: singleVehicle.vehicle.location.lat,
        lng: singleVehicle.vehicle.location.lng,
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

