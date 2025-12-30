import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Chip,
  SelectChangeEvent,
  Autocomplete,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTraining } from '../../Context/TrainingContext';
import { CompletedTraining } from '../../types/trainingProgram.types';
import FilterIcon from '../../icons/FilterIcon';
import InfoIcon from '../../icons/InfoIcon';
import DateRangePicker from '../../components/DateRangePicker';
import ExerciseDetailModal from './ExerciseDetailModal';
import ClientSectionsModal from '../../components/ClientSectionsModal';
import { Client } from '../../Context/ClientContext';

interface FilterState {
  status: string;
  clientId: number | null;
  dateFrom: string;
  dateTo: string;
}

const styles = {
  container: {
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '60vh',
    maxHeight: '90vh',
  },
  title: {
    fontSize: 32,
    fontWeight: 300,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    mb: 3,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 400,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    mb: 3,
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 3,
  },
  filterButton: {
    background: '#F6F6F6',
    borderRadius: 2,
    width: 44,
    height: 44,
    border: 'none',
    '&:hover': { background: '#e0e0e0' },
  },
  filterSection: {
    background: '#f8f8f8',
    borderRadius: 2,
    p: 3,
    mb: 3,
    border: '1px solid #e0e0e0',
  },
  filterRow: {
    display: 'flex',
    gap: 3,
    mb: 3,
    alignItems: 'center',
  },
  filterControl: {
    minWidth: 200,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      background: '#fff',
    },
    '& .MuiAutocomplete-root .MuiOutlinedInput-root': {
      borderRadius: 2,
      background: '#fff',
    },
  },
  dateRangeContainer: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
  },
  filterActions: {
    display: 'flex',
    gap: 2,
    justifyContent: 'flex-end',
    mt: 2,
  },
  clearButton: {
    borderRadius: 2,
    fontWeight: 500,
    color: '#616160',
    borderColor: '#e0e0e0',
    textTransform: 'none',
  },
  applyButton: {
    borderRadius: 2,
    fontWeight: 500,
    backgroundColor: '#E6BB4A',
    color: '#fff',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#d4a84a',
    },
  },
  tableContainer: {
    background: '#F6F6F6',
    borderRadius: 3,
    boxShadow: 'none',
    overflow: 'auto',
    minHeight: '300px',
    maxHeight: 'calc(90vh - 200px)',
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    background: 'transparent',
    borderRadius: 3,
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
  },
  tableHeader: {
    fontWeight: 500,
    fontSize: 18,
    color: '#888',
    fontFamily: 'Montserrat, sans-serif',
    background: '#EDEDED',
    border: 0,
    py: 2,
  },
  tableHeaderFirst: {
    fontWeight: 500,
    fontSize: 18,
    color: '#888',
    fontFamily: 'Montserrat, sans-serif',
    background: '#EDEDED',
    border: 0,
    borderTopLeftRadius: 12,
    py: 2,
  },
  tableHeaderLast: {
    fontWeight: 500,
    fontSize: 18,
    color: '#888',
    fontFamily: 'Montserrat, sans-serif',
    background: '#EDEDED',
    border: 0,
    borderTopRightRadius: 12,
    py: 2,
  },
  tableRow: {
    background: '#fff',
    borderBottom: '1px solid #ededed',
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  tableCell: {
    fontSize: 18,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    border: 0,
    backgroundColor: '#fff',
  },
  clientNameCell: {
    fontSize: 18,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    border: 0,
    backgroundColor: '#fff',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
      color: '#E6BB4A',
    },
  },
  trainingProgramNameCell: {
    fontSize: 18,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    border: 0,
    backgroundColor: '#fff',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
      color: '#E6BB4A',
    },
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
  statusChip: {
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 2,
    height: 24,
  },
  statusCompleted: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
  },
  statusExpiring: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusInProgress: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusExpired: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  emptyCell: {
    py: 8,
    background: '#fafafa',
  },
  emptyBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  emptyIconBox: {
    border: '2px solid #E6BB4A',
    borderRadius: 1,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mb: 1,
  },
  emptyTitle: {
    color: '#bdbdbd',
    fontSize: 22,
    fontWeight: 500,
    fontFamily: 'Montserrat, sans-serif',
  },
  emptyDesc: {
    color: '#bdbdbd',
    fontSize: 16,
    fontFamily: 'Montserrat, sans-serif',
  },
};

// ===============================
// COMPONENT
// ===============================

interface CompletedTrainingPageProps {
  showHeader?: boolean;
  rowLimit?: number;
  compact?: boolean;
}

const CompletedTrainingPage: React.FC<CompletedTrainingPageProps> = ({ showHeader = true, rowLimit, compact = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    availableUsers, 
    loadingAvailableUsers, 
    fetchAllUsers,
    completedTrainings,
    loadingCompletedTrainings,
    fetchCompletedTrainings,
    loadMoreCompletedTrainings
  } = useTraining();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ 
    startDate: null, 
    endDate: null 
  });
  
  // Filter state (what user is currently selecting)
  const [filters, setFilters] = useState<FilterState>({
    status: 'completed',
    clientId: null,
    dateFrom: '',
    dateTo: ''
  });

  // Store current filters for load more functionality
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    status: 'completed',
    clientId: null,
    dateFrom: '',
    dateTo: ''
  });

  // Fetch data when component mounts
  useEffect(() => {
    fetchAllUsers();
    fetchCompletedTrainings({ status: 'completed', ...(rowLimit ? { itemsPerPage: rowLimit } : {}) });
  }, [fetchAllUsers, fetchCompletedTrainings, rowLimit]);

  // Get users formatted for autocomplete
  const clientOptions = availableUsers.map(user => ({
    id: user.id,
    name: user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.username
  }));

  // Get trainings data with memoization
  const trainingsData = useMemo(() => {
    return completedTrainings?.assignments || [];
  }, [completedTrainings]);
  
  // Memoize displayed trainings based on rowLimit
  const displayedTrainings = useMemo(() => {
    return rowLimit ? trainingsData.slice(0, rowLimit) : trainingsData;
  }, [trainingsData, rowLimit]);

  // Helper function to get the appropriate date value based on status
  const getDateValue = (training: CompletedTraining) => {
    let dateValue = '';
    let dateLabel = '';
    
    switch (training.status) {
      case 'completed':
        dateValue = training.completedAt;
        dateLabel = t('completedTraining.dateLabels.completed');
        break;
      case 'expiringSoon':
        dateValue = training.expiresAt;
        dateLabel = t('completedTraining.dateLabels.expired');
        break;
      case 'expired':
        dateValue = training.expiresAt;
        dateLabel = t('completedTraining.dateLabels.expired');
        break;
      case 'inProgress':
        dateValue = training.createdAt;
        dateLabel = t('completedTraining.dateLabels.created');
        break;
      default:
        dateValue = training.completedAt || training.createdAt;
        dateLabel = training.completedAt ? t('completedTraining.dateLabels.completed') : t('completedTraining.dateLabels.created');
    }
    
    if (!dateValue) return '--';
    
    const date = new Date(dateValue);
    const year = date.getFullYear();
    
    // Check for invalid dates or dates from 1970
    if (isNaN(date.getTime()) || year <= 1970) {
      return '--';
    }
    
    return `${formatDate(dateValue)} (${dateLabel})`;
  };

  // Debug logging
  console.log('CompletedTrainingPage Debug:', {
    completedTrainings,
    trainingsData,
    trainingsDataLength: trainingsData.length,
    loadingCompletedTrainings
  });

  // Format date helper function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format training type helper function
  const formatTrainingType = (type: string) => {
    switch (type) {
      case 'FunctionalTraining':
        return 'Functional Training';
      case 'BodyBuilding':
        return 'Body Building';
      case 'HomeWorkout':
        return 'Home Workout';
      case 'Crossfit':
        return 'Crossfit';
      default:
        return type;
    }
  };

  // Handler for date range changes (only updates local state, not applied filters)
  const handleDateRangeChange = (newDateRange: { startDate: Date | null; endDate: Date | null }) => {
    setDateRange(newDateRange);
    // Update local filters state but don't apply immediately
    setFilters(prev => ({
      ...prev,
      dateFrom: newDateRange.startDate ? newDateRange.startDate.toISOString().split('T')[0] : '',
      dateTo: newDateRange.endDate ? newDateRange.endDate.toISOString().split('T')[0] : ''
    }));
  };

  const handleSelectChange = (field: keyof FilterState) => (event: SelectChangeEvent<string>) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleClientChange = (_: React.SyntheticEvent, newValue: { id: number; name: string } | null) => {
    setFilters(prev => ({
      ...prev,
      clientId: newValue ? newValue.id : null
    }));
  };

  const handleApplyFilters = () => {
    const params = {
      page: 1, // Reset to first page when applying filters
      clientId: filters.clientId || undefined,
      status: filters.status ? filters.status as 'completed' | 'expiringSoon' | 'inProgress' | 'expired' : undefined,
      startDate: filters.dateFrom || undefined,
      endDate: filters.dateTo || undefined,
    };
    
    // Store current filters for load more functionality
    setCurrentFilters(filters);
    
    // Fetch with new filters (this will reset to page 1)
    fetchCompletedTrainings(params);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      clientId: null,
      dateFrom: '',
      dateTo: ''
    };
    setFilters(clearedFilters);
    setCurrentFilters(clearedFilters);
    setDateRange({ startDate: null, endDate: null });
    
    // Fetch without filters (this will reset to page 1)
    fetchCompletedTrainings({ page: 1 });
  };

  const handleLoadMore = () => {
    const params = {
      clientId: currentFilters.clientId || undefined,
      status: currentFilters.status ? currentFilters.status as 'completed' | 'expiringSoon' | 'inProgress' | 'expired' : undefined,
      startDate: currentFilters.dateFrom || undefined,
      endDate: currentFilters.dateTo || undefined,
    };
    
    // loadMoreCompletedTrainings will automatically use the next page from context
    loadMoreCompletedTrainings(params);
  };

  // Check if there are more pages to load using context data
  const hasMorePages = completedTrainings ? completedTrainings.page < completedTrainings.totalPages : false;

  const handleShowDetail = (training: CompletedTraining) => {
    setSelectedAssignmentId(training.id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAssignmentId(null);
  };

  const handleClientClick = (training: CompletedTraining) => {
    // Create a Client object from the training data
    const client: Client = {
      id: training.clientId,
      email: '',
      username: training.clientName,
      firstName: training.clientName.split(' ')[0] || null,
      lastName: training.clientName.split(' ').slice(1).join(' ') || null,
      phoneNumber: null,
      dateOfBirth: null,
      placeOfBirth: null,
      fiscalCode: null,
      activeSubscription: null,
      assignedProgram: null,
      totalMessages: 0,
    };
    setSelectedClient(client);
    setClientModalOpen(true);
  };

  const handleCloseClientModal = () => {
    setClientModalOpen(false);
    setSelectedClient(null);
  };

  const handleTrainingProgramClick = (training: CompletedTraining) => {
    navigate(`/training/training-program/${training.trainingProgramId}`);
  };

  // Get dynamic styles based on compact mode
  const containerStyles = compact ? {
    p: 3,
    display: 'flex',
    flexDirection: 'column',
  } : styles.container;

  const tableContainerStyles = compact ? {
    background: '#F6F6F6',
    borderRadius: 3,
    boxShadow: 'none',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  } : styles.tableContainer;

  return (
    <Box sx={containerStyles}>
      {showHeader && (
        <Box sx={{ flexShrink: 0 }}>
          <Typography sx={styles.title}>
            {t('completedTraining.pageTitle')}
          </Typography>

          <Box sx={styles.headerContainer}>
            <Typography sx={styles.subtitle}>
              {t('completedTraining.subtitle')}
            </Typography>
            <IconButton 
              sx={styles.filterButton}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon style={{ color: '#bdbdbd', fontSize: 28 }} />
            </IconButton>
          </Box>

          {/* Collapsible Filter Section */}
          <Collapse in={showFilters}>
            <Paper sx={styles.filterSection} elevation={0}>
              <Box sx={styles.filterRow}>
                <FormControl sx={styles.filterControl} size="small">
                  <InputLabel>{t('completedTraining.filters.status')}</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={handleSelectChange('status')}
                    label={t('completedTraining.filters.status')}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="completed">
                      <Chip 
                        label={t('completedTraining.status.completed')}
                        size="small" 
                        sx={{ ...styles.statusChip, ...styles.statusCompleted }}
                      />
                    </MenuItem>
                    <MenuItem value="expiringSoon">
                      <Chip 
                        label={t('completedTraining.status.expiring')}
                        size="small" 
                        sx={{ ...styles.statusChip, ...styles.statusExpiring }}
                      />
                    </MenuItem>
                    <MenuItem value="inProgress">
                      <Chip 
                        label={t('completedTraining.status.inProgress')}
                        size="small" 
                        sx={{ ...styles.statusChip, ...styles.statusInProgress }}
                      />
                    </MenuItem>
                    <MenuItem value="expired">
                      <Chip 
                        label={t('completedTraining.status.expired')}
                        size="small" 
                        sx={{ ...styles.statusChip, ...styles.statusExpired }}
                      />
                    </MenuItem>
                  </Select>
                </FormControl>

                <Autocomplete
                  size="small"
                  sx={styles.filterControl}
                  options={clientOptions}
                  getOptionLabel={(option) => option.name}
                  value={clientOptions.find(client => client.id === filters.clientId) || null}
                  onChange={(event, newValue) => handleClientChange(event, newValue)}
                  loading={loadingAvailableUsers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('completedTraining.filters.completedBy')}
                      placeholder={t('completedTraining.filters.searchClients')}
                    />
                  )}
                  noOptionsText={t('completedTraining.autocomplete.noClientsFound')}
                  clearText={t('completedTraining.autocomplete.clear')}
                  openText={t('completedTraining.autocomplete.open')}
                  closeText={t('completedTraining.autocomplete.close')}
                />
              </Box>

              {/* Date Range Row */}
              <Box sx={styles.filterRow}>
                <Typography sx={{ minWidth: 120, color: '#616160', fontWeight: 500 }}>
                  {t('completedTraining.filters.dateRange')}
                </Typography>
                <Box sx={styles.dateRangeContainer}>
                  <DateRangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    placeholder={t('completedTraining.filters.selectInterval')}
                    size="small"
                  />
                </Box>
              </Box>

              <Box sx={styles.filterActions}>
                <Button 
                  variant="outlined" 
                  sx={styles.clearButton}
                  onClick={handleClearFilters}
                >
                  {t('completedTraining.filters.clearAll')}
                </Button>
                <Button 
                  variant="contained" 
                  sx={styles.applyButton}
                  onClick={handleApplyFilters}
                >
                  {t('completedTraining.filters.showResults')}
                </Button>
              </Box>
            </Paper>
          </Collapse>
        </Box>
      )}

      {/* Table */}
      <Paper elevation={0} sx={styles.paper}>
        <TableContainer sx={tableContainerStyles}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ overflow: 'hidden' }}>
                <TableCell sx={styles.tableHeaderFirst}>{t('completedTraining.table.headers.date')}</TableCell>
                <TableCell sx={styles.tableHeader}>{t('completedTraining.table.headers.client')}</TableCell>
                <TableCell sx={styles.tableHeader}>{t('completedTraining.table.headers.trainingPlan')}</TableCell>
                <TableCell sx={styles.tableHeader}>Training Type</TableCell>
                <TableCell sx={{ ...styles.tableHeaderLast, textAlign: 'center' }}>{t('completedTraining.table.headers.exerciseDetail')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingCompletedTrainings && trainingsData.length === 0 ? (
                [...Array(rowLimit || 3)].map((_, idx) => (
                  <TableRow key={idx} sx={styles.tableRow}>
                    {[...Array(5)].map((_, cidx) => (
                      <TableCell key={cidx} sx={styles.tableCell}>
                        <Box sx={{ width: '100%', height: 24, background: '#eee', borderRadius: 2, animation: 'pulse 1.2s infinite' }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : displayedTrainings.length > 0 ? (
                displayedTrainings.map((training) => (
                  <TableRow key={training.id} hover sx={styles.tableRow}>
                    <TableCell sx={styles.tableCell}>{getDateValue(training)}</TableCell>
                    <TableCell 
                      sx={styles.clientNameCell}
                      onClick={() => handleClientClick(training)}
                    >
                      {training.clientName}
                    </TableCell>
                    <TableCell 
                      sx={styles.trainingProgramNameCell}
                      onClick={() => handleTrainingProgramClick(training)}
                    >
                      {training.trainingProgramName}
                    </TableCell>
                    <TableCell sx={styles.tableCell}>{formatTrainingType(training.trainingProgramType)}</TableCell>
                    <TableCell sx={styles.tableCell} align="center">
                      <IconButton 
                        sx={styles.detailButton}
                        onClick={() => handleShowDetail(training)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={styles.emptyCell}>
                    <Box sx={styles.emptyBox}>
                      <Box sx={styles.emptyIconBox}>
                        <InfoIcon style={{ fontSize: 22, color: '#E6BB4A' }} />
                      </Box>
                      <Typography sx={styles.emptyTitle}>
                        {t('completedTraining.emptyState')}
                      </Typography>
                      <Typography sx={styles.emptyDesc}>
                        {t('completedTraining.emptyStateDesc', 'No completed trainings found. Check your filters or try a different date range.')}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Load More Button - Inside TableContainer */}
        {!rowLimit && hasMorePages && !loadingCompletedTrainings && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            p: 2,
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#fff',
            flexShrink: 0,
          }}>
            <Button 
              variant="outlined" 
              onClick={handleLoadMore}
              sx={{
                borderRadius: 2,
                fontWeight: 500,
                color: '#616160',
                borderColor: '#e0e0e0',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#E6BB4A',
                  color: '#E6BB4A',
                }
              }}
            >
              Load More
            </Button>
          </Box>
        )}

        {/* Loading indicator for Load More - Inside TableContainer */}
        {!rowLimit && loadingCompletedTrainings && trainingsData.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            p: 2,
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#fff',
            flexShrink: 0,
          }}>
            <Typography sx={{ color: '#999', fontStyle: 'italic' }}>
              Loading more...
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Exercise Detail Modal */}
      {modalOpen && selectedAssignmentId && (
        <ExerciseDetailModal
          open={modalOpen}
          onClose={handleCloseModal}
          assignmentId={selectedAssignmentId}
        />
      )}

      {/* Client Sections Modal */}
      <ClientSectionsModal
        open={clientModalOpen}
        client={selectedClient}
        onClose={handleCloseClientModal}
      />
    </Box>
  );
};

export default CompletedTrainingPage;
