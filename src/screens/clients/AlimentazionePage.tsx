import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useClientContext } from '../../Context/ClientContext';
import { useSnackbar } from '../../Context/SnackbarContext';
import BackButton from '../../components/BackButton';
import DietHistoryDialog from '../../components/DietHistoryDialog';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { format, parseISO } from 'date-fns';

const styles = {
  container: {
    p: 3,
    pb: 6,
    minHeight: '100vh',
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
    minHeight: 100,
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
  featureDisabledContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 2,
    border: '1px solid #e0e0e0',
    minHeight: 200,
    p: 4,
  },
  featureDisabledText: {
    color: '#757575',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  historySection: {
    mt: 4,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: '#333',
    mb: 2,
  },
  historyTableContainer: {
    backgroundColor: '#fff',
    borderRadius: 2,
    border: '1px solid #e0e0e0',
    maxHeight: 400,
    overflow: 'auto',
  },
  historyTableCell: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  emptyHistoryCell: {
    color: '#999',
    fontStyle: 'italic',
  },
  contentPreview: {
    cursor: 'pointer',
    fontSize: 14,
    lineHeight: 1.4,
    maxWidth: 200,
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
    createOrUpdateDiet,
    dietHistory,
    loadingDietHistory,
    fetchDietHistory
  } = useClientContext();
  const [pianoAlimentare, setPianoAlimentare] = useState('');
  const [integrazioneAlimentare, setIntegrazioneAlimentare] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', content: '' });

  // Helper function to strip HTML and truncate text
  const stripHtmlAndTruncate = useCallback((htmlString: string, maxLength: number = 100): string => {
    if (!htmlString) return '';
    // Remove HTML tags
    const textOnly = htmlString.replace(/<[^>]*>/g, '');
    // Decode HTML entities
    const decoded = textOnly.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    // Truncate and add ellipsis
    return decoded.length > maxLength ? `${decoded.substring(0, maxLength)}...` : decoded;
  }, []);

  // Memoized function to format period
  const formatPeriod = useCallback((historyItem: { createdAt: string; mealPlanUpdatedAt?: string | null; foodSupplementsUpdatedAt?: string | null }): string => {
    if (historyItem.mealPlanUpdatedAt) {
      const start = format(parseISO(historyItem.mealPlanUpdatedAt), 'dd/MM/yyyy HH:mm');
      const end = format(parseISO(historyItem.createdAt), 'dd/MM/yyyy HH:mm');
      return `${start} - ${end}`;
    } else if (historyItem.foodSupplementsUpdatedAt) {
      const start = format(parseISO(historyItem.foodSupplementsUpdatedAt), 'dd/MM/yyyy HH:mm');
      const end = format(parseISO(historyItem.createdAt), 'dd/MM/yyyy HH:mm');
      return `${start} - ${end}`;
    }
    return '';
  }, []);

  useEffect(() => {
    if (clientId) {
      fetchClientAnagrafica(clientId);
      fetchDiet(clientId);
      fetchDietHistory(clientId);
    }
  }, [clientId]);

  // Update local state when diet data is loaded
  useEffect(() => {
    if(!diet){
      setPianoAlimentare("")
      setIntegrazioneAlimentare("")
      return;
    }
    if(String(diet.userId) !== String(clientId)){
      setPianoAlimentare("")
      setIntegrazioneAlimentare("")
      return;
    }
    if (diet) {
      setTimeout(() => {
        if(pianoAlimentare === '' ) setPianoAlimentare(diet.mealPlan || '');
        if(integrazioneAlimentare === '') setIntegrazioneAlimentare(diet.foodSupplements || '');
      }, 300)
    }
  }, [diet]);

  const handleBackClick = () => {
    navigate('/clients');
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

  const handleOpenDialog = (content: string, title: string) => {
    setDialogContent({ title, content });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogContent({ title: '', content: '' });
  };

  if (loadingClientAnagrafica || loadingDiet || loadingDietHistory) {
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
          
          {clientAnagrafica?.activeSubscription?.mealPlan ? (
            <>
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
                disabled={loadingDiet || pianoAlimentare === (diet?.mealPlan || '')}
              >
                {loadingDiet ? t('client.alimentazione.buttons.saving') : t('client.alimentazione.buttons.insert')}
              </Button>
            </>
          ) : (
            <Box sx={styles.featureDisabledContainer}>
              <Typography sx={styles.featureDisabledText}>
                {t('client.alimentazione.featureNotEnabled.mealPlan')}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Integrazione alimentare section */}
        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>
            {t('client.alimentazione.sections.supplementation')}
          </Typography>
          
          {clientAnagrafica?.activeSubscription?.integrationPlan ? (
            <>
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
                disabled={loadingDiet || integrazioneAlimentare === (diet?.foodSupplements || '')}
              >
                {loadingDiet ? t('client.alimentazione.buttons.saving') : t('client.alimentazione.buttons.insert')}
              </Button>
            </>
          ) : (
            <Box sx={styles.featureDisabledContainer}>
              <Typography sx={styles.featureDisabledText}>
                {t('client.alimentazione.featureNotEnabled.supplementation')}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Diet History Section */}
      <Box sx={styles.historySection}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={styles.historyTitle}>
            {t('client.alimentazione.sections.history', 'Diet History')}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => clientId && fetchDietHistory(clientId)}
            disabled={loadingDietHistory}
            sx={{
              borderColor: '#E6BB4A',
              color: '#E6BB4A',
              '&:hover': {
                borderColor: '#d4a84a',
                backgroundColor: 'rgba(230, 187, 74, 0.04)',
              },
              minWidth: 100,
            }}
          >
            {loadingDietHistory ? <CircularProgress size={20} /> : t('common.reload', 'Reload')}
          </Button>
        </Box>
        
        {loadingDietHistory ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress />
          </Box>
        ) : dietHistory.length === 0 ? (
          <Box sx={styles.featureDisabledContainer}>
            <Typography sx={styles.featureDisabledText}>
              {t('client.alimentazione.noHistory', 'No diet history available')}
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={styles.historyTableContainer}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>{t('client.alimentazione.table.mealPlan', 'Meal Plan')}</TableCell>
                  <TableCell>{t('client.alimentazione.table.supplements', 'Food Supplements')}</TableCell>
                  <TableCell>{t('client.alimentazione.table.updatedAt', 'Available Period')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dietHistory
                  .sort((a, b) => {
                    // Sort by the update date (mealPlanUpdatedAt or foodSupplementsUpdatedAt), newest first
                    const aDate = a.mealPlanUpdatedAt || a.foodSupplementsUpdatedAt || a.createdAt;
                    const bDate = b.mealPlanUpdatedAt || b.foodSupplementsUpdatedAt || b.createdAt;
                    return new Date(bDate).getTime() - new Date(aDate).getTime();
                  })
                  .map((historyItem) => {
                    return (
                      <TableRow key={historyItem.id}>
                        <TableCell 
                          sx={historyItem.mealPlan ? styles.historyTableCell : styles.emptyHistoryCell}
                          onClick={historyItem.mealPlan ? () => handleOpenDialog(historyItem.mealPlan!, t('client.alimentazione.sections.mealPlan')) : undefined}
                        >
                          {historyItem.mealPlan && (
                            <Typography sx={styles.contentPreview}>
                              {stripHtmlAndTruncate(historyItem.mealPlan)}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell 
                          sx={historyItem.foodSupplements ? styles.historyTableCell : styles.emptyHistoryCell}
                          onClick={historyItem.foodSupplements ? () => handleOpenDialog(historyItem.foodSupplements!, t('client.alimentazione.sections.supplementation')) : undefined}
                        >
                          {historyItem.foodSupplements && (
                            <Typography sx={styles.contentPreview}>
                              {stripHtmlAndTruncate(historyItem.foodSupplements)}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatPeriod(historyItem)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Diet History Dialog */}
      <DietHistoryDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={dialogContent.title}
        htmlContent={dialogContent.content}
      />
    </Box>
  );
};

export default AlimentazionePage;
