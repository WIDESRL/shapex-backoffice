import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Divider,
  Stack,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useClientContext } from '../Context/ClientContext';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import ReactJson from '@microlink/react-json-view';
import SubscriptionDetailDialog from './SubscriptionDetailDialog';

interface UserSubscriptionLogsDialogProps {
  open: boolean;
  userSubscriptionId: number | null;
  onClose: () => void;
}

// Helper type for webhook payload structure
type WebhookPayloadData = {
  data?: {
    signedRenewalInfo?: {
      fullPayload?: {
        recentSubscriptionStartDate?: string;
        autoRenewStatus?: number;
        renewalDate?: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    signedTransactionInfo?: {
      purchaseDate?: string;
      expiresDate?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

// Helper type for Android payment latestPurchaseData
type LatestPurchaseData = {
  orderId?: string;
  autoRenewing?: boolean;
  [key: string]: unknown;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`subscription-logs-tabpanel-${index}`}
      aria-labelledby={`subscription-logs-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'PPpp');
  } catch {
    return dateString;
  }
};

const PlatformBadge: React.FC<{ platform: string }> = ({ platform }) => {
  if (platform === 'android') {
    return (
      <Chip
        icon={<AndroidIcon />}
        label="Android"
        size="small"
        color="success"
        sx={{ fontWeight: 600 }}
      />
    );
  }
  if (platform === 'apple') {
    return (
      <Chip
        icon={<AppleIcon />}
        label="Apple"
        size="small"
        color="default"
        sx={{ fontWeight: 600, bgcolor: 'grey.800', color: 'white' }}
      />
    );
  }
  return <Chip label={platform} size="small" variant="outlined" />;
};

export const UserSubscriptionLogsDialog: React.FC<UserSubscriptionLogsDialogProps> = ({
  open,
  userSubscriptionId,
  onClose,
}) => {
  const { t } = useTranslation();
  const {
    userSubscriptionDetails,
    loadingSubscriptionDetails,
    fetchUserSubscriptionDetails,
  } = useClientContext();

  const [tabValue, setTabValue] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [subscriptionPreviewOpen, setSubscriptionPreviewOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);

  useEffect(() => {
    if (open && userSubscriptionId) {
      fetchUserSubscriptionDetails(userSubscriptionId);
    }
  }, [open, userSubscriptionId, fetchUserSubscriptionDetails]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClose = () => {
    setTabValue(0);
    setIsFullscreen(false);
    setShowDates(false);
    setSubscriptionPreviewOpen(false);
    setSelectedSubscriptionId(null);
    onClose();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleDateMode = () => {
    setShowDates(!showDates);
  };

  const handleSubscriptionClick = (subscriptionId: number) => {
    setSelectedSubscriptionId(subscriptionId);
    setSubscriptionPreviewOpen(true);
  };

  // Helper function to recursively convert timestamps in an object
  const convertTimestampsInObject = (obj: unknown): Record<string, unknown> | unknown[] | unknown => {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => convertTimestampsInObject(item));
    }

    const converted: Record<string, unknown> = {};
    for (const key in obj) {
      const value = (obj as Record<string, unknown>)[key];
      
      // Check if the value is a timestamp (number with 10 or 13 digits)
      if (typeof value === 'number' && (value.toString().length === 10 || value.toString().length === 13)) {
        const timestamp = value.toString().length === 10 ? value * 1000 : value;
        converted[key] = formatDateTime(new Date(timestamp).toISOString());
      } 
      // Check if value is an ISO date string
      else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        converted[key] = formatDateTime(value);
      }
      // Recursively process objects and arrays
      else if (typeof value === 'object' && value !== null) {
        converted[key] = convertTimestampsInObject(value);
      }
      else {
        converted[key] = value;
      }
    }
    return converted;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={isFullscreen ? false : 'xl'}
      fullWidth
      fullScreen={isFullscreen}
      PaperProps={{
        sx: {
          minHeight: isFullscreen ? '100vh' : '80vh',
          maxHeight: isFullscreen ? '100vh' : '90vh',
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            {t('subscriptions.technicalLogs.title', 'Technical Logs')}
          </Typography>
          {userSubscriptionDetails?.userSubscription && (
            <Typography variant="caption" color="text.secondary">
              {userSubscriptionDetails.userSubscription.subscription?.title || 'Subscription'} - ID: {userSubscriptionId}
            </Typography>
          )}
        </Box>
        <IconButton
          aria-label="toggle fullscreen"
          onClick={toggleFullscreen}
          sx={{ color: 'text.secondary' }}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {loadingSubscriptionDetails ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={40} />
          </Box>
        ) : !userSubscriptionDetails ? (
          <Box p={4}>
            <Alert severity="warning">
              {t('subscriptions.technicalLogs.noData', 'No subscription details available')}
            </Alert>
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="subscription logs tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      {t('subscriptions.technicalLogs.tabs.transactions', 'Transaction Events')}
                      <Chip
                        label={userSubscriptionDetails.transactions?.length || 0}
                        size="small"
                        color="info"
                      />
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      {t('subscriptions.technicalLogs.tabs.webhooks', 'Subscription Webhooks')}
                      <Chip
                        label={userSubscriptionDetails.subscriptionWebhooks?.length || 0}
                        size="small"
                        color="warning"
                      />
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <AppleIcon fontSize="small" />
                      {t('subscriptions.technicalLogs.tabs.applePayments', 'Apple Payments')}
                      <Chip
                        label={userSubscriptionDetails.applePayments?.length || 0}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <AndroidIcon fontSize="small" />
                      {t('subscriptions.technicalLogs.tabs.androidPayments', 'Android Payments')}
                      <Chip
                        label={userSubscriptionDetails.androidPayments?.length || 0}
                        size="small"
                        color="success"
                      />
                    </Box>
                  }
                />
              </Tabs>
            </Box>

            {/* Transaction Events Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box px={3}>
                {!userSubscriptionDetails.transactions?.length ? (
                  <Alert severity="info">
                    {t('subscriptions.technicalLogs.noTransactions', 'No transactions found')}
                  </Alert>
                ) : (
                  <Stack spacing={3}>
                    {userSubscriptionDetails.transactions.map((transaction, index) => {
                      const subscription = transaction.subscription || userSubscriptionDetails.userSubscription?.subscription;
                      return (
                        <Card key={transaction.id} elevation={2}>
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                              <Typography variant="h6" component="div">
                                {t('subscriptions.technicalLogs.transaction', 'Transaction')} #{index + 1}
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                {transaction.platform && <PlatformBadge platform={transaction.platform} />}
                                {transaction.status && (
                                  <Chip
                                    label={transaction.status}
                                    size="small"
                                    color={transaction.status === 'completed' ? 'success' : 'default'}
                                  />
                                )}
                              </Stack>
                            </Box>

                            {subscription && (
                              <Box mb={2}>
                                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                  {t('subscriptions.technicalLogs.fields.subscription', 'Subscription')}
                                </Typography>
                                <Chip
                                  label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <Box
                                        sx={{
                                          width: 12,
                                          height: 12,
                                          borderRadius: '50%',
                                          backgroundColor: subscription.color || '#ccc',
                                        }}
                                      />
                                      <span>{subscription.title || 'N/A'}</span>
                                      <Typography variant="caption" color="text.secondary">
                                        (ID: {subscription.id})
                                      </Typography>
                                    </Box>
                                  }
                                  onClick={() => subscription.id && handleSubscriptionClick(subscription.id)}
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                      backgroundColor: 'action.hover',
                                    },
                                  }}
                                />
                              </Box>
                            )}

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.transactionType', 'Type')}
                              </Typography>
                              <Typography variant="body2">
                                {transaction.transactionType || transaction.eventType || 'N/A'}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.amount', 'Amount')}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {transaction.amount} {transaction.currency?.toUpperCase()}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.transactionDate', 'Transaction Date')}
                              </Typography>
                              <Typography variant="body2">{formatDateTime(transaction.transactionDate)}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.billingPeriod', 'Billing Period')}
                              </Typography>
                              <Typography variant="body2" fontSize="0.75rem">
                                {formatDateTime(transaction.periodStartDate)} →{' '}
                                {formatDateTime(transaction.periodEndDate)}
                              </Typography>
                            </Box>

                            {transaction.platform === 'android' && transaction.androidOrderId && (
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Android Order ID
                                </Typography>
                                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                  {transaction.androidOrderId}
                                </Typography>
                              </Box>
                            )}

                            {transaction.platform === 'apple' && transaction.appleTransactionId && (
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Apple Transaction ID
                                </Typography>
                                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                  {transaction.appleTransactionId}
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          {transaction.refundedAt && (
                            <>
                              <Divider sx={{ my: 2 }} />
                              <Alert severity="error" sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  {t('subscriptions.technicalLogs.refundInfo', 'Refund Information')}
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Refunded At
                                    </Typography>
                                    <Typography variant="body2">{formatDateTime(transaction.refundedAt)}</Typography>
                                  </Box>
                                  {transaction.refundAmount && (
                                    <Box>
                                      <Typography variant="caption" color="text.secondary">
                                        Refund Amount
                                      </Typography>
                                      <Typography variant="body2">
                                        {transaction.refundAmount} {transaction.currency?.toUpperCase()}
                                      </Typography>
                                    </Box>
                                  )}
                                  {transaction.refundReason && (
                                    <Box sx={{ gridColumn: '1 / -1' }}>
                                      <Typography variant="caption" color="text.secondary">
                                        Reason
                                      </Typography>
                                      <Typography variant="body2">{transaction.refundReason}</Typography>
                                    </Box>
                                  )}
                                </Box>
                              </Alert>
                            </>
                          )}

                          <Divider sx={{ my: 2 }} />

                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle2">
                              {t('subscriptions.technicalLogs.rawData', 'Raw Data')}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Chip
                                label={t('subscriptions.technicalLogs.raw', 'Raw')}
                                size="small"
                                onClick={toggleDateMode}
                                color={!showDates ? 'primary' : 'default'}
                                variant={!showDates ? 'filled' : 'outlined'}
                                sx={{ cursor: 'pointer' }}
                              />
                              <Chip
                                label={t('subscriptions.technicalLogs.dates', 'Dates')}
                                size="small"
                                onClick={toggleDateMode}
                                color={showDates ? 'primary' : 'default'}
                                variant={showDates ? 'filled' : 'outlined'}
                                sx={{ cursor: 'pointer' }}
                              />
                            </Stack>
                          </Box>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: 'grey.900',
                              maxHeight: isFullscreen ? 'calc(100vh - 500px)' : 400,
                              overflow: 'auto',
                            }}
                          >
                            <ReactJson
                              src={showDates ? (convertTimestampsInObject(transaction) as object) : transaction}
                              theme="monokai"
                            collapsed={true}
                              displayObjectSize={true}
                              displayDataTypes={false}
                              enableClipboard={true}
                              indentWidth={4}
                              name={false}
                            />
                          </Paper>
                        </CardContent>
                      </Card>
                      );
                    })}
                  </Stack>
                )}
              </Box>
            </TabPanel>

            {/* Subscription Webhooks Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box px={3}>
                {!userSubscriptionDetails.subscriptionWebhooks?.length ? (
                  <Alert severity="info">
                    {t('subscriptions.technicalLogs.noWebhooks', 'No webhooks found')}
                  </Alert>
                ) : (
                  <Stack spacing={3}>
                    {userSubscriptionDetails.subscriptionWebhooks.map((webhook, index) => (
                      <Card key={webhook.id} elevation={2}>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" component="div">
                              {t('subscriptions.technicalLogs.webhook', 'Webhook')} #{index + 1}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <PlatformBadge platform={webhook.platform} />
                              <Tooltip title={webhook.processed ? 'Webhook processed successfully' : 'Webhook pending'}>
                                <Chip
                                  label={webhook.processed ? 'Processed' : 'Pending'}
                                  size="small"
                                  color={webhook.processed ? 'success' : 'warning'}
                                />
                              </Tooltip>
                            </Stack>
                          </Box>

                          {webhook.subscription && (
                            <Box mb={2}>
                              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                {t('subscriptions.technicalLogs.fields.subscription', 'Subscription')}
                              </Typography>
                              <Chip
                                label={
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Box
                                      sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: webhook.subscription.color || '#ccc',
                                      }}
                                    />
                                    <span>{webhook.subscription.title || 'N/A'}</span>
                                    <Typography variant="caption" color="text.secondary">
                                      (ID: {webhook.subscription.id})
                                    </Typography>
                                  </Box>
                                }
                                onClick={() => webhook.subscription?.id && handleSubscriptionClick(webhook.subscription.id)}
                                sx={{
                                  cursor: 'pointer',
                                  '&:hover': {
                                    backgroundColor: 'action.hover',
                                  },
                                }}
                              />
                            </Box>
                          )}

                          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.notificationType', 'Notification Type')}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {webhook.notificationType}
                              </Typography>
                            </Box>
                            {webhook.subtype && (
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  {t('subscriptions.technicalLogs.fields.subtype', 'Subtype')}
                                </Typography>
                                <Typography variant="body2">{webhook.subtype}</Typography>
                              </Box>
                            )}
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.environment', 'Environment')}
                              </Typography>
                              <Typography variant="body2">
                                <Chip
                                  label={webhook.environment || 'N/A'}
                                  size="small"
                                  color={webhook.environment === 'production' ? 'success' : 'default'}
                                />
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.receivedAt', 'Received At')}
                              </Typography>
                              <Typography variant="body2">{formatDateTime(webhook.receivedAt)}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.processedAt', 'Processed At')}
                              </Typography>
                              <Typography variant="body2">{formatDateTime(webhook.processedAt)}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.retryCount', 'Retry Count')}
                              </Typography>
                              <Typography variant="body2">{webhook.retryCount}</Typography>
                            </Box>
                            <Box sx={{ gridColumn: '1 / -1' }}>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.transactionId', 'Transaction ID')}
                              </Typography>
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {webhook.transactionId}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Subscription Details from Payload */}
                          {((webhook.payload as WebhookPayloadData)?.data?.signedRenewalInfo?.fullPayload ||
                            (webhook.payload as WebhookPayloadData)?.data?.signedTransactionInfo) && (
                            <>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="subtitle2" gutterBottom>
                                {t('subscriptions.technicalLogs.subscriptionDetails', 'Subscription Details')}
                              </Typography>

                              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                                {/* Renewal Information */}
                                {(webhook.payload as WebhookPayloadData)?.data?.signedRenewalInfo?.fullPayload && (
                                  <>
                                    <Box sx={{ gridColumn: '1 / -1' }}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        fontWeight="bold"
                                        display="block"
                                        mb={1}
                                      >
                                        {t('subscriptions.technicalLogs.renewalInfo', 'Renewal Information')}
                                      </Typography>
                                    </Box>
                                    {(webhook.payload as WebhookPayloadData).data?.signedRenewalInfo?.fullPayload?.recentSubscriptionStartDate && (
                                      <Box>
                                        <Typography variant="caption" color="text.secondary">
                                          {t(
                                            'subscriptions.technicalLogs.fields.recentSubscriptionStartDate',
                                            'Subscription Start Date'
                                          )}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                          {formatDateTime(
                                            (webhook.payload as WebhookPayloadData).data?.signedRenewalInfo?.fullPayload?.recentSubscriptionStartDate
                                          )}
                                        </Typography>
                                      </Box>
                                    )}
                                    {(webhook.payload as WebhookPayloadData).data?.signedRenewalInfo?.fullPayload?.autoRenewStatus !==
                                      undefined && (
                                      <Box>
                                        <Typography variant="caption" color="text.secondary">
                                          {t('subscriptions.technicalLogs.fields.autoRenewStatus', 'Auto-Renew Status')}
                                        </Typography>
                                        <Typography variant="body2">
                                          <Chip
                                            label={
                                              (webhook.payload as WebhookPayloadData).data?.signedRenewalInfo?.fullPayload?.autoRenewStatus === 1
                                                ? 'Enabled'
                                                : 'Disabled'
                                            }
                                            size="small"
                                            color={
                                              (webhook.payload as WebhookPayloadData).data?.signedRenewalInfo?.fullPayload?.autoRenewStatus === 1
                                                ? 'success'
                                                : 'default'
                                            }
                                          />
                                        </Typography>
                                      </Box>
                                    )}
                                    {(webhook.payload as WebhookPayloadData).data?.signedRenewalInfo?.fullPayload?.renewalDate && (
                                      <Box>
                                        <Typography variant="caption" color="text.secondary">
                                          {t('subscriptions.technicalLogs.fields.renewalDate', 'Next Renewal Date')}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                          {formatDateTime((webhook.payload as WebhookPayloadData).data?.signedRenewalInfo?.fullPayload?.renewalDate)}
                                        </Typography>
                                      </Box>
                                    )}
                                  </>
                                )}

                                {/* Transaction Information */}
                                {(webhook.payload as WebhookPayloadData)?.data?.signedTransactionInfo && (
                                  <>
                                    <Box sx={{ gridColumn: '1 / -1' }}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        fontWeight="bold"
                                        display="block"
                                        mb={1}
                                        mt={(webhook.payload as WebhookPayloadData)?.data?.signedRenewalInfo?.fullPayload ? 1 : 0}
                                      >
                                        {t('subscriptions.technicalLogs.transactionInfo', 'Transaction Information')}
                                      </Typography>
                                    </Box>
                                    {(webhook.payload as WebhookPayloadData).data?.signedTransactionInfo?.purchaseDate && (
                                      <Box>
                                        <Typography variant="caption" color="text.secondary">
                                          {t('subscriptions.technicalLogs.fields.purchaseDate', 'Purchase Date')}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                          {formatDateTime((webhook.payload as WebhookPayloadData).data?.signedTransactionInfo?.purchaseDate)}
                                        </Typography>
                                      </Box>
                                    )}
                                    {(webhook.payload as WebhookPayloadData).data?.signedTransactionInfo?.expiresDate && (
                                      <Box>
                                        <Typography variant="caption" color="text.secondary">
                                          {t('subscriptions.technicalLogs.fields.expiresDate', 'Expires Date')}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="medium" color="warning.main">
                                          {formatDateTime((webhook.payload as WebhookPayloadData).data?.signedTransactionInfo?.expiresDate)}
                                        </Typography>
                                      </Box>
                                    )}
                                  </>
                                )}
                              </Box>
                            </>
                          )}

                          {webhook.processingError && (
                            <>
                              <Divider sx={{ my: 2 }} />
                              <Alert severity="error">
                                <Typography variant="subtitle2" gutterBottom>
                                  {t('subscriptions.technicalLogs.processingError', 'Processing Error')}
                                </Typography>
                                <Typography variant="body2">{webhook.processingError}</Typography>
                              </Alert>
                            </>
                          )}

                          <Divider sx={{ my: 2 }} />

                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle2">
                              {t('subscriptions.technicalLogs.webhookPayload', 'Webhook Payload')}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Chip
                                label={t('subscriptions.technicalLogs.raw', 'Raw')}
                                size="small"
                                onClick={toggleDateMode}
                                color={!showDates ? 'primary' : 'default'}
                                variant={!showDates ? 'filled' : 'outlined'}
                                sx={{ cursor: 'pointer' }}
                              />
                              <Chip
                                label={t('subscriptions.technicalLogs.dates', 'Dates')}
                                size="small"
                                onClick={toggleDateMode}
                                color={showDates ? 'primary' : 'default'}
                                variant={showDates ? 'filled' : 'outlined'}
                                sx={{ cursor: 'pointer' }}
                              />
                            </Stack>
                          </Box>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: 'grey.900',
                              maxHeight: isFullscreen ? 'calc(100vh - 500px)' : 400,
                              overflow: 'auto',
                            }}
                          >
                            <ReactJson
                              src={showDates ? (convertTimestampsInObject(webhook.payload) as object) : webhook.payload}
                              theme="monokai"
                            collapsed={true}
                              displayObjectSize={true}
                              displayDataTypes={false}
                              enableClipboard={true}
                              indentWidth={4}
                              name={false}
                            />
                          </Paper>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            </TabPanel>

            {/* Apple Payments Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box px={3}>
                {!userSubscriptionDetails.applePayments?.length ? (
                  <Alert severity="info">
                    {t('subscriptions.technicalLogs.noApplePayments', 'No Apple payments found')}
                  </Alert>
                ) : (
                  <Stack spacing={3}>
                    {userSubscriptionDetails.applePayments.map((payment, index) => (
                      <Card key={payment.id} elevation={2}>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" component="div">
                              {t('subscriptions.technicalLogs.payment', 'Payment')} #{index + 1}
                            </Typography>
                            <PlatformBadge platform="apple" />
                          </Box>

                          {payment.subscription && (
                            <Box mb={2}>
                              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                {t('subscriptions.technicalLogs.fields.subscription', 'Subscription')}
                              </Typography>
                              <Chip
                                label={
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Box
                                      sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: payment.subscription.color || '#ccc',
                                      }}
                                    />
                                    <span>{payment.subscription.title || 'N/A'}</span>
                                    <Typography variant="caption" color="text.secondary">
                                      (ID: {payment.subscription.id})
                                    </Typography>
                                  </Box>
                                }
                                onClick={() => payment.subscription?.id && handleSubscriptionClick(payment.subscription.id)}
                                sx={{
                                  cursor: 'pointer',
                                  '&:hover': {
                                    backgroundColor: 'action.hover',
                                  },
                                }}
                              />
                            </Box>
                          )}

                          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.applePaymentId', 'Apple Payment ID')}
                              </Typography>
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {payment.applePaymentId}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.userId', 'User ID')}
                              </Typography>
                              <Typography variant="body2">{payment.userId}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.createdAt', 'Created At')}
                              </Typography>
                              <Typography variant="body2">{formatDateTime(payment.createdAt)}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.updatedAt', 'Updated At')}
                              </Typography>
                              <Typography variant="body2">{formatDateTime(payment.updatedAt)}</Typography>
                            </Box>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle2">
                              {t('subscriptions.technicalLogs.rawData', 'Raw Data')}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Chip
                                label={t('subscriptions.technicalLogs.raw', 'Raw')}
                                size="small"
                                onClick={toggleDateMode}
                                color={!showDates ? 'primary' : 'default'}
                                variant={!showDates ? 'filled' : 'outlined'}
                                sx={{ cursor: 'pointer' }}
                              />
                              <Chip
                                label={t('subscriptions.technicalLogs.dates', 'Dates')}
                                size="small"
                                onClick={toggleDateMode}
                                color={showDates ? 'primary' : 'default'}
                                variant={showDates ? 'filled' : 'outlined'}
                                sx={{ cursor: 'pointer' }}
                              />
                            </Stack>
                          </Box>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: 'grey.900',
                              maxHeight: isFullscreen ? 'calc(100vh - 500px)' : 400,
                              overflow: 'auto',
                            }}
                          >
                            <ReactJson
                              src={showDates ? (convertTimestampsInObject(payment) as object) : payment}
                              theme="monokai"
                            collapsed={true}
                              displayObjectSize={true}
                              displayDataTypes={false}
                              enableClipboard={true}
                              indentWidth={4}
                              name={false}
                            />
                          </Paper>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            </TabPanel>

            {/* Android Payments Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box px={3}>
                {!userSubscriptionDetails.androidPayments?.length ? (
                  <Alert severity="info">
                    {t('subscriptions.technicalLogs.noAndroidPayments', 'No Android payments found')}
                  </Alert>
                ) : (
                  <Stack spacing={3}>
                    {userSubscriptionDetails.androidPayments.map((payment, index) => (
                      <Card key={payment.id} elevation={2}>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" component="div">
                              {t('subscriptions.technicalLogs.payment', 'Payment')} #{index + 1}
                            </Typography>
                            <PlatformBadge platform="android" />
                          </Box>

                          {payment.subscription && (
                            <Box mb={2}>
                              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                {t('subscriptions.technicalLogs.fields.subscription', 'Subscription')}
                              </Typography>
                              <Chip
                                label={
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Box
                                      sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: payment.subscription.color || '#ccc',
                                      }}
                                    />
                                    <span>{payment.subscription.title || 'N/A'}</span>
                                    <Typography variant="caption" color="text.secondary">
                                      (ID: {payment.subscription.id})
                                    </Typography>
                                  </Box>
                                }
                                onClick={() => payment.subscription?.id && handleSubscriptionClick(payment.subscription.id)}
                                sx={{
                                  cursor: 'pointer',
                                  '&:hover': {
                                    backgroundColor: 'action.hover',
                                  },
                                }}
                              />
                            </Box>
                          )}

                          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.androidPaymentId', 'Android Payment ID')}
                              </Typography>
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {payment.androidPaymentId}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.userId', 'User ID')}
                              </Typography>
                              <Typography variant="body2">{payment.userId}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.createdAt', 'Created At')}
                              </Typography>
                              <Typography variant="body2">{formatDateTime(payment.createdAt)}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('subscriptions.technicalLogs.fields.updatedAt', 'Updated At')}
                              </Typography>
                              <Typography variant="body2">{formatDateTime(payment.updatedAt)}</Typography>
                            </Box>
                          </Box>

                          {payment.latestPurchaseData && (
                            <>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="subtitle2" gutterBottom>
                                {t('subscriptions.technicalLogs.latestPurchaseData', 'Latest Purchase Data')}
                              </Typography>
                              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                                {(payment.latestPurchaseData as LatestPurchaseData | null)?.orderId && (
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Order ID
                                    </Typography>
                                    <Typography variant="body2">{(payment.latestPurchaseData as LatestPurchaseData).orderId}</Typography>
                                  </Box>
                                )}
                                {(payment.latestPurchaseData as LatestPurchaseData | null)?.autoRenewing !== undefined && (
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Auto Renewing
                                    </Typography>
                                    <Typography variant="body2">
                                      <Chip
                                        label={(payment.latestPurchaseData as LatestPurchaseData).autoRenewing ? 'Yes' : 'No'}
                                        size="small"
                                        color={(payment.latestPurchaseData as LatestPurchaseData).autoRenewing ? 'success' : 'default'}
                                      />
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </>
                          )}

                          <Divider sx={{ my: 2 }} />

                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle2">
                              {t('subscriptions.technicalLogs.rawData', 'Raw Data')}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Chip
                                label={t('subscriptions.technicalLogs.raw', 'Raw')}
                                size="small"
                                onClick={toggleDateMode}
                                color={!showDates ? 'primary' : 'default'}
                                variant={!showDates ? 'filled' : 'outlined'}
                                sx={{ cursor: 'pointer' }}
                              />
                              <Chip
                                label={t('subscriptions.technicalLogs.dates', 'Dates')}
                                size="small"
                                onClick={toggleDateMode}
                                color={showDates ? 'primary' : 'default'}
                                variant={showDates ? 'filled' : 'outlined'}
                                sx={{ cursor: 'pointer' }}
                              />
                            </Stack>
                          </Box>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: 'grey.900',
                              maxHeight: isFullscreen ? 'calc(100vh - 500px)' : 400,
                              overflow: 'auto',
                            }}
                          >
                            <ReactJson
                              src={showDates ? (convertTimestampsInObject(payment) as object) : payment}
                              theme="monokai"
                              collapsed={true}
                              displayObjectSize={true}
                              displayDataTypes={false}
                              enableClipboard={true}
                              indentWidth={4}
                              name={false}
                            />
                          </Paper>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            </TabPanel>
          </>
        )}
      </DialogContent>

      <SubscriptionDetailDialog
        open={subscriptionPreviewOpen}
        subscriptionId={selectedSubscriptionId}
        onClose={() => {
          setSubscriptionPreviewOpen(false);
          setSelectedSubscriptionId(null);
        }}
      />
    </Dialog>
  );
};

export default UserSubscriptionLogsDialog;
