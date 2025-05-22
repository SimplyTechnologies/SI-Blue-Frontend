import { useState, type FC } from 'react';

import Map from '@/components/organism/Map';
import { Button } from '@/components/atom/Button';
import AnalyticCard from '@/components/atom/AnalyticCard';
import AddVehicle from '@/components/organism/AddVehicle';

const Dashboard: FC = () => {
  const [openAddVehicle, setOpenAddVehicle] = useState(false);

  return (
    <div className="w-full h-full pt-[1rem] px-[2rem] pb-[3rem] max-[480px]:px-[1rem] flex flex-col gap-[0.5rem] bg-[var(--color-bg-1)]">
      <div className="flex justify-end">
        <Button variant={'default'} className="w-[244px] h-[56px]" onClick={() => setOpenAddVehicle(true)}>
          + Add New Vehicle
        </Button>
      </div>
      <p className="text-[var(--color-support-6)] text-[length:var(--sm-text)] font-[var(--fw-bold)] leading-[140%]">
        Total analytics
      </p>
      <div className="flex flex-wrap justify-evenly items-end gap-[1rem]">
        <AnalyticCard title={'vehicle'} count={0} />
        <AnalyticCard title={'customers'} count={0} />
        <AnalyticCard title={'vehiclesSold'} count={0} />
      </div>
      <div className="h-full max-h-[608px] max-[1024px]:min-h-[200px] max-[480px]:min-h-[400px] mt-[2rem]">
        <Map />
      </div>
      <AddVehicle open={openAddVehicle} onOpenChange={setOpenAddVehicle} />
    </div>
  );
};
export default Dashboard;
