import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DialogCloseIcon from '../../icons/DialogCloseIcon2';
import { useTraining } from '../../Context/TrainingContext';

interface ExerciseDetailModalProps {
  open: boolean;
  onClose: () => void;
  assignmentId?: number;
  exerciseId?: number
}

const styles = {
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 3,
      width: '95vw',
      maxWidth: '100vw',
      maxHeight: '90vh',
      margin: '16px',
      '@media (max-width: 600px)': {
        margin: '8px',
        width: 'calc(100vw - 16px)',
      },
    },
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    },
  },
  dialogTitle: {
    p: 3,
    pb: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '@media (max-width: 768px)': {
      p: 2,
      pb: 1,
    },
    '@media (max-width: 600px)': {
      p: 1.5,
      pb: 0.5,
    },
  },
  closeButton: {
    p: 0.5,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  content: {
    p: 3,
    pt: 1,
    '@media (max-width: 768px)': {
      p: 2,
      pt: 1,
    },
    '@media (max-width: 600px)': {
      p: 1.5,
      pt: 0.5,
    },
  },
  header: {
    mb: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    mb: 1,
    '@media (max-width: 768px)': {
      fontSize: 20,
    },
    '@media (max-width: 600px)': {
      fontSize: 18,
    },
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
    mb: 0.5,
  },
  duration: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Montserrat, sans-serif',
  },
  exercisesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 2,
    mt: 2,
    '@media (max-width: 600px)': {
      gap: 1,
    },
  },
  exerciseCard: {
    flex: '1 1 calc(50% - 16px)',
    minWidth: '400px',
    border: '1px solid #e0e0e0',
    borderRadius: 2,
    padding: 2,
    backgroundColor: '#fff',
    '@media (max-width: 1200px)': {
      flex: '1 1 calc(50% - 8px)',
      minWidth: '350px',
    },
    '@media (max-width: 768px)': {
      flex: '1 1 100%',
      minWidth: '300px',
      padding: 2,
    },
    '@media (max-width: 600px)': {
      flex: '1 1 100%',
      minWidth: 'unset',
      padding: 1.5,
    },
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    mb: 2,
  },
  exerciseInfo: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
    mb: 2,
  },
  tableContainer: {
    borderRadius: 2,
    boxShadow: 'none',
    mb: 3,
    backgroundColor: '#fff',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    borderBottom: '1px solid #e0e0e0',
    py: 1.5,
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    borderBottom: '1px solid #f0f0f0',
    py: 1,
  },
  noteSection: {
    backgroundColor: '#fff',
    borderRadius: 2,
    p: 0,
    mt: 2,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    mb: 1,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
    lineHeight: 1.5,
  },
  divider: {
    my: 3,
    borderColor: '#e0e0e0',
  },
  // Loading and empty state styles
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
  },
  emptyStateContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
  },
  emptyStateText: {
    color: '#999',
    fontStyle: 'italic',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    mb: 1,
    gap: 4,
  },
  emptyStateContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    textAlign: 'center',
    gap: 2,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mb: 2,
  },
  emptyStateIconText: {
    fontSize: 40,
    color: '#bdbdbd',
    fontWeight: 300,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    mb: 1,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
    maxWidth: '500px',
    lineHeight: 1.5,
    mb: 1,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Montserrat, sans-serif',
    fontStyle: 'italic',
  },
  
  // Series and table styles
  seriesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1.5,
    mt: 1,
  },
  seriesBox: {
    flex: '1 1 calc(50% - 12px)',
    minWidth: '180px',
    mb: 1,
    '@media (max-width: 768px)': {
      flex: '1 1 100%',
      minWidth: 'unset',
    },
  },
  seriesTitle: {
    fontSize: 14,
    fontWeight: 600,
    mb: 1,
    color: '#333',
  },
  seriesTableContainer: {
    borderRadius: 2,
    mb: 0,
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  compactTableHeader: {
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
    fontSize: 12,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    borderBottom: '1px solid #e0e0e0',
    py: 1,
  },
  compactTableCell: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    borderBottom: '1px solid #f0f0f0',
    py: 0.5,
  },

  // Inline component styles
  boldSpan: {
    fontWeight: 600,
  },
  loadingBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
  },
  emptyStateTextOnly: {
    color: '#999',
    fontStyle: 'italic',
  },
};

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  open,
  onClose,
  assignmentId,
  exerciseId,
}) => {
  const { t } = useTranslation();
  const { assignmentLogs, loadingAssignmentLogs, fetchAssignmentLogs, fetchExerciseLog } = useTraining();

  // Fetch assignment logs when modal opens
  useEffect(() => {
    if (open) {
      if (exerciseId && assignmentId) {
        fetchExerciseLog(exerciseId, assignmentId);
      } else if (assignmentId) {
        fetchAssignmentLogs(assignmentId);
      }
    }
  }, [open, assignmentId, exerciseId, fetchAssignmentLogs, fetchExerciseLog]);

  // Format date helper function
  const formatDate = (dateString: string) => {
    if(!dateString) return '___';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format date and time helper function
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading state
  if (loadingAssignmentLogs) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        sx={styles.dialog}
      >
        <DialogTitle sx={styles.dialogTitle}>
          <Typography sx={styles.title}>
            {t('exerciseDetailModal.title')}
          </Typography>
          <IconButton onClick={onClose} sx={styles.closeButton}>
            <DialogCloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={styles.content}>
          <Box sx={styles.loadingBox}>
            <CircularProgress size={50} />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  // Show empty state if no data
  if (!assignmentLogs) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        sx={styles.dialog}
      >
        <DialogTitle sx={styles.dialogTitle}>
          <Typography sx={styles.title}>
            {t('exerciseDetailModal.title')}
          </Typography>
          <IconButton onClick={onClose} sx={styles.closeButton}>
            <DialogCloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={styles.content}>
          <Box sx={styles.loadingBox}>
            <Typography sx={styles.emptyStateTextOnly}>
              {t('exerciseDetailModal.emptyState.description')}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  // Show beautiful empty state if no exercises or logs
  if (!assignmentLogs.exercises || assignmentLogs.exercises.length === 0 || assignmentLogs.totalLogs === 0) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        sx={styles.dialog}
      >
        <DialogTitle sx={styles.dialogTitle}>
          <Typography sx={styles.title}>
            {t('exerciseDetailModal.title')}
          </Typography>
          <IconButton onClick={onClose} sx={styles.closeButton}>
            <DialogCloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={styles.content}>
          {/* Header Info - Show even in empty state */}
          <Box sx={styles.header}>
            <Box sx={styles.headerRow}>
              <Typography sx={styles.subtitle}>
                {t('exerciseDetailModal.program')}: <Box component="span" sx={styles.boldSpan}>{assignmentLogs.trainingProgram?.title || '___'}</Box>
              </Typography>
              <Typography sx={styles.subtitle}>
                {t('exerciseDetailModal.client')}: <Box component="span" sx={styles.boldSpan}>{assignmentLogs.assignment?.clientName || '___'}</Box>
              </Typography>
            </Box>
            <Box sx={styles.headerRow}>
              <Typography sx={styles.duration}>
                {t('exerciseDetailModal.type')}: {assignmentLogs.trainingProgram.type}
              </Typography>
              <Typography sx={styles.duration}>
                {t('exerciseDetailModal.createdAt')}: {formatDate(assignmentLogs.assignment?.createdAt)}
              </Typography>
              <Typography sx={styles.duration}>
                {t('exerciseDetailModal.expires')}: {formatDate(assignmentLogs.assignment?.expiresAt)}
              </Typography>
            </Box>
          </Box>

          {/* Empty State */}
          <Box sx={styles.emptyStateContent}>
            <Box sx={styles.emptyStateIcon}>
              <Typography sx={styles.emptyStateIconText}>
                📋
              </Typography>
            </Box>
            <Typography sx={styles.emptyStateTitle}>
              {t('exerciseDetailModal.emptyState.title')}
            </Typography>
            <Typography sx={styles.emptyStateDescription}>
              {t('exerciseDetailModal.emptyState.description')}
            </Typography>
            <Typography sx={styles.emptyStateSubtitle}>
              {t('exerciseDetailModal.emptyState.subtitle')}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={styles.dialog}
    >
      <DialogTitle sx={styles.dialogTitle}>
        <Typography sx={styles.title}>
          {t('exerciseDetailModal.title')}
        </Typography>
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <DialogCloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={styles.content}>
        {/* Header Info */}
        <Box sx={styles.header}>
          <Box sx={styles.headerRow}>
            <Typography sx={styles.subtitle}>
              {t('exerciseDetailModal.program')}: <Box component="span" sx={styles.boldSpan}>{assignmentLogs.trainingProgram.title}</Box>
            </Typography>
            <Typography sx={styles.subtitle}>
              {t('exerciseDetailModal.client')}: <Box component="span" sx={styles.boldSpan}>{assignmentLogs.assignment.clientName}</Box>
            </Typography>
          </Box>
          <Box sx={styles.headerRow}>
            <Typography sx={styles.duration}>
              {t('exerciseDetailModal.type')}: {assignmentLogs.trainingProgram.type}
            </Typography>
            <Typography sx={styles.duration}>
              {t('exerciseDetailModal.createdAt')}: {formatDate(assignmentLogs.assignment.createdAt)}
            </Typography>
            <Typography sx={styles.duration}>
              {t('exerciseDetailModal.expires')}: {formatDate(assignmentLogs.assignment.expiresAt)}
            </Typography>
          </Box>
        </Box>

        {/* Exercise Details */}
        <Box sx={styles.exercisesGrid}>
          {assignmentLogs.exercises.map((exercise, index) => (
            <Box key={index} sx={styles.exerciseCard}>
              <Typography sx={styles.exerciseTitle}>
                {exercise.name}
              </Typography>
              
              <Typography sx={styles.exerciseInfo}>
                {t('exerciseDetailModal.type')}: {exercise.type} | {t('exerciseDetailModal.repetitions')}: {exercise.repetitions}
              </Typography>

              {/* Series Tables */}
              <Box sx={styles.seriesContainer}>
                {exercise.series.map((serie) => (
                  <Box key={serie.serie} sx={styles.seriesBox}>
                    <Typography sx={styles.seriesTitle}>
                      {t('exerciseDetailModal.series')} {serie.serie}
                    </Typography>
                    <TableContainer component={Paper} sx={styles.seriesTableContainer}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={styles.compactTableHeader}>{t('exerciseDetailModal.table.headers.weight')}</TableCell>
                            <TableCell sx={styles.compactTableHeader}>
                              {exercise.type === 'Time' || exercise.type === 'Tempo' 
                                ? t('exerciseDetailModal.time') 
                                : t('exerciseDetailModal.table.headers.repetitions')
                              }
                            </TableCell>
                            <TableCell sx={styles.compactTableHeader}>{t('exerciseDetailModal.completedAt')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {serie.logs.map((log, logIndex) => (
                            <TableRow key={logIndex}>
                              <TableCell sx={styles.compactTableCell}>{log.weight}</TableCell>
                              <TableCell sx={styles.compactTableCell}>{log.reps}</TableCell>
                              <TableCell sx={styles.compactTableCell}>{formatDateTime(log.completedAt)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDetailModal;
