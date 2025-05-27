import api from './axios';
import { toast } from 'sonner';
import type { FilterRequest, VehicleRequest } from '@/types/Vehicle';

export const getVehicles = async (params: VehicleRequest) => {
  try {
    const response = await api.get(`/vehicles`, {
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

export const getMakes = async () => {
  try {
    const response = await api.get(`/vehicles/makes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching makes:', error);
  }
};

export const getModelsByMakeId = async (makeId: string) => {
  try {
    const response = await api.get(`/vehicles/models`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        makeId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
  }
};

export const getCSV = async (params: FilterRequest) => {
  try {
    const response = await api.get(`/vehicles/export`, {
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

