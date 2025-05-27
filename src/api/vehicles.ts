import api from './axios';
import { toast } from 'sonner';
import type { CreateVehicleRequest, FilterRequest, VehicleRequest } from '@/types/Vehicle';

export const getVehicles = async (params: VehicleRequest) => {
  try {
    const response = await api.get(`/vehicles`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
  }
};

export const createVehicle = async (body: CreateVehicleRequest) => {
  const response = await api.post(`/vehicles/vehicle`, body);
  return response.data;
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
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting file:', error);
    toast.error('Failed to export. Please try again.');
  }
};
