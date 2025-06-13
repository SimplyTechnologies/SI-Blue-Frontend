import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const publicRoutes = ['/login', '/account-activation', '/forgot-password', '/reset-password'];

const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use(request => {
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    request.headers['Accept'] = 'application/json';

    if (accessToken && request.headers) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return request;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const isPrivateRoute = !publicRoutes.find(item => window.location.pathname.includes(item));

    if (error.response.status === 401 && !originalRequest._retry && isPrivateRoute) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('REFRESH_TOKEN');
        const response = await axios.post(`${apiUrl}/auth/refresh-token`, {
          refreshToken,
        });
        const { accessToken } = response.data.data;
        localStorage.setItem('ACCESS_TOKEN', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
        localStorage.setItem('authStore', JSON.stringify({ user: null, isAuthenticated: false }));
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;

