import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../utils/axiosInstance';
import { useAuth } from './AuthContext';

export interface NotificationConfig {
    id: number;
    name: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}

interface PushNotificationContextType {
    configs: NotificationConfig[];
    isLoading: boolean;
    fetchConfigs: () => void;
    updateConfig: (id: number, enabled: boolean) => Promise<void>;
    getConfigByName: (name: string) => NotificationConfig | undefined;
    isConfigEnabled: (name: string) => boolean;
}

const PushNotificationContext = createContext<PushNotificationContextType | undefined>(undefined);

export const PushNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [configs, setConfigs] = useState<NotificationConfig[]>([]);
    const { isAuth } = useAuth();

    // Fetch notification configs
    const { data, isLoading, refetch } = useQuery<NotificationConfig[], Error>({
        queryKey: ['admin-notification-config'],
        queryFn: async () => {
            return api.get('/admin-notification-config');
        },
        enabled: isAuth,
    });

    useEffect(() => {
        if (data) setConfigs(data);
    }, [data]);

    // Update notification config
    const updateConfigMutation = useMutation<NotificationConfig, Error, { id: number, enabled: boolean }>({
        mutationFn: async ({ id, enabled }) => {
            return api.put(`/admin-notification-config/${id}`, { enabled });
        },
        onSuccess: (updatedConfig) => {
            // Update local state without triggering a refetch
            setConfigs(prev => prev.map(c => c.id === updatedConfig.id ? updatedConfig : c));
        },
        onError: (error) => {
            console.error('Failed to update notification config:', error);
        },
    });

    const fetchConfigs = useCallback(() => {
        refetch();
    }, [refetch]);

    const updateConfig = async (id: number, enabled: boolean): Promise<void> => {
        // Don't refetch after mutation - onSuccess will update local state
        await updateConfigMutation.mutateAsync({ id, enabled });
    };

    const getConfigByName = (name: string): NotificationConfig | undefined => {
        return configs.find(config => config.name === name);
    };

    const isConfigEnabled = (name: string): boolean => {
        const config = getConfigByName(name);
        return config ? config.enabled : false;
    };

    return (
        <PushNotificationContext.Provider value={{ 
            configs, 
            isLoading, 
            fetchConfigs, 
            updateConfig, 
            getConfigByName, 
            isConfigEnabled 
        }}>
            {children}
        </PushNotificationContext.Provider>
    );
};

export const usePushNotifications = (): PushNotificationContextType => {
    const context = useContext(PushNotificationContext);

    if (!context) {
        throw new Error('usePushNotifications must be used within a PushNotificationProvider');
    }
    return context;
};
