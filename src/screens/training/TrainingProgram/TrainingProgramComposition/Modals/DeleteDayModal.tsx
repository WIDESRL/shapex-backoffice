import React from 'react';
import { Dialog, DialogContent, Button, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTraining } from '../../../../../Context/TrainingContext';
import { useSnackbar } from '../../../../../Context/SnackbarContext';

// --- styles ---
const styles = {
  dialog: { borderRadius: 3, p: 0, background: '#fff' },
  backdrop: { backgroundColor: 'rgba(33,33,33,0.8)', backdropFilter: 'blur(5px)' },
  content: { pt: 6, px: 4, pb: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { fontSize: 22, color: '#616160', mb: 5, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 400 },
  actions: { display: 'flex', gap: 3, mt: 2 },
  cancelBtn: {
    border: '2px solid #616160',
    color: '#616160',
    fontSize: 20,
    fontWeight: 400,
    borderRadius: 2,
    px: 4,
    py: 1,
    fontFamily: 'Montserrat, sans-serif',
    textTransform: 'none',
    background: '#fff',
    boxShadow: 'none',
    '&:hover': { background: '#f5f5f5', borderColor: '#616160' },
  },
  confirmBtn: {
    background: '#EDB528',
    color: '#fff',
    fontSize: 20,
    fontWeight: 400,
    borderRadius: 2,
    px: 4,
    py: 1,
    fontFamily: 'Montserrat, sans-serif',
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': { background: '#e0a82e' },
  },
};
// --- end styles ---

interface DeleteDayModalProps {
  open: boolean;
  onClose: () => void;
  deletedDayId: number | null;
}

const DeleteDayModal: React.FC<DeleteDayModalProps> = ({ open, onClose, deletedDayId }) => {
  const { t } = useTranslation();
  const { deleteDay } = useTraining();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    if (!deletedDayId) return;
    setLoading(true);
    try {
      await deleteDay(deletedDayId);
      onClose();
    } catch (err: unknown) {
      let message = t('trainingPage.deleteDay.error') || 'Errore eliminazione giorno';
      if (err && typeof err === 'object' && 'message' in err) {
        message += `: ${(err as { message?: string }).message}`;
      }
      showSnackbar?.(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
      sx: styles.dialog
    }}
      slotProps={{
          backdrop: {
              timeout: 300,
              sx: styles.backdrop,
          },
      }}
    >
      <DialogContent sx={styles.content}>
        <Typography sx={styles.title}>
          {t('trainingPage.deleteDay.title')}
        </Typography>
        <Box sx={styles.actions}>
          <Button
            onClick={onClose}
            sx={styles.cancelBtn}
            size="large"
            disabled={loading}
          >
            {t('trainingPage.deleteDay.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            sx={styles.confirmBtn}
            size="large"
            disabled={loading || !deletedDayId}
          >
            {t('trainingPage.deleteDay.confirm')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDayModal;
