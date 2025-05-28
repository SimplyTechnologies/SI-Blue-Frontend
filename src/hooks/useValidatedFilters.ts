import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { filterSchema } from '@/types/Vehicle';

export const useValidatedFilters = () => {
  const [searchParams] = useSearchParams();

  const rawParams: Record<string, string | string[]> = {};
  for (const key of searchParams.keys()) {
    const values = searchParams.getAll(key);
    rawParams[key] = key === 'modelIds' ? values : values[0];
  }

  const parsed = filterSchema.safeParse(rawParams);

  if (!parsed.success) {
    toast.error('Invalid filters');
    return {};
  }

  return parsed.data;
};

