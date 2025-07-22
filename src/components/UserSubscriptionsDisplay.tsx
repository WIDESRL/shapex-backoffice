import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Divider,
  Avatar,
  Stack,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../Context/ClientContext';
import Subscriptions from '../icons/Subscriptions';
import RefreshIcon from '../icons/RefreshIcon';
import { formatDistance } from 'date-fns';
import SubscriptionDetailDialog from './SubscriptionDetailDialog';
import { it } from 'date-fns/locale';

interface UserSubscriptionsDisplayProps {
  userId: string;
}

const getStatusColor = (status: string, isFuture: boolean = false): 'success' | 'error' | 'warning' | 'default' | 'info' => {
  if (isFuture) {
    return 'info';
  }
  
  switch (status?.toLowerCase()) {
    case 'active':
    case 'attivo':
      return 'success';
    case 'expired':
    case 'scaduto':
      return 'error';
    case 'suspended':
    case 'sospeso':
      return 'warning';
    case 'cancelled':
    case 'annullato':
      return 'default';
    default:
      return 'info';
  }
};

const getStatusText = (status: string, isFuture: boolean = false, t: (key: string) => string) => {
  if (isFuture) {
    return t('subscriptions.userSubscriptions.status.scheduled');
  }
  
  switch (status?.toLowerCase()) {
    case 'active':
      return t('subscriptions.userSubscriptions.status.active');
    case 'expired':
      return t('subscriptions.userSubscriptions.status.expired');
    case 'suspended':
      return t('subscriptions.userSubscriptions.status.suspended');
    case 'cancelled':
      return t('subscriptions.userSubscriptions.status.cancelled');
    default:
      return status || t('subscriptions.userSubscriptions.status.unknown');
  }
};

const formatCurrency = (amount: number | string, currency = 'EUR') => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency
  }).format(numAmount || 0);
};

const formatDate = (dateString: string, t: (key: string) => string) => {
  if (!dateString) return t('subscriptions.userSubscriptions.dates.notSpecified');
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return t('subscriptions.userSubscriptions.dates.invalidDate');
  }
};

const formatRelativeDate = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { 
      addSuffix: true, 
      locale: it 
    });
  } catch {
    return '';
  }
};

export const UserSubscriptionsDisplay: React.FC<UserSubscriptionsDisplayProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { 
    userSubscriptions, 
    loadingUserSubscriptions, 
    fetchUserSubscriptions 
  } = useClientContext();

  // Dialog state for subscription details
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);

  useEffect(() => {
    if (userId) {
        console.log(`Fetching subscriptions for user ID: ${userId}`);
      fetchUserSubscriptions(userId);
    }
  }, [userId, fetchUserSubscriptions]);

  const handleRefresh = () => {
    if (userId) {
      fetchUserSubscriptions(userId);
    }
  };

  const handleSubscriptionClick = (subscriptionId: number) => {
    setSelectedSubscriptionId(subscriptionId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSubscriptionId(null);
  };

  if (loadingUserSubscriptions) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (!userSubscriptions || userSubscriptions.length === 0) {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: 'grey.50',
          borderRadius: 2
        }}
      >
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            margin: '0 auto 16px',
            backgroundColor: 'primary.light'
          }}
        >
          <Subscriptions />
        </Avatar>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t('subscriptions.userSubscriptions.noSubscriptionsTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('subscriptions.userSubscriptions.noSubscriptionsDescription')}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Header with refresh button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Subscriptions />
          {t('subscriptions.userSubscriptions.title')} ({userSubscriptions.length})
        </Typography>
        <Tooltip title={t('subscriptions.userSubscriptions.refreshTooltip')}>
          <IconButton onClick={handleRefresh} size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Subscriptions Grid */}
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {userSubscriptions.map((subscription, index) => (
          <Card 
            key={subscription.id || index}
            elevation={3}
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                elevation: 6,
                transform: 'translateY(-2px)'
              }
            }}
          >
              <CardContent sx={{ p: 3 }}>
                {/* Header with status */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                      onClick={() => handleSubscriptionClick(subscription.subscription?.id)}
                      title={subscription.subscription?.title || t('subscriptions.userSubscriptions.defaultSubscriptionTitle')}
                    >
                      {subscription.subscription?.title || t('subscriptions.userSubscriptions.defaultSubscriptionTitle')}
                    </Typography>
                    <Box
                      sx={{
                        width: 40,
                        height: 4,
                        backgroundColor: subscription.subscription?.color || 'primary.main',
                        borderRadius: 2,
                        mb: 1
                      }}
                    />
                  </Box>
                  <Chip 
                    label={getStatusText(subscription.status, subscription.futureSubscription, t)}
                    color={getStatusColor(subscription.status, subscription.futureSubscription)}
                    size="small"
                    variant="filled"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Subscription Details */}
                <Stack spacing={2}>
                  {/* Active Status */}
                  {subscription.isCurrentActiveSubscription && (
                    <Box>
                      <Chip 
                        label={t('subscriptions.userSubscriptions.currentSubscription')} 
                        color="success" 
                        variant="filled" 
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  )}

                  {/* Future Subscription Status */}
                  {subscription.futureSubscription && (
                    <Box>
                      <Chip 
                        label={`${t('subscriptions.userSubscriptions.futureActivation')} ${formatDate(subscription.startDate, t)}`}
                        color="info" 
                        variant="outlined" 
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          maxWidth: '100%',
                          height: 'auto',
                          '& .MuiChip-label': {
                            whiteSpace: 'normal',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            display: '-webkit-box',
                            lineHeight: 1.2,
                            paddingTop: '6px',
                            paddingBottom: '6px'
                          }
                        }}
                      />
                    </Box>
                  )}

                  {/* Dates */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {t('subscriptions.userSubscriptions.sections.period')}
                    </Typography>
                    <Typography variant="body2">
                      <strong>{t('subscriptions.userSubscriptions.labels.startDate')}</strong> {formatDate(subscription.startDate, t)}
                      {subscription.startDate && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {formatRelativeDate(subscription.startDate)}
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="body2" mt={0.5}>
                      <strong>{t('subscriptions.userSubscriptions.labels.endDate')}</strong> {formatDate(subscription.endDate, t)}
                      {subscription.endDate && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {formatRelativeDate(subscription.endDate)}
                        </Typography>
                      )}
                    </Typography>
                  </Box>

                  {/* Payment Information (Stripe) */}
                  {subscription.stripePaymentData && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {t('subscriptions.userSubscriptions.sections.stripePayment')}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Tooltip title={t('subscriptions.userSubscriptions.tooltip.historicalPrice')}>
                          <Typography variant="body2" sx={{ cursor: 'help' }}>
                            {formatCurrency(subscription.stripePaymentData.amount, subscription.stripePaymentData.currency)}
                          </Typography>
                        </Tooltip>
                        {subscription.stripePaymentData.status && (
                          <Chip 
                            label={subscription.stripePaymentData.status}
                            size="small"
                            variant="outlined"
                            color={subscription.stripePaymentData.status.toLowerCase() === 'succeeded' || subscription.stripePaymentData.status.toLowerCase() === 'paid' ? 'success' : 'default'}
                          />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('subscriptions.userSubscriptions.labels.paymentId')} {subscription.stripePaymentData.id}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
        ))}
      </Box>

      {/* Subscription Detail Dialog */}
      <SubscriptionDetailDialog
        open={dialogOpen}
        subscriptionId={selectedSubscriptionId}
        onClose={handleDialogClose}
      />
    </Box>
  );
};

export default UserSubscriptionsDisplay;
