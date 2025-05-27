import { Button } from '@/components/atom/Button';
import { CustomAlertDialog } from '@/components/molecule/CustomAlertDialog';
import AssignCustomer from '@/components/organism/AssignCustomer';
import { useState } from 'react';

function Users() {
  const [openAddVehicle, setOpenAddVehicle] = useState(false);
  return (
    <div className={`flex transition-all duration-300 ease-in-out`}>
      <CustomAlertDialog
        trigger={<Button variant="default">Assign customer</Button>}
        title="Are you sure you want to delete the vehicle?"
        message="This action cannot be undone. This will permanently delete your vehicle and remove your data from our servers."
        handleConfirm={() => setOpenAddVehicle(true)}
      />

      <AssignCustomer open={openAddVehicle} onOpenChange={setOpenAddVehicle} />
    </div>
  );
}

export default Users;

