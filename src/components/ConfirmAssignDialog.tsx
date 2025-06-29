import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Backdrop, Fade, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DialogCloseIcon from '../icons/DialogCloseIcon2';

interface ConfirmAssignDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  programName: string;
}

const styles = {
  dialogPaper: {
    borderRadius: 3,
    boxShadow: 8,
    px: 4,
    py: 3,
    background: '#fff',
    minWidth: 340,
    fontFamily: 'Montserrat, sans-serif',
  },
  backdrop: {
    timeout: 300,
    sx: {
      backgroundColor: 'rgba(33,33,33,0.8)',
      backdropFilter: 'blur(5px)',
    },
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  closeButtonInner: {
    minWidth: 0,
    p: 1,
    background: 'transparent',
    boxShadow: 'none',
    '&:hover': { background: 'rgba(0,0,0,0.04)' },
    borderRadius: '50%',
  },
  closeIcon: {
    fontSize: 24,
    color: '#888',
  },
  dialogTitle: {
    textAlign: 'center',
    fontWeight: 400,
    fontSize: 18,
    color: '#444',
    pb: 4,
    pt: 1,
    fontFamily: 'Montserrat, sans-serif',
  },
  dialogContent: {
    textAlign: 'center',
    fontSize: 15,
    color: '#888',
    fontFamily: 'Montserrat, sans-serif',
    pb: 2,
  },
  messageText: {
    fontSize: 14,
    color: '#b0b0b0',
    fontFamily: 'Montserrat, sans-serif',
  },
  dialogActions: {
    justifyContent: 'center',
    gap: 2,
    pb: 2,
  },
  cancelButton: {
    minWidth: 140,
    borderRadius: 2,
    fontWeight: 400,
    fontSize: 15,
    color: '#444',
    borderColor: '#bdbdbd',
    background: '#fff',
    fontFamily: 'Montserrat, sans-serif',
    '&:hover': { background: '#f5f5f5', borderColor: '#bdbdbd' },
  },
  confirmButton: {
    minWidth: 140,
    borderRadius: 2,
    fontWeight: 400,
    fontSize: 15,
    color: '#fff',
    background: '#E6BB4A',
    fontFamily: 'Montserrat, sans-serif',
    boxShadow: 'none',
    '&:hover': { background: '#D4A939' },
  },
};

const ConfirmAssignDialog: React.FC<ConfirmAssignDialogProps> = ({ 
  open, 
  onClose, 
  onConfirm, 
  programName 
}) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: styles.dialogPaper,
      }}
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: styles.backdrop,
      }}
      TransitionComponent={Fade}
    >
      {/* Close icon */}
      <Box sx={styles.closeButton}>
        <Button onClick={onClose} sx={styles.closeButtonInner}>
          <DialogCloseIcon style={styles.closeIcon} />
        </Button>
      </Box>
      <DialogTitle sx={styles.dialogTitle}>
        {t('client.allenamenti.confirmAssignDialog.title')}
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <Typography sx={styles.messageText}>
          {t('client.allenamenti.confirmAssignDialog.message', { programName })}
        </Typography>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={styles.cancelButton}
        >
          {t('client.allenamenti.confirmAssignDialog.cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={styles.confirmButton}
        >
          {t('client.allenamenti.confirmAssignDialog.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmAssignDialog;
