import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, TextField, MenuItem, Select, InputLabel, FormControl, IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import MagnifierIcon from '../../../../../icons/MagnifierIcon';
import FilterIcon from '../../../../../icons/FilterIcon';
import VideoIcon from '../../../../../icons/VideoIcon';
import DialogCloseIcon from '../../../../../icons/DialogCloseIcon2';
import { useTraining, WorkoutExercisePayload } from '../../../../../Context/TrainingContext';
import { useSnackbar } from '../../../../../Context/SnackbarContext';

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
  emptyStateBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    padding: 3,
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 2,
    border: '1px solid #e9ecef',
    width: '100%',
    flex: '1 1 100%'
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    backgroundColor: '#dee2e6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2
  },
  emptyStateTitle: {
    fontWeight: 600,
    color: '#495057',
    marginBottom: 1
  },
  emptyStateDescription: {
    color: '#6c757d',
    maxWidth: 500,
    lineHeight: 1.5
  }
};

const exerciseTypes = ['Ripetizioni', 'Tempo', 'Ramping'];

const muscleGroups = [
  'Pettorali', 'Dorsali', 'Spalle', 'Trapezi', 'Bicipiti', 'Tricipiti', 'Avambracci', 'Quadricipiti',
  'Femorali', 'Adduttori', 'Abduttori', 'Glutei', 'Polpacci', 'Addome', 'Total Body', 'Cardio', 'Stretching'
];

export interface InitialData {
  selectedExercises?: number[];
  fields?: Record<string, unknown>;
  note?: string;
}

interface EditExerciseModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: InitialData;
  dayId?: number | null;
  editExerciseId?: number | null;
  supersetWorkoutExerciseId?: number | null;
}

const AddEditExerciseModal: React.FC<EditExerciseModalProps> = ({ open, onClose, initialData, dayId, editExerciseId, supersetWorkoutExerciseId }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [search, setSearch] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<number[]>(initialData?.selectedExercises || []);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const { exercises, fetchExercisesWithoutLoading, selectedTrainingProgram, createWorkoutExercise, updateWorkoutExercise } = useTraining();

  // Find the day object from the context training program using dayId
  const selectedDay = React.useMemo(() => {
    if (!dayId || !selectedTrainingProgram) return undefined;
    for (const week of selectedTrainingProgram.weeks) {
      const day = week.days.find(d => d.id === dayId);
      if (day) return day;
    }
    return undefined;
  }, [dayId, selectedTrainingProgram]);

  // Find the next order number for the new exercise in the selected day
  const nextOrder = React.useMemo(() => {
    if (!selectedDay) return 1;
    const maxOrder = selectedDay.exercises.reduce((max, ex) => Math.max(max, ex.order), 0);
    return maxOrder + 1;
  }, [selectedDay]);

  // Form state for required/optional fields
  const [type, setType] = useState('Ripetizioni');
  const [series, setSeries] = useState('');
  const [repOrTime, setRepOrTime] = useState('');
  const [rest, setRest] = useState('');
  const [weight, setWeight] = useState('');
  const [rpe, setRpe] = useState('');
  const [rir, setRir] = useState('');
  const [tut, setTut] = useState('');
  const [note, setNote] = useState(initialData?.note || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Debounced fetch function for search and muscle group filtering
  const debouncedFetchExercises = useCallback(() => {
    const timeoutId = setTimeout(() => {
      if (open) {
        // Always pass current values, even if empty (to allow clearing filters)
        const searchParam = search.trim() || undefined;
        const muscleGroupsParam = selectedMuscleGroups.length > 0 ? selectedMuscleGroups : undefined;
        fetchExercisesWithoutLoading(1000, searchParam, muscleGroupsParam);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fetchExercisesWithoutLoading, open, search, selectedMuscleGroups]);

  // Effect to trigger debounced search when search or selectedMuscleGroups change
  useEffect(() => {
    if (open) {
      const cleanup = debouncedFetchExercises();
      return cleanup;
    }
  }, [search, selectedMuscleGroups, debouncedFetchExercises, open]);

  // Handler for muscle group checkbox changes
  const handleMuscleGroupChange = (group: string) => {
    setSelectedMuscleGroups(prev => {
      const newSelection = prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group];
      
      return newSelection;
    });
  };

  // Reset all form values when modal is closed
  useEffect(() => {
    if (!open) {
      setType('Ripetizioni');
      setSeries('');
      setRepOrTime('');
      setRest('');
      setWeight('');
      setRpe('');
      setRir('');
      setTut('');
      setNote(initialData?.note || '');
      setSelectedExercises(initialData?.selectedExercises || []);
      setSelectedMuscleGroups([]);
      setErrors({});
      setSearch('');
      setShowFilters(false);
    } else {
      // When modal opens, fetch all exercises without filters initially
      fetchExercisesWithoutLoading();
    }
  }, [open, initialData, fetchExercisesWithoutLoading]);

  // Populate form state when editing an exercise
  useEffect(() => {
    if (open && editExerciseId && selectedDay) {
      const ex = selectedDay.exercises.find(e => e.id === editExerciseId);
      if (ex) {
        setType(ex.type || 'Ripetizioni');
        setSeries(ex.sets?.toString() || '');
        setRepOrTime(ex.repsOrTime?.toString() || '');
        setRest(ex.rest?.toString() || '');
        setWeight(ex.weight?.toString() || '');
        setRpe(ex.rpe?.toString() || '');
        setRir(ex.rir?.toString() || '');
        setTut(ex.tut?.toString() || '');
        setNote(ex.note || '');
        setSelectedExercises([ex.exerciseId]);
        setErrors({});
      }
    }
  }, [open, editExerciseId, selectedDay]);

  // Memoized edit mode: true if editExerciseId exists
  const editMode = React.useMemo(() => !!editExerciseId, [editExerciseId]);
  const superSetNode =  React.useMemo(() => !!supersetWorkoutExerciseId, [supersetWorkoutExerciseId]);

  // Validation logic for required fields
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!type) newErrors.type = t('validation.required', 'Campo obbligatorio');
    if (!series) newErrors.series = t('validation.required', 'Campo obbligatorio');
    if (!repOrTime) newErrors.repOrTime = t('validation.required', 'Campo obbligatorio');
    if (!rest) newErrors.rest = t('validation.required', 'Campo obbligatorio');
    if (!selectedExercises[0]) newErrors.selectedExercises = t('validation.required', 'Seleziona un esercizio');
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    if (!dayId) return;
    const payload: WorkoutExercisePayload = {
      exerciseId: selectedExercises[0],
      type,
      sets: Number(series),
      repsOrTime: repOrTime,
      rest: Number(rest),
      weight: weight ? Number(weight) : undefined,
      rpe: rpe ? Number(rpe) : undefined,
      rir: rir ? Number(rir) : undefined,
      tut: tut ? Number(tut) : undefined,
      note: note,
    };
    if(!editMode) payload.order = nextOrder;
    if(superSetNode) payload.supersetWorkoutExerciseId = supersetWorkoutExerciseId;
    try {
      if (editMode && editExerciseId) {
        await updateWorkoutExercise(editExerciseId, payload);
      } else {
         await createWorkoutExercise(dayId, payload);
      }
  
      onClose();
    } catch {
      showSnackbar(
        editMode
          ? t('trainingPage.exerciseUpdateError', "Errore durante l'aggiornamento dell'esercizio")
          : t('trainingPage.exerciseAddError', "Errore durante la creazione dell'esercizio"),
        'error'
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth PaperProps={{ sx: styles.dialog }}  slotProps={{ backdrop: { timeout: 300, sx: styles.backdrop } }} >
      <DialogTitle sx={styles.title}>
        {superSetNode ? t('training.addSupersetExercise') :  editMode ? t('training.editExercise') : t('training.addExercise')}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 24, top: 24, background: 'transparent', boxShadow: 'none', p: 0 }}>
          <DialogCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.content}>
        {/* General Data Fields */}
        <Box sx={styles.fieldRow}>
          {/* Type (required) */}
          <FormControl sx={styles.field} error={!!errors.type}>
            <InputLabel>{t('training.exerciseType', 'Tipo')}</InputLabel>
            <Select
              label={t('training.exerciseType', 'Tipo')}
              value={type}
              onChange={e => setType(e.target.value)}
              sx={{ height: 40, minHeight: 40 }}
            >
              {exerciseTypes.map(typeOption => (
                <MenuItem key={typeOption} value={typeOption}>{typeOption}</MenuItem>
              ))}
            </Select>
            {errors.type && <Typography color="error" variant="caption">{errors.type}</Typography>}
          </FormControl>
          {/* Series (required) */}
          <TextField
            size='small'
            label={t('training.series', 'Serie')}
            type="number"
            value={series}
            onChange={e => setSeries(e.target.value)}
            error={!!errors.series}
            helperText={errors.series}
            sx={styles.field}
            InputProps={{ style: { height: 40, minHeight: 40 } }}
          />
          {/* RepOrTime (required) */}
          <TextField
            size='small'
            type="number"
            label={t('training.repOrTime', 'Ripetizioni/Tempo')}
            value={repOrTime}
            onChange={e => setRepOrTime(e.target.value)}
            error={!!errors.repOrTime}
            helperText={errors.repOrTime}
            sx={styles.field}
            InputProps={{ style: { height: 40, minHeight: 40 } }}
          />
          {/* Rest (required) */}
          <TextField
            size='small'
            type="number"
            label={t('training.rest', 'Recupero')}
            value={rest}
            onChange={e => setRest(e.target.value)}
            error={!!errors.rest}
            helperText={errors.rest}
            sx={styles.field}
            InputProps={{ style: { height: 40, minHeight: 40 } }}
          />
        </Box>
        <Box sx={styles.fieldRow}>
          {/* Weight (optional) */}
          <TextField size='small' type="number" label={t('training.weight', 'Peso')} value={weight} onChange={e => setWeight(e.target.value)} sx={styles.field} InputProps={{ style: { height: 40, minHeight: 40 } }} />
          {/* RPE (optional) */}
          <TextField size='small' type="number" label={t('training.rpe', 'RPE')} value={rpe} onChange={e => setRpe(e.target.value)} sx={styles.field} InputProps={{ style: { height: 40, minHeight: 40 } }} />
          {/* RIR (optional) */}
          <TextField size='small' type="number" label={t('training.rir', 'RIR')} value={rir} onChange={e => setRir(e.target.value)} sx={styles.field} InputProps={{ style: { height: 40, minHeight: 40 } }} />
          {/* TUT (optional) */}
          <TextField size='small' type="number" label={t('training.tut', 'TUT')} value={tut} onChange={e => setTut(e.target.value)} sx={styles.field} InputProps={{ style: { height: 40, minHeight: 40 } }} />
        </Box>
        {/* Exercise Search & Filter Section */}
        <Typography sx={{ fontWeight: 500, fontSize: 20, mt: 4, mb: 1 }}>{t('trainingPage.exerciseList', 'Elenco esercizi')}</Typography>
        {errors.selectedExercises && (
          <Typography color="error" variant="caption" sx={{ mb: 1, display: 'block' }}>
            {errors.selectedExercises}
          </Typography>
        )}
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
                {muscleGroups.map((group) => (
                  <Box key={group} sx={styles.filterCheckbox}>
                    <input 
                      type="checkbox" 
                      id={group} 
                      checked={selectedMuscleGroups.includes(group)}
                      onChange={() => handleMuscleGroupChange(group)}
                      style={styles.filterCheckboxInput} 
                    />
                    <label htmlFor={group} style={styles.filterCheckboxLabel}>{group}</label>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={styles.exerciseList}>
          {exercises.length === 0 ? (
            <Box sx={styles.emptyStateBox}>
              <Box sx={styles.emptyStateIcon}>
                <MagnifierIcon style={{ width: 24, height: 24, color: '#6c757d' }} />
              </Box>
              <Typography variant="h6" sx={styles.emptyStateTitle}>
                {t('training.exerciseEmptyStateTitle', 'Nessun esercizio trovato')}
              </Typography>
              <Typography variant="body2" sx={styles.emptyStateDescription}>
                {t('training.exerciseEmptyStateDesc', 'Nessun esercizio corrisponde ai criteri di ricerca o ai filtri del gruppo muscolare correnti. Prova a modificare i filtri o i termini di ricerca.')}
              </Typography>
            </Box>
          ) : (
            exercises.map(ex => (
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
            ))
          )}
        </Box>
        <TextField
          label={t('trainingPage.notes', 'Note')}
          multiline
          minRows={3}
          fullWidth
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={styles.actions}>
        <Button onClick={handleSave} sx={styles.saveBtn} size="large">
          {t('training.save', 'Salva')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditExerciseModal;
