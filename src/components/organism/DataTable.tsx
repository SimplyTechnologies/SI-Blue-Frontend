import { useState } from 'react';

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';

import { Button } from '@/components/atom/Button';
import { Checkbox } from '@/components/atom/Checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atom/DropdownMenu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atom/Table';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    phone: '+374 55 55 55 55',
    name: 'Kennnnn',
    mail: 'ken99@example.com',
  },
  {
    id: '3u1reuv4',
    phone: '+374 55 55 55 55',
    name: 'Abeeeee',
    mail: 'Abe45@example.com',
  },
  {
    id: 'derv1ws0',
    phone: '+374 55 55 55 55',
    name: 'Monserrat',
    mail: 'Monserrat44@example.com',
  },
  {
    id: '5kma53ae',
    phone: '+374 55 55 55 55',
    name: 'Silas',
    mail: 'Silas22@example.com',
  },
  {
    id: 'bhqecj4p',
    phone: '+374 55 55 55 55',
    name: 'Carmella',
    mail: 'carmella@example.com',
  },
];

export type Payment = {
  id: string;
  name: string;
  mail: string;
  phone: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="w-[56px] min-h-[64px] flex justify-start items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="w-[24px] h-[24px] rounded-[0.25rem] bg-support-12 border-[1px] border-support-8 data-[state=checked]:text-primary-3 cursor-pointer"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[56px] min-h-[80px] flex justify-start items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="w-[24px] h-[24px] rounded-[0.25rem] bg-support-12 border-[1px] border-support-8 data-[state=checked]:text-primary-3 cursor-pointer"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Name</p>,
    cell: ({ row }) => {
      return (
        <div className="flex gap-[12px] items-center">
          <Avatar className="w-[52px] h-[52px] rounded-[50%] bg-primary-5">
            <AvatarImage src="" />
            <AvatarFallback className="text-support-6 font-bold text-sm bg-primary-5 leading-[120%]"></AvatarFallback>
          </Avatar>
          <div className="capitalize">{row.getValue('name')}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'mail',
    header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Mail</p>,
    cell: ({ row }) => (
      <div className="capitalize font-medium text-sm leading-[140%] text-support-5">{row.getValue('mail')}</div>
    ),
  },
  {
    accessorKey: 'phone',
    header: () => <p className="font-bold text-sm text-support-7 leading-[140%]">Phone</p>,
    cell: ({ row }) => (
      <div className="capitalize font-medium text-sm leading-[140%] text-support-5">{row.getValue('phone')}</div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="flex justify-end w-[24px] h-[24px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-[24px] h-[24px] ">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="text-support-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function DataTableDemo() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-end pb-4">
        <Button
          variant="default"
          className="max-w-[143px] h-[40px] py-[10px] px-[18px] text-xs leading-[120%] flex gap-[0.5rem] justify-center items-center"
        >
          <span>+</span> Add New User
        </Button>
      </div>
      <div className="rounded-md border p-[1.5rem] overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className="p-0">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="p-0 last:w-[24px]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="flex gap-[2rem]">
          <Button
            variant="outline"
            className="max-w-[143px] h-[40px] py-[10px] px-[18px] text-xs leading-[120%] flex gap-[0.5rem] justify-center items-center"
            // onClick={() => table.previousPage()}
            // disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="max-w-[143px] h-[40px] py-[10px] px-[18px] text-xs leading-[120%] flex gap-[0.5rem] justify-center items-center"
            // onClick={() => table.nextPage()}
            // disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
