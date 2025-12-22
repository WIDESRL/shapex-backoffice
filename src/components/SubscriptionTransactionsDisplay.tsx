import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../Context/ClientContext';
import SubscriptionDetailDialog from './SubscriptionDetailDialog';
import TransactionDetailDialog from './TransactionDetailDialog';

interface SubscriptionTransactionsDisplayProps {
  userId: string;
}

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
  rawTransactionData?: Record<string, unknown>;
  subscription?: {
    id: number;
    title: string;
    color: string;
  };
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


const getPlatformIcon = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case 'android':
      return <AndroidIcon fontSize="small" />;
    case 'apple':
      return <AppleIcon fontSize="small" />;
    default:
      return null;
  }
};

const getTransactionTypeColor = (type: string): 'success' | 'error' | 'warning' | 'info' | 'default' => {
  switch (type?.toLowerCase()) {
    case 'purchase':
      return 'success';
    case 'renewal':
      return 'info';
    case 'refund':
      return 'error';
    case 'upgrade':
      return 'warning';
    default:
      return 'default';
  }
};

export const SubscriptionTransactionsDisplay: React.FC<SubscriptionTransactionsDisplayProps> = ({ userId }) => {
  const { i18n } = useTranslation();
  const { 
    subscriptionTransactions, 
    loadingSubscriptionTransactions, 
    fetchSubscriptionTransactions 
  } = useClientContext();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SubscriptionTransaction | null>(null);

  useEffect(() => {
    if (userId) {
      console.log(`Fetching subscription transactions for user ID: ${userId}`);
      fetchSubscriptionTransactions(userId);
    }
  }, [userId, fetchSubscriptionTransactions]);

  const handleRefresh = () => {
    if (userId) {
      fetchSubscriptionTransactions(userId);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubscriptionClick = (subscriptionId: number) => {
    setSelectedSubscriptionId(subscriptionId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSubscriptionId(null);
  };

  const handleDetailsOpen = (transaction: SubscriptionTransaction) => {
    setSelectedTransaction(transaction);
    setDetailsDialogOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsDialogOpen(false);
    setSelectedTransaction(null);
  };

  if (loadingSubscriptionTransactions) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (!subscriptionTransactions || subscriptionTransactions.length === 0) {
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
          <ReceiptLongIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Transaction History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No subscription transactions found for this user.
        </Typography>
      </Paper>
    );
  }

  const paginatedTransactions: SubscriptionTransaction[] = subscriptionTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {/* Header with refresh button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptLongIcon />
          Subscription Transactions ({subscriptionTransactions.length})
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh} size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Card elevation={3}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ width: '100%' }}>
            <Table sx={{ width: '100%', tableLayout: 'auto' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: 12, py: 2 }}>Transaction</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: 12, py: 2 }}>Subscription</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: 12, py: 2 }}>Platform</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: 12, py: 2, minWidth: 200 }}>Billing Period</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: 12, py: 2 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: 12, py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: 12, py: 2 }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((transaction, index) => (
                  <TableRow 
                    key={transaction.id || index} 
                    hover
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: 'grey.50' },
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    {/* Transaction Info */}
                    <TableCell sx={{ fontSize: 11 }}>
                      <Box>
                        <Chip 
                          label={transaction.transactionType?.toUpperCase() || transaction.eventType}
                          size="small"
                          color={getTransactionTypeColor(transaction?.transactionType || '')}
                          sx={{ fontSize: 10, height: 20, mb: 0.5 }}
                        />
                        <Typography variant="caption" display="block" sx={{ fontSize: 10, fontFamily: 'monospace' }}>
                          ID: {transaction.id}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: 9 }}>
                          {formatDate(transaction.transactionDate, i18n.language)}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Subscription */}
                    <TableCell sx={{ fontSize: 11 }}>
                      {transaction.subscription ? (
                        <Box>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: 11,
                              cursor: 'pointer',
                              '&:hover': { color: 'primary.main' }
                            }}
                            onClick={() => transaction?.subscription?.id && handleSubscriptionClick(transaction.subscription.id)}
                          >
                            {transaction.subscription.title}
                          </Typography>
                          <Box
                            sx={{
                              width: 30,
                              height: 3,
                              backgroundColor: transaction.subscription.color,
                              borderRadius: 1,
                              mt: 0.5
                            }}
                          />
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: 9 }}>
                            Product: {transaction.androidProductId || transaction.appleProductId || '-'}
                          </Typography>
                        </Box>
                      ) : '-'}
                    </TableCell>

                    {/* Platform */}
                    <TableCell sx={{ fontSize: 11 }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {getPlatformIcon(transaction?.platform || "")}
                        <Typography variant="caption" sx={{ fontSize: 11 }}>
                          {transaction.platform?.toUpperCase()}
                        </Typography>
                      </Box>
                      {transaction.appleEnvironment && (
                        <Chip 
                          label={transaction.appleEnvironment}
                          size="small"
                          color={transaction.appleEnvironment === 'Production' ? 'success' : 'warning'}
                          sx={{ fontSize: 9, height: 18, mt: 0.5 }}
                        />
                      )}
                    </TableCell>

                    {/* Period */}
                    <TableCell sx={{ fontSize: 10, minWidth: 200 }}>
                      <Paper elevation={0} sx={{ p: 1.5, backgroundColor: 'primary.50', borderLeft: '3px solid', borderColor: 'primary.main' }}>
                        <Box display="flex" flexDirection="column" gap={0.5}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'success.main' }} />
                            <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600 }}>
                              {formatDate(transaction.periodStartDate, i18n.language)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ borderBottom: '1px dashed', borderColor: 'grey.300', my: 0.5 }} />
                          
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'error.main' }} />
                            <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600 }}>
                              {formatDate(transaction.periodEndDate, i18n.language)}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </TableCell>

                    {/* Amount */}
                    <TableCell sx={{ fontSize: 11, fontFamily: 'monospace' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 11 }}>
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </Typography>
                      {transaction.refundedAt && (
                        <Chip 
                          label={`Refunded ${transaction.refundAmount ? formatCurrency(transaction.refundAmount, transaction.currency) : ''}`}
                          size="small"
                          color="error"
                          sx={{ fontSize: 9, height: 18, mt: 0.5 }}
                        />
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell sx={{ fontSize: 11 }}>
                      <Chip 
                        label={transaction.status?.toUpperCase() || 'N/A'}
                        size="small"
                        color={transaction.status?.toLowerCase() === 'completed' ? 'success' : 'default'}
                        sx={{ fontSize: 10, height: 20 }}
                      />
                    </TableCell>

                    {/* Details */}
                    <TableCell sx={{ fontSize: 11, textAlign: 'center' }}>
                      <Chip
                        label="Technical Details"
                        size="small"
                        onClick={() => handleDetailsOpen(transaction)}
                        sx={{ 
                          fontSize: 10, 
                          height: 24,
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white'
                          }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={subscriptionTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Subscription Detail Dialog */}
      <SubscriptionDetailDialog
        open={dialogOpen}
        subscriptionId={selectedSubscriptionId}
        onClose={handleDialogClose}
      />

      {/* Transaction Details Dialog */}
      <TransactionDetailDialog
        open={detailsDialogOpen}
        transaction={selectedTransaction}
        onClose={handleDetailsClose}
      />
    </Box>
  );
};

export default SubscriptionTransactionsDisplay;
