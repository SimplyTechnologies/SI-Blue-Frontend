import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchModelsByMake = async (makeId: string) => {
  try {
    const response = await axios.get(`${apiUrl}/vehicles/models`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        makeId: parseInt(makeId),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
  }
};

