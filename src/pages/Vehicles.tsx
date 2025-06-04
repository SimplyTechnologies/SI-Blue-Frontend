import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';
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
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const { isSearchActive } = useSearchStore();
  const favoriteToggle = useFavoriteToggle();
  const validatedFilters = useValidatedFilters();

  const { addedSuccessfully } = location.state || {};

  const [active, setActive] = useState<VehicleTab>(location?.state?.active || vehicleTabs[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<number | null>(null);
  const [debounceValue, setDebounceValue] = useState('');

  const offset = 25;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const validatedFiltersParams = {
    ...validatedFilters,
    modelIds: validatedFilters.modelIds?.join(',') || undefined,
  };

  const resetPageAndScrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const { data, fetchNextPage, isPending, refetch } = useInfiniteQuery({
    queryKey: ['vehicles', debounceValue, JSON.stringify(validatedFilters), active],
    queryFn: async ({
      pageParam,
    }): Promise<{
      vehicles: VehicleType[];
      previousId: number;
      nextId: number;
    }> => {
      return getVehicles({
        ...validatedFiltersParams,
        search: debounceValue || undefined,
        page: pageParam,
        offset,
        favorite: active === 'favorites' ? 1 : undefined,
      });
    },
    initialPageParam: 1,
    getPreviousPageParam: firstPage => firstPage.previousId,
    getNextPageParam: lastPage => lastPage.nextId,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (addedSuccessfully) {
      toast.success('Vehicle added successfully!');
    }
  }, [addedSuccessfully, location]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  useEffect(() => {
    if (isSearchActive) {
      setActive('vehicles');
      resetPageAndScrollToTop();
      if (!isObjectEmpty(validatedFilters)) {
        navigate('/vehicles');
      }
    }
  }, [isSearchActive]);

  const handleDebounceSearch = (value: string) => setDebounceValue(value);

  const handleFavoriteClick = async (vehicleId: number, isFavorite: boolean) => {
    setFavoriteLoadingId(vehicleId);

    queryClient.setQueryData(
      ['vehicles', debounceValue, JSON.stringify(validatedFilters), active],
      (old: { pages: { vehicles: VehicleType[] }[] }) => {
        const newPages = old.pages.map(page => {
          if (active === 'favorites') {
            const updatedPageData = page.vehicles.filter(vehicle => vehicle.id !== vehicleId);

            return { ...page, vehicles: updatedPageData };
          } else {
            const updatedPageData = page.vehicles.map(vehicle => {
              if (vehicle.id === vehicleId) {
                return { ...vehicle, favorite: !vehicle.favorite };
              } else {
                return vehicle;
              }
            });

            return { ...page, vehicles: updatedPageData };
          }
        });
        return {
          ...old,
          pages: newPages,
        };
      },
    );

    favoriteToggle.mutate(
      { vehicleId, method: isFavorite ? 'DELETE' : 'POST' },
      {
        onSuccess: () => {
          if (active === 'favorites') {
            refetch();
          }
        },
        onError: error => {
          toast.error(error.message);
        },
        onSettled: () => {
          setFavoriteLoadingId(null);
        },
      },
    );
  };

  const getMapData = () => {
    const mapData: { lat: number; lng: number; id: number }[] = [];

    data?.pages?.map(page =>
      page.vehicles
        .map(vehicle => {
          if (vehicle.location.lat && vehicle.location.lng) {
            mapData.push({ id: vehicle.id, lat: vehicle.location.lat, lng: vehicle.location.lng });
          }
          return null;
        })
        .filter(vehicle => vehicle),
    );

    return mapData;
  };

  return (
    <div className="flex w-full h-[calc(100vh-78px)] flex-col lg:flex-row">
      <div className="flex flex-col gap-2 lg:h-full bg-white md:px-6 md:pt-6 px-2 pt-2 lg:w-[600px] h-[50%]">
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
              }}
            />
          </div>
        )}

        {isFilterOpen ? (
          <VehiclesFilter handleBack={() => setIsFilterOpen(false)} />
        ) : (
          <div className="flex flex-col lg:h-full max-h-[calc(100%-80px)]">
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
                          if (tab === active) return;
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
                disabled={!data?.pages?.[0]?.vehicles.length}
              />
            </div>

            <div
              ref={scrollContainerRef}
              className="flex-1 h-full lg:max-h-[calc(100vh-13.125rem)] pr-2 max-h-[calc(100vh-18.125rem)] overflow-y-auto [&::-webkit-scrollbar]:w-[0.25rem]
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-track]:h-[1px]
                [&::-webkit-scrollbar-thumb]:bg-support-8
                [&::-webkit-scrollbar-thumb]:rounded-full
              "
            >
              {isPending ? (
                Array.from({ length: 5 }, (_, i) => <VehicleCardSkeleton key={i} />)
              ) : data?.pages?.[0]?.vehicles?.length ? (
                data?.pages.map(page => (
                  <React.Fragment key={page.nextId}>
                    {page.vehicles.map((vehicle, index) => (
                      <Link to={`/vehicles/${vehicle.id}`} key={`${active}-${vehicle.id}`} state={{ vehicle }}>
                        <VehicleCard
                          vehicle={vehicle}
                          ref={index === page.vehicles.length - 2 ? ref : null}
                          handleFavoriteClick={handleFavoriteClick}
                          favoriteLoadingId={favoriteLoadingId}
                        />
                      </Link>
                    ))}
                  </React.Fragment>
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

      <div className="flex-[1_1_60%] lg:h-full h-[50%]">
        <Map cords={getMapData()} />
      </div>
    </div>
  );
};

export default Vehicles;

