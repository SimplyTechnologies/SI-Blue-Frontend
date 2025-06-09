import type { Poi } from '@/types/Poi';

export const isObjectEmpty = (obj: Record<string, unknown>) => {
  return !Object.keys(obj).length;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return;

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = date.getFullYear();

  return `${dd}.${mm}.${yyyy}`;
};

export const getMapData = (mapData: Poi[]) => {
  return mapData
    .filter(item => item.id && item.lat && item.lng)
    .map(item => {
      return {
        ...item,
        lat: typeof item.lat === 'string' ? parseFloat(item.lat) : item.lat,
        lng: typeof item.lng === 'string' ? parseFloat(item.lng) : item.lng,
      };
    });
};

