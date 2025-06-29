import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Typography, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AssegnaButton from '../../../../components/AssegnaButton';
import ConfirmAssignDialog from '../../../../components/ConfirmAssignDialog';
import MagnifierIcon from '../../../../icons/MagnifierIcon';
import { useClientContext } from '../../../../Context/ClientContext';

const styles = {
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 6,
  },
  searchInput: {
    width: 500,
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#fafafa',
      borderRadius: 2,
    },
  },
  searchInputProps: {
    endAdornment: (
      <InputAdornment position="end">
        <MagnifierIcon style={{ color: '#bbb', width: 22, height: 22 }} />
      </InputAdornment>
    ),
  },
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
    maxWidth: 550,
    width: '100%',
  },
  emptyStateIcon: {
    fontSize: 72,
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
    mb: 4,
  },
  createButton: {
    backgroundColor: '#E6BB4A',
    color: 'white',
    px: 4,
    py: 1.5,
    borderRadius: 2,
    textTransform: 'none',
    fontSize: 16,
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#E6BB4A',
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

const ProgrammiAllenamentoTab: React.FC = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [selectedProgramName, setSelectedProgramName] = useState<string>('');
    const { loadingTrainingPrograms, trainingProgramOfUser } = useClientContext();
  
  const navigate = useNavigate();

  const handleAssignClick = (programId: number, programName: string) => {
    setSelectedProgramId(programId);
    setSelectedProgramName(programName);
    setConfirmModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (selectedProgramId) {
      console.log('Assigning program:', selectedProgramId);
      // Add actual assignment logic here
      setConfirmModalOpen(false);
      setSelectedProgramId(null);
      setSelectedProgramName('');
    }
  };

  const handleCloseModal = () => {
    setConfirmModalOpen(false);
    setSelectedProgramId(null);
    setSelectedProgramName('');
  };

  const handleCreateProgram = () => {
    // Navigate to training program creation page using React Router
    navigate('/training/training-program');
  };

  // Mock data for the table - replace with real data later
  // const mockData: { id: number; programma: string; tipo: string; livello: string; tipologia: string; settimane: number; }[] = [
  //   {
  //     id: 1,
  //     programma: 'Nome Programma',
  //     tipo: 'Programma',
  //     livello: 'Intermedio',
  //     tipologia: 'Body Building',
  //     settimane: 1,
  //   },
  //   {
  //     id: 2,
  //     programma: 'Nome Programma',
  //     tipo: 'Programma',
  //     livello: 'Facile',
  //     tipologia: 'Body Building',
  //     settimane: 2,
  //   },
  //   {
  //     id: 3,
  //     programma: 'Nome Programma',
  //     tipo: 'Programma',
  //     livello: 'Difficile',
  //     tipologia: 'Body Building',
  //     settimane: 3,
  //   },
  // ];

  // Filter training programs based on search
  const filteredPrograms = trainingProgramOfUser.filter(program =>
    program.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    program.type.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Check if there are no training programs at all (show empty state with create button)
  const hasNoDataAtAll = !loadingTrainingPrograms && trainingProgramOfUser.length === 0;
  
  // Check if there are programs but search returns no results (show table with no search results message)
  const hasNoSearchResults = !loadingTrainingPrograms && trainingProgramOfUser.length > 0 && filteredPrograms.length === 0;

  // Empty state component
  const EmptyState = () => (
    <Box sx={styles.emptyState}>
      <Paper sx={styles.emptyStateCard} elevation={0}>
        <Box sx={styles.emptyStateIcon}>
          💪
        </Box>
        <Typography sx={styles.emptyStateTitle}>
          {t('client.allenamenti.programmiAllenamento.emptyState.title')}
        </Typography>
        <Typography sx={styles.emptyStateDescription}>
          {t('client.allenamenti.programmiAllenamento.emptyState.description')}
        </Typography>
        <Button 
          sx={styles.createButton}
          onClick={handleCreateProgram}
        >
          {t('client.allenamenti.programmiAllenamento.emptyState.createButton')}
        </Button>
      </Paper>
    </Box>
  );

  // Loading component
  const LoadingState = () => (
    <Box sx={styles.loadingContainer}>
      <CircularProgress size={40} sx={{ color: '#E6BB4A' }} />
      <Typography sx={styles.loadingText}>
        {t('client.allenamenti.programmiAllenamento.loading')}
      </Typography>
    </Box>
  );

  // No search results component (shows in table body when search returns no results)
  const NoSearchResults = () => (
    <TableRow>
      <TableCell colSpan={5} sx={{ ...styles.tableCell, textAlign: 'center', py: 4 }}>
        <Typography sx={{ color: '#757575', fontSize: 16 }}>
          {t('client.allenamenti.programmiAllenamento.noSearchResults')}
        </Typography>
      </TableCell>
    </TableRow>
  );

  // Check loading state first
  if (loadingTrainingPrograms) {
    return (
      <>
        <Box sx={styles.searchContainer}>
          <TextField
            size="small"
            placeholder={t('client.allenamenti.programmiAllenamento.searchPlaceholder')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={styles.searchInputProps}
            sx={styles.searchInput}
            disabled
          />
        </Box>
        <LoadingState />
      </>
    );
  }

  // Check if we should show empty state
  if (hasNoDataAtAll) {
    return (
      <>
        <Box sx={styles.searchContainer}>
          <TextField
            size="small"
            placeholder={t('client.allenamenti.programmiAllenamento.searchPlaceholder')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={styles.searchInputProps}
            sx={styles.searchInput}
          />
        </Box>
        <EmptyState />
      </>
    );
  }

  return (
    <>
      <Box sx={styles.searchContainer}>
        <TextField
          size="small"
          placeholder={t('client.allenamenti.programmiAllenamento.searchPlaceholder')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={styles.searchInputProps}
          sx={styles.searchInput}
        />
      </Box>

      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.programmiAllenamento.tableHeaders.program')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.programmiAllenamento.tableHeaders.type')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.programmiAllenamento.tableHeaders.category')}</TableCell>
              <TableCell sx={styles.tableCellHeader}>{t('client.allenamenti.programmiAllenamento.tableHeaders.weeks')}</TableCell>
              <TableCell sx={styles.tableCellHeader}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hasNoSearchResults ? (
              <NoSearchResults />
            ) : (
              filteredPrograms.map((program) => (
                <TableRow key={program.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell sx={styles.tableCell}>{program.title}</TableCell>
                  <TableCell sx={styles.tableCell}>Programma</TableCell>
                  <TableCell sx={styles.tableCell}>{program.type}</TableCell>
                  <TableCell sx={styles.tableCell}>
                    {program?.weeks?.length}
                  </TableCell>
                  <TableCell sx={styles.tableCell} align="center">
                    {program.assignments.length === 0 && (
                      <AssegnaButton 
                        size="small"
                        onClick={() => handleAssignClick(program.id, program.title)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Modal */}
      <ConfirmAssignDialog
        open={confirmModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAssign}
        programName={selectedProgramName}
      />
    </>
  );
};

export default ProgrammiAllenamentoTab;
