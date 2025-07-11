import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../../../Context/ClientContext';
import FullscreenImageDialog from '../../../../components/FullscreenImageDialog';
import ImageCustom from '../../../../components/ImageCustom';

const styles = {
  container: {
    height: '60vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    padding: 2,
    paddingTop: 0,
    marginTop: 2,
    '&::-webkit-scrollbar': {
      width: '2px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#c1c1c1',
      borderRadius: '4px',
      '&:hover': {
        background: '#a8a8a8',
      },
    },
  },
  fieldsGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr', // 1 column on mobile
      sm: 'repeat(2, 1fr)', // 2 columns on small screens
      md: 'repeat(2, 1fr)', // 2 columns on medium screens
      lg: 'repeat(3, 1fr)', // 3 columns on large screens
    },
    gap: 3,
    mb: 4,
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    p: 2,
    backgroundColor: '#f9f9f9',
    borderRadius: 2,
    border: '1px solid #e0e0e0',
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: 600,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#333',
    mb: 3,
    mt: 2,
    pb: 1,
    borderBottom: '2px solid #E6BB4A',
    display: 'inline-block',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 1,
    width: '100%',
    '&:first-of-type': {
      mt: 0,
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flexDirection: 'column',
    gap: 2,
  },
  loadingText: {
    color: '#757575',
    fontSize: 16,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    px: 4,
  },
  emptyStateCard: {
    p: 6,
    borderRadius: 3,
    border: '2px dashed #e0e0e0',
    backgroundColor: '#fafafa',
    maxWidth: 400,
    width: '100%',
  },
  emptyStateIcon: {
    fontSize: 64,
    color: '#bdbdbd',
    mb: 3,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#424242',
    mb: 2,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#757575',
    lineHeight: 1.6,
  },
  imageSection: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)', 
      md: 'repeat(3, 1fr)',
    },
    gap: 3,
    mb: 4,
  },
  imageCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: 3,
    backgroundColor: '#f9f9f9',
    borderRadius: 2,
    border: '1px solid #e0e0e0',
    minHeight: 300,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
    mb: 2,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 2,
    overflow: 'hidden',
    border: '2px solid #e0e0e0',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
  },
  noImagePlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#bdbdbd',
  },
  noImageIcon: {
    fontSize: 48,
    mb: 1,
  },
  noImageText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
};

const AnamnesiInizialeTab: React.FC = () => {
  const { t } = useTranslation();
  const { initialHistory, loadingInitialHistory } = useClientContext();
  
  // State for image modal
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // Handle image click
  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  // Close image modal
  const handleCloseModal = () => {
    setSelectedImageUrl(null);
  };

  // Helper functions
  const formatHeight = (height: number): string => {
    return `${(height / 100).toFixed(2)} m`;
  };

  const formatWeight = (weight: number): string => {
    return `${weight} kg`;
  };

  const translateGender = (sex: string): string => {
    return sex === 'male' ? 'Maschile' : 'Femminile';
  };

  const translateGoals = (goals: string): string => {
    switch (goals.toLowerCase()) {
      case 'recomposition': return 'Ricomposizione corporea';
      case 'weight_loss': return 'Perdita di peso';
      case 'muscle_gain': return 'Aumento massa muscolare';
      case 'maintenance': return 'Mantenimento';
      default: return goals;
    }
  };

  const translateTrainingExperience = (experience: string | undefined): string => {
    if (!experience) return '--';
    switch (experience.toLowerCase()) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzato';
      default: return experience;
    }
  };

  const translateTrainingPlace = (place: string | undefined): string => {
    if (!place) return '--';
    switch (place.toLowerCase()) {
      case 'home': return 'Casa';
      case 'gym': return 'Palestra';
      case 'outdoor': return 'All\'aperto';
      default: return place;
    }
  };

  // Loading component
  const LoadingState = () => (
    <Box sx={styles.container}>
      <Box sx={styles.loadingContainer}>
        <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
        <Typography sx={styles.loadingText}>
          {t('client.diario.anamnesiIniziale.loading')}
        </Typography>
      </Box>
    </Box>
  );

  // Empty state component
  const EmptyState = () => (
    <Box sx={styles.container}>
      <Box sx={styles.emptyState}>
        <Paper sx={styles.emptyStateCard} elevation={0}>
          <Box sx={styles.emptyStateIcon}>
            📋
          </Box>
          <Typography sx={styles.emptyStateTitle}>
            {t('client.diario.anamnesiIniziale.emptyState.title')}
          </Typography>
          <Typography sx={styles.emptyStateDescription}>
            {t('client.diario.anamnesiIniziale.emptyState.description')}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  // Check loading state first
  if (loadingInitialHistory) {
    return <LoadingState />;
  }

  // Check if we should show empty state
  if (!initialHistory) {
    return <EmptyState />;
  }

  return (
    <Box sx={styles.container}>
      {/* Basic Information */}
      <Typography sx={styles.sectionTitle}>
        {t('client.diario.anamnesiIniziale.sections.basicInfo')}
      </Typography>
      <Box sx={styles.fieldsGrid}>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.gender')}</Typography>
          <Typography sx={styles.value}>{translateGender(initialHistory?.sex)}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.age')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.age}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.height')}</Typography>
          <Typography sx={styles.value}>{formatHeight(initialHistory?.height)}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.weight')}</Typography>
          <Typography sx={styles.value}>{formatWeight(initialHistory?.weight)}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.physicalActivity')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.physicalActivity}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.bodyFat')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.fatMass}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.goal')}</Typography>
          <Typography sx={styles.value}>{translateGoals(initialHistory?.goals)}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.sittingHours')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.sittingHours} ore</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.workType')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.workType}</Typography>
        </Box>
      </Box>

      {/* Training Information */}
      <Typography sx={styles.sectionTitle}>
        {t('client.diario.anamnesiIniziale.sections.trainingInfo')}
      </Typography>
      <Box sx={styles.fieldsGrid}>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.trainingExperience')}</Typography>
          <Typography sx={styles.value}>{translateTrainingExperience(initialHistory?.trainingExperience)}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.sessionsPerWeek')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.sessionsPerWeek} sessioni</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.desiredSessions')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.desiredSessions} sessioni</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.trainingPlace')}</Typography>
          <Typography sx={styles.value}>{translateTrainingPlace(initialHistory?.trainingPlace)}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.equipment')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.equipment}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.weights')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.weights}</Typography>
        </Box>
      </Box>

      {/* Body Measurements */}
      <Typography sx={styles.sectionTitle}>
        {t('client.diario.anamnesiIniziale.sections.measurements')}
      </Typography>
      <Box sx={styles.fieldsGrid}>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.neck')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.collo} cm</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.chest')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.addome} cm</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.rightArm')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.braccioDx} cm</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.leftArm')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.braccioSx} cm</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.rightForearm')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.avambraccioDx} cm</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.leftForearm')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.avambraccioSx} cm</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.rightLeg')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.gambaDx} cm</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.rightAnkle')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.cavigliaDx} cm</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.leftAnkle')}</Typography>
          <Typography sx={styles.value}>{initialHistory?.cavigliaSx} cm</Typography>
        </Box>
      </Box>

      {/* Medical Information */}
      <Typography sx={styles.sectionTitle}>
        {t('client.diario.anamnesiIniziale.sections.medicalInfo')}
      </Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr', // 1 column on mobile
          sm: 'repeat(2, 1fr)', // 2 columns on small+ screens
        },
        gap: 3,
      }}>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.trainingHistory')}</Typography>
          <Typography sx={styles.value}>{initialHistory.trainingHistory}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.drugs')}</Typography>
          <Typography sx={styles.value}>{initialHistory.drugs}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.previousDiet')}</Typography>
          <Typography sx={styles.value}>{initialHistory.previousDiet}</Typography>
        </Box>
        <Box sx={styles.infoRow}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.injuries')}</Typography>
          <Typography sx={styles.value}>{initialHistory.injuries}</Typography>
        </Box>
        <Box sx={{
          ...styles.infoRow,
          gridColumn: { xs: '1', sm: '1 / -1' }, // Full width on all screens
        }}>
          <Typography sx={styles.label}>{t('client.diario.anamnesiIniziale.fields.allergies')}</Typography>
          <Typography sx={styles.value}>{initialHistory.allergies}</Typography>
        </Box>
      </Box>

      {/* Initial Photos */}
      <Typography sx={styles.sectionTitle}>
        {t('client.diario.anamnesiIniziale.sections.photos')}
      </Typography>
      <Box sx={styles.imageSection}>
        {/* Front Image */}
        <Box sx={styles.imageCard}>
          <Typography sx={styles.imageTitle}>
            {t('client.diario.anamnesiIniziale.photos.front')}
          </Typography>
          <Box 
            sx={styles.imageContainer}
            onClick={() => initialHistory.frontImage?.signedUrl && handleImageClick(
              initialHistory.frontImage.signedUrl
            )}
          >
            {initialHistory.frontImage?.signedUrl ? (
              <ImageCustom
                src={initialHistory.frontImage.signedUrl}
                alt={t('client.diario.anamnesiIniziale.photos.front')}
                style={styles.image}
              />
            ) : (
              <Box sx={styles.noImagePlaceholder}>
                <Typography sx={styles.noImageIcon}>📸</Typography>
                <Typography sx={styles.noImageText}>
                  {t('client.diario.anamnesiIniziale.photos.noImage')}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Left Side Image */}
        <Box sx={styles.imageCard}>
          <Typography sx={styles.imageTitle}>
            {t('client.diario.anamnesiIniziale.photos.leftSide')}
          </Typography>
          <Box 
            sx={styles.imageContainer}
            onClick={() => initialHistory.leftSideImage?.signedUrl && handleImageClick(
              initialHistory.leftSideImage.signedUrl
            )}
          >
            {initialHistory.leftSideImage?.signedUrl ? (
              <ImageCustom
                src={initialHistory.leftSideImage.signedUrl}
                alt={t('client.diario.anamnesiIniziale.photos.leftSide')}
                style={styles.image}
              />
            ) : (
              <Box sx={styles.noImagePlaceholder}>
                <Typography sx={styles.noImageIcon}>📸</Typography>
                <Typography sx={styles.noImageText}>
                  {t('client.diario.anamnesiIniziale.photos.noImage')}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>


        {/* Right Side Image */}
        <Box sx={styles.imageCard}>
          <Typography sx={styles.imageTitle}>
            {t('client.diario.anamnesiIniziale.photos.rightSide')}
          </Typography>
          <Box 
            sx={styles.imageContainer}
            onClick={() => initialHistory.rightSideImage?.signedUrl && handleImageClick(
              initialHistory.rightSideImage.signedUrl
            )}
          >
            {initialHistory.rightSideImage?.signedUrl ? (
              <ImageCustom
                src={initialHistory.rightSideImage.signedUrl}
                alt={t('client.diario.anamnesiIniziale.photos.rightSide ')}
                style={styles.image}
              />
            ) : (
              <Box sx={styles.noImagePlaceholder}>
                <Typography sx={styles.noImageIcon}>📸</Typography>
                <Typography sx={styles.noImageText}>
                  {t('client.diario.anamnesiIniziale.photos.noImage')}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Back Image */}
        <Box sx={styles.imageCard}>
          <Typography sx={styles.imageTitle}>
            {t('client.diario.anamnesiIniziale.photos.back')}
          </Typography>
          <Box 
            sx={styles.imageContainer}
            onClick={() => initialHistory.backImage?.signedUrl && handleImageClick(
              initialHistory.backImage.signedUrl
            )}
          >
            {initialHistory.backImage?.signedUrl ? (
              <ImageCustom
                src={initialHistory.backImage.signedUrl}
                alt={t('client.diario.anamnesiIniziale.photos.back')}
                style={styles.image}
              />
            ) : (
              <Box sx={styles.noImagePlaceholder}>
                <Typography sx={styles.noImageIcon}>📸</Typography>
                <Typography sx={styles.noImageText}>
                  {t('client.diario.anamnesiIniziale.photos.noImage')}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Fullscreen Image Dialog */}
      <FullscreenImageDialog
        open={!!selectedImageUrl}
        imageUrl={selectedImageUrl}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default AnamnesiInizialeTab;
