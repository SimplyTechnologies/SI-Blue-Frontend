import { getAllVehicleLocationsAndCounts, getVehicleById } from '@/api/vehicles';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router';

export const vehicleDetailsQuery = (id?: string) =>
  queryOptions({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const vehicle = id && (await getVehicleById(id));
      return vehicle || null;
    },
  });

export const vehicleDetailsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.vehicleId) {
      throw new Error('No vehicle ID provided');
    }
    await queryClient.ensureQueryData(vehicleDetailsQuery(params.vehicleId));
    return { vehicleId: params.vehicleId };
  };

export const mapDataQuery = (search?: string) =>
  queryOptions({
    queryKey: ['map-data', search],
    queryFn: async () => {
      const mapData = await getAllVehicleLocationsAndCounts(search || '');
      return mapData;
    },
  });

export const mapDataLoader = (queryClient: QueryClient) => async () => {
  await queryClient.ensureQueryData(mapDataQuery());
};

