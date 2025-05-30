import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getAllVehicleLocationsAndCounts } from '@/api/vehicles';
import Map from '@/components/organism/Map';
import AnalyticCard from '@/components/atom/AnalyticCard';
import AddNewVehicleButton from '@/components/molecule/AddNewVehicleButton';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: vehiclesData } = useQuery({
    queryKey: ['vehicles-dashboard'],
    queryFn: () => getAllVehicleLocationsAndCounts(),
  });

  return (
    <div className="w-full h-full pt-[1rem] px-[2rem] pb-[3rem] max-[480px]:px-[1rem] flex flex-col gap-[0.5rem] bg-bg-1">
      <div className="flex justify-end">
        <AddNewVehicleButton
          buttonName="+ Add New Vehicle"
          className="w-[244px] h-[56px]"
          onSuccess={() => navigate('/vehicles', { state: { addedSuccessfully: true }, replace: true })}
        />
      </div>
      <p className="text-support-6 text-[length:var(--sm-text)] font-[var(--fw-bold)] leading-[140%]">
        Total analytics
      </p>
      <div className="flex flex-wrap justify-evenly items-end gap-[1rem]">
        <AnalyticCard title={'vehicle'} count={vehiclesData?.totalCount || 0} />
        <AnalyticCard title={'customers'} count={vehiclesData?.totalCustomerCount || 0} />
        <AnalyticCard title={'vehiclesSold'} count={vehiclesData?.totalSoldVehicles || 0} />
      </div>
      <div className="h-full max-h-[608px] max-[1024px]:min-h-[200px] max-[480px]:min-h-[400px] mt-[2rem]">
        <Map cords={vehiclesData?.vehicles} />
      </div>
    </div>
  );
};
export default Dashboard;
