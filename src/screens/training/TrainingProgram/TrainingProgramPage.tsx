import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import EditIcon from '../../../icons/EditIcon';
import DeleteIcon from '../../../icons/DeleteIcon';
import { TrainingProgram, useTraining } from '../../../Context/TrainingContext';
import { useTranslation } from 'react-i18next';
import DeleteDialog from '../DeleteDialog';
import OutlinedTextIconButton from '../../../components/OutlinedTextIconButton';
import PlusIcon from '../../../icons/PlusIcon';
import TrainingProgramDialog from './TrainingProgramDialog';
import { useNavigate } from 'react-router-dom';

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
  actionCell: { border: 0, textAlign: 'center' },
  actionContainer: { whiteSpace: 'nowrap' },
  editIcon: { fontSize: 22, color: '#E6BB4A' },
  deleteIcon: { fontSize: 22, color: '#E57373' },
  emptyCell: { py: 8, background: '#fafafa' },
  emptyBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  emptyTitle: { color: '#bdbdbd', fontSize: 22, fontWeight: 500, fontFamily: 'Montserrat, sans-serif' },
  emptyDesc: { color: '#bdbdbd', fontSize: 16, fontFamily: 'Montserrat, sans-serif' },
};

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

function stripHtml(html: string): string {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  return text.length > 100 ? text.slice(0, 100) + '...' : text;
}

interface TrainingProgramPageProps {
  showHeader?: boolean;
  rowLimit?: number;
}

const TrainingProgramPage: React.FC<TrainingProgramPageProps> = ({ showHeader = true, rowLimit }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { trainingPrograms, fetchTrainingPrograms, addTrainingProgram, updateTrainingProgram, deleteTrainingProgram, isLoading } = useTraining();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<TrainingProgram | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<TrainingProgram | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetchTrainingPrograms(rowLimit ?? undefined);
  }, [fetchTrainingPrograms]);

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
      <Paper elevation={0} sx={styles.paper}>
        <TableContainer sx={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow sx={{ overflow: 'hidden' }}>
                <TableCell sx={styles.tableHeadCellFirst}>{t('training.programName', 'Nome programma')}</TableCell>
                <TableCell sx={styles.tableHeadCell}>{t('training.description')}</TableCell>
                <TableCell sx={{ ...styles.tableHeadCell, textAlign: 'center' }}>{t('training.programType', 'Tipologia di allenamento')}</TableCell>
                <TableCell sx={[styles.tableHeadCell,styles.actionCell, styles.tableHeadCellLast]}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, idx) => (
                  <TableRow key={idx} sx={styles.tableRow}>
                    {[...Array(4)].map((_, cidx) => (
                      <TableCell key={cidx} sx={styles.tableCell}>
                        <Box sx={{ width: '100%', height: 24, background: '#eee', borderRadius: 2, animation: 'pulse 1.2s infinite' }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : trainingPrograms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={styles.emptyCell}>
                    <Box sx={styles.emptyBox}>
                      <Typography sx={styles.emptyTitle}>{t('training.noProgramsTitle', 'Nessun programma ancora')}</Typography>
                      <Typography sx={styles.emptyDesc}>{t('training.noProgramsDesc', 'Inizia aggiungendo il tuo primo programma di allenamento.')}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                (rowLimit ? trainingPrograms.slice(0, rowLimit) : trainingPrograms).map((pr, idx) => (
                  <TableRow
                    key={pr.id || idx}
                    sx={{ ...styles.tableRow, cursor: 'pointer' }}
                    onClick={() => navigate(`/training/training-program/${pr.id}`)}
                  >
                    <TableCell sx={styles.tableCell}>{pr.title}</TableCell>
                    <TableCell sx={styles.tableCell}>{stripHtml(pr?.description || "")}</TableCell>
                    <TableCell sx={styles.tableCell} align="center">{pr.type}</TableCell>
                    <TableCell sx={styles.actionCell}>
                      <Box sx={styles.actionContainer}>
                        <IconButton size="small" sx={{ mr: 1 }} onClick={e => { e.stopPropagation(); handleEdit(pr); }}><EditIcon style={styles.editIcon} /></IconButton>
                        <IconButton size="small" onClick={e => { e.stopPropagation(); handleDelete(pr); }}><DeleteIcon style={styles.deleteIcon} /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
