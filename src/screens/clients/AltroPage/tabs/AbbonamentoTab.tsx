import React from 'react';
import { Box, Typography, Chip, Paper, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../../../Context/ClientContext';
import { getContrastColor } from '../../../../utils/colorUtils';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    p: 2,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    minWidth: 120,
    fontWeight: 400,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: 500,
  },
  premiumChip: {
    backgroundColor: '#E6BB4A',
    color: '#fff',
    fontWeight: 500,
    fontSize: 12,
    height: 24,
    borderRadius: 3,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    textAlign: 'center',
    px: 4,
  },
  emptyStateCard: {
    p: 6,
    borderRadius: 3,
    border: '2px dashed #e0e0e0',
    backgroundColor: '#fafafa',
    maxWidth: 400,
    width: '100%',
  },
  emptyStateIcon: {
    fontSize: 64,
    color: '#bdbdbd',
    mb: 3,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#424242',
    mb: 2,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#757575',
    lineHeight: 1.6,
    mb: 3,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9e9e9e',
    fontStyle: 'italic',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    flexDirection: 'column',
    gap: 2,
  },
  loadingText: {
    color: '#757575',
    fontSize: 16,
  },
};

const AbbonamentoTab: React.FC = () => {
  const { t } = useTranslation();
  const { clientAnagrafica, loadingClientAnagrafica } = useClientContext();

  // Format date helper function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Empty state component
  const EmptyState = () => (
    <Box sx={styles.emptyState}>
      <Paper sx={styles.emptyStateCard} elevation={0}>
        <Box sx={styles.emptyStateIcon}>
          📋
        </Box>
        <Typography sx={styles.emptyStateTitle}>
          {t('client.altro.abbonamento.emptyState.title')}
        </Typography>
        <Typography sx={styles.emptyStateDescription}>
          {t('client.altro.abbonamento.emptyState.description')}
        </Typography>
        <Typography sx={styles.emptyStateSubtext}>
          {t('client.altro.abbonamento.emptyState.subtitle')}
        </Typography>
      </Paper>
    </Box>
  );

  // Loading component
  const LoadingState = () => (
    <Box sx={styles.loadingContainer}>
      <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
      <Typography sx={styles.loadingText}>
        {t('client.altro.abbonamento.loading')}
      </Typography>
    </Box>
  );

  // Check loading state first
  if (loadingClientAnagrafica) {
    return <LoadingState />;
  }

  // Check if we should show empty state (no client data or no subscription)
  if (!clientAnagrafica || !clientAnagrafica.activeSubscription) {
    return <EmptyState />;
  }

  const { activeSubscription } = clientAnagrafica;

  // Create subscription data structure using real context data
  const subscriptionData = {
    startDate: formatDate(activeSubscription.startDate),
    endDate: formatDate(activeSubscription.endDate),
    title: activeSubscription.title,
    color: activeSubscription.color,
    status: activeSubscription.status,
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.infoRow}>
        <Typography sx={styles.label}>{t('client.altro.abbonamento.fields.startDate')}</Typography>
        <Typography sx={styles.value}>{subscriptionData.startDate}</Typography>
      </Box>

      <Box sx={styles.infoRow}>
        <Typography sx={styles.label}>{t('client.altro.abbonamento.fields.endDate')}</Typography>
        <Typography sx={styles.value}>{subscriptionData.endDate}</Typography>
      </Box>

      <Box sx={styles.infoRow}>
        <Typography sx={styles.label}>{t('client.altro.abbonamento.fields.status')}</Typography>
        <Typography sx={styles.value}>{subscriptionData.status}</Typography>
      </Box>

      <Box sx={styles.infoRow}>
        <Typography sx={styles.label}>{t('client.altro.abbonamento.fields.plan')}</Typography>
        <Chip 
          label={subscriptionData.title}
          sx={{
            backgroundColor: subscriptionData.color,
            color: getContrastColor(subscriptionData.color || '#ffffff'),
            fontWeight: 500,
            fontSize: 12,
            height: 24,
            borderRadius: 3,
          }}
        />
      </Box>
    </Box>
  );
};

export default AbbonamentoTab;
