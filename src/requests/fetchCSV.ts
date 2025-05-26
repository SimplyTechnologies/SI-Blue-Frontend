import axios from 'axios';
import { toast } from 'sonner';
import type { FilterRequest } from '@/types/Vehicle';

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchCSV = async (params: FilterRequest) => {
  try {
    const response = await axios.get(`${apiUrl}/vehicles/export`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting file:', error);
    toast.error('Failed to export. Please try again.');
  }
};

