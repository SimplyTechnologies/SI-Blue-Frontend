import { useState } from 'react';
import AddVehicle from '../AddVehicle';
import { Button } from '@/components/atom/Button';

type HeaderAddNewType = {
  searchMode: boolean;
}

const HeaderAddNew = ({searchMode}: HeaderAddNewType) => {
  const [openAddVehicle, setOpenAddVehicle] = useState(false);

  return (
    <div className={`${searchMode ? 'hidden' : 'flex'} transition-all duration-300 ease-in-out`}>
      <Button
        onClick={() => setOpenAddVehicle(true)}
        variant={'default'}
        className="w-[132px] h-[56px] max-[1200px]:h-[42px]"
      >
        + Add
      </Button>

      <AddVehicle open={openAddVehicle} onOpenChange={setOpenAddVehicle} />
    </div>
  );
};

export default HeaderAddNew;

