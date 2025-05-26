import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ChevronLeftIcon } from 'lucide-react';
import CustomMultiSelect from '@/components/molecule/CustomMultiSelect';
import CustomSelect from '@/components/molecule/CustomSelect';
import { Button } from '@/components/atom/Button';
import CustomTooltip from '@/components/molecule/CustomTooltip';
import { useQuery } from '@tanstack/react-query';
import { fetchMakes } from '@/requests/fetchMakes';
import { fetchModelsByMake } from '@/requests/fetchModelsByMake';
import type { FilterState, OptionType } from '@/types/Vehicle';
import { availabilityOptions } from '@/utils/constants';

type VehiclesFilterTypes = {
  handleBack: () => void;
};

const VehiclesFilter = ({ handleBack }: VehiclesFilterTypes) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [makeOptions, setMakeOptions] = useState<OptionType[] | []>([]);
  const [modelOptions, setModelOptions] = useState<OptionType[] | []>();

  const filtersEmptyStat = {
    make: '',
    models: [],
    availability: '',
  };

  const [filtersInitialState, setFiltersInitialState] = useState<FilterState>(filtersEmptyStat);
  const [filters, setFilters] = useState<FilterState>(filtersEmptyStat);

  const { isLoading: makeLoading, data: makeData } = useQuery({
    queryKey: ['makes'],
    queryFn: fetchMakes,
    staleTime: 3600000,
  });

  const { isLoading: modelLoading, data: modelsData } = useQuery({
    queryKey: ['models', filters.make],
    queryFn: () => fetchModelsByMake(filters.make),
    enabled: !!filters.make,
  });

  const filtersCount = [filters.make, filters.availability, ...filters.models].filter(Boolean).length;

  useEffect(() => {
    const make = searchParams.get('makeId') || '';
    const availability = searchParams.get('availability') || '';
    const models = searchParams.getAll('modelIds') || [];

    setFiltersInitialState({
      make,
      models,
      availability,
    });

    setFilters({
      make,
      models,
      availability,
    });
  }, [searchParams]);

  useEffect(() => {
    if (makeData) {
      setMakeOptions(makeData);
    } else {
      setMakeOptions([]);
    }
  }, [makeData]);

  useEffect(() => {
    if (modelsData) {
      setModelOptions(modelsData);
    } else {
      setModelOptions([]);
    }
  }, [modelsData]);

  const handleMakeChange = (value: string) => {
    setFilters({ ...filters, make: value });
    if (filters.models.length) {
      setFilters({ ...filters, models: [] });
    }
  };

  const handleModelsChange = (value: string[]) => {
    setFilters({ ...filters, models: value });
  };

  const handleAvailabilityChange = (value: string) => {
    setFilters({ ...filters, availability: value });
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams();
    if (filters.make) {
      queryParams.append('makeId', filters.make);
    }
    if (filters.models.length) {
      filters.models.forEach(model => queryParams.append('modelIds', model));
    }
    if (filters.availability) {
      queryParams.append('availability', filters.availability);
    }
    setSearchParams(queryParams);
    handleBack();
  };

  const handleClearFilters = () => {
    setFilters(filtersEmptyStat);
  };

  return (
    <div className="flex flex-col gap-[18px] w-full">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <div onClick={handleBack} className="cursor-pointer hover:opacity-80">
            <ChevronLeftIcon color="#192252" className="h-[24px] w-[24px]" />
          </div>
          <div className="text-primary text-[14px] font-bold">Filters</div>
        </div>
        <div>
          <Button variant="text" className="text-xs text-support-7 hover:text-primary-3" onClick={handleClearFilters}>
            Clear All
          </Button>
        </div>
      </div>
      <div>
        <CustomSelect
          label="Make"
          value={filters.make}
          items={makeOptions || []}
          onChange={handleMakeChange}
          placeholder="Select Make"
          className="bg-white"
          disabled={makeLoading}
          addNoSelect
        />
      </div>
      <div>
        <CustomTooltip
          trigger={
            <CustomMultiSelect
              options={modelOptions || []}
              onValueChange={handleModelsChange}
              value={filters.models}
              placeholder="Select Model"
              variant="inverted"
              maxCount={2}
              label="Models"
              disabled={!filters.make || modelLoading}
            />
          }
          content="Select Make to enable Model"
          side="bottom"
          hidden={!!filters.make}
        />
      </div>
      <div>
        <CustomSelect
          label="Availability"
          value={filters.availability}
          items={availabilityOptions}
          onChange={handleAvailabilityChange}
          placeholder="Select Availability"
          className="bg-white"
          addNoSelect
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="default"
          className="w-full h-[40px] text-xs"
          onClick={handleApplyFilters}
          disabled={JSON.stringify(filtersInitialState) === JSON.stringify(filters)}
        >
          Apply Filters ({filtersCount})
        </Button>
      </div>
    </div>
  );
};

export default VehiclesFilter;

