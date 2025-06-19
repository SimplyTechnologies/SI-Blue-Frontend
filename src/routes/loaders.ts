import type { LoaderFunctionArgs } from 'react-router';
import type { QueryClient } from '@tanstack/react-query';
import { vehicleQueryOptions } from '@/hooks/useVehicleData';

export const vehicleDataLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    return await queryClient.ensureQueryData(vehicleQueryOptions(params.vehicleId));
  };

export const mapDataLoader = (queryClient: QueryClient) => async () => {
  await queryClient.ensureQueryData(vehicleQueryOptions());
};

