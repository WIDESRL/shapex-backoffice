import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use the environment variable

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors if needed (optional)
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );
          const { token: newToken, refreshToken: newRefreshToken } = res.data;
          localStorage.setItem('token', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Define reusable methods
export const api = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: async (url: string, params?: Record<string, any>) => {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: async (url: string, data?: Record<string, any>) => {
    const response = await axiosInstance.post(url, data);
    return response.data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: async (url: string, data?: Record<string, any>) => {
    const response = await axiosInstance.put(url, data);
    return response.data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete: async (url: string, data?: Record<string, any>) => {
    const response = await axiosInstance.delete(url, data);
    return response.data;
  },
};

export default axiosInstance;