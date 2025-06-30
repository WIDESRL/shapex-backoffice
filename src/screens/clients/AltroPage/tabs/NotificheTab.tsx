import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress, TextField, Button, Collapse, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { useClientContext } from '../../../../Context/ClientContext';
import NotificationCard from '../../../../components/NotificationCard';
import FilterIcon from '../../../../icons/FilterIcon';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    height: '100%',
    minHeight: '500px',
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#eeeeee',
      borderColor: '#d0d0d0',
    },
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#333',
  },
  filterIcon: {
    color: '#616160',
    fontSize: 20,
  },
  collapseContainer: {
    mb: 1.5,
  },
  filterContent: {
    backgroundColor: '#fafafa',
    border: '1px solid #e0e0e0',
    borderRadius: 2,
    p: 2.5,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  dateInputs: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    flexWrap: 'wrap',
    mb: 2,
  },
  dateField: {
    minWidth: 200,
    '& .MuiInputBase-root': {
      borderRadius: 1,
      backgroundColor: '#fff',
    },
    '& .MuiInputLabel-root': {
      fontSize: 14,
      color: '#757575',
    },
  },
  typeField: {
    minWidth: 150,
    '& .MuiInputBase-root': {
      borderRadius: 1,
      backgroundColor: '#fff',
    },
    '& .MuiInputLabel-root': {
      fontSize: 14,
      color: '#757575',
    },
  },
  filterButtons: {
    display: 'flex',
    gap: 1,
    justifyContent: 'flex-end',
  },
  applyButton: {
    backgroundColor: '#E6BB4A',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#d4a537',
    },
    textTransform: 'none',
    fontSize: 14,
    px: 3,
  },
  clearButton: {
    backgroundColor: 'transparent',
    color: '#757575',
    border: '1px solid #e0e0e0',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    textTransform: 'none',
    fontSize: 14,
    px: 3,
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
  notificationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: 3,
    pb: 2,
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    p: 3,
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

const NotificheTab: React.FC = () => {
  const { t } = useTranslation();
  const { clientId } = useParams<{ clientId: string }>();
  const { 
    userNotifications, 
    notificationsPagination, 
    loadingUserNotifications, 
    fetchUserNotifications 
  } = useClientContext();

  // Calculate default date range (1 year ago to today) - memoized to avoid recalculation
  const { defaultStartDate, defaultEndDate } = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    return {
      defaultStartDate: oneYearAgo.toISOString().split('T')[0],
      defaultEndDate: today.toISOString().split('T')[0]
    };
  }, []);
  
  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);
  const [notificationType, setNotificationType] = useState<string>('all');

  // Debounced fetch function to prevent excessive API calls
  const debouncedFetchNotifications = useMemo(
    () => debounce((clientId: string, page: number = 1, pageLimit: number = 20, startDate?: string, endDate?: string, type?: string, append: boolean = false) => {
      fetchUserNotifications(clientId, page, pageLimit, startDate, endDate, type, append);
    }, 200),
    [fetchUserNotifications]
  );

  // Fetch notifications when component mounts
  useEffect(() => {
    if (clientId) {
      debouncedFetchNotifications(clientId, 1, 20, defaultStartDate, defaultEndDate, 'all', false);
    }
  }, [clientId, defaultStartDate, defaultEndDate, debouncedFetchNotifications]);

  // Handle filter apply
  const handleApplyFilter = () => {
    if (clientId) {
      const typeParam = notificationType === 'all' ? undefined : notificationType;
      debouncedFetchNotifications(clientId, 1, 20, startDate || undefined, endDate || undefined, typeParam, false);
      setFilterOpen(false); // Close the filter section after applying
    }
  };

  // Handle filter clear
  const handleClearFilter = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setNotificationType('all');
    if (clientId) {
      debouncedFetchNotifications(clientId, 1, 20, defaultStartDate, defaultEndDate, undefined, false);
    }
  };

  // Toggle filter section
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  // Handle load more notifications
  const handleLoadMore = () => {
    if (clientId && notificationsPagination?.hasNextPage) {
      const nextPage = notificationsPagination.page + 1;
      const typeParam = notificationType === 'all' ? undefined : notificationType;
      debouncedFetchNotifications(clientId, nextPage, 20, startDate || undefined, endDate || undefined, typeParam, true);
    }
  };

  // Check if should show load more button
  const shouldShowLoadMore = notificationsPagination?.hasNextPage && 
    userNotifications.length < (notificationsPagination?.total || 0);

  // Loading component
  const LoadingState = () => (
    <Box sx={styles.loadingContainer}>
      <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
      <Typography sx={styles.loadingText}>
        {t('client.altro.notifiche.loading')}
      </Typography>
    </Box>
  );

  // Empty state component
  const EmptyState = () => (
    <Box sx={styles.emptyState}>
      <Paper sx={styles.emptyStateCard} elevation={0}>
        <Box sx={styles.emptyStateIcon}>
          📬
        </Box>
        <Typography sx={styles.emptyStateTitle}>
          {t('client.altro.notifiche.emptyState.title')}
        </Typography>
        <Typography sx={styles.emptyStateDescription}>
          {t('client.altro.notifiche.emptyState.description')}
        </Typography>
        <Typography sx={styles.emptyStateSubtext}>
          {t('client.altro.notifiche.emptyState.subtitle')}
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <Box sx={styles.container}>
      {/* Filter Header */}
      <Box sx={styles.filterHeader}>
        <Box 
          component="div" 
          sx={styles.filterButton}
          onClick={toggleFilter}
        >
          <FilterIcon style={styles.filterIcon} />
          <Typography sx={styles.filterButtonText}>
            {t('client.altro.notifiche.filters.title')}
          </Typography>
        </Box>
      </Box>

      {/* Collapsible Filter Section */}
      <Collapse in={filterOpen} sx={styles.collapseContainer}>
        <Box sx={styles.filterContent}>
          <Box sx={styles.dateInputs}>
            <TextField
              label={t('client.altro.notifiche.filters.startDate')}
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={styles.dateField}
            />
            <TextField
              label={t('client.altro.notifiche.filters.endDate')}
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={styles.dateField}
            />
            <FormControl size="small" sx={styles.typeField}>
              <InputLabel id="notification-type-label">
                {t('client.altro.notifiche.filters.type')}
              </InputLabel>
              <Select
                labelId="notification-type-label"
                value={notificationType}
                label={t('client.altro.notifiche.filters.type')}
                onChange={(e) => setNotificationType(e.target.value)}
              >
                <MenuItem value="all">{t('client.altro.notifiche.filters.allTypes')}</MenuItem>
                <MenuItem value="push">{t('client.altro.notifiche.filters.pushType')}</MenuItem>
                <MenuItem value="email">{t('client.altro.notifiche.filters.emailType')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={styles.filterButtons}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearFilter}
              sx={styles.clearButton}
            >
              {t('client.altro.notifiche.filters.clear')}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleApplyFilter}
              sx={styles.applyButton}
            >
              {t('client.altro.notifiche.filters.apply')}
            </Button>
          </Box>
        </Box>
      </Collapse>

      <Box sx={styles.scrollContainer}>
        {loadingUserNotifications && userNotifications.length === 0 ? (
          <LoadingState />
        ) : userNotifications.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <Box sx={styles.notificationGrid}>
              {userNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </Box>
            
            {/* Load More Section */}
            {shouldShowLoadMore && (
              <Box sx={styles.loadMoreContainer}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={loadingUserNotifications}
                  sx={{
                    textTransform: 'none',
                    fontSize: 14,
                    px: 4,
                    py: 1,
                    borderColor: '#E6BB4A',
                    color: '#E6BB4A',
                    '&:hover': {
                      backgroundColor: '#E6BB4A',
                      color: '#fff',
                    },
                  }}
                >
                  {loadingUserNotifications ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />
                      {t('client.altro.notifiche.loadingMore')}
                    </>
                  ) : (
                    t('client.altro.notifiche.loadMore')
                  )}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default NotificheTab;
