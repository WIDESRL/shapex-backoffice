import React from 'react';
import { Dialog, DialogContent, Button, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

// --- styles ---
const styles = {
  dialog: { borderRadius: 3, p: 0, background: '#fff' },
  backdrop: { backgroundColor: 'rgba(33,33,33,0.8)', backdropFilter: 'blur(5px)' },
  content: { pt: 8, px: 5, pb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { fontSize: 28, color: '#616160', mb: 6, textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 400 },
  actions: { display: 'flex', gap: 4, mt: 2 },
  cancelBtn: {
    border: '2px solid #616160',
    color: '#616160',
    fontSize: 28,
    fontWeight: 400,
    borderRadius: 2,
    px: 6,
    py: 1.5,
    fontFamily: 'Montserrat, sans-serif',
    textTransform: 'none',
    background: '#fff',
    boxShadow: 'none',
    '&:hover': { background: '#f5f5f5', borderColor: '#616160' },
  },
  confirmBtn: {
    background: '#EDB528',
    color: '#fff',
    fontSize: 28,
    fontWeight: 400,
    borderRadius: 2,
    px: 6,
    py: 1.5,
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
  onConfirm: () => void;
}

const DeleteDayModal: React.FC<DeleteDayModalProps> = ({ open, onClose, onConfirm }) => {
  const { t } = useTranslation();
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
          >
            {t('trainingPage.deleteDay.cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            sx={styles.confirmBtn}
            size="large"
          >
            {t('trainingPage.deleteDay.confirm')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDayModal;
