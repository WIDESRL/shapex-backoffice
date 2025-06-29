import React, { useState } from 'react';
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
import FilterIcon from '../../icons/FilterIcon';
import InfoIcon from '../../icons/InfoIcon';
import DateRangePicker from '../../components/DateRangePicker';
import ExerciseDetailModal from './ExerciseDetailModal';
import WarningDummyDataBanner from '../../components/WarningDummyDataBanner';

interface ExerciseSet {
  serie: number;
  peso: number;
  ripetizioni: number;
}

interface Exercise {
  id: number;
  name: string;
  series: number;
  repetitions: number;
  sets: ExerciseSet[];
  note: string;
}

interface ExerciseDetailData {
  programma: string;
  data: string;
  durataAllenamento: string;
  exercises: Exercise[];
}

interface CompletedTraining {
  id: number;
  data: string;
  cliente: string;
  pianoAllenamento: string;
  giornoSettimana: string;
  exerciseDetails: ExerciseDetailData;
}

interface FilterState {
  status: string;
  client: string;
  workout: string;
  dateFrom: string;
  dateTo: string;
}

interface AppliedFilterState {
  status: string;
  client: string;
  workout: string;
  dateFrom: string;
  dateTo: string;
}

const styles = {
  container: {
    p: 3,
    height: '95vh',
    display: 'flex',
    flexDirection: 'column',
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
    flex: 1,
    borderRadius: 3,
    boxShadow: 'none',
    background: '#fff',
    overflow: 'auto',
    maxHeight: 'calc(100vh - 300px)',
  },
  tableHeader: {
    backgroundColor: '#F6F6F6',
    fontWeight: 600,
    fontSize: 14,
    color: '#616160',
    fontFamily: 'Montserrat, sans-serif',
    borderBottom: '1px solid #e0e0e0',
    py: 2,
  },
  tableRow: {
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    borderBottom: '1px solid #f0f0f0',
    py: 1.5,
    backgroundColor: '#fff',
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
};

// ===============================
// MOCK DATA AND OPTIONS
// ===============================
const generateCompletedTrainings = (): CompletedTraining[] => {
  const clients = ['Sara Rossi', 'Mario Bianchi', 'Francesca Verdi', 'Luca Gialli', 'Anna Neri'];
  const programs = ['Lorem ipsum dolor', 'Strength Training', 'Cardio Blast', 'Full Body', 'Upper Body'];
  
  return Array.from({ length: 50 }, (_, index) => {
    // Generate random date in the last 90 days
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const formattedDate = date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const weekDays = ['XX gg. / XX set.', '1 gg. / 1 set.', '2 gg. / 1 set.', '3 gg. / 1 set.', '1 gg. / 2 set.'];
    
    return {
      id: index + 1,
      data: formattedDate,
      cliente: clients[Math.floor(Math.random() * clients.length)],
      pianoAllenamento: programs[Math.floor(Math.random() * programs.length)],
      giornoSettimana: weekDays[Math.floor(Math.random() * weekDays.length)],
      // Mock exercise details for the modal
      exerciseDetails: {
        programma: `Programma ${index + 1} - Workout ${index + 2}`,
        data: `${date.getDate()} Giugno 2025`,
        durataAllenamento: `00:0${Math.floor(Math.random() * 6) + 2}`,
        exercises: Array.from({ length: 3 }, (_, i) => ({
          id: i + 1,
          name: `Nome Esercizio ${String.fromCharCode(65 + i)}`,
          series: 4,
          repetitions: 2,
          sets: Array.from({ length: 3 }, (_, setIndex) => ({
            serie: setIndex + 1,
            peso: 10,
            ripetizioni: 2
          })),
          note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }))
      }
    };
  }).sort((a, b) => {
    // Sort by date (most recent first)
    const dateA = new Date(a.data.split('/').reverse().join('-'));
    const dateB = new Date(b.data.split('/').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  });
};

// Client options for the searchable dropdown
const clientOptions = [
  'Sara Rossi',
  'Mario Bianchi', 
  'Francesca Verdi',
  'Luca Gialli',
  'Anna Neri',
  'Giuseppe Romano',
  'Maria Esposito',
  'Antonio Ferrari',
  'Giulia Russo',
  'Marco Conti',
  'Elena Marino',
  'Roberto De Luca',
  'Chiara Fontana',
  'Andrea Ricci',
  'Valentina Greco'
];

const CompletedTrainingPage: React.FC = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDetailData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ 
    startDate: null, 
    endDate: null 
  });
  
  // Filter state (what user is currently selecting)
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    client: '',
    workout: '',
    dateFrom: '',
    dateTo: ''
  });

  // Applied filters state (what is actually being used to filter the table)
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilterState>({
    status: '',
    client: '',
    workout: '',
    dateFrom: '',
    dateTo: ''
  });

  const completedTrainings = generateCompletedTrainings();

  // Filter the trainings based on applied filters
  const filteredTrainings = completedTrainings.filter(training => {
    // Status filter
    if (appliedFilters.status && appliedFilters.status !== '') {
      // Since we only have "Terminato" status in our mock data, we can add this logic when needed
    }

    // Client filter
    if (appliedFilters.client && appliedFilters.client !== '') {
      if (!training.cliente.toLowerCase().includes(appliedFilters.client.toLowerCase())) {
        return false;
      }
    }

    // Workout filter
    if (appliedFilters.workout && appliedFilters.workout !== '') {
      if (!training.giornoSettimana.includes(appliedFilters.workout)) {
        return false;
      }
    }

    // Date range filter
    if (appliedFilters.dateFrom || appliedFilters.dateTo) {
      const trainingDate = new Date(training.data.split('/').reverse().join('-'));
      
      if (appliedFilters.dateFrom) {
        const fromDate = new Date(appliedFilters.dateFrom);
        if (trainingDate < fromDate) return false;
      }
      
      if (appliedFilters.dateTo) {
        const toDate = new Date(appliedFilters.dateTo);
        if (trainingDate > toDate) return false;
      }
    }

    return true;
  });

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

  const handleClientChange = (value: string | null) => {
    setFilters(prev => ({
      ...prev,
      client: value || ''
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      status: filters.status,
      client: filters.client,
      workout: filters.workout,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo
    });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      client: '',
      workout: '',
      dateFrom: '',
      dateTo: ''
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    setDateRange({ startDate: null, endDate: null });
  };

  const handleShowDetail = (training: CompletedTraining) => {
    setSelectedExercise(training.exerciseDetails);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedExercise(null);
  };

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>
        Allenamenti completati
      </Typography>
      <WarningDummyDataBanner />

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
                <MenuItem value="">
                  <Chip 
                    label={t('completedTraining.status.completed')}
                    size="small" 
                    sx={{ ...styles.statusChip, ...styles.statusCompleted }}
                  />
                </MenuItem>
                <MenuItem value="in-corso">
                  <Chip 
                    label={t('completedTraining.status.expiring')}
                    size="small" 
                    sx={{ ...styles.statusChip, ...styles.statusExpiring }}
                  />
                </MenuItem>
                <MenuItem value="in-corso">
                  <Chip 
                    label={t('completedTraining.status.inProgress')}
                    size="small" 
                    sx={{ ...styles.statusChip, ...styles.statusInProgress }}
                  />
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={styles.filterControl} size="small">
              <InputLabel>{t('completedTraining.filters.workoutDay')}</InputLabel>
              <Select
                value={filters.workout}
                onChange={handleSelectChange('workout')}
                label={t('completedTraining.filters.workoutDay')}
              >
                <MenuItem value="">{t('completedTraining.filters.selectInterval')}</MenuItem>
                <MenuItem value="1">{t('completedTraining.workoutOptions.option1')}</MenuItem>
                <MenuItem value="2">{t('completedTraining.workoutOptions.option2')}</MenuItem>
                <MenuItem value="3">{t('completedTraining.workoutOptions.option3')}</MenuItem>
              </Select>
            </FormControl>

            <Autocomplete
              size="small"
              sx={styles.filterControl}
              options={clientOptions}
              value={filters.client || null}
              onChange={(_, newValue) => handleClientChange(newValue)}
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

      {/* Table */}
      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableHeader}>{t('completedTraining.table.headers.date')}</TableCell>
              <TableCell sx={styles.tableHeader}>{t('completedTraining.table.headers.client')}</TableCell>
              <TableCell sx={styles.tableHeader}>{t('completedTraining.table.headers.trainingPlan')}</TableCell>
              <TableCell sx={styles.tableHeader}>{t('completedTraining.table.headers.dayWeek')}</TableCell>
              <TableCell sx={styles.tableHeader} align="center">{t('completedTraining.table.headers.exerciseDetail')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrainings.length > 0 ? (
              filteredTrainings.map((training) => (
                <TableRow key={training.id} hover sx={styles.tableRow}>
                  <TableCell sx={styles.tableCell}>{training.data}</TableCell>
                  <TableCell sx={styles.tableCell}>{training.cliente}</TableCell>
                  <TableCell sx={styles.tableCell}>{training.pianoAllenamento}</TableCell>
                  <TableCell sx={styles.tableCell}>{training.giornoSettimana}</TableCell>
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
                <TableCell colSpan={5} sx={{ ...styles.tableCell, textAlign: 'center', py: 4 }}>
                  <Typography sx={{ color: '#999', fontStyle: 'italic' }}>
                    {t('completedTraining.emptyState')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Exercise Detail Modal */}
      {modalOpen && selectedExercise && (
        <ExerciseDetailModal
          open={modalOpen}
          onClose={handleCloseModal}
          exerciseData={selectedExercise}
        />
      )}
    </Box>
  );
};

export default CompletedTrainingPage;
