import { Input } from '@/components/atom/Input';
import filterIcon from '@/assets/filter.svg';
import searchIcon from '@/assets/search.svg';
import downloadIcon from '@/assets/download.svg';
import { Button } from '@/components/atom/Button';

const VehiclesHeader: React.FC = () => {
  return (
    <div className="h-full basis-[50%] bg-[var(--white-color)] p-[1.5rem]">
      <div className="flex item-start justify-between">
        <div className="w-[352px] h-[42px] flex items-center">
          <div className="relative">
            <img src={searchIcon} alt="Search" className="absolute left-[1.5rem] top-1/2 -translate-y-1/2 " />
            <Input
              className="w-[308px] h-[42px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[3.5rem] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] placeholder:leading-[140%] placeholder:font-[var(--fw-regular)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:border-[2px] focus:placeholder:text-[var(--color-support-6)] focus:caret-[var(--color-support-6)]"
              placeholder="Search..."
            />
          </div>
          <div className="flex-[1] flex justify-end items-center">
            <img src={filterIcon} alt="Filter" />
          </div>
        </div>
        <div>
          <Button variant={'default'} className="w-[132px] h-[56px]">
            + Add
          </Button>
        </div>
      </div>
      <div>
        <div className="w-full h-[37px]">
          <div>
            <Button className="w-[132px] h-[56px]" />
            <Button className="w-[132px] h-[56px]" />
          </div>
          <div className="flex w-[36px] h-[36px] items-center justify-center">
            <img src={downloadIcon} alt="Download" />
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default VehiclesHeader;

