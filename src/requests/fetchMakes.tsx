import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchMakes = async () => {
  try {
    const response = await axios.get(`${apiUrl}/vehicles/makes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching makes:', error);
  }
};

