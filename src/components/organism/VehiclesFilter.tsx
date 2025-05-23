import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { z } from 'zod';
import { ChevronLeftIcon } from 'lucide-react';
import CustomMultiSelect from '@/components/molecule/CustomMultiSelect';
import CustomSelect from '@/components/molecule/CustomSelect';
import { Button } from '@/components/atom/Button';
import CustomTooltip from '@/components/molecule/CustomTooltip';
import { useQuery } from '@tanstack/react-query';
import { fetchMakes } from '@/requests/fetchMakes';
import { fetchModelsByMake } from '@/requests/fetchModelsByMake';

export const filterSchema = z.object({
  make: z.string().optional().default(''),
  models: z.array(z.string()).optional().default([]),
  availability: z.string().optional().default(''),
});

export type FiltersType = z.infer<typeof filterSchema>;

export type FilterParamsType = {
  makeId?: number;
  modelIds?: number[];
  availability?: string;
};

type VehiclesFilterTypes = {
  handleBack: () => void;
};

const VehiclesFilter = ({ handleBack }: VehiclesFilterTypes) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [makeOptions, setMakeOptions] = useState<{id: number, name: string}[]|[]>([]);
  const [modelOptions, setModelOptions] = useState<{id: number, name: string}[]|[]>();

  const availabilityOptions = [
    { name: 'Select all', id: undefined },
    { name: 'In Stock', id: 'In Stock' },
    { name: 'Sold', id: 'Sold' },
  ];

  const [filtersInitialState, setFiltersInitialState] = useState<FiltersType>({
    make: '',
    models: [],
    availability: '',
  });

  const [filters, setFilters] = useState<FiltersType>({
    make: '',
    models: [],
    availability: '',
  });

  const { isPending: makePending, data: makeData } = useQuery({
    queryKey: ['makes'],
    queryFn: fetchMakes,
  });

  const { isPending: modelsPending, data: modelsData } = useQuery({
    queryKey: ['models', filters.make],
    queryFn: () => fetchModelsByMake(filters.make),
    enabled: !!filters.make,
  });

  const filtersCount = [filters.make, filters.availability, ...filters.models].filter(Boolean).length;

  const handleMakeChange = (value: string) => {
    setFilters({ ...filters, make: value === 'Select all' ? '' : value });
    if (filters.models.length) {
      setFilters({ ...filters, models: [] });
    }
  };

  const handleModelsChange = (value: string[]) => {
    setFilters({ ...filters, models: value });
  };

  const handleAvailabilityChange = (value: string) => {
    setFilters({ ...filters, availability: value === 'Select all' ? '' : value });
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
    setFilters({
      make: '',
      models: [],
      availability: '',
    });
  };

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
      setMakeOptions([{ name: 'Select all', id: undefined }, ...makeData]);
    } else {
      setMakeOptions([])
    }
  }, [makeData]);

  useEffect(() => {
    if (modelsData) {
      setModelOptions(modelsData);
    } else {
      setModelOptions([])
    }
  }, [modelsData]);

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
          value={filters.make}
          items={makeOptions?.map((item) => {
            return {id: item?.id?.toString(), name: item.name}
          }) || []}
          onChange={handleMakeChange}
          placeholder="Select Make"
          className="bg-white"
          disabled={!makeOptions?.length}
        />
      </div>
      <div>
        <CustomTooltip
          trigger={
            <CustomMultiSelect
              options={modelOptions?.map((item) => {
                return {id: item?.id?.toString(), name: item.name}
              }) || []}
              onValueChange={handleModelsChange}
              value={filters.models}
              placeholder="Select Model"
              variant="inverted"
              maxCount={2}
              label="Models"
              disabled={!filters.make}
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

