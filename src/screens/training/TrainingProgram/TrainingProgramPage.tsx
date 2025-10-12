import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  TextField, 
  Button,
  Autocomplete
} from '@mui/material';
import EditIcon from '../../../icons/EditIcon';
import DeleteIcon from '../../../icons/DeleteIcon';
import PlusIcon from '../../../icons/PlusIcon';
import { TrainingProgram } from '../../../types/trainingProgram.types';
import { useTraining } from '../../../Context/TrainingContext';
import { useTranslation } from 'react-i18next';
import DeleteDialog from '../DeleteDialog';
import OutlinedTextIconButton from '../../../components/OutlinedTextIconButton';
import TrainingProgramDialog from './TrainingProgramDialog';
import { useNavigate } from 'react-router-dom';

// Constants
export const programTypes = [
  'Altro',
  'BodyBuilding',
  'Crossfit',
  'FunctionalTraining',
  'HIIT',
  'HomeWorkout',
  'Pilates',
  'Powerlifting',
  'Streetlifting',
  'Tabata',
  'Weightlifting',
  'Yoga',
];

// Utility Functions
function stripHtml(html: string): string {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  return text.length > 100 ? text.slice(0, 100) + '...' : text;
}

// Styles Section
const styles = {
  root: { p: 4, background: '#fff' },
  title: { fontSize: 38, fontWeight: 400, color: '#616160', fontFamily: 'Montserrat, sans-serif', mb: 3 },
  sectionHeader: { fontSize: 28, fontWeight: 400, color: '#616160', fontFamily: 'Montserrat, sans-serif' },
  paper: { background: '#F6F6F6', borderRadius: 3, boxShadow: 'none' },
  tableContainer: { background: 'transparent', boxShadow: 'none' },
  tableHeadCell: { fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0 },
  tableHeadCellFirst: { fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0, borderTopLeftRadius: 12 },
  tableHeadCellLast: { fontWeight: 500, fontSize: 18, color: '#888', fontFamily: 'Montserrat, sans-serif', background: '#EDEDED', border: 0, borderTopRightRadius: 12 },
  tableRow: { background: '#fff', borderBottom: '1px solid #ededed' },
  tableCell: { fontSize: 18, color: '#616160', fontFamily: 'Montserrat, sans-serif', border: 0 },
  actionCell: { border: 0, textAlign: 'center', whiteSpace: 'nowrap' },
  editIcon: { fontSize: 22, color: '#E6BB4A' },
  deleteIcon: { fontSize: 22, color: '#E57373' },
  emptyCell: { py: 8, background: '#fafafa' },
  emptyBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  emptyIconBox: { border: '2px solid #E6BB4A', borderRadius: 1, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 },
  emptyTitle: { color: '#bdbdbd', fontSize: 22, fontWeight: 500, fontFamily: 'Montserrat, sans-serif' },
  emptyDesc: { color: '#bdbdbd', fontSize: 16, fontFamily: 'Montserrat, sans-serif' },
  searchContainer: { mb: 3 },
  searchBox: { display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' },
  searchField: { flex: '1 1 300px', minWidth: '200px' },
  filterField: { flex: '1 1 250px', minWidth: '200px' },
  inputStyle: { 
    '& .MuiOutlinedInput-root': { 
      borderRadius: 2,
      fontFamily: 'Montserrat, sans-serif'
    }
  },
  loadMoreContainer: { display: 'flex', justifyContent: 'center', p: 2 },
  loadMoreButton: {
    borderColor: '#E6BB4A',
    color: '#E6BB4A',
    fontFamily: 'Montserrat, sans-serif',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
      borderColor: '#d4a843',
      backgroundColor: 'rgba(230, 187, 74, 0.04)'
    }
  }
};

interface TrainingProgramPageProps {
  showHeader?: boolean;
  rowLimit?: number;
}

const TrainingProgramPage: React.FC<TrainingProgramPageProps> = ({ showHeader = true, rowLimit }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    trainingPrograms, 
    trainingProgramsResponse,
    fetchTrainingPrograms, 
    loadMoreTrainingPrograms,
    addTrainingProgram, 
    updateTrainingProgram, 
    deleteTrainingProgram, 
    isLoading,
    itemsPerPage
  } = useTraining();
  
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<TrainingProgram | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<TrainingProgram | null>(null);
  const [saving, setSaving] = React.useState(false);
  
  // Search and filter states
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const debouncedSearch = React.useCallback(() => {
    setCurrentPage(1);
    fetchTrainingPrograms({
      search: searchValue || undefined,
      type: selectedType || undefined,
      page: 1,
      limit: itemsPerPage,
      resetPagination: true
    });
  }, [searchValue, selectedType, fetchTrainingPrograms, itemsPerPage]);

  // Debounced search effect
  React.useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(debouncedSearch, 500);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [debouncedSearch]);

  // Initial fetch
  React.useEffect(() => {
    fetchTrainingPrograms({
      limit: itemsPerPage,
      page: 1,
      resetPagination: true
    });
  }, [fetchTrainingPrograms, itemsPerPage]);

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (row: TrainingProgram) => {
    setEditData(row);
    setModalOpen(true);
  };

  const handleDelete = (row: TrainingProgram) => {
    console.log('Deleting program:', row);
    setDeleteTarget(row);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteTrainingProgram(deleteTarget.id);
      } catch (err) {
        console.error(err);
      }
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleSave = async (data: { title: string; description: string; type: string }) => {
    setSaving(true);
    try {
      if (editData) {
        await updateTrainingProgram(editData.id, data);
      } else {
        await addTrainingProgram(data);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadMore = async () => {
    if (trainingProgramsResponse && currentPage < trainingProgramsResponse.totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await loadMoreTrainingPrograms({
        search: searchValue || undefined,
        type: selectedType || undefined,
        page: nextPage,
        limit: itemsPerPage
      });
    }
  };

  const canLoadMore = React.useMemo(() => 
    trainingProgramsResponse && currentPage < trainingProgramsResponse.totalPages, 
    [trainingProgramsResponse, currentPage]
  );
  
  const displayedPrograms = React.useMemo(() => 
    rowLimit ? trainingPrograms.slice(0, rowLimit) : trainingPrograms,
    [trainingPrograms, rowLimit]
  );

  return (
    <Box sx={styles.root}>
      {showHeader && (
        <>
          <Typography sx={styles.title}>{t('training.trainingProgramsTitle', 'Programmi di allenamento')}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={styles.sectionHeader}>{t('training.trainingPrograms', 'Programmi di allenamento')}</Typography>
             <OutlinedTextIconButton
              text={t('training.addTrainingProgram', 'Aggiungi Programma')}
              icon={<PlusIcon style={{ fontSize: 28, marginLeft: 8 }} />}
              onClick={handleAdd}
            />
          </Box>
        </>
      )}
      
      {/* Search and Filter Section - Only show when showHeader is true */}
      {showHeader && (
        <Box sx={styles.searchContainer}>
          <Box sx={styles.searchBox}>
            <Box sx={styles.searchField}>
              <TextField
                fullWidth
                placeholder={t('training.searchPrograms', 'Cerca programmi...')}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                size="small"
                sx={styles.inputStyle}
              />
            </Box>
            <Box sx={styles.filterField}>
              <Autocomplete
                fullWidth
                size="small"
                options={programTypes}
                value={selectedType}
                onChange={(_, newValue) => setSelectedType(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('training.filterByType', 'Filtra per tipologia')}
                    sx={styles.inputStyle}
                  />
                )}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              {trainingProgramsResponse && (
                <Typography sx={{ color: '#888', fontSize: 14, fontFamily: 'Montserrat, sans-serif' }}>
                  {t('training.showingResults', 'Mostrando {{count}} di {{total}} risultati', {
                    count: trainingPrograms.length,
                    total: trainingProgramsResponse.totalCount
                  })}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}

      <Paper elevation={0} sx={styles.paper}>
        <TableContainer sx={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow sx={{ overflow: 'hidden' }}>
                <TableCell sx={styles.tableHeadCellFirst}>{t('training.programName', 'Nome programma')}</TableCell>
                <TableCell sx={styles.tableHeadCell}>{t('training.description')}</TableCell>
                <TableCell sx={styles.tableHeadCell}>{t('training.programType', 'Tipologia di allenamento')}</TableCell>
                <TableCell sx={{ ...styles.tableHeadCellLast, textAlign: 'center' }}>{t('training.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && trainingPrograms.length === 0 ? (
                [...Array(rowLimit || 3)].map((_, idx) => (
                  <TableRow key={idx} sx={styles.tableRow}>
                    {[...Array(4)].map((_, cidx) => (
                      <TableCell key={cidx} sx={styles.tableCell}>
                        <Box sx={{ width: '100%', height: 24, background: '#eee', borderRadius: 2, animation: 'pulse 1.2s infinite' }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : displayedPrograms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={styles.emptyCell}>
                    <Box sx={styles.emptyBox}>
                      <Box sx={styles.emptyIconBox}>
                        <PlusIcon style={{ fontSize: 22, color: '#E6BB4A' }} />
                      </Box>
                      <Typography sx={styles.emptyTitle}>{t('training.noProgramsTitle', 'Nessun programma ancora')}</Typography>
                      <Typography sx={styles.emptyDesc}>{t('training.noProgramsDesc', 'Inizia aggiungendo il tuo primo programma di allenamento.')}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                displayedPrograms.map((pr, idx) => (
                  <TableRow
                    key={pr.id || idx}
                    sx={{ ...styles.tableRow, cursor: 'pointer' }}
                    onClick={() => navigate(`/training/training-program/${pr.id}`)}
                  >
                    <TableCell sx={styles.tableCell}>{pr.title}</TableCell>
                    <TableCell sx={styles.tableCell}>{stripHtml(pr?.description || "")}</TableCell>
                    <TableCell sx={styles.tableCell} align="center">{pr.type}</TableCell>
                    <TableCell sx={styles.actionCell}>
                      <IconButton size="small" sx={{ mr: 1 }} onClick={e => { e.stopPropagation(); handleEdit(pr); }}><EditIcon style={styles.editIcon} /></IconButton>
                      <IconButton size="small" onClick={e => { e.stopPropagation(); handleDelete(pr); }}><DeleteIcon style={styles.deleteIcon} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {!rowLimit && showHeader && trainingProgramsResponse && (
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            mt={2}
            px={2}
            py={1}
            sx={{
              flexShrink: 0,
              borderTop: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('training.showingResults', 'Mostrando {{count}} di {{total}} risultati', {
                count: trainingPrograms.length,
                total: trainingProgramsResponse.totalCount
              })}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleLoadMore}
              disabled={!canLoadMore}
              sx={{
                ...styles.loadMoreButton,
                opacity: canLoadMore ? 1 : 0.5,
                cursor: canLoadMore ? 'pointer' : 'not-allowed'
              }}
            >
              {t('training.loadMore', 'Carica altri')}
            </Button>
          </Box>
        )}
      </Paper>
      {/* Modal for add/edit */}
      <TrainingProgramDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        loading={saving}
        editData={editData }
        programTypes={programTypes}
        t={(key, defaultText) => t(key, defaultText || '')}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        title={t('training.deleteTrainingProgramTitle')}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default TrainingProgramPage;
