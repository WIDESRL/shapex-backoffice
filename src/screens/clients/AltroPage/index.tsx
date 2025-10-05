import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../../Context/ClientContext';
import TabButton from '../../../components/TabButton';
import BackButton from '../../../components/BackButton';
import AbbonamentoTab from './tabs/AbbonamentoTab';
import NotificheTab from './tabs/NotificheTab';
import ConsentTab from './tabs/ConsentTab';
import ConfigurazioneTab from './tabs/ConfigurazioneTab';
import CallsTab from './tabs/CallsTab';

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

const AltroPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clientId, tabName } = useParams<{ clientId: string; tabName?: string }>();
  const { clientAnagrafica, loadingClientAnagrafica, fetchClientAnagrafica } = useClientContext();
  const [tabValue, setTabValue] = useState(0);

  // Map tab names to tab indices
  const getTabIndexFromName = (tabName: string | undefined): number => {
    switch (tabName) {
      case 'subscription':
        return 0;
      case 'notifications':
        return 1;
      case 'consents':
        return 2;
      case 'calls':
        return 3;
      case 'configuration':
        return 4;
      default:
        return 0;
    }
  };

  // Map tab indices to tab names
  const getTabNameFromIndex = (tabIndex: number): string => {
    switch (tabIndex) {
      case 0:
        return 'subscription';
      case 1:
        return 'notifications';
      case 2:
        return 'consents';
      case 3:
        return 'calls';
      case 4:
        return 'configuration';
      default:
        return 'subscription';
    }
  };

  // Set tab value based on URL parameter
  useEffect(() => {
    if (tabName) {
      const tabIndex = getTabIndexFromName(tabName);
      if (['subscription', 'notifications', 'consents', 'calls', 'configuration'].includes(tabName)) {
        setTabValue(tabIndex);
      } else {
        // Invalid tab name, redirect to first tab
        navigate(`/clients/${clientId}/altro/subscription`, { replace: true });
      }
    } else {
      // No tab name in URL, redirect to first tab with tab name
      navigate(`/clients/${clientId}/altro/subscription`, { replace: true });
    }
  }, [tabName, clientId, navigate]);

  useEffect(() => {
    if (clientId) {
      fetchClientAnagrafica(clientId);
    }
  }, [clientId]);

  const handleBackClick = () => {
    navigate('/clients');
  };

  const handleTabChange = (newTabValue: number) => {
    setTabValue(newTabValue);
    const tabName = getTabNameFromIndex(newTabValue);
    navigate(`/clients/${clientId}/altro/${tabName}`, { replace: true });
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
          {t('client.altro.clientNotFound')}
        </Typography>
      </Box>
    );
  }

  const fullName = [clientAnagrafica.firstName, clientAnagrafica.lastName].filter(Boolean).join(' ');

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>
        {t('client.altro.title')}
      </Typography>

      <BackButton onClick={handleBackClick} />
      
      <Typography sx={styles.clientName}>
        {fullName || clientAnagrafica.email}
      </Typography>

      <Box sx={styles.tabContainer}>
        <TabButton
          title={t('client.altro.tabs.subscription')}
          onClick={() => handleTabChange(0)}
          active={tabValue === 0}
        />
        <TabButton
          title={t('client.altro.tabs.notifications')}
          onClick={() => handleTabChange(1)}
          active={tabValue === 1}
        />
        <TabButton
          title={t('client.altro.tabs.consents')}
          onClick={() => handleTabChange(2)}
          active={tabValue === 2}
        />
        <TabButton
          title={t('client.altro.tabs.calls')}
          onClick={() => handleTabChange(3)}
          active={tabValue === 3}
        />
        <TabButton
          title={t('client.altro.tabs.configuration')}
          onClick={() => handleTabChange(4)}
          active={tabValue === 4}
        />
      </Box>

      {tabValue === 0 && <AbbonamentoTab />}
      {tabValue === 1 && <NotificheTab />}
      {tabValue === 2 && <ConsentTab />}
      {tabValue === 3 && <CallsTab />}
      {tabValue === 4 && <ConfigurazioneTab />}
    </Box>
  );
};

export default AltroPage;
