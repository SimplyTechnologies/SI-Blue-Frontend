import { useEffect, useState } from 'react';
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
    queryKey: ['vehicles', debounceValue, parsedFilters],
    queryFn: () => fetchVehicles(parsedFilters, debounceValue, page, offset),
  });

  useEffect(() => {
    const make = searchParams.get('makeId');
    const availability = searchParams.get('availability');
    const models = searchParams.getAll('modelIds');

    const searchMode = searchParams.get('search');

    const filters: FilterParamsType = {};

    for (const [key, value] of searchParams.entries()) {
      if (key === 'makeId' || key === 'modelIds' || key === 'availability') {
        filters[key] = value;
      }
    }

    setParsedFilters(filters);
    setSearchMode(Boolean(searchMode));

    if (make || availability || models.length) {
      setIsFilterActive(true);
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

  const handleCSVDownload = () => {
    getCSV();
  };

  useEffect(() =>{
    if (csvData) {
      csvDownload(csvData)
    }
  }, [csvData])

  useEffect(() => {
    if (vehiclesData?.vehicles && Array.isArray(vehiclesData?.vehicles)) {
      setVehiclesList(vehiclesData.vehicles);
    } else {
      setVehiclesList([]);
    }
  }, [vehiclesData]);

  return (
    <div className="w-full h-[calc(100vh-78px)] flex">
      <div className="h-full flex flex-col gap-[0.5rem] flex-[0_1_40%] bg-[var(--white-color)] px-[1.5rem] pt-[1.5rem] max-[768px]:px-[0.5rem] max-[768px]:pt-[0.5rem]">
        {isFilterOpen ? null : (
          <div className="flex item-start justify-between gap-[1rem] max-[1200px]:flex-col min-h-[56px]">
            <div className={`gap-2 w-full ${searchMode ? '' : 'max-w-[352px]'}   h-[42px] flex items-center`}>
              <DebounceSearch setDebounceValue={handleDebounceSearch} searchMode={searchMode} />
              {searchMode ? null : (
                <HeaderFilter onFilterClick={() => setIsFilterOpen(true)} isFilterActive={isFilterActive} />
              )}
            </div>
            {searchMode ? null : <HeaderAddNew />}
          </div>
        )}
        {isFilterOpen ? (
          <VehiclesFilter handleBack={() => setIsFilterOpen(false)} />
        ) : (
          <div className="h-full flex flex-col">
            <div
              className={`w-full ${searchMode ? '' : 'max-w-[352px]'} flex items-start gap-[6rem] border-b-[1px] border-[var(--color-support-8)] max-[1200px]:gap-[0] justify-between`}
            >
              <div className="flex gap-[1rem] max-[600px]:flex-col">
                <Button
                  onClick={() => setActive('vehicles')}
                  className={`relative w-[67px] h-[37px] rounded-[0] pb-[1rem]`}
                >
                  <p
                    className={`font-[var(--fw-bold)] text-[length:var(--sm-text)] ${active === 'vehicles' ? 'text-[var(--color-primary-3)]' : 'text-[var(--color-support-7)]'}   leading-[140%]`}
                  >
                    Vehicles
                  </p>
                  {active === 'vehicles' && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--color-primary-3)] rounded-t-[2px]" />
                  )}
                </Button>

                {searchMode ? null : (
                  <Button
                    onClick={() => setActive('favorites')}
                    className={`relative w-[67px] h-[37px] pb-[1rem] rounded-[0]`}
                  >
                    <p
                      className={`font-[var(--fw-bold)] text-[length:var(--sm-text)] ${active === 'vehicles' ? 'text-[var(--color-support-7)]' : 'text-[var(--color-primary-3)]'}   leading-[140%]`}
                    >
                      Favorites
                    </p>
                    {active === 'favorites' && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--color-primary-3)] rounded-t-[2px]" />
                    )}
                  </Button>
                )}
              </div>
              {searchMode ? null : (
                <CustomTooltip
                  trigger={
                    <Button
                      variant="text"
                      onClick={handleCSVDownload}
                      className="flex w-[24px] h-[24px] items-center justify-center text-[#AFAFAF] hover:text-[#403c89] cursor-pointer"
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
              {active === 'vehicles' && vehiclesList.map(item => <VehicleCard key={item.id} vehicle={item} />)}
              {/* {active === 'favorites' && Array.from({ length: 10 }, (_, i) => <VehicleCard key={i} />)} */}
            </div>
          </div>
        )}
      </div>
      <div className="h-full flex-[1_1_60%]">
        <Map />
      </div>
      <Toaster richColors />
    </div>
  );
};

export default Vehicles;

