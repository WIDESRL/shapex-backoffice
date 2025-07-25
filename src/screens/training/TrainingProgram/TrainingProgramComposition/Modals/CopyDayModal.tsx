import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton } from '@mui/material';
import DialogCloseIcon from '../../../../../icons/DialogCloseIcon2';
import { useTraining } from '../../../../../Context/TrainingContext';
import { useSnackbar } from '../../../../../Context/SnackbarContext';

const styles = {
  dialogPaper: {
    borderRadius: 4,
    p: 0,
    background: '#f5f5f5', // light grey background for the whole modal
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
    boxShadow: 'none', // remove shadow
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
    cursor: 'pointer', // make the whole option clickable
    userSelect: 'none',
  },
  radioInput: {
    marginRight: 8,
    width: 22,
    height: 22,
    accentColor: '#616160', // custom grey color for checked state
  },
  dialogActions: { px: 4, pb: 4, pt: 0, display: 'flex', justifyContent: 'flex-end' },
  copyButton: { background: '#EDB528', color: '#fff', borderRadius: 2.5, fontWeight: 500, fontSize: 24, px: 8, py: 2, minWidth: 180, boxShadow: 0, textTransform: 'none', fontFamily: 'Montserrat, sans-serif', '&:hover': { background: '#d1a53d' } },
};

interface CopyDayModalProps {
  open: boolean;
  onClose: () => void;
  sourceWeekId: number;
  sourceDayOfWeek: number;
}

const CopyDayModal: React.FC<CopyDayModalProps> = ({ open, onClose, sourceWeekId, sourceDayOfWeek }) => {
  const { selectedTrainingProgram, cloneDay } = useTraining();
  const { showSnackbar } = useSnackbar();
  const weeks = selectedTrainingProgram?.weeks || [];

  // State: selected week and day
  const [selected, setSelected] = useState<{ weekIdx: number; day: number } | null>(null);

  // Reset selection if weeks change
  React.useEffect(() => {
    setSelected(null);
  }, [weeks.length]);

  const handleDayChange = (weekIdx: number, day: number) => {
    setSelected({ weekIdx, day });
  };

  const handleCloneDay = async () => {
    if (selected) {
      const destinationWeek = weeks[selected.weekIdx];
      const destinationDay = selected.day;
      try {
        await cloneDay(
          sourceWeekId,
          sourceDayOfWeek,
          destinationWeek.id,
          destinationDay
        );
        onClose();
      } catch (error: unknown) {
        console.error('Error cloning day:', error);
        showSnackbar('Errore durante la clonazione del giorno', 'error');
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth TransitionComponent={undefined}
      PaperProps={{ sx: styles.dialogPaper }}
      slotProps={{ backdrop: { timeout: 300, sx: styles.dialogBackdrop } }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        Copia giorno
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <DialogCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        {weeks.map((week, weekIdx) => (
          <Box key={week.id} sx={styles.weekBox}>
            <Typography sx={styles.weekTitle}>{`Settimana ${week.order}`}</Typography>
            <Box sx={styles.radioGroup}>
              {Array.from({ length: 7 }, (_, i) => i + 1).map(day => {
                const isCreated = week.days.some(d => d.dayOfWeek === day);
                return (
                  <Box
                    key={day}
                    sx={{ ...styles.radioOption, opacity: isCreated ? 0.5 : 1, pointerEvents: isCreated ? 'none' : 'auto' }}
                    onClick={() => !isCreated && handleDayChange(weekIdx, day)}
                  >
                    <input
                      type="radio"
                      name={`week-${weekIdx}`}
                      checked={selected?.weekIdx === weekIdx && selected.day === day}
                      disabled={isCreated}
                      onChange={() => handleDayChange(weekIdx, day)}
                      style={styles.radioInput}
                    />
                    Giorno {day}
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button
          variant="contained"
          sx={styles.copyButton}
          onClick={handleCloneDay}
          disabled={!selected}
        >
          Copia
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CopyDayModal;
