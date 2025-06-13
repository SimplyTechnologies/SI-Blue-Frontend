import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { CustomAlertDialog } from './CustomAlertDialog';
import CustomTooltip from './CustomTooltip';
import { Popover, PopoverContent, PopoverTrigger } from '../atom/Popover';
import { Button } from '../atom/Button';
import trashIcon from '@/assets/trash.svg';
import rotation from '@/assets/rotation.svg';
import type { CustomerVehicle } from '@/types/Vehicle';
import type { Customers } from '@/types/Customer';
import type { User } from '@/types/User';

import getColorFromName from '@/utils/getRandomColor';
import { formatDate } from '@/utils/formatDate';
import { useDeleteUser } from '@/hooks/useUser';
import { useDeleteCustomer } from '@/hooks/useCustomer';
import { useUnassignVehicle } from '@/hooks/useVehicle';

type TableData = User | Customers;

interface TableColumnsProps {
  type: 'users' | 'customers';
}

const isCustomer = (item: TableData): item is Customers => {
  return 'vehicles' in item;
};

const TableColumns = <T extends TableData>({ type }: TableColumnsProps): ColumnDef<T>[] => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<number | null>(null);
  const [isConfirmUnassignOpen, setIsConfirmUnassignOpen] = useState<number | null>(null);
  const [unassignData, setUnassignData] = useState<{ customerId: number; unassignAll: boolean } | null>(null);
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const [showTooltipRow, setShowTooltipRow] = useState<{ [key: string]: boolean }>({});

  const deleteUser = useDeleteUser();
  const deleteCustomer = useDeleteCustomer();
  const unassignVehicle = useUnassignVehicle();

  const handleDelete = async (id: number, type: 'users' | 'customers') => {
    try {
      if (type === 'users') {
        await deleteUser.mutate(id.toString());
        setIsConfirmDeleteOpen(null);
      } else {
        await deleteCustomer.mutate(id.toString());
        setIsConfirmDeleteOpen(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUnassign = async ({
    customerId,
    vehicleId,
    unassignAll,
  }: {
    customerId: number;
    vehicleId?: number;
    unassignAll?: boolean;
  }) => {
    try {
      await unassignVehicle.mutate({ customerId, vehicleId, unassignAll });
      setIsConfirmUnassignOpen(null);
      setUnassignData(null);
    } catch (error) {
      console.error('Error unassigning vehicle:', error);
    }
  };

  return [
    {
      accessorFn: row => `${row.firstName} ${row.lastName}`,
      id: 'fullName',
      header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Name</p>,
      cell: ({ row }) => {
        const isSubRow = row.depth > 0;

        if (isSubRow) {
          return <div className="pl-8"></div>;
        }

        const fullName = row.getValue('fullName') as string;
        const firstName = row.original?.firstName || '';
        const lastName = row.original?.lastName || '';
        const kit = getColorFromName(fullName);

        return (
          <div className="flex gap-[12px] items-center">
            {type === 'customers' &&
              (row.getCanExpand() ? (
                <button
                  onClick={row.getToggleExpandedHandler()}
                  aria-label="Expand/Collapse"
                  className="flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded cursor-pointer"
                >
                  {row.getIsExpanded() ? (
                    <ChevronDown className="w-4 h-4 text-support-6" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-support-6" />
                  )}
                </button>
              ) : (
                <button className="w-6 h-6" disabled>
                  {/* <ChevronRight className="w-4 h-4 text-support-7" /> */}
                </button>
              ))}

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
            accessorFn: row => (isCustomer(row) ? row.vehicles : undefined),
            id: 'vehicles',
            header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Vehicle</p>,
            cell: ({ row }) => {
              const isSubRow = row.depth > 0;
              if (isSubRow) {
                const vehicle = row.original as unknown as CustomerVehicle;
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
                return <div className="min-w-[123px]"></div>;
              }

              return (
                <>
                  <div className="flex flex-col gap-[2px] justify-center items-start">
                    <span className="font-bold text-xs leading-[120%] text-support-6">{vehicles[0]?.vin}</span>
                    <span className="font-regular text-xs leading-[140%] text-support-5">
                      {vehicles[0]?.make + ' ' + vehicles[0]?.model + ' ' + vehicles[0]?.year}
                    </span>
                  </div>

                  {hasMultipleVehicles && !isExpanded && (
                    <span className="text-xs text-support-5 italic">
                      +{vehicles.length - 1} more vehicle{vehicles.length - 1 > 1 ? 's' : ''}
                    </span>
                  )}
                </>
              );
            },
          } as ColumnDef<T>,
        ]
      : []),
    {
      accessorKey: 'email',
      header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Mail</p>,
      cell: ({ row }) => {
        const isSubRow = row.depth > 0;
        if (isSubRow) {
          return <span className="pl-8"></span>;
        }
        return <span className="font-medium text-sm leading-[140%] text-support-5">{row.getValue('email')}</span>;
      },
    },
    ...(type === 'customers'
      ? [
          {
            accessorFn: row =>
              isCustomer(row) ? row.vehicles?.map((vehicle: CustomerVehicle) => vehicle.assignedDate) : undefined,
            id: 'assignedDate',
            header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Assign Date</p>,
            cell: ({ row }) => {
              const isSubRow = row.depth > 0;

              if (isSubRow) {
                const vehicle = row.original as unknown as CustomerVehicle;
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
                return <div className="min-w-[148px]"></div>;
              }

              return (
                <div className="flex flex-col gap-[0.5rem]">
                  <span className="capitalize font-medium text-sm leading-[140%] text-support-5">
                    {formatDate(assignedDates[0]) || ''}
                  </span>
                </div>
              );
            },
          } as ColumnDef<T>,
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
            accessorKey: 'isActive',
            header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Status</p>,
            cell: ({ row }) => {
              const isSubRow = row.depth > 0;
              if (isSubRow) {
                return <span></span>;
              }
              return (
                <div
                  className={`capitalize w-[81px] h-[40px] py-[10px] px-[12px] flex justify-center items-center rounded-full font-semibold text-xs leading-[140%] ${
                    row.getValue('isActive') === false ? 'bg-[#FFF8E0] text-[#F2A626]' : 'bg-[#E5FAF5] text-[#04B78A]'
                  }`}
                >
                  {row.getValue('isActive') ? 'Active' : 'Pending'}
                </div>
              );
            },
          } as ColumnDef<T>,
        ]
      : []),
    {
      id: 'actions',
      enableHiding: false,
      header: () => <p className="font-bold text-sm text-support-7 leading-[140%] text-right">Actions</p>,
      cell: ({ row }) => {
        const isSubRow = row.depth > 0;
        const isVehicles = type === 'customers' ? (row.getValue('vehicles') as CustomerVehicle[])?.length > 0 : false;
        const isMoreVehicles =
          type === 'customers' ? (row.getValue('vehicles') as CustomerVehicle[])?.length > 1 : false;
        const vehicles = type === 'customers' ? (row.getValue('vehicles') as CustomerVehicle[]) : [];
        if (isSubRow) {
          const vehicle = row.original as unknown as CustomerVehicle;
          const customerId = row.parentId?.split('_')[1];
          return (
            <div
              onClick={() => handleUnassign({ customerId: Number(customerId), vehicleId: vehicle.id })}
              className="w-full flex justify-end pr-[4px]"
            >
              <CustomTooltip
                content="Unassign this vehicle"
                side="bottom"
                trigger={
                  <div className="w-[44px] h-[44px] flex justify-center items-center rounded-[8px] p-[10px] bg-[#3D5BF6] hover:bg-[#3D5BF6]/80 cursor-pointer">
                    <img src={rotation} alt="rotation" />
                  </div>
                }
              />
            </div>
          );
        }
        return (
          <div className="w-full flex justify-end pr-[4px]">
            <div
              className={`w-[92px] h-full px-[2px] py-[18px] flex justify-${isVehicles ? 'between' : 'end'} items-center`}
            >
              {isMoreVehicles ? (
                <div className="relative">
                  <Popover>
                    <PopoverTrigger>
                      <div className="w-[44px] h-[44px] flex justify-center items-center rounded-[8px] p-[10px] bg-[#3D5BF6] hover:bg-[#3D5BF6]/80 cursor-pointer">
                        <img src={rotation} alt="rotation" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                      <div className="flex flex-col">
                        <Button
                          onClick={() =>
                            handleUnassign({ customerId: Number(row.original.id), vehicleId: vehicles[0].id })
                          }
                          className="inline-flex items-center justify-start gap-[0.5rem] rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-3 py-2 group hover:bg-primary-5"
                          style={{ color: 'var(--color-support-6)' }}
                        >
                          Unassign This Vehicle
                        </Button>

                        <Button
                          onClick={() => {
                            setUnassignData({ customerId: Number(row.original.id), unassignAll: true });
                            setIsConfirmUnassignOpen(row.original.id); // Set to specific row ID
                          }}
                          className="inline-flex items-center justify-start gap-[0.5rem] rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-3 py-2 group hover:bg-primary-5"
                          style={{ color: 'var(--color-support-6)' }}
                        >
                          Unassign All Vehicles
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {showTooltipRow[row.original.id] && (
                    <div className="absolute top-full right-[-100%] mt-2 z-50 animate-in fade-in-0 zoom-in-95">
                      <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-lg border border-gray-200">
                        <div className="w-[32px] h-[32px] flex justify-center items-center rounded-full bg-[#ffc107]/10">
                          <svg
                            className="w-[18px] h-[18px] text-[#ffc107]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#192252]">Unassign All Vehicles</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => handleUnassign({ customerId: Number(row.original.id), vehicleId: vehicles[0].id })}
                  className="w-full flex justify-end pr-[4px]"
                >
                  <CustomTooltip
                    content="Unassign this vehicle"
                    side="bottom"
                    trigger={
                      <div className="w-[44px] h-[44px] flex justify-center items-center rounded-[8px] p-[10px] bg-[#3D5BF6] hover:bg-[#3D5BF6]/80 cursor-pointer">
                        <img src={rotation} alt="rotation" />
                      </div>
                    }
                  />
                </div>
              )}
              <div
                onClick={() => {
                  if (isVehicles) {
                    const rowId = row.original.id;
                    if (!Object.values(showTooltipRow)[0]) {
                      setShowTooltipRow(prev => ({ ...prev, [rowId]: true }));
                      setTimeout(() => {
                        setShowTooltipRow(prev => ({ ...prev, [rowId]: false }));
                      }, 2000);
                    }
                  } else {
                    setDeletedId(row.original.id);
                    if (!Object.values(showTooltipRow)[0]) {
                      setIsConfirmDeleteOpen(row.original.id);
                    }
                  }
                }}
                className="flex w-[1.5rem] h-[1.5rem] items-center justify-center cursor-pointer"
              >
                <img src={trashIcon} alt="trash" className="w-[24px] h-[24px]" />
              </div>
              <CustomAlertDialog
                open={isConfirmDeleteOpen === row.original.id}
                setOpen={open => setIsConfirmDeleteOpen(open ? row.original.id : null)}
                title={type === 'users' ? 'Delete User' : 'Delete Customer'}
                description={`Are you sure that you would like to delete this ${type === 'users' ? 'user' : 'customer'}? This action cannot be undone.`}
                handleConfirm={() => {
                  handleDelete(deletedId as number, type);
                  setIsConfirmDeleteOpen(null);
                }}
                variant="destructive"
                actionBtnText={deleteUser.isPending ? 'Deleting...' : 'Delete'}
                actionBtnDisabled={deleteUser.isPending}
              />

              <CustomAlertDialog
                open={isConfirmUnassignOpen === row.original.id}
                setOpen={open => setIsConfirmUnassignOpen(open ? row.original.id : null)}
                title="Unassign All Vehicles"
                description={`Are you sure that you would like to unassign all vehicles for this customer? This action cannot be undone.`}
                handleConfirm={() => {
                  if (unassignData) {
                    handleUnassign(unassignData);
                    setIsConfirmUnassignOpen(null);
                    setUnassignData(null);
                  }
                }}
                actionBtnText={deleteUser.isPending ? 'Unassigning...' : 'Unassign'}
                actionBtnDisabled={unassignData ? false : deleteUser.isPending}
              />
            </div>
          </div>
        );
      },
    },
  ];
};

export default TableColumns;
