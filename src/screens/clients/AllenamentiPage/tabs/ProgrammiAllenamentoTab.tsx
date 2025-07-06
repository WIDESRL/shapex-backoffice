import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Typography, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import AssegnaButton from '../../../../components/AssegnaButton';
import ConfirmAssignDialog from '../../../../components/ConfirmAssignDialog';
import MagnifierIcon from '../../../../icons/MagnifierIcon';
import { useClientContext } from '../../../../Context/ClientContext';
import { useTraining } from '../../../../Context/TrainingContext';
import { useSnackbar } from '../../../../Context/SnackbarContext';
import { getServerErrorMessage } from '../../../../utils/errorUtils';

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

// Component to handle assignment/removal button logic
interface AssignmentActionButtonProps {
  programId: number;
  programTitle: string;
  assignments: Array<{ id: number; userId: number; completed: boolean; completedAt: string | null }>;
  clientId: string;
  userHasIncompleteProgram: boolean;
  onAssignClick: (programId: number, programName: string) => void;
  onRemoveClick: (programId: number, programName: string) => void;
}

const AssignmentActionButton: React.FC<AssignmentActionButtonProps> = ({
  programId,
  programTitle,
  assignments,
  clientId,
  userHasIncompleteProgram,
  onAssignClick,
  onRemoveClick,
}) => {
  const { t } = useTranslation();
  
  const userAssignments = assignments.filter(a => a.userId === parseInt(clientId));
  
  if (userAssignments.length === 0) {
    // No assignment for current user - can assign if no incomplete programs
    return !userHasIncompleteProgram ? (
      <AssegnaButton 
        size="small"
        onClick={() => onAssignClick(programId, programTitle)}
      />
    ) : null;
  }
  
  // Check if user has any incomplete assignment for this program
  const hasIncompleteAssignment = userAssignments.some(a => !a.completed);
  
  if (hasIncompleteAssignment) {
    // User has an incomplete assignment - show remove button
    return (
      <Button
        size="small"
        sx={{
          background: '#616160',
          color: '#fff',
          borderRadius: 2,
          fontWeight: 500,
          fontSize: 14,
          px: 3,
          py: 0.5,
          minWidth: 90,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            background: '#444',
          },
        }}
        onClick={() => onRemoveClick(programId, programTitle)}
      >
        {t('assignUsersModal.remove')}
      </Button>
    );
  } else {
    // All user's assignments are completed - can reassign if no incomplete programs
    return !userHasIncompleteProgram ? (
      <AssegnaButton 
        size="small"
        onClick={() => onAssignClick(programId, programTitle)}
      />
    ) : null;
  }
};

const ProgrammiAllenamentoTab: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const [searchValue, setSearchValue] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmRemoveModalOpen, setConfirmRemoveModalOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [selectedProgramName, setSelectedProgramName] = useState<string>('');
  const [selectedRemoveProgramId, setSelectedRemoveProgramId] = useState<number | null>(null);
  const [selectedRemoveProgramName, setSelectedRemoveProgramName] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const { loadingTrainingPrograms, trainingProgramOfUser, fetchTrainingProgramOfUser } = useClientContext();
  const { removeUserAssignment, assignUserToProgram } = useTraining();
  const { showSnackbar } = useSnackbar();

  const handleAssignClick = (programId: number, programName: string) => {
    setSelectedProgramId(programId);
    setSelectedProgramName(programName);
    setConfirmModalOpen(true);
  };

  const handleRemoveClick = (programId: number, programName: string) => {
    setSelectedRemoveProgramId(programId);
    setSelectedRemoveProgramName(programName);
    setConfirmRemoveModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (selectedRemoveProgramId && clientId && !saving) {
      setSaving(true);
      try {
        const program = trainingProgramOfUser.find(p => p.id === selectedRemoveProgramId);
        // Find the incomplete assignment for the current user (the one we want to remove)
        const incompleteAssignment = program?.assignments.find(a => 
          a.userId === parseInt(clientId) && !a.completed
        );
        
        if (incompleteAssignment) {
          await removeUserAssignment(incompleteAssignment.id);
          await fetchTrainingProgramOfUser(clientId);
          showSnackbar(t('assignUsersModal.saveSuccess'), 'success');
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ errorCode?: string }>;
        const errorCode = axiosError?.response?.data?.errorCode;
        const errorMessage = getServerErrorMessage(errorCode, t, t("assignUsersModal.saveError"));
        showSnackbar(errorMessage, 'error');
      } finally {
        setSaving(false);
        setConfirmRemoveModalOpen(false);
        setSelectedRemoveProgramId(null);
        setSelectedRemoveProgramName('');
      }
    }
  };

  const handleCloseRemoveModal = () => {
    setConfirmRemoveModalOpen(false);
    setSelectedRemoveProgramId(null);
    setSelectedRemoveProgramName('');
  };

  const handleConfirmAssign = async () => {
    if (selectedProgramId && clientId && !saving) {
      setSaving(true);
      try {
        await assignUserToProgram(parseInt(clientId), selectedProgramId);
        await fetchTrainingProgramOfUser(clientId);
        showSnackbar(t('assignUsersModal.saveSuccess'), 'success');
      } catch (error) {
        const axiosError = error as AxiosError<{ errorCode?: string }>;
        const errorCode = axiosError?.response?.data?.errorCode;
        
        // Show translated error message
        const errorMessage = getServerErrorMessage(errorCode, t);
        showSnackbar(errorMessage, 'error');
      } finally {
        setSaving(false);
        setConfirmModalOpen(false);
        setSelectedProgramId(null);
        setSelectedProgramName('');
      }
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

  // Filter training programs based on search with useMemo for performance optimization
  const filteredPrograms = useMemo(() => {
    return trainingProgramOfUser.filter(program => {
      // Apply search filter only
      return (
        program.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        program.type.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
  }, [trainingProgramOfUser, searchValue]);

  // Check if user has any incomplete program assigned (user can only have one incomplete program at a time)
  const userHasIncompleteProgram = useMemo(() => {
    if (!clientId) return false;
    return trainingProgramOfUser.some(program => {
      const userAssignments = program.assignments.filter(a => a.userId === parseInt(clientId));
      return userAssignments.some(assignment => !assignment.completed);
    });
  }, [trainingProgramOfUser, clientId]);

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
                    <AssignmentActionButton
                      programId={program.id}
                      programTitle={program.title}
                      assignments={program.assignments}
                      clientId={clientId || '0'}
                      userHasIncompleteProgram={userHasIncompleteProgram}
                      onAssignClick={handleAssignClick}
                      onRemoveClick={handleRemoveClick}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Assign Confirmation Modal */}
      <ConfirmAssignDialog
        open={confirmModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAssign}
        programName={selectedProgramName}
      />

      {/* Remove Confirmation Modal */}
      <ConfirmAssignDialog
        open={confirmRemoveModalOpen}
        onClose={handleCloseRemoveModal}
        onConfirm={handleConfirmRemove}
        programName={selectedRemoveProgramName}
        title={t('client.allenamenti.confirmRemoveDialog.title')}
        message={t('client.allenamenti.confirmRemoveDialog.message', { programName: selectedRemoveProgramName })}
        confirmText={t('client.allenamenti.confirmRemoveDialog.confirm')}
        cancelText={t('client.allenamenti.confirmRemoveDialog.cancel')}
      />
    </>
  );
};

export default ProgrammiAllenamentoTab;
