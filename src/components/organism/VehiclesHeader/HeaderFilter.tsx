import { FilterIcon } from '@/assets/svgIconComponents/FilterIcon';

type HeaderFilterTypes = {
  onFilterClick: () => void;
  isFilterActive: boolean;
  searchMode: boolean;
};

const HeaderFilter = ({ onFilterClick, isFilterActive, searchMode }: HeaderFilterTypes) => {
  return (
    <div
      className={`${searchMode ? 'hidden' : 'flex'} flex transition-all duration-100 ease-in-out justify-end items-center w-[44px] h-[42px] relative cursor-pointer group ${isFilterActive ? 'text-[#403c89]' : 'text-[#AFAFAF]'} hover:text-[#403c89] hover:opacity-80`}
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

