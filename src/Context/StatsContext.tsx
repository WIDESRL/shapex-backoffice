import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { api } from '../utils/axiosInstance';

export interface DashboardStats {
  totalClients?: number;
  deactivatedClients?: number;
  totalPrograms?: number;
  completedTrainings?: number;
}

interface StatsContextType {
  dashboardStats: DashboardStats | null;
  statsLoading: boolean;
  fetchDashboardStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchDashboardStats = useCallback(async () => {
    if (statsLoading) return;
    
    setStatsLoading(true);
    try {
      const data = await api.get('/dashboard/stats');
      setDashboardStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setDashboardStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, [statsLoading]);

  return (
    <StatsContext.Provider value={{ 
      dashboardStats, 
      statsLoading, 
      fetchDashboardStats 
    }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = (): StatsContextType => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};
