import React from 'react';
import { Paper, Box, Typography, Chip } from '@mui/material';
import { UserConsent } from '../Context/ClientContext';

interface ConsentCardProps {
  consent: UserConsent;
  typeLabel: string;
  typeColor: string;
  dateLabel: string;
  grantedLabel: string;
}

const styles = {
  consentCard: {
    p: 3,
    borderRadius: 2,
    border: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      borderColor: '#d0d0d0',
    },
  },
  consentHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
  },
  consentType: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
  },
  consentDate: {
    fontSize: 12,
    color: '#757575',
    mt: 1,
  },
  consentChip: {
    fontSize: 11,
    fontWeight: 500,
    height: 24,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 1,
  },
  consentIcon: {
    fontSize: 20,
  },
};

const ConsentCard: React.FC<ConsentCardProps> = ({ 
  consent, 
  typeLabel, 
  typeColor, 
  dateLabel, 
  grantedLabel 
}) => {
  // Get icon based on consent type
  const getConsentIcon = (type: UserConsent['type']) => {
    switch (type) {
      case 'marketing':
        return '📧'; // Email/Marketing icon
      case 'dataProcessing':
        return '🔒'; // Data/Privacy icon
      case 'terms':
        return '📋'; // Terms/Document icon
      case 'photoTracking':
        return '📷'; // Photo/Camera icon
      default:
        return '✓'; // Generic checkmark
    }
  };

  return (
    <Paper sx={styles.consentCard} elevation={0}>
      <Box sx={styles.consentHeader}>
        <Box>
          <Box sx={styles.iconContainer}>
            <Box sx={styles.consentIcon}>
              {getConsentIcon(consent.type)}
            </Box>
            <Typography sx={styles.consentType}>
              {typeLabel}
            </Typography>
          </Box>
          <Typography sx={styles.consentDate}>
            {dateLabel}
          </Typography>
        </Box>
        <Chip
          label={grantedLabel}
          sx={{
            ...styles.consentChip,
            backgroundColor: typeColor,
            color: '#fff',
          }}
        />
      </Box>
    </Paper>
  );
};

export default ConsentCard;