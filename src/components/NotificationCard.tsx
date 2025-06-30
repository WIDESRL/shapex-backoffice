import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import MailIcon from '../icons/MailIcon';
import PushNotificationsIcon from '../icons/PushNotificationsIcon';

interface NotificationCardProps {
  notification: {
    id: number;
    title: string;
    description: string;
    type: 'push' | 'email';
    metadata: Record<string, unknown> | null;
    createdAt: string;
  };
}

const styles = {
  notificationCard: {
    p: 3,
    borderRadius: 2,
    border: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: '#333',
  },
  actionIcon: {
    fontSize: 20,
    color: '#666',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.5,
    mb: 2,
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    minWidth: 80,
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: 500,
  },
};

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const getIcon = (type: 'push' | 'email') => {
    switch (type) {
      case 'email':
        return <MailIcon style={styles.actionIcon} />;
      case 'push':
        return <PushNotificationsIcon style={styles.actionIcon} />;
      default:
        return <PushNotificationsIcon style={styles.actionIcon} />;
    }
  };

  const getTypeName = (type: 'push' | 'email') => {
    switch (type) {
      case 'email':
        return 'Mail';
      case 'push':
        return 'Notifica Push';
      default:
        return 'Notifica Push';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Paper sx={styles.notificationCard} elevation={0}>
      <Box sx={styles.cardHeader}>
        <Typography sx={styles.cardTitle}>
          {notification.title}
        </Typography>
        <IconButton size="small" sx={{ color: '#666' }}>
          {getIcon(notification.type)}
        </IconButton>
      </Box>
      
      <Typography sx={styles.cardDescription}>
        {notification.description}
      </Typography>

      <Box sx={styles.cardDetails}>
        <Box sx={styles.detailRow}>
          <Typography sx={styles.detailLabel}>Data invio:</Typography>
          <Typography sx={styles.detailValue}>{formatDate(notification.createdAt)}</Typography>
        </Box>
        
        <Box sx={styles.detailRow}>
          <Typography sx={styles.detailLabel}>Tipologia:</Typography>
          <Typography sx={styles.detailValue}>{getTypeName(notification.type)}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default NotificationCard;
