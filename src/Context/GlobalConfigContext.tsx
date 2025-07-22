import React, { createContext, useContext, useState, ReactNode } from 'react';
import axiosInstance from '../utils/axiosInstance';

export interface GlobalConfig {
  id: number;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

interface GlobalConfigContextType {
  configs: GlobalConfig[];
  loading: boolean;
  error: string | null;
  fetchConfigs: () => Promise<void>;
  updateConfig: (configId: number, newValue: string) => Promise<void>;
  getConfigByName: (name: string) => GlobalConfig | undefined;
}

const GlobalConfigContext = createContext<GlobalConfigContextType | undefined>(undefined);

export const useGlobalConfig = () => {
  const context = useContext(GlobalConfigContext);
  if (context === undefined) {
    throw new Error('useGlobalConfig must be used within a GlobalConfigProvider');
  }
  return context;
};

interface GlobalConfigProviderProps {
  children: ReactNode;
}

export const GlobalConfigProvider: React.FC<GlobalConfigProviderProps> = ({ children }) => {
  const [configs, setConfigs] = useState<GlobalConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/global-config');
      setConfigs(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching global configs:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (configId: number, newValue: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/global-config/${configId}`, {
        value: newValue,
      });

      const updatedConfig = response.data;
      
      // Update the config in the local state
      setConfigs(prevConfigs => 
        prevConfigs.map(config => 
          config.id === configId ? updatedConfig : config
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error updating config:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getConfigByName = (name: string): GlobalConfig | undefined => {
    return configs.find(config => config.name === name);
  };

  const value: GlobalConfigContextType = {
    configs,
    loading,
    error,
    fetchConfigs,
    updateConfig,
    getConfigByName,
  };

  return (
    <GlobalConfigContext.Provider value={value}>
      {children}
    </GlobalConfigContext.Provider>
  );
};

export default GlobalConfigProvider;
