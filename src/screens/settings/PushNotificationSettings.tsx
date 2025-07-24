import React, { useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  AlertTitle,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { usePushNotifications } from '../../Context/PushNotificationContext';

interface PushNotificationSettingsProps {
  styles: Record<string, Record<string, unknown>>;
}

const PushNotificationSettings: React.FC<PushNotificationSettingsProps> = ({ styles }) => {
  const { t } = useTranslation();
  const { configs, isLoading, updateConfig, fetchConfigs } = usePushNotifications();

  // Debounced fetch function with 500ms delay
  const debouncedFetchConfigs = useCallback(() => {
    const timeoutId = setTimeout(() => {
      fetchConfigs();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [fetchConfigs]);

  useEffect(() => {
    const cleanup = debouncedFetchConfigs();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  const handleNotificationChange = async (configName: string) => {
    const config = configs.find(c => c.name === configName);
    if (config) {
      try {
        await updateConfig(config.id, !config.enabled);
      } catch (error) {
        console.error('Failed to update notification config:', error);
      }
    }
  };

  const notificationItems = [
    {
      key: 'USER_MESSAGES' as const,
      titleKey: 'settings.pushNotifications.userMessages.title',
      descriptionKey: 'settings.pushNotifications.userMessages.description',
    },
    {
      key: 'USER_COMPLETED_CHECK' as const,
      titleKey: 'settings.pushNotifications.userCompletedCheck.title',
      descriptionKey: 'settings.pushNotifications.userCompletedCheck.description',
    },
    {
      key: 'USER_UPDATED_CHECK' as const,
      titleKey: 'settings.pushNotifications.userUpdatedCheck.title',
      descriptionKey: 'settings.pushNotifications.userUpdatedCheck.description',
    },
    {
      key: 'USER_COMPLETED_EXERCISE' as const,
      titleKey: 'settings.pushNotifications.userCompletedExercise.title',
      descriptionKey: 'settings.pushNotifications.userCompletedExercise.description',
    },
    {
      key: 'USER_COMPLETED_TRAINING_PROGRAM' as const,
      titleKey: 'settings.pushNotifications.userCompletedTrainingProgram.title',
      descriptionKey: 'settings.pushNotifications.userCompletedTrainingProgram.description',
    },
    {
      key: 'USER_COMPLETED_PROFILE' as const,
      titleKey: 'settings.pushNotifications.userCompletedProfile.title',
      descriptionKey: 'settings.pushNotifications.userCompletedProfile.description',
    },
    {
      key: 'USER_PURCHASED_SUBSCRIPTION' as const,
      titleKey: 'settings.pushNotifications.userPurchasedSubscription.title',
      descriptionKey: 'settings.pushNotifications.userPurchasedSubscription.description',
    },
  ];

  return (
    <Paper sx={styles.sectionPaper}>
      <Typography sx={styles.sectionTitle}>
        {t('settings.pushNotifications.title')}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {/* Information Alert */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <AlertTitle>{t('settings.pushNotifications.infoAlert.title')}</AlertTitle>
        {t('settings.pushNotifications.infoAlert.description')}
      </Alert>

      {/* Description */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ mb: 2, color: '#666', lineHeight: 1.6 }}>
          {t('settings.pushNotifications.description.paragraph1')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
          {t('settings.pushNotifications.description.paragraph2')}
        </Typography>
      </Box>

      {/* Notification Settings */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#E6BB4A' }} />
        </Box>
      ) : (
        <Box sx={styles.configContainer}>
          {notificationItems.map((item) => {
            const config = configs.find(c => c.name === item.key);
            const isEnabled = config ? config.enabled : false;
            
            return (
              <Box key={item.key} sx={styles.configItem}>
                <Box sx={styles.configInfo}>
                  <Typography variant="h6" sx={styles.configTitle}>
                    {t(item.titleKey)}
                  </Typography>
                  <Typography variant="body2" sx={styles.configDescription}>
                    {t(item.descriptionKey)}
                  </Typography>
                </Box>
                <Box sx={styles.configActions}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isEnabled}
                        onChange={() => handleNotificationChange(item.key)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#E6BB4A',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#E6BB4A',
                          },
                        }}
                      />
                    }
                    label=""
                    sx={{ m: 0 }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default PushNotificationSettings;
