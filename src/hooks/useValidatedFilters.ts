import { useSearchParams } from 'react-router';
import { createFilterSchema } from '@/types/Vehicle';
import { useFilterOptionsStore } from '@/stores/useFilterOptionsStore';

export const useValidatedFilters = () => {
  const [searchParams] = useSearchParams();
  const { validMakeIds, validModelIds, validAvailabilityIds } = useFilterOptionsStore();

  const rawParams: Record<string, string | string[]> = {};
  for (const key of searchParams.keys()) {
    const values = searchParams.getAll(key);
    rawParams[key] = values.length > 1 ? values : values[0];
  }

  const schema = createFilterSchema({
    validMakeIds,
    validModelIds,
    validAvailabilityIds,
  });

  const parsed = schema.safeParse(rawParams);

  if (!parsed.success) {
    console.warn(parsed.error.format());
    return {};
  }

  return parsed.data;
};

