import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CallCardProps {
  call: {
    id: number;
    type: 'Extra' | 'Supplementary';
    usedAt: string | null;
    createdAt: string;
    product?: {
      id: number;
      name: string;
    };
    subscription?: {
      id: number;
      subscription: {
        title: string;
      };
    };
    order?: {
      id: number;
      totalAmount: number;
      stripePaymentIntentId: string;
      stripePaymentData: {
        id: string;
        amount: number;
        currency: string;
        status: string;
      };
    };
  };
  title: string;
  subtitle: string;
  typeLabel: string;
  typeColor: string;
  statusLabel: string;
  statusColor: string;
  createdDate: string;
  usedDate?: string;
  onSubscriptionClick?: (subscriptionId: number) => void;
}

const styles = {
  callCard: {
    p: 3,
    borderRadius: 2,
    border: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transform: 'translateY(-2px)',
    },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    mb: 2,
  },
  titleSection: {
    flex: 1,
    mr: 2,
  },
  callTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
    mb: 0.5,
  },
  callSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.4,
  },
  statusSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 1,
  },
  callDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    mt: 2,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: 500,
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: 500,
  },
  subscriptionName: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      color: '#1565c0',
    },
  },
  usedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#4caf50',
  },
  availableIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#E6BB4A',
  },
  paymentSection: {
    mt: 1.5,
    p: 1.5,
    backgroundColor: '#f8f9fa',
    borderRadius: 1,
    border: '1px solid #e9ecef',
  },
  paymentTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#495057',
    mb: 0.75,
  },
  paymentDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 11,
    mb: 0.25,
    '&:last-child': {
      mb: 0,
    },
  },
  paymentLabel: {
    color: '#6c757d',
    fontWeight: 500,
    fontSize: 10,
  },
  paymentValue: {
    color: '#212529',
    fontWeight: 600,
  },
  statusChip: {
    fontSize: 9,
    height: 18,
    fontWeight: 600,
  },
};

const CallCard: React.FC<CallCardProps> = ({ 
  call, 
  title, 
  subtitle, 
  typeLabel, 
  typeColor, 
  statusLabel, 
  statusColor, 
  createdDate, 
  usedDate,
  onSubscriptionClick 
}) => {
  const { t } = useTranslation();
  
  // Helper function to get payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'succeeded':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'failed':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };
  return (
    <Paper sx={styles.callCard} elevation={0}>
      {/* Status indicator dot */}
      <Box sx={call.usedAt ? styles.usedIndicator : styles.availableIndicator} />
      
      <Box sx={styles.cardHeader}>
        <Box sx={styles.titleSection}>
          <Typography sx={styles.callTitle}>
            {title}
          </Typography>
          <Typography sx={styles.callSubtitle}>
            {subtitle}
          </Typography>
        </Box>
        
        <Box sx={styles.statusSection}>
          <Chip
            label={typeLabel}
            size="small"
            sx={{
              backgroundColor: typeColor,
              color: '#fff',
              fontWeight: 500,
              fontSize: 11,
            }}
          />
          <Chip
            label={statusLabel}
            size="small"
            variant="outlined"
            sx={{
              borderColor: statusColor,
              color: statusColor,
              fontWeight: 500,
              fontSize: 11,
            }}
          />
        </Box>
      </Box>

      <Box sx={styles.callDetails}>
        <Box sx={styles.detailRow}>
          <Typography sx={styles.detailLabel}>{t('client.altro.calls.card.createdOn')}</Typography>
          <Typography sx={styles.detailValue}>{createdDate}</Typography>
        </Box>
        
        {usedDate && (
          <Box sx={styles.detailRow}>
            <Typography sx={styles.detailLabel}>{t('client.altro.calls.card.usedOn')}</Typography>
            <Typography sx={styles.detailValue}>{usedDate}</Typography>
          </Box>
        )}
        
        {call.type === 'Supplementary' && call.subscription && (
          <Box sx={styles.detailRow}>
            <Typography sx={styles.detailLabel}>{t('client.altro.calls.card.subscription')}</Typography>
            <Typography 
              sx={styles.subscriptionName}
              onClick={() => onSubscriptionClick?.(call.subscription!.id)}
            >
              {call.subscription.subscription.title}
            </Typography>
          </Box>
        )}
        
        <Box sx={styles.detailRow}>
          <Typography sx={styles.detailLabel}>ID:</Typography>
          <Typography sx={styles.detailValue}>#{call.id}</Typography>
        </Box>
      </Box>

      {/* Payment Information Section for Extra calls */}
      {call.type === 'Extra' && call.order && (
        <Box sx={styles.paymentSection}>
          <Typography sx={styles.paymentTitle}>
            {t('client.altro.calls.card.payment')}
          </Typography>
          
          <Box sx={styles.paymentDetail}>
            <Typography sx={styles.paymentLabel}>
              {t('client.altro.calls.card.orderId')}
            </Typography>
            <Typography sx={styles.paymentValue}>
              #{call.order.id}
            </Typography>
          </Box>
          
          <Box sx={styles.paymentDetail}>
            <Typography sx={styles.paymentLabel}>
              {t('client.altro.calls.card.amount')}
            </Typography>
            <Typography sx={styles.paymentValue}>
              {formatCurrency(call.order.stripePaymentData.amount, call.order.stripePaymentData.currency)}
            </Typography>
          </Box>
          
          <Box sx={styles.paymentDetail}>
            <Typography sx={styles.paymentLabel}>
              {t('client.altro.calls.card.status')}
            </Typography>
            <Chip
              label={call.order.stripePaymentData.status.toUpperCase()}
              size="small"
              sx={{
                ...styles.statusChip,
                backgroundColor: getPaymentStatusColor(call.order.stripePaymentData.status),
                color: '#fff',
              }}
            />
          </Box>
          
          <Box sx={styles.paymentDetail}>
            <Typography sx={styles.paymentLabel}>
              {t('client.altro.calls.card.paymentId')}
            </Typography>
            <Typography sx={styles.paymentValue} style={{ fontSize: 9 }}>
              {call.order.stripePaymentData.id}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default CallCard;