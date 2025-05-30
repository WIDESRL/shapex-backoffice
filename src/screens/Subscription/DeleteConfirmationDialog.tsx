import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Backdrop, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ open, onClose, onConfirm, title, description }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 8,
          px: 4,
          py: 3,
          background: '#fff',
          minWidth: 340,
          fontFamily: 'Montserrat, sans-serif',
        },
      }}
            slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: {
            backgroundColor: 'rgba(33,33,33,0.8)',
            backdropFilter: 'blur(5px)', // add blur effect
          },
        },
      }}
      TransitionComponent={Fade}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 400,
          fontSize: 18,
          color: '#444',
          pb: 4,
          pt: 4,
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          textAlign: 'center',
          fontSize: 15,
          color: '#888',
          fontFamily: 'Montserrat, sans-serif',
          pb: 2,
        }}
      >
        <Typography sx={{ fontSize: 14, color: '#b0b0b0', fontFamily: 'Montserrat, sans-serif' }}>
          {description}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            minWidth: 140,
            borderRadius: 2,
            fontWeight: 400,
            fontSize: 15, // Lower font size
            color: '#444',
            borderColor: '#bdbdbd',
            background: '#fff',
            fontFamily: 'Montserrat, sans-serif',
            '&:hover': { background: '#f5f5f5', borderColor: '#bdbdbd' },
          }}
        >
          {t('subscriptions.cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            minWidth: 140,
            borderRadius: 2,
            fontWeight: 400,
            fontSize: 15, // Lower font size
            color: '#fff',
            background: '#616160',
            fontFamily: 'Montserrat, sans-serif',
            boxShadow: 'none',
            '&:hover': { background: '#444' },
          }}
        >
          {t('subscriptions.confirm') || 'Conferma'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
