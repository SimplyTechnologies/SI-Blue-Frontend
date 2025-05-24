import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
// import { toast } from 'sonner';
import CustomTooltip from '@/components/molecule/CustomTooltip';
import Map from '@/components/organism/Map';
import { Button } from '@/components/atom/Button';
import VehicleCard from '@/components/molecule/VehicleCard';
import VehiclesFilter, { type FilterParamsType } from '@/components/organism/VehiclesFilter';
import DebounceSearch from '@/components/molecule/DebounceSearch';
import HeaderFilter from '@/components/organism/VehiclesHeader/HeaderFilter';
import HeaderAddNew from '@/components/organism/VehiclesHeader/HeaderAddNew';
import { Toaster } from '@/components/atom/Toaster';
import { DownloadIcon } from '@/assets/svgIconComponents/DownloadIcon';
import { useQuery } from '@tanstack/react-query';
import { fetchVehicles } from '@/requests/fetchVehicles';
import { fetchCSV } from '@/requests/fetchCSV';
import { csvDownload } from '@/utils/csvDownload';

export type VehiclesType = {
  id: number;
  year: number;
  vin: string;
  location: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
  sold: boolean;
  userId: number;
  model: {
    id: number;
    name: string;
  };
  make: {
    id: number;
    name: string;
  };
};

const Vehicles: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [active, setActive] = useState<string>('vehicles');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [debounceValue, setDebounceValue] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [parsedFilters, setParsedFilters] = useState<FilterParamsType>({});
  const [vehiclesList, setVehiclesList] = useState<VehiclesType[] | []>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [page, setPage] = useState(1);
  const offset = 25;

  const {
    isPending: csvPending,
    data: csvData,
    refetch: getCSV,
  } = useQuery({
    queryKey: ['csv', parsedFilters],
    queryFn: () => fetchCSV(parsedFilters),
    enabled: false,
  });

  const { isPending: vehiclesPending, data: vehiclesData } = useQuery({
    queryKey: ['vehicles', debounceValue, parsedFilters, page],
    queryFn: () => fetchVehicles(parsedFilters, debounceValue, page, offset),
  });

  const observer = useRef<IntersectionObserver | null>(null);

  const lastLogRef = useCallback(
    (node: Element | null) => {
      if (vehiclesPending) return;
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        entries => {
          const entry = entries[0];
          if (entry.isIntersecting && page < totalPages) {
            setPage(prevPage => prevPage + 1);
          }
        },
        {
          threshold: 0.5,
        },
      );

      if (node) observer.current.observe(node);
    },
    [vehiclesPending, totalPages, page, setPage],
  );

  useEffect(() => {
    const makeId = searchParams.get('makeId');
    const availability = searchParams.get('availability');
    const modelIds = searchParams.getAll('modelIds');

    const searchMode = searchParams.get('search');

    const filters: FilterParamsType = {};

    setParsedFilters(filters);
    setSearchMode(Boolean(searchMode));

    if (makeId || availability || modelIds.length) {
      setIsFilterActive(true);
      if (makeId) {
        filters.makeId = parseInt(makeId);
      }
      if (modelIds.length) {
        filters.modelIds = modelIds.map(item => parseInt(item));
      }
      if (availability) {
        filters.availability = availability;
      }
    } else {
      setIsFilterActive(false);
    }
  }, [searchParams]);

  const handleDebounceSearch = (value: string) => {
    if (value !== debounceValue) {
      setDebounceValue(value);
      setActive('vehicles');
      if (isFilterActive) {
        navigate('/vehicles');
      }
    }
  };

  useEffect(() => {
    if (csvData) {
      csvDownload(csvData);
    }
  }, [csvData]);

  useEffect(() => {
    if (vehiclesData?.vehicles && Array.isArray(vehiclesData?.vehicles)) {
      setTotalPages(vehiclesData.totalPages);
      setVehiclesList(prevItems => [...prevItems, ...vehiclesData.vehicles]);
    }
  }, [vehiclesData]);

  return (
    <div className="flex w-full h-[calc(100vh-78px)]">
      <div className="flex flex-col gap-2 flex-[0_1_40%] h-full bg-white px-6 pt-6 max-[768px]:px-2 max-[768px]:pt-2">
        {!isFilterOpen && (
          <div className="flex justify-between gap-4 min-h-[56px] items-start max-[1200px]:flex-col">
            <div
              className={`flex items-center h-[42px] w-full gap-2 transition-all duration-300 ease-in-out ${!searchMode ? 'max-w-[352px]' : 'max-w-full'}`}
            >
              <DebounceSearch setDebounceValue={handleDebounceSearch} searchMode={searchMode} />
              <HeaderFilter
                onFilterClick={() => setIsFilterOpen(true)}
                isFilterActive={isFilterActive}
                searchMode={searchMode}
              />
            </div>
            <HeaderAddNew searchMode={searchMode} />
          </div>
        )}

        {isFilterOpen ? (
          <VehiclesFilter handleBack={() => setIsFilterOpen(false)} />
        ) : (
          <div className="flex flex-col h-full">
            <div
              className={`flex justify-between items-start w-full border-b border-[var(--color-support-8)] gap-[6rem] max-[1200px]:gap-0 transition-all duration-300 ease-in-out ${!searchMode ? 'max-w-[352px]' : 'max-w-full'}`}
            >
              <div className="flex gap-4 max-[600px]:flex-col">
                {['vehicles', 'favorites'].map(
                  tab =>
                    (!searchMode || tab === 'vehicles') && (
                      <Button
                        key={tab}
                        onClick={() => setActive(tab)}
                        className="relative w-[67px] h-[37px] pb-4 rounded-none"
                      >
                        <p
                          className={`font-[var(--fw-bold)] text-[length:var(--sm-text)] leading-[140%] ${
                            active === tab ? 'text-[var(--color-primary-3)]' : 'text-[var(--color-support-7)]'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </p>
                        {active === tab && (
                          <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--color-primary-3)] rounded-t" />
                        )}
                      </Button>
                    ),
                )}
              </div>
              {!searchMode && (
                <CustomTooltip
                  trigger={
                    <Button
                      variant="text"
                      onClick={() => getCSV()}
                      className="flex w-6 h-6 items-center justify-center text-[#AFAFAF] hover:text-[#403c89] cursor-pointer"
                      disabled={isDownloading}
                    >
                      <DownloadIcon />
                    </Button>
                  }
                  content="Download CSV"
                  side="right"
                />
              )}
            </div>

            <div
              className="flex-1 h-full max-h-[calc(100vh-13.125rem)] max-[1200px]:max-h-[calc(100vh-16.125rem)] max-[600px]:max-h-[calc(100vh-18.125rem)] overflow-y-auto   [&::-webkit-scrollbar]:w-[0.25rem]
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-track]:h-[1px]
                [&::-webkit-scrollbar-thumb]:bg-[var(--color-support-8)]
                [&::-webkit-scrollbar-thumb]:rounded-full
              "
            >
              {vehiclesList.map((vehicle, index) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  ref={index === vehiclesList.length - 1 ? lastLogRef : null}
                />
              ))}
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

