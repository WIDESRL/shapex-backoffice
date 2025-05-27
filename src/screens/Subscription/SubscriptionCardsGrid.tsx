import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Subscription } from '../../Context/SubscriptionsContext';
import TrashIcon from '../../icons/TrashIcon';
import PencilIcon from '../../icons/PencilIcon';

interface SubscriptionCardsGridProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: number) => void;
}

const getStatusLabel = (vip: boolean, t: any) => (vip ? 'VIP' : t('subscriptions.normalStatus', 'Normale'));

const SubscriptionCardsGrid: React.FC<SubscriptionCardsGridProps> = ({ subscriptions, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
      {subscriptions.map((sub) => (
        <Box
          key={sub.id}
          sx={{
            flex: '1 1 calc(33.333% - 32px)',
            minWidth: 280,
            maxWidth: 400,
            background: '#f6f6f6',
            borderRadius: 3,
            p: 2.5,
            boxShadow: 0,
            minHeight: 210,
            position: 'relative',
            fontFamily: 'Montserrat, sans-serif',
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 400,
              color: '#616160',
              mb: 1,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            {sub.title}
          </Typography>
          <IconButton
            onClick={() => onDelete(sub.id)}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: '#616160',
              background: 'transparent',
              '&:hover': { background: '#ececec' },
            }}
            size="small"
            aria-label={t('subscriptions.delete')}
          >
            <TrashIcon style={{ width: 35, height: 35}} />
          </IconButton>
          <Typography sx={{ fontSize: 13, color: '#888', mb: 1.5, fontFamily: 'Montserrat, sans-serif' }}>
            {sub.description ||
              'Descrizione, ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography sx={{ fontSize: 15, color: '#616160', fontWeight: 500, mr: 1, fontFamily: 'Montserrat, sans-serif' }}>
              Colore:
            </Typography>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: sub.color,
                border: '1px solid #ccc',
                ml: 0.5,
              }}
            />
          </Box>
          <Typography sx={{ fontSize: 15, color: '#616160', fontWeight: 500, mt: 0.5, fontFamily: 'Montserrat, sans-serif' }}>
            Durata: <span style={{ fontWeight: 700 }}>{sub.duration}</span> gg
          </Typography>
          <Typography sx={{ fontSize: 15, color: '#616160', fontWeight: 500, mt: 0.5, fontFamily: 'Montserrat, sans-serif' }}>
            Ordine: <span style={{ fontWeight: 700 }}>{sub.order}</span>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 15, color: '#888', fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>
              Status: <span style={{ color: '#616160', fontWeight: 600 }}>{getStatusLabel(sub.vip, t)}</span>
            </Typography>
            <Button
              variant="contained"
              onClick={() => onEdit(sub)}
              sx={{
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
              }}
            >
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400, fontSize: 18, marginRight: 8 }}>
                Modifica
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
