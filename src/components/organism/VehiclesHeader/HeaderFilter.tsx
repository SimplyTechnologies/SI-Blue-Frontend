import { FilterIcon } from '@/assets/svgIconComponents/FilterIcon';

type HeaderFilterTypes = {
  onFilterClick: () => void;
  isFilterActive: boolean;
};

const HeaderFilter = ({ onFilterClick, isFilterActive }: HeaderFilterTypes) => {
  return (
    <div
      className="flex justify-end items-center w-[44px] h-[42px] relative cursor-pointer group text-[#AFAFAF] hover:text-[#403c89]"
      onClick={onFilterClick}
    >
      <FilterIcon />
      {isFilterActive ? (
        <span className="absolute top-[12px] right-[-4px] h-[8px] w-[8px] bg-[#403c89] rounded-full" />
      ) : null}
    </div>
  );
};

export default HeaderFilter;

