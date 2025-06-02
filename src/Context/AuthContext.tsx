import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
// import axios from 'axios';
import { api } from '../utils/axiosInstance'; // Import the reusable API methods
import { v4 as uuidv4 } from 'uuid';
import { disconnectSocket, initSocket} from '../socket'; // Import socket connection methods
import { Socket } from 'socket.io-client';
import { requestNotificationPermission, stopPushNotifications } from '../notifications';

const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};


interface AuthContextType {
  isAuth: boolean;
  token: string | null;
  refreshToken: string | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  socketInstance: Socket | null;
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
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);


  useEffect(() => {
    if (isAuth) {
      initSocket()
        .then((socket) => {
          setSocketInstance(socket);
        })
    } else {
      setSocketInstance(null);
    }
  }, [isAuth]);


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
      requestNotificationPermission()
      .then(fcmToken => {
         const deviceId = getDeviceId();
        if(fcmToken && deviceId){
          api.post('/users/register-fcm-token', { fcmToken, deviceId });
        }
      })
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
          disconnectSocket();
          stopPushNotifications();
        });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuth, token, login, logout, refreshToken, socketInstance }}>
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