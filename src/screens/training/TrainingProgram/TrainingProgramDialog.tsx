import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Typography, Button, IconButton } from '@mui/material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DialogCloseIcon from '../../../icons/DialogCloseIcon2';

interface TrainingProgramDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; type: string }) => void;
  loading?: boolean;
  editData?: { title: string; description: string; type: string } | null;
  programTypes: string[];
  t: (key: string, defaultText?: string) => string;
}

const TrainingProgramDialog: React.FC<TrainingProgramDialogProps> = ({
  open,
  onClose,
  onSave,
  loading = false,
  editData,
  programTypes,
  t,
}) => {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [type, setType] = React.useState('');

  React.useEffect(() => {
    if (open && editData) {
      setTitle(editData.title || '');
      setDesc(editData.description || '');
      setType(editData.type || '');
    } else if (open) {
      setTitle('');
      setDesc('');
      setType('');
    }
  }, [open, editData]);

  const handleSave = () => {
    onSave({ title, description: desc, type });
  };

  const styles = {
    dialogTitle: {
      fontSize: 28,
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
    textField: {
      mb: 3,
      borderRadius: 2,
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        fontSize: 16,
        background: '#fff',
        borderColor: '#E0E0E0',
        minHeight: 45,
        height: 45,
      },
      '& .MuiInputLabel-root': {
        fontSize: 16,
        color: '#888',
        top: '-4px',
      },
    },
    textFieldInput: {
      borderRadius: 2,
      fontSize: 16,
      background: '#fff',
      borderColor: '#E0E0E0',
      minHeight: 45,
      height: 45,
    },
    textFieldLabel: {
      fontSize: 16,
      color: '#888',
    },
    descLabel: {
      mb: 3,
      fontWeight: 500,
      color: '#616160',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 15,
    },
    quill: {
      background: '#fff',
      borderRadius: 8,
      minHeight: 100,
      marginBottom: 24,
    },
    selectBox: {
      mb: 3,
    },
    selectLabel: {
      fontSize: 16,
      color: '#888',
      mb: 1,
    },
    select: {
      width: '100%',
      minHeight: 45,
      fontSize: 16,
      borderRadius: 3,
      background: '#fff',
      borderColor: '#E0E0E0',
      padding: '10px 14px',
      color: '#616160',
    },
    actions: {
      px: 4,
      pb: 4,
      pt: 0,
    },
    saveBtn: {
      background: '#EDB528',
      color: '#fff',
      borderRadius: 2.5,
      fontWeight: 500,
      fontSize: 18,
      px: 5,
      py: 1.2,
      minWidth: 120,
      boxShadow: 0,
      textTransform: 'none',
      fontFamily: 'Montserrat, sans-serif',
      '&:hover': { background: '#d1a53d' },
    },
    loader: {
      display: 'inline-block',
      verticalAlign: 'middle',
      width: 22,
      height: 22,
      border: '3px solid #fff',
      borderTop: '3px solid #EDB528',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth TransitionComponent={undefined}
      PaperProps={{ sx: { borderRadius: 4, p: 0, background: '#fff', boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)', width: 520, maxWidth: '95vw' } }}
      slotProps={{ backdrop: { timeout: 300, sx: { backgroundColor: 'rgba(33,33,33,0.8)', backdropFilter: 'blur(5px)' } } }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        {editData ? t('training.editTrainingProgram', 'Modifica Programma') : t('training.addTrainingProgram', 'Aggiungi Programma')}
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <DialogCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <Box sx={{ height: 18 }} />
        <TextField
          label={t('training.programName', 'Nome programma')}
          value={title}
          onChange={e => setTitle(e.target.value)}
          fullWidth
          sx={styles.textField}
          InputProps={{ sx: styles.textFieldInput }}
          InputLabelProps={{ sx: styles.textFieldLabel }}
        />
        <Box>
          <Box sx={styles.descLabel}>{t('training.description')}</Box>
          <ReactQuill
            theme="snow"
            value={desc}
            onChange={val => setDesc(val)}
            style={styles.quill as React.CSSProperties}
          />
        </Box>
        <Box sx={styles.selectBox}>
          <Typography sx={styles.selectLabel}>{t('training.programType', 'Tipologia di allenamento')}</Typography>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            style={styles.select as React.CSSProperties}
          >
            <option value="" disabled>{t('training.selectType', 'Seleziona tipologia')}</option>
            {programTypes.map(pt => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>
        </Box>
      </DialogContent>
      <DialogActions sx={styles.actions}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={styles.saveBtn}
          disabled={!title.trim() || !type.trim() || loading}
        >
          {loading ? <span className="loader" style={styles.loader} /> : (editData ? t('training.saveChanges') : t('training.save'))}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrainingProgramDialog;
