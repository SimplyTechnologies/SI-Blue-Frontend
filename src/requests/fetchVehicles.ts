import type { VehicleRequest } from '@/types/Vehicle';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchVehicles = async (params: VehicleRequest) => {
  try {
    const response = await axios.get(`${apiUrl}/vehicles`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
  }
};

