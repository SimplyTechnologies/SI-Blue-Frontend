import { useState } from 'react';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { Input } from '@/components/atom/Input';
import { Button } from '@/components/atom/Button';
import AddVehicle from './AddVehicle';
import { FilterIcon } from '@/assets/svgIconComponents/FilterIcon';
import searchIcon from '@/assets/search.svg';

type VehiclesHeaderTypes = {
  onFilterClick: () => void;
  isFilterActive: boolean;
  onSearch: (searchValue: string) => void;
  inputValue: string;
};

const VehiclesHeader = ({ onFilterClick, isFilterActive, inputValue, onSearch }: VehiclesHeaderTypes) => {
  const [openAddVehicle, setOpenAddVehicle] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
    if (isFilterActive) {
      navigate('/vehicles');
    }
  };

  return (
    <div className="flex item-start justify-between gap-[1rem] max-[1200px]:flex-col min-h-[56px]">
      <div className="w-full max-w-[352px] h-[42px] flex items-center">
        <div className="relative w-full max-w-[308px]">
          <img src={searchIcon} alt="Search" className="absolute left-[1.5rem] top-1/2 -translate-y-1/2" />
          <Input
            className="bg-white pr-10 w-full h-[42px] rounded-[0.5rem] border-[1px] border-[var(--color-support-8)] pl-[3.5rem] placeholder:text-[var(--color-support-7)] placeholder:text-[length:var(--sm-text)] placeholder:leading-[140%] placeholder:font-[var(--fw-regular)] caret-[var(--color-support-8)] focus:border-[var(--color-primary-4)] focus:caret-[var(--color-support-6)]"
            placeholder="Search..."
            onChange={handleInputChange}
            value={inputValue}
          />
          {inputValue && (
            <Button
              variant="text"
              className="absolute right-[1rem] top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => onSearch('')}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
        {inputValue ? null : (
          <div
            className="flex justify-end items-center w-[44px] h-[42px] relative cursor-pointer group text-[#AFAFAF] hover:text-[#403c89]"
            onClick={onFilterClick}
          >
            <FilterIcon />
            {isFilterActive ? (
              <span className="absolute top-[12px] right-[-4px] h-[8px] w-[8px] bg-[#403c89] rounded-full" />
            ) : null}
          </div>
        )}
      </div>
      {inputValue ? null : (
        <div>
          <Button
            onClick={() => setOpenAddVehicle(true)}
            variant={'default'}
            className="w-[132px] h-[56px] max-[1200px]:h-[42px]"
          >
            + Add
          </Button>
        </div>
      )}
      <AddVehicle open={openAddVehicle} onOpenChange={setOpenAddVehicle} />
    </div>
  );
};

export default VehiclesHeader;

