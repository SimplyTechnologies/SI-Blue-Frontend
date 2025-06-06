import { useState } from 'react';

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atom/Table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/molecule/Pagination';
import type { Customers } from '@/types/Customers';
import TableColumns from '../molecule/TableColumns';

import { usePaginationRange } from '@/hooks/usePaginationRange';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps {
  type: 'users' | 'customers';
  data: Customers[];
  pagination: PaginationProps;
  isLoading: boolean;
}

type ExpandedState = true | Record<string, boolean>;


export const DataTableDemo: React.FC<DataTableProps> = ({ type, data, pagination }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const columns = TableColumns({ type });
  const table = useReactTable({
    data,
    columns: columns as ColumnDef<Customers>[],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSubRows: row => row.vehicles as unknown as Customers[],
    getRowCanExpand: row => row.original.vehicles?.length > 1,
    getRowId: (row, index, parent) => {
      if (parent) {
        return `${parent.id}_sub_${index}`;
      }
      return `row_${row.id}`;
    },

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
    },
    onExpandedChange: setExpanded,
  });

  const paginationRange = usePaginationRange(pagination.page, pagination.totalPages);

  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      pagination.onPageChange(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      pagination.onPageChange(pagination.page + 1);
    }
  };
  const handlePageClick = (page: number) => {
    pagination.onPageChange(page);
  };

  return (
    <div className="w-full">
      <div className="rounded-md p-[1.5rem] overflow-hidden bg-white">
        <Table>
          <TableHeader className="[&_tr]:border-none border-b-[1px] border-support-12">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent focus:bg-transparent">
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
              table.getRowModel().rows.map(row => {
                const isMainRow = row.depth === 0;
                const isSubRow = row.depth > 0;

                return (
                  <TableRow
                    key={row.id}
                    className={`${isSubRow ? 'h-[50px]' : 'h-[80px]'} last:mb-0
                      ${isSubRow ? 'border-none bg-[#F5F5F5] hover:bg-[#F5F5F5]' : 'border-b border-support-12 hover:bg-transparent'} ${isMainRow && row.getIsExpanded() ? 'bg-[#F5F5F5] hover:bg-[#F5F5F5] shadow-[inset_2px_4px_16px_-0px_rgba(0,0,0,0.06)] ' : ''} `}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        style={{ verticalAlign: 'middle' }}
                        className={`p-0 pr-[2rem] 
                          ${isSubRow || cell.column.id === 'actions' ? 'h-[50px]' : isMainRow || cell.column.id === 'actions' ? 'h-[80px]' : ''}
                          ${isMainRow && cell.column.id === 'actions' ? 'h-[80px] flex items-center justify-end p-[0]' : ''}
                        `}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
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
      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePreviousPage}
              className={pagination.page <= 1 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
            />
          </PaginationItem>

          {paginationRange.map((page, index) => (
            <PaginationItem key={index}>
              {page === 'dots' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageClick(page as number)}
                  isActive={pagination.page === page}
                  className={`text-xs w-[40px] h-[40px] p-[0.5rem] rounded-[0.5rem] flex items-center justify-center ${
                    pagination.page === page
                      ? 'bg-sidebar-accent text-primary-3 font-bold leading-[120%]'
                      : 'font-medium hover:bg-sidebar-accent text-support-7 leading-[140%]'
                  }`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={handleNextPage}
              className={pagination.page >= pagination.totalPages ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
