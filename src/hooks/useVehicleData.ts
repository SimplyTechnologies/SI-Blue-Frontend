import { queryOptions, useQuery } from '@tanstack/react-query';
import { getVehicleById } from '@/api/vehicles';

export const vehicleQueryOptions = (id?: string) =>
  queryOptions({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicleById(id!),
    enabled: !!id,
    retry: false,
  });

export const useVehicleData = (id?: string) => {
  const { data, isPending, isError, error } = useQuery(vehicleQueryOptions(id));

  if (isError) {
    console.dir('error', error);
  }

  return { data, isPending };
};

