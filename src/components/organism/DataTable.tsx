import { useEffect, useRef, useState } from 'react';

import {
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
import type { Customers } from '@/types/Customer';
import type { User } from '@/types/User';
import TableColumns from '../molecule/TableColumns';
import NothingToShow from '@/components/molecule/NothingToShow';

import { usePaginationRange } from '@/hooks/usePaginationRange';
import { nothingToShowOptions } from '@/utils/constants';
import { useDynamicPageSize } from '@/hooks/useDynamicRows';

type TableData = User | Customers;

const isCustomer = (item: TableData): item is Customers => {
  return 'vehicles' in item;
};

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T extends TableData> {
  type: 'users' | 'customers';
  data: T[];
  pagination: PaginationProps;
  isLoading: boolean;
}

type ExpandedState = true | Record<string, boolean>;

export const DataTableDemo = <T extends TableData>({ type, data, pagination }: DataTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const dynamicPageSize = useDynamicPageSize();
  const [fixedHeight, setFixedHeight] = useState<string>('auto');
  const [hasExpandedRows, setHasExpandedRows] = useState(false);

  useEffect(() => {
    const calculateFixedHeight = () => {
      const headerHeight = 80;
      const paddingHeight = 48;
      const calculatedHeight = headerHeight + dynamicPageSize * 80 + paddingHeight;
      setFixedHeight(`${calculatedHeight}px`);
    };

    calculateFixedHeight();
    window.addEventListener('resize', calculateFixedHeight);
    return () => window.removeEventListener('resize', calculateFixedHeight);
  }, [dynamicPageSize]);

  // Track if any rows are expanded
  useEffect(() => {
    const expandedCount = Object.values(expanded || {}).filter(Boolean).length;
    setHasExpandedRows(expandedCount > 0);
  }, [expanded]);

  const columns = TableColumns<T>({ type });
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSubRows: row => {
      if (type === 'customers' && isCustomer(row)) {
        return row.vehicles.slice(1) as unknown as T[];
      }
      return undefined;
    },
    getRowCanExpand: row => {
      if (type === 'customers' && isCustomer(row.original)) {
        return (row.original.vehicles?.length || 0) > 0;
      }
      return false;
    },
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
  const hasData = table.getRowModel().rows?.length > 0;
  const showPagination = hasData && pagination.totalPages > 1;

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
      <div
        ref={containerRef}
        style={{
          height: fixedHeight,
          maxHeight: hasExpandedRows ? 'none' : fixedHeight,
        }}
        className={`w-full ${hasExpandedRows ? 'overflow-y-auto' : 'overflow-hidden'} rounded-md p-[1.5rem] bg-white overflow-y-auto
                    [&::-webkit-scrollbar]:w-[0.25rem]
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-track]:h-[1px]
                    [&::-webkit-scrollbar-thumb]:bg-support-8
                    [&::-webkit-scrollbar-thumb]:rounded-full
        `}
      >
        <Table className="parent:bg-support-6">
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
              <TableRow className="h-full pointer-events-none border-none hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0 h-full border-none">
                  <div className="flex items-center justify-center w-full min-h-[350px]">
                    <NothingToShow
                      title={type === 'users' ? nothingToShowOptions.users.title : nothingToShowOptions.customers.title}
                      subtitle={
                        type === 'users' ? nothingToShowOptions.users.subtitle : nothingToShowOptions.customers.subtitle
                      }
                      icon={type === 'users' ? nothingToShowOptions.users.icon : nothingToShowOptions.customers.icon}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
                role="button"
                aria-label="Previous"
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
                    role="button"
                    aria-label="Go to page"
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
                role="button"
                aria-label="Next"
                className={
                  pagination.page >= pagination.totalPages ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
