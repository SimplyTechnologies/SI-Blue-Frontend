import { type MouseEvent } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, XIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/utils/cn';
import { Button } from '@/components/atom/Button';
import { Calendar } from '@/components/atom/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atom/Popover';

interface DateRangeProps {
  onChange: (value: DateRange | undefined) => void;
  value: DateRange | undefined;
  className?: string;
}

const DateRangePicker = ({ value, onChange, className }: DateRangeProps) => {
  const handleClear = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onChange({ from: undefined, to: undefined });
  };

  const hasSelection = value?.from;

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            className={cn(
              'flex justify-between w-full py-2 px-3 rounded-md border-input bg-white border min-h-10.5 shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50  h-auto items-center [&_svg]:pointer-events-auto text-sm font-normal focus:border-primary-4 focus:border-[2px]',
              `${!value?.from ? 'text-muted-foreground' : ''}`,
              className,
            )}
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value?.from ? (
                value.to ? (
                  <>
                    {format(value.from, 'LLL dd, y')} - {format(value.to, 'LLL dd, y')}
                  </>
                ) : (
                  <>
                    {format(value.from, 'LLL dd, y')} - {'Select end date'}
                  </>
                )
              ) : (
                'Pick a date range'
              )}
            </div>
            {hasSelection && (
              <div onClick={handleClear}>
                <XIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
