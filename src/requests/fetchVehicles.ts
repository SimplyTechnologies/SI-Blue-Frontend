import type { FilterParamsType } from '@/components/organism/VehiclesFilter';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchVehicles = async (filters: FilterParamsType, search: string, page: number, offset: number) => {
  try {
    const response = await axios.get(`${apiUrl}/vehicles`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...filters, page, offset, search: search || undefined, modelIds: filters.modelIds?.join(',') },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching makes:', error);
  }
};

