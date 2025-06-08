import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { ChevronDown, ChevronRight } from 'lucide-react';

import trashIcon from '@/assets/trash.svg';
import type { TableHeaders } from '@/types/TableHeaders';
import type { CustomerVehicle } from '@/types/Vehicle';

import getColorFromName from '@/utils/getRandomColor';
import formatDate from '@/utils/formatDate';

interface TableColumnsProps {
  type: 'users' | 'customers';
}

const TableColumns = ({ type }: TableColumnsProps): ColumnDef<TableHeaders>[] => {
  return [
    {
      accessorFn: row => `${row.firstName}  ${row.lastName}`,
      id: 'fullName',
      header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Name</p>,
      cell: ({ row }) => {
        // Check if this is a sub-row (vehicle) or main row (customer)
        const isSubRow = row.depth > 0;

        if (isSubRow) {
          // For vehicle sub-rows, don't show name info
          return <div className="pl-8"></div>; // Just indent to show hierarchy
        }

        // For main customer rows
        const fullName = row.getValue('fullName') as string;
        const firstName = row.original?.firstName || '';
        const lastName = row.original?.lastName || '';
        const kit = getColorFromName(fullName);

        return (
          <div className="flex gap-[12px] items-center">
            {row.getCanExpand() ? (
              <button
                onClick={row.getToggleExpandedHandler()}
                className="flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded cursor-pointer"
              >
                {row.getIsExpanded() ? (
                  <ChevronDown className="w-4 h-4 text-support-6" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-support-6" />
                )}
              </button>
            ) : (
              <button className='w-6 h-6' disabled>
                <ChevronRight className="w-4 h-4 text-support-7" />
              </button>
            )}

            <Avatar
              className="w-[52px] h-[52px] rounded-[50%] flex justify-center items-center"
              style={{ backgroundColor: kit.bg }}
            >
              <AvatarImage src="" />
              <AvatarFallback
                className="font-bold text-sm bg-primary-5 leading-[120%]"
                style={{ backgroundColor: 'transparent', color: kit.color }}
              >
                {(firstName[0] || '') + (lastName[0] || '')}
              </AvatarFallback>
            </Avatar>
            <span className="capitalize font-bold text-xs leading-[120%] text-support-6">{fullName}</span>
          </div>
        );
      },
    },
    ...(type === 'customers'
      ? [
          {
            accessorFn: row => row.vehicles,
            id: 'vehicles',
            header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Vehicle</p>,
            cell: ({ row }) => {
              const isSubRow = row.depth > 0;
              if (isSubRow) {
                const vehicle = row.original;
                return (
                  <div className="flex flex-col gap-[2px] justify-center items-start">
                    <span className="font-bold text-xs leading-[120%] text-support-6">{vehicle?.vin}</span>
                    <span className="font-regular text-xs leading-[140%] text-support-5">
                      {vehicle?.make + ' ' + vehicle?.model + ' ' + vehicle?.year}
                    </span>
                  </div>
                );
              }

              const vehicles = row.getValue('vehicles') as CustomerVehicle[];
              const isExpanded = row.getIsExpanded();
              const hasMultipleVehicles = vehicles && vehicles.length > 1;

              if (!vehicles || vehicles.length === 0) {
                return <div className='min-w-[123px]'></div>;
              }

              return (
                <>
                  <div className="flex flex-col gap-[2px] justify-center items-start">
                    <span className="font-bold text-xs leading-[120%] text-support-6">{vehicles[0]?.vin}</span>
                    <span className="font-regular text-xs leading-[140%] text-support-5">
                      {vehicles[0]?.make + ' ' + vehicles[0]?.model + ' ' + vehicles[0]?.year}
                    </span>
                  </div>

                  {/* Show count indicator if multiple vehicles but not expanded */}
                  {hasMultipleVehicles && !isExpanded && (
                    <span className="text-xs text-support-5 italic">
                      +{vehicles.length - 1} more vehicle{vehicles.length - 1 > 1 ? 's' : ''}
                    </span>
                  )}
                </>
              );
            },
          } as ColumnDef<TableHeaders>,
        ]
      : []),
    {
      accessorKey: 'email',
      header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Mail</p>,
      cell: ({ row }) => {
        const isSubRow = row.depth > 0;
        if (isSubRow) {
          return <span className="pl-8"></span>; // Empty cell for sub-rows
        }
        return <span className="font-medium text-sm leading-[140%] text-support-5">{row.getValue('email')}</span>;
      },
    },
    ...(type === 'customers'
      ? [
          {
            accessorFn: row =>
              (row.vehicles as CustomerVehicle[])?.map((vehicle: CustomerVehicle) => vehicle.assignedDate),
            id: 'assignedDate',
            header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Assign Date</p>,
            cell: ({ row }) => {
              const isSubRow = row.depth > 0;

              if (isSubRow) {
                // Show assign date for individual vehicle
                const vehicle = row.original;
                return (
                  <div className="">
                    <span className="capitalize font-medium text-sm leading-[140%] text-support-5">
                      {vehicle?.assignedDate ? formatDate(vehicle.assignedDate) : ''}
                    </span>
                  </div>
                );
              }

              const assignedDates = row.getValue('assignedDate') as string[];

              if (!assignedDates || assignedDates.length === 0) {
                return <div className='min-w-[148px]'></div>;
              }

              return (
                <div className="flex flex-col gap-[0.5rem]">
                  <span className="capitalize font-medium text-sm leading-[140%] text-support-5">
                    {formatDate(assignedDates[0]) || ''}
                  </span>
                </div>
              );
            },
          } as ColumnDef<TableHeaders>,
        ]
      : []),
    {
      accessorKey: 'phoneNumber',
      header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Phone</p>,
      cell: ({ row }) => {
        const isSubRow = row.depth > 0;
        if (isSubRow) {
          return <span></span>;
        }
        return (
          <span className="capitalize font-medium text-sm leading-[140%] text-support-5">
            {row.getValue('phoneNumber')}
          </span>
        );
      },
    },
    ...(type === 'users'
      ? [
          {
            accessorKey: 'status',
            header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Status</p>,
            cell: ({ row }) => {
              const isSubRow = row.depth > 0;
              if (isSubRow) {
                return <span></span>;
              }
              return (
                <div
                  className={`capitalize w-[81px] h-[40px] py-[10px] px-[12px] flex justify-center items-center rounded-full font-semibold text-xs leading-[140%] ${
                    row.getValue('status') === 'Pending' ? 'bg-[#FFF8E0] text-[#F2A626]' : 'bg-[#E5FAF5] text-[#04B78A]'
                  }`}
                >
                  {row.getValue('status')}
                </div>
              );
            },
          } as ColumnDef<TableHeaders>,
        ]
      : []),
    {
      id: 'actions',
      enableHiding: false,
      header: () => <p className="font-bold text-sm text-support-7 leading-[140%] text-right">Action</p>,
      cell: ({ row }) => {
        const isSubRow = row.depth > 0;
        if (isSubRow) {
          return <div></div>; // Empty cell for sub-rows
        }
        return (
          <div className="flex w-[1.5rem] h-[1.5rem] items-center justify-center cursor-pointer">
            <img src={trashIcon} alt="trash" className="w-[24px] h-[24px]" />
          </div>
        );
      },
    },
  ];
};

export default TableColumns;
