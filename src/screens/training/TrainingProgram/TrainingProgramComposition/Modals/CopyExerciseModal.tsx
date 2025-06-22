import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton } from '@mui/material';
import DialogCloseIcon from '../../../../../icons/DialogCloseIcon2';
import { useTraining } from '../../../../../Context/TrainingContext';
import { useSnackbar } from '../../../../../Context/SnackbarContext';

const styles = {
  dialogPaper: {
    borderRadius: 4,
    p: 0,
    background: '#f5f5f5',
    boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)',
    width: 900,
    maxWidth: '98vw',
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
  weekBox: {
    background: '#f5f5f5',
    borderRadius: 5,
    p: 3,
    mb: 3,
    mt: 3,
    border: '3px solid #ededed',
    boxShadow: 'none',
  },
  weekTitle: {
    fontWeight: 500,
    fontSize: 22,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    mb: 2,
  },
  radioGroup: { display: 'flex', flexWrap: 'wrap', gap: 3 },
  radioOption: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 18,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    mb: 1,
    mr: 3,
    cursor: 'pointer',
    userSelect: 'none',
  },
  radioInput: {
    marginRight: 8,
    width: 22,
    height: 22,
    accentColor: '#616160',
  },
  dialogActions: { px: 4, pb: 4, pt: 0, display: 'flex', justifyContent: 'flex-end' },
  copyButton: { background: '#EDB528', color: '#fff', borderRadius: 2.5, fontWeight: 500, fontSize: 24, px: 8, py: 2, minWidth: 180, boxShadow: 0, textTransform: 'none', fontFamily: 'Montserrat, sans-serif', '&:hover': { background: '#d1a53d' } },
};

interface CopyExerciseModalProps {
  open: boolean;
  onClose: () => void;
  exerciseId: number | null;
}

const CopyExerciseModal: React.FC<CopyExerciseModalProps> = ({ open, onClose, exerciseId }) => {
  const { selectedTrainingProgram, copyExerciseToDay } = useTraining();
  const { showSnackbar } = useSnackbar();
  const weeks = selectedTrainingProgram?.weeks || [];
  const [selected, setSelected] = useState<{ weekIdx: number; day: number } | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setSelected(null);
  }, [weeks.length]);

  const handleDayChange = (weekIdx: number, day: number) => {
    setSelected({ weekIdx, day });
  };

  // Helper to handle closing and clear selection
  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  const handleCopyExercise = async () => {
    if (selected && exerciseId) {
      setLoading(true);
      try {
        const targetDayId = weeks[selected.weekIdx].days.find(d => d.dayOfWeek === selected.day)?.id;
        if (targetDayId) {
          await copyExerciseToDay(exerciseId, targetDayId);
          showSnackbar('Esercizio copiato con successo!', 'success');
        } else {
          showSnackbar('Errore: giorno di destinazione non trovato.', 'error');
        }
        handleClose();
      } catch (err: unknown) {
        console.error('Error copying exercise:', err);
        showSnackbar('Errore durante la copia dell\'esercizio.', 'error');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={false} fullWidth TransitionComponent={undefined}
      PaperProps={{ sx: styles.dialogPaper }}
      slotProps={{ backdrop: { timeout: 300, sx: styles.dialogBackdrop } }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        Copia esercizio
        <IconButton onClick={handleClose} sx={styles.closeButton}>
          <DialogCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        {weeks.map((week, weekIdx) => (
          <Box key={week.id} sx={styles.weekBox}>
            <Typography sx={styles.weekTitle}>{`Settimana ${week.order}`}</Typography>
            <Box sx={styles.radioGroup}>
              {week.days.map(day => (
                <Box
                  key={day.id}
                  sx={{ ...styles.radioOption, opacity: 1, pointerEvents: 'auto' }}
                  onClick={() => handleDayChange(weekIdx, day.dayOfWeek)}
                >
                  <input
                    type="radio"
                    name={`week-${weekIdx}`}
                    checked={selected?.weekIdx === weekIdx && selected.day === day.dayOfWeek}
                    onChange={() => handleDayChange(weekIdx, day.dayOfWeek)}
                    style={styles.radioInput}
                  />
                  Giorno {day.dayOfWeek}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button
          variant="contained"
          sx={styles.copyButton}
          onClick={handleCopyExercise}
          disabled={!selected || loading}
        >
          {loading ? 'Copia...' : 'Copia'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CopyExerciseModal;
