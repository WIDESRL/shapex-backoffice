import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Backdrop,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

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
  dialogContentText: {
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

interface ChatRedirectConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ChatRedirectConfirmDialog: React.FC<ChatRedirectConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="chat-confirm-dialog-title"
      aria-describedby="chat-confirm-dialog-description"
      BackdropComponent={Backdrop}
      BackdropProps={styles.backdrop}
      PaperProps={{
        sx: styles.dialogPaper,
      }}
    >
      <DialogTitle id="chat-confirm-dialog-title" sx={styles.dialogTitle}>
        {t("clientiSubMenu.chatConfirmTitle")}
      </DialogTitle>
      <DialogContent sx={styles.dialogContent}>
        <DialogContentText 
          id="chat-confirm-dialog-description"
          sx={styles.dialogContentText}
        >
          {t("clientiSubMenu.chatConfirmMessage")}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={styles.cancelButton}
        >
          {t("clientiSubMenu.chatConfirmCancel")}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={styles.confirmButton}
          autoFocus
        >
          {t("clientiSubMenu.chatConfirmOk")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatRedirectConfirmDialog;
