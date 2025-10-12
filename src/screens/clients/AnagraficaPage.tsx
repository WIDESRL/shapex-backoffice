import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useClientContext } from '../../Context/ClientContext';
import TabButton from '../../components/TabButton';
import BackButton from '../../components/BackButton';
import UserPasswordChange from '../../components/UserPasswordChange';

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
  informationTabContainer: {
    display: 'flex',
    gap: 3,
    flex: 1,
  },
  informationLeftSection: {
    flex: 1,
  },
  informationRightSection: {
    flex: 1,
    pl: 2,
    borderLeft: '1px solid #e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#616160',
    fontWeight: 500,
    mb: 2,
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
    minWidth: 80,
    mr: 1,
  },
  fieldValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 400,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    mr: 1,
  },
  deletionWarningContainer: {
    backgroundColor: '#ffebee',
    border: '1px solid #ef5350',
    borderRadius: 1,
    p: 1.5,
    mt: 2,
    width: 'fit-content',
    maxWidth: '600px',
  },
  deletionWarningTitle: {
    fontSize: 12,
    color: '#d32f2f',
    fontWeight: 600,
    mb: 0.5,
  },
  deletionWarningText: {
    fontSize: 11,
    color: '#d32f2f',
    lineHeight: 1.4,
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
  const { t, i18n } = useTranslation();
  const { clientId } = useParams<{ clientId: string }>();
  const { clientAnagrafica, loadingClientAnagrafica, fetchClientAnagrafica } = useClientContext();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (clientId) {
      fetchClientAnagrafica(clientId);
    }
  }, [clientId]);

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '---';
    try {
      const locale = i18n.language === 'en' ? 'en-US' : 'it-IT';
      return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return '---';
    }
  };

  const formatDateOnly = (dateString: string | null | undefined): string => {
    if (!dateString) return '---';
    try {
      const locale = i18n.language === 'en' ? 'en-US' : 'it-IT';
      return new Date(dateString).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '---';
    }
  };

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
        <TabButton
          title={t('client.anagraficapage.tabs.password')}
          onClick={() => setTabValue(2)}
          active={tabValue === 2}
        />
      </Box>

      <Box sx={styles.formContainer}>
        {tabValue === 0 && (
          <Box>
            <Box sx={styles.informationTabContainer}>
              {/* Left Section - Personal Information */}
              <Box sx={styles.informationLeftSection}>
                <Typography sx={styles.sectionTitle}>
                  {t('client.anagraficapage.sections.personalInfo')}
                </Typography>
                <Box sx={styles.fieldRow}>
                  <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.firstName')}</Typography>
                  <Typography sx={styles.fieldValue}>
                    {clientAnagrafica.firstName || '---'}
                  </Typography>
                </Box>
                <Box sx={styles.fieldRow}>
                  <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.lastName')}</Typography>
                  <Typography sx={styles.fieldValue}>
                    {clientAnagrafica.lastName || '---'}
                  </Typography>
                </Box>
                <Box sx={styles.fieldRow}>
                  <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.dateOfBirth')}</Typography>
                  <Typography sx={styles.fieldValue}>
                    {formatDateOnly(clientAnagrafica.dateOfBirth)}
                  </Typography>
                </Box>
                <Box sx={styles.fieldRow}>
                  <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.fiscalCode')}</Typography>
                  <Typography sx={styles.fieldValue}>
                    {clientAnagrafica.fiscalCode || '---'}
                  </Typography>
                </Box>
                <Box sx={styles.fieldRow}>
                  <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.placeOfBirth')}</Typography>
                  <Typography sx={styles.fieldValue}>
                    {clientAnagrafica.placeOfBirth || '---'}
                  </Typography>
                </Box>
              </Box>

              {/* Right Section - Status Information */}
              <Box sx={styles.informationRightSection}>
                <Typography sx={styles.sectionTitle}>
                  {t('client.anagraficapage.sections.statusInfo')}
                </Typography>
                <Box sx={styles.fieldRow}>
                  <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.online')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{
                        ...styles.onlineIndicator,
                        backgroundColor: clientAnagrafica.online ? '#4caf50' : '#9e9e9e'
                      }}
                    />
                    <Typography sx={styles.fieldValue}>
                      {clientAnagrafica.online ? t('common.yes') : t('common.no')}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={styles.fieldRow}>
                  <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.lastLogin')}</Typography>
                  <Typography sx={styles.fieldValue}>
                    {formatDate(clientAnagrafica.lastLogin)}
                  </Typography>
                </Box>
                <Box sx={styles.fieldRow}>
                  <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.lastOnline')}</Typography>
                  <Typography sx={styles.fieldValue}>
                    {formatDate(clientAnagrafica.lastOnline)}
                  </Typography>
                </Box>
                <Box sx={styles.fieldRow}>
                  <Typography sx={styles.fieldLabel}>{t('client.anagraficapage.fields.createdAt')}</Typography>
                  <Typography sx={styles.fieldValue}>
                    {formatDate(clientAnagrafica.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Account Deletion Warning - Within Information tab */}
            {clientAnagrafica.deletionRequested && (
              <Box sx={styles.deletionWarningContainer}>
                <Typography sx={styles.deletionWarningTitle}>
                  ⚠️ {t('client.anagraficapage.deletion.title')}
                </Typography>
                <Typography sx={styles.deletionWarningText}>
                  {t('client.anagraficapage.deletion.description', {
                    requestedDate: formatDate(clientAnagrafica.deletionRequestedAt),
                    scheduledDate: formatDate(clientAnagrafica.scheduledDeletionDate)
                  })}
                </Typography>
              </Box>
            )}
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

        {tabValue === 2 && clientId && (
          <UserPasswordChange userId={clientId} />
        )}
      </Box>
    </Box>
  );
};

export default AnagraficaPage;

