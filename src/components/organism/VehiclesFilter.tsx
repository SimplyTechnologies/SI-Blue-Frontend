import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeftIcon } from 'lucide-react';
import { getMakes, getModelsByMakeId } from '@/api/vehicles';
import type { FilterState, OptionType } from '@/types/Vehicle';
import { availabilityOptions } from '@/utils/constants';
import { useValidatedFilters } from '@/hooks/useValidatedFilters';
import CustomMultiSelect from '@/components/molecule/CustomMultiSelect';
import CustomSelect from '@/components/molecule/CustomSelect';
import { Button } from '@/components/atom/Button';
import CustomTooltip from '@/components/molecule/CustomTooltip';

type VehiclesFilterTypes = {
  handleBack: () => void;
};

const VehiclesFilter = ({ handleBack }: VehiclesFilterTypes) => {
  const [, setSearchParams] = useSearchParams();

  const [makeOptions, setMakeOptions] = useState<OptionType[] | []>([]);
  const [modelOptions, setModelOptions] = useState<OptionType[] | []>();
  const validatedFilters = useValidatedFilters();

  const [filters, setFilters] = useState<FilterState>(validatedFilters);

  const { isLoading: makeLoading, data: makeData } = useQuery({
    queryKey: ['makes'],
    queryFn: getMakes,
    staleTime: 3600000,
  });

  const { isLoading: modelLoading, data: modelsData } = useQuery({
    queryKey: ['models', filters.makeId],
    queryFn: () => filters.makeId && getModelsByMakeId(filters.makeId),
    enabled: !!filters.makeId,
  });

  const filtersCount = [filters.makeId, filters.availability, ...(filters.modelIds || [])].filter(Boolean).length;

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
    if (filters?.modelIds?.length) {
      setFilters({ ...filters, modelIds: [], makeId: value });
      return;
    }
    setFilters({ ...filters, makeId: value });
  };

  const handleModelsChange = (value: string[]) => {
    setFilters({ ...filters, modelIds: value });
  };

  const handleAvailabilityChange = (value: string) => {
    setFilters({ ...filters, availability: value });
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams();
    if (filters.makeId) {
      queryParams.append('makeId', filters.makeId.toString());
    }
    if (filters?.modelIds?.length) {
      filters.modelIds.forEach(model => queryParams.append('modelIds', model.toString()));
    }
    if (filters.availability) {
      queryParams.append('availability', filters.availability);
    }
    setSearchParams(queryParams);
    handleBack();
  };

  const handleClearFilters = () => {
    setFilters({});
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
          value={filters?.makeId || ''}
          items={makeOptions || []}
          onChange={handleMakeChange}
          placeholder="Select Make"
          className="bg-white"
          disabled={makeLoading}
          addNoSelect
          deselectEnabled
        />
      </div>
      <div>
        <CustomTooltip
          trigger={
            <CustomMultiSelect
              options={modelOptions || []}
              onValueChange={handleModelsChange}
              value={filters.modelIds || []}
              placeholder="Select Model"
              variant="inverted"
              maxCount={2}
              label="Models"
              disabled={!filters.makeId || modelLoading}
            />
          }
          content="Select Make to enable Model"
          side="bottom"
          hidden={!!filters.makeId}
        />
      </div>
      <div>
        <CustomSelect
          label="Availability"
          value={filters.availability || ''}
          items={availabilityOptions}
          onChange={handleAvailabilityChange}
          placeholder="Select Availability"
          className="bg-white"
          addNoSelect
          deselectEnabled
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="default"
          className="w-full h-[40px] text-xs"
          onClick={handleApplyFilters}
          disabled={JSON.stringify(validatedFilters) === JSON.stringify(filters)}
        >
          Apply Filters ({filtersCount})
        </Button>
      </div>
    </div>
  );
};

export default VehiclesFilter;
