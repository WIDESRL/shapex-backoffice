import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import OutlinedTextIconButton from '../components/OutlinedTextIconButton';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import TrainingExercisePage from './training/Exercises/TrainingExercisePage';
import TrainingProgramPage from './training/TrainingProgram/TrainingProgramPage';
import CompletedTrainingPage from './training/CompletedTrainingPage';
import { useTranslation } from 'react-i18next';

const styles = {
  root: { p: 4, background: '#fff', minHeight: '100vh' },
  mainTitle: { fontSize: 38, fontWeight: 400, color: '#616160', fontFamily: 'Montserrat, sans-serif', mb: 3 },
  sectionPaper: { borderRadius: 3, boxShadow: 'none', mb: 4 },
  sectionPaperGray: { background: '#F6F6F6', borderRadius: 3, boxShadow: 'none', mb: 4 },
  sectionHeaderBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 3 },
  sectionTitle: { fontSize: 28, fontWeight: 400, color: '#616160', fontFamily: 'Montserrat, sans-serif' },
  sectionSubtitle: { fontSize: 15, color: '#888', fontFamily: 'Montserrat, sans-serif' },
  buttonBox: { px: 3, pb: 3, pt: 2 },
};

const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={styles.root}>
      <Typography sx={styles.mainTitle}>{t('training.trainingPageTitle', 'Allenamento')}</Typography>

      <Paper elevation={0} sx={styles.sectionPaper}>
        <Box sx={styles.sectionHeaderBox}>
          <Typography sx={styles.sectionTitle}>{t('training.exercisesSectionTitle', 'Esercizi')}</Typography>
          <Typography sx={styles.sectionSubtitle}>{t('training.latestExercises', 'ultimi 3 esercizi inseriti')}</Typography>
        </Box>
        <Box>
          <TrainingExercisePage showHeader={false} rowLimit={3} />
        </Box>
        <Box sx={styles.buttonBox}>
          <OutlinedTextIconButton
            text={t('training.fullList', 'Lista completa')}
            icon={<ArrowRightIcon />}
            onClick={() => navigate('/training/exercise')}
          />
        </Box>
      </Paper>

      <Paper elevation={0} sx={styles.sectionPaper}>
        <Box sx={styles.sectionHeaderBox}>
          <Typography sx={styles.sectionTitle}>{t('training.programsSectionTitle', 'Programmi di allenamento')}</Typography>
          <Typography sx={styles.sectionSubtitle}>{t('training.latestPrograms', 'ultimi 3 programmi di allenamento inseriti')}</Typography>
        </Box>
         <Box>
          <TrainingProgramPage showHeader={false} rowLimit={3} />
        </Box>
        <Box sx={styles.buttonBox}>
          <OutlinedTextIconButton
            text={t('training.fullList', 'Lista completa')}
            icon={<ArrowRightIcon />}
            onClick={() => navigate('/training/training-program')}
          />
        </Box>
      </Paper>

      <Paper elevation={0} sx={styles.sectionPaper}>
        <Box sx={styles.sectionHeaderBox}>
          <Typography sx={styles.sectionTitle}>{t('training.completedSectionTitle', 'Allenamenti completati')}</Typography>
          <Typography sx={styles.sectionSubtitle}>{t('training.latestCompleted', 'ultimi 3 allenamenti completati')}</Typography>
        </Box>
        <Box>
          <CompletedTrainingPage showHeader={false} rowLimit={3} compact={true} />
        </Box>
        <Box sx={styles.buttonBox}>
          <OutlinedTextIconButton
            text={t('training.fullList', 'Lista completa')}
            icon={<ArrowRightIcon />}
            onClick={() => navigate('/training/completed-training')}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TrainingPage;
