import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Fade } from '@mui/material';
import DialogCloseIcon from '../../../../../icons/DialogCloseIcon2';

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
  formControl: {
    mb: 4,
    borderRadius: 2,
    mt: 3,
    width: '100%',
  },
  inputLabel: {
    fontSize: 18,
    color: '#888',
    top: '-4px',
    fontFamily: 'Montserrat, sans-serif',
  },
  select: {
    borderRadius: 3,
    fontSize: 22,
    background: '#fff',
    borderColor: '#E0E0E0',
    minHeight: 60,
    height: 60,
    fontFamily: 'Montserrat, sans-serif',
    color: '#616160',
  },
  textField: {
    mb: 4,
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      fontSize: 22,
      background: '#fff',
      borderColor: '#E0E0E0',
      minHeight: 60,
      height: 60,
      fontFamily: 'Montserrat, sans-serif',
      color: '#616160',
    },
    '& .MuiInputLabel-root': {
      fontSize: 18,
      color: '#888',
      top: '-4px',
      fontFamily: 'Montserrat, sans-serif',
    },
  },
  dialogActions: {
    px: 4,
    pb: 4,
    pt: 0,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  addButton: {
    background: '#EDB528',
    color: '#fff',
    borderRadius: 2.5,
    fontWeight: 500,
    fontSize: 24,
    px: 8,
    py: 2,
    minWidth: 180,
    boxShadow: 0,
    textTransform: 'none',
    fontFamily: 'Montserrat, sans-serif',
    '&:hover': { background: '#d1a53d' },
  },
};

const daysOfWeek = [
  { value: 1, label: 'Lunedì' },
  { value: 2, label: 'Martedì' },
  { value: 3, label: 'Mercoledì' },
  { value: 4, label: 'Giovedì' },
  { value: 5, label: 'Venerdì' },
  { value: 6, label: 'Sabato' },
  { value: 7, label: 'Domenica' },
];

interface AddDayModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (day: number, workoutName: string) => void;
}

const AddDayModal: React.FC<AddDayModalProps> = ({ open, onClose, onAdd }) => {
  const [day, setDay] = useState<number>(1);
  const [workoutName, setWorkoutName] = useState('');

  const handleAdd = () => {
    onAdd(day, workoutName);
    setWorkoutName('');
    setDay(1);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth TransitionComponent={Fade}
      PaperProps={{ sx: styles.dialogPaper }}
      slotProps={{ backdrop: { timeout: 300, sx: styles.dialogBackdrop } }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        Aggiungi Giorno
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <DialogCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <FormControl sx={styles.formControl}>
          <InputLabel sx={styles.inputLabel}>Giorno della settimana</InputLabel>
          <Select
            value={day}
            label="Giorno della settimana"
            onChange={e => setDay(Number(e.target.value))}
            sx={styles.select}
          >
            {daysOfWeek.map(d => (
              <MenuItem key={d.value} value={d.value} sx={{ fontSize: 22, fontFamily: 'Montserrat, sans-serif' }}>{d.value}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Nome Workout"
          value={workoutName}
          onChange={e => setWorkoutName(e.target.value)}
          fullWidth
          sx={styles.textField}
          InputProps={{ style: { fontSize: 22, color: '#616160', fontFamily: 'Montserrat, sans-serif', height: 60, minHeight: 60 } }}
          InputLabelProps={{ style: { fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif' } }}
        />
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={styles.addButton}
          disabled={!workoutName.trim()}
        >
          Aggiungi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDayModal;
