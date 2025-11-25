import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Fade
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DialogCloseIcon from '../../icons/DialogCloseIcon2';
import { useGlobalConfig } from '../../Context/GlobalConfigContext';
import { useSnackbar } from '../../Context/SnackbarContext';

interface GlobalConfigurationsProps {
  styles: Record<string, Record<string, unknown>>;
}

const GlobalConfigurations: React.FC<GlobalConfigurationsProps> = ({ styles }) => {
  const { t } = useTranslation();
  const { loading: configLoading, updateConfig, getConfigByName, configs } = useGlobalConfig();
  const { showSnackbar } = useSnackbar();
  
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<{ id: number; name: string; currentValue: string; newValue: string } | null>(null);

  // Memoized config values to avoid repeated getConfigByName calls
  const checkEditWindowConfig = useMemo(() => 
    configs.find(config => config.name === 'CHECK_EDIT_WINDOW_HOURS'), 
    [configs]
  );
  const checkReminderDaysConfig = useMemo(() => 
    configs.find(config => config.name === 'CHECK_REMINDER_DAYS_BEFORE'), 
    [configs]
  );
  const adminEmailConfig = useMemo(() => 
    configs.find(config => config.name === 'ADMIN_EMAIL'), 
    [configs]
  );

  const handleConfigEdit = (configName: string, displayName: string) => {
    const config = getConfigByName(configName);
    if (config) {
      setSelectedConfig({
        id: config.id,
        name: displayName,
        currentValue: config.value,
        newValue: config.value
      });
      setConfigDialogOpen(true);
    }
  };

  const handleConfigUpdate = async () => {
    if (!selectedConfig) return;
    
    // Check if this is an email field
    const isEmailField = selectedConfig.name === t('settings.globalConfig.adminEmail');
    
    // Validate the new value
    if (isEmailField) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(selectedConfig.newValue)) {
        showSnackbar(t('settings.globalConfig.confirmDialog.invalidEmail'), 'error');
        return;
      }
    } else {
      const newValue = Number(selectedConfig.newValue);
      if (isNaN(newValue) || newValue <= 0) {
        showSnackbar(t('settings.globalConfig.confirmDialog.invalidValue'), 'error');
        return;
      }
    }
    
    try {
      await updateConfig(selectedConfig.id, selectedConfig.newValue);
      showSnackbar(t('settings.globalConfig.messages.updateSuccess'), 'success');
      setConfigDialogOpen(false);
      setSelectedConfig(null);
    } catch {
      showSnackbar(t('settings.globalConfig.messages.updateFailed'), 'error');
    }
  };

  const handleCloseConfigDialog = () => {
    setConfigDialogOpen(false);
    setSelectedConfig(null);
  };

  return (
    <>
      <Paper sx={styles.sectionPaper}>
        <Typography sx={styles.sectionTitle}>
          {t('settings.globalConfigurations')}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {configLoading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress sx={{ color: '#E6BB4A' }} />
          </Box>
        ) : (
          <Box sx={styles.configContainer}>
            {/* Check Edit Window Configuration */}
            <Box sx={styles.configItem}>
              <Box sx={styles.configInfo}>
                <Typography variant="h6" sx={styles.configTitle}>
                  {t('settings.globalConfig.checkEditWindow')}
                </Typography>
                <Typography variant="body2" sx={styles.configDescription}>
                  {t('settings.globalConfig.checkEditWindowDescription')}
                </Typography>
              </Box>
              <Box sx={styles.configActions}>
                <Typography variant="h6" sx={styles.configValue}>
                  {checkEditWindowConfig?.value || '0'} {t('settings.globalConfig.checkEditWindow').toLowerCase().includes('ore') ? 'ore' : 'hours'}
                </Typography>
                <Button
                  variant="outlined"
                  sx={styles.outlinedButton}
                  onClick={() => handleConfigEdit('CHECK_EDIT_WINDOW_HOURS', t('settings.globalConfig.checkEditWindow'))}
                >
                  {t('settings.globalConfig.editButton')}
                </Button>
              </Box>
            </Box>

            {/* Check Reminder Days Configuration */}
            <Box sx={styles.configItem}>
              <Box sx={styles.configInfo}>
                <Typography variant="h6" sx={styles.configTitle}>
                  {t('settings.globalConfig.checkReminderDays')}
                </Typography>
                <Typography variant="body2" sx={styles.configDescription}>
                  {t('settings.globalConfig.checkReminderDaysDescription')}
                </Typography>
              </Box>
              <Box sx={styles.configActions}>
                <Typography variant="h6" sx={styles.configValue}>
                  {checkReminderDaysConfig?.value || '0'} {t('settings.globalConfig.checkReminderDays').toLowerCase().includes('giorni') ? 'giorni' : 'days'}
                </Typography>
                <Button
                  variant="outlined"
                  sx={styles.outlinedButton}
                  onClick={() => handleConfigEdit('CHECK_REMINDER_DAYS_BEFORE', t('settings.globalConfig.checkReminderDays'))}
                >
                  {t('settings.globalConfig.editButton')}
                </Button>
              </Box>
            </Box>

            {/* Admin Email Configuration */}
            <Box sx={styles.configItem}>
              <Box sx={styles.configInfo}>
                <Typography variant="h6" sx={styles.configTitle}>
                  {t('settings.globalConfig.adminEmail')}
                </Typography>
                <Typography variant="body2" sx={styles.configDescription}>
                  {t('settings.globalConfig.adminEmailDescription')}
                </Typography>
              </Box>
              <Box sx={styles.configActions}>
                <Typography variant="h6" sx={styles.configValue}>
                  {adminEmailConfig?.value || 'Not set'}
                </Typography>
                <Button
                  variant="outlined"
                  sx={styles.outlinedButton}
                  onClick={() => handleConfigEdit('ADMIN_EMAIL', t('settings.globalConfig.adminEmail'))}
                >
                  {t('settings.globalConfig.editButton')}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Configuration Update Dialog */}
      <Dialog 
        open={configDialogOpen} 
        onClose={handleCloseConfigDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: styles.dialogPaper }}
        TransitionComponent={Fade}
        slotProps={{
          backdrop: {
            timeout: 300,
            sx: styles.dialogBackdrop,
          },
        }}
      >
        <DialogTitle sx={styles.dialogTitle}>
          {t('settings.globalConfig.confirmDialog.title')}
          <IconButton
            onClick={handleCloseConfigDialog}
            sx={styles.closeButton}
          >
            <DialogCloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {t('settings.globalConfig.confirmDialog.message')}
          </Typography>
          
          <Box sx={styles.dialogCurrentValue}>
            <Typography variant="body2" sx={styles.dialogValueLabel}>
              <strong>{t('settings.globalConfig.confirmDialog.currentValue')}</strong> {selectedConfig?.currentValue}
            </Typography>
          </Box>

          <Box sx={styles.dialogNewValue}>
            <Typography variant="body2" sx={styles.dialogValueLabel}>
              <strong>{t('settings.globalConfig.confirmDialog.newValue')}</strong>
            </Typography>
            <TextField
              type={selectedConfig?.name === t('settings.globalConfig.adminEmail') ? 'email' : 'number'}
              value={selectedConfig?.newValue || ''}
              onChange={(e) => setSelectedConfig(prev => prev ? { ...prev, newValue: e.target.value } : null)}
              variant="outlined"
              size="small"
              fullWidth
              inputProps={selectedConfig?.name === t('settings.globalConfig.adminEmail') ? {} : { min: 1 }}
              error={selectedConfig?.newValue !== '' && (
                selectedConfig?.name === t('settings.globalConfig.adminEmail') 
                  ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedConfig?.newValue)
                  : (isNaN(Number(selectedConfig?.newValue)) || 
                     Number(selectedConfig?.newValue) <= 0 ||
                     selectedConfig?.newValue === '0')
              )}
              helperText={
                selectedConfig?.newValue !== '' && (
                  selectedConfig?.name === t('settings.globalConfig.adminEmail')
                    ? (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedConfig?.newValue) ? t('settings.globalConfig.confirmDialog.invalidEmail') : '')
                    : ((isNaN(Number(selectedConfig?.newValue)) || 
                        Number(selectedConfig?.newValue) <= 0 ||
                        selectedConfig?.newValue === '0') ? t('settings.globalConfig.confirmDialog.invalidValue') : '')
                )
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button 
            onClick={handleCloseConfigDialog}
            sx={{ ...styles.outlinedButton, ...styles.cancelButton }}
            variant="outlined"
          >
            {t('settings.globalConfig.confirmDialog.cancel')}
          </Button>
          <Button 
            onClick={handleConfigUpdate}
            sx={styles.actionButton}
            variant="contained"
            disabled={
              !selectedConfig?.newValue || 
              selectedConfig.newValue === selectedConfig.currentValue ||
              (selectedConfig?.name === t('settings.globalConfig.adminEmail')
                ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedConfig.newValue)
                : (isNaN(Number(selectedConfig.newValue)) ||
                   Number(selectedConfig.newValue) <= 0 ||
                   selectedConfig.newValue === '0'))
            }
          >
            {t('settings.globalConfig.confirmDialog.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GlobalConfigurations;
