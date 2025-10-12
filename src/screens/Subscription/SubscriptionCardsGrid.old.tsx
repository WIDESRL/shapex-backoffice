import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Subscription } from '../../Context/SubscriptionsContext';
import TrashIcon from '../../icons/TrashIcon';
import PencilIcon from '../../icons/PencilIcon';

interface SubscriptionCardsGridProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: number) => void;
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 3,
    mt: 1,
  },
  card: {
    flex: '1 1 calc(33.333% - 32px)',
    minWidth: 280,
    maxWidth: 400,
    background: '#f6f6f6',
    borderRadius: 3,
    p: 2.5,
    boxShadow: 0,
    minHeight: 210,
    // height: '100%',
    position: 'relative',
    fontFamily: 'Montserrat, sans-serif',
    mb: 1,
  },
  vipIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#EAB225',
    fontSize: 24,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
  title: {
    fontSize: 30,
    fontWeight: 400,
    color: '#616160',
    mb: 1,
    width: '90%',
    fontFamily: 'Montserrat, sans-serif',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: 1.2,
    height: '2.4em', 
    minHeight: '2.4em',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    color: '#616160',
    background: 'transparent',
    '&:hover': { background: '#ececec' },
  },
  description: {
    fontSize: 13,
    color: '#888',
    mb: 1.5,
    fontFamily: 'Montserrat, sans-serif',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    lineHeight: 1.4,
    height: '4.2em',
    minHeight: '2.8em',
  },
  fieldContainer: {
    display: 'flex',
    alignItems: 'center',
    mb: 0.5,
  },
  fieldLabel: {
    fontSize: 15,
    color: '#616160',
    fontWeight: 500,
    mr: 1,
    fontFamily: 'Montserrat, sans-serif',
  },
  colorCircle: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: '1px solid #ccc',
    ml: 0.5,
  },
  fieldValue: {
    fontSize: 15,
    color: '#616160',
    fontWeight: 500,
    mt: 0.5,
    fontFamily: 'Montserrat, sans-serif',
  },
  boldValue: {
    fontWeight: 700,
  },
  bottomContainer: {
    display: 'flex',
    alignItems: 'center',
    mt: 1.5,
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 15,
    color: '#888',
    fontWeight: 500,
    fontFamily: 'Montserrat, sans-serif',
  },
  statusValue: {
    color: '#616160',
    fontWeight: 600,
  },
  editButton: {
    background: '#E6BB4A',
    color: '#fff',
    borderRadius: 2,
    fontWeight: 400,
    fontSize: 18,
    px: 2.5,
    py: 0.2,
    minWidth: 120,
    minHeight: 40,
    boxShadow: 0,
    textTransform: 'none',
    fontFamily: 'Montserrat, sans-serif',
    '&:hover': { background: '#d1a53d' },
    display: 'flex',
    alignItems: 'center',
    gap: 1.2,
    justifyContent: 'center',
  },
  editButtonText: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 400,
    fontSize: 18,
    marginRight: 8,
  },
};

const getStatusLabel = (vip: boolean, t: ReturnType<typeof useTranslation>['t']) => (vip ? 'VIP' : t('subscriptions.normalStatus'));

const SubscriptionCardsGrid: React.FC<SubscriptionCardsGridProps> = ({ subscriptions, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Box sx={styles.container}>
      {subscriptions.map((sub) => (
        <Box key={sub.id} sx={styles.card}>
          {/* VIP Crown Icon */}
          {sub.vip && (
            <WorkspacePremiumIcon sx={styles.vipIcon} />
          )}
          
          <Typography sx={styles.title}>
            {sub.title}
          </Typography>
          
          <IconButton
            onClick={() => onDelete(sub.id)}
            sx={styles.deleteButton}
            size="small"
            aria-label={t('subscriptions.delete')}
          >
            <TrashIcon style={{ width: 35, height: 35}} />
          </IconButton>
          
          <Typography sx={styles.description}>
            {sub.description}
          </Typography>
          
          <Box sx={styles.fieldContainer}>
            <Typography sx={styles.fieldLabel}>
              {t('subscriptions.color')}:
            </Typography>
            <Box
              sx={{
                ...styles.colorCircle,
                background: sub.color,
              }}
            />
          </Box>
          
          <Typography sx={styles.fieldValue}>
            {t('subscriptions.duration')}: <span style={styles.boldValue}>{sub.duration}</span> {t('subscriptions.days')}
          </Typography>
          
          <Typography sx={styles.fieldValue}>
            {t('subscriptions.order')}: <span style={styles.boldValue}>{sub.order}</span>
          </Typography>
          
          <Box sx={styles.bottomContainer}>
            <Typography sx={styles.statusText}>
              {t('subscriptions.status')}: <span style={styles.statusValue}>{getStatusLabel(sub.vip, t)}</span>
            </Typography>
            
            <Button
              variant="contained"
              onClick={() => onEdit(sub)}
              sx={styles.editButton}
            >
              <span style={styles.editButtonText}>
                {t('subscriptions.edit')}
              </span>
              <PencilIcon style={{ width: 22, height: 22 }} />
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SubscriptionCardsGrid;
