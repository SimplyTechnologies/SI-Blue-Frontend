import { useInView } from 'react-intersection-observer';

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atom/Table';
import { SearchIcon } from 'lucide-react';

import { Input } from '@/components/atom/Input';
import HistoryColumns from '@/components/molecule/HistoryColumns';
import { useHistory } from '@/hooks/useHistory';
import { useEffect } from 'react';

const History = () => {
  const { ref, inView } = useInView();

  const { data, isLoading, isPending, isFetching, fetchNextPage, hasNextPage } = useHistory({ page: 1, offset: 25 });
  const flatData = data?.pages?.flatMap(page => page.userActivity) ?? [];
  const columns = HistoryColumns();
  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
  });

  useEffect(() => {
    console.log(inView, hasNextPage);
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <div className="w-full h-full p-[1.5rem] max-[480px]:px-[1rem] flex flex-col gap-[0.5rem] bg-bg-1">
      <div className="flex items-center justify-between pb-[1rem] max-[480px]:flex-col max-[480px]:gap-[1rem] max-[480px]:items-start">
        <div className="relative">
          <SearchIcon className="absolute left-[1.5rem] top-1/2 -translate-y-1/2 text-support-3" />
          <Input
            // value={searchInput}
            // onChange={e => setSearchInput(e.target.value)}
            className="max-w-[327px] h-[42px] pl-[3.5rem]"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="w-full">
        <div className="w-full flex flex-col justify-between rounded-md p-[1.5rem] bg-white border-b-[1px] border-support-12">
          <Table className="parent:bg-support-6">
            <TableHeader className="[&_tr]:border-none border-b-[1px] border-support-12 sticky top-0 z-10 bg-[#FFFFFF] ">
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
                table.getRowModel().rows.map((row, index) => {
                  const isLast = index === table.getRowModel().rows.length - 1;
                  const isNearEnd = index >= table.getRowModel().rows.length - 2; // Trigger 2 rows before end

                  return (
                    <TableRow
                      key={row.id}
                      className={`h-[80px] last:mb-0 hover:bg-transparent ${isLast ? 'border-b-0' : 'border-b border-support-13'}`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} style={{ verticalAlign: 'middle' }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                      {isNearEnd && <div ref={ref} className="absolute" />}
                    </TableRow>
                  );
                })
              ) : isLoading || isPending || isFetching ? (
                <TableRow className="h-full pointer-events-none border-none hover:bg-transparent" />
              ) : (
                <TableRow className="h-full pointer-events-none border-none hover:bg-transparent">
                  {/* <TableCell colSpan={columns.length} className="p-0 h-full border-none">
                    <div className="flex items-center justify-center w-full min-h-[350px]">
                      <NothingToShow
                        title={
                          type === 'users' ? nothingToShowOptions.users.title : nothingToShowOptions.customers.title
                        }
                        subtitle={
                          type === 'users'
                            ? nothingToShowOptions.users.subtitle
                            : nothingToShowOptions.customers.subtitle
                        }
                        icon={type === 'users' ? nothingToShowOptions.users.icon : nothingToShowOptions.customers.icon}
                      />
                    </div>
                  </TableCell> */}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default History;
