import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../../Context/ClientContext';
import TabButton from '../../../components/TabButton';
import BackButton from '../../../components/BackButton';
import AnamnesiInizialeTab from './tabs/AnamnesiInizialeTab';
import MisurazioniTab from './tabs/MisurazioniTab';
import AlbumFotograficoTab from './tabs/AlbumFotograficoTab';

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

const DiarioPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const { clientAnagrafica, loadingClientAnagrafica, fetchClientAnagrafica, fetchInitialHistory } = useClientContext();
  const [tabValue, setTabValue] = useState(0);

  // Debounced fetch function that calls both API functions together
  const debouncedFetchClientData = useCallback(
    (clientId: string) => {
      const timeoutId = setTimeout(() => {
        fetchClientAnagrafica(clientId);
        fetchInitialHistory(clientId);
      }, 200);
      
      return () => clearTimeout(timeoutId);
    },
    []
  );

  useEffect(() => {
    if (clientId) {
      const cleanup = debouncedFetchClientData(clientId);
      return cleanup;
    }
  }, [clientId, debouncedFetchClientData]);

  const handleBackClick = () => {
    navigate('/clients/anagrafica');
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
          {t('client.diario.clientNotFound')}
        </Typography>
      </Box>
    );
  }

  const fullName = [clientAnagrafica.firstName, clientAnagrafica.lastName].filter(Boolean).join(' ');

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>
        {t('client.diario.title')}
      </Typography>

      <BackButton onClick={handleBackClick} />
      
      <Typography sx={styles.clientName}>
        {fullName || clientAnagrafica.email}
      </Typography>

      <Box sx={styles.tabContainer}>
        <TabButton
          title={t('client.diario.tabs.anamnesis')}
          onClick={() => setTabValue(0)}
          active={tabValue === 0}
        />
        <TabButton
          title={t('client.diario.tabs.measurements')}
          onClick={() => setTabValue(1)}
          active={tabValue === 1}
        />
        <TabButton
          title={t('client.diario.tabs.photos')}
          onClick={() => setTabValue(2)}
          active={tabValue === 2}
        />
      </Box>

      {tabValue === 0 && <AnamnesiInizialeTab />}
      {tabValue === 1 && <MisurazioniTab />}
      {tabValue === 2 && <AlbumFotograficoTab />}
    </Box>
  );
};

export default DiarioPage;
