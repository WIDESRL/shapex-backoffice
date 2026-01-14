import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  Avatar,
  IconButton,
  Badge,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Fade,
  Collapse,
  CircularProgress,
  Autocomplete,
  TextField,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import InfoIcon from '../icons/InfoIcon';
import FilterIcon from '../icons/FilterIcon';
import ImageCustom from '../components/ImageCustom';
import FitnessIcon from '@mui/icons-material/FitnessCenter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DateRangePicker from '../components/DateRangePicker';
import DeleteConfirmationDialog from './Subscription/DeleteConfirmationDialog';
import CheckDetailsDialog from '../components/CheckDetailsDialog';
import ExerciseDetailModal from './training/ExerciseDetailModal';
import { useSystemNotificationsContext, SystemNotification as SystemNotificationType, SystemNotificationFilters } from '../Context/SystemNotificationsContext';
import { useTraining } from '../Context/TrainingContext';

const styles = {
  container: {
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
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
  filterContainer: {
    p: 3,
    mb: 3,
    backgroundColor: 'white',
    borderRadius: 3,
    border: '1px solid #e0e0e0',
  },
  filterButton: {
    p: 1,
    borderRadius: 2,
    backgroundColor: '#f5f5f5',
    '&:hover': {
      backgroundColor: '#eeeeee',
    },
  },
  filterRow: {
    display: 'flex',
    gap: 2,
    mb: 2,
    flexWrap: 'wrap',
    alignItems: 'center',
    '&:last-child': {
      mb: 0,
    },
  },
  filterControl: {
    minWidth: 200,
    flex: 1,
    '@media (min-width: 1200px)': {
      flex: '1 1 calc(33.333% - 16px)', // Three columns on large screens
    },
    '@media (min-width: 900px) and (max-width: 1199px)': {
      flex: '1 1 calc(50% - 8px)', // Two columns on medium screens
    },
    '@media (max-width: 899px)': {
      flex: '1 1 100%', // Single column on small screens
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      background: '#fff',
    },
    '& .MuiAutocomplete-root .MuiOutlinedInput-root': {
      borderRadius: 2,
      background: '#fff',
    },
  },
  dateRangeContainer: {
    flex: 1,
    maxWidth: 300,
  },
  notificationsList: {
    flex: 1,
    overflow: 'auto',
    pr: 1,
    '& .MuiList-root': {
      padding: 0,
    },
    // Custom scrollbar styling
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#E6BB4A',
      borderRadius: '3px',
      '&:hover': {
        background: '#d1a53d',
      },
    },
    // Firefox scrollbar styling
    scrollbarWidth: 'thin',
    scrollbarColor: '#E6BB4A #f1f1f1',
  },
  notificationItem: {
    background: '#fff',
    borderRadius: 3,
    mb: 2,
    border: '1px solid #f0f0f0',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  },
  unreadItem: {
    borderLeft: '5px solid #E6BB4A',
    background: 'linear-gradient(135deg, #fffbf0 0%, #fef9e7 100%)',
    boxShadow: '0 2px 8px rgba(230, 187, 74, 0.15)',
    border: '1px solid #f0e68c',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(230, 187, 74, 0.25)',
      borderColor: '#E6BB4A',
    },
  },
  notificationContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 2,
    p: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: '#E6BB4A',
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    objectFit: 'cover' as const,
    marginRight: 12,
  },
  notificationBody: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    mb: 0.5,
  },
  unreadNotificationTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2c2c2c',
    fontFamily: 'Montserrat, sans-serif',
    mb: 0.5,
  },
  notificationDesc: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
    mb: 1,
  },
  notificationDescClickable: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
    mb: 1,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#E6BB4A',
      textDecoration: 'underline',
    },
  },
  clientName: {
    fontSize: 14,
    fontWeight: 500,
    color: '#E6BB4A',
    fontFamily: 'Montserrat, sans-serif',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#d1a53d',
      textDecoration: 'underline',
    },
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Montserrat, sans-serif',
    mt: 1,
  },
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flexShrink: 0,
  },
  typeIcon: {
    width: 20,
    height: 20,
    color: '#E6BB4A',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
  },
  emptyDesc: {
    fontSize: 14,
  },
};

const SystemNotificationsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    fetchSystemNotifications,
    fetchUnreadCount,
    updateNotificationStatus,
    page,
    setPage,
    totalPages,
    totalCount,
    clearNotifications,
    filterState,
    updateFilterState,
    resetFilters,
  } = useSystemNotificationsContext();

  const { 
    availableUsers, 
    loadingAvailableUsers, 
    fetchAllUsers,
  } = useTraining();

  // Extract filter state for easier access
  const { filterType, filterStatus, filterUserId, dateRange, showFilters } = filterState;
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    notificationId: number | null;
    action: 'read' | 'unread';
  }>({
    open: false,
    notificationId: null,
    action: 'read'
  });

  const [isPageChange, setIsPageChange] = useState(false);
  const [checkDialogOpen, setCheckDialogOpen] = useState(false);
  const [selectedCheckId, setSelectedCheckId] = useState<number | null>(null);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);

  // Refs to track debounce timeouts
  const fetchUnreadCountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchAllUsersTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced fetch functions
  const debouncedFetchUnreadCount = useCallback(() => {
    if (fetchUnreadCountTimeoutRef.current) {
      clearTimeout(fetchUnreadCountTimeoutRef.current);
    }
    fetchUnreadCountTimeoutRef.current = setTimeout(() => {
      fetchUnreadCount();
    }, 500);
  }, [fetchUnreadCount]);

  const debouncedFetchAllUsers = useCallback(() => {
    if (fetchAllUsersTimeoutRef.current) {
      clearTimeout(fetchAllUsersTimeoutRef.current);
    }
    fetchAllUsersTimeoutRef.current = setTimeout(() => {
      fetchAllUsers();
    }, 500);
  }, [fetchAllUsers]);

  // Create filters object based on current state
  const buildFilters = useCallback((): SystemNotificationFilters => {
    const filters: SystemNotificationFilters = {};
    
    if (filterType !== 'all') {
      filters.type = filterType as 'training_completed' | 'check_created' | 'check_updated' | 'exercise_completed' | 'program_assigned' | 'user_completed_profile' | 'user_purchased_subscription' | 'user_booked_extra_call' | 'user_booked_supplementary_call' | 'subscription_renewed' | 'subscription_tier_changed' | 'subscription_cancelled' | 'subscription_expired' | 'subscription_refunded' | 'subscription_payment_issue' | 'subscription_transferred';
    }
    
    if (filterStatus !== 'all') {
      filters.seen = filterStatus === 'read';
    }

    if (filterUserId) {
      filters.userId = filterUserId;
    }
    
    if (dateRange.startDate) {
      filters.startDate = dateRange.startDate.toISOString().split('T')[0];
    }
    
    if (dateRange.endDate) {
      filters.endDate = dateRange.endDate.toISOString().split('T')[0];
    }
    
    return filters;
  }, [filterType, filterStatus, filterUserId, dateRange.startDate, dateRange.endDate]);

  // Load notifications when filters change (reset to page 1)
  useEffect(() => {
    if (!isPageChange) {
      const filters = buildFilters();
      filters.page = 1;
      setPage(1);
      fetchSystemNotifications(filters, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterStatus, filterUserId, dateRange.startDate, dateRange.endDate]); // Don't include page/isPageChange to avoid loops

  // Load more notifications when page changes (and it's a page change, not filter change)
  useEffect(() => {
    if (isPageChange && page > 1) {
      const filters = buildFilters();
      filters.page = page;
      fetchSystemNotifications(filters, true);
      setIsPageChange(false);
    }
  }, [page, isPageChange, buildFilters, fetchSystemNotifications]);

  // Fetch unread count when component mounts
  useEffect(() => {
    debouncedFetchUnreadCount();
    
    return () => {
      if (fetchUnreadCountTimeoutRef.current) {
        clearTimeout(fetchUnreadCountTimeoutRef.current);
      }
    };
  }, [debouncedFetchUnreadCount]); // Empty dependency array to run only once on mount

  // Fetch users for the filter dropdown
  useEffect(() => {
    debouncedFetchAllUsers();
    
    return () => {
      if (fetchAllUsersTimeoutRef.current) {
        clearTimeout(fetchAllUsersTimeoutRef.current);
      }
    };
  }, [debouncedFetchAllUsers]); // Empty dependency array to run only once on mount

  // Load more function
  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      setIsPageChange(true); // Set flag to indicate this is a page change
      setPage(page + 1);
    }
  };

  // Helper function to get notification title based on type and related data
  const getNotificationTitle = (notification: SystemNotificationType) => {
    switch (notification.type) {
      case 'training_completed':
        return t('systemNotifications.types.trainingCompleted');
      case 'check_created':
        return t('systemNotifications.types.checkCreated');
      case 'check_updated':
        return t('systemNotifications.types.checkUpdated');
      case 'exercise_completed':
        return t('systemNotifications.types.exerciseCompleted');
      case 'program_assigned':
        return t('systemNotifications.types.programAssigned');
      case 'user_completed_profile':
        return t('systemNotifications.types.userCompletedProfile');
      case 'user_purchased_subscription':
        return t('systemNotifications.types.userPurchasedSubscription');
      case 'user_booked_extra_call':
        return t('systemNotifications.types.userBookedExtraCall');
      case 'user_booked_supplementary_call':
        return t('systemNotifications.types.userBookedSupplementaryCall');
      case 'subscription_renewed':
        return t('systemNotifications.types.subscriptionRenewed');
      case 'subscription_tier_changed':
        return t('systemNotifications.types.subscriptionTierChanged');
      case 'subscription_cancelled':
        return t('systemNotifications.types.subscriptionCancelled');
      case 'subscription_expired':
        return t('systemNotifications.types.subscriptionExpired');
      case 'subscription_refunded':
        return t('systemNotifications.types.subscriptionRefunded');
      case 'subscription_payment_issue':
        return t('systemNotifications.types.subscriptionPaymentIssue');
      case 'subscription_transferred':
        return t('systemNotifications.types.subscriptionTransferred');
      default:
        return 'System Notification';
    }
  };

  // Helper function to get notification description
  const getNotificationDescription = (notification: SystemNotificationType) => {
    switch (notification.type) {
      case 'training_completed':
        return notification.relatedData?.trainingProgram?.title 
          ? t('systemNotifications.descriptions.trainingCompletedWithTitle', { title: notification.relatedData.trainingProgram.title })
          : t('systemNotifications.descriptions.trainingCompletedGeneric');
      case 'check_created':
        return t('systemNotifications.descriptions.checkCreated');
      case 'check_updated':
        return t('systemNotifications.descriptions.checkUpdated');
      case 'exercise_completed':
        return notification.relatedData?.exercise?.title 
          ? t('systemNotifications.descriptions.exerciseCompletedWithTitle', { title: notification.relatedData.exercise.title })
          : t('systemNotifications.descriptions.exerciseCompletedGeneric');
      case 'program_assigned':
        return notification.relatedData?.trainingProgram?.title 
          ? t('systemNotifications.descriptions.programAssignedWithTitle', { title: notification.relatedData.trainingProgram.title })
          : t('systemNotifications.descriptions.programAssignedGeneric');
      case 'user_completed_profile':
        return t('systemNotifications.descriptions.userCompletedProfile');
      case 'user_purchased_subscription':
        return notification.relatedData?.subscription?.title 
          ? t('systemNotifications.descriptions.userPurchasedSubscriptionWithTitle', { title: notification.relatedData.subscription.title })
          : t('systemNotifications.descriptions.userPurchasedSubscriptionGeneric');
      case 'user_booked_extra_call':
        return notification.metadata.name 
          ? t('systemNotifications.descriptions.userBookedExtraCallWithName', { name: notification.metadata.name })
          : t('systemNotifications.descriptions.userBookedExtraCall');
      case 'user_booked_supplementary_call':
        return notification.metadata.name 
          ? t('systemNotifications.descriptions.userBookedSupplementaryCallWithName', { name: notification.metadata.name })
          : t('systemNotifications.descriptions.userBookedSupplementaryCall');
      case 'subscription_renewed':
        return notification.relatedData?.subscription?.title 
          ? t('systemNotifications.descriptions.subscriptionRenewedWithTitle', { title: notification.relatedData.subscription.title })
          : t('systemNotifications.descriptions.subscriptionRenewed');
      case 'subscription_tier_changed':
        return notification.relatedData?.subscription?.title 
          ? t('systemNotifications.descriptions.subscriptionTierChangedWithTitle', { title: notification.relatedData.subscription.title })
          : t('systemNotifications.descriptions.subscriptionTierChanged');
      case 'subscription_cancelled':
        return notification.relatedData?.subscription?.title 
          ? t('systemNotifications.descriptions.subscriptionCancelledWithTitle', { title: notification.relatedData.subscription.title })
          : t('systemNotifications.descriptions.subscriptionCancelled');
      case 'subscription_expired':
        return notification.relatedData?.subscription?.title 
          ? t('systemNotifications.descriptions.subscriptionExpiredWithTitle', { title: notification.relatedData.subscription.title })
          : t('systemNotifications.descriptions.subscriptionExpired');
      case 'subscription_refunded':
        return notification.relatedData?.subscription?.title 
          ? t('systemNotifications.descriptions.subscriptionRefundedWithTitle', { title: notification.relatedData.subscription.title })
          : t('systemNotifications.descriptions.subscriptionRefunded');
      case 'subscription_payment_issue':
        return notification.relatedData?.subscription?.title 
          ? t('systemNotifications.descriptions.subscriptionPaymentIssueWithTitle', { title: notification.relatedData.subscription.title })
          : t('systemNotifications.descriptions.subscriptionPaymentIssue');
      case 'subscription_transferred': {
        // Return description without previousUser name - will be rendered separately as clickable
        return notification.relatedData?.subscription?.title 
          ? t('systemNotifications.descriptions.subscriptionTransferredWithTitleOnly', { title: notification.relatedData.subscription.title })
          : t('systemNotifications.descriptions.subscriptionTransferredOnly');
      }
      default:
        return t('systemNotifications.descriptions.systemNotificationGeneric');
    }
  };

  // Helper function to check if notification description is clickable
  const isDescriptionClickable = (notification: SystemNotificationType) => {
    return (
      (notification.type === 'check_created' || notification.type === 'check_updated') && notification.relatedData?.check?.id
    ) || (
      notification.type === 'training_completed'
    ) || (
      notification.type === 'exercise_completed'
    ) || (
      notification.type === 'user_completed_profile'
    ) || (
      notification.type === 'user_purchased_subscription'
    ) || (
      notification.type === 'user_booked_extra_call'
    ) || (
      notification.type === 'user_booked_supplementary_call'
    ) || (
      notification.type === 'subscription_renewed'
    ) || (
      notification.type === 'subscription_tier_changed'
    ) || (
      notification.type === 'subscription_cancelled'
    ) || (
      notification.type === 'subscription_expired'
    ) || (
      notification.type === 'subscription_refunded'
    ) || (
      notification.type === 'subscription_payment_issue'
    ) || (
      notification.type === 'subscription_transferred'
    );
  };

  // Helper function to get check ID from notification
  const getCheckId = (notification: SystemNotificationType) => {
    return notification.relatedData.check?.id || null;
  };

  // Helper function to get workout exercise ID from notification
  const getWorkoutExerciseId = (notification: SystemNotificationType) => {
    return notification.relatedData.workoutExercise?.id || null;
  };

  // Helper function to get assignment ID from notification
  const getAssignmentId = (notification: SystemNotificationType) => {
    return notification.metadata.assignmentId || null;
  };

  // Helper function to get client name
  const getClientName = (notification: SystemNotificationType) => {
    const { firstName, lastName } = notification.user;
    return `${firstName || ''} ${lastName || ''}`.trim() || notification.user.email;
  };

  // Helper function to get client avatar
  const getClientAvatar = (notification: SystemNotificationType) => {
    if (notification.user.profilePictureFile?.signedUrl) {
      return notification.user.profilePictureFile.signedUrl;
    }
    const clientName = getClientName(notification);
    return clientName.substring(0, 2).toUpperCase();
  };

  // Get notification type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'training_completed':
        return <FitnessIcon sx={styles.typeIcon} />;
      case 'check_created':
      case 'check_updated':
        return <AssignmentIcon sx={styles.typeIcon} />;
      case 'exercise_completed':
        return <FitnessIcon sx={styles.typeIcon} />;
      case 'program_assigned':
        return <AssignmentIcon sx={styles.typeIcon} />;
      case 'user_completed_profile':
        return <PersonIcon sx={styles.typeIcon} />;
      case 'user_purchased_subscription':
        return <ShoppingCartIcon sx={styles.typeIcon} />;
      case 'user_booked_extra_call':
      case 'user_booked_supplementary_call':
        return <CameraAltIcon sx={styles.typeIcon} />;
      case 'subscription_renewed':
      case 'subscription_tier_changed':
      case 'subscription_cancelled':
      case 'subscription_expired':
      case 'subscription_refunded':
      case 'subscription_payment_issue':
      case 'subscription_transferred':
        return <ShoppingCartIcon sx={styles.typeIcon} />;
      default:
        return <InfoIcon style={styles.typeIcon} />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return t('systemNotifications.timeLabels.justNow');
    } else if (diffInHours < 24) {
      return `${diffInHours}${t('systemNotifications.timeLabels.hoursAgo')}`;
    } else {
      const locale = i18n.language === 'en' ? 'en-US' : 'it-IT';
      return date.toLocaleDateString(locale, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Handle filter changes
  const handleTypeFilterChange = (event: SelectChangeEvent<string>) => {
    updateFilterState({ filterType: event.target.value });
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    updateFilterState({ filterStatus: event.target.value });
  };

  // Handler for date range changes
  const handleDateRangeChange = (newDateRange: { startDate: Date | null; endDate: Date | null }) => {
    updateFilterState({ dateRange: newDateRange });
  };

  // Get users formatted for autocomplete - memoized to prevent unnecessary recalculations
  const clientOptions = useMemo(() => {
    return availableUsers.map(user => ({
      id: user.id,
      name: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.username,
      email: user.email,
      displayLabel: user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName} (${user.email})`
        : user.email
    }));
  }, [availableUsers]);

  // Handler for client selection change
  const handleClientChange = (_: React.SyntheticEvent, newValue: { id: number; name: string; email: string; displayLabel: string } | null) => {
    updateFilterState({ filterUserId: newValue ? newValue.id : null });
  };

  // Check if any filters are applied (not in default state)
  const hasActiveFilters = useCallback(() => {
    return (
      filterType !== 'all' ||
      filterStatus !== 'all' ||
      filterUserId !== null ||
      dateRange.startDate !== null ||
      dateRange.endDate !== null
    );
  }, [filterType, filterStatus, filterUserId, dateRange.startDate, dateRange.endDate]);

  // Clear all filters
  const handleClearFilters = () => {
    resetFilters();
    // Clear the notifications list to prevent appending old data
    clearNotifications();
  };

  // Handle read/unread toggle with confirmation
  const handleToggleReadStatus = (id: number, currentStatus: boolean) => {
    const action = currentStatus ? 'unread' : 'read';
    setConfirmDialog({
      open: true,
      notificationId: id,
      action: action
    });
  };

  // Confirm the read/unread action
  const handleConfirmToggle = async () => {
    if (confirmDialog.notificationId) {
      const newSeenStatus = confirmDialog.action === 'read';
      try {
        await updateNotificationStatus(confirmDialog.notificationId, newSeenStatus);
      } catch (error) {
        console.error('Error updating notification status:', error);
      }
    }
    setConfirmDialog({ open: false, notificationId: null, action: 'read' });
  };

  // Cancel the confirmation dialog
  const handleCancelToggle = () => {
    setConfirmDialog({ open: false, notificationId: null, action: 'read' });
  };

  // Handle client name click navigation
  const handleClientNameClick = (userId: number) => {
    navigate(`/clients/${userId}/anagrafica`);
  };

  // Handle check detail click
  const handleCheckClick = (checkId: number) => {
    setSelectedCheckId(checkId);
    setCheckDialogOpen(true);
  };

  // Handle description click for different notification types
  const handleDescriptionClick = (notification: SystemNotificationType) => {
    switch (notification.type) {
      case 'check_created':
      case 'check_updated': {
        const checkId = getCheckId(notification);
        if (checkId) {
          handleCheckClick(checkId);
        }
        break;
      }
      case 'training_completed': {
        const assignmentId = getAssignmentId(notification);
        if (assignmentId) {
          handleTrainingCompletedClick(assignmentId);
        }
        break;
      }
      case 'exercise_completed': {
        const workoutExerciseId = getWorkoutExerciseId(notification);
        const assignmentId = getAssignmentId(notification);
        if (workoutExerciseId && assignmentId) {
          handleExerciseCompletedClick(workoutExerciseId, assignmentId);
        }
        break;
      }
      case 'user_completed_profile': {
        navigate(`/clients/${notification.user.id}/diario/anamnesi`);
        break;
      }
      case 'user_purchased_subscription': {
        navigate(`/clients/${notification.user.id}/altro/subscription`);
        break;
      }
      case 'user_booked_extra_call':
      case 'user_booked_supplementary_call': {
        navigate(`/clients/${notification.user.id}/altro/calls`);
        break;
      }
      case 'subscription_renewed':
      case 'subscription_tier_changed':
      case 'subscription_cancelled':
      case 'subscription_expired':
      case 'subscription_refunded':
      case 'subscription_payment_issue': {
        navigate(`/clients/${notification.user.id}/altro/subscription`);
        break;
      }
      case 'subscription_transferred': {
        navigate(`/clients/${notification.user.id}/altro/subscription`);
        break;
      }
      default:
        // Do nothing for other types
        break;
    }
  };

  // Handle close check dialog
  const handleCloseCheckDialog = () => {
    setCheckDialogOpen(false);
    setSelectedCheckId(null);
  };

  // Handle training completed click (only assignmentId)
  const handleTrainingCompletedClick = (assignmentId: number) => {
    setSelectedAssignmentId(assignmentId);
    setSelectedExerciseId(null);
    setExerciseModalOpen(true);
  };

  // Handle exercise completed click (both exerciseId and assignmentId)
  const handleExerciseCompletedClick = (exerciseId: number, assignmentId: number) => {
    setSelectedExerciseId(exerciseId);
    setSelectedAssignmentId(assignmentId);
    setExerciseModalOpen(true);
  };

  // Handle close exercise modal
  const handleCloseExerciseModal = () => {
    setExerciseModalOpen(false);
    setSelectedExerciseId(null);
    setSelectedAssignmentId(null);
  };

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box>
        <Typography sx={styles.title}>
          {t('systemNotifications.title')}
          {unreadCount > 0 && (
            <Badge 
              badgeContent={unreadCount} 
              color="error" 
              sx={{ ml: 3 }}
            />
          )}
        </Typography>

        <Box sx={styles.headerContainer}>
          <Box>
            <Typography sx={styles.subtitle}>
              {t('systemNotifications.subtitle')}
            </Typography>
            {totalCount > 0 && (
              <Typography sx={{ 
                fontSize: 14, 
                color: '#E6BB4A', 
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
                mt: 0.5
              }}>
                {totalCount} {totalCount === 1 
                  ? t('systemNotifications.count.single') 
                  : t('systemNotifications.count.multiple')
                }
              </Typography>
            )}
          </Box>
          <IconButton 
            sx={styles.filterButton}
            onClick={() => updateFilterState({ showFilters: !showFilters })}
          >
            <FilterIcon style={{ color: '#bdbdbd', fontSize: 28 }} />
          </IconButton>
        </Box>

        {/* Collapsible Filter Section */}
        <Collapse in={showFilters}>
          <Paper sx={styles.filterContainer} elevation={0}>
            {/* First Row - Type and Status Filters */}
            <Box sx={styles.filterRow}>
              <FormControl sx={styles.filterControl} size="small">
                <InputLabel>{t('systemNotifications.filterType')}</InputLabel>
                <Select value={filterType} onChange={handleTypeFilterChange} label={t('systemNotifications.filterType')}>
                  <MenuItem value="all">{t('systemNotifications.filters.allTypes')}</MenuItem>
                  <MenuItem value="training_completed">{t('systemNotifications.filters.trainingCompleted')}</MenuItem>
                  <MenuItem value="check_created">{t('systemNotifications.filters.checkCreated')}</MenuItem>
                  <MenuItem value="check_updated">{t('systemNotifications.filters.checkUpdated')}</MenuItem>
                  <MenuItem value="exercise_completed">{t('systemNotifications.filters.exerciseCompleted')}</MenuItem>
                  <MenuItem value="user_completed_profile">{t('systemNotifications.filters.userCompletedProfile')}</MenuItem>
                  <MenuItem value="user_purchased_subscription">{t('systemNotifications.filters.userPurchasedSubscription')}</MenuItem>
                  <MenuItem value="user_booked_extra_call">{t('systemNotifications.filters.userBookedExtraCall')}</MenuItem>
                  <MenuItem value="user_booked_supplementary_call">{t('systemNotifications.filters.userBookedSupplementaryCall')}</MenuItem>
                  <MenuItem value="subscription_renewed">{t('systemNotifications.filters.subscriptionRenewed')}</MenuItem>
                  <MenuItem value="subscription_tier_changed">{t('systemNotifications.filters.subscriptionTierChanged')}</MenuItem>
                  <MenuItem value="subscription_cancelled">{t('systemNotifications.filters.subscriptionCancelled')}</MenuItem>
                  <MenuItem value="subscription_expired">{t('systemNotifications.filters.subscriptionExpired')}</MenuItem>
                  {/* <MenuItem value="subscription_refunded">{t('systemNotifications.filters.subscriptionRefunded')}</MenuItem> */}
                  <MenuItem value="subscription_payment_issue">{t('systemNotifications.filters.subscriptionPaymentIssue')}</MenuItem>
                  <MenuItem value="subscription_transferred">{t('systemNotifications.filters.subscriptionTransferred')}</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={styles.filterControl} size="small">
                <InputLabel>{t('systemNotifications.filterStatus')}</InputLabel>
                <Select value={filterStatus} onChange={handleStatusFilterChange} label={t('systemNotifications.filterStatus')}>
                  <MenuItem value="all">{t('systemNotifications.filters.all')}</MenuItem>
                  <MenuItem value="unread">{t('systemNotifications.filters.unread')}</MenuItem>
                  <MenuItem value="read">{t('systemNotifications.filters.read')}</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Second Row - User Filter */}
            <Box sx={styles.filterRow}>
              <Autocomplete
                size="small"
                sx={styles.filterControl}
                options={clientOptions}
                getOptionLabel={(option) => option.displayLabel}
                value={clientOptions.find(client => client.id === filterUserId) || null}
                onChange={handleClientChange}
                loading={loadingAvailableUsers}
                filterOptions={(options, { inputValue }) => {
                  const searchTerm = inputValue.toLowerCase();
                  return options.filter(option => 
                    option.name.toLowerCase().includes(searchTerm) ||
                    option.email.toLowerCase().includes(searchTerm)
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('systemNotifications.filters.user')}
                    placeholder={t('systemNotifications.filters.searchUsers')}
                  />
                )}
                noOptionsText={t('systemNotifications.autocomplete.noUsersFound')}
                clearText={t('systemNotifications.autocomplete.clear')}
                openText={t('systemNotifications.autocomplete.open')}
                closeText={t('systemNotifications.autocomplete.close')}
              />
            </Box>

            {/* Third Row - Date Range */}
            <Box sx={styles.filterRow}>
              <Typography sx={{ minWidth: 120, color: '#616160', fontWeight: 500 }}>
                {t('systemNotifications.filters.dateRange')}
              </Typography>
              <Box sx={styles.dateRangeContainer}>
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  placeholder={t('systemNotifications.filters.selectDateRange')}
                  size="small"
                />
              </Box>
            </Box>

            {/* Action Buttons Row */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleClearFilters}
                disabled={!hasActiveFilters()}
                sx={{
                  borderRadius: 2,
                  fontWeight: 500,
                  color: '#616160',
                  borderColor: '#e0e0e0',
                  textTransform: 'none',
                  '&:disabled': {
                    color: '#bdbdbd',
                    borderColor: '#f0f0f0',
                    backgroundColor: '#fafafa',
                  },
                }}
              >
                {t('systemNotifications.filters.clearAll')}
              </Button>
            </Box>
          </Paper>
        </Collapse>
      </Box>

      {/* Notifications List */}
      <Box sx={styles.notificationsList}>
        {notifications.length > 0 ? (
          <List>
            {notifications.map((notification) => {
              const clientName = getClientName(notification);
              const clientAvatar = getClientAvatar(notification);
              const title = getNotificationTitle(notification);
              const description = getNotificationDescription(notification);
              const isRead = notification.seen;
              const isClickable = isDescriptionClickable(notification);

              return (
                <Fade in key={notification.id} timeout={300}>
                  <Paper 
                    sx={{
                      ...styles.notificationItem,
                      ...(isRead ? {} : styles.unreadItem),
                    }}
                    elevation={0}
                  >
                    <Box sx={styles.notificationContent}>
                      {/* Type Icon */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                        {getTypeIcon(notification.type)}
                      </Box>

                      {/* Client Avatar */}
                      {notification.user.profilePictureFile?.signedUrl ? (
                        <ImageCustom
                          src={notification.user.profilePictureFile.signedUrl}
                          alt={clientName}
                          style={styles.avatarImage}
                          spinnerSize={20}
                        />
                      ) : (
                        <Avatar sx={styles.avatar}>
                          {clientAvatar}
                        </Avatar>
                      )}

                      {/* Notification Content */}
                      <Box sx={styles.notificationBody}>
                        <Typography sx={isRead ? styles.notificationTitle : styles.unreadNotificationTitle}>
                          {title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          {notification.type === 'subscription_transferred' ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 0.5 }}>
                              <Typography 
                                sx={isClickable ? styles.notificationDescClickable : styles.notificationDesc}
                                onClick={isClickable ? () => handleDescriptionClick(notification) : undefined}
                                component="span"
                              >
                                {description}
                              </Typography>
                              <Typography component="span" sx={{ ...styles.notificationDesc, display: 'inline' }}>
                                {t('systemNotifications.descriptions.from')}
                              </Typography>
                              <Typography 
                                component="span"
                                sx={styles.clientName}
                                onClick={() => {
                                  if (notification.relatedData?.previousUser?.id) {
                                    handleClientNameClick(notification.relatedData.previousUser.id);
                                  }
                                }}
                              >
                                {notification.relatedData?.previousUser 
                                  ? `${notification.relatedData.previousUser.firstName || ''} ${notification.relatedData.previousUser.lastName || ''}`.trim() || notification.relatedData.previousUser.email
                                  : t('systemNotifications.descriptions.unknownUser')}
                              </Typography>
                              {notification.metadata.platform && (
                                <Box 
                                  component="span"
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    backgroundColor: '#f5f5f5',
                                    border: '1px solid #e0e0e0',
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: '#666',
                                    textTransform: 'capitalize',
                                    fontFamily: 'Montserrat, sans-serif',
                                  }}
                                >
                                  {notification.metadata.platform}
                                </Box>
                              )}
                            </Box>
                          ) : (
                            <Typography 
                              sx={isClickable ? styles.notificationDescClickable : styles.notificationDesc}
                              onClick={isClickable ? () => handleDescriptionClick(notification) : undefined}
                            >
                              {description}
                            </Typography>
                          )}
                          {notification.type === 'subscription_cancelled' && (
                            <Tooltip 
                              title={t('systemNotifications.tooltips.subscriptionCancelled')}
                              arrow
                              placement="top"
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.2 }}>
                                <InfoIcon style={{ fontSize: 16, color: '#E6BB4A', cursor: 'pointer' }} />
                              </Box>
                            </Tooltip>
                          )}
                        </Box>
                        <Typography 
                          sx={styles.clientName}
                          onClick={() => handleClientNameClick(notification.user.id)}
                        >
                          {clientName}
                        </Typography>
                        <Typography sx={styles.timestamp}>
                          {formatTimestamp(notification.createdAt)}
                        </Typography>
                      </Box>

                      {/* Actions */}
                      <Box sx={styles.actionContainer}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleToggleReadStatus(notification.id, isRead)}
                          title={isRead ? t('systemNotifications.actions.markAsUnread') : t('systemNotifications.actions.markAsRead')}
                          sx={{
                            color: isRead ? '#4caf50' : '#E6BB4A',
                            '&:hover': {
                              backgroundColor: isRead ? 'rgba(76, 175, 80, 0.1)' : 'rgba(230, 187, 74, 0.1)',
                            }
                          }}
                        >
                          {isRead ? (
                            <CheckCircleIcon fontSize="small" />
                          ) : (
                            <RadioButtonUncheckedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                </Fade>
              );
            })}
          </List>
        ) : loading ? (
          <Box sx={styles.emptyState}>
            <CircularProgress sx={styles.emptyIcon} />
            <Typography sx={styles.emptyTitle}>
              {t('systemNotifications.loading')}
            </Typography>
          </Box>
        ) : (
          <Box sx={styles.emptyState}>
            <InfoIcon style={styles.emptyIcon} />
            <Typography sx={styles.emptyTitle}>
              {t('systemNotifications.emptyState.title')}
            </Typography>
            <Typography sx={styles.emptyDesc}>
              {t('systemNotifications.emptyState.description')}
            </Typography>
          </Box>
        )}

        {/* Load More Button */}
        {notifications.length > 0 && page < totalPages && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={handleLoadMore}
              disabled={loading}
              sx={{
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
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  {t('systemNotifications.loadingMore')}
                </>
              ) : (
                `${t('systemNotifications.loadMore')} (${page}/${totalPages})`
              )}
            </Button>
          </Box>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={confirmDialog.open}
        onClose={handleCancelToggle}
        onConfirm={handleConfirmToggle}
        title={confirmDialog.action === 'read' 
          ? t('systemNotifications.confirmDialog.markAsReadTitle') 
          : t('systemNotifications.confirmDialog.markAsUnreadTitle')
        }
        description={confirmDialog.action === 'read' 
          ? t('systemNotifications.confirmDialog.markAsReadMessage')
          : t('systemNotifications.confirmDialog.markAsUnreadMessage')
        }
      />

      {/* Check Details Dialog */}
      <CheckDetailsDialog
        open={checkDialogOpen}
        onClose={handleCloseCheckDialog}
        checkId={selectedCheckId}
      />

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        open={exerciseModalOpen}
        onClose={handleCloseExerciseModal}
        exerciseId={selectedExerciseId || undefined}
        assignmentId={selectedAssignmentId || undefined}
      />
    </Box>
  );
};

export default SystemNotificationsPage;
