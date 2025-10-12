import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../utils/axiosInstance'; // Reuse the axios instance
import { useSnackbar } from './SnackbarContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

// Define the structure of a subscription
export interface Subscription {
    id: number;
    title: string;
    titleApp?: string;
    description: string;
    color: string;
    duration: number;
    monthlyChecks: number;
    order: number;
    price: number;
    discountPrice?: number;
    recurringMonthlyPayment: boolean;
    visibleInFrontend: boolean;
    chat: boolean;
    freeIntroductoryCall: boolean;
    mealPlan: boolean;
    integrationPlan: boolean;
    trainingCard: boolean;
    vip: boolean;
    supplementaryCalls: boolean;
    numberOfSupplementaryCalls?: number;
    currency?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Define the context type
interface SubscriptionsContextType {
  subscriptions: Subscription[];
  isLoading: boolean;
  fetchSubscriptions: () => void;
  fetchSubscription: (subscriptionId: number) => Promise<Subscription>;
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
      return api.get('/subscriptions/admin');
    },
    enabled: isAuth, // Only fetch subscriptions if user is authenticated
  });

  useEffect(() => {
    if (data) setSubscriptions(data);
  }, [data]);

  // Mutation to add a subscription
  const addSubscriptionMutation = useMutation<Subscription, Error, Omit<Subscription, 'id'>>({
    mutationFn: async (newSubscription: Omit<Subscription, 'id'>) => {
      const payload = {
        title: newSubscription.title || '',
        titleApp: newSubscription.titleApp || null,
        description: newSubscription.description || '',
        color: newSubscription.color || '#FF0000',
        duration: newSubscription.duration || 1,
        monthlyChecks: newSubscription.monthlyChecks || 0,
        order: newSubscription.order || 1,
        price: newSubscription.price || 0,
        discountPrice: newSubscription.discountPrice || null,
        recurringMonthlyPayment: newSubscription.recurringMonthlyPayment || false,
        visibleInFrontend: newSubscription.visibleInFrontend || false,
        chat: newSubscription.chat || false,
        freeIntroductoryCall: newSubscription.freeIntroductoryCall || false,
        mealPlan: newSubscription.mealPlan || false,
        integrationPlan: newSubscription.integrationPlan || false,
        trainingCard: newSubscription.trainingCard || false,
        vip: newSubscription.vip || false,
        supplementaryCalls: newSubscription.supplementaryCalls || false,
        numberOfSupplementaryCalls: newSubscription.numberOfSupplementaryCalls || 0,
        currency: newSubscription.currency || 'eur',
      };
      return api.post('/subscriptions', payload); 
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
      const payload = {
        title: updatedSubscription.title || '',
        titleApp: updatedSubscription.titleApp || null,
        description: updatedSubscription.description || '',
        color: updatedSubscription.color || '#FF0000',
        duration: updatedSubscription.duration || 1,
        monthlyChecks: updatedSubscription.monthlyChecks || 0,
        order: updatedSubscription.order || 1,
        price: updatedSubscription.price || 0,
        discountPrice: updatedSubscription.discountPrice || null,
        recurringMonthlyPayment: updatedSubscription.recurringMonthlyPayment || false,
        visibleInFrontend: updatedSubscription.visibleInFrontend || false,
        chat: updatedSubscription.chat || false,
        freeIntroductoryCall: updatedSubscription.freeIntroductoryCall || false,
        mealPlan: updatedSubscription.mealPlan || false,
        integrationPlan: updatedSubscription.integrationPlan || false,
        trainingCard: updatedSubscription.trainingCard || false,
        vip: updatedSubscription.vip || false,
        supplementaryCalls: updatedSubscription.supplementaryCalls || false,
        numberOfSupplementaryCalls: updatedSubscription.numberOfSupplementaryCalls || 0,
        currency: updatedSubscription.currency || 'eur',
      };
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

  const fetchSubscription = async (subscriptionId: number): Promise<Subscription> => {
    try {
      const response = await api.get(`/subscriptions/${subscriptionId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      throw error;
    }
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
        fetchSubscription,
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