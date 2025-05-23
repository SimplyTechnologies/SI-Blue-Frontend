import type { FilterParamsType } from '@/components/organism/VehiclesFilter';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchCSV = async (searchParams: FilterParamsType) => {
  try {
    const response = await axios.get(`${apiUrl}/vehicles/export`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: searchParams,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching makes:', error);
  }
};

