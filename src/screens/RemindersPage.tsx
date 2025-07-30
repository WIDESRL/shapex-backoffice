import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useReminderContext } from '../Context/ReminderContext';
import { useGlobalConfig } from '../Context/GlobalConfigContext';
import InfoIcon from '../icons/InfoIcon';
import RefreshIcon from '@mui/icons-material/Refresh';
import SubscriptionDetailDialog from '../components/SubscriptionDetailDialog';
import { getContrastColor } from '../utils/colorUtils';

const styles = {
  container: {
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '90vh',
    overflow: 'auto',
  },
  title: {
    fontSize: 32,
    fontWeight: 300,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    mb: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Montserrat, sans-serif',
    mb: 3,
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 3,
  },
  refreshButton: {
    borderColor: '#E6BB4A',
    color: '#E6BB4A',
    '&:hover': {
      borderColor: '#d4a84a',
      backgroundColor: 'rgba(230, 187, 74, 0.04)',
    },
    minWidth: 120,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 2,
    border: '1px solid #e0e0e0',
    maxHeight: '400px',
    overflow: 'auto',
    minHeight: '200px',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    '& .MuiTableCell-head': {
      fontWeight: 600,
      color: '#333',
      fontSize: 14,
    },
  },
  tableRow: {
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    cursor: 'pointer',
  },
  userName: {
    fontWeight: 500,
    color: '#333',
    fontSize: 14,
  },
  userEmail: {
    color: '#666',
    fontSize: 12,
  },
  subscriptionChip: {
    fontWeight: 500,
    fontSize: 12,
    borderRadius: 2
  },
  dateCell: {
    color: '#333',
    fontSize: 14,
  },
  daysCell: {
    fontWeight: 500,
    color: '#E6BB4A',
    fontSize: 14,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: '#bdbdbd',
    fontFamily: 'Montserrat, sans-serif',
  },
  emptyIcon: {
    fontSize: 64,
    mb: 2,
    color: '#E6BB4A',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 500,
    mb: 1,
    color: '#333',
  },
  emptyDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    maxWidth: 400,
  },
};

const RemindersPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    usersNeedingReminders, 
    usersWithOverdueChecks,
    loading, 
    overdueLoading,
    fetchUsersNeedingReminders,
    fetchUsersWithOverdueChecks
  } = useReminderContext();
  const { getConfigByName } = useGlobalConfig();
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsersNeedingReminders();
    fetchUsersWithOverdueChecks();
  }, [fetchUsersNeedingReminders, fetchUsersWithOverdueChecks]);

  // Memoize the CHECK_REMINDER_DAYS_BEFORE config value
  const reminderDaysBefore = React.useMemo(() => {
    const config = getConfigByName('CHECK_REMINDER_DAYS_BEFORE');
    return config ? parseInt(config.value) : 3; // Default to 3 days if not found
  }, [getConfigByName]);

  const handleUserClick = (userId: number) => {
    navigate(`/clients/${userId}/diario/measurements`);
  };

  const handleRefreshAll = () => {
    fetchUsersNeedingReminders();
    fetchUsersWithOverdueChecks();
  };

  const handleSubscriptionClick = (event: React.MouseEvent, subscriptionId: number) => {
    event.stopPropagation(); // Prevent row click
    setSelectedSubscriptionId(subscriptionId);
    setSubscriptionDialogOpen(true);
  };

  const handleSubscriptionDialogClose = () => {
    setSubscriptionDialogOpen(false);
    setSelectedSubscriptionId(null);
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  const getUserFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`;
  };

  return (
    <Box sx={styles.container}>
      {/* Global Header with Refresh */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography sx={{ 
          fontSize: 36, 
          fontWeight: 300, 
          color: '#616160', 
          fontFamily: 'Montserrat, sans-serif' 
        }}>
          {t('reminders.title')}
        </Typography>
        <Button
          variant="outlined"
          startIcon={(loading || overdueLoading) ? <CircularProgress size={20} /> : <RefreshIcon />}
          onClick={handleRefreshAll}
          disabled={loading || overdueLoading}
          sx={styles.refreshButton}
        >
          {(loading || overdueLoading) ? t('common.loading') : t('common.refresh')}
        </Button>
      </Box>

      {/* Reminders Section Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ 
          fontSize: 24, 
          fontWeight: 400, 
          color: '#616160', 
          fontFamily: 'Montserrat, sans-serif',
          mb: 1 
        }}>
          {t('reminders.subtitle')}
        </Typography>
        <Typography sx={styles.subtitle}>
          {t('reminders.subtitle.descriptive', { days: reminderDaysBefore })}
        </Typography>
        {usersNeedingReminders.length > 0 && (
          <Typography sx={{ 
            fontSize: 14, 
            color: '#E6BB4A', 
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            mt: 0.5
          }}>
            {usersNeedingReminders.length} {usersNeedingReminders.length === 1 
              ? t('reminders.count.single') 
              : t('reminders.count.multiple')
            }
          </Typography>
        )}
      </Box>

      {/* Content */}
      {loading ? (
        <Box sx={styles.loadingContainer}>
          <CircularProgress />
        </Box>
      ) : usersNeedingReminders.length === 0 ? (
        <Box sx={styles.emptyState}>
          <InfoIcon style={styles.emptyIcon} />
          <Typography sx={styles.emptyTitle}>
            {t('reminders.emptyState.title')}
          </Typography>
          <Typography sx={styles.emptyDesc}>
            {t('reminders.emptyState.description')}
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table stickyHeader>
            <TableHead sx={styles.tableHeader}>
              <TableRow>
                <TableCell>{t('reminders.table.user')}</TableCell>
                <TableCell>{t('reminders.table.subscription')}</TableCell>
                <TableCell>{t('reminders.table.nextCheckDate')}</TableCell>
                <TableCell>{t('reminders.table.daysBetween')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersNeedingReminders.map((reminder) => (
                <TableRow
                  key={reminder?.userId}
                  sx={styles.tableRow}
                  onClick={() => handleUserClick(reminder?.userId)}
                >
                  <TableCell>
                    <Box>
                      <Typography sx={styles.userName}>
                        {getUserFullName(reminder?.user?.firstName, reminder?.user?.lastName)}
                      </Typography>
                      <Typography sx={styles.userEmail}>
                        {reminder?.user?.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={reminder?.subscription?.title}
                      sx={{
                        ...styles.subscriptionChip,
                        backgroundColor: reminder?.subscription?.color,
                        color: getContrastColor(reminder?.subscription?.color || '#ffffff'),
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8,
                          transform: 'scale(1.02)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                      size="small"
                      onClick={(e) => handleSubscriptionClick(e, reminder?.subscription?.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={styles.dateCell}>
                      {formatDate(reminder?.nextCheckDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={styles.daysCell}>
                      {reminder?.daysBetweenChecks} {t('reminders.table.days')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Overdue Checks Section */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ 
            fontSize: 24, 
            fontWeight: 400, 
            color: '#616160', 
            fontFamily: 'Montserrat, sans-serif',
            mb: 1 
          }}>
            {t('reminders.overdue.title')}
          </Typography>
          <Typography sx={styles.subtitle}>
            {t('reminders.overdue.subtitle')}
          </Typography>
          {usersWithOverdueChecks.length > 0 && (
            <Typography sx={{ 
              fontSize: 14, 
              color: '#E74C3C', 
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              mt: 0.5
            }}>
              {usersWithOverdueChecks.length} {usersWithOverdueChecks.length === 1 
                ? t('reminders.overdue.count.single') 
                : t('reminders.overdue.count.multiple')
              }
            </Typography>
          )}
        </Box>

        {/* Overdue Content */}
        {overdueLoading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress />
          </Box>
        ) : usersWithOverdueChecks.length === 0 ? (
          <Box sx={styles.emptyState}>
            <InfoIcon style={styles.emptyIcon} />
            <Typography sx={styles.emptyTitle}>
              {t('reminders.overdue.emptyState.title')}
            </Typography>
            <Typography sx={styles.emptyDesc}>
              {t('reminders.overdue.emptyState.description')}
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table stickyHeader>
              <TableHead sx={styles.tableHeader}>
                <TableRow>
                  <TableCell>{t('reminders.overdue.table.user')}</TableCell>
                  <TableCell>{t('reminders.overdue.table.subscription')}</TableCell>
                  <TableCell>{t('reminders.overdue.table.scheduledDate')}</TableCell>
                  <TableCell>{t('reminders.overdue.table.daysOverdue')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersWithOverdueChecks.map((overdueCheck) => (
                  <TableRow
                    key={overdueCheck?.userId}
                    sx={styles.tableRow}
                    onClick={() => handleUserClick(overdueCheck?.userId)}
                  >
                    <TableCell>
                      <Box>
                        <Typography sx={styles.userName}>
                          {getUserFullName(overdueCheck?.user?.firstName, overdueCheck?.user?.lastName)}
                        </Typography>
                        <Typography sx={styles.userEmail}>
                          {overdueCheck?.user?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={overdueCheck?.subscription?.title}
                        sx={{
                          ...styles.subscriptionChip,
                          backgroundColor: overdueCheck?.subscription?.color,
                          color: getContrastColor(overdueCheck?.subscription?.color || '#ffffff'),
                          fontWeight: 500,
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.8,
                            transform: 'scale(1.02)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                        size="small"
                        onClick={(e) => handleSubscriptionClick(e, overdueCheck?.subscription?.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={styles.dateCell}>
                        {formatDate(overdueCheck?.scheduledDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ 
                        fontWeight: 500,
                        color: '#E74C3C',
                        fontSize: 14,
                      }}>
                        {overdueCheck?.daysOverdue} {t('reminders.overdue.table.days')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Subscription Detail Dialog */}
      <SubscriptionDetailDialog
        open={subscriptionDialogOpen}
        subscriptionId={selectedSubscriptionId}
        onClose={handleSubscriptionDialogClose}
      />
    </Box>
  );
};

export default RemindersPage;
