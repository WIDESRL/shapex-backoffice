import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton } from '@mui/material';
import DialogCloseIcon from '../../../../../icons/DialogCloseIcon2';
import { useTraining } from '../../../../../Context/TrainingContext';
import { useSnackbar } from '../../../../../Context/SnackbarContext';
import { useTranslation } from 'react-i18next';

// --- styles ---
const styles = {
  dialogPaper: {
    borderRadius: 4,
    p: 0,
    background: '#fff',
    boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)',
    width: 420,
    maxWidth: '95vw',
  },
  dialogBackdrop: {
    backgroundColor: 'rgba(33,33,33,0.8)',
    backdropFilter: 'blur(5px)',
  },
  dialogTitle: {
    fontSize: 32,
    fontWeight: 400,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    textAlign: 'left',
    pb: 0,
    pt: 4,
    pl: 4,
    letterSpacing: 0,
    lineHeight: 1.1,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    top: 24,
    background: 'transparent',
    boxShadow: 'none',
    p: 0,
  },
  dialogContent: {
    pt: 0,
    px: 4,
    pb: 0,
  },
  confirmText: {
    fontSize: 20,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    mt: 3,
    mb: 2,
  },
  dialogActions: {
    px: 4,
    pb: 4,
    pt: 0,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    borderRadius: 2.5,
    fontWeight: 500,
    fontSize: 18,
    px: 4,
    py: 1,
    minWidth: 100,
    textTransform: 'none',
    fontFamily: 'Montserrat, sans-serif',
    mr: 2,
  },
  confirmButton: {
    background: '#EDB528',
    color: '#fff',
    borderRadius: 2.5,
    fontWeight: 500,
    fontSize: 18,
    px: 4,
    py: 1,
    minWidth: 120,
    textTransform: 'none',
    fontFamily: 'Montserrat, sans-serif',
    '&:hover': { background: '#d1a53d' },
  },
};

interface ConfirmCreateWeekModalProps {
  open: boolean;
  onClose: () => void;
  programId?: number;
}

const ConfirmCreateWeekModal: React.FC<ConfirmCreateWeekModalProps> = ({ open, onClose, programId }) => {
  const { createNextWeek } = useTraining();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!programId) return;
    setLoading(true);
    try {
      await createNextWeek(programId);
      showSnackbar(t('trainingPage.createNewWeek.success', 'Settimana creata con successo!'), 'success');
      onClose();
    } catch {
      showSnackbar(t('trainingPage.createNewWeek.error', 'Errore durante la creazione della settimana'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth TransitionComponent={undefined}
      PaperProps={{ sx: styles.dialogPaper }}
      slotProps={{ backdrop: { timeout: 300, sx: styles.dialogBackdrop } }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        {t('trainingPage.createNewWeek.title', 'Conferma creazione settimana')}
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <DialogCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <Box sx={styles.confirmText}>
          {t('trainingPage.createNewWeek.confirmText', 'Sei sicuro di voler creare una nuova settimana?')}
        </Box>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button onClick={onClose} variant="outlined" sx={styles.cancelButton}>
          {t('common.cancel', 'Annulla')}
        </Button>
        <Button onClick={handleConfirm} variant="contained" sx={styles.confirmButton} disabled={loading}>
          {loading ? t('trainingPage.createNewWeek.loading', 'Creazione...') : t('trainingPage.createNewWeek.confirm', 'Crea')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmCreateWeekModal;
