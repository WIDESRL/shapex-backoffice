import React, { useState } from 'react';
import { Box, Typography, Chip, Paper, CircularProgress, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../../../Context/ClientContext';
import { getContrastColor } from '../../../../utils/colorUtils';
import UserSubscriptionsDisplay from '../../../../components/UserSubscriptionsDisplay';
import SubscriptionDetailDialog from '../../../../components/SubscriptionDetailDialog';
import { useParams } from 'react-router-dom';

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
  const { clientId } = useParams<{ clientId: string }>();

  // Dialog state for subscription details
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);

  // Handle subscription click
  const handleSubscriptionClick = (subscriptionId: number) => {
    setSelectedSubscriptionId(subscriptionId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSubscriptionId(null);
  };

  // Format date helper function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
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

  return (
    <Box sx={styles.container}>
      {/* Active Subscription Section */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {t('client.altro.abbonamento.activeSubscription')}
      </Typography>

      {clientAnagrafica?.activeSubscription?.id ? (
        <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
          <Box sx={styles.infoRow}>
            <Typography sx={styles.label}>{t('client.altro.abbonamento.fields.startDate')}</Typography>
            <Typography sx={styles.value}>{formatDate(clientAnagrafica.activeSubscription.startDate)}</Typography>
          </Box>

          <Box sx={styles.infoRow}>
            <Typography sx={styles.label}>{t('client.altro.abbonamento.fields.endDate')}</Typography>
            <Typography sx={styles.value}>{formatDate(clientAnagrafica.activeSubscription.endDate)}</Typography>
          </Box>

          <Box sx={styles.infoRow}>
            <Typography sx={styles.label}>{t('client.altro.abbonamento.fields.status')}</Typography>
            <Typography sx={styles.value}>{clientAnagrafica.activeSubscription.status}</Typography>
          </Box>

          <Box sx={styles.infoRow}>
            <Typography sx={styles.label}>{t('client.altro.abbonamento.fields.plan')}</Typography>
            <Chip 
              label={clientAnagrafica.activeSubscription.title}
              onClick={() => clientAnagrafica?.activeSubscription?.id && handleSubscriptionClick(clientAnagrafica?.activeSubscription?.id)}
              sx={{
                backgroundColor: clientAnagrafica.activeSubscription.color,
                color: getContrastColor(clientAnagrafica.activeSubscription.color || '#ffffff'),
                fontWeight: 500,
                fontSize: 12,
                height: 24,
                borderRadius: 3,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: clientAnagrafica.activeSubscription.color,
                  color: getContrastColor(clientAnagrafica.activeSubscription.color || '#ffffff'),
                },
                '&:focus': {
                  backgroundColor: clientAnagrafica.activeSubscription.color,
                  color: getContrastColor(clientAnagrafica.activeSubscription.color || '#ffffff'),
                },
              }}
            />
          </Box>
        </Paper>
      ) : (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 4, 
            mb: 4, 
            backgroundColor: '#fff3cd', 
            borderRadius: 2,
            border: '1px solid #ffeaa7',
            textAlign: 'center'
          }}
        >
          <Typography variant="body1" sx={{ color: '#856404', fontWeight: 500, mb: 1 }}>
            {t('client.altro.abbonamento.noActiveSubscription.title')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#856404' }}>
            {t('client.altro.abbonamento.noActiveSubscription.description')}
          </Typography>
        </Paper>
      )}

      <Divider sx={{ my: 3 }} />

      {/* All Subscriptions History */}
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        {t('client.altro.abbonamento.subscriptionHistory')}
      </Typography>
      
      {clientId ? (
        <UserSubscriptionsDisplay userId={clientId} />
      ) : (
        <EmptyState />
      )}

      {/* Subscription Detail Dialog */}
      <SubscriptionDetailDialog
        open={dialogOpen}
        subscriptionId={selectedSubscriptionId}
        onClose={handleDialogClose}
      />
    </Box>
  );
};

export default AbbonamentoTab;
