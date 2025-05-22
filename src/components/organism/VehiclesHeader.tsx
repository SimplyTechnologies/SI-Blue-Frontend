// import { useState } from 'react';
// import { Input } from '../atom/Input';
import VehiclesFilter from './VehiclesFilter';
// import { useDebounce } from '@/hooks/useDebounce';

const VehiclesHeader: React.FC = () => {
  // const [inputValue, setInputValue] = useState('');
  // const { debounceValue } = useDebounce({ inputValue, delay: 300 });

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(e.target.value);
  // };

  return (
    <div className="h-full basis-[50%] bg-[var(--white-color)] p-[1.5rem]">
      <div className="flex item-start justify-between">
        <VehiclesFilter />
      </div>
    </div>
  );
};

export default VehiclesHeader;

