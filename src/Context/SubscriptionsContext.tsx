import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../utils/axiosInstance'; // Reuse the axios instance

// Define the structure of a subscription
interface Subscription {
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
    supplementPlan: boolean;
    workoutPlan: boolean;
    vip: boolean;
    createdAt: string;
    updatedAt: string;
  }

// Define the context type
interface SubscriptionsContextType {
  subscriptions: Subscription[];
  isLoading: boolean;
  fetchSubscriptions: () => void;
  addSubscription: (subscription: Omit<Subscription, 'id'>) => Promise<void>;
  removeSubscription: (id: string) => Promise<void>;
}

// Create the context
const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

// Create the provider
export const SubscriptionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // Fetch subscriptions using React Query
  const {data, isLoading, refetch } = useQuery<Subscription[], Error>({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      return api.get('/subscriptions'); // Replace with your API endpoint
    },
  });

  useEffect(() => {
    if (data) setSubscriptions(data);
  }, [data]);

  // Mutation to add a subscription
  const addSubscriptionMutation = useMutation<Subscription, Error, Omit<Subscription, 'id'>>({
    mutationFn: async (newSubscription: Omit<Subscription, 'id'>) => {
      return api.post('/subscriptions', newSubscription); // Replace with your API endpoint
    },
    onSuccess: (data) => {
      setSubscriptions((prev) => [...prev, data]);
    },
    onError: (error) => {
      console.error('Failed to add subscription:', error);
    },
  });

  // Mutation to remove a subscription
  const removeSubscriptionMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await api.post(`/subscriptions/${id}/delete`); // Replace with your API endpoint
    },
    onSuccess: (_, id) => {
      setSubscriptions((prev) => prev.filter((sub) => String(sub.id) !== id));
    },
    onError: (error) => {
      console.error('Failed to remove subscription:', error);
    },
  });

  const fetchSubscriptions = () => {
    refetch();
  };

  const addSubscription = async (subscription: Omit<Subscription, 'id'>) => {
    await addSubscriptionMutation.mutateAsync(subscription);
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