import { useState } from 'react';
import { Button } from '@/components/atom/Button';
import AddVehicle from '@/components/organism/AddVehicle';
import { useSearchStore } from '@/stores/useSearchStore';

type AddNewVehicleButton = {
  buttonName: string;
  className: string;
};

const AddNewVehicleButton = ({ buttonName, className }: AddNewVehicleButton) => {
  const [openAddVehicle, setOpenAddVehicle] = useState(false);
  const { isSearchActive } = useSearchStore();

  return (
    <div className={`${isSearchActive ? 'hidden' : 'flex'} transition-all duration-300 ease-in-out`}>
      <Button onClick={() => setOpenAddVehicle(true)} variant="default" className={className}>
        {buttonName}
      </Button>

      <AddVehicle open={openAddVehicle} onOpenChange={setOpenAddVehicle} />
    </div>
  );
};

export default AddNewVehicleButton;

