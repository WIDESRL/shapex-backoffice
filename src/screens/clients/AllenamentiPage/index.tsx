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
  const { clientId, tabName } = useParams<{ clientId: string; tabName?: string }>();
  const { clientAnagrafica, loadingClientAnagrafica, fetchClientAnagrafica, fetchTrainingProgramOfUser, fetchHistoricalExercises } = useClientContext();
  const [tabValue, setTabValue] = useState(0);

  // Map tab names to tab indices
  const getTabIndexFromName = (tabName: string | undefined): number => {
    switch (tabName) {
      case 'training-programs':
        return 0;
      case 'completed-workouts':
        return 1;
      case 'exercise-history':
        return 2;
      default:
        return 0;
    }
  };

  // Map tab indices to tab names
  const getTabNameFromIndex = (tabIndex: number): string => {
    switch (tabIndex) {
      case 0:
        return 'training-programs';
      case 1:
        return 'completed-workouts';
      case 2:
        return 'exercise-history';
      default:
        return 'training-programs';
    }
  };

  // Set tab value based on URL parameter
  useEffect(() => {
    if (tabName) {
      const tabIndex = getTabIndexFromName(tabName);
      if (tabName === 'training-programs' || tabName === 'completed-workouts' || tabName === 'exercise-history') {
        setTabValue(tabIndex);
      } else {
        // Invalid tab name, redirect to first tab
        navigate(`/clients/${clientId}/allenamenti/training-programs`, { replace: true });
      }
    } else {
      // No tab name in URL, redirect to first tab with tab name
      navigate(`/clients/${clientId}/allenamenti/training-programs`, { replace: true });
    }
  }, [tabName, clientId, navigate]);

  useEffect(() => {
    if (clientId) {
      fetchClientAnagrafica(clientId);
      fetchTrainingProgramOfUser(clientId)
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId && tabValue === 2) fetchHistoricalExercises(clientId);
  }, [tabValue, clientId]);

  const handleBackClick = () => {
    navigate('/clients');
  };

  const handleTabChange = (newTabValue: number) => {
    setTabValue(newTabValue);
    const tabName = getTabNameFromIndex(newTabValue);
    navigate(`/clients/${clientId}/allenamenti/${tabName}`, { replace: true });
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
          onClick={() => handleTabChange(0)}
          active={tabValue === 0}
        />
        <TabButton
          title={t('client.allenamenti.tabs.completed')}
          onClick={() => handleTabChange(1)}
          active={tabValue === 1}
        />
        <TabButton
          title={t('client.allenamenti.tabs.history')}
          onClick={() => handleTabChange(2)}
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
  
