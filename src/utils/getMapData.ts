import type { Poi } from '@/types/Poi';

const getMapData = (mapData: Poi[]) => {
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

export default getMapData;
