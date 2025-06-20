import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, IconButton, MenuItem, Select } from '@mui/material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import XIcon from '../../../../../icons/XIcon';
import { useTranslation } from 'react-i18next';
import { programTypes } from '../../TrainingProgramPage';
import { useTraining } from '../../../../../Context/TrainingContext';
import { useSnackbar } from '../../../../../Context/SnackbarContext';

const styles = {
  dialog: { borderRadius: 4, p: 0, background: '#fff', boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)', width: 520, maxWidth: '95vw' },
  backdrop: { backgroundColor: 'rgba(33,33,33,0.8)', backdropFilter: 'blur(5px)' },
  title: { fontSize: 38, fontWeight: 400, color: '#616160', pb: 0, pt: 4, px: 5, fontFamily: 'Montserrat, sans-serif' },
  closeBtn: { position: 'absolute', right: 24, top: 24, width: 40, height: 40, border: '2px solid #616160', color: '#616160' },
  content: { pt: 4, px: 5, pb: 5 },
  field: { mb: 3 },
  label: { fontSize: 16, color: '#888', mb: 1, fontFamily: 'Montserrat, sans-serif' },
  quill: { background: '#fff', borderRadius: 8, minHeight: 100, marginBottom: 24 },
  select: { width: '100%', minHeight: 45, fontSize: 16, borderRadius: 3, background: '#fff', borderColor: '#E0E0E0', padding: '10px 14px', color: '#616160' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 2, px: 5, pb: 4 },
  saveBtn: { background: '#EDB528', color: '#fff', fontSize: 20, fontWeight: 500, borderRadius: 2, px: 8, py: 1.5, fontFamily: 'Montserrat, sans-serif', textTransform: 'none', boxShadow: 'none', '&:hover': { background: '#e0a82e' } },
};

interface ModifyTrainingProgramModalProps {
  open: boolean;
  initialData?: { title: string; description: string; type: string } | null;
  onClose: () => void;
}

const ModifyTrainingProgramModal: React.FC<ModifyTrainingProgramModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { selectedTrainingProgram, modifyTrainingProgram } = useTraining();
  const { showSnackbar } = useSnackbar();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && selectedTrainingProgram) {
      setTitle(selectedTrainingProgram.title || '');
      setDesc(selectedTrainingProgram.description || '');
      setType(selectedTrainingProgram.type || '');
    } else if (open) {
      setTitle('');
      setDesc('');
      setType('');
    }
  }, [open, selectedTrainingProgram]);

  const handleSave = async () => {
    if (selectedTrainingProgram) {
      setLoading(true);
      try {
        await modifyTrainingProgram(selectedTrainingProgram.id, { title, description: desc, type });
        onClose();
        showSnackbar(t('trainingPrograms.modify.success', 'Training program updated successfully!'), 'success');
      } catch {
        showSnackbar(t('trainingPrograms.modify.error', 'Error while updating training program.'), 'error');
      } finally {
        setLoading(false);
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth PaperProps={{ sx: styles.dialog }}
      slotProps={{ backdrop: { timeout: 300, sx: styles.backdrop } }}
    >
      <DialogTitle sx={styles.title}>
        {t('training.editTrainingProgram', 'Modifica Programma')}
        <IconButton onClick={onClose} sx={styles.closeBtn}>
          <XIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.content}>
        <Box sx={styles.field}>
          <Typography sx={styles.label}>{t('training.programName', 'Titolo programma')}</Typography>
          <TextField
            fullWidth
            value={title}
            onChange={e => setTitle(e.target.value)}
            variant="outlined"
            sx={{ fontSize: 18, fontWeight: 400, color: '#616160', borderRadius: 2, background: '#fff', fontFamily: 'Montserrat, sans-serif' }}
          />
        </Box>
        <Box sx={styles.field}>
          <Typography sx={styles.label}>{t('training.description', 'Descrizione')}</Typography>
          <ReactQuill
            theme="snow"
            value={desc}
            onChange={setDesc}
            style={styles.quill as React.CSSProperties}
          />
        </Box>
        <Box sx={styles.field}>
          <Typography sx={styles.label}>{t('training.programType', 'Tipologia di allenamento')}</Typography>
          <Select
            value={type}
            onChange={e => setType(e.target.value)}
            displayEmpty
            sx={styles.select}
          >
            <MenuItem value="" disabled>{t('training.selectType', 'Seleziona tipologia')}</MenuItem>
            {programTypes.map(pt => (
              <MenuItem key={pt} value={pt}>{pt}</MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>
      <DialogActions sx={styles.actions}>
        <Button
          onClick={handleSave}
          sx={styles.saveBtn}
          size="large"
          disabled={!title.trim() || !type.trim() || loading}
        >
          {loading ? t('trainingPrograms.modify.loading', 'Saving...') : t('training.save', 'Salva')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModifyTrainingProgramModal;
