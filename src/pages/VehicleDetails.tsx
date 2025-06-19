import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, EllipsisVertical, PencilIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import { deleteVehicle } from '@/api/vehicles';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import type { VehicleType } from '@/types/Vehicle';
import { Button } from '@/components/atom/Button';
import VehicleCardDetails from '@/components/molecule/VehicleCardDetails';
import CustomDropdown from '@/components/molecule/CustomDropdown';
import { CustomAlertDialog } from '@/components/molecule/CustomAlertDialog';
import VehicleForm from '@/components/organism/VehicleForm';
import { buildLocationForEdit } from '@/components/organism/VehicleForm/VehicleForm.data';
import { useVehicleData } from '@/hooks/useVehicleData';

export default function VehicleDetails() {
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data } = useVehicleData(id);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [openAddVehicle, setOpenAddVehicle] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const showConfirm = () => {
    const timeout = setTimeout(() => {
      setIsConfirmOpen(true);
    }, 100);

    return () => clearTimeout(timeout);
  };

  const handleEditOpenChange = () => {
    const timeout = setTimeout(() => {
      setOpenAddVehicle(prev => !prev);
    }, 100);

    return () => clearTimeout(timeout);
  };

  const handleDelete = async () => {
    setIsConfirmOpen(false);
    if (!data?.id) return;
    await deleteVehicle(data.id);
    toast.success('Vehicle deleted successfully!');
    queryClient.removeQueries({
      queryKey: ['map-data'],
    });
    queryClient.removeQueries({
      queryKey: ['vehicles'],
    });
    navigate('/vehicles');
  };

  const onEditSuccess = (updatedData?: VehicleType) => {
    if (updatedData) {
      queryClient.setQueryData(['vehicle', id], updatedData);
      queryClient.removeQueries({
        queryKey: ['map-data'],
      });
      queryClient.removeQueries({
        queryKey: ['vehicles'],
      });
      toast.success('Vehicle successfully edited');
    }
  };

  const onAssignSuccess = (vehicle: VehicleType) => {
    if (vehicle) {
      queryClient.setQueryData(['vehicle', id], vehicle);
      queryClient.removeQueries({
        queryKey: ['vehicles'],
      });
      toast.success('Vehicle successfully assigned to the customer');
    }
  };

  const vehicleDropdownOptions = [
    { label: 'Edit', onClick: handleEditOpenChange, icon: <PencilIcon className="stroke-primary" /> },
    { label: 'Delete', onClick: showConfirm, icon: <TrashIcon className="stroke-primary" /> },
  ];

  const getVehicleFormData = () => {
    if (!data?.id) return null;

    const { make, model, year, vin, location } = data;

    return {
      make: make.id.toString(),
      model: model.id.toString(),
      year: year.toString(),
      vin: vin,
      location: buildLocationForEdit(location),
      street: location.street,
      city: location.city,
      state: location.state,
      country: location.country,
      zipcode: location.zipcode,
      lat: location.lat,
      lng: location.lng,
    };
  };

  return (
    <div className="flex flex-col gap-2 lg:h-full bg-white md:px-6 md:pt-6 px-2 py-2 lg:w-[600px] h-[50%] min-h-[50%]">
      <div className="flex flex-col h-full">
        <div
          className={`flex justify-between items-start w-full gap-[6rem] lg:gap-0 transition-all duration-300 ease-in-out max-w-full`}
        >
          <Button variant="text" className="w-auto flex text-xs text-primary hover:opacity-80" onClick={handleBack}>
            <ChevronLeft color="#28303F" className="h-[24px] w-[24px]" />
          </Button>
          {data && !data?.customerId && isAdmin ? (
            <CustomDropdown
              sideOffset={0}
              align="end"
              trigger={
                <Button variant="text" className="w-auto flex text-xs text-primary hover:opacity-80">
                  <EllipsisVertical color="#28303F" className="h-[24px] w-[24px]" />
                </Button>
              }
              items={vehicleDropdownOptions}
              menuClassName="w-[220px] text-support-5"
            />
          ) : null}
        </div>

        <div
          className="flex-1 h-full lg:max-h-[calc(100vh-13.125rem)] pr-2 max-h-[calc(100vh-18.125rem)] overflow-y-auto [&::-webkit-scrollbar]:w-[0.25rem]
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-track]:h-[1px]
                [&::-webkit-scrollbar-thumb]:bg-support-8
                [&::-webkit-scrollbar-thumb]:rounded-full
              "
        >
          {data ? <VehicleCardDetails vehicle={data} onAssignSuccess={onAssignSuccess} /> : null}
        </div>
      </div>{' '}
      <CustomAlertDialog
        open={isConfirmOpen}
        setOpen={setIsConfirmOpen}
        title="Delete Vehicle"
        description="Are you sure that you would like to delete this vehicle? This action cannot be undone."
        handleConfirm={handleDelete}
        variant="destructive"
        actionBtnText="Delete"
      />
      <VehicleForm
        open={openAddVehicle}
        onOpenChange={handleEditOpenChange}
        onSuccess={onEditSuccess}
        data={getVehicleFormData()}
        vehicleId={data?.id}
      />
    </div>
  );
}

