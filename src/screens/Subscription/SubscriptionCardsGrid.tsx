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

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: '1fr',
      md: 'repeat(2, 1fr)',
      lg: 'repeat(3, 1fr)',
      xl: 'repeat(4, 1fr)',
    },
    gap: 2,
    mt: 1,
  },
  card: {
    minWidth: 0, // Allow grid item to shrink below content size
    background: '#EDEDED',
    borderRadius: 3,
    p: 1.5,
    boxShadow: 0,
    position: 'relative',
    fontFamily: 'Montserrat, sans-serif',
    mb: 0.5,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    color: '#616160',
    background: 'transparent',
  },
  header: {
    mb: 1,
    pr: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
    mb: 0.3,
    fontFamily: 'Montserrat, sans-serif',
    width: '95%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  titleApp: {
    fontSize: 12,
    fontWeight: 400,
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
    width: '95%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  description: {
    fontSize: 11,
    color: '#666',
    mb: 1,
    lineHeight: 1.2,
    fontFamily: 'Montserrat, sans-serif',
  },
  infoRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr auto',
    gap: 1,
    mb: 0.8,
    fontSize: 12,
    fontFamily: 'Montserrat, sans-serif',
    alignItems: 'center',
  },
  infoLabel: {
    color: '#666',
    fontWeight: 500,
  },
  infoValue: {
    color: '#333',
    fontWeight: 600,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    mb: 1.5,
    gap: 1,
  },
  priceContainer: {
    flex: 1,
    textAlign: 'center',
    p: 1,
    borderRadius: 2,
    border: '2px solid',
  },
  regularPrice: {
    borderColor: '#2196f3',
  },
  discountPrice: {
    borderColor: '#9c27b0',
  },
  priceLabel: {
    fontSize: 10,
    color: '#666',
    mb: 0.2,
    fontFamily: 'Montserrat, sans-serif',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 700,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
  },
  paymentTypeRow: {
    mb: 1.5,
    fontSize: 12,
    fontFamily: 'Montserrat, sans-serif',
  },
  featuresSection: {
    mb: 1.5,
  },
  featureBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E2E2E2',
    borderRadius: 2,
    p: 0.8,
    mb: 0.5,
    border: 'none',
  },
  featureBarActive: {
    backgroundColor: '#E2E2E2',
    borderColor: 'transparent',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 0.5,
    mb: 0.5,
  },
  featureLabel: {
    color: '#333',
    fontWeight: 500,
    fontSize: 11,
    fontFamily: 'Montserrat, sans-serif',
  },
  featureValue: {
    color: '#333',
    fontWeight: 600,
    fontSize: 11,
    fontFamily: 'Montserrat, sans-serif',
  },
  supplementarySection: {
    mb: 1,
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    mt: 1,
  },
  visibilityInfo: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
  },
  editButton: {
    background: '#E6BB4A',
    color: '#fff',
    borderRadius: 2,
    fontWeight: 500,
    fontSize: 12,
    px: 1.5,
    py: 0.5,
    minWidth: 70,
    boxShadow: 0,
    textTransform: 'none',
    fontFamily: 'Montserrat, sans-serif',
    '&:hover': { background: '#d1a53d' },
  },
};

const SubscriptionCardsGrid: React.FC<SubscriptionCardsGridProps> = ({ subscriptions, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Box sx={styles.container}>
      {subscriptions.map((sub) => (
        <Box 
          key={sub.id} 
          sx={{
            ...styles.card,
            transition: 'opacity 0.2s ease-in-out'
          }}
        >
          <IconButton
            onClick={() => onDelete(sub.id)}
            sx={{
              ...styles.deleteButton,
              opacity: 1,
              zIndex: 2,
            }}
            size="small"
            aria-label={t('subscriptions.delete')}
          >
            <TrashIcon  />
          </IconButton>
          
          <Box sx={{ opacity: sub.visibleInFrontend ? 1 : 0.5 }}>
            {/* Header */}
            <Box sx={styles.header}>
            <Typography sx={styles.title}>
              {sub.title}
            </Typography>
            {sub.titleApp && (
              <Typography sx={styles.titleApp}>
                {sub.titleApp}
              </Typography>
            )}
          </Box>
          
          {/* Description */}
          <Typography sx={styles.description}>
            {sub.description}
          </Typography>
          
          {/* All Fields as Bars in 2-column layout */}
          <Box sx={styles.fieldRow}>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.ordine')}</Typography>
              <Typography sx={styles.featureValue}>{sub.order}</Typography>
            </Box>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.durata')}</Typography>
              <Typography sx={styles.featureValue}>{sub.duration} gg</Typography>
            </Box>
          </Box>
          
          <Box sx={styles.fieldRow}>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.colore')}</Typography>
              <Typography sx={styles.featureValue}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: 20,
                    height: 20,
                    backgroundColor: sub.color,
                    borderRadius: '50%',
                    border: '1px solid #ccc',
                    verticalAlign: 'middle'
                  }}
                />
              </Typography>
            </Box>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.controlliMensili')}</Typography>
              <Typography sx={styles.featureValue}>{sub.monthlyChecks}</Typography>
            </Box>
          </Box>
          
          <Box sx={styles.fieldRow}>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.prezzo')}</Typography>
              <Typography sx={styles.featureValue}>{sub.price.toFixed(2)}€</Typography>
            </Box>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.prezzoScontato')}</Typography>
              <Typography sx={styles.featureValue}>
                {sub.discountPrice && sub.discountPrice > 0 ? `${sub.discountPrice.toFixed(2)}€` : ''}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={styles.fieldRow}>
            <Box sx={styles.featureBar} style={{ gridColumn: '1 / -1' }}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.pagamentoMensileRicorrente')}</Typography>
              <Typography sx={styles.featureValue}>
                {sub.recurringMonthlyPayment ? t('subscriptions.yes') : t('subscriptions.no')}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={styles.fieldRow}>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.chatAssistenza')}</Typography>
              <Typography sx={styles.featureValue}>{sub.chat ? t('subscriptions.yes') : t('subscriptions.no')}</Typography>
            </Box>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.pianoVIP')}</Typography>
              <Typography sx={styles.featureValue}>{sub.vip ? t('subscriptions.yes') : t('subscriptions.no')}</Typography>
            </Box>
          </Box>
          
          <Box sx={styles.fieldRow}>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.pianoAllenamento')}</Typography>
              <Typography sx={styles.featureValue}>{sub.trainingCard ? t('subscriptions.yes') : t('subscriptions.no')}</Typography>
            </Box>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.pianoIntegrazione')}</Typography>
              <Typography sx={styles.featureValue}>{sub.integrationPlan ? t('subscriptions.yes') : t('subscriptions.no')}</Typography>
            </Box>
          </Box>
          
          <Box sx={styles.fieldRow}>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.pianoNutrizionale')}</Typography>
              <Typography sx={styles.featureValue}>{sub.mealPlan ? t('subscriptions.yes') : t('subscriptions.no')}</Typography>
            </Box>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.callIntroduttivaGratuita')}</Typography>
              <Typography sx={styles.featureValue}>{sub.freeIntroductoryCall ? t('subscriptions.yes') : t('subscriptions.no')}</Typography>
            </Box>
          </Box>
          
          <Box sx={styles.fieldRow}>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.callSupplementari')}</Typography>
              <Typography sx={styles.featureValue}>{sub.supplementaryCalls ? t('subscriptions.yes') : t('subscriptions.no')}</Typography>
            </Box>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.numeroCallSupplementari')}</Typography>
              <Typography sx={styles.featureValue}>{sub.numberOfSupplementaryCalls || 0}</Typography>
            </Box>
          </Box>
          
          <Box sx={styles.fieldRow}>
            <Box sx={styles.featureBar}>
              <Typography sx={styles.featureLabel}>{t('subscriptions.fields.visibilitaFrontend')}</Typography>
              <Typography sx={styles.featureValue}>{sub.visibleInFrontend ? t('subscriptions.yes') : t('subscriptions.no')}</Typography>
            </Box>
          </Box>
          
          </Box>
          
          <Box sx={styles.bottomRow}>
            <Button
              variant="contained"
              onClick={() => onEdit(sub)}
              sx={{
                ...styles.editButton,
                opacity: 1,
                zIndex: 2,
              }}
              endIcon={<PencilIcon />}
            >
              {t('subscriptions.modify')}
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SubscriptionCardsGrid;