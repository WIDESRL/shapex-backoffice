import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext, TrainingProgramOfUser, TrainingProgramAssignment } from '../../../../Context/ClientContext';
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

const AllenamentiCompletatiTab: React.FC = () => {
  const { t } = useTranslation();
  const { clientId } = useParams<{ clientId: string }>();
  const { loadingTrainingPrograms, trainingProgramOfUser } = useClientContext();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get all completed assignments for the current user with their program data
  const completedAssignments = useMemo(() => {
    if (!clientId) return [];
    
    const assignments: Array<{
      program: TrainingProgramOfUser;
      assignment: TrainingProgramAssignment;
    }> = [];
    
    trainingProgramOfUser.forEach(program => {
      program.assignments
        .filter(assignment => assignment.completed && assignment.userId === parseInt(clientId))
        .forEach(assignment => {
          assignments.push({ program, assignment });
        });
    });
    
    // Sort by completion date (most recent first)
    return assignments.sort((a, b) => {
      const dateA = new Date(a.assignment.completedAt || 0);
      const dateB = new Date(b.assignment.completedAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [trainingProgramOfUser, clientId]);

  // Format date helper function
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Modal handlers
  const handleShowDetail = (assignment: TrainingProgramAssignment) => {
    setSelectedAssignmentId(assignment.id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAssignmentId(null);
  };

  // Empty state component
  const EmptyState = () => (
    <Box sx={styles.emptyState}>
      <Paper sx={styles.emptyStateCard} elevation={0}>
        <Box sx={styles.emptyStateIcon}>
          🏆
        </Box>
        <Typography sx={styles.emptyStateTitle}>
          {t('client.allenamenti.allenamentiCompletati.emptyState.title')}
        </Typography>
        <Typography sx={styles.emptyStateDescription}>
          {t('client.allenamenti.allenamentiCompletati.emptyState.description')}
        </Typography>
        <Typography sx={styles.emptyStateSubtext}>
          {t('client.allenamenti.allenamentiCompletati.emptyState.subtitle')}
        </Typography>
      </Paper>
    </Box>
  );

  // Loading component
  const LoadingState = () => (
    <Box sx={styles.loadingContainer}>
      <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
      <Typography sx={styles.loadingText}>
        {t('client.allenamenti.allenamentiCompletati.loading')}
      </Typography>
    </Box>
  );

  // Check if we should show empty state
  if (loadingTrainingPrograms) {
    return <LoadingState />;
  }

  if (completedAssignments.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.allenamentiCompletati.tableHeaders.workout')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.allenamentiCompletati.tableHeaders.date')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.allenamentiCompletati.tableHeaders.type')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.allenamentiCompletati.tableHeaders.category')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.allenamentiCompletati.tableHeaders.weeks')}</TableCell>
              <TableCell sx={{ ...styles.tableCellHeader, textAlign: 'center' }}>{t('client.allenamenti.allenamentiCompletati.tableHeaders.exerciseDetail')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {completedAssignments.map((item, index) => {
              const { program, assignment } = item;
              return (
                <TableRow key={`${program.id}-${assignment.id}-${index}`} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell sx={styles.tableCell}>{program.title}</TableCell>
                  <TableCell sx={styles.tableCell}>{formatDate(assignment.completedAt || null)}</TableCell>
                  <TableCell sx={styles.tableCell}>Programma</TableCell>
                  <TableCell sx={styles.tableCell}>{program.type}</TableCell>
                  <TableCell sx={styles.tableCell}>{program.weeks.length}</TableCell>
                  <TableCell sx={styles.tableCell} align="center">
                    <IconButton 
                      sx={styles.detailButton}
                      onClick={() => handleShowDetail(assignment)}
                    >
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Exercise Detail Modal */}
      {modalOpen && selectedAssignmentId && (
        <ExerciseDetailModal
          open={modalOpen}
          onClose={handleCloseModal}
          assignmentId={selectedAssignmentId}
        />
      )}
    </>
  );
};

export default AllenamentiCompletatiTab;
