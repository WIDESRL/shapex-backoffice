import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField, MenuItem, Select, InputLabel, FormControl, IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import MagnifierIcon from '../../../../../icons/MagnifierIcon';
import FilterIcon from '../../../../../icons/FilterIcon';
import VideoIcon from '../../../../../icons/VideoIcon';
import DialogCloseIcon from '../../../../../icons/DialogCloseIcon2';
import { useTraining } from '../../../../../Context/TrainingContext';

const styles = {
  dialog: {
    borderRadius: 4,
    p: 0,
    background: '#fff',
    boxShadow: '0 4px 32px 0 rgba(33,33,33,0.10)',
    width: 900,
    maxWidth: '98vw',
  },
  title: {
    fontSize: 32,
    fontWeight: 400,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    textAlign: 'left',
    pt: 4,
    px: 5,
    pb: 0,
    letterSpacing: 0,
    lineHeight: 1.1,
  },
  content: { pt: 2, px: 5, pb: 5 },
  fieldRow: { display: 'flex', gap: 2, mb: 2, pt: 3 },
  field: { flex: 1, '& .MuiInputBase-root': { height: 40, minHeight: 40 } },
  searchSection: { mt: 4, mb: 2 },
  searchRow: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 },
  searchInput: { flex: 1, background: '#fff', borderRadius: 3, '& .MuiInputBase-root': { height: 40, minHeight: 40 } },
  filterBtn: { ml: 1 },
  exerciseList: { display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, minHeight: 120 },
  exerciseItem: {
    display: 'flex', alignItems: 'center', gap: 2, background: '#fff', borderRadius: 2, p: 0.3, cursor: 'pointer', minWidth: 220, mb: 1, boxShadow: '0 1px 4px 0 rgba(33,33,33,0.07)', minHeight: 40, height: 40
  },
  exerciseThumb: { width: 34, height: 34, borderRadius: 8, objectFit: 'cover', background: '#eee' },
  exerciseTitle: { fontWeight: 500, fontSize: 16, color: '#616160' },
  dragHandle: { cursor: 'grab', ml: 1 },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 2, px: 5, pb: 4 },
  saveBtn: {
    background: '#EDB528', color: '#fff', fontSize: 20, fontWeight: 500, borderRadius: 2, px: 8, py: 1.5, fontFamily: 'Montserrat, sans-serif', textTransform: 'none', boxShadow: 'none', '&:hover': { background: '#e0a82e' }
  },
  backdrop: { backgroundColor: 'rgba(33,33,33,0.8)', backdropFilter: 'blur(5px)' },
  filterSection: {
    maxHeight: 300,
    overflow: 'hidden',
    transition: 'max-height 0.3s ease',
    background: '#ededed',
    borderRadius: 2,
    mt: 1,
    mb: 2,
    px: 2,
    py: 2,
  },
  filterGroupTitle: { fontWeight: 600, mb: 1 },
  filterGroupBox: { display: 'flex', flexWrap: 'wrap', gap: 2 },
  filterCheckbox: { display: 'flex', alignItems: 'center', minWidth: 120, mb: 0.5 },
  filterCheckboxInput: { marginRight: 6 },
  filterCheckboxLabel: { fontWeight: 400, color: '#616160', fontSize: 16, cursor: 'pointer' },
  videoThumbBox: { position: 'relative', width: 34, height: 34, minWidth: 34, minHeight: 34, mr: 1 },
  videoThumbImg: { width: 34, height: 34, borderRadius: 8, objectFit: 'cover' },
  videoOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.15)', borderRadius: 2, zIndex: 1 },
  videoIconBox: { position: 'absolute', top: 7, left: 8, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
};

const exerciseTypes = ['Ripetizioni', 'Tempo', 'Ramping'];

interface InitialData {
  selectedExercises?: number[];
  fields?: Record<string, unknown>;
  note?: string;
}

interface EditExerciseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: unknown) => void;
  initialData?: InitialData;
  exercises: Array<{ id: number; title: string; thumbnailUrl: string }>;
}

const EditExerciseModal: React.FC<EditExerciseModalProps> = ({ open, onClose, onSave, initialData }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<number[]>(initialData?.selectedExercises || []);
  const [showFilters, setShowFilters] = useState(false);
  const { exercises, fetchExercisesWithoutLoading } = useTraining();

  useEffect(() => {
    if(open) fetchExercisesWithoutLoading();
  }, [fetchExercisesWithoutLoading, open]);

  // Drag & drop logic would go here (not implemented in this stub)

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth PaperProps={{ sx: styles.dialog }}  slotProps={{ backdrop: { timeout: 300, sx: styles.backdrop } }} >
      <DialogTitle sx={styles.title}>
        {t('trainingPage.editExercise', 'Modifica esercizio')}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 24, top: 24, background: 'transparent', boxShadow: 'none', p: 0 }}>
          <DialogCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.content}>
        {/* General Data Fields */}
        <Box sx={styles.fieldRow}>
          <TextField size='small' label={t('training.exerciseName', 'Nome esercizio')} sx={styles.field} InputProps={{ style: { height: 40, minHeight: 40 } }} />
          <FormControl sx={styles.field}>
            <InputLabel>{t('training.exerciseType', 'Tipo')}</InputLabel>
            <Select label={t('training.exerciseType', 'Tipo')} defaultValue={exerciseTypes[0]} sx={{ height: 40, minHeight: 40 }}>
              {exerciseTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField size='small' label={t('training.series', 'Serie')} type="number" sx={styles.field} InputProps={{ style: { height: 40, minHeight: 40 } }} />
          <TextField size='small' label={t('training.repOrTime', 'Ripetizioni/Tempo')} sx={styles.field} InputProps={{ style: { height: 40, minHeight: 40 } }} />
        </Box>
        <Box sx={styles.fieldRow}>
          <TextField size='small' label={t('training.rest', 'Recupero')} sx={styles.field} InputProps={{ style: { height: 40, minHeight: 40 } }} />
          <TextField size='small' label={t('training.weight', 'Peso')} sx={styles.field} InputProps={{ style: { height: 40, minHeight: 40 } }} />
          <TextField size='small' label={t('training.rpe', 'RPE')} sx={styles.field} InputProps={{ style: { height: 40, minHeight: 40 } }} />
          <TextField size='small' label={t('training.rir', 'RIR')} sx={styles.field} InputProps={{ style: { height: 40, minHeight: 40 } }} />
          <TextField size='small' label={t('training.tut', 'TUT')} sx={styles.field} InputProps={{ style: { height: 40, minHeight: 40 } }} />
        </Box>
        {/* Exercise Search & Filter Section */}
        <Typography sx={{ fontWeight: 500, fontSize: 20, mt: 4, mb: 1 }}>{t('trainingPage.exerciseList', 'Elenco esercizi')}</Typography>
        <Box sx={styles.searchRow}>
          <TextField
            placeholder={t('trainingPage.search', 'Cerca qui ...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={styles.searchInput}
            InputProps={{ startAdornment: <MagnifierIcon style={{ marginRight: 8 }} />, style: { height: 40, minHeight: 40 } }}
          />
          <IconButton sx={styles.filterBtn} onClick={() => setShowFilters((prev) => !prev)}>
            <FilterIcon />
          </IconButton>
        </Box>
        {/* Collapsible filter section */}
        <Box sx={{ ...styles.filterSection, maxHeight: showFilters ? 300 : 0, mb: showFilters ? 2 : 0, px: showFilters ? 2 : 0, py: showFilters ? 2 : 0 }}>
          {showFilters && (
            <Box>
              <Typography variant="subtitle1" sx={styles.filterGroupTitle}>
                Gruppi muscolari
              </Typography>
              <Box sx={styles.filterGroupBox}>
                {[
                  'Pettorali', 'Dorsali', 'Spalle', 'Trapezi', 'Bicipiti', 'Tricipiti', 'Avambracci', 'Quadricipiti',
                  'Femorali', 'Adduttori', 'Abduttori', 'Glutei', 'Polpacci', 'Addome', 'Total Body', 'Cardio', 'Stretching'
                ].map((group) => (
                  <Box key={group} sx={styles.filterCheckbox}>
                    <input type="checkbox" id={group} style={styles.filterCheckboxInput} />
                    <label htmlFor={group} style={styles.filterCheckboxLabel}>{group}</label>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={styles.exerciseList}>
          {exercises.map(ex => (
            <Box
              key={ex.id}
              sx={{
                ...styles.exerciseItem,
                minHeight: 40,
                height: 40,
                minWidth: 220,
                maxWidth: 320,
                flex: '1 1 220px',
                p: 0.5,
                background: selectedExercises[0] === ex.id ? '#EFEFEF' : '#fff',
                border: selectedExercises[0] === ex.id ? '2px solid #C3C3C3' : '2px solid #D9D9D9',
                position: 'relative',
                transition: 'background 0.2s, border 0.2s',
              }}
              onClick={() => setSelectedExercises([ex.id])}
            >
              {ex?.videoThumbnailFile?.signedUrl && (
                <Box sx={styles.videoThumbBox}>
                  <img
                    src={ex.videoThumbnailFile.signedUrl}
                    alt={ex.title}
                    style={styles.videoThumbImg as React.CSSProperties}
                  />
                  <Box sx={styles.videoOverlay} />
                  <Box sx={styles.videoIconBox}>
                    <VideoIcon style={{ width: 16, height: 16 }} />
                  </Box>
                </Box>
              )}
              <span style={styles.exerciseTitle as React.CSSProperties}>{ex.title}</span>
              <span style={{ flex: 1 }} />
              <input
                type="radio"
                checked={selectedExercises[0] === ex.id}
                readOnly
                style={{ marginLeft: 8, accentColor: '#EDB528', width: 22, height: 22 }}
              />
            </Box>
          ))}
        </Box>
        <TextField
          label={t('trainingPage.notes', 'Note')}
          multiline
          minRows={3}
          fullWidth
          defaultValue={initialData?.note || ''}
        />
      </DialogContent>
      <DialogActions sx={styles.actions}>
        <Button onClick={onSave} sx={styles.saveBtn} size="large">
          {t('training.save', 'Salva')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};




export default EditExerciseModal;
