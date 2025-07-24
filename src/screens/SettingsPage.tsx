import React, { useEffect } from 'react';
import { 
  Box, 
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../Context/AuthContext';
import { useGlobalConfig } from '../Context/GlobalConfigContext';
import ProfileSection from './settings/ProfileSection';
import LanguageSettings from './settings/LanguageSettings';
import GlobalConfigurations from './settings/GlobalConfigurations';
import PushNotificationSettings from './settings/PushNotificationSettings';


  const styles = {
    container: {
      p: 4,
      maxWidth: 800,
      mx: 'auto',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
    },
    pageTitle: {
      fontSize: 38,
      fontWeight: 400,
      color: '#616160',
      fontFamily: 'Montserrat, sans-serif',
      mb: 4,
    },
    sectionPaper: {
      p: 4,
      mb: 3,
      borderRadius: 3,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0',
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 500,
      color: '#333',
      fontFamily: 'Montserrat, sans-serif',
      mb: 1,
    },
    profileSection: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      mb: 4,
    },
    avatarContainer: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      '&:hover': {
        '& .MuiAvatar-root': {
          transform: 'scale(1.05)',
          transition: 'transform 0.2s ease-in-out',
        },
        '& .MuiTypography-caption': {
          color: '#E6BB4A',
        },
      },
    },
    avatar: {
      width: 120,
      height: 120,
      border: '4px solid #E6BB4A',
      fontSize: 48,
      fontWeight: 600,
      color: '#fff',
      backgroundColor: '#E6BB4A',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        borderColor: '#d4a943',
      },
    },
    formFields: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      flex: 1,
    },
    actionButton: {
      backgroundColor: '#E6BB4A',
      color: 'white',
      px: 4,
      py: 1.5,
      borderRadius: 2,
      textTransform: 'none',
      fontSize: 16,
      fontWeight: 500,
      '&:hover': {
        backgroundColor: '#d4a943',
      },
    },
    outlinedButton: {
      borderColor: '#E6BB4A',
      color: '#E6BB4A',
      px: 4,
      py: 1.5,
      borderRadius: 2,
      textTransform: 'none',
      fontSize: 16,
      fontWeight: 500,
      '&:hover': {
        borderColor: '#d4a943',
        backgroundColor: 'rgba(230, 187, 74, 0.04)',
      },
    },
    languageSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    },
    flagEmoji: {
      fontSize: 24,
      mr: 1,
    },
    dialogPaper: {
      borderRadius: 4,
      p: 0,
      background: '#fff',
      boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)',
      width: 480,
      maxWidth: '95vw',
    },
    dialogBackdrop: {
      backgroundColor: 'rgba(33,33,33,0.8)',
      backdropFilter: 'blur(5px)',
    },
    dialogTitle: {
      fontSize: 32,
      fontWeight: 400,
      color: '#616160',
      fontFamily: 'Montserrat, sans-serif',
      textAlign: 'left',
      pb: 0,
      pt: 4,
      pl: 4,
      letterSpacing: 0,
      lineHeight: 1.1,
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      right: 24,
      top: 24,
      background: 'transparent',
      boxShadow: 'none',
      p: 0,
    },
    dialogContent: {
      pt: 4,
      px: 4,
      pb: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    },
    // Global Configuration Styles
    configContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
    },
    configItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 3,
      border: '1px solid #f0f0f0',
      borderRadius: 2,
    },
    configInfo: {
      flex: 1,
    },
    configTitle: {
      fontWeight: 500,
      mb: 1,
    },
    configDescription: {
      color: '#666',
    },
    configActions: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    },
    configValue: {
      fontWeight: 600,
      color: '#E6BB4A',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      py: 4,
    },
    dialogCurrentValue: {
      mb: 2,
    },
    dialogValueLabel: {
      color: '#666',
      mb: 1,
    },
    dialogNewValue: {
      mb: 2,
    },
    dialogActions: {
      p: 4,
      pt: 0,
    },
    cancelButton: {
      mr: 2,
    },
  };

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { getMyUserData } = useAuth();
  const { fetchConfigs } = useGlobalConfig();

  useEffect(() => {
    getMyUserData();
    fetchConfigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - functions are not stable and would cause infinite loops

  return (
    <Box sx={styles.container}>
      {/* Page Title */}
      <Typography sx={styles.pageTitle}>
        {t('settings.title')}
      </Typography>

      {/* Profile Section */}
      <ProfileSection styles={styles} />

      {/* Language Settings Section */}
      <LanguageSettings styles={styles} />

      {/* Global Configurations Section */}
      <GlobalConfigurations styles={styles} />

       {/* Push Notification Settings Section */}
      <PushNotificationSettings styles={styles} />
    </Box>
  );
};

export default SettingsPage;
