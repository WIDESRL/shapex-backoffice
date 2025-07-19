import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../utils/axiosInstance'; // Reuse the axios instance
import { omit } from 'lodash';
import { useSnackbar } from './SnackbarContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

// Define the structure of a subscription
export interface Subscription {
    id: number;
    title: string;
    description: string;
    color: string;
    duration: number;
    monthlyChecks: number;
    order: number;
    chat: boolean;
    freeIntroductoryCall: boolean;
    mealPlan: boolean;
    integrationPlan: boolean;
    trainingCard: boolean;
    vip: boolean;
    price: number
  }

// Define the context type
interface SubscriptionsContextType {
  subscriptions: Subscription[];
  isLoading: boolean;
  fetchSubscriptions: () => void;
  addSubscription: (subscription: Omit<Subscription, 'id'>) => Promise<void>;
  updateSubscription: (subscription: Subscription) => Promise<void>; // Added updateSubscription
  removeSubscription: (id: string) => Promise<void>;
}

// Create the context
const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

// Create the provider
export const SubscriptionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { isAuth } = useAuth();

  // Fetch subscriptions using React Query
  const {data, isLoading, refetch } = useQuery<Subscription[], Error>({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      return api.get('/subscriptions');
    },
    enabled: isAuth, // Only fetch subscriptions if user is authenticated
  });

  useEffect(() => {
    if (data) setSubscriptions(data);
  }, [data]);

  // Mutation to add a subscription
  const addSubscriptionMutation = useMutation<Subscription, Error, Omit<Subscription, 'id'>>({
    mutationFn: async (newSubscription: Omit<Subscription, 'id'>) => {
      return api.post('/subscriptions', newSubscription); 
    },
    onSuccess: (data) => {
      setSubscriptions((prev) => [...prev, data]);
    },
    onError: (error) => {
      console.error('Failed to add subscription:', error);
      showSnackbar(t('subscriptions.errors.addFailed'), 'error');
    },
  });

  // Mutation to update a subscription
  const updateSubscriptionMutation = useMutation<Subscription, Error, Subscription>({
    mutationFn: async (updatedSubscription: Subscription) => {
      const payload = omit(updatedSubscription, ['id', 'createdAt', 'updatedAt']);
      return api.put(`/subscriptions/${updatedSubscription.id}`, payload); 
    },
    onSuccess: (data) => {
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.id === data.id ? data : sub)) 
      );
    },
    onError: (error) => {
      console.error('Failed to update subscription:', error);
      showSnackbar(t('subscriptions.errors.updateFailed'), 'error');
    },
  });

  // Mutation to remove a subscription
  const removeSubscriptionMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await api.delete(`/subscriptions/${id}`);
    },
    onSuccess: (_, id) => {
      setSubscriptions((prev) => prev.filter((sub) => String(sub.id) !== id));
    },
    onError: (error) => {
      console.error('Failed to remove subscription:', error);
      showSnackbar(t('subscriptions.errors.deleteFailed'), 'error');
    },
  });

  const fetchSubscriptions = () => {
    refetch();
  };

  const addSubscription = async (subscription: Omit<Subscription, 'id'>) => {
    await addSubscriptionMutation.mutateAsync(subscription);
  };

  const updateSubscription = async (subscription: Subscription) => {
    await updateSubscriptionMutation.mutateAsync(subscription);
  };

  const removeSubscription = async (id: string) => {
    await removeSubscriptionMutation.mutateAsync(id);
  };

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,
        isLoading,
        fetchSubscriptions,
        addSubscription,
        updateSubscription, 
        removeSubscription,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
};

// Create a custom hook to use the SubscriptionsContext
export const useSubscriptions = (): SubscriptionsContextType => {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionsProvider');
  }
  return context;
};