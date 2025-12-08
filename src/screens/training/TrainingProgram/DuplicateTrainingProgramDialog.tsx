import React, { useState, useEffect } from 'react';
import { Dialog, Box, Typography, TextField, Button, CircularProgress, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DublicateIcon from '../../../icons/DublicateIcon';
import DialogCloseIcon from '../../../icons/DialogCloseIcon2';
import { TrainingProgram } from '../../../types/trainingProgram.types';
import { useSnackbar } from '../../../Context/SnackbarContext';

interface DuplicateTrainingProgramDialogProps {
  open: boolean;
  programId: number | null;
  programName: string | null;
  onClose: () => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  cloneTrainingProgram: (originalProgramId: number, newTitle: string) => Promise<TrainingProgram>;
}

// Styles Section
const styles = {
  dialogPaper: {
    borderRadius: 3,
    p: 0,
    background: '#fff',
    boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)',
    width: 550,
    maxWidth: '90vw',
  },
  backdrop: {
    timeout: 300,
    sx: {
      backgroundColor: 'rgba(33,33,33,0.8)',
      backdropFilter: 'blur(5px)',
    },
  },
  contentBox: { position: 'relative', p: 4 },
  closeButton: {
    position: 'absolute',
    right: 24,
    top: 24,
    background: 'transparent',
    boxShadow: 'none',
    p: 0,
  },
  titleContainer: { display: 'flex', alignItems: 'center', mb: 3 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 2,
    background: 'linear-gradient(135deg, #f4e7c6ff 0%, #EDB528 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mr: 2,
  },
  icon: { fontSize: 24, color: '#fff' },
  title: {
    fontSize: 28,
    fontWeight: 400,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    letterSpacing: 0,
    lineHeight: 1.1,
  },
  description: {
    fontSize: 15,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    mb: 3,
    lineHeight: 1.5,
  },
  originalProgramBox: {
    background: '#F9FAFB',
    border: '1px solid #E0E0E0',
    borderRadius: 2,
    p: 2.5,
    mb: 3,
  },
  originalProgramLabel: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Montserrat, sans-serif',
    mb: 0.5,
    fontWeight: 500,
  },
  originalProgramName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
  },
  inputContainer: { mb: 4 },
  inputLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: '#888',
    fontFamily: 'Montserrat, sans-serif',
    mb: 1,
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 15,
      background: '#fff',
      '& fieldset': {
        borderColor: '#E0E0E0',
      },
      '&:hover fieldset': {
        borderColor: '#BDBDBD',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#64B5F6',
      },
    },
  },
  buttonsContainer: { display: 'flex', gap: 2, justifyContent: 'flex-end' },
  cancelButton: {
    borderRadius: 2.5,
    px: 4,
    py: 1.5,
    textTransform: 'none',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 16,
    fontWeight: 500,
    color: '#616160',
    border: '1px solid #E0E0E0',
    background: '#fff',
    '&:hover': {
      background: '#F5F5F5',
      border: '1px solid #BDBDBD',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  confirmButton: {
    borderRadius: 2.5,
    px: 4,
    py: 1.5,
    textTransform: 'none',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 16,
    fontWeight: 600,
    background: '#EDB528',
    boxShadow: 'none',
    '&:hover': {
      background: '#d1a53d',
      boxShadow: 'none',
    },
    '&:disabled': {
      background: '#E0E0E0',
      color: '#9E9E9E',
    },
  },
  spinner: { color: '#fff', mr: 1 },
} as const;

const DuplicateTrainingProgramDialog: React.FC<DuplicateTrainingProgramDialogProps> = ({
  open,
  programId,
  programName,
  onClose,
  onSuccess,
  onCancel,
  cloneTrainingProgram,
}) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [duplicateName, setDuplicateName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset and populate name when dialog opens
  useEffect(() => {
    if (open && programName) {
      setDuplicateName(`${programName} (Copy)`);
    } else if (!open) {
      setDuplicateName('');
      setIsLoading(false);
    }
  }, [open, programName]);

  const handleConfirm = async () => {
    if (!duplicateName.trim() || !programId) return;

    setIsLoading(true);
    try {
      // Call the clone API
      await cloneTrainingProgram(programId, duplicateName.trim());
      
      // Show success message
      showSnackbar(
        t('training.duplicateSuccess', 'Programma duplicato con successo'),
        'success'
      );
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Close dialog after 500ms
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error('Error duplicating program:', error);
      setIsLoading(false);
      
      // Show error message
      showSnackbar(
        t('training.duplicateError', 'Errore durante la duplicazione del programma'),
        'error'
      );
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    
    setDuplicateName('');
    setIsLoading(false);
    
    // Call cancel callback only if user actually canceled (not on success)
    if (onCancel && !isLoading) {
      onCancel();
    }
    
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: styles.dialogPaper }}
      slotProps={{ backdrop: styles.backdrop }}
    >
      <Box sx={styles.contentBox}>
        {/* Close Button */}
        <IconButton onClick={handleClose} disabled={isLoading} sx={styles.closeButton}>
          <DialogCloseIcon />
        </IconButton>

        {/* Title Section */}
        <Box sx={styles.titleContainer}>
          <Box sx={styles.iconBox}>
            <DublicateIcon style={styles.icon} />
          </Box>
          <Typography sx={styles.title}>
            {t('training.duplicateProgram', 'Duplica Programma')}
          </Typography>
        </Box>

        {/* Description */}
        <Typography sx={styles.description}>
          {t(
            'training.duplicateProgramDescription',
            'Stai per creare una copia del programma di allenamento. Tutti gli esercizi e le impostazioni verranno duplicati.'
          )}
        </Typography>

        {/* Original Program Box */}
        <Box sx={styles.originalProgramBox}>
          <Typography sx={styles.originalProgramLabel}>
            {t('training.originalProgram', 'Programma originale')}:
          </Typography>
          <Typography sx={styles.originalProgramName}>{programName}</Typography>
        </Box>

        {/* New Program Name Input */}
        <Box sx={styles.inputContainer}>
          <Typography sx={styles.inputLabel}>
            {t('training.newProgramName', 'Nome del nuovo programma')} *
          </Typography>
          <TextField
            fullWidth
            value={duplicateName}
            onChange={(e) => setDuplicateName(e.target.value)}
            placeholder={t(
              'training.enterNewProgramName',
              'Inserisci il nome del nuovo programma'
            )}
            autoFocus
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && duplicateName.trim() && !isLoading) {
                handleConfirm();
              }
            }}
            sx={styles.textField}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={styles.buttonsContainer}>
          <Button onClick={handleClose} disabled={isLoading} sx={styles.cancelButton}>
            {t('training.cancel', 'Annulla')}
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!duplicateName.trim() || isLoading}
            sx={styles.confirmButton}
          >
            {isLoading ? (
              <>
                <CircularProgress size={18} sx={styles.spinner} />
                {t('training.duplicating', 'Duplicazione...')}
              </>
            ) : (
              t('training.duplicate', 'Duplica')
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DuplicateTrainingProgramDialog;
