import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext, HistoricalExercise } from '../../../../Context/ClientContext';
import InfoIcon from '../../../../icons/InfoIcon';
import ExerciseDetailModal from '../../../training/ExerciseDetailModal';

const styles = {
  tableContainer: {
    borderRadius: 2,
    boxShadow: 'none',
    flex: 1,
    overflow: 'auto',
  },
  tableCellHeader: {
    background: '#EDEDED',
    fontWeight: 500,
    fontSize: 14,
    color: '#616160',
  },
  tableCell: {
    py: 1,
    fontSize: 14,
    color: '#333',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    px: 4,
    py: 6,
  },
  emptyStateCard: {
    p: 6,
    borderRadius: 3,
    border: '2px dashed #e0e0e0',
    backgroundColor: '#fafafa',
    maxWidth: 500,
    width: '100%',
  },
  emptyStateIcon: {
    fontSize: 68,
    color: '#bdbdbd',
    mb: 3,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#424242',
    mb: 2,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#757575',
    lineHeight: 1.6,
    mb: 3,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9e9e9e',
    fontStyle: 'italic',
  },
  detailButton: {
    background: 'transparent',
    border: 'none',
    p: 0.5,
    borderRadius: 1,
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(0,0,0,0.04)',
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    flexDirection: 'column',
    gap: 2,
  },
  loadingText: {
    color: '#757575',
    fontSize: 16,
  },
};

const StoricoEserciziTab: React.FC = () => {
  const { t } = useTranslation();
  const { loadingHistoricalExercises, historicalExercises } = useClientContext();
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Format date helper function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Modal handlers
  const handleShowDetail = (exercise: HistoricalExercise) => {
    setSelectedExerciseId(exercise.workoutExerciseId);
    setSelectedAssignmentId(exercise.assignmentId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedExerciseId(null);
    setSelectedAssignmentId(null);
  };

  // Empty state component
  const EmptyState = () => (
    <Box sx={styles.emptyState}>
      <Paper sx={styles.emptyStateCard} elevation={0}>
        <Box sx={styles.emptyStateIcon}>
          📊
        </Box>
        <Typography sx={styles.emptyStateTitle}>
          {t('client.allenamenti.storicoEsercizi.emptyState.title')}
        </Typography>
        <Typography sx={styles.emptyStateDescription}>
          {t('client.allenamenti.storicoEsercizi.emptyState.description')}
        </Typography>
        <Typography sx={styles.emptyStateSubtext}>
          {t('client.allenamenti.storicoEsercizi.emptyState.subtitle')}
        </Typography>
      </Paper>
    </Box>
  );

  // Loading component
  const LoadingState = () => (
    <Box sx={styles.loadingContainer}>
      <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
      <Typography sx={styles.loadingText}>
        {t('client.allenamenti.storicoEsercizi.loading')}
      </Typography>
    </Box>
  );

  // Check loading state first
  if (loadingHistoricalExercises) {
    return <LoadingState />;
  }

  // Check if we should show empty state
  if (historicalExercises.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.storicoEsercizi.tableHeaders.exercise')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.storicoEsercizi.tableHeaders.date')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.storicoEsercizi.tableHeaders.category')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.storicoEsercizi.tableHeaders.weeks')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.storicoEsercizi.tableHeaders.type')}</TableCell>
              <TableCell sx={{ ...styles.tableCellHeader, textAlign: 'center' }}>{t('client.allenamenti.storicoEsercizi.tableHeaders.exerciseDetail')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historicalExercises.map((exercise, index) => (
              <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={styles.tableCell}>{exercise.exerciseName}</TableCell>
                <TableCell sx={styles.tableCell}>{formatDate(exercise.data)}</TableCell>
                <TableCell sx={styles.tableCell}>{exercise.type}</TableCell>
                <TableCell sx={styles.tableCell}>{exercise.week}</TableCell>
                <TableCell sx={styles.tableCell}>Esercizio</TableCell>
                <TableCell sx={styles.tableCell} align="center">
                  {exercise.workoutExerciseId && exercise.assignmentId ? (
                    <IconButton 
                      sx={styles.detailButton}
                      onClick={() => handleShowDetail(exercise)}
                    >
                      <InfoIcon />
                    </IconButton>
                  ) : (
                    <span style={{ color: '#bdbdbd', fontSize: '12px' }}>-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Exercise Detail Modal */}
      {modalOpen && selectedExerciseId && selectedAssignmentId && (
        <ExerciseDetailModal
          open={modalOpen}
          onClose={handleCloseModal}
          exerciseId={selectedExerciseId}
          assignmentId={selectedAssignmentId}
        />
      )}
    </>
  );
};

export default StoricoEserciziTab;
