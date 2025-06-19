import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

import getColorFromName from '@/utils/getRandomColor';
import { formatDate } from '@/utils/formatDate';
import type { CustomerValueType, UserActivity, VehicleValueType } from '@/types/History';


const HistoryColumns = (): ColumnDef<UserActivity>[] => {
  return [
    {
      id: 'fullName',
      accessorFn: row => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`,
      header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Name</p>,
      cell: ({ row }) => {
        const fullName = row.getValue('fullName') as string;
        const firstName = row.original.user?.firstName || '';
        const lastName = row.original.user?.lastName || '';
        const avatarUrl = row.original.user?.avatarUrl || null;
        const kit = getColorFromName(fullName);

        return (
          <div className="flex gap-[12px] items-center">
            <Avatar
              className="w-[52px] h-[52px] rounded-[50%] flex justify-center items-center"
              style={{ backgroundColor: kit.bg }}
            >
              <AvatarImage className="object-cover rounded-[50%] w-full h-full" src={avatarUrl || undefined} />
              <AvatarFallback
                className="font-bold text-sm bg-primary-5 leading-[120%]"
                style={{ backgroundColor: 'transparent', color: kit.color }}
              >
                {(firstName[0] || '') + (lastName[0] || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-[4px]">
              <span className="capitalize font-bold text-xs leading-[120%] text-support-6">{fullName}</span>
              <span className="font-medium text-sm leading-[140%] text-support-5">{row.original.user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'action',
      header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Activity</p>,
      cell: ({ row }) => {
        const actionType = row.original.actionType;
        const modelType = row.original.modelType;
        const previous = row.original.previousValue;
        const current = row.original.currentValue;
        const isVehicle = modelType === 'vehicle';
        const isCustomer = modelType === 'customer';

        let display: React.ReactNode = null;

        if (isVehicle) {
          const vehicle = (actionType === 'UPDATE' ? previous : current) as VehicleValueType | null;

          const title = `${vehicle?.make?.name || ''} ${vehicle?.model?.name || ''} ${vehicle?.year || ''}`;
          const vin = vehicle?.vin || '';
          const vehicleId = vehicle?.id;

          const info = (
            <div className="flex gap-[4px]">
              <span className="font-[600] text-sm text-[#848C98] italic">{title}</span>
              <span className="font-[600] text-sm text-[#848C98] italic">({vin})</span>
            </div>
          );

          if (actionType === 'CREATE') {
            display = (
              <div className="flex gap-[4px]">
                <span className="font-normal text-sm text-[#848C98] italic">added vehicle</span>
                {info}
              </div>
            );
          } else if (actionType === 'DELETE') {
            display = (
              <div className="flex gap-[4px]">
                <span className="font-normal text-sm text-[#848C98] italic">deleted vehicle</span>
                {info}
              </div>
            );
          } else if (actionType === 'UPDATE') {
            const customerPrevId = (previous as VehicleValueType | null)?.customerId;
            const customerCurrId = (previous as VehicleValueType | null)?.customerId;
            display = (
              <div className='flex gap-[4px]'>
                <span className="font-normal text-sm text-[#848C98] italic">
                  {customerPrevId && customerCurrId
                    ? 'updated vehicle'
                    : !customerPrevId && customerCurrId
                      ? 'assigned vehicle'
                      : 'unassigned vehicle'}
                </span>
                {vehicleId ? (
                  <a
                    href={`/vehicles/${vehicleId}`}
                    className="underline font-[600] text-sm text-[#848C98] italic hover:text-primary-7"
                  >
                    {title} ({vin})
                  </a>
                ) : (
                  info
                )}
              </div>
            );
          }
        } else if (isCustomer) {
          const customer = (previous || current) as CustomerValueType | null;
          const name = `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim();
          if (actionType === 'DELETE') {
            display = (
              <div className="flex gap-[4px]">
                <span className="font-normal text-sm text-[#848C98] italic">deleted customer</span>
                <span className="font-[600] text-sm text-[#848C98] italic">{name}</span>
              </div>
            );
          }
        }
        return <div className="flex flex-col gap-1">{display}</div>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Date</p>,
      cell: ({ row }) => (
        <span className="font-medium text-sm leading-[140%] text-support-5">
          {formatDate(row.getValue('createdAt'))}
        </span>
      ),
    },
  ];
};

export default HistoryColumns;
