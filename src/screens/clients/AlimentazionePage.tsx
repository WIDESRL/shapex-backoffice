import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../Context/ClientContext';
import { useSnackbar } from '../../Context/SnackbarContext';
import BackButton from '../../components/BackButton';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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
    mb: 4,
  },
  contentContainer: {
    display: 'flex',
    gap: 3,
    flex: 1,
  },
  section: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: '#333',
    mb: 2,
  },
  editorContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 2,
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
    minHeight: 200,
  },
  editorPlaceholder: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    p: 3,
  },
  insertButton: {
    mt: 2,
    backgroundColor: '#E6BB4A',
    color: '#fff',
    borderRadius: 2,
    fontWeight: 500,
    fontSize: 16,
    py: 1.5,
    px: 4,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#d4a84a',
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  quillEditor: {
    '& .ql-container': {
      border: 'none',
      minHeight: '120px',
      resize: 'vertical',
      overflow: 'auto',
    },
    '& .ql-toolbar': {
      borderBottom: '1px solid #e0e0e0',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
    },
    '& .ql-editor': {
      minHeight: '120px',
      fontSize: 14,
      resize: 'vertical',
      overflow: 'auto',
    },
  },
};

const AlimentazionePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const { showSnackbar } = useSnackbar();
  const { 
    clientAnagrafica, 
    loadingClientAnagrafica, 
    fetchClientAnagrafica,
    diet,
    loadingDiet,
    fetchDiet,
    createOrUpdateDiet
  } = useClientContext();
  const [pianoAlimentare, setPianoAlimentare] = useState('');
  const [integrazioneAlimentare, setIntegrazioneAlimentare] = useState('');

  useEffect(() => {
    if (clientId) {
      fetchClientAnagrafica(clientId);
      fetchDiet(clientId);
    }
  }, [clientId]);

  // Update local state when diet data is loaded
  useEffect(() => {
    console.log('Diet data loaded:', diet);
    if (diet) {
      console.log('Setting mealPlan to:', diet.mealPlan);
      console.log('Setting foodSupplements to:', diet.foodSupplements);
      setPianoAlimentare(diet.mealPlan || '');
      setIntegrazioneAlimentare(diet.foodSupplements || '');
    }
  }, [diet]);

  const handleBackClick = () => {
    navigate('/clients/anagrafica');
  };

  const handleInsertPiano = async () => {
    if (!clientId) return;
    
    try {
      await createOrUpdateDiet(clientId, pianoAlimentare, undefined);
      console.log('Piano Alimentare updated successfully');
      showSnackbar(t('client.alimentazione.messages.mealPlanSuccess'), 'success');
    } catch (error) {
      console.error('Error updating Piano Alimentare:', error);
      let errorMessage = t('client.alimentazione.messages.mealPlanError');
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage += `: ${(error as { message?: string }).message}`;
      }
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleInsertIntegrazione = async () => {
    if (!clientId) return;
    
    try {
      await createOrUpdateDiet(clientId, undefined, integrazioneAlimentare);
      console.log('Integrazione Alimentare updated successfully');
      showSnackbar(t('client.alimentazione.messages.supplementationSuccess'), 'success');
    } catch (error) {
      console.error('Error updating Integrazione Alimentare:', error);
      let errorMessage = t('client.alimentazione.messages.supplementationError');
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage += `: ${(error as { message?: string }).message}`;
      }
      showSnackbar(errorMessage, 'error');
    }
  };

  if (loadingClientAnagrafica || loadingDiet) {
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
          {t('client.alimentazione.clientNotFound')}
        </Typography>
      </Box>
    );
  }

  const fullName = [clientAnagrafica.firstName, clientAnagrafica.lastName].filter(Boolean).join(' ');

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>
        {t('client.alimentazione.title')}
      </Typography>

      <BackButton onClick={handleBackClick} />
      
      <Typography sx={styles.clientName}>
        {fullName || clientAnagrafica.email}
      </Typography>

      <Box sx={styles.contentContainer}>
        {/* Piano alimentare section */}
        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>
            {t('client.alimentazione.sections.mealPlan')}
          </Typography>
          
          <Box sx={styles.editorContainer}>
            <Box sx={styles.quillEditor}>
              <ReactQuill
                key={`meal-plan-${diet?.id || 'new'}`}
                theme="snow"
                value={pianoAlimentare}
                onChange={setPianoAlimentare}
                placeholder={t('client.alimentazione.placeholders.mealPlan')}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            sx={styles.insertButton}
            onClick={handleInsertPiano}
            disabled={loadingDiet}
          >
            {loadingDiet ? t('client.alimentazione.buttons.saving') : t('client.alimentazione.buttons.insert')}
          </Button>
        </Box>

        {/* Integrazione alimentare section */}
        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>
            {t('client.alimentazione.sections.supplementation')}
          </Typography>
          
          <Box sx={styles.editorContainer}>
            <Box sx={styles.quillEditor}>
              <ReactQuill
                key={`food-supplements-${diet?.id || 'new'}`}
                theme="snow"
                value={integrazioneAlimentare}
                onChange={setIntegrazioneAlimentare}
                placeholder={t('client.alimentazione.placeholders.supplementation')}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            sx={styles.insertButton}
            onClick={handleInsertIntegrazione}
            disabled={loadingDiet}
          >
            {loadingDiet ? t('client.alimentazione.buttons.saving') : t('client.alimentazione.buttons.insert')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AlimentazionePage;
