import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, EllipsisVertical, PencilIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import { deleteVehicle } from '@/api/vehicles';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { vehicleDetailsQuery } from '@/queries/vehicles';
import type { VehicleType } from '@/types/Vehicle';
import { Button } from '@/components/atom/Button';
import VehicleCardDetails from '@/components/molecule/VehicleCardDetails';
import CustomDropdown from '@/components/molecule/CustomDropdown';
import { CustomAlertDialog } from '@/components/molecule/CustomAlertDialog';
import VehicleForm from '@/components/organism/VehicleForm';
import { buildLocationForEdit } from '@/components/organism/VehicleForm/VehicleForm.data';

export default function VehicleDetails() {
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data } = useQuery(vehicleDetailsQuery(id));

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
    if (!data?.vehicle?.id) return;
    await deleteVehicle(data.vehicle.id);
    toast.success('Vehicle deleted successfully!');
    queryClient.invalidateQueries({
      queryKey: ['vehicles', { id }],
    });
    navigate('/vehicles');
  };

  const onEditSuccess = (updatedData?: VehicleType) => {
    if (updatedData) {
      queryClient.setQueryData(['vehicle', id], { vehicle: updatedData });
      queryClient.invalidateQueries({
        queryKey: ['vehicles', { id }],
      });
      toast.success('Vehicle successfully edited');
    }
  };

  const onAssignSuccess = (vehicle: VehicleType) => {
    if (vehicle) {
      queryClient.setQueryData(['vehicle', id], { vehicle: vehicle });
      queryClient.invalidateQueries({
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
    if (!data?.vehicle) return null;
    return {
      make: data.vehicle.make.id.toString(),
      model: data.vehicle.model.id.toString(),
      year: data.vehicle.year.toString(),
      vin: data.vehicle.vin,
      location: buildLocationForEdit(data.vehicle.location),
      street: data.vehicle.location.street,
      city: data.vehicle.location.city,
      state: data.vehicle.location.state,
      country: data.vehicle.location.country,
      zipcode: data.vehicle.location.zipcode,
      lat: data.vehicle.location.lat,
      lng: data.vehicle.location.lng,
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
          {data?.vehicle && !data?.vehicle?.customerId && isAdmin ? (
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
          {data?.vehicle ? (
            <VehicleCardDetails
              vehicle={data.vehicle}
              onAssignSuccess={onAssignSuccess}
            />
          ) : null}
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
        vehicleId={data?.vehicle?.id}
      />
    </div>
  );
}

