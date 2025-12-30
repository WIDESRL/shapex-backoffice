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
import AlbumVideoTab from './tabs/AlbumVideoTab';

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
  const { clientId, tabName } = useParams<{ clientId: string; tabName?: string }>();
  const { clientAnagrafica, loadingClientAnagrafica, fetchClientAnagrafica, fetchInitialHistory } = useClientContext();
  const [tabValue, setTabValue] = useState(0);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  // Map tab names to tab indices
  const getTabIndexFromName = (tabName: string | undefined): number => {
    switch (tabName) {
      case 'anamnesi':
        return 0;
      case 'measurements':
        return 1;
      case 'photos':
        return 2;
      case 'videos':
        return 3;
      default:
        return 0;
    }
  };

  // Map tab indices to tab names
  const getTabNameFromIndex = (tabIndex: number): string => {
    switch (tabIndex) {
      case 0:
        return 'anamnesi';
      case 1:
        return 'measurements';
      case 2:
        return 'photos';
      case 3:
        return 'videos';
      default:
        return 'anamnesi';
    }
  };

  // Debounced fetch function that calls both API functions together
  const debouncedFetchClientData = useCallback(
    (clientId: string) => {
      const timeoutId = setTimeout(() => {
        setHasInitialFetch(true);
        fetchClientAnagrafica(clientId);
        fetchInitialHistory(clientId);
      }, 200);
      
      return () => clearTimeout(timeoutId);
    },
    []
  );

  // Set tab value based on URL parameter
  useEffect(() => {
    if (tabName) {
      const tabIndex = getTabIndexFromName(tabName);
      if (tabName === 'anamnesi' || tabName === 'measurements' || tabName === 'photos' || tabName === 'videos') {
        setTabValue(tabIndex);
      } else {
        // Invalid tab name, redirect to first tab
        navigate(`/clients/${clientId}/diario/anamnesi`, { replace: true });
      }
    } else {
      // No tab name in URL, redirect to first tab with tab name
      navigate(`/clients/${clientId}/diario/anamnesi`, { replace: true });
    }
  }, [tabName, clientId, navigate]);

  useEffect(() => {
    if (clientId) {
      const cleanup = debouncedFetchClientData(clientId);
      return cleanup;
    }
  }, [clientId, debouncedFetchClientData]);

  const handleBackClick = () => {
    navigate('/clients');
  };

  const handleTabChange = (newTabValue: number) => {
    setTabValue(newTabValue);
    const tabName = getTabNameFromIndex(newTabValue);
    navigate(`/clients/${clientId}/diario/${tabName}`, { replace: true });
  };

  if (loadingClientAnagrafica || !hasInitialFetch) {
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
          onClick={() => handleTabChange(0)}
          active={tabValue === 0}
        />
        <TabButton
          title={t('client.diario.tabs.measurements')}
          onClick={() => handleTabChange(1)}
          active={tabValue === 1}
        />
        <TabButton
          title={t('client.diario.tabs.photos')}
          onClick={() => handleTabChange(2)}
          active={tabValue === 2}
        />
        <TabButton
          title={t('client.diario.tabs.videos')}
          onClick={() => handleTabChange(3)}
          active={tabValue === 3}
        />
      </Box>

      {tabValue === 0 && <AnamnesiInizialeTab />}
      {tabValue === 1 && <MisurazioniTab />}
      {tabValue === 2 && <AlbumFotograficoTab />}
      {tabValue === 3 && <AlbumVideoTab />}
    </Box>
  );
};

export default DiarioPage;
