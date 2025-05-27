import { useCallback, useEffect, useRef, useState } from 'react';
import Map from '@/components/organism/Map';
import arrowLeft from '@/assets/arrowLeft.svg';
import verticalDotes from '@/assets/verticalDotes.svg';
import CustomDropdown from '@/components/molecule/CustomDropdown';
import type { Vehicle } from '@/types/Vehicle';
import { Pencil } from 'lucide-react';
import { Trash } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useSearchStore } from '@/stores/useSearchStore';
import { useValidatedFilters } from '@/hooks/useValidatedFilters';
import { getVehicles } from '@/api/vehicles';
import { nothingToShowOptions } from '@/utils/constants';
import { isObjectEmpty } from '@/utils/general';
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

const Vehicles: React.FC = () => {
  const navigate = useNavigate();
  const { isSearchActive } = useSearchStore();

  const [active, setActive] = useState<'vehicles' | 'favorites' | 'details'>('vehicles');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [debounceValue, setDebounceValue] = useState('');

  const [vehiclesList, setVehiclesList] = useState<Vehicle[] | []>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const offset = 25;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const validatedFilters = useValidatedFilters();

  const validatedFiltersParams = {
    ...validatedFilters,
    modelIds: validatedFilters?.modelIds?.length ? validatedFilters?.modelIds.join(',') : undefined,
  };

  const vehiclesDropdownItems = [
    {
      label: 'Edit',
      onClick: () => console.log('Edit Vehicle'),
      icon: <Pencil className="text-[var(--color-support-5)] group-hover:text-[var(--color-primary-3)]" />,
    },
    {
      label: 'Delete',
      onClick: () => console.log('Delete Vehicles'),
      icon: <Trash className="text-[var(--color-support-5)] group-hover:text-[var(--color-primary-3)]" />,
    },
  ];

  const { isLoading: isVehiclesLoading, data: vehiclesData } = useQuery({
    queryKey: ['vehicles', debounceValue, JSON.stringify(validatedFilters), page, active],
    queryFn: () =>
      getVehicles({
        ...validatedFiltersParams,
        search: debounceValue || undefined,
        page,
        offset,
        favorite: active === 'favorites' ? 1 : undefined,
      }),
  });

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
    if (debounceValue || !isObjectEmpty(validatedFilters)) {
      setPage(1);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [debounceValue, validatedFilters]);

  const handleDebounceSearch = (value: string) => {
    if (value !== debounceValue) {
      setDebounceValue(value);
      setActive('vehicles');

      if (!isObjectEmpty(validatedFilters)) {
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
            setPage(prev => prev + 2);
          }
        },
        { threshold: 1 },
      );

      observerRef.current.observe(node);
    },
    [isVehiclesLoading, page, totalPages],
  );

  const handleOpenDetails = (vehicle: Vehicle) => {
    setActive('details');
    setSelectedVehicle(vehicle);
  };

  const handleCloseDetails = () => {
    setActive('vehicles');
    setSelectedVehicle(null);
  };

  return (
    <div className="w-full h-[calc(100vh-78px)] flex">
      <div
        className={`h-full flex-[0_1_40%] flex flex-col gap-[0.5rem] bg-[var(--color-white)] px-[1.5rem] pt-[1.5rem] max-[768px]:px-[0.5rem] max-[768px]:pt-[0.5rem]`}
      >
        {active === 'details' ? (
          <div className="w-full h-[1.5rem] flex-1 flex justify-between items-center gap-[1rem]">
            <div
              onClick={() => handleCloseDetails()}
              className="flex w-[1.5rem] h-[1.5rem] items-center justify-center cursor-pointer"
            >
              <img src={arrowLeft} alt="Back" />
            </div>
            <div className="flex w-[1.5rem] h-[1.5rem] items-center justify-center cursor-pointer">
              <CustomDropdown
                trigger={<img src={verticalDotes} alt="Menu" />}
                items={vehiclesDropdownItems}
                menuClassName="w-[219px] h-[102px] p-[12px] border-none rounded-[16px] shadow-(box-shadow: 0px 4px 80px 0px #A7AEC133;)"
                itemClassName="group w-full h-32px rounded-[0.5rem] gap-[0.5rem] px-[12px] py-[0.5rem] text-[var(--color-support-5)] font-[var(--fw-regular)] font-[length:var(--sm-text)] leading-[140%] hover:bg-[var(--color-bg-2)] hover:text-[var(--color-support-6)] hover:font-[var(--fw-medium)]"
              />
            </div>
          </div>
        ) : (
          <>
            {!isFilterOpen && (
              <div className="flex justify-between gap-4 items-start max-[1200px]:flex-col">
                <div
                  className={`flex items-center h-[42px] w-full transition-all duration-300 ease-in-out ${isSearchActive ? 'max-w-full' : 'max-w-[352px]'}`}
                >
                  <DebounceSearch setDebounceValue={handleDebounceSearch} />
                  <FilterButton
                    onFilterClick={() => setIsFilterOpen(true)}
                    isFilterActive={!isObjectEmpty(validatedFilters)}
                  />
                </div>
                <AddNewVehicleButton buttonName="+ Add" className="w-[132px] h-[56px] max-[1200px]:h-[42px]" />
              </div>
            )}
            {isFilterOpen ? (
              <VehiclesFilter handleBack={() => setIsFilterOpen(false)} />
            ) : (
              <div className="flex flex-col h-full">
                <div className="w-full max-w-[352px] flex items-start gap-[6rem] border-b-[1px] border-[var(--color-support-8)] max-[1200px]:gap-[0] max-[1200px]:justify-between">
                  <div className="flex gap-[1rem] max-[600px]:flex-col">
                    <Button
                      onClick={() => setActive('vehicles')}
                      className={`relative w-[67px] h-[37px] rounded-[0] pb-[1rem]`}
                    >
                      <p
                        className={`text-[length:var(--sm-text)] ${active === 'vehicles' ? 'text-[var(--color-primary-3)] font-[var(--fw-bold)] ' : 'text-[var(--color-support-7)] font-[var(--fw-medium)]'}   leading-[140%]`}
                      >
                        Vehicles
                      </p>
                      {active === 'vehicles' && (
                        <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--color-primary-3)] rounded-t-[2px]" />
                      )}
                    </Button>
                    <Button
                      onClick={() => setActive('favorites')}
                      className={`relative w-[67px] h-[37px] pb-[1rem] rounded-[0]`}
                    >
                      <p
                        className={`text-[length:var(--sm-text)] ${active === 'vehicles' ? 'text-[var(--color-support-7)] font-[var(--fw-medium)]' : 'text-[var(--color-primary-3)] font-[var(--fw-bold)]'}   leading-[140%]`}
                      >
                        Favorites
                      </p>
                      {active === 'favorites' && (
                        <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--color-primary-3)] rounded-t-[2px]" />
                      )}
                    </Button>
                  </div>
                  <div className="flex w-[24px] h-[24px] items-center justify-center">
                    <ExportCSVButton
                      filters={{ ...validatedFiltersParams, favorite: active === 'favorites' ? 1 : undefined }}
                      disabled={!vehiclesList.length}
                    />
                  </div>
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
                    vehiclesList
                      .filter(vehicle => {
                        if (active === 'vehicles') return true;
                        if (active === 'favorites') return vehicle.favorite === true;
                        return false;
                      })
                      .map((vehicle, index, filteredList) => (
                        <VehicleCard
                          key={vehicle.id}
                          vehicle={vehicle}
                          onClick={() => handleOpenDetails(vehicle)}
                          ref={index === filteredList.length - 1 ? lastVehicleRef : null}
                        />
                      ))
                  ) : (
                    <NothingToShow
                      title={nothingToShowOptions[active].title}
                      subtitle={nothingToShowOptions[active].subtitle}
                      icon={nothingToShowOptions[active].icon}
                    />
                  )}
                  {selectedVehicle && <VehicleCard vehicle={selectedVehicle} details={true} />}
                </div>
                <Toaster richColors visibleToasts={1} />
              </div>
            )}
          </>
        )}
      </div>
      <div className="h-full flex-[1_1_60%]">
        <Map />
      </div>
    </div>
  );
};

export default Vehicles;
