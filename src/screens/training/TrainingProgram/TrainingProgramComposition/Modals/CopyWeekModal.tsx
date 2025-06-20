import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton } from '@mui/material';
import DialogCloseIcon from '../../../../../icons/DialogCloseIcon2';
import { useTraining } from '../../../../../Context/TrainingContext';
import { useSnackbar } from '../../../../../Context/SnackbarContext';

const styles = {
  dialogPaper: {
    borderRadius: 4,
    p: 0,
    background: '#fff',
    boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)',
    width: 520,
    maxWidth: '95vw',
  },
  dialogBackdrop: {
    backgroundColor: 'rgba(33,33,33,0.8)',
    backdropFilter: 'blur(5px)',
  },
  dialogTitle: {
    fontSize: 38,
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
  durationBox: { display: 'flex', alignItems: 'center', gap: 2, mt: 4, mb: 4 },
  durationLabel: { fontSize: 22, color: '#616160', fontFamily: 'Montserrat, sans-serif', mr: 2 },
  durationBtn: {
    fontSize: 28,
    color: '#888',
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    width: 32,
    height: 32,
    minWidth: 32,
    minHeight: 32,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'none',
    outline: 'none',
    padding: 0,
    margin: 0,
  },
  durationValue: { fontSize: 16, color: '#616160', fontWeight: 400, width: 40, textAlign: 'center' as const, fontFamily: 'Montserrat, sans-serif' },
  radioGroup: { mt: 4, mb: 4 },
  radioLabel: { fontSize: 20, color: '#616160', fontFamily: 'Montserrat, sans-serif', mb: 2 },
  radioOption: { display: 'flex', alignItems: 'center', fontSize: 18, color: '#616160', fontFamily: 'Montserrat, sans-serif', mb: 1 },
  radioInput: { marginRight: 10, width: 22, height: 22 },
  dialogActions: { px: 4, pb: 4, pt: 0, display: 'flex', justifyContent: 'flex-end' },
  copyButton: { background: '#EDB528', color: '#fff', borderRadius: 2.5, fontWeight: 500, fontSize: 24, px: 8, py: 2, minWidth: 180, boxShadow: 0, textTransform: 'none', fontFamily: 'Montserrat, sans-serif', '&:hover': { background: '#d1a53d' } },
};

interface CopyWeekModalProps {
  open: boolean;
  onClose: () => void;
  weekNumber: number;
  selectedWeekId: number | null | undefined;
}

const CopyWeekModal: React.FC<CopyWeekModalProps> = ({ open, onClose, weekNumber, selectedWeekId }) => {
  const { selectedTrainingProgram, duplicateWeek } = useTraining();
  const { showSnackbar } = useSnackbar();
  const currentWeeks = selectedTrainingProgram?.weeks?.length || 0;
  const existingWeeks = React.useMemo(() => selectedTrainingProgram?.weeks?.map(w => w.order) || [], [selectedTrainingProgram]);
  const [duration, setDuration] = useState(currentWeeks + 1);
  // Find the first non-existing week (1-based)
  const firstNonExisting = React.useMemo(() => {
    for (let i = 1; i <= duration; i++) {
      if (!existingWeeks.includes(i)) return i - 1; // idx is 0-based
    }
    return duration - 1;
  }, [existingWeeks, duration]);
  const [selected, setSelected] = useState(firstNonExisting);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (open) {
      setDuration(currentWeeks + 1);
    }
  }, [open, currentWeeks]);

  React.useEffect(() => {
    if (open) {
      setSelected(firstNonExisting);
    }
  }, [open, firstNonExisting]);

  const weekOptions = Array.from({ length: duration }, (_, i) => `Settimana ${i + 1}`);

  const handleDurationChange = (delta: number) => {
    setDuration(prev => {
      const min = currentWeeks;
      const next = prev + delta;
      return next < min ? min : next;
    });
  };

  const handleCopy = async () => {
    if (!selectedTrainingProgram || existingWeeks.includes(selected + 1)) return;
    setLoading(true);
    try {
      // Clone the selected week (selectedWeekId is the week to clone, selected+1 is the destination week order)
      const weekToClone = selectedTrainingProgram.weeks.find(w => w.id === selectedWeekId);
      if (weekToClone) {
        await duplicateWeek(weekToClone.id,  selected + 1, selectedTrainingProgram.id);
      }
      setLoading(false);
      onClose();
      showSnackbar(`Settimana copiata con successo`, 'success');
    } catch (error: unknown) {
      setLoading(false);
      let message = 'Errore durante la copia della settimana';
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        message = err.response?.data?.message || message;
      }
      showSnackbar(message, 'error');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth TransitionComponent={undefined}
        PaperProps={{ sx: styles.dialogPaper }}
        slotProps={{ backdrop: { timeout: 300, sx: styles.dialogBackdrop } }}
      >
        <DialogTitle sx={styles.dialogTitle}>
          Copia settimana {weekNumber}
          <IconButton onClick={onClose} sx={styles.closeButton}>
            <DialogCloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <Box sx={styles.durationLabel}>Durata programma (settimane)</Box>
          <Box sx={styles.durationBox}>
            <button style={styles.durationBtn} onClick={() => handleDurationChange(-1)} disabled={duration <= currentWeeks}>−</button>
            <span style={styles.durationValue}>{duration}</span>
            <button style={styles.durationBtn} onClick={() => handleDurationChange(1)}>+</button>
          </Box>
          <Box sx={styles.radioGroup}>
            <Typography sx={styles.radioLabel}>Copia settimana {weekNumber} anche in:</Typography>
            {weekOptions.map((label, idx) => (
              <Box key={label} sx={styles.radioOption}>
                <input
                  type="radio"
                  name="copy-week"
                  checked={selected === idx}
                  onChange={() => setSelected(idx)}
                  style={styles.radioInput}
                  disabled={existingWeeks.includes(idx + 1)}
                />
                {label}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button
            variant="contained"
            sx={styles.copyButton}
            onClick={handleCopy}
            disabled={loading || existingWeeks.includes(selected + 1)}
          >
            {loading ? 'Copia...' : 'Copia'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CopyWeekModal;
