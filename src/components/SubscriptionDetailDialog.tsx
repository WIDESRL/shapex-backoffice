import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Switch,
  Fade,
  Backdrop,
  Divider,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Subscription, useSubscriptions } from '../Context/SubscriptionsContext';
import DialogCloseIcon from '../icons/DialogCloseIcon2';

interface SubscriptionDetailDialogProps {
  open: boolean;
  subscriptionId: number | null;
  onClose: () => void;
}

const styles = {
  dialog: {
    borderRadius: 4,
    boxShadow: 8,
    px: 4,
    py: 2,
    background: '#fff',
    minWidth: 500,
    maxWidth: 600,
    fontSize: 16,
  },
  backdrop: {
    timeout: 300,
    sx: {
      backgroundColor: 'rgba(33,33,33,0.8)',
      backdropFilter: 'blur(5px)',
    },
  },
  closeButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    mt: 1,
    mb: 0,
  },
  closeButton: {
    color: '#888',
    background: 'transparent',
    boxShadow: 'none',
    '&:hover': { background: 'rgba(0,0,0,0.04)' },
    mr: '-8px',
    mt: '-8px',
  },
  dialogTitle: {
    fontSize: 32,
    fontWeight: 400,
    textAlign: 'left',
    pb: 0,
    pt: 0,
    position: 'relative',
    letterSpacing: 0.5,
    fontFamily: 'Montserrat, sans-serif',
    color: '#616160',
  },
  dialogContent: {
    pt: 2,
    pb: 3,
    fontSize: 15,
    '& .MuiTypography-root': {
      fontSize: 15,
    },
    '&::-webkit-scrollbar': {
      width: '6px',
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#e0e0e0',
      borderRadius: '6px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#bdbdbd',
    },
    scrollbarWidth: 'thin',
    scrollbarColor: '#e0e0e0 transparent',
  },
  colorIndicator: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    border: '2px solid #eee',
    display: 'inline-block',
    marginRight: 2,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
    py: 1,
  },
  infoLabel: {
    fontWeight: 600,
    color: '#666',
    minWidth: 150,
  },
  infoValue: {
    color: '#333',
    fontWeight: 500,
  },
  section: {
    mb: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#424242',
    mb: 2,
    borderBottom: '2px solid #E6BB4A',
    paddingBottom: 1,
  },
  toggleContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 2,
    mt: 1,
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    py: 0.5,
  },
  toggleLabel: {
    color: '#666',
    fontWeight: 500,
  },
  switch: {
    width: 48,
    height: 28,
    p: 0,
    '& .MuiSwitch-switchBase': {
      p: 0.5,
      '&.Mui-checked': {
        transform: 'translateX(20px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: '#00C853',
          opacity: 1,
        },
        '&.Mui-disabled': {
          color: '#fff',
          '& + .MuiSwitch-track': {
            backgroundColor: '#00C853',
            opacity: 1,
          },
        },
      },
      '&.Mui-disabled': {
        '& + .MuiSwitch-track': {
          backgroundColor: '#ccc',
          opacity: 1,
        },
        '&.Mui-checked + .MuiSwitch-track': {
          backgroundColor: '#00C853',
          opacity: 1,
        },
      },
    },
    '& .MuiSwitch-thumb': {
      width: 20,
      height: 20,
      boxShadow: 'none',
    },
    '& .MuiSwitch-track': {
      borderRadius: 14,
      backgroundColor: '#ccc',
      opacity: 1,
    },
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 4,
    gap: 2,
  },
  errorContainer: {
    py: 2,
  },
};

const SubscriptionDetailDialog: React.FC<SubscriptionDetailDialogProps> = ({
  open,
  subscriptionId,
  onClose,
}) => {
  const { t } = useTranslation();
  const { fetchSubscription } = useSubscriptions();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSubscription = useCallback(async () => {
    if (!subscriptionId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSubscription(subscriptionId);
      setSubscription(data);
    } catch (err) {
      setError(t('subscriptions.errors.fetchFailed') || 'Failed to load subscription details');
      console.error('Error loading subscription:', err);
    } finally {
      setLoading(false);
    }
  }, [subscriptionId, fetchSubscription, t]);

  useEffect(() => {
    if (open && subscriptionId) {
      loadSubscription();
    }
  }, [open, subscriptionId, loadSubscription]);

  const handleClose = () => {
    setSubscription(null);
    setError(null);
    onClose();
  };

  const formatCurrency = (amount: number, currency = 'EUR') => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: styles.dialog }}
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: styles.backdrop }}
      TransitionComponent={Fade}
    >
      {/* Close icon row above the title */}
      <Box sx={styles.closeButtonContainer}>
        <IconButton
          onClick={handleClose}
          sx={styles.closeButton}
          size="large"
        >
          <DialogCloseIcon style={{ fontSize: 32 }} />
        </IconButton>
      </Box>

      <DialogTitle sx={styles.dialogTitle}>
        {t('subscriptions.subscriptionDetails')}
      </DialogTitle>

      <DialogContent sx={styles.dialogContent}>
        {loading && (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
            <Typography color="text.secondary">
              {t('subscriptions.loadingDetails')}
            </Typography>
          </Box>
        )}

        {error && (
          <Box sx={styles.errorContainer}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {subscription && !loading && (
          <>
            {/* Basic Information */}
            <Box sx={styles.section}>
              <Typography sx={styles.sectionTitle}>
                {t('subscriptions.basicInformation')}
              </Typography>
              
              <Box sx={styles.infoRow}>
                <Typography sx={styles.infoLabel}>{t('subscriptions.title')}:</Typography>
                <Typography sx={styles.infoValue}>{subscription.title}</Typography>
              </Box>

              <Box sx={styles.infoRow}>
                <Typography sx={styles.infoLabel}>{t('subscriptions.titleApp')}:</Typography>
                <Typography sx={styles.infoValue}>{subscription.titleApp || '-'}</Typography>
              </Box>

              <Box sx={styles.infoRow}>
                <Typography sx={styles.infoLabel}>{t('subscriptions.description')}:</Typography>
                <Typography sx={styles.infoValue} style={{ maxWidth: '60%', textAlign: 'right' }}>
                  {subscription.description}
                </Typography>
              </Box>

              <Box sx={styles.infoRow}>
                <Typography sx={styles.infoLabel}>{t('subscriptions.order')}:</Typography>
                <Typography sx={styles.infoValue}>{subscription.order}</Typography>
              </Box>

              <Box sx={styles.infoRow}>
                <Typography sx={styles.infoLabel}>{t('subscriptions.color')}:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ ...styles.colorIndicator, backgroundColor: subscription.color }} />
                </Box>
              </Box>

              <Box sx={styles.infoRow}>
                <Typography sx={styles.infoLabel}>{t('subscriptions.duration')}:</Typography>
                <Typography sx={styles.infoValue}>
                  {subscription.duration} {t('subscriptions.days')}
                </Typography>
              </Box>

              <Box sx={styles.infoRow}>
                <Typography sx={styles.infoLabel}>{t('subscriptions.monthlyChecks')}:</Typography>
                <Typography sx={styles.infoValue}>{subscription.monthlyChecks}</Typography>
              </Box>

              <Box sx={styles.infoRow}>
                <Typography sx={styles.infoLabel}>{t('subscriptions.price')}:</Typography>
                <Typography sx={styles.infoValue}>
                  {formatCurrency(subscription.price, subscription.currency)}
                </Typography>
              </Box>

              {subscription.discountPrice && subscription.discountPrice > 0 && (
                <Box sx={styles.infoRow}>
                  <Typography sx={styles.infoLabel}>{t('subscriptions.discountPrice')}:</Typography>
                  <Typography sx={styles.infoValue}>
                    {formatCurrency(subscription.discountPrice, subscription.currency)}
                  </Typography>
                </Box>
              )}

              <Box sx={styles.infoRow}>
                <Typography sx={styles.infoLabel}>{t('subscriptions.currency')}:</Typography>
                <Typography sx={styles.infoValue}>
                  {subscription.currency?.toUpperCase() || 'EUR'}
                </Typography>
              </Box>

              <Box sx={styles.infoRow}>
                <Typography sx={styles.infoLabel}>{t('subscriptions.numberOfSupplementaryCalls')}:</Typography>
                <Typography sx={styles.infoValue}>{subscription.numberOfSupplementaryCalls || 0}</Typography>
              </Box>

              {subscription.appleSubscriptionIdentifier && (
                <Box sx={styles.infoRow}>
                  <Typography sx={styles.infoLabel}>{t('subscriptions.appleSubscriptionIdentifier') || 'Apple Subscription ID'}:</Typography>
                  <Typography sx={styles.infoValue} style={{ maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>
                    {subscription.appleSubscriptionIdentifier}
                  </Typography>
                </Box>
              )}

              {subscription.androidSubscriptionIdentifier && (
                <Box sx={styles.infoRow}>
                  <Typography sx={styles.infoLabel}>{t('subscriptions.androidSubscriptionIdentifier') || 'Android Subscription ID'}:</Typography>
                  <Typography sx={styles.infoValue} style={{ maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>
                    {subscription.androidSubscriptionIdentifier}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Features */}
            <Box sx={styles.section}>
              <Typography sx={styles.sectionTitle}>
                {t('subscriptions.features')}
              </Typography>
              
              <Box sx={styles.toggleContainer}>
                {[
                  { label: t('subscriptions.visibleInFrontend'), checked: subscription.visibleInFrontend },
                  { label: t('subscriptions.monthlyRecurring'), checked: subscription.recurringMonthlyPayment },
                  { label: t('subscriptions.chat'), checked: subscription.chat },
                  { label: t('subscriptions.vip'), checked: subscription.vip },
                  { label: t('subscriptions.trainingCard'), checked: subscription.trainingCard },
                  { label: t('subscriptions.integrationPlan'), checked: subscription.integrationPlan },
                  { label: t('subscriptions.mealPlan'), checked: subscription.mealPlan },
                  { label: t('subscriptions.freeIntroCall'), checked: subscription.freeIntroductoryCall },
                  { label: t('subscriptions.supplementaryCalls'), checked: subscription.supplementaryCalls },
                ].map((feature, index) => (
                  <Box key={index} sx={styles.toggleRow}>
                    <Typography sx={styles.toggleLabel}>{feature.label}</Typography>
                    <Switch
                      checked={feature.checked}
                      disabled
                      sx={styles.switch}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDetailDialog;
