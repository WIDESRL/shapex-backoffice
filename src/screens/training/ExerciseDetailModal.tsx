import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DialogCloseIcon from '../../icons/DialogCloseIcon2';
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

interface ExerciseDetailModalProps {
  open: boolean;
  onClose: () => void;
  exerciseData: ExerciseDetailData;
}

const styles = {
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 3,
      width: '95vw',
      maxWidth: '100vw',
      maxHeight: '90vh',
      margin: '16px',
      '@media (max-width: 600px)': {
        margin: '8px',
        width: 'calc(100vw - 16px)',
      },
    },
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    },
  },
  dialogTitle: {
    p: 3,
    pb: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '@media (max-width: 768px)': {
      p: 2,
      pb: 1,
    },
    '@media (max-width: 600px)': {
      p: 1.5,
      pb: 0.5,
    },
  },
  closeButton: {
    p: 0.5,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  content: {
    p: 3,
    pt: 1,
    '@media (max-width: 768px)': {
      p: 2,
      pt: 1,
    },
    '@media (max-width: 600px)': {
      p: 1.5,
      pt: 0.5,
    },
  },
  header: {
    mb: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    mb: 1,
    '@media (max-width: 768px)': {
      fontSize: 20,
    },
    '@media (max-width: 600px)': {
      fontSize: 18,
    },
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
    mb: 0.5,
  },
  duration: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Montserrat, sans-serif',
  },
  exercisesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 2,
    mt: 2,
    '@media (max-width: 600px)': {
      gap: 1,
    },
  },
  exerciseCard: {
    flex: '1 1 calc(33.333% - 16px)',
    minWidth: '280px',
    border: '1px solid #e0e0e0',
    borderRadius: 2,
    padding: 3,
    backgroundColor: '#fff',
    '@media (max-width: 1024px)': {
      flex: '1 1 calc(50% - 8px)',
      minWidth: '250px',
    },
    '@media (max-width: 768px)': {
      flex: '1 1 calc(50% - 8px)',
      minWidth: '200px',
      padding: 2,
    },
    '@media (max-width: 600px)': {
      flex: '1 1 100%',
      minWidth: 'unset',
      padding: 2,
    },
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    mb: 2,
  },
  exerciseInfo: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
    mb: 2,
  },
  tableContainer: {
    borderRadius: 2,
    boxShadow: 'none',
    mb: 3,
    backgroundColor: '#fff',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    borderBottom: '1px solid #e0e0e0',
    py: 1.5,
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    borderBottom: '1px solid #f0f0f0',
    py: 1,
  },
  noteSection: {
    backgroundColor: '#fff',
    borderRadius: 2,
    p: 0,
    mt: 2,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
    fontFamily: 'Montserrat, sans-serif',
    mb: 1,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat, sans-serif',
    lineHeight: 1.5,
  },
  divider: {
    my: 3,
    borderColor: '#e0e0e0',
  },
};

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  open,
  onClose,
  exerciseData,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={styles.dialog}
    >
      <DialogTitle sx={styles.dialogTitle}>
        <Typography sx={styles.title}>
          {t('exerciseDetailModal.title')}
        </Typography>
        <IconButton onClick={onClose} sx={styles.closeButton}>
          <DialogCloseIcon />
        </IconButton>
      </DialogTitle>
      <WarningDummyDataBanner />

      <DialogContent sx={styles.content}>
        {/* Header Info */}
        <Box sx={styles.header}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, gap: 4 }}>
            <Typography sx={styles.subtitle}>
              {t('exerciseDetailModal.program')}: <Box component="span" sx={{ fontWeight: 600 }}>{exerciseData.programma}</Box>
            </Typography>
            <Typography sx={styles.subtitle}>
              {t('exerciseDetailModal.date')}: <Box component="span" sx={{ fontWeight: 600 }}>{exerciseData.data}</Box>
            </Typography>
          </Box>
          <Typography sx={styles.duration}>
            {t('exerciseDetailModal.duration')}: {exerciseData.durataAllenamento}
          </Typography>
        </Box>

        {/* Exercise Details */}
        <Box sx={styles.exercisesGrid}>
          {exerciseData.exercises.map((exercise) => (
            <Box key={exercise.id} sx={styles.exerciseCard}>
              <Typography sx={styles.exerciseTitle}>
                {exercise.name}
              </Typography>
              
              <Typography sx={styles.exerciseInfo}>
                {t('exerciseDetailModal.series')}: {exercise.series} {t('exerciseDetailModal.repetitions')}: {exercise.repetitions}
              </Typography>

              {/* Sets Table */}
              <TableContainer component={Paper} sx={styles.tableContainer}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={styles.tableHeader}>{t('exerciseDetailModal.table.headers.series')}</TableCell>
                      <TableCell sx={styles.tableHeader}>{t('exerciseDetailModal.table.headers.weight')}</TableCell>
                      <TableCell sx={styles.tableHeader}>{t('exerciseDetailModal.table.headers.repetitions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exercise.sets.map((set) => (
                      <TableRow key={set.serie}>
                        <TableCell sx={styles.tableCell}>{set.serie}</TableCell>
                        <TableCell sx={styles.tableCell}>{set.peso}</TableCell>
                        <TableCell sx={styles.tableCell}>{set.ripetizioni}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Notes Section */}
              <Box sx={styles.noteSection}>
                <Typography sx={styles.noteTitle}>
                  {t('exerciseDetailModal.notes')}
                </Typography>
                <Typography sx={styles.noteText}>
                  {exercise.note}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDetailModal;
