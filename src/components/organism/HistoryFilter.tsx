import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import DateRangePicker from '@/components/atom/DateRangePicker';

type HistoryFilterState = {
  date?: DateRange;
};

const HistoryFilter = () => {
  const [filters, setFilters] = useState<HistoryFilterState>({
    date: { from: undefined, to: undefined },
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

  return (
    <div className="flex items-center gap-4">
      <div>
        <DateRangePicker className="w-[270px]" value={filters.date} onChange={handleDateChange} />
      </div>
    </div>
  );
};

export default HistoryFilter;
