import { useLocation, useNavigate } from 'react-router';
import { ChevronLeft, EllipsisVertical, PencilIcon, TrashIcon } from 'lucide-react';
import Map from '@/components/organism/Map';
import { Button } from '@/components/atom/Button';
import { Toaster } from '@/components/atom/Toaster';
import VehicleCardDetails from '@/components/molecule/VehicleCardDetails';
import CustomDropdown from '@/components/molecule/CustomDropdown';

const VehicleDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { vehicle } = location.state;

  // const { id } = useParams();

  const handleBack = () => {
    navigate('/vehicles');
  };

  const handleDelete = () => {};

  const handleEdit = () => {};

  const vehicleDropdownOptions = [
    { label: 'Edit', onClick: handleEdit, icon: <PencilIcon className="stroke-primary" /> },
    { label: 'Delete', onClick: handleDelete, icon: <TrashIcon className="stroke-primary" /> },
  ];

  return (
    <div className="flex w-full h-[calc(100vh-78px)]">
      <div className="flex flex-col gap-2 h-full bg-white px-6 pt-6 max-[768px]:px-2 max-[768px]:pt-2 min-[991px]:w-[600px]">
        <div className="flex flex-col h-full">
          <div
            className={`flex justify-between items-start w-full gap-[6rem] max-[1200px]:gap-0 transition-all duration-300 ease-in-out max-w-full`}
          >
            <Button variant="text" className="w-auto flex text-xs text-primary hover:opacity-80" onClick={handleBack}>
              <ChevronLeft color="#28303F" className="h-[24px] w-[24px]" />
            </Button>
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
          </div>
          <div
            className="flex-1 h-full max-h-[calc(100vh-13.125rem)] max-[1200px]:max-h-[calc(100vh-16.125rem)] max-[600px]:max-h-[calc(100vh-18.125rem)] overflow-y-auto   [&::-webkit-scrollbar]:w-[0.25rem]
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-track]:h-[1px]
                [&::-webkit-scrollbar-thumb]:bg-support-8
                [&::-webkit-scrollbar-thumb]:rounded-full
              "
          >
            {vehicle && <VehicleCardDetails vehicle={vehicle} />}
          </div>
          <Toaster richColors visibleToasts={1} />
        </div>
      </div>

      <div className="flex-[1_1_60%] h-full">
        <Map
          cords={[
            {
              id: vehicle.id,
              lat: vehicle.location.lat as number,
              lng: vehicle.location.lng as number,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default VehicleDetails;

