import React, { createContext, useState, useContext, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
// import axios from 'axios';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { api } from '../utils/axiosInstance'; // Import the reusable API methods

interface AuthContextType {
  isAuth: boolean;
  token: string | null;
  refreshToken: string | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('token') !== null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Reference to store the interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Decode token to get expiration time
  const decodeToken = (token: string): { exp: number } | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the payload
      return payload;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };


  // React Query mutation for login
  const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      return api.post('/auth/login', credentials); // Use the reusable API method
    },
    onSuccess: (data) => {
      setIsAuth(true);
      setToken(data.token);
      setRefreshToken(data.refreshToken);
      localStorage.setItem('token', data.token); // Save token to localStorage
      localStorage.setItem('refreshToken', data.refreshToken); // Save token to localStorage
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = () => {
    //Make an API call to invalidate the token if needed, post requeset sending refreshToken as payload
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      api.post('/auth/logout', { refreshToken })
        .then(() => console.log('Logged out successfully'))
        .catch((error) => console.error('Logout failed:', error))
        .finally(() => {
          localStorage.removeItem('token'); 
          localStorage.removeItem('refreshToken');
          setToken(null);
          setRefreshToken(null);
          setIsAuth(false);
        });
    }
  };

  // React Query mutation for refreshing the token
  const refreshMutation = useMutation<LoginResponse, Error, { refreshToken: string }>({
    mutationFn: async ({ refreshToken }) => api.post('/auth/refresh-token', { refreshToken }),
    onSuccess: (data) => {
      if (data?.token) {
        setIsAuth(true);
        setToken(data.token);
        localStorage.setItem('token', data.token); // Update token in localStorage
      }
      if (data?.refreshToken) {
        setRefreshToken(data.refreshToken);
        localStorage.setItem('refreshToken', data.refreshToken); // Update refreshToken in localStorage
      }
    },
    onError: (error) => console.error('Token refresh failed:', error)
  });

  // Function to start the interval
  const startTokenExpirationCheck = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (token && refreshToken) {
        const decoded = decodeToken(token);
        if (decoded) {
          const timeLeft = decoded.exp * 1000 - Date.now();
          if (timeLeft <= 60000) refreshMutation.mutate({ refreshToken: localStorage.getItem('refreshToken') || refreshToken });
        }
      }
    }, 60000); // Check every minute
  }, [token, refreshToken, refreshMutation]);

  // Function to stop the interval
  const stopTokenExpirationCheck = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start or stop the interval based on token and refreshToken
  useEffect(() => {
    if (token && refreshToken) startTokenExpirationCheck();
    else stopTokenExpirationCheck();
    return stopTokenExpirationCheck; // Cleanup on unmount
  }, [token, refreshToken, startTokenExpirationCheck, stopTokenExpirationCheck]);
  return (
    <AuthContext.Provider value={{ isAuth, token, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};