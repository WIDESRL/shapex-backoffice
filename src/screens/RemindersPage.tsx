import React, { useState, useCallback, useEffect } from 'react';
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
import RemindersIcon from '../icons/RemindersIcon';
import RefreshIcon from '@mui/icons-material/Refresh';
import SubscriptionDetailDialog from '../components/SubscriptionDetailDialog';
import { getContrastColor } from '../utils/colorUtils';

const styles = {
  container: {
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '90vh',
    overflow: 'auto',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
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
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
    mb: 3,
    lineHeight: 1.6,
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
      backgroundColor: 'rgba(230, 187, 74, 0.08)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(230, 187, 74, 0.2)',
    },
    minWidth: 120,
    borderRadius: 6,
    fontWeight: 500,
    transition: 'all 0.3s ease',
    textTransform: 'none',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    border: 'none',
    minHeight: '200px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  tableHeader: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    '& .MuiTableCell-head': {
      fontWeight: 600,
      color: '#495057',
      fontSize: 14,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '2px solid #dee2e6',
      py: 2.5,
    },
  },
  tableRow: {
    '&:hover': {
      backgroundColor: '#f8f9fa',
      transform: 'scale(1.001)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderBottom: '1px solid #f1f3f4',
  },
  userName: {
    fontWeight: 600,
    color: '#2c3e50',
    fontSize: 15,
    letterSpacing: '0.2px',
  },
  userEmail: {
    color: '#6c757d',
    fontSize: 13,
    fontStyle: 'italic',
    mt: 0.5,
  },
  subscriptionChip: {
    fontWeight: 600,
    fontSize: 12,
    borderRadius: 6,
    px: 2,
    py: 1.5,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '300px',
    '& .MuiChip-label': {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      maxWidth: '100%',
    },
  },
  dateCell: {
    color: '#495057',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'monospace',
  },
  daysCell: {
    fontWeight: 600,
    color: '#E6BB4A',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(230, 187, 74, 0.1)',
    borderRadius: 6,
    px: 2,
    py: 1,
    display: 'inline-block',
    minWidth: '80px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
    borderRadius: 4,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 6,
    color: '#bdbdbd',
    fontFamily: 'Montserrat, sans-serif',
  },
  emptyIcon: {
    fontSize: 72,
    mb: 3,
    color: '#E6BB4A',
    opacity: 0.6,
    filter: 'drop-shadow(0 2px 4px rgba(230, 187, 74, 0.2))',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 600,
    mb: 2,
    color: '#495057',
    letterSpacing: '0.5px',
  },
  emptyDesc: {
    fontSize: 15,
    color: '#6c757d',
    textAlign: 'center',
    maxWidth: 450,
    lineHeight: 1.6,
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
    fetchAllData
  } = useReminderContext();
  const { getConfigByName } = useGlobalConfig();
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);
  // Memoize the CHECK_REMINDER_DAYS_BEFORE config value
  const reminderDaysBefore = React.useMemo(() => {
    const config = getConfigByName('CHECK_REMINDER_DAYS_BEFORE');
    return config ? parseInt(config.value) : 3; // Default to 3 days if not found
  }, [getConfigByName]);

  const handleUserClick = (userId: number) => {
    navigate(`/clients/${userId}/diario/measurements`);
  };

  const handleRefreshAll = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

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

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Box sx={styles.container}>
      {/* Global Header with Refresh */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 5,
        p: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: 6,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(230, 187, 74, 0.1)',
      }}>
        <Typography sx={{ 
          fontSize: 40, 
          fontWeight: 300, 
          color: '#2c3e50', 
          fontFamily: 'Montserrat, sans-serif',
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
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
      <Box sx={{ 
        mb: 4,
        p: 3,
        background: 'linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)',
        borderRadius: 4,
        border: '1px solid rgba(230, 187, 74, 0.15)',
      }}>
        <Typography sx={{ 
          fontSize: 28, 
          fontWeight: 500, 
          color: '#2c3e50', 
          fontFamily: 'Montserrat, sans-serif',
          mb: 2,
          letterSpacing: '0.5px',
        }}>
          {t('reminders.subtitle')}
        </Typography>
        <Typography sx={{
          ...styles.subtitle,
          fontSize: 16,
          color: '#6c757d',
          mb: 2,
        }}>
          {t('reminders.subtitle.descriptive', { days: reminderDaysBefore })}
        </Typography>
        {usersNeedingReminders.length > 0 && (
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(230, 187, 74, 0.1)',
            borderRadius: 12,
            px: 3,
            py: 1.5,
            border: '1px solid rgba(230, 187, 74, 0.3)',
          }}>
            <Box sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#E6BB4A',
              mr: 1.5,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 },
              },
            }} />
            <Typography sx={{ 
              fontSize: 14, 
              color: '#B8860B', 
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.3px',
            }}>
              {usersNeedingReminders.length} {usersNeedingReminders.length === 1 
                ? t('reminders.count.single') 
                : t('reminders.count.multiple')
              }
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      {loading ? (
        <Box sx={styles.loadingContainer}>
          <CircularProgress />
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
              {usersNeedingReminders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={styles.emptyState}>
                      <RemindersIcon style={styles.emptyIcon} stroke="#000" />
                      <Typography sx={styles.emptyTitle}>
                        {t('reminders.emptyState.title')}
                      </Typography>
                      <Typography sx={styles.emptyDesc}>
                        {t('reminders.emptyState.description')}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                usersNeedingReminders.map((reminder) => (
                  <TableRow
                    key={reminder?.userId}
                    sx={styles.tableRow}
                    onClick={() => handleUserClick(reminder?.userId)}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Box>
                        <Typography sx={styles.userName}>
                          {getUserFullName(reminder?.user?.firstName, reminder?.user?.lastName)}
                        </Typography>
                        <Typography sx={styles.userEmail}>
                          {reminder?.user?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={truncateText(reminder?.subscription?.title)}
                        sx={{
                          ...styles.subscriptionChip,
                          backgroundColor: reminder?.subscription?.color,
                          color: getContrastColor(reminder?.subscription?.color || '#ffffff'),
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.9,
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                        size="small"
                        onClick={(e) => handleSubscriptionClick(e, reminder?.subscription?.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography sx={styles.dateCell}>
                        {formatDate(reminder?.nextCheckDate)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, textAlign: 'center' }}>
                      <Typography sx={styles.daysCell}>
                        {reminder?.daysBetweenChecks} {t('reminders.table.days')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Overdue Checks Section */}
      <Box sx={{ mt: 6 }}>
        <Box sx={{ 
          mb: 4,
          p: 3,
          background: 'linear-gradient(135deg, #ffeaea 0%, #ffffff 100%)',
          borderRadius: 4,
          border: '1px solid rgba(231, 76, 60, 0.15)',
        }}>
          <Typography sx={{ 
            fontSize: 28, 
            fontWeight: 500, 
            color: '#2c3e50', 
            fontFamily: 'Montserrat, sans-serif',
            mb: 2,
            letterSpacing: '0.5px',
          }}>
            {t('reminders.overdue.title')}
          </Typography>
          <Typography sx={{
            ...styles.subtitle,
            fontSize: 16,
            color: '#6c757d',
            mb: 2,
          }}>
            {t('reminders.overdue.subtitle')}
          </Typography>
          {usersWithOverdueChecks.length > 0 && (
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              borderRadius: 12,
              px: 3,
              py: 1.5,
              border: '1px solid rgba(231, 76, 60, 0.3)',
            }}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#E74C3C',
                mr: 1.5,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                },
              }} />
              <Typography sx={{ 
                fontSize: 14, 
                color: '#C0392B', 
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.3px',
              }}>
                {usersWithOverdueChecks.length} {usersWithOverdueChecks.length === 1 
                  ? t('reminders.overdue.count.single') 
                  : t('reminders.overdue.count.multiple')
                }
              </Typography>
            </Box>
          )}
        </Box>

        {/* Overdue Content */}
        {overdueLoading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress />
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
                {usersWithOverdueChecks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                      <Box sx={styles.emptyState}>
                        <RemindersIcon style={styles.emptyIcon} stroke='#000' />
                        <Typography sx={styles.emptyTitle}>
                          {t('reminders.overdue.emptyState.title')}
                        </Typography>
                        <Typography sx={styles.emptyDesc}>
                          {t('reminders.overdue.emptyState.description')}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  usersWithOverdueChecks.map((overdueCheck) => (
                    <TableRow
                      key={overdueCheck?.userId}
                      sx={styles.tableRow}
                      onClick={() => handleUserClick(overdueCheck?.userId)}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Box>
                          <Typography sx={styles.userName}>
                            {getUserFullName(overdueCheck?.user?.firstName, overdueCheck?.user?.lastName)}
                          </Typography>
                          <Typography sx={styles.userEmail}>
                            {overdueCheck?.user?.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={truncateText(overdueCheck?.subscription?.title)}
                          sx={{
                            ...styles.subscriptionChip,
                            backgroundColor: overdueCheck?.subscription?.color,
                            color: getContrastColor(overdueCheck?.subscription?.color || '#ffffff'),
                            fontWeight: 600,
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.9,
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                          size="small"
                          onClick={(e) => handleSubscriptionClick(e, overdueCheck?.subscription?.id)}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography sx={styles.dateCell}>
                          {formatDate(overdueCheck?.scheduledDate)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2, textAlign: 'center' }}>
                        <Typography sx={{ 
                          fontWeight: 600,
                          color: '#E74C3C',
                          fontSize: 14,
                          backgroundColor: 'rgba(231, 76, 60, 0.1)',
                          borderRadius: 6,
                          px: 2,
                          py: 1,
                          display: 'inline-block',
                          minWidth: '100px',
                          border: '1px solid rgba(231, 76, 60, 0.2)',
                        }}>
                          {overdueCheck?.daysOverdue} {t('reminders.overdue.table.days')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
