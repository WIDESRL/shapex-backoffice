import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../../Context/ClientContext';
import TabButton from '../../../components/TabButton';
import BackButton from '../../../components/BackButton';
import ProgrammiAllenamentoTab from './tabs/ProgrammiAllenamentoTab';
import AllenamentiCompletatiTab from './tabs/AllenamentiCompletatiTab';
import StoricoEserciziTab from './tabs/StoricoEserciziTab';

const styles = {
  container: {
    p: 3,
    height: '95vh',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontWeight: 300,
    fontSize: 32,
    color: '#616160',
    mb: 2,
  },
  clientName: {
    fontWeight: 400,
    fontSize: 24,
    color: '#333',
    mb: 2,
  },
  tabContainer: {
    display: 'flex',
    gap: 1,
    mb: 6,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
};

const AllenamentiPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const { clientAnagrafica, loadingClientAnagrafica, fetchClientAnagrafica, fetchTrainingProgramOfUser, fetchHistoricalExercises } = useClientContext();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (clientId) {
      fetchClientAnagrafica(clientId);
      fetchTrainingProgramOfUser(clientId)
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId && tabValue === 2) fetchHistoricalExercises(clientId);
  }, [tabValue]);

  const handleBackClick = () => {
    navigate('/clients');
  };

  if (loadingClientAnagrafica) {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.loadingContainer}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!clientAnagrafica) {
    return (
      <Box sx={styles.container}>
        <Typography variant="h6" color="error">
          {t('client.allenamenti.clientNotFound')}
        </Typography>
      </Box>
    );
  }

  const fullName = [clientAnagrafica.firstName, clientAnagrafica.lastName].filter(Boolean).join(' ');

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>
        {t('client.allenamenti.title')}
      </Typography>

      <BackButton onClick={handleBackClick} />
      
      <Typography sx={styles.clientName}>
        {fullName || clientAnagrafica.email}
      </Typography>

      <Box sx={styles.tabContainer}>
        <TabButton
          title={t('client.allenamenti.tabs.programs')}
          onClick={() => setTabValue(0)}
          active={tabValue === 0}
        />
        <TabButton
          title={t('client.allenamenti.tabs.completed')}
          onClick={() => setTabValue(1)}
          active={tabValue === 1}
        />
        <TabButton
          title={t('client.allenamenti.tabs.history')}
          onClick={() => setTabValue(2)}
          active={tabValue === 2}
        />
      </Box>

      {tabValue === 0 && <ProgrammiAllenamentoTab />}
      {tabValue === 1 && <AllenamentiCompletatiTab />}
      {tabValue === 2 && <StoricoEserciziTab />}
    </Box>
  );
};

export default AllenamentiPage;
  
