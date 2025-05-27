import { Input } from '@/components/atom/Input';
import filterIcon from '@/assets/filter.svg';
import searchIcon from '@/assets/search.svg';
import { Button } from '@/components/atom/Button';

const VehiclesHeader: React.FC = () => {
  return (
        <div className="w-full flex item-start justify-between gap-[1rem] max-[1200px]:flex-col">
          <div className="w-full max-w-[352px] h-[42px] flex items-center">
            <div className="relative w-full">
              <img src={searchIcon} alt="Search" className="absolute left-[1.5rem] top-1/2 -translate-y-1/2 " />
              <Input
                className="w-full  max-w-[308px] h-[42px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[3.5rem] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] placeholder:leading-[140%] placeholder:font-[var(--fw-regular)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
                placeholder="Search..."
              />
            </div>
            <div className="flex justify-end items-center w-[44px] h-[42px]">
              <img src={filterIcon} alt="Filter" />
            </div>
          </div>
          <div>
            <Button variant={'default'} className="w-[132px] h-[56px] max-[1200px]:h-[42px]">
              + Add
            </Button>
          </div>
        </div>
  );
};

export default VehiclesHeader;

