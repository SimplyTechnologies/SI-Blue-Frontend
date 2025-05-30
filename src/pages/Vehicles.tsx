import { toast } from 'sonner';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { type VehicleTab, type VehicleType } from '@/types/Vehicle';
import { useSearchStore } from '@/stores/useSearchStore';
import { useValidatedFilters } from '@/hooks/useValidatedFilters';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { getVehicles } from '@/api/vehicles';
import { nothingToShowOptions, vehicleTabs } from '@/utils/constants';
import { isObjectEmpty } from '@/utils/general';
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

const Vehicles: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSearchActive } = useSearchStore();
  const { addedSuccessfully } = location.state || {};

  const [active, setActive] = useState<VehicleTab>(vehicleTabs[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
  const [debounceValue, setDebounceValue] = useState('');

  const [vehiclesList, setVehiclesList] = useState<VehicleType[] | []>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const offset = 25;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const validatedFilters = useValidatedFilters();

  const favoriteToggle = useFavoriteToggle();

  const validatedFiltersParams = {
    ...validatedFilters,
    modelIds: validatedFilters?.modelIds?.length ? validatedFilters?.modelIds.join(',') : undefined,
  };

  const resetPageAndScrollToTop = () => {
    setPage(1);
    setVehiclesList([]);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const {
    isLoading: isVehiclesLoading,
    data: vehiclesData,
    refetch,
  } = useQuery({
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

  useEffect(() => {
    if (addedSuccessfully) {
      toast.success('Vehicle added successfully!');
      location.state = {};
    }
  }, [addedSuccessfully, location]);

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

  const handleDebounceSearch = (value: string) => {
    if (value !== debounceValue) {
      setDebounceValue(value);
      setActive('vehicles');
      resetPageAndScrollToTop();
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
            setPage(prev => prev + 1);
          }
        },
        { threshold: 1 },
      );

      observerRef.current.observe(node);
    },
    [isVehiclesLoading, page, totalPages],
  );

  const handleFavoriteClick = async (vehicleId: number, isFavorite: boolean) => {
    setFavoriteLoadingId(vehicleId);
    favoriteToggle.mutate(
      { vehicleId, method: isFavorite ? 'DELETE' : 'POST' },
      {
        onSuccess: () => {
          // const { vehicle } = response;
          setVehiclesList(prevItems => {
            return active === 'favorites'
              ? prevItems.filter(item => item.id !== vehicleId)
              : prevItems.map(item => {
                  if (item.id == vehicleId) {
                    return { ...item, favorite: !item.favorite };
                  }
                  return item;
                });
          });
          setFavoriteLoadingId(null);
        },
        onError: error => {
          toast.error(error.message);
          setFavoriteLoadingId(null);
        },
      },
    );
  };

  return (
    <div className="flex w-full h-[calc(100vh-78px)]">
      <div className="flex flex-col gap-2 flex-[0_1_40%] h-full bg-white px-6 pt-6 max-[768px]:px-2 max-[768px]:pt-2">
        {!isFilterOpen && (
          <div className="flex justify-between gap-4 min-h-[56px] items-start">
            <div
              className={`flex items-center h-[42px] w-full gap-2 transition-all duration-300 ease-in-out ${isSearchActive ? 'max-w-full' : 'max-w-[352px]'}`}
            >
              <DebounceSearch setDebounceValue={handleDebounceSearch} />
              <FilterButton
                onFilterClick={() => setIsFilterOpen(true)}
                isFilterActive={!isObjectEmpty(validatedFilters)}
              />
            </div>
            <AddNewVehicleButton
              buttonName="+ Add"
              className="w-[132px] h-[56px]"
              onSuccess={() => {
                toast.success('Vehicle added successfully!');
                resetPageAndScrollToTop();
                refetch();
              }}
            />
          </div>
        )}

        {isFilterOpen ? (
          <VehiclesFilter handleBack={() => setIsFilterOpen(false)} />
        ) : (
          <div className="flex flex-col h-full">
            <div
              className={`flex justify-between items-start w-full border-b border-support-8 gap-[6rem] transition-all duration-300 ease-in-out ${isSearchActive ? 'max-w-full' : 'max-w-[352px]'}`}
            >
              <div className="flex gap-4">
                {vehicleTabs.map(
                  tab =>
                    (!isSearchActive || tab === 'vehicles') && (
                      <Button
                        key={tab}
                        onClick={() => {
                          if (tab === active) return
                          resetPageAndScrollToTop();
                          setActive(tab);
                        }}
                        className="relative w-[67px] h-[37px] pb-4 rounded-none"
                      >
                        <p
                          className={`font-bold text-[length:var(--sm-text)] leading-[140%] ${
                            active === tab ? 'text-primary-3 font-bold' : 'text-support-7 font-medium'
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
              <ExportCSVButton
                filters={{ ...validatedFiltersParams, favorite: active === 'favorites' ? 1 : undefined }}
                disabled={!vehiclesList.length}
              />
            </div>

            <div
              ref={scrollContainerRef}
              className="flex-1 h-full max-h-[calc(100vh-13.125rem)] max-[600px]:max-h-[calc(100vh-18.125rem)] overflow-y-auto   [&::-webkit-scrollbar]:w-[0.25rem]
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-track]:h-[1px]
                [&::-webkit-scrollbar-thumb]:bg-support-8
                [&::-webkit-scrollbar-thumb]:rounded-full
              "
            >
              {isVehiclesLoading && !vehiclesList.length ? (
                Array.from({ length: 5 }, (_, i) => <VehicleCardSkeleton key={i} />)
              ) : vehiclesList.length ? (
                vehiclesList.map((vehicle, index) => (
                  <Link to={`/vehicles/${vehicle.id}`} key={vehicle.id} state={{ vehicle }}>
                    <VehicleCard
                      vehicle={vehicle}
                      ref={index === vehiclesList.length - 2 ? lastVehicleRef : null}
                      handleFavoriteClick={handleFavoriteClick}
                      favoriteLoadingId={favoriteLoadingId}
                    />
                  </Link>
                ))
              ) : (
                <NothingToShow
                  title={nothingToShowOptions[active].title}
                  subtitle={nothingToShowOptions[active].subtitle}
                  icon={nothingToShowOptions[active].icon}
                />
              )}
            </div>
            <Toaster richColors visibleToasts={1} />
          </div>
        )}
      </div>

      <div className="flex-[1_1_60%] h-full">
        {vehiclesData && (
          <Map
            cords={vehiclesList.map((vehicle: VehicleType) => ({
              id: vehicle.id,
              lat: vehicle.location.lat as number,
              lng: vehicle.location.lng as number,
            }))}
          />
        )}
      </div>
    </div>
  );
};

export default Vehicles;

