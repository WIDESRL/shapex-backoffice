import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useClientContext } from '../../../../Context/ClientContext';
import { UserCall } from '../../../../Context/ClientContext';
import CallCard from '../../../../components/CallCard';
import SubscriptionDetailDialog from '../../../../components/SubscriptionDetailDialog';

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
  callsGrid: {
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
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    mt: 3,
    mb: 2,
  },
  loadMoreButton: {
    borderRadius: 3,
    fontWeight: 500,
    color: '#E6BB4A',
    borderColor: '#E6BB4A',
    textTransform: 'none',
    px: 4,
    py: 1.5,
    '&:hover': {
      borderColor: '#d1a53d',
      backgroundColor: 'rgba(230, 187, 74, 0.1)',
    },
    '&:disabled': {
      borderColor: '#e0e0e0',
      color: '#bdbdbd',
    }
  },
  filtersContainer: {
    display: 'flex',
    gap: 2,
    mb: 3,
    alignItems: 'center',
  },
  filterSelect: {
    minWidth: 150,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      height: 40,
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.875rem',
    }
  },
  paginationInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mt: 2,
    mb: 1,
    color: '#666',
    fontSize: '0.875rem',
  },
};

const CallsTab: React.FC = () => {
  const { t } = useTranslation();
  const { clientId } = useParams<{ clientId: string }>();
  const { 
    userCalls, 
    loadingUserCalls, 
    userCallsPagination,
    fetchUserCalls 
  } = useClientContext();

  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Subscription dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);

  useEffect(() => {
    console.log({userCalls})
  } , [userCalls])
  // Fetch calls when component mounts or filters change
  useEffect(() => {
    if (clientId) {
      setHasInitialFetch(true);
      const usedParam = statusFilter === 'all' ? undefined : statusFilter === 'used';
      const typeParam = typeFilter === 'all' ? undefined : (typeFilter as 'Extra' | 'Supplementary');
      fetchUserCalls(clientId, 1, 20, false, usedParam, typeParam);
    }
  }, [clientId, fetchUserCalls, statusFilter, typeFilter]);

  // Handle load more
  const handleLoadMore = () => {
    if (clientId && userCallsPagination?.hasNext) {
      const nextPage = userCallsPagination.page + 1;
      const usedParam = statusFilter === 'all' ? undefined : statusFilter === 'used';
      const typeParam = typeFilter === 'all' ? undefined : (typeFilter as 'Extra' | 'Supplementary');
      fetchUserCalls(clientId, nextPage, 20, true, usedParam, typeParam);
    }
  };

  // Handle filter changes
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
  };

  // Handle subscription click
  const handleSubscriptionClick = (subscriptionId: number) => {
    setSelectedSubscriptionId(subscriptionId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSubscriptionId(null);
  };

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

  // Get call type label
  const getCallTypeLabel = (type: UserCall['type']) => {
    switch (type) {
      case 'Extra':
        return t('client.altro.calls.types.extra');
      case 'Supplementary':
        return t('client.altro.calls.types.supplementary');
      default:
        return type;
    }
  };

  // Get call type color
  const getCallTypeColor = (type: UserCall['type']) => {
    switch (type) {
      case 'Extra':
        return '#ff9800'; // Orange
      case 'Supplementary':
        return '#2196f3'; // Blue
      default:
        return '#757575'; // Grey
    }
  };

  // Get call status color
  const getCallStatusColor = (call: UserCall) => {
    return call.usedAt ? '#4caf50' : '#E6BB4A';
  };

  // Get call status label
  const getCallStatusLabel = (call: UserCall) => {
    return call.usedAt 
      ? t('client.altro.calls.status.used') 
      : t('client.altro.calls.status.available');
  };

  // Get call title
  const getCallTitle = (call: UserCall) => {
    if (call.type === 'Extra' && call.product?.title) {
      return call.product.title;
    }
    return getCallTypeLabel(call.type);
  };

  // Get call subtitle
  const getCallSubtitle = (call: UserCall) => {
    if (call.type === 'Supplementary' && call.subscription?.subscription?.title) {
      return t('client.altro.calls.fromSubscription', { subscription: call.subscription.subscription.title });
    }
    return call.type === 'Extra' 
      ? t('client.altro.calls.purchasedCall') 
      : t('client.altro.calls.subscriptionCall');
  };

  // Loading component
  const LoadingState = () => (
    <Box sx={styles.loadingContainer}>
      <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
      <Typography sx={styles.loadingText}>
        {t('client.altro.calls.loading')}
      </Typography>
    </Box>
  );

  // Empty state component
  const EmptyState = () => (
    <Box sx={styles.emptyState}>
      <Paper sx={styles.emptyStateCard} elevation={0}>
        <Box sx={styles.emptyStateIcon}>
          📞
        </Box>
        <Typography sx={styles.emptyStateTitle}>
          {t('client.altro.calls.emptyState.title')}
        </Typography>
        <Typography sx={styles.emptyStateDescription}>
          {t('client.altro.calls.emptyState.description')}
        </Typography>
        <Typography sx={styles.emptyStateSubtext}>
          {t('client.altro.calls.emptyState.subtitle')}
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <Box sx={styles.container}>
      {/* Filters */}
      <Box sx={styles.filtersContainer}>
        <FormControl sx={styles.filterSelect}>
          <InputLabel id="status-filter-label">
            {t('client.altro.calls.filters.status')}
          </InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label={t('client.altro.calls.filters.status')}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <MenuItem value="all">
              {t('client.altro.calls.filters.allStatuses')}
            </MenuItem>
            <MenuItem value="used">
              {t('client.altro.calls.filters.used')}
            </MenuItem>
            <MenuItem value="available">
              {t('client.altro.calls.filters.available')}
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={styles.filterSelect}>
          <InputLabel id="type-filter-label">
            {t('client.altro.calls.filters.type')}
          </InputLabel>
          <Select
            labelId="type-filter-label"
            value={typeFilter}
            label={t('client.altro.calls.filters.type')}
            onChange={(e) => handleTypeFilterChange(e.target.value)}
          >
            <MenuItem value="all">
              {t('client.altro.calls.filters.allTypes')}
            </MenuItem>
            <MenuItem value="Extra">
              {t('client.altro.calls.filters.extra')}
            </MenuItem>
            <MenuItem value="Supplementary">
              {t('client.altro.calls.filters.supplementary')}
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={styles.scrollContainer}>
        {(loadingUserCalls && userCalls.length === 0) || !hasInitialFetch ? (
          <LoadingState />
        ) : userCalls.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <Box sx={styles.callsGrid}>
              {userCalls.map((call) => (
                <CallCard 
                  key={call.id} 
                  call={call}
                  title={getCallTitle(call)}
                  subtitle={getCallSubtitle(call)}
                  typeLabel={getCallTypeLabel(call.type)}
                  typeColor={getCallTypeColor(call.type)}
                  statusLabel={getCallStatusLabel(call)}
                  statusColor={getCallStatusColor(call)}
                  createdDate={formatDate(call.createdAt)}
                  usedDate={call.usedAt ? formatDate(call.usedAt) : undefined}
                  onSubscriptionClick={handleSubscriptionClick}
                />
              ))}
            </Box>
            {/* Pagination Info */}
            {userCallsPagination && (
              <Typography sx={styles.paginationInfo}>
                {t('client.altro.calls.pagination.showing', { 
                  current: userCalls.length, 
                  total: userCallsPagination.total 
                })} ({t('client.altro.calls.pagination.page', { 
                  current: userCallsPagination.page, 
                  total: userCallsPagination.totalPages 
                })})
              </Typography>
            )}
            
            {/* Load More Button */}
            {userCallsPagination?.hasNext && (
              <Box sx={styles.loadMoreContainer}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={loadingUserCalls}
                  sx={styles.loadMoreButton}
                >
                  {loadingUserCalls ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      {t('client.altro.calls.loadingMore')}
                    </>
                  ) : (
                    `${t('client.altro.calls.loadMore')} (${userCallsPagination.page}/${userCallsPagination.totalPages})`
                  )}
                </Button>
              </Box>
            )}
          </>
        )}
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

export default CallsTab;