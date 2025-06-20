import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTraining } from '../../../../../Context/TrainingContext';
import { useSnackbar } from '../../../../../Context/SnackbarContext';

const styles = {
  dialog: {
    borderRadius: 4,
    p: 0,
    background: '#fff',
    boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)',
    width: 520,
    maxWidth: '95vw',
  },
  backdrop: {
    backgroundColor: 'rgba(33,33,33,0.8)',
    backdropFilter: 'blur(5px)',
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    textAlign: 'center',
    pt: 8,
    px: 4,
    pb: 0,
    letterSpacing: 0,
    lineHeight: 1.7
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 6,
    px: 5,
    pb: 6,
    pt: 6,
  },
  cancelBtn: {
    background: '#fff',
    color: '#616160',
    border: '2px solid #616160',
    borderRadius: 3,
    fontWeight: 400,
    fontSize: 16,
    px: 8,
    py: 0,
    minWidth: 120,
    // minHeight: 45,
    height: 45,
    boxShadow: 'none',
    textTransform: 'none',
    fontFamily: 'Montserrat, sans-serif',
    '&:hover': { background: '#f5f5f5' },
  },
  confirmBtn: {
    background: '#E6BB4A',
    color: '#fff',
    border: 'none',
    borderRadius: 3,
    fontWeight: 400,
    fontSize: 16,
    px: 8,
    py: 0,
    // minWidth: 120,
    minHeight: 45,
    height: 45,
    boxShadow: 'none',
    textTransform: 'none',
    fontFamily: 'Montserrat, sans-serif',
    '&:hover': { background: '#d1a53d' },
  },
};

interface DeleteWeekModalProps {
  open: boolean;
  weekId?: number | null;
  onClose: () => void;
}

const DeleteWeekModal: React.FC<DeleteWeekModalProps> = ({ open, weekId, onClose }) => {
  const { t } = useTranslation();
  const { deleteWeek } = useTraining();
  const { showSnackbar } = useSnackbar();

  const handleConfirm = async () => {
    if (weekId) {
      try {
        await deleteWeek(weekId);
            onClose();

        showSnackbar(t('trainingPage.deleteWeek.success', 'Settimana eliminata con successo!'), 'success');
      } catch {
        showSnackbar(t('trainingPage.deleteWeek.error', 'Errore durante l\'eliminazione della settimana'), 'error');
      }
    }
  };

  return (
    <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth={false} 
        fullWidth PaperProps={{ sx: styles.dialog }}
      slotProps={{ backdrop: { timeout: 300, sx: styles.backdrop } }}>
      <DialogTitle sx={styles.title}>
        {t('trainingPage.deleteWeek.title.line1')}
        <br />
        {t('trainingPage.deleteWeek.title.line2')}
      </DialogTitle>
      <DialogActions sx={styles.actions}>
        <Button onClick={onClose} sx={styles.cancelBtn} size="large">
          {t('trainingPage.deleteWeek.cancel')}
        </Button>
        <Button onClick={handleConfirm} sx={styles.confirmBtn} size="large">
          {t('trainingPage.deleteWeek.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteWeekModal;
