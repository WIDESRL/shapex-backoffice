import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useClientContext } from '../../Context/ClientContext';
import TabButton from '../../components/TabButton';
import BackButton from '../../components/BackButton';

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
    mb: 3,
  },
  formContainer: {
    mt: 2,
  },
  fieldRow: {
    display: 'flex',
    alignItems: 'baseline',
    mb: 2,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#616160',
    fontWeight: 400,
    minWidth: 120,
    mr: 1,
  },
  fieldValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 400,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
};

const AnagraficaPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { clientId } = useParams<{ clientId: string }>();
  const { clientAnagrafica, loadingClientAnagrafica, fetchClientAnagrafica } = useClientContext();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (clientId) {
      fetchClientAnagrafica(clientId);
    }
  }, [clientId]);

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
          {t('client.anagraficapage.clientNotFound')}
        </Typography>
      </Box>
    );
  }

  const fullName = [clientAnagrafica.firstName, clientAnagrafica.lastName].filter(Boolean).join(' ');

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>
        {t('client.anagraficapage.title')}
      </Typography>

      <BackButton onClick={handleBackClick} />
      
      <Typography sx={styles.clientName}>
        {fullName || clientAnagrafica.email}
      </Typography>

      <Box sx={styles.tabContainer}>
        <TabButton
          title={t('client.anagraficapage.tabs.information')}
          onClick={() => setTabValue(0)}
          active={tabValue === 0}
        />
        <TabButton
          title={t('client.anagraficapage.tabs.contacts')}
          onClick={() => setTabValue(1)}
          active={tabValue === 1}
        />
      </Box>

      <Box sx={styles.formContainer}>
        {tabValue === 0 && (
          <Box>
            <Box sx={styles.fieldRow}>
              <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.firstName')}</Typography>
              <Typography sx={styles.fieldValue}>
                {clientAnagrafica.firstName}
              </Typography>
            </Box>
            <Box sx={styles.fieldRow}>
              <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.lastName')}</Typography>
              <Typography sx={styles.fieldValue}>
                {clientAnagrafica.lastName}
              </Typography>
            </Box>
            <Box sx={styles.fieldRow}>
              <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.dateOfBirth')}</Typography>
              <Typography sx={styles.fieldValue}>
                {clientAnagrafica.dateOfBirth 
                  ? new Date(clientAnagrafica.dateOfBirth).toLocaleDateString('it-IT') 
                  : ''}
              </Typography>
            </Box>
            <Box sx={styles.fieldRow}>
              <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.placeOfBirth')}</Typography>
              <Typography sx={styles.fieldValue}>
                {clientAnagrafica.placeOfBirth }
              </Typography>
            </Box>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Box sx={styles.fieldRow}>
              <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.phone')}</Typography>
              <Typography sx={styles.fieldValue}>
                {clientAnagrafica.phoneNumber || ''}
              </Typography>
            </Box>
            <Box sx={styles.fieldRow}>
              <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.email')}</Typography>
              <Typography sx={styles.fieldValue}>
                {clientAnagrafica.email || ''}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AnagraficaPage;

