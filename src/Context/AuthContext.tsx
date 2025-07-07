import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
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

interface ProfilePictureFile {
  id: number;
  type: string;
  fileName: string;
  signedUrl: string;
  signedUrlExpire: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  verified: boolean;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  placeOfBirth: string | null;
  address: string | null;
  phoneNumber: string | null;
  profilePicture: number | null;
  initialHistoryCompleted: boolean;
  profileInformationCompleted: boolean;
  online: boolean;
  lastOnline: string;
  lastLogin: string;
  subscriptions: unknown[];
  profilePictureFile: ProfilePictureFile | null;
}

interface AuthContextType {
  isAuth: boolean;
  token: string | null;
  refreshToken: string | null;
  userData: UserData | null;
  userDataLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  socketInstance: Socket | null;
  getMyUserData: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  updateUserProfile: (profileData: { firstName: string; lastName: string; profilePicture?: number }) => Promise<void>;
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(false);
  

  // Debounced function to get user data
  const getMyUserData = useCallback(async () => {
    if (userDataLoading) return; // Prevent multiple calls
    
    setUserDataLoading(true);
    try {
      const data = await api.get('/users/me');
      setUserData(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setUserDataLoading(false);
    }
  }, [userDataLoading]);

  // Change password function
  const changePassword = async (newPassword: string) => {
    return api.put('/users/set-password', { newPassword });
  };

  // Update user profile function
  const updateUserProfile = async (profileData: { firstName: string; lastName: string; profilePicture?: number }) => {
    return api.put('/users/profile', profileData);
  };



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
      return api.post('/auth/login/backoffice', credentials); // Use the reusable API method
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
    <AuthContext.Provider value={{ 
      isAuth, 
      token, 
      login, 
      logout, 
      refreshToken, 
      socketInstance,
      userData,
      userDataLoading,
      getMyUserData,
      changePassword,
      updateUserProfile,
    }}>
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