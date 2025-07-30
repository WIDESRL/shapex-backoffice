import React, { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';

export type UserNeedingReminder = {
  userId: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  subscription: {
    title: string;
    monthlyChecks: number;
    color: string;
    id: number;
  };
  nextCheckDate: string;
  daysBetweenChecks: number;
};

export type UserWithOverdueCheck = {
  userId: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  subscription: {
    id: number;
    title: string;
    monthlyChecks: number;
    color: string;
  };
  scheduledDate: string;
  daysBetweenChecks: number;
  daysOverdue: number;
};

export type ReminderContextType = {
  usersNeedingReminders: UserNeedingReminder[];
  usersWithOverdueChecks: UserWithOverdueCheck[];
  loading: boolean;
  overdueLoading: boolean;
  fetchUsersNeedingReminders: () => Promise<void>;
  fetchUsersWithOverdueChecks: () => Promise<void>;
};

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersNeedingReminders, setUsersNeedingReminders] = useState<UserNeedingReminder[]>([]);
  const [usersWithOverdueChecks, setUsersWithOverdueChecks] = useState<UserWithOverdueCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [overdueLoading, setOverdueLoading] = useState(false);

  const fetchUsersNeedingReminders = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/checks/admin/users-needing-reminders');
      setUsersNeedingReminders(response.data || []);
    } catch (error) {
      console.error('Error fetching users needing reminders:', error);
      setUsersNeedingReminders([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsersWithOverdueChecks = useCallback(async (): Promise<void> => {
    try {
      setOverdueLoading(true);
      const response = await axiosInstance.get('/checks/admin/users-with-overdue-checks');
      setUsersWithOverdueChecks(response.data || []);
    } catch (error) {
      console.error('Error fetching users with overdue checks:', error);
      setUsersWithOverdueChecks([]);
      throw error;
    } finally {
      setOverdueLoading(false);
    }
  }, []);

  return (
    <ReminderContext.Provider
      value={{
        usersNeedingReminders,
        usersWithOverdueChecks,
        loading,
        overdueLoading,
        fetchUsersNeedingReminders,
        fetchUsersWithOverdueChecks,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminderContext = () => {
  const ctx = useContext(ReminderContext);
  if (!ctx) throw new Error('useReminderContext must be used within ReminderProvider');
  return ctx;
};
