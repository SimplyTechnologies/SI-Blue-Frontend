import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { createFilterSchema, type FilterRequest, type OptionType, type VehicleType } from '@/types/Vehicle';
import { useSearchStore } from '@/stores/useSearchStore';
// import { fetchMakes } from '@/requests/fetchMakes';
// import { fetchModelsByMake } from '@/requests/fetchModelsByMake';
import { fetchVehicles } from '@/requests/fetchVehicles';
// import { availabilityOptions } from '@/utils/constants';
import Map from '@/components/organism/Map';
import { Button } from '@/components/atom/Button';
import VehicleCard from '@/components/molecule/VehicleCard';
import VehiclesFilter from '@/components/organism/VehiclesFilter';
import DebounceSearch from '@/components/molecule/DebounceSearch';
import { Toaster } from '@/components/atom/Toaster';
import ExportCSVButton from '@/components/molecule/ExportCSVButton';
import AddNewVehicleButton from '@/components/molecule/AddNewVehicleButton';
import FilterButton from '@/components/molecule/FilterButton';
import VehicleCardSkeleton from '@/components/molecule/VehicleCardSkeleton';
import NothingToShow from '@/components/molecule/NothingToShow';
import { NothingToShowCarIcon } from '@/assets/svgIconComponents/NothingToShowCarIcon';
import { NothingToShowFavoriteIcon } from '@/assets/svgIconComponents/NothingToShowFavoriteIcon';

const tabOptions: ['vehicles', 'favorites'] = ['vehicles', 'favorites'];

const nothingToShowOptions = {
  vehicles: {
    title: 'There are no vehicles to display',
    subtitle: 'You can add vehicles and set up specific zones to track their locations and statuses.',
    icon: NothingToShowCarIcon,
  },
  favorites: {
    title: 'There are no favorite vehicles',
    subtitle: 'To quickly access more information about vehicles, consider adding them to your favorites.',
    icon: NothingToShowFavoriteIcon,
  },
};

const Vehicles: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isSearchActive } = useSearchStore();

  const [active, setActive] = useState<'vehicles' | 'favorites'>('vehicles');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [debounceValue, setDebounceValue] = useState('');
  const [filterRequestParams, setFilterRequestParams] = useState<FilterRequest>({});

  const [vehiclesList, setVehiclesList] = useState<VehicleType[] | []>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const offset = 25;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // const [makeId, setMakeId] = useState('');
  // const [modelIds, setModelIds] = useState<string[]>([]);
  // const [availability, setAvailability] = useState('');

  // const { isLoading: makeLoading, data: makeData } = useQuery({
  //   queryKey: ['makes', makeId],
  //   queryFn: fetchMakes,
  //   enabled: !!makeId,
  // });

  // const { isLoading: modelLoading, data: modelsData } = useQuery({
  //   queryKey: ['models', makeId],
  //   queryFn: () => fetchModelsByMake(makeId),
  //   enabled: !!(makeId && modelIds),
  // });

  const { isLoading: isVehiclesLoading, data: vehiclesData } = useQuery({
    queryKey: ['vehicles', debounceValue, JSON.stringify(filterRequestParams), page],
    queryFn: () => fetchVehicles({ ...filterRequestParams, search: debounceValue || undefined, page, offset }),
  });

  useEffect(() => {
    const makeId = searchParams.get('makeId');
    const availability = searchParams.get('availability');
    const modelIds = searchParams.getAll('modelIds');

    const filters: FilterRequest = {};
    if (makeId || availability || modelIds.length) {
      // setMakeId(makeId || '');
      // setModelIds(modelIds || []);
      // setAvailability(availability || '');
      setIsFilterActive(true);
      if (makeId) {
        filters.makeId = makeId;
      }
      if (modelIds.length) {
        filters.modelIds = modelIds.join(',');
      }
      if (availability) {
        filters.availability = availability;
      }

      // const result = schema.safeParse(filters);

      // result?.error?.errors.forEach(err => {
      //   if (err.path[0]) {
      //     delete filters[err.path[0]];
      //   }
      // });
      setSearchParams(filters);
    } else {
      setIsFilterActive(false);
    }
    setFilterRequestParams(filters);
  }, [searchParams]);

  // useEffect(() => {
  //   let filters: FilterRequest = {};

  //   const schema = createFilterSchema({
  //     validMakeIds: (makeData || []).map((item: OptionType) => item.id.toString()),
  //     validModelIds: (modelsData || []).map((item: OptionType) => item.id.toString()),
  //     validAvailabilityOptions: availabilityOptions.map(item => item.id),
  //   });

  //   if (makeId && makeData) {
  //     filters.makeId = makeId;
  //   }
  //   if (modelIds.length && modelsData) {
  //     filters.modelIds = modelIds.join(',');
  //   }
  //   if (availability) {
  //     filters.availability = availability;
  //   }

  //   const result = schema.safeParse(filters);

  //   if (result?.error?.errors) {
  //     filters = {};
  //   }
  //   setIsFilterActive(!!Object.keys(filters).length);
  //   setSearchParams(filters);
  //   setFilterRequestParams(filters);
  // }, [makeData, modelsData, makeId, modelIds, availability, setSearchParams]);

  //Set vehicles list (add to the existing list starting from page 2)
  useEffect(() => {
    if (vehiclesData?.vehicles && Array.isArray(vehiclesData?.vehicles)) {
      setTotalPages(vehiclesData.totalPages);
      if (page === 1) {
        setVehiclesList(vehiclesData.vehicles);
      } else {
        setVehiclesList(prevItems => [...prevItems, ...vehiclesData.vehicles]);
      }
    }
  }, [vehiclesData, page]);

  // On search or filter scroll to the top of the vehicles list
  useEffect(() => {
    setPage(1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [debounceValue, filterRequestParams]);

  const handleDebounceSearch = (value: string) => {
    if (value !== debounceValue) {
      setDebounceValue(value);
      setActive('vehicles');
      if (isFilterActive) {
        navigate('/vehicles');
      }
    }
  };

  // Get vehicles data on scroll
  const lastVehicleRef = useCallback(
    (node: Element | null) => {
      if (isVehiclesLoading || !node) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && page < totalPages) {
            setPage(prev => prev + 1);
          }
        },
        { threshold: 0.5 },
      );

      observerRef.current.observe(node);
    },
    [isVehiclesLoading, page, totalPages],
  );

  return (
    <div className="flex w-full h-[calc(100vh-78px)]">
      <div className="flex flex-col gap-2 flex-[0_1_40%] h-full bg-white px-6 pt-6 max-[768px]:px-2 max-[768px]:pt-2">
        {!isFilterOpen && (
          <div className="flex justify-between gap-4 min-h-[56px] items-start max-[1200px]:flex-col">
            <div
              className={`flex items-center h-[42px] w-full gap-2 transition-all duration-300 ease-in-out ${isSearchActive ? 'max-w-full' : 'max-w-[352px]'}`}
            >
              <DebounceSearch setDebounceValue={handleDebounceSearch} />
              <FilterButton onFilterClick={() => setIsFilterOpen(true)} isFilterActive={isFilterActive} />
            </div>
            <AddNewVehicleButton buttonName="+ Add" className="w-[132px] h-[56px] max-[1200px]:h-[42px]" />
          </div>
        )}

        {isFilterOpen ? (
          <VehiclesFilter handleBack={() => setIsFilterOpen(false)} />
        ) : (
          <div className="flex flex-col h-full">
            <div
              className={`flex justify-between items-start w-full border-b border-support-8 gap-[6rem] max-[1200px]:gap-0 transition-all duration-300 ease-in-out ${isSearchActive ? 'max-w-full' : 'max-w-[352px]'}`}
            >
              <div className="flex gap-4 max-[600px]:flex-col">
                {tabOptions.map(
                  tab =>
                    (!isSearchActive || tab === 'vehicles') && (
                      <Button
                        key={tab}
                        onClick={() => setActive(tab)}
                        className="relative w-[67px] h-[37px] pb-4 rounded-none"
                      >
                        <p
                          className={`font-[var(--fw-bold)] text-[length:var(--sm-text)] leading-[140%] ${
                            active === tab ? 'text-primary-3' : 'text-support-7'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </p>
                        {active === tab && (
                          <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary-3 rounded-t" />
                        )}
                      </Button>
                    ),
                )}
              </div>
              <ExportCSVButton filters={filterRequestParams} disabled={!vehiclesList.length} />
            </div>

            <div
              ref={scrollContainerRef}
              className="flex-1 h-full max-h-[calc(100vh-13.125rem)] max-[1200px]:max-h-[calc(100vh-16.125rem)] max-[600px]:max-h-[calc(100vh-18.125rem)] overflow-y-auto   [&::-webkit-scrollbar]:w-[0.25rem]
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-track]:h-[1px]
                [&::-webkit-scrollbar-thumb]:bg-support-8
                [&::-webkit-scrollbar-thumb]:rounded-full
              "
            >
              {isVehiclesLoading ? (
                Array.from({ length: 5 }, (_, i) => <VehicleCardSkeleton key={i} />)
              ) : vehiclesList.length ? (
                vehiclesList.map((vehicle, index) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    ref={index === vehiclesList.length - 1 ? lastVehicleRef : null}
                  />
                ))
              ) : (
                <NothingToShow
                  title={nothingToShowOptions[active].title}
                  subtitle={nothingToShowOptions[active].subtitle}
                  icon={nothingToShowOptions[active].icon}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-[1_1_60%] h-full">
        <Map />
      </div>

      <Toaster richColors />
    </div>
  );
};

export default Vehicles;

