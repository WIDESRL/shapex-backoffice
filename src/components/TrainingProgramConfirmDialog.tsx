import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const styles = {
  dialogBackdrop: {
    backgroundColor: 'rgba(33,33,33,0.8)',
    backdropFilter: 'blur(5px)',
  },
  dialogPaper: {
    borderRadius: 2,
    p: 2,
    minWidth: 400,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 600,
    fontFamily: 'Montserrat, sans-serif',
    color: '#616160',
  },
  dialogContent: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 16,
    color: '#616160',
  },
  dialogActions: {
    px: 2,
    pb: 2,
    gap: 1,
  },
  cancelButton: {
    color: '#888',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    textTransform: 'none' as const,
  },
  confirmButton: {
    background: 'linear-gradient(90deg, #E6BB4A 0%, #FFD600 100%)',
    color: '#fff',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    textTransform: 'none' as const,
    '&:hover': {
      background: 'linear-gradient(90deg, #d4a938 0%, #e6c400 100%)',
    },
  },
};

interface TrainingProgramConfirmDialogProps {
  open: boolean;
  programTitle: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const TrainingProgramConfirmDialog: React.FC<TrainingProgramConfirmDialogProps> = ({
  open,
  programTitle,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{ sx: styles.dialogPaper }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: styles.dialogBackdrop,
        },
      }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        {t('client.main.viewTrainingProgram', 'View Training Program')}
      </DialogTitle>
      <DialogContent>
        <Typography sx={styles.dialogContent}>
          {t('client.main.confirmViewProgram', 'Do you want to view training program')}{' '}
          <strong>{programTitle}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button onClick={onCancel} sx={styles.cancelButton}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button onClick={onConfirm} variant="contained" sx={styles.confirmButton}>
          {t('common.confirm', 'Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrainingProgramConfirmDialog;
