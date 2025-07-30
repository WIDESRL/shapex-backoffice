import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from './AuthContext';

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

export type NotificationCounts = {
  totalCount: number;
  reminderCount: number;
  overdueCount: number;
};

export type ReminderContextType = {
  usersNeedingReminders: UserNeedingReminder[];
  usersWithOverdueChecks: UserWithOverdueCheck[];
  notificationCounts: NotificationCounts;
  loading: boolean;
  overdueLoading: boolean;
  fetchUsersNeedingReminders: () => Promise<void>;
  fetchUsersWithOverdueChecks: () => Promise<void>;
  fetchAllData: () => Promise<void>;
};

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersNeedingReminders, setUsersNeedingReminders] = useState<UserNeedingReminder[]>([]);
  const [usersWithOverdueChecks, setUsersWithOverdueChecks] = useState<UserWithOverdueCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [overdueLoading, setOverdueLoading] = useState(false);
  const { isAuth } = useAuth();

  const notificationCounts: NotificationCounts = useMemo(() => {
    const usersNeedingRemindersLength = usersNeedingReminders.length
    const usersWithOverdueChecksLength = usersWithOverdueChecks.length
    return {
        totalCount: usersNeedingRemindersLength + usersWithOverdueChecksLength,
        reminderCount: usersNeedingRemindersLength,
        overdueCount: usersWithOverdueChecksLength,
    }
  }, [usersNeedingReminders, usersWithOverdueChecks])

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

  const fetchAllData = useCallback(async (): Promise<void> => {
    try {
      await Promise.all([
        fetchUsersNeedingReminders(),
        fetchUsersWithOverdueChecks()
      ]);
    } catch (error) {
      console.error('Error fetching reminder data on initialization:', error);
    }
  }, [fetchUsersNeedingReminders, fetchUsersWithOverdueChecks]);

  useEffect(() => {
    if(isAuth) fetchAllData();
  }, [fetchAllData, isAuth]);


  return (
    <ReminderContext.Provider
      value={{
        usersNeedingReminders,
        usersWithOverdueChecks,
        notificationCounts,
        loading,
        overdueLoading,
        fetchUsersNeedingReminders,
        fetchUsersWithOverdueChecks,
        fetchAllData,
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
