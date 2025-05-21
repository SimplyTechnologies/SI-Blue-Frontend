import Map from '@/components/organism/Map';
import VehiclesHeader from '@/components/organism/VehiclesHeader';

const Vehicles: React.FC = () => {
  return (
    <div className="w-full h-full flex">
      <VehiclesHeader />
      <div className="h-full basis-[50%]">
        <Map />
      </div>
    </div>
  );
};

export default Vehicles;

