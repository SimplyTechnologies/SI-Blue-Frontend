import { toast } from 'sonner';
import api from './axios';
import type { AddRemoveFavorite, CreateVehicleRequest, FilterRequest, VehicleRequest } from '@/types/Vehicle';

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

export const getVehicleById = async (id: string) => {
  try {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle:', error);
  }
};

export const getAllVehicleLocationsAndCounts = async () => {
  try {
    const response = await api.get(`/vehicles/dashboard-data`);
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

export const addFavorite = async (body: AddRemoveFavorite) => {
  const response = await api.post('/favorites', body);
  return response.data;
};

export const removeFavorite = async (params: AddRemoveFavorite) => {
  const response = await api.delete(`/favorites/${params.vehicleId}`);
  return response.data;
};

export const decodeVehicleVin = async (body: { vin: string }) => {
  const response = await api.post('/vehicles/decode/vin', body);
  return response.data;
};
