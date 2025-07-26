import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, IconButton, Backdrop } from '@mui/material';
import DialogCloseIcon from '../icons/DialogCloseIcon2';

interface DietHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  htmlContent: string;
}

const DietHistoryDialog: React.FC<DietHistoryDialogProps> = ({
  open,
  onClose,
  title,
  htmlContent
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: {
            backgroundColor: 'rgba(33,33,33,0.8)',
            backdropFilter: 'blur(5px)',
          },
        },
      }}
      PaperProps={{
        sx: {
          maxHeight: '80vh',
          borderRadius: 4,
          boxShadow: 8,
          px: 4,
          py: 2,
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1, mb: 0 }}>
        <IconButton onClick={onClose} sx={{ p: 1 }}>
          <DialogCloseIcon />
        </IconButton>
      </Box>
      <DialogTitle sx={{ fontWeight: 600, fontSize: 18, pt: 0 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            '& p': { margin: '8px 0' },
            '& ul, & ol': { paddingLeft: '20px' },
            '& li': { margin: '4px 0' },
            '& h1, & h2, & h3, & h4, & h5, & h6': { margin: '12px 0 8px 0' },
            minHeight: 100,
            fontSize: 14,
            lineHeight: 1.6,
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DietHistoryDialog;
