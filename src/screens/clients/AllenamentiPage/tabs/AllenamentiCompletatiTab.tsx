import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../../../Context/ClientContext';

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
  const { loadingTrainingPrograms, trainingProgramOfUser } = useClientContext();

  // Filter training programs to show only completed ones
  const completedPrograms = useMemo(() => {
    return trainingProgramOfUser.filter(program => 
    program.assignments.some(assignment => assignment.completed)
  )
  }, [trainingProgramOfUser]);

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

  if (completedPrograms.length === 0) {
    return <EmptyState />;
  }

  return (
    <TableContainer component={Paper} sx={styles.tableContainer}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.allenamentiCompletati.tableHeaders.workout')}</TableCell>
            <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.allenamentiCompletati.tableHeaders.date')}</TableCell>
            <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.allenamentiCompletati.tableHeaders.type')}</TableCell>
            <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.allenamentiCompletati.tableHeaders.category')}</TableCell>
            <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.allenamentiCompletati.tableHeaders.weeks')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {completedPrograms.map((program) => {
            // Get the first completed assignment to show the completion date
            const completedAssignment = program.assignments.find(assignment => assignment.completed);
            return (
              <TableRow key={program.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={styles.tableCell}>{program.title}</TableCell>
                <TableCell sx={styles.tableCell}>{formatDate(completedAssignment?.completedAt || null)}</TableCell>
                <TableCell sx={styles.tableCell}>Programma</TableCell>
                <TableCell sx={styles.tableCell}>{program.type}</TableCell>
                <TableCell sx={styles.tableCell}>{program.weeks.length}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AllenamentiCompletatiTab;
