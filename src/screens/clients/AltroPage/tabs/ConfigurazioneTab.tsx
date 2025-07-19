import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { api } from '../../../../utils/axiosInstance';

interface UserConfig {
  pushNotification: boolean;
  emailNotification: boolean;
}

const styles = {
  container: {
    p: 1,
  },
  title: {
    fontWeight: 500,
    fontSize: 24,
    color: '#333',
    mb: 3,
  },
  configItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    py: 2,
    px: 3,
    mb: 2,
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    maxWidth: '500px',
    width: '100%',
  },
  configLabel: {
    fontWeight: 400,
    fontSize: 16,
    color: '#333',
  },
  configValue: {
    fontWeight: 500,
    fontSize: 16,
  },
  enabledValue: {
    color: '#4caf50',
  },
  disabledValue: {
    color: '#f44336',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  noConfigContainer: {
    textAlign: 'center',
    py: 4,
  },
  noConfigText: {
    color: '#666',
    fontSize: 16,
  },
};

const ConfigurazioneTab: React.FC = () => {
  const { t } = useTranslation();
  const { clientId } = useParams<{ clientId: string }>();
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUserConfig = async () => {
      if (!clientId) return;
      
      setLoading(true);
      setError(false);
      
      try {
        const response = await api.get(`/users/config/${clientId}`);
        setUserConfig(response);
      } catch (err) {
        console.error('Error fetching user config:', err);
        setError(true);
        setUserConfig(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserConfig();
  }, [clientId]);

  const getStatusText = (enabled: boolean) => {
    return enabled ? t('client.altro.config.enabled') : t('client.altro.config.disabled');
  };

  const getStatusStyle = (enabled: boolean) => {
    return enabled ? styles.enabledValue : styles.disabledValue;
  };

  if (loading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !userConfig) {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.configItem}>
          <Typography sx={styles.configLabel}>
            {t('client.altro.config.pushNotifications')}
          </Typography>
          <Typography sx={{ ...styles.configValue, ...styles.disabledValue }}>
            {t('client.altro.config.disabled')}
          </Typography>
        </Box>

        <Box sx={styles.configItem}>
          <Typography sx={styles.configLabel}>
            {t('client.altro.config.emailNotifications')}
          </Typography>
          <Typography sx={{ ...styles.configValue, ...styles.disabledValue }}>
            {t('client.altro.config.disabled')}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.configItem}>
        <Typography sx={styles.configLabel}>
          {t('client.altro.config.pushNotifications')}
        </Typography>
        <Typography sx={{ ...styles.configValue, ...getStatusStyle(userConfig.pushNotification) }}>
          {getStatusText(userConfig.pushNotification)}
        </Typography>
      </Box>

      <Box sx={styles.configItem}>
        <Typography sx={styles.configLabel}>
          {t('client.altro.config.emailNotifications')}
        </Typography>
        <Typography sx={{ ...styles.configValue, ...getStatusStyle(userConfig.emailNotification) }}>
          {getStatusText(userConfig.emailNotification)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ConfigurazioneTab;
