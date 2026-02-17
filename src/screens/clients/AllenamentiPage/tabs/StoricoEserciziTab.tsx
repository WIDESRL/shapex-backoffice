import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress, IconButton, Tooltip, Tabs, Tab, Collapse } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useClientContext, HistoricalExercise } from '../../../../Context/ClientContext';
import InfoIcon from '../../../../icons/InfoIcon';
import ExerciseDetailModal from '../../../training/ExerciseDetailModal';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`exercise-tabpanel-${index}`}
      aria-labelledby={`exercise-tab-${index}`}
      {...other}
      style={{ height: '100%', display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
    >
      {value === index && children}
    </div>
  );
}

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
  detailButtonDisabled: {
    background: 'transparent',
    border: 'none',
    p: 0.5,
    borderRadius: 1,
    cursor: 'default',
    color: '#d32f2f',
    '&:hover': {
      background: 'transparent',
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
  const navigate = useNavigate();
  const { 
    loadingHistoricalExercises, 
    historicalExercises, 
    loadingInProgressExercises, 
    inProgressExercises 
  } = useClientContext();
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [selectedWorkoutExerciseCompletionId, setSelectedWorkoutExerciseCompletionId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleRow = (index: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Format date helper function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Format date and time helper function
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Modal handlers
  const handleShowDetail = (exercise: HistoricalExercise) => {
    setSelectedExerciseId(exercise.workoutExerciseId);
    setSelectedAssignmentId(exercise.assignmentId);
    setSelectedWorkoutExerciseCompletionId(exercise.workoutExerciseCompletionId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedExerciseId(null);
    setSelectedAssignmentId(null);
    setSelectedWorkoutExerciseCompletionId(null);
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

  // Check if we should show empty state (only for completed exercises tab)
  const showEmptyState = historicalExercises.length === 0 && tabValue === 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="exercise history tabs"
        >
          <Tab 
            label={t('client.allenamenti.storicoEsercizi.tabs.completed', 'Completed Exercises')}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
          <Tab 
            label={t('client.allenamenti.storicoEsercizi.tabs.inProgress', 'Exercises in progress...')}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {showEmptyState ? (
          <EmptyState />
        ) : (
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
                        {exercise.workoutExerciseId ? (
                          exercise.assignmentId ? (
                            <IconButton 
                              sx={styles.detailButton}
                              onClick={() => handleShowDetail(exercise)}
                            >
                              <InfoIcon />
                            </IconButton>
                          ) : (
                            <Tooltip title={t('client.allenamenti.storicoEsercizi.deletedAssignment')} arrow>
                              <IconButton 
                                sx={styles.detailButton}
                                onClick={() => handleShowDetail(exercise)}
                              >
                                <InfoIcon fill='#E9D502' />
                              </IconButton>
                            </Tooltip>
                          )
                        ) : (
                          <span style={{ color: '#bdbdbd', fontSize: '12px' }}>-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {loadingInProgressExercises ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
            <Typography sx={styles.loadingText}>
              {t('client.allenamenti.storicoEsercizi.loadingInProgress', 'Loading exercises in progress...')}
            </Typography>
          </Box>
        ) : inProgressExercises.length === 0 ? (
          <Box sx={styles.emptyState}>
            <Paper sx={styles.emptyStateCard} elevation={0}>
              <Box sx={styles.emptyStateIcon}>
                🏋️
              </Box>
              <Typography sx={styles.emptyStateTitle}>
                {t('client.allenamenti.storicoEsercizi.inProgressEmpty.title', 'No exercises in progress')}
              </Typography>
              <Typography sx={styles.emptyStateDescription}>
                {t('client.allenamenti.storicoEsercizi.inProgressEmpty.description', 'The client has no exercises currently in progress.')}
              </Typography>
              <Typography sx={styles.emptyStateSubtext}>
                {t('client.allenamenti.storicoEsercizi.inProgressEmpty.subtitle', 'Exercises will appear here when started')}
              </Typography>
            </Paper>
          </Box>
        ) : (
          <>
            <Box sx={{ 
              p: 2, 
              mb: 2, 
              backgroundColor: '#f5f5f5', 
              borderRadius: 2, 
              borderLeft: '4px solid #E6BB4A' 
            }}>
              <Typography sx={{ 
                fontSize: 14, 
                color: '#666', 
                lineHeight: 1.6,
                fontFamily: 'Montserrat, sans-serif'
              }}>
                {t('client.allenamenti.storicoEsercizi.inProgressInfo', 'These are exercises that the user still has in progress or forgot to complete (to press complete exercise in the app).')}
              </Typography>
            </Box>
            <TableContainer component={Paper} sx={styles.tableContainer}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={styles.tableCellHeader} style={{ width: 50 }} />
                    <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.storicoEsercizi.tableHeaders.exercise')}</TableCell>
                    <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.storicoEsercizi.tableHeaders.trainingProgram', 'Training Program')}</TableCell>
                    <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.storicoEsercizi.tableHeaders.programType', 'Program Type')}</TableCell>
                    <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.storicoEsercizi.tableHeaders.exerciseType', 'Exercise Type')}</TableCell>
                    <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.storicoEsercizi.tableHeaders.lastCompleted', 'Last Completed')}</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                {inProgressExercises.map((exercise, index) => {
                  // Get the latest completedAt from all series
                  const latestCompletedAt = exercise.series
                    .flatMap(serie => serie.logs)
                    .map(log => log.completedAt)
                    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
                  
                  return (
                  <React.Fragment key={index}>
                    {/* Main Exercise Row */}
                    <TableRow sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                      <TableCell sx={styles.tableCell}>
                        <IconButton
                          size="small"
                          onClick={() => toggleRow(index)}
                        >
                          {expandedRows.has(index) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell sx={styles.tableCell}>{exercise.name}</TableCell>
                      <TableCell sx={styles.tableCell}>
                        <Box
                          component="span"
                          onClick={() => navigate(`/training/training-program/${exercise.trainingProgram.id}`)}
                          sx={{
                            color: '#1976d2',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                              color: '#1565c0',
                            },
                          }}
                        >
                          {exercise.trainingProgram.title}
                        </Box>
                      </TableCell>
                      <TableCell sx={styles.tableCell}>{exercise.trainingProgram.type}</TableCell>
                      <TableCell sx={styles.tableCell}>{exercise.type}</TableCell>
                      <TableCell sx={styles.tableCell}>
                        {latestCompletedAt ? formatDateTime(latestCompletedAt) : '-'}
                      </TableCell>
                    </TableRow>

                    {/* Expanded Series Details */}
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={expandedRows.has(index)} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 600, fontSize: 16, mb: 2 }}>
                              {t('client.allenamenti.storicoEsercizi.seriesDetails', 'Series Details')} - {t('exerciseDetailModal.repetitions', 'Repetitions')}: {exercise?.repetitions || '__'}
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>{t('client.allenamenti.storicoEsercizi.seriesHeaders.seriesNumber', 'Series #')}</TableCell>
                                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>{t('client.allenamenti.storicoEsercizi.seriesHeaders.weight', 'Weight (kg)')}</TableCell>
                                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>{t('client.allenamenti.storicoEsercizi.seriesHeaders.reps', 'Reps')}</TableCell>
                                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>{t('client.allenamenti.storicoEsercizi.seriesHeaders.completedAt', 'Completed At')}</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {exercise.series.map((serie, serieIndex) => {
                                  const log = serie.logs[0]; // Get the first (and typically only) log
                                  return (
                                    <TableRow key={serieIndex}>
                                      <TableCell sx={{ fontSize: 12 }}>{serie.serie}</TableCell>
                                      <TableCell sx={{ fontSize: 12 }}>{log?.weight || '-'}</TableCell>
                                      <TableCell sx={{ fontSize: 12 }}>{log?.reps || '-'}</TableCell>
                                      <TableCell sx={{ fontSize: 12 }}>{log?.completedAt ? formatDateTime(log.completedAt) : '-'}</TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          </>
        )}
      </TabPanel>

      {/* Exercise Detail Modal - Shared between both tabs */}
      {modalOpen && ((selectedExerciseId && selectedAssignmentId) || selectedWorkoutExerciseCompletionId) && (
        <ExerciseDetailModal
          open={modalOpen}
          onClose={handleCloseModal}
          exerciseId={selectedExerciseId || undefined}
          assignmentId={selectedAssignmentId || undefined}
          workoutExerciseCompletionId={selectedWorkoutExerciseCompletionId || undefined}
        />
      )}
    </Box>
  );
};

export default StoricoEserciziTab;
