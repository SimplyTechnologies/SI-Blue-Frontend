import { queryOptions, useQuery } from '@tanstack/react-query';
import { getAllVehicleLocationsAndCounts } from '@/api/vehicles';

export const vehiclesMapDataQueryOptions = (id?: string) =>
  queryOptions({
    queryKey: ['map-data'],
    queryFn: getAllVehicleLocationsAndCounts,
    enabled: !id,
  });

export const useVehiclesMapDataQuery = (id?: string) => {
  const { data, isError, error } = useQuery(vehiclesMapDataQueryOptions(id));

  if (isError) {
    console.dir('error', error);
  }

  return { data };
};

