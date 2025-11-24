import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  InputBase,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMessages } from '../Context/MessagesContext';
import { handleApiError } from '../utils/errorUtils';
import { useSnackbar } from '../Context/SnackbarContext';

const styles = {
  backdrop: {
    timeout: 300,
    sx: {
      backgroundColor: 'rgba(33,33,33,0.8)',
      backdropFilter: 'blur(5px)',
    },
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
  messageInput: {
    fontSize: 16,
    fontFamily: 'Montserrat, sans-serif',
    p: 2,
    border: '1px solid #e0e0e0',
    borderRadius: 2,
    background: '#f7f6f3',
    '&:focus-within': {
      borderColor: '#FFD600',
    },
  },
  sendButton: {
    background: 'linear-gradient(90deg, #E6BB4A 0%, #FFD600 100%)',
    color: '#fff',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    textTransform: 'none' as const,
    minWidth: 100,
    '&:hover': {
      background: 'linear-gradient(90deg, #d4a938 0%, #e6c400 100%)',
    },
    '&.Mui-disabled': {
      background: '#e0e0e0',
      color: '#999',
    },
  },
};

interface StartNewConversationDialogsProps {
  userId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const StartNewConversationDialogs: React.FC<StartNewConversationDialogsProps> = ({
  userId,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { sendTextMessage, fetchConversations } = useMessages();
  const { showSnackbar } = useSnackbar();
  const [showConfirmDialog, setShowConfirmDialog] = useState(true);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sendingNewMessage, setSendingNewMessage] = useState(false);

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setShowMessageDialog(false);
    setNewMessage('');
    onClose();
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    setShowMessageDialog(true);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId) return;
    setSendingNewMessage(true);
    try {
      await sendTextMessage(undefined, newMessage, userId);
      showSnackbar(t('chat.messageSent', 'Message sent successfully'), 'success');
      setShowMessageDialog(false);
      setNewMessage('');
      // Refresh conversations to show the new one
      await fetchConversations({ append: false });
      onSuccess?.();
      onClose();
    } catch (error) {
      handleApiError(error, showSnackbar, t);
    } finally {
      setSendingNewMessage(false);
    }
  };

  const handleMessageDialogClose = () => {
    setShowMessageDialog(false);
    setNewMessage('');
    onClose();
  };

  return (
    <>
      {/* Confirmation dialog */}
      <Dialog
        open={showConfirmDialog && userId !== null}
        onClose={handleCancel}
        PaperProps={{ sx: styles.dialogPaper }}
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: styles.backdrop }}
      >
        <DialogTitle sx={styles.dialogTitle}>
          {t('chat.noConversationFound', 'No conversation found')}
        </DialogTitle>
        <DialogContent>
          <Typography sx={styles.dialogContent}>
            {t('chat.startNewConversationPrompt', 'Cannot find a conversation with this user. Do you want to start a new conversation?')}
          </Typography>
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button onClick={handleCancel} sx={styles.cancelButton}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleConfirm} variant="contained" sx={styles.confirmButton}>
            {t('common.yes', 'Yes')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message dialog */}
      <Dialog
        open={showMessageDialog && userId !== null}
        onClose={handleMessageDialogClose}
        PaperProps={{ sx: styles.dialogPaper }}
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: styles.backdrop }}
      >
        <DialogTitle sx={styles.dialogTitle}>
          {t('chat.sendNewMessage', 'Send New Message')}
        </DialogTitle>
        <DialogContent>
          <InputBase
            placeholder={t('chat.typePlaceholder', 'Type your message...')}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            multiline
            rows={4}
            fullWidth
            sx={styles.messageInput}
            inputProps={{ maxLength: 1000 }}
          />
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button
            onClick={handleMessageDialogClose}
            sx={styles.cancelButton}
            disabled={sendingNewMessage}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={sendingNewMessage || !newMessage.trim()}
            sx={styles.sendButton}
          >
            {sendingNewMessage ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : (
              t('common.send', 'Send')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StartNewConversationDialogs;