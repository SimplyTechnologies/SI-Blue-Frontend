import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, EllipsisVertical, PencilIcon, TrashIcon } from 'lucide-react';
import type { VehicleType } from '@/types/Vehicle';
import { getVehicleById } from '@/api/vehicles';
import Map from '@/components/organism/Map';
import { Button } from '@/components/atom/Button';
import { Toaster } from '@/components/atom/Toaster';
import VehicleCardDetails from '@/components/molecule/VehicleCardDetails';
import CustomDropdown from '@/components/molecule/CustomDropdown';
import VehicleCardSkeleton from '@/components/molecule/VehicleCardSkeleton';
import { CustomAlertDialog } from '@/components/molecule/CustomAlertDialog';

const VehicleDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { active } = location.state;

  const [vehicle, setVehicle] = useState<VehicleType | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => id && getVehicleById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setVehicle(data);
    }
  }, [data]);

  const handleBack = () => {
    navigate('/vehicles', { state: { active } });
  };

  const handleDelete = () => {
    const timeout = setTimeout(() => {
      setIsConfirmOpen(true);
    }, 100);

    return () => clearTimeout(timeout);
  };

  const handleConfirm = () => {};

  const handleEdit = () => {};

  const onAssignSuccess = () => {
    if (vehicle) {
      setVehicle({ ...vehicle, sold: true });
    }
  };

  const vehicleDropdownOptions = [
    { label: 'Edit', onClick: handleEdit, icon: <PencilIcon className="stroke-primary" /> },
    { label: 'Delete', onClick: handleDelete, icon: <TrashIcon className="stroke-primary" /> },
  ];

  return (
    <div className="flex w-full h-[calc(100vh-78px)] flex-col lg:flex-row">
      <div className="flex flex-col gap-2 lg:h-full bg-white md:px-6 md:pt-6 px-2 pt-2 lg:w-[600px] h-[50%]">
        <div className="flex flex-col h-full">
          <div
            className={`flex justify-between items-start w-full gap-[6rem] lg:gap-0 transition-all duration-300 ease-in-out max-w-full`}
          >
            <Button variant="text" className="w-auto flex text-xs text-primary hover:opacity-80" onClick={handleBack}>
              <ChevronLeft color="#28303F" className="h-[24px] w-[24px]" />
            </Button>
            {vehicle && !vehicle.sold ? (
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
            {vehicle ? (
              <VehicleCardDetails vehicle={vehicle} onSuccess={onAssignSuccess} />
            ) : isLoading ? (
              <VehicleCardSkeleton details />
            ) : null}
          </div>
          <Toaster richColors visibleToasts={1} />
        </div>
      </div>

      <div className="flex-[1_1_60%] lg:h-full h-[50%]">
        <Map
          cords={
            vehicle?.id
              ? [
                  {
                    id: vehicle.id,
                    lat: vehicle.location.lat as number,
                    lng: vehicle.location.lng as number,
                  },
                ]
              : []
          }
        />
      </div>

      <CustomAlertDialog
        open={isConfirmOpen}
        setOpen={setIsConfirmOpen}
        title="Delete Vehicle"
        description="Are you sure that you would like to delete this vehicle? This action cannot be undone."
        handleConfirm={handleConfirm}
        variant="destructive"
        actionBtnText="Delete"
      />
    </div>
  );
};

export default VehicleDetails;

