import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeftIcon } from 'lucide-react';
import { fetchMakes } from '@/requests/fetchMakes';
import { fetchModelsByMake } from '@/requests/fetchModelsByMake';
import type { FilterState, OptionType } from '@/types/Vehicle';
import { availabilityOptions } from '@/utils/constants';
import { useFilterOptionsStore } from '@/stores/useFilterOptionsStore';
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
  const { setValidMakeIds, setValidModelIds } = useFilterOptionsStore();

  const [makeOptions, setMakeOptions] = useState<OptionType[] | []>([]);
  const [modelOptions, setModelOptions] = useState<OptionType[] | []>();

  const filtersEmptyStat = {
    makeId: '',
    modelIds: [],
    availabilityId: '',
  };

  const [filtersInitialState, setFiltersInitialState] = useState<FilterState>(filtersEmptyStat);
  const [filters, setFilters] = useState<FilterState>(filtersEmptyStat);

  const validatedFilters = useValidatedFilters();

  const { isLoading: makeLoading, data: makeData } = useQuery({
    queryKey: ['makes'],
    queryFn: fetchMakes,
    staleTime: 3600000,
  });

  const { isLoading: modelLoading, data: modelsData } = useQuery({
    queryKey: ['models', filters.makeId],
    queryFn: () => fetchModelsByMake(filters.makeId),
    enabled: !!filters.makeId,
  });

  const filtersCount = [filters.makeId, filters.availabilityId, ...filters.modelIds].filter(Boolean).length;

  useEffect(() => {
    setFiltersInitialState({ ...filtersEmptyStat, ...validatedFilters });
    setFilters({ ...filtersEmptyStat, ...validatedFilters });
  }, []);

  useEffect(() => {
    if (makeData) {
      setMakeOptions(makeData);
      setValidMakeIds(makeData.map((item: OptionType) => item.id.toString()));
    } else {
      setMakeOptions([]);
      setValidModelIds([]);
    }
  }, [makeData]);

  useEffect(() => {
    if (modelsData) {
      setModelOptions(modelsData);
      setValidModelIds(modelsData.map((item: OptionType) => item.id.toString()));
    } else {
      setModelOptions([]);
      setValidModelIds([]);
    }
  }, [modelsData]);

  const handleMakeChange = (value: string) => {
    setFilters({ ...filters, makeId: value });
    if (filters.modelIds.length) {
      setFilters({ ...filters, modelIds: [] });
    }
  };

  const handleModelsChange = (value: string[]) => {
    setFilters({ ...filters, modelIds: value });
  };

  const handleAvailabilityChange = (value: string) => {
    setFilters({ ...filters, availabilityId: value });
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams();
    if (filters.makeId) {
      queryParams.append('makeId', filters.makeId);
    }
    if (filters.modelIds.length) {
      filters.modelIds.forEach(model => queryParams.append('modelIds', model));
    }
    if (filters.availabilityId) {
      queryParams.append('availability', filters.availabilityId);
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
          value={filters.makeId}
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
              value={filters.modelIds}
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
          value={filters.availabilityId}
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

