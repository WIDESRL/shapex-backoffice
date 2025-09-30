import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useClientContext } from '../../../../Context/ClientContext';
import { UserConsent } from '../../../../Context/ClientContext';
import ConsentCard from '../../../../components/ConsentCard';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    height: '100%',
    minHeight: '500px',
  },
  scrollContainer: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    pr: 1,
    '&::-webkit-scrollbar': {
      width: 2,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f1f1f1',
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c1c1c1',
      borderRadius: 4,
      '&:hover': {
        backgroundColor: '#a8a8a8',
      },
    },
  },
  consentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: 3,
    pb: 2,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    gap: 2,
    minHeight: '300px',
  },
  loadingText: {
    color: '#757575',
    fontSize: 16,
    mt: 2,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
    px: 4,
    py: 4,
    minHeight: '300px',
  },
  emptyStateCard: {
    p: 4,
    borderRadius: 3,
    border: '2px dashed #e0e0e0',
    backgroundColor: '#fafafa',
    maxWidth: 400,
    width: '100%',
    boxShadow: 'none',
  },
  emptyStateIcon: {
    fontSize: 48,
    color: '#bdbdbd',
    mb: 2,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#424242',
    mb: 1.5,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 1.5,
    mb: 2,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#9e9e9e',
    fontStyle: 'italic',
  },

};

const ConsentTab: React.FC = () => {
  const { t } = useTranslation();
  const { clientId } = useParams<{ clientId: string }>();
  const { 
    userConsents, 
    loadingUserConsents, 
    fetchUserConsents 
  } = useClientContext();

  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  // Fetch consents when component mounts
  useEffect(() => {
    if (clientId) {
      setHasInitialFetch(true);
      fetchUserConsents(clientId);
    }
  }, [clientId]);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get consent type label
  const getConsentTypeLabel = (type: UserConsent['type']) => {
    switch (type) {
      case 'marketing':
        return t('client.altro.consents.types.marketing');
      case 'dataProcessing':
        return t('client.altro.consents.types.dataProcessing');
      case 'terms':
        return t('client.altro.consents.types.terms');
      case 'photoTracking':
        return t('client.altro.consents.types.photoTracking');
      default:
        return type;
    }
  };

  // Get consent type color
  const getConsentTypeColor = (type: UserConsent['type']) => {
    switch (type) {
      case 'marketing':
        return '#4caf50'; // Green
      case 'dataProcessing':
        return '#2196f3'; // Blue
      case 'terms':
        return '#ff9800'; // Orange
      case 'photoTracking':
        return '#9c27b0'; // Purple
      default:
        return '#757575'; // Grey
    }
  };

  // Loading component
  const LoadingState = () => (
    <Box sx={styles.loadingContainer}>
      <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
      <Typography sx={styles.loadingText}>
        {t('client.altro.consents.loading')}
      </Typography>
    </Box>
  );

  // Empty state component
  const EmptyState = () => (
    <Box sx={styles.emptyState}>
      <Paper sx={styles.emptyStateCard} elevation={0}>
        <Box sx={styles.emptyStateIcon}>
          🔒
        </Box>
        <Typography sx={styles.emptyStateTitle}>
          {t('client.altro.consents.emptyState.title')}
        </Typography>
        <Typography sx={styles.emptyStateDescription}>
          {t('client.altro.consents.emptyState.description')}
        </Typography>
        <Typography sx={styles.emptyStateSubtext}>
          {t('client.altro.consents.emptyState.subtitle')}
        </Typography>
      </Paper>
    </Box>
  );



  return (
    <Box sx={styles.container}>
      <Box sx={styles.scrollContainer}>
        {(loadingUserConsents && userConsents.length === 0) || !hasInitialFetch ? (
          <LoadingState />
        ) : userConsents.length === 0 ? (
          <EmptyState />
        ) : (
          <Box sx={styles.consentGrid}>
            {userConsents.map((consent) => (
              <ConsentCard 
                key={consent.id} 
                consent={consent}
                typeLabel={getConsentTypeLabel(consent.type)}
                typeColor={getConsentTypeColor(consent.type)}
                dateLabel={formatDate(consent.createdAt)}
                grantedLabel={t('client.altro.consents.granted')}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ConsentTab;