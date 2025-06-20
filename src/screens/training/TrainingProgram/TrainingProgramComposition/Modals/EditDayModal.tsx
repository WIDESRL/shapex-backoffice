import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Typography, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import XIcon from '../../../../../icons/XIcon';
import { useTraining } from '../../../../../Context/TrainingContext';
import { useSnackbar } from '../../../../../Context/SnackbarContext';

// --- styles ---
const styles = {
  dialog: { borderRadius: 3, p: 0, background: '#fff' },
  backdrop: { backgroundColor: 'rgba(33,33,33,0.8)', backdropFilter: 'blur(5px)' },
  title: { fontSize: 48, fontWeight: 400, color: '#616160', pb: 0, pt: 4, px: 5, fontFamily: 'Montserrat, sans-serif' },
  closeBtn: { position: 'absolute', right: 24, top: 24, width: 40, height: 40, border: '2px solid #616160', color: '#616160' },
  content: { pt: 4, px: 5, pb: 5 },
  box: { mb: 6 },
  label: { fontSize: 20, color: '#616160', mb: 1, fontFamily: 'Montserrat, sans-serif' },
  textField: {
    fontSize: 24,
    fontWeight: 700,
    color: '#616160',
    borderRadius: 2,
    background: '#fff',
    fontFamily: 'Montserrat, sans-serif',
    px: 2,
    py: 1.5,
    '& input': {
      fontSize: 24,
      fontWeight: 700,
      color: '#616160',
      fontFamily: 'Montserrat, sans-serif',
    },
  },
  saveBtnBox: { display: 'flex', justifyContent: 'flex-end' },
  saveBtn: {
    background: '#EDB528',
    color: '#fff',
    fontSize: 28,
    fontWeight: 400,
    borderRadius: 2,
    px: 8,
    py: 1.5,
    fontFamily: 'Montserrat, sans-serif',
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': { background: '#e0a82e' },
  },
};
// --- end styles ---

interface EditDayModalProps {
  open: boolean;
  value: string;
  onClose: () => void;
  onSave: (value: string) => void;
  editDayId: number;
}

const EditDayModal: React.FC<EditDayModalProps> = ({ open, value, onClose, editDayId }) => {
  const [input, setInput] = useState(value);
  const { t } = useTranslation();
  const { updateDayTitle } = useTraining();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInput(value);
  }, [value, open]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDayTitle(editDayId, input);
      showSnackbar(t('trainingPage.editDay.success', 'Workout renamed successfully!'), 'success');
    } catch {
      showSnackbar(t('trainingPage.editDay.error', 'Error renaming workout.'), 'error');
    }
    finally{
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: styles.dialog }}
      slotProps={{ backdrop: { timeout: 300, sx: styles.backdrop } }}
    >
      <DialogTitle sx={styles.title}>
        {t('trainingPage.editDay.title')}
        <IconButton onClick={onClose} sx={styles.closeBtn}>
          <XIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.content}>
        <Box sx={styles.box}>
          <Typography sx={styles.label}>{t('trainingPage.editDay.lable')}</Typography>
          <TextField
            fullWidth
            value={input}
            onChange={e => setInput(e.target.value)}
            variant="outlined"
            InputProps={{ sx: styles.textField }}
          />
        </Box>
        <Box sx={styles.saveBtnBox}>
          <Button
            onClick={handleSave}
            sx={styles.saveBtn}
            size="large"
            disabled={loading || !input.trim()}
          >
            {loading ? t('trainingPage.editDay.save', 'Salva') + '...' : t('trainingPage.editDay.save', 'Salva')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditDayModal;
