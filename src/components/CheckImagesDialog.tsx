import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Typography, 
  Button,
  Box,
  Card,
  CircularProgress,
  Fade,
  Backdrop
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext, FileData } from '../Context/ClientContext';
import DialogCloseIcon from '../icons/DialogCloseIcon2';
import ImageCustom from './ImageCustom';
import FullscreenImageDialog from './FullscreenImageDialog';

interface CheckImagesDialogProps {
  open: boolean;
  onClose: () => void;
  checkId: number | null;
}

const styles = {
  dialog: {
    borderRadius: 4,
    boxShadow: 8,
    px: 4,
    py: 2,
    background: '#fff',
    minWidth: 600,
    fontSize: 16,
  },
  backdrop: {
    timeout: 300,
    sx: {
      backgroundColor: 'rgba(33,33,33,0.8)',
      backdropFilter: 'blur(5px)',
    },
  },
  closeButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    mt: 1,
    mb: 0,
  },
  closeButton: {
    color: '#888',
    background: 'transparent',
    boxShadow: 'none',
    '&:hover': { background: 'rgba(0,0,0,0.04)' },
    mr: '-8px',
    mt: '-8px',
  },
  dialogTitle: {
    fontSize: 32,
    fontWeight: 400,
    textAlign: 'left',
    pb: 0,
    pt: 0,
    position: 'relative',
    letterSpacing: 0.5,
    fontFamily: 'Montserrat, sans-serif',
    color: '#616160',
  },
  dialogContent: {
    pt: 2,
    pb: 0,
    fontSize: 15,
    minHeight: '400px',
    '&::-webkit-scrollbar': {
      width: '6px',
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#e0e0e0',
      borderRadius: '6px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#bdbdbd',
    },
    scrollbarWidth: 'thin',
    scrollbarColor: '#e0e0e0 transparent',
  },
  dialogActions: {
    px: 4,
    pb: 3,
    pt: 2,
  },
  submitButton: {
    background: '#E6BB4A',
    color: '#fff',
    borderRadius: 2,
    fontWeight: 500,
    fontSize: 24,
    py: 0,
    minHeight: 40,
    height: 40,
    boxShadow: 1,
    letterSpacing: 1,
    fontFamily: 'Montserrat, sans-serif',
    textTransform: 'none' as const,
    '&:hover': { background: '#E6BB4A' },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    flexDirection: 'column',
    gap: 2,
  },
  imageCard: {
    height: '200px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    overflow: 'hidden',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  noImageCard: {
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    border: '2px dashed #ddd',
  },
  imageLabel: {
    mt: 1,
    textAlign: 'center',
    fontWeight: 500,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#333',
    mb: 3,
    textAlign: 'center',
    borderBottom: '2px solid #E6BB4A',
    pb: 1,
  },
  measurementCard: {
    p: 3,
    mb: 3,
    borderRadius: 3,
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
  },
  measurementGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 2,
  },
  measurementItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    p: 2,
    borderRadius: 2,
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
  },
  measurementLabel: {
    fontWeight: 500,
    color: '#495057',
    fontSize: 14,
  },
  measurementValue: {
    fontWeight: 600,
    color: '#E6BB4A',
    fontSize: 16,
  },
  imagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 3,
  },
  imageCustomStyle: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
    borderRadius: '8px',
  },
  dialogCloseIcon: {
    fontSize: 32,
  },
};

const CheckImagesDialog: React.FC<CheckImagesDialogProps> = ({ 
  open, 
  onClose, 
  checkId
}) => {
  const { t } = useTranslation();
  const { selectedCheckDetailed, loadingSelectedCheck, fetchCheckById } = useClientContext();
  
  // State for fullscreen image dialog
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string>('');

  useEffect(() => {
    if (open && checkId) {
      fetchCheckById(checkId);
    }
  }, [open, checkId, fetchCheckById]);

  // Handler for opening fullscreen image
  const handleImageClick = (imageUrl: string) => {
    setFullscreenImageUrl(imageUrl);
    setFullscreenOpen(true);
  };

  // Handler for closing fullscreen image
  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
    setFullscreenImageUrl('');
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };

  // Helper function to get measurement display name
  const getMeasurementLabel = (field: string) => {
    const labelKey = `checkImages.measurements.${field}`;
    return t(labelKey, field); // fallback to field name if translation not found
  };

  // Helper function to get measurement value with unit
  const getMeasurementValue = (field: string, value: string) => {
    if (field === 'peso') return `${value} kg`;
    if (field === 'altezza') return `${value} cm`;
    return `${value} cm`;
  };

  // Get measurements data
  const getMeasurements = () => {
    if (!selectedCheckDetailed) return [];
    
    const measurementFields = [
      'addome', 'altezza', 'peso', 'avambraccioDx', 'avambraccioSx',
      'braccioDx', 'braccioContrattoDx', 'braccioSx', 'braccioContrattoSx',
      'cavigliaDx', 'cavigliaSx', 'collo', 'gambaDx', 'gambaMedialeDx', 'gambaSx'
    ];

    return measurementFields
      .map(field => ({
        field,
        label: getMeasurementLabel(field),
        value: selectedCheckDetailed[field as keyof typeof selectedCheckDetailed] as string
      }))
      .filter(item => item.value && item.value !== '');
  };

  const imageFields = [
    { field: 'frontImage', label: t('checkImages.images.frontImage') },
    { field: 'sideImage', label: t('checkImages.images.sideImage') },
    { field: 'backImage', label: t('checkImages.images.backImage') },
    { field: 'optionalImage1', label: t('checkImages.images.optionalImage1') },
    { field: 'optionalImage2', label: t('checkImages.images.optionalImage2') },
    { field: 'optionalImage3', label: t('checkImages.images.optionalImage3') },
    { field: 'optionalImage4', label: t('checkImages.images.optionalImage4') },
    { field: 'optionalImage5', label: t('checkImages.images.optionalImage5') },
  ];

  const renderImageCard = (field: string, label: string) => {
    const imageData = selectedCheckDetailed?.[field as keyof typeof selectedCheckDetailed] as FileData | null;
    
    if (imageData && imageData.signedUrl) {
      return (
        <Box key={field} sx={{ mb: 3 }}>
          <Card sx={styles.imageCard} onClick={() => handleImageClick(imageData.signedUrl)}>
            <ImageCustom
              src={imageData.signedUrl}
              alt={label}
              style={styles.imageCustomStyle}
              spinnerSize={30}
            />
          </Card>
          <Typography sx={styles.imageLabel}>
            {label}
          </Typography>
        </Box>
      );
    }

    return (
      <Box key={field} sx={{ mb: 3 }}>
        <Card sx={styles.noImageCard}>
          <Typography variant="body2" color="text.secondary">
            {t('checkImages.noImageAvailable')}
          </Typography>
        </Card>
        <Typography sx={styles.imageLabel} color="text.secondary">
          {label}
        </Typography>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: styles.dialog }}
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: styles.backdrop }}
      TransitionComponent={Fade}
    >
      {/* Close icon row above the title */}
      <Box sx={styles.closeButtonContainer}>
        <IconButton
          onClick={onClose}
          sx={styles.closeButton}
          size="large"
        >
          <DialogCloseIcon style={styles.dialogCloseIcon} />
        </IconButton>
      </Box>
      
      <DialogTitle sx={styles.dialogTitle}>
        {selectedCheckDetailed 
          ? `${t('checkImages.checkDate')} ${formatDate(selectedCheckDetailed.createdAt)}`
          : t('checkImages.checkDetails')
        }
      </DialogTitle>
      
      <DialogContent sx={styles.dialogContent}>
        {loadingSelectedCheck ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
            <Typography color="text.secondary">
              {t('checkImages.loadingDetails')}
            </Typography>
          </Box>
        ) : selectedCheckDetailed ? (
          <>
            {/* Measurements Section */}
            {getMeasurements().length > 0 && (
              <>
                <Typography sx={styles.sectionTitle}>
                  📏 {t('checkImages.measurementsTitle')}
                </Typography>
                <Card sx={styles.measurementCard}>
                  <Box sx={styles.measurementGrid}>
                    {getMeasurements().map(({ field, label, value }) => (
                      <Box key={field} sx={styles.measurementItem}>
                        <Typography sx={styles.measurementLabel}>
                          {label}
                        </Typography>
                        <Typography sx={styles.measurementValue}>
                          {getMeasurementValue(field, value)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </>
            )}
            
            {/* Images Section */}
            <Typography sx={styles.sectionTitle}>
              📸 {t('checkImages.imagesTitle')}
            </Typography>
            <Box sx={styles.imagesGrid}>
              {imageFields.map(({ field, label }) => 
                renderImageCard(field, label)
              )}
            </Box>
          </>
        ) : (
          <Box sx={styles.loadingContainer}>
            <Typography color="text.secondary">
              {t('checkImages.noDataAvailable')}
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={styles.dialogActions}>
        <Button 
          onClick={onClose} 
          variant="contained"
          fullWidth
          sx={styles.submitButton}
        >
          {t('checkImages.close')}
        </Button>
      </DialogActions>

      {/* Fullscreen Image Dialog */}
      <FullscreenImageDialog
        open={fullscreenOpen}
        imageUrl={fullscreenImageUrl}
        onClose={handleFullscreenClose}
      />
    </Dialog>
  );
};

export default CheckImagesDialog;
