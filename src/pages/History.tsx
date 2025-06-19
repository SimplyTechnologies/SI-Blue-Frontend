import { useEffect, useRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';
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

import { useHistory } from '@/hooks/useHistory';
import type { HistoryFilterState } from '@/types/User';
import { useDynamicPageSize } from '@/hooks/useDynamicRows';
import { nothingToShowOptions } from '@/utils/constants';
import { Input } from '@/components/atom/Input';
import DateRangePicker from '@/components/atom/DateRangePicker';
import HistoryColumns from '@/components/molecule/HistoryColumns';
import NothingToShow from '@/components/molecule/NothingToShow';
import { useDebounce } from '@/hooks/useDebounce';

const History = () => {
  const [fixedHeight, setFixedHeight] = useState<string>('auto');
  const { ref, inView } = useInView();
  const containerRef = useRef<HTMLDivElement>(null);
  const dynamicPageSize = useDynamicPageSize();
  const [searchInput, setSearchInput] = useState('');
  const { debounceValue } = useDebounce({ inputValue: searchInput, delay: 300 });
  const [filters, setFilters] = useState<HistoryFilterState>({
    date: { from: undefined, to: undefined },
  });

  const { data, isLoading, fetchNextPage, hasNextPage } = useHistory({
    page: 1,
    offset: dynamicPageSize,
    search: debounceValue,
    from: filters.date?.to ? filters.date?.from : undefined,
    to: filters.date?.from ? filters.date?.to : undefined,
  });
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

  const handleDateChange = (newSelectedRange: DateRange | undefined) => {
    const currentFrom = filters.date?.from;
    const currentTo = filters.date?.to;

    if (!newSelectedRange || (!newSelectedRange.from && !newSelectedRange.to)) {
      setFilters(prevFilters => ({
        ...prevFilters,
        date: { from: undefined, to: undefined },
      }));
      return;
    }

    const { from: proposedFrom, to: proposedTo } = newSelectedRange;

    if (
      currentFrom &&
      !currentTo &&
      proposedFrom &&
      proposedTo &&
      proposedFrom.getTime() === currentFrom.getTime() &&
      proposedTo.getTime() === currentFrom.getTime()
    ) {
      setFilters(prevFilters => ({
        ...prevFilters,
        date: { from: undefined, to: undefined },
      }));
      return;
    }

    if (!currentFrom && proposedFrom && proposedTo && proposedFrom.getTime() === proposedTo.getTime()) {
      setFilters(prevFilters => ({
        ...prevFilters,
        date: { from: proposedFrom, to: undefined },
      }));
    } else if (currentFrom && !filters.date?.to && proposedFrom && !proposedTo) {
      setFilters(prevFilters => ({
        ...prevFilters,
        date: { from: proposedFrom, to: undefined },
      }));
    } else {
      setFilters(prevFilters => ({
        ...prevFilters,
        date: { from: proposedFrom, to: proposedTo },
      }));
    }
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

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

  return (
    <div className="w-full h-full p-[1.5rem] max-[480px]:px-[1rem] flex flex-col gap-[0.5rem] bg-bg-1">
      <div className="flex items-center gap-4 pb-[1rem] max-[480px]:flex-col max-[480px]:gap-[1rem] max-[480px]:items-start">
        <div className="relative">
          <SearchIcon className="absolute left-[1.5rem] top-1/2 -translate-y-1/2 text-support-3" />
          <Input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="max-w-[327px] h-[42px] pl-[3.5rem] max-[480px]:max-w-[90vw] max-[480px]:w-[90vw]"
            placeholder="Search..."
          />
        </div>
        <DateRangePicker className="w-[280px] max-[480px]:w-[90vw]" value={filters.date} onChange={handleDateChange} />
      </div>

      <div className="w-full">
        <div
          ref={containerRef}
          style={{
            height: fixedHeight,
            maxHeight: fixedHeight,
          }}
          className="w-full overflow-y-auto flex flex-col justify-between rounded-md p-[1.5rem] bg-white border-b-[1px] border-support-12
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-support-8
                    [&::-webkit-scrollbar-thumb]:rounded-full
          "
        >
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
                  const isNearEnd = index >= table.getRowModel().rows.length - 2;

                  return (
                    <TableRow
                      key={row.id}
                      className={`h-[80px] last:mb-0 hover:bg-transparent ${isLast ? 'border-b-0' : 'border-b border-support-13'}`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} style={{ verticalAlign: 'middle' }} className="p-0 pr-[2rem]">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                      {isNearEnd && <div ref={ref} className="absolute" />}
                    </TableRow>
                  );
                })
              ) : isLoading ? (
                <TableRow className="h-full pointer-events-none border-none hover:bg-transparent" />
              ) : (
                <TableRow className="h-full pointer-events-none border-none hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="p-0 h-full border-none">
                    <div className="flex items-center justify-center w-full min-h-[350px]">
                      <NothingToShow
                        title={nothingToShowOptions.userActivity.title}
                        subtitle={nothingToShowOptions.userActivity.subtitle}
                        icon={nothingToShowOptions.userActivity.icon}
                      />
                    </div>
                  </TableCell>
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
