import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Autocomplete,
} from '@mui/material';
import EditIcon from '../../../icons/EditIcon';
import DeleteIcon from '../../../icons/DeleteIcon';
import VideoIcon from '../../../icons/VideoIcon';
import PlusIcon from '../../../icons/PlusIcon';
import MagnifierIcon from '../../../icons/MagnifierIcon';
import ExerciseModal, { ExerciseModalSaveData, ExerciseModalUpdateData } from './ExerciseModal';
import DeleteDialog from '../DeleteDialog';
import VideoPreviewDialog from './VideoPreviewDialog';
import { useTraining } from '../../../Context/TrainingContext';
import { Exercise } from '../../../types/trainingProgram.types';
import { useTranslation } from 'react-i18next';
import OutlinedTextIconButton from '../../../components/OutlinedTextIconButton';
import { muscleGroups } from '../../../constants/muscleGroups';

// Styles object for TrainingExercisePage
const styles = {
  root: { p: 4, background: '#fff',  },
  title: { fontSize: 38, fontWeight: 400, color: '#616160', fontFamily: 'Montserrat, sans-serif', mb: 3 },
  sectionHeader: { fontSize: 28, fontWeight: 400, color: '#616160', fontFamily: 'Montserrat, sans-serif' },
  filterContainer: {
    display: 'flex',
    gap: 2,
    mb: 3,
    alignItems: 'center',
  },
  searchInput: {
    minWidth: 300,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      background: '#fff',
      fontSize: 16,
    },
  },
  muscleGroupSelect: {
    minWidth: 200,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      background: '#fff',
    },
  },
  paper: { background: '#F6F6F6', borderRadius: 3, boxShadow: 'none' },
  tableContainer: { background: 'transparent', boxShadow: 'none' },
  tableHeadCell: { fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0 },
  tableHeadCellFirst: { fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0, borderTopLeftRadius: 12 },
  tableHeadCellLast: { fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0, borderTopRightRadius: 12 },
  tableRow: { background: '#fff', borderBottom: '1px solid #ededed' },
  tableCell: { fontSize: 18, color: '#616160', fontFamily: 'Montserrat, sans-serif', border: 0 },
  videoBox: { display: 'flex', alignItems: 'center', gap: 1 },
  actionCell: { border: 0, textAlign: 'center', whiteSpace: 'nowrap' },
  editIcon: { fontSize: 22, color: '#E6BB4A' },
  deleteIcon: { fontSize: 22, color: '#E57373' },
  videoIcon: { width: 22, height: 22, color: '#616160' },
  emptyCell: { py: 8, background: '#fafafa' },
  emptyBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  emptyIconBox: { border: '2px solid #E6BB4A', borderRadius: 1, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 },
  emptyTitle: { color: '#bdbdbd', fontSize: 22, fontWeight: 500, fontFamily: 'Montserrat, sans-serif' },
  emptyDesc: { color: '#bdbdbd', fontSize: 16, fontFamily: 'Montserrat, sans-serif' },
};

interface TrainingExercisePageProps {
  showHeader?: boolean;
  rowLimit?: number;
}

const TrainingExercisePage = ({ rowLimit, showHeader = true }: TrainingExercisePageProps) => {
  const { t } = useTranslation();
  const {
    fetchExercises,
    loadMoreExercises,
    updateExercise,
    deleteExercise,
    exercises,
    addExercise,
  } = useTraining();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [editData, setEditData] = useState<Exercise | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Exercise | null>(null);
  const [videoPreviewOpen, setVideoPreviewOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounced fetch function
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const debouncedFetchExercises = useCallback(
    (params: { limit?: number; search?: string; muscleGroups?: string[]; resetPagination?: boolean }) => {
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      // Set new timeout
      debounceTimeoutRef.current = setTimeout(() => {
        setIsLoading(true);
        fetchExercises({
          limit: params.limit,
          search: params.search,
          muscleGroups: params.muscleGroups,
          page: params.resetPagination ? 1 : undefined,
          resetPagination: params.resetPagination
        }).finally(() => setIsLoading(false));
      }, 500);
    },
    [fetchExercises]
  );

  // Initial load
  useEffect(() => {
    debouncedFetchExercises({ 
      limit: rowLimit, 
      search: searchTerm, 
      muscleGroups: selectedMuscleGroup ? [selectedMuscleGroup] : undefined,
      resetPagination: true 
    });
  }, [searchTerm, selectedMuscleGroup, debouncedFetchExercises, rowLimit]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const currentExercises = exercises?.exercises || [];
  const hasMore = exercises ? exercises.page < exercises.totalPages : false;

  const handleLoadMore = useCallback(() => {
    if (exercises && exercises.page < exercises.totalPages) {
      setIsLoading(true);
      loadMoreExercises().finally(() => setIsLoading(false));
    }
  }, [exercises, loadMoreExercises]);

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };
  const handleEdit = (row: Exercise) => {
    setEditData(row);
    setModalOpen(true);
  };
  const handleDelete = (row: Exercise) => {
    setDeleteTarget(row);
    setDeleteDialogOpen(true);
  };
  const handleVideoPreview = (ex: Exercise) => {
    const url = ex.videoFile?.signedUrl || '';
    setVideoUrl(url);
    setVideoPreviewOpen(true);
  };

  const handleSave = async (data: ExerciseModalSaveData) => {
    try {
      const exerciseData = {
        title: data.title,
        muscleGroup: data.muscleGroup,
        description: data.description,
        videoFile: data.video || null,
        videoThumbnailFile: data.videoThumbnail || null,
        videoDuration: data.videoDuration || undefined,
      };
      await addExercise(exerciseData);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (data: ExerciseModalUpdateData) => {
    try {
      if (!editData) return;
      const updateData = {
        title: data.title,
        muscleGroup: data.muscleGroup,
        description: data.description,
        video: data.video,
        videoThumbnail: data.videoThumbnail,
        videoDuration: data.videoDuration || undefined,
        originalVideoFileName: data.originalVideoFileName,
      };
      await updateExercise(editData.id, updateData);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteExercise(deleteTarget.id);
      } catch (err) {
        console.error(err);
      }
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  function stripHtml(html: string): string {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > 100 ? text.slice(0, 100) + '...' : text;
  }

  return (
    <Box sx={styles.root}>
      {showHeader && (
        <>
          <Typography sx={styles.title}>
            {t('training.title')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={styles.sectionHeader}>{t('training.exercises')}</Typography>
            <OutlinedTextIconButton
              text={t('training.addExercise')}
              icon={<PlusIcon style={{ fontSize: 28, marginLeft: 8 }} />}
              onClick={handleAdd}
            />
          </Box>
          
          {/* Filter Section */}
          <Box sx={styles.filterContainer}>
            <TextField
              placeholder={t('training.searchExercises')}
              variant="outlined"
              size="small"
              sx={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifierIcon style={{ color: '#bdbdbd', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <Autocomplete
              size="small"
              sx={styles.muscleGroupSelect}
              options={muscleGroups}
              value={selectedMuscleGroup || null}
              onChange={(_, newValue) => setSelectedMuscleGroup(newValue || '')}
              getOptionLabel={(option) => t(`training.muscleGroups.${option}`)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label={t('training.muscleGroup')}
                  variant="outlined"
                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
              clearOnEscape
            />
          </Box>
        </>
      )}
      <Paper elevation={0} sx={styles.paper}>
        <TableContainer sx={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow sx={{ overflow: 'hidden' }}>
                <TableCell sx={styles.tableHeadCellFirst}>{t('training.exerciseName')}</TableCell>
                <TableCell sx={styles.tableHeadCell}>{t('training.description')}</TableCell>
                <TableCell sx={styles.tableHeadCell}>{t('training.muscleGroup')}</TableCell>
                <TableCell sx={styles.tableHeadCell}>{t('training.video')}</TableCell>
                <TableCell sx={{ ...styles.tableHeadCellLast, textAlign: 'center' }}>{t('training.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                [...Array(rowLimit || 3)].map((_, idx) => (
                  <TableRow key={idx} sx={styles.tableRow}>
                    {[...Array(5)].map((_, cidx) => (
                      <TableCell key={cidx} sx={styles.tableCell}>
                        <Box sx={{ width: '100%', height: 24, background: '#eee', borderRadius: 2, animation: 'pulse 1.2s infinite' }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : !currentExercises.length ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={styles.emptyCell}>
                    <Box sx={styles.emptyBox}>
                      <Box sx={styles.emptyIconBox}>
                        <VideoIcon style={{ fontSize: 22, color: '#E6BB4A' }} />
                      </Box>
                      <Typography sx={styles.emptyTitle}>
                        {searchTerm || selectedMuscleGroup ? t('training.exerciseEmptyStateTitle') : t('training.noExercisesTitle')}
                      </Typography>
                      <Typography sx={styles.emptyDesc}>
                        {searchTerm || selectedMuscleGroup ? t('training.exerciseEmptyStateDesc') : t('training.noExercisesDesc')}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                (rowLimit ? currentExercises.slice(0, rowLimit) : currentExercises).map((ex, idx) => (
                  <TableRow key={ex.id || idx} sx={styles.tableRow}>
                    <TableCell sx={styles.tableCell}>{ex.title}</TableCell>
                    <TableCell sx={styles.tableCell}>{stripHtml(ex.description)}</TableCell>
                    <TableCell sx={styles.tableCell}>{ex.muscleGroup}</TableCell>
                    <TableCell sx={styles.tableCell}>
                      <Box sx={styles.videoBox}>
                        {(ex.videoFileId) && (
                          <IconButton size="small" onClick={() => handleVideoPreview(ex)}>
                            <VideoIcon style={styles.videoIcon} />
                          </IconButton>
                        )}
                        <span>{ex.videoDuration ? `${ex.videoDuration} ${t('training.seconds')}` : ''}</span>
                      </Box>
                    </TableCell>
                    <TableCell sx={styles.actionCell}>
                      <IconButton size="small" sx={{ mr: 1 }} onClick={() => handleEdit(ex)}><EditIcon style={styles.editIcon} /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(ex)}><DeleteIcon style={styles.deleteIcon} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Load More Button */}
      {!rowLimit && hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={isLoading}
            sx={{
              borderColor: '#E6BB4A',
              color: '#E6BB4A',
              '&:hover': {
                borderColor: '#d4a737',
                backgroundColor: '#f9f2e4',
              },
            }}
          >
            {isLoading ? t('training.loading') : t('training.loadMore')}
          </Button>
        </Box>
      )}
      
      <ExerciseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onUpdate={handleUpdate}
        initialData={editData || undefined}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        title={t('training.deleteExerciseTitle')}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
      />
      <VideoPreviewDialog
        open={videoPreviewOpen}
        onClose={() => setVideoPreviewOpen(false)}
        videoUrl={videoUrl}
      />
    </Box>
  );
};

export default TrainingExercisePage;
