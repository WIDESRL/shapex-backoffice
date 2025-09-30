import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Fade,
  Backdrop,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProductType } from '../../Context/ProductsContext';
import DialogCloseIcon from '../../icons/DialogCloseIcon2';

interface ProductTypeFormDialogProps {
  open: boolean;
  formData: Omit<ProductType, 'id'>;
  errors: {
    name: string;
    description: string;
  };
  onClose: () => void;
  onSubmit: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editMode: boolean;
}

const styles = {
  dialog: {
    borderRadius: 4,
    boxShadow: 8,
    px: 4,
    py: 2,
    background: '#fff',
    minWidth: 400,
    fontSize: 16,
  },
  backdrop: {
    timeout: 300,
    sx: {
      backgroundColor: 'rgba(33,33,33,0.8)',
      backdropFilter: 'blur(5px)',
    },
  },
  closeButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    mt: 1,
    mb: 0,
  },
  closeButton: {
    color: '#888',
    background: 'transparent',
    boxShadow: 'none',
    '&:hover': { background: 'rgba(0,0,0,0.04)' },
    mr: '-8px',
    mt: '-8px',
  },
  dialogTitle: {
    fontSize: 32,
    fontWeight: 400,
    textAlign: 'left',
    pb: 0,
    pt: 0,
    position: 'relative',
    letterSpacing: 0.5,
    fontFamily: 'Montserrat, sans-serif',
    color: '#616160',
  },
  dialogContent: {
    pt: 2,
    pb: 0,
    fontSize: 15,
    '& .MuiTypography-root, & .MuiInputBase-root, & .MuiButton-root': {
      fontSize: 15,
    },
    '& .MuiDialogTitle-root': {
      fontSize: 28,
    },
    '&::-webkit-scrollbar': {
      width: '6px',
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#e0e0e0',
      borderRadius: '6px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#bdbdbd',
    },
    scrollbarWidth: 'thin',
    scrollbarColor: '#e0e0e0 transparent',
  },
  textFieldInput: {
    borderRadius: 2,
    fontSize: 18,
  },
  dialogActions: {
    px: 4,
    pb: 3,
    pt: 2,
  },
  submitButton: {
    background: '#E6BB4A',
    color: '#fff',
    borderRadius: 2,
    fontWeight: 500,
    fontSize: 24,
    py: 0,
    minHeight: 40,
    height: 40,
    boxShadow: 1,
    letterSpacing: 1,
    fontFamily: 'Montserrat, sans-serif',
    textTransform: 'none' as const,
    '&:hover': { background: '#E6BB4A' },
  },
};

const ProductTypeFormDialog: React.FC<ProductTypeFormDialogProps> = ({
  open,
  formData,
  errors,
  onClose,
  onSubmit,
  onInputChange,
  editMode,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: styles.dialog }}
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: styles.backdrop }}
      TransitionComponent={Fade}
    >
      {/* Close icon row above the title */}
      <Box sx={styles.closeButtonContainer}>
        <IconButton
          onClick={onClose}
          sx={styles.closeButton}
          size="large"
        >
          <DialogCloseIcon style={{ fontSize: 32 }} />
        </IconButton>
      </Box>
      <DialogTitle sx={styles.dialogTitle}>
        {editMode ? t('products.types.editType') : t('products.types.addType')}
      </DialogTitle>

      <DialogContent sx={styles.dialogContent}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Name */}
          <TextField
            label={t('products.types.typeName')}
            name="name"
            value={formData.name}
            onChange={onInputChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            margin="normal"
            InputProps={{ sx: styles.textFieldInput }}
          />

          {/* Description */}
          <TextField
            label={t('products.types.typeDescription')}
            name="description"
            value={formData.description}
            onChange={onInputChange}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            InputProps={{ sx: styles.textFieldInput }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={styles.dialogActions}>
        <Button
          onClick={onSubmit}
          variant="contained"
          fullWidth
          sx={styles.submitButton}
        >
          {editMode ? t('products.types.save') : t('products.types.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductTypeFormDialog;