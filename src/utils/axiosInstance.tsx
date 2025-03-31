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
  (error) => {
    // Handle errors globally
    console.error('API Error:', error);
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