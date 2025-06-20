import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton } from '@mui/material';
import DialogCloseIcon from '../../../../../icons/DialogCloseIcon2';

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

const weeks = [
  { name: 'Settimana 1', days: 7 },
  { name: 'Settimana 2', days: 7 },
  { name: 'Settimana 2', days: 7 },
];

interface CopyDayModalProps {
  open: boolean;
  onClose: () => void;
}

const CopyDayModal: React.FC<CopyDayModalProps> = ({ open, onClose }) => {
  // State: multiple selected days per week (array of arrays)
  const [selectedDays, setSelectedDays] = useState<number[][]>(weeks.map(() => []));

  const handleDayChange = (weekIdx: number, day: number) => {
    setSelectedDays(prev => prev.map((days, idx) =>
      idx === weekIdx
        ? days.includes(day)
          ? days.filter(d => d !== day)
          : [...days, day]
        : days
    ));
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
          <Box key={weekIdx} sx={styles.weekBox}>
            <Typography sx={styles.weekTitle}>{week.name}</Typography>
            <Box sx={styles.radioGroup}>
              {[1,2,3,4,5,6,7].map(day => (
                <Box key={day} sx={styles.radioOption} onClick={() => handleDayChange(weekIdx, day)}>
                  <input
                    type="radio"
                    checked={selectedDays[weekIdx].includes(day)}
                    onChange={() => handleDayChange(weekIdx, day)}
                    style={styles.radioInput}
                  />
                  Giorno {day}
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
          onClick={onClose}
        >
          Copia
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CopyDayModal;
