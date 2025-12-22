import React, { useState, useMemo } from 'react';
import ReactJson from '@microlink/react-json-view';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Divider,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useTranslation } from 'react-i18next';

interface SubscriptionTransaction {
  id: number;
  transactionType?: string;
  eventType?: string;
  transactionDate: string;
  periodStartDate: string;
  periodEndDate: string;
  amount: number | string;
  currency: string;
  priceInCents?: number;
  status?: string;
  platform?: string;
  androidProductId?: string;
  appleProductId?: string;
  androidOrderId?: string;
  androidPurchaseToken?: string;
  appleTransactionId?: string;
  appleOriginalTransactionId?: string;
  appleWebOrderLineItemId?: string;
  appleEnvironment?: string;
  isTrialPeriod?: boolean;
  isIntroPeriod?: boolean;
  isAutoRenewing?: boolean;
  inGracePeriod?: boolean;
  willCancelAtPeriodEnd?: boolean;
  introOfferPeriods?: number;
  refundedAt?: string;
  refundAmount?: number | string;
  refundReason?: string;
  rawTransactionData?: unknown;
  subscription?: {
    id: number;
    title: string;
    color: string;
  };
}

interface TransactionDetailDialogProps {
  open: boolean;
  transaction: SubscriptionTransaction | null;
  onClose: () => void;
}

const formatCurrency = (amount: number | string, currency = 'USD') => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(numAmount || 0);
};

const formatDate = (dateString: string, language: string = 'it') => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    const locale = language === 'en' ? 'en-US' : 'it-IT';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '-';
  }
};

export const TransactionDetailDialog: React.FC<TransactionDetailDialogProps> = ({
  open,
  transaction,
  onClose
}) => {
  const { i18n } = useTranslation();
  const [jsonViewMode, setJsonViewMode] = useState<'raw' | 'dates'>('raw');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to recursively convert timestamps to readable dates
  const convertTimestampsInObject = (obj: unknown, language: string = 'it'): unknown => {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'number') {
      // Check if it's a timestamp (milliseconds or seconds)
      // Timestamps are typically 10 digits (seconds) or 13 digits (milliseconds)
      const str = obj.toString();
      if ((str.length === 10 || str.length === 13) && obj > 1000000000) {
        const date = new Date(str.length === 10 ? obj * 1000 : obj);
        if (!isNaN(date.getTime())) {
          return formatDate(date.toISOString(), language);
        }
      }
      return obj;
    }
    
    if (typeof obj === 'string') {
      // Check if it's an ISO date string
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
        return formatDate(obj, language);
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => convertTimestampsInObject(item, language));
    }
    
    if (typeof obj === 'object') {
      const converted: Record<string, unknown> = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          converted[key] = convertTimestampsInObject((obj as Record<string, unknown>)[key], language);
        }
      }
      return converted;
    }
    
    return obj;
  };

  const displayedJson = useMemo(() => {
    const rawData = transaction;
    if (jsonViewMode === 'dates') {
      return convertTimestampsInObject(rawData, i18n.language);
    }
    return rawData;
  }, [transaction, jsonViewMode, i18n.language]);

  if (!transaction) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isFullscreen ? false : "md"}
      fullWidth={!isFullscreen}
      fullScreen={isFullscreen}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Transaction Details</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => setIsFullscreen(!isFullscreen)} size="small">
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box>
          {/* Transaction Summary */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Transaction Summary
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Transaction ID</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{transaction.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Type</Typography>
                <Typography variant="body2">{transaction.transactionType?.toUpperCase() || transaction.eventType}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Platform</Typography>
                <Typography variant="body2">{transaction.platform?.toUpperCase()}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Typography variant="body2">{transaction.status?.toUpperCase()}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Amount</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(transaction.amount, transaction.currency)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Date</Typography>
                <Typography variant="body2">{formatDate(transaction.transactionDate, i18n.language)}</Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Platform-Specific IDs */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Platform Transaction IDs
            </Typography>
            {transaction.platform === 'android' && (
              <Box sx={{ mt: 1 }}>
                {transaction.androidOrderId && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Order ID</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {transaction.androidOrderId}
                    </Typography>
                  </Box>
                )}
                {transaction.androidPurchaseToken && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Purchase Token</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', fontSize: 11 }}>
                      {transaction.androidPurchaseToken}
                    </Typography>
                  </Box>
                )}
                {transaction.androidProductId && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Product ID</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {transaction.androidProductId}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            {transaction.platform === 'apple' && (
              <Box sx={{ mt: 1 }}>
                {transaction.appleTransactionId && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Transaction ID</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {transaction.appleTransactionId}
                    </Typography>
                  </Box>
                )}
                {transaction.appleOriginalTransactionId && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Original Transaction ID</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {transaction.appleOriginalTransactionId}
                    </Typography>
                  </Box>
                )}
                {transaction.appleWebOrderLineItemId && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Web Order Line Item ID</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {transaction.appleWebOrderLineItemId}
                    </Typography>
                  </Box>
                )}
                {transaction.appleProductId && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Product ID</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {transaction.appleProductId}
                    </Typography>
                  </Box>
                )}
                {transaction.appleEnvironment && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Environment</Typography>
                    <Typography variant="body2">{transaction.appleEnvironment}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Refund Information */}
          {transaction.refundedAt && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 3, p: 2, backgroundColor: 'error.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'error.main' }}>
                  Refund Information
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Refund Date</Typography>
                    <Typography variant="body2">{formatDate(transaction.refundedAt, i18n.language)}</Typography>
                  </Box>
                  {transaction.refundAmount && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">Refund Amount</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(transaction.refundAmount, transaction.currency)}
                      </Typography>
                    </Box>
                  )}
                  {transaction.refundReason && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Reason</Typography>
                      <Typography variant="body2">{transaction.refundReason}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Raw Transaction Data */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Transaction Object (JSON)
              </Typography>
              <ToggleButtonGroup
                value={jsonViewMode}
                exclusive
                onChange={(_, newMode) => newMode && setJsonViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="raw" sx={{ fontSize: 11, py: 0.5, px: 1.5 }}>
                  Raw
                </ToggleButton>
                <ToggleButton value="dates" sx={{ fontSize: 11, py: 0.5, px: 1.5 }}>
                  Dates
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box
              sx={{
                mt: 1,
                maxHeight: isFullscreen ? 'calc(100vh - 300px)' : 400,
                overflow: 'auto',
                backgroundColor: 'grey.900',
                p: 2,
                borderRadius: 1
              }}
            >
              <ReactJson
                src={displayedJson as object}
                theme="monokai"
                collapsed={2}
                displayDataTypes={false}
                displayObjectSize={true}
                enableClipboard={true}
                name={false}
                indentWidth={4}
                collapseStringsAfterLength={50}
                style={{
                  backgroundColor: 'transparent',
                  fontSize: 12,
                  fontFamily: 'monospace'
                }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetailDialog;
