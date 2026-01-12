import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from './AuthContext';

// Type for profile picture file
export type ProfilePictureFile = {
  id: number;
  fileName: string;
  type: string;
  signedUrl: string;
  signedUrlExpire: string;
};

// Type for user in notification
export type NotificationUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: number | null;
  profilePictureFile?: ProfilePictureFile | null;
};

// Type for related data
export type NotificationRelatedData = {
  trainingProgram?: {
    id: number;
    title: string;
  };
  assignment?: {
    id: number;
    assignedAt: string;
    completed: boolean;
    completedAt: string | null;
  };
  exercise?: {
    id: number;
    title: string;
  };
  workoutExercise?: {
    id: number;
    dayTitle: string;
  };
  check?: {
    id: number;
  };
  subscription: {
    id: number;
    title: string;
  }
};

// Type for notification metadata
export type NotificationMetadata = {
  assignmentId?: number;
  trainingProgramId?: number;
  exerciseId?: number;
  workoutExerciseId?: number;
  checkId?: number;
  subscriptionId?: number;
  name?: string;
};

// Type for system notification
export type SystemNotification = {
  id: number;
  userId: number;
  type: 'training_completed' | 'check_created' | 'check_updated' | 'exercise_completed' | 'program_assigned' | 'user_completed_profile' | 'user_purchased_subscription' | 'user_booked_extra_call' | 'user_booked_supplementary_call' | 'subscription_renewed' | 'subscription_tier_changed' | 'subscription_cancelled' | 'subscription_expired' | 'subscription_refunded' | 'subscription_payment_issue';
  seen: boolean;
  metadata: NotificationMetadata;
  createdAt: string;
  updatedAt: string;
  user: NotificationUser;
  relatedData: NotificationRelatedData;
};

// Type for API response
export type SystemNotificationsResponse = {
  notifications: SystemNotification[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Type for unread count response
export type UnreadCountResponse = {
  unreadCount: number;
};

// Type for filters
export type SystemNotificationFilters = {
  seen?: boolean;
  type?: 'training_completed' | 'check_created' | 'check_updated' | 'exercise_completed' | 'program_assigned' | 'user_completed_profile' | 'user_purchased_subscription' | 'user_booked_extra_call' | 'user_booked_supplementary_call' | 'subscription_renewed' | 'subscription_tier_changed' | 'subscription_cancelled' | 'subscription_expired' | 'subscription_refunded' | 'subscription_payment_issue';
  userId?: number;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

// Type for filter state
export type SystemNotificationFilterState = {
  filterType: string;
  filterStatus: string;
  filterUserId: number | null;
  dateRange: { startDate: Date | null; endDate: Date | null };
  showFilters: boolean;
};

export type SystemNotificationsContextType = {
  notifications: SystemNotification[];
  unreadCount: number;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  loadingUnreadCount: boolean;
  loadingStatusUpdate: boolean;
  filterState: SystemNotificationFilterState;
  fetchSystemNotifications: (filters?: SystemNotificationFilters, append?: boolean) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  updateNotificationStatus: (notificationId: number, seen: boolean) => Promise<void>;
  setPage: (page: number) => void;
  clearNotifications: () => void;
  updateFilterState: (newState: Partial<SystemNotificationFilterState>) => void;
  resetFilters: () => void;
};

const SystemNotificationsContext = createContext<SystemNotificationsContextType | undefined>(undefined);

export const SystemNotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(50); // Hardcoded as requested
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUnreadCount, setLoadingUnreadCount] = useState<boolean>(false);
  const [loadingStatusUpdate, setLoadingStatusUpdate] = useState<boolean>(false);
  
  // Filter state
  const [filterState, setFilterState] = useState<SystemNotificationFilterState>({
    filterType: 'all',
    filterStatus: 'all',
    filterUserId: null,
    dateRange: { startDate: null, endDate: null },
    showFilters: false,
  });
  
  const { socketInstance, isAuth } = useAuth();

  // Fetch specific notification by ID and prepend to list
  const fetchAndPrependNotification = useCallback(async (notificationId: number) => {
    try {
      const response = await axiosInstance.get<SystemNotificationsResponse>(`/system-notifications?notificationIds=${notificationId}`);
      const data = response.data;
      
      if (data.notifications && data.notifications.length > 0) {
        const newNotification = data.notifications[0];
        setNotifications(prev => {
          // Check if notification already exists to avoid duplicates
          const exists = prev.find(n => n.id === newNotification.id);
          if (exists) {
            return prev;
          }
          return [newNotification, ...prev];
        });
        setTotalCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching specific notification:', error);
    }
  }, []);

  // Socket event listener for unread count changes and new notifications
  useEffect(() => {
    if (socketInstance) {
      socketInstance.on('unread_notification_count_changed', (payload: { unreadCount: number }) => {
        setUnreadCount(payload.unreadCount);
      });

      socketInstance.on('new_notification_created', (payload: { notificationId: number }) => {
        console.log('New notification created:', payload);
        if(payload.notificationId) fetchAndPrependNotification(payload.notificationId);
      });
    }

    return () => {
      if (socketInstance) {
        socketInstance.off('unread_notification_count_changed');
        socketInstance.off('new_notification_created');
      }
    };
  }, [socketInstance, fetchAndPrependNotification]);

  // Fetch system notifications with filters
  const fetchSystemNotifications = useCallback(
    async (filters?: SystemNotificationFilters, append: boolean = false) => {
      try {
        setLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        if (filters?.seen !== undefined) params.append('seen', filters.seen.toString());
        if (filters?.type) params.append('type', filters.type);
        if (filters?.userId) params.append('userId', filters.userId.toString());
        params.append('page', (filters?.page ?? page).toString());
        params.append('limit', (filters?.limit ?? limit).toString());
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);

        const queryString = params.toString();
        const url = `/system-notifications${queryString ? `?${queryString}` : ''}`;

        const response = await axiosInstance.get<SystemNotificationsResponse>(url);
        const data = response.data;

        if (append) {
          setNotifications(prev => [...prev, ...data.notifications]);
        } else {
          setNotifications(data.notifications);
        }

        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        
        // Update page if it was passed in filters
        if (filters?.page !== undefined) {
          setPage(filters.page);
        }
      } catch (error) {
        console.error('Error fetching system notifications:', error);
        if (!append) {
          setNotifications([]);
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [page, limit]
  );

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
        if(!isAuth) return;
        setLoadingUnreadCount(true);
        const response = await axiosInstance.get<UnreadCountResponse>('/system-notifications/unread-count');
        setUnreadCount(response.data.unreadCount);
    } catch (error) {
        console.error('Error fetching unread count:', error);
        setUnreadCount(0);
        throw error;
    } finally {
      setLoadingUnreadCount(false);
    }
  }, [isAuth]);

  // Update notification status (seen/unseen)
  const updateNotificationStatus = useCallback(async (notificationId: number, seen: boolean) => {
    try {
      setLoadingStatusUpdate(true);
      
      await axiosInstance.put(`/system-notifications/${notificationId}/status`, { seen });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, seen }
            : notification
        )
      );
      
    } catch (error) {
      console.error('Error updating notification status:', error);
      throw error;
    } finally {
      setLoadingStatusUpdate(false);
    }
  }, []);

  // Update filter state
  const updateFilterState = useCallback((newState: Partial<SystemNotificationFilterState>) => {
    setFilterState(prev => ({ ...prev, ...newState }));
  }, []);

  // Reset filters to default values
  const resetFilters = useCallback(() => {
    setFilterState({
      filterType: 'all',
      filterStatus: 'all',
      filterUserId: null,
      dateRange: { startDate: null, endDate: null },
      showFilters: false,
    });
    setPage(1);
  }, []);

  // Clear all notifications (useful for logout or reset)
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    setTotalCount(0);
    setPage(1);
    setTotalPages(0);
  }, []);

  // Load unread count on context initialization
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return (
    <SystemNotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        totalCount,
        page,
        limit,
        totalPages,
        loading,
        loadingUnreadCount,
        loadingStatusUpdate,
        filterState,
        fetchSystemNotifications,
        fetchUnreadCount,
        updateNotificationStatus,
        setPage,
        clearNotifications,
        updateFilterState,
        resetFilters,
      }}
    >
      {children}
    </SystemNotificationsContext.Provider>
  );
};

export const useSystemNotificationsContext = () => {
  const ctx = useContext(SystemNotificationsContext);
  if (!ctx) {
    throw new Error('useSystemNotificationsContext must be used within SystemNotificationsProvider');
  }
  return ctx;
};
