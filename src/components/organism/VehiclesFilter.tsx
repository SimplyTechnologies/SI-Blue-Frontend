import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ChevronLeftIcon } from 'lucide-react';
import CustomMultiSelect from '@/components/molecule/CustomMultiSelect';
import CustomSelect from '@/components/molecule/CustomSelect';
import { Button } from '@/components/atom/Button';
import CustomTooltip from '@/components/molecule/CustomTooltip';

type VehiclesFilterTypes = {
  handleBack: () => void;
};

const VehiclesFilter = ({ handleBack }: VehiclesFilterTypes) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const makeOptions = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen'];

  const modelOptions: Record<string, { label: string; value: string }[]> = {
    Toyota: [
      { label: 'Camry', value: 'Camry' },
      { label: 'Corolla', value: 'Corolla' },
      { label: 'RAV4', value: 'RAV4' },
      { label: 'Highlander', value: 'Highlander' },
    ],
    Honda: [
      { label: 'Civic', value: 'Civic' },
      { label: 'Accord', value: 'Accord' },
      { label: 'CR-V', value: 'CR-V' },
      { label: 'Pilot', value: 'Pilot' },
    ],
    Ford: [
      { label: 'F-150', value: 'F-150' },
      { label: 'Explorer', value: 'Explorer' },
      { label: 'Mustang', value: 'Mustang' },
      { label: 'Escape', value: 'Escape' },
    ],
    BMW: [
      { label: '3 Series', value: '3 Series' },
      { label: '5 Series', value: '5 Series' },
      { label: 'X3', value: 'X3' },
      { label: 'X5', value: 'X5' },
    ],
    'Mercedes-Benz': [
      { label: 'C-Class', value: 'C-Class' },
      { label: 'E-Class', value: 'E-Class' },
      { label: 'GLC', value: 'GLC' },
      { label: 'GLE', value: 'GLE' },
    ],
    Audi: [
      { label: 'A4', value: 'A4' },
      { label: 'A6', value: 'A6' },
      { label: 'Q5', value: 'Q5' },
      { label: 'Q7', value: 'Q7' },
    ],
    Volkswagen: [
      { label: 'Jetta', value: 'Jetta' },
      { label: 'Passat', value: 'Passat' },
      { label: 'Tiguan', value: 'Tiguan' },
      { label: 'Atlas', value: 'Atlas' },
    ],
  };

  const availabilityOptions = ['In Stock', 'Sold'];

  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState('');

  const handleMakeChange = (value: string) => {
    setSelectedMake(value);
    if (selectedModels.length) {
      setSelectedModels([]);
    }
  };

  const handleModelsChange = (value: string[]) => {
    setSelectedModels(value);
  };

  const handleAvailabilityChange = (value: string) => {
    setSelectedAvailability(value);
  };

  const getFiltersCount = () => {
    const count = [selectedAvailability, selectedMake, ...selectedModels].filter(Boolean).length;
    return count;
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams();
    if (selectedMake) {
      queryParams.append('make', selectedMake);
    }
    if (selectedModels.length) {
      selectedModels.forEach(model => queryParams.append('model', model));
    }
    if (selectedAvailability) {
      queryParams.append('availability', selectedAvailability);
    }
    handleBack();
    setSearchParams(queryParams);
  };

  const handleClearFilters = () => {
    setSelectedMake('');
    setSelectedModels([]);
    setSelectedAvailability('');
  };

  useEffect(() => {
    const make = searchParams.get('make');
    const availability = searchParams.get('availability');
    const models = searchParams.getAll('model');

    if (make) {
      setSelectedMake(make);
    }

    if (models.length) {
      setSelectedModels(models);
    }

    if (availability) {
      setSelectedAvailability(availability);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-[18px] w-full">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <div onClick={handleBack} className="cursor-pointer hover:opacity-80">
            <ChevronLeftIcon color="#192252" className="h-[24px] w-[24px]" />
          </div>
          <div className="text-[#192252] text-[14px] font-bold">Filters</div>
        </div>
        <div>
          <Button variant="text" className="text-xs text-[#858C98] hover:text-[#403C89]" onClick={handleClearFilters}>
            Clear All
          </Button>
        </div>
      </div>

      <div>
        <CustomSelect
          label="Make"
          value={selectedMake}
          items={makeOptions}
          onChange={handleMakeChange}
          placeholder="Select Make"
          className="bg-white"
        />
      </div>
      <div>
        <CustomTooltip
          trigger={
            <CustomMultiSelect
              options={modelOptions[selectedMake] || []}
              onValueChange={handleModelsChange}
              value={selectedModels}
              placeholder="Select Model"
              variant="inverted"
              maxCount={2}
              label="Models"
              disabled={!selectedMake}
            />
          }
          content="Select Make to enable Model"
          side="bottom"
          hidden={!!selectedMake}
        />
      </div>
      <div>
        <CustomSelect
          label="Availability"
          value={selectedAvailability}
          items={availabilityOptions}
          onChange={handleAvailabilityChange}
          placeholder="Select Availability"
          className="bg-white"
        />
      </div>
      <div className="flex flex-col gap-2">
        {/* <Button variant="outline" className="w-full h-[40px] text-xs" onClick={handleClearFilters}>
          Clear All Filters
        </Button> */}
        <Button variant="default" className="w-full h-[40px] text-xs" onClick={handleApplyFilters}>
          Apply Filters ({getFiltersCount()})
        </Button>
      </div>
    </div>
  );
};

export default VehiclesFilter;

