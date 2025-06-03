import { FilterIcon } from '@/assets/svgIconComponents/FilterIcon';
import { useSearchStore } from '@/stores/useSearchStore';

type FilterButton = {
  onFilterClick: () => void;
  isFilterActive: boolean;
};

const FilterButton = ({ onFilterClick, isFilterActive }: FilterButton) => {
    const { isSearchActive } = useSearchStore();
  
  return (
    <div
      className={`${isSearchActive ? 'hidden' : 'flex'} flex transition-all duration-100 ease-in-out justify-end items-center w-[44px] h-[42px] relative cursor-pointer group ${isFilterActive ? 'text-primary-3' : 'text-support-3'} hover:text-primary-3 hover:opacity-80`}
      onClick={onFilterClick}
    >
      <FilterIcon />
      {isFilterActive ? (
        <span className="absolute top-[12px] right-[-4px] h-[8px] w-[8px] bg-primary-3 rounded-full" />
      ) : null}
    </div>
  );
};

export default FilterButton;

